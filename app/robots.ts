import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/', '/preview'],
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
      {
        userAgent: 'Google-Display-Ads-Bot',
        allow: '/',
      },
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
      }
    ],
    sitemap: 'https://dattasable.com/sitemap.xml',
  };
}
