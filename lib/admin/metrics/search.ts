export interface SearchOpportunity {
  title: string;
  slug: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  actionableSuggestion: string;
}

export interface SearchMetrics {
  google: {
    clicks: number;
    clicksTrend: string;
    impressions: number;
    impressionsTrend: string;
    ctr: number;
    averagePosition: number;
    indexedCount: number;
    totalPublished: number;
  };
  bing: {
    organicShare: string;
    copilotCitations: number;
    indexedCount: number;
    topQuery: string;
  };
  opportunities: SearchOpportunity[];
}

export async function getSearchMetrics(): Promise<SearchMetrics> {
  return {
    google: {
      clicks: 82,
      clicksTrend: '+1071%',
      impressions: 5180,
      impressionsTrend: '+1123%',
      ctr: 4.7,
      averagePosition: 14.8,
      indexedCount: 103,
      totalPublished: 110,
    },
    bing: {
      organicShare: '72%',
      copilotCitations: 3,
      indexedCount: 110,
      topQuery: 'fabric dp700 vs dp800',
    },
    opportunities: [
      {
        title: 'Microsoft Fabric Pricing Explained (2026): Complete Guide to F-SKUs',
        slug: 'microsoft-fabric-pricing-guide-2026',
        impressions: 1420,
        clicks: 17,
        ctr: 1.2,
        position: 11.2,
        actionableSuggestion: 'Rewrite Meta Description to highlight "Complete F-SKU Cost Calculator" for +15% CTR boost',
      },
      {
        title: 'DP-600 vs DP-700 vs DP-800: Which Microsoft Fabric Certification Should You Choose?',
        slug: 'dp-600-vs-dp-700-vs-dp-800-microsoft-fabric-certification-comparison',
        impressions: 1850,
        clicks: 64,
        ctr: 3.4,
        position: 8.4,
        actionableSuggestion: 'Add FAQ section covering Exam Voucher & Study Time to move into Top 5 results',
      },
      {
        title: 'OneLake Explained: The Complete Microsoft Fabric OneLake Architecture Guide',
        slug: 'microsoft-fabric-onelake-architecture-guide',
        impressions: 980,
        clicks: 8,
        ctr: 0.8,
        position: 14.1,
        actionableSuggestion: 'Add 4 internal links from Spark & Delta Lake articles to raise authority',
      },
    ],
  };
}
