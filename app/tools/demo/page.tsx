'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Activity, Server, Database, Layers, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SystemDemoPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const steps = [
    { name: "Intent Mapping", status: "complete", detail: "Translating goal to logic" },
    { name: "Prompt Hardening", status: "active", detail: "Applying structural constraints" },
    { name: "Execution Chain", status: "pending", detail: "Running multi-node pipeline" },
    { name: "Final Validation", status: "pending", detail: "Authority check & Output" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLogs(prev => [
        `[${new Date().toLocaleTimeString()}] System node initialized...`,
        `[${new Date().toLocaleTimeString()}] Processing intent logic...`,
        `[${new Date().toLocaleTimeString()}] Fetching context vectors...`,
        ...prev.slice(0, 5)
      ]);
      setActiveStep(s => (s + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      
      <div className="boxed-wrapper pt-32 pb-24">
        <Crosshair position="tl" />
        
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <div className="label-tech mb-8">System Demo</div>
              <h1 style={{ fontSize: '3rem', fontFamily: "'Syne', sans-serif", fontWeight: 600, marginBottom: '2rem', lineHeight: 1.1 }}>
                Live System <span style={{ color: 'var(--accent)' }}>Telemetry.</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '3rem' }}>
                Observe the Surgical AI engine in real-time. This demo simulates a standard 
                <strong> Content Authority Execution Chain</strong>.
              </p>
              
              <div className="space-y-6">
                {steps.map((step, i) => (
                  <div key={step.name} className={`flex items-start gap-4 p-4 rounded-sm border transition-all duration-500 ${activeStep === i ? 'bg-[var(--surface2)] border-[var(--accent)] scale-105' : 'opacity-40 border-transparent'}`}>
                    <div className={activeStep === i ? 'text-[var(--accent)] animate-pulse' : ''}>
                      {activeStep === i ? <Activity size={20} /> : <CheckCircle2 size={20} />}
                    </div>
                    <div>
                      <div className="mono text-[length:var(--text-small)] uppercase font-bold">{step.name}</div>
                      <div className="text-[length:var(--text-small)] opacity-60 mt-1">{step.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-2/3">
              {/* Terminal / Live Monitor */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm overflow-hidden shadow-2xl">
                <div className="px-6 py-3 bg-[#111] border-b border-[#1a1a1a] flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#333]" />
                    <div className="w-2 h-2 rounded-full bg-[#333]" />
                    <div className="w-2 h-2 rounded-full bg-[#333]" />
                  </div>
                  <div className="mono text-[length:var(--text-small)] uppercase tracking-widest opacity-40">Node: execution-chain-alpha</div>
                </div>
                
                <div className="p-8 h-[400px] overflow-hidden">
                  <div className="space-y-2">
                    {logs.map((log, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mono text-[length:var(--text-small)] text-[var(--accent)]"
                      >
                        <span className="opacity-40">{log.split(']')[0]}]</span> {log.split(']')[1]}
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Mock Visual Progress */}
                  <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[Server, Database, Layers, Play].map((Icon, i) => (
                      <div key={i} className={`p-6 border border-[#1a1a1a] flex flex-col items-center justify-center gap-4 transition-colors ${activeStep === i ? 'bg-[rgba(201,243,29,0.05)] border-[rgba(201,243,29,0.2)]' : ''}`}>
                        <Icon size={24} className={activeStep === i ? 'text-[var(--accent)]' : 'opacity-20'} />
                        <div className="h-[2px] w-full bg-[#111]">
                          {activeStep === i && <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-[var(--accent)]" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 p-12 border border-[var(--border)] rounded-sm text-center">
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 700 }}>Ready to deploy your own system?</h3>
                <Link href="/tools" className="btn-primary inline-block" style={{ textDecoration: 'none' }}>
                  START BUILDING WORKFLOWS
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <Crosshair position="br" />
      </div>
      
      <Footer />
    </div>
  );
}
