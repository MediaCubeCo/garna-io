# Shared blog engine rollout

Engine repository: https://github.com/MediaCubeCo/blog-engine (private).
Consumer dependency: `@mediacubeco/blog-engine`, exact `1.0.0`.
Garna adapter: `src/blog/engine.ts`; trusted branded CTA HTML: `src/blog/brand.ts`.
The Astro shell retains the site header/footer, styles and booking widget. Content,
admin, auth, SQL and public templates now belong to the package. Legacy redirects
remain in Garna. Mediacube's existing site is not modified.

## Baseline and local verification (2026-09-10)

Baseline commit: `2eaf120` (main before extraction). Baseline: TypeScript and build
passed; 56 tests passed, one existing ForCreators architecture test failed. That
same test reports: page-level head string in ForCreatorsPage, intermediate page
component category, and existing `astro/components/pages` legacy directory.
These unrelated issues are intentionally not fixed or suppressed by this change.

After extraction: 51 tests passed, the same one failed. TypeScript, 21-page Astro
build and Worker dry-run passed (approximately 431 KiB gzip). No migration SQL
changed. Engine CI tests real local D1/R2, empty schemas, two-installation isolation,
auth, expired/reused magic links, drafts/scheduling, translation, media and sitemap.
The actual npm archive was installed in Garna and an independent Worker example.

Local Chrome screenshots before/after: `/private/tmp/blog-engine-verification/`.
Desktop/mobile list, article, author and login were captured; the before/after
article desktop dimensions matched. Authenticated admin screenshots are after-only.
Garna browser login, paragraph creation/save/reopen passed with no JS errors.
Independent Mediacube browser test passed upload, crop persistence, save/reopen,
private preview and public refusal. All 11 EditorJS block variants survived a
browser save/reopen round trip (paragraph, heading, unordered/ordered/checklist,
quote, delimiter, image, YouTube, TLDR, CTA).

## Production gate — do not skip

No new structural migration is required by this extraction. Preserve Garna's
existing `migrations` directory and D1 migration history, including old seeds.
Run `npx blog-migrations migrations` only to compare/copy files; it does not apply SQL.

Before deployment:

1. Ensure authenticated Wrangler access to the existing Garna account.
2. Export `garna-blog` D1 remotely to a restricted local backup (not git).
3. Record `wrangler deployments list` and `wrangler versions list` output, including
   the currently serving version ID for rollback.
4. Read `d1_migrations` remotely and compare names with existing files. Do not apply
   or rename migrations as part of this release.
5. Ensure package read access for the Garna GitHub repository. Developers need their
   own `read:packages` credentials; never commit a token to `.npmrc`.
6. Merge the reviewed PR and deploy the exact checked commit.
7. Smoke real list/article/author, image, sitemap, canonical/hreflang, login and a
   service draft save/reopen/preview. Verify draft refusal without a session.

If regression occurs, run `wrangler rollback <recorded-previous-version-id>` and
verify the previous public/admin behavior. No destructive D1 restore is needed for
a code rollback because this release changes no schema.

At preparation time Cloudflare OAuth refresh returned HTTP 403 and prevented the
remote backup/history/deployment steps. This document is not evidence of deployment;
record the actual version IDs and smoke results once that gate is completed.
