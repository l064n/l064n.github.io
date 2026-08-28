'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { FilterBar } from '@/components/projects/FilterBar';
import { projects, type Project } from '@/lib/data';

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredProjects = useMemo(
    () =>
      activeCategory === 'All'
        ? projects
        : projects.filter((p) => p.categories.includes(activeCategory as Project['categories'][number])),
    [activeCategory]
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          <h1 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Projects</h1>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-500">
          Technical projects spanning autonomous vehicle infrastructure, hardware restoration,
          FDM fabrication tuning, and automotive telemetry. Each entry documents role, stack, and measurable impact.
        </p>
      </motion.div>

      {/* Filters */}
      <FilterBar active={activeCategory} onChange={setActiveCategory} />

      {/* Project grid */}
      <motion.div
        layout
        className="mt-6 grid gap-5 sm:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 flex flex-col items-center justify-center gap-3 py-16"
        >
          <div className="rounded-full bg-zinc-800/50 p-4">
            <svg className="size-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="font-mono text-sm text-zinc-600">No projects found in this category.</p>
        </motion.div>
      )}
    </section>
  );
}
