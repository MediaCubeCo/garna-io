# Garna Design System

Документ описывает фактическую дизайн-систему текущего сайта Garna по исходникам проекта. Основные источники: статические страницы в `public/pages/*`, общий header в `src/utils/header.ts`, фон `public/rainbow-bg.css` и React-виджет формы в `src/components/form-garna-component-main/src/components/*`.

## 1. Общая дизайн-идея

Garna использует темную fintech/SaaS эстетику: черный фон, полупрозрачные стеклянные поверхности, кислотно-зеленый primary-акцент, компактные dashboard-макеты и карточки с банковскими/HR/payroll сценариями.

Ключевые признаки:

- Темная база: единый фон сайта `#050505`; секционные фоновые плашки больше не используются как системный паттерн.
- Основной бренд-акцент: Garna green `#5EA500`.
- Поверхности: glassmorphism через низкую белую прозрачность, blur и тонкую белую границу.
- Визуальные демо: browser chrome, app dashboard, account balance cards, transaction rows, KPI cards, mobile app mockup, AI interview mockup.
- Тон коммуникации: технологичный, деловой, уверенный. Интерфейс выглядит как продуктовая инфраструктура, а не как маркетинговая открытка.

## 2. Технологический слой UI

Основные страницы сейчас не используют единую компонентную библиотеку. UI собран из:

- Tailwind CDN на каждой HTML-странице.
- Inline CSS в `public/pages/*.html`.
- Общего HTML header, который генерируется в `src/utils/header.ts`.
- Shared animated background в `public/rainbow-bg.css`.
- React/CSS Modules для booking/demo widget в `src/components/form-garna-component-main`.
- Icon systems: inline SVG, Lucide SVG, `iconify-icon`.

Практический вывод: при развитии дизайн-системы сначала нужно нормализовать токены и повторяемые классы, потому что сейчас одинаковые паттерны дублируются между страницами с небольшими отличиями.

## 3. Цветовые токены

### Core

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#050505` | Global body and viewport background |
| `--color-footer-bg` | `#020202` | Existing footer background; keep this separate from normal page sections |
| `--color-card` | `#0C0C0C` | Default card fill, based on Payroll Solutions / Benefits for your contractors |
| `--color-card-border` | `rgba(255,255,255,0.05)` / `border-white/5` | Default card border |
| `--color-text` | `#ffffff` | Headings and important text |
| `--color-text-muted` | `#A1A1A1` | Standard gray copy and muted text |
| `--color-primary` | `#5EA500` | CTA, active links, success indicators |
| `--color-primary-hover` | `#6AB901` | Hover state for every green button |

Deprecated as default page-section/card tokens:

- `#020202` section bands.
- `#0A0A0A` generic card fill.
- `#111111` generic raised card fill.

These colors may still appear inside the footer, product mockups or special embedded UI illustrations, but they should not define normal page sections or default content cards.

### Accent Usage

Зеленый не должен становиться фоном всей страницы. Он работает лучше как:

- Primary CTA.
- Active nav item.
- Маленький статусный dot.
- Иконка внутри soft green circle.
- Progress bar.
- Glow вокруг важных карточек.
- Border highlight у выбранных/открытых состояний.

Green CTA color rule:

- Default state: `--color-primary` / `#5EA500`.
- Hover state: `--color-primary-hover` / `#6AB901`.
- This applies to every green button, including Primary CTA and Animated CTA.
- Secondary buttons, icon-only buttons and text links do not use the green hover fill unless they are intentionally green CTAs.

## 4. Типографика

### Семейства

- `Inter`: базовый текст, body, вторичные описания.
- `Manrope`: заголовки, navigation, CTA, карточки, продуктовые mockup labels.
- В 404 есть дополнительные подключенные шрифты, но это локальный эксперимент. Для системы сайта основные шрифты: Inter + Manrope.

### Иерархия

