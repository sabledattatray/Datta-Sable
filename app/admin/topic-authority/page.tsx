'use client';

import { useState, useEffect } from 'react';
import { Layers, AlertCircle, CheckCircle2, ChevronRight, Activity, TrendingUp, Network, Link as LinkIcon, Compass, Sparkles } from 'lucide-react';
import adminStyles from '@/components/admin/AdminCommon.module.css';

interface CoverageStats {
  name: string;
  percentage: number;
  total: number;
  matched: number;
}

interface NodeDetail {
  id: string;
  title: string;
  incoming: number;
  outgoing: number;
  parent: string | null;
  category: string;
}

interface DashboardData {
  totalArticles: number;
  totalLinks: number;
  averageLinksPerArticle: number;
  avgClickDepth: number;
  worstClickDepth: number;
  categoryCoverage: CoverageStats[];
  suggestions: string[];
  nodes: NodeDetail[];
}

export default function TopicAuthorityDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<NodeDetail | null>(null);

  useEffect(() => {
    fetch('/api/admin/topic-authority')
      .then(res => res.json())
      .then(resData => {
        if (resData?.success) {
          setData(resData);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load topic authority stats:', err);
        setLoading(false);
      });
  }, []);

  // Visual Positions for the Interactive SVG Node Map
  const nodePositions: Record<string, { x: number; y: number }> = {
    'fabric-architecture': { x: 300, y: 120 },
    'onelake': { x: 180, y: 80 },
    'medallion': { x: 90, y: 50 },
    'direct-lake': { x: 90, y: 120 },
    'pricing': { x: 420, y: 80 },
    'dp-600': { x: 300, y: 200 },
    'dp-700': { x: 200, y: 200 },
    'dp-800': { x: 400, y: 200 },
  };

  if (loading) {
    return (
      <div className={adminStyles.page}>
        <div className={adminStyles.panel} style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Activity className="animate-spin" size={28} style={{ color: 'var(--accent)', margin: '0 auto 12px' }} />
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 'var(--text-small)', color: 'var(--muted)' }}>
            Calculating Topical Link Equity Graph...
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={adminStyles.page}>
        <div className={adminStyles.panel} style={{ textAlign: 'center', padding: '60px 20px', borderColor: 'rgba(239,68,68,0.3)' }}>
          <AlertCircle size={32} style={{ color: '#ef4444', margin: '0 auto 12px' }} />
          <div style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.9rem' }}>
            Failed to process knowledge base linking graph metrics.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={adminStyles.page}>
      {/* ── HEADER ── */}
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} />
            Knowledge Graph & Authority Engine
          </div>
          <h1 className={adminStyles.title}>
            Topic Authority <span className={adminStyles.titleAccent}>Map</span>
          </h1>
          <p className={adminStyles.subtitle}>
            Programmatically audit and optimize your content ecosystem. Build linking paths, balance link weights, find topical coverage gaps, and inspect node click depths.
          </p>
        </div>
      </div>

      {/* ── METRICS GRID ── */}
      <div className={adminStyles.metricGrid}>
        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Total Articles</span>
            <Layers size={16} />
          </div>
          <div className={adminStyles.metricValue}>{data.totalArticles}</div>
          <div className={adminStyles.metricBottom}>
            <span>Indexed nodes</span>
            <span>Content corpus</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Internal Links</span>
            <LinkIcon size={16} />
          </div>
          <div className={adminStyles.metricValue}>{data.totalLinks}</div>
          <div className={adminStyles.metricBottom}>
            <span>Graph edges</span>
            <span>Semantic links</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Avg Link Weight</span>
            <TrendingUp size={16} />
          </div>
          <div className={adminStyles.metricValue}>{data.averageLinksPerArticle}</div>
          <div className={adminStyles.metricBottom}>
            <span>Per article average</span>
            <span>Cluster density</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Avg Click Depth</span>
            <Compass size={16} />
          </div>
          <div className={adminStyles.metricValue}>{data.avgClickDepth}</div>
          <div className={adminStyles.metricBottom}>
            <span>Max depth: {data.worstClickDepth}</span>
            <span>Crawl efficiency</span>
          </div>
        </div>
      </div>

      {/* ── 2-COLUMN MAIN CONTENT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '16px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: COVERAGE & SUGGESTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Topical Coverage Panel */}
          <div className={adminStyles.panel}>
            <div className={adminStyles.panelHeading}>
              <Layers size={14} style={{ color: 'var(--accent)' }} />
              Topical Coverage
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data.categoryCoverage.map(cat => (
                <div key={cat.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-small)', fontFamily: 'var(--font-mono, monospace)', marginBottom: '5px' }}>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{cat.name}</span>
                    <span style={{ color: 'var(--accent)' }}>{cat.percentage}% ({cat.matched}/{cat.total})</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'var(--surface2)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div style={{ width: `${cat.percentage}%`, height: '100%', background: 'var(--accent)', borderRadius: '2px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Link Recommendations Panel */}
          <div className={adminStyles.panel}>
            <div className={adminStyles.panelHeading}>
              <Sparkles size={14} style={{ color: 'var(--accent)' }} />
              Link Recommendations
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.suggestions.map((suggestion, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'start', fontSize: 'var(--text-small)', lineHeight: 1.5 }}>
                  <ChevronRight size={13} style={{ color: 'var(--accent)', marginTop: '3px', flexShrink: 0 }} />
                  <span style={{ color: 'var(--muted)' }}>{suggestion}</span>
                </div>
              ))}
              {data.suggestions.length === 0 && (
                <div style={{ fontSize: 'var(--text-small)', color: 'var(--muted)', textAlign: 'center', padding: '16px 0' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent)', margin: '0 auto 6px' }} />
                  All topic linking structures are optimal!
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE VISUAL NODE GRAPH */}
        <div className={adminStyles.panel} style={{ position: 'relative' }}>
          <div className={adminStyles.panelHeading}>
            <Network size={14} style={{ color: 'var(--accent)' }} />
            Topic Link Network Map
          </div>

          <div style={{ 
            background: 'var(--surface2)', 
            border: '1px solid var(--border)', 
            borderRadius: '4px', 
            height: '420px', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <svg viewBox="0 0 600 360" style={{ width: '100%', height: '100%', maxWidth: '600px' }}>
              {/* Connectors */}
              {data.nodes.map(node => {
                if (!node.parent) return null;
                const parentPos = nodePositions[node.parent];
                const currentPos = nodePositions[node.id];
                if (!parentPos || !currentPos) return null;

                const isHighlighted = hoveredNode?.id === node.id || hoveredNode?.id === node.parent;

                return (
                  <g key={`edge-${node.id}`}>
                    <line
                      x1={parentPos.x}
                      y1={parentPos.y}
                      x2={currentPos.x}
                      y2={currentPos.y}
                      stroke={isHighlighted ? 'var(--accent)' : 'var(--border)'}
                      strokeWidth={isHighlighted ? '2' : '1'}
                      style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                    />
                  </g>
                );
              })}

              {/* Node Circles */}
              {data.nodes.map(node => {
                const pos = nodePositions[node.id];
                if (!pos) return null;

                const radius = 9 + Math.min(node.incoming * 1.5, 18);
                const isHovered = hoveredNode?.id === node.id;

                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      r={radius}
                      fill={isHovered ? 'var(--accent)' : 'var(--surface)'}
                      stroke={isHovered ? 'var(--accent)' : 'var(--border)'}
                      strokeWidth="1.5"
                      style={{ transition: 'fill 0.2s, stroke 0.2s' }}
                    />
                    <text
                      y={radius + 14}
                      textAnchor="middle"
                      fill={isHovered ? 'var(--text)' : 'var(--muted)'}
                      style={{ 
                        fontSize: 'var(--text-small)',
                        fontFamily: 'var(--font-mono, monospace)', 
                        fontWeight: isHovered ? '700' : '400',
                        transition: 'fill 0.2s'
                      }}
                    >
                      {node.title.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Floating Node Data Inspect Box */}
            {hoveredNode && (
              <div style={{
                position: 'absolute',
                bottom: '14px',
                right: '14px',
                background: 'var(--surface)',
                border: '1px solid var(--accent)',
                borderRadius: '4px',
                padding: '12px 14px',
                width: '210px',
                fontSize: 'var(--text-small)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                zIndex: 10
              }}>
                <div style={{ fontWeight: 600, marginBottom: '2px', color: 'var(--text)', fontSize: 'var(--text-small)' }}>{hoveredNode.title}</div>
                <div style={{ color: 'var(--muted)', marginBottom: '8px', fontFamily: 'var(--font-mono, monospace)', textTransform: 'uppercase', fontSize: 'var(--text-small)' }}>{hoveredNode.category}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                  <div>
                    <span style={{ color: 'var(--muted)', display: 'block', fontSize: 'var(--text-small)' }}>Inbound</span>
                    <strong style={{ color: 'var(--accent)', fontSize: 'var(--text-small)' }}>{hoveredNode.incoming}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted)', display: 'block', fontSize: 'var(--text-small)' }}>Outbound</span>
                    <strong style={{ color: 'var(--text)', fontSize: 'var(--text-small)' }}>{hoveredNode.outgoing}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

