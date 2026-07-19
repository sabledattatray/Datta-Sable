export interface ArticleMetricsDTO {
  id?: string;
  slug: string;
  title: string;
  category: string;
  wordCount: number;
  internalLinksCount: number;
  hasFaqSchema: boolean;
  hasArticleSchema: boolean;
  hasHeroImage: boolean;
  hasExcerpt: boolean;
  qualityScore: number;
}

export interface InternalLinkingReportDTO {
  totalInternalLinks: number;
  avgLinksPerArticle: number;
  brokenLinksCount: number;
  orphanPagesCount: number;
  orphanPages: Array<{ title: string; slug: string }>;
}

export interface SeoIntelligenceDTO {
  siteHealthScore: number;
  indexCoverage: { indexed: number; total: number; percentage: number };
  missingMetadataCount: number;
  missingSchemaCount: number;
  linkingReport: InternalLinkingReportDTO;
  opportunities: Array<{
    title: string;
    slug: string;
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
    suggestion: string;
  }>;
}

export interface ContentPipelineDTO {
  totalPublished: number;
  totalDrafts: number;
  needsImagesCount: number;
  needsSchemaCount: number;
  needsMetadataCount: number;
  publishedThisMonth: number;
}

export interface KnowledgeClusterDTO {
  name: string;
  completionPercentage: number;
  status: 'Complete' | 'High Authority' | 'Developing' | 'Needs Content';
}

export interface KnowledgeGraphDTO {
  nodesCount: number;
  relationshipsCount: number;
  coveragePercentage: number;
  clusters: KnowledgeClusterDTO[];
  suggestedArticles: Array<{
    title: string;
    topicCluster: string;
    priority: 'High' | 'Medium';
    trafficImpact: 'High' | 'Medium';
  }>;
}

export interface SystemHealthDTO {
  status: 'Healthy' | 'Degraded' | 'Critical';
  score: number;
  nextjs: 'OK' | 'Error';
  postgres: 'OK' | 'Error';
  cloudflare: 'OK' | 'Error';
  sitemap: 'Updated' | 'Pending';
  cronJobs: 'OK' | 'Error';
  lastBuild: string;
}

export interface MasterDashboardDTO {
  seo: SeoIntelligenceDTO;
  content: ContentPipelineDTO;
  knowledge: KnowledgeGraphDTO;
  system: SystemHealthDTO;
  community: {
    totalUsers: number;
    totalSubscribers: number;
    unreadMessages: number;
  };
  eventLog: Array<{
    id: string;
    icon: string;
    title: string;
    timestamp: string;
    category: 'System' | 'SEO' | 'Content' | 'Database';
  }>;
}
