'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

type Message = {
  role: 'assistant' | 'user';
  text: string;
};

const INITIAL: Message[] = [
  {
    role: 'assistant',
    text: "Hi! I'm Datta's AI assistant 👋 I can help you learn about Datta's work, services, and expertise. What would you like to know?",
  },
];

const KB: Array<{ patterns: string[]; response: string }> = [
  {
    patterns: ['service', 'offer', 'help', 'do you do', 'what can'],
    response:
      "Datta offers three core services:\n\n📊 **Dashboard Development** — Custom Tableau & Power BI dashboards (from ₹15,000)\n🔬 **Data Analytics Consulting** — Full analytics strategy & insights (from ₹25,000)\n⚙️ **Automation Solutions** — Python & Excel report automation (from ₹20,000)\n\nWould you like details on any specific service?",
  },
  {
    patterns: ['tool', 'technology', 'stack', 'use', 'software', 'tableau', 'power bi', 'python', 'sql', 'excel'],
    response:
      "Datta's core toolkit:\n\n📊 **BI Tools:** Tableau (92%), Power BI (88%), Looker\n🗄️ **Data:** SQL (90%), PostgreSQL, MySQL, BigQuery\n🐍 **Programming:** Python (82%), Pandas, NumPy\n📈 **Excel:** Advanced Excel (95%), Power Query, VBA/Macros\n☁️ **Cloud:** AWS, Azure, GCP data services",
  },
  {
    patterns: ['price', 'cost', 'rate', 'charge', 'budget', 'fee'],
    response:
      "Pricing depends on the scope:\n\n• Dashboard Development: starting ₹15,000\n• Analytics Consulting: starting ₹25,000\n• Automation: starting ₹20,000\n• Retainer support: from ₹5,000/month\n\nDatta provides a custom quote after understanding your requirements. Want to get in touch? 👉 /contact",
  },
  {
    patterns: ['project', 'portfolio', 'work', 'example', 'case study'],
    response:
      "Some notable projects:\n\n🏆 Sales Dashboard — $12M revenue tracked, +28% decision speed\n🔗 Supply Chain Platform — -18% inventory cost, $72K savings\n👥 HR Analytics — 97% time saved, 2 FTEs freed\n💰 Financial Automation — 5 days → 4 hours close cycle\n\nSee all 6 case studies at /portfolio",
  },
  {
    patterns: ['experience', 'year', 'background', 'bio', 'about'],
    response:
      "Datta has 10+ years of BI experience:\n\n• Senior BI Analyst at DataDriven Corp (2024–now)\n• BI Developer at Analytics Studio (2022–24)\n• Data Analyst at Tech Startup (2020–22)\n• Business Analyst at MNC Consulting (2018–20)\n• Deputy Manager at HDFC Bank (2015–20)\n\nM.Sc. Data Science, University of Mumbai. Full bio at /about",
  },
  {
    patterns: ['certification', 'certified', 'credential', 'course'],
    response:
      "Datta's certifications:\n\n🏆 Tableau Desktop Specialist — Salesforce (2023)\n🔍 Google Data Analytics Professional — Google (2022)\n⚡ Microsoft Power BI Data Analyst — Microsoft (2023)\n☁️ AWS Cloud Practitioner — Amazon (2024)",
  },
  {
    patterns: ['contact', 'reach', 'email', 'hire', 'talk', 'meeting', 'call'],
    response:
      "You can reach Datta through:\n\n📧 Email: info@dattasable.com\n💼 LinkedIn: www.linkedin.com/in/dattasable/\n📱 Phone: +91 80108 03756\n✈️ Telegram: t.me/sabledatta\n\nOr use the contact form at /contact — Datta typically responds within 24 hours! 🚀",
  },
  {
    patterns: ['blog', 'article', 'write', 'content', 'read'],
    response:
      "Datta writes about BI and data analytics:\n\n📝 Tableau vs Power BI 2024 guide\n🗄️ SQL Window Functions for analysts\n🐍 Python Pandas for BI analysts\n📖 Data storytelling for executives\n\nAll articles at /blog",
  },
  {
    patterns: ['dashboard', 'showcase', 'viz', 'visualization'],
    response:
      "Datta has built 50+ dashboards across industries:\n\n• Sales & Revenue KPI tracking\n• Supply Chain & Operations\n• HR Workforce Analytics\n• E-Commerce Customer Journey\n• Financial P&L reporting\n\nExplore interactive previews at /dashboards",
  },
  {
    patterns: ['available', 'freelance', 'open', 'hire', 'opportunity'],
    response:
      "✅ Datta is currently available for:\n\n• Freelance dashboard projects\n• Short-term consulting engagements\n• Long-term BI partnerships\n• Training & upskilling sessions\n\nResponse time: under 24 hours. Reach out at /contact!",
  },
];

