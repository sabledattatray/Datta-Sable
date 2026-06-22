/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75],
    minimumCacheTTL: 31536000,
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  transpilePackages: ['html-encoding-sniffer', '@exodus/bytes'],
  async redirects() {
    return [
      {
        source: '/fabric-roadmap',
        destination: '/blog/microsoft-fabric-career-roadmap-2026',
        statusCode: 301,
      },
      {
        source: '/fabric2026',
        destination: '/blog/free-microsoft-certifications-fabric-data-days-2026',
        statusCode: 301,
      },
      {
        source: '/blog/python-engineering-2026',
        destination: '/blog/scaling-the-forge-python-data-engineering',
        permanent: true,
      },
      {
        source: '/what-is-seo-in-digital-marketing-and-how-does-it-work-for-beginners',
        destination: '/blog/what-is-seo-digital-marketing-guide',
        permanent: true,
      },
      {
        source: '/7-best-seo-tools-in-2025',
        destination: '/blog/7-best-seo-tools-2025',
        permanent: true,
      },
      {
        source: '/top-5-free-tools-every-content-creator-should-be-using-in-2025',
        destination: '/blog/top-5-free-content-creator-tools-2025',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/blog-post',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/portfolio-item',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/live-dashboard',
        destination: '/analytics-live',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // ads.txt must be accessible to Google AdSense crawlers at all times.
        // Short cache so updates (new ad networks) propagate within 24h.
        source: '/ads.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
      },
      {
        source: '/(.*\.webp|.*\.avif|.*\.svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
