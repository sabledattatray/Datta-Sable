import { NextResponse } from 'next/server';
import { posts as staticPosts } from '@/app/blog/data';
import { prisma } from '@/lib/prisma';

const BASE_URL = 'https://dattasable.com';

// Extracts first image src from HTML content
function extractFirstImage(content: string): string | null {
  if (!content) return null;
  const match = content.match(/src=["']([^"']+\.(webp|jpg|jpeg|png|gif))["']/i);
  if (!match) return null;
  const src = match[1];
  if (src.startsWith('http')) return src;
  if (src.startsWith('/')) return `${BASE_URL}${src}`;
  return null;
}

function extractTitle(title: string): string {
  return title.replace(/[<>&"']/g, ' ').trim();
}

function isPlaceholderPost(content: string): boolean {
  if (!content) return true;
  return content.includes('In the rapidly evolving world of digital infrastructure and technology');
}

export async function GET() {
  // Get DB posts — filter placeholders
  const dbPosts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, title: true, image: true, content: true, updatedAt: true },
  }).catch(() => []);

  // Merge static + db posts, static first (db overrides via dedup)
  const allPosts = [
    ...staticPosts
      .filter(p => !isPlaceholderPost(p.content || ''))
      .map(p => ({
        slug: p.slug,
        title: p.title,
        image: (p as any).image || null,
        content: p.content || '',
        updatedAt: new Date((p as any).date || '2026-06-25'),
      })),
    ...dbPosts
      .filter(p => !isPlaceholderPost(p.content || ''))
      .map(p => ({
        slug: p.slug,
        title: p.title,
        image: p.image || null,
        content: p.content || '',
        updatedAt: p.updatedAt,
      })),
  ];

  // De-duplicate by slug (db version wins — it's later in the array)
  const seen = new Map<string, typeof allPosts[0]>();
  for (const post of allPosts) {
    seen.set(post.slug, post); // later entry overwrites — DB wins
  }
  const uniquePosts = Array.from(seen.values());

  const xmlEntries = uniquePosts.map(post => {
    // Use explicit image field first, then extract from content
    let imageUrl = post.image;
    if (!imageUrl || imageUrl.startsWith('https://images.unsplash.com')) {
      imageUrl = extractFirstImage(post.content);
    }
    if (!imageUrl) return null;

    // Ensure absolute URL
    if (!imageUrl.startsWith('http')) {
      imageUrl = `${BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }

    const pageUrl = `${BASE_URL}/blog/${post.slug}`;
    const title = extractTitle(post.title);
    const lastmod = post.updatedAt.toISOString().split('T')[0];

    return `  <url>
    <loc>${pageUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${title}</image:title>
      <image:caption>${title} | Datta Sable</image:caption>
    </image:image>
  </url>`;
  }).filter(Boolean);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlEntries.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
