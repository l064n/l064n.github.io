# Portfolio Three

Personal website & portfolio for **Logan Matthew Phillips** — Systems Integration Engineer.
Autonomous vehicle infrastructure, hardware orchestration, and local LLM compute. Oakland, CA.

**Live:** https://l064n.github.io/portfolio-three/

[![Deploy to GitHub Pages](https://github.com/l064n/portfolio-three/actions/workflows/deploy.yml/badge.svg)](https://github.com/l064n/portfolio-three/actions/workflows/deploy.yml)

---

## Features

- **Home** — terminal-style hero (`$ whoami`), live status dashboard, recent activity feed
- **Projects** — filterable project grid with category chips and impact metrics
- **Notes** — MDX technical writing with a sticky tag sidebar, custom code blocks with copy-to-clipboard, and callout components
- **Experience** — career timeline and physical toolkit grid
- **Command palette** — `⌘K` / `Ctrl+K` site-wide navigation
- Dark, industrial-minimalism design system (deep neutral palette, amber accent)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org) (App Router, static export) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + `@tailwindcss/typography` |
| Animation | Framer Motion (client components only) |
| Content | MDX via `next-mdx-remote` with a custom frontmatter parser |
| UI | Lucide React icons, `cmdk` command palette |
| Hosting | GitHub Pages (Actions-based static export) |

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000/portfolio-three/ — the app uses `basePath: '/portfolio-three'`
to match its GitHub Pages URL.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Production build (static export to `out/`) |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
Project_Three/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout (Inter + JetBrains Mono, Header/Footer)
│   ├── page.tsx              # Home
│   ├── globals.css           # Dark palette CSS vars, prose styles
│   ├── projects/page.tsx     # Filterable project grid
│   ├── notes/                # MDX notes index + [slug] renderer
│   └── experience/page.tsx   # Career timeline + toolkit grid
├── components/
│   ├── ui/                   # Atomic primitives (Badge, Card, StatusDot, TechPill, TerminalWindow)
│   ├── layout/               # Header, Footer, CommandPalette
│   ├── home/                 # HeroSection, StatusDashboard, RecentActivity
│   ├── projects/             # FilterBar, ProjectCard
│   ├── blog/                 # MDXRenderer (prose wrapper)
│   └── mdx/                  # Callout, CustomCodeBlock
├── content/
│   └── notes/                # MDX articles + frontmatter-schema.ts
├── lib/
│   ├── data.ts               # Site config, projects, experience data
│   ├── mdx.ts                # MDX pipeline (slugs, metadata, compileMDX)
│   └── utils.ts              # cn(), formatDate(), getReadingTime(), slugify()
├── plans/                    # Design docs (historical)
│   ├── portfolio-architecture.md   # v2 architecture plan (design system, specs)
│   └── rebuild-plan.md             # v3 clean-slate rebuild plan (current structure)
└── .github/workflows/deploy.yml    # GitHub Pages deployment
```

## Content

Notes live in `content/notes/` as `.mdx` files. Each file begins with simple
YAML-like frontmatter (parsed by the lightweight parser in
[`lib/mdx.ts`](lib/mdx.ts)):

```mdx
---
title: My Note Title
date: 2025-11-15
tags: [hardware, gpu]
summary: One-line description for the index page.
---

# Heading

Body content. Custom components available:

<Callout type="warning">Inline callouts</Callout>
<CustomCodeBlock language="bash">npm run dev</CustomCodeBlock>
```

Site content (projects, status metrics, experience timeline, navigation) is
defined in [`lib/data.ts`](lib/data.ts).

## Deployment

The site is a **static export** (`output: 'export'` in `next.config.js`)
deployed to GitHub Pages via Actions on every push to `main`:

1. Build with `next build` (emits `out/`)
2. Upload the artifact with `actions/upload-pages-artifact`
3. Deploy with `actions/deploy-pages`

- Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
- Pages settings: build type **Workflow**, source branch `main`

### Local production build

```bash
npm run build   # writes static site to out/
npx serve out   # preview the export locally
```

## Documentation

Design and architecture docs are kept in [`plans/`](plans/):

- [`plans/portfolio-architecture.md`](plans/portfolio-architecture.md) — v2 technical architecture: design tokens, component specs, data models (historical)
- [`plans/rebuild-plan.md`](plans/rebuild-plan.md) — v3 clean-slate rebuild plan reflecting the current structure

## License

© Logan Matthew Phillips. All rights reserved.
