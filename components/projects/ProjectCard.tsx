'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { TechPill } from '@/components/ui/TechPill';
import { TiltCard } from '@/components/ui/TiltCard';
import { formatDate } from '@/lib/utils';
import type { ProjectFrontmatter } from '@/content/projects/project-schema';

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export interface ProjectWithSlug extends ProjectFrontmatter {
  slug: string;
}

interface ProjectCardProps {
  project: ProjectWithSlug;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors: Record<string, string> = {
    Active: 'text-accent',
    Completed: 'text-zinc-400',
    Archived: 'text-zinc-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: easeOutExpo }}
      layout
    >
      <TiltCard maxTilt={5}>
        <Link href={`/projects/${project.slug}`} className="block h-full">
          <Card className="h-full transition-colors duration-200 group-hover:border-zinc-700">
            {/* Header */}
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-zinc-100 transition-colors group-hover:text-accent">
                {project.title}
              </h3>
              <span className={`shrink-0 font-mono text-xs ${statusColors[project.status] ?? 'text-zinc-500'}`}>
                {project.status}
              </span>
            </div>

            {/* Description */}
            <p className="mb-4 text-sm leading-relaxed text-zinc-400">
              {project.description}
            </p>

            {/* Metrics grid */}
            <dl className="space-y-2 border-t border-zinc-800/60 pt-3">
              <div className="flex gap-2 text-xs">
                <dt className="shrink-0 w-14 font-mono text-zinc-600">Role</dt>
                <dd className="text-zinc-300">{project.role}</dd>
              </div>
              <div className="flex gap-2 text-xs">
                <dt className="shrink-0 w-14 font-mono text-zinc-600">Stack</dt>
                <dd className="flex flex-wrap gap-1">
                  {project.stack.slice(0, 4).map((tech) => (
                    <TechPill key={tech} label={tech} />
                  ))}
                  {project.stack.length > 4 && (
                    <span className="font-mono text-zinc-600">+{project.stack.length - 4}</span>
                  )}
                </dd>
              </div>
              <div className="flex gap-2 text-xs">
                <dt className="shrink-0 w-14 font-mono text-zinc-600">Impact</dt>
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
        </Link>
      </TiltCard>
    </motion.div>
  );
}
