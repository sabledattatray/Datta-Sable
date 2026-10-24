import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { timingSafeEqual } from 'node:crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ensureAiStudioSchema } from '@/lib/ai/schema';
import { discoverTopicOpportunities } from '@/lib/ai/topic-discovery';
import { createResearchBrief } from '@/lib/ai/research-engine';
import { generateArticleDraft } from '@/lib/ai/article-writer';
import { detectDuplicateContent } from '@/lib/ai/duplicate-detector';
import { generateSeoIntelligence } from '@/lib/ai/seo-intelligence';
import { approveAndPublishDraft, scheduleDraftForPublishing } from '@/lib/ai/publishing';
import { submitUrlToGoogleIndexing, inspectUrlInGoogleSearchConsole, submitSitemapToGoogleSearchConsole } from '@/lib/ai/google-indexing';
import { AI_SETTING_KEYS } from '@/lib/ai/config';
import { logAiAudit } from '@/lib/ai/audit';

export const maxDuration = 120;

const MCP_TOOLS = [
  // Research Tools
  {
    name: 'discover_topics',
    description: 'Discovers high-potential technical blog topic opportunities with demand and gap scoring.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Technical category (e.g., "Microsoft Fabric", "Power BI", "SQL Server")' },
        limit: { type: 'number', description: 'Number of topics to discover (default: 5)' },
      },
    },
  },
  {
    name: 'create_research_brief',
    description: 'Generates a verified, factual research brief citing official documentation links.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: { type: 'string', description: 'Topic title' },
        category: { type: 'string', description: 'Technical category' },
        topicId: { type: 'string', description: 'Optional ID of existing topic opportunity' },
      },
      required: ['topic', 'category'],
    },
  },
  // Content & SEO Tools
  {
    name: 'generate_article_draft',
    description: 'Drafts an in-depth technical article with SEO metadata, duplicate checking, and quality evaluation.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: { type: 'string', description: 'Article topic' },
        category: { type: 'string', description: 'Category' },
        briefId: { type: 'string', description: 'Optional research brief ID' },
        tier: { type: 'string', enum: ['STANDARD', 'COMPREHENSIVE', 'DEEP_TECHNICAL'], description: 'Word count target tier' },
        operatingMode: { type: 'string', enum: ['MANUAL', 'ASSISTED', 'AUTONOMOUS'], description: 'Publishing workflow mode' },
        targetKeywords: { type: 'array', items: { type: 'string' }, description: 'Optional list of custom target SEO keywords to prioritize' },
        featuredImage: { type: 'string', description: 'Optional URL or path to featured cover image' },
      },
      required: ['topic', 'category'],
    },
  },
  {
    name: 'detect_duplicate_article',
    description: 'Checks a proposed title and slug against published posts and drafts to detect cannibalization risks.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Proposed title' },
        slug: { type: 'string', description: 'Proposed slug' },
        category: { type: 'string', description: 'Category' },
      },
      required: ['title', 'slug'],
    },
  },
  {
    name: 'generate_seo_metadata',
    description: 'Generates SEO title, meta description, Schema.org JSON-LD, and contextual internal link suggestions.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Article title' },
        slug: { type: 'string', description: 'Slug' },
        category: { type: 'string', description: 'Category' },
        content: { type: 'string', description: 'Markdown content' },
        excerpt: { type: 'string', description: 'Excerpt' },
      },
      required: ['title', 'slug', 'category', 'content', 'excerpt'],
    },
  },
  // CMS Tools
  {
    name: 'list_articles',
    description: 'Lists published articles and drafts from the CMS.',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['PUBLISHED', 'DRAFT', 'ALL'], description: 'Filter by status' },
        limit: { type: 'number', description: 'Max items to return' },
      },
    },
  },
  {
    name: 'get_article',
    description: 'Retrieves full details of a published article or AI draft by slug or ID.',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Post or draft slug' },
      },
      required: ['slug'],
    },
  },
  {
    name: 'list_pending_approvals',
    description: 'Lists all AI content drafts currently waiting for administrator review and publication approval.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'schedule_approved_article',
    description: 'Schedules an approved draft for future automated publication.',
    inputSchema: {
      type: 'object',
      properties: {
        draftId: { type: 'string', description: 'ID of the draft' },
        scheduledTime: { type: 'string', description: 'ISO 8601 date string' },
      },
      required: ['draftId', 'scheduledTime'],
    },
  },
  {
    name: 'publish_approved_article',
    description: 'Promotes an approved AI draft to the production Post table and revalidates public routes.',
    inputSchema: {
      type: 'object',
      properties: {
        draftId: { type: 'string', description: 'ID of the approved draft' },
      },
      required: ['draftId'],
    },
  },
  {
    name: 'request_google_indexing',
    description: 'Submits a published URL directly to the Google Indexing API to request rapid crawling and indexation.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Full URL to submit for indexing' },
      },
      required: ['url'],
    },
  },
  {
    name: 'inspect_google_search_console_url',
    description: 'Queries the Google Search Console URL Inspection API to check live indexing, crawl status, and mobile coverage verdict.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Full URL to inspect in Google Search Console' },
      },
      required: ['url'],
    },
  },
  {
    name: 'update_and_submit_sitemap',
    description: 'Revalidates the dynamic sitemap cache and notifies Google Search Console via the Sitemaps API to crawl all published blog posts.',
    inputSchema: {
      type: 'object',
      properties: {
        sitemapUrl: { type: 'string', description: 'Optional sitemap URL (defaults to https://dattasable.com/sitemap.xml)' },
      },
    },
  },
  // Operations & Status Tools
  {
    name: 'get_automation_status',
    description: 'Returns the current AI Studio operating mode, monthly spend, budget limits, and emergency pause status.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'pause_automation',
    description: 'Emergency switch to pause or resume all automated AI generation and scheduled publishing.',
    inputSchema: {
      type: 'object',
      properties: {
        paused: { type: 'boolean', description: 'True to pause, False to resume' },
      },
      required: ['paused'],
    },
  },
  {
    name: 'get_execution_logs',
    description: 'Fetches recent AI generation telemetry, token usage, and audit logs.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Number of log items' },
      },
    },
  },
];

