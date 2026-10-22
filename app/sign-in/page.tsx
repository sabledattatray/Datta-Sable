import type { Metadata } from 'next';
import SignInExperience from '@/components/SignInExperience';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Datta Sable account with Google, GitHub, or LinkedIn.',
  robots: { index: false, follow: false },
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  return <SignInExperience callbackUrl={callbackUrl} />;
}
