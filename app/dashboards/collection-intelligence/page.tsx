'use client';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

export default function CollectionIntelligencePage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [mounted, setMounted] = useState(false);
  const [intensities, setIntensities] = useState<number[]>([]);
  const trendCanvasRef = useRef<HTMLCanvasElement>(null);
  const gaugeCanvasRef = useRef<HTMLCanvasElement>(null);
  const donutCanvasRef = useRef<HTMLCanvasElement>(null);
  const agingCanvasRef = useRef<HTMLCanvasElement>(null);
  const channelCanvasRef = useRef<HTMLCanvasElement>(null);
  const scatterCanvasRef = useRef<HTMLCanvasElement>(null);

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
    // --- TREND CHART ---
    const buildTrend = () => {
      const canvas = trendCanvasRef.current;
      if (!canvas) return;
      const c = canvas.getContext('2d');
      if (!c) return;
      
      const W = canvas.offsetWidth;
      const H = 180;
      canvas.width = W;
      canvas.height = H;
      
      const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const collected = [3.85, 4.02, 3.78, 4.31, 4.55, 4.82];
      const target = [4.00, 4.00, 4.10, 4.20, 4.50, 5.09];
      
      const pad = { t: 10, r: 16, b: 30, l: 48 };
      const gW = W - pad.l - pad.r, gH = H - pad.t - pad.b;
      const maxV = 5.5, minV = 3.5;
      const toY = (v: number) => pad.t + gH - (v - minV) / (maxV - minV) * gH;
      const toX = (i: number) => pad.l + (i + 0.5) / months.length * gW;

      // Grid
      [3.5, 4.0, 4.5, 5.0, 5.5].forEach(v => {
        const y = toY(v);
        c.beginPath(); c.moveTo(pad.l, y); c.lineTo(W - pad.r, y);
        c.strokeStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'; c.lineWidth = 1; c.stroke();
        c.fillStyle = C.t3; c.font = '10px Rajdhani'; c.textAlign = 'right';
        c.fillText(v.toFixed(1) + 'Cr', pad.l - 4, y + 4);
      });

      // Bars
      const bw = gW / months.length * 0.32;
      months.forEach((m, i) => {
        const tx = toX(i) - bw;
        const ty = toY(target[i]);
        c.fillStyle = rgba(C.blue, 0.25);
        c.fillRect(tx, ty, bw, gH - (ty - pad.t));

        const cx2 = toX(i) + 2;
        const cy2 = toY(collected[i]);
        const grad = c.createLinearGradient(0, cy2, 0, H - pad.b);
        grad.addColorStop(0, rgba(C.cyan, 0.9));
        grad.addColorStop(1, rgba(C.blue, 0.3));
        c.fillStyle = grad;
        c.fillRect(cx2, cy2, bw, gH - (cy2 - pad.t));

        c.fillStyle = C.cyan; c.font = 'bold 10px Rajdhani'; c.textAlign = 'center';
        c.fillText(collected[i].toFixed(2), cx2 + bw/2, cy2 - 4);
        
        c.fillStyle = C.t2; c.font = '11px Exo 2'; c.textAlign = 'center';
        c.fillText(m, toX(i), H - 6);
      });
    };

    // --- GAUGE CHART ---
    const buildGauge = () => {
      const canvas = gaugeCanvasRef.current;
      if (!canvas) return;
      const c = canvas.getContext('2d');
      if (!c) return;
      
      const W = 200, H = 140;
      canvas.width = W; canvas.height = H;
      const cx = W/2, cy = H * 0.85;
      const R = Math.min(W, H) * 0.65;
      const pct = 0.947;

      c.beginPath(); c.arc(cx, cy, R, Math.PI, 0);
      c.lineWidth = 16; c.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; c.stroke();

      const segments = [
        {from:0, to:0.6, color:C.red},
        {from:0.6,to:0.8,color:C.yellow},
        {from:0.8,to:1.0,color:C.green}
      ];
      segments.forEach(s => {
        c.beginPath();
        c.arc(cx, cy, R, Math.PI + s.from * Math.PI, Math.PI + s.to * Math.PI);
        c.lineWidth = 16; c.strokeStyle = rgba(s.color, 0.25); c.stroke();
      });

      const grad = c.createLinearGradient(-R, 0, R, 0);
      grad.addColorStop(0, C.green); grad.addColorStop(1, C.cyan);
      c.beginPath(); c.arc(cx, cy, R, Math.PI, Math.PI + pct * Math.PI);
      c.lineWidth = 16; c.strokeStyle = grad; c.lineCap = 'round'; c.stroke();

      const angle = Math.PI + pct * Math.PI;
      c.beginPath();
      c.moveTo(cx, cy);
      c.lineTo(cx + (R*0.72) * Math.cos(angle), cy + (R*0.72) * Math.sin(angle));
      c.strokeStyle = isDark ? '#fff' : '#000'; c.lineWidth = 2; c.lineCap = 'round'; c.stroke();
      c.beginPath(); c.arc(cx, cy, 6, 0, Math.PI*2);
      c.fillStyle = isDark ? '#fff' : '#000'; c.fill();
    };

    // --- DONUT CHART ---
    const buildDonut = () => {
      const canvas = donutCanvasRef.current;
      if (!canvas) return;
      const c = canvas.getContext('2d');
      if (!c) return;
      
      const W = 160, H = 160;
      canvas.width = W; canvas.height = H;
      const cx = W/2, cy = H/2, R = Math.min(W,H)*0.42, ir = R*0.6;
      const data = [34,27,21,12,6];
      const colors = [C.cyan, C.purple, C.green, C.orange, C.yellow];
      let start = -Math.PI/2;

      data.forEach((v, i) => {
        const sweep = (v/100) * 2 * Math.PI;
        c.beginPath(); c.moveTo(cx, cy);
        c.arc(cx, cy, R, start, start + sweep);
        c.closePath(); c.fillStyle = colors[i]; c.fill();
        start += sweep + 0.04;
      });

      c.beginPath(); c.arc(cx, cy, ir, 0, Math.PI*2);
      c.fillStyle = isDark ? '#000' : '#fff'; c.fill();
      c.fillStyle = isDark ? '#fff' : '#000'; c.font = 'bold 18px Rajdhani'; c.textAlign = 'center';
      c.fillText('₹482Cr', cx, cy+1);
    };

    // --- AGING CHART ---
    const buildAging = () => {
      const canvas = agingCanvasRef.current;
      if (!canvas) return;
      const c = canvas.getContext('2d');
      if (!c) return;
      
      const W = canvas.offsetWidth; const H = 180;
      canvas.width = W; canvas.height = H;
      const buckets = ['1-30 DPD','31-60 DPD','61-90 DPD','91-180 DPD','180+ DPD'];
      const counts  = [620, 340, 148, 98, 42];
      const colors  = [C.yellow, C.orange, '#ff5500', C.red, '#cc0033'];
      const maxC = Math.max(...counts);
      const pad = {t:10, r:16, b:34, l:16};
      const gW = W - pad.l - pad.r, gH = H - pad.t - pad.b;
      const bw = gW / buckets.length * 0.55;

      buckets.forEach((lbl, i) => {
        const x = pad.l + (i + 0.5) / buckets.length * gW;
        const barH = (counts[i]/maxC)*gH;
        const y = pad.t + gH - barH;
        const grad = c.createLinearGradient(0, y, 0, pad.t + gH);
        grad.addColorStop(0, colors[i]);
        grad.addColorStop(1, rgba(colors[i], 0.15));
        c.fillStyle = grad;
        c.fillRect(x - bw/2, y, bw, barH);
        c.fillStyle = colors[i]; c.font = 'bold 11px Rajdhani'; c.textAlign = 'center';
        c.fillText(counts[i].toString(), x, y - 4);
        c.fillStyle = C.t2; c.font = '9px Exo 2';
        c.fillText(lbl, x, H - 6);
      });
    };

    // --- CHANNEL CHART ---
    const buildChannel = () => {
      const canvas = channelCanvasRef.current;
      if (!canvas) return;
      const c = canvas.getContext('2d');
      if (!c) return;
      
      const W = canvas.offsetWidth; const H = 110;
      canvas.width = W; canvas.height = H;
      const channels = ['Auto-Debit','Online','Agent','UPI','Branch'];
      const vals = [42, 28, 16, 9, 5];
      const colors = [C.cyan, C.green, C.purple, C.orange, C.yellow];
      const bH = 14, gap = 6;
      const maxV = 50;

      channels.forEach((ch, i) => {
        const y = i * (bH + gap) + 4;
        const barW = (vals[i]/maxV) * (W * 0.55);
        c.fillStyle = rgba(colors[i], 0.12); c.fillRect(W*0.3, y, W*0.55, bH);
        c.fillStyle = colors[i]; c.fillRect(W*0.3, y, barW, bH);
        c.fillStyle = C.t2; c.font = '10px Exo 2'; c.textAlign = 'right';
        c.fillText(ch, W*0.28, y + bH - 3);
        c.fillStyle = colors[i]; c.font = 'bold 10px Rajdhani'; c.textAlign = 'left';
        c.fillText(vals[i]+'%', W*0.3 + barW + 5, y + bH - 3);
      });
    };

    // --- SCATTER CHART ---
    const buildScatter = () => {
      const canvas = scatterCanvasRef.current;
      if (!canvas) return;
      const c = canvas.getContext('2d');
      if (!c) return;
      
      const W = canvas.offsetWidth; const H = 220;
      canvas.width = W; canvas.height = H;
      const pad = {t:10, r:16, b:30, l:40};
      const gW = W - pad.l - pad.r, gH = H - pad.t - pad.b;

      c.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(pad.l, pad.t); c.lineTo(pad.l, H-pad.b); c.stroke();
      c.beginPath(); c.moveTo(pad.l, H-pad.b); c.lineTo(W-pad.r, H-pad.b); c.stroke();

      for (let i = 0; i < 80; i++) {
        const risk = Math.random() * 100;
        const amount = 2 + Math.random() * 48;
        const color = risk < 40 ? C.green : risk < 70 ? C.yellow : C.red;
        const x = pad.l + (risk/100) * gW;
        const y = pad.t + (1 - amount/50) * gH;
        c.beginPath(); c.arc(x, y, 4, 0, Math.PI*2);
        c.fillStyle = color; c.globalAlpha = 0.6; c.fill();
        c.globalAlpha = 1;
      }
    };

    buildTrend();
    buildGauge();
    buildDonut();
    buildAging();
    buildChannel();
    buildScatter();

    const handleResize = () => {
      buildTrend();
      buildAging();
      buildChannel();
      buildScatter();
    };

    window.addEventListener('resize', handleResize);

    // Hydration fix: generate random values only on client
    setMounted(true);
    setIntensities(Array.from({ length: 35 }, () => Math.random()));

    return () => window.removeEventListener('resize', handleResize);
  }, [resolvedTheme]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-['Exo_2']">
      <Navbar />
      
      <div className="boxed-wrapper !max-w-[1440px] !mt-24 !mx-auto !min-h-screen border-none shadow-none bg-transparent">
        <main className="p-4 md:p-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00d4ff] to-[#0066ff] rounded-xl flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(0,212,255,0.4)]">💳</div>
              <div>
                <div className="font-['Rajdhani'] text-3xl font-bold tracking-[2px] text-[var(--text)]">EMI<span className="text-[#00d4ff]">PULSE</span></div>
                <div className="text-[length:var(--text-small)] text-[var(--muted)] tracking-[2px] -mt-1 uppercase font-medium">Collection Intelligence Infrastructure</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex gap-2 bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-1.5 shadow-inner">
                {['1W', '1M', '3M', '6M', '1Y'].map(t => (
                  <button 
                    key={t} 
                    className={`px-4 py-1.5 text-[length:var(--text-small)] rounded-lg transition-all whitespace-nowrap min-w-[45px] flex items-center justify-center ${
                      t === '3M' ? 'bg-[#00d4ff] text-black font-bold shadow-[0_0_15px_rgba(0,212,255,0.3)]' : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full text-[#00ff88] font-medium">
                <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse shadow-[0_0_6px_#00ff88]"></div>
                LIVE
              </div>
            </div>
          </header>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total EMI Collected', value: '₹4.82', unit: 'Cr', delta: '+12.4%', color: '#00d4ff', icon: '💰' },
            { label: 'Collection Rate', value: '94.7', unit: '%', delta: '+2.1%', color: '#00ff88', icon: '✅' },
            { label: 'Overdue Accounts', value: '1,248', unit: '', delta: '-5.3%', color: '#ff3366', icon: '⚠' },
            { label: 'Pending Amount', value: '₹28.4', unit: 'L', delta: '-8.7%', color: '#ff6b35', icon: '⏳' },
            { label: 'Active Loans', value: '22,571', unit: '', delta: '+3.8%', color: '#9b59ff', icon: '📋' }
          ].map((kpi, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-[#00d4ff]/30 transition-all min-h-[140px] flex flex-col justify-between shadow-sm"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] opacity-70" style={{ background: kpi.color }}></div>
              <div>
                <div className="text-[length:var(--text-small)] tracking-[1.5px] uppercase text-[var(--muted)] mb-2 font-semibold">{kpi.label}</div>
                <div className="font-['Rajdhani'] text-2xl font-bold leading-none mb-2" style={{ color: kpi.color }}>{kpi.value}<span className="text-sm ml-0.5">{kpi.unit}</span></div>
              </div>
              <div className="flex items-center gap-2 text-[length:var(--text-small)]">
                <span className={`font-bold ${kpi.delta.startsWith('+') ? 'text-[#00ff88]' : 'text-[#ff3366]'}`}>
                  {kpi.delta.startsWith('+') ? '▲' : '▼'} {kpi.delta}
                </span>
                <span className="text-white/20">vs last month</span>
              </div>
              <div className="absolute top-5 right-5 text-2xl opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">{kpi.icon}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="font-['Rajdhani'] text-sm font-semibold tracking-[1.5px] uppercase"><span className="text-[#00d4ff] mr-2">◈</span>EMI Collection Trend</div>
              <div className="flex gap-1">
                {['Bar', 'Line', 'Area'].map(t => (
                  <button key={t} className={`px-2.5 py-1 text-[length:var(--text-small)] border border-white/5 rounded-md ${t === 'Bar' ? 'bg-[#00d4ff]/10 border-[#00d4ff] text-[#00d4ff]' : 'text-white/30 hover:text-white'}`}>{t}</button>
                ))}
              </div>
            </div>
            <canvas ref={trendCanvasRef} className="w-full h-[180px]"></canvas>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-2xl flex flex-col items-center shadow-sm">
            <div className="w-full flex items-center justify-between mb-5">
              <div className="font-['Rajdhani'] text-sm font-semibold tracking-[1.5px] uppercase"><span className="text-[#00d4ff] mr-2">◈</span>Monthly Target</div>
              <div className="text-[length:var(--text-small)] px-2 py-0.5 bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-full text-[#00d4ff] font-bold">MAY 2026</div>
            </div>
            <div className="flex flex-col items-center mt-2">
              <canvas ref={gaugeCanvasRef} className="w-[200px] h-[140px]"></canvas>
              <div className="font-['Rajdhani'] text-3xl font-bold -mt-3 text-[#00ff88]">94.7%</div>
              <div className="text-[length:var(--text-small)] text-white/30 tracking-[1px] uppercase mt-1">Efficiency</div>
            </div>
            <div className="grid grid-cols-3 w-full gap-2 mt-6">
              {[
                { label: 'Collected', val: '₹4.82Cr', color: '#00d4ff' },
                { label: 'Target', val: '₹5.09Cr', color: 'white/30' },
                { label: 'Gap', val: '₹27L', color: '#ff6b35' }
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="font-['Rajdhani'] text-base font-bold" style={{ color: s.color.startsWith('white') ? 'rgba(255,255,255,0.3)' : s.color }}>{s.val}</div>
                  <div className="text-[length:var(--text-small)] uppercase tracking-[1px] text-white/30">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-2xl flex flex-col shadow-sm">
            <div className="w-full flex items-center mb-5">
              <div className="font-['Rajdhani'] text-sm font-semibold tracking-[1.5px] uppercase"><span className="text-[#00d4ff] mr-2">◈</span>Portfolio Mix</div>
            </div>
            <div className="flex flex-col items-center flex-1 justify-center">
              <canvas ref={donutCanvasRef} className="w-[160px] h-[160px]"></canvas>
              <div className="w-full mt-5 space-y-2">
                {[
                  { name: 'Home Loan', pct: '34%', color: '#00d4ff' },
                  { name: 'Personal Loan', pct: '27%', color: '#9b59ff' },
                  { name: 'Auto Loan', pct: '21%', color: '#00ff88' },
                  { name: 'Business Loan', pct: '12%', color: '#ff6b35' },
                  { name: 'Education', pct: '6%', color: '#ffd700' }
                ].map((l, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-white/50">
                      <div className="w-2 h-2 rounded-sm" style={{ background: l.color }}></div>
                      {l.name}
                    </div>
                    <div className="font-['Rajdhani'] font-semibold" style={{ color: l.color }}>{l.pct}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.2fr] gap-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="font-['Rajdhani'] text-sm font-semibold tracking-[1.5px] uppercase"><span className="text-[#00d4ff] mr-2">◈</span>Overdue Aging</div>
              <div className="text-[length:var(--text-small)] px-2 py-0.5 bg-[#ff3366]/10 border border-[#ff3366]/20 rounded-full text-[#ff3366] font-bold">NPA RISK</div>
            </div>
            <canvas ref={agingCanvasRef} className="w-full h-[180px]"></canvas>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-2xl shadow-sm">
            <div className="flex items-center mb-5">
              <div className="font-['Rajdhani'] text-sm font-semibold tracking-[1.5px] uppercase"><span className="text-[#00d4ff] mr-2">◈</span>Branch Performance</div>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Mumbai HQ', val: 97.2, color: '#00ff88' },
                { name: 'Delhi NCR', val: 95.8, color: '#00d4ff' },
                { name: 'Bangalore', val: 93.4, color: '#00d4ff' },
                { name: 'Hyderabad', val: 89.1, color: '#ffd700' },
                { name: 'Chennai', val: 87.6, color: '#ffd700' },
                { name: 'Kolkata', val: 81.3, color: '#ff6b35' }
              ].map((b, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-white/50">{b.name}</span>
                    <span className="font-['Rajdhani'] font-semibold" style={{ color: b.color }}>{b.val}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${b.val}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className="h-full rounded-full" 
                      style={{ background: `linear-gradient(90deg, ${b.color}, #00d4ff)` }}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="font-['Rajdhani'] text-sm font-semibold tracking-[1.5px] uppercase"><span className="text-[#00d4ff] mr-2">◈</span>Daily Heatmap</div>
              <div className="text-[length:var(--text-small)] text-white/30">May 2026</div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => (
                <div key={`${d}-${idx}`} className="text-center text-[length:var(--text-small)] text-white/20 mb-1">{d}</div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => {
                const intensity = mounted ? (intensities[i] || 0) : 0;
                const d = i - 2;
                return (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-[2px] cursor-pointer hover:scale-125 transition-transform ${d < 0 || d >= 31 ? 'bg-transparent' : 'bg-[#00d4ff]'}`}
                    style={{ opacity: d < 0 || d >= 31 ? 0 : 0.1 + intensity * 0.9 }}
                  ></div>
                );
              })}
            </div>
            <div className="pt-4 border-t border-white/5">
              <div className="text-[length:var(--text-small)] tracking-[1px] uppercase text-white/30 mb-3">Collection Channel</div>
              <canvas ref={channelCanvasRef} className="w-full h-[110px]"></canvas>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 mb-10">
          <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-2xl overflow-x-auto shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="font-['Rajdhani'] text-sm font-semibold tracking-[1.5px] uppercase"><span className="text-[#00d4ff] mr-2">◈</span>Recent Transactions</div>
              <button className="text-[length:var(--text-small)] px-3 py-1 bg-[#00d4ff]/5 border border-[#00d4ff]/20 rounded-md text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-all">View All</button>
            </div>
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-3 text-[length:var(--text-small)] uppercase tracking-[1.5px] text-white/30 font-medium">Loan ID</th>
                  <th className="p-3 text-[length:var(--text-small)] uppercase tracking-[1.5px] text-white/30 font-medium">Customer</th>
                  <th className="p-3 text-[length:var(--text-small)] uppercase tracking-[1.5px] text-white/30 font-medium">Type</th>
                  <th className="p-3 text-[length:var(--text-small)] uppercase tracking-[1.5px] text-white/30 font-medium">EMI Amount</th>
                  <th className="p-3 text-[length:var(--text-small)] uppercase tracking-[1.5px] text-white/30 font-medium">Status</th>
                  <th className="p-3 text-[length:var(--text-small)] uppercase tracking-[1.5px] text-white/30 font-medium">DPD</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {[
                  { id: 'HL-00482', name: 'Rahul Sharma', type: 'Home Loan', amt: '₹42,500', status: 'paid', dpd: 0 },
                  { id: 'PL-01237', name: 'Priya Mehta', type: 'Personal', amt: '₹18,200', status: 'paid', dpd: 0 },
                  { id: 'AL-00891', name: 'Suresh Kumar', type: 'Auto Loan', amt: '₹22,800', status: 'overdue', dpd: 6 },
                  { id: 'BL-00334', name: 'Anita Patel', type: 'Business', amt: '₹68,000', status: 'overdue', dpd: 9 },
                  { id: 'HL-00921', name: 'Vikram Singh', type: 'Home Loan', amt: '₹55,000', status: 'pending', dpd: 0 }
                ].map((tx, i) => (
                  <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 font-['Rajdhani'] font-bold text-[#00d4ff]">{tx.id}</td>
                    <td className="p-3">{tx.name}</td>
                    <td className="p-3 text-white/30">{tx.type}</td>
                    <td className="p-3 font-['Rajdhani'] font-bold">{tx.amt}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-sm text-[length:var(--text-small)] font-bold uppercase tracking-wider ${
                        tx.status === 'paid' ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20' : 
                        tx.status === 'pending' ? 'bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/20' : 
                        'bg-[#ff3366]/10 text-[#ff3366] border border-[#ff3366]/20'
                      }`}>{tx.status}</span>
                    </td>
                    <td className="p-3 font-['Rajdhani']" style={{ color: tx.dpd > 0 ? '#ff3366' : 'rgba(255,255,255,0.2)' }}>{tx.dpd > 0 ? `+${tx.dpd}d` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="font-['Rajdhani'] text-sm font-semibold tracking-[1.5px] uppercase"><span className="text-[#00d4ff] mr-2">◈</span>Risk vs Amount</div>
              <div className="text-[length:var(--text-small)] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-white/50 font-bold uppercase">Scatter</div>
            </div>
            <canvas ref={scatterCanvasRef} className="w-full h-[220px]"></canvas>
            <div className="flex flex-wrap gap-4 mt-4 text-[length:var(--text-small)] text-white/30 uppercase tracking-wider">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00ff88]"></div> Low Risk</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#ffd700]"></div> Medium</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#ff3366]"></div> High Risk</div>
            </div>
          </div>
        </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
