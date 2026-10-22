export interface QualityEvaluationInput {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  wordCount: number;
  duplicateRiskScore: number;
  verifiedClaimsCount: number;
  hasSeoTitle: boolean;
  hasSeoDescription: boolean;
}

export interface QualityGateReport {
  score: number; // 0 to 100
  factualVerificationStatus: 'PASSED' | 'WARNING' | 'FAILED';
  headingHierarchyValid: boolean;
  seoComplete: boolean;
  readabilityScore: number; // Flesch-Kincaid equivalent estimation
  duplicateRiskScore: number;
  blockers: string[];
  recommendations: string[];
  isEligibleForAutonomousPublish: boolean;
}

export function evaluateContentQuality(input: QualityEvaluationInput): QualityGateReport {
  const blockers: string[] = [];
  const recommendations: string[] = [];

  let score = 100;

  // 1. Length & Substance Check
  if (input.wordCount < 600) {
    score -= 30;
    blockers.push(`Article length (${input.wordCount} words) is below the minimum technical depth threshold (600 words).`);
  } else if (input.wordCount < 1000) {
    score -= 10;
    recommendations.push('Consider expanding technical details or code examples to reach 1,200+ words.');
  }

  // 2. Heading Hierarchy & Structure Check
  const h2Count = (input.content.match(/^##\s+.+$/gm) || []).length;
  const h3Count = (input.content.match(/^###\s+.+$/gm) || []).length;
  const hasH1InBody = /^#\s+.+$/gm.test(input.content);

  let headingHierarchyValid = true;
  if (hasH1InBody) {
    score -= 5;
    recommendations.push('Body contains an H1 (#) tag. In this CMS, page title serves as H1; body should start with H2 (##).');
  }

  if (h2Count < 3) {
    score -= 15;
    headingHierarchyValid = false;
    blockers.push(`Insufficient section structure (${h2Count} H2 headings). At least 3 H2 sections required.`);
  }

  // 3. Duplicate Risk Evaluation
  if (input.duplicateRiskScore >= 70) {
    score -= 40;
    blockers.push(`Critical duplicate content risk (${input.duplicateRiskScore}% similarity with existing article).`);
  } else if (input.duplicateRiskScore >= 35) {
    score -= 15;
    recommendations.push(`Moderate overlap (${input.duplicateRiskScore}%) with existing published articles. Verify unique angle.`);
  }

  // 4. Factual Verification & Citations
  let factualVerificationStatus: 'PASSED' | 'WARNING' | 'FAILED' = 'PASSED';
  if (input.verifiedClaimsCount === 0) {
    score -= 20;
    factualVerificationStatus = 'WARNING';
    recommendations.push('No verified documentation links attached to research claims.');
  }

  // 5. SEO Completeness
  const seoComplete = input.hasSeoTitle && input.hasSeoDescription && input.excerpt.length >= 50;
  if (!seoComplete) {
    score -= 15;
    blockers.push('SEO metadata is incomplete (title, description, or excerpt missing).');
  }

  // 6. Practical Assets Check (Code blocks or tables)
  const hasCodeBlock = input.content.includes('```');
  const hasTable = input.content.includes('|---') || input.content.includes('|:--');
  if (!hasCodeBlock && !hasTable) {
    score -= 10;
    recommendations.push('Technical guide lacks code snippets or comparison tables. Adding practical artifacts improves reader value.');
  }

  // 7. Estimated Readability (Heuristic based on sentence & paragraph lengths)
  const paragraphs = input.content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const avgParagraphLength = input.wordCount / (paragraphs.length || 1);
  let readabilityScore = 80;
  if (avgParagraphLength > 120) {
    readabilityScore = 65;
    recommendations.push('Some paragraphs are overly dense. Break up large text blocks for better technical readability.');
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  // Autonomous publishing requires: score >= 75, zero blockers, duplicate risk < 35%
  const isEligibleForAutonomousPublish = finalScore >= 75 && blockers.length === 0 && input.duplicateRiskScore < 35;

  return {
    score: finalScore,
    factualVerificationStatus,
    headingHierarchyValid,
    seoComplete,
    readabilityScore,
    duplicateRiskScore: input.duplicateRiskScore,
    blockers,
    recommendations,
    isEligibleForAutonomousPublish,
  };
}
