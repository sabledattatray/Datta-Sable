# DATTA SABLE — AI CONTENT AUTOMATION & MCP PLATFORM
## Production Implementation PRD — Version 2.0

**Website:** https://dattasable.com  
**Project:** Unified AI Content Intelligence & Autonomous Publishing Platform  
**Development Agent:** Google Antigravity  
**Priority:** High  
**Implementation Approach:** Existing-System Integration, Not Rebuilding  
**Production Deployment:** Requires Explicit Approval

---

# 1. PROJECT OBJECTIVE

Implement a secure, production-grade AI content management and publishing platform inside the existing dattasable.com application.

The system must support:

1. Automatic topic discovery.
2. Keyword and content opportunity research.
3. Research-backed article generation.
4. Long-form technical blog writing.
5. Automatic SEO metadata preparation.
6. Internal linking recommendations.
7. Featured image generation or selection.
8. Content quality and factual verification.
9. Duplicate article detection.
10. Automatic draft creation.
11. Administrator approval workflows.
12. Scheduled article publishing.
13. Optional fully autonomous publishing.
14. Google Analytics 4 integration.
15. Google Search Console integration.
16. Existing content refresh recommendations.
17. MCP tools for AI assistants.
18. Usage, performance, and cost monitoring.
19. Complete administrative control.
20. Audit logging, recovery, and rollback.

The system must reuse existing website infrastructure wherever technically appropriate.

Do not rebuild the existing CMS, database, authentication system, or SEO engine.

---

# 2. CONFIRMED TECHNOLOGY STACK

The following information has been established:

| Component | Technology |
|---|---|
| Frontend and backend | Next.js |
| ORM | Prisma |
| Production database | Prisma Postgres |
| Deployment | Vercel |
| Repository | GitHub |
| Domain and DNS | Hostinger |
| Existing content management | Custom CMS |
| AI development environment | Antigravity |

The existing Prisma Postgres database is operational and contains published blog content.

Do not migrate to Neon, Turso, or another database as part of this project.

## 2.1 Existing Prisma Post Model

The following fields were observed in Prisma Studio:

| Field | Type |
|---|---|
| id | Text |
| title | Text |
| slug | Text |
| content | Text |
| excerpt | Text |
| category | Text |
| blocks | JSON |
| image | Text |
| published | Boolean |
| readTime | Integer |
| createdAt | Timestamp |
| updatedAt | Timestamp |
| date | Text |
| color | Text |
| icon | Text |

These fields are observations from Prisma Studio, not a substitute for inspecting the actual Prisma schema.

The implementation must verify:

- Required versus optional fields.
- Default values.
- Unique constraints.
- Database indexes.
- Relationships.
- Existing publication rules.
- Existing slug generation.
- Existing article rendering.
- Existing CMS save/update functions.
- Existing API authorization.

Do not assume that `published = false` is sufficient for draft visibility control until verified.

---

# 3. NON-NEGOTIABLE PRODUCTION SAFETY

Before implementation:

1. Inspect the complete repository.
2. Inspect the actual Prisma schema.
3. Inspect existing CMS functionality.
4. Inspect authentication and authorization.
5. Inspect current SEO architecture.
6. Identify all existing publishing workflows.
7. Review current Vercel limitations.
8. Identify database backup and recovery options.
9. Establish staging or isolated test infrastructure.
10. Produce a written implementation plan.

Never:

- Reset the production database.
- Delete existing articles.
- Overwrite published content without version history.
- Change production environment variables without approval.
- Expose credentials.
- Introduce unrestricted database access.
- Modify DNS unnecessarily.
- Deploy untested code.
- Automatically publish during initial development.
- Run uncontrolled background jobs.
- Assume third-party APIs have unlimited free usage.

Existing website functionality must remain intact.

---

# 4. ADMIN MODULE — AI CONTENT STUDIO

Create a new administrative section:

**AI Content Studio**

Recommended navigation:

- Overview
- Content Opportunities
- Topic Research
- AI Article Generator
- Draft Management
- Editorial Calendar
- Publishing Queue
- SEO Intelligence
- Internal Link Manager
- Content Refresh
- AI Media
- Analytics
- Automation Settings
- MCP Integrations
- AI Provider Settings
- Usage & Costs
- Quality Reports
- Activity Logs

Reuse existing modules when equivalent functionality is already available.

Follow the current website's admin design system.

All interface controls must be functional.

---

# 5. AUTOMATED TOPIC DISCOVERY

Implement topic discovery using:

- Administrator-defined subjects.
- Existing blog categories.
- Search Console query performance.
- Existing content gaps.
- Credible external research sources.
- Relevant industry developments.

