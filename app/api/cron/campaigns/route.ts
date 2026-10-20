import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { processCampaignQueue } from '@/lib/campaigns';
export const runtime='nodejs';
export const maxDuration=300;
export async function GET(req:Request){const secret=process.env.CRON_SECRET,provided=req.headers.get('authorization')||'';if(!secret)return NextResponse.json({error:'Worker authentication is not configured.'},{status:503});const a=Buffer.from(`Bearer ${secret}`),b=Buffer.from(provided);if(a.length!==b.length||!timingSafeEqual(a,b))return NextResponse.json({error:'Unauthorized'},{status:401});try{return NextResponse.json(await processCampaignQueue());}catch{return NextResponse.json({error:'Campaign worker failed. Pending messages remain in storage.'},{status:503});}}
