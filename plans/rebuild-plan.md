# Portfolio Rebuild Plan — v3 (Clean Slate)

## Critical Lessons from Previous Attempts
| Issue | Fix |
|-------|-----|
| Stale webpack vendor chunks (`motion-dom.js`) | Delete all code, rebuild fresh, single `npm install` + `npm run build` + `npm run dev` |
| Framer Motion SSG error | No `motion.*` in server components. `Card.tsx` uses plain `<div>`, `Header.tsx` uses CSS transitions only. Animations only in `'use client'` home sections and project cards. |
| next-mdx-remote v5 API | Returns `{ content, frontmatter }` — not old `{ compiledSource }`. Custom YAML parser for frontmatter since v5 has no remark-frontmatter plugin. |
| ThemeToggle easing bug | **Remove entirely** — dark-only design. |
| Capital letters in directory | Can't use `create-next-app` in `/Users/logan/Documents/Project_Three`. Manual scaffolding required. |

## Architecture
```
Project_Three/
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── postcss.config.js
├── tailwind.config.ts
│
├── app/
│   ├── layout.tsx           Root layout, Inter + JetBrains Mono fonts, Header + Footer
│   ├── page.tsx             Home: HeroSection + StatusDashboard + RecentActivity (all 'use client' children)
│   ├── globals.css          Dark palette CSS vars, prose-custom, Tailwind directives
│   │
│   ├── projects/
│   │   └── page.tsx         Filterable project grid (client component: FilterBar + ProjectCard)
│   │
│   ├── notes/
│   │   ├── page.tsx         Two-column layout: sticky tag sidebar + post feed (server component)
│   │   └── [slug]/
│   │       └── page.tsx     Dynamic MDX note renderer (server component via generateStaticParams)
│   │
│   └── experience/
│       └── page.tsx         Career timeline + Physical Toolkit grid (static server component)
│
├── components/
│   ├── ui/
│   │   ├── Badge.tsx        Pure React. Default/accent/outline variants.
│   │   ├── Card.tsx         Pure React <div> wrapper. NO motion.div (SSG risk).
│   │   ├── StatusDot.tsx    Pure React. Tailwind animate-ping (no framer-motion).
│   │   └── TechPill.tsx     Pure React. Pill badge via cn() utility.
│   │
│   ├── layout/
│   │   ├── Header.tsx       'use client'. Breadcrumb nav via usePathname(). CSS transitions only (no motion.*). CommandPalette rendered inline.
│   │   ├── Footer.tsx       Pure static server component.
│   │   └── CommandPalette.tsx 'use client'. cmdk CommandDialog, ⌘K shortcut.
│   │
│   ├── home/                 All 'use client' — Framer Motion animations
│   │   ├── HeroSection.tsx  Terminal "$ whoami" greeting + title + status dot. Staggered fadeInUp.
│   │   ├── StatusDashboard.tsx TerminalWindow with statusMetrics rows. Stagger animation.
│   │   └── RecentActivity.tsx Timeline feed. Stagger fade-in on list items.
│   │
│   ├── projects/
│   │   ├── FilterBar.tsx    'use client'. Filter categories with lasso animation.
│   │   └── ProjectCard.tsx  'use client'. Diagnostic readout card with motion.div layout.
│   │
│   ├── blog/
│   │   └── MDXRenderer.tsx  Wraps MDX content with prose-invert styling.
│   │
│   └── mdx/
│       ├── Callout.tsx      Warning/info boxes for MDX content.
│       └── CustomCodeBlock.tsx Copy-to-clipboard toolbar + language label.
│
├── content/
│   └── notes/
│       ├── frontmatter-schema.ts  PostFrontmatter interface
│       ├── multi-gpu-cluster-optimization.mdx
│       ├── legacy-hardware-recapping-guide.mdx
│       └── nix-darwin-and-unix-tooling.mdx
│
├── lib/
│   ├── data.ts              Seeded personal data: siteConfig, projects[], experienceTimeline[], etc.
│   ├── utils.ts             cn(), formatDate(), getReadingTime(), slugify()
│   └── mdx.ts               getAllPostSlugs(), getAllPostsMetadata(), getPostMetadata(), getPost()
│
└── plans/
    └── rebuild-plan.md      This file
```

## Rebuild Steps

