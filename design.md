# Garna Design System

Документ описывает фактическую дизайн-систему текущего сайта Garna по исходникам проекта. Основные источники: статические страницы в `public/pages/*`, общий header в `src/utils/header.ts`, фон `public/rainbow-bg.css` и React-виджет формы в `src/components/form-garna-component-main/src/components/*`.

## 1. Общая дизайн-идея

Garna использует темную fintech/SaaS эстетику: черный фон, полупрозрачные стеклянные поверхности, кислотно-зеленый primary-акцент, компактные dashboard-макеты и карточки с банковскими/HR/payroll сценариями.

Ключевые признаки:

- Темная база: единый фон сайта `#050505`; секционные фоновые плашки больше не используются как системный паттерн.
- Основной бренд-акцент: Garna green `#5EA500`.
- Поверхности: glassmorphism через низкую белую прозрачность, blur и тонкую белую границу.
- Visual product mockups are approved only through named patterns such as Browser window visual; other dashboard examples remain pending until a specific mockup is documented.
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
| `--color-card-hover` | `#0F0F0F` | Approved hover fill for quiet cards, currently used by Testimonial card |
| `--color-card-border` | `rgba(255,255,255,0.05)` / `border-white/5` | Default card border |
| `--color-text` | `#ffffff` | Headings and important text |
| `--color-text-muted` | `#A1A1A1` | Standard gray copy and muted text |
| `--color-primary` | `#5EA500` | CTA, active links, success indicators |
| `--color-primary-hover` | `#6AB901` | Hover state for every green button |
| `--color-negative` | `#EF4444` | Negative comparison icon/accent, based on AI Hiring before/after cards |
| `--color-warning` | `#EAB308` | Yellow utility/status accent, currently used by browser traffic-light dots and testimonial stars |
| `--color-info` | `#3B82F6` | Blue utility/accent color, based on White Label / Garna advantage / Fast card |
| `--color-purple` | `#A855F7` | Purple utility/accent color, based on White Label / Garna advantage / Brand Ownership card |

Deprecated as default page-section/card tokens:

- `#020202` section bands.
- `#0A0A0A` generic card fill.
- `#111111` generic raised card fill.

These colors may still appear inside the footer or special embedded UI illustrations, but they should not define normal page sections or default content cards.

Utility accent colors:

- `#EF4444`, `#EAB308`, `#3B82F6` and `#A855F7` are secondary utility/accent colors.
- Use them only in documented component accents, browser/status dots, rating/status visuals or specialized illustrated cards.
- Do not use blue, purple, yellow or red as default CTA colors, page-section backgrounds, default card borders or default hover effects.

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

### Card title and description

Use this for approved benefit/value cards such as For Contractors / `Built for your freedom`.

Approved style:

- Card title: Manrope, `text-xl` / `20px`, `font-medium` / `500`, white `#ffffff`, `mb-3` / `12px`.
- Card description: Manrope, `text-base` / `16px`, `font-normal` / `400`, `leading-relaxed` / roughly `26px`, muted gray `#A1A1A1`.

Rules:

- Card titles are smaller and heavier than section subtitles.
- Card descriptions are smaller than section subtitles and should not use hero/final CTA subtitle sizing.
- Keep the card description calm and readable; do not use white or oversized text for normal card copy.

### Step trigger title and description

Use this for step-list triggers inside the Step switcher layout, for example `Set up your account` and its supporting description.

Approved style:

- Step title: Manrope, `24px`, `font-normal` / `400`, white `#ffffff`, `line-height: 1.25`, `mb-3` / `12px`, `letter-spacing: 0`.
- Step description: Manrope, `16px`, `font-normal` / `400`, `leading-relaxed` / roughly `26px`, muted/supporting gray.
- Hover/focus/active title color: primary green `#5EA500`.

Rules:

- Use this only for interactive step triggers, not for card titles or section headings.
- Keep step titles lighter than card titles even when they are larger.
- Keep descriptions at body/card-description scale; do not use section subtitle typography here.

### Numbered content list item

Use this for non-interactive numbered lists inside content sections, for example Payroll Solution / `Pay contractors now, settle later`.

Approved style:

- List layout: vertical stack with `space-y-8`, roughly `32px` between items.
- Item layout: horizontal row, number marker on the left and text on the right.
- Item alignment: center vertically.
- Item gap: `gap-5`, roughly `20px`.
- Number marker: `36px` wide, `32px` tall, `rounded-lg`, `#1A1A1A` fill, `border-white/10`.
- Number text: monospace, `14px`, normal weight, primary green `#5EA500`.
- Item text: Manrope, `text-lg` / `18px`, normal weight `400`, gray-300 `#D1D5DB`.
- Item text line height: about `1.45`.

Rules:

- Use this for static explanatory lists only.
- Do not use this for interactive step switchers, timelines, tab triggers or process cards.
- Do not add hover/active states unless the list becomes an interactive component.
- Keep number markers small and quiet; they are labels, not badges or buttons.

### Before / after comparison list item

Use this for list copy inside two-card comparison blocks, for example AI Hiring / `Connect with the right talent`.

Approved style:

- List layout: vertical stack with `space-y-4`, roughly `16px` between items.
- Item layout: horizontal row, icon on the left and text on the right.
- Item gap: `gap-3`, roughly `12px`.
- Negative/before icon: `18px`, muted gray `#71717A`.
- Positive/after marker: `16px` circle, primary green `#5EA500`, check icon inside, small green glow.
- Before text: Manrope, `14px`, normal `400`, muted gray `#A1A1A1`, relaxed line height.
- After text: Manrope, `14px`, medium `500`, gray-300 `#D1D5DB`, relaxed line height.

Rules:

- Use this only inside before/after comparison cards.
- Do not use the numbered content list marker here.
- Do not make list items interactive unless the whole block becomes a documented interactive pattern.

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

