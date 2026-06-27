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
    robots: { index: false, follow: true },
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

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '40px' }}>
        <section className="section" style={{ paddingTop: 'clamp(8rem, 12vw, 10rem)' }}>
          <div className="container" style={{ marginBottom: '4rem' }}>
             <div className="label-tech mb-4">CATEGORY_ARCHIVE // {slug.toUpperCase()}</div>
             <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 48px)', fontWeight: 600 }}>
               Posts in <span className="hero-title">{categoryName}</span>
             </h1>
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