### Phase 0: Clean Slate
1. Remove all existing files: delete `app/`, `components/`, `content/`, `lib/`, `package.json*`, config files, old plans
2. `git init`
3. Create `.gitignore`
4. `git add . && git commit -m "chore: init git repo"`

### Phase 1: Config + Dependencies
5. Create `package.json` with all dependencies pre-declared
6. Create `tsconfig.json` (strict mode, `@/*` path alias, `bundler` module resolution)
7. Create `next.config.js` (pageExtensions for ts/tsx/mdx, webpack MDX loader)
8. Create `tailwind.config.ts` (dark-only palette, typography plugin import)
9. Create `postcss.config.js`
10. `npm install`
11. `git add . && git commit -m "chore: project scaffolding and dependencies"`

### Phase 2: Lib + Data
12. Create `lib/data.ts` — personal data for Logan Matthew Phillips
13. Create `lib/utils.ts` — utility functions
14. Create `lib/mdx.ts` — MDX parsing pipeline with custom frontmatter
15. `git add . && git commit -m "feat: add data models and MDX pipeline"`

### Phase 3: UI + Layout
16. Create all `components/ui/` files (Badge, Card, StatusDot, TechPill)
17. Create `components/layout/Header.tsx` (client, breadcrumb nav, CSS transitions only)
18. Create `components/layout/Footer.tsx` (server, static)
19. Create `components/layout/CommandPalette.tsx` (client, cmdk)
20. `git add . && git commit -m "feat: add UI primitives and layout components"`

### Phase 4: Animated Home Sections
21. Create `components/home/HeroSection.tsx` (client, Framer Motion)
22. Create `components/home/StatusDashboard.tsx` (client, Framer Motion)
23. Create `components/home/RecentActivity.tsx` (client, Framer Motion)
24. `git add . && git commit -m "feat: add animated home sections"`

### Phase 5: Pages
25. Create `app/globals.css` (dark palette CSS vars, prose-custom, Tailwind directives)
26. Create `app/layout.tsx` (root layout with fonts, Header, Footer)
27. Create `app/page.tsx` (home page with all sections)
28. Create `app/projects/page.tsx` (filterable project grid)
29. Create `app/experience/page.tsx` (career timeline + toolkit grid)
30. Create `app/notes/page.tsx` (two-column note index)
31. Create `app/notes/[slug]/page.tsx` (dynamic MDX note renderer)
32. `git add . && git commit -m "feat: add all pages and global styles"`

### Phase 6: MDX Components + Content
33. Create `components/blog/MDXRenderer.tsx` (prose wrapper)
34. Create `components/mdx/Callout.tsx` (warning/info boxes)
35. Create `components/mdx/CustomCodeBlock.tsx` (copy-to-clipboard)
36. Create `content/notes/frontmatter-schema.ts`
37. Create `content/notes/multi-gpu-cluster-optimization.mdx`
38. Create `content/notes/legacy-hardware-recapping-guide.mdx`
39. Create `content/notes/nix-darwin-and-unix-tooling.mdx`
40. `git add . && git commit -m "feat: add MDX components and seeded content"`

### Phase 7: Build Verification
41. `npm run build` — verify zero TypeScript errors, zero runtime warnings
42. `npm run dev` — start dev server
43. Health check all routes: `http://localhost:3000`, `/projects`, `/notes`, `/notes/*`, `/experience`
44. `git add . && git commit -m "chore: build verification complete"`
45. Done!

## Git Strategy
- **Initial commit**: `.gitignore` only
- **After Phase 1**: Config files + dependencies
- **After Phase 2**: Data models + MDX pipeline
- **After Phase 3**: UI primitives + layout
- **After Phase 4**: Animated sections
- **After Phase 5**: All pages
- **After Phase 6**: MDX components + content
- **After Phase 7**: Build verification
- `.next/` and `node_modules/` excluded from git

## Routes
| Route | Component | Type |
|-------|-----------|------|
| `/` | HomePage (HeroSection + StatusDashboard + RecentActivity) | Server → Client children |
| `/projects` | ProjectsPage (FilterBar + ProjectCard grid) | Client |
| `/notes` | NotesPage (sticky tag sidebar + post feed) | Server |
| `/notes/[slug]` | NotePage (MDX renderer via generateStaticParams) | Server |
| `/experience` | ExperiencePage (timeline + toolkit grid) | Server |
