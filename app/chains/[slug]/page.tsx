import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CHAINS } from '@/data/chains';
import { notFound } from 'next/navigation';
import ChainExecutionClient from '@/components/ChainExecutionClient';
import { Metadata } from 'next';

export async function generateStaticParams() {
  return CHAINS.map((chain) => ({
    slug: chain.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const chain = CHAINS.find((c) => c.slug === slug);
  
  if (!chain) return { title: 'Chain Not Found' };
  
  // Holistic evaluation of indexability (word count, utility role, search intent)
  const wordCount = (chain.description || '').split(/\s+/).filter(Boolean).length;
  const isUtility = (chain as any).isUtility ?? true; // Defaults to true for interactive execution node utilities
  const hasUniqueValue = (chain as any).hasUniqueValue ?? false;
  const hasSearchIntent = (chain as any).hasSearchIntent ?? false;
  const isLandingPage = (chain as any).isLandingPage ?? false;
  
  const noindex = (chain as any).noindex === true || (
    isUtility && wordCount < 200 && !isLandingPage && !hasSearchIntent
  );
  
  return {
    title: `${chain.title} | Execution Chain`,
    description: chain.description,
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ChainExecutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chain = CHAINS.find((c) => c.slug === slug);

  if (!chain) notFound();

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <ChainExecutionClient chain={chain} />
      <Footer />
    </div>
  );
}
