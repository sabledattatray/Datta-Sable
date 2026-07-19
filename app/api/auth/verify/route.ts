import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/mail";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const existingToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!existingToken) {
      if (email) {
        const existingUser = await prisma.user.findUnique({
          where: { email }
        });
        if (existingUser?.emailVerified) {
          return NextResponse.json({ 
            success: true, 
            message: "Email already verified!",
            email: existingUser.email
          });
        }
      }
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.identifier }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Email does not exist" }, { status: 400 });
    }

    // Verify the email
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: { 
        emailVerified: new Date(),
      }
    });

    // Send welcome email in background
    sendWelcomeEmail(updatedUser.email as string, updatedUser.name || "friend").catch(err => {
      console.error("Failed to send welcome email to verified user:", err);
    });

    // Delete the token
    await prisma.verificationToken.delete({
      where: { 
        identifier_token: {
          identifier: existingToken.identifier,
          token: existingToken.token,
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Email verified successfully!",
      email: existingUser.email
    });

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
