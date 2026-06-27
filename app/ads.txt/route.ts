import { NextResponse } from 'next/server';

export async function GET() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'pub-4242010382827250';
  
  // Strip 'ca-' prefix if present, as ads.txt format requires just 'pub-XXXXXXXXXXXXXXXX'
  const cleanAdsenseId = adsenseId.startsWith('ca-') ? adsenseId.substring(3) : adsenseId;
  
  const content = `google.com, ${cleanAdsenseId}, DIRECT, f08c47fec0942fa0\n`;
  
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
