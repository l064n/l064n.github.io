'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { FilterBar } from '@/components/projects/FilterBar';
import { projects, type Project } from '@/lib/data';

export function ProjectsGrid() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredProjects = useMemo(
    () =>
      activeCategory === 'All'
        ? projects
        : projects.filter((p) => p.categories.includes(activeCategory as Project['categories'][number])),
    [activeCategory]
  );

  return (
    <>
      {/* Filters */}
      <FilterBar active={activeCategory} onChange={setActiveCategory} />

      {/* Project grid */}
      <motion.div layout className="mt-6 grid gap-5 sm:grid-cols-2">
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <p className="font-mono text-sm text-zinc-600">No projects found in this category.</p>
        </motion.div>
      )}
    </>
  );
}