function getBotResponse(userMsg: string): string {
  const lower = userMsg.toLowerCase();
  const matched = KB.find(entry => entry.patterns.some(p => lower.includes(p)));
  return matched
    ? matched.response
    : "Great question! For detailed information, I'd recommend reaching out to Datta directly at /contact or exploring the site. Is there something specific about BI, dashboards, or data analytics I can help clarify?";
}

function formatText(text: string): React.ReactNode {
  return text.split('\n').map((line, i) => {
    const formatted = line.replace(/\*\*(.*?)\*\*/g, (_, b) => `<strong>${b}</strong>`);
    return <span key={i} style={{ display: 'block' }} dangerouslySetInnerHTML={{ __html: formatted || '&nbsp;' }} />;
  });
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = getBotResponse(trimmed);
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* Trigger button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            style={{
              position: 'fixed', bottom: '2rem', right: '2rem',
              width: 56, height: 56, borderRadius: 0,
              background: 'var(--accent)',
              border: '1px solid var(--border)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'none',
              zIndex: 999,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open AI assistant"
          >
            <Sparkles size={22} color="#000" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'fixed', bottom: '2rem', right: '2rem',
              width: 360, height: 520,
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 0,
              display: 'flex', flexDirection: 'column',
              boxShadow: 'none',
              zIndex: 999, overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--tag-bg)' }}>
              <div style={{ width: 32, height: 32, borderRadius: 0, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={16} color="#000" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>Datta&apos;s AI Assistant</div>
                <div className="flex items-center gap-1.5">
                  <div style={{ width: 6, height: 6, borderRadius: 0, background: 'var(--accent3)' }} />
                  <span style={{ color: 'var(--muted)', fontSize: 'var(--text-small)' }}>Online · Flat UI Mode</span>
                </div>
              </div>
              <button 
                onClick={() => setOpen(false)} 
                aria-label="Close assistant"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', gap: '0.6rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: 0, flexShrink: 0,
                    background: msg.role === 'assistant' ? 'var(--accent)' : 'var(--tag-bg)',
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {msg.role === 'assistant' ? <Bot size={12} color="#000" /> : <User size={12} color="var(--muted)" />}
                  </div>
                  <div style={{
                    maxWidth: '85%',
                    background: msg.role === 'user' ? 'var(--accent)' : 'var(--tag-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 0,
                    padding: '0.65rem 0.9rem',
                    fontSize: 'var(--text-small)',
                    lineHeight: 1.65,
                    color: msg.role === 'user' ? '#000' : 'var(--text)',
                  }}>
                    {formatText(msg.text)}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-start">
                  <div style={{ width: 24, height: 24, borderRadius: 0, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={12} color="#000" />
                  </div>
                  <div style={{ background: 'var(--tag-bg)', border: '1px solid var(--border)', borderRadius: 0, padding: '0.65rem 0.9rem', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {[0, 1, 2].map(j => (
                      <motion.div key={j} style={{ width: 4, height: 4, borderRadius: 0, background: 'var(--accent)' }}
                        animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.6, repeat: Infinity, delay: j * 0.15 }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            <div style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', borderTop: '1px solid var(--border)' }}>
              {['Services', 'Projects', 'Pricing', 'Contact'].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 0, padding: '0.3rem 0.75rem', fontSize: 'var(--text-small)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--text)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything..."
                style={{
                  flex: 1, background: 'transparent', border: '1px solid var(--border)',
                  borderRadius: 0, padding: '0.6rem 0.9rem', fontSize: 'var(--text-small)',
                  color: 'var(--text)', outline: 'none', fontFamily: 'Space Grotesk, sans-serif',
                }}
                onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--text)'}
                onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
              />
              <button
                onClick={send}
                disabled={!input.trim() || typing}
                style={{
                  width: 36, height: 36, borderRadius: 0,
                  background: input.trim() ? 'var(--text)' : 'transparent',
                  border: input.trim() ? 'none' : '1px solid var(--border)',
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <Send size={14} color={input.trim() ? 'var(--bg)' : 'var(--muted)'} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
