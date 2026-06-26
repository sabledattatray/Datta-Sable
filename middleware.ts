import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Early return for standard SEO-critical files
  if (['/ads.txt', '/robots.txt', '/sitemap.xml'].includes(path)) {
    return NextResponse.next();
  }

  const userAgent = request.headers.get('user-agent') || '';
  const lowerPath = path.toLowerCase();
  
  // Exclude static assets from middleware checks if they bypass matcher configuration
  const isStaticAsset = !!lowerPath.match(/\.(png|jpg|jpeg|webp|gif|svg|ico|css|js|woff2?)$/i);

  // Friendly crawlers and social media bots
  const isFriendlyBot = /google|bing|yahoo|duckduck|baidu|yandex|linkedin|twitter|facebook|slack|discord|apple|pinterest|whatsapp|telegram|ahrefs|semrush|openai|claudebot/i.test(userAgent);

  // Malicious or aggressive scraping/vulnerability scanning tools (not using generic "bot" word to avoid false positives)
  // const suspiciousBots = /scrapy|headlesschrome|selenium|puppeteer|playwright|curl|postman|python|go-http|sqlmap|nikto|burp|metasploit|nmap|acunetix|wget|lynx|perl|php|libwww|apachebench|gobuster|dirbuster|mj12bot|dotbot|rogerbot|exabot|gigabot|siteexplorer|openlinkprofiler|spyonweb|petalbot|ia_archiver/i;

  // if (process.env.NODE_ENV === 'production' && suspiciousBots.test(userAgent) && !isFriendlyBot && !isStaticAsset) {
  //   return new NextResponse('Access Denied: Malicious traffic detected.', { status: 403 });
  // }

  // Safely generate a base64-encoded nonce without using Node.js Buffer (which causes ReferenceErrors in the Edge Runtime)
  const uuid = typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function'
    ? globalThis.crypto.randomUUID()
    : Array.from({ length: 4 }, () => Math.random().toString(36).substring(2, 10)).join('-');
  
  const nonce = typeof btoa !== 'undefined'
    ? btoa(uuid)
    : Buffer.from(uuid).toString('base64');
  
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('x-pathname', path);

  const isDev = process.env.NODE_ENV === 'development';
  const scriptCsp = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://*.tableau.com https://*.google.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google https://*.googleadservices.com https://*.googletagmanager.com;"
    : `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://cdnjs.cloudflare.com https://*.tableau.com https://*.google.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google https://*.googleadservices.com https://*.googletagmanager.com;`;

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 1. Content Security Policy (CSP)
  const cspHeader = `
    default-src 'self';
    connect-src 'self' https://*.google.com https://accounts.google.com https://*.tableau.com https://*.google-analytics.com https://*.adtrafficquality.google https://*.doubleclick.net https://*.google https://*.google.ad https://*.googlesyndication.com https://*.googleadservices.com;
    ${scriptCsp}
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://accounts.google.com https://*.google https://*.googlesyndication.com;
    img-src 'self' blob: data: https://*.public.blob.vercel-storage.com https://*.unsplash.com https://images.unsplash.com https://*.googleusercontent.com https://*.tableau.com https://lookerstudio.google.com https://datastudio.google.com https://*.google.com https://*.google-analytics.com https://*.googletagmanager.com https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google https://*.googleadservices.com;
    font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
    frame-src 'self' https://*.youtube.com https://*.youtube-nocookie.com https://*.tableau.com https://*.powerbi.com https://lookerstudio.google.com https://datastudio.google.com https://*.google.com https://*.doubleclick.net https://*.google.ad https://*.google https://*.adtrafficquality.google https://*.googlesyndication.com https://*.googleadservices.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  // 2. Clickjacking Prevention
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  // 3. MIME Sniffing Prevention
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // 4. Referrer Policy
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // 5. Strict Transport Security (HSTS) - Set to 2 Years for preload eligibility
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  // 6. Permissions Policy
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

  // 7. Modern Security Controls (COOP, CORP)
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.svg, ads.txt, robots.txt, sitemap.xml, images/assets.
     */
    '/((?!api/|_next/static/|_next/image/|favicon.ico|favicon.svg|ads.txt|robots.txt|sitemap.xml|.*\\.png|.*\\.jpg|.*\\.webp).*)',
  ],
};
