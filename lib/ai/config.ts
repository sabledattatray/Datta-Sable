export const DEFAULT_AI_CATEGORIES = [
  'Power BI',
  'Microsoft Fabric',
  'Advanced Excel',
  'SQL Server',
  'Data Analytics',
  'Business Intelligence',
  'AI and Automation',
  'Cloud Computing',
  'Cybersecurity',
  'Professional Certifications',
  'Data Engineering',
  'Career Development',
] as const;

export type AiCategory = (typeof DEFAULT_AI_CATEGORIES)[number] | string;

export const OPERATING_MODES = {
  MANUAL: 'MANUAL',       // Mode A: Admin manually starts every workflow
  ASSISTED: 'ASSISTED',   // Mode B (Default & Sole Mode): Auto-research & draft, human review & approve
  AUTONOMOUS: 'AUTONOMOUS', // Mode C: Autonomous publishing (Permanently disabled in publisher)
} as const;

export type OperatingMode = keyof typeof OPERATING_MODES;

export const ARTICLE_LENGTH_TARGETS = {
  STANDARD: { min: 1000, target: 1500, max: 1800, label: 'Standard (1,000–1,800 words)' },
  COMPREHENSIVE: { min: 1800, target: 2400, max: 3000, label: 'Comprehensive (1,800–3,000 words)' },
  DEEP_TECHNICAL: { min: 3000, target: 3500, max: 5000, label: 'Deep Technical (3,000+ words)' },
} as const;

export type ArticleLengthTier = keyof typeof ARTICLE_LENGTH_TARGETS;

export const DEFAULT_AI_SETTINGS = {
  timezone: 'Asia/Kolkata',
  operatingMode: OPERATING_MODES.ASSISTED as OperatingMode,
  defaultArticleTier: 'COMPREHENSIVE' as ArticleLengthTier,
  maxDailyDrafts: 1,
  maxDailyAutonomousPublishes: 0, // Autonomous publishing permanently disabled
  monthlyBudgetUsd: 25.00,
  hardBudgetCapUsd: 50.00,
  emergencyPause: false,
  primaryProvider: 'GEMINI',
  primaryModel: 'gemini-2.5-flash',
  researchModel: 'gemini-2.5-flash',
  draftingModel: 'gemini-2.5-flash',
  qualityMinScore: 75,
  duplicateMaxSimilarityPercent: 30,
};

export const AI_SETTING_KEYS = {
  MODE: 'ai_studio_operating_mode',
  MONTHLY_BUDGET: 'ai_studio_monthly_budget',
  EMERGENCY_PAUSE: 'ai_studio_emergency_pause',
  SETTINGS_JSON: 'ai_studio_settings_v1',
} as const;
