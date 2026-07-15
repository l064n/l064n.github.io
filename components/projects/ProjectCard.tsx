'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import type { Project } from '@/lib/data';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    Active: 'text-green-500',
    Completed: 'text-zinc-400',
    Archived: 'text-zinc-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <Card>
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold">{project.title}</h3>
          <span className={`shrink-0 font-mono text-xs ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-zinc-400">
          {project.description}
        </p>

        {/* Metrics grid */}
        <dl className="space-y-2 border-t border-neutral-800 pt-3">
          <div className="flex gap-2 text-xs">
            <dt className="shrink-0 font-mono text-zinc-500 w-16">Role</dt>
            <dd className="text-zinc-300">{project.role}</dd>
          </div>
          <div className="flex gap-2 text-xs">
            <dt className="shrink-0 font-mono text-zinc-500 w-16">Stack</dt>
            <dd className="font-mono text-zinc-300">{project.stack.join(' \u00b7 ')}</dd>
          </div>
          <div className="flex gap-2 text-xs">
            <dt className="shrink-0 font-mono text-zinc-500 w-16">Impact</dt>
            <dd className="text-accent">{project.impact}</dd>
          </div>
        </dl>

        {/* Footer: categories + date */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {project.categories.map((cat) => (
              <Badge key={cat} variant="outline">{cat}</Badge>
            ))}
          </div>
          <time className="shrink-0 font-mono text-xs text-zinc-600">
            {formatDate(project.date)}
          </time>
        </div>
      </Card>
    </motion.div>
  );
}
