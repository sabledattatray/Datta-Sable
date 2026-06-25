import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: "Sales Pipeline Velocity Showcase" },
  description: "A high-fidelity B2B revenue analytics showcase. Interactive sales pipeline modeling and forecasting by Datta Sable.",
  openGraph: {
    title: "Sales Pipeline Velocity (Technical Showcase)",
    description: "Interactive B2B sales pipeline infrastructure showcase. Real-time deal tracking and quarterly forecasting simulations.",
    images: ["/images/dashboards/sales_pipeline_preview.webp"],
    url: "https://dattasable.com/dashboards/sales-pipeline",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sales Pipeline Velocity (Technical Showcase)",
    images: ["/images/dashboards/sales_pipeline_preview.webp"],
  },
  alternates: {
    canonical: "/dashboards/sales-pipeline",
  },
};

export default function SalesPipelineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
