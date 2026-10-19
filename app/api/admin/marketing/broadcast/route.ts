import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateBlogCampaignHtml, sendBlogCampaign } from '@/lib/mail';
import { posts as staticPosts } from '@/app/blog/data';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // 1. Calculate total unique email recipients (Users + Subscribers)
    const subscribers = (await prisma.$queryRaw`SELECT email FROM "Subscriber"`) as { email: string }[];
    const users = (await prisma.$queryRaw`SELECT email FROM "User" WHERE email IS NOT NULL`) as { email: string }[];

    const emailSet = new Set<string>();
    users.forEach(u => {
      if (u.email && u.email.includes('@')) emailSet.add(u.email.trim().toLowerCase());
    });
    subscribers.forEach(s => {
      if (s.email && s.email.includes('@')) emailSet.add(s.email.trim().toLowerCase());
    });

    const totalRecipients = emailSet.size;

    // 2. Fetch database posts
    const dbPosts = await prisma.post.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        excerpt: true,
        image: true,
        readTime: true,
        date: true,
        published: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // 3. Prepare formatted list of available posts (Static + DB)
    const postsList: Array<{
      slug: string;
      title: string;
      category: string;
      excerpt: string;
      image?: string | null;
      readTime?: number | string;
      date?: string;
    }> = [];

    const seenSlugs = new Set<string>();

    // Add recent static posts first
    staticPosts.slice(0, 15).forEach((p: any) => {
      if (!seenSlugs.has(p.slug)) {
        seenSlugs.add(p.slug);
        postsList.push({
          slug: p.slug,
          title: p.title,
          category: p.category || 'Architecture & BI',
          excerpt: p.excerpt || '',
          image: p.image || null,
          readTime: p.readTime || 15,
          date: p.date,
        });
      }
    });

    // Add DB posts
    dbPosts.forEach(p => {
      if (!seenSlugs.has(p.slug)) {
        seenSlugs.add(p.slug);
        postsList.push({
          slug: p.slug,
          title: p.title,
          category: p.category,
          excerpt: p.excerpt,
          image: p.image,
          readTime: p.readTime,
          date: p.date,
        });
      }
    });

    // 4. Default high-converting campaign template for the latest post
    const defaultPost = postsList[0] || {
      slug: 'pl-300-vs-dp-600-vs-dp-700-microsoft-certification-guide-2026',
      title: 'PL-300 vs DP-600 vs DP-700: The Definitive Microsoft Power BI & Fabric Certification Guide (2026)',
      category: 'Architecture & BI',
      excerpt: 'The ultimate 2026 engineering guide comparing PL-300, DP-600, and DP-700.',
      image: '/images/blog/dp-600-vs-dp-700-vs-dp-800-comparative-guide.webp',
      readTime: 36,
    };

    const defaultStory = `Last week, a senior data analyst reached out to me with a burning dilemma:

"Datta, I cleared my PL-300 two years ago, but recruiters are passing me over for senior Microsoft Fabric roles. Should I spend the next month cramming for DP-600, or should I skip it and jump straight into the brand-new DP-700 Fabric Data Engineer exam?"

It's a dilemma hundreds of data professionals, BI developers, and cloud engineers are wrestling with right now as Microsoft rapidly reshapes enterprise analytics around Fabric, OneLake, and Direct Lake.

Studying for the wrong certification costs months of precious preparation and leaves massive gaps in your actual architectural chops. That's why I spent the past few weeks breaking down every syllabus overlap, Direct Lake trapdoor, real exam difficulty rating, and salary benchmark into this comprehensive guide.`;

    const defaultTakeaways = [
      "PL-300 vs DP-600 vs DP-700 side-by-side syllabus breakdown and exact overlap percentages.",
      "The Direct Lake vs PySpark requirement matrix: which exam tests DAX optimizations vs Lakehouse engineering.",
      "The 2026 Career Decision Tree & Salary Benchmarks to pick the highest ROI credential for your goals."
    ];

    return NextResponse.json({
      success: true,
      totalRecipients,
      posts: postsList,
      defaultCampaign: {
        slug: defaultPost.slug,
        title: defaultPost.title,
        category: defaultPost.category,
        readTime: defaultPost.readTime,
        image: defaultPost.image,
        subject: `PL-300, DP-600, or DP-700? Which Fabric certification actually gets you hired in 2026? 🚀`,
        shortStory: defaultStory,
        takeaways: defaultTakeaways,
        testEmail: 'sabledattatray@gmail.com',
      },
    });
  } catch (error: any) {
    console.error('API Campaign GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load campaign data' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const {
      action, // 'preview' | 'test' | 'broadcast'
      slug,
      title,
      category,
      readTime,
      imageUrl,
      shortStory,
      takeaways,
      customSubject,
      testEmail,
    } = body;

    if (!slug || !title || !shortStory) {
      return NextResponse.json(
        { error: 'Post title, slug, and short story are required' },
        { status: 400 }
      );
    }

    // 1. PREVIEW ACTION: Generate and return HTML string without sending
    if (action === 'preview') {
      const html = generateBlogCampaignHtml({
        recipientName: 'Datta Sable',
        recipientEmail: 'subscriber@example.com',
        title,
        slug,
        category,
        readTime,
        imageUrl,
        shortStory,
        takeaways: Array.isArray(takeaways) ? takeaways : [],
        customSubject,
      });

      return NextResponse.json({ success: true, html });
    }

    // 2. TEST ACTION: Send only to test email
    if (action === 'test') {
      const targetTestEmail = testEmail?.trim() || 'sabledattatray@gmail.com';
      const result = await sendBlogCampaign({
        slug,
        title,
        category,
        readTime,
        imageUrl,
        shortStory,
        takeaways: Array.isArray(takeaways) ? takeaways : [],
        customSubject,
        testEmailRecipient: targetTestEmail,
      });

      return NextResponse.json(result);
    }

    // 3. BROADCAST ACTION: Send to all 77+ users & subscribers
    if (action === 'broadcast') {
      const result = await sendBlogCampaign({
        slug,
        title,
        category,
        readTime,
        imageUrl,
        shortStory,
        takeaways: Array.isArray(takeaways) ? takeaways : [],
        customSubject,
      });

      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: `Invalid action '${action}'. Expected 'preview', 'test', or 'broadcast'` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('API Campaign POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Campaign processing failed' },
      { status: 500 }
    );
  }
}