// Security & Permission Configuration
const ADMIN_MUTATION_TOOLS = new Set([
  'publish_approved_article',
  'schedule_approved_article',
  'pause_automation',
  'update_and_submit_sitemap',
]);

const GENERATIVE_TOOLS = new Set([
  'discover_topics',
  'create_research_brief',
  'generate_article_draft',
  'detect_duplicate_article',
  'generate_seo_metadata',
]);

// Rate limiter: 30 requests per 60 seconds per client
const mcpRateLimitCache = new Map<string, { count: number; resetAt: number }>();

function checkMcpRateLimit(clientKey: string, limit = 30, windowMs = 60_000): boolean {
  const now = Date.now();
  // Occasional pruning
  if (mcpRateLimitCache.size > 2000) {
    for (const [k, v] of mcpRateLimitCache.entries()) {
      if (now > v.resetAt) mcpRateLimitCache.delete(k);
    }
  }

  const record = mcpRateLimitCache.get(clientKey);
  if (!record || now > record.resetAt) {
    mcpRateLimitCache.set(clientKey, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= limit) {
    return false;
  }
  record.count++;
  return true;
}

export interface McpAuthResult {
  authenticated: boolean;
  isAdmin: boolean;
  role: 'ADMIN' | 'READONLY';
  source: 'BEARER_TOKEN' | 'SESSION';
  errorReason?: string;
}

async function authenticateMcpRequest(req: Request): Promise<McpAuthResult> {
  const authHeader = req.headers.get('authorization') || '';
  const cronSecret = process.env.CRON_SECRET;
  const mcpApiKey = process.env.MCP_API_KEY || (process.env.NODE_ENV !== 'production' ? 'datta_mcp_dev_secret' : '');
  const mcpReadOnlyKey = process.env.MCP_READ_KEY;

  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();

    // 1. Explicitly reject CRON_SECRET if passed to MCP (Cross-credential segregation)
    if (cronSecret && cronSecret !== mcpApiKey) {
      const a = Buffer.from(token);
      const b = Buffer.from(cronSecret);
      if (a.length === b.length && timingSafeEqual(a, b)) {
        return {
          authenticated: false,
          isAdmin: false,
          role: 'READONLY',
          source: 'BEARER_TOKEN',
          errorReason: 'CRON_SECRET cannot be used to authenticate MCP tools. Use MCP_API_KEY.',
        };
      }
    }

    // 2. Check Read-Only API Key (Least Privilege)
    if (mcpReadOnlyKey) {
      const a = Buffer.from(token);
      const b = Buffer.from(mcpReadOnlyKey);
      if (a.length === b.length && timingSafeEqual(a, b)) {
        return { authenticated: true, isAdmin: false, role: 'READONLY', source: 'BEARER_TOKEN' };
      }
    }

    // 3. Check Admin / Standard MCP_API_KEY
    if (mcpApiKey) {
      const a = Buffer.from(token);
      const b = Buffer.from(mcpApiKey);
      if (a.length === b.length && timingSafeEqual(a, b)) {
        return { authenticated: true, isAdmin: true, role: 'ADMIN', source: 'BEARER_TOKEN' };
      }
    }
  }

  // 4. Fallback to active admin NextAuth session
  try {
    const session = await getServerSession(authOptions);
    if (session && (session.user as any)?.role === 'ADMIN') {
      return { authenticated: true, isAdmin: true, role: 'ADMIN', source: 'SESSION' };
    }
  } catch {}

  return { authenticated: false, isAdmin: false, role: 'READONLY', source: 'BEARER_TOKEN' };
}

