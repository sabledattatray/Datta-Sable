'use client';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

export default function GlobalSalesIntelligencePage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState('M');
  const [mapPoints, setMapPoints] = useState<{x: number, y: number, size: number, pulse: number}[]>([]);
  
  const revenueCanvasRef = useRef<HTMLCanvasElement>(null);
  const regionCanvasRef = useRef<HTMLCanvasElement>(null);
  const mapCanvasRef = useRef<HTMLCanvasElement>(null);
  const conversionCanvasRef = useRef<HTMLCanvasElement>(null);
  const categoryCanvasRef = useRef<HTMLCanvasElement>(null);
  const bubbleCanvasRef = useRef<HTMLCanvasElement>(null);

  const dataSets: Record<string, any> = {
    D: {
      kpis: [
        { label: 'Daily Revenue', val: '$0.8', unit: 'M', delta: '+2.4%', color: '#00d4ff', icon: '📈' },
        { label: 'Avg Order Value', val: '$1,250', unit: '', delta: '+0.5%', color: '#9b59ff', icon: '🛒' },
        { label: 'Conversion Rate', val: '8.2', unit: '%', delta: '+0.1%', color: '#00ff88', icon: '🎯' },
        { label: 'Active Markets', val: '64', unit: '', delta: '0', color: '#ffd700', icon: '🏁' },
        { label: 'Retention Rate', val: '87.2', unit: '%', delta: '+0.2%', color: '#ff6b35', icon: '🔄' }
      ],
      revenue: [0.6, 0.7, 0.9, 0.8, 1.1, 0.8],
      regions: [35, 30, 20, 15]
    },
    W: {
      kpis: [
        { label: 'Weekly Revenue', val: '$5.4', unit: 'M', delta: '+8.1%', color: '#00d4ff', icon: '📈' },
        { label: 'Avg Order Value', val: '$1,340', unit: '', delta: '+2.2%', color: '#9b59ff', icon: '🛒' },
        { label: 'Conversion Rate', val: '10.5', unit: '%', delta: '+0.8%', color: '#00ff88', icon: '🎯' },
        { label: 'Active Markets', val: '64', unit: '', delta: '+1', color: '#ffd700', icon: '🏁' },
        { label: 'Retention Rate', val: '88.1', unit: '%', delta: '+0.5%', color: '#ff6b35', icon: '🔄' }
      ],
      revenue: [4.2, 4.8, 4.5, 5.1, 5.8, 5.4],
      regions: [38, 28, 19, 15]
    },
    M: {
      kpis: [
        { label: 'Monthly Revenue', val: '$24.8', unit: 'M', delta: '+18.2%', color: '#00d4ff', icon: '📈' },
        { label: 'Avg Order Value', val: '$1,420', unit: '', delta: '+4.5%', color: '#9b59ff', icon: '🛒' },
        { label: 'Conversion Rate', val: '12.4', unit: '%', delta: '+1.2%', color: '#00ff88', icon: '🎯' },
        { label: 'Active Markets', val: '64', unit: '', delta: '+3', color: '#ffd700', icon: '🏁' },
        { label: 'Retention Rate', val: '88.5', unit: '%', delta: '+0.8%', color: '#ff6b35', icon: '🔄' }
      ],
      revenue: [18.2, 21.5, 19.4, 22.8, 26.1, 24.8],
      regions: [40, 25, 20, 15]
    },
    Q: {
      kpis: [
        { label: 'Quarterly Revenue', val: '$72.4', unit: 'M', delta: '+14.8%', color: '#00d4ff', icon: '📈' },
        { label: 'Avg Order Value', val: '$1,580', unit: '', delta: '+6.1%', color: '#9b59ff', icon: '🛒' },
        { label: 'Conversion Rate', val: '13.8', unit: '%', delta: '+2.4%', color: '#00ff88', icon: '🎯' },
        { label: 'Active Markets', val: '67', unit: '', delta: '+5', color: '#ffd700', icon: '🏁' },
        { label: 'Retention Rate', val: '89.4', unit: '%', delta: '+1.2%', color: '#ff6b35', icon: '🔄' }
      ],
      revenue: [62.5, 68.2, 70.4, 75.1, 82.4, 72.4],
      regions: [42, 22, 22, 14]
    },
    Y: {
      kpis: [
        { label: 'Annual Revenue', val: '$284.5', unit: 'M', delta: '+22.4%', color: '#00d4ff', icon: '📈' },
        { label: 'Avg Order Value', val: '$1,840', unit: '', delta: '+12.5%', color: '#9b59ff', icon: '🛒' },
        { label: 'Conversion Rate', val: '15.2', unit: '%', delta: '+4.8%', color: '#00ff88', icon: '🎯' },
        { label: 'Active Markets', val: '72', unit: '', delta: '+12', color: '#ffd700', icon: '🏁' },
        { label: 'Retention Rate', val: '91.2', unit: '%', delta: '+3.4%', color: '#ff6b35', icon: '🔄' }
      ],
      revenue: [210, 235, 248, 262, 294, 284.5],
      regions: [45, 20, 25, 10]
    }
  };

  const C = {
    cyan: '#00d4ff',
    blue: '#0066ff',
    green: '#00ff88',
    orange: '#ff6b35',
    red: '#ff3366',
    yellow: '#ffd700',
    purple: '#9b59ff',
    bg: 'var(--bg)',
    card: 'var(--surface)',
    t1: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)',
    t2: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
    t3: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
  };

  function rgba(hex: string, a: number) {
    const r = parseInt(hex.slice(1, 3), 16),
          g = parseInt(hex.slice(3, 5), 16),
          b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  useEffect(() => {
    // --- GLOBAL MAP (Stylized) ---
    const buildMap = () => {
      const canvas = mapCanvasRef.current;
      if (!canvas) return;
      const c = canvas.getContext('2d');
      if (!c) return;
      
      const W = canvas.offsetWidth;
      const H = 280;
      canvas.width = W;
      canvas.height = H;

      // Draw stylized grid dots for "World"
      c.fillStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
      for(let x=0; x<W; x+=15) {
        for(let y=0; y<H; y+=15) {
          c.beginPath(); c.arc(x, y, 1, 0, Math.PI*2); c.fill();
        }
      }

      // Draw active nodes
      mapPoints.forEach(p => {
        const x = (p.x / 100) * W;
        const y = (p.y / 100) * H;
        
        // Outer glow
        const grad = c.createRadialGradient(x, y, 0, x, y, p.size * 4);
        grad.addColorStop(0, rgba(C.cyan, 0.3 * p.pulse));
        grad.addColorStop(1, 'transparent');
        c.fillStyle = grad;
        c.beginPath(); c.arc(x, y, p.size * 4, 0, Math.PI*2); c.fill();

        // Core
        c.fillStyle = C.cyan;
        c.beginPath(); c.arc(x, y, p.size, 0, Math.PI*2); c.fill();
        
        // Pulse ring
        c.strokeStyle = rgba(C.cyan, 0.5 * (1 - p.pulse));
        c.lineWidth = 1;
        c.beginPath(); c.arc(x, y, p.size * (1 + p.pulse * 3), 0, Math.PI*2); c.stroke();
      });
    };

    // --- REVENUE TREND ---
    const buildRevenue = () => {
      const canvas = revenueCanvasRef.current;
      if (!canvas) return;
      const c = canvas.getContext('2d');
      if (!c) return;

      const W = canvas.offsetWidth; const H = 200;
      canvas.width = W; canvas.height = H;
      const pad = {t:20, r:20, b:40, l:50};
      const gW = W - pad.l - pad.r, gH = H - pad.t - pad.b;
      
      const months = ['JAN','FEB','MAR','APR','MAY','JUN'];
      const rev = dataSets[timeRange].revenue;
      const maxV = Math.max(...rev) * 1.2;

      // Axes
      c.strokeStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
      for(let i=0; i<=5; i++) {
        const y = pad.t + (i/5) * gH;
        c.beginPath(); c.moveTo(pad.l, y); c.lineTo(W-pad.r, y); c.stroke();
        c.fillStyle = C.t3; c.font = '10px Rajdhani'; c.textAlign='right';
        c.fillText(`$${(maxV - (i/5)*maxV).toFixed(1)}M`, pad.l - 8, y + 4);
      }

      // Line
      c.beginPath();
      rev.forEach((v: number, i: number) => {
        const x = pad.l + (i/(months.length-1)) * gW;
        const y = pad.t + gH - (v/maxV)*gH;
        if(i===0) c.moveTo(x, y); else c.lineTo(x, y);
      });
      c.strokeStyle = C.cyan; c.lineWidth = 3; c.stroke();

      // Area
      c.lineTo(pad.l + gW, pad.t + gH);
      c.lineTo(pad.l, pad.t + gH);
      const grad = c.createLinearGradient(0, pad.t, 0, pad.t + gH);
      grad.addColorStop(0, rgba(C.cyan, 0.2));
      grad.addColorStop(1, 'transparent');
      c.fillStyle = grad; c.fill();

      // Points
      rev.forEach((v: number, i: number) => {
        const x = pad.l + (i/(months.length-1)) * gW;
        const y = pad.t + gH - (v/maxV)*gH;
        c.fillStyle = isDark ? '#fff' : '#000'; c.beginPath(); c.arc(x, y, 4, 0, Math.PI*2); c.fill();
        c.strokeStyle = C.cyan; c.lineWidth = 2; c.stroke();
        
        c.fillStyle = C.t2; c.font = '10px Exo 2'; c.textAlign = 'center';
        c.fillText(months[i], x, H - 10);
      });
    };

    // --- REGIONAL SPLIT ---
    const buildRegion = () => {
      const canvas = regionCanvasRef.current;
      if (!canvas) return;
      const c = canvas.getContext('2d');
      if (!c) return;

      const W = 180, H = 180;
      canvas.width = W; canvas.height = H;
      const cx = W/2, cy = H/2, R = 70, ir = 45;
      const data = dataSets[timeRange].regions;
      const colors = [C.cyan, C.blue, C.purple, C.green];
      let start = -Math.PI/2;

      data.forEach((v: number, i: number) => {
        const sweep = (v/100) * Math.PI * 2;
        c.beginPath(); c.moveTo(cx, cy);
        c.arc(cx, cy, R, start, start + sweep);
        c.fillStyle = colors[i]; c.fill();
        start += sweep + 0.05;
      });

      c.beginPath(); c.arc(cx, cy, ir, 0, Math.PI*2);
      c.fillStyle = isDark ? '#000' : '#fff'; c.fill();
      c.fillStyle = isDark ? '#fff' : '#000'; c.font = 'bold 16px Rajdhani'; c.textAlign = 'center';
      c.fillText('SALES', cx, cy - 2);
      c.font = '10px Rajdhani'; c.fillText('GEOGRAPHY', cx, cy + 12);
    };

    // --- CONVERSION FUNNEL ---
    const buildConversion = () => {
      const canvas = conversionCanvasRef.current;
      if (!canvas) return;
      const c = canvas.getContext('2d');
      if (!c) return;

      const W = canvas.offsetWidth; const H = 180;
      canvas.width = W; canvas.height = H;
      const steps = ['LEADS', 'MQL', 'SQL', 'DEAL', 'CLOSE'];
      const vals = [100, 72, 45, 28, 12];
      const pad = 20;
      const stepH = (H - pad*2) / steps.length;

      steps.forEach((s, i) => {
        const y = pad + i * stepH;
        const w1 = (vals[i]/100) * (W * 0.7);
        const w2 = (vals[i+1] ? vals[i+1]/100 : vals[i]/100) * (W * 0.7);
        
        c.beginPath();
        c.moveTo(W/2 - w1/2, y);
        c.lineTo(W/2 + w1/2, y);
        c.lineTo(W/2 + w2/2, y + stepH - 4);
        c.lineTo(W/2 - w2/2, y + stepH - 4);
        c.closePath();
        
        const grad = c.createLinearGradient(0, y, 0, y + stepH);
        grad.addColorStop(0, rgba(C.cyan, 0.4 - i*0.05));
        grad.addColorStop(1, rgba(C.blue, 0.2 - i*0.05));
        c.fillStyle = grad; c.fill();
        c.strokeStyle = rgba(C.cyan, 0.3); c.stroke();

        c.fillStyle = C.t1; c.font = 'bold 10px Rajdhani'; c.textAlign = 'center';
        c.fillText(s + ': ' + vals[i] + '%', W/2, y + stepH/2 + 4);
      });
    };

    if(mounted) {
      buildMap();
      buildRevenue();
      buildRegion();
      buildConversion();
      
      let frame = 0;
      const animate = () => {
        frame++;
        setMapPoints(prev => prev.map(p => ({
          ...p,
          pulse: (Math.sin(frame * 0.05 + p.x) + 1) / 2
        })));
        buildMap();
        requestAnimationFrame(animate);
      };
      const animId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animId);
    }
  }, [mounted, mapPoints.length, timeRange, resolvedTheme]);

  useEffect(() => {
    setMounted(true);
    setMapPoints([
      {x: 25, y: 35, size: 4, pulse: 0}, // NY
      {x: 48, y: 32, size: 5, pulse: 0.5}, // London
      {x: 75, y: 45, size: 3, pulse: 0.2}, // Tokyo
      {x: 65, y: 65, size: 4, pulse: 0.8}, // Singapore
      {x: 18, y: 55, size: 3, pulse: 0.1}, // SF
      {x: 52, y: 75, size: 2, pulse: 0.6}, // Dubai
      {x: 82, y: 78, size: 4, pulse: 0.4}, // Sydney
    ]);
    
    const handleResize = () => setMounted(prev => !prev ? prev : true);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-['Exo_2']">
      <Navbar />
      
      <div className="boxed-wrapper !max-w-[1440px] !mt-24 !mx-auto !min-h-screen border-none shadow-none bg-transparent">
        <main className="p-4 md:p-8 flex flex-col gap-8">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#9b59ff] to-[#00d4ff] rounded-xl flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(155,89,255,0.4)]">🌍</div>
              <div>
                <div className="font-['Rajdhani'] text-3xl font-bold tracking-[2px] text-[var(--text)] uppercase">GLOBAL<span className="text-[#00d4ff]">SALES</span></div>
                <div className="text-[length:var(--text-small)] text-[var(--muted)] tracking-[2px] -mt-1 uppercase font-medium">Real-time Revenue Intelligence Engine</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-4">
                <div className="text-[length:var(--text-small)] text-[var(--muted)] uppercase tracking-widest">Global Status</div>
                <div className="text-[#00ff88] text-xs font-bold font-['Rajdhani']">OPERATIONAL_OPTIMAL</div>
              </div>
              <div className="flex gap-2 bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-1.5 shadow-inner">
                {['D','W','M','Q','Y'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setTimeRange(t)}
                    className={`w-8 h-8 flex items-center justify-center text-[length:var(--text-small)] rounded-lg transition-all ${timeRange === t ? 'bg-[#00d4ff] text-black font-bold shadow-[0_0_10px_rgba(0,212,255,0.4)]' : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
            {dataSets[timeRange].kpis.map((k: any, i: number) => (
              <motion.div
                key={`${timeRange}-${i}`}
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay: i*0.1 }}
                className="bg-[var(--surface)] border border-[var(--border)] p-6 md:p-7 rounded-2xl min-h-[150px] flex flex-col justify-between relative group hover:border-[#00d4ff]/30 transition-all cursor-pointer overflow-hidden shadow-sm"
              >
                <div className="absolute top-0 left-0 w-full h-[3px] opacity-80" style={{ background: k.color }}></div>
                <div className="relative z-10">
                  <div className="text-[length:var(--text-small)] uppercase tracking-[2px] text-[var(--muted)] mb-3 font-bold opacity-70 group-hover:opacity-100 transition-opacity">{k.label}</div>
                  <div className="font-['Rajdhani'] text-3xl font-bold tracking-[1px]" style={{ color: k.color }}>{k.val}<span className="text-sm ml-1 opacity-70">{k.unit}</span></div>
                </div>
                <div className="flex items-center gap-2 text-[length:var(--text-small)] relative z-10">
                  <span className={`font-bold ${k.delta.startsWith('+') ? 'text-[#00ff88]' : 'text-[#ff3366]'}`}>
                    {k.delta.startsWith('+') ? '▲' : '▼'} {k.delta}
                  </span>
                  <span className="text-[var(--muted)] font-medium">vs period</span>
                </div>
                <div className="absolute top-7 right-7 text-3xl opacity-[0.03] group-hover:opacity-20 group-hover:scale-110 transition-all duration-700 ease-out">{k.icon}</div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </motion.div>
            ))}
          </div>

          {/* Main Visuals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="font-['Rajdhani'] text-sm font-bold tracking-widest uppercase"><span className="text-[#00d4ff] mr-2">◈</span>Global Connectivity Mesh</div>
                <div className="flex items-center gap-4 text-[length:var(--text-small)] text-[var(--muted)] uppercase">
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]"></div> Active Nodes</div>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></div> Optimal</div>
                </div>
              </div>
              <canvas ref={mapCanvasRef} className="w-full h-[280px] cursor-crosshair"></canvas>
              <div className="absolute bottom-6 right-6 p-4 bg-[var(--surface2)]/80 backdrop-blur-md border border-[var(--border)] rounded-xl shadow-lg">
                <div className="text-[length:var(--text-small)] text-[var(--muted)] uppercase tracking-widest mb-1">Peak Region</div>
                <div className="text-[#00d4ff] font-['Rajdhani'] font-bold text-lg">EMEA_CENTRAL</div>
                <div className="text-[length:var(--text-small)] text-[var(--muted)] mt-1">Efficiency: 98.4%</div>
              </div>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex flex-col items-center shadow-sm">
              <div className="w-full font-['Rajdhani'] text-sm font-bold tracking-widest uppercase mb-8"><span className="text-[#00d4ff] mr-2">◈</span>Market Distribution</div>
              <canvas ref={regionCanvasRef} className="w-[180px] h-[180px]"></canvas>
              <div className="w-full mt-8 space-y-3">
                {[
                  { n: 'North America', p: '40%', c: C.cyan },
                  { n: 'EMEA', p: '25%', c: C.blue },
                  { n: 'Asia Pacific', p: '20%', c: C.purple },
                  { n: 'Latin America', p: '15%', c: C.green }
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[var(--muted)]">
                      <div className="w-2 h-2 rounded-sm" style={{ background: r.c }}></div>
                      {r.n}
                    </div>
                    <div className="font-['Rajdhani'] font-bold text-[var(--text)] opacity-80">{r.p}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              <div className="font-['Rajdhani'] text-sm font-bold tracking-widest uppercase mb-6"><span className="text-[#00d4ff] mr-2">◈</span>Revenue Forecast</div>
              <canvas ref={revenueCanvasRef} className="w-full h-[200px]"></canvas>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              <div className="font-['Rajdhani'] text-sm font-bold tracking-widest uppercase mb-6"><span className="text-[#00d4ff] mr-2">◈</span>Sales Conversion</div>
              <canvas ref={conversionCanvasRef} className="w-full h-[180px]"></canvas>
              <div className="mt-4 text-[length:var(--text-small)] text-[var(--muted)] text-center leading-relaxed">Funnel analysis based on last 30 days of global lead ingestion.</div>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="font-['Rajdhani'] text-sm font-bold tracking-widest uppercase"><span className="text-[#00d4ff] mr-2">◈</span>Top Categories</div>
                <div className="text-[length:var(--text-small)] text-[#00d4ff] font-bold">LIVE</div>
              </div>
              <div className="space-y-5">
                {[
                  { name: 'Enterprise SaaS', val: 88, color: C.cyan },
                  { name: 'Cloud Infrastructure', val: 76, color: C.blue },
                  { name: 'Cybersecurity Tools', val: 64, color: C.purple },
                  { name: 'Data Intelligence', val: 52, color: C.green },
                  { name: 'AI Workflows', val: 41, color: C.yellow }
                ].map((cat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[length:var(--text-small)] mb-2">
                      <span className="text-[var(--muted)]">{cat.name}</span>
                      <span className="text-[var(--text)] font-['Rajdhani'] font-bold opacity-80">{cat.val}%</span>
                    </div>
                    <div className="h-1 bg-[var(--surface2)] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.val}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full" 
                        style={{ background: cat.color }}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
