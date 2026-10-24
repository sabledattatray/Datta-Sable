import { prisma } from '../prisma';
import { ensureAiStudioSchema, ResearchBriefSchema } from './schema';
import { executeAiCompletion } from './provider';

export interface ResearchBriefResult {
  id?: string;
  topicId?: string;
  proposedTitle: string;
  readerIntent: string;
  targetAudience: string;
  primaryQuestions: string[];
  verifiedClaims: Array<{
    claim: string;
    sourceUrl: string;
    sourceTitle?: string;
    date?: string;
    verified: boolean;
  }>;
  documentationUrls: string[];
  sourceCitations: Array<{
    url: string;
    title: string;
    retrievedAt: string;
    author?: string;
  }>;
  potentialConflicts?: string | null;
  suggestedOutline: Array<{
    heading: string;
    level: 'H2' | 'H3';
    summary: string;
    keyPoints: string[];
  }>;
}

const AUTHORITATIVE_DOMAINS = [
  'learn.microsoft.com',
  'docs.microsoft.com',
  'azure.microsoft.com',
  'microsoft.com',
  'techcommunity.microsoft.com',
  'postgresql.org',
  'github.com',
  'python.org',
  'nodejs.org',
  'react.dev',
  'nextjs.org',
  'w3.org',
  'ietf.org',
];

export async function validateAuthoritativeSource(urlStr: string): Promise<{
  verified: boolean;
  httpStatus?: number;
  domain?: string;
  isAuthoritativeDomain: boolean;
  error?: string;
}> {
  try {
    const parsed = new URL(urlStr);
    const domain = parsed.hostname.toLowerCase();
    const isAuthoritativeDomain = AUTHORITATIVE_DOMAINS.some(
      (d) => domain === d || domain.endsWith('.' + d)
    );

    // Validate before making any network request, including redirect targets.
    if (!isAuthoritativeDomain || parsed.protocol !== 'https:' || parsed.username || parsed.password || (parsed.port && parsed.port !== '443')) {
      return { verified: false, domain, isAuthoritativeDomain, error: 'Source must use HTTPS on an authoritative whitelist domain without credentials or a custom port' };
    }

    const requestSource = async (method: 'HEAD' | 'GET') => {
      let target = parsed;
      const signal = AbortSignal.timeout(3500);
      for (let redirects = 0; redirects <= 5; redirects++) {
        const allowed = AUTHORITATIVE_DOMAINS.some(d => target.hostname === d || target.hostname.endsWith('.' + d));
        if (!allowed || target.protocol !== 'https:' || target.username || target.password || (target.port && target.port !== '443')) {
          throw new Error('Unsafe source redirect');
        }
        const response = await fetch(target.href, {
          method,
          headers: {
            'User-Agent': 'DattaSableResearchBot/2.0 (+https://dattasable.com)',
            ...(method === 'GET' ? { Range: 'bytes=0-1024' } : {}),
          },
          signal,
          redirect: 'manual',
        });
        // Only successful final responses verify a citation. Release GET bodies.
        await response.body?.cancel();
        if (![301, 302, 303, 307, 308].includes(response.status)) return response.status;
        const location = response.headers.get('location');
        if (!location) throw new Error('Source redirect has no destination');
        target = new URL(location, target);
      }
      throw new Error('Too many source redirects');
    };

    let httpStatus = 0;
    try {
      httpStatus = await requestSource('HEAD');
      if (httpStatus === 405) {
        httpStatus = await requestSource('GET');
      }
    } catch (netErr: any) {
      return {
        verified: false,
        domain,
        isAuthoritativeDomain,
        error: netErr?.message || 'Network unreachable',
      };
    }

    const verified = httpStatus >= 200 && httpStatus < 300 && isAuthoritativeDomain;

    return {
      verified,
      httpStatus,
      domain,
      isAuthoritativeDomain,
      ...(!verified && {
        error: httpStatus >= 400
          ? `HTTP ${httpStatus} error`
          : !isAuthoritativeDomain
          ? `Domain ${domain} not in authoritative whitelist`
          : 'Verification failed',
      }),
    };
  } catch (err: any) {
    return {
      verified: false,
      isAuthoritativeDomain: false,
      error: err?.message || 'Invalid URL',
    };
  }
}

