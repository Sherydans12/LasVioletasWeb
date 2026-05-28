# Las Violetas Web

> Sitio institucional del **Instituto Las Violetas** (Coquimbo, Chile): matrícula, oferta educativa para adultos y contacto.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com)

## Tabla de contenidos

- [Descripción](#descripción)
- [Stack](#stack)
- [Inicio rápido](#inicio-rápido)
- [Estructura](#estructura)
- [Variables de entorno](#variables-de-entorno)
- [Scripts](#scripts)
- [Despliegue (Coolify / Docker)](#despliegue-coolify--docker)
- [Documentación](#documentación)

## Descripción

Aplicación **Next.js (App Router)** con identidad visual es-CL, secciones de landing (Hero, Nosotros, Servicios, Instalaciones, Matrícula, Contacto), **TopHeader** dinámico según scroll, SEO (metadata, Open Graph, JSON-LD) y `sitemap` / `robots` generados.

## Stack

| Capa        | Tecnología                          |
|------------|-------------------------------------|
| Framework  | Next.js 16 (App Router)            |
| Lenguaje   | TypeScript 5                        |
| Estilos    | Tailwind CSS v4 + tokens en CSS     |
| UI         | shadcn/ui (Base UI)                 |
| Animación  | Framer Motion                       |
| Íconos     | Lucide React                        |

## Inicio rápido

**Requisitos:** Node.js ≥ 20.

```bash
git clone https://github.com/Sherydans12/LasVioletasWeb.git
cd LasVioletasWeb
npm install
cp .env.example .env.local
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

```
src/
├── app/                 # Rutas, layout, globals.css, sitemap, robots
├── components/
│   ├── sections/        # Hero, About, Services, …
│   ├── shared/          # Navbar, TopHeader, Footer, mapa, WhatsApp
│   └── ui/              # Componentes base (shadcn)
├── contexts/            # Estado compartido header (scroll)
├── lib/                 # Utilidades, contacto centralizado, animaciones
├── services/            # Cliente HTTP y envío de formulario
└── types/
```

Detalle de arquitectura y convenciones: [`PROJECT_ARCHITECTURE.md`](./PROJECT_ARCHITECTURE.md).

## Variables de entorno

Copia `.env.example` a `.env.local` y ajusta valores. Resumen:

| Variable                 | Obligatoria | Descripción                                      |
|--------------------------|------------|--------------------------------------------------|
| `NEXT_PUBLIC_SITE_URL`   | Recomendada | URL canónica (OG, sitemap). Default en código: `https://colegiolasvioletas.cl` |
| `API_BASE_URL`           | No         | Base del API si difiere del origen (vacío = mismo sitio) |
| `NEXT_PUBLIC_GA_ID`      | No         | Google Analytics (cuando se active en layout)   |

## Scripts

| Comando           | Descripción              |
|-------------------|--------------------------|
| `npm run dev`     | Servidor de desarrollo   |
| `npm run build`   | Build de producción      |
| `npm run start`   | Servidor de producción   |
| `npm run lint`    | ESLint                   |
| `npm run type-check` | `tsc --noEmit`        |

## Despliegue (Coolify / Docker)

El proyecto usa **`output: "standalone"`** en `next.config.ts` para generar un servidor Node autocontenido en `.next/standalone/`, adecuado para imágenes Docker en Coolify. En el contenedor, tras `npm run build`, expón el puerto con `node .next/standalone/server.js` (o el comando que defina tu Dockerfile) y copia **`public`** y **`.next/static`** junto al standalone según la [documentación oficial de Next.js](https://nextjs.org/docs/app/building-your-application/deploying).

Define al menos `NEXT_PUBLIC_SITE_URL` con la URL pública del despliegue (p. ej. `https://colegiolasvioletas.cl`).

## Documentación

- Arquitectura y guías de cambio: [`PROJECT_ARCHITECTURE.md`](./PROJECT_ARCHITECTURE.md)
- Commits: [Conventional Commits](https://www.conventionalcommits.org/) (ver `.cursor/skills/git-commit-writer.skill.md` si está en tu clon)