Initial categories:

- Power BI
- Microsoft Fabric
- Advanced Excel
- SQL Server
- Data Analytics
- Business Intelligence
- AI and Automation
- Cloud Computing
- Cybersecurity
- Professional Certifications
- Data Engineering
- Career Development

Categories must remain configurable.

## Topic Opportunity Score

Evaluate:

- Audience relevance.
- Search demand evidence.
- Existing content overlap.
- Search intent.
- Topical authority.
- Research quality.
- Content freshness.
- Internal linking opportunities.

Never fabricate keyword search volume or ranking difficulty.

Where measurements are unavailable, label results as estimates or incomplete.

---

# 6. RESEARCH ENGINE

Every article must begin with a research brief.

Required research information:

- Proposed title.
- Reader intent.
- Target audience.
- Primary questions.
- Verified factual claims.
- Relevant official documentation.
- Source URLs.
- Source dates where available.
- Research retrieval date.
- Potential factual conflicts.
- Suggested structure.

Prefer primary and authoritative sources.

For Microsoft technology content, prioritize official Microsoft documentation.

Do not invent:

- Product capabilities.
- Certification requirements.
- Prices.
- Statistics.
- Interviews.
- Personal testing experience.
- Source citations.

Critical unresolved factual claims must block autonomous publication.

---

# 7. AI ARTICLE GENERATION

Support:

- Tutorials.
- Technical guides.
- Comparisons.
- Certification guides.
- Troubleshooting.
- Career articles.
- Industry analysis.
- Reference documentation.
- Verified case studies.

## Article Length

Configurable targets:

- Standard: 1,000–1,800 words.
- Comprehensive: 1,800–3,000 words.
- Deep technical: 3,000+ words.

Article length must be based on reader needs, not artificial keyword targets.

## Content Requirements

Generate appropriate:

- H1 title.
- Introduction.
- Key takeaways.
- Table of contents.
- H2/H3 sections.
- Practical examples.
- Tables.
- Code samples where useful.
- FAQs.
- Conclusion.
- Sources and further reading.

Content must be original, useful, coherent, and supported by credible information.

Do not reproduce copyrighted source material.

---

# 8. EXISTING POST TABLE INTEGRATION

The AI system must integrate through existing CMS application services.

Do not let AI agents perform unrestricted direct database writes.

## 8.1 Draft Creation

After validating the actual schema and CMS behavior:

1. Generate article content.
2. Validate required fields.
3. Generate a unique slug.
4. Prepare an excerpt.
5. Determine category.
6. Calculate estimated reading time.
7. Prepare featured image.
8. Generate SEO metadata.
9. Run quality checks.
10. Save the article through the existing CMS draft workflow.

If the current application uses `published = false` to represent a draft, reuse that behavior.

Do not assume unpublished content is inaccessible without testing public routes and APIs.

## 8.2 Existing Content Fields

Preserve the established meaning of:

- `content`
- `blocks`
- `date`
- `image`
- `readTime`
- `published`

Do not populate `blocks` with arbitrary JSON.

Inspect the existing block schema before using structured content.

## 8.3 Additional Data

Store AI-specific workflow data in separate related models where needed.

Examples:

- AIContentJob
- AIResearchBrief
- AIQualityReport
- AIContentVersion
- AIPublishingSchedule
- AIProviderUsage
- AIAuditLog

Names are conceptual and must be adapted to the existing schema.

Avoid duplicating fields already available elsewhere.

---

# 9. SEO AUTOMATION

Implement:

- SEO title generation.
- Meta description generation.
- Slug validation.
- Canonical URL validation.
- Heading structure checks.
- Internal linking.
- Image alternative text.
- Open Graph metadata.
- Appropriate JSON-LD structured data.
- Sitemap validation.
- Indexability checks.

Integrate with the existing SEO Intelligence and Knowledge Graph functionality where available.

Do not introduce conflicting metadata generators.

SEO checks should follow current search engine guidance.

Do not claim guaranteed rankings.

---

# 10. DUPLICATE ARTICLE DETECTION

Before creating an article:

- Compare existing titles.
- Check slugs.
- Compare article topics.
- Compare content similarity.
- Check unpublished drafts.
- Check scheduled content.
- Detect keyword cannibalization risks.

If a similar article exists, recommend refreshing or expanding it instead of automatically creating another competing article.

Never overwrite the existing article without approval.

---

# 11. FEATURED IMAGES

Support:

- Existing media library.
- Vercel Blob storage where appropriate.
- Licensed media providers.
- Authorized AI image-generation providers.
- Original diagrams.

