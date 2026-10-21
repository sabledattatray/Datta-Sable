'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, BookOpen, Clock3, Layers, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { formatPostDate, formatReadTime } from '@/lib/post-metadata';
import styles from './BlogList.module.css';

export interface BlogListingPost {
  slug: string; title: string; category: string; excerpt: string;
  image?: string | null; readTime?: number | string | null;
  date?: string | Date | null; updatedAt?: string | Date | null; tags?: string[];
}
type Sort = 'newest' | 'oldest' | 'shortest' | 'title';
const timestamp = (post: BlogListingPost) => {
  const value = formatPostDate(post.date);
  return value ? Date.parse(value.dateTime) : 0;
};

function Metadata({ post, card = false }: { post: BlogListingPost; card?: boolean }) {
  const date = formatPostDate(post.date);
  const duration = formatReadTime(post.readTime);
  return <div className={styles.metadata}>{duration && <span className={card ? styles.mobileDuration : undefined}><Clock3 size={12} />{duration}</span>}{date && <time dateTime={date.dateTime}>{date.label}</time>}</div>;
}

export default function BlogList({ initialPosts, initialCategory = 'All', showHero = true }: { initialPosts: BlogListingPost[]; initialCategory?: string; showHero?: boolean }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<Sort>('newest');
  const [duration, setDuration] = useState('all');
  const [visible, setVisible] = useState(12);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    initialPosts.forEach(post => counts.set(post.category, (counts.get(post.category) || 0) + 1));
    return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [initialPosts]);
  const filtered = useMemo(() => {
    const terms = search.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return initialPosts.filter(post => {
      const text = `${post.title} ${post.excerpt} ${post.category} ${(post.tags || []).join(' ')}`.toLocaleLowerCase();
      const minutes = Number(post.readTime);
      return (category === 'All' || post.category === category) && terms.every(term => text.includes(term)) &&
        (duration === 'all' || (minutes > 0 && (duration === 'quick' ? minutes <= 10 : minutes > 10)));
    }).sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'shortest' ?
      (Number(a.readTime) || Infinity) - (Number(b.readTime) || Infinity) : sort === 'oldest' ? timestamp(a) - timestamp(b) : timestamp(b) - timestamp(a));
  }, [initialPosts, search, category, sort, duration]);
  const featured = useMemo(() => [...initialPosts].sort((a, b) => timestamp(b) - timestamp(a))[0], [initialPosts]);
  const isFiltered = !!search.trim() || category !== 'All' || duration !== 'all';
  const reset = () => { setSearch(''); setCategory('All'); setDuration('all'); setSort('newest'); setVisible(12); };
  const chooseCategory = (value: string) => { setCategory(value); setVisible(12); };

  return <div className={styles.room}>
    {showHero && <header className={styles.hero}>
      <div className={styles.eyebrow}><span className={styles.dot} /> THE READING ROOM <span className={styles.edition}>BY DATTA SABLE</span></div>
      <div className={styles.heroRow}><div><h1>A little curiosity.<br /><span>A lot of possibility.</span></h1><p>Ideas, field notes, and practical guides for people who build with data. Find your next perspective, then put it to work.</p></div><div className={styles.heroNote}><BookOpen size={25} strokeWidth={1.3} /><strong>{initialPosts.length}<span>articles to explore</span></strong><span>Read. Experiment. Build.</span></div></div>
      <div className={styles.heroFoot}><span>DATA & ANALYTICS <i /> AI & AUTOMATION <i /> MODERN WEB</span><a href="#article-library">Find your next read <ArrowRight size={14} /></a></div>
    </header>}
    <div className={styles.layout} id="article-library">
      <aside className={styles.sidebar} aria-label="Article filters">
        <div className={styles.sideTitle}><span><SlidersHorizontal size={14} /> EXPLORE THE LIBRARY</span><button type="button" aria-expanded={filtersOpen} aria-controls="blog-filters" onClick={() => setFiltersOpen(!filtersOpen)}>{filtersOpen ? 'Hide filters' : 'Show filters'}</button></div>
        <div id="blog-filters" className={`${styles.filterContents} ${filtersOpen ? styles.open : ''}`}>
          <label className={styles.fieldLabel} htmlFor="blog-search">Search articles</label>
          <div className={styles.search}><Search size={16} /><input id="blog-search" type="search" placeholder="What sparks your curiosity?" value={search} onChange={event => { setSearch(event.target.value); setVisible(12); }} />{search && <button type="button" aria-label="Clear search" onClick={() => { setSearch(''); setVisible(12); }}><X size={14} /></button>}</div>
          <div className={styles.categoryTitle}><h2>Browse by topic</h2><span>{categories.length}</span></div>
          <div className={styles.categories} role="group" aria-label="Article categories" tabIndex={0}>
            <button type="button" className={category === 'All' ? styles.selected : ''} aria-pressed={category === 'All'} onClick={() => chooseCategory('All')}><span><Layers size={14} />All articles</span><span>{initialPosts.length}</span></button>
            {categories.map(([name, count]) => <button type="button" key={name} className={category === name ? styles.selected : ''} aria-pressed={category === name} onClick={() => chooseCategory(name)}><span>{name}</span><span>{count}</span></button>)}
          </div>
          <div className={styles.readingFilter}><label className={styles.fieldLabel} htmlFor="reading-time">Time for a read?</label><select id="reading-time" value={duration} onChange={event => { setDuration(event.target.value); setVisible(12); }}><option value="all">Any reading time</option><option value="quick">A quick read · 10 min or less</option><option value="deep">A deeper dive · over 10 min</option></select></div>
          {isFiltered && <button type="button" className={styles.reset} onClick={reset}><X size={13} /> Reset all filters</button>}
        </div>
      </aside>
      <div className={styles.main}>
        {!isFiltered && sort === 'newest' && featured && <section className={styles.featuredSection} aria-labelledby="featured-label"><div className={styles.sectionLabel} id="featured-label"><span><Sparkles size={13} /> IN THE SPOTLIGHT</span><span>THE LATEST PERSPECTIVE</span></div><Link href={`/blog/${featured.slug}`} className={styles.featured}>
          <div className={styles.featureImage}><Image src={featured.image || '/images/editorial-placeholder.svg'} alt="" fill priority sizes="(max-width: 800px) 90vw, 45vw" /><span className={styles.featureBadge}><BookOpen size={12} /> FEATURED READ</span></div><div className={styles.featureBody}><span className={styles.category}>{featured.category}</span><h2>{featured.title}</h2><p>{featured.excerpt}</p><Metadata post={featured} /><span className={styles.featureAction}>Read the story <ArrowUpRight size={17} /></span></div>
        </Link></section>}
        <section aria-labelledby="library-title">
          <div className={styles.toolbar}><div><span className={styles.eyebrow}>THE COLLECTION</span><h2 id="library-title">{category === 'All' ? 'All perspectives' : category}<span aria-live="polite" aria-atomic="true">{filtered.length} {filtered.length === 1 ? 'article' : 'articles'}</span></h2></div><label className={styles.sort}>Sort by<select aria-label="Sort articles" value={sort} onChange={event => { setSort(event.target.value as Sort); setVisible(12); }}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="shortest">Shortest reads</option><option value="title">Title A–Z</option></select></label></div>
          {isFiltered && <div className={styles.activeFilters}><span>Filtered by</span>{category !== 'All' && <button type="button" onClick={() => chooseCategory('All')}>{category}<X size={12} /></button>}{search.trim() && <button type="button" onClick={() => { setSearch(''); setVisible(12); }}>“{search.trim()}”<X size={12} /></button>}{duration !== 'all' && <button type="button" onClick={() => { setDuration('all'); setVisible(12); }}>{duration === 'quick' ? 'Quick reads' : 'Deeper dives'}<X size={12} /></button>}</div>}
          <div className={styles.grid}>{filtered.slice(0, visible).map(post => <article key={post.slug}><Link href={`/blog/${post.slug}`} className={styles.card} aria-labelledby={`blog-${post.slug}`}><div className={styles.cardImage}>{formatReadTime(post.readTime) && <span className={styles.imageDuration}><Clock3 size={11} />{formatReadTime(post.readTime)}</span>}<div className={styles.thumbnail}><Image src={post.image || '/images/editorial-placeholder.svg'} alt="" fill sizes="(max-width: 540px) 108px, (max-width: 1200px) 28vw, 190px" /></div><span className={styles.imageArrow} aria-hidden="true"><ArrowUpRight size={15} /></span></div><div className={styles.cardBody}><span className={styles.category}>{post.category}</span><h3 id={`blog-${post.slug}`}>{post.title}</h3><p>{post.excerpt}</p><div className={styles.cardFooter}><Metadata post={post} card /><span className={styles.readLabel}>Read article</span></div></div></Link></article>)}</div>
          {!filtered.length && <div className={styles.empty}><Search size={30} strokeWidth={1.2} /><h3>No reads found. Yet.</h3><p>Try a broader search or explore a different topic.</p><button type="button" onClick={reset}>Explore all articles <ArrowRight size={15} /></button></div>}
          {filtered.length > 0 && <div className={styles.pagination}><span role="status">Showing {Math.min(visible, filtered.length)} of {filtered.length} articles</span>{visible < filtered.length ? <button type="button" onClick={() => setVisible(value => value + 12)}>Discover more articles <ArrowRight size={15} /></button> : <span>You’re all caught up.</span>}</div>}
        </section>
      </div>
    </div>
    <div className={styles.bottomNote}><BookOpen size={18} /><p>Good ideas are better when you put them into practice.<span>Pick a guide. Try something new. Make it yours.</span></p><Link href="/about">Meet the author <ArrowUpRight size={16} /></Link></div>
  </div>;
}
