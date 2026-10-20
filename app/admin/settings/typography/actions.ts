'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';
import { logAudit } from '@/lib/security';
import { defaultTypography, parseStoredTypography, parseTypography, TYPOGRAPHY_KEY, TYPOGRAPHY_TAG } from '@/lib/site-typography';
import { segoeTypography, TYPOGRAPHY_DEFAULT_KEY } from '@/lib/site-typography-templates';

function validRevision(revision: unknown): revision is string | null {
  return revision === null || (typeof revision === 'string' && /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(revision) && Number.isFinite(Date.parse(revision)));
}

export async function saveWebsiteTypography(input: unknown, revision: string | null) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string } | undefined)?.role !== 'ADMIN') return { error: 'Administrator access required.' };
  const settings = parseTypography(input);
  if (!settings) return { error: 'Some typography values are invalid. Check the font, size, weight, and colors.' };
  if (!validRevision(revision)) {
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

export async function applyWebsiteTypographyTemplate(template: unknown, revision: string | null) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string } | undefined)?.role !== 'ADMIN') return { error: 'Administrator access required.' };
  if (template !== 'default' && template !== 'segoe') return { error: 'Choose a supported font template.' };
  if (!validRevision(revision)) return { error: 'Invalid settings revision. Reload this page and try again.' };
  let published;
  try {
    published = await prisma.$transaction(async tx => {
      const current = await tx.systemSetting.findUnique({ where: { key: TYPOGRAPHY_KEY } });
      if ((current?.updatedAt.toISOString() ?? null) !== revision) throw new Error('TYPOGRAPHY_CONFLICT');
      const previousDefault = await tx.systemSetting.findUnique({ where: { key: TYPOGRAPHY_DEFAULT_KEY } });
      const defaultSettings = previousDefault ? parseStoredTypography(previousDefault.value) : parseStoredTypography(current?.value) ?? defaultTypography();
      if (!defaultSettings) throw new Error('TYPOGRAPHY_INVALID_DEFAULT');
      const settings = template === 'segoe' ? segoeTypography() : defaultSettings;
      const value = JSON.stringify(settings);
      let updatedAt: Date;
      if (current) {
        updatedAt = new Date(Math.max(Date.now(), current.updatedAt.getTime() + 1));
        const result = await tx.systemSetting.updateMany({ where: { key: TYPOGRAPHY_KEY, updatedAt: current.updatedAt }, data: { value, updatedAt } });
        if (result.count !== 1) throw new Error('TYPOGRAPHY_CONFLICT');
      } else {
        const created = await tx.systemSetting.create({ data: { key: TYPOGRAPHY_KEY, value } });
        updatedAt = created.updatedAt;
      }
      // Save the restore point once, in the same transaction as publication.
      // Future template switches and manual edits never overwrite this snapshot.
      if (!previousDefault) await tx.systemSetting.create({ data: { key: TYPOGRAPHY_DEFAULT_KEY, value: JSON.stringify(defaultSettings) } });
      return { settings, defaultSettings, revision: updatedAt.toISOString() };
    });
  } catch (error) {
    if ((error as { code?: string }).code === 'P2002' || (error as Error).message === 'TYPOGRAPHY_CONFLICT') return { error: 'These settings changed in another session. Reload this page before applying a template.' };
    if ((error as Error).message === 'TYPOGRAPHY_INVALID_DEFAULT') return { error: 'The saved Default Font Template is invalid. No settings were changed.' };
    console.error('Font template publication failed.');
    return { error: 'Could not apply the template. Your published fonts and Default Font Template have not changed. Please try again.' };
  }
  revalidateTag(TYPOGRAPHY_TAG);
  revalidatePath('/', 'layout');
  await logAudit({ userId: (session?.user as { id?: string })?.id, action: 'APPLY_TYPOGRAPHY_TEMPLATE', status: 'SUCCESS', details: `Applied ${template === 'segoe' ? 'Segoe UI · Microsoft Style' : 'Default Font Template'}.` });
  return { success: true, ...published };
}
