import { after, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { posts as staticPosts } from '@/app/blog/data';
import { campaignAudience, campaignHistory, enqueueCampaign, processCampaignQueue, retryCampaign, testReceipt, validTestReceipt } from '@/lib/campaigns';
import { campaignSchema, campaignSubject, generateBlogCampaignHtml, campaignText } from '@/lib/campaigns/shared';
import { emailConfiguration, sendEmail, DeliveryError } from '@/lib/email-delivery';
export const runtime='nodejs';
export const maxDuration=300;
const isAdmin=async()=>{const session=await getServerSession(authOptions);return (session?.user as {role?:string}|undefined)?.role==='ADMIN';};
async function publishedPosts(){
 const db=await prisma.post.findMany({where:{published:true},select:{slug:true,title:true,category:true,excerpt:true,image:true,readTime:true,date:true},orderBy:{createdAt:'desc'},take:200});
 const map=new Map(staticPosts.map(p=>[p.slug,{slug:p.slug,title:p.title,category:p.category||'Engineering',excerpt:p.excerpt||'',image:p.image||null,readTime:undefined as number|undefined,date:p.date}]));
 db.forEach(p=>map.set(p.slug,p));
 const drafts=await prisma.post.findMany({where:{published:false},select:{slug:true}});drafts.forEach(p=>map.delete(p.slug));
 return [...map.values()];
}
export async function GET(){
 if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:403});
 try{const [posts,totalRecipients,campaigns]=await Promise.all([publishedPosts(),campaignAudience(),campaignHistory()]);return NextResponse.json({posts,totalRecipients,campaigns,delivery:emailConfiguration()},{headers:{'Cache-Control':'no-store'}});}
 catch{console.error('Campaign dashboard data could not be loaded.');return NextResponse.json({error:'Campaign storage could not be loaded. Check database connectivity and campaign table permissions.'},{status:503});}
}
export async function POST(req:Request){
 if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:403});
 if(req.headers.get('origin')!==new URL(req.url).origin)return NextResponse.json({error:'Invalid request origin'},{status:403});
 try{
  const raw=await req.text();if(raw.length>24000)return NextResponse.json({error:'Campaign is too large.'},{status:413});
  const body=JSON.parse(raw),action=z.enum(['preview','test','broadcast','resume']).parse(body.action);
  if(action==='resume'){const id=z.string().uuid().parse(body.campaignId);if(!emailConfiguration().configured)return NextResponse.json({error:'Configure an email provider before resuming.'},{status:503});await retryCampaign(id);after(async()=>{await processCampaignQueue();});return NextResponse.json({success:true,message:'Remaining and failed recipients will be processed. Accepted messages are not resent.'});}
  const post=(await publishedPosts()).find(p=>p.slug===body.slug);if(!post)return NextResponse.json({error:'Select a currently published article.'},{status:400});
  const content=campaignSchema.parse({slug:post.slug,title:post.title,category:post.category,readTime:post.readTime,imageUrl:post.image,shortStory:body.shortStory,takeaways:body.takeaways,customSubject:body.customSubject});
  if(action==='preview')return NextResponse.json({html:generateBlogCampaignHtml({...content,recipientName:'Reader',recipientEmail:'preview@example.test'})});
  if(action==='test'){
   const email=z.string().email().max(254).parse(body.testEmail).trim().toLowerCase();
   const result=await sendEmail({to:email,subject:`[TEST] ${campaignSubject(content)}`,html:generateBlogCampaignHtml({...content,recipientName:'Reader',recipientEmail:email}),text:campaignText(content,'https://dattasable.com/unsubscribe')});
   return NextResponse.json({success:true,providerId:result.messageId,testReceipt:testReceipt(content),message:'Provider accepted the test email. Check your inbox and spam folder before broadcasting.'});
  }
  if(!emailConfiguration().configured)return NextResponse.json({error:'Configure Resend before broadcasting.'},{status:503});
  if(!validTestReceipt(content,z.string().parse(body.testReceipt)))return NextResponse.json({error:'Send a successful test of this exact campaign before broadcasting.'},{status:400});
  const requestId=z.string().uuid().parse(body.requestId),id=await enqueueCampaign(content,`manual:${requestId}`);
  after(async()=>{await processCampaignQueue();});
  return NextResponse.json({success:true,campaignId:id,message:'Campaign queued. Delivery progress is saved in campaign history.'},{status:202});
 }catch(error){if(error instanceof DeliveryError)return NextResponse.json({error:error.message},{status:503});if(error instanceof z.ZodError||error instanceof SyntaxError)return NextResponse.json({error:'Check the campaign fields, test email and selected article.'},{status:400});console.error('Campaign action failed.');return NextResponse.json({error:'Campaign could not be saved or processed. Check provider and database configuration.'},{status:503});}
}
