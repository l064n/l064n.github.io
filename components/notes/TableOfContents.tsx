'use client';

import { useEffect, useState } from 'react';

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

/**
 * Sticky table of contents. Tracks the active heading via IntersectionObserver
 * and smooth-scrolls on click.
 */
export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (entries.length === 0) return;

    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    );

    for (const entry of entries) {
      const el = document.getElementById(entry.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [entries]);

  if (entries.length < 2) return null;

  const onClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="sticky top-20" aria-label="Table of contents">
      <div className="rounded-xl border border-zinc-800/50 bg-[#111] p-5">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-3">
          On this page
        </h2>
        <ul className="space-y-1.5 border-l border-zinc-800/60">
          {entries.map((entry) => (
            <li key={entry.id} className="relative">
              {activeId === entry.id && (
                <span className="absolute -left-[1.5px] top-1 bottom-1 w-[2px] rounded-full bg-accent" />
              )}
              <a
                href={`#${entry.id}`}
                onClick={onClick(entry.id)}
                className={`block py-0.5 pr-2 text-xs leading-snug transition-colors ${
                  entry.level >= 3 ? 'pl-6' : 'pl-3'
                } ${
                  activeId === entry.id
                    ? 'text-accent'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {entry.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