Approved base style:

- Pill shape with `border-radius: 9999px`.
- Transparent white surface: `rgba(255,255,255,0.05)`.
- Subtle white border: `rgba(255,255,255,0.10)`.
- Light blur: `backdrop-filter: blur(4px)`.
- Text: uppercase, Manrope, `12px`, `font-weight: 500`, `#d1d5db`, `letter-spacing: 0.025em`.
- Left status dot: core Garna green `#5EA500` with a looping ping animation.

Rules:

- Keep hero badge surfaces neutral; do not use green-tinted badge backgrounds or green badge text.
- All hero tags should use the shared `.garna-hero-badge` classes from `astro/styles/global.css`.
- Current reference: AI Hiring neutral hero badge.

## 5. Layout Principles

### Containers

- Основной max width: `max-w-7xl` + `px-6`.
- Узкий контент: `max-w-3xl`, `max-w-4xl`.
- Hero shell height and top/bottom padding are page-specific; do not bake them into the UI catalog layout examples.
- Большие секции: `py-16` на mobile, `lg:py-32` на desktop.

### Section backgrounds

- Default page background is always `#050505`.
- Standard content sections should not add their own full-width background color.
- Do not alternate sections with `#020202`, `#0A0A0A`, `#080808`, or other dark bands.
- Footer is the exception: keep the existing footer background `#020202`.
- In the UI catalog, show the footer at full content width, not as a half-width preview card.
- Visual separation between sections should come from spacing, typography, layout, cards, media and subtle dividers when needed.
- Background colors may still be used inside modal/dialog surfaces or special embedded UI illustrations.

### Standard hero layout

Use the White Label hero, `White Label Payroll Solutions for Business`, as the reference layout for split page heroes with text on the left and the main visual on the right.

Scope:

- This rule describes the inner hero composition only: text column, visual column and their relationship.
- Top/bottom page-shell spacing is page-specific and is not part of the catalog hero layout primitive.
- The UI catalog example should not add hero-shell `pt-*`, `pb-*` or `min-h-screen` spacing around this layout.
- The UI catalog can keep a small inner inset around the layout so the badge, CTA and visual do not touch the demo bounds.

Hero container:

- Inner container: `max-w-7xl mx-auto px-6`, full width, `relative`.
- Desktop layout: `flex flex-col lg:flex-row`, or equivalent grid, with the content column on the left and visual column on the right.
- Column relationship: content about `lg:w-5/12 xl:w-[45%]`; visual about `lg:w-7/12 xl:w-[55%]`.
- Column gap: around `gap-12`.
- Align columns near the top/center of the composition; do not center the text over the visual for this pattern.

Left content stack:

- Alignment: left on desktop.
- Badge, H1, subtitle and CTA stack vertically.
- H1: `text-4xl md:text-5xl lg:text-6xl`, `leading-[1.15]`, `font-normal`, `tracking-tight`, Manrope.
- Subtitle: `text-lg md:text-xl`, `font-light`, `leading-relaxed`, muted gray, `max-w-xl`.
- CTA sits directly under the subtitle and uses the approved hero/final CTA pattern.

Right visual:

- Place the dashboard/product visual in the right column.
- Production pages should use a real product/UI preview, not a decorative placeholder.
- The UI catalog should use a neutral rectangle labeled as the visual area, so the layout rule is clear without approving a specific visual mockup.
- Use a dark framed dashboard surface with subtle white borders and restrained green accents, following the White Label `Global Payouts Overview` mockup.
- Keep the visual inside the same hero container unless a page-specific full-bleed visual is explicitly approved.

Rules:

- Treat this as the default hero layout when a page has a meaningful UI/product visual.
- Use centered heroes only when there is no right-side visual or when a page-specific exception is documented.
- Do not bake top/bottom section padding into the layout primitive; compose that at the page shell level.

### Stats strip layout

Use the Payroll Solution stats block under the hero as the reference for reusable KPI strips such as `300+`, `24/7` and `98%`.

Scope:

- Use this for short proof-point numbers placed near the hero or between major sections.
- Keep it as a strip, not as three separate cards.
- Do not use this for dense analytics dashboards, pricing tables or feature cards.

Stats container:

- Full-width strip on the dark page background.
- Surface: `#080808`.
- Top and bottom borders: `white/5`.
- Inner container: `max-w-7xl mx-auto px-6`.
- Vertical inset: about `64px` on desktop, about `48px` on mobile.
- Desktop layout: three equal columns.
- Mobile layout: one column stack.
- Desktop separators: `divide-x white/5`; mobile separators: `divide-y white/5`.

Number typography:

- Manrope.
- White text.
- `font-light` / `300`.
- `text-5xl lg:text-6xl`, roughly `48px` to `60px`.
- `line-height: 1`.
- No green numbers, gradients or heavy weight.

Label typography:

- Manrope.
- Muted gray, use the same soft label color as approved supporting copy.
- `text-lg` / `18px`.
- `font-normal` / `400`.
- Keep labels short, one or two lines.

Animation:

- Numbers may animate once when the strip enters the viewport.
- Use the existing `garna-stat-anim` pattern: target number, suffix, `2500ms` duration and ease-out quart.
- Final text must resolve exactly to the target value plus suffix.
- Respect reduced-motion if this pattern is moved into a shared component.

Rules:

- Use exactly three stats unless a page-specific layout is documented.
- Keep each stat centered.
- Do not wrap stats in cards.
- Do not add icons, pills, green glows or decorative backgrounds.
- Keep the surface and border treatment quieter than CTA and card components.

### Comparison table layout

Use the White Label comparison block, `Independent build contractor management platform vs use Garna`, as the reference for feature comparison tables.

Scope:

