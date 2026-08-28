import { getAllPostsMetadata } from '@/lib/mdx';
import Link from 'next/link';
import { formatDate, getReadingTime } from '@/lib/utils';
import { TechPill } from '@/components/ui/TechPill';
import { FileText, Clock } from 'lucide-react';

export const metadata = {
  title: 'Technical Notes',
  description:
    'Engineering write-ups, teardowns, and infrastructure documentation. GPU clusters, hardware restoration, and reproducible Unix tooling.',
  alternates: {
    canonical: '/notes',
  },
};

export default function NotesPage() {
  const posts = getAllPostsMetadata();

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      {/* Page header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          <h1 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Technical Notes</h1>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-500">
          Engineering write-ups, teardowns, and infrastructure documentation. Obsidian-synced from local knowledge base.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-10">
        {/* Left: Sticky tag cloud */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-20 space-y-4 rounded-xl border border-zinc-800/50 bg-[#111] p-5">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
              Tags
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <TechPill key={tag} label={tag} href={`/notes/tag/${encodeURIComponent(tag)}`} />
              ))}
            </div>

            {/* Stats */}
            <div className="mt-5 pt-4 border-t border-zinc-800/50 space-y-2 font-mono text-[11px] text-zinc-600">
              <div className="flex items-center gap-2">
                <FileText className="h-3 w-3" />
                <span>{posts.length} notes published</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>Last: {posts[0] ? formatDate(posts[0].date) : '\u2014'}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right: Post feed */}
        <div className="flex-1 min-w-0 space-y-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/notes/${post.slug}`}
              className="group block rounded-xl border border-zinc-800/50 bg-[#111] p-5 transition-all duration-200 hover:border-zinc-700/60 hover:bg-[#151515] hover:shadow-lg hover:shadow-black/20"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-600">
                <span>{formatDate(post.date)}</span>
                <span className="text-zinc-700">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {getReadingTime(post.bodyOnly)} min read
                </span>
              </div>

              <h2 className="mt-2.5 text-base font-semibold text-zinc-200 group-hover:text-accent transition-colors">
                {post.title}
              </h2>

              {post.summary && (
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 line-clamp-2">
                  {post.summary}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <TechPill
                    key={tag}
                    label={tag}
                    href={`/notes/tag/${encodeURIComponent(tag)}`}
                  />
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
