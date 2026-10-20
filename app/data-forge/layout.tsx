import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "Synthetic Data Forge PRO | Datta Sable",
  description: "Professional-grade synthetic data generator. Create high-fidelity datasets for BFSI, Healthcare, Retail, and Supply Chain testing.",
  keywords: [
    "Synthetic Data Generator",
    "Data Forge PRO",
    "Mock Data Generation",
    "BFSI Synthetic Data",
    "Healthcare Data Forge",
    "Retail Dataset Generator",
    "Dynamic Data Schema",
    "Data Engineering Tools",
    "Datta Sable Tools"
  ],
  openGraph: {
    title: "Synthetic Data Forge PRO | Datta Sable",
    description: "Generate professional synthetic datasets in seconds. Industry-standard schemas for BFSI, Health, and more.",
    images: ["/images/dashboards/fleet_logistics.webp"],
  }
};

export default function DataForgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
