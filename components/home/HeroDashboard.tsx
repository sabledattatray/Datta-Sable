'use client';

import { useEffect, useId, useState } from 'react';
import { ArrowUpRight, BarChart3, Database, Layers, Pause, Play } from 'lucide-react';
import styles from './HeroDashboard.module.css';

const views = [
  { name: 'Revenue', label: 'Revenue overview', metric: 'Total revenue', value: '$284,620', change: '+18.6%', unit: '$', suffix: 'k', data: [28, 43, 38, 61, 55, 74, 69, 92], secondary: ['1,842', 'Orders'], third: ['$154.5', 'Avg. order'], insight: 'Direct sales leads the mix', detail: 'Explore each channel below to compare its contribution.' },
  { name: 'Operations', label: 'Operations overview', metric: 'Completed workflows', value: '12,486', change: '+24.2%', unit: '', suffix: '', data: [34, 39, 56, 45, 68, 63, 83, 96], secondary: ['98.4%', 'Success rate'], third: ['1.2s', 'Avg. runtime'], insight: 'A clearer view of execution', detail: 'See how automated, scheduled, and assisted work compares.' },
  { name: 'Pipeline', label: 'Pipeline overview', metric: 'Active pipeline', value: '$426,800', change: '+12.8%', unit: '$', suffix: 'k', data: [42, 35, 52, 49, 68, 61, 77, 88], secondary: ['64', 'Opportunities'], third: ['32.6%', 'Win rate'], insight: 'Turn signals into next steps', detail: 'Compare inbound, partner, and outbound opportunities.' },
];
const channels = [['Direct', 'Partner', 'Online'], ['Automated', 'Scheduled', 'Assisted'], ['Inbound', 'Partner', 'Outbound']];
const periods = ['7D', '30D', '90D'];
const labels = [['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Today'], ['01', '05', '09', '13', '17', '21', '25', '30'], ['W1', 'W2', 'W4', 'W6', 'W8', 'W10', 'W11', 'W12']];

