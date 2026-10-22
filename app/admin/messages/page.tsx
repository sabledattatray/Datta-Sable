'use client';

import { useState, useEffect } from 'react';
import { Search, Trash2, Mail, Clock, X, Reply, Check } from 'lucide-react';
import adminStyles from '@/components/admin/AdminCommon.module.css';

export default function MessagesInbox() {
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
        const mapped = data.map((m: any) => {
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
    <div className={adminStyles.page}>
      
      {/* Header */}
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} /> PEOPLE &amp; OPERATIONS
          </div>
          <h1 className={adminStyles.title}>
            Customer &amp; Lead <span className={adminStyles.titleAccent}>Messages</span>
            {unreadCount > 0 && (
              <span className={adminStyles.badge} style={{ marginLeft: 12, verticalAlign: 'middle' }}>
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className={adminStyles.subtitle}>
            Review inbound inquiries, project requests, and consultation bookings.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '360px 1fr' : '1fr', gap: 20, alignItems: 'flex-start' }} className="msg-grid">
        
        {/* Message list */}
        <div className={`msg-list-pane ${selected ? 'msg-list-pane-hidden' : ''}`} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          {/* Search */}
          <div style={{ padding: '14px 14px 0' }}>
            <div className={adminStyles.searchBar}>
              <Search size={14} />
              <input
                type="text"
                placeholder="Search messages by name or subject..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* List items */}
          <div style={{ marginTop: 12 }}>
            {loading ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>Loading messages...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>No messages found</div>
            ) : (
              filtered.map((m, i) => {
                const isActive = selected?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => handleSelect(m)}
                    style={{
                      display: 'flex', gap: 12, padding: '14px 16px', cursor: 'pointer',
                      background: isActive ? 'color-mix(in srgb, var(--accent) 8%, var(--surface))' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                      borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.15s',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: 'var(--surface2)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent)', fontWeight: 600, fontSize: 12, flexShrink: 0
                    }}>
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <span style={{ fontSize: 12, fontWeight: m.read ? 500 : 600, color: 'var(--text)' }}>{m.name}</span>
                        <span style={{ fontSize: 9, color: 'var(--muted)', flexShrink: 0, marginLeft: 8 }}>{m.date}</span>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: m.read ? 400 : 500, color: m.read ? 'var(--muted)' : 'var(--text)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</div>
                    </div>
                    {!m.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 5 }} />}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail pane */}
        {selected && (
          <div className={adminStyles.panel} style={{ padding: 0, overflow: 'hidden', margin: 0 }}>
            {/* Detail header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'color-mix(in srgb, var(--accent) 12%, var(--surface))', border: '1px solid color-mix(in srgb, var(--accent) 30%, var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 600, fontSize: 15 }}>
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{selected.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{selected.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className={adminStyles.primary}
                  style={{ minHeight: 36, padding: '7px 14px' }}
                >
                  <Reply size={13} /> Reply
                </a>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className={adminStyles.danger}
                  style={{ minHeight: 36, padding: '7px 12px' }}
                >
                  <Trash2 size={13} /> Delete
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className={adminStyles.secondary}
                  style={{ minHeight: 36, padding: '7px 10px' }}
                  aria-label="Close message details"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Message body */}
            <div style={{ padding: '24px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Subject</div>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', margin: '0 0 16px' }}>{selected.subject}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, color: 'var(--muted)', fontSize: 11 }}>
                <Clock size={12} />
                <span>{selected.date} ({new Date(selected.createdAt).toLocaleString()})</span>
              </div>
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 20px' }}>
                <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>{selected.message}</p>
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
