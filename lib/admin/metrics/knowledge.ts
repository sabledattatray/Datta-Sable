export interface KnowledgeCluster {
  name: string;
  completion: number; // 0-100%
  status: 'Complete' | 'High Authority' | 'Developing' | 'Needs Content';
}

export interface SuggestedNextArticle {
  title: string;
  topicCluster: string;
  priority: 'High' | 'Medium';
  estimatedTrafficImpact: 'High' | 'Medium';
}

export interface KnowledgeMetrics {
  nodesCount: number;
  relationshipsCount: number;
  coveragePercentage: number;
  clusters: KnowledgeCluster[];
  suggestedNextArticles: SuggestedNextArticle[];
}

export async function getKnowledgeMetrics(): Promise<KnowledgeMetrics> {
  return {
    nodesCount: 327,
    relationshipsCount: 912,
    coveragePercentage: 91,
    clusters: [
      { name: 'Microsoft Fabric', completion: 100, status: 'Complete' },
      { name: 'Architecture & BI', completion: 100, status: 'Complete' },
      { name: 'OneLake & Storage', completion: 96, status: 'High Authority' },
      { name: 'Pricing & Sizing', completion: 95, status: 'High Authority' },
      { name: 'SQL & Performance', completion: 88, status: 'High Authority' },
      { name: 'Security & Auth', completion: 37, status: 'Developing' },
      { name: 'Governance & Purview', completion: 29, status: 'Needs Content' },
      { name: 'Real-Time Intelligence', completion: 18, status: 'Needs Content' },
    ],
    suggestedNextArticles: [
      {
        title: 'Microsoft Fabric Governance & Purview Integration: Enterprise Compliance Guide',
        topicCluster: 'Governance & Purview',
        priority: 'High',
        estimatedTrafficImpact: 'High',
      },
      {
        title: 'Configuring Private Endpoints & Zero-Trust Security in Microsoft Fabric',
        topicCluster: 'Security & Auth',
        priority: 'High',
        estimatedTrafficImpact: 'High',
      },
      {
        title: 'Real-Time Intelligence & Eventstream Architecture in Microsoft Fabric (2026)',
        topicCluster: 'Real-Time Intelligence',
        priority: 'Medium',
        estimatedTrafficImpact: 'Medium',
      },
    ],
  };
}
