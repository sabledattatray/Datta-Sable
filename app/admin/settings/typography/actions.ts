'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';
import { logAudit } from '@/lib/security';
import { parseTypography, TYPOGRAPHY_KEY, TYPOGRAPHY_TAG } from '@/lib/site-typography';

export async function saveWebsiteTypography(input: unknown, revision: string | null) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string } | undefined)?.role !== 'ADMIN') return { error: 'Administrator access required.' };
  const settings = parseTypography(input);
  if (!settings) return { error: 'Some typography values are invalid. Check the font, size, weight, and colors.' };
  if (revision !== null && (typeof revision !== 'string' || !/^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(revision) || !Number.isFinite(Date.parse(revision)))) {
    return { error: 'Invalid settings revision. Reload this page and try again.' };
  }
  const conflict = { error: 'These settings changed in another session. Reload the page before saving again.' };
  const value = JSON.stringify(settings);
  let updatedAt: Date;
  try {
    if (revision === null) {
      const record = await prisma.systemSetting.create({ data: { key: TYPOGRAPHY_KEY, value } });
      updatedAt = record.updatedAt;
    } else {
      // Compare and swap prevents one editor silently overwriting another.
      updatedAt = new Date(Math.max(Date.now(), Date.parse(revision) + 1));
      const result = await prisma.systemSetting.updateMany({
        where: { key: TYPOGRAPHY_KEY, updatedAt: new Date(revision) }, data: { value, updatedAt },
      });
      if (result.count !== 1) return conflict;
    }
  } catch (error) {
    if ((error as { code?: string }).code === 'P2002') return conflict;
    console.error('Website typography save failed.');
    return { error: 'Could not save to the database. Your changes are still in the editor; please try again.' };
  }
  revalidateTag(TYPOGRAPHY_TAG);
  revalidatePath('/', 'layout');
  await logAudit({ userId: (session?.user as { id?: string })?.id, action: 'UPDATE_WEBSITE_TYPOGRAPHY', status: 'SUCCESS', details: 'Published website typography settings.' });
  return { success: true, revision: updatedAt.toISOString(), settings };
}
