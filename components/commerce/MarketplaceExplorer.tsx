'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowUpRight, Award, Package, FileSpreadsheet, BarChart3, Database, Cpu } from 'lucide-react';
import styles from './Marketplace.module.css';
import { PRODUCT_CATEGORIES } from '@/lib/commerce/catalog';
import { filterProducts, SORT_OPTIONS, type CatalogItem } from '@/lib/commerce/discovery';
import { money } from '@/lib/commerce/format';
import { trackSelectItem, trackViewItemList } from '@/lib/commerce/analytics';
import { CONSENT_EVENT } from '@/lib/analytics-consent';
const collectionIcons = { Award, Package, FileSpreadsheet, BarChart3, Database, Cpu };
export type SerializedProduct = CatalogItem & { image: string | null };
export default function MarketplaceExplorer({ initialProducts, categoryCounts, unavailable = false }: { initialProducts: SerializedProduct[]; categoryCounts: Record<string, number>; unavailable?: boolean }) {
  const params = useSearchParams();
  const filters = { q: params.get('q') || '', category: params.get('category') || 'all', technology: params.get('technology') || 'all', availability: params.get('availability') || 'all', sort: params.get('sort') || 'newest' };
  const products = filterProducts(initialProducts, filters);
  const technologies = useMemo(() => [...new Set(initialProducts.flatMap(p => p.technologies))].sort(), [initialProducts]);
  const viewed = useRef('');
  useEffect(() => {
    const track = () => {
      const signature = JSON.stringify(filters);
      if (viewed.current === signature) return;
      // The helper fails closed before consent; retry this view on a consent change.
      trackViewItemList(products.map(p => ({ item_id: p.id, item_name: p.title, item_category: p.category, currency: p.currency, price: p.priceMinor / 100, testOnly: p.readiness !== 'READY_FOR_SALE' })));
      viewed.current = signature;
    };
    track();
    const consent = () => { viewed.current = ''; track(); };
    window.addEventListener(CONSENT_EVENT, consent);
    return () => window.removeEventListener(CONSENT_EVENT, consent);
  // URL state controls both the visible list and tracking.
  }, [params, initialProducts]);
  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === 'all' || (key === 'sort' && value === 'newest')) next.delete(key); else next.set(key, value);
    window.history.replaceState(null, '', '/products' + (next.size ? '?' + next.toString() : '') + '#products');
  }
  function clear() { window.history.replaceState(null, '', '/products#products'); }
  const active = filters.q || filters.category !== 'all' || filters.technology !== 'all' || filters.availability !== 'all' || filters.sort !== 'newest';
  return <>
    <section className={styles.sectionHeader} id="categories"><div><h2 className={styles.sectionTitle}>Curated Collections</h2><p className={styles.sectionSubtitle}>Explore published resources and clearly labeled previews. New collections will appear as products are prepared.</p></div></section>
    <div className={styles.categoryGrid}>{PRODUCT_CATEGORIES.map(c => {
      const count = categoryCounts[c.slug] || 0;
      const Icon = collectionIcons[c.iconName];
      return <button type="button" key={c.id} disabled={!count || unavailable} aria-pressed={filters.category === c.slug} className={styles.categoryCard} onClick={() => update('category', filters.category === c.slug ? 'all' : c.slug)}>
        <span className={styles.categoryCardTop}><span className={styles.categoryIconWrap} style={{ color: c.accentColor }}><Icon size={22} /></span><span className={styles.categoryCountBadge}>{unavailable ? 'Unavailable' : count ? `${count} published` : 'Coming soon'}</span></span>
        <span className={styles.categoryTitle}>{c.title}</span><span className={styles.categoryDesc}>{c.shortDesc}</span>
      </button>;
    })}</div>
    <section id="products" aria-label="Product discovery" className={styles.filterToolbar}>
      <div className={styles.searchRow}><div className={styles.searchBox}><Search className={styles.searchIcon} size={18} /><input type="search" value={filters.q} onChange={e => update('q', e.target.value.slice(0, 150))} placeholder="Search resources, topics or tools…" className={styles.searchInput} aria-label="Search resources" /></div>
        <select value={SORT_OPTIONS.includes(filters.sort as typeof SORT_OPTIONS[number]) ? filters.sort : 'newest'} onChange={e => update('sort', e.target.value)} className={styles.sortSelect} aria-label="Sort products"><option value="newest">Newest first</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="alpha">Title: A–Z</option></select></div>
      <div className={styles.tagsRow}><label>Technology <select value={filters.technology} onChange={e => update('technology', e.target.value)} className={styles.sortSelect}><option value="all">All technologies</option>{technologies.map(t => <option key={t}>{t}</option>)}</select></label><label>Availability <select value={filters.availability} onChange={e => update('availability', e.target.value)} className={styles.sortSelect}><option value="all">All published products</option><option value="READY_FOR_SALE">Ready for sale</option><option value="COMING_SOON">Coming soon</option><option value="TEST_ONLY">Test previews only</option></select></label>{active && <button onClick={clear} className={styles.clearFiltersBtn}>Clear all filters</button>}</div>
      <p role="status" aria-live="polite" className={styles.sectionSubtitle}>{products.length} {products.length === 1 ? 'result' : 'results'}{filters.sort.startsWith('price-') ? ' · Prices grouped by currency; no conversion applied.' : ''}</p>
    </section>
    {unavailable ? <section role="alert" className={styles.emptyState}><h2>We couldn’t load the catalog.</h2><p>Please retry shortly. Your existing purchases are still linked to your account.</p><button className={styles.btnSecondary} onClick={() => window.location.reload()}>Retry catalog</button></section> : !products.length ? <section className={styles.emptyState}><Package size={40} /><h2>{initialProducts.length ? 'No resources match your filters.' : 'New resources are in preparation.'}</h2><p>Browse our free articles while new products are prepared.</p>{active && <button onClick={clear} className={styles.btnSecondary}>Clear all filters</button>} <Link href="/blog">Read free articles</Link></section> : <div className={styles.productGrid}>{products.map((p, index) => {
      const test = p.readiness === 'TEST_ONLY';
      const track = () => trackSelectItem({ item_id: p.id, item_name: p.title, item_category: p.category, price: p.priceMinor / 100, currency: p.currency, index: index + 1, testOnly: p.readiness !== 'READY_FOR_SALE' });
      return <article key={p.id} className={styles.productCard}><div className={styles.cardHeaderArt}>{p.image ? <Image src={p.image} alt={p.title + ' cover'} fill sizes="(max-width: 680px) 90vw, (max-width: 1024px) 45vw, 380px" style={{ objectFit: 'cover' }} /> : <><div className={styles.cardHeaderPattern} /><div className={styles.cardCoverIcon}><Award size={56} strokeWidth={1.4} /></div></>}<span className={styles.cardCategoryBadge}>{p.category}</span><span className={styles.cardStatusBadge}>{test ? 'Test preview · dummy file' : p.readiness === 'READY_FOR_SALE' ? 'Ready for sale' : 'Coming soon'}</span></div>
        <div className={styles.cardBody}><h3 className={styles.cardTitle}><Link href={'/products/' + p.slug} onClick={track}>{p.title}</Link></h3><p className={styles.cardExcerpt}>{p.excerpt}</p><div className={styles.cardTags}>{p.technologies.slice(0,4).map(t => <span className={styles.techTag} key={t}>{t}</span>)}</div><div className={styles.cardFooter}><div className={styles.priceDisplay}><span className={styles.priceLabel}>{test ? 'Simulated test amount' : p.readiness === 'COMING_SOON' ? 'Planned price' : 'One-time purchase'}</span><span className={styles.priceAmount}>{money(p.priceMinor,p.currency)}</span></div><Link href={'/products/' + p.slug} onClick={track} className={styles.cardActionBtn}>{test ? 'Explore test preview' : 'View details'}<ArrowUpRight size={14} /></Link></div></div></article>;
    })}</div>}
  </>;
}
