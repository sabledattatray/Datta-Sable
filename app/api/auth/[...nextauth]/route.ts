import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

type Context = { params: Promise<{ nextauth: string[] }> };

async function handler(req: Request, context: Context) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || (host && !host.includes("localhost") ? "https" : "http");

  if (host && !host.includes("localhost") && (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost"))) {
    process.env.NEXTAUTH_URL = `${proto}://${host}`;
  }

  return NextAuth(authOptions)(req, context);
}

export { handler as GET, handler as POST };
