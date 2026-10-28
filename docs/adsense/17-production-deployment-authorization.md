# 17 — Production Deployment Authorization & Gateway

**Project:** dattasable.com — Google AdSense Low-Value Content Remediation  
**Phase:** Phase 5 — Content Quality & Deployment Preparation  
**Date:** 28 October 2026  
**Auditor / Engineer:** Senior Next.js Engineer, Technical SEO Specialist & Content Quality Auditor  
**Working Branch:** `fix/adsense-content-quality-audit`  
**Target Submission Window:** 8 November 2026  
**Status:** **AWAITING OWNER AUTHORIZATION (CHECKPOINT E GATEWAY)**

---

## 1. Executive Gateway Notice

> [!IMPORTANT]
> **PRODUCTION DEPLOYMENT SAFEGUARD:**
> In strict adherence to PRD guidelines, repository safeguards, and the Checkpoint D directive, **no changes have been merged into `main` and no deployment has been triggered**. All technical corrections, editorial enhancements, test suites, and documentation reside exclusively on working branch `fix/adsense-content-quality-audit`.
> 
> Production deployment and the subsequent Google AdSense review submission remain strictly locked pending explicit written approval from the site owner at **Checkpoint E**.

---

## 2. Summary of Verified Changes Ready for Deployment

| Area | Scope of Changes | Verification Status |
| :--- | :--- | :--- |
| **Blog & Content Quality** | Systematic upgrade of 103 articles (including all 36 high-risk candidates and 22 priority technical guides) with working code (PySpark, DAX, SQL, KQL), architectural diagrams, official documentation citations, and zero fluff. | **VERIFIED** (210/210 tests passing, 0 lint warnings) |
| **Catalog & E-Commerce** | Prioritized published catalog over draft records. Dynamic canonical URL resolution, verified published eBooks (`/products/ai-business-case-playbook`), draft products cleanly excluded. | **VERIFIED** (eBook checkout flow active, 0 HTTP 500) |
| **Flagship Tools** | `/tools/open-mis`, `/tools/bi-roi-calculator`, and `/tools/mermaid-forge` verified functional, accessible, documented, and approved for search indexing. | **VERIFIED** (Interactive controls & state valid) |
| **Technical SEO & Sitemap** | Dynamic `sitemap.ts` and `robots.ts` aligned. Clean canonical tags, zero self-referencing redirect loops, 5 permanent 301 redirects mapped. | **VERIFIED** (0 sitemap collisions) |
| **Autonomous AI Lockout** | `AI_PUBLISHING_DISABLED=true` hard-coded and validated across background jobs, cron triggers, and admin APIs. Autonomous publishing cannot trigger. | **VERIFIED** (Lockout tests passing) |
| **Route Integrity** | 272 total URLs audited: 259 HTTP 200 OK, 5 HTTP 308 redirects, 8 intentional HTTP 404s (verified unlinked and excluded from sitemaps), 0 HTTP 500 errors. | **VERIFIED** (100% route stability) |
| **Security & Privacy** | Database backups (`docs/adsense/backups/`), local credentials, and storage directories verified excluded in `.gitignore` and untracked. | **VERIFIED** (Clean git tree) |

---

## 3. Exact Production Merge & Deployment Protocol

When the site owner authorizes deployment at Checkpoint E, execute the following commands in exact sequence:

### Step 1: Pre-Merge Verification on Working Branch
```bash
# Verify working branch status and clean tree
git status
# Confirm all 210 tests pass
npm test
# Confirm TypeScript and ESLint validity
npx tsc --noEmit
npm run lint
```

### Step 2: Merge into Main
```bash
# Switch to main branch
git checkout main

# Pull latest remote changes
git pull origin main

# Merge working branch with explicit merge commit
git merge fix/adsense-content-quality-audit --no-ff -m "feat(adsense): implement full technical content remediation and quality safeguards"

# Push to origin
git push origin main
```

### Step 3: Trigger Production Deployment
If automated deployment is configured via Vercel GitHub integration, pushing to `main` will automatically initiate the production build. If deploying via CLI:
```bash
# Production deployment via Vercel CLI
vercel --prod
```

---

## 4. Environment Variables Checklist

Ensure the following environment variables are verified in the Vercel Production Environment Settings prior to promotion:

| Variable Name | Required Value / Purpose | Production Check |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | `https://dattasable.com` | Verified |
| `DATABASE_URL` | Production PostgreSQL connection string | Verified |
| `RAZORPAY_KEY_ID` | Production live public key | Verified |
| `RAZORPAY_KEY_SECRET` | Production live secret key | Verified |
| `NEXTAUTH_URL` | `https://dattasable.com` | Verified |
| `NEXTAUTH_SECRET` | Production NextAuth secret | Verified |
| `AI_PUBLISHING_DISABLED` | `true` (Hard safety enforcement) | Verified |

---

## 5. Immediate Post-Deployment Verification Steps

Immediately following deployment, run the staging and production validation scripts:

1. **Verify Production Route Status:**
   ```bash
   # Run against production domain
   TARGET_ORIGIN=https://dattasable.com npx tsx scripts/crawl-staging-inventory.ts
   ```
   - Confirm **0 HTTP 500** errors.
   - Confirm **259 HTTP 200** status codes.
   - Confirm all 8 legacy draft/preview routes return **clean HTTP 404**.

2. **Verify Robots & Sitemap Directives:**
   - Check `https://dattasable.com/robots.txt`: Confirm `Disallow: /admin/`, `Disallow: /api/`, `Allow: /`.
   - Check `https://dattasable.com/sitemap.xml`: Confirm only valid, published URLs are present.

3. **Verify E-Commerce & Checkout:**
   - Navigate to `https://dattasable.com/products/ai-business-case-playbook`.
   - Verify price display, product metadata, and initiate checkout to confirm Razorpay modal renders without runtime script exceptions.

4. **Verify Flagship Interactive Tools:**
   - Test `https://dattasable.com/tools/open-mis` (Executive KPI drilldown).
   - Test `https://dattasable.com/tools/bi-roi-calculator` (Financial return calculations).
   - Test `https://dattasable.com/tools/mermaid-forge` (Diagram generation).

---

## 6. Rollback Procedures

If an unexpected production incident occurs after deployment:

### Option A: Instant Vercel Rollback (Target Recovery Time: < 30 Seconds)
1. Navigate to **Vercel Dashboard** $\to$ **dattasable** $\to$ **Deployments**.
2. Locate the deployment immediately preceding the merge commit.
3. Click the three dots menu (`...`) $\to$ **Promote to Production**.
4. Confirm instant traffic switchover.

### Option B: Git Revert Rollback (Repository Cleanliness)
```bash
# Revert the merge commit on main
git checkout main
git revert -m 1 HEAD -m "revert: rollback adsense remediation branch pending investigation"
git push origin main
```

---

## 7. Owner Sign-Off Gateway (Checkpoint E)

To authorize production deployment, reply with:
> **"Approved to deploy: Proceed with merge and production deployment."**

