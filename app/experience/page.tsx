import { experienceTimeline, physicalToolkit } from '@/lib/data';
import { Briefcase, Wrench, Gauge, Cpu, Bike } from 'lucide-react';

export const metadata = {
  title: 'Experience',
  description:
    'Career timeline from embedded systems at Monarch Tractor to autonomous vehicle infrastructure at Zoox, plus the physical toolkit used daily.',
  alternates: {
    canonical: '/experience',
  },
};

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
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      {/* Page header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          <h1 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Experience</h1>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-500">
          Career timeline from embedded systems at Monarch Tractor to autonomous vehicle infrastructure at Zoox.
          Plus the physical toolkit I use daily.
        </p>
      </div>

      {/* Timeline */}
      <div className="mb-16">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-8">
          Career Timeline
        </h2>

        <div className="relative space-y-0 before:absolute before:left-[23px] before:top-6 before:bottom-6 before:w-px before:bg-gradient-to-b before:from-zinc-800 before:via-zinc-800 before:to-transparent">
          {experienceTimeline.map((entry, i) => (
            <div key={entry.company} className="relative flex gap-8">
              {/* Timeline dot */}
              <div className="absolute left-[16px] top-5 z-10">
                <div className="h-4 w-4 rounded-full border-2 border-amber-500/60 bg-background" />
                {i === 0 && (
                  <div className="absolute inset-0 -z-10 animate-ping rounded-full bg-amber-500/20" />
                )}
              </div>

              {/* Content card */}
              <div className="flex-1 pl-16 pt-1">
                <div className="group rounded-xl border border-zinc-800/50 bg-[#111] p-6 transition-all duration-300 hover:border-zinc-700/60 hover:shadow-xl hover:shadow-black/20">
                  <div className="mb-4 flex items-center gap-3 text-xs font-mono text-zinc-600">
                    <Briefcase className="h-3.5 w-3.5 text-zinc-700" />
                    <span>{entry.period}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-zinc-100">{entry.title}</h3>
                  <p className="mt-0.5 text-sm font-medium text-amber-500/90">@ {entry.company}</p>

                  <ul className="mt-5 space-y-3">
                    {entry.milestones.map((milestone, mi) => (
                      <li key={mi} className="flex items-start gap-3 text-sm leading-relaxed text-zinc-400">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/60" />
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
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-8">
          Physical Toolkit
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {physicalToolkit.map((tool) => (
            <div
              key={tool.name}
              className="group flex items-center gap-3 rounded-xl border border-zinc-800/50 bg-[#111] p-4 transition-all duration-200 hover:border-zinc-700/60 hover:bg-[#151515]"
            >
              <span className="rounded-lg bg-zinc-800/50 p-2.5 ring-1 ring-inset ring-zinc-700/30 group-hover:ring-zinc-600/50 transition-all">
                {iconMap[tool.category] || <Wrench className="h-4 w-4 text-zinc-500" />}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-300 truncate">{tool.name}</p>
                <p className="mt-0.5 font-mono text-[11px] text-zinc-600">{tool.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
