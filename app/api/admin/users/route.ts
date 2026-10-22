import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      include: {
        accounts: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const subscribers = await prisma.subscriber.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      users: users.map(u => ({
        id: u.id,
        name: u.name || 'Anonymous',
        email: u.email,
        image: u.image,
        role: u.role,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
        provider: u.accounts.length > 0 ? u.accounts[0].provider : (!u.password ? 'google' : 'local')
      })),
      subscribers
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { id, name, email, role } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: { accounts: true }
    });

    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    // Role validation
    if (role && role !== 'USER' && role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Role must be either USER or ADMIN.' }, { status: 400 });
    }

    // Guard: Prevent demoting the last remaining admin
    if (targetUser.role === 'ADMIN' && role === 'USER') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        return NextResponse.json({
          success: false,
          error: 'Cannot demote the only remaining administrator account.'
        }, { status: 400 });
      }
    }

    // Email validation & uniqueness check
    const trimmedEmail = typeof email === 'string' ? email.trim().toLowerCase() : targetUser.email;
    if (trimmedEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return NextResponse.json({ success: false, error: 'Please provide a valid email address.' }, { status: 400 });
      }

      if (trimmedEmail !== targetUser.email?.toLowerCase()) {
        const existingWithEmail = await prisma.user.findFirst({
          where: {
            email: trimmedEmail,
            id: { not: id }
          }
        });
        if (existingWithEmail) {
          return NextResponse.json({
            success: false,
            error: 'Another account with this email address already exists.'
          }, { status: 400 });
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: typeof name === 'string' ? (name.trim() || null) : targetUser.name,
        email: trimmedEmail,
        role: role || targetUser.role
      },
      include: {
        accounts: true
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name || 'Anonymous',
        email: updatedUser.email,
        image: updatedUser.image,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        lastLoginAt: updatedUser.lastLoginAt,
        provider: updatedUser.accounts.length > 0 ? updatedUser.accounts[0].provider : (!updatedUser.password ? 'google' : 'local')
      }
    });
  } catch (error: any) {
    console.error('Error updating user in admin users API:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to update user'
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { type, id } = await req.json();

    if (!id || !type) {
      return NextResponse.json({ success: false, error: 'Missing parameters.' }, { status: 400 });
    }

    if (type === 'subscriber') {
      const targetSubscriber = await prisma.subscriber.findUnique({ where: { id } });
      if (!targetSubscriber) {
        return NextResponse.json({ success: false, error: 'Subscriber record not found.' }, { status: 404 });
      }
      await prisma.subscriber.delete({ where: { id } });
    } else if (type === 'user') {
      const currentUserId = (session.user as any)?.id;
      const currentUserEmail = session.user?.email;

      const targetUser = await prisma.user.findUnique({ where: { id } });
      if (!targetUser) {
        return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
      }

      // Prevent deleting self
      if (
        (currentUserId && targetUser.id === currentUserId) ||
        (currentUserEmail && targetUser.email && targetUser.email.toLowerCase() === currentUserEmail.toLowerCase())
      ) {
        return NextResponse.json({
          success: false,
          error: 'You cannot delete your own active administrator account.'
        }, { status: 400 });
      }

      // Check if target is admin, and prevent deleting if it's the only admin
      if (targetUser.role === 'ADMIN') {
        const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
        if (adminCount <= 1) {
          return NextResponse.json({
            success: false,
            error: 'Cannot delete the only remaining administrator account.'
          }, { status: 400 });
        }
      }

      // Safely cleanup relations in transaction to avoid any foreign key constraint violations
      await prisma.$transaction(async (tx) => {
        // Unlink commerce orders so historical order data remains intact with null user
        await tx.commerceOrder.updateMany({
          where: { userId: id },
          data: { userId: null }
        });

        // Clean up password reset tokens
        await tx.adminPasswordReset.deleteMany({
          where: { userId: id }
        });

        // Clean up linked OAuth provider accounts
        await tx.account.deleteMany({
          where: { userId: id }
        });

        // Clean up active sessions
        await tx.session.deleteMany({
          where: { userId: id }
        });

        // Delete the user record
        await tx.user.delete({
          where: { id }
        });
      });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid delete target type.' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting target in admin users:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to delete record'
    }, { status: 500 });
  }
}

