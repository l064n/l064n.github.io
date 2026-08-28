# Portfolio Website - Technical Architecture Plan

## Overview
A high-performance, developer-centric portfolio website built with Next.js (App Router), Tailwind CSS, Lucide React, and Framer Motion. Industrial minimalism aesthetic with deep dark mode default.

---

## 1. Design System & Tokens

### Color Palette
| Token | Dark Mode Value | Light Mode Value | Usage |
|-------|----------------|------------------|-------|
| `background` | `#0a0a0a` (neutral-950) | `#fafafa` (neutral-50) | Page background |
| `surface` | `#171717` (neutral-900) | `#ffffff` | Card/container backgrounds |
| `surface-elevated` | `#262626` (neutral-800) | `#f5f5f5` (neutral-100) | Hover states, elevated surfaces |
| `border` | `#262626` (neutral-800) | `#e5e5e5` (neutral-200) | All borders |
| `border-hover` | `#404040` (neutral-700) | `#d4d4d4` (neutral-300) | Interactive border states |
| `text-primary` | `#fafafa` (neutral-100) | `#171717` (neutral-900) | Primary text |
| `text-secondary` | `#a3a3a3` (neutral-400) | `#525252` (neutral-600) | Secondary/muted text |
| `text-muted` | `#737373` (neutral-500) | `#737373` (neutral-500) | Tertiary metadata |
| `accent` | `#f59e0b` (amber-500) | `#d97706` (amber-600) | Active states, status indicators |
| `accent-dim` | `rgba(245, 158, 11, 0.1)` | `rgba(217, 119, 6, 0.1)` | Accent backgrounds |

### Typography
| Role | Font Family | Weights | Sizes |
|------|-------------|---------|-------|
| Primary UI / Headings | Geist Sans (or Inter fallback) | 400, 500, 600 | xs(0.75rem) to 3xl(1.875rem) |
| Technical / Code / Metadata | JetBrains Mono | 400, 500 | xs(0.75rem), sm(0.875rem) |

### Spacing & Layout
- Max content width: `max-w-6xl` (1152px) for main content
- Blog reading width: `max-w-3xl` (768px) for optimal line length
- Section padding: `py-16` desktop, `py-12` mobile
- Grid gap: `gap-4` for cards, `gap-2` for compact UI

### Border Radius
- Small: `rounded-sm` (0.125rem) - badges, buttons
- Medium: `rounded-md` (0.375rem) - cards, inputs
- Large: `rounded-lg` (0.5rem) - terminal windows, modals

---

## 2. Directory Structure

```
project-three/
├── app/
│   ├── layout.tsx              # Root layout with providers, nav, footer
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles + font imports
│   ├── projects/
│   │   └── page.tsx            # Projects showcase
│   ├── blog/
│   │   ├── page.tsx            # Blog index/listing
│   │   └── [slug]/
│   │       └── page.tsx        # Dynamic blog post page
│   └── status/
│       └── page.tsx            # Status/Dashboard page (optional)
├── components/
│   ├── ui/                     # Atomic primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── TerminalWindow.tsx
│   │   └── ThemeToggle.tsx
│   ├── layout/                 # Structural components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   ├── home/                   # Home page sections
│   │   ├── HeroSection.tsx
│   │   ├── StatusDashboard.tsx
│   │   └── RecentActivity.tsx
│   ├── projects/               # Project components
│   │   ├── ProjectCard.tsx
│   │   └── FilterBar.tsx
│   └── blog/                   # Blog components
│       ├── PostCard.tsx
│       ├── PostHeader.tsx
│       └── MDXRenderer.tsx
├── content/
│   ├── blog/                   # MDX blog posts
│   │   ├── multi-gpu-cluster-optimization.mdx
│   │   ├── legacy-hardware-recapping-guide.mdx
│   │   └── frontmatter-schema.ts  # Type definitions for frontmatter
├── lib/
│   ├── utils.ts                # Formatters, reading time calculator
│   ├── mdx.ts                  # MDX parsing + frontmatter extraction
│   └── data.ts                 # Static project data, site config
├── public/                     # Static assets
│   └── favicon.ico
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
├── package.json
└── postcss.config.js
```

