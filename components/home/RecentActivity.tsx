'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, FolderGit2, BrainCircuit, Wrench, Terminal, Briefcase } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { ProjectFrontmatter } from '@/content/projects/project-schema';

interface NoteMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
}

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};

const itemVariant = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOutExpo } },
};

const iconStyles = (color: string) => `p-2 rounded-lg ${color} transition-transform group-hover:scale-110`;

/** Map a note's primary tag to a terminal-style icon. */
function noteIcon(tag: string | undefined) {
  if (!tag) return { icon: <FileText className="size-4" />, bg: 'bg-zinc-500/10 text-zinc-400' };
  switch (tag) {
    case 'GPU':
    case 'LLM':
    case 'Infrastructure':
      return { icon: <BrainCircuit className="size-4" />, bg: 'bg-purple-500/10 text-purple-400' };
    case 'Hardware':
    case 'Restoration':
    case 'Electronics':
      return { icon: <Wrench className="size-4" />, bg: 'bg-amber-500/10 text-amber-400' };
    case 'Unix':
    case 'macOS':
    case 'DevOps':
      return { icon: <Terminal className="size-4" />, bg: 'bg-sky-500/10 text-sky-400' };
    default:
      return { icon: <FileText className="size-4" />, bg: 'bg-zinc-500/10 text-zinc-400' };
  }
}

interface ProjectMeta extends ProjectFrontmatter {
  slug: string;
}

export function RecentActivity({
  posts,
  latestProject,
}: {
  posts: NoteMeta[];
  latestProject?: ProjectMeta | null;
}) {

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Recent Activity</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>
      </motion.div>

      {/* Timeline feed */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-2"
      >
        {/* Note entries */}
        {posts.map((post) => {
          const { icon, bg } = noteIcon(post.tags[0]);
          return (
            <motion.div key={post.slug} variants={itemVariant}>
              <Link
                href={`/notes/${post.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-zinc-800/60 bg-surface px-4 py-4 transition-all hover:border-zinc-700 hover:bg-surface-elevated"
              >
                <div className={iconStyles(bg)}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-zinc-200 group-hover:text-accent transition-colors truncate">
                    {post.title}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-zinc-600">
                    {formatDate(post.date)}
                    <span className="mx-1.5">·</span>
                    Notes
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-zinc-700 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
              </Link>
            </motion.div>
          );
        })}

        {/* Latest project entry */}
        {latestProject && (
          <motion.div variants={itemVariant}>
            <Link
              href={`/projects/${latestProject.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-zinc-800/60 bg-surface px-4 py-4 transition-all hover:border-zinc-700 hover:bg-surface-elevated"
            >
              <div className={iconStyles('bg-accent-dim text-accent')}>
                <FolderGit2 className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-zinc-200 group-hover:text-accent transition-colors truncate">
                  {latestProject.title}
                </h3>
                <p className="mt-0.5 font-mono text-xs text-zinc-600">
                  {formatDate(latestProject.date)}
                  <span className="mx-1.5">·</span>
                  Project Update
                </p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-zinc-700 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </Link>
          </motion.div>
        )}

        {/* Experience link */}
        <motion.div variants={itemVariant}>
          <Link
            href="/experience"
            className="group flex items-center gap-4 rounded-xl border border-zinc-800/60 bg-surface px-4 py-4 transition-all hover:border-zinc-700 hover:bg-surface-elevated"
          >
            <div className={iconStyles('bg-emerald-500/10 text-emerald-400')}>
              <Briefcase className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-zinc-200 group-hover:text-accent transition-colors truncate">
                Experience & Toolkit
              </h3>
              <p className="mt-0.5 font-mono text-xs text-zinc-600">
                Career timeline
                <span className="mx-1.5">·</span>
                Zoox · Monarch Tractor
              </p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-zinc-700 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
