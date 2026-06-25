import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all bots to crawl all public content
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/', '/preview', '/lp/'],
      },
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
        // Googlebot main crawler — explicit allow for all blog/content
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/', '/preview'],
      },
    ],
    sitemap: 'https://dattasable.com/sitemap.xml',
  };
}
