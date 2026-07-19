'use client';

import graphData from '@/data/knowledge-graph.json';
import FabricArchitectureDiagram from './FabricArchitectureDiagram';

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

export default function DiagramRenderer({ name }: { name: string }) {
  const allNodes = graphData.topics as GraphNode[];

  switch (name) {
    case 'fabric-architecture':
      return <FabricArchitectureDiagram allNodes={allNodes} />;
    
    // Future diagram components can be registered here:
    // case 'onelake':
    //   return <OneLakeDiagram allNodes={allNodes} />;
    
    default:
      return (
        <div style={{
          border: '1px solid var(--border)',
          background: 'rgba(239, 68, 68, 0.05)',
          padding: '1.5rem',
          borderRadius: '4px',
          color: '#ef4444',
          fontSize: '0.85rem',
          fontFamily: 'monospace'
        }}>
          Error: Diagram token ID "{name}" is not registered in the rendering engine pipeline.
        </div>
      );
  }
}
