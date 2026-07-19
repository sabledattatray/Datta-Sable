'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  Mail, 
  Trash2, 
  Search, 
  CheckCircle2, 
  Globe, 
  ShieldAlert, 
  Key, 
  User, 
  Activity 
} from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  createdAt: string;
  lastLoginAt: string | null;
  provider: string;
}

interface SubscriberRecord {
  id: string;
  email: string;
  createdAt: string;
}

export default function UsersSubscribersAdmin() {
  const [activeTab, setActiveTab] = useState<'users' | 'subscribers'>('users');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRecords = () => {
    setLoading(true);
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(data.users);
          setSubscribers(data.subscribers);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load user/subscriber data:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (type: 'user' | 'subscriber', id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id })
      });
      const data = await res.json();
      if (data.success) {
        fetchRecords();
      } else {
        alert(`Delete failed: ${data.error}`);
      }
    } catch (err) {
      console.error(`Failed to delete ${type}:`, err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics
  const googleUsersCount = users.filter(u => u.provider === 'google').length;
  const localUsersCount = users.filter(u => u.provider === 'local' || u.provider === 'credentials').length;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>
            Users &amp; Subscribers <span style={{ color: 'var(--accent)' }}>Management</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Audit active accounts, Google One Tap authentications, and newsletter subscriber contacts.
          </p>
        </div>
        <button 
          onClick={fetchRecords} 
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border)',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            cursor: 'pointer'
          }}
        >
          Refresh Data
        </button>
      </div>

      {/* ── METRICS DASHBOARD TILES ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontFamily: 'monospace' }}>Total Accounts</span>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)', marginTop: '0.5rem' }}>{users.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
            {googleUsersCount} Google · {localUsersCount} Local
          </div>
        </div>

        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontFamily: 'monospace' }}>Google One Tap Logins</span>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={28} /> {googleUsersCount}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
            {Math.round((googleUsersCount / (users.length || 1)) * 100)}% of total users
          </div>
        </div>

        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontFamily: 'monospace' }}>Newsletter Subscribers</span>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={28} /> {subscribers.length}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
            Active contacts in mailing lists
          </div>
        </div>

      </div>

      {/* ── CONTROLS & FILTER BAR ── */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem', 
        borderBottom: '1px solid var(--border)', 
        paddingBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'users' ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === 'users' ? 'var(--text)' : 'var(--muted)',
              padding: '0.5rem 1rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Registered Users ({users.length})
          </button>
          <button
            onClick={() => { setActiveTab('subscribers'); setSearchQuery(''); }}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'subscribers' ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === 'subscribers' ? 'var(--text)' : 'var(--muted)',
              padding: '0.5rem 1rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Newsletter Subscribers ({subscribers.length})
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder={activeTab === 'users' ? 'Search by name or email...' : 'Search subscriber email...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '0.5rem 1rem 0.5rem 2.25rem',
              color: 'var(--text)',
              fontSize: '0.85rem',
              width: '100%',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--muted)', fontFamily: 'monospace' }}>
          <Activity className="animate-spin" style={{ margin: '0 auto 1rem auto', color: 'var(--accent)' }} />
          Loading user logs...
        </div>
      ) : (
        <div>
          {/* TAB 1: USERS */}
          {activeTab === 'users' && (
            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--surface2)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: '1rem' }}>User Info</th>
                    <th style={{ padding: '1rem' }}>Auth Provider</th>
                    <th style={{ padding: '1rem' }}>Role</th>
                    <th style={{ padding: '1rem' }}>Joined Date</th>
                    <th style={{ padding: '1rem' }}>Last Active</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="hover:bg-[rgba(255,255,255,0.01)]">
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {user.image ? (
                              <img src={user.image} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <User size={16} style={{ color: 'var(--muted)' }} />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {user.provider === 'google' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600, border: '1px solid rgba(59,130,246,0.2)' }}>
                            <Globe size={12} /> Google One Tap
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600, border: '1px solid var(--border)' }}>
                            <Key size={12} /> Local Auth
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {user.role === 'ADMIN' ? (
                          <span style={{ color: '#ef4444', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <ShieldAlert size={14} /> ADMIN
                          </span>
                        ) : (
                          <span style={{ color: 'var(--muted)' }}>USER</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--muted)', fontFamily: 'monospace' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--muted)', fontFamily: 'monospace' }}>
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete('user', user.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
                        No registered users match search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--surface2)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: '1rem' }}>Subscriber Email</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Subscribed Date</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.map(sub => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="hover:bg-[rgba(255,255,255,0.01)]">
                      <td style={{ padding: '1rem', fontWeight: 600 }}>
                        {sub.email}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600, border: '1px solid rgba(16,185,129,0.2)' }}>
                          <CheckCircle2 size={12} /> Active
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--muted)', fontFamily: 'monospace' }}>
                        {new Date(sub.createdAt).toLocaleString()}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete('subscriber', sub.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Delete / Unsubscribe"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredSubscribers.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
                        No active newsletter subscribers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
}
