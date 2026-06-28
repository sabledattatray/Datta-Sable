import { prisma } from './prisma';

export async function getDynamicPage(slug: string) {
  try {
    const page = await prisma.page.findUnique({
      where: { slug }
    });
    if (page && page.published) {
      return page;
    }
  } catch (error) {
    console.error(`Failed to fetch dynamic page ${slug}:`, error);
  }
  return null;
}
