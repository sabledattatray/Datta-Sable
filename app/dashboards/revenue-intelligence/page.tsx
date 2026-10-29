'use client';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useTheme } from '@/components/ThemeProvider';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Globe,
  Zap,
  LayoutDashboard,
  Target
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Keep ECharts in an async browser chunk instead of the route's main bundle.
const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => <div aria-label="Loading chart" className="h-full min-h-[180px]" />,
});

// --- Data Structure ---

const DATA: any = {
  2024: {
    all: {
      rev: '$8.4M', cust: '1,284', deal: '$6,540', win: '10.4%',
      revChg: [+18.4, 'up'], custChg: [+9.2, 'up'], dealChg: [+4.7, 'up'], winChg: [+1.1, 'up'],
      monthly: [520, 580, 610, 680, 720, 750, 680, 770, 800, 860, 900, 960],
      target: [550, 600, 640, 700, 730, 760, 710, 780, 820, 870, 910, 950],
      channels: [{ n: 'Direct', v: 45, m: '$3.78M', c: '#c9f31d' }, { n: 'Partner', v: 30, m: '$2.52M', c: '#00d4ff' }, { n: 'Online', v: 25, m: '$2.10M', c: '#8b5cf6' }],
      regions: [{ n: 'North AM', v: 88, m: '$3.7M', c: '#c9f31d' }, { n: 'Europe', v: 64, m: '$2.1M', c: '#00d4ff' }, { n: 'APAC', v: 48, m: '$1.5M', c: '#8b5cf6' }, { n: 'LATAM', v: 20, m: '$0.6M', c: '#ef4444' }],
      products: [{ n: 'Enterprise Suite', v: '$2.1M', chg: '+24%', up: true }, { n: 'Pro Platform', v: '$1.8M', chg: '+11%', up: true }, { n: 'Analytics Add-on', v: '$1.4M', chg: '+8%', up: true }, { n: 'Starter Pack', v: '$0.9M', chg: '-3%', up: false }],
      funnel: [{ n: 'Leads', v: 12400, pct: 100 }, { n: 'Qualified', v: 6820, pct: 55 }, { n: 'Proposals', v: 3100, pct: 25 }, { n: 'Closed Won', v: 1284, pct: 10.4 }]
    },
    direct: {
      rev: '$3.78M', cust: '578', deal: '$6,540', win: '12.1%',
      revChg: [+22, 'up'], custChg: [+14, 'up'], dealChg: [+5, 'up'], winChg: [+1.5, 'up'],
      monthly: [235, 261, 275, 306, 324, 338, 306, 347, 360, 387, 405, 432],
      target: [248, 270, 288, 315, 329, 342, 320, 351, 369, 392, 410, 428],
      channels: [{ n: 'Direct', v: 100, m: '$3.78M', c: '#c9f31d' }],
      regions: [{ n: 'North AM', v: 90, m: '$1.7M', c: '#c9f31d' }, { n: 'Europe', v: 70, m: '$1.0M', c: '#00d4ff' }],
      products: [{ n: 'Enterprise Suite', v: '$1.2M', chg: '+28%', up: true }, { n: 'Pro Platform', v: '$1.0M', chg: '+15%', up: true }],
      funnel: [{ n: 'Leads', v: 5580, pct: 100 }, { n: 'Qualified', v: 3348, pct: 60 }, { n: 'Closed Won', v: 578, pct: 10.4 }]
    }
  },
  2023: {
    all: {
      rev: '$7.1M', cust: '1,176', deal: '$6,248', win: '9.3%',
      revChg: [+11.2, 'up'], custChg: [+6.0, 'up'], dealChg: [+2.1, 'up'], winChg: [+0.4, 'up'],
      monthly: [440, 490, 515, 575, 610, 635, 575, 655, 680, 730, 760, 815],
      target: [460, 510, 540, 595, 625, 645, 595, 665, 695, 745, 775, 820],
      channels: [{ n: 'Direct', v: 42, m: '$2.98M', c: '#c9f31d' }, { n: 'Partner', v: 31, m: '$2.20M', c: '#00d4ff' }, { n: 'Online', v: 27, m: '$1.92M', c: '#8b5cf6' }],
      regions: [{ n: 'North AM', v: 85, m: '$3.1M', c: '#c9f31d' }, { n: 'Europe', v: 60, m: '$1.8M', c: '#00d4ff' }],
      products: [{ n: 'Enterprise Suite', v: '$1.7M', chg: '+15%', up: true }, { n: 'Pro Platform', v: '$1.6M', chg: '+8%', up: true }],
      funnel: [{ n: 'Leads', v: 11800, pct: 100 }, { n: 'Closed Won', v: 1098, pct: 9.3 }]
    }
  }
};