---

## 3. Configuration Files

### `tailwind.config.ts`
- Dark mode: `"class"` strategy (manual toggle via HTML class)
- Custom colors extending Tailwind's neutral palette with accent amber
- Font family extensions for Geist Sans + JetBrains Mono
- Prose customization for blog typography (`prose-invert`, code block styling)

### `next.config.js`
- MDX loader configuration via `@mdx-js/loader`
- Bundle analyzer disabled by default (optional dev flag)
- Image optimization settings
- Font self-hosting via `next/font`

### `tsconfig.json`
- Strict mode enabled
- Path aliases: `@/*` mapping to project root
- MDX inclusion in module resolution

---

## 4. Component Specifications

### Root Layout (`app/layout.tsx`)
```
┌─────────────────────────────────────────────┐
│ Header (fixed, backdrop-blur)               │
│  [Logo]  Home  Projects  Blog  [ThemeToggle]│
├─────────────────────────────────────────────┤
│                                             │
│  <children />                               │
│  (Page content, animated with Framer Motion)│
│                                             │
├─────────────────────────────────────────────┤
│ Footer                                      │
│  [Copyright] [GitHub] [LinkedIn]            │
└─────────────────────────────────────────────┘
```

### HeroSection (`components/home/HeroSection.tsx`)
- Monospace terminal-style greeting line (e.g., `$ whoami`)
- Large sans-serif name/title
- Concise technical description paragraph
- Subtle accent-colored status dot indicator

### StatusDashboard (`components/home/StatusDashboard.tsx`)
- TerminalWindow wrapper component
- Grid of metric rows: Label (monospace, muted) → Value (primary text)
- Mock data structure for extensibility
- Fields: Location, Current Focus, Status, Uptime, Stack

### ProjectCard (`components/projects/ProjectCard.tsx`)
```
┌──────────────────────────────────────┐
│ PROJECT TITLE                        │
├──────────────────────────────────────┤
│ 1-2 sentence technical description   │
│                                      │
│ Role: Systems Engineer               │
│ Stack: Next.js, Docker, NVIDIA       │
│ Impact: 40% latency reduction        │
├──────────────────────────────────────┤
│ [Hardware] [Infrastructure]          │
└──────────────────────────────────────┘
```

### MDXRenderer (`components/blog/MDXRenderer.tsx`)
- Wraps `next-mdx-remote` render client
- Injects custom components for code blocks, links, headings
- Applies `prose prose-invert max-w-none` Tailwind classes
- Handles frontmatter display via PostHeader

---

## 5. Data Models

### Project Data (`lib/data.ts`)
```typescript
interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  role: string;
  stack: string[];
  impact: string;
  categories: ("Hardware" | "Software" | "Infrastructure")[];
  status: "Active" | "Completed" | "Archived";
  date: string;
}
```

### Blog Frontmatter (`content/blog/frontmatter-schema.ts`)
```typescript
interface PostFrontmatter {
  title: string;
  date: string;
  tags: string[];
  readingTime?: string;  // auto-calculated, optional override
  summary?: string;      // for listing cards
}
```

### Status Metric (`components/home/StatusDashboard.tsx`)
```typescript
interface StatusMetric {
  label: string;
  value: string;
  indicator?: "online" | "offline" | "warning";
}
```

---

## 6. Page Layouts

### Home Page (`/app/page.tsx`)
```
┌─────────────────────────────────────┐
│ HeroSection                         │
│   - Terminal-style greeting         │
│   - Name + title                    │
│   - Technical bio paragraph         │
├─────────────────────────────────────┤
│ StatusDashboard                     │
│   - System Overview panel           │
│   - Live metrics / status flags     │
├─────────────────────────────────────┤
│ RecentActivity                      │
│   - Combined timeline feed          │
│   - Latest 2 blog posts             │
│   - Recent project updates          │
└─────────────────────────────────────┘
```

