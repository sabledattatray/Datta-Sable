'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import RelatedContent from '@/components/RelatedContent';
import { motion } from 'framer-motion';
import { Database, Server, Zap, Shield, BarChart, ArrowRight, Code, Cpu } from 'lucide-react';
import Link from 'next/link';

export default function DataEngineeringPillar() {
  const clusters = [
    {
      title: "AI Infrastructure",
      desc: "Architecting the backbone of modern agentic systems.",
      links: [
        { name: "Execution Chain Infrastructure", href: "/blog/execution-chain-infrastructure-explained" },
        { name: "Modular AI Workflow Systems", href: "/blog/building-modular-ai-workflow-systems" },
        { name: "RFC-001: Prompt Hardening", href: "/knowledge/rfc/001-prompt-hardening" }
      ]
    },
    {
      title: "Business Intelligence",
      desc: "Transforming raw data into executive-grade decision clarity.",
      links: [
        { name: "Strategic BI Guide 2026", href: "/blog/strategic-bi-guide-india-2026" },
        { name: "Surgical UI Principles", href: "/blog/mastering-surgical-ui-dashboard-engineering" },
        { name: "BI ROI Calculator", href: "/tools/bi-roi-calculator" }
      ]
    },
    {
      title: "High-Performance Analytics",
      desc: "Sub-second processing for massive datasets.",
      links: [
        { name: "10M-Row AI-BI Agent", href: "/blog/engineering-10m-row-ai-bi-agent" },
        { name: "DuckDB & In-Process OLAP", href: "/blog/engineering-10m-row-ai-bi-agent" },
        { name: "Fraud Sentinel Architecture", href: "/blog/architecting-10m-record-fraud-sentinel" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar />
      
      <main className="boxed-wrapper py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Breadcrumbs />

          {/* Hero Section */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Database className="text-[var(--accent)]" size={24} />
              <span className="label-tech">PILLAR_HUB // DATA_ENGINEERING</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase leading-none">
              Data <span className="hero-title">Engineering</span> & AI Infrastructure
            </h1>
            <p className="text-[var(--muted)] text-xl max-w-3xl leading-relaxed">
              A comprehensive directory of technical frameworks, architectural RFCs, and strategic deep-dives for building high-fidelity data ecosystems.
            </p>
          </div>

          {/* Cluster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {clusters.map((cluster, idx) => (
              <div key={idx} className="space-y-6">
                <div className="p-6 bg-[var(--surface2)] border border-[var(--border)] relative overflow-hidden h-full flex flex-col">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)] opacity-50" />
                  <h3 className="text-lg font-black uppercase mb-2">{cluster.title}</h3>
                  <p className="text-[12px] text-[var(--muted)] mb-8 flex-grow">{cluster.desc}</p>
                  
                  <div className="space-y-4">
                    {cluster.links.map((link, lIdx) => (
                      <Link key={lIdx} href={link.href} className="group flex items-center justify-between no-underline p-3 bg-black/20 border border-[var(--border)] hover:border-[var(--accent)] transition-all">
                        <span className="text-[11px] font-bold uppercase tracking-tight group-hover:text-[var(--accent)] transition-colors">{link.name}</span>
                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Manifesto */}
          <div className="bg-[var(--surface)] border border-[var(--border)] p-12 relative overflow-hidden mb-24">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Cpu size={120} />
            </div>
            <h2 className="text-3xl font-black uppercase mb-8">The Engineering Standard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="font-bold flex items-center gap-2">
                  <Zap size={16} className="text-[var(--accent)]" /> Deterministic Execution
                </h4>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  We move beyond simple prompting. Our systems are built on "Execution Chains" that prioritize state persistence, error isolation, and schema enforcement.
                </p>
              </div>
              <div className="space-y-6">
                <h4 className="font-bold flex items-center gap-2">
                  <Shield size={16} className="text-[var(--accent)]" /> Data Integrity
                </h4>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Every data point is audited. Using in-process OLAP engines like DuckDB, we ensure sub-second analytical response times even on datasets exceeding 10M records.
                </p>
              </div>
            </div>
          </div>

          <RelatedContent />
        </div>
      </main>

      <Footer />
    </div>
  );
}
