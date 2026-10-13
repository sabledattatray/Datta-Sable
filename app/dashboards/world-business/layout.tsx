import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: "World Business Intelligence (3M Records) | Datta Sable" },
  description: "Enterprise-grade Business Intelligence Cockpit analyzing 3,000,000 global transactions ($18.72B GMV) across 50 sovereign nations. Built by Datta Sable.",
  openGraph: {
    title: "World Business Intelligence (3M Global Transactions) | Datta Sable",
    description: "Enterprise Big-Data Dashboard: DuckDB-accelerated processing of 3,000,000 records, real-time analytics, and interactive global transaction ledger.",
    images: ["/images/dashboards/world_business_intelligence.webp"],
    url: "https://dattasable.com/dashboards/world-business",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Business Intelligence (3M Records) | Datta Sable",
    description: "Big Data BI Showcase: 3M transactions, $18.72B GMV, DuckDB analytics engine.",
    images: ["/images/dashboards/world_business_intelligence.webp"],
  },
  alternates: {
    canonical: "/dashboards/world-business",
  },
};

export default function WorldBusinessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
