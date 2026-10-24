'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@/components/ThemeProvider';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Search, 
  RefreshCw, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Zap,
  Terminal as TerminalIcon,
  Filter
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// --- Types & Data ---

type Transaction = {
  id: string;
  customer: string;
  region: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TX-9021', customer: 'James Carter', region: 'USA', amount: 12450, status: 'Completed', date: '2026-05-14' },
  { id: 'TX-9022', customer: 'Sophia Lee', region: 'Germany', amount: 8920, status: 'Pending', date: '2026-05-14' },
  { id: 'TX-9023', customer: 'Aarav Mehta', region: 'India', amount: 15780, status: 'Completed', date: '2026-05-13' },
  { id: 'TX-9024', customer: 'Elena Rodriguez', region: 'Spain', amount: 4500, status: 'Completed', date: '2026-05-13' },
  { id: 'TX-9025', customer: 'Liam Wilson', region: 'UK', amount: 2100, status: 'Failed', date: '2026-05-12' },
  { id: 'TX-9026', customer: 'Yuki Tanaka', region: 'Japan', amount: 18900, status: 'Completed', date: '2026-05-12' },
];

// --- Sub-Components ---

const TechnicalCorner = ({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const styles = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r"
  };
  return <div className={`absolute w-3 h-3 border-[var(--accent)] opacity-40 ${styles[pos]}`} />;
};

