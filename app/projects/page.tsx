'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { FilterBar } from '@/components/projects/FilterBar';
import { projects, type Project } from '@/lib/data';

const categories = ['All', 'Infrastructure', 'Restoration', 'Automotive', 'Fabrication'] as const;

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredProjects: Project[] = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.categories.includes(activeCategory as Project['categories'][number]));

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Projects</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-500">
          Technical projects spanning autonomous vehicle infrastructure, hardware restoration,
          FDM fabrication tuning, and automotive telemetry. Each entry documents role, stack, and measurable impact.
        </p>
      </motion.div>

      {/* Filters */}
      <FilterBar active={activeCategory} onChange={setActiveCategory} />

      {/* Project grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 font-mono text-sm text-zinc-600"
        >
          No projects found in this category.
        </motion.p>
      )}
    </section>
  );
}