Required controls:

- Image optimization.
- Appropriate dimensions.
- File size checks.
- Alt text.
- Attribution where necessary.
- Licensing verification.
- Duplicate asset detection.

Do not create fake screenshots of real software interfaces.

Image generation must be optional because external providers may incur costs.

---

# 12. CONTENT QUALITY GATES

Implement validation for:

- Factual support.
- Technical correctness.
- Source reliability.
- Originality of expression.
- Reader usefulness.
- Heading structure.
- SEO completeness.
- Link validity.
- Duplicate content.
- Publishing authorization.

Use deterministic checks where feasible.

AI quality scores are advisory, not guarantees.

Block autonomous publishing if critical issues remain unresolved.

---

# 13. EDITORIAL APPROVAL

Support three operating modes.

## Mode A — Manual

Administrator starts every workflow.

## Mode B — Assisted Automation

The system automatically researches and generates drafts.

Administrator reviews and approves publication.

**Default mode: B**

## Mode C — Autonomous Publishing

The system automatically researches, writes, validates, schedules, and publishes content.

Mode C requires:

- Explicit administrator opt-in.
- Verified publishing permissions.
- Successful quality gates.
- Duplicate prevention.
- Daily publication limits.
- Budget controls.
- Audit logs.
- Emergency pause control.

Do not enable Mode C during initial deployment.

---

# 14. AUTOMATION SCHEDULER

Build a reliable scheduling system that operates independently of the administrator's personal computer.

Default settings:

- Timezone: Asia/Kolkata.
- One article draft per day.
- Automatic research enabled.
- Automatic SEO enabled.
- Automatic publishing disabled.
- Manual approval required.

The administrator must be able to change:

- Frequency.
- Categories.
- Publishing windows.
- Concurrency.
- Monthly budget.
- Approval mode.
- Notifications.

## Vercel Compatibility

Inspect the actual Vercel plan and execution limits.

Do not assume unlimited cron jobs or long-running functions.

Use:

- Scheduled triggers.
- Persistent workflow state.
- Idempotent jobs.
- Bounded execution steps.
- Resumable processing.
- Retry limits.
- Failure logging.

If Vercel alone cannot support the workflow reliably within the available plan, propose an alternative architecture before implementing it.

Do not silently introduce paid infrastructure.

---

# 15. MCP SERVER

Implement a secure MCP server compatible with the existing Next.js backend.

Use an official MCP SDK and a supported transport.

Evaluate a secured route such as:

`/api/mcp`

The MCP server must expose authorized application services rather than raw database access.

## Proposed Tools

### Research
- discover_topics
- analyze_content_gaps
- create_research_brief

### Content
- generate_article_draft
- improve_article
- detect_duplicate_article
- generate_seo_metadata
- suggest_internal_links

### CMS
- list_articles
- get_article
- save_draft
- list_pending_approvals
- schedule_approved_article
- publish_approved_article

### Analytics
- analyze_ga4_performance
- analyze_search_console_data
- generate_content_report

### Operations
- get_automation_status
- get_usage_report
- pause_automation
- get_execution_logs

Implement tool-level authorization.

Do not expose privileged operations to unauthenticated clients.

Treat external web content as untrusted.

Prevent prompt injection from triggering administrative actions.

---

# 16. AI PROVIDER INTEGRATION

Create a configurable AI provider layer.

Support appropriate compatible models and APIs.

Configuration must include:

- Provider.
- Model.
- API credentials.
- Token limits.
- Timeout.
- Retry policy.
- Cost estimate.
- Monthly spending limit.
- Fallback behavior.

Keep credentials server-side.

Allow separate models for research, drafting, and review if beneficial.

Do not assume free AI API access is unlimited.

Do not automatically purchase credits.

---

# 17. GOOGLE ANALYTICS 4

Integrate using authorized GA4 APIs.

Analyze:

- Article traffic.
- Engagement.
- Landing pages.
- Traffic sources.
- Geographic distribution.
- Device categories.
- Conversion events where configured.

Display actual reporting periods.

Do not fabricate analytics values.

Respect provider quotas and data limitations.

---

# 18. GOOGLE SEARCH CONSOLE

Integrate authorized Search Console data.

Analyze:

- Clicks.
- Impressions.
- CTR.
- Average position.
- Search queries.
- Page performance.
- Declining content.
- Content opportunities.

Use these signals to propose new articles and updates.

Do not treat Search Console metrics as guaranteed predictions of future traffic.

---

# 19. CONTENT REFRESH ENGINE

Periodically review existing articles.

