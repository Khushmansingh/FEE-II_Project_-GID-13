---
name: Campus Vault
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0.005em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an authoritative yet contemporary academic SaaS environment. It merges institutional trustworthiness with modern software ergonomics, catering to university faculty, researchers, and students who require frictionless document exchange, resource archiving, and collaborative research management.

The aesthetic direction unites **Modern Corporate** structure with **Subtle Glassmorphic Accents**. Visual clarity and information density are prioritized over decorative excess. The mood is disciplined, intellectually rigorous, and frictionless. Crisp structural dividers, deep nocturnal grounding tones, and luminous indigo-violet accents construct an experience that feels as established as an Ivy League library, yet as swift and fluid as cutting-edge developer tooling.

## Colors

The palette balances deep academic permanence with modern digital precision. The default mode is light, delivering maximum readability for dense scholarly texts, syllabi, and research papers.

- **Primary (`#4F46E5` / Royal Indigo):** The core brand anchor. Used for primary calls-to-action, active navigational states, folder highlights, and focused interactive outlines. Supports a lighter tint (`#6366F1`) for hover transitions and high-contrast dark accents.
- **Secondary (`#0EA5E9` / Sky Blue):** Applied to secondary interactive items, contextual metadata, download streams, and secondary chart metrics.
- **Tertiary (`#10B981` / Emerald):** Indicates verified resource status, successful uploads, peer-review endorsements, and active quotas.
- **Warning / Alert (`#F59E0B` / Amber):** Highlights storage threshold warnings, pending access requests, and institutional embargoes.
- **Neutrals & Surfaces:** 
  - Base background canvas: `#F8FAFC`
  - Elevated card and panel surfaces: `#FFFFFF`
  - Subtle structural border and separator tint: `#E2E8F0`
  - Deep grounding neutral for primary text and high-contrast headers: `#0F172A`
  - Muted secondary typography and structural icons: `#64748B`

## Typography

Plus Jakarta Sans provides geometric precision softened by humanist terminals, allowing academic content to appear welcoming without losing authority. 

- **Display & Headline Hierarchy:** Tight negative letter-spacing ensures titles remain cohesive and punchy on modern high-DPI displays. Headings larger than 24px automatically reduce by a tier on mobile screens to avoid awkward hyphenation in multi-syllable academic terminology.
- **Body & Metadata Copy:** Set with generous line heights to minimize eye strain during extensive reading of document abstracts, citation lists, and syllabus descriptions.
- **Labels & Microcopy:** Enhanced with slight positive letter spacing and medium-to-semibold weights to preserve legibility when rendered within tags, status badges, and table headers.

## Layout & Spacing

The layout is built around a structured 12-column fluid grid that locks into a maximum container width of 1440px for wide desktop screens.

- **Desktop (1024px+):** 12-column grid utilizing `gutter` (1.5rem / 24px) and outer `margin` (2rem / 32px). Supports persistent dual-pane workflows, such as a 3-column repository tree paired with a 9-column file inspector.
- **Tablet (768px - 1023px):** 8-column grid with collapsible side navigation. Outer margins contract to 1.5rem.
- **Mobile (320px - 767px):** 4-column layout utilizing `gutter-mobile` (1rem / 16px) and `margin-mobile` (1rem / 16px). Dual-pane layouts collapse into stacked views or bottom sheets.
- **Rhythm Rules:** Internal component padding scales strictly on multiples of 4px. Structural document blocks and data tables utilize `space-md` for row separations and `space-xl` between decoupled administrative modules.

## Elevation & Depth

Depth is established through subtle physical separation, precise structural outlines, and diffused ambient illumination rather than heavy drop shadows.

- **Low-Contrast Outlines (Ghost Borders):** Primary containers, data tables, and input elements are bound by a 1px solid border (`#E2E8F0`). In dark contexts or high-emphasis modal cards, use `#CBD5E1`.
- **Level 1 (Resting Cards & File Tiles):** `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`. Grounded, discrete, and clean.
- **Level 2 (Hovered Cards, Dropdowns & Popovers):** `0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`. Subtle vertical lift accompanied by a subtle border transition to `#CBD5E1`.
- **Level 3 (Modals, Overlays & Dragged Assets):** `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.
- **Glassmorphic Accents:** Sticky navigation bars, floating quick-action docks, and preview headers use a frosted surface: `rgba(255, 255, 255, 0.85)` with `backdrop-filter: blur(12px)` and a crisp bottom boundary of `1px solid rgba(226, 232, 240, 0.8)`.

## Shapes

The design uses a balanced `roundedness: 2` scale, pairing approachable geometry with institutional precision. 

- **Base Corner Radius (0.5rem / 8px):** Applied to interactive buttons, input fields, dropdown menus, and standard file cards.
- **Large Radius (1rem / 16px):** Reserved for primary content containers, multi-column dashboard widgets, file upload dropzones, and modal dialogs.
- **Pill Shapes (9999px):** Strictly reserved for metadata chips, department badges, status indicators, and compact search inputs to establish clear contrast against square file matrices and rectangular documents.

## Components

### Buttons
- **Primary:** Background `#4F46E5`, text `#FFFFFF`, border-radius 8px. Hover state shifts to `#4338CA` with subtle elevation. Focus ring is a 2px offset outline of `#6366F1`.
- **Secondary / Ghost:** Transparent surface, 1px solid border `#E2E8F0`, text `#0F172A`. On hover, background shifts to `#F1F5F9`.
- **Destructive:** Background `#EF4444`, text `#FFFFFF`, shifting to `#DC2626` on hover.

### Badges & Pill Chips
- Built with a full pill radius (`rounded-full`), `space-xs` vertical padding, and `space-sm` horizontal padding.
- **Status (Emerald):** Background `rgba(16, 185, 129, 0.1)`, text `#047857`, featuring a leading 6px solid dot.
- **Department/Access (Indigo):** Background `rgba(79, 70, 229, 0.08)`, text `#4338CA`.
- **Warning/Pending (Amber):** Background `rgba(245, 158, 11, 0.1)`, text `#B45309`.

### Input Fields & Search Bars
- Background `#FFFFFF`, 1px border `#E2E8F0`, padding `0.625rem 0.875rem`, text `#0F172A`.
- Active focus state transitions border color to `#4F46E5` accompanied by a soft outer glow ring (`box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15)`).
- File search bars feature an integrated keyboard shortcut badge (`⌘K`) aligned to the right edge.

### Checkboxes & Radio Controls
- Base dimension 18px × 18px. Unchecked: border 1.5px `#CBD5E1` on `#FFFFFF`.
- Checked: Background `#4F46E5` with an internal white geometric checkmark or radio dot. Corner radius is 4px for checkboxes and 50% for radios.

### Cards & Resource Items
- Default file/resource card features a 1px border `#E2E8F0`, background `#FFFFFF`, and inner padding of `space-md`.
- File cards display an upper file-type icon block (PDF, DOCX, Code, Media), a multi-line truncated title (`title-md`), department badges, and an avatar row of recent contributors along the footer.

### Data Tables & Lists
- Table headers utilize `label-sm` in uppercase styling with `#64748B` typography, positioned over a `#F8FAFC` background strip.
- Rows feature an explicit bottom divider of 1px `#F1F5F9` and change background to `#F8FAFC` on hover.

### File Upload Zone
- Dashed border (2px width, `#CBD5E1`), background `#F8FAFC`, transitioning to `#EEF2FF` with `#4F46E5` borders when a drag-and-drop file payload is detected over the target area.