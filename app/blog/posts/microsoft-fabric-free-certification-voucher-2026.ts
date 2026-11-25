import draft from '@/content/editorial/microsoft-fabric-free-certification-voucher-2026/draft.json';

// Published source fallback; the database remains authoritative for visibility.
const { blocks: editorialMetadata, ...article } = draft;
export const microsoftFabricFreeCertificationVoucher2026Post = {
  ...article,
  id: article.slug,
  published: true,
  tags: editorialMetadata.seo.keywords,
};
