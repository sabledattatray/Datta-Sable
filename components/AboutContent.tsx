'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Download, Award, Briefcase, GraduationCap, ArrowRight, Shield, Zap, Target, Cpu, Database, BarChart, Code } from 'lucide-react';

const skills = [
  { name: 'Advanced Excel', icon: <BarChart size={14} />, pct: 98, category: 'Tools' },
  { name: 'MS Power BI', icon: <Zap size={14} />, pct: 95, category: 'BI Tools' },
  { name: 'SQL Server (SSMS)', icon: <Database size={14} />, pct: 92, category: 'Programming' },
  { name: 'SAP MIS Reporting', icon: <Cpu size={14} />, pct: 88, category: 'Tools' },
  { name: 'Data Automation', icon: <Zap size={14} />, pct: 94, category: 'BI Tools' },
  { name: 'Portfolio Risk Analysis', icon: <Target size={14} />, pct: 90, category: 'Tools' },
  { name: 'MS ACCESS', icon: <Database size={14} />, pct: 85, category: 'Tools' },
  { name: 'Big Data Ops', icon: <Cpu size={14} />, pct: 82, category: 'BI Tools' },
];

const values = [
  { 
    id: '01', 
    title: 'DATA INTEGRITY', 
    desc: 'Uncompromising accuracy in every calculation. No "approximate" insights.',
    icon: <Shield size={24} />,
    color: 'var(--accent)'
  },
  { 
    id: '02', 
    title: 'HUMAN CENTRIC', 
    desc: 'Complex data simplified for executive decision-making. No fluff.',
    icon: <Target size={24} />,
    color: '#00C9F2'
  },
  { 
    id: '03', 
    title: 'AUTOMATION FIRST', 
    desc: 'If it can be automated, it must be. Eliminating manual error at the root.',
    icon: <Zap size={24} />,
    color: '#00d4ff'
  },
];

