import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    '<sitemap><loc>https://dattasable.com/sitemap.xml</loc></sitemap>' +
    '<sitemap><loc>https://dattasable.com/image-sitemap.xml</loc></sitemap>' +
    '</sitemapindex>', { headers: { 'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600' } });
}
