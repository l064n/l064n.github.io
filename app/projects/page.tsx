import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import { getAllProjectsMetadata } from '@/lib/projects';

export const metadata = {
  title: 'Projects',
  description:
    'Technical projects spanning autonomous vehicle infrastructure, hardware restoration, FDM fabrication tuning, and automotive telemetry.',
  alternates: {
    canonical: '/projects',
  },
};

export default function ProjectsPage() {
  const projects = getAllProjectsMetadata();

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          <h1 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Projects</h1>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-500">
          Technical projects spanning autonomous vehicle infrastructure, hardware restoration,
          FDM fabrication tuning, and automotive telemetry. Each entry documents role, stack, and measurable impact.
        </p>
      </div>

      <ProjectsGrid projects={projects} />
    </section>
  );
}
