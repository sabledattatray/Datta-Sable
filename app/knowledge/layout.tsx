import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
