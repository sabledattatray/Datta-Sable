'use client';

import { motion, Variants } from 'framer-motion';
import { Database, Cpu, GitBranch, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

const NODE_VARIANTS: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
};

const PATH_VARIANTS: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { 
    pathLength: 1, 
    opacity: 1,
    transition: { duration: 1.5, ease: "easeInOut" }
  },
};

export default function ArchitectureViz() {
  return (
    <section className="section" style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', overflow: 'hidden', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
      <div className="container">
        <div className="mb-20">
          <div className="label-tech mb-6 text-[var(--accent)]">System Architecture</div>
          <h2 style={{ fontSize: '2.5rem', fontFamily: "'Syne', sans-serif" }}>
            The <span style={{ color: 'var(--accent)' }}>Surgical Workflow</span> Chain
          </h2>
          <p className="mt-4" style={{ color: 'var(--muted)', maxWidth: '500px', lineHeight: 1.6 }}>
            Visualizing the transformation from scattered data to production-ready automation systems.
          </p>
        </div>

        <div className="relative border border-[var(--border)] bg-[var(--surface2)] rounded-sm overflow-hidden" style={{ padding: '4rem 3rem' }}>
          {/* Blueprint Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          {/* Desktop Flow (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center justify-between relative z-10 max-w-5xl mx-auto">
            
            {/* Node 1: Input */}
            <div className="flex flex-col items-center gap-6">
              <motion.div 
                variants={NODE_VARIANTS} initial="initial" whileInView="animate" viewport={{ once: true }}
                className="w-20 h-20 rounded-full border border-indigo-500/30 bg-indigo-500/5 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.1)]"
              >
                <Database className="text-indigo-500" size={32} />
              </motion.div>
              <div className="text-center">
                <p className="mono text-[length:var(--text-small)] text-indigo-500 uppercase tracking-widest mb-1 font-bold">Source: Scattered</p>
                <h3 className="text-[14px] font-bold">Unstructured Data</h3>
              </div>
            </div>

            {/* Path 1-2 */}
            <div className="flex-1 px-8 relative">
              <svg className="w-full h-8 overflow-visible">
                <motion.path 
                  d="M 0 16 L 200 16" fill="transparent" stroke="var(--border)" strokeWidth="1" strokeDasharray="5,5"
                  variants={PATH_VARIANTS} initial="initial" whileInView="animate" viewport={{ once: true }}
                />
                <motion.circle r="3" fill="var(--accent)"
                  cx={0}
                  cy={16}
                  initial={{ cx: 0, opacity: 0 }}
                  animate={{ cx: [0, 200], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </svg>
            </div>

            {/* Node 2: Processing */}
            <div className="flex flex-col items-center gap-6">
              <motion.div 
                variants={NODE_VARIANTS} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ delay: 0.3 }}
                className="w-20 h-20 rounded-full border border-[var(--accent)] bg-[var(--accent)]/5 flex items-center justify-center shadow-[0_0_30px_rgba(var(--accent-rgb),0.1)]"
              >
                <Cpu className="text-[var(--accent)]" size={32} />
              </motion.div>
              <div className="text-center">
                <p className="mono text-[length:var(--text-small)] text-[var(--accent)] uppercase tracking-widest mb-1 font-bold">Module: Surgical™</p>
                <h3 className="text-[14px] font-bold">Logic Processing</h3>
              </div>
            </div>

            {/* Path 2-3 */}
            <div className="flex-1 px-8 relative">
              <svg className="w-full h-8 overflow-visible">
                <motion.path 
                  d="M 0 16 L 200 16" fill="transparent" stroke="var(--border)" strokeWidth="1" strokeDasharray="5,5"
                  variants={PATH_VARIANTS} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ delay: 0.6 }}
                />
                <motion.circle r="3" fill="#fff134"
                  cx={0}
                  cy={16}
                  initial={{ cx: 0, opacity: 0 }}
                  animate={{ cx: [0, 200], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
                />
              </svg>
            </div>

            {/* Node 3: Orchestration */}
            <div className="flex flex-col items-center gap-6">
              <motion.div 
                variants={NODE_VARIANTS} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ delay: 0.6 }}
                className="w-20 h-20 rounded-full border border-yellow-500/30 bg-yellow-500/5 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.1)]"
              >
                <GitBranch className="text-yellow-500" size={32} />
              </motion.div>
              <div className="text-center">
                <p className="mono text-[length:var(--text-small)] text-yellow-500 uppercase tracking-widest mb-1 font-bold">Layer: n8n Flow</p>
                <h3 className="text-[14px] font-bold">Orchestration</h3>
              </div>
            </div>

            {/* Path 3-4 */}
            <div className="flex-1 px-8 relative">
              <svg className="w-full h-8 overflow-visible">
                <motion.path 
                  d="M 0 16 L 200 16" fill="transparent" stroke="var(--border)" strokeWidth="1" strokeDasharray="5,5"
                  variants={PATH_VARIANTS} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ delay: 0.9 }}
                />
                <motion.circle r="3" fill="#00d4ff"
                  cx={0}
                  cy={16}
                  initial={{ cx: 0, opacity: 0 }}
                  animate={{ cx: [0, 200], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                />
              </svg>
            </div>

            {/* Node 4: Output */}
            <div className="flex flex-col items-center gap-6">
              <motion.div 
                variants={NODE_VARIANTS} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ delay: 0.9 }}
                className="w-20 h-20 rounded-full border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.1)]"
              >
                <Zap className="text-cyan-500" size={32} />
              </motion.div>
              <div className="text-center">
                <p className="mono text-[length:var(--text-small)] text-cyan-500 uppercase tracking-widest mb-1 font-bold">Status: Production</p>
                <h3 className="text-[14px] font-bold">Automation System</h3>
              </div>
            </div>

          </div>

          {/* Mobile Flow (Animated vertical list) */}
          <div className="lg:hidden flex flex-col gap-12 relative z-10 items-center">
            
            {/* Node 1 */}
            <motion.div 
              variants={NODE_VARIANTS} initial="initial" whileInView="animate" viewport={{ once: true }}
              className="flex flex-col items-center gap-4 text-center"
            >
               <div className="w-16 h-16 rounded-full border border-indigo-500/30 bg-indigo-500/5 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.05)]">
                 <Database className="text-indigo-500" size={24} />
               </div>
               <div><p className="mono text-[length:var(--text-small)] text-indigo-500 uppercase tracking-widest mb-0.5 font-bold">SOURCE</p><h3 className="text-[length:var(--text-small)] font-bold">Unstructured Data</h3></div>
            </motion.div>

            {/* Vertical Path 1-2 */}
            <div className="relative h-12 w-[1px]">
              <div className="absolute inset-0 bg-[var(--border)] border-dashed border-l" />
              <motion.div 
                animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-[-2.5px] w-[6px] h-[6px] rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)]"
              />
            </div>

            {/* Node 2 */}
            <motion.div 
              variants={NODE_VARIANTS} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-4 text-center"
            >
               <div className="w-16 h-16 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/5 flex items-center justify-center shadow-[0_0_20px_rgba(var(--accent-rgb),0.05)]">
                 <Cpu className="text-[var(--accent)]" size={24} />
               </div>
               <div><p className="mono text-[length:var(--text-small)] text-[var(--accent)] uppercase tracking-widest mb-0.5 font-bold">MODULE</p><h3 className="text-[length:var(--text-small)] font-bold">Surgical Processing</h3></div>
            </motion.div>

            {/* Vertical Path 2-3 */}
            <div className="relative h-12 w-[1px]">
              <div className="absolute inset-0 bg-[var(--border)] border-dashed border-l" />
              <motion.div 
                animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
                className="absolute left-[-2.5px] w-[6px] h-[6px] rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"
              />
            </div>

            {/* Node 3 */}
            <motion.div 
              variants={NODE_VARIANTS} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-4 text-center"
            >
               <div className="w-16 h-16 rounded-full border border-yellow-500/30 bg-yellow-500/5 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.05)]">
                 <GitBranch className="text-yellow-500" size={24} />
               </div>
               <div><p className="mono text-[length:var(--text-small)] text-yellow-500 uppercase tracking-widest mb-0.5 font-bold">LAYER</p><h3 className="text-[length:var(--text-small)] font-bold">Orchestration</h3></div>
            </motion.div>

            {/* Vertical Path 3-4 */}
            <div className="relative h-12 w-[1px]">
              <div className="absolute inset-0 bg-[var(--border)] border-dashed border-l" />
              <motion.div 
                animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 1 }}
                className="absolute left-[-2.5px] w-[6px] h-[6px] rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
              />
            </div>

            {/* Node 4 */}
            <motion.div 
              variants={NODE_VARIANTS} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ delay: 0.6 }}
              className="flex flex-col items-center gap-4 text-center"
            >
               <div className="w-16 h-16 rounded-full border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.05)]">
                 <Zap className="text-cyan-500" size={24} />
               </div>
               <div><p className="mono text-[length:var(--text-small)] text-cyan-500 uppercase tracking-widest mb-0.5 font-bold">STATUS</p><h3 className="text-[length:var(--text-small)] font-bold">Automation Ready</h3></div>
            </motion.div>

          </div>
        </div>

        {/* Technical Specs Bar */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-12 gap-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={14} className="text-[var(--accent)]" />
            <span className="mono text-[length:var(--text-small)] uppercase tracking-widest text-[var(--muted)]">Latency: &lt;200ms</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 size={14} className="text-[var(--accent)]" />
            <span className="mono text-[length:var(--text-small)] uppercase tracking-widest text-[var(--muted)]">Precision: 99.9%</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 size={14} className="text-[var(--accent)]" />
            <span className="mono text-[length:var(--text-small)] uppercase tracking-widest text-[var(--muted)]">Availability: 24/7</span>
          </div>
        </div>
      </div>
    </section>
  );
}
