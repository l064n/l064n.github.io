import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { TechPill } from '@/components/ui/TechPill';
import { MDXRenderer } from '@/components/blog/MDXRenderer';
import { getAllProjectSlugs, getAllProjectsMetadata, getProject } from '@/lib/projects';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let title = 'Project';
  let description = '';
  try {
    const project = await getProject(slug);
    title = project.frontmatter?.title ?? title;
    description = project.frontmatter?.description ?? '';
  } catch {
    // notFound() is handled by the page itself
  }
  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${slug}`,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  try {
    const project = await getProject(slug);
    const all = getAllProjectsMetadata();
    const idx = all.findIndex((p) => p.slug === slug);
    const prev = idx > 0 ? all[idx - 1] : null;
    const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

    if (!project.frontmatter?.title) {
      notFound();
    }

    return (
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        {/* Breadcrumb */}
        <Link
          href="/projects"
          className="group mb-10 inline-flex items-center gap-1.5 text-xs font-mono text-zinc-600 transition-colors hover:text-zinc-400"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
          <span>Projects</span>
          <ChevronRight className="h-3 w-3 text-zinc-700" />
          <span className="truncate text-zinc-500">{project.frontmatter.title}</span>
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-zinc-600 mb-5">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-zinc-700" />
              {formatDate(project.frontmatter.date)}
            </span>
            <span className="text-zinc-700">·</span>
            <span
              className={
                project.frontmatter.status === 'Active'
                  ? 'text-accent'
                  : 'text-zinc-500'
              }
            >
              {project.frontmatter.status}
            </span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
            {project.frontmatter.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.frontmatter.categories.map((cat) => (
              <Badge key={cat} variant="outline">
                {cat}
              </Badge>
            ))}
          </div>
        </header>

        {/* Role / impact readout */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800/50 bg-[#111] p-4">
            <div className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 mb-1">
              Role
            </div>
            <div className="text-sm text-zinc-300">{project.frontmatter.role}</div>
          </div>
          <div className="rounded-xl border border-accent/20 bg-accent/[0.04] p-4">
            <div className="font-mono text-[11px] uppercase tracking-widest text-accent/70 mb-1">
              Impact
            </div>
            <div className="text-sm leading-relaxed text-zinc-300">{project.frontmatter.impact}</div>
          </div>
        </div>

        {/* Stack */}
        <div className="mb-8 flex flex-wrap gap-1.5">
          {project.frontmatter.stack.map((tech) => (
            <TechPill key={tech} label={tech} />
          ))}
        </div>

        {/* Content */}
        <article className="rounded-xl border border-zinc-800/50 bg-[#111] p-6 sm:p-8">
          <MDXRenderer>{project.content}</MDXRenderer>
        </article>

        {/* Prev / next */}
        <nav className="mt-10 flex items-stretch justify-between gap-4">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group flex-1 rounded-xl border border-zinc-800/50 bg-[#111] p-4 transition-colors hover:border-zinc-700/60"
            >
              <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-600">
                <ChevronLeft className="h-3 w-3" /> Previous
              </span>
              <span className="mt-1 block text-sm font-medium text-zinc-300 group-hover:text-accent transition-colors">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="group flex-1 rounded-xl border border-zinc-800/50 bg-[#111] p-4 text-right transition-colors hover:border-zinc-700/60"
            >
              <span className="flex items-center justify-end gap-1 font-mono text-[11px] text-zinc-600">
                Next <ChevronRight className="h-3 w-3" />
              </span>
              <span className="mt-1 block text-sm font-medium text-zinc-300 group-hover:text-accent transition-colors">
                {next.title}
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </nav>
      </section>
    );
  } catch {
    notFound();
  }
}