Detect:

- Outdated technical information.
- Broken links.
- Expired offers.
- Changed certification requirements.
- Missing sources.
- Weak content sections.
- Relevant new internal links.

Generate proposed revisions.

Preserve existing URLs and version history.

Default to administrator approval before modifying published content.

---

# 20. USAGE AND COST CONTROL

Build an admin dashboard showing:

- AI provider usage.
- Input and output tokens.
- Estimated costs.
- Article generation counts.
- Failed jobs.
- Monthly spending.
- Provider errors.
- Remaining configured budget.

Enforce a hard spending limit wherever the application controls requests.

Clearly distinguish estimated costs from actual provider billing.

---

# 21. SECURITY REQUIREMENTS

Mandatory:

- Existing authentication integration.
- Role-based access control.
- Server-side secrets.
- Restricted database permissions.
- MCP tool authorization.
- Input validation.
- Rate limiting.
- Audit logging.
- XSS prevention.
- SSRF protection.
- Prompt-injection defenses.
- Secure scheduler authentication.
- Backup and recovery procedures.
- Production deployment approval.

No unrestricted SQL execution.

No uncontrolled production writes.

No exposure of private user or applicant information to AI providers without a legitimate, authorized need.

---

# 22. TESTING

Implement unit, integration, security, and end-to-end tests.

Test:

1. Topic discovery.
2. Research retrieval.
3. Draft generation.
4. SEO metadata.
5. Slug uniqueness.
6. Duplicate detection.
7. CMS draft saving.
8. Approval permissions.
9. Scheduled publication.
10. MCP authentication.
11. Cost limits.
12. Provider failures.
13. Retry behavior.
14. Rollback procedures.
15. Existing article compatibility.

Use staging or isolated test data.

Never test destructive operations against production.

---

# 23. IMPLEMENTATION PHASES

## Phase 0 — Repository Audit

Inspect actual code, Prisma schema, CMS, authentication, and infrastructure.

Produce a discovery report.

Do not modify production.

## Phase 1 — Backend Foundation

Implement workflow models, services, provider abstraction, and audit logging.

## Phase 2 — AI Research and Writing

Implement topic discovery, research briefs, article generation, and draft persistence.

## Phase 3 — SEO Intelligence

Implement metadata, internal linking, duplicate detection, and quality checks.

## Phase 4 — Admin Interface

Implement AI Content Studio, approval queue, editorial calendar, and settings.

## Phase 5 — MCP Integration

Implement authenticated MCP tools and compatible AI client configuration.

## Phase 6 — Scheduling

Implement durable background workflows and approved publication scheduling.

## Phase 7 — Analytics

Integrate GA4, Search Console, and content refresh recommendations.

## Phase 8 — Production Hardening

Complete security, performance, migration, backup, and deployment validation.

---

# 24. ACCEPTANCE CRITERIA

The implementation is complete only when:

- Existing website features still work.
- Existing articles remain intact.
- Existing article URLs are preserved.
- Prisma schema changes are safe.
- AI drafts save successfully.
- Drafts remain private.
- SEO metadata is generated correctly.
- Duplicate detection works.
- Approval workflow works.
- Scheduled publishing works.
- MCP access is authenticated.
- Usage limits are enforced.
- Critical tests pass.
- Staging deployment succeeds.
- Documentation is complete.
- Production deployment is approved.

Any unimplemented or untested feature must be clearly identified.

---

# 25. FINAL INSTRUCTIONS TO ANTIGRAVITY

Act as a senior Next.js architect, Prisma engineer, AI systems engineer, MCP specialist, security engineer, and technical SEO specialist.

Your task is to implement this PRD within the existing dattasable.com repository.

Do not create a separate blogging application.

Do not migrate the production database.

Do not replace the existing CMS.

Do not duplicate existing SEO functionality.

Do not modify existing published articles without authorization.

Do not perform destructive database migrations.

Do not deploy automatically.

Before implementation, produce:

1. Existing architecture discovery report.
2. Confirmed Prisma schema analysis.
3. CMS integration plan.
4. MCP security architecture.
5. AI provider and cost plan.
6. Background processing feasibility assessment.
7. Database migration and rollback plan.
8. Detailed implementation checklist.

After completing the audit, implement in small, tested phases.

Preserve existing functionality and maintain clear documentation.

**Target Outcome:** A secure, integrated AI Content Studio capable of researching, drafting, optimizing, scheduling, and optionally publishing high-quality articles on dattasable.com, with MCP connectivity, analytics, editorial control, and comprehensive operational safeguards.

**END OF PRD — VERSION 2.0**