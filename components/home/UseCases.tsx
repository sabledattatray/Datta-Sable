'use client';

import { motion } from 'framer-motion';
import { PenTool, Code, Megaphone, Briefcase } from 'lucide-react';

export default function UseCases() {
  const useCases = [
    {
      role: "Content Creators",
      icon: <PenTool size={20} />,
      benefit: "Automate content pipelines",
      desc: "Turn your unique knowledge into a content machine. Structured prompts ensure your brand voice scales across 100+ posts without burnout."
    },
    {
      role: "Developers",
      icon: <Code size={20} />,
      benefit: "AI-assisted workflow systems",
      desc: "Stop boilerplate. Build custom AI execution chains that handle repetitive coding tasks and data transformations automatically."
    },
    {
      role: "Marketers",
      icon: <Megaphone size={20} />,
      benefit: "Campaign + Copy automation",
      desc: "Scale your reach without scaling your headcount. Deploy precision-tuned copy automation that adapts to any campaign intent."
    },
    {
      role: "Founders",
      icon: <Briefcase size={20} />,
      benefit: "Operational AI systems",
      desc: "The 'COO in a Box.' Systematize your business operations with structured AI workflows that handle logic and execution."
    }
  ];

  return (
    <section className="section" style={{ background: 'var(--surface2)', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
      <div className="container">
        <div className="mb-16">
          <div className="label-tech mb-6">Target Segments</div>
          <h2 style={{ fontSize: '2.5rem', fontFamily: "'Syne', sans-serif" }}>
            Built for <span style={{ color: 'var(--accent)' }}>technical creators.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.role}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="card group hover:bg-[var(--bg)] transition-all duration-500"
              style={{ padding: '2.5rem' }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-[var(--bg)] rounded-sm group-hover:bg-[var(--accent)] group-hover:text-black transition-colors duration-500">
                  {uc.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{uc.role}</h3>
                  <div className="text-[length:var(--text-small)] mono text-[var(--accent)] tracking-widest uppercase mt-1">
                    {uc.benefit}
                  </div>
                </div>
              </div>
              <p style={{ color: 'var(--muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                {uc.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