| Role | Approx classes | Guidance |
| --- | --- | --- |
| Hero H1 | `text-5xl md:text-7xl`, `leading-[1.1]`, `font-normal`, `tracking-tight` | Большой, легкий по весу, белый или white-to-gray gradient |
| Section H2 | `text-4xl lg:text-5xl`, `font-normal`, `tracking-tight` | Использовать для крупных секций |
| Card title | `text-lg` to `text-3xl`, `font-semibold` | Белый, Manrope |
| Body | `text-base` / `text-lg`, `font-light`, `leading-relaxed` | Muted gray `#A1A1A1` |
| Label / eyebrow | `text-xs` or `text-sm`, uppercase, `tracking-wide` / `tracking-[0.18em]` | Зеленый или серый |
| Fine print | `text-[10px]`, `text-xs`, `text-gray-600` | Footer legal, disclaimer |

### Section H2

Use this for main headings inside page sections, for example `Modern Platform for Managing Global Payroll`.

Approved style:

- Font family: Manrope.
- Size: `text-4xl lg:text-5xl`, roughly `36px` on mobile and `48px` on desktop.
- Weight: `font-normal` / `400`.
- Line height: `leading-tight`, around `1.15`.
- Tracking: `tracking-tight` or `0` letter spacing.
- Color: white `#ffffff`.
- Max width: around `max-w-4xl` for centered headings.

Rules:

- Use this for section/block headings, not for the hero H1.
- Keep the weight normal; do not make section H2 bold by default.
- Larger `lg:text-6xl` section titles are page-specific exceptions and should not be the default rule.

### Section subtitle

Use this for the short paragraph directly under a section H2.

Reference: White Label social/section subtitle, `That’s why our partners have been choosing Garna for years`.

Approved style:

- Font family: Manrope, with the `300` font weight loaded.
- Size: `text-xl`, roughly `20px`.
- Weight: `font-light` / `300`.
- Line height: `leading-relaxed`, around `1.625`.
- Color: muted gray `#A1A1A1`.
- Max width: `max-w-2xl` or `max-w-3xl`, centered when the section heading is centered.

Rules:

- Section subtitles should feel lighter than the heading and calmer than card titles.
- Do not use bright white for section subtitles.
- Card typography will be defined separately.

### Hero H1 size

Use the For Contractors hero title as the default size reference.

Approved default:

- Size: `text-5xl md:text-7xl`, roughly `48px` on mobile and `72px` on desktop.
- Line height: `leading-[1.1]`.
- Weight: `font-normal` / `400`.
- Tracking: `tracking-tight`.
- Font family: Manrope.
- Width: around `max-w-4xl` for centered heroes.

Rules:

- Payroll Solutions-style `lg:text-8xl` hero titles are page-specific exceptions, not the default design-system rule.
- Reduce size for unusually long titles or split-layout heroes when needed.
- Do not make the default catalog H1 larger than the For Contractors pattern.

### Hero subtitle

Use the White Label hero subtitle as the reference style.

Approved style:

- Font family: Manrope.
- Size: `text-lg md:text-xl`, roughly `18px` on mobile and `20px` on desktop.
- Weight: `font-light` / `300`.
- Line height: `leading-relaxed`, around `1.625`.
- Color: muted gray `#A1A1A1`.
- Max width: `max-w-xl` for split heroes, or `max-w-2xl/3xl` only when the layout needs a wider centered paragraph.

Rules:

- Do not use regular or medium weight for hero subtitles.
- Keep hero subtitles visually lighter than card/body copy.
- Avoid bright white subtitles under H1.

### Final CTA subtitle

Use the same subtitle style in the last CTA block on every page.

Approved style:

- Font family: Manrope.
- Size: `text-lg md:text-xl`, roughly `18px` on mobile and `20px` on desktop.
- Weight: `font-light` / `300`.
- Line height: `leading-relaxed`, around `1.625`.
- Color: muted gray `#A1A1A1`.
- Max width: `max-w-xl` or `max-w-2xl`, centered under the final CTA heading.

Rules:

- Final CTA subtitles must not be heavier than hero subtitles.
- Avoid bright white final CTA subtitles.
- Keep the final CTA subtitle visually calm so the animated CTA remains the main action.

