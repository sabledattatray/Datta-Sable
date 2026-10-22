import { prisma } from '../prisma';
import { ensureAiStudioSchema } from './schema';
import { DEFAULT_AI_SETTINGS, AI_SETTING_KEYS } from './config';

export class AiBudgetExceededError extends Error {
  constructor(message = 'AI monthly budget cap exceeded. Autonomous calls are suspended.') {
    super(message);
    this.name = 'AiBudgetExceededError';
  }
}

export class AiEmergencyPauseError extends Error {
  constructor(message = 'AI automation is currently paused by administrator emergency control.') {
    super(message);
    this.name = 'AiEmergencyPauseError';
  }
}

export interface ModelPricing {
  promptCostPerMillion: number;
  completionCostPerMillion: number;
}

export const MODEL_PRICING: Record<string, ModelPricing> = {
  'gemini-2.5-flash': { promptCostPerMillion: 0.075, completionCostPerMillion: 0.30 },
  'gemini-1.5-flash': { promptCostPerMillion: 0.075, completionCostPerMillion: 0.30 },
  'gemini-1.5-pro': { promptCostPerMillion: 1.25, completionCostPerMillion: 5.00 },
  'gpt-4o-mini': { promptCostPerMillion: 0.15, completionCostPerMillion: 0.60 },
  'mock-model': { promptCostPerMillion: 0, completionCostPerMillion: 0 },
};

export function estimateTokenCost(model: string, promptTokens: number, completionTokens: number): number {
  const pricing = MODEL_PRICING[model] || MODEL_PRICING['gemini-2.5-flash'];
  const promptCost = (promptTokens / 1_000_000) * pricing.promptCostPerMillion;
  const completionCost = (completionTokens / 1_000_000) * pricing.completionCostPerMillion;
  return Number((promptCost + completionCost).toFixed(6));
}

export function estimateTaskReservationCost(task: string, model: string): number {
  switch (task) {
    case 'ARTICLE_DRAFT':
    case 'ARTICLE_WRITER':
      return 0.08;
    case 'RESEARCH_BRIEF':
      return 0.03;
    case 'SEO_INTELLIGENCE':
    case 'TOPIC_DISCOVERY':
      return 0.02;
    default:
      return 0.04;
  }
}

export async function reserveAiBudget({
  task,
  model,
  provider,
  draftId,
}: {
  task: string;
  model: string;
  provider: string;
  draftId?: string;
}): Promise<{ reservationId: string; reservedAmountUsd: number; currentMonthSpend: number; monthlyBudget: number }> {
  await ensureAiStudioSchema();

  const reservationCost = estimateTaskReservationCost(task, model);
  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  // Execute atomic reservation within database transaction
  const result = await prisma.$transaction(async (tx) => {
    // 1. Check emergency pause flag
    const pauseSetting = await tx.systemSetting.findUnique({
      where: { key: AI_SETTING_KEYS.EMERGENCY_PAUSE },
    });
    if (pauseSetting?.value === 'true') {
      throw new AiEmergencyPauseError();
    }

    // 2. Fetch configured monthly budget
    const budgetSetting = await tx.systemSetting.findUnique({
      where: { key: AI_SETTING_KEYS.MONTHLY_BUDGET },
    });
    const monthlyBudget = budgetSetting
      ? Number(budgetSetting.value) || DEFAULT_AI_SETTINGS.monthlyBudgetUsd
      : DEFAULT_AI_SETTINGS.monthlyBudgetUsd;

    // 3. Aggregate settled spend (completed successful requests this calendar month)
    const completedAgg = await (tx as any).aiProviderUsage.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
        success: true,
      },
      _sum: {
        estimatedCostUsd: true,
      },
    });

    // 4. Aggregate active in-flight reservations (pending requests from last 10 minutes)
    const pendingAgg = await (tx as any).aiProviderUsage.aggregate({
      where: {
        createdAt: { gte: tenMinutesAgo },
        success: false,
        errorMessage: 'BUDGET_RESERVATION_ACTIVE',
      },
      _sum: {
        estimatedCostUsd: true,
      },
    });

    const settledSpend = completedAgg._sum.estimatedCostUsd || 0;
    const pendingReservations = pendingAgg._sum.estimatedCostUsd || 0;
    const totalCommitted = settledSpend + pendingReservations;

    // 5. Enforce budget limit under concurrency
    if (totalCommitted + reservationCost > monthlyBudget) {
      throw new AiBudgetExceededError(
        `Current committed monthly AI spend ($${totalCommitted.toFixed(2)}) + reservation ($${reservationCost.toFixed(2)}) exceeds monthly limit ($${monthlyBudget.toFixed(2)}).`
      );
    }

    // 6. Atomically reserve slot
    const reservation = await (tx as any).aiProviderUsage.create({
      data: {
        provider,
        model,
        task,
        estimatedCostUsd: reservationCost,
        success: false,
        errorMessage: 'BUDGET_RESERVATION_ACTIVE',
        draftId: draftId || null,
      },
    });

    return {
      reservationId: reservation.id,
      reservedAmountUsd: reservationCost,
      currentMonthSpend: totalCommitted,
      monthlyBudget,
    };
  });

  return result;
}

export async function reconcileAiBudget({
  reservationId,
  actualCostUsd,
  promptTokens = 0,
  completionTokens = 0,
  totalTokens = 0,
  latencyMs = 0,
  success,
  errorMessage,
}: {
  reservationId: string;
  actualCostUsd: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  latencyMs?: number;
  success: boolean;
  errorMessage?: string;
}) {
  try {
    await (prisma as any).aiProviderUsage.update({
      where: { id: reservationId },
      data: {
        promptTokens,
        completionTokens,
        totalTokens,
        estimatedCostUsd: success ? actualCostUsd : 0, // Zero out if failed to release reservation
        latencyMs,
        success,
        errorMessage: errorMessage || null,
      },
    });
  } catch (err) {
    console.error('Failed to reconcile AI budget reservation:', reservationId, err);
  }
}