- Use this for direct product/model comparisons with one feature column and two comparison columns.
- Default layout: three columns: `Features`, the alternative option and the Garna option.
- This is a data-display pattern, not a pricing table or card grid.

Container:

- Max width: about `1024px` to `1120px`, depending on copy length; do not stretch the table to the full section width.
- Outer shell: rounded `24px`, `border-white/5`, approved card fill `#0C0C0C`.
- Desktop layout: CSS grid with three equal columns.
- On narrow screens, the table can horizontally scroll or convert to stacked comparison cards if a page-specific mobile version is needed.
- Keep row and column borders subtle: `white/5`.

Highlighted Garna column:

- The Garna column is the only highlighted column.
- Highlight background: page-black or card-dark surface, not a bright green fill.
- Highlight border: primary green `#5EA500`.
- Highlight glow: soft and low-opacity, around `0 0 30px rgba(94,165,0,0.15)`.
- Header text in the highlighted column uses primary green.

Typography:

- Header cells: Manrope, `12px`, `font-medium` / `500`, uppercase, muted gray, increased letter spacing.
- Feature/value cells: Manrope, `14px`, normal `400`, relaxed enough for short phrases.
- Highlighted Garna values: white text, `font-medium` / `500`.
- Non-highlighted values: muted gray.

Icons:

- Feature icons: stroke icons, `16px`, white or muted.
- Negative values: red cross icon, `16px`, stroke style.
- Positive Garna values: green check icon, `16px`, stroke style.
- Icons should support scanning; do not replace the text value.

Rules:

- Use exactly one green highlighted column unless a page-specific variant is documented.
- Do not use heavy shadows, animated rows, zebra stripes or multicolor highlights.
- Keep the table readable as data first; visual treatment should support comparison, not dominate it.
- If table copy becomes long, allow wrapping inside cells rather than shrinking type below the approved size.

### Standard section layout

Use the For Contractors testimonials block, `Trusted by talent worldwide`, as the reference layout for normal content sections.

Scope:

- This rule describes the inner section composition: header stack, content grid and optional CTA.
- Top/bottom section padding is page-specific and is not part of the UI catalog layout primitive.
- The UI catalog example should not add section-shell `pt-*`, `pb-*` or vertical padding around this layout.
- The UI catalog can keep a small demo inset so the section tag and CTA do not touch the demo bounds.

Section container:

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

### Step switcher layout

Use the Payroll Solution / Home `How to get started` block as the reference for interactive process sections with multiple steps and a paired visual area.

Scope:

- Use this when a section explains a sequence of actions and each step has its own visual state.
- Default count: four steps.
- This is a layout and behavior pattern, not a card pattern.
- The UI catalog should show a neutral visual rectangle instead of approving a specific product mockup.

Section composition:

- Standard section header above the switcher: section tag if needed, H2 and subtitle using the approved section typography.
- Content grid: left step list and right visual area.
- Desktop layout: two columns, roughly equal or slightly wider visual column, with a large gap around `64px`.
- Mobile layout: one column, steps first and visual area below.
- Keep the whole switcher on the global dark background; do not introduce a new section fill.

Step trigger:

- Use real interactive controls, preferably `button` with tab/tabpanel semantics or equivalent accessible state.
- Left padding makes room for the circular step marker.
- Inactive trigger opacity: about `50%`.
- Hover/focus: trigger becomes fully opaque and the step title turns primary green.
- Active trigger: full opacity.
- Step marker: `40px` circle, page-background fill `#050505`, `border-white/5`, muted number in inactive state.
- Active marker: green border `#5EA500`, green number and soft glow `0 0 15px rgba(94,165,0,0.3)`.
- Vertical connector line between steps: `1px`, `white/5`.

Step typography:

- Title: Manrope, `24px`, `font-normal` / `400`, white by default, green on hover/focus/active.
- Description: Manrope, `16px`, `font-normal` / `400`, `leading-relaxed`, muted gray.
- Do not use hero heading sizes inside step triggers.

Visual area:

- Right-side visual container: dark rectangle, `rounded-2xl`, `border-white/5`, approved card fill `#0C0C0C` and subtle inset shadow.
- Switching visual states should fade/slide in: active panel uses opacity `1`, `translateY(0)`, `scale(1)`; inactive panels use opacity `0`, `translateY(32px)`, `scale(0.96)`.
- Use about `500ms ease-out` for panel transitions.
- UI catalog visual panels should be labeled generically as visual areas.

Behavior:

- Hover and focus should only preview the trigger affordance: full opacity and green step title.
- Click should activate the step and switch the visual panel.
- Keyboard selection should activate the step with Enter/Space; arrow navigation can move focus and active selection when implemented with tab semantics.
- Keep active state synchronized between the left trigger and the right visual panel.
- Respect `prefers-reduced-motion` if this pattern is converted into a shared component.

Rules:

- Do not draw concrete dashboards, forms or product mockups in the UI catalog version.
- Do not use multicolor step markers unless a page-specific variant is documented.
- Do not add card scaling, heavy glow or background swaps to the trigger list.
- Keep the visual area stationary; only the panel content state changes.

### How it works diagram

Use the AI Hiring / `How it works` block as the reference for static four-step process diagrams with animated flow.

Scope:

- Use this when a section explains a linear four-step process and does not need tabbed visual switching.
- This is a static diagram pattern, not the Step switcher pattern.
- Default count: exactly four points.
- Use the approved section heading and section subtitle typography above the diagram.

Diagram layout:

- Container max width: about `max-w-5xl`, roughly `1024px`.
- Desktop layout: four equal columns.
- Mobile layout: one column.
- Desktop connector: horizontal dotted/segmented line behind the icons.
- Mobile connector: vertical dotted/segmented line behind the icons.
- Animated flow line: primary green `#5EA500`, subtle, repeating continuously.

