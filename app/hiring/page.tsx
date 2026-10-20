import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Page Not Found', robots: { index: false, follow: true } };

// Recruitment campaign withdrawn by the site owner. Preserve a real 404 for crawlers.
export default function RetiredRecruitmentPage() { notFound(); }
