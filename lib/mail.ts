import nodemailer from "nodemailer";
import { prisma } from "./prisma";

const domain = process.env.NEXTAUTH_URL || "http://localhost:3000";

// Configure SMTP transport
// NOTE: These should be provided in .env.local for production
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: parseInt(process.env.EMAIL_SERVER_PORT || "587") === 465,
  auth: {
    user: process.env.EMAIL_SERVER_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_SERVER_PASSWORD || "your-app-password",
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/api/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

  await transporter.sendMail({
    from: `"Datta Sable Admin" <${process.env.EMAIL_FROM || "no-reply@dattasable.com"}>`,
    to: email,
    subject: "Verify your email - Datta Sable Admin",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000; color: #fff; border-radius: 10px;">
        <h2 style="color: #c9f31d; text-align: center;">Verify Your Account</h2>
        <p>Hello,</p>
        <p>Thank you for signing up for the Datta Sable Admin Dashboard. To complete your registration and secure your account, please click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmLink}" style="background-color: #c9f31d; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email & Login</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #888;">${confirmLink}</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `,
  });
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  await transporter.sendMail({
    from: `"Datta Sable" <${process.env.EMAIL_FROM || "contact@dattasable.com"}>`,
    to: email,
    subject: "Welcome to dattasable.com! 🚀",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #000; color: #fff; border-radius: 10px; border: 1px solid #1a1a1a;">
        <h2 style="color: #c9f31d; text-align: center; margin-bottom: 20px;">Welcome aboard, ${name}!</h2>
        <p>Hello ${name},</p>
        <p>Thanks for registering on the <strong>dattasable.com</strong> data platform. Your account is active, and you have joined 7,000+ data engineers, architects, and BI professionals receiving surgical technical tutorials weekly.</p>
        
        <h3 style="color: #c9f31d; margin-top: 30px; margin-bottom: 15px;">🔥 Premium Guides & Resources to Get Started:</h3>
        <ul style="padding-left: 20px; line-height: 1.8;">
          <li>
            <a href="https://dattasable.com/blog/microsoft-fabric-architecture-explained-2026" style="color: #c9f31d; text-decoration: underline;">
              <strong>Microsoft Fabric Architecture Explained</strong>
            </a> - The complete 2026 engineering blueprint.
          </li>
          <li>
            <a href="https://dattasable.com/blog/power-bi-direct-lake-performance-tuning-fabric" style="color: #c9f31d; text-decoration: underline;">
              <strong>Power BI Direct Lake Tuning Guide</strong>
            </a> - DAX query optimization and performance tuning.
          </li>
          <li>
            <a href="https://dattasable.com/blog/microsoft-fabric-medallion-architecture-guide" style="color: #c9f31d; text-decoration: underline;">
              <strong>Medallion Architecture Ingestion Guide</strong>
            </a> - Refining Bronze, Silver, and Gold data tiers.
          </li>
        </ul>

        <div style="text-align: center; margin: 35px 0;">
          <a href="https://dattasable.com/blog" style="background-color: #c9f31d; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Explore the Hub</a>
        </div>

        <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;">
        <p style="font-size: 11px; color: #666; text-align: center;">
          You received this email because you registered on dattasable.com. Unsubscribe at any time.
        </p>
      </div>
    `,
  });
};

export interface BlogCampaignEmailParams {
  recipientName?: string;
  recipientEmail?: string;
  title: string;
  slug: string;
  category?: string;
  readTime?: number | string;
  imageUrl?: string | null;
  shortStory: string;
  takeaways?: string[];
  customSubject?: string;
  previewText?: string;
}

/**
 * Generate a modern, responsive HTML email marketing newsletter for blog posts.
 * Includes a narrative short story hook, key takeaways, high-converting CTA,
 * author bio, and CAN-SPAM compliant unsubscribe footer.
 */
export function generateBlogCampaignHtml(params: BlogCampaignEmailParams): string {
  const {
    recipientName = '',
    recipientEmail = '',
    title,
    slug,
    category = 'Data Engineering & Cloud Architecture',
    readTime = '15',
    imageUrl,
    shortStory,
    takeaways = [],
  } = params;

  const productionDomain = "https://dattasable.com";
  const postUrl = `${productionDomain}/blog/${slug}`;
  const greeting = recipientName && recipientName.trim().length > 0 
    ? `Hey ${recipientName.split(' ')[0]},` 
    : `Hey there,`;

  // Format short story with proper paragraph breaks
  const storyParagraphs = shortStory
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => `<p style="margin: 0 0 14px 0; line-height: 1.7; color: #e2e8f0; font-size: 15px;">${p}</p>`)
    .join('');

  // Default or customized takeaways
  const finalTakeaways = takeaways.length > 0 ? takeaways : [
    "Surgical architectural trade-offs tested in high-throughput enterprise environments.",
    "Real-world benchmark data, cost traps, and optimization playbooks.",
    "Step-by-step implementation roadmaps designed for senior engineers and architects."
  ];

  const takeawaysHtml = finalTakeaways
    .map((item, idx) => `
      <tr style="vertical-align: top;">
        <td width="28" style="padding: 6px 0; font-size: 14px; font-weight: 800; color: #c9f31d; font-family: monospace;">
          0${idx + 1}.
        </td>
        <td style="padding: 6px 0 10px 6px; color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          ${item}
        </td>
      </tr>
    `)
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #05070a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc; -webkit-font-smoothing: antialiased;">
  <!-- Preview snippet for email clients -->
  <div style="display: none; font-size: 1px; color: #05070a; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${shortStory.substring(0, 140).replace(/["<>]/g, '')}... Read the full engineering breakdown inside.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #05070a; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 24px 12px 48px 12px;">
        
        <!-- Main Email Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0b0f17; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <!-- Brand Header -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #1e293b; background: linear-gradient(180deg, #111827 0%, #0b0f17 100%);">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="font-family: monospace; font-size: 15px; font-weight: 800; letter-spacing: 0.12em; color: #ffffff; text-transform: uppercase;">
                      DATTA SABLE <span style="color: #c9f31d;">●</span>
                    </div>
                    <div style="font-size: 11px; color: #94a3b8; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 3px; font-family: monospace;">
                      Enterprise Data Architecture & Cloud Engineering
                    </div>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; padding: 4px 10px; background-color: rgba(201, 243, 29, 0.12); border: 1px solid rgba(201, 243, 29, 0.3); border-radius: 9999px; font-size: 10px; font-family: monospace; font-weight: 700; color: #c9f31d; text-transform: uppercase; letter-spacing: 0.08em;">
                      New Dispatch
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              
              <!-- Greeting & Category Badge -->
              <div style="font-size: 14px; color: #94a3b8; margin-bottom: 8px;">
                ${greeting}
              </div>

              <div style="margin-bottom: 12px;">
                <span style="font-family: monospace; font-size: 11px; color: #c9f31d; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600;">
                  [ ${category} • ${readTime} Min Read ]
                </span>
              </div>

              <!-- Article Title -->
              <h1 style="margin: 0 0 20px 0; font-size: 24px; line-height: 1.35; color: #ffffff; font-weight: 800; letter-spacing: -0.01em;">
                <a href="${postUrl}" target="_blank" style="color: #ffffff; text-decoration: none;">
                  ${title}
                </a>
              </h1>

              <!-- Featured Image Banner (if provided) -->
              ${imageUrl ? `
                <div style="margin: 0 0 26px 0; border-radius: 8px; overflow: hidden; border: 1px solid #1e293b;">
                  <a href="${postUrl}" target="_blank" style="display: block;">
                    <img src="${imageUrl.startsWith('http') ? imageUrl : `${productionDomain}${imageUrl}`}" alt="${title}" width="536" style="width: 100%; max-width: 536px; height: auto; display: block; border: 0;" />
                  </a>
                </div>
              ` : ''}

              <!-- Short Story Narrative Callout -->
              <div style="background-color: #0f172a; border-left: 4px solid #c9f31d; border-radius: 0 8px 8px 0; padding: 22px 24px; margin: 24px 0; border-top: 1px solid #1e293b; border-right: 1px solid #1e293b; border-bottom: 1px solid #1e293b;">
                <div style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #c9f31d; letter-spacing: 0.15em; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center;">
                  ✦ THE STORY BEHIND THIS GUIDE
                </div>
                <div>
                  ${storyParagraphs}
                </div>
              </div>

              <!-- Key Takeaways Section -->
              <div style="background-color: #090d14; border: 1px solid #1e293b; border-radius: 8px; padding: 20px 22px; margin: 26px 0;">
                <div style="font-size: 12px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.1em; font-family: monospace; margin-bottom: 14px;">
                  📌 What You Will Uncover:
                </div>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  ${takeawaysHtml}
                </table>
              </div>

              <!-- High-Converting Call To Action Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 34px 0 28px 0;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="border-radius: 8px; background-color: #c9f31d;">
                          <a href="${postUrl}" target="_blank" style="font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #000000; text-decoration: none; padding: 15px 36px; border-radius: 8px; border: 1px solid #c9f31d; display: inline-block; font-weight: 800; letter-spacing: 0.02em;">
                            Read the Complete Guide &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 12px;">
                    <a href="${postUrl}" target="_blank" style="font-size: 12px; color: #64748b; text-decoration: underline; word-break: break-all;">
                      ${postUrl}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Author Signature Block -->
              <div style="border-top: 1px solid #1e293b; padding-top: 24px; margin-top: 32px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="52" style="vertical-align: top; padding-right: 14px;">
                      <img src="https://dattasable.com/images/hero/datta-sable-portrait.webp" alt="Datta Sable" width="52" height="52" style="border-radius: 50%; border: 2px solid #c9f31d; display: block; object-fit: cover;" onerror="this.style.display='none'" />
                    </td>
                    <td style="vertical-align: middle;">
                      <div style="color: #ffffff; font-weight: 700; font-size: 15px; margin-bottom: 2px;">
                        Datta Sable
                      </div>
                      <div style="color: #94a3b8; font-size: 12px; line-height: 1.4;">
                        Cloud Architect & Microsoft Fabric Analytics Specialist<br>
                        <a href="https://dattasable.com/certification" target="_blank" style="color: #c9f31d; text-decoration: none; font-weight: 600;">
                          View Verified Microsoft & Google Credentials &rarr;
                        </a>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

            </td>
          </tr>

          <!-- CAN-SPAM Compliant Footer -->
          <tr>
            <td style="padding: 24px 32px 32px 32px; background-color: #080c13; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                You received this email because you signed up or joined the engineering community at <a href="https://dattasable.com" style="color: #94a3b8; text-decoration: underline;">dattasable.com</a>.
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569; line-height: 1.6;">
                Datta Sable Solutions • Pune, Maharashtra, India<br>
                <a href="${productionDomain}/unsubscribe?email=${encodeURIComponent(recipientEmail)}" style="color: #64748b; text-decoration: underline;">Unsubscribe Instantly</a> • 
                <a href="${productionDomain}/blog" style="color: #64748b; text-decoration: underline;">Read Past Dispatches</a> • 
                <a href="https://linkedin.com/in/dattasable" style="color: #64748b; text-decoration: underline;">LinkedIn</a>
              </p>
            </td>
          </tr>

        </table>
        <!-- End Main Email Container -->

      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export interface SendCampaignOptions {
  slug: string;
  title: string;
  shortStory: string;
  takeaways?: string[];
  customSubject?: string;
  category?: string;
  readTime?: number | string;
  imageUrl?: string | null;
  testEmailRecipient?: string; // If provided, sends ONLY to this email
}

export interface SendCampaignResult {
  success: boolean;
  mode: 'test' | 'broadcast';
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  errors?: string[];
  message: string;
}

/**
 * Execute email campaign broadcast to either a single test recipient
 * or the entire registered user database (77+ users and subscribers).
 */
export async function sendBlogCampaign(options: SendCampaignOptions): Promise<SendCampaignResult> {
  const {
    slug,
    title,
    shortStory,
    takeaways = [],
    customSubject,
    category,
    readTime,
    imageUrl,
    testEmailRecipient,
  } = options;

  const subject = customSubject?.trim() || `New Article: ${title} 🚀`;
  const fromAddress = `"Datta Sable" <${process.env.EMAIL_FROM || "hello@dattasable.com"}>`;

  // 1. Single Test Email Delivery Mode
  if (testEmailRecipient && testEmailRecipient.trim().length > 0) {
    const targetEmail = testEmailRecipient.trim().toLowerCase();
    const htmlContent = generateBlogCampaignHtml({
      recipientName: 'Datta (Test Recipient)',
      recipientEmail: targetEmail,
      title,
      slug,
      category,
      readTime,
      imageUrl,
      shortStory,
      takeaways,
      customSubject: subject,
    });

    try {
      await transporter.sendMail({
        from: fromAddress,
        to: targetEmail,
        subject: `[TEST] ${subject}`,
        html: htmlContent,
      });

      return {
        success: true,
        mode: 'test',
        totalRecipients: 1,
        sentCount: 1,
        failedCount: 0,
        message: `Test email successfully dispatched to ${targetEmail}`,
      };
    } catch (err: any) {
      console.error("Test email delivery failed:", err);
      return {
        success: false,
        mode: 'test',
        totalRecipients: 1,
        sentCount: 0,
        failedCount: 1,
        errors: [err.message || 'SMTP delivery failed'],
        message: `Failed to deliver test email: ${err.message}`,
      };
    }
  }

  // 2. Full Production Broadcast Mode (All Registered Users + Subscribers)
  try {
    const subscribers = (await prisma.$queryRaw`SELECT email FROM "Subscriber"`) as { email: string }[];
    const users = (await prisma.$queryRaw`SELECT name, email FROM "User" WHERE email IS NOT NULL`) as { name: string | null; email: string }[];

    // De-duplicate emails and retain user names
    const recipientMap = new Map<string, string>(); // email -> name
    users.forEach(u => {
      if (u.email && u.email.includes('@')) {
        recipientMap.set(u.email.trim().toLowerCase(), u.name || '');
      }
    });
    subscribers.forEach(s => {
      if (s.email && s.email.includes('@')) {
        const lower = s.email.trim().toLowerCase();
        if (!recipientMap.has(lower)) {
          recipientMap.set(lower, '');
        }
      }
    });

    const recipients = Array.from(recipientMap.entries()).map(([email, name]) => ({ email, name }));

    if (recipients.length === 0) {
      return {
        success: true,
        mode: 'broadcast',
        totalRecipients: 0,
        sentCount: 0,
        failedCount: 0,
        message: 'No recipients found in database.',
      };
    }

    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Batch dispatch with controlled concurrency (chunks of 5) to respect SMTP rate limits
    const chunkSize = 5;
    for (let i = 0; i < recipients.length; i += chunkSize) {
      const chunk = recipients.slice(i, i + chunkSize);
      const promises = chunk.map(async ({ email, name }) => {
        try {
          const htmlContent = generateBlogCampaignHtml({
            recipientName: name,
            recipientEmail: email,
            title,
            slug,
            category,
            readTime,
            imageUrl,
            shortStory,
            takeaways,
            customSubject: subject,
          });

          await transporter.sendMail({
            from: fromAddress,
            to: email,
            subject,
            html: htmlContent,
          });
          sentCount++;
        } catch (mailErr: any) {
          failedCount++;
          console.error(`Failed sending campaign to ${email}:`, mailErr.message);
          if (errors.length < 5) {
            errors.push(`${email}: ${mailErr.message}`);
          }
        }
      });

      await Promise.allSettled(promises);
      // Small pause between batches
      if (i + chunkSize < recipients.length) {
        await new Promise(res => setTimeout(res, 200));
      }
    }

    return {
      success: failedCount === 0 || sentCount > 0,
      mode: 'broadcast',
      totalRecipients: recipients.length,
      sentCount,
      failedCount,
      errors: errors.length > 0 ? errors : undefined,
      message: `Broadcast finished: ${sentCount} sent successfully, ${failedCount} failed out of ${recipients.length} recipients.`,
    };
  } catch (dbErr: any) {
    console.error("Failed to query recipients for campaign broadcast:", dbErr);
    return {
      success: false,
      mode: 'broadcast',
      totalRecipients: 0,
      sentCount: 0,
      failedCount: 0,
      errors: [dbErr.message || 'Database query failed'],
      message: `Broadcast aborted: ${dbErr.message}`,
    };
  }
}

/**
 * Backwards compatible helper called when a new blog is published
 */
export const notifySubscribersOfNewPost = async (
  title: string,
  slug: string,
  excerpt: string,
  image?: string | null
) => {
  try {
    const defaultStory = excerpt && excerpt.length > 20
      ? excerpt
      : `In our latest deep dive, we break down critical real-world architectures, performance pitfalls, and optimization strategies to elevate your data engineering workflows.`;

    await sendBlogCampaign({
      title,
      slug,
      shortStory: defaultStory,
      imageUrl: image,
    });
  } catch (err) {
    console.error("notifySubscribersOfNewPost error:", err);
  }
};

