import { Pen, Code2, BarChart3, Globe, Cpu, Search } from 'lucide-react';
import HeroInteraction from './HeroInteraction';
import Image from 'next/image';

export default function Hero() {
  return (
    <section
      className="section hero-grid-inline"
      style={{
        minHeight: '600px',
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '6rem 0 2rem 0',
        backgroundColor: 'var(--bg)',
      }}
    >
      {/* Right-side visual */}
      <div
        id="hero-visual-container"
        className="hidden lg:block absolute top-[45%] right-[1px] -translate-y-1/2 w-[55%] z-0 pointer-events-none overflow-hidden lg:h-[80vh] hero-visual-container"
      >
        <div className="relative w-full h-full">
          <Image
            src="/hero-bg.webp"
            alt="Datta Sable — Content Creator, Web Developer & Digital Marketing Professional"
            fill
            priority
            quality={60}
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
            style={{ objectPosition: 'center top' }}
          />
        </div>
        <div className="absolute inset-0 z-10 pointer-events-none hero-gradient-overlay" />
        <div className="block lg:hidden hero-mobile-fade" />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 640 }}>

          {/* Eyebrow — who I am */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-[1px] w-6 bg-[var(--accent)] flex-shrink-0" />
            <span className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)] whitespace-nowrap">
              <span className="lg:hidden">Creator · Dev · Marketing</span>
              <span className="hidden lg:inline">Content Creator · Web Developer · Digital Marketing</span>
            </span>
          </div>

          {/* H1 — crystal clear identity, passes 5-second test */}
          <h1
            className="hero-title-inline"
            style={{
              fontSize: 'clamp(2.4rem, 7.5vw, 62px)',
              marginBottom: '1.5rem',
              display: 'block',
            }}
          >
            Hi, I&apos;m Datta Sable
          </h1>

          {/* Sub-headline — what visitors get */}
          <p style={{
            color: 'var(--text)',
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            marginBottom: '1.75rem',
            lineHeight: 1.7,
            opacity: 0.85,
          }}>
            I publish practical tutorials on <strong>Microsoft Fabric</strong>, <strong>Power BI</strong>,{' '}
            <strong>SQL</strong>, <strong>Next.js</strong>, and <strong>AI Automation</strong>—helping developers and data professionals build faster, more reliable systems.
          </p>

          {/* Core metrics grid — replaces quote block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ marginBottom: '2.25rem' }}>
            {[
              { value: "190+", label: "Technical Articles" },
              { value: "25+", label: "Interactive Tools" },
              { value: "300+", label: "Published Resources" },
              { value: "Weekly", label: "Updated" }
            ].map(metric => (
              <div key={metric.label} className="p-3 bg-[var(--surface2)] border border-[var(--border)] rounded-sm text-center">
                <div className="mono text-[16px] font-bold text-[var(--accent)]">{metric.value}</div>
                <div className="mono text-[9px] uppercase tracking-wider text-[var(--muted)] mt-1">{metric.label}</div>
              </div>
            ))}
          </div>

          <HeroInteraction />

          <div style={{ height: '2rem' }} />

          {/* Topic icons — reflects actual content */}
          <div className="relative w-full overflow-hidden no-scrollbar py-4">
            <div className="hidden lg:flex items-center gap-x-10">
              {[
                { icon: <Pen size={16} />, label: 'AI Tutorials' },
                { icon: <Code2 size={16} />, label: 'Next.js' },
                { icon: <Search size={16} />, label: 'SEO' },
                { icon: <Globe size={16} />, label: 'WordPress' },
                { icon: <BarChart3 size={16} />, label: 'Power BI' },
                { icon: <Cpu size={16} />, label: 'Automation' },
              ].map((topic) => (
                <div key={topic.label} className="flex items-center gap-2 flex-shrink-0">
                  <div style={{ color: 'var(--accent)' }}>{topic.icon}</div>
                  <span className="mono text-[11px] text-[var(--muted)] uppercase tracking-[0.15em]">
                    {topic.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile marquee */}
            <div className="flex lg:hidden overflow-hidden">
              <div className="animate-marquee flex items-center gap-x-8 pr-8">
                {[
                  { icon: <Pen size={16} />, label: 'AI Tutorials' },
                  { icon: <Code2 size={16} />, label: 'Next.js' },
                  { icon: <Search size={16} />, label: 'SEO' },
                  { icon: <Globe size={16} />, label: 'WordPress' },
                  { icon: <BarChart3 size={16} />, label: 'Power BI' },
                  { icon: <Cpu size={16} />, label: 'Automation' },
                  { icon: <Pen size={16} />, label: 'AI Tutorials' },
                  { icon: <Code2 size={16} />, label: 'Next.js' },
                  { icon: <Search size={16} />, label: 'SEO' },
                  { icon: <Globe size={16} />, label: 'WordPress' },
                ].map((topic, idx) => (
                  <div key={`${topic.label}-${idx}`} className="flex items-center gap-2 flex-shrink-0">
                    <div style={{ color: 'var(--accent)' }}>{topic.icon}</div>
                    <span className="mono text-[11px] text-[var(--muted)] uppercase tracking-[0.15em] whitespace-nowrap">
                      {topic.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
