import { notFound } from 'next/navigation';
import AdminDashboardWrapper from '@/app/admin/AdminDashboardWrapper';
import AdminOverview from '@/components/admin/AdminOverview';
import type { AdminOverviewData } from '@/lib/admin/overview';
import AdminManagementPreview from '@/components/admin/AdminManagementPreview';
import AdminSettingsPage from '@/app/admin/settings/page';

export const metadata = { title: 'Admin workspace design preview', robots: { index: false, follow: false } };

export default async function AdminDesignPreview({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  if (process.env.NODE_ENV !== 'development' || process.env.ADMIN_DESIGN_PREVIEW !== '1') notFound();
  const { view } = await searchParams;
  if (view === 'management') return <AdminDashboardWrapper previewOnly previewPath="/admin/blog"><AdminManagementPreview /></AdminDashboardWrapper>;
  if (view === 'settings') return <AdminDashboardWrapper previewOnly previewPath="/admin/settings"><AdminSettingsPage /></AdminDashboardWrapper>;
  const now = new Date();
  const traffic = [5,8,4,2,3,6,11,15,10,8,18,22,16,12,19,24,29,21,17,23,16,12,8,6];
  const sample: AdminOverviewData = {
    updatedAt: now.toISOString(), availableSources: 12, sourceCount: 12,
    counts: { published: 122, drafts: 8, projects: 17, users: 39, subscribers: 77, unread: 4, views24h: traffic.reduce((a,b) => a+b,0), views5m: 3 },
    categories: [{ name: 'Microsoft Fabric', count: 38 }, { name: 'Architecture & BI', count: 25 }, { name: 'Practical guides', count: 21 }, { name: 'Engineering', count: 18 }, { name: 'Power BI', count: 12 }, { name: 'SQL & data', count: 8 }],
    posts: ['Microsoft Fabric: a practical guide to real-time intelligence','Designing clearer dashboards for better decisions','A reliable foundation for your data platform','From manual reporting to thoughtful automation'].map((title,i) => ({ id: String(i), title, published: i !== 2, category: i%2 ? 'Architecture & BI' : 'Microsoft Fabric', updatedAt: now.toISOString() })),
    events: [{ id: 'sample-1', action: 'ARTICLE_UPDATED', status: 'SUCCESS', createdAt: now.toISOString() }, { id: 'sample-2', action: 'ADMIN_LOGIN', status: 'SUCCESS', createdAt: now.toISOString() }, { id: 'sample-3', action: 'PRODUCT_UPDATED', status: 'SUCCESS', createdAt: now.toISOString() }],
    traffic: traffic.map((count,i) => ({ count, at: new Date(now.getTime() - (23-i)*3600000).toISOString() })),
  };
  return <AdminDashboardWrapper previewOnly previewPath="/admin"><AdminOverview previewData={sample} /></AdminDashboardWrapper>;
}
