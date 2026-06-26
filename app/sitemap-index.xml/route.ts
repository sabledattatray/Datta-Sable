import { NextResponse } from 'next/server';

const BASE_URL = 'https://dattasable.com';

export async function GET() {
  const now = new Date().toISOString();

  // Future: split sitemap.xml into per-section child sitemaps as URL count grows:
  //   sitemap-pages.xml   — static pages (home, about, services, tools…)
  //   sitemap-blog.xml    — blog posts (DB + static)
  //   sitemap-tools.xml   — tool pages
  //   sitemap-dashboards.xml
  //   sitemap-glossary.xml
  //   sitemap-categories.xml
  // This makes Search Console easier to analyse per content type.

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/image-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <!-- Add when publishing Fabric / Power BI / SQL video tutorials:
  <sitemap>
    <loc>${BASE_URL}/video-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  -->
  <sitemap>
    <loc>${BASE_URL}/news-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
