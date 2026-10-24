/** A missing query must never be presented as a successful zero-count query. */
export function publishingProgress(published: number | null | undefined, drafts: number | null | undefined) {
  if (published == null || drafts == null) return null;
  const total = published + drafts;
  return total === 0 ? 0 : Math.round(published / total * 100);
}