Node:

- Icon tile: `80px` square, `rounded-2xl`, `#0A0A0A` fill, `border-white/10`, centered `32px` line icon.
- Index badge: `32px` circle, top-right overlap, `#111111` fill, `border-white/10`, `12px` semi-bold number.
- Title: Manrope, `18px`, `font-medium` / `500`, white, centered.
- Description: Manrope, `14px`, normal `400`, muted gray, centered.

Hover and animation:

- The first three nodes lift the icon tile up by `8px` on hover.
- Hover also changes the icon tile border to green, changes icon/title/index to green and adds a soft green glow.
- The final node can have a passive pulse animation in its default state.
- The fourth/final node does not lift on hover; keep it visually aligned with the current live site behavior.
- Respect `prefers-reduced-motion` by removing flow and pulse animations.

Rules:

- Use this for simple process explanation only.
- Do not attach click behavior or panel switching to this diagram; use Step switcher when visual state changes are needed.
- Do not use concrete dashboard/product visuals inside this pattern.
- Keep the final point static on hover while the first three points lift.

### Final CTA layout

Use the shared `FinalCTASection.astro` patterns as the reference for the last CTA block on public pages.

Approved variants:

- Centered final CTA: title, subtitle and CTA button centered, no visual.
- Split final CTA: title, subtitle and CTA button on the left, visual area on the right.

Centered variant:

- Reference: Payroll Solution / Payroll Small Business final CTA, `Get Started With Garna Payroll Today`.
- Layout: centered content stack inside the section container.
- Content max width: around `max-w-4xl` for the heading and `max-w-2xl` for the subtitle.
- Title alignment: center.
- Subtitle alignment: center.
- CTA alignment: center.
- Use this when the final message is simple and does not need a product/talent visual.

Split variant:

- Reference: AI Hiring final CTA, `Stop searching. Start hiring.`
- Layout: two columns on desktop.
- Left column: title, subtitle and CTA button.
- Right column: visual area.
- Column gap: around `gap-12`.
- Title and subtitle align left on desktop.
- Mobile layout stacks into one column with content first and visual below.
- Use this when the final CTA benefits from a supporting product, talent or dashboard visual.

Typography:

- Title: Manrope, `text-4xl md:text-6xl`, `font-normal` / `400`, `leading-[1.1]`, white-to-gray/approved title gradient when used.
- Subtitle: use the Final CTA subtitle typography rule.
- CTA: use the approved Animated CTA pattern unless a page-specific final CTA button config says otherwise.

Visual area:

- Production pages can use the configured final CTA visual.
- The UI catalog should use a neutral rectangle labeled as the visual area, not a concrete mockup.
- Visual placeholder should use approved card fill `#0C0C0C`, `border-white/5`, rounded corners and subtle inset shadow.

Rules:

- Every public page final CTA should use one of these two variants unless a page-specific exception is documented.
- Do not add extra cards, stats, tabs or dense content inside the final CTA block.
- Do not use green-tinted heading text; keep green for the CTA and small accents only.
- Do not stretch the split visual beyond the final CTA container.

### Browser window visual

Use this pattern for product/dashboard visuals that imitate a browser or MacBook screen. The approved references combine the Payroll Solution wide hero browser and the White Label compact hero browser with one shared saturated browser chrome.

Approved variants:

- Large Payroll Solution browser window: use the wide hero visual proportion from Payroll Small Business / Payroll Solution. In the UI catalog, it should occupy almost the full available `span-12` content width, about `1120px` max.
- Compact White Label browser window: use the narrower White Label hero browser proportion. In the UI catalog, keep it visibly compact, about `520px` max width.

Window shell:

- Background: approved dark product surface, usually `#0C0C0C` or a near-black layered surface on `#050505`.
- Border: `white/5` or `white/10`, never a bright outline.
- Radius: about `16px` for browser-shell windows; inner cards may use `12px` to `16px`.
- Shadow/glow: subtle only; green glow may be used at low opacity around the shell, not as a full background effect.

Browser chrome:

- Top browser bar: near-black surface, about `40px` tall, with bottom border `white/5`.
- Traffic-light dots: saturated macOS colors from the White Label visual, not the muted Payroll version.
- Dot size: `10px`.
- Red: `#EF4444`; yellow: `#EAB308`; green: `#22C55E`.
- Both browser variants use the same centered URL pill: `white/5` fill, small muted text and one green live-status dot.
- Use the same URL treatment in both variants; do not show an address bar in one variant and omit it in the other.

Internal content:

- The UI catalog version should not document dashboard content.
- Use neutral skeleton geometry only: lines, bars, blocks, rows and simple panels.
- Do not write labels, names, amounts, tabs, buttons or feature copy inside the browser body.
- Use Garna green only for the logo mark, small status pills and subtle skeleton accents.
- Keep the large and compact browser bodies visually consistent; they differ by size and content density, not by chrome style.

Rules:

- Stack the large and compact versions vertically in the UI catalog; do not place them side by side or compress them into one horizontal layout.
- Keep each visual at its source proportion: Payroll browser is the wide version, White Label browser is the compact version.
- Browser chrome may stay consistent across variants even when dashboard content changes.
- The UI catalog should show only skeleton content inside this pattern; concrete dashboard mockups need separate approval.
- Do not use the older muted traffic-light dots from Payroll Solution.

### Grids

Используются:

- Standard content sections use the section layout rules above.
- Two-card and three-card content grids use `gap-6` / `24px`.
- Specialized dashboard, bento and mobile scroller grids are pending and should not be treated as catalog rules yet; the three-column stats strip and Browser window visual are the approved data-display exceptions.

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
- Mobile menu icon button: circular green icon button, `44px`, `rounded-full`, primary green fill with primary hover.
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
- Footer/contact links: green text with the real site icons, not text placeholders.
- Form inline links: green + underline.

