import type { Metadata } from 'next';
import SignInExperience from '@/components/SignInExperience';

export const metadata: Metadata = {
  title: 'Create your account',
  description: 'Create your Datta Sable account with email and password or social sign-in.',
  robots: { index: false, follow: false },
};

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  return <SignInExperience mode="sign-up" callbackUrl={callbackUrl} />;
}
