import draft from '@/content/editorial/microsoft-fabric-real-time-intelligence-guide/draft.json';

// Published source fallback; the database remains authoritative for visibility.
const { blocks: editorialMetadata, ...article } = draft;
export const microsoftFabricRealTimeIntelligenceGuidePost = {
  ...article,
  id: article.slug,
  published: true,
  tags: editorialMetadata.seo.keywords,
};
