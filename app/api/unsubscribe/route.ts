import { NextResponse } from 'next/server';
import { z } from 'zod';
import { suppressCampaignEmail, validUnsubscribeToken } from '@/lib/campaigns';
export async function POST(req:Request){
 try{const url=new URL(req.url);const type=req.headers.get('content-type')||'';const body=type.includes('application/json')?await req.json():Object.fromEntries(new URLSearchParams(await req.text()));const email=z.string().email().max(254).parse(body.email||url.searchParams.get('email')).trim().toLowerCase();const token=body.token||url.searchParams.get('token');
 // RFC 8058 one-click requests must have a valid signed URL. The visible form allows manual opt-out.
 if((!type.includes('application/json')||token)&&(!token||!validUnsubscribeToken(email,token)))return NextResponse.json({error:'Invalid unsubscribe link.'},{status:400});
 await suppressCampaignEmail(email);return NextResponse.json({success:true,message:'You have been unsubscribed from future article updates.'});
 }catch{return NextResponse.json({error:'We could not save your request. Check the email address or try again shortly.'},{status:400});}
}
export async function GET(req:Request){const source=new URL(req.url),target=new URL('/unsubscribe',req.url);for(const key of ['email','token']){const value=source.searchParams.get(key);if(value)target.searchParams.set(key,value);}return NextResponse.redirect(target);}
