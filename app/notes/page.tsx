import { getAllPostsMetadata } from '@/lib/mdx';
import Link from 'next/link';
import { formatDate, getReadingTime } from '@/lib/utils';
import { TechPill } from '@/components/ui/TechPill';

export default function NotesPage() {
  const posts = getAllPostsMetadata();

  // Collect all unique tags across every post
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Technical Notes</h1>
        <p className="mt-1 text-sm leading-relaxed text-zinc-500">
          Engineering write-ups, teardowns, and infrastructure documentation. Obsidian-synced from local knowledge base.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-8">
        {/* Left: Sticky tag cloud */}
        <aside className="hidden w-48 shrink-0 lg:block">
          <div className="sticky top-20 space-y-3 rounded-lg border border-border bg-surface p-4">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Tags
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <TechPill key={tag} label={tag} />
              ))}
            </div>

            {/* Stats */}
            <div className="mt-6 pt-4 border-t border-border space-y-2 font-mono text-xs text-zinc-500">
              <p>{posts.length} notes published</p>
              <p>Last updated: {posts[0] ? formatDate(posts[0].date) : '\u2014'}</p>
            </div>
          </div>
        </aside>

        {/* Right: Post feed */}
        <div className="flex-1 min-w-0 space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/notes/${post.slug}`}
              className="group block rounded-lg border border-border bg-surface p-5 transition-colors hover:border-zinc-700"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-600">
                <span>{formatDate(post.date)}</span>
                <span>\u00b7</span>
                <span>{getReadingTime(post.bodyOnly)} min read</span>
              </div>

              <h2 className="mt-2 text-base font-semibold group-hover:text-accent transition-colors">
                {post.title}
              </h2>

              {post.summary && (
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400 line-clamp-2">
                  {post.summary}
                </p>
              )}

              <div className="mt-3 flex gap-1.5">
                {post.tags.map((tag) => (
                  <TechPill key={tag} label={tag} />
                ))}
              </div>
            </Link>
          ))}

          {posts.length === 0 && (
            <p className="font-mono text-sm text-zinc-600">No notes published yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
