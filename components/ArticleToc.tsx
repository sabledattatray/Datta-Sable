'use client';

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { ChevronDown, ChevronRight, List, Search, X } from 'lucide-react';
import type { ArticleHeading } from '@/lib/article-navigation';
import { articleHeadingLabel, filterArticleHeadings, groupArticleHeadings } from '@/lib/article-toc';
import styles from './ArticleToc.module.css';

export default function ArticleToc({ headings, contentRef }: { headings: ArticleHeading[]; contentRef: RefObject<HTMLDivElement | null> }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(headings[0]?.id ?? '');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const groups = useMemo(() => groupArticleHeadings(headings), [headings]);
  const filtered = useMemo(() => filterArticleHeadings(groups, query), [groups, query]);
  const activeHeading = headings.find(heading => heading.id === active);

  useEffect(() => {
    if (query.trim()) return;
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>('[aria-current="location"]') ?? list?.querySelector<HTMLElement>('[data-active="true"] a');
    if (!list || !link) return;
    const bounds = list.getBoundingClientRect();
    const position = link.getBoundingClientRect();
    if (!list.clientHeight) return;
    if (position.top < bounds.top || position.bottom > bounds.bottom) list.scrollTop += position.top - bounds.top - list.clientHeight / 3;
  }, [active, expanded, open, query]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content || headings.length < 2) return;
    let disposed = false;
    let frame = 0;
    let offsets: { id: string; top: number }[] = [];
    const update = () => {
      frame = 0;
      const position = window.scrollY + (window.matchMedia('(max-width: 1099px)').matches ? 164 : 124);
      let low = 0, high = offsets.length - 1, index = 0;
      while (low <= high) {
        const middle = (low + high) >>> 1;
        if (offsets[middle].top <= position) { index = middle; low = middle + 1; }
        else high = middle - 1;
      }
      if (offsets[index]) setActive(offsets[index].id);
    };
    const measure = () => {
      if (disposed) return;
      offsets = headings.flatMap(heading => {
        const element = document.getElementById(heading.id);
        return element && content.contains(element) && element.getClientRects().length ? [{ id: heading.id, top: element.getBoundingClientRect().top + window.scrollY }] : [];
      }).sort((a, b) => a.top - b.top);
      update();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    if (content.parentElement) observer.observe(content.parentElement);
    document.fonts?.ready.then(measure);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
    };
  }, [headings, contentRef]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!navRef.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);

  function jump(event: React.MouseEvent<HTMLAnchorElement>, heading: ArticleHeading) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(heading.id);
    if (!target) return;
    event.preventDefault();
    setActive(heading.id);
    setOpen(false);
    window.history.pushState(window.history.state, '', `#${encodeURIComponent(heading.id)}`);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  if (headings.length < 2) return null;
  return <nav className={styles.navigation} ref={navRef} aria-label="Article table of contents" data-open={open} id={headings.some(heading => heading.id === 'toc') ? 'article-toc' : 'toc'}>
    <button className={styles.mobileToggle} type="button" ref={toggleRef} aria-expanded={open} aria-controls="article-toc-panel" onClick={() => setOpen(current => !current)}>
      <List size={18} aria-hidden="true" /><span className={styles.mobileLabel}><strong>On this page</strong><span>{activeHeading ? articleHeadingLabel(activeHeading.text) : `${groups.length} sections`}</span></span><ChevronDown size={17} className={open ? styles.rotated : ''} aria-hidden="true" />
    </button>
    <div className={styles.panel} id="article-toc-panel">
      <div className={styles.heading}><div><span className={styles.eyebrow}>Reading guide</span><span className={styles.title}>On this page</span></div><span className={styles.count}>{groups.length}</span><button className={styles.close} type="button" aria-label="Close table of contents" onClick={() => { setOpen(false); toggleRef.current?.focus(); }}><X size={18} /></button></div>
      {headings.length > 8 && <label className={styles.search}><Search size={15} aria-hidden="true" /><input type="search" aria-label="Find an article section" placeholder="Find a section…" value={query} onChange={event => setQuery(event.target.value)} /></label>}
      <div className={styles.list} ref={listRef}>
        {!filtered.length && <p className={styles.empty} role="status">No matching sections.</p>}
        <ol>{filtered.map(group => {
          const childActive = group.children.some(heading => heading.id === active);
          const showChildren = Boolean(query.trim()) || (expanded[group.heading.id] ?? childActive);
          const number = groups.findIndex(item => item.heading.id === group.heading.id) + 1;
          return <li key={group.heading.id}>
            <div className={styles.linkRow} data-active={active === group.heading.id || childActive}>
              <a href={`#${encodeURIComponent(group.heading.id)}`} aria-current={active === group.heading.id ? 'location' : undefined} onClick={event => jump(event, group.heading)}><span className={styles.number}>{String(number).padStart(2, '0')}</span><span>{articleHeadingLabel(group.heading.text)}</span></a>
              {group.children.length > 0 && <button type="button" className={styles.expand} aria-label={`${showChildren ? 'Hide' : 'Show'} subsections of ${group.heading.text}`} aria-expanded={showChildren} aria-controls={`toc-children-${group.heading.id}`} onClick={() => setExpanded(current => ({ ...current, [group.heading.id]: !showChildren }))}><ChevronRight size={14} className={showChildren ? styles.expanded : ''} aria-hidden="true" /></button>}
            </div>
            {group.children.length > 0 && <ol id={`toc-children-${group.heading.id}`} className={styles.children} hidden={!showChildren}>{showChildren && group.children.map(heading => <li key={heading.id}><a href={`#${encodeURIComponent(heading.id)}`} aria-current={active === heading.id ? 'location' : undefined} onClick={event => jump(event, heading)}>{articleHeadingLabel(heading.text)}</a></li>)}</ol>}
          </li>;
        })}</ol>
      </div>
      <div className={styles.footer}>Select a section to jump straight to it.</div>
    </div>
  </nav>;
}
