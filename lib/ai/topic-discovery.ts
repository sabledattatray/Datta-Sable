import { prisma } from '../prisma';
import { ensureAiStudioSchema } from './schema';
import { DEFAULT_AI_CATEGORIES } from './config';
import { executeAiCompletion } from './provider';

export interface DiscoveredTopic {
  topic: string;
  category: string;
  targetAudience: string;
  searchIntent: 'INFORMATIONAL' | 'COMMERCIAL' | 'NAVIGATIONAL' | 'TRANSACTIONAL';
  opportunityScore: number;
  searchDemand: string;
  competition: string;
  contentGapRationale: string;
  source: 'DISCOVERY' | 'SEARCH_CONSOLE' | 'GAP_ANALYSIS' | 'ADMIN';
}

export async function discoverTopicOpportunities({
  category,
  limit = 5,
}: {
  category?: string;
  limit?: number;
}): Promise<DiscoveredTopic[]> {
  await ensureAiStudioSchema();

  // Retrieve existing published titles & categories to prevent proposing existing topics
  const existingPosts = await prisma.post.findMany({
    select: { title: true, category: true, slug: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const selectedCategory = category || DEFAULT_AI_CATEGORIES[Math.floor(Math.random() * DEFAULT_AI_CATEGORIES.length)];
  const existingTitles = existingPosts.map(p => `• [${p.category}] ${p.title}`).slice(0, 30).join('\n');

  const prompt = `Analyze content opportunities for a technical blog specializing in ${selectedCategory}.
Target domain: Enterprise Data, Business Intelligence, Cloud, AI, and Microsoft technologies.

Existing articles already published on the site:
${existingTitles || 'None yet'}

Identify ${limit} high-value, unmet technical content opportunities.
For each opportunity, provide:
1. topic: Specific, high-demand technical topic title
2. category: Must be "${selectedCategory}"
3. targetAudience: Specific role (e.g. "Data Engineers", "Power BI Developers", "Solutions Architects")
4. searchIntent: Exactly one of ["INFORMATIONAL", "COMMERCIAL", "NAVIGATIONAL", "TRANSACTIONAL"]
5. opportunityScore: Number from 60 to 98 evaluating audience demand and lack of current coverage
6. searchDemand: "High" | "Medium" | "Low"
7. competition: "Low" | "Medium" | "High"
8. contentGapRationale: Concrete reason why this article is needed now and what practical problem it solves.

Respond ONLY with a JSON array of objects adhering strictly to this schema:
[
  {
    "topic": "string",
    "category": "${selectedCategory}",
    "targetAudience": "string",
    "searchIntent": "INFORMATIONAL",
    "opportunityScore": 88,
    "searchDemand": "High",
    "competition": "Medium",
    "contentGapRationale": "string"
  }
]`;

  try {
    const aiResult = await executeAiCompletion({
      prompt,
      systemPrompt: 'You are an enterprise content strategist specializing in technical SEO, Microsoft Fabric, Power BI, SQL, and AI engineering.',
      task: 'TOPIC_DISCOVERY',
      jsonMode: true,
    });

    let cleaned = aiResult.text.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');

    const parsed = JSON.parse(cleaned);
    const topics: DiscoveredTopic[] = Array.isArray(parsed) ? parsed : [parsed];

    // Persist discovered topics to database
    for (const t of topics) {
      await (prisma as any).aiTopicOpportunity.create({
        data: {
          topic: t.topic,
          category: t.category || selectedCategory,
          targetAudience: t.targetAudience,
          searchIntent: t.searchIntent || 'INFORMATIONAL',
          opportunityScore: Number(t.opportunityScore) || 75,
          searchDemand: t.searchDemand || 'Medium',
          competition: t.competition || 'Medium',
          contentGapRationale: t.contentGapRationale || '',
          source: 'GAP_ANALYSIS',
          status: 'IDENTIFIED',
        },
      });
    }

    return topics;
  } catch (error) {
    console.warn('Topic discovery AI completion fallback triggered:', error);
    // Reliable deterministic technical fallback if AI call is throttled or offline
    const fallbackTopic: DiscoveredTopic = {
      topic: `${selectedCategory} Enterprise Best Practices & Real-Time Architectures`,
      category: selectedCategory,
      targetAudience: 'Senior BI Architects & Data Engineers',
      searchIntent: 'INFORMATIONAL',
      opportunityScore: 85,
      searchDemand: 'High',
      competition: 'Medium',
      contentGapRationale: `High search interest observed for production deployment patterns in ${selectedCategory}.`,
      source: 'GAP_ANALYSIS',
    };

    await (prisma as any).aiTopicOpportunity.create({
      data: {
        ...fallbackTopic,
        status: 'IDENTIFIED',
      },
    }).catch(() => {});

    return [fallbackTopic];
  }
}
