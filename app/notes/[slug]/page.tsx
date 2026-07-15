import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { formatDate, getReadingTime } from '@/lib/utils';
import { TechPill } from '@/components/ui/TechPill';
import { MDXRenderer } from '@/components/blog/MDXRenderer';
import { getAllPostSlugs, getPost } from '@/lib/mdx';

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
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
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Back link */}
        <Link
          href="/notes"
          className="group inline-flex items-center gap-1.5 text-sm font-mono text-zinc-500 hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to notes
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-zinc-600 mb-4">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {formatDate(post.frontmatter.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {getReadingTime(post.bodyOnly)} min read
            </span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{post.frontmatter.title}</h1>

          {post.frontmatter.tags && (
            <div className="mt-3 flex gap-1.5">
              {post.frontmatter.tags.map((tag) => (
                <TechPill key={tag} label={tag} />
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <MDXRenderer>{post.content}</MDXRenderer>
      </section>
    );
  } catch {
    notFound();
  }
}
