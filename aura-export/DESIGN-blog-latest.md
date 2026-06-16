---
version: alpha
name: Garna
description: A futuristic, high-density global payroll and AI recruitment platform featuring a dark glassmorphism aesthetic, high-contrast typography, and interactive 3D/motion elements.
colors:
  primary: "#5EA500"
  background: "#050505"
  surface: "#0A0A0A"
  surface-card: "#0C0C0C"
  text-primary: "#FFFFFF"
  text-secondary: "#A1A1AA"
  accent-blue: "#3B82F6"
  accent-red: "#EF4444"
typography:
  fontFamily: "Manrope, Inter, sans-serif"
  heading: "Manrope"
  body: "Inter"
  mono: "Geist Mono, Space Mono"
spacing:
  section-py: "8rem"
  card-gap: "2rem"
rounded:
  default: "12px"
  large: "24px"
  full: "9999px"
components:
  glass: "backdrop-blur(12px) bg-white/3 border-white/8"
  glass-high: "backdrop-blur(16px) bg-[#141414]/60"
  accent-glow: "shadow-[0_0_60px_-20px_rgba(94,165,0,0.4)]"
---

## Overview
Garna is a professional fintech and recruitment platform defined by a premium "Dark Mode" interface. It utilizes a "Glassmorphism" design language where surfaces feel like semi-transparent frosted glass over deep black backgrounds. The visual tone is high-tech, precise, and data-driven, employing thin-weight typography (font-thin/light) and sharp lime-green accents (#5EA500) to represent growth and reliability. The layout is high-density, featuring bento-style grids and dashboard mockups that imply sophisticated utility.

## Colors
- **Base Background**: `#050505` (Deep Black).
- **Primary Accent**: `#5EA500` (Lime Green) - used for buttons, status indicators, and active states.
- **Secondary Surface**: `#0A0A0A` / `#0C0C0C` - used for cards and nested containers.
- **Text Hierarchy**: White (`#FFFFFF`) for headers, Zinc (`#A1A1AA`) for body text, and Gray-500/600 for meta data.
- **Status Colors**:
  - Red (`#EF4444`): Outgoing transfers, errors.
  - Blue (`#3B82F6`): Data points, GBP/EUR markers.
  - Purple (`#A855F7`): Team payout promotions.

## Typography
- **Headings**: Manrope. Used in weights from 300 (Light) to 700 (Bold). Tracking is typically tight (`tracking-tighter`).
- **Body**: Inter. Clean sans-serif used for descriptions and inputs.
- **Code/Data**: Geist Mono or Space Mono. Used for account numbers, transaction hashes, and timers.
- **Scales**: Hero headers reach `8xl` (128px) on desktop, while meta text drops to `9px` (extra small).

## Layout
- **Container**: Max-width of `7xl` (80rem/1280px) with `px-6` (1.5rem) side padding.
- **Grid System**:
  - Bento-style layout for features: mixing `col-span-1` and `col-span-2` structures.
  - Dashboard utilizes a `grid-cols-12` system with a 3-column sidebar.
- **Responsiveness**: Smooth transitions from single-column mobile views to complex multi-column desktop grids using Tailwind breakpoints (`md:`, `lg:`).

## Elevation & Depth
- **Z-Axis Layers**:
  - Background: Particle effects and blur gradients (`blur-[120px]`).
  - Mid-ground: Content cards with `1px` borders (`border-white/5`).
  - Foreground: Fixed glass navigation (`z-50`) and interactive modals.
- **3D Transforms**: The dashboard mockup uses `perspective-1000` with `rotate-x` and `scale` properties to create depth.

## Shapes
- **Corner Radius**:
  - Buttons & Sidebar items: `12px` (xl).
  - Main Cards: `24px` (3xl).
  - Badges/Avatars: `full` (9999px).
- **Borders**: Thin `1px` stroke in `rgba(255,255,255,0.08)` to define edges without heavy shadows.

## Components
- **Buttons**:
  - Primary: Filled `{colors.primary}` with white text and a `conic-gradient` border-spin animation.
  - Secondary: `{glass}` style with white text and hover scaling.
- **Inputs**: Dark background `#1A1A1A`, transition to primary border on focus.
- **Status Badges**: Small capsules with `10%` background opacity of the status color (e.g., Green text on Green/10 background).
- **Job Cards**: Vertical stacks with category badges, salary data, and overlapping avatar groups.

## Page Sections
### Navigation
- **Properties**: Fixed height `h-16`, `glass-high` material, `z-50` index.
- **Content**: Left-aligned lowercase "garna" logo, right-aligned "Sign Up" and "Book a demo" primary button.

### Hero Surface
- **Composition**: Centered text stack over an animated mesh background.
- **Content**: `8xl` Manrope headline with a gray-to-white gradient. Primary CTA followed by a 3D-rotated dashboard mockup.

### Dashboard Mockup
- **Structure**: Simulated browser window with red/yellow/green control dots.
- **Panels**: Left sidebar with icon-nav list. Main content area featuring a large balance card and scrollable transaction list.

### AI-Hiring Bento Grid
- **Structure**: Three cards of varying heights.
- **Visuals**: Animated SVG funnels for talent pipeline, interactive waveform icons, and AI-score progress bars.

### Blog Feed
- **Layout**: 3-column article grid.
- **Cards**: Aspect-ratio `21/9` or `16/9` cover images with `{rounded.large}` corners. Hovering triggers a `scale-105` image transform.

## Motion & Interaction
- **Hover Effects**: All cards use `hover:-translate-y-1` and `hover:border-primary/30` with `duration-500` transitions.
- **Animations**:
  - `border-spin`: Conic gradient rotating around primary buttons.
  - `radar-sweep`: 404 page scanning effect using `conic-gradient` and `rotate(360deg)`.
  - `num-anim`: JS-driven count-up effect for currency and stats.
  - `pulse-ring`: Rippling circles behind central icons.

## Do's and Don'ts
- **Do**: Use thin font weights (`font-thin`) for large body paragraphs to maintain a premium feel.
- **Do**: Use `backdrop-filter: blur` on all overlapping surfaces.
- **Don't**: Use solid bright backgrounds; stay within the deep black/zinc palette.
- **Don't**: Use standard box shadows; prefer border strokes and glow-blur effects.

## Accessibility
- **Contrast**: High contrast (White/Lime on Black) ensures readability for primary content.
- **Feedback**: Focus-visible states implemented via primary color border glows (`accent-glow`).
- **Interactive**: `role="button"` and `aria-label` attributes present on custom icons and menu toggles.

## Assets
1. other: https://cdn.tailwindcss.com
2. other: https://unpkg.com/lucide@latest
3. embed: https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap
4. embed: https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap
5. embed: https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap
6. embed: https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap
7. embed: https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap
8. embed: https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;900&display=swap
9. embed: https://fonts.googleapis.com/css2?family=Instrument+Serif:wght@400;500;600;700&display=swap
10. embed: https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap
11. embed: https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700&display=swap
12. embed: https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap
13. embed: https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap
14. embed: https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap
15. embed: https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700;800&display=swap
16. embed: https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap
17. embed: https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500;600;700&display=swap
18. embed: https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap
19. embed: https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap
20. embed: https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap
21. embed: https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400..800&display=swap
22. embed: https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400;500;600;700&display=swap
23. embed: https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap
24. embed: https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap
25. embed: https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap
26. other: https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js
27. other: https://app.garna.io/auth/sign-up
28. other: https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&q=80
29. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4ea5c571-80d4-4ff4-8cf2-210e25af6262_320w.png
30. other: https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80
31. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/d53eeb9d-92c5-4820-9733-4fe2e036e76e_800w.png
32. other: http://www.w3.org/2000/svg
33. other: https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js
34. embed: https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap
35. other: /
36. other: %23noiseFilter
37. embed: https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Manrope:wght@400;500;600;700&display=swap
38. other: /home
39. other: /offer
40. other: /ai-hiring
41. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/6796e183-1c01-4a97-ad04-0df01fe2b6ed_1600w.png
42. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/f8322831-e2ba-4007-9960-8e7e82b00480_320w.webp
43. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/6e825b87-0682-49e3-98c2-dbdab1f8f9c5_320w.webp
44. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/25df7579-09f7-4c8c-bb39-18a974a980d0_320w.webp
45. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/83a1ae5f-c842-4ee9-a912-505fc66a1ee0_320w.webp
46. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg
47. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/e69e5f8e-07cd-4ef2-97e3-d4bcfccc3881_320w.webp
48. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/bd0dc97c-a094-49ac-8265-f47f1efa3939_320w.webp
49. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/af66ba5d-69b1-41c6-b463-40f48d0134da_320w.webp
50. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/8003e855-7d21-4b11-ba40-2921946b8a25_320w.webp
51. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/65695f80-23f9-46ee-8487-cbb6c93cc48b_320w.webp
52. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/a1e31719-a86b-48bc-8913-670561250931_320w.webp
53. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/e5cbf539-f61a-4c9d-aff7-ea01dc1ddcb9_320w.webp
54. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/146e6ba9-12a4-43b3-a1a3-7b2340a34a70_320w.webp
55. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5d0296a8-c467-44ef-9d51-ce4ee3a2c3c6_320w.webp
56. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/d93fdd79-8748-45cc-bf20-725a75594265_320w.webp
57. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/1e96bbb7-a5c7-4597-987a-3a820daffbff_3840w.jpg
58. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/ce2a7455-784d-41ab-ad0c-17b8bc4f6a6d_3840w.jpg
59. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5bab247f-35d9-400d-a82b-fd87cfe913d2_1600w.webp
60. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/30104e3c-5eea-4b93-93e9-5313698a7156_1600w.webp
61. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg
62. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg
63. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/bb452ec2-a1f6-49ac-ad2f-d7d1defcdacd_1600w.webp
64. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/2d1e1a85-a813-4d6d-92b4-b85127b934d3_1600w.webp
65. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/3c172b3b-2bef-4c90-a25f-59a70eade113_1600w.webp
66. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/dba30eaa-553b-42f4-a0f5-7c4e93219870_3840w.png
67. other: https://www.linkedin.com/company/garna-io
68. other: https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80
69. image: https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/fdb0cbaa-87f1-425d-b6a2-ad16a6de7cb7_3840w.jpg
