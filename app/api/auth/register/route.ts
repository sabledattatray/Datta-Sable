import { z } from 'zod';
import { rateLimit } from '@/lib/security';
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    if (!rateLimit(`register:${request.headers.get('x-forwarded-for')?.split(',')[0]||'unknown'}`, 5)) return NextResponse.json({error:'Too many requests. Please try again later.'},{status:429});
    const input = z.object({email:z.string().trim().email().max(254).transform(value=>value.toLowerCase()),password:z.string().min(8).refine(value=>Buffer.byteLength(value,'utf8')<=72),firstName:z.string().trim().min(1).max(80),lastName:z.string().trim().min(1).max(80)}).safeParse(await request.json());
    if (!input.success) return NextResponse.json({error:'Enter a valid email, name and password (8 characters minimum; 72 UTF-8 bytes maximum).'},{status:400});
    const { email, password, firstName, lastName } = input.data;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: {equals:email,mode:"insensitive"} }
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const name = `${firstName} ${lastName}`;

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "USER",
      }
    });

    // Generate verification token
    const verificationToken = await generateVerificationToken(email);

    // Send verification email
    try {
      await sendVerificationEmail(verificationToken.identifier, verificationToken.token);
    } catch (mailError) {
      console.error("Failed to send verification email:", mailError);
      // We still return success for user creation, but notify that email failed
      return NextResponse.json({ 
        success: true, 
        message: "User created but verification email failed to send. Please contact support.",
        userId: user.id 
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Verification email sent! Please check your inbox.",
      userId: user.id 
    });

  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({error:"Invalid request."},{status:400});
    console.error("Registration could not be completed.");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
