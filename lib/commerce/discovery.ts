import { PRODUCT_CATEGORIES } from './catalog';
export type CatalogItem = { id: string; slug: string; title: string; excerpt: string; category: string; technologies: string[]; priceMinor: number; currency: string; createdAt: string; readiness: string; status: string };
export const SORT_OPTIONS = ['newest', 'price-asc', 'price-desc', 'alpha'] as const;
export type DiscoveryFilters = { q: string; category: string; technology: string; availability: string; sort: string };
export function categoryFor(category: string) {
  const text = category.toLowerCase();
  const patterns: Record<string, RegExp> = { certifications: /fabric|certification|study/, 'excel-mis': /excel|mis/, powerbi: /power\s?bi/, 'sql-data': /sql|data project/, automation: /automation|python tool/, bundles: /bundle|toolkit/ };
  return PRODUCT_CATEGORIES.find(c => c.title.toLowerCase() === text || c.slug === text || c.id === text) || PRODUCT_CATEGORIES.find(c => patterns[c.id]?.test(text));
}
export function categoryCounts(products: CatalogItem[]) {
  const counts: Record<string, number> = {};
  for (const p of products.filter(p => p.status === 'PUBLISHED')) { const c = categoryFor(p.category); if (c) counts[c.slug] = (counts[c.slug] || 0) + 1; }
  return counts;
}
export function filterProducts<T extends CatalogItem>(products: T[], filters: DiscoveryFilters): T[] {
  const q = filters.q.trim().toLocaleLowerCase();
  return products.filter(p => p.status === 'PUBLISHED'
    && (!filters.category || filters.category === 'all' || categoryFor(p.category)?.slug === filters.category)
    && (!filters.technology || filters.technology === 'all' || p.technologies.includes(filters.technology))
    && (!filters.availability || filters.availability === 'all' || p.readiness === filters.availability)
    && (!q || [p.title, p.excerpt, p.category, ...p.technologies].some(s => s.toLocaleLowerCase().includes(q))))
    .sort((a, b) => {
      // Group currencies: nominal prices cannot be converted without an approved rate.
      if (filters.sort.startsWith('price-')) return a.currency.localeCompare(b.currency) || (filters.sort === 'price-asc' ? a.priceMinor - b.priceMinor : b.priceMinor - a.priceMinor) || a.title.localeCompare(b.title);
      return filters.sort === 'alpha' ? a.title.localeCompare(b.title) : Date.parse(b.createdAt) - Date.parse(a.createdAt) || a.title.localeCompare(b.title);
    });
}
