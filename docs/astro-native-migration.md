# Astro native migration

This document tracks the removal of runtime HTML composition from the public site.

## Architecture rules

- Static page structure is authored in `.astro` components.
- Shared interface primitives live under `components/ui`, structural wrappers under `components/layout`, reusable page sections under `components/sections`, and HTML-rendered product graphics under `components/visuals`.
- Every visible localized string keeps an English fallback and a `data-translate` key.
- `set:html` is restricted to `components/dynamic/TrustedDynamicHead.astro`, where the Worker replaces the documented blog metadata marker with trusted CMS meta and JSON-LD. It is not a page-composition mechanism.
- Page scripts are colocated with the component they enhance, scope selectors to that component, initialize once, and respect reduced motion.
- `npm run check:architecture` rejects raw page imports, legacy extractors/directories, Tailwind CDN, page-level head/script strings, and any additional `set:html` usage.

## Migration order

1. Local Tailwind build and design-system primitives.
2. Contractor, AI hiring, and white-label landing pages.
3. Payroll page family.
4. Utility and blog surfaces.
5. Delete legacy HTML, extraction helpers, runtime head styles, and temporary Tailwind sources.
