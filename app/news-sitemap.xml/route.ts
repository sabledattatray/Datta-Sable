import { NextResponse } from 'next/server';
import { getPublishedBlogPosts } from '@/lib/blog-posts';
import { escapeXml } from '@/lib/sitemap-xml';

// A build-time database fallback must never freeze an incomplete public sitemap.
export const dynamic = 'force-dynamic';

// Retain the endpoint for existing subscribers, but evergreen tutorials are not
// automatically news. Only explicitly classified news may enter this sitemap.
export async function GET() {
  const now = Date.now();
  const posts = await getPublishedBlogPosts();
  const entries = posts.filter(post => post.category.trim().toLowerCase() === 'news')
    .map(post => ({ post, published: new Date(post.date || post.createdAt || '') }))
    .filter(({ published }) => Number.isFinite(published.getTime()) &&
      published.getTime() <= now && published.getTime() >= now - 2 * 86400000)
    .slice(0, 1000).map(({ post, published }) =>
      '<url><loc>' + escapeXml('https://dattasable.com/blog/' + post.slug) + '</loc>' +
      '<news:news><news:publication><news:name>Datta Sable</news:name><news:language>en</news:language></news:publication>' +
      '<news:publication_date>' + published.toISOString() + '</news:publication_date>' +
      '<news:title>' + escapeXml(post.title) + '</news:title></news:news></url>').join('');
  return new NextResponse('<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">' +
    entries + '</urlset>', { headers: { 'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800' } });
}
