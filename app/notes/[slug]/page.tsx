import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, getReadingTime } from '@/lib/utils';
import { TechPill } from '@/components/ui/TechPill';
import { MDXRenderer } from '@/components/blog/MDXRenderer';
import { ReadingProgress } from '@/components/notes/ReadingProgress';
import { TableOfContents } from '@/components/notes/TableOfContents';
import { extractTocEntries } from '@/lib/toc';
import { getAllPostSlugs, getAllPostsMetadata, getPost } from '@/lib/mdx';
import { siteConfig } from '@/lib/data';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let title = 'Note';
  let description = '';
  try {
    const post = await getPost(slug);
    title = post.frontmatter?.title ?? title;
    description = post.frontmatter?.summary ?? '';
  } catch {
    // notFound() is handled by the page itself
  }
  return {
    title,
    description,
    alternates: {
      canonical: `/notes/${slug}`,
    },
  };
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;

  try {
    const post = await getPost(slug);

    if (!post.frontmatter?.title) {
      notFound();
    }

    const allPosts = getAllPostsMetadata();
    const idx = allPosts.findIndex((p) => p.slug === slug);
    const prev = idx > 0 ? allPosts[idx - 1] : null;
    const next = idx >= 0 && idx < allPosts.length - 1 ? allPosts[idx + 1] : null;

    // Related: most shared tags first, then newest
    const related = allPosts
      .filter((p) => p.slug !== slug)
      .map((p) => ({ p, shared: p.tags.filter((t) => post.frontmatter.tags.includes(t)).length }))
      .filter((r) => r.shared > 0)
      .sort((a, b) => b.shared - a.shared || new Date(b.p.date).getTime() - new Date(a.p.date).getTime())
      .slice(0, 2)
      .map((r) => r.p);

    const tocEntries = extractTocEntries(post.bodyOnly);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.frontmatter.title,
      description: post.frontmatter.summary ?? '',
      datePublished: post.frontmatter.date,
      author: { '@type': 'Person', name: siteConfig.name, url: siteConfig.url },
      publisher: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
      mainEntityOfPage: `${siteConfig.url}/notes/${slug}`,
    };

    return (
      <>
        <ReadingProgress />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="flex gap-10">
            {/* Main column */}
            <div className="mx-auto w-full max-w-3xl">
              {/* Breadcrumb */}
              <Link
                href="/notes"
                className="group mb-10 inline-flex items-center gap-1.5 text-xs font-mono text-zinc-600 transition-colors hover:text-zinc-400"
              >
                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
                <span>Notes</span>
                <ChevronRight className="h-3 w-3 text-zinc-700" />
                <span className="truncate text-zinc-500">{post.frontmatter.title}</span>
              </Link>

              {/* Header */}
              <header className="mb-10">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-zinc-600 mb-5">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-zinc-700" />
                    {formatDate(post.frontmatter.date)}
                  </span>
                  <span className="text-zinc-700">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-zinc-700" />
                    {getReadingTime(post.bodyOnly)} min read
                  </span>
                </div>

                <h1 className="text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
                  {post.frontmatter.title}
                </h1>

                {post.frontmatter.tags && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.frontmatter.tags.map((tag) => (
                      <TechPill
                        key={tag}
                        label={tag}
                        href={`/notes/tag/${encodeURIComponent(tag)}`}
                      />
                    ))}
                  </div>
                )}
              </header>

              {/* Content */}
              <article className="rounded-xl border border-zinc-800/50 bg-[#111] p-6 sm:p-8">
                <MDXRenderer>{post.content}</MDXRenderer>
              </article>

              {/* Related notes */}
              {related.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
                    Related notes
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {related.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/notes/${r.slug}`}
                        className="group rounded-xl border border-zinc-800/50 bg-[#111] p-4 transition-all duration-200 hover:border-zinc-700/60 hover:bg-[#151515]"
                      >
                        <h3 className="text-sm font-medium text-zinc-300 transition-colors group-hover:text-accent">
                          {r.title}
                        </h3>
                        <p className="mt-1 font-mono text-[11px] text-zinc-600">
                          {formatDate(r.date)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Prev / next */}
              <nav className="mt-10 flex items-stretch justify-between gap-4">
                {prev ? (
                  <Link
                    href={`/notes/${prev.slug}`}
                    className="group flex-1 rounded-xl border border-zinc-800/50 bg-[#111] p-4 transition-colors hover:border-zinc-700/60"
                  >
                    <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-600">
                      <ChevronLeft className="h-3 w-3" /> Previous
                    </span>
                    <span className="mt-1 block truncate text-sm font-medium text-zinc-300 transition-colors group-hover:text-accent">
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <span className="flex-1" />
                )}
                {next ? (
                  <Link
                    href={`/notes/${next.slug}`}
                    className="group flex-1 rounded-xl border border-zinc-800/50 bg-[#111] p-4 text-right transition-colors hover:border-zinc-700/60"
                  >
                    <span className="flex items-center justify-end gap-1 font-mono text-[11px] text-zinc-600">
                      Next <ChevronRight className="h-3 w-3" />
                    </span>
                    <span className="mt-1 block truncate text-sm font-medium text-zinc-300 transition-colors group-hover:text-accent">
                      {next.title}
                    </span>
                  </Link>
                ) : (
                  <span className="flex-1" />
                )}
              </nav>
            </div>

            {/* TOC (desktop) */}
            <aside className="hidden w-56 shrink-0 xl:block">
              <TableOfContents entries={tocEntries} />
            </aside>
          </div>
        </section>
      </>
    );
  } catch {
    notFound();
  }
}
