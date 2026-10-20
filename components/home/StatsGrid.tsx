export default function StatsGrid({ articleCount, categoryCount }: { articleCount: number; categoryCount: number }) {
  return <section className="section" style={{ background: 'var(--surface2)', padding: '3rem 0' }}>
    <div className="container"><h2 style={{ fontSize: '2rem', marginBottom: 24 }}>Explore the publication</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="card p-8"><p style={{ fontSize: '2.5rem', color: 'var(--accent)' }}>{articleCount}</p><p>Published articles</p></div>
        <div className="card p-8"><p style={{ fontSize: '2.5rem', color: 'var(--accent)' }}>{categoryCount}</p><p>Article categories</p></div>
      </div>
    </div>
  </section>;
}
