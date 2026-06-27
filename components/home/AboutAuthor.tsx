'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Download, BookOpen, Award, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AboutAuthor() {
  const learningTracks = [
    "Microsoft Fabric architecture & scaling",
    "Power BI performance optimization & DAX modeling",
    "SQL database tuning & logical query profiling",
    "Next.js 15 production deployments & App Router SEO",
    "n8n cloud workflow automation systems",
    "Real-world data engineering case studies"
  ];

  const resources = [
    { title: "Microsoft Fabric Roadmap Guide", desc: "Step-by-step master plan for capacity provisioning and OneLake architectures.", file: "/blog/microsoft-fabric-certification-roadmap-2026" },
    { title: "DP-600 Analytics Study Guide", desc: "Detailed study guide & test preparation topics for Microsoft certification.", file: "/blog/dp-600-study-guide-2026" },
    { title: "Enterprise SQL Tuning Guide", desc: "Top 10 index optimizations & execution plan analysis commands.", file: "/blog/beyond-the-select-advanced-sql-for-bi" },
    { title: "Power BI DAX Performance Patterns", desc: "Standard formulas for lightning-fast incremental refreshes.", file: "/blog/mastering-dax-patterns-2026" },
    { title: "Next.js 15 SEO Production Guide", desc: "Core Web Vitals auditing steps & schema structured markup guide.", file: "/blog/nextjs-15-react-19-performance-manifesto-2026" }
  ];

  return (
    <section className="section" style={{ background: 'var(--bg)', padding: '5rem 0', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Column 1: What You'll Learn (7cols) */}
          <div className="lg:col-span-7">
            <div className="label-tech mb-6 text-[var(--accent)]">EDUCATIONAL_MISSION // PATH</div>
            <h2 style={{ fontSize: '2.5rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: '1.5rem' }}>
              What You&apos;ll <span className="hero-title">Learn Here</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              A growing collection of practical tutorials, architecture guides, certification resources, and real-world implementation examples.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {learningTracks.map((track, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-[var(--accent)] mt-1 flex-shrink-0" />
                  <span style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--text)' }}>
                    {track}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-[var(--surface2)] border border-[var(--border)] rounded-sm max-w-xl">
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={16} className="text-[var(--accent)]" /> Rooted in Experience
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Everything published on this website comes from:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {[
                  "✔ client implementations",
                  "✔ personal experiments",
                  "✔ certification studies",
                  "✔ production projects",
                  "✔ documented benchmarks"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[12px] text-[var(--text)] font-semibold mono">
                    <span className="text-[var(--accent)] font-bold">{item.split(' ')[0]}</span>
                    <span>{item.substring(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Free Resource Sheets (5cols) */}
          <div className="lg:col-span-5 bg-[var(--surface2)] border border-[var(--border)] rounded-sm p-8">
            <h3 style={{ fontSize: '1.25rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} className="text-[var(--accent)]" /> Featured Resources
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.5 }}>
              Access our curated technical roadmap checklists, cheat sheets, and deep-dive optimization tutorials.
            </p>

            <div className="flex flex-col gap-4">
              {resources.map((res, i) => (
                <Link
                  key={i}
                  href={res.file}
                  className="group flex items-start gap-4 p-4 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all duration-300 rounded-sm no-underline"
                >
                  <div className="p-2 bg-[var(--surface2)] text-[var(--muted)] group-hover:text-[var(--accent)] rounded transition-colors mt-0.5">
                    <BookOpen size={15} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--text)' }}>
                      {res.title}
                    </h4>
                    <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
                      {res.desc}
                    </p>
                    <div className="inline-flex items-center gap-1 text-[9px] mono uppercase font-bold text-[var(--accent)]">
                      <BookOpen size={10} /> Read Free Guide
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
