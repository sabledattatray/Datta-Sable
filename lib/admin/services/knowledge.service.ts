import { KnowledgeGraphDTO } from '../dto/metrics.dto';

export class KnowledgeService {
  static async getKnowledgeGraphMetrics(): Promise<KnowledgeGraphDTO> {
    return {
      nodesCount: 327,
      relationshipsCount: 912,
      coveragePercentage: 91,
      clusters: [
        { name: 'Microsoft Fabric', completionPercentage: 100, status: 'Complete' },
        { name: 'Architecture & BI', completionPercentage: 100, status: 'Complete' },
        { name: 'OneLake & Storage', completionPercentage: 96, status: 'High Authority' },
        { name: 'Pricing & Sizing', completionPercentage: 95, status: 'High Authority' },
        { name: 'SQL & Performance', completionPercentage: 88, status: 'High Authority' },
        { name: 'Security & Auth', completionPercentage: 37, status: 'Developing' },
        { name: 'Governance & Purview', completionPercentage: 29, status: 'Needs Content' },
        { name: 'Real-Time Intelligence', completionPercentage: 18, status: 'Needs Content' },
      ],
      suggestedArticles: [
        {
          title: 'Microsoft Fabric Governance & Purview Integration: Enterprise Compliance Guide',
          topicCluster: 'Governance & Purview',
          priority: 'High',
          trafficImpact: 'High',
        },
        {
          title: 'Configuring Private Endpoints & Zero-Trust Security in Microsoft Fabric',
          topicCluster: 'Security & Auth',
          priority: 'High',
          trafficImpact: 'High',
        },
        {
          title: 'Real-Time Intelligence & Eventstream Architecture in Microsoft Fabric (2026)',
          topicCluster: 'Real-Time Intelligence',
          priority: 'Medium',
          trafficImpact: 'Medium',
        },
      ],
    };
  }
}
