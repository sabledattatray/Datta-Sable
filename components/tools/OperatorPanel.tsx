'use client';

import { useOperatorProfile, OperatorPersona, OperatorIntent, OperatorStyle } from '@/lib/hooks/useOperatorProfile';
import { Settings, User, Target, Zap, ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';

export default function OperatorPanel() {
  const { profile, updateProfile } = useOperatorProfile();
  const [isOpen, setIsOpen] = useState(false);

  const PERSONAS: OperatorPersona[] = ['Founder', 'Technical Expert', 'Data Strategist', 'Creator', 'Educator'];
  const INTENTS: OperatorIntent[] = ['Authority', 'Engagement', 'Lead Generation', 'SEO', 'Distribution'];
  const STYLES: OperatorStyle[] = ['Surgical', 'Executive', 'Analytical', 'Narrative', 'Minimalist'];

  return (
    <div className="card overflow-hidden" style={{ background: 'var(--surface2)', border: '1px solid var(--accent)', borderColor: 'rgba(201, 243, 29, 0.2)', marginBottom: '2rem' }}>
      <div 
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div style={{ color: 'var(--accent)' }}>
            <Settings size={18} className={isOpen ? 'rotate-90 transition-all' : 'transition-all'} />
          </div>
          <div>
            <h4 className="mono text-xs uppercase tracking-widest text-[var(--text)]">Operator_Mode_Active</h4>
            <p className="text-xs mono text-[var(--muted)]" style={{ marginTop: '4px' }}>
              {profile.persona} / {profile.intent} / {profile.style}
            </p>
          </div>
        </div>
        <ChevronDown size={14} className="text-[var(--muted)] transition-all" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
      </div>

      {isOpen && (
        <div className="p-6 border-t border-[var(--border)] grid grid-cols-1 md:grid-cols-3 gap-8 bg-[var(--bg)]">
          {/* Persona Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User size={14} className="text-[var(--accent)]" />
              <h5 className="mono text-xs uppercase tracking-widest">Persona</h5>
            </div>
            <div className="flex flex-col gap-2">
              {PERSONAS.map(p => (
                <button 
                  key={p}
                  onClick={() => updateProfile({ persona: p })}
                  className={`text-left px-3.5 py-2 text-xs mono border transition-all flex justify-between items-center cursor-pointer rounded-sm ${profile.persona === p ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5 font-semibold' : 'border-transparent text-[var(--muted)] bg-transparent hover:bg-white/5 hover:text-[var(--text)]'}`}
                >
                  {p.toUpperCase()}
                  {profile.persona === p && <Check size={10} />}
                </button>
              ))}
            </div>
          </div>

          {/* Intent Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target size={14} className="text-[var(--accent)]" />
              <h5 className="mono text-xs uppercase tracking-widest">Intent</h5>
            </div>
            <div className="flex flex-col gap-2">
              {INTENTS.map(i => (
                <button 
                  key={i}
                  onClick={() => updateProfile({ intent: i })}
                  className={`text-left px-3.5 py-2 text-xs mono border transition-all flex justify-between items-center cursor-pointer rounded-sm ${profile.intent === i ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5 font-semibold' : 'border-transparent text-[var(--muted)] bg-transparent hover:bg-white/5 hover:text-[var(--text)]'}`}
                >
                  {i.toUpperCase()}
                  {profile.intent === i && <Check size={10} />}
                </button>
              ))}
            </div>
          </div>

          {/* Style Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={14} className="text-[var(--accent)]" />
              <h5 className="mono text-xs uppercase tracking-widest">Style</h5>
            </div>
            <div className="flex flex-col gap-2">
              {STYLES.map(s => (
                <button 
                  key={s}
                  onClick={() => updateProfile({ style: s })}
                  className={`text-left px-3.5 py-2 text-xs mono border transition-all flex justify-between items-center cursor-pointer rounded-sm ${profile.style === s ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5 font-semibold' : 'border-transparent text-[var(--muted)] bg-transparent hover:bg-white/5 hover:text-[var(--text)]'}`}
                >
                  {s.toUpperCase()}
                  {profile.style === s && <Check size={10} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Founder Insight Layer - Human Signal */}
      <div className="p-5 bg-[var(--accent)]/5 border-t border-[var(--border)] flex items-start gap-4">
        <div className="w-9 h-9 rounded-full bg-[var(--surface2)] border border-[var(--accent)]/30 flex-shrink-0 flex items-center justify-center overflow-hidden">
          <span className="text-xs mono font-bold text-[var(--accent)]">DS</span>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h5 className="mono text-xs uppercase tracking-widest text-[var(--accent)] font-bold">Founder_Insight</h5>
            <span className="text-[11px] mono text-[var(--muted)] px-1.5 py-0.5 border border-[var(--border)] rounded">VERIFIED_OPERATOR</span>
          </div>
          <p className="text-xs leading-relaxed text-[var(--muted)] italic" style={{ fontSize: '0.84rem', lineHeight: 1.65 }}>
            "Precision is the only scalable advantage. Don't just generate—orchestrate. I built these settings to ensure your technical identity remains consistent across every node."
          </p>
        </div>
      </div>
    </div>
  );
}