export async function createResearchBrief({
  topic,
  category,
  topicId,
}: {
  topic: string;
  category: string;
  topicId?: string;
}): Promise<ResearchBriefResult> {
  await ensureAiStudioSchema();

  const prompt = `Conduct comprehensive, factual technical research for an in-depth article on:
Topic: "${topic}"
Category: "${category}"

Requirements:
1. Proposed Title: Professional, high-CTR, technical title without hype.
2. Reader Intent: Exactly what the reader is trying to achieve.
3. Target Audience: Precise technical role.
4. Primary Questions: 4-6 specific technical questions answered in the guide.
5. Verified Claims: 3-5 factual statements regarding capabilities, limitations, or best practices with authoritative documentation links (for Microsoft products, reference learn.microsoft.com).
6. Documentation URLs: Official documentation links.
7. Source Citations: References with title, URL, and current retrieval timestamp.
8. Potential Conflicts: Any known caveats, deprecated features, or conflicting practices.
9. Suggested Outline: Hierarchical structure (H2 and H3) with summary and key points for each section.

Respond ONLY with valid JSON following this exact schema:
{
  "proposedTitle": "string",
  "readerIntent": "string",
  "targetAudience": "string",
  "primaryQuestions": ["string", "string"],
  "verifiedClaims": [
    {
      "claim": "string",
      "sourceUrl": "https://learn.microsoft.com/...",
      "sourceTitle": "string",
      "verified": false
    }
  ],
  "documentationUrls": ["https://learn.microsoft.com/..."],
  "sourceCitations": [
    {
      "url": "https://learn.microsoft.com/...",
      "title": "string",
      "retrievedAt": "${new Date().toISOString()}"
    }
  ],
  "potentialConflicts": "string or null",
  "suggestedOutline": [
    {
      "heading": "string",
      "level": "H2",
      "summary": "string",
      "keyPoints": ["string"]
    }
  ]
}`;

  try {
    const aiResult = await executeAiCompletion({
      prompt,
      systemPrompt: 'You are a principal technical researcher and documentation specialist. You cite official documentation (especially learn.microsoft.com for Microsoft technologies). You never hallucinate APIs, versions, or features.',
      task: 'RESEARCH_BRIEF',
      jsonMode: true,
    });

    let cleaned = aiResult.text.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');

    const db = prisma as any;
    const parsed = JSON.parse(cleaned);
    const validated = ResearchBriefSchema.parse(parsed);

    // Live validation pass: Check actual reachable HTTP status and authoritative domain
    const verifiedClaims = await Promise.all(
      (validated.verifiedClaims || []).map(async (claim) => {
        const check = await validateAuthoritativeSource(claim.sourceUrl);
        return {
          ...claim,
          verified: check.verified,
        };
      })
    );

    const validatedResult: ResearchBriefResult = {
      ...validated,
      verifiedClaims,
    };

    const saved = await db.aiResearchBrief.create({
      data: {
        topicId: topicId || null,
        proposedTitle: validatedResult.proposedTitle,
        readerIntent: validatedResult.readerIntent,
        targetAudience: validatedResult.targetAudience,
        primaryQuestions: validatedResult.primaryQuestions,
        verifiedClaims: validatedResult.verifiedClaims as any,
        documentationUrls: validatedResult.documentationUrls,
        sourceCitations: validatedResult.sourceCitations as any,
        potentialConflicts: validatedResult.potentialConflicts || null,
        suggestedOutline: validatedResult.suggestedOutline as any,
        status: 'READY',
      },
    });

    if (topicId) {
      await db.aiTopicOpportunity.update({
        where: { id: topicId },
        data: { status: 'IN_RESEARCH' },
      }).catch(() => {});
    }

    return { id: saved.id, ...validatedResult, topicId };
  } catch (err) {
    console.warn('Research brief generation fallback used:', err);

    const fallbackCandidate = {
      claim: `Official guidance recommends partition pruning and direct lake caching for high-volume analytics workloads.`,
      sourceUrl: 'https://learn.microsoft.com/en-us/fabric/',
      sourceTitle: 'Microsoft Fabric Documentation',
    };
    const checkFallback = await validateAuthoritativeSource(fallbackCandidate.sourceUrl);

    const fallback: ResearchBriefResult = {
      proposedTitle: `${topic}: Practical Implementation Guide`,
      readerIntent: `Learn how to configure and deploy ${topic} in production environments`,
      targetAudience: 'Data Engineers, Power BI Administrators, and BI Developers',
      primaryQuestions: [
        `What are the core prerequisites for ${topic}?`,
        `How does ${topic} integrate with existing data pipelines?`,
        `What are the common performance pitfalls and mitigation strategies?`,
      ],
      verifiedClaims: [
        {
          ...fallbackCandidate,
          verified: checkFallback.verified,
        },
      ],
      documentationUrls: ['https://learn.microsoft.com/en-us/fabric/'],
      sourceCitations: [
        {
          url: 'https://learn.microsoft.com/en-us/fabric/',
          title: 'Microsoft Technical Documentation',
          retrievedAt: new Date().toISOString(),
        },
      ],
      potentialConflicts: null,
      suggestedOutline: [
        {
          heading: 'Executive Overview & Architectural Context',
          level: 'H2',
          summary: 'High-level introduction to the technology and its enterprise role.',
          keyPoints: ['Core capabilities', 'Comparison with legacy approaches'],
        },
        {
          heading: 'Step-by-Step Configuration & Implementation',
          level: 'H2',
          summary: 'Practical setup instructions with code or configuration parameters.',
          keyPoints: ['Initial setup', 'Workspace configuration', 'Security baseline'],
        },
        {
          heading: 'Production Performance Tuning & Best Practices',
          level: 'H2',
          summary: 'Real-world benchmarks and optimization techniques.',
          keyPoints: ['Query tuning', 'Monitoring alerts', 'Cost optimization'],
        },
      ],
    };

    const saved = await (prisma as any).aiResearchBrief.create({
      data: {
        topicId: topicId || null,
        proposedTitle: fallback.proposedTitle,
        readerIntent: fallback.readerIntent,
        targetAudience: fallback.targetAudience,
        primaryQuestions: fallback.primaryQuestions,
        verifiedClaims: fallback.verifiedClaims as any,
        documentationUrls: fallback.documentationUrls,
        sourceCitations: fallback.sourceCitations as any,
        potentialConflicts: fallback.potentialConflicts,
        suggestedOutline: fallback.suggestedOutline as any,
        status: 'READY',
      },
    }).catch(() => ({ id: 'fallback-brief-id' }));

    return { id: (saved as any).id, ...fallback, topicId };
  }
}