export async function checkBudgetGuardrails(): Promise<{ allowed: boolean; currentMonthSpend: number; monthlyBudget: number }> {
  await ensureAiStudioSchema();

  const pauseSetting = await prisma.systemSetting.findUnique({
    where: { key: AI_SETTING_KEYS.EMERGENCY_PAUSE },
  });
  if (pauseSetting?.value === 'true') {
    throw new AiEmergencyPauseError();
  }

  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const [completedAgg, pendingAgg, budgetSetting] = await Promise.all([
    (prisma as any).aiProviderUsage.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
        success: true,
      },
      _sum: {
        estimatedCostUsd: true,
      },
    }),
    (prisma as any).aiProviderUsage.aggregate({
      where: {
        createdAt: { gte: tenMinutesAgo },
        success: false,
        errorMessage: 'BUDGET_RESERVATION_ACTIVE',
      },
      _sum: {
        estimatedCostUsd: true,
      },
    }),
    prisma.systemSetting.findUnique({
      where: { key: AI_SETTING_KEYS.MONTHLY_BUDGET },
    }),
  ]);

  const settledSpend = completedAgg._sum.estimatedCostUsd || 0;
  const pendingReservations = pendingAgg._sum.estimatedCostUsd || 0;
  const currentMonthSpend = settledSpend + pendingReservations;
  const monthlyBudget = budgetSetting ? Number(budgetSetting.value) || DEFAULT_AI_SETTINGS.monthlyBudgetUsd : DEFAULT_AI_SETTINGS.monthlyBudgetUsd;

  if (currentMonthSpend >= monthlyBudget) {
    throw new AiBudgetExceededError(`Current monthly AI spend ($${currentMonthSpend.toFixed(2)}) exceeds configured limit ($${monthlyBudget.toFixed(2)}).`);
  }

  return { allowed: true, currentMonthSpend, monthlyBudget };
}

export interface AiGenerationResult {
  text: string;
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
}

export async function executeAiCompletion({
  prompt,
  systemPrompt,
  task,
  model = 'gemini-2.5-flash',
  draftId,
  jsonMode = false,
}: {
  prompt: string;
  systemPrompt?: string;
  task: string;
  model?: string;
  draftId?: string;
  jsonMode?: boolean;
}): Promise<AiGenerationResult> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const provider = (!apiKey || apiKey === 'mock_fixture_key') ? 'MOCK' : 'GEMINI';

  // 1. Atomic Pre-Flight Budget Reservation
  const reservation = await reserveAiBudget({
    task,
    model,
    provider,
    draftId,
  });

  const startTime = Date.now();

  // 2. Mock Fallback Path
  if (provider === 'MOCK') {
    const latencyMs = Date.now() - startTime;
    const promptTokens = Math.ceil(prompt.length / 4);
    const mockOutput = jsonMode
      ? JSON.stringify({ success: true, result: 'Mock response for development/testing.' })
      : `Mock response for task [${task}]. Content generated with high structural accuracy.`;
    const completionTokens = Math.ceil(mockOutput.length / 4);
    const estimatedCostUsd = estimateTokenCost(model, promptTokens, completionTokens);

    await reconcileAiBudget({
      reservationId: reservation.reservationId,
      actualCostUsd: estimatedCostUsd,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      latencyMs,
      success: true,
    });

    return {
      text: mockOutput,
      provider: 'MOCK',
      model,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      estimatedCostUsd,
      latencyMs,
    };
  }

  // 3. Live Google Gemini API Request
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const requestBody: any = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  };

  if (systemPrompt) {
    requestBody.systemInstruction = {
      parts: [{ text: systemPrompt }],
    };
  }

  if (jsonMode) {
    requestBody.generationConfig = {
      responseMimeType: 'application/json',
    };
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const latencyMs = Date.now() - startTime;

    if (!res.ok) {
      const errorText = await res.text();
      await reconcileAiBudget({
        reservationId: reservation.reservationId,
        actualCostUsd: 0,
        promptTokens: Math.ceil(prompt.length / 4),
        completionTokens: 0,
        totalTokens: Math.ceil(prompt.length / 4),
        latencyMs,
        success: false,
        errorMessage: `Gemini API error (${res.status}): ${errorText.slice(0, 300)}`,
      });
      throw new Error(`Gemini API returned error ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || '';

    const promptTokens = data.usageMetadata?.promptTokenCount || Math.ceil(prompt.length / 4);
    const completionTokens = data.usageMetadata?.candidatesTokenCount || Math.ceil(text.length / 4);
    const totalTokens = data.usageMetadata?.totalTokenCount || (promptTokens + completionTokens);
    const estimatedCostUsd = estimateTokenCost(model, promptTokens, completionTokens);

    await reconcileAiBudget({
      reservationId: reservation.reservationId,
      actualCostUsd: estimatedCostUsd,
      promptTokens,
      completionTokens,
      totalTokens,
      latencyMs,
      success: true,
    });

    return {
      text,
      provider: 'GEMINI',
      model,
      promptTokens,
      completionTokens,
      totalTokens,
      estimatedCostUsd,
      latencyMs,
    };
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    await reconcileAiBudget({
      reservationId: reservation.reservationId,
      actualCostUsd: 0,
      promptTokens: Math.ceil(prompt.length / 4),
      completionTokens: 0,
      totalTokens: Math.ceil(prompt.length / 4),
      latencyMs,
      success: false,
      errorMessage: error?.message || 'Network failure communicating with AI provider',
    });
    throw error;
  }
}
