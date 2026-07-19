import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { notifySubscribersOfNewPost } from '@/lib/mail';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Group page views by URL to get real REACH/view counts
    const pageViews = await prisma.pageView.groupBy({
      by: ['url'],
      _count: {
        id: true,
      },
    });

    // Build URL view counts map (lowercased)
    const viewMap: Record<string, number> = {};
    pageViews.forEach((pv) => {
      if (pv.url) {
        viewMap[pv.url.toLowerCase()] = pv._count.id;
      }
    });

    // Enrich each post with the real view count
    const postsWithViews = posts.map((post) => {
      const blogUrl = `/blog/${post.slug}`.toLowerCase();
      const count = viewMap[blogUrl] || 0;
      return {
        ...post,
        views: count.toString(),
      };
    });

    return NextResponse.json(postsWithViews);
  } catch (error) {
    console.error('API Blog GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
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
      title,
      slug,
      category,
      excerpt,
      content,
      readTime,
      image,
      color,
      icon,
      published,
      date,
      blocks,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.post.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Slug must be unique. An article with this slug already exists.' },
        { status: 400 }
      );
    }

    const postDate = date || new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        category: category || 'Tech Trends',
        excerpt: excerpt || '',
        content,
        readTime: Number(readTime) || 3,
        image: image || null,
        color: color || null,
        icon: icon || null,
        published: published ?? true,
        date: postDate,
        blocks: blocks || null,
      },
    });

    if (post.published) {
      notifySubscribersOfNewPost(post.title, post.slug, post.excerpt || '', post.image).catch(err => {
        console.error('Failed to notify subscribers of new post:', err);
      });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('API Blog POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