const StatCard = ({ label, value, trend, icon: Icon, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="relative bg-[var(--surface2)] border border-[var(--border)] p-6 overflow-hidden group"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent)] opacity-[0.03] blur-3xl group-hover:opacity-[0.08] transition-opacity" />
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-[var(--tag-bg)] border border-[var(--border)] text-[var(--accent)] group-hover:scale-110 transition-transform">
        <Icon size={20} />
      </div>
      <div className={`flex items-center gap-1 text-[length:var(--text-small)] mono font-bold ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
        {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {Math.abs(trend)}%
      </div>
    </div>
    <p className="text-[length:var(--text-small)] uppercase tracking-widest text-[var(--muted)] font-bold mb-1">{label}</p>
    <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
    <div className="mt-4 w-full h-1 bg-[var(--border)] rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: '70%' }}
        className="h-full"
        style={{ background: color || 'var(--accent)' }}
      />
    </div>
  </motion.div>
);

export default function InteractiveDashboard() {
  const { theme } = useTheme();
  const chartText = theme === 'light' ? '#475569' : '#b3bdcc';
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [syncTime, setSyncTime] = useState('');
  const [liveData, setLiveData] = useState([120, 132, 101, 134, 90, 230, 210]);

  useEffect(() => {
    setMounted(true);
    setSyncTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setSyncTime(new Date().toLocaleTimeString());
      setLiveData(prev => [...prev.slice(1), Math.floor(Math.random() * 200) + 50]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(t => 
      t.customer.toLowerCase().includes(search.toLowerCase()) || 
      t.region.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Chart Options
  const lineChartOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#111', borderColor: '#333', textStyle: { color: '#fff' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: { lineStyle: { color: '#333' } },
      axisLabel: { color: chartText, fontSize: 14 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#1a1a1a' } },
      axisLabel: { color: chartText, fontSize: 14 }
    },
    series: [{
      name: 'Revenue',
      type: 'line',
      smooth: true,
      data: liveData,
      symbol: 'none',
      lineStyle: { width: 3, color: '#c9f31d' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(201, 243, 29, 0.2)' },
            { offset: 1, color: 'rgba(201, 243, 29, 0)' }
          ]
        }
      }
    }]
  };

  const donutChartOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    legend: { bottom: '0', left: 'center', textStyle: { color: chartText, fontSize: 14 }, icon: 'circle' },
    series: [{
      name: 'Regional Sales',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 2, borderColor: '#000', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: '14', fontWeight: 'bold', color: '#fff' } },
      data: [
        { value: 1048, name: 'North America', itemStyle: { color: '#c9f31d' } },
        { value: 735, name: 'Europe', itemStyle: { color: '#00d4ff' } },
        { value: 580, name: 'Asia', itemStyle: { color: '#8b5cf6' } },
        { value: 484, name: 'Others', itemStyle: { color: '#333' } }
      ]
    }]
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans antialiased">
        <Navbar />
        <main className="boxed-wrapper relative z-10 overflow-hidden">
          <div className="py-24 text-center text-xs text-[var(--muted)] mono uppercase tracking-widest">
            Initializing Interactive Analytics...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans antialiased">
      <Navbar />

      <main className="boxed-wrapper relative z-10 overflow-hidden">
        {/* Corners */}
        <TechnicalCorner pos="tl" />
        <TechnicalCorner pos="tr" />
        <TechnicalCorner pos="bl" />
        <TechnicalCorner pos="br" />

        {/* Header Section */}
        <div className="border-b border-[var(--border)] bg-[var(--surface2)]/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-12 h-12 rounded bg-[var(--accent)] flex items-center justify-center text-black shadow-[0_0_20px_rgba(201,243,29,0.3)]">
                <Activity size={24} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black border border-[var(--border)] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-black uppercase tracking-tight">Revenue Intelligence</h1>
                <span className="text-[length:var(--text-small)] mono px-1.5 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">v2.4.0</span>
              </div>
              <div className="flex items-center gap-4 text-[length:var(--text-small)] mono text-[var(--muted)] uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><RefreshCw size={10} className="animate-spin-slow" /> System Live</span>
                <span className="text-[var(--border)]">|</span>
                <span>Last Sync: <span className="text-white">{syncTime}</span></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end mr-4">
              <span className="text-[length:var(--text-small)] mono text-[var(--muted)] uppercase">Network Load</span>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`w-1 h-3 ${i < 4 ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />
                ))}
              </div>
            </div>
            <button className="px-5 py-2.5 bg-[var(--accent)] text-black text-[length:var(--text-small)] font-black uppercase tracking-widest hover:bg-white transition-colors">
              Export Data
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Revenue" value="$842,500" trend={18.4} icon={DollarSign} color="var(--accent)" />
            <StatCard label="Active Users" value="12,840" trend={12.2} icon={Users} color="#00d4ff" />
            <StatCard label="Total Orders" value="4,210" trend={-2.4} icon={ShoppingCart} color="#f59e0b" />
            <StatCard label="Conversion" value="6.82%" trend={4.1} icon={TrendingUp} color="#8b5cf6" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--surface2)] border border-[var(--border)] p-6 relative group">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-lg font-bold">Performance Analytics</h3>
                  <p className="text-[length:var(--text-small)] text-[var(--muted)]">Real-time revenue velocity tracking</p>
                </div>
                <div className="flex gap-2">
                  {['1D', '1W', '1M', '1Y'].map(t => (
                    <button key={t} className={`px-2 py-1 text-[length:var(--text-small)] mono border border-[var(--border)] ${t === '1W' ? 'bg-[var(--accent)] text-black' : 'text-[var(--muted)]'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="h-[300px]">
                <ReactECharts option={lineChartOption} style={{ height: '100%' }} />
              </div>
            </div>

            <div className="bg-[var(--surface2)] border border-[var(--border)] p-6">
              <h3 className="text-lg font-bold mb-2">Regional Market</h3>
              <p className="text-[length:var(--text-small)] text-[var(--muted)] mb-8">Global distribution share</p>
              <div className="h-[300px]">
                <ReactECharts option={donutChartOption} style={{ height: '100%' }} />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-[var(--surface2)] border border-[var(--border)] p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Recent Transactions</h3>
                <p className="text-[length:var(--text-small)] text-[var(--muted)]">Latest verified ledger activities</p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
                <input 
                  type="text" 
                  placeholder="Search ledger..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-black border border-[var(--border)] pl-12 pr-4 py-3 text-[length:var(--text-small)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] uppercase text-[length:var(--text-small)] mono tracking-widest">
                    <th className="pb-4 font-bold">Transaction ID</th>
                    <th className="pb-4 font-bold">Customer</th>
                    <th className="pb-4 font-bold">Region</th>
                    <th className="pb-4 font-bold text-right">Amount</th>
                    <th className="pb-4 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[length:var(--text-small)]">
                  <AnimatePresence mode="popLayout">
                    {filteredTransactions.map((tx, idx) => (
                      <motion.tr 
                        key={tx.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-[var(--border)]/50 hover:bg-[var(--accent)]/[0.02] transition-colors"
                      >
                        <td className="py-5 font-bold mono text-[var(--accent)]">{tx.id}</td>
                        <td className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[length:var(--text-small)] font-bold">
                              {tx.customer.split(' ').map(n => n[0]).join('')}
                            </div>
                            {tx.customer}
                          </div>
                        </td>
                        <td className="py-5 text-[var(--muted)]">{tx.region}</td>
                        <td className="py-5 text-right font-bold">${tx.amount.toLocaleString()}</td>
                        <td className="py-5">
                          <div className="flex justify-center">
                            <span className={`px-2.5 py-1 text-[length:var(--text-small)] font-bold uppercase tracking-widest ${
                              tx.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
                              tx.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' :
                              'bg-red-500/10 text-red-400'
                            } border border-current/20`}>
                              {tx.status}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {filteredTransactions.length === 0 && (
                <div className="py-20 text-center text-[var(--muted)] mono text-[length:var(--text-small)]">
                  No records found matching your query.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
