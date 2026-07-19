'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Layers, AlertCircle, CheckCircle2, ChevronRight, Activity, TrendingUp, Network } from 'lucide-react';

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
        if (resData.success) {
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
      <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', fontFamily: 'monospace' }}>
          <Activity className="animate-spin" size={32} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
          Calculating Topical Link Equity Graph...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#ef4444' }}>
          <AlertCircle size={32} style={{ marginBottom: '1rem' }} />
          Failed to process knowledge base linking graph metrics.
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Navbar />

      <section className="section" style={{ paddingTop: 'clamp(8rem, 12vw, 10rem)', maxWidth: '1200px', margin: '0 auto', paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingBottom: '6rem' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: '3.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '2.5rem' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.25em' }}>Platform Management Center</span>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '1rem', fontFamily: 'Syne, sans-serif' }}>
            Topic Authority <span style={{ color: 'var(--accent)' }}>Dashboard</span>
          </h1>
          <p style={{ color: 'var(--muted)', maxWidth: '800px', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Programmatically audit and optimize your content ecosystem. Build linking paths, balance link weights, find topical coverage gaps, and inspect node click depths.
          </p>
        </div>

        {/* ── METRIC TILES GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontFamily: 'monospace' }}>Total Articles</span>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)', marginTop: '0.5rem' }}>{data.totalArticles}</div>
          </div>

          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontFamily: 'monospace' }}>Internal Links</span>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)', marginTop: '0.5rem' }}>{data.totalLinks}</div>
          </div>

          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontFamily: 'monospace' }}>Avg Link Weight</span>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)', marginTop: '0.5rem' }}>{data.averageLinksPerArticle}</div>
          </div>

          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontFamily: 'monospace' }}>Avg Click Depth</span>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)', marginTop: '0.5rem' }}>{data.avgClickDepth}</div>
          </div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr lg(2fr)', gap: '2rem', marginBottom: '4rem' }} className="grid grid-cols-1 lg:grid-cols-3">
          
          {/* ── LEFT COLUMN: COVERAGE & SUGGESTIONS ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="lg:col-span-1">
            
            {/* Category Coverage Card */}
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: 'Syne, sans-serif', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} style={{ color: 'var(--accent)' }} /> Topical Coverage
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {data.categoryCoverage.map(cat => (
                  <div key={cat.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'monospace', marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text)' }}>{cat.name}</span>
                      <span style={{ color: 'var(--accent)' }}>{cat.percentage}% ({cat.matched}/{cat.total})</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${cat.percentage}%`, height: '100%', background: 'var(--accent)', borderRadius: '3px', transition: 'width 0.5s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optimization Suggestions Card */}
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: 'Syne, sans-serif', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} style={{ color: 'var(--accent)' }} /> Link Recommendations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.suggestions.map((suggestion, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'start', fontSize: '0.8rem', lineHeight: 1.5 }}>
                    <ChevronRight size={14} style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ color: 'var(--muted)' }}>{suggestion}</span>
                  </div>
                ))}
                {data.suggestions.length === 0 && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--accent)', margin: '0 auto 0.5rem auto' }} />
                    All topics link structures are optimized!
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: INTERACTIVE VISUAL NODE GRAPH ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="lg:col-span-2">
            
            <div style={{ 
              background: 'var(--surface2)', 
              border: '1px solid var(--border)', 
              borderRadius: '6px', 
              padding: '1.75rem',
              position: 'relative'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: 'Syne, sans-serif', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Network size={18} style={{ color: 'var(--accent)' }} /> Topic Link Network map
              </h3>

              <div style={{ 
                background: 'rgba(0,0,0,0.3)', 
                border: '1px solid var(--border)', 
                borderRadius: '4px', 
                height: '360px', 
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

                    const radius = 10 + Math.min(node.incoming * 1.5, 20); // Scale radius by incoming link authority
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
                          fill={isHovered ? 'var(--accent)' : 'var(--surface2)'}
                          stroke={isHovered ? 'var(--accent)' : 'var(--border)'}
                          strokeWidth="2"
                          style={{ transition: 'fill 0.2s, stroke 0.2s' }}
                        />
                        <text
                          y={radius + 15}
                          textAnchor="middle"
                          fill={isHovered ? 'var(--text)' : 'var(--muted)'}
                          style={{ 
                            fontSize: '0.65rem', 
                            fontFamily: 'monospace', 
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
                    bottom: '1rem',
                    right: '1rem',
                    background: 'rgba(20,20,20,0.95)',
                    border: '1px solid var(--accent)',
                    borderRadius: '4px',
                    padding: '1rem',
                    width: '220px',
                    fontSize: '0.75rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.4rem', color: 'var(--text)' }}>{hoveredNode.title}</div>
                    <div style={{ color: 'var(--muted)', marginBottom: '0.5rem', fontFamily: 'monospace', textTransform: 'uppercase', fontSize: '0.65rem' }}>{hoveredNode.category}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                      <div>
                        <span style={{ color: 'var(--muted)' }}>Inbound:</span> <strong>{hoveredNode.incoming}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--muted)' }}>Outbound:</span> <strong>{hoveredNode.outgoing}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </section>

      <Footer />
    </div>
  );
}
