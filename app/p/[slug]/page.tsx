import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { sanitizeHtml } from '@/lib/sanitize';

export const revalidate = 3600; // Revalidate dynamic pages every hour

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const pages = await prisma.page.findMany({
      select: { slug: true },
      where: { published: true }
    });
    return pages.map(p => ({ slug: p.slug }));
  } catch (e) {
    console.warn('Could not query database slugs for custom pages generateStaticParams:', e);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = 'https://dattasable.com';

  const page = await prisma.page.findUnique({
    where: { slug }
  }).catch(() => null);

  if (!page) return { title: 'Page Not Found' };

  return {
    title: `${page.title} | Datta Sable`,
    description: page.excerpt || 'Custom Dynamic Page',
    alternates: {
      canonical: `${baseUrl}/p/${slug}`,
    },
    openGraph: {
      title: page.title,
      description: page.excerpt || 'Custom Dynamic Page',
      url: `${baseUrl}/p/${slug}`,
      type: 'website',
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function CustomPage({ params }: Props) {
  const { slug } = await params;

  const page = await prisma.page.findUnique({
    where: { slug }
  }).catch(() => null);

  if (!page || !page.published) {
    notFound();
  }

  const cleanContent = sanitizeHtml(page.content);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div 
        className="boxed-wrapper" 
        style={{ 
          position: 'relative', 
          marginBottom: '60px', 
          flex: 1, 
          paddingTop: 'clamp(8rem, 12vw, 10rem)'
        }}
      >
        {/* ── Top-left Precision Crosshair ── */}
        <div style={{ position: 'absolute', top: 'clamp(6rem, 10vw, 8rem)', left: '-20px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(201, 243, 29, 0.4)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', width: '1px', height: '24px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '24px', height: '1px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '4px', height: '4px', background: 'var(--accent)', borderRadius: '50%' }} />
        </div>

        <section className="section" style={{ minHeight: '50vh' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
            <h1 
              style={{ 
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', 
                fontWeight: 900, 
                color: 'var(--text)', 
                lineHeight: 1.1, 
                marginBottom: '1.5rem', 
                letterSpacing: '-0.03em' 
              }}
            >
              {page.title}
            </h1>
            
            {page.excerpt && (
              <p 
                style={{ 
                  fontSize: '1.15rem', 
                  color: 'var(--muted)', 
                  lineHeight: 1.6, 
                  marginBottom: '2.5rem', 
                  fontStyle: 'italic',
                  borderLeft: '3px solid var(--accent)',
                  paddingLeft: '1rem'
                }}
              >
                {page.excerpt}
              </p>
            )}

            <div 
              className="prose prose-slate dark:prose-invert max-w-none"
              style={{ 
                fontSize: '1.05rem', 
                lineHeight: 1.8, 
                color: 'var(--text-muted)' 
              }}
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />
          </div>
        </section>

        {/* ── Bottom-right Precision Crosshair ── */}
        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(201, 243, 29, 0.4)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', width: '1px', height: '24px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '24px', height: '1px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '4px', height: '4px', background: 'var(--accent)', borderRadius: '50%' }} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
