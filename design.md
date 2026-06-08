# Garna Design System

Документ описывает фактическую дизайн-систему текущего сайта Garna по исходникам проекта. Основные источники: статические страницы в `public/pages/*`, общий header в `src/utils/header.ts`, фон `public/rainbow-bg.css` и React-виджет формы в `src/components/form-garna-component-main/src/components/*`.

## 1. Общая дизайн-идея

Garna использует темную fintech/SaaS эстетику: черный фон, полупрозрачные стеклянные поверхности, кислотно-зеленый primary-акцент, компактные dashboard-макеты и карточки с банковскими/HR/payroll сценариями.

Ключевые признаки:

- Темная база: единый фон сайта `#050505`; секционные фоновые плашки больше не используются как системный паттерн.
- Основной бренд-акцент: Garna green `#5EA500`.
- Поверхности: glassmorphism через низкую белую прозрачность, blur и тонкую белую границу.
- Visual product mockups and dashboard examples are pending; they are not approved card rules yet.
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

These colors may still appear inside the footer or special embedded UI illustrations, but they should not define normal page sections or default content cards.

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
- `Manrope`: заголовки, navigation, CTA and approved card typography.
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

### Section eyebrow / tag

Use this only for the optional small text tag placed above a section H2.

Reference: For Contractors testimonials section, `JOIN 15,654+ FREELANCERS` above `Trusted by talent worldwide`.

Approved style:

- Font family: Manrope.
- Size: `text-sm`, roughly `14px`.
- Weight: `font-medium` / `500`.
- Color: primary green `#5EA500`.
- Text transform: uppercase.
- Tracking: `tracking-wider`, around `0.05em`.
- Spacing: `mb-4`, roughly `16px` below the tag before the H2.

Rules:

- This is plain text, not a pill, chip or outlined badge.
- Do not add the hero badge dot or ping animation here.
- If the tag includes a number, count animation is optional and not part of the typography rule.
- Use only when a section needs an extra contextual label above the H2; do not force it onto every section.

### Section H2

Use this for main headings inside page sections, for example `Modern Platform for Managing Global Payroll`.

Approved style:

- Font family: Manrope.
- Size: `text-4xl lg:text-5xl`, roughly `36px` on mobile and `48px` on desktop.
- Weight: `font-normal` / `400`.
- Line height: Tailwind default for `text-4xl lg:text-5xl`, roughly `40px` on mobile and `48px` on desktop.
- Tracking: `tracking-tight` or `0` letter spacing.
- Color: white `#ffffff`.
- Max width: around `max-w-4xl` for centered headings.

Rules:

- Use this for section/block headings, not for the hero H1.
- Keep the weight normal; do not make section H2 bold by default.
- Larger `lg:text-6xl` section titles are page-specific exceptions and should not be the default rule.

### Section subtitle

Use this for the short paragraph directly under a section H2.

Reference: Payroll Solution / `Why Garna stands out`, especially `Discover the key benefits that make payroll simple, global, and secure`.

Approved style:

- Font family: Manrope, with the `300` font weight loaded.
- Size: `text-xl`, roughly `20px`.
- Weight: `font-light` / `300`.
- Line height: Tailwind default for `text-xl`, roughly `28px` / `1.4`.
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
- Background colors may still be used inside modal/dialog surfaces or special embedded UI illustrations.

### Standard section layout

Use the For Contractors testimonials block, `Trusted by talent worldwide`, as the reference layout for normal content sections.

Section shell:

- Section padding: `pt-16 pb-16 lg:pt-32 lg:pb-32`, roughly `64px` on mobile and `128px` on desktop.
- Inner container: `max-w-7xl mx-auto px-6`, roughly `1280px` max width with `24px` side padding.
- Keep the section on the global page background `#050505`; do not add a section background.

Header stack:

- Alignment: centered by default.
- Header stack bottom margin: `mb-16`, roughly `64px` before content begins.
- Header max width: around `max-w-4xl` for the heading area.
- Optional section tag to H2: `mb-4`, roughly `16px`.
- H2 to subtitle: `mb-6`, roughly `24px`.
- Subtitle max width: `max-w-2xl`, or `max-w-3xl` for longer explanatory copy.
- If the section has no tag, the H2 starts the header stack directly.
- If the section has no subtitle, keep the `64px` header-to-content gap after the H2.
- UI catalog examples that show a section header must reuse this same tag/H2/subtitle spacing.

Content grid:

- Content uses the same `max-w-7xl px-6` section container.
- Three-card layout: `grid-cols-1 md:grid-cols-3 gap-6`.
- Two-card layout: `grid-cols-1 md:grid-cols-2 gap-6`.
- Card gap: `gap-6`, roughly `24px`, for both rows and columns.
- Do not manually tighten card gaps below `24px` in standard sections.

