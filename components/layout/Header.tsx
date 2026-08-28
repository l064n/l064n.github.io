'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CommandPalette, type PaletteProject } from '@/components/layout/CommandPalette';
import { navLinks } from '@/lib/data';
import { Keyboard, Globe } from 'lucide-react';

export function Header({ projects }: { projects?: PaletteProject[] }) {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbParts = [
    { label: '~', href: '/' },
    ...segments.map((seg, i) => ({
      label: seg.replace(/-/g, ' '),
      href: '/' + segments.slice(0, i + 1).join('/'),
    })),
  ];

  return (
    <>
      <CommandPalette projects={projects} />
      <header className="sticky top-0 z-50 border-b border-[#1a1a1a]/60 bg-[#09090b]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Breadcrumb Nav */}
          <nav className="flex items-center gap-1.5 text-xs font-mono">
            {breadcrumbParts.map((part, i) => (
              <span key={part.href} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-zinc-700">/</span>}
                {i === breadcrumbParts.length - 1 ? (
                  <span className="font-medium text-zinc-300">{part.label}</span>
                ) : (
                  <Link
                    href={part.href}
                    className="text-zinc-600 transition-colors hover:text-zinc-400"
                  >
                    {part.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <nav className="hidden sm:flex items-center gap-0.5 rounded-lg border border-[#1a1a1a] bg-[#111]/50 px-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? 'text-zinc-100 bg-[#1a1a1a]'
                        : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Command palette shortcut */}
            <kbd className="flex items-center gap-1 rounded-md border border-[#1a1a1a] bg-[#111]/50 px-2 py-1 text-[10px] font-mono text-zinc-600 transition-colors hover:text-zinc-400">
              <Keyboard className="h-3 w-3" />
              <span>⌘K</span>
            </kbd>
          </div>
        </div>
      </header>
    </>
  );
}
