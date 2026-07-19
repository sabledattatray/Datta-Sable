import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogList from '@/components/BlogList';
import SchemaScript from '@/components/SchemaScript';
import { filterPostsByCategory, getPublishedBlogPosts } from '@/lib/blog-posts';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${categoryName} Articles | Datta Sable`,
    description: `Browse all articles in the ${categoryName} category on Datta Sable. Expert guides on Microsoft Fabric, Power BI, SQL, data engineering, and AI workflows.`,
    alternates: { canonical: `https://dattasable.com/category/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${categoryName} Articles | Datta Sable`,
      description: `Browse all ${categoryName} articles by Datta Sable — BI Expert & Data Engineer.`,
      url: `https://dattasable.com/category/${slug}`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  
  // Format slug to Category Name (e.g., 'web-development' -> 'Web Development')
  const categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  let posts: any[] = [];
  try {
    posts = filterPostsByCategory(await getPublishedBlogPosts(), categoryName, slug);
  } catch (error) {
    console.error(`Failed to retrieve category posts for ${slug}:`, error);
  }

  let titleText = `Posts in ${categoryName}`;
  let subtitleText = `Explore deep-dive technical architectures, benchmarks, and optimization tutorials.`;

  if (slug === 'microsoft-fabric') {
    titleText = `Learn Microsoft Fabric: 15-Part Series`;
    subtitleText = `A structured learning journey covering OneLake, capacity optimization, Direct Lake mode, and data pipelines.`;
  } else if (slug === 'power-bi') {
    titleText = `Master Power BI: 22-Part Series`;
    subtitleText = `Advanced DAX modeling, query folding optimizations, incremental refreshes, and enterprise scale architectures.`;
  } else if (slug === 'nextjs') {
    titleText = `Next.js 15 SEO & Performance: 18-Part Series`;
    subtitleText = `Complete developer guide to React Server Components, metadata management, fast indexing, and PageSpeed optimizations.`;
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '40px' }}>
        <section className="section" style={{ paddingTop: 'clamp(8rem, 12vw, 10rem)' }}>
          <div className="container" style={{ marginBottom: '4rem' }}>
             <div className="label-tech mb-4">
               {slug === 'microsoft-fabric' || slug === 'power-bi' || slug === 'nextjs' 
                 ? 'CURATED LEARNING PATH' 
                 : `CATEGORY_ARCHIVE // ${slug.toUpperCase()}`}
             </div>
             <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 42px)', fontWeight: 600, lineHeight: 1.2 }}>
               {slug === 'microsoft-fabric' || slug === 'power-bi' || slug === 'nextjs' ? (
                 <>
                   {titleText.split(':')[0]}: <span className="hero-title">{titleText.split(':')[1]}</span>
                 </>
               ) : (
                 titleText
               )}
             </h1>
             <p style={{ color: 'var(--muted)', marginTop: '1rem', maxWidth: '600px', lineHeight: 1.6, fontSize: '15px' }}>
               {subtitleText}
             </p>
          </div>
          <BlogList initialPosts={posts as any} />
        </section>
      </div>
      <Footer />
      {/* CollectionPage schema — rendered server-side */}
      <SchemaScript schema={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${categoryName} Articles`,
        "description": `All articles in the ${categoryName} category on Datta Sable. Expert guides on Microsoft Fabric, Power BI, SQL, data engineering, and AI.`,
        "url": `https://dattasable.com/category/${slug}`,
        "author": { "@id": "https://dattasable.com/#person" },
        "publisher": { "@id": "https://dattasable.com/#organization" },
        "isPartOf": { "@id": "https://dattasable.com/#website" }
      }} />
    </div>
  );
}
