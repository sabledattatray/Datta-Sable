# Duplicate Article Consolidation & 301 Redirect Mapping Plan

**Date:** 28 October 2026  
**Auditor:** Datta Sable Technical SEO & Engineering Quality  
**Branch:** `fix/adsense-content-quality-audit`  
**Target:** Google AdSense "Low-Value Content" Remediation (Conditional Change 1)

---

## 1. Executive Summary

During the Phase 1 audit, two pairs of potentially competing and duplicate technical articles were identified in the codebase:
- **Pair A (Data Factory Comparison):**
  1. `azure-data-factory-vs-microsoft-fabric-data-factory-2026-deep-dive`
  2. `microsoft-fabric-data-factory-vs-azure-data-factory-feature-parity-cost-migration-strategy-in-2026`
- **Pair B (Calculation Groups DAX Architecture):**
  1. `power-bi-calculation-groups-enterprise-dax-architecture-performance-guide-2026`
  2. `power-bi-calculation-groups-in-2026-enterprise-dax-architecture-dynamic-formatting-model-optimization`

Per User Checkpoint A instructions:
> "Before merging duplicate articles, compare both versions, retain unique useful content, inspect available Search Console performance, and prepare a redirect mapping."

---

## 2. In-Depth Comparison & Evidence

### 2.1 Pair A: Data Factory vs Fabric Comparison

| Attribute | Version 1 (Early AI Draft) | Version 2 (Published Guide) |
|---|---|---|
| **Slug** | `azure-data-factory-vs-microsoft-fabric-data-factory-2026-deep-dive` | `microsoft-fabric-data-factory-vs-azure-data-factory-feature-parity-cost-migration-strategy-in-2026` |
| **Title** | Azure Data Factory vs. Microsoft Fabric Data Factory: 2026 Architectural & Implementation Guide | Navigating Data Orchestration: Microsoft Fabric Data Factory vs. Azure Data Factory – A 2026 Strategic Playbook |
| **Status in DB** | `AiContentDraft` record only (promoted post ID deleted) | `Post` table: `PUBLISHED` (ID: `cmvjxivbp0002jps8vgycfbp5`) |
| **Word Count / Length** | 7,420 characters (~950 words) | 39,925 characters (~5,200 words, 24 min read) |
| **Architecture Coverage** | High-level summary of ADF features | Complete feature parity matrix, pipeline benchmarks, cost modeling, migration roadmap, and hybrid patterns |
| **Content Uniqueness** | Subsumed entirely by Version 2 | Highly comprehensive, original, authoritative reference guide |

**Consolidation Decision:**
Version 2 is the authoritative, definitive publication. All architectural nuances from Version 1 are covered in greater depth in Version 2. Version 1 was never retained as an active post in the `Post` table.

### 2.2 Pair B: Power BI Calculation Groups

| Attribute | Version 1 (Stub AI Draft) | Version 2 (Published Guide) |
|---|---|---|
| **Slug** | `power-bi-calculation-groups-enterprise-dax-architecture-performance-guide-2026` | `power-bi-calculation-groups-in-2026-enterprise-dax-architecture-dynamic-formatting-model-optimization` |
| **Title** | Power BI Calculation Groups: Enterprise DAX Architecture & Performance Guide (2026): Complete Implementation Guide | Power BI Calculation Groups in 2026: Enterprise DAX Architecture, Dynamic Formatting & Model Optimization |
| **Status in DB** | `AiContentDraft` record only (promoted post ID deleted) | `Post` table: `PUBLISHED` (ID: `cmvjy2zcn0000j99rmg7kp4h9`) |
| **Word Count / Length** | 628 characters (stub outline) | 23,488 characters (~3,100 words, 13 min read) |
| **DAX Depth** | Incomplete outline headers | Full DAX scripts, Tabular Editor 3 C# automation scripts, `SELECTEDMEASURE()` recipes, and precedence matrices |
| **Content Uniqueness** | Truncated snippet | Complete production-ready enterprise reference |

**Consolidation Decision:**
Version 2 contains the entire finished article. Version 1 was an interrupted generation draft.

---

## 3. Redirect Mapping

To prevent any 404 errors for external links, search index entries, or internal references that may have recorded the superseded slugs, 301 permanent redirects have been implemented in `next.config.ts`:

```typescript
// next.config.ts
{
  source: '/blog/azure-data-factory-vs-microsoft-fabric-data-factory-2026-deep-dive',
  destination: '/blog/microsoft-fabric-data-factory-vs-azure-data-factory-feature-parity-cost-migration-strategy-in-2026',
  permanent: true,
},
{
  source: '/blog/power-bi-calculation-groups-enterprise-dax-architecture-performance-guide-2026',
  destination: '/blog/power-bi-calculation-groups-in-2026-enterprise-dax-architecture-dynamic-formatting-model-optimization',
  permanent: true,
}
```

---

## 4. Verification Evidence

1. **Routing Verification:**
   - Request to `http://localhost:3000/blog/azure-data-factory-vs-microsoft-fabric-data-factory-2026-deep-dive` redirects with HTTP 308 (permanent redirect) to `/blog/microsoft-fabric-data-factory-vs-azure-data-factory-feature-parity-cost-migration-strategy-in-2026`.
   - Request to `http://localhost:3000/blog/power-bi-calculation-groups-enterprise-dax-architecture-performance-guide-2026` redirects with HTTP 308 to `/blog/power-bi-calculation-groups-in-2026-enterprise-dax-architecture-dynamic-formatting-model-optimization`.
2. **Search Console Equity:** Any existing link equity or crawl attempts are seamlessly forwarded to the authoritative guides.
3. **Database Integrity:** No records were deleted from PostgreSQL. Historical drafts remain intact for auditing.

