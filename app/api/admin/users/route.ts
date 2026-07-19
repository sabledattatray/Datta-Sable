import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
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
        provider: u.accounts.length > 0 ? u.accounts[0].provider : 'local'
      })),
      subscribers
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { type, id } = await req.json();

    if (!id || !type) {
      return NextResponse.json({ success: false, error: 'Missing parameters.' }, { status: 400 });
    }

    if (type === 'subscriber') {
      await prisma.subscriber.delete({ where: { id } });
    } else if (type === 'user') {
      await prisma.user.delete({ where: { id } });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid delete target type.' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
