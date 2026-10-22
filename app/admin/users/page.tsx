'use client';

import React, { useState, useEffect } from 'react';
import adminStyles from '@/components/admin/AdminCommon.module.css';
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
  Activity,
  FileSpreadsheet,
  Download,
  Check
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

  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const exportToExcel = async (exportScope: 'all' | 'filtered' = 'all') => {
    setIsExporting(true);
    try {
      const XLSX = await import('xlsx');
      const timestamp = new Date().toISOString().split('T')[0];

      if (activeTab === 'users') {
        const targetList = exportScope === 'filtered' && searchQuery ? filteredUsers : users;

        if (targetList.length === 0) {
          alert('No users found to export.');
          setIsExporting(false);
          return;
        }

        const dataToExport = targetList.map((u, index) => ({
          'Sr No': index + 1,
          'Name': u.name || 'Anonymous',
          'Email': u.email || '',
          'Auth Provider': u.provider === 'google' ? 'Google One Tap' : (u.provider === 'github' ? 'GitHub' : 'Local Auth'),
          'Role': u.role || 'USER',
          'Joined Date': u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A',
          'Last Active': u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'N/A',
          'Account ID': u.id
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);

        worksheet['!cols'] = [
          { wch: 8 },  // Sr No
          { wch: 28 }, // Name
          { wch: 36 }, // Email
          { wch: 20 }, // Auth Provider
          { wch: 12 }, // Role
          { wch: 16 }, // Joined Date
          { wch: 24 }, // Last Active
          { wch: 32 }  // Account ID
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

        const fileName = `dattasable_registered_users_${timestamp}.xlsx`;
        XLSX.writeFile(workbook, fileName);

        setExportNotice(`Successfully exported ${targetList.length} users to Excel!`);
        setTimeout(() => setExportNotice(null), 4000);
      } else {
        const targetList = exportScope === 'filtered' && searchQuery ? filteredSubscribers : subscribers;

        if (targetList.length === 0) {
          alert('No subscribers found to export.');
          setIsExporting(false);
          return;
        }

        const dataToExport = targetList.map((s, index) => ({
          'Sr No': index + 1,
          'Subscriber Email': s.email,
          'Subscribed Date': s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A',
          'Status': 'Active',
          'Subscriber ID': s.id
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        worksheet['!cols'] = [
          { wch: 8 },
          { wch: 36 },
          { wch: 18 },
          { wch: 12 },
          { wch: 32 }
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Subscribers');

        const fileName = `dattasable_subscribers_${timestamp}.xlsx`;
        XLSX.writeFile(workbook, fileName);

        setExportNotice(`Successfully exported ${targetList.length} subscribers to Excel!`);
        setTimeout(() => setExportNotice(null), 4000);
      }
    } catch (err) {
      console.error('Failed to export to Excel:', err);
      alert('Error generating Excel file. Please try again.');
    } finally {
      setIsExporting(false);
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
    <div className={adminStyles.page}>
      
      {/* Export Success Notification Banner */}
      {exportNotice && (
        <div className={adminStyles.notice}>
          <Check size={16} />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Page Header */}
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} /> PEOPLE &amp; OPERATIONS
          </div>
          <h1 className={adminStyles.title}>
            Users &amp; Subscribers <span className={adminStyles.titleAccent}>Management</span>
          </h1>
          <p className={adminStyles.subtitle}>
            Audit active accounts, Google One Tap authentications, and newsletter subscriber contacts.
          </p>
        </div>
        
        <div className={adminStyles.headerActions}>
          <button 
            onClick={() => exportToExcel()} 
            disabled={isExporting || (activeTab === 'users' ? users.length === 0 : subscribers.length === 0)}
            className={adminStyles.primary}
            title={`Export ${activeTab === 'users' ? `all ${users.length} registered users` : `all ${subscribers.length} subscribers`} to Excel (.xlsx)`}
          >
            <FileSpreadsheet size={15} />
            {isExporting ? 'Generating Excel...' : `Export to Excel (${activeTab === 'users' ? users.length : subscribers.length})`}
          </button>

          <button onClick={fetchRecords} className={adminStyles.secondary}>
            <Activity size={14} /> Refresh Data
          </button>
        </div>
      </div>

      {/* ── METRICS DASHBOARD TILES ── */}
      <div className={adminStyles.metricGrid}>
        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Total Accounts</span>
            <UsersIcon size={16} />
          </div>
          <span className={adminStyles.metricValue}>{users.length}</span>
          <div className={adminStyles.metricBottom}>
            <span>{googleUsersCount} Google · {localUsersCount} Local</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Google One Tap Logins</span>
            <Globe size={16} />
          </div>
          <span className={adminStyles.metricValue}>{googleUsersCount}</span>
          <div className={adminStyles.metricBottom}>
            <span>{Math.round((googleUsersCount / (users.length || 1)) * 100)}% of total users</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Newsletter Subscribers</span>
            <Mail size={16} />
          </div>
          <span className={adminStyles.metricValue}>{subscribers.length}</span>
          <div className={adminStyles.metricBottom}>
            <span>Active contacts in mailing lists</span>
          </div>
        </div>
      </div>

      {/* ── CONTROLS & FILTER BAR ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        {/* Tabs */}
        <div className={adminStyles.tabs} style={{ margin: 0 }}>
          <button
            onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
            className={`${adminStyles.tabButton} ${activeTab === 'users' ? adminStyles.tabButtonActive : ''}`}
          >
            Registered Users ({users.length})
          </button>
          <button
            onClick={() => { setActiveTab('subscribers'); setSearchQuery(''); }}
            className={`${adminStyles.tabButton} ${activeTab === 'subscribers' ? adminStyles.tabButtonActive : ''}`}
          >
            Newsletter Subscribers ({subscribers.length})
          </button>
        </div>

        {/* Search & Quick Export */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className={adminStyles.searchBar} style={{ minWidth: 260 }}>
            <Search size={14} />
            <input
              type="text"
              placeholder={activeTab === 'users' ? 'Search by name or email...' : 'Search subscriber email...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => exportToExcel(searchQuery ? 'filtered' : 'all')}
            disabled={isExporting}
            className={adminStyles.secondary}
            style={{ minHeight: 38, padding: '8px 14px' }}
            title="Download current data view directly as Excel .xlsx"
          >
            <Download size={13} />
            {searchQuery 
              ? `Export Filtered (${activeTab === 'users' ? filteredUsers.length : filteredSubscribers.length})` 
              : 'Export (.xlsx)'}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--muted)' }}>
          <Activity className="animate-spin" style={{ margin: '0 auto 1rem auto', color: 'var(--accent)' }} />
          Loading user logs...
        </div>
      ) : (
        <div>
          {/* TAB 1: USERS */}
          {activeTab === 'users' && (
            <div className={adminStyles.tableWrapper}>
              <table className={adminStyles.table}>
                <thead>
                  <tr>
                    <th className={adminStyles.th}>User Info</th>
                    <th className={adminStyles.th}>Auth Provider</th>
                    <th className={adminStyles.th}>Role</th>
                    <th className={adminStyles.th}>Joined Date</th>
                    <th className={adminStyles.th}>Last Active</th>
                    <th className={adminStyles.th} style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className={adminStyles.tr}>
                      <td className={adminStyles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {user.image ? (
                              <img src={user.image} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <User size={16} style={{ color: 'var(--muted)' }} />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text)' }}>{user.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 2 }}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className={adminStyles.td}>
                        {user.provider === 'google' ? (
                          <span className={adminStyles.badge}>
                            <Globe size={11} /> Google One Tap
                          </span>
                        ) : (
                          <span className={adminStyles.badgeNeutral}>
                            <Key size={11} /> Local Auth
                          </span>
                        )}
                      </td>
                      <td className={adminStyles.td}>
                        {user.role === 'ADMIN' ? (
                          <span style={{ color: '#ef4444', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '11px' }}>
                            <ShieldAlert size={13} /> ADMIN
                          </span>
                        ) : (
                          <span style={{ color: 'var(--muted)', fontSize: '11px' }}>USER</span>
                        )}
                      </td>
                      <td className={adminStyles.td} style={{ color: 'var(--muted)', fontSize: '11px' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className={adminStyles.td} style={{ color: 'var(--muted)', fontSize: '11px' }}>
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className={adminStyles.td} style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete('user', user.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                          title="Delete User"
                        >
                          <Trash2 size={15} />
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
            <div className={adminStyles.tableWrapper}>
              <table className={adminStyles.table}>
                <thead>
                  <tr>
                    <th className={adminStyles.th}>Subscriber Email</th>
                    <th className={adminStyles.th}>Status</th>
                    <th className={adminStyles.th}>Subscribed Date</th>
                    <th className={adminStyles.th} style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.map(sub => (
                    <tr key={sub.id} className={adminStyles.tr}>
                      <td className={adminStyles.td} style={{ fontWeight: 500, color: 'var(--text)' }}>
                        {sub.email}
                      </td>
                      <td className={adminStyles.td}>
                        <span className={adminStyles.badge}>
                          <CheckCircle2 size={11} /> Active
                        </span>
                      </td>
                      <td className={adminStyles.td} style={{ color: 'var(--muted)', fontSize: '11px' }}>
                        {new Date(sub.createdAt).toLocaleString()}
                      </td>
                      <td className={adminStyles.td} style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete('subscriber', sub.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                          title="Delete / Unsubscribe"
                        >
                          <Trash2 size={15} />
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
