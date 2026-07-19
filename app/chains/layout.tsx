import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function ChainsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
