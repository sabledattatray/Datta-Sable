'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Workflow, Terminal, Network } from 'lucide-react';

const SOLUTIONS = [
  {
    icon: <Terminal className="text-[var(--accent)]" size={28} />,
    title: "Structured Prompt Architecture",
    desc: "Moving from guessing to engineering. Precision-built prompts for consistent output."
  },
  {
    icon: <Workflow className="text-[var(--accent)]" size={28} />,
    title: "Automation Pipelines",
    desc: "Connect modular AI systems into reliable end-to-end data pipelines."
  },
  {
    icon: <Network className="text-[var(--accent)]" size={28} />,
    title: "Execution Precision",
    desc: "Deploy execution chains that handle complex multi-step digital operations with verifiable precision."
  }
];

export default function Solution() {
  return (
    <section className="section" style={{ background: 'var(--surface2)', overflow: 'hidden', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
      <div className="container">
        <div className="max-w-3xl mb-24">
          <div className="label-tech mb-6">The Solution</div>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontFamily: "'Syne', sans-serif" }}>
            A structured <span style={{ color: 'var(--accent)' }}>AI workflow system.</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.2rem', lineHeight: 1.6 }}>
            Surgical AI Workspace gives you a repeatable infrastructure for building 
            AI-driven systems that actually deliver.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SOLUTIONS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, borderColor: 'var(--accent)' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="card group"
              style={{ padding: '3rem 2rem', background: 'var(--bg)', border: '1px solid var(--border)', transition: 'all 0.4s ease' }}
            >
              <div className="mb-8 p-4 bg-[var(--surface2)] w-fit rounded-sm group-hover:bg-[var(--accent)] group-hover:text-black transition-colors duration-500">
                {s.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>{s.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{s.desc}</p>
              
              <div className="mt-8 flex items-center gap-2 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <CheckCircle2 size={16} />
                <span className="mono text-[length:var(--text-small)] uppercase tracking-widest">System Ready</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
