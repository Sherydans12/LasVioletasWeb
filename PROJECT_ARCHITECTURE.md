# Instituto Las Violetas — Arquitectura del Proyecto

> Documento de traspaso técnico para el equipo de mantenimiento y modelos de IA subsiguientes.
> **Última actualización:** Mayo 2026

**Repositorio GitHub:** [https://github.com/Sherydans12/LasVioletasWeb](https://github.com/Sherydans12/LasVioletasWeb)

---

## Índice

1. [Stack tecnológico](#1-stack-tecnológico)
2. [Design System](#2-design-system)
3. [Tono y Voz Institucional](#3-tono-y-voz-institucional)
4. [Estructura de Componentes](#4-estructura-de-componentes)
5. [Datos de Contacto Centralizados](#5-datos-de-contacto-centralizados)
6. [Estrategia SEO y Campaña de Matrícula](#6-estrategia-seo-y-campaña-de-matrícula)
7. [Instrucciones para el Próximo Modelo de IA](#7-instrucciones-para-el-próximo-modelo-de-ia)
8. [Guía de Cambios Frecuentes](#8-guía-de-cambios-frecuentes)

---

## 1. Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS v4 (config en CSS) | 4.x |
| Animaciones | Framer Motion | 12.x |
| Íconos | Lucide React | 1.x |
| Componentes base | shadcn/ui (Base UI) | — |
| Fuentes | Google Fonts: Cinzel + Montserrat | via next/font |
| Imágenes | next/image con `fill` + blur placeholder | — |

**⚠️ Tailwind v4 — Diferencias importantes respecto a v3:**
- La configuración de tokens se hace en `src/app/globals.css` dentro de `@theme inline {}`, NO en `tailwind.config.ts`.
- Clases de aspectos: usar `aspect-4/3`, NO `aspect-[4/3]`.
- Gradientes: usar `bg-linear-to-r`, NO `bg-gradient-to-r`.
- Tipografía fluida: usar `text-(length:--text-4xl)`, NO `text-[length:var(--text-4xl)]`.
- NO existe `tailwind.config.ts` en este proyecto.

---

## 2. Design System

### 2.1 Paleta de colores institucional

Definida en `src/app/globals.css` dentro del bloque `@theme inline {}`:

| Token Tailwind | Valor HEX | Uso |
|---|---|---|
| `school-violet` | `#4D0039` | Color primario, fondos Navbar/Footer/MatriculaCTA |
| `school-gold` | `#D4A017` | Acentos, CTAs dorados, hover en links blancos |
| `school-gold-light` | `#F2C14E` | Estado hover de botones dorados |
| `school-neutral` | `#F9F9F9` | Fondo de secciones alternas (Services, cards stats) |

**Contraste WCAG AA verificado:**
- Blanco sobre `school-violet/95` ≈ 12:1 ✓
- `school-gold` sobre `school-violet` ≈ 6.5:1 ✓
- Blanco sobre `school-violet` ≈ 14:1 ✓

**TopHeader:** ver §2.6 (color de barra, scroll y capas).

### 2.2 Tipografía

```css
/* globals.css — @theme inline */
--font-heading: var(--font-cinzel), 'Playfair Display', Georgia, serif;
--font-sans: var(--font-montserrat), ui-sans-serif, system-ui, sans-serif;
```

| Uso | Fuente | Peso | Nota |
|---|---|---|---|
| H1, H2, H3 | Cinzel (Serif) | 400/600/700/900 | Elegancia institucional |
| Cuerpo, párrafos | Montserrat (Sans) | 400/500/600/700 | Legibilidad |
| Clase CSS | `font-heading` | — | Aplicada a todos los headings globalmente |

**Regla global en `globals.css`:**
```css
h1, h2, h3 {
  font-family: var(--font-heading);
  text-wrap: balance; /* evita líneas huérfanas en títulos */
}
```

### 2.3 Escala tipográfica fluida

Variables definidas en `:root` en `globals.css`:
```css
--text-xs → clamp(0.75rem, ..., 0.875rem)
--text-sm → clamp(0.875rem, ..., 1rem)
--text-base → clamp(1rem, ..., 1.125rem)
--text-lg → clamp(1.125rem, ..., 1.25rem)
--text-xl → clamp(1.25rem, ..., 1.5rem)
--text-2xl → clamp(1.5rem, ..., 2rem)
--text-3xl → clamp(1.875rem, ..., 2.5rem)
--text-4xl → clamp(2.25rem, ..., 3.5rem)  ← H2 principal
--text-5xl → clamp(3rem, ..., 5rem)        ← H1 hero
```

Uso en Tailwind v4: `text-(length:--text-4xl)`

### 2.4 Espaciado (8px grid)

Solo usar múltiplos de 4px (gap-1, p-2, p-4, p-6, p-8, p-12, p-16, p-24).
**No usar** `p-3`, `p-5`, `p-7` en layouts estructurales.

### 2.5 Blur placeholders para imágenes

Definidos en `src/lib/images.ts`:
- `BLUR_VIOLET` — imágenes sobre fondo oscuro (hero, matricula)
- `BLUR_NEUTRAL` — imágenes sobre fondo claro (infraestructura, nosotros)

Siempre usar `placeholder="blur" blurDataURL={BLUR_*}` en imágenes `fill`.

### 2.6 TopHeader dinámico (scroll) y capas

El **TopHeader** y la **Navbar** comparten estado de scroll vía **`SiteHeaderScrollProvider`** (`src/contexts/site-header-scroll.tsx`) y el hook **`useSiteHeaderScroll`**.

| Concepto | Detalle |
|---|---|
| Visibilidad | En **`md+`**, el TopHeader solo se muestra cuando **`window.scrollY === 0`**. Al desplazarse hacia abajo, la barra se oculta con **Framer Motion** (`y: "-100%"`, `opacity: 0`, ~350 ms, easing ease-out-quart). Al volver al tope, reaparece. |
| Navbar | **`top` en píxeles**: `36` (`TOP_HEADER_OFFSET_PX`, equivalente a `h-9` / `top-9`) cuando el chrome del TopHeader aplica; **`0`** cuando no. Transición CSS en las mismas ~300 ms para evitar saltos. |
| z-index | TopHeader **`z-60`**, Navbar **`z-50`**, burbuja WhatsApp **`z-50`**. El TopHeader queda siempre por encima de la Navbar en el eje Z. |
| Color barra | Fondo **`#3A002B`** (más oscuro que `school-violet`), borde inferior sutil `border-white/5`. |
| Iconos barra | `Phone`, `MapPin` y RRSS: `text-school-gold` con **`opacity-80`** y **`hover:opacity-100`** en redes (tamaño 14 px; texto de línea en `text-white/70`). La dirección abre **`mapsLink`** en pestaña nueva. |

En **móvil** (`< md`) el TopHeader no se muestra (`hidden md:block`); la Navbar permanece en **`top: 0`**.

---

## 3. Tono y Voz Institucional

### 3.1 Tono cercano-formal (es-CL)

El sitio utiliza un **tono cercano-formal**: se **tutea** al visitante para generar confianza, manteniendo un **léxico profesional, chileno e institucional**. Se evita el voseo rioplatense informal (“vos tenés”, “che”) y la jerga coloquial; la conjugación en **tú** es la norma en CTAs, formularios y mensajes directos.

| Evitar | Preferir (cercano-formal CL) |
|---|---|
| Voseo argentino / modismos sueltos | Formas en tú con registro cuidado |
| “Conocé más” (AR) | “Conócenos” |
| “Contactanos” (sin tilde / informal) | “Contáctanos” |
| “su nombre” (trato de usted) | “tu nombre” (en copy al usuario) |
| “intente nuevamente” | “intenta nuevamente” |

**Tercera persona** sigue siendo apropiada para hechos institucionales (“nuestros estudiantes”, “el establecimiento”) cuando no se habla directamente al lector.

### 3.2 Terminología educativa chilena

| ❌ Evitar | ✅ Usar |
|---|---|
| Inscripción | Matrícula |
| Escuela | Establecimiento / Colegio / Instituto |
| Bachillerato | Enseñanza media |
| Asignaturas | Asignaturas o Niveles |
| Admisión (2026) | Matrícula (2026) |

### 3.3 Campaña activa (Mayo 2026)

Frases de urgencia aprobadas:
- "Últimos cupos disponibles"
- "Aún estás a tiempo de nivelar tus estudios este año"
- "Matrícula 2026 aún disponible"

---

## 4. Estructura de Componentes

### 4.1 Árbol de páginas

```
src/app/
├── layout.tsx           ← Fuentes + metadata SEO + OrganizationSchema + SiteHeaderScrollProvider (TopHeader + children)
├── page.tsx             ← Composición de la homepage (Navbar, secciones, Footer, WhatsApp)
├── globals.css          ← Design tokens Tailwind v4 + fluid typography
├── sitemap.ts           ← Sitemap autogenerado
└── robots.ts            ← robots.txt autogenerado
```

### 4.2 Componentes compartidos (src/components/shared/)

| Componente | Descripción |
|---|---|
| `SiteHeaderScrollProvider` | Contexto cliente (`src/contexts/site-header-scroll.tsx`): sincroniza scroll (`scrollY === 0`) y breakpoint `md+` entre TopHeader y Navbar. |
| `TopHeader.tsx` | Barra fija `z-60`, animación Framer Motion; dirección «Las Violetas 1159, Coquimbo» enlaza a **`CONTACT.address.mapsLink`** (nueva ventana); iconos `Phone` / `MapPin` / RRSS en `school-gold` con opacidad alineada. |
| `Navbar.tsx` | `z-50`, `style={{ top }}` enlazado a `showTopHeaderChrome` + `TOP_HEADER_OFFSET_PX`. Glassmorphism al scroll. Logo: 56px mobile → 85px desktop |
| `Footer.tsx` | Footer `bg-school-violet`: nav ancla, contacto (dirección → **`mapsLink`** en nueva pestaña), email, teléfonos, redes. |
| `GoogleMaps.tsx` | iframe embebido por **`coords`** + `grayscale` y overlay `school-violet/12`; badge «Abrir en Maps» usa **`mapsLink`** (Maps.app). |
| `WhatsAppBubble.tsx` | Botón flotante fijo `bottom-6 right-6`, color esmeralda oscuro `#0C3522`, tooltip dismissible |
| `OrganizationSchema.tsx` | JSON-LD `EducationalOrganization` para SEO estructurado |

### 4.3 Secciones de página (src/components/sections/)

| Sección | ID anchor | Descripción |
|---|---|---|
| `Hero.tsx` | — | Full-bleed, `hero-principal.webp` + overlay `school-violet` gradiente |
| `About.tsx` | `#nosotros` | 2 col: texto+valores izquierda / foto+stats derecha |
| `Services.tsx` | `#servicios` | Grid 3×2 de tarjetas con íconos Lucide |
| `Infrastructure.tsx` | `#instalaciones` | Gallery asimétrica 3+2 cols (ver §4.4) |
| `MatriculaCTA.tsx` | `#admision` | CTA `bg-school-violet` con `matricula-cta.webp` y badge flotante |
| `Contact.tsx` | `#contacto` | Info + mapa + formulario |

### 4.4 Gallery asimétrica de Infraestructura

**Problema resuelto:** Para evitar espacios vacíos en el grid, el `aspect-ratio` se aplica directamente a los elementos `<figure>`, NO a un `<div>` interior.

```tsx
{/* ✅ Correcto */}
<figure className="lg:col-span-3 aspect-4/3 relative overflow-hidden">
  <Image fill ... />
</figure>

{/* ❌ Incorrecto — crea espacio vacío */}
<figure className="lg:col-span-3 relative overflow-hidden">
  <div className="aspect-4/3 relative w-full">
    <Image fill ... />
  </div>
</figure>
```

El grid usa `lg:items-start` para que las filas no se estiren.

### 4.5 Logo responsivo en Navbar

El logo usa un `<div>` wrapper con dimensiones responsivas + `Image fill`:

```tsx
<div className="relative h-14 w-14 sm:h-[75px] sm:w-[75px] md:h-[85px] md:w-[85px] shrink-0">
  <Image src="/logo-institucional.png" alt="..." fill className="object-contain ..." />
</div>
```

La altura del header es: `h-[72px] sm:h-20 md:h-24`.

---

## 5. Datos de Contacto Centralizados

**Archivo único:** `src/lib/contact.ts`

Todos los datos (dirección, teléfonos, email, redes sociales, coordenadas del mapa embebido y enlace **Maps.app**) están en este archivo. Para actualizar cualquier dato de contacto, **solo modificar este archivo**. Todos los componentes lo importan.

```typescript
// Estructura de src/lib/contact.ts
export const CONTACT = {
  address: {
    street, city, region, country, full,
    coords,       // [lat, lng] — iframe embebido + JSON-LD geo
    mapsLink,    // URL corta oficial «Abrir en Google Maps» (topbar, badge)
  },
  email: "contacto@colegiolasvioletas.cl",
  phones: { primary, secondary, landline },
  social: { instagram, facebook },
}
```

- **`CONTACT.address.mapsLink`:** enlace `https://maps.app.goo.gl/...` para abrir la ubicación en una pestaña nueva (no usar `https://www.google.com/maps?q=lat,lng` en UI).
- **`CONTACT.address.coords`:** se mantiene para el **iframe** de vista embebida y para **`OrganizationSchema`** (`geo`).

---

## 6. Estrategia SEO y Campaña de Matrícula

### 6.1 Keywords objetivo (Coquimbo 2026)

Definidas en `src/app/layout.tsx`:
- "Instituto Las Violetas Coquimbo"
- "educación de adultos Coquimbo"
- "nivelación de estudios Coquimbo"
- "validación de estudios Chile"
- "liceo adultos Coquimbo"
- "matrícula 2026 Coquimbo"
- "últimos cupos matrícula 2026"
- "Las Violetas 1159 Coquimbo"

### 6.2 Estructura de metadatos

| Archivo | Función |
|---|---|
| `layout.tsx` | `<title>`, `<meta description>`, Open Graph, Twitter Card, favicons |
| `OrganizationSchema.tsx` | JSON-LD `EducationalOrganization` con dirección, coordenadas y contacto |
| `sitemap.ts` | Sitemap XML auto-generado (Next.js `MetadataRoute.Sitemap`) |
| `robots.ts` | `allow: /`, `disallow: /api/` |

### 6.3 Campaña "Últimos cupos 2026" (Mayo–Diciembre 2026)

- **Eyebrow del Hero:** "Últimos cupos disponibles — Matrícula 2026 · Coquimbo"
- **Subtitle del Hero:** "Aún estás a tiempo de nivelar tus estudios este año..." (tono cercano-formal)
- **MatriculaCTA eyebrow:** "Últimos cupos 2026 · Coquimbo"
- **MatriculaCTA H2:** "Matrícula 2026 aún disponible"
- **WhatsApp tooltip:** "¡Últimos cupos 2026! Contáctanos por WhatsApp..."
- **meta description:** incluye "Últimos cupos Matrícula 2026 disponibles"

**Para actualizar al año 2027:** cambiar todos los "2026" por "2027" en los archivos de secciones + `layout.tsx`.

### 6.4 JSON-LD

El schema `EducationalOrganization` incluye:
- `geo.GeoCoordinates` con lat/lng de Coquimbo
- `address` completa con `addressCountry: "CL"`
- `contactPoint` dual: teléfono + email
- `sameAs` con redes sociales

---

## 7. Instrucciones para el Próximo Modelo de IA

### 7.1 Reglas de coherencia visual — NO romper

1. **Nunca** cambiar `bg-school-violet` (`#4D0039`) por otro color en Navbar, Footer, TopHeader o MatriculaCTA.
2. **Nunca** usar `bg-gradient-to-*` en Tailwind v4 — usar `bg-linear-to-*`.
3. **Nunca** usar `aspect-[n/m]` — usar `aspect-n/m` (sin corchetes).
4. **Nunca** agregar una segunda etiqueta `<h1>` a la página — solo Hero tiene `<h1>`.
5. **Siempre** importar desde `@/lib/contact` para datos de contacto, nunca hardcodear.
6. **Siempre** agregar `placeholder="blur" blurDataURL={BLUR_*}` a imágenes `fill`.
7. **Nunca** usar voseo argentino ni jerga informal; mantener **tono cercano-formal** (§3.1).

### 7.2 Reglas de TypeScript

- Proyecto strictamente tipado con `tsconfig.json` estricto
- Siempre ejecutar `npx tsc --noEmit` antes de marcar una tarea como completa
- Los `NavItem`, `ContactFormData`, `ServiceItem` están en `src/types/index.ts`

### 7.3 Skills del proyecto (.cursor/skills/)

| Skill | Cuándo usar |
|---|---|
| `ui-ux-pro-max.skill.md` | Al agregar componentes UI, verificar contraste WCAG, animaciones |
| `frontend-logic-patterns.skill.md` | Al crear hooks, services o patrones de estado |
| `seo-optimization.skill.md` | Al agregar páginas, actualizar metadata o schema |
| `code-reviewer.skill.md` | Para revisión de PR o refactoring |
| `readme-generator.skill.md` | Para actualizar esta documentación |
| `image-optimization.skill.md` | Al agregar nuevas imágenes |

### 7.4 Flujo para agregar una nueva sección

1. Crear `src/components/sections/NuevaSección.tsx`
2. Importar colores via Tailwind tokens (`bg-school-violet`, etc.)
3. Usar `motion.div` con variantes de `@/lib/animations`
4. Agregar `id="nueva-seccion"` y `aria-labelledby` para accesibilidad
5. Agregar `<NuevaSección />` en `src/app/page.tsx`
6. Agregar enlace en `NAV_ITEMS` de `Navbar.tsx` si corresponde
7. Agregar URL en `src/app/sitemap.ts`

### 7.5 Para cambiar un dato de contacto

**Solo editar `src/lib/contact.ts`** — el cambio se propaga automáticamente a:
- `layout.tsx` + `SiteHeaderScrollProvider` + `TopHeader.tsx` (teléfonos + redes + dirección; estado de scroll)
- `Contact.tsx` (info + mapa)
- `Footer.tsx` (dirección → `mapsLink`, teléfonos, email, redes)
- `OrganizationSchema.tsx` (JSON-LD)
- `WhatsAppBubble.tsx` (enlace wa.me)
- `GoogleMaps.tsx` (coordenadas solo para iframe embebido; enlaces externos: `mapsLink`)

---

## 8. Guía de Cambios Frecuentes

### Actualizar teléfonos o correo
→ Editar solo `src/lib/contact.ts`

### Actualizar URLs de redes sociales
→ Editar `CONTACT.social.instagram` y `CONTACT.social.facebook` en `src/lib/contact.ts`

### Cambiar año de matrícula (2026 → 2027)
→ Buscar "2026" en: `Hero.tsx`, `MatriculaCTA.tsx`, `Navbar.tsx`, `Footer.tsx`, `layout.tsx`, `WhatsAppBubble.tsx`

### Agregar nueva imagen
1. Colocar en `/public/` como `.webp`
2. Usar `next/image` con `fill` + `sizes` + `placeholder="blur"` + `blurDataURL`
3. Elegir `BLUR_VIOLET` o `BLUR_NEUTRAL` según el contexto de la imagen

### Activar Google Analytics
→ Descomentar `NEXT_PUBLIC_GA_ID` en `.env.local` y agregar el componente `<GoogleAnalytics />` en `layout.tsx`

### Despliegue
→ **Producción:** sitio canónico `https://colegiolasvioletas.cl`. En **Coolify** (u otro Docker), usar build **standalone** de Next.js (`output: "standalone"` en `next.config.ts`): copiar `.next/standalone`, `.next/static` y `public` al runtime según la [guía de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying). Definir `NEXT_PUBLIC_SITE_URL` en el panel de variables de entorno (ver `README.md` / `.env.example`).
