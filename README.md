# l064n — Personal Site

[logan.dev](https://logan.dev) — portfolio, technical notes, and live cluster telemetry.
Built with Next.js 15 (App Router, static export), Tailwind CSS, MDX, Framer Motion, and react-three-fiber.

## Architecture

```
app/                  # Routes (static export)
  page.tsx            # Home: 3D hero + live status + recent activity
  projects/           # Project grid + /projects/[slug] deep dives
  notes/              # Note index, /notes/[slug], /notes/tag/[tag], RSS feed
  experience/         # Career timeline + toolkit
  sitemap.xml/        # Static sitemap route
  not-found.tsx       # Terminal-styled 404
components/           # ui / layout / home / projects / notes / mdx
content/
  notes/              # MDX notes (frontmatter: title, date, tags, summary)
  projects/           # MDX projects (frontmatter: title, date, status, role, stack, impact, categories, description)
lib/
  mdx.ts              # Notes MDX pipeline (frontmatter parser, compileMDX)
  projects.ts         # Projects MDX pipeline
  toc.ts              # TOC extraction + heading id (shared by renderer & extractor)
  data.ts             # siteConfig, experience, toolkit, nav
public/
  status.json         # Live cluster telemetry (committed snapshot + live updates)
  og-image.png        # Open Graph / share preview
status/
  collect.sh          # Cluster → repo telemetry pusher (cron)
  collect_node.py     # Per-node GPU telemetry (nvidia-smi / rocm-smi)
```

## Development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # static export to out/
npm run lint      # eslint (next/core-web-vitals + typescript)
```

## Deployment

`push → main` triggers `.github/workflows/deploy.yml`:
build → convert flat `.html` to directory `index.html` (GitHub Pages requires this) → deploy to Pages.

The site serves on **logan.dev** (CNAME in `public/`) with **l064n.github.io** as fallback.
Point a `CNAME` DNS record for `logan.dev` at `l064n.github.io`.

`paths-ignore` keeps telemetry pushes (`public/status.json`) from triggering full site rebuilds.

`ci.yml` runs lint + typecheck + build on PRs and pushes.

## Live cluster status

The home page dashboard shows real GPU telemetry. Flow:

1. `status/collect.sh` runs on the cluster every 5 min (cron)
2. It gathers per-node GPU data (`collect_node.py`, supports local or ssh targets)
3. Merges into `public/status.json`, commits **only when changed**, pushes with a PAT
4. The client component (`ClusterStatus`) polls `raw.githubusercontent.com` every 60s —
   the site updates without a deploy; the committed `status.json` is the offline fallback

### Setting up the cluster daemon

1. Clone this repo on the cluster
2. `git config credential.helper store` (a fine-grained PAT with **Contents: write** on this
   repo only, stored on first `git push`)
3. Edit the `NODES` array in `status/collect.sh` — format: `name|target|role`,
   where `target` is `local` or an ssh address
4. Cron:
   ```
   */5 * * * * /path/to/repo/status/collect.sh >> /tmp/cluster-status.log 2>&1
   ```

## Adding content

**Note**: drop a `.mdx` file in `content/notes/` with frontmatter
(`title`, `date`, `tags`, `summary`). It appears in the index, RSS, sitemap,
command palette, and Recent Activity automatically. Headings get TOC anchors
and the note page gets a TOC, reading progress, prev/next, and related notes.

**Project**: drop a `.mdx` file in `content/projects/` with frontmatter
(`title`, `date`, `status`, `role`, `stack`, `impact`, `categories`,
`description`). It gets a card on `/projects` and a deep-dive page at
`/projects/[slug]`.
