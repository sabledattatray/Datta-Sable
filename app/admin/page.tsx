'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import {
  Briefcase, FileText, MessageSquare, Star, TrendingUp, TrendingDown,
  ArrowUpRight, Users, Eye, Clock, Zap, BarChart3, Activity,
  ChevronRight, Globe, Edit, Layers, Settings,
} from 'lucide-react';

// ── KPI data ──────────────────────────────────────────────────────────
const kpis = [
  {
    title: 'Total Projects',
    value: '12',
    change: '+2',
    trend: 'up',
    icon: Briefcase,
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    glow: 'rgba(99,102,241,0.25)',
    sub: 'Published this quarter',
  },
  {
    title: 'Blog Articles',
    value: '28',
    change: '+5',
    trend: 'up',
    icon: FileText,
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    glow: 'rgba(6,182,212,0.25)',
    sub: '4.2k total reads',
  },
  {
    title: 'Client Reviews',
    value: '16',
    change: '+3',
    trend: 'up',
    icon: Star,
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    glow: 'rgba(245,158,11,0.25)',
    sub: '100% satisfaction rate',
  },
  {
    title: 'Lead Inquiries',
    value: '4',
    change: '2 unread',
    trend: 'up',
    icon: MessageSquare,
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
    glow: 'rgba(236,72,153,0.25)',
    sub: 'New messages today',
  },
];

// ── Quick actions ─────────────────────────────────────────────────────
const quickActions = [
  { label: 'New Project', href: '/admin/projects', icon: Briefcase, color: '#6366f1' },
  { label: 'Write Article', href: '/admin/editor', icon: Edit, color: '#06b6d4' },
  { label: 'View Messages', href: '/admin/messages', icon: MessageSquare, color: '#ec4899' },
  { label: 'Live Analytics', href: '/analytics-live', icon: Activity, color: '#10b981' },
  { label: 'n8n Automation', href: 'https://n8n.io', icon: Zap, color: '#f59e0b' },
  { label: 'Add Service', href: '/admin/services', icon: Layers, color: '#e0a96d' },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Star, color: '#f43f5e' },
  { label: 'Settings', href: '/admin/settings', icon: Settings, color: '#8b5cf6' },
];

// ── Recent activity ───────────────────────────────────────────────────
const activity = [
  { icon: '💬', text: 'New inquiry from Sarah Johnson — Dashboard Development', time: '2 hours ago', color: '#6366f1' },
  { icon: '📝', text: 'Blog article "SQL Window Functions" published', time: '5 hours ago', color: '#06b6d4' },
  { icon: '⭐', text: 'New testimonial from Mike Ross pending review', time: 'Yesterday', color: '#f59e0b' },
  { icon: '🚀', text: 'Project "Analytics Dashboard" marked complete', time: '2 days ago', color: '#10b981' },
  { icon: '📩', text: 'New inquiry from Priya Verma — Automation', time: '3 days ago', color: '#ec4899' },
];

// ── Visitors chart data ───────────────────────────────────────────────
const chartData = [
  { label: 'Jan', value: 420, prev: 310 },
  { label: 'Feb', value: 580, prev: 420 },
  { label: 'Mar', value: 510, prev: 460 },
  { label: 'Apr', value: 690, prev: 510 },
  { label: 'May', value: 750, prev: 620 },
  { label: 'Jun', value: 870, prev: 710 },
  { label: 'Jul', value: 940, prev: 790 },
];

// ── Mini sparkline component ──────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 80, h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ChartItem {
  label: string;
  value: number;
  prev: number;
}

// Static placeholder data used while stats are loading — same shape so no CLS
const PLACEHOLDER_CHART: ChartItem[] = [
  { label: 'Dec', value: 380, prev: 280 },
  { label: 'Jan', value: 420, prev: 310 },
  { label: 'Feb', value: 580, prev: 420 },
  { label: 'Mar', value: 510, prev: 460 },
  { label: 'Apr', value: 690, prev: 510 },
  { label: 'May', value: 750, prev: 620 },
];

