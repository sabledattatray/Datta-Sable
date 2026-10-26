import Shell from '@/components/ebooks/Shell';
import { Download } from '@/components/ebooks/Reader';
import { notFound } from 'next/navigation';
import { ebookEnabled } from '@/lib/ebooks/validation';
export const metadata={title:'Secure PDF download',robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{grantToken:string}>}){if(!ebookEnabled())notFound();return <Shell><h1>Your PDF, ready to read</h1><Download token={(await params).grantToken}/></Shell>;}
