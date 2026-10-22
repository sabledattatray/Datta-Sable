import { prisma } from '../prisma';
import { z } from 'zod';

export const AI_STUDIO_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS "AiTopicOpportunity" (
    "id" TEXT PRIMARY KEY,
    "topic" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "targetAudience" TEXT,
    "searchIntent" TEXT NOT NULL DEFAULT 'INFORMATIONAL',
    "opportunityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "searchDemand" TEXT,
    "competition" TEXT,
    "contentGapRationale" TEXT,
    "source" TEXT NOT NULL DEFAULT 'DISCOVERY',
    "status" TEXT NOT NULL DEFAULT 'IDENTIFIED',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS "ai_topic_cat_status" ON "AiTopicOpportunity"("category", "status")`,

  `CREATE TABLE IF NOT EXISTS "AiResearchBrief" (
    "id" TEXT PRIMARY KEY,
    "topicId" TEXT,
    "proposedTitle" TEXT NOT NULL,
    "readerIntent" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "primaryQuestions" TEXT[] NOT NULL DEFAULT '{}',
    "verifiedClaims" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "documentationUrls" TEXT[] NOT NULL DEFAULT '{}',
    "sourceCitations" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "potentialConflicts" TEXT,
    "suggestedOutline" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "status" TEXT NOT NULL DEFAULT 'READY',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS "AiContentDraft" (
    "id" TEXT PRIMARY KEY,
    "briefId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "category" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "blocks" JSONB,
    "readTime" INTEGER NOT NULL DEFAULT 5,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "targetKeywords" TEXT[] NOT NULL DEFAULT '{}',
    "featuredImage" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "jsonLd" JSONB,
    "internalLinks" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "operatingMode" TEXT NOT NULL DEFAULT 'ASSISTED',
    "qualityScore" DOUBLE PRECISION,
    "factualAccuracyScore" DOUBLE PRECISION,
    "seoScore" DOUBLE PRECISION,
    "originalityScore" DOUBLE PRECISION,
    "scheduledFor" TIMESTAMPTZ,
    "publishedAt" TIMESTAMPTZ,
    "promotedPostId" TEXT,
    "lastError" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS "ai_draft_status_sched" ON "AiContentDraft"("status", "scheduledFor")`,
  `CREATE INDEX IF NOT EXISTS "ai_draft_cat" ON "AiContentDraft"("category")`,

  `CREATE TABLE IF NOT EXISTS "AiQualityReport" (
    "id" TEXT PRIMARY KEY,
    "draftId" TEXT NOT NULL REFERENCES "AiContentDraft"("id") ON DELETE CASCADE,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "factualVerificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "duplicateRiskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "duplicateMatches" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "seoChecks" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "readabilityMetrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "blockers" TEXT[] NOT NULL DEFAULT '{}',
    "recommendations" TEXT[] NOT NULL DEFAULT '{}',
    "checkedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS "ai_quality_draft" ON "AiQualityReport"("draftId")`,

  `CREATE TABLE IF NOT EXISTS "AiContentVersion" (
    "id" TEXT PRIMARY KEY,
    "draftId" TEXT NOT NULL REFERENCES "AiContentDraft"("id") ON DELETE CASCADE,
    "version" INTEGER NOT NULL DEFAULT 1,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL DEFAULT 'AI',
    "changeNotes" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS "ai_version_draft" ON "AiContentVersion"("draftId", "version")`,

  `CREATE TABLE IF NOT EXISTS "AiPublishingSchedule" (
    "id" TEXT PRIMARY KEY,
    "draftId" TEXT NOT NULL UNIQUE,
    "scheduledTime" TIMESTAMPTZ NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "mode" TEXT NOT NULL DEFAULT 'ASSISTED',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "publishedPostSlug" TEXT,
    "lastError" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS "ai_sched_status_time" ON "AiPublishingSchedule"("status", "scheduledTime")`,

  `CREATE TABLE IF NOT EXISTS "AiProviderUsage" (
    "id" TEXT PRIMARY KEY,
    "provider" TEXT NOT NULL DEFAULT 'GEMINI',
    "model" TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
    "task" TEXT NOT NULL,
    "promptTokens" INTEGER NOT NULL DEFAULT 0,
    "completionTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "estimatedCostUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "latencyMs" INTEGER NOT NULL DEFAULT 0,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "draftId" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS "ai_usage_date_provider" ON "AiProviderUsage"("createdAt", "provider")`,
  `CREATE INDEX IF NOT EXISTS "ai_usage_task" ON "AiProviderUsage"("task")`,
];

let schemaReady: Promise<void> | undefined;

export function ensureAiStudioSchema(): Promise<void> {
  return (schemaReady ??= (async () => {
    for (const sql of AI_STUDIO_SCHEMA) {
      await prisma.$executeRawUnsafe(sql);
    }
  })().catch(error => {
    schemaReady = undefined;
    console.error('Failed to initialize AI Studio database schema:', error);
    throw error;
  }));
}

// Zod Validation Schemas
export const VerifiedClaimSchema = z.object({
  claim: z.string().min(5),
  sourceUrl: z.string().url().or(z.string().min(1)),
  sourceTitle: z.string().optional(),
  date: z.string().optional(),
  verified: z.boolean().default(true),
});

export const ResearchBriefSchema = z.object({
  proposedTitle: z.string().min(5).max(180),
  readerIntent: z.string().min(3),
  targetAudience: z.string().min(3),
  primaryQuestions: z.array(z.string()).min(1),
  verifiedClaims: z.array(VerifiedClaimSchema).default([]),
  documentationUrls: z.array(z.string()).default([]),
  sourceCitations: z.array(z.object({
    url: z.string(),
    title: z.string(),
    retrievedAt: z.string(),
    author: z.string().optional(),
  })).default([]),
  potentialConflicts: z.string().nullable().optional(),
  suggestedOutline: z.array(z.object({
    heading: z.string(),
    level: z.enum(['H2', 'H3']),
    summary: z.string(),
    keyPoints: z.array(z.string()),
  })).min(1),
});

export const ContentDraftInputSchema = z.object({
  title: z.string().min(5).max(180),
  slug: z.string().min(3).max(150).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  category: z.string().min(2),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(100),
  targetKeywords: z.array(z.string()).default([]),
  operatingMode: z.enum(['MANUAL', 'ASSISTED', 'AUTONOMOUS']).default('ASSISTED'),
  featuredImage: z.string().optional(),
});
