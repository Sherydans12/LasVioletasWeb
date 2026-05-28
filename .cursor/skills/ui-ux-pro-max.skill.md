# Skill: UI/UX Pro Max

## Purpose
Define strict design standards for spacing, typography, accessibility, and animations in the Las Violetas Web project.

---

## Design Tokens (Tailwind Extension)

### Color Palette
```typescript
// tailwind.config.ts — extend.colors
colors: {
  brand: {
    50:  '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',   // Primary
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  neutral: {
    0:   '#ffffff',
    50:  '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  }
}
```

### Spacing Scale
Use only the 8px base grid:
```
4px   → gap-1, p-1   (micro)
8px   → gap-2, p-2   (tight)
16px  → gap-4, p-4   (default)
24px  → gap-6, p-6   (comfortable)
32px  → gap-8, p-8   (section internal)
48px  → gap-12, p-12 (section breathing)
64px  → gap-16, p-16 (section separator)
96px  → gap-24, p-24 (page-level sections)
128px → gap-32, p-32 (hero/footer)
```
**Rule**: Never use odd spacing values like `p-3` or `p-5` for structural layout. Reserve them only for minor optical adjustments.

---

## Typography System

### Font Stack
```typescript
// tailwind.config.ts
fontFamily: {
  sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
  mono: ['var(--font-geist-mono)', 'monospace'],
}
```

### Type Scale (Fluid Typography)
```css
/* globals.css — fluid scale with clamp() */
:root {
  --text-xs:   clamp(0.75rem,  0.7rem  + 0.25vw, 0.875rem);
  --text-sm:   clamp(0.875rem, 0.825rem + 0.25vw, 1rem);
  --text-base: clamp(1rem,     0.95rem  + 0.25vw, 1.125rem);
  --text-lg:   clamp(1.125rem, 1rem     + 0.5vw,  1.25rem);
  --text-xl:   clamp(1.25rem,  1.1rem   + 0.75vw, 1.5rem);
  --text-2xl:  clamp(1.5rem,   1.25rem  + 1vw,    2rem);
  --text-3xl:  clamp(1.875rem, 1.5rem   + 1.5vw,  2.5rem);
  --text-4xl:  clamp(2.25rem,  1.75rem  + 2vw,    3.5rem);
  --text-5xl:  clamp(3rem,     2.25rem  + 3vw,    5rem);
}
```

### Typography Rules
1. **Line height**: body 1.6–1.75, headings 1.1–1.2
2. **Letter spacing**: headings -0.02em to -0.04em (tighter), body 0
3. **Max line length**: 60–75 characters (prose), 45–55ch (narrow columns)
4. **Font weight hierarchy**: 400 body → 500 emphasis → 600 subheadings → 700 headings
5. **Never use font-weight 900** on body text

---

## Layout Principles

### Container
```typescript
// Max widths per context
'sm':  '640px',   // Mobile expanded
'md':  '768px',   // Tablet
'lg':  '1024px',  // Desktop
'xl':  '1280px',  // Wide desktop
'2xl': '1400px',  // Max container (never exceed)
```

### Section Anatomy
```
[Section Padding Top: 96px desktop / 64px mobile]
  [Eyebrow: text-sm, uppercase, letter-spacing 0.1em, brand color]
  [Heading: text-4xl desktop / text-3xl mobile, -tracking-tight]
  [Subheading: text-lg, neutral-500, max-w-2xl, mt-4]
  [Content grid: mt-12 gap-8]
[Section Padding Bottom: 96px desktop / 64px mobile]
```

---

## Animation Standards (Framer Motion)

### Entrance Animations
```typescript
// Reusable variants — src/lib/animations.ts
export const fadeInUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
}

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
}

export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
}

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
}
```

### Animation Rules
1. **Duration limits**: micro 100–200ms, standard 300–500ms, cinematic max 700ms
2. **Easing**: prefer cubic-bezier over linear. Use `[0.25, 0.46, 0.45, 0.94]` (ease-out-quart) for entrances
3. **Scroll-triggered**: use `whileInView` + `viewport={{ once: true, margin: '-10%' }}`
4. **Hover states**: max 200ms, use `whileHover` with subtle scale (1.02–1.05) or translateY(-2px)
5. **Respect `prefers-reduced-motion`**:
   ```typescript
   const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
   const variants = prefersReducedMotion ? {} : fadeInUp
   ```
6. **No animation on layout shifts** — animate opacity/transform only, never width/height directly

---

## Accessibility Standards (WCAG 2.1 AA)

### Color Contrast
- Normal text (< 18px): ratio ≥ 4.5:1
- Large text (≥ 18px bold or ≥ 24px): ratio ≥ 3:1
- Interactive elements focus ring: ratio ≥ 3:1 against background

### Focus Management
```css
/* globals.css */
:focus-visible {
  outline: 2px solid var(--color-brand-500);
  outline-offset: 3px;
  border-radius: 3px;
}
/* Remove outline for mouse users */
:focus:not(:focus-visible) { outline: none; }
```

### Semantic HTML5 Landmark Rules
```html
<header role="banner">      <!-- Site header -->
<nav aria-label="Main">     <!-- Primary navigation -->
<main>                      <!-- Page content -->
  <section aria-labelledby="section-heading-id">
  <article>                 <!-- Self-contained content -->
  <aside>                   <!-- Supplementary -->
<footer role="contentinfo"> <!-- Site footer -->
```

### Interactive Element Rules
- Minimum touch target: 44×44px (48×48px preferred)
- Buttons must have visible text or `aria-label`
- Links must be distinguishable from body text (not by color alone)
- Form inputs require associated `<label>` (not just placeholder)

---

## Component Design Rules

### Glassmorphism (use sparingly)
```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.12);
```

### Card Elevation Scale
```
Level 0: no shadow (flat)
Level 1: shadow-sm  (0 1px 3px rgba(0,0,0,0.08))
Level 2: shadow-md  (0 4px 16px rgba(0,0,0,0.10))
Level 3: shadow-lg  (0 8px 32px rgba(0,0,0,0.14))
Level 4: shadow-2xl (0 24px 64px rgba(0,0,0,0.20))
```

### Border Radius Consistency
```
Badges/Pills: rounded-full
Buttons:      rounded-lg (8px)
Cards:        rounded-2xl (16px)
Modals:       rounded-3xl (24px)
```