// Fallback for missing years/segments in mock
const getSafeData = (year: number, seg: string) => {
  if (DATA[year] && DATA[year][seg]) return DATA[year][seg];
  return DATA[2024].all;
};

// --- Sub-Components ---

const StatCard = ({ label, value, chg, icon: Icon, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[var(--surface2)] border border-[var(--border)] p-5 relative overflow-hidden group"
  >
    <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: color }} />
    <div className="flex justify-between items-start mb-3">
      <span className="text-[length:var(--text-small)] mono uppercase tracking-widest text-[var(--muted)] font-bold">{label}</span>
      <div className="text-[var(--muted)] group-hover:text-[var(--text)] transition-colors">
        <Icon size={14} />
      </div>
    </div>
    <div className="flex items-baseline gap-3">
      <h3 className="text-2xl font-black tracking-tighter">{value}</h3>
      <div className={`text-[length:var(--text-small)] mono font-bold flex items-center ${chg[1] === 'up' ? 'text-green-400' : 'text-red-400'}`}>
        {chg[1] === 'up' ? '↑' : '↓'} {chg[0]}%
      </div>
    </div>
    <div className="text-[length:var(--text-small)] text-[var(--muted)] uppercase mt-1 opacity-60">vs prior period</div>
  </motion.div>
);

