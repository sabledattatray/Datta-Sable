'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, RotateCcw, Save, Type } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import {
  buildTypographyCss, defaultTypography, emptyTypographyRule, ELEMENT_IDS, ELEMENT_LABELS, FONT_FAMILIES,
  parseStoredTypography, parseTypography, TYPOGRAPHY_DRAFT_KEY, TYPOGRAPHY_PUBLISHED_KEY,
  type TypographyElement, type TypographyRule, type TypographySettings,
} from '@/lib/site-typography';
import { saveWebsiteTypography } from './actions';
import styles from './TypographyEditor.module.css';

type Props = { initialSettings: TypographySettings; revision: string | null; notice?: string };
const SIZE_HINTS: Record<TypographyElement, number> = { body: 16, paragraph: 16, h1: 56, h2: 40, h3: 28, h4: 24, h5: 20, h6: 16, link: 16, button: 14, small: 12, code: 14 };

export default function TypographyEditor({ initialSettings, revision: initialRevision, notice }: Props) {
  const { theme } = useTheme();
  const [draft, setDraft] = useState(initialSettings);
  const [saved, setSaved] = useState(initialSettings);
  const [revision, setRevision] = useState(initialRevision);
  const [element, setElement] = useState<TypographyElement>('h1');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [repairNeeded, setRepairNeeded] = useState(Boolean(notice));
  const [message, setMessage] = useState<{ error?: boolean; text: string } | null>(notice ? { error: true, text: notice } : null);
  const [recovered, setRecovered] = useState<TypographySettings | null>(null);
  const [ready, setReady] = useState(false);
  const rule = draft.elements[element];
  const dirty = repairNeeded || JSON.stringify(draft) !== JSON.stringify(saved);
  const valid = Boolean(parseTypography(draft));
  const family = FONT_FAMILIES.find(font => font.name === rule.fontFamily);
  const weights = family?.weights ?? [300, 400, 500, 600, 700, 800];

  useEffect(() => {
    try {
      const stored = parseStoredTypography(localStorage.getItem(TYPOGRAPHY_DRAFT_KEY));
      if (stored && JSON.stringify(stored) !== JSON.stringify(initialSettings)) setRecovered(stored);
    } catch { /* Editing and publishing still work without browser storage. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !valid || (recovered && !dirty)) return;
    try { localStorage.setItem(TYPOGRAPHY_DRAFT_KEY, JSON.stringify(draft)); } catch { /* Optional live-tab preview. */ }
  }, [draft, ready, valid, recovered, dirty]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function update<K extends keyof TypographyRule>(key: K, value: TypographyRule[K]) {
    setDraft(current => {
      const next = { ...current.elements[element], [key]: value };
      if (key === 'fontFamily') {
        const font = FONT_FAMILIES.find(item => item.name === value);
        if (font && next.fontWeight !== null && !(font.weights as readonly number[]).includes(next.fontWeight)) next.fontWeight = null;
      }
      return { ...current, elements: { ...current.elements, [element]: next } };
    });
    setMessage(null);
  }

  async function publish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || saving) return;
    setSaving(true);
    setMessage(null);
    try {
      const result = await saveWebsiteTypography(draft, revision);
      if ('error' in result) setMessage({ error: true, text: result.error || 'Could not publish settings.' });
      else {
        setRevision(result.revision);
        setSaved(result.settings);
        setRepairNeeded(false);
        setRecovered(null);
        try { localStorage.setItem(TYPOGRAPHY_PUBLISHED_KEY, JSON.stringify(result.settings)); } catch { /* Server save already succeeded. */ }
        setMessage({ text: 'Published. Your website now uses these styles. New page loads receive the saved settings immediately.' });
      }
    } catch {
      setMessage({ error: true, text: 'Could not reach the server. Your edits are still here; please try again.' });
    } finally { setSaving(false); }
  }

  function openPreview() {
    try { localStorage.setItem(TYPOGRAPHY_DRAFT_KEY, JSON.stringify(draft)); } catch {
      setMessage({ error: true, text: 'Website preview requires browser storage. Use the live sample below, or enable storage for this site.' });
      return;
    }
    window.open('/?typography-preview=1', '_blank', 'noopener,noreferrer');
  }

  const numericField = (key: 'fontSize' | 'mobileFontSize' | 'lineHeight' | 'letterSpacing', label: string, min: number, max: number, step: number, placeholder: string) => (
    <label className={styles.field}>
      <span>{label}</span>
      <input type="number" min={min} max={max} step={step} value={rule[key] ?? ''} placeholder={placeholder}
        onChange={event => update(key, event.target.value === '' ? null : Number(event.target.value))} />
    </label>
  );

  const colorField = (key: 'darkColor' | 'lightColor', label: string, fallback: string) => (
    <label className={styles.field}>
      <span>{label}</span>
      <span className={styles.colorField}>
        <input aria-label={`${label} picker`} type="color" value={/^#[\da-f]{6}$/i.test(rule[key]) ? rule[key] : fallback} onChange={event => update(key, event.target.value)} />
        <input aria-label={label} type="text" value={rule[key]} placeholder="Site default" pattern="#[0-9a-fA-F]{6}" maxLength={7} onChange={event => update(key, event.target.value)} />
        <button type="button" title={`Reset ${label.toLowerCase()}`} aria-label={`Reset ${label.toLowerCase()}`} onClick={() => update(key, '')}><RotateCcw size={14} /></button>
      </span>
    </label>
  );

  const previewCss = buildTypographyCss(draft, '#typography-sample', '#typography-preview', viewport);
  return <div className={styles.page} data-theme={theme}>
    <header className={styles.header}>
      <div><span className={styles.eyebrow}>Design studio / Website appearance</span><h1><Type size={28} /> Website Typography</h1><p>Choose your type. Refine every heading. Preview instantly, then publish to your website.</p></div>
      <span className={`${styles.status} ${dirty ? styles.unsaved : ''}`}>{dirty ? 'Unpublished changes' : 'Saved settings loaded'}</span>
    </header>

    {recovered && <div className={styles.recovery}>An unpublished draft is available from this browser.<button type="button" onClick={() => { setDraft(recovered); setRecovered(null); }}>Restore draft</button><button type="button" onClick={() => setRecovered(null)}>Dismiss</button></div>}
    {message && <p className={`${styles.message} ${message.error ? styles.error : styles.success}`} role={message.error ? 'alert' : 'status'}>{message.text}</p>}

    <form onSubmit={publish}>
      <fieldset disabled={saving} className={styles.fieldset}>
        <div className={styles.toolbar}>
          <p>Blank fields keep the current site design. Changes below are a draft until published.</p>
          <div className={styles.actions}>
            <button type="button" onClick={() => { setDraft(defaultTypography()); setMessage(null); setRecovered(null); }}><RotateCcw size={15} /> Reset all to site defaults</button>
            <button type="button" onClick={() => { setDraft(saved); setRecovered(null); setMessage(null); }} disabled={!dirty}>Discard edits</button>
            <button type="button" onClick={openPreview} disabled={!valid}><ExternalLink size={15} /> Preview website</button>
            <button className={styles.primary} type="submit" disabled={!dirty || !valid || saving}><Save size={16} /> {saving ? 'Publishing…' : 'Publish typography'}</button>
          </div>
        </div>

        <div className={styles.workspace}>
          <section className={styles.panel} aria-label="Typography controls">
            <div className={styles.panelHeading}><div><span className={styles.eyebrow}>01 / Customize</span><h2>Every level, your way.</h2></div><span className={styles.count}>{FONT_FAMILIES.length} font families</span></div>
            <div className={styles.elements} role="group" aria-label="Choose text element">
              {ELEMENT_IDS.map(id => <button key={id} type="button" aria-pressed={element === id} onClick={() => setElement(id)}>{id.startsWith('h') ? id.toUpperCase() : ELEMENT_LABELS[id]}</button>)}
            </div>
            <div className={styles.selectedHeading}><h3>{ELEMENT_LABELS[element]}</h3><button type="button" onClick={() => { setDraft(current => ({ ...current, elements: { ...current.elements, [element]: emptyTypographyRule() } })); setMessage(null); }}>Reset this element</button></div>
            <div className={styles.fields}>
              <label className={`${styles.field} ${styles.full}`}><span>Font family</span><select value={rule.fontFamily} onChange={event => update('fontFamily', event.target.value)}><option value="">Site default</option>{FONT_FAMILIES.map(font => <option key={font.name} value={font.name}>{font.name}</option>)}</select></label>
              {numericField('fontSize', 'Desktop font size (px)', 10, 120, 1, `Site default · e.g. ${SIZE_HINTS[element]}`)}
              {numericField('mobileFontSize', 'Mobile font size (px)', 10, 80, 1, 'Site default · up to 767px')}
              <label className={styles.field}><span>Font weight</span><select value={rule.fontWeight ?? ''} onChange={event => update('fontWeight', event.target.value ? Number(event.target.value) as TypographyRule['fontWeight'] : null)}><option value="">Site default</option>{weights.map(weight => <option key={weight} value={weight}>{weight} · {({ 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'Semibold', 700: 'Bold', 800: 'Extra bold' })[weight as 300 | 400 | 500 | 600 | 700 | 800]}</option>)}</select></label>
              {numericField('lineHeight', 'Line height', 1, 2.5, 0.05, 'Site default · e.g. 1.5')}
              {colorField('darkColor', 'Dark theme color', '#ffffff')}
              {colorField('lightColor', 'Light theme color', '#171717')}
              {numericField('letterSpacing', 'Letter spacing (em)', -0.1, 0.3, 0.005, 'Site default · e.g. 0.01')}
            </div>
            {!valid && <p role="alert" className={styles.validation}>Check your values: sizes 10–120px (mobile 10–80px), line height 1–2.5, spacing −0.1–0.3em, and colors like #FFFFFF.</p>}
            <p className={styles.help}>Web fonts are self-hosted and load only when selected. Segoe UI uses your device’s installed font, with system fallbacks. Typography affects the public website; admin controls, cookie consent, and advertising settings stay separate.</p>
          </section>

          <section className={`${styles.panel} ${styles.previewPanel}`} aria-label="Live typography preview">
            <div className={styles.panelHeading}><div><span className={styles.eyebrow}>02 / Live preview</span><h2>See the difference.</h2></div><span className={styles.live}>● Live</span></div>
            <div className={styles.previewTools}>
              <div role="group" aria-label="Preview theme"><button type="button" aria-pressed={previewTheme === 'dark'} onClick={() => setPreviewTheme('dark')}>Dark</button><button type="button" aria-pressed={previewTheme === 'light'} onClick={() => setPreviewTheme('light')}>Light</button></div>
              <div role="group" aria-label="Preview screen size"><button type="button" aria-pressed={viewport === 'desktop'} onClick={() => setViewport('desktop')}>Desktop</button><button type="button" aria-pressed={viewport === 'mobile'} onClick={() => setViewport('mobile')}>Mobile</button></div>
            </div>
            <div id="typography-preview" className={`${styles.preview} ${previewTheme}`} data-preview-theme={previewTheme} data-viewport={viewport}>
              <style>{previewCss}</style>
              <div id="typography-sample" className={styles.sample}>
                <div className={styles.sampleTag}>DATTA SABLE / TYPE SPECIMEN</div>
                <h1 style={{ fontSize: 'clamp(2rem, 4vw, 48px)', fontWeight: 700, lineHeight: 1.15, fontFamily: 'Syne, sans-serif' }}>Ideas worth sharing.</h1>
                <p style={{ fontSize: 16, lineHeight: 1.75 }}>Practical guides for curious minds. Build your knowledge of Microsoft Fabric, Power BI, and modern data engineering.</p>
                <h2 style={{ fontSize: 32, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>A clearer perspective</h2>
                <h3 style={{ fontSize: 24, fontWeight: 600 }}>Turn knowledge into action</h3>
                <p style={{ fontSize: 16, lineHeight: 1.75 }}>Good typography makes every article easier to explore. <a href="#typography-preview" onClick={event => event.preventDefault()} style={{ color: previewTheme === 'dark' ? '#c9f31d' : '#0059b3', textDecoration: 'underline' }}>Explore a practical guide</a> and discover what you can create.</p>
                <div className={styles.sampleDivider} />
                <h4 style={{ fontSize: 22, fontWeight: 600 }}>H4 · The details matter</h4><h5 style={{ fontSize: 18, fontWeight: 600 }}>H5 · Designed for reading</h5><h6 style={{ fontSize: 16, fontWeight: 600 }}>H6 · One step further</h6>
                <small style={{ fontSize: 12 }}>A small caption · Updated weekly · 8 minute read</small>
                <pre><code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>SELECT insight FROM ideas;</code></pre>
                <button type="button" style={{ background: previewTheme === 'dark' ? '#c9f31d' : '#0059b3', color: previewTheme === 'dark' ? '#000' : '#fff', fontSize: 14, fontWeight: 600, border: 0, padding: '12px 20px', borderRadius: 10 }}>Start learning ↗</button>
              </div>
            </div>
            <p className={styles.previewNote}>This sample updates as you edit. “Preview website” opens your actual homepage with the unpublished draft and keeps it synced in this browser.</p>
          </section>
        </div>
      </fieldset>
    </form>
  </div>;
}
