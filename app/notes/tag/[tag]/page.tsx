import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Clock } from 'lucide-react';
import { formatDate, getReadingTime } from '@/lib/utils';
import { TechPill } from '@/components/ui/TechPill';
import { getAllPostsMetadata } from '@/lib/mdx';

interface Props {
  params: Promise<{ tag: string }>;
}

function allTags(): string[] {
  return Array.from(new Set(getAllPostsMetadata().flatMap((p) => p.tags))).sort();
}

export function generateStaticParams() {
  return allTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Notes tagged ${tag}`,
    description: `All technical notes tagged "${tag}".`,
    alternates: {
      canonical: `/notes/tag/${tag}`,
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const posts = getAllPostsMetadata().filter((p) => p.tags.includes(tag));

  if (posts.length === 0) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      {/* Breadcrumb */}
      <Link
        href="/notes"
        className="group mb-10 inline-flex items-center gap-1.5 text-xs font-mono text-zinc-600 transition-colors hover:text-zinc-400"
      >
        <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
        <span>Notes</span>
        <ChevronRight className="h-3 w-3 text-zinc-700" />
        <span className="text-accent">{tag}</span>
      </Link>

      <div className="mb-10">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
          Tagged <span className="text-accent">{tag}</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {posts.length} {posts.length === 1 ? 'note' : 'notes'}
        </p>
      </div>

      <div className="space-y-3">
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

            <h2 className="mt-2.5 text-base font-semibold text-zinc-200 transition-colors group-hover:text-accent">
              {post.title}
            </h2>

            {post.summary && (
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-500">{post.summary}</p>
            )}

            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <TechPill key={t} label={t} variant={t === tag ? 'accent' : 'default'} />
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