export default function HeroDashboard() {
  const [viewIndex, setViewIndex] = useState(0);
  const [period, setPeriod] = useState(1);
  const [channel, setChannel] = useState<number | null>(null);
  const [point, setPoint] = useState(7);
  const [playing, setPlaying] = useState(true);
  const [engaged, setEngaged] = useState(false);
  const gradient = useId().replace(/:/g, '');
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { if (motion.matches) setPlaying(false); };
    sync(); motion.addEventListener('change', sync);
    return () => motion.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    if (!playing || engaged) return;
    const timer = window.setInterval(() => { setViewIndex(value => (value + 1) % views.length); setChannel(null); setPoint(7); }, 6500);
    return () => window.clearInterval(timer);
  }, [playing, engaged]);
  const view = views[viewIndex];
  const periodFactor = [.28, 1, 2.68][period];
  const factor = channel === null ? 1 : [.52, .3, .18][channel];
  const data = view.data.map((value, i) => Math.round((value + (period - 1) * (i % 2 ? 7 : -5)) * factor));
  const planned = data.map((value,index) => Math.round(value * [1.08,.94,1.05,.92,1.07,.96,1.04,.95][index]));
  const max = Math.max(...data, ...(viewIndex === 1 ? planned : [])) * 1.12;
  const points = data.map((value, i) => [34 + i * 62, 130 - value / max * 105]);
  const line = points.map(([x,y],i) => i === 0 ? `M ${x} ${y}` : `C ${x-31} ${points[i-1][1]}, ${x-31} ${y}, ${x} ${y}`).join(' ');
  const stages = ['Discovery', 'Qualified', 'Proposal', 'Closing'];
  const stageRates = [.36, .28, .22, .14];
  const ringColors = ['var(--accent)', 'var(--accent2)', 'var(--muted)', 'color-mix(in srgb,var(--text) 75%,var(--border))'];
  const circumference = 2 * Math.PI * 61;
  const stageIndex = Math.min(point, 3);
  const opportunityCount = Math.max(1, Math.round(64 * factor * periodFactor));
  const chooseView = (index: number) => { setViewIndex(index); setChannel(null); setPoint(7); setPlaying(false); };
  return (
    <div className={styles.scene} onPointerEnter={() => setEngaged(true)} onPointerLeave={() => setEngaged(false)} onFocusCapture={() => setEngaged(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setEngaged(false); }}>
      <div className={styles.panel}>
        <div className={styles.topbar}>
          <div className={styles.brand}><span className={styles.brandIcon}><BarChart3 size={15} /></span><strong>Clarity<span> / analytics studio</span></strong></div>
          <span className={styles.demo}><i /> Interactive demo</span>
        </div>
        <div className={styles.workspace}>
          <div className={styles.heading}><div><span className={styles.kicker}>YOUR BUSINESS, IN FOCUS</span><h2>{view.label}</h2></div><button className={styles.play} onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause dashboard tour' : 'Play dashboard tour'} title={playing ? 'Pause tour' : 'Play tour'}>{playing ? <Pause size={13} /> : <Play size={13} />}</button></div>
          <div className={styles.toolbar}>
            <div className={styles.tabs} role="group" aria-label="Dashboard view">{views.map((item,index) => <button key={item.name} aria-pressed={viewIndex === index} className={viewIndex === index ? styles.selected : ''} onClick={() => chooseView(index)}>{item.name}</button>)}</div>
            <div className={styles.periods} role="group" aria-label="Reporting period">{periods.map((item,index) => <button key={item} aria-pressed={period === index} className={period === index ? styles.periodSelected : ''} onClick={() => { setPeriod(index); setPlaying(false); }}>{item}</button>)}</div>
          </div>
          <div className={styles.metrics}>
            <div className={styles.primaryMetric}><span>{view.metric}</span><div><strong>{viewIndex === 1 ? Math.round(12486 * factor * periodFactor).toLocaleString('en-US') : '$' + Math.round((viewIndex === 0 ? 284620 : 426800) * factor * periodFactor).toLocaleString('en-US')}</strong><em><ArrowUpRight size={12} />{view.change}</em></div><small>{channel === null ? 'All channels' : channels[viewIndex][channel]} · {periods[period]} sample</small></div>
            <div className={styles.miniMetric}><span>{view.secondary[1]}</span><strong>{viewIndex === 1 ? view.secondary[0] : Math.max(1, Math.round((viewIndex === 0 ? 1842 : 64) * factor * periodFactor)).toLocaleString('en-US')}</strong><svg viewBox="0 0 80 22" aria-hidden="true">{viewIndex === 0 ? <path d="M1 20 13 14 24 16 36 7 48 12 60 4 79 1" /> : viewIndex === 1 ? <><circle cx="13" cy="11" r="9" stroke="var(--border)" strokeWidth="3" /><circle cx="13" cy="11" r="9" strokeWidth="3" strokeDasharray="55.6 56.55" transform="rotate(-90 13 11)" /><path d="m34 11 4 4 8-9" /></> : <><rect x="1" y="3" width="75" height="3" rx="1.5" fill="var(--accent)" opacity=".35" /><rect x="1" y="10" width="51" height="3" rx="1.5" fill="var(--accent)" opacity=".65" /><rect x="1" y="17" width="27" height="3" rx="1.5" fill="var(--accent)" /></>}</svg></div>
            <div className={styles.miniMetric}><span>{view.third[1]}</span><strong>{view.third[0]}</strong><small>Illustrative data</small></div>
          </div>
          <div className={styles.chartHeader}>
            <span><i />{viewIndex === 0 ? 'Revenue performance' : viewIndex === 1 ? 'Workflow throughput' : 'Opportunity mix'}</span>
            <strong>{viewIndex === 2 ? stages[stageIndex] : labels[period][point]} <span>{viewIndex === 2 ? Math.max(1, Math.round(opportunityCount * stageRates[stageIndex])) + ' deals' : view.unit + data[point] + view.suffix + (viewIndex === 1 ? ' / ' + planned[point] + ' planned' : '')}</span></strong>
          </div>
          {viewIndex === 2 ? (
            <div className={styles.pipelineVisual}>
              <svg className={styles.ring} viewBox="0 0 180 180" role="group" aria-label="Pipeline opportunity distribution">
                <circle cx="90" cy="90" r="61" className={styles.ringTrack} />
                {stages.map((stage,index) => <circle key={stage} cx="90" cy="90" r="61" className={styles.ringSegment} stroke={ringColors[index]} strokeWidth={stageIndex === index ? 22 : 17} strokeDasharray={`${stageRates[index]*circumference-5} ${circumference}`} strokeDashoffset={-stageRates.slice(0,index).reduce((sum,share)=>sum+share,0)*circumference} transform="rotate(-90 90 90)" tabIndex={0} role="button" aria-label={`${stage}: ${Math.round(stageRates[index]*100)} percent`} onPointerEnter={() => setPoint(index)} onFocus={() => setPoint(index)} onClick={() => {setPoint(index);setPlaying(false);}} onKeyDown={event => {if(event.key === 'Enter' || event.key === ' '){event.preventDefault();setPoint(index);setPlaying(false);}}} />)}
                <text x="90" y="78" textAnchor="middle" className={styles.ringLabel}>{stages[stageIndex].toUpperCase()}</text>
                <text x="90" y="106" textAnchor="middle" className={styles.ringNumber}>{Math.max(1,Math.round(opportunityCount*stageRates[stageIndex]))}</text>
                <text x="90" y="123" textAnchor="middle" className={styles.ringCaption}>opportunities</text>
              </svg>
              <div className={styles.stageList} role="group" aria-label="Pipeline stages">
                {stages.map((stage,index) => <button key={stage} className={stageIndex === index ? styles.mixSelected : ''} aria-pressed={stageIndex === index} onPointerEnter={() => setPoint(index)} onFocus={() => setPoint(index)} onClick={() => {setPoint(index);setPlaying(false);}}><i style={{background:ringColors[index]}} /><span>{stage}</span><strong>{Math.round(stageRates[index]*100)}<small>%</small></strong></button>)}
              </div>
            </div>
          ) : (
            <svg className={styles.chart} viewBox="0 0 500 164" role="group" aria-label={`${view.name} sample ${viewIndex === 0 ? 'area' : 'bar'} chart. Focus a data point or use the arrow keys to explore.`} onPointerMove={event => { const box = event.currentTarget.getBoundingClientRect(); setPoint(Math.max(0,Math.min(7,Math.round(((event.clientX-box.left)/box.width*500-34)/62)))); }}>
              <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity={viewIndex === 0 ? '.2' : '.9'} /><stop offset="100%" stopColor="var(--accent)" stopOpacity={viewIndex === 0 ? '0' : '.2'} /></linearGradient></defs>
              {[25,60,95,130].map((y,index) => <g key={y}><line x1="34" x2="480" y1={y} y2={y} className={styles.grid} /><text x="0" y={y+3} className={styles.axis}>{Math.round(max*(1-index/3))}</text></g>)}
              {viewIndex === 0 && <><path d={`${line} L 468 135 L 34 135 Z`} fill={`url(#${gradient})`} /><path d={line} className={styles.trend} /><line x1={points[point][0]} x2={points[point][0]} y1="18" y2="135" className={styles.crosshair} /></>}
              {points.map(([x,y],index) => {
                const events = {
                  tabIndex: 0, role: 'button', 'aria-label': `${labels[period][index]}: ${view.unit}${data[index]}${view.suffix}`,
                  onFocus: () => setPoint(index), onClick: () => setPoint(index),
                  onKeyDown: (event: React.KeyboardEvent<SVGElement>) => { if (event.key === 'Enter' || event.key === ' ') {event.preventDefault();setPoint(index);} else if (['ArrowRight','ArrowLeft'].includes(event.key)) {event.preventDefault();setPoint(value => Math.max(0,Math.min(7,value+(event.key === 'ArrowRight' ? 1 : -1))));} },
                };
                return <g key={index}>
                  <text x={x} y="158" textAnchor="middle" className={styles.axis}>{labels[period][index]}</text>
                  {viewIndex === 0 ? <circle {...events} cx={x} cy={y} r={point === index ? 5 : 3} className={point === index ? styles.activePoint : styles.point} /> : <>
                    <rect {...events} x={x-18} y={y} width="15" height={130-y} rx="3" fill={`url(#${gradient})`} className={styles.bar} opacity={point === index ? 1 : .78} />
                    <rect {...events} aria-label={`${labels[period][index]}: ${planned[index]} planned workflows`} x={x+2} y={130-planned[index]/max*105} width="15" height={planned[index]/max*105} rx="3" className={styles.plannedBar} opacity={point === index ? .95 : .6} />
                    {point === index && <text x={x} y={Math.min(y,130-planned[index]/max*105)-7} textAnchor="middle" className={styles.barValue}>{data[index]} / {planned[index]}</text>}
                  </>}
                </g>;
              })}
            </svg>
          )}
          <div className={styles.chartNote}>{viewIndex === 1 ? <><span><i className={styles.actualKey} />Completed</span><span><i className={styles.planKey} />Planned</span><em>Daily workflow comparison</em></> : <span>{viewIndex === 2 ? 'Select a segment to explore the opportunity mix' : 'Hover or focus a point to inspect performance'}</span>}</div>
          <div className={styles.channelHeader}><span>Channel contribution</span><button onClick={() => { setChannel(null); setPlaying(false); }} disabled={channel === null}>Reset filter</button></div>
          <div className={styles.channels}>{channels[viewIndex].map((name,index) => <button key={name} aria-pressed={channel === index} className={channel === index ? styles.channelSelected : ''} onClick={() => {setChannel(channel === index ? null : index);setPlaying(false);}}><span>{name}<ArrowUpRight size={11} /></span><div><i style={{width: `${[76,49,30][index]}%`,opacity:[1,.65,.35][index]}} /></div><strong>{[52,30,18][index]}<small>%</small></strong></button>)}</div>
        </div>
        <div className={styles.status}><span><Database size={10} /> Simulated data · No account needed</span><span><Layers size={10} /> Hover to explore</span></div>
      </div>
    </div>
  );
}
