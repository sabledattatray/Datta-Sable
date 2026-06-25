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

// Extracts title from HTML for image caption
function extractTitle(title: string): string {
  return title.replace(/[<>&"']/g, ' ').trim();
}

export async function GET() {
  // Get DB posts
  const dbPosts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, title: true, image: true, content: true, updatedAt: true },
  }).catch(() => []);

  // Merge static + db posts
  const allPosts = [
    ...staticPosts.map(p => ({
      slug: p.slug,
      title: p.title,
      image: (p as any).image || null,
      content: p.content || '',
      updatedAt: new Date((p as any).date || '2026-06-25'),
    })),
    ...dbPosts.map(p => ({
      slug: p.slug,
      title: p.title,
      image: p.image || null,
      content: p.content || '',
      updatedAt: p.updatedAt,
    })),
  ];

  // De-duplicate by slug
  const seen = new Set<string>();
  const uniquePosts = allPosts.filter(p => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

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
