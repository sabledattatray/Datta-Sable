import Link from 'next/link';

export default function NotFound() {
  return <section className="container" style={{ paddingTop: '8rem', paddingBottom: '6rem', minHeight: '75vh', maxWidth: 800 }}>
    <p style={{ color: 'var(--accent)', marginBottom: 16 }}>404</p>
    <h1 style={{ fontSize: '2.5rem', marginBottom: 24 }}>Page not found</h1>
    <p style={{ marginBottom: 24 }}>We could not find the page you requested. Browse the articles or return to the homepage to continue.</p>
    <div className="flex flex-wrap gap-4">
      <Link href="/blog" className="btn-primary">Browse articles</Link>
      <Link href="/" className="btn-primary">Go to homepage</Link>
    </div>
  </section>;
}