// ── Bar chart component ───────────────────────────────────────────────
function BarChartPanel({ isDark, css, data, loading }: { isDark: boolean; css: Record<string, string>; data: ChartItem[]; loading?: boolean }) {
  const items = data && data.length > 0 ? data : PLACEHOLDER_CHART;
  const max = Math.max(...items.map(d => d.value), 1);
  return (
    <div style={{ width: '100%', height: 220, display: 'flex', alignItems: 'flex-end', gap: 10, padding: '0 8px', position: 'relative' }}>
      {loading && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'flex-end', gap: 10, padding: '0 8px',
          pointerEvents: 'none',
        }}>
          {items.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', gap: 3, height: 190 }}>
                <div style={{ flex: 1, height: `${(d.prev / max) * 100}%`, background: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.06)', borderRadius: '5px 5px 0 0', animation: 'shimmer 1.6s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
                <div style={{ flex: 1, height: `${(d.value / max) * 100}%`, background: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)', borderRadius: '5px 5px 0 0', animation: 'shimmer 1.6s ease-in-out infinite', animationDelay: `${i * 0.1 + 0.05}s` }} />
              </div>
              <div style={{ width: 24, height: 10, borderRadius: 4, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', animation: 'shimmer 1.6s ease-in-out infinite' }} />
            </div>
          ))}
        </div>
      )}
      {!loading && items.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', gap: 3, height: 190 }}>
            <div
              style={{
                flex: 1,
                height: `${(d.prev / max) * 100}%`,
                background: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.12)',
                borderRadius: '5px 5px 0 0',
                transition: 'height 0.8s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
            <div
              style={{
                flex: 1,
                height: `${(d.value / max) * 100}%`,
                background: 'linear-gradient(180deg, #818cf8, #6366f1)',
                borderRadius: '5px 5px 0 0',
                transition: 'height 0.8s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
              }}
            />
          </div>
          <span style={{ fontSize: 11, color: css.muted, fontWeight: 600 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

interface ActivityItem {
  icon: string;
  text: string;
  time: string;
  color: string;
}

interface AdminStats {
  totalProjects: number;
  totalPosts: number;
  totalTestimonials: number;
  totalMessages: number;
  unreadMessages: number;
  totalUsers?: number;
  totalSubscribers?: number;
  totalViews: number;
  uniqueVisitors: number;
  bounceRate: string;
  avgSessionDuration: string;
  activities: ActivityItem[];
  chartData: ChartItem[];
}

export default function AdminDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState('');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [typography, setTypography] = useState({
    fontFamily: 'Inter',
    fontSize: '14px',
    color: '',
    fontWeight: '500',
  });

  // Load typography from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_typography');
      if (saved) {
        try {
          setTypography(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse typography settings', e);
        }
      }
    }
  }, []);

  // Dynamically inject selected Google Font
  useEffect(() => {
    if (typography.fontFamily && typography.fontFamily !== 'Inter' && typeof window !== 'undefined') {
      const linkId = 'google-font-import';
      let link = document.getElementById(linkId) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      link.href = `https://fonts.googleapis.com/css2?family=${typography.fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&display=swap`;
    }
  }, [typography.fontFamily]);

  useEffect(() => {
    setMounted(true);
    const tick = () => setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    tick();
    const id = setInterval(tick, 60000);

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();

    // Auto-refresh every 30 seconds so counts stay accurate after deletes/adds
    const refreshId = setInterval(fetchStats, 30000);

    // Also refresh immediately when the user switches back to this tab
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchStats();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(id);
      clearInterval(refreshId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);


  const defaultAccent = isDark ? '#6366f1' : '#4f46e5';
  const currentAccent = typography.color || defaultAccent;
  const fontFamilyValue = typography.fontFamily && typography.fontFamily !== 'Inter' 
    ? `'${typography.fontFamily}', sans-serif` 
    : 'inherit';
  
  const getGlow = (hex: string, alpha: number) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    const r = parseInt(c.substring(0, 2), 16) || 99;
    const g = parseInt(c.substring(2, 4), 16) || 102;
    const b = parseInt(c.substring(4, 6), 16) || 241;
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const css = isDark
    ? {
        bg: '#000000',
        surface: '#000000',
        surface2: '#121212',
        border: '#1a1a1a',
        text: '#f1f5f9',
        muted: '#64748b',
        accent: currentAccent,
        accentGlow: getGlow(currentAccent, 0.12),
        card: '#000000',
        shadow: '0 4px 24px rgba(0,0,0,0.35)',
        shadowHover: '0 8px 32px rgba(0,0,0,0.5)',
        headerGrad: `linear-gradient(135deg, ${getGlow(currentAccent, 0.15)} 0%, #121212 50%, #000000 100%)`,
      }
    : {
        bg: '#f0f4ff',
        surface: '#ffffff',
        surface2: '#f8faff',
        border: '#e2e8f0',
        text: '#0f172a',
        muted: '#64748b',
        accent: currentAccent,
        accentGlow: getGlow(currentAccent, 0.07),
        card: '#ffffff',
        shadow: '0 4px 24px rgba(0,0,0,0.07)',
        shadowHover: '0 8px 32px rgba(0,0,0,0.12)',
        headerGrad: `linear-gradient(135deg, ${currentAccent} 0%, #6366f1 50%, #818cf8 100%)`,
      };

  // Don't block render — show placeholder layout immediately and let data hydrate in

  return (
    <div
      className="admin-dashboard-root"
      style={{
        minHeight: '100vh',
        background: css.bg,
        fontSize: typography.fontSize || '14px',
        fontWeight: typography.fontWeight ? (typography.fontWeight as any) : '500',
      }}
    >

      {/* ═══════════ HERO HEADER BANNER ═══════════ */}
      <div
        style={{
          background: css.headerGrad,
          padding: '36px 32px 72px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, right: 100, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 20, left: '40%', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Zap size={16} color="rgba(255,255,255,0.7)" />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Admin Console
                </span>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                Dashboard Overview
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', margin: '6px 0 0', fontWeight: 500 }}>
                Welcome back! Everything looks good today.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '8px 16px' }}>
              <Clock size={14} color="rgba(255,255,255,0.7)" />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>
                {time || '--:--'}
              </span>
              <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>IST</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ CONTENT AREA ═══════════ */}
      <div className="admin-content-area" style={{ marginTop: -52, position: 'relative', zIndex: 2 }}>

        {/* ── KPI STAT CARDS ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 18,
            marginBottom: 28,
          }}
        >
          {[
            {
              title: 'Total Projects',
              value: stats ? stats.totalProjects.toString() : '...',
              change: stats ? `+${stats.totalProjects}` : '+0',
              trend: 'up',
              icon: Briefcase,
              gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              glow: 'rgba(99,102,241,0.25)',
              sub: 'Published projects',
            },
            {
              title: 'Blog Articles',
              value: stats ? stats.totalPosts.toString() : '...',
              change: stats ? `+${stats.totalPosts}` : '+0',
              trend: 'up',
              icon: FileText,
              gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              glow: 'rgba(6,182,212,0.25)',
              sub: 'Articles in database',
            },
            {
              title: 'Client Reviews',
              value: stats ? stats.totalTestimonials.toString() : '...',
              change: '+0',
              trend: 'up',
              icon: Star,
              gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
              glow: 'rgba(245,158,11,0.25)',
              sub: 'Reviews displayed',
            },
            {
              title: 'Lead Inquiries',
              value: stats ? stats.totalMessages.toString() : '...',
              change: stats ? `${stats.unreadMessages} unread` : '...',
              trend: 'up',
              icon: MessageSquare,
              gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
              glow: 'rgba(236,72,153,0.25)',
              sub: 'Total contact queries',
            },
            {
              title: 'Registered Users',
              value: stats ? (stats.totalUsers ?? 39).toString() : '...',
              change: stats ? `+${stats.totalUsers ?? 39}` : '+0',
              trend: 'up',
              icon: Users,
              gradient: 'linear-gradient(135deg, #10b981, #059669)',
              glow: 'rgba(16,185,129,0.25)',
              sub: 'Platform user accounts',
            },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            const valNum = stats ? parseInt(kpi.value) : 0;
            const sparkData = [40, 55, 48, 70, 65, 85, isNaN(valNum) || valNum === 0 ? 88 : (valNum % 100 || 88)];
            return (
              <div
                key={i}
                style={{
                  background: css.card,
                  border: `1px solid ${css.border}`,
                  borderRadius: 20,
                  padding: 22,
                  boxShadow: css.shadow,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = css.shadowHover;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = css.shadow;
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: kpi.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 6px 16px ${kpi.glow}`,
                    }}
                  >
                    <Icon size={22} color="#fff" />
                  </div>
                  <Sparkline data={sparkData} color={kpi.gradient.includes('6366f1') ? '#6366f1' : kpi.gradient.includes('06b6d4') ? '#06b6d4' : kpi.gradient.includes('f59e0b') ? '#f59e0b' : '#ec4899'} />
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
                  {kpi.title}
                </p>
                <p style={{ fontSize: 30, fontWeight: 900, color: css.text, margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {kpi.value}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: kpi.trend === 'up' ? '#10b981' : '#ef4444',
                      background: kpi.trend === 'up' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      padding: '2px 7px',
                      borderRadius: 999,
                    }}
                  >
                    {kpi.trend === 'up' ? '↑' : '↓'} {kpi.change}
                  </span>
                  <span style={{ fontSize: 11, color: css.muted }}>{kpi.sub}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── MAIN GRID: Chart + Activity ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
            gap: 20,
            marginBottom: 20,
          }}
          className="admin-dash-main-grid"
        >
          {/* Visitors Bar Chart */}
          <div
            style={{
              background: css.card,
              border: `1px solid ${css.border}`,
              borderRadius: 20,
              padding: 24,
              boxShadow: css.shadow,
              minHeight: 320,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
                  Visitor Analytics
                </p>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: css.text, margin: 0 }}>
                  Portfolio Traffic
                </h3>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: '#6366f1' }} />
                  <span style={{ fontSize: 11, color: css.muted, fontWeight: 600 }}>This year</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.12)' }} />
                  <span style={{ fontSize: 11, color: css.muted, fontWeight: 600 }}>Last year</span>
                </div>
                {loading && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: css.muted, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', padding: '3px 8px', borderRadius: 999, letterSpacing: '0.06em' }}>
                    LOADING…
                  </span>
                )}
              </div>
            </div>
            <BarChartPanel isDark={isDark} css={css} data={stats ? stats.chartData : PLACEHOLDER_CHART} loading={loading} />
          </div>

          {/* Recent Activity */}
          <div
            style={{
              background: css.card,
              border: `1px solid ${css.border}`,
              borderRadius: 20,
              padding: 24,
              boxShadow: css.shadow,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
                  Recent
                </p>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: css.text, margin: 0 }}>Activity Feed</h3>
              </div>
              <Activity size={18} color={css.muted} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {(stats ? stats.activities : activity).map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '10px 0',
                    borderBottom: i < (stats ? stats.activities.length : activity.length) - 1 ? `1px solid ${css.border}` : 'none',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      border: `1px solid ${css.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 15,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: css.text, margin: 0, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as any}>
                      {item.text}
                    </p>
                    <p style={{ fontSize: 11, color: css.muted, margin: '3px 0 0' }}>{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── QUICK ACTIONS + SITE STATS + TYPOGRAPHY ROW ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 20,
          }}
          className="admin-dash-bottom-grid"
        >
          {/* Quick Actions */}
          <div
            style={{
              background: css.card,
              border: `1px solid ${css.border}`,
              borderRadius: 20,
              padding: 24,
              boxShadow: css.shadow,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
                Management
              </p>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: css.text, margin: 0 }}>Quick Actions</h3>
            </div>
            <div className="admin-dash-quick-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                const isExternal = action.href.startsWith('http');
                return (
                  <Link
                      key={i}
                      href={action.href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      padding: '14px 8px',
                      background: css.surface2,
                      border: `1px solid ${css.border}`,
                      borderRadius: 14,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = `${action.color}12`;
                      el.style.borderColor = `${action.color}40`;
                      el.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = css.surface2;
                      el.style.borderColor = css.border;
                      el.style.transform = 'translateY(0)';
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: `${action.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={18} color={action.color} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: css.text, textAlign: 'center', lineHeight: 1.2 }}>
                      {action.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Site Performance Metrics */}
          <div
            style={{
              background: css.card,
              border: `1px solid ${css.border}`,
              borderRadius: 20,
              padding: 24,
              boxShadow: css.shadow,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
                Performance
              </p>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: css.text, margin: 0 }}>Site Metrics</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                {
                  label: 'Page Views',
                  value: stats ? stats.totalViews.toLocaleString('en-IN') : '...',
                  change: stats ? '+24%' : '+18%',
                  bar: stats ? Math.min(100, Math.max(15, Math.round((stats.totalViews / Math.max(stats.uniqueVisitors * 5, 100)) * 100))) : 78,
                  color: css.accent,
                },
                {
                  label: 'Unique Visitors',
                  value: stats ? stats.uniqueVisitors.toLocaleString('en-IN') : '...',
                  change: stats ? '+15%' : '+12%',
                  bar: stats ? Math.min(100, Math.max(10, Math.round((stats.uniqueVisitors / Math.max(stats.totalViews, 1)) * 100))) : 52,
                  color: '#06b6d4',
                },
                {
                  label: 'Avg. Session',
                  value: stats ? stats.avgSessionDuration : '...',
                  change: '+7%',
                  bar: 64,
                  color: '#10b981',
                },
                {
                  label: 'Bounce Rate',
                  value: stats ? stats.bounceRate : '...',
                  change: '-5%',
                  bar: stats ? parseInt(stats.bounceRate) || 32 : 32,
                  color: '#f59e0b',
                },
              ].map((m, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: css.muted }}>{m.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: css.text }}>{m.value}</span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: m.change.startsWith('+') ? '#10b981' : '#ef4444',
                          background: m.change.startsWith('+') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                          padding: '1px 6px',
                          borderRadius: 999,
                        }}
                      >
                        {m.change}
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 5, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${m.bar}%`,
                        background: m.color,
                        borderRadius: 999,
                        transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* View live site link */}
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 18,
                fontSize: 12,
                fontWeight: 700,
                color: css.accent,
                textDecoration: 'none',
                padding: '8px 12px',
                background: `${css.accent}0f`,
                border: `1px solid ${css.accent}30`,
                borderRadius: 10,
                width: 'fit-content',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.75'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            >
              <Globe size={13} /> View Live Site <ArrowUpRight size={12} />
            </Link>
          </div>

          {/* Typography Customizer Card */}
          <div
            style={{
              background: css.card,
              border: `1px solid ${css.border}`,
              borderRadius: 20,
              padding: 24,
              boxShadow: css.shadow,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
                  Aesthetics
                </p>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: css.text, margin: 0 }}>Styling & Fonts</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Font Family selector */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Google Font
                  </label>
                  <select
                    value={typography.fontFamily}
                    onChange={e => {
                      const newTypo = { ...typography, fontFamily: e.target.value };
                      setTypography(newTypo);
                      localStorage.setItem('admin_typography', JSON.stringify(newTypo));
                      window.dispatchEvent(new Event('admin_typography_changed'));
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: css.surface2,
                      border: `1px solid ${css.border}`,
                      borderRadius: 10,
                      color: css.text,
                      fontSize: 13,
                      fontWeight: 600,
                      outline: 'none',
                    }}
                  >
                    {['Inter', 'Poppins', 'Outfit', 'Montserrat', 'Playfair Display', 'Lora', 'Fira Code', 'Space Grotesk', 'Syne', 'Roboto', 'Open Sans', 'Merriweather'].map(f => (
                      <option key={f} value={f} style={{ background: css.surface, color: css.text }}>{f}</option>
                    ))}
                  </select>
                </div>

                {/* Font Size selector */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Font Size
                  </label>
                  <select
                    value={typography.fontSize}
                    onChange={e => {
                      const newTypo = { ...typography, fontSize: e.target.value };
                      setTypography(newTypo);
                      localStorage.setItem('admin_typography', JSON.stringify(newTypo));
                      window.dispatchEvent(new Event('admin_typography_changed'));
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: css.surface2,
                      border: `1px solid ${css.border}`,
                      borderRadius: 10,
                      color: css.text,
                      fontSize: 13,
                      fontWeight: 600,
                      outline: 'none',
                    }}
                  >
                    {[
                      { label: 'Compact (13px)', value: '13px' },
                      { label: 'Normal (14px)', value: '14px' },
                      { label: 'Comfort (15px)', value: '15px' },
                      { label: 'Large (16px)', value: '16px' },
                    ].map(sz => (
                      <option key={sz.value} value={sz.value} style={{ background: css.surface, color: css.text }}>{sz.label}</option>
                    ))}
                  </select>
                </div>

                {/* Font Weight selector */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Font Weight (Body)
                  </label>
                  <select
                    value={typography.fontWeight}
                    onChange={e => {
                      const newTypo = { ...typography, fontWeight: e.target.value };
                      setTypography(newTypo);
                      localStorage.setItem('admin_typography', JSON.stringify(newTypo));
                      window.dispatchEvent(new Event('admin_typography_changed'));
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: css.surface2,
                      border: `1px solid ${css.border}`,
                      borderRadius: 10,
                      color: css.text,
                      fontSize: 13,
                      fontWeight: 600,
                      outline: 'none',
                    }}
                  >
                    {[
                      { label: 'Light (300)', value: '300' },
                      { label: 'Regular (400)', value: '400' },
                      { label: 'Medium (500)', value: '500' },
                      { label: 'Semi-Bold (600)', value: '600' },
                      { label: 'Bold (700)', value: '700' },
                    ].map(w => (
                      <option key={w.value} value={w.value} style={{ background: css.surface, color: css.text }}>{w.label}</option>
                    ))}
                  </select>
                </div>

                {/* Color Accent Picker */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: css.muted, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Color Accent Theme
                  </label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                      { name: 'Default', hex: '' },
                      { name: 'Indigo', hex: '#6366f1' },
                      { name: 'Emerald', hex: '#10b981' },
                      { name: 'Cyan', hex: '#06b6d4' },
                      { name: 'Amber', hex: '#f59e0b' },
                      { name: 'Rose', hex: '#ec4899' },
                      { name: 'Violet', hex: '#8b5cf6' },
                      { name: 'Orange', hex: '#f97316' },
                    ].map(c => (
                      <button
                        key={c.name}
                        onClick={() => {
                          const newTypo = { ...typography, color: c.hex };
                          setTypography(newTypo);
                          localStorage.setItem('admin_typography', JSON.stringify(newTypo));
                          window.dispatchEvent(new Event('admin_typography_changed'));
                        }}
                        title={c.name}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: c.hex || (isDark ? '#6366f1' : '#4f46e5'),
                          border: typography.color === c.hex ? `2px solid ${css.text}` : '2px solid transparent',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          transition: 'all 0.2s',
                          transform: 'scale(1)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Live Preview */}
            <div
              style={{
                marginTop: 20,
                padding: 12,
                borderRadius: 12,
                background: css.surface2,
                border: `1.5px dashed ${css.border}`,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Live Preview</span>
              <p
                style={{
                  margin: '4px 0 0',
                  fontFamily: typography.fontFamily === 'Inter' ? 'inherit' : `'${typography.fontFamily}', sans-serif`,
                  fontSize: typography.fontSize,
                  fontWeight: parseInt(typography.fontWeight) || 500,
                  color: css.accent,
                  lineHeight: 1.4,
                }}
              >
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .admin-dashboard-root, 
        .admin-dashboard-root * {
          font-family: ${fontFamilyValue} !important;
        }
        .admin-content-area {
          padding: 0 28px 40px;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 900px) {
          .admin-dash-main-grid { grid-template-columns: 1fr !important; }
          .admin-dash-bottom-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .admin-content-area {
            padding: 0 16px 32px;
          }
          .admin-dash-main-grid { grid-template-columns: 1fr !important; }
          .admin-dash-bottom-grid { grid-template-columns: 1fr !important; }
          .admin-dash-quick-actions { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 400px) {
          .admin-dash-quick-actions { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
