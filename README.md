# Garna.io Cloudflare Worker

A production-ready Cloudflare Worker for garna.io with multi-language support (English, Spanish, Portuguese, Russian), SEO optimization, and static page handling.

## Features

- **Multi-language Support**: Automatic locale detection based on user's country (en, es, pt, ru)
- **SEO Optimized**: Canonical tags, hreflang alternates, proper HTML lang attributes
- **Static Page Serving**: Efficient delivery via Cloudflare Static Assets
- **Security Headers**: CSP, X-XSS-Protection, X-Content-Type-Options, and more
- **Automatic Redirects**: URL normalization and locale detection
- **Sitemap Generation**: Dynamic sitemaps for each language
- **404 Handling**: Localized 404 pages

## Project Structure

```
garna-io/
├── src/
│   ├── config/
│   │   ├── countries.ts       # Country-to-language mappings
│   │   ├── languages.ts       # Supported languages configuration
│   │   └── pages.ts           # Page routing configuration
│   ├── routes/
│   │   ├── 404.ts             # 404 page handler
│   │   ├── dynamic.ts         # Dynamic route handler
│   │   ├── redirects.ts       # URL redirect handler
│   │   └── static.ts          # Static files handler (sitemap, robots.txt)
│   ├── utils/
│   │   ├── canonical.ts       # Canonical tag injection
│   │   ├── hreflang.ts        # Hreflang tag injection
│   │   ├── htmlLang.ts        # HTML lang attribute injection
│   │   ├── locale.ts          # Locale detection utilities
│   │   └── routes.ts          # Route resolution
│   └── index.ts               # Worker entry point
├── public/
│   └── pages/
│       ├── home/
│       │   └── home.html      # Homepage
│       ├── offer/
│       │   └── offer.html     # Offer page
│       └── 404/
│           └── 404.html       # 404 page
├── test/
│   ├── index.spec.ts          # Test suite
│   └── tsconfig.json          # Test TypeScript config
├── .editorconfig
├── .gitignore
├── .prettierrc
├── package.json
├── tsconfig.json
├── vitest.config.mts
├── worker-configuration.d.ts
└── wrangler.toml
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account

### Install Dependencies

```bash
npm install
```

### Local Development

Start the development server:

```bash
npm run dev
```

Worker will be available at `http://localhost:8788`

### Testing

Run the test suite:

```bash
npm test
```

### Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

## Routing

The worker handles the following routes:

- `/` → Redirects to `/{language}` based on user's country
- `/{language}` → Homepage (e.g., `/en`, `/es`, `/pt`, `/ru`)
- `/{language}/offer` → Offer page
- `/sitemap-index.xml` → Sitemap index
- `/{language}/sitemap.xml` → Language-specific sitemap
- `/robots.txt` → Robots.txt file

## Configuration

### Adding New Pages

Edit `src/config/pages.ts` to add new pages:

```typescript
export const basePaths: PageConfig[] = [
  {
    path: '',
    mode: 'static',
    searchable: true,
  },
  {
    path: 'offer',
    mode: 'static',
    searchable: true,
  },
  // Add new pages here
];
```

Then create the corresponding HTML file in `public/pages/{pageName}/{pageName}.html` and update the `PAGE_PATH_TO_DIR` mapping in `src/routes/dynamic.ts`.

### Cloudflare Account

Update the account ID in `wrangler.toml`:

```toml
account_id = "YOUR_CLOUDFLARE_ACCOUNT_ID"
```

## URL Structure

The worker enforces the following URL structure:

- **Valid**: `/en`, `/es/offer`, `/pt`, `/ru/offer`
- **Redirects**: `/` → `/en` (based on country), `/EN` → `/en` (case normalization)
- **Invalid**: `/invalid`, `/en/` (trailing slash), `/en//offer` (double slash)

## SEO

Each page includes:

- Canonical URL (`<link rel="canonical">`)
- Open Graph URL (`<meta property="og:url">`)
- Hreflang alternates for all supported languages
- Proper HTML lang attribute
- x-default hreflang pointing to English

## Security

All responses include the following security headers:

- Content-Security-Policy
- X-XSS-Protection
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

## Static Assets

Static assets are served via Cloudflare Static Assets for optimal performance. The worker automatically handles:

- HTML pages from `public/pages/`
- Sitemap generation
- Robots.txt generation

## Multi-language Support

The worker supports 4 languages:

- **English (en)**: Default language
- **Spanish (es)**: For Spanish-speaking countries
- **Portuguese (pt)**: For Portuguese-speaking countries
- **Russian (ru)**: For Russian-speaking countries

Language detection is based on the user's country code provided by Cloudflare's `request.cf.country`.

### Translation System

The project includes a comprehensive translation system with:

- **Server-side translation injection**: Translations are applied before HTML is sent to the browser
- **Client-side fallback**: JavaScript ensures dynamic content is translated
- **data-translate attributes**: Simple way to mark translatable content

See [TRANSLATIONS.md](TRANSLATIONS.md) for detailed documentation on the translation system.

#### Quick Example

Add translations to HTML elements:

```html
<h1 data-translate="hero.title">Welcome to Garna</h1>
<p data-translate="hero.description">Global payroll solutions</p>
```

Define translations in `src/pages/translations/{page}/{language}.ts`:

```typescript
export const homeEn = {
  hero: {
    title: 'Welcome to Garna',
    description: 'Global payroll solutions',
  },
};
```

The worker automatically replaces text content with the appropriate language version based on the URL locale.

## License

Private project - All rights reserved.
