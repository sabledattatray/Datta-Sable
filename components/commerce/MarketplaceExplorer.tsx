'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, ArrowUpRight, Award, FileSpreadsheet, BarChart3, 
  Database, Cpu, Package, Filter, X, Sparkles, CheckCircle2,
  Lock, BookOpen
} from 'lucide-react';
import styles from './Marketplace.module.css';
import { PRODUCT_CATEGORIES, ProductCategoryDef, PRODUCT_EXTRAS } from '@/lib/commerce/catalog';
import { money } from '@/lib/commerce/format';
import { trackSelectItem, trackViewItemList } from '@/lib/commerce/analytics';

export type SerializedProduct = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string | null;
  priceMinor: number;
  currency: string;
  status: string;
  salesEnabled: boolean;
  deliveryReady: boolean;
  features: string[];
  includedResources: string[];
  createdAt: string;
};

interface MarketplaceExplorerProps {
  initialProducts: SerializedProduct[];
  categoryCounts: Record<string, number>;
}

export default function MarketplaceExplorer({
  initialProducts,
  categoryCounts,
}: MarketplaceExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'alpha'>('newest');

  // Track initial product list view
  useEffect(() => {
    trackViewItemList(
      initialProducts.map((p, idx) => ({
        item_id: p.slug,
        item_name: p.title,
        item_category: p.category,
        price: p.priceMinor / 100,
        currency: p.currency,
        index: idx + 1,
      }))
    );
  }, [initialProducts]);

  // Extract unique technology tags across all products and extras
  const allTechTags = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach(p => {
      const extra = PRODUCT_EXTRAS[p.slug];
      if (extra?.technologies) {
        extra.technologies.forEach(t => set.add(t));
      }
      // Also extract key words from category
      if (p.category.includes('Fabric')) set.add('Microsoft Fabric');
    });
    return Array.from(set);
  }, [initialProducts]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => {
        const catDef = PRODUCT_CATEGORIES.find(c => c.slug === selectedCategory);
        if (!catDef) return true;
        return (
          p.category.toLowerCase().includes(catDef.title.toLowerCase()) ||
          p.category.toLowerCase().includes(catDef.id.toLowerCase()) ||
          (catDef.id === 'certifications' && (p.category.toLowerCase().includes('fabric') || p.category.toLowerCase().includes('certification')))
        );
      });
    }

    // Technology Tag filter
    if (selectedTag !== 'all') {
      result = result.filter(p => {
        const extra = PRODUCT_EXTRAS[p.slug];
        const tags = extra?.technologies || [];
        return tags.some(t => t.toLowerCase() === selectedTag.toLowerCase()) ||
               p.title.toLowerCase().includes(selectedTag.toLowerCase()) ||
               p.excerpt.toLowerCase().includes(selectedTag.toLowerCase());
      });
    }

    // Keyword search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.features.some(f => f.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceMinor - b.priceMinor;
      if (sortBy === 'price-desc') return b.priceMinor - a.priceMinor;
      if (sortBy === 'alpha') return a.title.localeCompare(b.title);
      // default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [initialProducts, selectedCategory, selectedTag, searchQuery, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTag('all');
    setSortBy('newest');
  };

  const getCategoryIcon = (iconName: ProductCategoryDef['iconName']) => {
    switch (iconName) {
      case 'Award': return <Award size={22} />;
      case 'FileSpreadsheet': return <FileSpreadsheet size={22} />;
      case 'BarChart3': return <BarChart3 size={22} />;
      case 'Database': return <Database size={22} />;
      case 'Cpu': return <Cpu size={22} />;
      case 'Package': return <Package size={22} />;
      default: return <Sparkles size={22} />;
    }
  };

  return (
    <>
      {/* --------------------------------------------------------------------
          Categories Section
          -------------------------------------------------------------------- */}
      <section className={styles.sectionHeader} id="categories">
        <div>
          <h2 className={styles.sectionTitle}>Curated Collections</h2>
          <p className={styles.sectionSubtitle}>
            Browse digital deliverables engineered for data analysts, BI consultants, and cloud engineers.
          </p>
        </div>
        {selectedCategory !== 'all' && (
          <button onClick={() => setSelectedCategory('all')} className={styles.clearFiltersBtn}>
            Show all collections
          </button>
        )}
      </section>

      <div className={styles.categoryGrid}>
        {PRODUCT_CATEGORIES.map(category => {
          const count = categoryCounts[category.slug] || categoryCounts[category.id] || 0;
          const isSelected = selectedCategory === category.slug;

          return (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(isSelected ? 'all' : category.slug)}
              className={styles.categoryCard}
              style={{
                borderColor: isSelected ? category.accentColor : undefined,
                background: isSelected ? 'var(--surface2)' : undefined,
                cursor: 'pointer',
              }}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedCategory(isSelected ? 'all' : category.slug);
                }
              }}
            >
              <div className={styles.categoryCardTop}>
                <div 
                  className={styles.categoryIconWrap}
                  style={{ color: category.accentColor }}
                >
                  {getCategoryIcon(category.iconName)}
                </div>
                <span className={styles.categoryCountBadge}>
                  {count} {count === 1 ? 'Resource' : 'Resources'}
                </span>
              </div>
              <h3 className={styles.categoryTitle}>{category.title}</h3>
              <p className={styles.categoryDesc}>{category.shortDesc}</p>
            </div>
          );
        })}
      </div>

      {/* --------------------------------------------------------------------
          Search, Filters & Sorting Toolbar
          -------------------------------------------------------------------- */}
      <div className={styles.filterToolbar} id="products">
        <div className={styles.searchRow}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, certification, or tool (e.g., Fabric, PySpark, SQL)..."
              className={styles.searchInput}
              aria-label="Search resources"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer'
                }}
                aria-label="Clear search input"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className={styles.sortSelect}
            aria-label="Sort products"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="alpha">Alphabetical (A-Z)</option>
          </select>
        </div>

        {/* Technology Tag Pills */}
        {allTechTags.length > 0 && (
          <div className={styles.tagsRow}>
            <span className={styles.tagLabel}>Filter by Tech:</span>
            <button
              onClick={() => setSelectedTag('all')}
              className={`${styles.tagFilterBtn} ${selectedTag === 'all' ? styles.tagFilterBtnActive : ''}`}
            >
              All
            </button>
            {allTechTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
                className={`${styles.tagFilterBtn} ${selectedTag === tag ? styles.tagFilterBtnActive : ''}`}
              >
                {tag}
              </button>
            ))}

            {(selectedCategory !== 'all' || selectedTag !== 'all' || searchQuery) && (
              <button onClick={resetFilters} className={styles.clearFiltersBtn}>
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------------
          Products Grid
          -------------------------------------------------------------------- */}
      {filteredProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <Package size={44} style={{ color: 'var(--muted)', margin: '0 auto 12px' }} />
          <h3 className={styles.emptyStateTitle}>No resources match your filter</h3>
          <p className={styles.emptyStateDesc}>
            Try adjusting your search query, selecting &ldquo;All&rdquo; categories, or clearing selected tags.
          </p>
          <button onClick={resetFilters} className={styles.btnSecondary}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className={styles.productGrid}>
          {filteredProducts.map((product, idx) => {
            const extra = PRODUCT_EXTRAS[product.slug];
            const tags = extra?.technologies || ['Data Analytics'];

            return (
              <article key={product.id} className={styles.productCard}>
                {/* Visual Header Artwork */}
                <div className={styles.cardHeaderArt}>
                  <div className={styles.cardHeaderPattern} />
                  <span className={styles.cardCategoryBadge}>
                    {product.category}
                  </span>
                  
                  {(!product.deliveryReady || !product.salesEnabled) ? (
                    <span className={styles.cardStatusBadge} style={{ background: 'rgba(234, 179, 8, 0.15)', borderColor: 'rgba(234, 179, 8, 0.3)', color: '#fde047' }}>
                      Coming Soon
                    </span>
                  ) : (
                    <span className={styles.cardStatusBadge}>
                      Instant Access
                    </span>
                  )}

                  <div className={styles.cardCoverIcon}>
                    <Award size={56} strokeWidth={1.4} />
                  </div>
                </div>

                {/* Card Content */}
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>
                    <Link 
                      href={`/products/${product.slug}`}
                      onClick={() => trackSelectItem({
                        item_id: product.slug,
                        item_name: product.title,
                        item_category: product.category,
                        price: product.priceMinor / 100,
                        currency: product.currency,
                        index: idx + 1,
                      })}
                    >
                      {product.title}
                    </Link>
                  </h3>

                  <p className={styles.cardExcerpt}>
                    {product.excerpt}
                  </p>

                  {/* Technology Tags */}
                  <div className={styles.cardTags}>
                    {tags.slice(0, 4).map(tag => (
                      <span key={tag} className={styles.techTag}>
                        {tag}
                      </span>
                    ))}
                    {tags.length > 4 && (
                      <span className={styles.techTag}>
                        +{tags.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Pricing and Action Footer */}
                  <div className={styles.cardFooter}>
                    <div className={styles.priceDisplay}>
                      <span className={styles.priceLabel}>One-time purchase</span>
                      <span className={styles.priceAmount}>
                        {money(product.priceMinor, product.currency)}
                      </span>
                    </div>

                    <Link 
                      href={`/products/${product.slug}`} 
                      className={styles.cardActionBtn}
                      onClick={() => trackSelectItem({
                        item_id: product.slug,
                        item_name: product.title,
                        item_category: product.category,
                        price: product.priceMinor / 100,
                        currency: product.currency,
                        index: idx + 1,
                      })}
                    >
                      View Details
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
