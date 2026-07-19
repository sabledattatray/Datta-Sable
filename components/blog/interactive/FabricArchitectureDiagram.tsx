'use client';

import { useState } from 'react';
import Tooltip from './Tooltip';

interface GraphNode {
  id: string;
  slug: string;
  title: string;
  parent: string | null;
  children: string[];
  prerequisites: string[];
  category: string;
  difficulty: string;
  definition: string;
}

export default function FabricArchitectureDiagram({ 
  allNodes 
}: { 
  allNodes: GraphNode[] 
}) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const activeNode = allNodes.find(n => n.id === activeNodeId);

  // Mappings from physical pipeline steps to Knowledge Graph Node IDs
  const stepMappings: Record<string, string> = {
    'onelake': 'onelake',
    'medallion': 'medallion',
    'direct-lake': 'direct-lake',
    'architecture': 'fabric-architecture',
    'pricing': 'pricing'
  };

  const handleNodeClick = (stepId: string) => {
    const graphId = stepMappings[stepId];
    if (graphId) {
      setActiveNodeId(graphId);
    }
  };

  return (
    <div style={{
      background: 'var(--surface2)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '2rem',
      margin: '2.5rem 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ 
        position: 'absolute', 
        top: '1rem', 
        right: '1rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.4rem',
        fontSize: '0.7rem',
        fontFamily: 'monospace',
        color: 'var(--muted)',
        textTransform: 'uppercase'
      }}>
        <span style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%' }} />
        Interactive Flow Blueprint
      </div>

      <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: 'Syne, sans-serif' }}>
        Microsoft Fabric <span style={{ color: 'var(--accent)' }}>System Architecture Flow</span>
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', alignItems: 'start', position: 'relative' }}>
        
        {/* SVG Diagram Canvas */}
        <div style={{
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <svg viewBox="0 0 600 240" style={{ width: '100%', height: 'auto', maxWidth: '600px' }}>
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="100%" stopColor="#84cc16" />
              </linearGradient>
            </defs>

            {/* FLOW LINES WITH ANIMATED DASHES */}
            {/* Ingestion to OneLake */}
            <path d="M 120 120 L 210 120" fill="none" stroke="var(--border)" strokeWidth="2" />
            <path d="M 120 120 L 210 120" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 6" style={{ animation: 'dash 15s linear infinite' }} />

            {/* OneLake to Compute Engines */}
            <path d="M 290 120 L 380 120" fill="none" stroke="var(--border)" strokeWidth="2" />
            <path d="M 290 120 L 380 120" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 6" style={{ animation: 'dash 15s linear infinite' }} />

            {/* Compute Engines to Power BI Consumer */}
            <path d="M 460 120 L 515 120" fill="none" stroke="var(--border)" strokeWidth="2" />
            <path d="M 460 120 L 515 120" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 6" style={{ animation: 'dash 15s linear infinite' }} />

            {/* 1. INGESTION SOURCES NODE */}
            <g transform="translate(40, 70)" onClick={() => handleNodeClick('architecture')} style={{ cursor: 'pointer' }}>
              <rect width="80" height="100" rx="6" fill="var(--surface2)" stroke={activeNodeId === 'fabric-architecture' ? 'var(--accent)' : 'var(--border)'} strokeWidth="1.5" />
              <text x="40" y="35" textAnchor="middle" fill="var(--text)" style={{ fontSize: '0.65rem', fontWeight: 'bold', fontFamily: 'monospace' }}>SOURCES</text>
              <text x="40" y="55" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '0.55rem' }}>ADLS / SQL</text>
              <text x="40" y="70" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '0.55rem' }}>Snowflake</text>
            </g>

            {/* 2. ONELAKE LOGICAL STORAGE NODE */}
            <g transform="translate(210, 70)" onClick={() => handleNodeClick('onelake')} style={{ cursor: 'pointer' }}>
              <rect width="80" height="100" rx="6" fill="var(--surface2)" stroke={activeNodeId === 'onelake' || activeNodeId === 'medallion' ? 'var(--accent)' : 'var(--border)'} strokeWidth="1.5" />
              <text x="40" y="35" textAnchor="middle" fill="var(--text)" style={{ fontSize: '0.65rem', fontWeight: 'bold', fontFamily: 'monospace' }}>ONELAKE</text>
              <text x="40" y="55" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '0.55rem' }}>Delta Lake</text>
              <text x="40" y="70" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '0.55rem' }}>Parquet</text>
              <circle cx="40" cy="85" r="4" fill="var(--accent)" />
            </g>

            {/* 3. COMPUTE ENGINES (DIRECT LAKE) */}
            <g transform="translate(380, 70)" onClick={() => handleNodeClick('direct-lake')} style={{ cursor: 'pointer' }}>
              <rect width="80" height="100" rx="6" fill="var(--surface2)" stroke={activeNodeId === 'direct-lake' ? 'var(--accent)' : 'var(--border)'} strokeWidth="1.5" />
              <text x="40" y="35" textAnchor="middle" fill="var(--text)" style={{ fontSize: '0.65rem', fontWeight: 'bold', fontFamily: 'monospace' }}>ENGINES</text>
              <text x="40" y="55" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '0.55rem' }}>Direct Lake</text>
              <text x="40" y="70" textAnchor="middle" fill="var(--muted)" style={{ fontSize: '0.55rem' }}>Spark / SQL</text>
            </g>

            {/* 4. POWER BI REPORTS */}
            <g transform="translate(515, 80)" onClick={() => handleNodeClick('direct-lake')} style={{ cursor: 'pointer' }}>
              <circle cx="30" cy="40" r="30" fill="var(--surface2)" stroke={activeNodeId === 'direct-lake' ? 'var(--accent)' : 'var(--border)'} strokeWidth="1.5" />
              <text x="30" y="44" textAnchor="middle" fill="var(--text)" style={{ fontSize: '0.65rem', fontWeight: 'bold', fontFamily: 'monospace' }}>REPORTS</text>
            </g>
          </svg>
        </div>

        {/* Display Active Node Tooltip */}
        {activeNode ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip 
              node={activeNode} 
              allNodes={allNodes} 
              onClose={() => setActiveNodeId(null)} 
            />
          </div>
        ) : (
          <div style={{
            border: '1px dashed var(--border)',
            padding: '2rem',
            textAlign: 'center',
            borderRadius: '6px',
            color: 'var(--muted)',
            fontSize: '0.85rem'
          }}>
            Click any component block in the blueprint diagram above to dynamically inspect core specifications, prerequisites, and learning modules.
          </div>
        )}

      </div>

      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </div>
  );
}
