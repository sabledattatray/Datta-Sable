# Production deployment checklist

Production approval is still required. Nothing in this checklist authorizes deployment, deleting old deployments, purging caches or rewriting Git history.

## Before approval

- Review the master PDF/DOCX, both corrected Mumbai locations, canonical facts, local screenshots and validation reports.
- Confirm the specialist files and previous default are preserved in the private local archive and backups are recoverable.
- Confirm no PDF/DOCX except the public master fallback is included in public assets or browser bundles.
- Review the diff: this workspace also contains earlier ebook changes. Do not include unrelated unfinished work by accident.
- Configure a dedicated private Blob store using `RESUME_PRIVATE_BLOB_READ_WRITE_TOKEN` and `RESUME_PRIVATE_BLOB_STORE_ID`. An explicitly configured existing private commerce store can be used through `COMMERCE_BLOB_*`; never use the generic public media token. Configure credentials directly in Vercel and keep them server-only.
- Preserve current production and storage state for rollback. An older deployment can re-expose its previously public files.
- Verify NextAuth configuration, a real verified admin account, live database role checks, session revocation and production origin. No credentials or accounts were changed locally.

## After explicit deployment approval

1. Run the complete `npm run build` with the intended environment, including worker copy and final packaging guard. Local compile-mode verification does not replace the full production build/prerender.
2. Stage the exact reviewed release on Vercel without changing production domains, where supported. Verify the intended team, project, commit and environment.
3. Check the fallback master, About/Portfolio and mobile layouts. Retired `/resumes/*` paths must return 410; specialized documents must not appear in public HTML or sitemaps.
4. Sign in as a real verified administrator and upload the four reviewed PDF/DOCX pairs through the protected manager to initialize cloud storage. Local documents are deliberately not deployed. Do not use the media library for these files.
5. Verify private access mode, checksums and anonymous direct-storage denial. Test metadata, PDF, DOCX, HEAD and range requests as an admin, a normal user and a signed-out visitor.
6. Verify replacement/restoration with controlled copies: both formats survive, stale revisions fail, old facts cannot be restored and the public route selects only the master.
7. Sign out: the viewer must clear and old private URLs must reject new requests. Previously downloaded bytes cannot be recalled.
8. Verify no-store/CDN headers, private-route noindex/noarchive, absence of private documents from traces and no raw storage URLs in client bundles.
9. Promote only the tested release after explicit approval. Compare live documents with reviewed SHA-256 values.

## Historical exposure needs a separate decision

Specialist files were previously public in commit `dbf7c7b` and on the deployed website. The old default resume appears in earlier history, including `9b5207b`. Older commits, clones, forks, immutable deployments, search caches and previous downloads may retain copies.

Removing current public paths cannot retract those copies. Review history rewrites, deployment deletion, search removals and cache purges separately, preserving backups and obtaining explicit approval before destructive action.

## Recovery and maintenance

- Keep private Blob backups and manifest history. Failed conditional writes can leave unreferenced immutable files; no automatic deletion is performed.
- A crashed local process can leave `storage/resumes/manifest.lock`. Confirm no update is running before manual recovery; never delete stored versions.
- Replacement checks validate document structure and require admin content attestation. Run extraction, fact and layout checks before publishing a replacement master; regenerate its presentation image alongside changed content.
- The isolated browser fixture does not replace final testing with the real login provider and private cloud credentials.
