import nodemailer from 'nodemailer';
export class DeliveryError extends Error{constructor(message:string,public uncertain=false,public blocked=false){super(message);}}
export function emailConfiguration(){
 const key=process.env.RESEND_API_KEY?.trim();
 const provider=process.env.EMAIL_PROVIDER==='smtp'?'smtp':'resend';
 const from=(process.env.RESEND_FROM_EMAIL||process.env.EMAIL_FROM||'').trim();
 const host=process.env.EMAIL_SERVER_HOST?.trim(),user=process.env.EMAIL_SERVER_USER?.trim(),password=process.env.EMAIL_SERVER_PASSWORD;
 const port=Number(process.env.EMAIL_SERVER_PORT||465);
 return {provider,configured:Boolean(from&&(provider==='resend'?key:(host&&user&&password&&[465,587].includes(port)))),from,host:provider==='resend'?undefined:host,port};
}
export async function sendEmail(message:{to:string;subject:string;html:string;text?:string;from?:string;headers?:Record<string,string>},id?:string,options?:{namespace?:string;from?:string}){
 const config=emailConfiguration();
 const sender=options?.from||config.from, namespace=options?.namespace||'campaign';
 if(!config.configured)throw new DeliveryError('Configure RESEND_API_KEY and RESEND_FROM_EMAIL using a verified sender domain.',false,true);
 if(config.provider==='resend'){
  let response:Response;
  try{response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY!.trim()}`,'Content-Type':'application/json',...(id?{'Idempotency-Key':`${namespace}-${id}`}:{})},body:JSON.stringify({from:sender,to:[message.to],subject:message.subject,html:message.html,text:message.text,headers:message.headers}),signal:AbortSignal.timeout(15000)});}catch{throw new DeliveryError('No delivery confirmation from Resend. Review provider activity before retrying.',true);}
  if(!response.ok){const status=response.status;throw new DeliveryError(status===401||status===403?'Resend rejected the API key or sender domain. Check the key permissions and domain verification.':status===429?'Resend rate limit reached. Wait before resuming the campaign.':`Resend rejected the message (HTTP ${status}). Review provider activity.`,namespace==='commerce'&&status>=500,[401,403,429].includes(status));}
  let result:{id?:unknown};
  try{result=await response.json();}catch{throw new DeliveryError('Resend returned an unreadable confirmation. Review provider activity before retrying.',true);}
  if(typeof result.id!=='string'||!result.id.trim())throw new DeliveryError('Resend did not return a message ID. Review provider activity before retrying.',true);
  return {messageId:result.id};
 }
 const transport=nodemailer.createTransport({host:config.host,port:config.port,secure:config.port===465,requireTLS:config.port===587,auth:{user:process.env.EMAIL_SERVER_USER,pass:process.env.EMAIL_SERVER_PASSWORD},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000});
 try{const result=await transport.sendMail({...message,from:sender,...(id?{messageId:`<${namespace}-${id}@dattasable.com>`}:{})});if(!result.accepted?.length)throw new DeliveryError('The SMTP server did not accept this recipient.');return {messageId:result.messageId};}
 catch(error){if(error instanceof DeliveryError)throw error;const e=error as {code?:string;command?:string;responseCode?:number};throw new DeliveryError(e.code==='EAUTH'?'SMTP authentication rejected. Correct the configured mailbox credentials.':'SMTP delivery could not be confirmed.',e.command==='DATA'&&!e.responseCode,e.code==='EAUTH');}
 finally{transport.close();}
}