### Hero H1 color

Hero H1 color treatment can stay page-specific because title composition varies a lot.

Approved color patterns:

- White main phrase with a muted gray continuation, using `#A1A1A1`.
- Full white-to-gray gradient for one-piece or very long hero titles, using the shared `garna-hero-title-gradient` style.

Observed references:

- Home: `Global Payroll Solutions` in white, `for your business` in gray.
- For Contractors: `Get paid globally,` in white, `hassle-free` in gray.
- AI Hiring: second title line uses a white-to-gray gradient.
- Shared Astro hero configs currently use `garna-hero-title-gradient` for multiple pages.

Rules:

- Do not use green inside the H1 color treatment.
- Prefer gray/gradient on the final phrase, second line, or supporting semantic fragment.
- Keep the first phrase strong and readable in white.
- For single-line titles, a subtle full-title white-to-gray gradient is acceptable.

### Hero badge / tag

Use this only for the optional tag placed above the hero H1.

Approved style:

- Pill shape with `border-radius: 9999px`.
- Transparent white surface: `rgba(255,255,255,0.05)`.
- Subtle white border: `rgba(255,255,255,0.10)`.
- Light blur: `backdrop-filter: blur(4px)`.
- Text: uppercase, Manrope, `12px`, `font-weight: 500`, `#d1d5db`, `letter-spacing: 0.025em`.
- Left status dot: core Garna green `#5EA500` with a looping ping animation.

Rules:

- Do not use green-tinted badge backgrounds for hero tags.
- Do not use green text for hero tags.
- All hero tags should use the shared `.garna-hero-badge` classes from `astro/styles/global.css`.
- Current reference: AI Hiring hero badge.

## 5. Layout Principles

### Containers

- Основной max width: `max-w-7xl` + `px-6`.
- Узкий контент: `max-w-3xl`, `max-w-4xl`.
- Hero часто использует `min-h-screen`, `pt-32`, `pb-32`.
- Большие секции: `py-16` на mobile, `lg:py-32` на desktop.

### Section backgrounds

- Default page background is always `#050505`.
- Standard content sections should not add their own full-width background color.
- Do not alternate sections with `#020202`, `#0A0A0A`, `#080808`, or other dark bands.
- Footer is the exception: keep the existing footer background `#020202`.
- Visual separation between sections should come from spacing, typography, layout, cards, media and subtle dividers when needed.
- Background colors may still be used inside product mockups, modal/dialog surfaces or special embedded UI illustrations.

### Grids

Используются:

- 2-column hero: text + dashboard mockup.
- Bento grids для feature cards.
- KPI card grids.
- Horizontal scroll cards on mobile для EOR cards.
- Tabs + panel grid для EOR why-Garna секции.

### Spacing

Система фактически строится на Tailwind steps:

- Small gap: `gap-2`, `gap-3`, `gap-4`.
- Card padding: `p-5`, `p-6`, `p-8`.
- Large section rhythm: `mb-16`, `mb-24`, `py-24`, `lg:py-32`.

## 6. Surfaces

Current surface rule:

- Normal page sections do not receive their own background fill.
- Default reusable cards use `#0C0C0C` with `border-white/5`.
- Glass/blur may be used as a treatment on top of the base card, but it should not introduce a new random black/gray fill.

### `.glass`

Used for nav/card/FAQ containers when a subtle transparent treatment is needed.

```css
background: #0C0C0C;
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.05);
```

Use this as a calm card/panel surface, not as a separate section background.

### `.glass-card`

Use the Payroll Solutions / Benefits for your contractors cards as the base reference.

```css
background: #0C0C0C;
backdrop-filter: blur(20px);
border: 1px solid rgba(255,255,255,0.05);
box-shadow: 0 4px 30px rgba(0,0,0,0.1);
```

Use for feature cards, benefit cards and repeated content cards.

### `.glass-high` / `.glass-nav`

Header surface:

