import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, ChevronRight } from 'lucide-react';
import { formatDate, getReadingTime } from '@/lib/utils';
import { TechPill } from '@/components/ui/TechPill';
import { MDXRenderer } from '@/components/blog/MDXRenderer';
import { getAllPostSlugs, getPost } from '@/lib/mdx';

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

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;

  try {
    const post = await getPost(slug);

    if (!post.frontmatter?.title) {
      notFound();
    }

    return (
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        {/* Breadcrumb */}
        <Link
          href="/notes"
          className="group inline-flex items-center gap-1.5 text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors mb-10"
        >
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
          <span>Notes</span>
          <ChevronRight className="h-3 w-3 text-zinc-700" />
          <span className="text-zinc-500 truncate">{post.frontmatter.title}</span>
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

          <h1 className="text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">{post.frontmatter.title}</h1>

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
      </section>
    );
  } catch {
    notFound();
  }
}
