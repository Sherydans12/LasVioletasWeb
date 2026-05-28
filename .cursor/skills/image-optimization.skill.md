# Skill: Image Optimization

## Purpose
Maximize Lighthouse performance score and Core Web Vitals (LCP) through systematic image handling in Next.js.

---

## next/image Rules

### Always Use `next/image` for Content Images
```tsx
import Image from 'next/image'

// Fixed dimensions
<Image
  src="/hero-photo.jpg"
  alt="Descripción contextual de la imagen"
  width={1200}
  height={630}
  priority           // ← Only for above-the-fold / LCP images
  quality={85}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"
/>

// Fill layout (parent must be position: relative)
<div className="relative w-full aspect-video">
  <Image
    src="/cover.jpg"
    alt="..."
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, 1200px"
  />
</div>
```

### Rules
- `priority` prop: **only** on the first visible image (LCP candidate)
- `quality`: 80–85 for photos, 90 for graphics/logos
- `sizes`: always set — prevents downloading unnecessarily large images
- `alt`: descriptive (not empty, not "image", not filename)
- Never use `<img>` tag for content images

---

## Format Strategy

### Automatic via next.config.ts
```typescript
images: {
  formats: ['image/avif', 'image/webp'],  // avif first (40% smaller than webp)
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

### Source Files
- **Photos**: provide original at ≥ 2× the display size in JPG/PNG
- **Logos & icons**: SVG (inline or `<img>` tag — not `next/image` for vector)
- **Background decorations**: CSS gradients or SVG (zero image requests)
- **OG images**: 1200×630px JPG, < 300KB

---

## Sizing Guidelines

| Use Case          | Width     | Height   | Aspect Ratio |
|-------------------|-----------|----------|--------------|
| Hero background   | 1920px    | 1080px   | 16:9         |
| OG / social share | 1200px    | 630px    | 1.91:1       |
| Team photo        | 800px     | 800px    | 1:1          |
| Card thumbnail    | 600px     | 400px    | 3:2          |
| Logo              | SVG       | SVG      | N/A          |

---

## Lazy Loading Strategy

```tsx
// Above the fold (hero, logo): priority + no lazy
<Image src="..." priority />

// Below the fold: default lazy (Next.js default)
<Image src="..." />

// Animated components entering viewport: use loading="lazy" explicitly
// for non-Next/image <img> tags (SVG illustrations, etc.)
<img src="/illustration.svg" loading="lazy" alt="..." />
```

---

## Performance Budget

| Resource Type | Budget      |
|---------------|-------------|
| Hero image    | < 150KB     |
| Card image    | < 80KB      |
| Logo SVG      | < 10KB      |
| Total images per page | < 500KB |

---

## Public Folder Structure
```
public/
├── og-image.jpg          (1200×630 — default OG)
├── favicon.ico
├── icon.svg
├── apple-icon.png        (180×180)
└── images/
    ├── hero/
    │   └── hero-main.jpg
    ├── team/
    └── services/
```

---

## Optimization Checklist
- [ ] All content images use `next/image`
- [ ] LCP image has `priority` prop
- [ ] All images have descriptive `alt` text
- [ ] `sizes` attribute set on all `next/image` instances
- [ ] `formats: ['image/avif', 'image/webp']` in next.config
- [ ] Source photos ≥ 2× display size, < 2MB
- [ ] SVG used for logos and decorative icons
- [ ] OG image is 1200×630, < 300KB
- [ ] No CLS from images (width/height or fill + aspect-ratio defined)
- [ ] Lighthouse Image Optimization score: 100
