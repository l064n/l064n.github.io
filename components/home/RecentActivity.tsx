'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, FolderGit2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { projects } from '@/lib/data';

const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05 } },
};

const itemVariant = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

// Seeded recent notes from Logan's knowledge base
const recentPosts = [
  { slug: 'nix-darwin-and-unix-tooling', title: 'Nix-Darwin and My Unix Toolchain', date: '2026-02-10' },
  { slug: 'multi-gpu-cluster-optimization', title: 'Multi-GPU Cluster Optimization Notes', date: '2026-01-15' },
];

export function RecentActivity() {
  // Get the most recent project by date
  const latestProject = [...projects].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold tracking-tight">Recent Activity</h2>
        <p className="mt-1 text-sm text-zinc-500">Latest notes and project updates.</p>
      </motion.div>

      {/* Timeline feed */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-0">
        {/* Note entries */}
        {recentPosts.map((post) => (
          <motion.div key={`note-${post.slug}`} variants={itemVariant}>
            <Link href={`/notes/${post.slug}`} className="group flex items-start gap-4 py-3 border-b border-border/50 hover:border-zinc-700 transition-colors">
              <div className="mt-1 rounded-sm bg-accent-dim p-1.5 text-accent">
                <FileText className="size-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium group-hover:text-accent transition-colors truncate">{post.title}</h3>
                <p className="mt-0.5 font-mono text-xs text-zinc-600">{formatDate(post.date)} · Notes</p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-zinc-700 group-hover:text-accent transition-colors" />
            </Link>
          </motion.div>
        ))}

        {/* Latest project entry */}
        {latestProject && (
          <motion.div variants={itemVariant}>
            <Link href="/projects" className="group flex items-start gap-4 py-3 border-b border-border/50 hover:border-zinc-700 transition-colors">
              <div className="mt-1 rounded-sm bg-accent-dim p-1.5 text-accent">
                <FolderGit2 className="size-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium group-hover:text-accent transition-colors truncate">{latestProject.title}</h3>
                <p className="mt-0.5 font-mono text-xs text-zinc-600">{formatDate(latestProject.date)} · Project Update</p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-zinc-700 group-hover:text-accent transition-colors" />
            </Link>
          </motion.div>
        )}

        {/* Experience link */}
        <motion.div variants={itemVariant}>
          <Link href="/experience" className="group flex items-start gap-4 py-3 border-b border-border/50 hover:border-zinc-700 transition-colors">
            <div className="mt-1 rounded-sm bg-accent-dim p-1.5 text-accent">
              <FolderGit2 className="size-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium group-hover:text-accent transition-colors truncate">Experience & Toolkit</h3>
              <p className="mt-0.5 font-mono text-xs text-zinc-600">Career timeline · Zoox · Monarch Tractor</p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-zinc-700 group-hover:text-accent transition-colors" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
