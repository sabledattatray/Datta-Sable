import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { defaultTypography, parseStoredTypography, TYPOGRAPHY_KEY } from '@/lib/site-typography';
import TypographyEditor from './TypographyEditor';

export default async function WebsiteTypographyPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string } | undefined)?.role !== 'ADMIN') return <p>Administrator access required.</p>;
  try {
    const record = await prisma.systemSetting.findUnique({ where: { key: TYPOGRAPHY_KEY } });
    const settings = record ? parseStoredTypography(record.value) : defaultTypography();
    if (!settings) return <TypographyEditor initialSettings={defaultTypography()} revision={record?.updatedAt.toISOString() ?? null} notice="The stored settings are invalid. The site is using its original styles. You can publish corrected settings below." />;
    return <TypographyEditor initialSettings={settings} revision={record?.updatedAt.toISOString() ?? null} />;
  } catch {
    // A full document reload is intentional: retry the server/database read.
    /* eslint-disable @next/next/no-html-link-for-pages */
    return <div style={{ padding: 32 }}><h1>Website Typography</h1><p role="alert">Could not load the saved settings from the database. Reload this page to try again. Publishing is unavailable until the saved settings can be loaded.</p><a href="/admin/settings/typography">Retry loading settings</a></div>;
  }
}
