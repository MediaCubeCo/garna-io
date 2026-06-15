---
version: alpha
name: Garna Brand System
description: A high-density, dark-themed fintech and recruitment platform design system. It uses a "glassmorphism" aesthetic combined with vibrant lime-green accents to convey technological precision and financial security.
colors:
  primary: "#5EA500"
  background: "#050505"
  surface: "#0A0A0A"
  surface-light: "#0E0E0E"
  accent-blue: "#3B82F6"
  accent-red: "#EF4444"
  text-main: "#FFFFFF"
  text-secondary: "#A1A1AA"
  border: "rgba(255, 255, 255, 0.08)"
typography:
  headings: "Manrope, sans-serif"
  body: "Inter, sans-serif"
  code: "Geist Mono, monospace"
  sizes:
    hero: "88px"
    section-title: "48px"
    body-lg: "18px"
    body-sm: "14px"
spacing:
  section-v: "128px"
  container-max: "1280px"
  card-p: "32px"
rounded:
  container: "24px"
  card: "16px"
  pill: "9999px"
components:
  - Nav
  - GlassCard
  - DashboardMockup
  - BentoGrid
  - AI-InterviewInterface
  - JobCard
---

## Overview
The Garna visual language is characterized by high-contrast dark modes, deep layering, and a "Neo-Fintech" aesthetic. It relies on extremely dark backgrounds (#050505) paired with translucent glass surfaces that have subtle white borders and high blur values (12px-20px). The primary brand color, a vibrant lime green (#5EA500), is used sparingly for critical actions, status indicators, and glowing atmospheric light. The layout is expansive, utilizing large typography and bento-style grids to organize complex data into digestible chunks.

## Colors
- **Primary Brand**: `#5EA500` (Garna Green). Used for primary buttons, progress bars, and success states.
- **Base Background**: `#050505`. The absolute foundation of all pages.
- **Elevated Surfaces**: `#0A0A0A` and `#0E0E0E`. Used for cards and container backgrounds.
- **Glass Overlays**: `rgba(255, 255, 255, 0.03)` with `backdrop-filter: blur(12px)`.
- **Functional Palette**: Red (`#EF4444`) for errors/emergencies, Purple (`#A855F7`) for special offers, and Blue (`#3B82F6`) for info/database actions.

## Typography
- **Headings**: Manrope. Used for headers and UI labels. Weights vary from Light (300) to Semi-Bold (600). Hero text often features tight tracking and line-height.
- **Body**: Inter. Used for long-form content, descriptions, and standard UI elements. High legibility.
- **Monospace**: Geist Mono / JetBrains Mono. Used for technical data, account numbers, and status codes in the 404 page.

## Layout
- **Grid System**: 12-column grid for dashboards; 3-column bento grid for feature sections.
- **Containers**: Centered `max-w-7xl` (approx 1280px) with 24px horizontal padding.
- **Density**: High density in dashboard views (small font sizes, 10px labels), transitioning to low-density, airy layouts in marketing and blog sections.

## Elevation & Depth
- **Glassmorphism**: Primary depth mechanism. Components use thin 1px borders with low opacity white (`rgba(255, 255, 255, 0.08)`).
- **Atmospheric Glow**: Large, blurred radial gradients (`blur(120px)`) in background layers provide a sense of space and focus.
- **3D Transforms**: Dashboard mockups use `perspective-1000` and `scale` transforms to simulate physical presence.

## Shapes
- **Card Radii**: Defaulting to `1rem` (16px) or `1.5rem` (24px) for major containers.
- **Buttons**: Rounded-xl (12px) for marketing; rounded-lg (8px) for internal UI.
- **Pills**: Fully rounded (9999px) for category tags and status badges.

## Components
- **Navbar**: Sticky glass-high header with blurred background and a thin bottom border. Features a tracking-tighter wordmark.
- **GlassCard**: Translucent container with inner shadows and subtle border-glow on hover.
- **JobCard**: High-density article featuring category badges, matched candidate avatars, and salary info.
- **Animated Stats**: Large Manrope digits that count up upon intersection.
- **Status Pill**: Small badges with pulsing dot indicators for "Live" or "Confirmed" states.

## Page Sections

### Landing Page Hero
- **Composition**: Centered headline in Manrope (up to 88px), followed by a centered paragraph and a CTA button with a "border-spin" animation.
- **Feature**: An interactive, scaled-down dashboard mockup containing balance cards, transaction lists, and sidebar navigation.

### AI Hiring Hero
- **Visual**: Focuses on an AI Interviewer UI mockup. Features a video feed with an audio waveform and a floating analysis status bar.
- **Layout**: Split layout with AI chat context on the left and video feed on the right.

### Blog Feed
- **Structure**: Featured article card takes full width (image right, text left), followed by a 3-column grid of secondary articles.
- **Detail**: Article cards use a fixed-height image container (h-56) with rounded-2xl corners.

### 404 Radar Page
- **Theme**: Technical failure/Signal lost. Features a central solar radar icon.
- **Motion**: Radar sweep (conic gradient) and pulsing rings behind the text.

## Motion & Interaction
- **Border Spin**: A conic-gradient animation on primary buttons creating a rotating light effect.
- **Dash Flow**: Animated SVG paths in diagrams to represent data movement.
- **Hover States**: Cards typically scale up slightly (`scale-105`) or brighten their borders (`border-white/20`).
- **Counter Anim**: Numbers in stats and dashboard balances use a quart-ease-out counting animation.

## Do's and Don'ts
- **Do**: Use high blur values on glass components to maintain legibility over dark backgrounds.
- **Do**: Use lime-green as a primary highlight for data-heavy visualizations.
- **Don't**: Use solid white backgrounds; use layered grays/blacks.
- **Don't**: Use sharp 90-degree corners; the brand relies on organic, rounded geometry.

## Accessibility
- **Selection**: High-contrast selection color (`#5EA500` bg, white text).
- **Contrast**: Despite the dark theme, text colors are generally `#A1A1AA` (secondary) and `#FFFFFF` (primary) to maintain WCAG compliance on dark surfaces.
- **Focus**: Interactive elements use `focus-within` border color shifts to green.

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