export default function RevenueIntelligence() {
  const { theme } = useTheme();
  const chartText = theme === 'light' ? '#475569' : '#b3bdcc';
  const [year, setYear] = useState(2024);
  const [seg, setSeg] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const data = useMemo(() => getSafeData(year, seg), [year, seg]);

  // Chart Options
  const barLineOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#000', borderColor: '#333', textStyle: { color: '#fff' } },
    grid: { left: '2%', right: '2%', bottom: '2%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisLine: { lineStyle: { color: '#222' } },
      axisLabel: { color: chartText, fontSize: 14, fontFamily: 'JetBrains Mono' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#111' } },
      axisLabel: { color: chartText, fontSize: 14, fontFamily: 'JetBrains Mono', formatter: '${value}k' }
    },
    series: [
      {
        name: 'Revenue',
        type: 'bar',
        data: data.monthly,
        itemStyle: { color: '#c9f31d', borderRadius: [2, 2, 0, 0] },
        barWidth: '40%'
      },
      {
        name: 'Target',
        type: 'line',
        data: data.target,
        symbol: 'none',
        lineStyle: { type: 'dashed', color: '#00d4ff', width: 1 },
        smooth: true
      }
    ]
  };

  const donutOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['60%', '80%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 0, borderColor: '#000', borderWidth: 2 },
      label: { show: false },
      data: data.channels.map((c: any) => ({ value: c.v, name: c.n, itemStyle: { color: c.c } }))
    }]
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans antialiased">
        <Navbar />
        <main className="boxed-wrapper mt-24 mb-12 relative z-10 overflow-hidden">
          <div className="py-24 text-center text-xs text-[var(--muted)] mono uppercase tracking-widest">
            Initializing Revenue Intelligence Engine...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans antialiased">
      <Navbar />

      <main className="boxed-wrapper mt-24 mb-12 relative z-10 overflow-hidden">
        {/* Technical Header */}
        <div className="border-b border-[var(--border)] bg-[var(--surface2)]/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <LayoutDashboard size={18} className="text-[var(--accent)]" />
              <h1 className="text-lg font-black uppercase tracking-tight">Revenue Intelligence</h1>
            </div>
            <p className="text-[length:var(--text-small)] mono text-[var(--muted)] uppercase tracking-widest">
              FY {year} · {seg === 'all' ? 'Unified Segments' : `${seg.toUpperCase()} Channels`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[2024, 2023, 2022].map(y => (
              <button 
                key={y} 
                onClick={() => setYear(y)}
                className={`px-4 py-1.5 text-[length:var(--text-small)] mono transition-all border ${year === y ? 'bg-[var(--accent)] text-black border-[var(--accent)] font-bold shadow-[0_0_10px_rgba(201,243,29,0.2)]' : 'bg-black text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)]/50 hover:text-white'}`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Segment Filters */}
        <div className="flex border-b border-[var(--border)] bg-[var(--bg)]">
          {['all', 'direct', 'partner', 'online'].map(s => (
            <button 
              key={s} 
              onClick={() => setSeg(s)}
              className={`flex-1 py-3 text-[length:var(--text-small)] font-bold uppercase tracking-widest transition-all border-r border-[var(--border)] last:border-0 ${seg === s ? 'bg-[var(--accent)]/5 text-[var(--accent)]' : 'text-[var(--muted)] hover:text-white'}`}
            >
              {s === 'all' ? 'All Segments' : s}
              {seg === s && <motion.div layoutId="seg-active" className="h-[2px] bg-[var(--accent)] absolute bottom-0 left-0 w-full" />}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Revenue" value={data.rev} chg={data.revChg} icon={DollarSign} color="#c9f31d" />
            <StatCard label="New Customers" value={data.cust} chg={data.custChg} icon={Users} color="#00d4ff" />
            <StatCard label="Avg Deal Size" value={data.deal} chg={data.dealChg} icon={Zap} color="#8b5cf6" />
            <StatCard label="Win Rate" value={data.win} chg={data.winChg} icon={Target} color="#f59e0b" />
          </div>

          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[var(--surface2)] border border-[var(--border)] p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Monthly Revenue Engine</h3>
                <div className="flex items-center gap-4 text-[length:var(--text-small)] mono">
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[var(--accent)]" /> Revenue</span>
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#00d4ff] opacity-50" /> Target</span>
                </div>
              </div>
              <div className="h-[240px]">
                <ReactECharts option={barLineOption} style={{ height: '100%' }} />
              </div>
            </div>

            <div className="bg-[var(--surface2)] border border-[var(--border)] p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-6">Channel Distribution</h3>
              <div className="h-[180px] mb-6">
                <ReactECharts option={donutOption} style={{ height: '100%' }} />
              </div>
              <div className="space-y-3">
                {data.channels.map((c: any) => (
                  <div key={c.n} className="flex justify-between items-center text-[length:var(--text-small)] mono">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2" style={{ background: c.c }} />
                      <span className="text-[var(--muted)]">{c.n}</span>
                    </div>
                    <span className="font-bold">{c.v}% · {c.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lower Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[var(--surface2)] border border-[var(--border)] p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-6">Regional Performance</h3>
              <div className="space-y-5">
                {data.regions.map((r: any) => (
                  <div key={r.n} className="space-y-1.5">
                    <div className="flex justify-between text-[length:var(--text-small)] mono">
                      <span className="text-[var(--muted)]">{r.n}</span>
                      <span className="text-white font-bold">{r.m}</span>
                    </div>
                    <div className="h-1.5 bg-black border border-[var(--border)] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${r.v}%` }}
                        className="h-full"
                        style={{ background: r.c }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--surface2)] border border-[var(--border)] p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-6">Top Product Velocity</h3>
              <div className="space-y-1">
                {data.products.map((p: any) => (
                  <div key={p.n} className="flex justify-between items-center py-3 border-b border-[var(--border)] last:border-0">
                    <span className="text-[length:var(--text-small)]">{p.n}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[length:var(--text-small)] mono font-bold">{p.v}</span>
                      <span className={`text-[length:var(--text-small)] px-1.5 py-0.5 rounded-sm mono font-bold ${p.up ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {p.chg}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--surface2)] border border-[var(--border)] p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-6">Conversion Funnel</h3>
              <div className="space-y-4">
                {data.funnel.map((f: any, idx: number) => (
                  <div key={f.n} className="relative">
                    <div className="flex justify-between text-[length:var(--text-small)] mono mb-1 relative z-10">
                      <span className="text-[var(--muted)]">{f.n}</span>
                      <span className="text-white">{f.v.toLocaleString()}</span>
                    </div>
                    <div className="h-4 bg-black border border-[var(--border)] relative overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${f.pct}%` }}
                        className="h-full opacity-30"
                        style={{ background: '#c9f31d' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-[length:var(--text-small)] mono font-bold opacity-40">
                        {f.pct}%
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-6 pt-4 border-t border-[var(--border)] flex justify-between items-center">
                  <span className="text-[length:var(--text-small)] mono uppercase text-[var(--muted)]">Overall Efficiency</span>
                  <span className="text-[var(--accent)] text-lg font-black">{data.funnel[data.funnel.length-1].pct}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
