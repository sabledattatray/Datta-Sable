import type { Metadata } from 'next';
import SignInExperience from '@/components/SignInExperience';

export const metadata: Metadata = {
  title: 'Create your account',
  description: 'Create your Datta Sable account with Google, GitHub, or LinkedIn.',
  robots: { index: false, follow: false },
};

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  return <SignInExperience mode="sign-up" callbackUrl={callbackUrl} />;
}