const certifications = [
  { name: 'Excel Data Analysis Masterclass', issuer: 'Coursera (Verified)', year: '2025' },
  { name: 'Tableau Desktop Specialist', issuer: 'Tableau / Salesforce', year: '2023' },
  { name: 'Google Data Analytics Pro', issuer: 'Google / Coursera', year: '2022' },
  { name: 'Microsoft Power BI Data Analyst', issuer: 'Microsoft', year: '2023' },
  { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', year: '2024' },
];

const timeline = [
  { year: '2025—PRES', role: 'MIS MANAGER', company: 'DBS MINTEK PVT. LTD.', desc: 'Developing automated Power BI & SQL dashboards, reducing manual effort by 40% through Power Query.' },
  { year: '2023—2025', role: 'INFORMATION SYSTEM ANALYST', company: 'CASCO', desc: 'Analyzing business data to support decision-making via optimized MIS and SQL reporting systems.' },
  { year: '2020—2023', role: 'ASSISTANT MANAGER – MIS & ANALYTICS', company: 'KISSHT FINANCE LTD.', desc: 'Managed PAN-India risk portfolios and supervised 60+ callers with performance analytics and Excel dashboards.' },
  { year: '2015—2020', role: 'DEPUTY MANAGER', company: 'HDFC BANK LTD.', desc: 'Managed Credit Card Write-off & NPA portfolios for Mumbai region. Ensured strict audit compliance and slippage control.' },
];

function SkillItem({ name, icon, pct, category }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const color = category === 'BI Tools' ? 'var(--accent)' : category === 'Programming' ? '#00C9F2' : '#00d4ff';
  
  return (
    <div ref={ref} style={{ marginBottom: '1.25rem' }}>
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-center gap-2">
          <span style={{ color }}>{icon}</span>
          <span className="mono" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em' }}>{name.toUpperCase()}</span>
        </div>
        <span className="mono" style={{ fontSize: '10px', color: 'var(--muted)' }}>{pct}%</span>
      </div>
      <div style={{ height: '4px', background: 'var(--surface2)', position: 'relative', border: '1px solid var(--border)' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ height: '100%', background: color, boxShadow: `0 0 10px ${color}44` }} 
        />
      </div>
    </div>
  );
}

export default function AboutContent() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '80px' }}>
        {/* ── Top-left Precision Crosshair ── */}
        <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid var(--accent)', borderRadius: '50%', opacity: 0.2 }} />
          <div style={{ position: 'absolute', width: '1px', height: '24px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '24px', height: '1px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '4px', height: '4px', background: 'var(--accent)', borderRadius: '50%' }} />
        </div>

        {/* Hero Section */}
        <section className="section" style={{ paddingTop: 'clamp(8rem, 12vw, 10rem)', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '2rem', alignItems: 'center' }}>
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                <div className="label-tech mb-4" style={{ letterSpacing: '0.3em' }}>CORE-MISSION</div>
                <h1 style={{ 
                  fontSize: 'clamp(3rem, 8vw, 64px)', 
                  fontWeight: 600,
                  lineHeight: 1,
                  marginBottom: '2rem',
                  letterSpacing: '-0.04em'
                }}>
                  Designing <br />
                  <span className="hero-title">Decision</span> Clarity.
                </h1>
                <p style={{ color: 'var(--muted)', maxWidth: 520, lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                  I am Datta Sable, a <strong>Business Intelligence Expert</strong> and <strong>Data Strategy Consultant</strong> based in India. I bridge the gap between complex data ecosystems and strategic action, building high-fidelity <strong>Automated Reporting Solutions</strong> that empower stakeholders with absolute decision clarity.
                </p>
                <div className="flex gap-4">
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'relative', padding: '10px' }}>
                <div style={{ 
                  width: '100%', 
                  aspectRatio: '0.85', 
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '0 60px 0 60px',
                  background: 'var(--surface) padding-box, linear-gradient(135deg, #00C9F2, var(--accent)) border-box',
                  border: '1px solid transparent',
                  zIndex: 1
                }}>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image 
                    src="/images/datta.webp" 
                    alt="Datta Sable" 
                    fill
                    style={{ objectFit: 'cover' }} 
                  />
                </div>

                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.6))' }} />
                </div>
                
                {/* Outer tech frame */}
                <div style={{ 
                  position: 'absolute', inset: 0, 
                  background: 'linear-gradient(135deg, #00C9F2, var(--accent))',
                  opacity: 0.2, 
                  borderRadius: '0 60px 0 60px',
                  transform: 'translate(10px, 10px)',
                  zIndex: -1
                }} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Brand Clarification & Open Source Notice */}
        <section className="section" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
          <div className="container">
            <div className="card p-8 border-l-4 border-[var(--accent)]" style={{ background: 'var(--surface)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Shield size={18} className="text-[var(--accent)]" />
                <span className="mono text-[11px] font-bold tracking-widest text-[var(--accent)]">BRAND_CLARIFICATION // E-E-A-T NOTICE</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Independent Consultant Identity vs. &quot;Datta Able&quot; Dashboard Template</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed mb-4">
                Datta Sable is an independent Business Intelligence &amp; Data Strategy Expert based in India, specializing in enterprise SQL automation, Python data engineering, and custom reporting solutions. 
              </p>
              <p className="text-[var(--muted)] text-sm leading-relaxed">
                <strong>Important Notice for Auditors &amp; Search Engines:</strong> While my professional name (Datta Sable) bears a close phonetic resemblance to the popular open-source admin dashboard template known as <em>&quot;Datta Able&quot;</em> (created by CodedThemes / AppSeed), I operate as a distinct, independent consulting entity. This platform (dattasable.com) is dedicated exclusively to my personal consulting practice, case studies, and custom AI/BI workflow tools.
              </p>
            </div>
          </div>
        </section>

        {/* ── Credential Vault: Professional Certifications ── */}
        <section className="section" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div className="flex items-center gap-3 mb-8">
              <Award size={20} style={{ color: 'var(--accent)' }} />
              <span className="label-tech">CREDENTIAL_VAULT</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Generative AI for Marketers', issuer: 'LinkedIn Learning', file: 'CertificateOfCompletion_Generative AI for Digital Marketers.pdf' },
                { title: 'AI & The Public Sector', issuer: 'LinkedIn Learning', file: 'CertificateOfCompletion_AI and the Future of the Public Sector.pdf' },
                { title: 'Google Analytics Specialist', issuer: 'Google Analytics', file: 'Google Analytics Certifiacte.pdf' },
                { title: 'Content Strategy Expert', issuer: 'LinkedIn Learning', file: 'CertificateOfCompletion_Content Strategy for Marketers.pdf' },
                { title: 'Digital Marketing Mastery', issuer: 'LinkedIn Learning', file: 'CertificateOfCompletion_Digital Marketing Tools Create a Marketing Campaign from Start to Finish.pdf' },
                { title: 'LinkedIn Marketing Pro', issuer: 'LinkedIn Learning', file: 'CertificateOfCompletion_Marketing on LinkedIn.pdf' },
              ].map((cert, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="card-precision"
                  style={{ 
                    padding: '1.5rem', 
                    background: 'var(--surface)', 
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '180px'
                  }}
                >
                  <div>
                    <span className="mono" style={{ fontSize: '10px', color: 'var(--accent)', display: 'block', marginBottom: '0.5rem' }}>// {cert.issuer.toUpperCase()}</span>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.3 }}>{cert.title}</h3>
                  </div>
                  <a 
                    href={`/certs/${cert.file}`} 
                    target="_blank" 
                    className="btn-outline" 
                    style={{ 
                      fontSize: '11px', 
                      padding: '0.6rem 1.2rem', 
                      textDecoration: 'none', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      width: 'fit-content'
                    }}
                  >
                    <Download size={14} /> VIEW_VERIFICATION
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy Grid */}
        <section className="section" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0' }}>
              {values.map((v, i) => (
                <motion.div 
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  style={{ 
                    padding: '3rem', 
                    borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                    borderBottom: '1px solid var(--border)',
                    background: i === 1 ? 'var(--surface2)' : 'transparent'
                  }}
                >
                  <div className="mono" style={{ fontSize: '12px', color: v.color, marginBottom: '1.5rem' }}>{v.id} {'//'}</div>
                  <div style={{ color: v.color, marginBottom: '1.5rem' }}>{v.icon}</div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', letterSpacing: '0.1em' }}>{v.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Arsenal */}
        <section className="section" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ marginBottom: '4rem' }}>
              <div className="label-tech mb-4">SYSTEM-RESOURCES</div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Technical Arsenal</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, maxWidth: '750px', marginBottom: '3rem' }}>
                A specialized tech stack engineered for speed, scalability, and pixel-perfect accuracy. As a <strong>Tableau Expert</strong> and <strong>Power BI Consultant</strong>, I focus on <strong>SQL Automation</strong> and <strong>Python Data Engineering</strong> to build the foundations for your next <strong>Data Analytics Dashboard</strong>.
              </p>

              {/* STATS: SIDE-BY-SIDE */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card" style={{ padding: '2rem', position: 'relative' }}>
                  <div className="mono" style={{ fontSize: '10px', color: 'var(--accent)', marginBottom: '1.5rem' }}>INFRASTRUCTURE_STATS:</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                    <div>
                      <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>50+</div>
                      <div style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '6px' }}>PROJECTS_DEPLOYED</div>
                    </div>
                    <div>
                      <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>100K+</div>
                      <div style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '6px' }}>ROWS_OPTIMIZED</div>
                    </div>
                  </div>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '4px', background: 'var(--accent)' }} />
                </div>

                <div className="card" style={{ padding: '2rem', position: 'relative' }}>
                  <div className="mono" style={{ fontSize: '10px', color: 'var(--accent2)', marginBottom: '1.5rem' }}>RELIABILITY_LOGS:</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                    <div>
                      <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>99%</div>
                      <div style={{ fontSize: '8px', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '6px' }}>CLIENT_SATISFACTION</div>
                    </div>
                    <div>
                      <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>24/7</div>
                      <div style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '6px' }}>SYSTEM_MONITORING</div>
                    </div>
                  </div>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '4px', background: 'var(--accent2)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
                {skills.map(s => <SkillItem key={s.name} {...s} />)}
              </div>
            </div>
          </div>
        </section>

        {/* Publications / Thought Leadership */}
        <section className="section" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div className="label-tech mb-4">THOUGHT-LEADERSHIP</div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Publications & Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'The Future of Real-Time BI', platform: 'Data Engineering Weekly', date: '2025' },
                { title: 'Automating Enterprise MIS', platform: 'Analytics India Magazine', date: '2024' },
                { title: 'Predictive Risk Models in Banking', platform: 'FinTech Journal', date: '2023' },
                { title: 'Scalable Dashboard Architectures', platform: 'Tableau Community Showcase', date: '2024' }
              ].map(pub => (
                <div key={pub.title} className="card p-6 border-l-4 border-[var(--accent)]">
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>{pub.platform} // {pub.date}</div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{pub.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Transparency / Walkthrough */}
        <section className="section" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
          <div className="container">
            <div className="card" style={{ padding: '3rem', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--bg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/5sXT6HuV61w" 
                    title="Portfolio Walkthrough" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0 }}
                  ></iframe>
                </div>
                <div>
                  <div className="label-tech mb-4" style={{ color: 'var(--accent)' }}>PLATFORM-TRANSPARENCY // 2025</div>
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>The Architecture Behind This Platform</h2>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                    A definitive technical walkthrough showcasing the design logic, responsive orchestration, and engineering principles used to build this very ecosystem. This transparency ensures my clients and peers understand the high-fidelity standards applied to every deployment.
                  </p>
                  <div className="mono" style={{ fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.1em' }}>
                    STATUS: VERIFIED_AUTHORSHIP // ORIGIN: DATTA_SABLE_STUDIO
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Career Log & Certs */}
        <section className="section">
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '3rem' }}>
              {/* Career Log */}
              <div>
                <div className="label-tech mb-8">SYSTEM-LOGS {'//'} CAREER_HISTORY</div>
                <div style={{ position: 'relative', paddingLeft: '3rem' }}>
                  <div style={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '1px', background: 'var(--border)' }} />
                  {timeline.map((t, i) => (
                    <motion.div 
                      key={t.year}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      style={{ marginBottom: '4rem', position: 'relative' }}
                    >
                      <div style={{ 
                        position: 'absolute', left: '-3rem', top: '0', 
                        width: '15px', height: '15px', background: 'var(--bg)', 
                        border: '2px solid var(--accent)', borderRadius: '50%',
                        zIndex: 1
                      }} />
                      <div className="mono" style={{ fontSize: '11px', color: 'var(--accent)', marginBottom: '0.5rem' }}>[{t.year}]</div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>{t.role}</h3>
                      <div style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>{t.company}</div>
                      <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 500 }}>{t.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <div className="label-tech mb-8">VERIFIED-CREDENTIALS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {certifications.map((c, i) => (
                    <motion.div 
                      key={c.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                      style={{ 
                        padding: '1.5rem', 
                        background: 'rgba(255,255,255,0.02)', 
                        border: '1px solid var(--border)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ position: 'absolute', top: 0, right: 0, padding: '4px 10px', background: 'var(--surface2)', fontSize: '9px', color: 'var(--muted)' }}>{c.year}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '4px' }}>{c.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{c.issuer}</div>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: 'var(--accent3)' }} />
                    </motion.div>
                  ))}
                </div>
                
                <div style={{ 
                  marginTop: '3rem', 
                  padding: '2.5rem 2rem', 
                  border: '1px solid var(--border)',
                  background: 'linear-gradient(135deg, rgba(201,243,29,0.03) 0%, transparent 100%)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Background Pulse */}
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    style={{ 
                      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                      width: '100px', height: '100px', background: 'var(--accent)', borderRadius: '50%',
                      filter: 'blur(40px)', zIndex: 0
                    }}
                  />
                  
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
                    <Award size={32} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <div>
                      <div className="mono" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', letterSpacing: '0.2em', marginBottom: '4px' }}>
                        CONTINUOUS_LEARNING: <span style={{ color: 'var(--accent)' }}>TRUE</span>
                      </div>
                      <div className="mono" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.1em' }}>
                        SYSTEM_STATUS: EVOLVING {'//'} VERSION: 5.0.24
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative corner accents */}
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '10px', height: '10px', borderTop: '2px solid var(--accent)', borderRight: '2px solid var(--accent)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '10px', height: '10px', borderBottom: '2px solid var(--accent)', borderLeft: '2px solid var(--accent)' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section" style={{ textAlign: 'center', background: 'linear-gradient(to bottom, transparent, rgba(201,243,29,0.02))' }}>
          <div className="container">
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 40px)', marginBottom: '1.5rem' }}>Ready to Scale?</h2>
            <p style={{ color: 'var(--muted)', maxWidth: 600, margin: '0 auto 3rem', lineHeight: 1.8 }}>
              Let&apos;s integrate high-fidelity analytics into your organization. Available for strategic consulting and end-to-end BI deployments.
            </p>
            <Link href="/contact" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', padding: '1.25rem 3rem', borderRadius: 0 }}>
              ESTABLISH CONNECTION <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* ── Bottom-right Precision Crosshair ── */}
        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(201, 243, 29, 0.4)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', width: '1px', height: '24px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '24px', height: '1px', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', width: '4px', height: '4px', background: 'var(--accent)', borderRadius: '50%' }} />
        </div>
      </div>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": "Datta Sable Portfolio Technical Walkthrough",
            "description": "A definitive technical walkthrough showcasing the design logic, responsive orchestration, and engineering principles used to build the Datta Sable ecosystem.",
            "thumbnailUrl": [
              "https://img.youtube.com/vi/5sXT6HuV61w/maxresdefault.jpg",
              "https://img.youtube.com/vi/5sXT6HuV61w/sddefault.jpg",
              "https://img.youtube.com/vi/5sXT6HuV61w/hqdefault.jpg"
            ],
            "uploadDate": "2025-01-01T00:00:00Z",
            "duration": "PT35M",
            "embedUrl": "https://www.youtube.com/embed/5sXT6HuV61w",
            "interactionStatistic": {
              "@type": "InteractionCounter",
              "interactionType": { "@type": "WatchAction" },
              "userInteractionCount": 9450
            }
          })
        }}
      />
    </div>
  );
}
