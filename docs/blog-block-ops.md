# Garna Blog Block Ops

## Cloudflare resources

- Worker: `garna-io`
- D1 database: `garna-blog`
- D1 database id: `e76ba814-904b-4a34-b6ff-51f601b3a5ad`
- R2 bucket: `garna-blog-media`
- Email binding: `EMAIL`
- Admin allowlist: `info@mediacube.network`, `sol@mediacube.io`, `angelm@mediacube.io`, `dariab@mediacube.io`

## Secrets

The following Worker secrets are set in Cloudflare and must not be committed:

- `SESSION_SECRET`
- `MAGIC_LINK_SECRET`

Verify names only:

```sh
WRANGLER_LOG_PATH=.wrangler/logs npx wrangler secret list
```

## Database

Apply migrations locally:

```sh
WRANGLER_LOG_PATH=.wrangler/logs npx wrangler d1 migrations apply garna-blog --local
```

Apply migrations to production:

```sh
WRANGLER_LOG_PATH=.wrangler/logs npx wrangler d1 migrations apply garna-blog --remote
```

Read back the seed article:

```sh
WRANGLER_LOG_PATH=.wrangler/logs npx wrangler d1 execute garna-blog --remote --command "SELECT slug, status FROM articles;"
```

## Verification

Run before deployment:

```sh
npm run build
npx tsc --noEmit
npm test
WRANGLER_LOG_PATH=.wrangler/logs npx wrangler deploy --dry-run --outdir /tmp/garna-blog-worker-dry-run
```

Smoke-test locally after local D1 migrations:

```sh
WRANGLER_LOG_PATH=.wrangler/logs npx wrangler dev --port 8788
curl -i http://127.0.0.1:8788/en/blog
curl -i http://127.0.0.1:8788/en/blog/global-payroll-complexity
curl -i http://127.0.0.1:8788/en/blog/author/emily-chen
curl -i http://127.0.0.1:8788/en/sitemap.xml
curl -i http://127.0.0.1:8788/admin/blog/login
```

## Email Sending

The pinned project Wrangler version (`4.62.0`) does not expose `wrangler email sending ...` commands, but transient `wrangler@latest` does.

Verified setup:

- `garna.io` Email Sending is enabled.
- MX, SPF, DKIM, and DMARC resolve through `1.1.1.1`.
- A test email from `noreply@garna.io` to `info@mediacube.network` sent successfully.

Verification commands:

```sh
WRANGLER_LOG_PATH=.wrangler/logs npx wrangler@latest email sending list
WRANGLER_LOG_PATH=.wrangler/logs npx wrangler@latest email sending settings garna.io
WRANGLER_LOG_PATH=.wrangler/logs npx wrangler@latest email sending dns get garna.io
dig @1.1.1.1 +short MX cf-bounce.garna.io
dig @1.1.1.1 +short TXT cf-bounce.garna.io
dig @1.1.1.1 +short TXT cf-bounce._domainkey.garna.io
dig @1.1.1.1 +short TXT _dmarc.garna.io
```
