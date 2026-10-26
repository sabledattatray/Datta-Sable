import Shell from '@/components/ebooks/Shell';
import { AccessLink } from '@/components/ebooks/Reader';
import { notFound } from 'next/navigation';
import { ebookEnabled } from '@/lib/ebooks/validation';
export const metadata={title:'Verify library access',robots:{index:false,follow:false}};
export default function Page(){if(!ebookEnabled())notFound();return <Shell><h1>Welcome back to your library</h1><AccessLink/></Shell>;}