```css
background: rgba(5, 5, 5, 0.7-0.72);
backdrop-filter: blur(16px);
border-bottom: 1px solid rgba(255,255,255,0.08);
```

Назначение: fixed navigation bar.

### `.surface` and `.surface-soft`

These older utilities should no longer create new default card colors.

- If used for a reusable content card, normalize to `#0C0C0C` + `border-white/5`.
- Keep darker/lighter nested surfaces only inside product mockups, dashboards, form widgets or special illustrations.

## 7. Border Radius

| Radius | Use |
| --- | --- |
| `8px` / `rounded-lg` | Small icon boxes, mock inputs |
| `12px` / `rounded-xl` | Buttons, FAQ rows, dashboard panels |
| `16px` / `rounded-2xl` | Cards, badges, photo callouts |
| `24px` / `rounded-3xl` | Large feature cards, embedded form card |
| `32px` | Booking modal and Cal.com iframe radius |
| `9999px` | Pills, status dots, avatar circles |

## 8. Shadows and Glow

Main shadow language:

- Primary glow: `0 0 20px -5px rgba(94,165,0,0.5)` for header signup.
- Strong CTA glow: `0 0 26px -10px rgba(94,165,0,0.9)`.
- Ambient hero blur: large green blurred circles `blur-[120px]` with `#5EA500/10-20`.
- Product mockups: `shadow-2xl`, `shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]`.

Use green glow only for primary emphasis. Most cards should rely on border and dark layering.

## 9. Buttons

### Primary CTA

Used for standard signup/product CTAs and supporting product actions.

Core anatomy:

- Background `#5EA500`.
- Text white.
- Radius `12px`.
- Horizontal padding around `24-32px`.
- Height/min-height around `44-48px`.
- Manrope, medium or semibold.
- Hover: background changes to `#6AB901`, with slight scale or translate and stronger green glow.
- Icon: optional `arrow-up-right` only; horizontal arrow icons are not part of the button system.
- Icon hover: moves slightly up and right.

Approved green CTA patterns:

- Animated CTA: `garna-button-rotating-flare` on the shared `Button.astro` component.
- Primary CTA with icon: static green fill, shared lift/glow hover, `arrow-up-right`.
- Primary CTA without icon: same static green fill and hover, no icon.

Usage rules:

- Use Animated CTA for the main Hero CTA and the final CTA block on every page.
- Animated CTA always uses the `arrow-up-right` icon.
- Animated CTA hover includes the rotating border flare and the arrow path draw animation.
- Use Primary CTA for all other green buttons on the page.
- Primary CTA may be used with `arrow-up-right` or with no icon.
- Do not add page-specific green CTA effects such as EOR-specific or local shine/sweep variants without updating this system.

Supporting variants:

- Header signup: compact `h-11`, `rounded-xl`.
- Widget continue button: CSS module `.button`, `padding: 12px 32px`, `box-shadow: 0 10px 40px #5ea50033`.

### Secondary / Text Links

- Header login: white text, hover opacity.
- Footer/contact links: green text, hover darker green.
- Form inline links: green + underline.

## 10. Navigation

Shared header is generated by `buildHeaderHtml`.

Elements:

- Fixed top nav, `h-16`, glass-high.
- Logo left: `/garna_logo.svg`, height `h-10`.
- Center nav links on desktop:
  - Payroll Solution
  - For Contractors
  - AI Hiring
  - White Label
- Active link: `#5EA500`.
- Right actions:
  - Login text/icon.
  - Sign Up primary button.
  - Mobile menu toggle.
- Mobile menu:
  - Full viewport below header.
  - Black background `#050505`.
  - Large nav links `text-2xl`.
  - Bottom login/signup stack.

## 11. Cards

### Feature Cards

Pattern:

- Default fill `#0C0C0C`.
- Default border `border-white/5` / `rgba(255,255,255,0.05)`.
- Radius `rounded-2xl` or `rounded-3xl`.
- Padding `p-6` to `p-8`.
- Optional hover border/translate will be defined separately.
- Icon cell: green icon on green translucent background.

Rules:

