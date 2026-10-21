import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { rateLimit, logAudit } from '@/lib/security';

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().nullish().or(z.literal("")),
  message: z.string().min(1, "Message cannot be empty"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Rate limit: 3 messages per minute
    if (!rateLimit(ip, 3)) {
      await logAudit({ action: 'CONTACT_FORM_ABUSE', status: 'FAILURE', details: `Rate limit exceeded for IP: ${ip}`, req });
      return NextResponse.json({ message: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    // Try Prisma first
    try {
      const message = await (prisma as any).contactMessage.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          subject: validatedData.subject || "No Subject",
          message: validatedData.message,
        },
      });

      // Audit logging is secondary to the durable message save. Its failure must
      // not tell the visitor the saved message failed and invite duplicate sends.
      await logAudit({ action: 'CONTACT_FORM_SUBMIT', status: 'SUCCESS', details: `Message from ${validatedData.email}`, req }).catch(() => {});
      return NextResponse.json({ message: "Success", id: message.id }, { status: 201 });
    } catch {
      // Serverless local files are not durable message storage. Never report a
      // successful send when the database did not accept the message.
      return NextResponse.json(
        { message: "Your message could not be saved. Please try again or email info@dattasable.com." },
        { status: 503 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
