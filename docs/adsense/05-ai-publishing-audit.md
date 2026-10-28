# AI Content Studio Audit & Governance Policy Report

**Date:** 28 October 2026  
**Auditor:** Datta Sable AI Safety & Engineering  
**Branch:** `fix/adsense-content-quality-audit`  
**Target:** Google AdSense "Low-Value Content" Remediation (Phases 2 & 3)

---

## 1. Executive Summary

Autonomous AI-generated content generation without strict human verification creates substantial risk of duplicate topics, hallucinated technical references, and Google Search / AdSense policy violations for "thin or automated content."

Per PRD Section 8 and User Directive #2:
> "Disable autonomous AI article publishing. Require human approval and technical verification before publishing."

This report documents the architectural hardening and permanent deactivation of autonomous Mode C publishing across `dattasable.com`.

---

## 2. Hardening Measures Implemented

### 2.1 Configuration Hardening (`lib/ai/config.ts`)
- `DEFAULT_AI_SETTINGS.maxDailyAutonomousPublishes` reduced from `2` to `0`.
- `DEFAULT_AI_SETTINGS.operatingMode` locked to `ASSISTED` (human-in-the-loop).
- `OPERATING_MODES`: Deprecated Mode C `AUTONOMOUS`. All automated publishing triggers are deactivated.

### 2.2 Vercel Cron Pipeline Hardening (`app/api/cron/ai-publisher/route.ts`)
- Removed the automated autonomous candidate query and publication branch.
- In `GET /api/cron/ai-publisher`, autonomous count is hardcoded to 0 with explicit editorial logging:
  ```typescript
  // Mode C (Autonomous Publishing) is permanently disabled per editorial quality policy.
  // All AI-assisted articles require human editorial review and approval before publication.
  const autonomousCount = 0;
  ```

### 2.3 Background Publisher Lockout (`lib/ai/publishing.ts`)
- In `processDueSchedules()`, any scheduled draft with mode `AUTONOMOUS` is immediately intercepted, halted, and moved to `PENDING_APPROVAL`:
  ```typescript
  if (item.mode === 'AUTONOMOUS' || item.mode === 'DISABLED') {
    const msg = `Skipped draft ${item.draftId}: Autonomous publishing is permanently disabled. Human editorial review and approval required.`;
    errors.push(msg);
    await db.aiPublishingSchedule.update({
      where: { id: item.id },
      data: {
        status: 'PENDING_APPROVAL',
        lastError: 'Autonomous publishing is permanently disabled. Administrator review and approval required.',
      },
    });
    continue;
  }
  ```

### 2.4 Technical Quality Gates Before Publication (`lib/ai/publishing.ts`)
- Added mandatory technical verification gates in `approveAndPublishDraft` and `scheduleDraftForPublishing`:
  1. **Title Length:** Must be at least 10 characters.
  2. **Content Word Count:** Must be at least 500 characters (minimum threshold).
  3. **Slug Validation:** Must conform strictly to URL-safe kebab-case regex `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`.
  4. Fails loudly with an informative error if any criterion is unmet, preventing corrupted or incomplete content from reaching the public site.

### 2.5 Database System Setting Verification
- Executed database upsert setting `ai_studio_operating_mode` to `ASSISTED` in `SystemSetting`.

---

## 3. Human Editorial Workflow (Current Policy)

1. **Research & Drafting:** AI Studio operates in `ASSISTED` mode to generate research briefs, outlines, and initial drafts.
2. **Technical Review:** Datta Sable manually inspects:
   - Technical accuracy of code snippets (DAX, SQL, Python, Fabric).
   - Authoritative citations and benchmark data.
   - Diagram rendering and interactive elements.
3. **Manual Approval:** Only an authenticated administrator session can execute `approveAndPublishDraft` from the Admin Workspace.
4. **Google Search Console Indexing:** Once approved and verified, public routes are revalidated and submitted via official Indexing APIs.

