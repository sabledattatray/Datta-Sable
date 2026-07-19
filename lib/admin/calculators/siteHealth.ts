export class SiteHealthCalculator {
  /**
   * Calculates dynamic Site Health Score (0 - 100%) weighted across 5 operational dimensions.
   */
  static calculate(params: {
    missingMetaCount: number;
    orphanPagesCount: number;
    brokenLinksCount: number;
    knowledgeGraphCoverage: number;
    postgresStatus: 'OK' | 'Error';
  }): number {
    // 1. SEO Compliance (30 points)
    const seoPenalty = Math.min(30, params.missingMetaCount * 2 + params.brokenLinksCount * 10);
    const seoScore = Math.max(0, 30 - seoPenalty);

    // 2. Content Quality (20 points)
    const contentScore = 20;

    // 3. Internal Link Health (20 points)
    const linkPenalty = Math.min(20, params.orphanPagesCount * 4);
    const linkScore = Math.max(0, 20 - linkPenalty);

    // 4. Knowledge Graph Completion (15 points)
    const graphScore = Math.round((params.knowledgeGraphCoverage / 100) * 15);

    // 5. System Uptime & Database (15 points)
    const systemScore = params.postgresStatus === 'OK' ? 15 : 0;

    const total = seoScore + contentScore + linkScore + graphScore + systemScore;
    return Math.min(100, Math.max(0, Math.round(total)));
  }
}
