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
  const pathname = headerList.get('x-pathname') || '/';
  const cleanPathname = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const canonicalUrl = `https://dattasable.com${cleanPathname}`;

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="google-adsense-account" content={formattedAdsenseId} />
        <link rel="canonical" href={canonicalUrl} />

        <Script
          nonce={nonce}
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Surgical AI Workspace | Datta Sable",
                "url": "https://dattasable.com",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://dattasable.com/blog?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "https://dattasable.com/#person",
                "name": "Datta Sable",
                "url": "https://dattasable.com",
                "jobTitle": "Business Intelligence Expert & Data Strategy Consultant",
                "description": "Premier Business Intelligence Expert and Data Strategy Consultant in India. Specializing in Tableau, Power BI, SQL automation, Python data engineering, and custom reporting solutions.",
                "knowsAbout": ["Business Intelligence", "Data Analytics", "SQL Automation", "Python Data Engineering", "Power BI", "Tableau", "Data Strategy", "Microsoft Fabric"],
                "sameAs": [
                  "https://linkedin.com/in/dattasable",
                  "https://github.com/sabledattatray",
                  "https://x.com/sabledattatray",
                  "https://dev.to/dattasable"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "ProfessionalService",
                "@id": "https://dattasable.com/#service",
                "name": "Datta Sable BI & Analytics Consulting",
                "url": "https://dattasable.com",
                "logo": "https://dattasable.com/favicon.svg",
                "image": "https://dattasable.com/images/datta.webp",
                "description": "Independent Business Intelligence and Data Strategy consulting practice operated by Datta Sable in Mumbai, India. Providing custom dashboard development, SQL automation, and Python ETL pipelines.",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Mumbai",
                  "addressRegion": "Maharashtra",
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
                "founder": {
                  "@id": "https://dattasable.com/#person"
                },
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
        <link rel="dns-prefetch" href="https://ep1.adtrafficquality.google" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
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
