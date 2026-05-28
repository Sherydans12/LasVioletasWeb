# Skill: README Generator

## Purpose
Automate production-grade technical documentation for the Las Violetas Web project.

## README Structure Template

```markdown
# [Project Name]

> [One-sentence value proposition]

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Architecture](#architecture)
- [Contributing](#contributing)

## Overview
[2-3 paragraphs describing what the project does, who it's for, and key capabilities]

## Tech Stack
| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | Next.js 15 (App Router)           |
| Language    | TypeScript 5.x                    |
| Styling     | Tailwind CSS + shadcn/ui          |
| Animations  | Framer Motion                     |
| Icons       | Lucide React                      |
| Deployment  | Vercel                            |

## Getting Started

### Prerequisites
- Node.js ≥ 20.x
- pnpm ≥ 9.x (recommended) or npm ≥ 10.x

### Installation
\`\`\`bash
git clone https://github.com/[org]/las-violetas-web.git
cd las-violetas-web
pnpm install
cp .env.example .env.local
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Project Structure
\`\`\`
src/
├── app/                    # Next.js App Router pages & layouts
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Homepage
│   └── [route]/
│       └── page.tsx
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── sections/           # Page-level sections (Hero, About, etc.)
│   └── shared/             # Reusable cross-page components
├── hooks/                  # Custom React hooks
├── services/               # API/data service layer
│   ├── api.client.ts       # Base HTTP client
│   └── [domain].service.ts
├── lib/                    # Utilities & helpers
│   └── utils.ts
├── styles/
│   └── globals.css
└── types/                  # Global TypeScript type definitions
\`\`\`

## Environment Variables
\`\`\`bash
# .env.example
NEXT_PUBLIC_SITE_URL=https://lasvioletas.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
# Add backend URL when connecting API
# API_BASE_URL=https://api.lasvioletas.com
\`\`\`

## Scripts
| Command          | Description                        |
|------------------|------------------------------------|
| `pnpm dev`       | Start dev server on port 3000      |
| `pnpm build`     | Production build                   |
| `pnpm start`     | Start production server            |
| `pnpm lint`      | Run ESLint                         |
| `pnpm type-check`| Run TypeScript compiler check      |

## Architecture
[Describe key architectural decisions: SSG vs SSR strategy, service layer contract, component hierarchy]

## Contributing
1. Branch from `main`: `git checkout -b feat/[scope]-[description]`
2. Follow Conventional Commits (see `.cursor/skills/git-commit-writer.skill.md`)
3. Run pre-commit checklist (see `.cursor/skills/code-reviewer.skill.md`)
4. Open PR with template filled
```

## Auto-Generation Instructions
When generating a README for a new component or service:
1. Read all exported functions/types from the file
2. Document each with: purpose, parameters, return type, example usage
3. Note any peer dependencies or configuration required
4. Add to the relevant section of the main README or create a `README.md` co-located with the feature directory
