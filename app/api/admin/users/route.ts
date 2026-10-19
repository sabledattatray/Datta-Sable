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
      await prisma.subscriber.delete({ where: { id } });
    } else if (type === 'user') {
      // Prevent deleting self
      const currentUserId = (session.user as any)?.id;
      const currentUserEmail = session.user?.email;

      const targetUser = await prisma.user.findUnique({ where: { id } });
      if (!targetUser) {
        return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
      }

      if (targetUser.id === currentUserId || (currentUserEmail && targetUser.email === currentUserEmail)) {
        return NextResponse.json({ success: false, error: 'You cannot delete your own active administrator account.' }, { status: 400 });
      }

      // Check if target is admin, and prevent deleting if it's the only admin
      if (targetUser.role === 'ADMIN') {
        const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
        if (adminCount <= 1) {
          return NextResponse.json({ success: false, error: 'Cannot delete the only remaining administrator account.' }, { status: 400 });
        }
      }

      await prisma.user.delete({ where: { id } });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid delete target type.' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting target in admin users:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete record' }, { status: 500 });
  }
}

