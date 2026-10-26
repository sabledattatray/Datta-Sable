import { notFound } from 'next/navigation';
import { ebookEnabled } from '@/lib/ebooks/validation';
import Shell from '@/components/ebooks/Shell';
import { Library } from '@/components/ebooks/Reader';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'My eBook library', robots: { index: false, follow: false } };
export default function Page() { if(!ebookEnabled())notFound();return <Shell><h1>Your private library</h1><p>Verified purchases, payment status and secure PDF access.</p><Library/></Shell>; }
