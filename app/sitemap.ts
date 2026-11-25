import { flagshipProjects } from '@/app/portfolio/data';
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
    '/editorial-policy', '/refund-policy', '/delivery-policy', '/knowledge', '/products',
    '/tools/open-mis', '/tools/bi-roi-calculator', '/tools/mermaid-forge'];
  const [posts, products] = await Promise.all([
    getPublishedBlogPosts(),
    import('@/lib/prisma').then(m => m.prisma.commerceProduct.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, slug: true, updatedAt: true, status: true, salesEnabled: true, deliveryReady: true, excerpt: true, resources: { where: { active: true }, select: { title: true } } },
    })).catch(() => []),
  ]);
  const details = await productDetailsMap(products.map(p => p.id)).catch(() => new Map());
  const indexableProducts = products.filter(p => productReadiness(p, details.get(p.id) || defaultProductDetails()) === 'READY_FOR_SALE');
  const retiredOrRedirectedSlugs = new Set([
    'video-fabric-end-to-end',
    'video-sql-tuning-live',
    'data-mesh-adoption-trends-2026',
    'global-data-privacy-regulations-2026',
    'cdo-playbook-2026-strategy',
    'self-healing-etl-pipelines',
    'video-building-c-suite-dashboard',
    'gartner-magic-quadrant-2026-bi',
    'azure-data-factory-vs-microsoft-fabric-data-factory-2026-deep-dive',
    'power-bi-calculation-groups-enterprise-dax-architecture-performance-guide-2026',
    'microsoft-fabric-architecture-explained-complete-2026-guide',
    'dp-600-study-guide-2026-fabric-analytics-engineer',
    'microsoft-fabric-capacity-sizing-2026',
    'microsoft-fabric-governance-guide',
    'case-study-surgical-prompt-architecture-consistency',
    'surgical-prompt-architecture-framework',
  ]);
  const urls: MetadataRoute.Sitemap = [
    ...routes.map(route => ({ url: baseUrl + route })),
    ...flagshipProjects.map(project => ({ url: `${baseUrl}/portfolio/${project.flagship!.slug}` })),
    ...EXCEL_PROJECTS.map(project => ({ url: baseUrl + '/dashboards/' + project.slug })),
    ...indexableProducts.map(p => {
      const date = new Date(p.updatedAt);
      return {
        url: baseUrl + '/products/' + p.slug,
        ...(Number.isFinite(date.getTime()) && date.getTime() <= Date.now() ? { lastModified: date } : {}),
      };
    }),
    ...posts
      .filter(post => {
        if (retiredOrRedirectedSlugs.has(post.slug)) return false;
        if (post.content) {
          const words = post.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;
          if (words < 550) return false;
        }
        return true;
      })
      .map(post => {
        const date = new Date(post.updatedAt || post.date || post.createdAt || '');
        return { url: baseUrl + '/blog/' + post.slug,
          ...(Number.isFinite(date.getTime()) && date.getTime() <= Date.now() ? { lastModified: date } : {}) };
      }),
  ];
  if (typeof process !== 'undefined' && process.env.EBOOK_STORE_ENABLED === 'true') {
    try {
      const { prisma } = await import('@/lib/prisma');
      const [books, categories] = await Promise.all([
        prisma.commerceProduct.findMany({ where: { status: 'PUBLISHED', ebook: { isNot: null } }, select: { slug: true, updatedAt: true } }),
        prisma.ebookCategory.findMany({ where: { published: true, books: { some: { ebook: { product: { status: 'PUBLISHED' } } } } }, select: { slug: true } }),
      ]);
      urls.push({ url: baseUrl + '/ebooks' }, ...books.map(b => ({ url: `${baseUrl}/ebooks/${b.slug}`, lastModified: b.updatedAt })), ...categories.map(c => ({ url: `${baseUrl}/ebooks/category/${c.slug}` })));
    } catch { console.error('Ebook sitemap source unavailable.'); }
  }
  // Omit invented baseline dates; lastmod must describe real content changes.
  return [...new Map(urls.map(item => [item.url, item])).values()];
}
