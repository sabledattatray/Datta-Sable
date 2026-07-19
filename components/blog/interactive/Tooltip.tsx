'use client';

import Link from 'next/link';

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

export default function Tooltip({ 
  node, 
  onClose,
  allNodes
}: { 
  node: GraphNode; 
  onClose?: () => void;
  allNodes: GraphNode[];
}) {
  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'beginner': return '#10b981'; // Green
      case 'intermediate': return '#f59e0b'; // Amber/Yellow
      case 'architect': return '#ef4444'; // Red
      default: return 'var(--accent)';
    }
  };

  return (
    <div style={{
      background: 'rgba(20, 20, 20, 0.9)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '1.5rem',
      maxWidth: '340px',
      color: 'var(--text)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(10px)',
      position: 'relative'
    }}>
      {onClose && (
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          &times;
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '1rem' }}>
        <span style={{ 
          fontFamily: 'monospace', 
          fontSize: '0.7rem', 
          color: 'var(--accent)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em' 
        }}>
          {node.category}
        </span>
        <span style={{ 
          fontSize: '0.65rem', 
          fontWeight: 700, 
          textTransform: 'uppercase',
          padding: '2px 8px',
          borderRadius: '10px',
          background: `${getDifficultyColor(node.difficulty)}20`,
          color: getDifficultyColor(node.difficulty),
          border: `1px solid ${getDifficultyColor(node.difficulty)}40`
        }}>
          {node.difficulty}
        </span>
      </div>

      <h4 style={{ 
        fontSize: '1.15rem', 
        fontWeight: 700, 
        marginBottom: '0.5rem', 
        fontFamily: 'Syne, sans-serif' 
      }}>
        {node.title}
      </h4>

      <p style={{ 
        fontSize: '0.8rem', 
        color: 'var(--muted)', 
        lineHeight: 1.5, 
        marginBottom: '1.25rem' 
      }}>
        {node.definition}
      </p>

      {/* Prerequisite & Progression Links */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.5rem', 
        borderTop: '1px solid var(--border)', 
        paddingTop: '0.75rem',
        marginBottom: '1.25rem',
        fontSize: '0.75rem'
      }}>
        {node.prerequisites.length > 0 && (
          <div>
            <span style={{ color: 'var(--muted)', fontWeight: 600 }}>Prerequisite: </span>
            {node.prerequisites.map(prereqId => {
              const prereqNode = allNodes.find(n => n.id === prereqId);
              return prereqNode ? (
                <Link key={prereqId} href={`/blog/${prereqNode.slug}`} style={{ color: 'var(--text)', textDecoration: 'underline', marginLeft: '4px' }}>
                  {prereqNode.title}
                </Link>
              ) : null;
            })}
          </div>
        )}

        {node.children.length > 0 && (
          <div>
            <span style={{ color: 'var(--muted)', fontWeight: 600 }}>Next Module: </span>
            {node.children.slice(0, 1).map(childId => {
              const childNode = allNodes.find(n => n.id === childId);
              return childNode ? (
                <Link key={childId} href={`/blog/${childNode.slug}`} style={{ color: 'var(--accent)', textDecoration: 'underline', marginLeft: '4px' }}>
                  {childNode.title}
                </Link>
              ) : null;
            })}
          </div>
        )}
      </div>

      <Link 
        href={`/blog/${node.slug}`}
        style={{
          display: 'block',
          textAlign: 'center',
          background: 'var(--accent)',
          color: '#000',
          padding: '0.5rem 1rem',
          fontWeight: 700,
          textDecoration: 'none',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          borderRadius: '2px',
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        Read Full Guide &rarr;
      </Link>
    </div>
  );
}
