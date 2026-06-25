'use client';
import { motion } from 'framer-motion';
import { Shield, Zap, Target, Database, BarChart3, Layers, Code2, Globe, Cpu } from 'lucide-react';
import Image from 'next/image';

export default function OGPreviewPage() {
  return (
    <div style={{ 
      width: '1200px', 
      height: '630px', 
      background: '#060606', 
      color: '#fff', 
      overflow: 'hidden', 
      position: 'relative',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      border: '1px solid #1a1a1a'
    }}>
      {/* ── Background Grid & Effects ── */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundImage: 'linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.3
      }} />
      <div style={{ 
        position: 'absolute', 
        top: '-10%', 
        right: '-10%', 
        width: '500px', 
        height: '500px', 
        background: 'radial-gradient(circle, rgba(0, 201, 242, 0.05) 0%, transparent 70%)',
        filter: 'blur(60px)'
      }} />
      <div style={{ 
        position: 'absolute', 
        bottom: '-10%', 
        left: '-10%', 
        width: '400px', 
        height: '400px', 
        background: 'radial-gradient(circle, rgba(201, 243, 29, 0.05) 0%, transparent 70%)',
        filter: 'blur(60px)'
      }} />

      {/* ── Left Profile Panel ── */}
      <div style={{ 
        width: '400px', 
        height: '100%', 
        background: 'rgba(255,255,255,0.01)', 
        borderRight: '1px solid rgba(255,255,255,0.05)',
        padding: '60px 40px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2
      }}>
        <div style={{ 
          width: '180px', 
          height: '180px', 
          borderRadius: '50%', 
          border: '2px solid var(--accent, #C9F31D)',
          padding: '8px',
          marginBottom: '30px',
          position: 'relative'
        }}>
          <div style={{ 
            width: '100%', 
            height: '100%', 
            borderRadius: '50%', 
            overflow: 'hidden',
            position: 'relative'
          }}>
            <Image 
              src="/images/author.webp" 
              alt="Datta Sable" 
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          {/* Status Badge */}
          <div style={{ 
            position: 'absolute', 
            bottom: '-10px', 
            right: '-10px', 
            background: '#060606', 
            border: '1px solid #C9F31D',
            padding: '4px 12px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#C9F31D',
            letterSpacing: '0.1em'
          }}>
            STRATEGIC_ARCHITECT
          </div>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em' }}>Datta Sable</h1>
        <div style={{ color: '#00C9F2', fontSize: '14px', fontWeight: 600, marginBottom: '20px', letterSpacing: '0.1em' }}>BI & DATA STRATEGY EXPERT</div>
        
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.6, marginBottom: '40px' }}>
          Engineering complex data ecosystems into high-fidelity executive roadmaps. 10+ years of domain expertise in BFSI and Risk Analytics.
        </p>

        <div style={{ marginTop: 'auto', display: 'flex', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>50+</div>
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>PROJECTS</div>
          </div>
          <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>100K+</div>
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>ROWS</div>
          </div>
          <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>99%</div>
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>CLIENTS</div>
          </div>
        </div>
      </div>

      {/* ── Right Content Panel ── */}
      <div style={{ flex: 1, padding: '60px', position: 'relative', zIndex: 2 }}>
        {/* Top: Tech Arsenal */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ fontSize: '10px', color: '#C9F31D', letterSpacing: '0.3em', marginBottom: '20px' }}>TECHNICAL_ARSENAL</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              { icon: <Database size={18} />, label: 'SQL' },
              { icon: <Code2 size={18} />, label: 'Python' },
              { icon: <BarChart3 size={18} />, label: 'Power BI' },
              { icon: <Layers size={18} />, label: 'Tableau' },
            ].map((skill, i) => (
              <div key={i} style={{ 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ color: '#00C9F2' }}>{skill.icon}</div>
                <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em' }}>{skill.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Core Deployments */}
        <div>
          <div style={{ fontSize: '10px', color: '#00C9F2', letterSpacing: '0.3em', marginBottom: '20px' }}>CORE_DEPLOYMENTS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {[
              { title: 'SDR-9 Analytical Lab', desc: 'Enterprise-scale telemetry & fraud detection systems.' },
              { title: 'Surgical War Room', desc: 'Real-time incident response & decision tracking.' },
              { title: 'Supply Chain AI', desc: 'Predictive inventory modeling & cost optimization.' },
              { title: 'BFSI Risk Dashboard', desc: 'Multi-layer risk assessment for HDFC Bank portfolios.' },
            ].map((p, i) => (
              <div key={i} style={{ 
                padding: '20px', 
                borderLeft: '2px solid rgba(0, 201, 242, 0.4)',
                background: 'rgba(0, 201, 242, 0.02)'
              }}>
                <h4 style={{ fontSize: '14px', marginBottom: '6px', fontWeight: 600 }}>{p.title}</h4>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Watermark */}
        <div style={{ 
          position: 'absolute', 
          bottom: '40px', 
          right: '60px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          opacity: 0.5
        }}>
          <Globe size={14} color="#C9F31D" />
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em' }}>DATTASABLE.COM</div>
        </div>
      </div>

      {/* Decorative Accents */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', borderTop: '1px solid #C9F31D', borderRight: '1px solid #C9F31D', opacity: 0.1 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100px', height: '100px', borderBottom: '1px solid #00C9F2', borderLeft: '1px solid #00C9F2', opacity: 0.1 }} />
    </div>
  );
}
