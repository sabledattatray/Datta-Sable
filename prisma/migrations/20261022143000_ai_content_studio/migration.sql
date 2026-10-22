-- AI Content Studio & MCP Automation Additive Migration (PRD v2.0)
-- Safe for zero-downtime application; preserves all existing records.

CREATE TABLE IF NOT EXISTS "AiTopicOpportunity" (
  "id" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "targetAudience" TEXT NOT NULL,
  "searchIntent" TEXT NOT NULL,
  "estimatedDemand" INTEGER NOT NULL DEFAULT 50,
  "competitionScore" INTEGER NOT NULL DEFAULT 50,
  "contentGapScore" INTEGER NOT NULL DEFAULT 50,
  "priorityScore" INTEGER NOT NULL DEFAULT 50,
  "suggestedKeywords" TEXT[] NOT NULL DEFAULT '{}',
  "status" TEXT NOT NULL DEFAULT 'DISCOVERED',
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AiTopicOpportunity_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AiTopicOpportunity_category_idx" ON "AiTopicOpportunity"("category");
CREATE INDEX IF NOT EXISTS "AiTopicOpportunity_priorityScore_idx" ON "AiTopicOpportunity"("priorityScore");
CREATE INDEX IF NOT EXISTS "AiTopicOpportunity_status_idx" ON "AiTopicOpportunity"("status");

CREATE TABLE IF NOT EXISTS "AiResearchBrief" (
  "id" TEXT NOT NULL,
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
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AiResearchBrief_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AiResearchBrief_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "AiTopicOpportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "AiResearchBrief_topicId_idx" ON "AiResearchBrief"("topicId");

CREATE TABLE IF NOT EXISTS "AiContentDraft" (
  "id" TEXT NOT NULL,
  "briefId" TEXT,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "category" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "readTime" TEXT NOT NULL DEFAULT '8 min read',
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
  "scheduledFor" TIMESTAMPTZ(6),
  "publishedAt" TIMESTAMPTZ(6),
  "promotedPostId" TEXT,
  "lastError" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AiContentDraft_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AiContentDraft_briefId_fkey" FOREIGN KEY ("briefId") REFERENCES "AiResearchBrief"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "AiContentDraft_status_scheduledFor_idx" ON "AiContentDraft"("status", "scheduledFor");
CREATE INDEX IF NOT EXISTS "AiContentDraft_category_idx" ON "AiContentDraft"("category");

CREATE TABLE IF NOT EXISTS "AiQualityReport" (
  "id" TEXT NOT NULL,
  "draftId" TEXT NOT NULL,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "factualVerificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
  "duplicateRiskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "duplicateMatches" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "seoChecks" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "readabilityMetrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "blockers" TEXT[] NOT NULL DEFAULT '{}',
  "recommendations" TEXT[] NOT NULL DEFAULT '{}',
  "checkedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AiQualityReport_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AiQualityReport_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "AiContentDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "AiQualityReport_draftId_idx" ON "AiQualityReport"("draftId");

CREATE TABLE IF NOT EXISTS "AiContentVersion" (
  "id" TEXT NOT NULL,
  "draftId" TEXT NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "changedBy" TEXT NOT NULL DEFAULT 'AI',
  "changeNotes" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AiContentVersion_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AiContentVersion_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "AiContentDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "AiContentVersion_draftId_version_idx" ON "AiContentVersion"("draftId", "version");

CREATE TABLE IF NOT EXISTS "AiPublishingSchedule" (
  "id" TEXT NOT NULL,
  "draftId" TEXT NOT NULL UNIQUE,
  "scheduledTime" TIMESTAMPTZ(6) NOT NULL,
  "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
  "mode" TEXT NOT NULL DEFAULT 'ASSISTED',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "publishedPostSlug" TEXT,
  "lastError" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AiPublishingSchedule_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AiPublishingSchedule_status_scheduledTime_idx" ON "AiPublishingSchedule"("status", "scheduledTime");

CREATE TABLE IF NOT EXISTS "AiProviderUsage" (
  "id" TEXT NOT NULL,
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
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AiProviderUsage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AiProviderUsage_createdAt_provider_idx" ON "AiProviderUsage"("createdAt", "provider");
CREATE INDEX IF NOT EXISTS "AiProviderUsage_task_idx" ON "AiProviderUsage"("task");
