import type { DashboardItem } from './catalog';
export type DashboardKind = 'built' | 'reference' | 'concept';
export function dashboardDestination(item: DashboardItem) { return item.link || item.embed || ''; }
export function dashboardKind(item: DashboardItem): DashboardKind {
  const target = dashboardDestination(item);
  if (!target) return 'concept';
  if (item.isInternal || target.startsWith('/') || target.startsWith('https://excel.dattasable.com/')) return 'built';
  return 'reference';
}
export function filterDashboards(items: DashboardItem[], filters: { scope: string; category: string; tool: string; search: string }) {
  const query = filters.search.trim().toLowerCase();
  return items.filter(item => {
    const kind = dashboardKind(item);
    const excel = item.tool.toLowerCase().includes('excel') || item.tags.some(tag => tag.toLowerCase().includes('excel'));
    const scope = filters.scope === 'all' || (filters.scope === 'excel' ? kind === 'built' && excel : filters.scope === kind);
    return scope && (filters.category === 'All industries' || item.category === filters.category) && (filters.tool === 'All tools' || item.tool.toLowerCase().includes(filters.tool.toLowerCase())) && (!query || `${item.title} ${item.desc} ${item.tags.join(' ')} ${item.tool}`.toLowerCase().includes(query));
  });
}
