# Blog campaigns and Resend

## What changed

- Resend is the default mail provider. SMTP is used only when explicitly selected with EMAIL_PROVIDER=smtp; credentials no longer silently fall back to Gmail placeholders.
- Publishing or editing a CMS article never queues or sends email. Campaigns are manual-only: select a published article, send a test, then explicitly confirm a broadcast in the marketing dashboard.
- Next.js 15 after() owns the delivery work after the response. Campaigns and recipient outcomes persist in an outbox, instead of disappearing with a detached promise. Routes allow 300 seconds; the worker processes up to 180 messages within a 200-second work budget.
- The worker sends one message per recipient, at a controlled pace, with a stable Resend idempotency key. A database lease prevents overlapping workers. Accepted messages are never resent by Resume remaining. Failed messages can be retried; ambiguous outcomes and interrupted in-flight messages are held for manual review to avoid duplicates.
- Manual campaigns use an idempotent request ID and require a successful test of the exact current draft. Provider acceptance is not proof of inbox delivery.
- Registered user and subscriber emails are normalized and deduplicated. Persistent opt-outs exclude both sources. Signing out or deleting a subscription does not delete a registered account.
- Database posts override static article metadata. Drafts are excluded. Static source-code articles can be shared manually; neither CMS publication nor a Git deployment triggers notification.

## Manual article selection

The campaign studio lists every published article, newest first, with title/category search and a Use article action. There is no 200-post cutoff. Selecting an article fills its title, summary, image and link; drafts are excluded. Selection, preview and publishing never send mail. Send a test of the exact draft, then review and explicitly confirm the audience broadcast. Each address receives an individual message.

## Deployment configuration

Set these server-side variables in Vercel Production, then redeploy:

```text
RESEND_API_KEY=<sending-enabled API key>
RESEND_FROM_EMAIL=Datta Sable <hello@dattasable.com>
NEXTAUTH_SECRET=<the existing stable authentication secret>
CAMPAIGN_UNSUBSCRIBE_SECRET=<optional separate stable random signing secret>
CRON_SECRET=<a separate random secret for scheduled recovery>
```

Verify dattasable.com in Resend. No credential belongs in Git or a NEXT_PUBLIC variable. Keep the unsubscribe secret stable so existing signed links continue to work. The configured sender must be permitted by the Resend key. Local .env.local and Vercel settings are independent. Remove EMAIL_PROVIDER=smtp if migrating an existing deployment to Resend.

The four additive Marketing tables are represented in prisma/schema.prisma. Runtime initialization uses only CREATE TABLE/INDEX IF NOT EXISTS and an idempotent worker-row insert. It does not modify user or article data. The database role needs permission to create these tables; if application DDL is restricted, run the SQL statements in CAMPAIGN_SCHEMA from lib/campaigns.ts through the deployment's database maintenance process before enabling the feature. No prisma db push or destructive migration is needed for this change.

## Recovery scheduling

The after() worker starts only after an explicitly confirmed manual broadcast. Publishing does not invoke it. For recovery after an interrupted invocation, configure a scheduler to GET:

```text
https://dattasable.com/api/cron/campaigns
Authorization: Bearer <CRON_SECRET>
```

Choose a frequency supported by the hosting plan, such as every five minutes. No paid plan or recurring job is provisioned automatically by this change. The dashboard also offers Resume remaining. A cron request without its secret is rejected. Pending deliveries stay in the database when no provider is configured. Provider authentication/rate errors stop the current pass; fix the problem, then Resume remaining. Unknown outcomes need review in Resend activity before any deliberate resend.

## Verification

```powershell
npm run test:campaigns
npx tsc --noEmit
npm run build
```

The campaign tests use an isolated PGlite PostgreSQL engine and mocked provider responses. They do not read production recipients or send actual email. Before broadcasting, send one real test to the owner, check the inbox/spam folder, and confirm the provider activity. The dashboard requires confirmation before a manual audience broadcast. Publication and draft-to-published transitions are tested to produce zero campaigns and zero provider calls.

## Unsubscribe behaviour

The message includes an individual signed unsubscribe URL and List-Unsubscribe headers. GET displays the confirmation page; it does not unsubscribe a reader merely because a mail scanner followed a link. Signed one-click POST requests and the visible form save a persistent suppression and cancel pending deliveries for that address. Existing opt-outs that were previously deleted without a suppression record cannot be reconstructed by this change.
## Development preview

The development server can show a fictional campaign without admin data or sending capability:

```powershell
$env:CAMPAIGN_DESIGN_PREVIEW="1"
npm run dev -- --port 3015
```

Open /campaign-design-preview. The preview always returns 404 in production. To check production builds without stopping a running development server, set NEXT_BUILD_DIR=.next-campaign-check before npm run build. These output folders are ignored by Git.
