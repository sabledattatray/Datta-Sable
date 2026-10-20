import { defaultTypography, type TypographyRule, type TypographySettings } from './site-typography';

export const TYPOGRAPHY_DEFAULT_KEY = 'website_typography_default_v1';
export type TypographyTemplateId = 'default' | 'segoe';

export function segoeTypography(): TypographySettings {
  const settings = defaultTypography();
  for (const rule of Object.values(settings.elements)) rule.fontFamily = 'Segoe UI';
  const text = { fontSize: 18, mobileFontSize: 17, fontWeight: 400, lineHeight: 1.75, letterSpacing: 0, darkColor: '#D4D4D8', lightColor: '#27272A' } as const;
  Object.assign(settings.elements.body, text);
  Object.assign(settings.elements.paragraph, text);
  const headings: Record<string, Partial<TypographyRule>> = {
    h1: { fontSize: 48, mobileFontSize: 34, fontWeight: 700, lineHeight: 1.2, letterSpacing: -0.025 },
    h2: { fontSize: 34, mobileFontSize: 28, fontWeight: 600, lineHeight: 1.3, letterSpacing: -0.015 },
    h3: { fontSize: 26, mobileFontSize: 23, fontWeight: 600, lineHeight: 1.35, letterSpacing: -0.01 },
    h4: { fontSize: 22, mobileFontSize: 20, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0 },
    h5: { fontSize: 19, mobileFontSize: 18, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0 },
    h6: { fontSize: 17, mobileFontSize: 16, fontWeight: 600, lineHeight: 1.5, letterSpacing: 0 },
  };
  for (const [id, values] of Object.entries(headings)) {
    Object.assign(settings.elements[id as keyof typeof settings.elements], values, { darkColor: '#FAFAFA', lightColor: '#18181B' });
  }
  Object.assign(settings.elements.button, { fontSize: 14, mobileFontSize: 14, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0 });
  Object.assign(settings.elements.small, { fontSize: 13, mobileFontSize: 13, fontWeight: 400, lineHeight: 1.6, letterSpacing: 0, darkColor: '#A1A1AA', lightColor: '#52525B' });
  settings.elements.code.fontFamily = 'JetBrains Mono';
  // Links inherit surrounding sizes/weights and keep their existing accent.
  // Buttons and code also retain their existing colors.
  return settings;
}
