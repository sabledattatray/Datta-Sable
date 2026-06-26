import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { Viewport } from 'next';
import { Providers } from "@/components/Providers";
import { Suspense } from 'react';
import Script from 'next/script';
import ClientOnlyWrapper from "@/components/ClientOnlyWrapper";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";
import { headers } from 'next/headers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://dattasable.com'),
  title: {
    template: '%s | Datta Sable',
    default: 'Datta Sable — Content Creator, Web Developer & Digital Marketing',
  },
  description: "Datta Sable — Tutorials on AI tools, Next.js, SEO, WordPress, Power BI, and Digital Marketing. Practical guides for creators and developers who want to grow online.",
  keywords: [
    "Datta Sable",
    "AI Tutorials",
    "Next.js tutorials",
    "SEO guides",
    "Digital Marketing",
    "WordPress tutorials",
    "Power BI tutorials",
    "Web Development",
    "Content Creator",
    "Blogging tutorials",
    "Automation tutorials",
    "BI Dashboard"
  ],
  authors: [{ name: "Datta Sable" }],
  openGraph: {
    title: "Datta Sable — Content Creator, Web Developer & Digital Marketing",
    description: "Tutorials on AI tools, Next.js, SEO, WordPress, and Digital Marketing. Practical guides for creators and developers.",
    type: "website",
    images: [
      {
        url: "/images/dattasable.com.webp",
        width: 1200,
        height: 630,
        alt: "Datta Sable | Content Creator & Web Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Datta Sable — Content Creator, Web Developer & Digital Marketing",
    description: "Tutorials on AI tools, Next.js, SEO, WordPress, and Digital Marketing.",
    images: ["/images/dattasable.com.webp"],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  verification: {
    google: "XV8qSN_qy63Tsmx3naTd1yXZr5CbLhaT22Xsmhf5cAw",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-4242010382827250';
  const formattedAdsenseId = adsenseId.startsWith('ca-') ? adsenseId : `ca-${adsenseId}`;
  const headerList = await headers();
  const nonce = headerList.get('x-nonce') || undefined;

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="google-adsense-account" content={formattedAdsenseId} />
        {/* Critical font preloads — removes all 4 fonts from the blocking chain */}
        <link rel="preload" href="/fonts/syne-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/syne-latin-600-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/syne-latin-700-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/jetbrains-mono-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/jetbrains-mono-latin-600-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

        {/* ✅ Google AdSense Auto-Ads — required for AdSense crawlers to detect ad slots */}
        <Script
          id="adsense-auto-ads"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${formattedAdsenseId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <script
          nonce={nonce}
          id="json-ld"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": "https://dattasable.com/#website",
                "name": "Datta Sable",
                "url": "https://dattasable.com",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://dattasable.com/blog?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                },
                "publisher": { "@id": "https://dattasable.com/#organization" }
              },
              {
                // Canonical Person node — referenced by all blog post TechArticle schemas
                // via { "@id": "https://dattasable.com/#person" }
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "https://dattasable.com/#person",
                "name": "Datta Sable",
                "url": "https://dattasable.com",
                "image": "https://dattasable.com/images/author.webp",
                "jobTitle": "Business Intelligence Expert & Data Strategy Consultant",
                "description": "Senior BI Developer & Data Architect with over 10 years of experience. Specializing in Microsoft Fabric, Power BI, SQL, Python data engineering, and AI workflows.",
                "knowsAbout": ["Microsoft Fabric", "Power BI", "Business Intelligence", "Data Analytics", "SQL", "Python Data Engineering", "Data Strategy", "DP-600", "DP-700", "DP-800"],
                // Canonical sameAs — used consistently across all schema on this site
                "sameAs": [
                  "https://www.linkedin.com/in/dattasable/",
                  "https://github.com/sabledattatray",
                  "https://x.com/sabledattatray",
                  "https://dev.to/dattasable",
                  "https://community.fabric.microsoft.com/t5/user/viewprofilepage/user-id/1594798"
                ],
                "worksFor": { "@id": "https://dattasable.com/#organization" }
              },
              {
                // Organization node — enables Google logo rich results
                // Referenced by blog posts via { "@id": "https://dattasable.com/#organization" }
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": "https://dattasable.com/#organization",
                "name": "Datta Sable | BI & Analytics Consulting",
                "url": "https://dattasable.com",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://dattasable.com/favicon.svg",
                  "width": 512,
                  "height": 512
                },
                "image": "https://dattasable.com/images/dattasable.com.webp",
                "founder": { "@id": "https://dattasable.com/#person" },
                "sameAs": [
                  "https://www.linkedin.com/in/dattasable/",
                  "https://github.com/sabledattatray"
                ]
              },
              {
                // ProfessionalService — retained for local/consulting rich results
                "@context": "https://schema.org",
                "@type": "ProfessionalService",
                "@id": "https://dattasable.com/#service",
                "name": "Datta Sable BI & Analytics Consulting",
                "url": "https://dattasable.com",
                "logo": "https://dattasable.com/favicon.svg",
                "image": "https://dattasable.com/images/author.webp",
                "description": "Independent Business Intelligence and Data Strategy consulting practice operated by Datta Sable in Mumbai, India. Providing custom dashboard development, SQL automation, and Python ETL pipelines.",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Mumbai",
                  "addressLocality": "Mumbai",
                  "addressRegion": "Maharashtra",
                  "postalCode": "400001",
                  "addressCountry": "IN"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": "19.0760",
                  "longitude": "72.8777"
                },
                "telephone": "+918010803756",
                "email": "info@dattasable.com",
                "priceRange": "$$$",
                "founder": { "@id": "https://dattasable.com/#person" },
                "disambiguatingDescription": "Datta Sable is an independent Business Intelligence consulting practice and is not affiliated with, sponsored by, or related to the CodedThemes/AppSeed 'Datta Able' admin dashboard template."
              }
            ])
          }}
        />
        <script
          nonce={nonce}
          id="theme-init"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) theme = 'dark';
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* AdSense & Analytics — preconnect primary, dns-prefetch secondary */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ep1.adtrafficquality.google" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body suppressHydrationWarning style={{ background: 'var(--bg)' }}>
        <Providers>
          <ThemeProvider>
            <main id="main-content">
              {children}
            </main>
            <ClientOnlyWrapper />

            {/* High-Performance Third-Party Script Optimization */}
            <PerformanceOptimizer
              googleAnalyticsId="G-Q4GEY4N9WN"
              googleSignInClientId={process.env.GOOGLE_ID || ""}
            />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
