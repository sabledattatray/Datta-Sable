import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Surgical AI Workspace (Interactive Prototype) | Datta Sable",
  description: "Enterprise-grade AI workflow infrastructure prototype. Monitor intelligent execution chains and automation fidelity simulations.",
  openGraph: {
    title: "Surgical AI Workspace (Interactive Prototype)",
    description: "Monitor live AI agent execution chains and optimize automation fidelity in this technical prototype.",
    images: ["/images/dashboards/surgical_ai_preview.webp"],
    url: "https://dattasable.com/dashboards/surgical-ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Surgical AI Workspace (Interactive Prototype)",
    images: ["/images/dashboards/surgical_ai_preview.webp"],
  },
  alternates: {
    canonical: "/dashboards/surgical-ai",
  },
};

export default function SurgicalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