- Use the Payroll Solutions / Benefits for your contractors card color and border as the base card reference.
- Do not use `#0A0A0A`, `#111111`, `#141414`, transparent white fills or green borders as default card styling.
- Green-border cards are allowed only as a separate named variant that will be defined later.
- Product mockup internals can still use nested darker/lighter surfaces when needed to create UI depth.

Types found:

- Bento feature card.
- Why Garna card.
- EOR capability card.
- White-label benefit card with color-specific hover border.
- Fit-check list item with check icon.

### Product Mockup Cards

Pattern:

- Browser/app outer shell with top control dots.
- Inner dashboard sections.
- Sidebar, topbar, metric cards, transaction rows.
- Small labels, skeleton bars, avatars, currency/action chips.

These are marketing illustrations, not reusable form components, but they define the product visual language.

### Photo Badge Cards

EOR panels use photo blocks with overlay badges:

- `rounded-2xl`
- `border-white/5`
- `bg-[#0C0C0C]`
- icon circle green
- title white + status green

## 12. Badges, Pills, Chips

### Hero Badge

Anatomy:

- Inline-flex.
- `rounded-full`.
- Hero badge background: `white/5`.
- Hero badge border: `white/10`.
- Status dot: 2px/8px green dot with optional ping.
- Uppercase label, `text-xs`, medium.

### Data Chips

Used in mockups:

- Rounded pills with dark fill.
- Green text for active/highlighted values.
- Thin border.
- Often combined with icons or avatars.

## 13. Forms and Booking Widget

The booking widget is the clearest componentized UI in the repo.

### Modal

Files:

- `modal.tsx`
- `modal.module.css`

Anatomy:

- Overlay: fixed, black `#000000b3`, z-index `999999`.
- Modal card: max-width `860px`, background `rgb(10,10,10)`, border `rgb(34,34,34)`, radius `32px`.
- Mobile: full-screen fixed modal, no radius.
- Close button: transparent button with white X SVG.
- Step 1: form.
- Step 2/3: embedded Cal.com iframe, dark theme, radius `32px`.

### Inputs

File: `inputForm.module.css`.

Anatomy:

- Transparent background.
- Bottom border only.
- Text white.
- Focus border green.
- Error border red.
- Error message absolute, `11px`, red.

### Select

File: `selectForm.module.css`.

Anatomy:

- Custom combobox, bottom-border trigger.
- Arrow rotates on open.
- Dropdown card: `rgb(10,10,10)`, border `rgb(34,34,34)`, radius `12px`, shadow.
- Selected option: green text, medium weight.

### Embedded Form Card

Used on `public/pages/form/form.html`.

- Black background.
- Border `rgba(255,255,255,0.1)`.
- Radius `1.5rem`.
- Padding `2rem` mobile, `3.5rem` desktop.

## 14. Accordions and FAQ

The current visual standard is the White Label FAQ pattern. All public FAQ blocks should use this look even when the underlying interaction implementation differs for legacy reasons.

### Standard FAQ Card

Anatomy:

- Container: `group bg-[#0C0C0C] rounded-xl border border-white/5 overflow-hidden`.
- Open state: `bg-[#0E0E0E]`.
- Question row: `pt-6 pr-6 pb-6 pl-6`, `text-base`, `font-medium`, white Manrope text.
- Icon: `solar:alt-arrow-down-linear`, gray `text-gray-500`, rotates 180deg on open.
- Answer panel: CSS grid row transition from `grid-rows-[0fr]` to `grid-rows-[1fr]`.
- Answer text: `px-6 pb-6 text-[#A1A1A1] text-sm leading-relaxed font-normal`.

### Implementation Notes

White Label and AI Hiring use checkbox + `peer` / `has-[:checked]`.

Home now uses the same checkbox pattern.

Offer keeps its existing `data-accordion-item` JavaScript toggle, but the visual shell has been aligned to the White Label pattern.

EOR keeps its custom height animation and accessibility state, but its FAQ cards now use the same White Label surface, radius, border, spacing and icon treatment.

