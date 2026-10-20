export const TYPOGRAPHY_KEY = 'website_typography_v1';
export const TYPOGRAPHY_TAG = 'website-typography';
export const TYPOGRAPHY_DRAFT_KEY = 'website-typography-draft-v1';
export const TYPOGRAPHY_PUBLISHED_KEY = 'website-typography-published-v1';

export const FONT_FAMILIES = [
  { name: 'Inter', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { name: 'Syne', fallback: 'sans-serif', weights: [400, 600, 700, 800] },
  { name: 'JetBrains Mono', fallback: 'monospace', weights: [400, 600] },
  { name: 'Roboto', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { name: 'Open Sans', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { name: 'Montserrat', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { name: 'Nunito', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { name: 'Lora', fallback: 'serif', weights: [400, 500, 600, 700] },
  { name: 'Playfair Display', fallback: 'serif', weights: [400, 500, 600, 700, 800] },
  { name: 'Raleway', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { name: 'Segoe UI', fallback: 'system-ui,sans-serif', weights: [300, 400, 600, 700] },
] as const;

export const ELEMENT_IDS = ['body', 'paragraph', 'link', 'button', 'small', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
export type TypographyElement = typeof ELEMENT_IDS[number];
export const ELEMENT_LABELS: Record<TypographyElement, string> = {
  body: 'Body text', paragraph: 'Paragraphs', link: 'Links', button: 'Buttons', small: 'Captions / small text', code: 'Code',
  h1: 'H1 · Page titles', h2: 'H2 · Section titles', h3: 'H3 · Subheadings', h4: 'H4 · Minor headings', h5: 'H5 · Small headings', h6: 'H6 · Detail headings',
};

export type TypographyRule = {
  fontFamily: string;
  fontSize: number | null;
  mobileFontSize: number | null;
  fontWeight: 300 | 400 | 500 | 600 | 700 | 800 | null;
  lightColor: string;
  darkColor: string;
  lineHeight: number | null;
  letterSpacing: number | null;
};
export type TypographySettings = { version: 1; elements: Record<TypographyElement, TypographyRule> };

export function emptyTypographyRule(): TypographyRule {
  return { fontFamily: '', fontSize: null, mobileFontSize: null, fontWeight: null, lightColor: '', darkColor: '', lineHeight: null, letterSpacing: null };
}

export function defaultTypography(): TypographySettings {
  return { version: 1, elements: Object.fromEntries(ELEMENT_IDS.map(id => [id, emptyTypographyRule()])) as TypographySettings['elements'] };
}

export function parseTypography(value: unknown): TypographySettings | null {
  // Small allowlist validator shared with the public renderer; no validation
  // framework is shipped in the public page's critical JavaScript bundle.
  const object = (input: unknown): input is Record<string, unknown> => Boolean(input) && typeof input === 'object' && !Array.isArray(input);
  const exactKeys = (input: Record<string, unknown>, keys: readonly string[]) => Object.keys(input).length === keys.length && keys.every(key => Object.hasOwn(input, key));
  const number = (input: unknown, min: number, max: number) => input === null || (typeof input === 'number' && Number.isFinite(input) && input >= min && input <= max);
  const color = (input: unknown) => typeof input === 'string' && (input === '' || /^#[0-9a-fA-F]{6}$/.test(input));
  if (!object(value) || !exactKeys(value, ['version', 'elements']) || value.version !== 1 || !object(value.elements) || !exactKeys(value.elements, ELEMENT_IDS)) return null;
  const elements = {} as TypographySettings['elements'];
  for (const id of ELEMENT_IDS) {
    const rule = value.elements[id];
    if (!object(rule) || !exactKeys(rule, Object.keys(emptyTypographyRule()))) return null;
    if (typeof rule.fontFamily !== 'string') return null;
    const family = FONT_FAMILIES.find(font => font.name === rule.fontFamily);
    if (rule.fontFamily !== '' && !family) return null;
    if (!number(rule.fontSize, 10, 120) || !number(rule.mobileFontSize, 10, 80) || !number(rule.lineHeight, 1, 2.5) || !number(rule.letterSpacing, -0.1, 0.3)) return null;
    if (!color(rule.lightColor) || !color(rule.darkColor)) return null;
    if (rule.fontWeight !== null && (typeof rule.fontWeight !== 'number' || ![300, 400, 500, 600, 700, 800].includes(rule.fontWeight))) return null;
    if (family && rule.fontWeight !== null && !(family.weights as readonly unknown[]).includes(rule.fontWeight)) return null;
    elements[id] = { ...rule } as TypographyRule;
  }
  return { version: 1, elements };
}

export function parseStoredTypography(value: string | null | undefined): TypographySettings | null {
  if (!value || value.length > 16000) return null;
  try { return parseTypography(JSON.parse(value)); } catch { return null; }
}

const TAGS: Record<TypographyElement, string[]> = {
  body: ['p', 'li', 'td', 'th', 'blockquote', 'label', 'input', 'textarea', 'select'],
  paragraph: ['p'], link: ['a'], button: ['button', '[role="button"]'], small: ['small', 'figcaption'], code: ['pre', 'code'],
  h1: ['h1'], h2: ['h2'], h3: ['h3'], h4: ['h4'], h5: ['h5'], h6: ['h6'],
};

export function typographyFontCss(settings: TypographySettings): string {
  const names = new Set(Object.values(settings.elements).map(rule => rule.fontFamily));
  return FONT_FAMILIES.filter(font => names.has(font.name) && !['Inter', 'Syne', 'JetBrains Mono', 'Segoe UI'].includes(font.name)).map(font => {
    const slug = font.name.toLowerCase().replaceAll(' ', '-');
    return `@font-face{font-family:'${font.name}';font-style:normal;font-weight:${font.weights[0]} ${font.weights[font.weights.length - 1]};font-display:swap;src:url('/fonts/typography/${slug}-latin-variable.woff2') format('woff2');}`;
  }).join('\n');
}

// Both the editor preview and public pages use this renderer. Only validated data
// enters CSS, and overrides are limited to page content (not consent UI or ads).
export function buildTypographyCss(input: TypographySettings, scope = '#main-content', themeRoot = 'html', previewViewport?: 'desktop' | 'mobile'): string {
  const settings = parseTypography(input);
  if (!settings) return '';
  const rules: string[] = [];
  for (const id of ELEMENT_IDS) {
    const rule = settings.elements[id];
    const family = FONT_FAMILIES.find(font => font.name === rule.fontFamily);
    const baseSelectors = TAGS[id].map(tag => `${scope} ${tag}`);
    // Paragraph settings must not flatten link accents, button colors, or code.
    const descendants = id === 'body' || id === 'paragraph'
      ? ':where(span,strong,em,b,i):not(:where(a,button,[role="button"],code,pre) *)'
      : ':where(span,strong,em,b,i,a)';
    const selectors = TAGS[id].flatMap(tag => [`${scope} ${tag}`, `${scope} ${tag} ${descendants}`]);
    if (id === 'body') selectors.unshift(scope);
    const selector = selectors.join(',');
    const declarations: string[] = [];
    if (family) declarations.push(`font-family:'${family.name}',${family.fallback}!important`);
    if (rule.fontSize !== null) declarations.push(`font-size:${rule.fontSize / 16}rem!important`);
    // Let <strong>/<b> retain semantic emphasis instead of forcing body weight.
    if (rule.fontWeight !== null) {
      const weightSelectors = id === 'body' ? [scope, ...baseSelectors] : baseSelectors;
      rules.push(`${weightSelectors.join(',')}{font-weight:${rule.fontWeight}!important}`);
    }
    if (rule.lineHeight !== null) declarations.push(`line-height:${rule.lineHeight}!important`);
    if (rule.letterSpacing !== null) declarations.push(`letter-spacing:${rule.letterSpacing}em!important`);
    if (declarations.length) rules.push(`${selector}{${declarations.join(';')}}`);
    if (rule.mobileFontSize !== null && previewViewport !== 'desktop') {
      const mobileRule = `${selector}{font-size:${rule.mobileFontSize / 16}rem!important}`;
      rules.push(previewViewport === 'mobile' ? mobileRule : `@media(max-width:767px){${mobileRule}}`);
    }
    for (const theme of ['light', 'dark'] as const) {
      const value = theme === 'light' ? rule.lightColor : rule.darkColor;
      if (value) {
        // Only headings need to replace gradient text. Applying text-fill to the
        // content root would also force that color onto links and button labels.
        const gradientOverride = id.startsWith('h') ? `;-webkit-text-fill-color:${value}!important;background-image:none!important` : '';
        rules.push(`${selectors.map(s => `${themeRoot}.${theme} ${s}`).join(',')}{color:${value}!important${gradientOverride}}`);
      }
    }
  }
  return rules.length ? `${typographyFontCss(settings)}\n${rules.join('\n')}` : '';
}