### Footer Contact Icons

Reference: Payroll Small Business footer contact block.

- LinkedIn contact uses inline Lucide `linkedin` SVG.
- Email contact uses inline Lucide `mail` SVG.
- Icon box: `32px` square, `rounded-lg`, `#1A1A1A` background, `border-white/10`.
- Icon: `16px`, stroke width `1.5`, green `#4D8A00`.
- Hover: icon box background changes to `#5EA500/10`; text stays primary green.
- Do not use text placeholders such as `in` or `@` for footer contacts.

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

This is the shared base for approved content cards. Right now the approved card types are Contractor benefit card, Plain icon card, Testimonial card, Talent job card, Feature visual card, Visual content card, Top visual card, White Label model card and Before / after comparison cards.

- Default fill `#0C0C0C`.
- Default border `border-white/5` / `rgba(255,255,255,0.05)`.
- Radius, padding, typography and hover are defined by each approved card type.
- Card layout gap: use `24px` / `gap-6` between cards whenever a block shows two or three cards in one row.

Rules:

- Use the Payroll Solutions / Benefits for your contractors card color and border as the base card reference.
- Keep the horizontal gap between cards consistent across two-card and three-card blocks unless a separate component rule explicitly overrides it.
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

### Plain icon card

Reference: EOR / `Grow Your Global Workforce Faster`.

Use this for simple benefit cards where the icon should be a standalone mark, not an icon cell.

Anatomy:

- Card: `#0C0C0C` fill, `border-white/5`, `rounded-2xl`, `p-8`.
- Minimum height: around `270px`, matching the first approved card samples in the UI catalog.
- In mixed catalog grids, the card keeps its own height and does not stretch to match taller visual-card rows.
- Icon comes first and sits directly on the card surface.
- Icon: green `#5EA500`, `24px`, line icon.
- No icon cell: no square, no circle, no icon background, no icon border, no icon shadow.
- Title: Manrope, `text-xl` / `20px`, `font-medium` / `500`, white, `mt-5`, `mb-3`.
- Description: Manrope, `text-base` / `16px`, `font-normal` / `400`, `leading-relaxed`, muted gray `#A1A1A1`.

Hover:

- Use the Feature visual card hover behavior.
- Card border becomes green `#5EA500/40`.
- The same soft green glow as the Contractor benefit card appears: `0 0 34px -12px rgba(94,165,0,0.34)`.
- Card background does not change.
- Card does not scale or jump.
- Icon does not scale.

Rules:

- Use this as the second approved card pattern on the site.
- Use it when the card is a quiet supporting benefit, not a primary feature tile.
- Do not reuse the Contractor benefit icon cell here.

### Testimonial card

Reference: AI Hiring / `What businesses say`.

Use this for customer quote/review cards.

Anatomy:

- Card: `#0C0C0C` fill, `border-white/5`, `rounded-2xl`, `p-8`, `overflow-hidden`.
- Top row: five small yellow `iconify-icon` stars using `solar:star-bold`, `14px`, warning yellow `#EAB308`, `gap-0.5`; no quote icon.
- Quote text: Manrope, `text-base` / `16px`, normal `400`, `leading-relaxed`, gray-300 `#D1D5DB`.
- Author row: `border-t border-white/5`, `pt-6`, real portrait avatar `40px` circle with `object-cover`, `border-white/10`, name and role.
- Author name: Manrope, `text-sm` / `14px`, normal `400`, white.
- Author role/company: Manrope, `text-xs` / `12px`, medium `500`, primary green `#5EA500`.

Hover:

- Background changes from `#0C0C0C` to `#0F0F0F`.
- Border becomes slightly brighter, around `white/10`.
- Card jumps up subtly: `translateY(-4px)`.
- No green glow by default; the hover should feel lighter and quieter than CTA cards.
- No decorative gradient or blurred corner accent.

Rules:

- Use this as the third approved card pattern on the site.
- Keep the same base card fill and border as the rest of the card system.
- Do not reuse benefit-card icon cells inside testimonial cards.
- Use a real person photo for the avatar when the testimonial has an author image; use a neutral placeholder only when no image exists.
- Do not add quote marks, quote icons, decorative gradients or blur accents.
- Do not add heavy shadows, green borders or large movement.

### Talent job card

Reference: AI Hiring / `Explore available talent`, using the Consulting card as the structural reference.

Use this for available talent, job, role or candidate-pool preview cards.

Anatomy:

- Card: `#0C0C0C` fill, `border-white/5`, `rounded-xl`, `p-6`.
- Category tag: small uppercase green label, `10px`, bold `700`, `#5EA500/10` background and `#5EA500/20` border.
- Top icon: `32px` circular icon cell, `white/5` background, black/page-color border, muted gray icon.
- Title: Manrope, `text-lg` / `18px`, `font-semibold` / `600`, white by default.
- Meta line: Manrope, `text-sm` / `14px`, muted gray.
- Candidate avatars: overlapping `32px` circles, real photos with `object-cover`, no dark outline, optional `+N` counter.
- Footer: `border-t border-white/5`, `pt-4`, expected salary label/value on the left, circular arrow action on the right.
- Arrow action: `32px` circle, `white/10` background and border, white arrow.

Hover:

- Card border becomes green `#5EA500/40`.
- The same soft green glow as the Contractor benefit card appears: `0 0 34px -12px rgba(94,165,0,0.34)`.
- Card background does not change.
- Card does not scale or jump.
- Title color changes from white to primary green `#5EA500`.
- Circular arrow action background and border become primary green `#5EA500`.
- Top icon and candidate avatars do not scale.

Rules:

- Use this as the fourth approved card pattern on the site.
- Keep the shared card fill and base border from the design system, not the original reference `#0A0A0A` fill.
- Use the Consulting card as the content-density reference: compact tag, title, small metadata, avatar row and salary footer.
- Do not add background hover swaps, zoom effects or large shadows to this card type.

### Feature visual card

Reference: AI Hiring / `Expand your hiring funnel`, using the `Scale Top-of-Funnel` card as the structural reference.

Use this for feature cards that need one icon, one title, one description and a contained visual area.

Anatomy:

- Card: `#0C0C0C` fill, `border-white/5`, `rounded-2xl`, `p-8`, `overflow-hidden`.
- Minimum height: around `400px` when the card includes a visual area.
- Icon cell: same as Contractor benefit card, `48px` square, `rounded-xl`, `#5EA500/10` background, `#5EA500/20` border.
- Icon: green `#5EA500`, `24px`, stroke style, `1.5px` stroke.
- Title: Manrope, `text-xl` / `20px`, `font-medium` / `500`, white, `mb-3`.
- Description: Manrope, `text-base` / `16px`, `font-normal` / `400`, `leading-relaxed`, muted gray `#A1A1A1`.
- Visual area: dark rectangle at the bottom, `rounded-xl`, `border-white/5`, `#050505` fill, inset shadow. In the UI catalog, label it as a generic visual area instead of drawing a specific product mockup.

Hover:

- Card border becomes green `#5EA500/40`.
- The same soft green glow as the Contractor benefit card appears: `0 0 34px -12px rgba(94,165,0,0.34)`.
- Card background does not change.
- Card does not scale or jump.
- Icon cell does not scale.
- Visual area does not scale.

Rules:

- Use this as the fifth approved card pattern on the site.
- Use it when the visual is part of the feature explanation, not when the card is only icon/title/body copy.
- Do not approve a concrete dashboard, funnel, chart or mockup from this pattern unless it is documented separately.
- Do not add animated visual details, icon scaling, visual scaling, background swaps or heavy shadows.

### Visual content card

Use this for feature/content cards that need one title, one description and a contained visual area, but no icon.

Anatomy:

- Card: `#0C0C0C` fill, `border-white/5`, `rounded-2xl`, `p-8`, `overflow-hidden`.
- Minimum height: around `400px` when the card includes a visual area.
- No icon cell.
- Title: Manrope, `text-xl` / `20px`, `font-medium` / `500`, white, `mb-3`.
- Description: Manrope, `text-base` / `16px`, `font-normal` / `400`, `leading-relaxed`, muted gray `#A1A1A1`.
- Visual area: dark rectangle at the bottom, `rounded-xl`, `border-white/5`, `#050505` fill, inset shadow. In the UI catalog, label it as a generic visual area.

Hover:

- Use the Testimonial card hover behavior.
- Background changes from `#0C0C0C` to `#0F0F0F`.
- Border becomes slightly brighter, around `white/10`.
- Card moves up subtly: `translateY(-4px)`.
- No green border, no green glow, no icon scaling and no visual scaling.

Rules:

- Use this as the sixth approved card pattern on the site.
- Use it when the visual preview is enough to identify the feature and an icon would be redundant.
- Do not add the Contractor benefit icon cell to this card type.
- Do not use the Feature visual card hover here; this pattern follows the quieter Testimonial hover.

### Top visual card

Reference: EOR / `Everything You Need to Hire and Pay Globally`.

Use this for feature cards where the visual preview comes first, followed by the title and description.

Anatomy:

- Card: `#0C0C0C` fill, `border-white/5`, `rounded-2xl`, `p-5`, `overflow-hidden`.
- Height follows content; do not set a fixed card height.
- Visual area comes first: `h-40` / `160px`, `rounded-xl`, `border-white/5`, `#050505` fill, subtle inset shadow.
- In the UI catalog, show only one simple rectangle labeled as the visual area. Do not add an inner black mockup, lines, charts or dashboard details.
- Title: Manrope, `text-xl` / `20px`, `font-medium` / `500`, white, `mt-6`, `mb-3`.
- Description: Manrope, `text-base` / `16px`, `font-normal` / `400`, `leading-relaxed`, muted gray `#A1A1A1`.

Hover:

- Use the Visual content card hover behavior.
- Background changes from `#0C0C0C` to `#0F0F0F`.
- Border becomes slightly brighter, around `white/10`.
- Card moves up subtly: `translateY(-4px)`.
- No green border, no green glow and no visual scaling.

Rules:

- Use this as the seventh approved card pattern on the site.
- Use it when the visual should be read before the text.
- Do not add an icon above or beside the title; the visual is the leading element.
- Do not reverse this order. If text comes first and visual is below, use Visual content card instead.

### White Label model card

Reference: White Label / `Your logo on the front. Our powerful engine under the hood.`, using the `Fully Branded` and `Co-Branded` cards as the structural reference.

Use this for two-option model cards where each card has an icon and title in the top row, with the description below that row.

Layout:

- The cards are shown as a two-card layout, not as independent cards inside a three-column grid.
- Container max width: `max-w-5xl`, roughly `1024px`.
- Desktop: `grid-cols-2`, `gap-6`, roughly `24px`.
- Mobile: one column.

Anatomy:

- Card: `#0C0C0C` fill, `border-white/5`, `rounded-2xl`, `p-8`, `overflow-hidden`.
- Height follows the content; do not set a fixed or minimum height for this card type.
- Content direction: vertical card stack.
- Header row: icon on the left, title on the right, `gap-4`, `mb-4`.
- Description sits below the icon/title row, not beside the icon.
- Icon cell: `48px` square, `rounded-xl`, `#5EA500/10` background, `#5EA500/20` border, no shadow.
- Icon: green `#5EA500`, `24px`, stroke style, `1.5px` stroke.
- Title: Manrope, `text-xl` / `20px`, `font-medium` / `500`, white.
- Description: Manrope, `text-base` / `16px`, `font-normal` / `400`, `leading-relaxed`, muted gray `#A1A1A1`.