## 15. Tabs

EOR page uses CSS-only radio tabs:

- Hidden radio inputs.
- Labels `.why-garna-tab`.
- Active tab: green bottom border and white text.
- Inactive: `#71717a`.
- Panels switch by `:checked ~ .why-garna-panels`.

This is the most complete tab pattern and should be reused if tabs are needed elsewhere.

## 16. Backgrounds

### Rainbow Background

Shared `public/rainbow-bg.css`:

- Fixed full-screen layer behind content.
- Black base.
- 25 animated `.rainbow` beams.
- Green/yellow-green/teal glow shadows.
- Horizontal slide animation.
- Additional heavy black masking via `.h` and `.v`.

### Grid Background

Repeated pattern:

```css
background-image:
  linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
background-size: 40px 40px;
```

Use for dashboard/product sections when more structure is needed.

### Ambient Glow

Large absolute blurred green circles, usually `#5EA500/10` to `/20`, blur `120px+`.

## 17. Iconography

Current sources:

- Lucide inline SVG.
- `iconify-icon` with Lucide and Solar icons.
- Brand SVGs: `garna_logo.svg`, `mediacube-logo-white.svg`.

Style:

- Stroke icons, usually 1.5 or 2px.
- White or green.
- Icon container: `w-8 h-8`, `rounded-lg`, dark or green-tinted background.

## 18. Motion

Common motion:

- Hover scale on primary CTAs.
- Arrow icon translation.
- Float animation for mockups: `translateY(-10px)` over 6-7s.
- Accordion expand/collapse.
- Rainbow background continuous slide.
- White-label CTA animated conic border.
- 404 radar/pulse/cursor animations.

Respect `prefers-reduced-motion` for complex interactions; EOR FAQ already has a reduced-motion override.

## 19. Current UI Element Inventory

Global:

- Fixed header / desktop nav.
- Mobile nav overlay.
- Footer with logo, powered-by block, language/legal placeholders, contacts, legal disclaimer.
- Rainbow background.
- Grid backdrop.

Buttons and links:

- Primary CTA.
- Header signup CTA.
- Login text/icon link.
- Animated CTA for hero and final CTA placements.
- Widget form submit button.
- Icon-only mobile menu/close.
- Carousel edge buttons.
- Footer contact links.

Content primitives:

- Hero badge with status dot.
- Eyebrow label.
- Hero headline.
- Section heading.
- Body paragraph.
- Fine print/disclaimer.
- Inline link.
- Logo lockup.

Cards:

- Glass card.
- Surface-soft card.
- Feature card.
- Bento card.
- KPI/stat card.
- Product dashboard shell.
- Browser mockup shell.
- Transaction row.
- Account/balance card.
- Template card.
- Photo badge overlay.
- Fit-check list item.
- Promotional mini-card.

Data display:

- Metric value.
- Progress bar.
- Bar chart.
- Line chart mockup.
- Avatar row.
- Status pill.
- Country/payment chip.
- Toggle row.
- Timeline/step row.

Forms:

- Modal overlay.
- Modal card.
- Close button.
- Text input.
- Email input.
- Custom select.
- Dropdown option.
- Error text.
- Embedded form card.
- Cal.com iframe container.

Interactive components:

- FAQ accordion using the White Label visual pattern.
- EOR animated FAQ.
- CSS radio tabs.
- Horizontal mobile card scroller.

Special pages:

- 404 radar/search visual.
- Booking form page.

## 20. Recommended Consolidation

To make the design system maintainable:

1. Move shared colors, radii, shadows and typography into a single CSS token file.
2. Normalize duplicated classes: `glass`, `glass-card`, `glass-high`, `button-primary`, `surface-soft`, `hero-badge`.
3. Choose one accordion implementation and one CTA implementation per use case.
4. Convert the most repeated static patterns into snippets/components:
   - Header
   - Footer
   - CTA
   - Feature card
   - FAQ item
   - Hero badge
   - Product mockup shell
5. Keep `#5EA500` as the single primary brand color and use green glow sparingly.
