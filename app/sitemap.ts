import { MetadataRoute } from 'next';
import { getPublishedBlogPosts } from '@/lib/blog-posts';
import { EXCEL_PROJECTS } from '@/data/excelProjects';
import { productDetailsMap } from '@/lib/commerce/product-settings';
import { defaultProductDetails, productReadiness } from '@/lib/commerce/product-details';

// A build-time database fallback must never freeze an incomplete public sitemap.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dattasable.com';
  // Deliberately exclude noindex utility, preview, category and custom-page routes.
  const routes = ['', '/blog', '/blog/microsoft-fabric', '/about', '/portfolio',
    '/certification', '/services', '/services/consulting', '/services/dashboards',
    '/services/web-solutions', '/services/graphic-design', '/services/seo-optimization',
    '/services/automation', '/services/web-design', '/contact', '/start-here',
    '/dashboards', '/dashboards/world-business', '/dashboards/aura-capital-sales',
    '/dashboards/rider-ops', '/privacy', '/terms', '/disclaimer', '/cookies',
    '/editorial-policy', '/refund-policy', '/delivery-policy', '/knowledge', '/products'];
  const [posts, products] = await Promise.all([
    getPublishedBlogPosts(),
    import('@/lib/prisma').then(m => m.prisma.commerceProduct.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, slug: true, updatedAt: true, status: true, salesEnabled: true, deliveryReady: true, excerpt: true, resources: { where: { active: true }, select: { title: true } } },
    })).catch(() => []),
  ]);
  const details = await productDetailsMap(products.map(p => p.id)).catch(() => new Map());
  const indexableProducts = products.filter(p => productReadiness(p, details.get(p.id) || defaultProductDetails()) === 'READY_FOR_SALE');
  const urls: MetadataRoute.Sitemap = [
    ...routes.map(route => ({ url: baseUrl + route })),
    ...EXCEL_PROJECTS.map(project => ({ url: baseUrl + '/dashboards/' + project.slug })),
    ...indexableProducts.map(p => {
      const date = new Date(p.updatedAt);
      return {
        url: baseUrl + '/products/' + p.slug,
        ...(Number.isFinite(date.getTime()) && date.getTime() <= Date.now() ? { lastModified: date } : {}),
      };
    }),
    ...posts.map(post => {
      const date = new Date(post.updatedAt || post.date || post.createdAt || '');
      return { url: baseUrl + '/blog/' + post.slug,
        ...(Number.isFinite(date.getTime()) && date.getTime() <= Date.now() ? { lastModified: date } : {}) };
    }),
  ];
  // Omit invented baseline dates; lastmod must describe real content changes.
  return [...new Map(urls.map(item => [item.url, item])).values()];
}
