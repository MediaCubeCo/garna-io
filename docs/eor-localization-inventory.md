# EOR Localization Inventory

Generated from `/en/employer-of-record` source files before SEO translation matching.

## Summary

- Total rows: 152
- Rows with existing translation key: 30
- Rows needing translation key: 122
- Source-only rows added manually: 23
- Keyless page/body rows likely requiring implementation keys: 111

## Buckets

- `hero_visual_ui`: 7
- `page_body`: 111
- `page_cta`: 3
- `page_faq`: 12
- `page_hero`: 4
- `seo_meta`: 2
- `visual_microcopy_or_static`: 11
- `widget`: 2

## Files Included

- `astro/pages/employer-of-record.astro`
- `astro/content/site-pages/eor.html`
- `astro/content/site-scripts/eor.html`
- `astro/content/page-heroes.ts`
- `astro/content/page-final-ctas.ts`
- `src/i18n/translations/eor/en.ts`

## Workflow

1. Put SEO translations into the `seo_ru`, `seo_pt`, and later `seo_es` columns in `docs/eor-localization-inventory.csv`.
2. Use `match_status` for one of: `exact`, `partial`, `missing`, `needs_discussion`.
3. Keep `english_text` unchanged; it is the lookup anchor.
4. Rows marked `needs_key` must receive stable translation keys before implementation.
5. Rows in `visual_microcopy_or_static` can be reviewed separately: some are amounts, labels, or UI mock data and may intentionally stay unchanged.

## Sections Found

- Meta
- Hero
- FAQ on Employer of Record
- Final CTA
- Booking widget
- Hire globally without opening entities
- Employ any type of workforce
- Offer payroll that runs smoothly
- Ensure compliance in every market
- Integrate EoR into your tools
- Built for fast-moving companies
- Set up your company account
- Assign a financial contact
- Create your first EoR contract
- Invite an employee
- Fund your wallet and run payroll

## Primary Worksheet

See `docs/eor-localization-inventory.csv`.