Hover:

- Card moves up slightly: `translateY(-4px)`.
- Card border becomes green `#5EA500/40`.
- The same soft green glow as the Contractor benefit card appears: `0 0 34px -12px rgba(94,165,0,0.34)`.
- Card background does not change.
- Icon cell does not scale.
- Icon cell does not receive a shadow.

Rules:

- Use this as the eighth approved card pattern on the site.
- Use it for paired model/choice cards where both cards share equal width.
- Do not use colored variants from the reference; normalize to the approved green palette.
- Do not add internal gradients, blurred corner accents or decorative glow layers. The card fill stays the standard approved card surface.
- Do not add visual areas, avatars, price footers or icon scaling to this card type.

### Before / after comparison cards

Reference: AI Hiring / `Connect with the right talent`.

Use this for paired comparison blocks that show the old/problem state on the left and the improved Garna/AI state on the right.

Layout:

- The cards are shown as a two-card layout, not as independent cards inside a three-column grid.
- Desktop: `grid-cols-2`, `gap-6`, roughly `24px`.
- Mobile: one column.
- Both cards should have equal height.

Before card:

- Card: `#0C0C0C` fill, `border-white/5`, `rounded-2xl`, `p-8`.
- Header row: `40px` red icon cell plus title.
- Red icon cell: `#EF4444/10` background, `#EF4444/20` border, icon color `#EF4444`, no glow.
- Title: Manrope, `20px`, normal `400`, white.
- List: use the Before / after comparison list item typography.
- Visual area: abstract placeholder only in the UI catalog, `rounded-xl`, `border-white/5`, dark fill.

After card:

- Card: `#0C0C0C` fill with a subtle primary green radial gradient.
- Border: primary green at low opacity, about `#5EA500/20`.
- Header row: `40px` green icon cell plus title.
- Green icon cell: `#5EA500/10` background, `#5EA500/20` border, icon color `#5EA500`.
- Title: Manrope, `20px`, normal `400`, white.
- List: use the positive Before / after comparison list item typography.
- Visual area: abstract placeholder only in the UI catalog, with slightly stronger green accents than the before card.

Hover:

- No hover effect.
- Do not move, scale, brighten, change the background, or add hover shadows to these cards.

Rules:

- Use this as the ninth approved card pattern on the site.
- Use red only for the negative/before icon accent in this pattern; do not introduce red borders or red card fills.
- Do not draw concrete product/person visuals in the UI catalog version.
- Do not use this pattern for generic feature cards; it is only for before/after comparisons.

### Photo overlay badge

Reference: EOR / `The Answer to Why Companies Choose Garna`, overlay badges placed on the image panels.

Use this for small informational badges that sit on top of a photo or visual area.

Catalog display:

- Show only the small badge itself.
- Do not add a demo photo, visual panel, decorative background or extra surrounding scene in the UI catalog.

Placement:

- The badge is positioned absolutely inside the visual container.
- Allowed corners: top-left, bottom-left, top-right or bottom-right, chosen by the image composition.
- Default inset from the visual edge: `20px`.
- Keep the badge within the image bounds; do not let it overlap section text or controls.

Anatomy:

- Badge: inline flex row, icon on the left and copy on the right.
- Max width: about `256px` / `16rem`.
- Gap: `12px`.
- Padding: `12px 16px`.
- Radius: `rounded-2xl` / `16px`.
- Background: `#111111`.
- Border: `white/10`.
- Shadow: strong dark photo separation shadow, around `shadow-2xl shadow-black/50`.
- Icon cell: circular, `36px`, `#5EA500/20` background, icon color `#5EA500`.
- Icon: line icon, about `19px`.
- Title: Manrope, `14px`, `font-semibold` / `600`, white.
- Supporting text: Manrope, `12px`, normal `400`, primary green `#5EA500`.

Rules:

- Use this only as an overlay on media/visual panels.
- Do not use it as a standalone card or section badge.
- Do not add gradients, glass blur, extra icons, avatars or CTA buttons inside this badge.
- No hover effect by default.

## 12. Tags and Badges

### Hero tag / badge

Anatomy:

- Inline-flex.
- `rounded-full`.
- Base hero badge background: `white/5`.
- Base hero badge border: `white/10`.
- Compact height: about `20px`; use `py-0.5` / `2px` vertical padding, not a tall pill.
- Status dot: 6px green dot with optional ping.
- Uppercase label, `11px`, medium, tight line-height.

Usage:

- Use only above the hero H1.
- Do not use this pill/dot style above section H2 headings.

### Section tag / eyebrow

Use the Section eyebrow / tag typography rule for optional labels above section H2 headings.

- Plain green uppercase text.
- No pill background.
- No white border.
- No dot or ping animation.
- Default spacing: `16px` between the tag and H2.

Rules:

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
- Arrow icon: `iconify-icon` `solar:alt-arrow-down-linear`, same as FAQ accordion.
- Arrow color: muted gray by default, white on open; keep green for focus border and selected option.
- Arrow rotates 180 degrees on open using the same easing as FAQ.
- Do not use text glyphs such as `⌄` for the select arrow.
- Dropdown card: `rgb(10,10,10)`, border `rgb(34,34,34)`, radius `12px`, shadow.
- Selected option: green text, medium weight.

### Embedded Form Card

Used on `public/pages/form/form.html`.

- Black background.
- Border `rgba(255,255,255,0.1)`.
- Radius `1.5rem`.
- Padding `2rem` mobile, `3.5rem` desktop.

## 14. Accordions and FAQ

