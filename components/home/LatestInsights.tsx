'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight, Clock3, Layers, Sparkles, TrendingUp } from 'lucide-react';
import { formatPostDate, formatReadTime } from '@/lib/post-metadata';
import styles from './LatestInsights.module.css';

type InsightPost = {
  slug: string; title: string; category: string; excerpt: string;
  image?: string | null; readTime?: number | string | null; date?: string | Date | null;
};
type Filter = 'latest' | 'bi' | 'ai';
const filters = [
  { id: 'latest' as const, label: 'Latest', icon: Clock3 },
  { id: 'bi' as const, label: 'Power BI & Fabric', icon: TrendingUp },
  { id: 'ai' as const, label: 'AI & Automation', icon: Sparkles },
];

export default function LatestInsights({ posts = [] }: { posts?: InsightPost[] }) {
  const [activeTab, setActiveTab] = useState<Filter>('latest');
  const matches = activeTab === 'latest' ? posts : posts.filter(post => {
    const text = `${post.title} ${post.category}`.toLowerCase();
    return activeTab === 'bi'
      ? /\bfabric\b|power bi|\bdax\b|\bonelake\b/.test(text)
      : /\bai\b|automation|\bn8n\b|\bllm\b|prompt|agent|workflow/.test(text);
  });
  const displayPosts = matches.slice(0, 6);

  return (
    <section className={`section ${styles.section}`} aria-labelledby="home-articles-title">
      <div className="container">
        <div className={styles.heading}>
          <div>
            <span className={styles.eyebrow}><Layers size={13} /> THE READING ROOM</span>
            <h2 id="home-articles-title">Ideas worth <span>building on.</span></h2>
            <p>Practical guides on data, intelligent workflows, and the systems behind them.</p>
          </div>
          <Link href="/blog" className={styles.allArticles}>All articles <ArrowUpRight size={16} /></Link>
        </div>
        <div className={styles.filterBar}>
          <div className={styles.filters} role="group" aria-label="Filter articles">
            {filters.map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-pressed={activeTab === id} className={activeTab === id ? styles.active : ''} onClick={() => setActiveTab(id)}><Icon size={13} /><span>{label}</span></button>)}
          </div>
          <span className={styles.count}>{String(displayPosts.length).padStart(2, '0')} selected reads</span>
        </div>
        <div className={styles.grid} aria-live="polite" aria-atomic="true">
          {displayPosts.map(post => {
            const published = formatPostDate(post.date);
            const duration = formatReadTime(post.readTime);
            return <article key={post.slug} className={styles.article}>
              <Link href={`/blog/${post.slug}`} className={styles.card} aria-labelledby={`insight-${post.slug}`}>
                <div className={styles.image}>
                  <div className={`${styles.thumbnail} ${/cybersecurity/i.test(post.title) ? styles.securityThumbnail : ''}`}>
                  <Image src={post.image || '/images/editorial-placeholder.svg'} alt="" fill sizes="(max-width: 480px) 112px, (max-width: 800px) 32vw, (max-width: 1100px) 21vw, 235px" />
                  </div>
                  <span className={styles.imageArrow} aria-hidden="true"><ArrowUpRight size={16} /></span>
                </div>
                <div className={styles.content}>
                  <span className={styles.category}>{post.category}</span>
                  <h3 id={`insight-${post.slug}`} title={post.title}>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className={styles.footer}>
                    <div className={styles.metadata}>
                      {duration && <span><Clock3 size={11} />{duration}</span>}
                      {published && <time dateTime={published.dateTime}>{published.label}</time>}
                    </div>
                    <ArrowRight size={15} className={styles.readArrow} aria-hidden="true" />
                  </div>
                </div>
              </Link>
            </article>;
          })}
        </div>
        {!displayPosts.length && <p className={styles.empty}>New guides are on their way. <Link href="/blog">Explore the blog.</Link></p>}
      </div>
    </section>
  );
}
