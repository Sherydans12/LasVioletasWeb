# Skill: SEO Optimization

## Purpose
Define the complete SEO strategy for Las Violetas Web: metadata, structured data, sitemaps, robots.txt, and performance signals.

---

## Metadata Checklist (Per Page)

### Static Pages
```typescript
export const metadata: Metadata = {
  title: "Page Title | Las Violetas",          // 50–60 chars
  description: "Compelling description...",    // 150–160 chars
  keywords: ["keyword1", "keyword2"],
  alternates: { canonical: "https://lasvioletas.com/page" },
  openGraph: {
    title: "Page Title | Las Violetas",
    description: "...",
    url: "https://lasvioletas.com/page",
    images: [{ url: "/og-page.jpg", width: 1200, height: 630 }],
  },
}
```

### Dynamic Pages
```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await fetchPageData(params.slug)
  return {
    title: data.title,
    description: data.excerpt,
    alternates: { canonical: `${SITE_URL}/${params.slug}` },
    openGraph: {
      images: [{ url: data.coverImage ?? "/og-image.jpg", width: 1200, height: 630 }],
    },
  }
}
```

---

## Structured Data (JSON-LD)

### Organization Schema (root layout)
```tsx
// src/components/shared/OrganizationSchema.tsx
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Las Violetas",
    url: "https://lasvioletas.com",
    logo: "https://lasvioletas.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+54-11-0000-0000",
      contactType: "customer service",
      areaServed: "AR",
      availableLanguage: "Spanish",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Buenos Aires",
      addressCountry: "AR",
    },
    sameAs: [
      "https://instagram.com/lasvioletas",
      "https://facebook.com/lasvioletas",
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

### WebPage Schema (each page)
```typescript
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Page Title",
  description: "Page description",
  url: "https://lasvioletas.com/page",
  isPartOf: { "@id": "https://lasvioletas.com" }
}
```

---

## Sitemap

### Auto-generated (Next.js App Router)
```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lasvioletas.com'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/#nosotros`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    { url: `${base}/#servicios`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/#contacto`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
  ]
}
```

### robots.txt
```typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lasvioletas.com'
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: `${base}/sitemap.xml`,
  }
}
```

---

## Core Web Vitals Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP    | < 2.5s | Preload hero image, use `priority` on next/image |
| FID/INP | < 100ms | Minimize JS on main thread, use Server Components |
| CLS    | < 0.1  | Reserve space for images/fonts, avoid layout shifts |
| TTFB   | < 600ms | Use ISR/SSG, edge caching |

---

## Technical SEO Rules
1. **One H1 per page** — matches the `<title>` closely
2. **Heading hierarchy**: H1 → H2 → H3 (never skip levels)
3. **Internal links**: use descriptive anchor text, not "click here"
4. **Image alt text**: descriptive, contextual, never keyword-stuffed
5. **URL structure**: lowercase, hyphens, no underscores, no query params for content
6. **Canonical tags**: always set, even on the homepage
7. **Hreflang**: add when multilingual versions exist
8. **No duplicate content**: use canonical or noindex on paginated/filtered URLs
9. **Page speed**: each additional second costs ~7% conversion

---

## Pre-Launch SEO Audit Checklist
- [ ] All pages have unique `<title>` (50–60 chars)
- [ ] All pages have unique `<meta description>` (150–160 chars)
- [ ] Open Graph images are 1200×630px
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] robots.txt accessible at `/robots.txt`
- [ ] JSON-LD Organization schema in root layout
- [ ] No broken internal links
- [ ] All images have alt text
- [ ] Canonical URLs set on all pages
- [ ] Google Search Console property verified
- [ ] Core Web Vitals green in PageSpeed Insights
