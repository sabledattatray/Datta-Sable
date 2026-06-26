import { NextResponse } from 'next/server';
import { posts as staticPosts } from '@/app/blog/data';
import { prisma } from '@/lib/prisma';

const BASE_URL = 'https://dattasable.com';
const PUBLICATION_NAME = 'Datta Sable';
const PUBLICATION_LANG = 'en';
const DAYS_WINDOW = 30;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isPlaceholderPost(content: string): boolean {
  if (!content) return true;
  return content.includes('In the rapidly evolving world of digital infrastructure and technology');
}

export async function GET() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - DAYS_WINDOW);

  // Fetch DB posts — filter placeholders
  const dbPosts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, title: true, category: true, updatedAt: true, createdAt: true, content: true },
    orderBy: { updatedAt: 'desc' },
  }).catch(() => []);

  // Merge with static posts
  const allPosts = [
    ...dbPosts
      .filter(p => !isPlaceholderPost(p.content || ''))
      .map(p => ({
        slug: p.slug,
        title: p.title,
        category: p.category || 'Technology',
        date: p.updatedAt,
      })),
    ...staticPosts
      .filter(p => !isPlaceholderPost(p.content || ''))
      .map(p => ({
        slug: p.slug,
        title: p.title,
        category: (p as any).category || 'Technology',
        date: new Date((p as any).date || '2026-06-25'),
      })),
  ];

  // De-duplicate + filter to recent posts only
  const seen = new Set<string>();
  const recentPosts = allPosts
    .filter(p => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return p.date >= cutoff;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 1000); // Google News hard limit

  const xmlEntries = recentPosts.map(post => {
    const pageUrl = `${BASE_URL}/blog/${post.slug}`;
    const pubDate = post.date.toISOString();
    const title = escapeXml(post.title);
    const keywords = escapeXml(`${post.category}, Data Analytics, Business Intelligence, Datta Sable`);

    return `  <url>
    <loc>${pageUrl}</loc>
    <news:news>
      <news:publication>
        <news:name>${PUBLICATION_NAME}</news:name>
        <news:language>${PUBLICATION_LANG}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
      <news:keywords>${keywords}</news:keywords>
    </news:news>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${xmlEntries.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
    },
  });
}
