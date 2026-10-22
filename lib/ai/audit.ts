import { prisma } from '../prisma';

export type AiAuditAction =
  | 'AI_TOPIC_DISCOVERED'
  | 'AI_RESEARCH_CREATED'
  | 'AI_DRAFT_GENERATED'
  | 'AI_DRAFT_UPDATED'
  | 'AI_QUALITY_EVALUATED'
  | 'AI_ARTICLE_APPROVED'
  | 'AI_ARTICLE_PUBLISHED'
  | 'AI_ARTICLE_REJECTED'
  | 'AI_ARTICLE_SCHEDULED'
  | 'AI_BUDGET_UPDATED'
  | 'AI_EMERGENCY_PAUSE_TOGGLED'
  | 'AI_MCP_TOOL_INVOKED';

export async function logAiAudit({
  action,
  status = 'SUCCESS',
  details,
  userId,
  ipAddress = 'system',
}: {
  action: AiAuditAction;
  status?: 'SUCCESS' | 'FAILURE';
  details?: Record<string, any> | string;
  userId?: string;
  ipAddress?: string;
}) {
  try {
    const detailString = typeof details === 'string' ? details : JSON.stringify(details || {});
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        status,
        details: detailString,
        ipAddress,
        userAgent: 'AI-Content-Studio/2.0',
      },
    });
  } catch (err) {
    console.error('Failed to write AI audit log:', err);
  }
}
