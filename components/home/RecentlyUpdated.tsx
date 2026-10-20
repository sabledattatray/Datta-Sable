import Link from 'next/link';
type RecentPost = { slug: string; title: string; date?: string | Date | null; updatedAt?: string | Date | null };
export default function RecentlyUpdated({ posts = [] }: { posts?: RecentPost[] }) {
  if (!posts.length) return null;
  return <section className="section" style={{ padding: '2rem 0', borderTop: '1px solid var(--border)' }}>
    <div className="container"><h2 style={{ fontSize: '1.3rem', marginBottom: 16 }}>Recent guides</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{posts.slice(0, 3).map(post => {
        const date = new Date(post.updatedAt || post.date || '');
        return <Link key={post.slug} href={'/blog/' + post.slug} className="card p-4">
          <h3>{post.title}</h3>{Number.isFinite(date.getTime()) && <p style={{ color: 'var(--muted)', marginTop: 8 }}>
            {date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' })}
          </p>}
        </Link>;
      })}</div>
    </div>
  </section>;
}
