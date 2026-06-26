import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all crawlers to index all public content
        // /lp/ is intentionally NOT blocked so SEO landing pages can rank
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboards/', '/admin/', '/preview', '/tools/workspace'],
      },

      // ── Google crawlers ───────────────────────────────────────────────
      {
        // Google AdSense content crawler — must be able to see all pages
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
      {
        // Google Display Ads bot
        userAgent: 'Google-Display-Ads-Bot',
        allow: '/',
      },
      {
        // AdSense desktop crawler
        userAgent: 'AdsBot-Google',
        allow: '/',
      },
      {
        // AdSense mobile crawler — REQUIRED for AdSense approval
        userAgent: 'AdsBot-Google-Mobile',
        allow: '/',
      },
      {
        // Google image indexing bot
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        // Bingbot — explicit allow ensures Bing indexes all public content
        userAgent: 'Bingbot',
        allow: '/',
      },

      // ── AI crawlers ───────────────────────────────────────────────────
      // Explicitly allowing AI crawlers increases discoverability of
      // technical content (Fabric, Power BI, SQL, AI) in AI-powered search.
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'Applebot',
        allow: '/',
      },
    ],
    sitemap: [
      'https://dattasable.com/sitemap.xml',
      'https://dattasable.com/image-sitemap.xml',
      'https://dattasable.com/news-sitemap.xml',
      // Add once you publish video content with a valid video sitemap:
      // 'https://dattasable.com/video-sitemap.xml',
    ],
  };
}
