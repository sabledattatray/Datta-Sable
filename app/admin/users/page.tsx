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
  Check,
  Pencil,
  X,
  AlertTriangle,
  Save
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

  // Edit User State
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'USER' | 'ADMIN'>('USER');
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete Confirmation State
  const [deletingTarget, setDeletingTarget] = useState<{
    type: 'user' | 'subscriber';
    id: string;
    name?: string;
    email?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const handleOpenEdit = (user: UserRecord) => {
    setEditingUser(user);
    setEditName(user.name === 'Anonymous' ? '' : user.name);
    setEditEmail(user.email || '');
    setEditRole(user.role === 'ADMIN' ? 'ADMIN' : 'USER');
    setEditError(null);
  };

  const handleCloseEdit = () => {
    if (editSaving) return;
    setEditingUser(null);
    setEditError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditSaving(true);
    setEditError(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser.id,
          name: editName,
          email: editEmail,
          role: editRole
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUsers(prev => prev.map(u => u.id === data.user.id ? { ...u, ...data.user } : u));
        setEditingUser(null);
        setExportNotice(`User "${data.user.name}" updated successfully!`);
        setTimeout(() => setExportNotice(null), 4000);
      } else {
        setEditError(data.error || 'Failed to update user account.');
      }
    } catch (err: any) {
      console.error('Failed to update user:', err);
      setEditError(err.message || 'Network error while saving user.');
    } finally {
      setEditSaving(false);
    }
  };

  const handleOpenDelete = (type: 'user' | 'subscriber', id: string, name?: string, email?: string) => {
    setDeletingTarget({ type, id, name, email });
    setDeleteError(null);
  };

  const handleCloseDelete = () => {
    if (isDeleting) return;
    setDeletingTarget(null);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTarget) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: deletingTarget.type, id: deletingTarget.id })
      });
      const data = await res.json();
      if (data.success) {
        const deletedLabel = deletingTarget.name || deletingTarget.email || deletingTarget.type;
        setDeletingTarget(null);
        fetchRecords();
        setExportNotice(`Successfully deleted ${deletedLabel}!`);
        setTimeout(() => setExportNotice(null), 4000);
      } else {
        setDeleteError(data.error || 'Failed to delete record.');
      }
    } catch (err: any) {
      console.error(`Failed to delete ${deletingTarget.type}:`, err);
      setDeleteError(err.message || 'Network error occurred during deletion.');
    } finally {
      setIsDeleting(false);
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
                      <td className={adminStyles.td} style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className={adminStyles.secondary}
                            style={{
                              minHeight: '32px',
                              padding: '5px 11px',
                              fontSize: '11px',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                            title={`Edit ${user.name}`}
                          >
                            <Pencil size={12} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleOpenDelete('user', user.id, user.name, user.email)}
                            className={adminStyles.danger}
                            style={{
                              minHeight: '32px',
                              padding: '5px 11px',
                              fontSize: '11px',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                            title={`Delete ${user.name}`}
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
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
                      <td className={adminStyles.td} style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => handleOpenDelete('subscriber', sub.id, undefined, sub.email)}
                          className={adminStyles.danger}
                          style={{
                            minHeight: '32px',
                            padding: '5px 11px',
                            fontSize: '11px',
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                          title="Delete / Unsubscribe"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
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

      {/* ── EDIT USER MODAL ── */}
      {editingUser && (
        <div className={adminStyles.modalOverlay} onClick={handleCloseEdit}>
          <div 
            className={adminStyles.modalContent} 
            style={{ maxWidth: 520 }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className={adminStyles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'color-mix(in srgb, var(--accent) 12%, var(--surface))',
                  border: '1px solid color-mix(in srgb, var(--accent) 25%, var(--border))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)'
                }}>
                  <Pencil size={16} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>Edit User Account</h3>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    ID: <span style={{ fontFamily: 'monospace' }}>{editingUser.id}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleCloseEdit} 
                className={adminStyles.modalClose} 
                title="Close Modal" 
                disabled={editSaving}
              >
                <X size={18} />
              </button>
            </div>

            {/* Account Overview Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {editingUser.image ? (
                    <img src={editingUser.image} alt={editingUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={15} style={{ color: 'var(--muted)' }} />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                    {editingUser.name || 'Anonymous User'}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>
                    Joined {new Date(editingUser.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div>
                {editingUser.provider === 'google' ? (
                  <span className={adminStyles.badge}>
                    <Globe size={11} /> Google One Tap
                  </span>
                ) : (
                  <span className={adminStyles.badgeNeutral}>
                    <Key size={11} /> Local Auth
                  </span>
                )}
              </div>
            </div>

            {/* Error Notification inside modal */}
            {editError && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 8,
                color: '#ef4444',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16
              }}>
                <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit}>
              <div className={adminStyles.field}>
                <label className={adminStyles.label}>Full Name</label>
                <input
                  type="text"
                  className={adminStyles.input}
                  placeholder="e.g. John Doe"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={editSaving}
                />
              </div>

              <div className={adminStyles.field}>
                <label className={adminStyles.label}>Email Address</label>
                <input
                  type="email"
                  className={adminStyles.input}
                  placeholder="user@example.com"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  disabled={editSaving}
                />
              </div>

              <div className={adminStyles.field}>
                <label className={adminStyles.label}>Access Role</label>
                <select
                  className={adminStyles.select}
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as 'USER' | 'ADMIN')}
                  disabled={editSaving}
                >
                  <option value="USER">USER — Standard Access (Browsing &amp; Purchases)</option>
                  <option value="ADMIN">ADMIN — Full Administrator Privileges</option>
                </select>
                <span style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                  {editRole === 'ADMIN' 
                    ? '⚠️ Grants full access to CMS, Orders, Settings, and User Management.' 
                    : 'Standard user access without administrative privileges.'}
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                marginTop: 24,
                paddingTop: 16,
                borderTop: '1px solid var(--border)'
              }}>
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className={adminStyles.secondary}
                  disabled={editSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={adminStyles.primary}
                  disabled={editSaving}
                >
                  {editSaving ? (
                    <>
                      <Activity size={14} className="animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deletingTarget && (
        <div className={adminStyles.modalOverlay} onClick={handleCloseDelete}>
          <div 
            className={adminStyles.modalContent} 
            style={{ maxWidth: 460 }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', padding: '10px 0 16px' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14
              }}>
                <AlertTriangle size={24} />
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', margin: '0 0 8px' }}>
                {deletingTarget.type === 'user' ? 'Delete User Account?' : 'Unsubscribe Contact?'}
              </h3>

              <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
                {deletingTarget.type === 'user' ? (
                  <>
                    Are you sure you want to permanently delete{' '}
                    <strong style={{ color: 'var(--text)' }}>
                      {deletingTarget.name || deletingTarget.email || 'this user'}
                    </strong>
                    {deletingTarget.email && ` (${deletingTarget.email})`}?
                    <br />
                    This will delete linked OAuth accounts, active sessions, and revoke all permissions.
                  </>
                ) : (
                  <>
                    Are you sure you want to remove{' '}
                    <strong style={{ color: 'var(--text)' }}>{deletingTarget.email}</strong>{' '}
                    from the newsletter subscriber list?
                  </>
                )}
              </p>
            </div>

            {deleteError && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 8,
                color: '#ef4444',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                margin: '12px 0'
              }}>
                <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                <span>{deleteError}</span>
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: 10,
              marginTop: 20,
              paddingTop: 16,
              borderTop: '1px solid var(--border)'
            }}>
              <button
                type="button"
                onClick={handleCloseDelete}
                className={adminStyles.secondary}
                style={{ flex: 1 }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className={adminStyles.danger}
                style={{ flex: 1 }}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Activity size={14} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
