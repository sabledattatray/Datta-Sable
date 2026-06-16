'use client';

import { motion } from 'framer-motion';
import { Globe, Code2, BarChart3, Layers, Zap, ShieldCheck, Star, CheckCircle2 } from 'lucide-react';

const testimonials = [
  {
    quote: "Datta built our entire company website from scratch using Next.js and Tailwind. It's blazing fast, fully SEO-optimised, and looks better than anything our previous agency delivered. Lighthouse score went from 54 to 97. He knows what he's doing.",
    author: "Arvind Sundaram",
    initials: "AS",
    role: "VP of Product",
    company: "APEXPAY SOLUTIONS",
    icon: Globe,
    color: "#c9f31d",
    tag: "Next.js · SEO",
    rating: 5,
  },
  {
    quote: "We needed a full-stack developer who could build both the frontend and the API layer. Datta delivered a clean React + Node.js app with proper auth, role management, and a PostgreSQL backend. No hand-holding required — he just gets things done.",
    author: "Vikram Malhotra",
    initials: "VM",
    role: "Engineering Director",
    company: "KALYANI TECH",
    icon: Code2,
    color: "#00C9F2",
    tag: "React · Node.js · API",
    rating: 5,
  },
  {
    quote: "Our Power BI dashboards were slow and unreliable. Datta restructured the data model, optimised our SQL queries, and set up automated refresh pipelines. Report load time dropped from 45 seconds to under 2 seconds. Genuinely impressive.",
    author: "Priya Sharma",
    initials: "PS",
    role: "Head of Analytics",
    company: "VERITAS HEALTH TECH",
    icon: BarChart3,
    color: "#a78bfa",
    tag: "Power BI · SQL",
    rating: 5,
  },
  {
    quote: "Datta redesigned our WordPress site with a custom theme, proper schema markup, and technical SEO fixes I had been ignoring for years. Organic traffic grew 3x within two months of launch. He treats every project like it's his own.",
    author: "Anil Deshmukh",
    initials: "AD",
    role: "Chief Marketing Officer",
    company: "CLOUDSCALE MEDIA",
    icon: Layers,
    color: "#fb923c",
    tag: "WordPress · SEO",
    rating: 5,
  },
  {
    quote: "We hired Datta to automate our monthly reporting workflows using Python. What used to take our team 4 days of manual Excel work now runs in 15 minutes on a schedule. The ROI was immediate. Would hire again without hesitation.",
    author: "Siddharth Mehta",
    initials: "SM",
    role: "Founder & CEO",
    company: "NEXALOGISTICS ENTERPRISE",
    icon: Zap,
    color: "#34d399",
    tag: "Python · Automation",
    rating: 5,
  },
  {
    quote: "Datta helped us set up a complete digital marketing infrastructure — landing pages in Next.js, Google Tag Manager, conversion tracking, and a CRM integration. Everything worked on day one. He's one of those rare developers who understands marketing too.",
    author: "Riya Kapoor",
    initials: "RK",
    role: "Growth Lead",
    company: "BRANDPULSE DIGITAL",
    icon: ShieldCheck,
    color: "#60a5fa",
    tag: "Digital Marketing · GTM",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section
      className="section"
      style={{
        background: 'var(--surface2)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dot mesh background */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(var(--accent) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      <div className="container relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="mono text-[10px] font-bold tracking-[0.25em] text-[var(--accent)] uppercase">
              VERIFIED_CLIENT_LOGS
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.85rem, 5vw, 3rem)',
            lineHeight: 1.1,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}>
            Trusted by <span style={{ color: 'var(--accent)' }}>Real Clients.</span>
          </h2>
          <p style={{
            color: 'var(--muted)',
            fontSize: '1rem',
            maxWidth: '580px',
            lineHeight: 1.7,
            fontFamily: "'Inter', sans-serif",
          }}>
            Honest reviews from founders, directors, and growth leads who hired me to build
            their web apps, dashboards, automations, and marketing systems.
          </p>
        </div>

        {/* Testimonials Grid — 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="group flex flex-col justify-between relative overflow-hidden"
                style={{
                  padding: '1.75rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  transition: 'border-color 0.35s ease, box-shadow 0.35s ease',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = t.color + '55';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px rgba(0,0,0,0.3), 0 0 0 1px ${t.color}22`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)';
                }}
              >
                {/* Top glow line on hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-[14px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${t.color}, transparent)` }}
                />

                {/* Card Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    {/* Company Icon */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${t.color}22, ${t.color}0a)`,
                        border: `1px solid ${t.color}44`,
                      }}
                    >
                      <Icon size={17} style={{ color: t.color }} />
                    </div>
                    <div>
                      <div className="mono text-[11px] font-bold text-[var(--text)] tracking-wider leading-none">{t.company}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle2 size={10} className="text-emerald-400 flex-shrink-0" />
                        <span className="text-[10px] text-[var(--muted)]">Verified Client</span>
                      </div>
                    </div>
                  </div>
                  {/* Stars */}
                  <div className="flex gap-0.5 flex-shrink-0">
                    {[...Array(t.rating)].map((_, s) => (
                      <Star key={s} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <p
                  className="text-[var(--muted)] group-hover:text-[var(--text)] transition-colors duration-300"
                  style={{ fontSize: '0.9rem', lineHeight: 1.75, fontStyle: 'italic', flexGrow: 1, marginBottom: '1.25rem' }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Tag pill */}
                <div className="mb-4">
                  <span
                    className="mono text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{
                      color: t.color,
                      background: `${t.color}14`,
                      border: `1px solid ${t.color}30`,
                    }}
                  >
                    {t.tag}
                  </span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] font-mono flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${t.color}33, ${t.color}11)`,
                      border: `1px solid ${t.color}44`,
                      color: t.color,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--text)]">{t.author}</div>
                    <div className="text-[11px] font-mono tracking-wide" style={{ color: t.color }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-14 pt-8 border-t border-[var(--border)]">
          {[
            { value: '6+', label: 'Verified Clients' },
            { value: '100%', label: 'Satisfaction Rate' },
            { value: '3x', label: 'Avg. Traffic Growth' },
            { value: '15 min', label: 'Workflow vs. 4 Days' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-[1.5rem] font-bold font-display" style={{ color: 'var(--accent)', letterSpacing: '-0.02em' }}>
                {stat.value}
              </div>
              <div className="mono text-[10px] text-[var(--muted)] uppercase tracking-widest mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
