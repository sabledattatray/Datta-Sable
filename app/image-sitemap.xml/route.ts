import { NextResponse } from 'next/server';
import { getPublishedBlogPosts } from '@/lib/blog-posts';
import { escapeXml } from '@/lib/sitemap-xml';

// A build-time database fallback must never freeze an incomplete public sitemap.
export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://dattasable.com';
  const posts = await getPublishedBlogPosts();
  const entries = posts.map(post => {
    const image = post.image || post.content?.match(/src=["']([^"']+)["']/i)?.[1];
    if (!image) return '';
    let imageUrl: URL;
    try { imageUrl = new URL(image, baseUrl); } catch { return ''; }
    if (!['https:', 'http:'].includes(imageUrl.protocol)) return '';
    return '<url><loc>' + escapeXml(baseUrl + '/blog/' + post.slug) + '</loc>' +
      '<image:image><image:loc>' + escapeXml(imageUrl.href) + '</image:loc></image:image></url>';
  }).join('');
  return new NextResponse('<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' +
    entries + '</urlset>', { headers: { 'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600' } });
}
