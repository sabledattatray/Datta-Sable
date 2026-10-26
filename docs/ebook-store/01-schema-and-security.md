# Phase 1 — schema and security

Implemented additively in `prisma/schema.prisma` and migration `20261026000100_ebook_store`:

- EbookProfile extends CommerceProduct; categories and primary/secondary links remain separate from the existing product taxonomy.
- EbookAsset extends CommerceResource with SHA-256, actual bytes, original sanitized filename, MIME and version. Paid file location remains the existing private resource pathname.
- Existing CommerceOrderItem gains nullable resourceIdSnapshot. New purchases pin the actual file; replacement uploads keep historical resource rows/files.
- Hashed access links, hashed guest sessions, hashed download grants, and durable guest email jobs. Raw access tokens are never stored. Mail links are regenerated using HMAC with a dedicated server secret and random job ID.
- Unique SKU, category slugs, primary category and hashes; foreign keys restrict deletion of financial/assets history; checks enforce page count, PDF MIME/hash and grant usage limits.

`EBOOK_STORE_ENABLED` defaults off; `EBOOK_STORE_NAV_ENABLED` is an additional readiness gate for the global navigation. Admin studio stays accessible to verified ADMIN accounts. Existing ADMIN is the only role granted ebook read/create/edit/publish/archive/upload/orders/refund/settings capabilities; ordinary users receive none. Delegated staff permission assignments are not implemented.

Migration evidence: tests/ebooks.test.mjs applies ALL repository migrations to disposable PGlite, creates a draft book, verifies prices/defaults/foreign keys/uniqueness and checks the additive snapshot column. No configured database was changed. PostgreSQL at the configured host was unreachable in this session.

Apply only after database backup and review: `npx prisma migrate deploy`, then `npx prisma generate`. Do not use `db push` or reset existing data. On an older installation without migration history, follow the repository's existing baseline procedure before migrate deploy; do not mark unknown migrations applied blindly.

Rollback: disable both feature flags and restore previous application release. Keep tables, snapshot column, assets and orders. After any purchase, never drop entitlement/financial history or delete historical private PDF versions. Test restoring DB and private Blob inventory together. A down migration is intentionally not supplied.
