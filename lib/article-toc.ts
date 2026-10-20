import type { ArticleHeading } from './article-navigation';

export type ArticleTocGroup = { heading: ArticleHeading; children: ArticleHeading[] };

export function articleHeadingLabel(text: string): string {
  // Navigation supplies its own numbering; retain years and unnumbered titles.
  return text.replace(/^(?:\d+(?:\.\d+)*[.)]|\d+(?:\.\d+)+)\s+/, '');
}

export function groupArticleHeadings(headings: ArticleHeading[]): ArticleTocGroup[] {
  const groups: ArticleTocGroup[] = [];
  for (const heading of headings) {
    if (heading.level === 2 || !groups.length) groups.push({ heading, children: [] });
    else groups[groups.length - 1].children.push(heading);
  }
  return groups;
}

export function filterArticleHeadings(groups: ArticleTocGroup[], query: string): ArticleTocGroup[] {
  const normalize = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const needle = normalize(query.trim());
  if (!needle) return groups;
  return groups.flatMap(group => {
    if (normalize(group.heading.text).includes(needle)) return [group];
    const children = group.children.filter(heading => normalize(heading.text).includes(needle));
    return children.length ? [{ ...group, children }] : [];
  });
}
