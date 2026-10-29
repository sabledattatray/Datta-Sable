'use client';

import { useId, useState } from 'react';
import { ArrowUpRight, BarChart3, Check, ChevronRight, Globe2 } from 'lucide-react';
import styles from './ExecutiveDashboard.module.css';

const reports = [
  { name: 'Revenue', title: 'Commercial overview', label: 'Gross revenue', value: 48.62, prefix: '$', suffix: 'M', delta: '+14.8%', note: 'vs. previous year', data: [30, 36, 34, 46, 43, 58, 54, 67, 64, 78], metrics: [['Fulfillment SLA', '99.2%', '+0.7% vs. goal'], ['Gross margin', '34.8%', '+2.4% vs. budget'], ['Active accounts', '1,428', '+182 this quarter']], channels: ['Enterprise direct', 'Strategic partners', 'Cloud marketplace'] },
  { name: 'Profitability', title: 'Profitability overview', label: 'Operating income', value: 16.92, prefix: '$', suffix: 'M', delta: '+21.6%', note: 'vs. previous year', data: [22, 30, 28, 39, 35, 48, 46, 60, 63, 75], metrics: [['Cost ratio', '65.2%', '−2.4% vs. budget'], ['Freight cost', '$4.12/u', '−18.4% vs. baseline'], ['Cash cycle', '28.4d', '5.2 days faster']], channels: ['Product margin', 'Service margin', 'Other income'] },
  { name: 'Operations', title: 'Operations overview', label: 'Orders fulfilled', value: 24.8, prefix: '', suffix: 'K', delta: '+12.4%', note: 'vs. previous year', data: [38, 43, 39, 55, 51, 66, 60, 74, 70, 86], metrics: [['On-time delivery', '99.2%', '+0.7% vs. goal'], ['Inventory turns', '8.4×', '+1.2× vs. baseline'], ['Stock availability', '98.6%', '+2.1% vs. baseline']], channels: ['Direct fulfillment', 'Partner network', 'Marketplace'] },
];
const periods = ['YTD', 'QTD', 'MTD'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

export default function ExecutiveDashboard() {
  const [reportIndex, setReportIndex] = useState(0);
  const [period, setPeriod] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [tone, setTone] = useState('signature');
  const id = useId().replace(/:/g, '');
  const report = reports[reportIndex];
  const factor = [1, .31, .11][period];
  const points = report.data.map((value, index) => [38 + index * 58, 192 - value * 1.75]);
  const line = points.map(([x, y], index) => index === 0 ? `M ${x} ${y}` : `C ${x - 29} ${points[index - 1][1]}, ${x - 29} ${y}, ${x} ${y}`).join(' ');
  const focus = selected ?? 9;
  const format = (value: number) => `${report.prefix}${(value * factor).toFixed(2)}${report.suffix}`;
  return <div className={styles.panel} data-tone={tone}>
    <header className={styles.topbar}>
      <div className={styles.brand}><span className={styles.brandMark}><BarChart3 size={20} /></span><div><strong>Clarity <span>/ Intelligence</span></strong><small>A connected view of business.</small></div></div>
      <span className={styles.demo}><i /> Interactive demo</span>
    </header>
    <div className={styles.workspace}>
      <div className={styles.heading}><div><span className={styles.eyebrow}>THE PERFORMANCE STUDIO</span><h2>{report.title}</h2><p>From the big picture to the details that move it.</p></div><div className={styles.periods} role="group" aria-label="Reporting horizon">{periods.map((item, index) => <button key={item} aria-pressed={period === index} onClick={() => { setPeriod(index); setSelected(null); }}>{item}</button>)}</div></div>
      <div className={styles.tabs} role="group" aria-label="Performance view">{reports.map((item, index) => <button key={item.name} aria-pressed={reportIndex === index} onClick={() => { setReportIndex(index); setSelected(null); }}>{item.name}<ChevronRight size={12} /></button>)}</div>
      <div className={styles.composition}>
        <section className={styles.mainChart} aria-label="Performance trend">
          <div className={styles.chartTop}><div><span className={styles.metricLabel}>{report.label}</span><strong className={styles.mainValue}>{format(report.value)}</strong><div className={styles.change}><ArrowUpRight size={14} /><b>{report.delta}</b><span>{report.note}</span></div></div><div className={styles.chartStamp}><span>GLOBAL</span><Globe2 size={24} /><small>{periods[period]} / 2026</small></div></div>
          <div className={styles.chartLegend}><span><i /> Actual performance</span><span><i /> Previous period</span><strong>{months[focus]} <b>{format(report.value * report.data[focus] / report.data[9])}</b></strong></div>
          <svg className={styles.chart} viewBox="0 0 600 225" role="img" aria-label={`${report.label} trend from January to October`}>
            <defs><linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--studio-accent)" stopOpacity=".24" /><stop offset="1" stopColor="var(--studio-accent)" stopOpacity="0" /></linearGradient></defs>
            {[45, 95, 145, 195].map((y, index) => <g key={y}><line x1="30" x2="580" y1={y} y2={y} className={styles.grid} /><text x="22" y={y + 3} textAnchor="end" className={styles.axis}>{[100, 75, 50, 25][index]}%</text></g>)}
            <path d={`${line} L 560 195 L 38 195 Z`} fill={`url(#${id}-area)`} />
            <path d={points.map(([x,y], index) => `${index ? 'L' : 'M'} ${x} ${y + 20 + index % 3 * 4}`).join(' ')} className={styles.comparison} />
            <path d={line} className={styles.trend} />
            <line x1={points[focus][0]} x2={points[focus][0]} y1="28" y2="195" className={styles.crosshair} />
            {points.map(([x,y], index) => <g key={index}><text x={x} y="217" textAnchor="middle" className={styles.axis}>{months[index]}</text><circle cx={x} cy={y} r={focus === index ? 10 : 0} fill="var(--studio-accent)" opacity=".12" /><circle cx={x} cy={y} r={focus === index ? 4 : 0} fill="var(--studio-accent)" /><rect x={x-24} y="15" width="48" height="185" fill="transparent" role="button" tabIndex={0} aria-label={`Inspect ${months[index]}`} aria-pressed={focus === index} onPointerEnter={() => setSelected(index)} onClick={() => setSelected(index)} onFocus={() => setSelected(index)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelected(index); } }} /></g>)}
          </svg>
          <div className={styles.chartFoot}><span><Check size={12} /> Connected sample model</span><span>10 reporting periods</span></div>
        </section>
        <aside className={styles.sideRail} aria-label="Key performance indicators">{report.metrics.map(([label, value, delta], index) => <div className={styles.kpi} key={label}><div className={styles.kpiHeader}><span>{label}</span><span className={styles.ordinal}>0{index + 1}</span></div><div className={styles.kpiBody}><strong>{value}</strong><svg viewBox="0 0 90 32" aria-hidden="true"><path d={index === 0 ? 'M2 27 14 21 26 24 38 14 50 17 62 8 74 11 88 3' : index === 1 ? 'M2 25 14 27 26 17 38 20 50 11 62 14 74 5 88 2' : 'M2 28 14 24 26 25 38 18 50 20 62 9 74 12 88 4'} /></svg></div><small><ArrowUpRight size={12} />{delta}</small></div>)}</aside>
      </div>
      <section className={styles.mix} aria-label="Performance distribution"><div className={styles.mixTitle}><span>THE CONTRIBUTION MIX</span><strong>Three channels. One perspective.</strong></div><div className={styles.mixItems}>{report.channels.map((name,index) => <div className={styles.channel} key={name}><div><span><i data-index={index} />{name}</span><strong>{[48,32,20][index]}<small>%</small></strong></div><div className={styles.track}><i style={{width:`${[48,32,20][index]}%`}} data-index={index} /></div></div>)}</div></section>
    </div>
    <footer className={styles.footer}><span><i /> Illustrative data · Designed for exploration</span><div role="group" aria-label="Dashboard palette">{['signature','ocean','iris'].map(item => <button key={item} aria-label={`${item} palette`} aria-pressed={tone === item} onClick={() => setTone(item)} data-swatch={item}><i /><span>{item}</span></button>)}</div></footer>
  </div>;
}