Optional bottom CTA:

- CTA row: centered.
- Content to CTA distance: `mt-12`, roughly `48px`.
- If there is no CTA, the section ends after the content grid.

### Grids

Используются:

- Standard content sections use the section layout rules above.
- Two-card and three-card content grids use `gap-6` / `24px`.
- Specialized dashboard, bento, KPI and mobile scroller grids are pending and should not be treated as catalog rules yet.

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
- Keep darker/lighter nested surfaces only inside form widgets or special illustrations.

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
- Learn More text CTA: green inline text link with `arrow-right`; no fill, border, radius or shadow.

Usage rules:

- Use Animated CTA for the main Hero CTA and the final CTA block on every page.
- Animated CTA always uses the `arrow-up-right` icon.
- Animated CTA hover includes the rotating border flare and the arrow path draw animation.
- Use Primary CTA for all other green buttons on the page.
- Primary CTA may be used with `arrow-up-right` or with no icon.
- Use Learn More text CTA for secondary section-level links such as the Talent Matching block.
- Do not add page-specific green CTA effects such as EOR-specific or local shine/sweep variants without updating this system.

Supporting variants:

- Header signup: compact `h-11`, `rounded-xl`.
- Widget continue button: CSS module `.button`, `padding: 12px 32px`, `box-shadow: 0 10px 40px #5ea50033`.

### Learn More Text CTA

Reference: Payroll Solution / Talent Matching block, `Hire faster with smart talent matching`.

Core anatomy:

- Use for low-emphasis `Learn more` style actions inside content sections.
- `inline-flex`, vertically centered, `gap: 8px`.
- Text: Manrope, `18px`, normal weight, green `#5EA500`.
- Icon: horizontal `arrow-right`, `20px`, stroke `1.5`.
- No background, border, radius, padding, shadow or glow.
- Hover: text and icon change to white with a simple color transition.
- This is a text-link CTA, not a filled green Primary CTA; the horizontal arrow is allowed only for this link pattern.

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

### Base card rule

This is the shared base for approved content cards. Right now only the Contractor benefit card is approved as a complete card type.

- Default fill `#0C0C0C`.
- Default border `border-white/5` / `rgba(255,255,255,0.05)`.
- Radius, padding, typography and hover are defined by each approved card type.

Rules:

- Use the Payroll Solutions / Benefits for your contractors card color and border as the base card reference.
- Do not use `#0A0A0A`, `#111111`, `#141414`, transparent white fills or green borders as default card styling.
- Green-border cards are allowed only as a separate named variant that will be defined later.
- Do not add extra card types to the catalog until their typography, spacing, border, icon and hover rules are agreed.

### Contractor benefit card

Use the For Contractors / `Built for your freedom` cards as the reference for this card type.

Anatomy:

- Card: `#0C0C0C` fill, `border-white/5`, `rounded-2xl`, `p-8`.
- Icon cell: `48px` square, `rounded-xl`, `#5EA500/10` background, `#5EA500/20` border.
- Icon: green `#5EA500`, `24px`, stroke style.
- Title: Manrope, `text-xl` / `20px`, `font-medium` / `500`, white, `mb-3`.
- Description: Manrope, `text-base` / `16px`, `font-normal` / `400`, `leading-relaxed`, muted gray `#A1A1A1`.
- Hover: card border becomes green `#5EA500/40`, a light green glow appears, and the icon cell scales up slightly.

Rules:

- Use this pattern for simple benefit/value cards with one icon, one title and one description.
- Do not reuse hero or section subtitle typography for card descriptions; card descriptions are smaller and closer to normal weight.
- Keep the hover subtle: no large movement, no background color swap, no heavy glow.

## 12. Badges

### Hero Badge

Anatomy:

- Inline-flex.
- `rounded-full`.
- Hero badge background: `white/5`.
- Hero badge border: `white/10`.
- Status dot: 2px/8px green dot with optional ping.
- Uppercase label, `text-xs`, medium.
- Data chips/status pills are not approved as a catalog rule yet.

## 13. Forms and Booking Widget

The booking widget is the clearest componentized UI in the repo.

### Modal

Files:

- `modal.tsx`
- `modal.module.css`

Anatomy:

- Overlay: fixed, black `#000000b3`, z-index `999999`.
- Modal container: max-width `860px`, background `rgb(10,10,10)`, border `rgb(34,34,34)`, radius `32px`.
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

- Contractor benefit card.
- Other card types are pending and should not be treated as approved rules yet.

Data display:

- Pending. Do not add KPI, dashboard, chip, chart or toggle examples to the catalog until their rules are defined.

Forms:

- Modal overlay.
- Modal container.
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
   - FAQ item
   - Hero badge
   - Contractor benefit card
5. Keep `#5EA500` as the single primary brand color and use green glow sparingly.