export async function POST(req: Request) {
  // Rate limiting by IP or authorization header
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                   req.headers.get('x-real-ip') ||
                   'unknown-client';
  const rateLimitAllowed = checkMcpRateLimit(clientIp, 30, 60_000);
  if (!rateLimitAllowed) {
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        error: {
          code: -32029,
          message: 'Rate limit exceeded for MCP endpoint. Maximum 30 requests per minute.',
        },
      },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  const auth = await authenticateMcpRequest(req);
  if (!auth.authenticated) {
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: auth.errorReason || 'Unauthorized. Valid Bearer MCP_API_KEY or admin session required.',
        },
      },
      { status: 401 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { jsonrpc: '2.0', error: { code: -32700, message: 'Parse error: invalid JSON' } },
      { status: 400 }
    );
  }

  if (!body || typeof body !== 'object' || Array.isArray(body) || typeof body.method !== 'string' ||
      (body.params !== undefined && (!body.params || typeof body.params !== 'object' || Array.isArray(body.params)))) {
    return NextResponse.json(
      { jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid JSON-RPC request' } },
      { status: 400 }
    );
  }

  const { id = 1, method, params } = body;

  try {
    // 1. Initialize Handshake
    if (method === 'initialize') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: { listChanged: false },
          },
          serverInfo: {
            name: 'datta-sable-ai-content-mcp',
            version: '2.0.0',
          },
        },
      });
    }

    // 2. Tools List
    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: { tools: MCP_TOOLS },
      });
    }

    // 3. Tools Call
    if (method === 'tools/call') {
      const toolName = params?.name;
      const args = params?.arguments || {};

      // Least-privilege Authorization checks
      if (ADMIN_MUTATION_TOOLS.has(toolName) && !auth.isAdmin) {
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          error: {
            code: -32001,
            message: `Forbidden: Administrator privileges required for tool "${toolName}".`,
          },
        }, { status: 403 });
      }

      if (GENERATIVE_TOOLS.has(toolName) && auth.role === 'READONLY') {
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          error: {
            code: -32001,
            message: `Forbidden: Tool "${toolName}" requires generation or administrative clearance.`,
          },
        }, { status: 403 });
      }

      let responseData: any;

      await ensureAiStudioSchema();

      switch (toolName) {
        case 'discover_topics':
          responseData = await discoverTopicOpportunities({
            category: args.category,
            limit: Number(args.limit) || 5,
          });
          break;

        case 'create_research_brief':
          responseData = await createResearchBrief({
            topic: args.topic,
            category: args.category,
            topicId: args.topicId,
          });
          break;

        case 'generate_article_draft':
          responseData = await generateArticleDraft({
            topic: args.topic,
            category: args.category,
            briefId: args.briefId,
            tier: args.tier || 'COMPREHENSIVE',
            operatingMode: args.operatingMode || 'ASSISTED',
            targetKeywords: Array.isArray(args.targetKeywords) ? args.targetKeywords : undefined,
            featuredImage: args.featuredImage || undefined,
          });
          break;

        case 'detect_duplicate_article':
          responseData = await detectDuplicateContent({
            title: args.title,
            slug: args.slug,
            category: args.category,
          });
          break;

        case 'generate_seo_metadata':
          responseData = await generateSeoIntelligence({
            title: args.title,
            slug: args.slug,
            category: args.category,
            content: args.content,
            excerpt: args.excerpt,
          });
          break;

        case 'list_articles': {
          const filterStatus = args.status || 'ALL';
          const limit = Number(args.limit) || 20;

          const [posts, drafts] = await Promise.all([
            filterStatus !== 'DRAFT'
              ? prisma.post.findMany({ take: limit, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, slug: true, category: true, published: true, createdAt: true } })
              : [],
            filterStatus !== 'PUBLISHED'
              ? prisma.aiContentDraft.findMany({ take: limit, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, slug: true, category: true, status: true, qualityScore: true, createdAt: true } })
              : [],
          ]);
          responseData = { posts, drafts };
          break;
        }

        case 'get_article': {
          const post = await prisma.post.findUnique({ where: { slug: args.slug } });
          const draft = post ? null : await prisma.aiContentDraft.findUnique({ where: { slug: args.slug } });
          responseData = post || draft || { error: 'Article not found' };
          break;
        }

        case 'list_pending_approvals':
          responseData = await prisma.aiContentDraft.findMany({
            where: { status: { in: ['DRAFT', 'UNDER_REVIEW'] } },
            orderBy: { createdAt: 'desc' },
            include: { qualityReports: { take: 1, orderBy: { checkedAt: 'desc' } } },
          });
          break;

        case 'schedule_approved_article':
          responseData = await scheduleDraftForPublishing({
            draftId: args.draftId,
            scheduledTime: new Date(args.scheduledTime),
          });
          break;

        case 'publish_approved_article':
          responseData = await approveAndPublishDraft({
            draftId: args.draftId,
            publishImmediately: true,
          });
          break;

        case 'request_google_indexing':
          responseData = await submitUrlToGoogleIndexing(args.url);
          break;

        case 'inspect_google_search_console_url':
          responseData = await inspectUrlInGoogleSearchConsole(args.url);
          break;

        case 'update_and_submit_sitemap': {
          try {
            revalidatePath('/sitemap.xml');
          } catch (revalErr) {
            console.warn('Revalidate /sitemap.xml warning:', revalErr);
          }
          responseData = await submitSitemapToGoogleSearchConsole(
            args.sitemapUrl || 'https://dattasable.com/sitemap.xml'
          );
          break;
        }

        case 'get_automation_status': {
          const now = new Date();
          const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

          const [pauseSetting, budgetSetting, usageAgg, pendingCount, publishedMonthCount] = await Promise.all([
            prisma.systemSetting.findUnique({ where: { key: AI_SETTING_KEYS.EMERGENCY_PAUSE } }),
            prisma.systemSetting.findUnique({ where: { key: AI_SETTING_KEYS.MONTHLY_BUDGET } }),
            prisma.aiProviderUsage.aggregate({
              where: { createdAt: { gte: startOfMonth }, success: true },
              _sum: { estimatedCostUsd: true, totalTokens: true },
            }),
            prisma.aiContentDraft.count({ where: { status: 'DRAFT' } }),
            prisma.aiContentDraft.count({ where: { status: 'PUBLISHED', publishedAt: { gte: startOfMonth } } }),
          ]);

          responseData = {
            emergencyPaused: pauseSetting?.value === 'true',
            monthlyBudgetUsd: budgetSetting ? Number(budgetSetting.value) || 25 : 25,
            currentMonthSpendUsd: usageAgg._sum.estimatedCostUsd || 0,
            currentMonthTokens: usageAgg._sum.totalTokens || 0,
            pendingDrafts: pendingCount,
            publishedThisMonth: publishedMonthCount,
            serverTime: now.toISOString(),
          };
          break;
        }

        case 'pause_automation': {
          await prisma.systemSetting.upsert({
            where: { key: AI_SETTING_KEYS.EMERGENCY_PAUSE },
            create: { key: AI_SETTING_KEYS.EMERGENCY_PAUSE, value: String(args.paused) },
            update: { value: String(args.paused) },
          });

          await logAiAudit({
            action: 'AI_EMERGENCY_PAUSE_TOGGLED',
            details: { paused: args.paused },
          });

          responseData = { success: true, emergencyPaused: args.paused };
          break;
        }

        case 'get_execution_logs': {
          const limit = Number(args.limit) || 25;
          const [usage, audits] = await Promise.all([
            prisma.aiProviderUsage.findMany({ take: limit, orderBy: { createdAt: 'desc' } }),
            prisma.auditLog.findMany({
              where: { action: { startsWith: 'AI_' } },
              take: limit,
              orderBy: { createdAt: 'desc' },
            }),
          ]);
          responseData = { usage, audits };
          break;
        }

        default:
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            error: { code: -32601, message: `Method or tool "${toolName}" not found` },
          });
      }

      await logAiAudit({
        action: 'AI_MCP_TOOL_INVOKED',
        details: { tool: toolName },
      });

      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(responseData, null, 2),
            },
          ],
        },
      });
    }

    return NextResponse.json({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Unsupported method "${method}"` },
    });
  } catch (error: any) {
    console.error('MCP API Execution Error:', error);
    return NextResponse.json({
      jsonrpc: '2.0',
      id,
      error: {
        code: -32000,
        message: 'MCP operation temporarily unavailable. Please retry later.',
      },
    });
  }
}

export async function GET(req: Request) {
  const auth = await authenticateMcpRequest(req);
  return NextResponse.json({
    status: 'ACTIVE',
    server: 'Datta Sable AI Content Automation MCP Server',
    version: '2.0.0',
    authenticated: auth.authenticated,
    role: auth.role,
    endpoints: {
      post: '/api/mcp (JSON-RPC 2.0 tools/list, tools/call)',
    },
    toolsCount: MCP_TOOLS.length,
    tools: MCP_TOOLS.map(t => ({ name: t.name, description: t.description })),
  });
}
