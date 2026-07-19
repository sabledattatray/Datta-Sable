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

export const notifySubscribersOfNewPost = async (title: string, slug: string, excerpt: string, image?: string | null) => {
  try {
    const subscribers = await prisma.subscriber.findMany();
    if (subscribers.length === 0) return;

    const productionDomain = "https://dattasable.com";
    const imageUrl = image ? (image.startsWith('http') ? image : `${productionDomain}${image}`) : null;

    const emailPromises = subscribers.map(sub => 
      transporter.sendMail({
        from: `"Datta Sable" <${process.env.EMAIL_FROM || "contact@dattasable.com"}>`,
        to: sub.email,
        subject: `New Article: ${title} 📣`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #000; color: #fff; border-radius: 10px; border: 1px solid #1a1a1a;">
            <span style="font-family: monospace; font-size: 0.75rem; color: #c9f31d; text-transform: uppercase; letter-spacing: 0.2em;">Fresh off the Press</span>
            <h2 style="color: #fff; margin-top: 10px; margin-bottom: 20px; font-size: 1.6rem;">${title}</h2>
            
            ${imageUrl ? `
              <div style="margin-bottom: 25px; border-radius: 6px; overflow: hidden; border: 1px solid #222;">
                <img src="${imageUrl}" alt="${title}" style="width: 100%; height: auto; display: block;" />
              </div>
            ` : ''}

            <p style="color: #ccc; font-size: 1rem; line-height: 1.6; margin-bottom: 25px;">
              ${excerpt || "A new deep-dive technical article has just been published on dattasable.com. Click below to read the full guide."}
            </p>

            <div style="text-align: center; margin: 35px 0;">
              <a href="${productionDomain}/blog/${slug}" style="background-color: #c9f31d; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Read the Full Article &rarr;</a>
            </div>

            <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;">
            <p style="font-size: 11px; color: #666; text-align: center;">
              You received this email because you subscribed to the newsletter on dattasable.com. Unsubscribe at any time.
            </p>
          </div>
        `,
      })
    );

    await Promise.all(emailPromises);
  } catch (err) {
    console.error("Failed to notify subscribers:", err);
  }
};
