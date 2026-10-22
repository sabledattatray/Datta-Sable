'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { logAudit, rateLimit } from "@/lib/security";
import { passwordChangeInput } from '@/lib/admin/password-policy';

export async function updateAdminPassword(formData: unknown) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== 'ADMIN') {
    return { error: 'Unauthorized. Admin access required.' };
  }

  const input = passwordChangeInput.safeParse(formData);
  if (!input.success) return { error: input.error.issues[0].message };
  const { currentPassword, newPassword } = input.data;

  const userId = (session.user as any).id;

  if (!userId) {
    return { error: 'Invalid session: User ID missing. Please log out and log in again.' };
  }
  if (!rateLimit(`admin-password-change:${userId}`, 5)) return { error: 'Too many attempts. Please wait a minute.' };

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.role !== 'ADMIN') {
      return { error: 'User record not found in database. Please log out and log in again.' };
    }
    
    // If user has a password, verify the current one
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return { error: 'Current password is incorrect.' };
      }
    } else {
      return { error: 'This account uses social sign-in. Use email password recovery to set your first password.' };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction(async tx => {
      const changed = await tx.user.updateMany({
        where: { id: user.id, role: 'ADMIN', password: user.password, sessionVersion: user.sessionVersion },
        data: { password: hashedNewPassword, sessionVersion: { increment: 1 } },
      });
      if (changed.count !== 1) throw new Error('Password changed concurrently.');
      await tx.adminPasswordReset.updateMany({ where: { userId: user.id }, data: { attempts: 5, expiresAt: new Date(0) } });
    });

    await logAudit({
      userId: user.id,
      action: 'UPDATE_PASSWORD',
      status: 'SUCCESS',
      details: 'Admin updated their password'
    });

    return { success: 'Password updated. Please sign in again with your new password.' };
  } catch {
    console.error('Admin password update failed. Check database availability and migrations.');
    return { error: 'Could not update your password. Please try again shortly.' };
  }
}
