# Garna Design System

Документ описывает фактическую дизайн-систему текущего сайта Garna по исходникам проекта. Основные источники: статические страницы в `public/pages/*`, общий header в `src/utils/header.ts`, фон `public/rainbow-bg.css` и React-виджет формы в `src/components/form-garna-component-main/src/components/*`.

## 1. Общая дизайн-идея

Garna использует темную fintech/SaaS эстетику: черный фон, полупрозрачные стеклянные поверхности, кислотно-зеленый primary-акцент, компактные dashboard-макеты и карточки с банковскими/HR/payroll сценариями.

Ключевые признаки:

- Темная база: почти черный фон `#050505`, секционные подложки `#020202`, панели `#0A0A0A` и `#0c0c0c`.
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
| `--color-bg` | `#050505` | Основной фон body и viewport |
| `--color-bg-deep` | `#020202` | Темные секционные полосы, footer |
| `--color-surface` | `#0A0A0A` | Dashboard/app панели, modal body |
| `--color-surface-card` | `#0c0c0c` | Feature cards, glass card fill |
| `--color-surface-raised` | `#111111` | Mockup panels, elevated cards |
| `--color-border` | `rgba(255,255,255,0.08)` | Основная тонкая граница |
| `--color-border-soft` | `rgba(255,255,255,0.05)` | Очень мягкие разделители |
| `--color-text` | `#ffffff` | Заголовки и важный текст |
| `--color-text-muted` | `#a1a1aa` | Базовый body text |
| `--color-text-soft` | `#71717a` / `#6b7280` | Вторичный текст |
| `--color-primary` | `#5EA500` | CTA, active links, success indicators |
| `--color-primary-hover` | `#6ab901` | Hover для widget button |
| `--color-primary-dark` | `#4d8700` / `#4d8a00` | Hover и декоративные штрихи |
| `--color-error` | `rgb(255,3,3)` | Ошибка формы |

### Accent Usage

Зеленый не должен становиться фоном всей страницы. Он работает лучше как:

- Primary CTA.
- Active nav item.
- Маленький статусный dot.
- Иконка внутри soft green circle.
- Progress bar.
- Glow вокруг важных карточек.
- Border highlight у выбранных/открытых состояний.

## 4. Типографика

### Семейства

- `Inter`: базовый текст, body, вторичные описания.
- `Manrope`: заголовки, navigation, CTA, карточки, продуктовые mockup labels.
- В 404 есть дополнительные подключенные шрифты, но это локальный эксперимент. Для системы сайта основные шрифты: Inter + Manrope.

### Иерархия

| Role | Approx classes | Guidance |
| --- | --- | --- |
| Hero H1 | `text-5xl md:text-7xl`, `leading-[1.1]`, `font-normal`, `tracking-tight` | Большой, легкий по весу, белый или white-to-gray gradient |
| Section H2 | `text-3xl md:text-5xl`, `font-normal`, `tracking-tight` | Использовать для крупных секций |
| Card title | `text-lg` to `text-3xl`, `font-semibold` | Белый, Manrope |
| Body | `text-base` / `text-lg`, `font-light`, `leading-relaxed` | Серый `text-gray-400` |
| Label / eyebrow | `text-xs` or `text-sm`, uppercase, `tracking-wide` / `tracking-[0.18em]` | Зеленый или серый |
| Fine print | `text-[10px]`, `text-xs`, `text-gray-600` | Footer legal, disclaimer |

## 5. Layout Principles

### Containers

- Основной max width: `max-w-7xl` + `px-6`.
- Узкий контент: `max-w-3xl`, `max-w-4xl`.
- Hero часто использует `min-h-screen`, `pt-32`, `pb-32`.
- Большие секции: `py-16` на mobile, `lg:py-32` на desktop.

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

### `.glass`

Используется для nav/card/FAQ контейнеров.

```css
background: rgba(255, 255, 255, 0.03);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.08);
```

Назначение: мягкая прозрачная поверхность на черном фоне. Подходит для FAQ, dashboard shell, secondary panels.

### `.glass-card`

Варианты отличаются между страницами, но общий смысл:

```css
background: rgba(255, 255, 255, 0.02-0.03) or rgba(12,12,12,0.6);
backdrop-filter: blur(20px);
border: 1px solid rgba(255,255,255,0.06-0.08);
box-shadow: 0 4px 30px rgba(0,0,0,0.1);
```

Назначение: feature card, mockup card, elevated product surface.

### `.glass-high` / `.glass-nav`

Header surface:

```css
background: rgba(5, 5, 5, 0.7-0.72);
backdrop-filter: blur(16px);
border-bottom: 1px solid rgba(255,255,255,0.08);
```

Назначение: fixed navigation bar.

### `.surface` and `.surface-soft`

EOR page introduces more explicit surface utilities:

- `.surface`: gradient from dark raised surface to deep black.
- `.surface-soft`: `rgba(255,255,255,0.035)` + border `rgba(255,255,255,0.08)`.

Use `surface-soft` for dense repeated cards where glass is too visually noisy.

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

Used in header, hero CTAs, EOR buttons, widget button.

Core anatomy:

- Background `#5EA500`.
- Text white.
- Radius `12px`.
- Horizontal padding around `24-32px`.
- Height/min-height around `44-48px`.
- Manrope, medium or semibold.
- Hover: slight scale or translate, stronger green glow.
- Icon: arrow right or arrow up right, moves slightly on hover.

Variants:

- Header signup: compact `h-11`, `rounded-xl`.
- Page CTA: `button-primary` with shine pseudo-element.
- White-label demo CTA: `garna-demo-cta` with animated conic border and shimmer.
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

- Dark fill `#0c0c0c` or `surface-soft`.
- Border `white/5` to `white/10`.
- Radius `rounded-2xl` or `rounded-3xl`.
- Padding `p-6` to `p-8`.
- Optional hover border/translate.
- Icon cell: green icon on green translucent background.

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
- `border-white/10`
- `bg-[#111111]`
- icon circle green
- title white + status green

## 12. Badges, Pills, Chips

### Hero Badge

Anatomy:

- Inline-flex.
- `rounded-full`.
- Background `white/5` or `#5EA500/10`.
- Border `white/10` or `#5EA500/20`.
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

- Container: `group bg-[#0A0A0A] rounded-xl border border-white/5 overflow-hidden`.
- Open state: `bg-[#0E0E0E]`.
- Question row: `pt-6 pr-6 pb-6 pl-6`, `text-base`, `font-medium`, white Manrope text.
- Icon: `solar:alt-arrow-down-linear`, gray `text-gray-500`, rotates 180deg on open.
- Answer panel: CSS grid row transition from `grid-rows-[0fr]` to `grid-rows-[1fr]`.
- Answer text: `px-6 pb-6 text-gray-400 text-sm leading-relaxed font-normal`.

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
- Animated demo CTA.
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
