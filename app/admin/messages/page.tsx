'use client';
import { useState, useEffect } from 'react';
import { Search, Trash2, Mail, MailOpen, Clock, X, Reply } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const initialMessages = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.j@techcorp.com', subject: 'Dashboard Development', message: "Hi Datta, we're looking to build a sales KPI tracker for our Q3 launch. Your portfolio looks impressive. Are you available for a discovery call next week?", date: '2 hours ago', read: false },
  { id: 2, name: 'Mike Ross', email: 'mike@startup.io', subject: 'Data Analytics Consulting', message: "Hey! Need help optimizing our SQL queries and building some basic reports in Power BI. We're a team of 10. What are your rates?", date: '5 hours ago', read: true },
  { id: 3, name: 'Priya Verma', email: 'priya@retail.in', subject: 'Automation Solutions', message: "Our HR team is drowning in manual Excel work. We need someone to automate our payroll reports using Python. Can you help?", date: 'Yesterday', read: true },
  { id: 4, name: 'Alex Chen', email: 'alex@finance.hk', subject: 'Connection Request', message: "Found your blog post on SQL window functions very helpful! Would love to connect on LinkedIn and discuss potential collaboration.", date: '2 days ago', read: true },
];

const avatarColors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'];

export default function MessagesInbox() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const css = isDark
    ? { bg: 'var(--bg)', surface: 'var(--surface)', surface2: 'var(--surface2)', border: 'var(--border)', text: 'var(--text)', muted: 'var(--muted)', accent: 'var(--accent)', shadow: '0 4px 24px rgba(0,0,0,0.35)', activeBg: 'rgba(99,102,241,0.08)' }
    : { bg: 'var(--bg)', surface: 'var(--surface)', surface2: 'var(--surface2)', border: 'var(--border)', text: 'var(--text)', muted: 'var(--muted)', accent: 'var(--accent)', shadow: '0 4px 24px rgba(0,0,0,0.07)', activeBg: 'rgba(79,70,229,0.05)' };

  const [messages, setMessages] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/messages');
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((m: any, i: number) => {
          const diffMs = Date.now() - new Date(m.createdAt).getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMins / 60);
          const diffDays = Math.floor(diffHours / 24);

          let relativeTime = '';
          if (diffMins < 1) relativeTime = 'Just now';
          else if (diffMins < 60) relativeTime = `${diffMins}m ago`;
          else if (diffHours < 24) relativeTime = `${diffHours}h ago`;
          else if (diffDays === 1) relativeTime = 'Yesterday';
          else relativeTime = `${diffDays}d ago`;

          return {
            id: m.id,
            name: m.name,
            email: m.email,
            subject: m.subject || 'No Subject',
            message: m.message,
            date: relativeTime,
            read: m.status === 'READ',
            createdAt: m.createdAt,
          };
        });
        setMessages(mapped);
      }
    } catch (e) {
      console.error('Failed to fetch messages', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filtered = messages.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (m: any) => {
    setSelected(m);
    if (!m.read) {
      setMessages(ms => ms.map(msg => msg.id === m.id ? { ...msg, read: true } : msg));
      try {
        await fetch(`/api/admin/messages/${m.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'READ' }),
        });
      } catch (e) {
        console.error('Failed to mark message as read', e);
      }
    }
  };

  const handleDelete = async (id: string | number) => {
    setMessages(ms => ms.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error('Failed to delete message', e);
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div style={{ padding: '32px 28px', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>System</p>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>
            Inbox
            {unreadCount > 0 && (
              <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 700, background: css.accent, color: 'var(--btn-primary-text)', padding: '2px 9px', borderRadius: 999, verticalAlign: 'middle' }}>
                {unreadCount} new
              </span>
            )}
          </h1>
          <p style={{ fontSize: 13, color: css.muted, margin: '4px 0 0' }}>{messages.length} messages total</p>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '340px 1fr' : '1fr', gap: 20, alignItems: 'flex-start' }} className="msg-grid">
        {/* Message list */}
        <div className={selected ? "msg-list-pane msg-list-pane-hidden" : "msg-list-pane"} style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, boxShadow: css.shadow, overflow: 'hidden' }}>
          {/* Search */}
          <div style={{ padding: '16px 16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: css.surface2, border: `1px solid ${css.border}`, borderRadius: 12, padding: '10px 14px' }}>
              <Search size={14} color={css.muted} />
              <input type="text" placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: css.text, width: '100%' }}
              />
            </div>
          </div>
          {/* List items */}
          <div style={{ marginTop: 12 }}>
            {loading ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: css.muted, fontSize: 13 }}>Loading messages...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: css.muted, fontSize: 13 }}>No messages found</div>
            ) : (
              filtered.map((m, i) => {
                const isActive = selected?.id === m.id;
                return (
                  <div key={m.id}
                    onClick={() => handleSelect(m)}
                    style={{
                      display: 'flex', gap: 12, padding: '14px 16px', cursor: 'pointer',
                      background: isActive ? css.activeBg : 'transparent',
                      borderLeft: isActive ? `3px solid ${css.accent}` : '3px solid transparent',
                      borderBottom: i < filtered.length - 1 ? `1px solid ${css.border}` : 'none',
                      transition: 'background 0.15s',
                      alignItems: 'flex-start',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = css.surface2; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: avatarColors[i % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                      {m.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                        <span style={{ fontSize: 13, fontWeight: m.read ? 600 : 800, color: css.text }}>{m.name}</span>
                        <span style={{ fontSize: 10, color: css.muted, flexShrink: 0, marginLeft: 8 }}>{m.date}</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: m.read ? 500 : 700, color: m.read ? css.muted : css.text, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject}</div>
                      <div style={{ fontSize: 11, color: css.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</div>
                    </div>
                    {!m.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: css.accent, flexShrink: 0, marginTop: 6 }} />}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail pane */}
        {selected && (
          <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 14, boxShadow: css.shadow, overflow: 'hidden' }}>
            {/* Detail header */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${css.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${css.accent}, var(--accent2))`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--btn-primary-text)', fontWeight: 800, fontSize: 16 }}>
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: css.text, margin: 0 }}>{selected.name}</p>
                  <p style={{ fontSize: 12, color: css.muted, margin: '2px 0 0' }}>{selected.email}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: `linear-gradient(135deg, ${css.accent}, var(--accent2))`, border: 'none', borderRadius: 10, color: 'var(--btn-primary-text)', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                  <Reply size={14} /> Reply
                </a>
                <button onClick={() => handleDelete(selected.id)} style={{ background: 'none', border: `1px solid ${css.border}`, borderRadius: 10, padding: '9px 12px', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                  <Trash2 size={14} /> Delete
                </button>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: `1px solid ${css.border}`, borderRadius: 10, padding: '9px 10px', cursor: 'pointer', color: css.muted, display: 'flex', alignItems: 'center' }}>
                  <X size={16} />
                </button>
              </div>
            </div>
            {/* Message body */}
            <div style={{ padding: '28px 28px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>Subject</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: css.text, margin: '0 0 20px', letterSpacing: '-0.01em' }}>{selected.subject}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                <Clock size={12} color={css.muted} />
                <span style={{ fontSize: 12, color: css.muted }}>{selected.date}</span>
              </div>
              <div style={{ background: css.surface2, border: `1px solid ${css.border}`, borderRadius: 16, padding: '20px 22px' }}>
                <p style={{ fontSize: 15, color: css.text, lineHeight: 1.8, margin: 0 }}>{selected.message}</p>
              </div>
              <div style={{ marginTop: 20 }}>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: `linear-gradient(135deg, ${css.accent}, var(--accent2))`, borderRadius: 12, color: 'var(--btn-primary-text)', fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: `0 4px 14px color-mix(in srgb, ${css.accent} 25%, transparent)` }}>
                  <Reply size={15} /> Reply via Email
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .msg-grid { grid-template-columns: 1fr !important; }
          .msg-list-pane-hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
