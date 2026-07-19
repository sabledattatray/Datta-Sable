'use client';

import { useState } from 'react';
import Link from 'next/link';

interface GraphNode {
  id: string;
  slug: string;
  title: string;
  parent: string | null;
  children: string[];
  prerequisites: string[];
  category: string;
  aliases: string[];
}

interface PostMeta {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  tags?: string[];
  readTime?: number;
}

export default function FabricHubClient({ 
  initialPosts, 
  graphData 
}: { 
  initialPosts: PostMeta[]; 
  graphData: { topics: GraphNode[] } 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(
    graphData.topics.find(t => t.id === 'fabric-architecture') || null
  );

  // Simple, robust client-side search with synonym/alias expansion
  const filteredPosts = initialPosts.filter(post => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return selectedCategory === 'All' || post.category === selectedCategory;
    }

    // Check matches in title, excerpt, category, or tags
    const titleMatch = post.title.toLowerCase().includes(query);
    const excerptMatch = post.excerpt.toLowerCase().includes(query);
    const categoryMatch = post.category.toLowerCase().includes(query);
    const tagMatch = post.tags?.some(t => t.toLowerCase().includes(query)) || false;

    // Check synonym / alias matching from Knowledge Graph
    const graphNode = graphData.topics.find(t => t.slug === post.slug);
    const aliasMatch = graphNode?.aliases.some(alias => alias.toLowerCase().includes(query)) || false;

    const matchesSearch = titleMatch || excerptMatch || categoryMatch || tagMatch || aliasMatch;

    return matchesSearch && (selectedCategory === 'All' || post.category === selectedCategory);
  });

  const categories = ['All', ...Array.from(new Set(initialPosts.map(p => p.category)))];

  // Learning Path SVG Dimensions and Node Positions (Vertical tree design)
  // Left Spoke: Storage/Analytics
  // Center Spoke: Certifications
  // Right Spoke: FinOps / Pricing
  const nodePositions: Record<string, { x: number; y: number }> = {
    'fabric-architecture': { x: 300, y: 50 },
    'onelake': { x: 150, y: 150 },
    'medallion': { x: 80, y: 250 },
    'direct-lake': { x: 220, y: 250 },
    'pricing': { x: 450, y: 150 },
    'dp-600': { x: 300, y: 150 },
    'dp-700': { x: 250, y: 250 },
    'dp-800': { x: 350, y: 250 },
  };

  return (
    <div>
      {/* ── INTERACTIVE CURRICULUM PATH ── */}
      <div style={{ 
        background: 'var(--surface2)', 
        border: '1px solid var(--border)', 
        borderRadius: '8px', 
        padding: '2.5rem', 
        marginBottom: '4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>Interactive Curriculum Map</span>
        </div>

        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', fontFamily: 'Syne, sans-serif' }}>
          Microsoft Fabric <span style={{ color: 'var(--accent)' }}>Knowledge Graph</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem', position: 'relative' }}>
          
          {/* Interactive SVG Flow Tree */}
          <div style={{ 
            width: '100%', 
            minHeight: '320px', 
            background: 'rgba(0,0,0,0.2)', 
            borderRadius: '6px', 
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <svg viewBox="0 0 600 320" style={{ width: '100%', height: '100%', maxWidth: '600px' }}>
              {/* Definitions for gradients and drop shadows */}
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connector lines between parent and children nodes */}
              {graphData.topics.map(node => {
                const parentPos = node.parent ? nodePositions[node.parent] : null;
                const currentPos = nodePositions[node.id];
                if (!parentPos || !currentPos) return null;

                return (
                  <g key={`edge-${node.id}`}>
                    <path
                      d={`M ${parentPos.x} ${parentPos.y} Q ${(parentPos.x + currentPos.x) / 2} ${(parentPos.y + currentPos.y) / 2 - 20}, ${currentPos.x} ${currentPos.y}`}
                      fill="none"
                      stroke={selectedNode?.id === node.id || selectedNode?.id === node.parent ? 'var(--accent)' : 'var(--border)'}
                      strokeWidth={selectedNode?.id === node.id || selectedNode?.id === node.parent ? '2' : '1.5'}
                      strokeDasharray={selectedNode?.id === node.id ? '4 4' : 'none'}
                      style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                    />
                  </g>
                );
              })}

              {/* Interactive nodes */}
              {graphData.topics.map(node => {
                const pos = nodePositions[node.id];
                if (!pos) return null;

                const isSelected = selectedNode?.id === node.id;

                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedNode(node)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Outer glow ring for selected node */}
                    {isSelected && (
                      <circle 
                        r="24" 
                        fill="none" 
                        stroke="var(--accent)" 
                        strokeWidth="1.5" 
                        opacity="0.8"
                        filter="url(#glow)"
                      />
                    )}

                    {/* Base Node Circle */}
                    <circle 
                      r="16" 
                      fill={isSelected ? 'var(--accent)' : 'var(--surface2)'} 
                      stroke={isSelected ? 'var(--accent)' : 'var(--border)'} 
                      strokeWidth="2"
                      style={{ transition: 'fill 0.2s, stroke 0.2s' }}
                    />

                    {/* Central Icon/Dot */}
                    <circle 
                      r="5" 
                      fill={isSelected ? '#000' : 'var(--muted)'} 
                    />

                    {/* Node Text Label */}
                    <text 
                      y="32" 
                      textAnchor="middle" 
                      fill={isSelected ? 'var(--text)' : 'var(--muted)'} 
                      style={{ 
                        fontSize: '0.75rem', 
                        fontFamily: 'monospace', 
                        fontWeight: isSelected ? '700' : '400',
                        transition: 'fill 0.2s, font-weight 0.2s'
                      }}
                    >
                      {node.title.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Node Details Card (Curriculum Sidebar) */}
          <div style={{ 
            background: 'var(--bg)', 
            border: '1px solid var(--border)', 
            padding: '1.5rem', 
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {selectedNode ? (
              <div>
                <span style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '0.7rem', 
                  color: 'var(--accent)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  {selectedNode.category} Guide
                </span>
                
                <h4 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 700, 
                  marginBottom: '0.75rem', 
                  fontFamily: 'Syne, sans-serif',
                  color: 'var(--text)'
                }}>
                  {selectedNode.title}
                </h4>

                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {initialPosts.find(p => p.slug === selectedNode.slug)?.excerpt || 'Master this curriculum segment to scale your skills in Microsoft Fabric data solutions.'}
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Link 
                    href={`/blog/${selectedNode.slug}`} 
                    style={{ 
                      background: 'var(--accent)', 
                      color: '#000', 
                      padding: '0.5rem 1.25rem', 
                      fontWeight: 700, 
                      textDecoration: 'none', 
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRadius: '2px'
                    }}
                  >
                    Open Curriculum Study Guide &rarr;
                  </Link>

                  {selectedNode.parent && (
                    <button 
                      onClick={() => {
                        const parentNode = graphData.topics.find(t => t.id === selectedNode.parent);
                        if (parentNode) setSelectedNode(parentNode);
                      }}
                      style={{ 
                        background: 'none',
                        border: '1px solid var(--border)',
                        color: 'var(--muted)',
                        padding: '0.5rem 1rem',
                        fontSize: '0.8rem',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                        borderRadius: '2px'
                      }}
                    >
                      &uarr; Parent Topic
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                Select a concept node in the Curriculum Map to view study plans and prerequisites.
              </p>
            )}
          </div>

        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.5rem', 
        marginBottom: '3rem',
        paddingBottom: '2rem',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', gap: '1rem', width: '100%', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Search guides, concepts, SKUs, or exam goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              flexGrow: 1, 
              background: 'var(--surface2)', 
              border: '1px solid var(--border)', 
              borderRadius: '4px', 
              padding: '0.8rem 1.2rem', 
              color: 'var(--text)',
              fontSize: '0.95rem'
            }}
          />
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? 'var(--accent)' : 'var(--surface2)',
                color: selectedCategory === cat ? '#000' : 'var(--muted)',
                border: '1px solid var(--border)',
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── FILTERED ARTICLES GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {filteredPosts.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              background: 'var(--surface2)', 
              border: '1px solid var(--border)', 
              borderRadius: '4px', 
              padding: '1.5rem',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--accent)', marginBottom: '0.5rem', display: 'block', textTransform: 'uppercase' }}>
                {post.category}
              </span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.75rem 0', lineHeight: 1.3, fontFamily: 'Syne, sans-serif' }}>
                {post.title}
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0, flexGrow: 1 }}>
                {post.excerpt}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'monospace' }}>
                  {post.readTime} min read
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)' }}>
                  Read Article →
                </span>
              </div>
            </div>
          </Link>
        ))}

        {filteredPosts.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0', color: 'var(--muted)' }}>
            No Fabric guides found matching the current search parameters.
          </div>
        )}
      </div>
    </div>
  );
}
