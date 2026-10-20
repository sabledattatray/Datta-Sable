import { notFound } from 'next/navigation';
import AdminDashboardWrapper from '@/app/admin/AdminDashboardWrapper';
import CampaignStudio from '@/components/admin/CampaignStudio';
import { generateBlogCampaignHtml } from '@/lib/campaigns/shared';
export default function Page(){
 if(process.env.NODE_ENV!=='development'||process.env.CAMPAIGN_DESIGN_PREVIEW!=='1')notFound();
 const post={slug:'engineering-insights-preview',title:'Microsoft Fabric: turning scattered data into clear decisions',category:'Data engineering',excerpt:'The most useful change in a data platform is not always another tool. Sometimes, it is a clearer path from the data you already have to the decision you need to make.\n\nIn this article, I walk through the choices that make a Microsoft Fabric workspace easier to understand, maintain and trust.',readTime:12,image:null};
 const initialPreview=generateBlogCampaignHtml({...post,shortStory:post.excerpt,takeaways:['Build a workspace around the questions your team needs to answer.','Keep ownership and data quality visible from the start.'],recipientName:'Reader',recipientEmail:'preview@example.test'});
 return <AdminDashboardWrapper previewOnly><CampaignStudio previewOnly initialData={{posts:[post],totalRecipients:77,delivery:{provider:'resend',configured:true,from:'Datta Sable <hello@example.test>'},campaigns:[],initialPreview}}/></AdminDashboardWrapper>;
}
