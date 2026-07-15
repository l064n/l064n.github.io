import { experienceTimeline, physicalToolkit } from '@/lib/data';
import { Briefcase, Wrench, Gauge, Cpu, Bike } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Soldering: <Wrench className="h-4 w-4 text-zinc-500" />,
  Measurement: <Gauge className="h-4 w-4 text-zinc-500" />,
  Diagnostics: <Cpu className="h-4 w-4 text-zinc-500" />,
  'Signal Analysis': <Cpu className="h-4 w-4 text-zinc-500" />,
  Mechanical: <Wrench className="h-4 w-4 text-zinc-500" />,
  Recreation: <Bike className="h-4 w-4 text-zinc-500" />,
};

export default function ExperiencePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Experience</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-500">
          Career timeline from embedded systems at Monarch Tractor to autonomous vehicle infrastructure at Zoox.
          Plus the physical toolkit I use daily.
        </p>
      </div>

      {/* Timeline */}
      <div className="mb-16">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-8">
          Career Timeline
        </h2>

        <div className="relative space-y-8 before:absolute before:left-[19px] before:top-4 before:h-full before:w-px before:bg-border">
          {experienceTimeline.map((entry, i) => (
            <div key={entry.company} className="relative flex gap-6 pl-0 sm:pl-0">
              {/* Timeline dot */}
              <div className="absolute left-[12px] top-1.5 z-10 h-3.5 w-3.5 rounded-full border-2 border-accent bg-background ring-4 ring-background" />

              {/* Content card */}
              <div className="flex-1 pl-12">
                <div className="rounded-lg border border-border bg-surface p-5 transition-colors hover:border-zinc-700">
                  <div className="mb-3 flex items-center gap-2 text-sm font-mono text-zinc-600">
                    <Briefcase className="h-3.5 w-3.5" />
                    {entry.period}
                  </div>

                  <h3 className="text-base font-semibold">{entry.title}</h3>
                  <p className="mt-0.5 text-sm text-accent">@ {entry.company}</p>

                  <ul className="mt-4 space-y-2">
                    {entry.milestones.map((milestone) => (
                      <li key={milestone} className="flex items-start gap-2 text-sm leading-relaxed text-zinc-400">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Physical Toolkit */}
      <div>
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-8">
          Physical Toolkit
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {physicalToolkit.map((tool) => (
            <div
              key={tool.name}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-zinc-700"
            >
              <span className="rounded-md bg-surface-elevated p-2 ring-1 ring-inset ring-border">
                {iconMap[tool.category] || <Wrench className="h-4 w-4 text-zinc-500" />}
              </span>
              <div>
                <p className="text-sm font-medium">{tool.name}</p>
                <p className="mt-0.5 font-mono text-xs text-zinc-600">{tool.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
