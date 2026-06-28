import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { sanitizeHtml } from '@/lib/sanitize';

interface Props {
  title: string;
  excerpt?: string | null;
  content: string;
}

export default function DynamicPageRenderer({ title, excerpt, content }: Props) {
  const cleanContent = sanitizeHtml(content);

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
              {title}
            </h1>
            
            {excerpt && (
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
                {excerpt}
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
      </div>

      <Footer />
    </div>
  );
}