### Projects Page (`/app/projects/page.tsx`)
```
┌─────────────────────────────────────┐
│ Page Header: "Projects" + subtitle  │
├─────────────────────────────────────┤
│ FilterBar                           │
│   [All] [Hardware] [Software]       │
│   [Infrastructure]                  │
├─────────────────────────────────────┤
│ ProjectCard Grid (responsive)       │
│   ┌──────┐ ┌──────┐                │
│   │ Card │ │ Card │  ...            │
│   └──────┘ └──────┘                │
└─────────────────────────────────────┘
```

### Blog Index (`/app/blog/page.tsx`)
```
┌─────────────────────────────────────┐
│ Page Header: "Technical Notes"      │
├─────────────────────────────────────┤
│ PostCard List (single column)       │
│   ┌──────────────────────────┐     │
│   │ Title                    │     │
│   │ Date · Reading Time      │     │
│   │ Summary excerpt          │     │
│   │ [tag] [tag]              │     │
│   └──────────────────────────┘     │
└─────────────────────────────────────┘
```

### Blog Post (`/app/blog/[slug]/page.tsx`)
```
┌─────────────────────────────────────┐
│ PostHeader                          │
│   - Title (large sans-serif)        │
│   - Date · Reading Time · Tags      │
├─────────────────────────────────────┤
│ MDX Content                         │
│   (prose prose-invert styling)       │
│   - Syntax highlighted code blocks  │
│   - Clean heading hierarchy         │
│   - Inline code with accent bg      │
└─────────────────────────────────────┘
```

---

## 7. Animation Strategy (Framer Motion)

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page load | Fade in + subtle Y translate (20px → 0) | 0.3s | easeOut |
| Staggered children | Each child delays by 0.05s | - | - |
| Card hover | Scale 1.0 → 1.01, border color shift | 0.15s | easeInOut |
| Button hover | Background fill transition | 0.15s | easeOut |
| Theme toggle | Icon rotation (90deg) | 0.2s | spring |
| Filter active state | Accent underline slide-in | 0.2s | easeOut |

**Constraints:** No parallax, no scroll-linked animations, no heavy layout shifts. All animations must respect `prefers-reduced-motion`.

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Layout Adjustments |
|------------|-------|-------------------|
| Mobile | <640px | Single column, compact padding, hamburger nav optional |
| Tablet | 640-1024px | 2-column project grid, full nav visible |
| Desktop | >1024px | 3-column project grid, max-width container centered |
| Ultrawide | >1536px | Same as desktop (max-w-6xl constrains content) |

---

## 9. Performance Checklist

- [x] Static generation for all pages (`generateStaticParams` for blog slugs)
- [x] Font loading via `next/font` with `display: swap` and `subsets: ["latin"]`
- [x] Code splitting via dynamic imports for heavy components (MDX renderer)
- [x] Image optimization via `next/image` where applicable
- [x] Minimal client-side JavaScript (server components by default)
- [x] Semantic HTML structure (header, main, article, nav, footer)

---

## 10. Implementation Order

1. **Scaffold** - Initialize Next.js project, install dependencies
2. **Configure** - Tailwind, Next config, TypeScript paths
3. **Foundation** - Global CSS, root layout, theme provider
4. **Primitives** - Button, Card, Badge, TerminalWindow, ThemeToggle
5. **Layout Components** - Header, Footer, Container
6. **Home Page** - HeroSection, StatusDashboard, RecentActivity
7. **Projects Page** - ProjectCard, FilterBar, project data
8. **Blog System** - MDX parsing, PostCard, dynamic routes, sample content
9. **Polish** - Animations, responsive tweaks, performance audit
