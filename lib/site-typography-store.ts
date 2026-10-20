import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { defaultTypography, parseStoredTypography, TYPOGRAPHY_KEY, TYPOGRAPHY_TAG } from './site-typography';

const readCachedTypography = unstable_cache(async () => {
  const record = await prisma.systemSetting.findUnique({ where: { key: TYPOGRAPHY_KEY } });
  return parseStoredTypography(record?.value) ?? defaultTypography();
}, ['website-typography-v1'], { tags: [TYPOGRAPHY_TAG], revalidate: 300 });

export async function getPublicTypography() {
  try { return await readCachedTypography(); }
  catch {
    // Do not cache database failures or break the public site when unavailable.
    console.warn('Website typography unavailable; using the original site styles.');
    return defaultTypography();
  }
}
