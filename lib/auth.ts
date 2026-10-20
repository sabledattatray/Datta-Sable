import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { sendWelcomeEmail } from "./mail";
import { rateLimit } from "./security";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || credentials.password.length > 1024) return null;
        const email = credentials.email.trim().toLowerCase();
        if (!rateLimit(`credentials:${email}`, 10)) return null;
        let user;
        try {
          user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
        } catch {
          console.error('Credential authentication could not access the database.');
          throw new Error('Authentication service temporarily unavailable');
        }
        if (!user?.password) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        if (!user.emailVerified) throw new Error('Please verify your email before logging in.');
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      }

    }),
    ...(process.env.GOOGLE_ID && process.env.GOOGLE_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      })
    ] : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      })
    ] : []),
    ...(process.env.LINKEDIN_ID && process.env.LINKEDIN_SECRET ? [
      LinkedInProvider({
        clientId: process.env.LINKEDIN_ID,
        clientSecret: process.env.LINKEDIN_SECRET,
        issuer: 'https://www.linkedin.com',
        jwks_endpoint: 'https://www.linkedin.com/oauth/openid/jwks',
        profile(profile) {
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            role: 'USER',
          }
        },
      })
    ] : []),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without extra check since we auto-verify them on creation
      // But for credentials, we must ensure they are verified in the DB
      if (account?.provider === "credentials") {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email as string }
        });

        if (!dbUser?.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      const now = Math.floor(Date.now() / 1000);

      if (user) {
        const envAdminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
          .split(',')
          .map(e => e.trim().toLowerCase())
          .filter(Boolean);
        const userEmail = user.email?.toLowerCase() || '';
        const uniqueEmail = userEmail || `${account?.providerAccountId}@${account?.provider}.placeholder`;
        const isEnvAdmin = userEmail && envAdminEmails.includes(userEmail);
        let finalRole = isEnvAdmin ? 'ADMIN' : ((user as any).role || 'USER');

        
        // Persist user to DB if they don't exist (important for OAuth users)
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: uniqueEmail }
          });

          // Preserve existing DB admin role and prevent accidental demotion (AUD-13)
          if (existingUser?.role === 'ADMIN' || isEnvAdmin) {
            finalRole = 'ADMIN';
          }

          const dbUser = await prisma.user.upsert({
            where: { email: uniqueEmail },
            update: { 
              name: user.name, 
              role: finalRole,

              image: (user as any).image,
              lastLoginAt: new Date()
            },
            create: {
              email: uniqueEmail,
              name: user.name,
              role: finalRole,
              image: (user as any).image,
              lastLoginAt: new Date(),
              emailVerified: account ? new Date() : null, // Auto-verify OAuth users
            }
          });


          if (!existingUser) {
            // Trigger welcome email asynchronously
            sendWelcomeEmail(dbUser.email as string, dbUser.name || "friend").catch(err => {
              console.error("Failed to send welcome email to OAuth user:", err);
            });
          }

          // Log the login action
          await prisma.auditLog.create({
            data: {
              userId: dbUser.id,
              action: "LOGIN",
              status: "SUCCESS",
              details: `User logged in via ${account?.provider || 'credentials'}`,
            }
          });

          token.id = dbUser.id;
          token.role = dbUser.role;
          token.lastRoleCheck = now;
        } catch (error) {
          console.error("Error updating user activity:", error);
          delete token.id;
          token.role = 'USER';
          delete token.lastRoleCheck;

        }
      } else if (token.id) {
        // Stale privilege propagation check: Query the database at most once every 30 seconds
        const lastCheck = (token.lastRoleCheck as number) || 0;
        if (now - lastCheck > 30) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: token.id as string },
              select: { role: true }
            });
            if (dbUser) {
              token.role = dbUser.role;
              token.lastRoleCheck = now;
            } else {
              // User was deleted or no longer exists: revoke privileges immediately (AUD-08)
              token.role = 'USER';
              delete token.id;
            }
          } catch (error) {
            console.error("Role refresh could not access the database.");
            token.role = "USER";
            token.lastRoleCheck = now;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  // In production, do NOT fall back to a public static secret; require NEXTAUTH_SECRET (AUD-02)
  secret: process.env.NEXTAUTH_SECRET || (process.env.NODE_ENV === 'production' ? undefined : 'fallback-secret-for-dev-only-change-in-prod'),
  debug: process.env.NODE_ENV === 'development',
};