The current behavior standard is the Payroll Solutions FAQ pattern. Public FAQ blocks should show real open/close behavior, not only a static visual state.

### Standard FAQ Card

Anatomy:

- Container: `#0C0C0C` fill, `border-white/5`, `rounded-xl`, `overflow-hidden`.
- Open state: subtle `#0E0E0E` background, green-tinted border around `#5EA500/32`, soft green glow.
- Question row: full-width `button`, `px-5/6`, `py-5`, `text-base`, `font-semibold`, white Manrope text.
- Icon: `iconify-icon` `solar:alt-arrow-down-linear`, muted gray by default, primary green on open, rotates 180deg on open.
- Answer panel: animated `height` transition from `0px` to `scrollHeight`, with opacity and `translateY` easing.
- Answer text: top border `white/5`, `px-5/6`, `pb-5/6`, `text-[#A1A1A1]`, `text-sm`, relaxed line height.

Behavior:

- Use a real trigger button with `aria-expanded` and `aria-controls`.
- Toggle an `is-active` state on the FAQ item.
- On open: set panel height from `0px` to `scrollHeight`, opacity from `0` to `1`, transform from `translateY(-10px)` to `translateY(0)`.
- On close: animate back from current `scrollHeight` to `0px`.
- Use the Payroll Solutions timing as the reference: `520ms cubic-bezier(0.16, 1, 0.3, 1)` for height/transform and about `340ms ease` for opacity.
- Respect `prefers-reduced-motion`.

Rules:

- Do not use a purely static FAQ sample in the UI catalog.
- Checkbox-only accordions are allowed on legacy pages, but new FAQ examples should use the button + animated height behavior.
- Keep the FAQ visual shell aligned with the shared card palette unless a page-specific reason is documented.

## 15. Tabs

Use the Employee Records-style tab behavior for catalog demonstrations and new tabbed content:

- Hidden radio inputs.
- Label tabs with a bottom border.
- Inactive tab: muted gray `#71717a`.
- Hover state: tab text becomes white.
- Active tab: white text and primary green `#5EA500` bottom border.
- Panels switch by `:checked ~ .tab-panels`.
- Panel content can fade/slide in subtly, but the tab label movement should stay minimal.

### Segmented content switcher

Use this for two-option section-level switching, for example `Contractor of Record` / `Employer of Record`, where the selected option changes the content below the section header.

Composition:

- Standard centered section stack: H2, subtitle, then the switcher directly underneath.
- The switcher is centered under the title/subtitle, not aligned to the content grid edge.
- Content panels sit below the switcher and change only when an option is clicked/selected.
- Do not switch content on hover; hover only improves the inactive option text color.

Switcher shell:

- Display: inline-flex.
- Mobile: vertical stack; desktop/tablet: horizontal row.
- Width: intrinsic on desktop; do not stretch the shell to the section/container width. Full width is allowed only on narrow mobile.
- Shell background: `#0A0A0A`.
- Shell border: `white/5`.
- Shell radius: `rounded-xl` to `rounded-2xl`, about `16px`.
- Shell padding: about `6px`.
- Gap between options: about `4px`.
- Shadow: subtle dark shadow only, no green glow on the shell.

Options:

- Use real controls: `button` with selected state, or `radio` + `label` with accessible state.
- Option padding: about `px-6 py-2.5`; keep a compact clickable height around `40px`.
- Label typography: Manrope, `text-sm` / `14px`, `font-light` / `300`.
- Inactive option: transparent background, gray text around `#9CA3AF`.
- Hover/focus inactive option: text becomes white.
- Active option: primary green `#5EA500` fill, white text, `rounded-lg`, subtle green-tinted shadow.

Rules:

- Use this as the approved pill/segmented tab variant.
- Use it for two high-level content modes, not for dense multi-tab navigation.
- Keep the switcher compact; do not turn it into a large CTA-sized control.
- Keep labels concise; if labels wrap awkwardly, use mobile vertical stacking instead of shrinking type below the approved size.
- Do not add gradients, colored inactive fills, icon scaling or content switching on hover.

Rules:

- The catalog must show hover and active states, not only a single static active tab.
- Tabs should be implemented as real controls (`radio` + `label` or equivalent accessible buttons), not plain inactive `div` elements.
- Keep tab labels compact and avoid card-like pills unless using the approved Segmented content switcher variant.

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
- Stats number count-up.
- Step switcher panel fade/slide.
- Rainbow background continuous slide.
- White-label CTA animated conic border.

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
- Photo overlay badge.
- Hero headline.
- Final CTA headline.
- Section heading.
- Body paragraph.
- Numbered content list item.
- Before / after comparison list item.
- Fine print/disclaimer.
- Inline link.
- Logo lockup.

Cards:

- Contractor benefit card.
- Plain icon card.
- Testimonial card.
- Talent job card.
- Feature visual card.
- Visual content card.
- Top visual card.
- White Label model card.
- Before / after comparison cards.
- Other card types are pending and should not be treated as approved rules yet.

Data display:

- Stats strip.
- Comparison table.
- Browser window visual.
- Dashboard, chip, chart and toggle examples outside the browser-window pattern are pending until their rules are defined.

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

- How it works diagram.
- FAQ accordion using the Payroll Solutions behavior pattern.
- EOR animated FAQ.
- CSS radio tabs.
- Segmented content switcher.
- Step switcher.
- Final CTA layout.
- Horizontal mobile card scroller.

Special pages:

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
   - Plain icon card
   - Testimonial card
   - Talent job card
   - Feature visual card
   - Visual content card
   - Top visual card
   - White Label model card
   - Before / after comparison cards
   - How it works diagram
   - Segmented content switcher
   - Step switcher
   - Final CTA layout
5. Keep `#5EA500` as the single primary brand color and use green glow sparingly.
