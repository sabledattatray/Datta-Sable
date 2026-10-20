import { randomUUID, createHmac, timingSafeEqual } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from './prisma';
import { campaignSchema, campaignSubject, campaignText, eligibleRecipients, generateBlogCampaignHtml, type CampaignContent, type Recipient } from './campaigns/shared';
import { sendEmail, emailConfiguration, DeliveryError } from './email-delivery';

export const CAMPAIGN_SCHEMA=[
 `CREATE TABLE IF NOT EXISTS "MarketingCampaign" (id TEXT PRIMARY KEY,"dedupeKey" TEXT NOT NULL UNIQUE,"postSlug" TEXT NOT NULL,subject TEXT NOT NULL,payload JSONB NOT NULL,"lastError" TEXT,"createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
 `CREATE TABLE IF NOT EXISTS "MarketingDelivery" (id TEXT PRIMARY KEY,"campaignId" TEXT NOT NULL REFERENCES "MarketingCampaign"(id) ON DELETE CASCADE,email TEXT NOT NULL,name TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'pending',attempts INTEGER NOT NULL DEFAULT 0,"providerId" TEXT,"lastError" TEXT,"updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),UNIQUE("campaignId",email))`,
 `CREATE INDEX IF NOT EXISTS "marketing_delivery_pending" ON "MarketingDelivery"(status,"updatedAt")`,
 `CREATE TABLE IF NOT EXISTS "MarketingSuppression" (email TEXT PRIMARY KEY,"createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
 `CREATE TABLE IF NOT EXISTS "MarketingWorker" (id INTEGER PRIMARY KEY,owner TEXT,"leaseUntil" TIMESTAMPTZ)`,
 `INSERT INTO "MarketingWorker"(id) VALUES(1) ON CONFLICT DO NOTHING`,
];
let ready:Promise<void>|undefined;
export function ensureCampaignSchema(){return ready??=(async()=>{for(const sql of CAMPAIGN_SCHEMA)await prisma.$executeRawUnsafe(sql);})().catch(error=>{ready=undefined;throw error;});}
export function unsubscribeToken(email:string){const secret=process.env.CAMPAIGN_UNSUBSCRIBE_SECRET||process.env.NEXTAUTH_SECRET;if(!secret)throw new Error('Configure CAMPAIGN_UNSUBSCRIBE_SECRET or NEXTAUTH_SECRET before sending campaigns.');return createHmac('sha256',secret).update(email.trim().toLowerCase()).digest('hex');}
export function validUnsubscribeToken(email:string,token:string){try{const a=Buffer.from(unsubscribeToken(email)),b=Buffer.from(token);return a.length===b.length&&timingSafeEqual(a,b);}catch{return false;}}
export function unsubscribeUrl(email:string){return `https://dattasable.com/api/unsubscribe?email=${encodeURIComponent(email)}&token=${unsubscribeToken(email)}`;}
async function recipients(client:Prisma.TransactionClient=prisma):Promise<Recipient[]>{
 const [users,subscribers,suppressed]=await Promise.all([
  client.user.findMany({select:{email:true,name:true}}),client.subscriber.findMany({select:{email:true}}),
  client.$queryRaw<{email:string}[]>`SELECT email FROM "MarketingSuppression"`,
 ]);return eligibleRecipients(users,subscribers,suppressed);
}
export async function campaignAudience(){await ensureCampaignSchema();return (await recipients()).length;}
export async function enqueueCampaign(input:CampaignContent,dedupeKey:string,client?:Prisma.TransactionClient){
 const content=campaignSchema.parse(input);unsubscribeToken('configuration-check@example.test');await ensureCampaignSchema();
 const write=async(tx:Prisma.TransactionClient)=>{
  const id=randomUUID(),payload=JSON.stringify(content),subject=campaignSubject(content);
  const inserted=await tx.$queryRaw<{id:string}[]>`INSERT INTO "MarketingCampaign"(id,"dedupeKey","postSlug",subject,payload) VALUES(${id},${dedupeKey},${content.slug},${subject},${payload}::jsonb) ON CONFLICT("dedupeKey") DO NOTHING RETURNING id`;
  if(!inserted.length){const existing=await tx.$queryRaw<{id:string}[]>`SELECT id FROM "MarketingCampaign" WHERE "dedupeKey"=${dedupeKey}`;return existing[0].id;}
  const audience=await recipients(tx);
  if(audience.length)await tx.$executeRaw(Prisma.sql`INSERT INTO "MarketingDelivery"(id,"campaignId",email,name) VALUES ${Prisma.join(audience.map(r=>Prisma.sql`(${randomUUID()},${id},${r.email},${r.name})`))}`);
  return id;
 };
 return client?write(client):prisma.$transaction(write,{timeout:20000});
}
export async function campaignHistory(){await ensureCampaignSchema();return prisma.$queryRaw`SELECT c.id,c."postSlug",c.subject,c."createdAt",c."lastError",COUNT(d.id)::int AS total,COUNT(d.id) FILTER(WHERE d.status='sent')::int AS sent,COUNT(d.id) FILTER(WHERE d.status='failed')::int AS failed,COUNT(d.id) FILTER(WHERE d.status='uncertain')::int AS uncertain,COUNT(d.id) FILTER(WHERE d.status IN('pending','sending'))::int AS pending,COUNT(d.id) FILTER(WHERE d.status='suppressed')::int AS suppressed FROM "MarketingCampaign" c LEFT JOIN "MarketingDelivery" d ON d."campaignId"=c.id GROUP BY c.id ORDER BY c."createdAt" DESC LIMIT 20`;}
export async function suppressCampaignEmail(email:string){await ensureCampaignSchema();const clean=email.trim().toLowerCase();await prisma.$transaction(async tx=>{await tx.$executeRaw`INSERT INTO "MarketingSuppression"(email) VALUES(${clean}) ON CONFLICT DO NOTHING`;await tx.subscriber.deleteMany({where:{email:{equals:clean,mode:'insensitive'}}});await tx.$executeRaw`UPDATE "MarketingDelivery" SET status='suppressed',"updatedAt"=NOW() WHERE email=${clean} AND status IN('pending','failed')`;});}
export async function retryCampaign(id:string){await ensureCampaignSchema();await prisma.$executeRaw`UPDATE "MarketingDelivery" SET status='pending',"lastError"=NULL WHERE "campaignId"=${id} AND status='failed'`;await prisma.$executeRaw`UPDATE "MarketingCampaign" SET "lastError"=NULL WHERE id=${id}`;}

type Job=Recipient&{id:string;campaignId:string;payload:CampaignContent};
export type QueuePort={claim:()=>Promise<Job|null>;suppressed:(email:string)=>Promise<boolean>;send:(job:Job)=>Promise<string>;finish:(job:Job,status:string,providerId?:string,error?:string)=>Promise<void>;heartbeat:()=>Promise<void>};
// This loop also runs against a memory adapter in tests: real recipients/providers are never used there.
export async function dispatchQueue(port:QueuePort,{budgetMs=200000,spacingMs=700,limit=180}={}){
 const started=Date.now();let processed=0;
 while(processed<limit&&Date.now()-started<budgetMs){await port.heartbeat();const job=await port.claim();if(!job)break;
  if(await port.suppressed(job.email)){await port.finish(job,'suppressed');processed++;continue;}
  try{const id=await port.send(job);await port.finish(job,'sent',id);}
  catch(error){const e=error instanceof DeliveryError?error:new DeliveryError('Delivery outcome could not be confirmed.',true);await port.finish(job,e.uncertain?'uncertain':'failed',undefined,e.message);processed++;if(e.blocked)break;continue;}
  processed++;if(spacingMs)await new Promise(resolve=>setTimeout(resolve,spacingMs));
 }return processed;
}
export async function processCampaignQueue(){
 await ensureCampaignSchema();if(!emailConfiguration().configured)return {processed:0,blocked:true};
 const owner=randomUUID();const lease=await prisma.$queryRaw<{id:number}[]>`UPDATE "MarketingWorker" SET owner=${owner},"leaseUntil"=NOW()+INTERVAL '90 seconds' WHERE id=1 AND ("leaseUntil" IS NULL OR "leaseUntil"<NOW()) RETURNING id`;
 if(!lease.length)return {processed:0,busy:true};
 try{
  // A server crash after provider acceptance is ambiguous. Never automatically resend those rows.
  await prisma.$executeRaw`UPDATE "MarketingDelivery" SET status='uncertain',"lastError"='Worker stopped before recording provider confirmation. Check provider activity before resending.' WHERE status='sending'`;
  const processed=await dispatchQueue({
   heartbeat:async()=>{await prisma.$executeRaw`UPDATE "MarketingWorker" SET "leaseUntil"=NOW()+INTERVAL '90 seconds' WHERE id=1 AND owner=${owner}`;},
   claim:async()=>{const rows=await prisma.$queryRaw<(Job&{payload:CampaignContent})[]>`WITH picked AS(SELECT d.id FROM "MarketingDelivery" d WHERE status='pending' ORDER BY "updatedAt",id LIMIT 1 FOR UPDATE SKIP LOCKED), claimed AS(UPDATE "MarketingDelivery" d SET status='sending',attempts=attempts+1,"updatedAt"=NOW() FROM picked WHERE d.id=picked.id RETURNING d.*) SELECT claimed.*,c.payload FROM claimed JOIN "MarketingCampaign" c ON c.id=claimed."campaignId"`;return rows[0]||null;},
   suppressed:async email=>(await prisma.$queryRaw<{email:string}[]>`SELECT email FROM "MarketingSuppression" WHERE email=${email}`).length>0,
   send:async job=>{const url=unsubscribeUrl(job.email),result=await sendEmail({to:job.email,subject:campaignSubject(job.payload),html:generateBlogCampaignHtml({...job.payload,recipientName:job.name,recipientEmail:job.email,unsubscribeUrl:url}),text:campaignText(job.payload,url),headers:{'List-Unsubscribe':`<${url}>`,'List-Unsubscribe-Post':'List-Unsubscribe=One-Click'}},job.id);return result.messageId;},
   finish:async(job,status,providerId,error)=>{await prisma.$executeRaw`UPDATE "MarketingDelivery" SET status=${status},"providerId"=${providerId||null},"lastError"=${error||null},"updatedAt"=NOW() WHERE id=${job.id}`;await prisma.$executeRaw`UPDATE "MarketingCampaign" SET "lastError"=${error||null} WHERE id=${job.campaignId}`;},
  });return {processed};
 }finally{await prisma.$executeRaw`UPDATE "MarketingWorker" SET owner=NULL,"leaseUntil"=NULL WHERE id=1 AND owner=${owner}`;}
}

export function testReceipt(content:CampaignContent,stamp=Date.now()){const proof=unsubscribeToken('test:'+stamp+':'+JSON.stringify(campaignSchema.parse(content)));return `${stamp}.${proof}`;}
export function validTestReceipt(content:CampaignContent,receipt:string){const [stamp]=receipt.split('.');const n=Number(stamp);if(!Number.isFinite(n)||n>Date.now()||Date.now()-n>86400000)return false;try{const expected=Buffer.from(testReceipt(content,n)),actual=Buffer.from(receipt);return expected.length===actual.length&&timingSafeEqual(expected,actual);}catch{return false;}}
