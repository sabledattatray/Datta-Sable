import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { defaultTypography, parseStoredTypography, TYPOGRAPHY_KEY, TYPOGRAPHY_TAG } from './site-typography';

const readCachedTypography = unstable_cache(async () => {
  try {
    const record = await prisma.systemSetting.findUnique({ where: { key: TYPOGRAPHY_KEY } });
    return parseStoredTypography(record?.value) ?? defaultTypography();
  } catch {
    // Handle an unavailable database inside the cache callback: Next logs rejected
    // background revalidations before the caller can catch them. Retry on expiry.
    return defaultTypography();
  }
}, ['website-typography-v1'], { tags: [TYPOGRAPHY_TAG], revalidate: 300 });

export async function getPublicTypography() {
  try { return await readCachedTypography(); }
  catch {
    // Cache infrastructure failures must not break public rendering either.
    return defaultTypography();
  }
}
