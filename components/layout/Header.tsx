'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { navLinks, siteConfig } from '@/lib/data';
import { Keyboard } from 'lucide-react';

export function Header() {
  const pathname = usePathname();

  // Build breadcrumb segments from current path
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
      <CommandPalette />
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Breadcrumb Nav */}
          <nav className="flex items-center gap-1.5 text-sm font-mono text-zinc-500">
            {breadcrumbParts.map((part, i) => (
              <span key={part.href} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-zinc-700">/</span>}
                {i === breadcrumbParts.length - 1 ? (
                  <span className="text-accent">{part.label}</span>
                ) : (
                  <Link
                    href={part.href}
                    className="transition-colors hover:text-zinc-300"
                  >
                    {part.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          {/* Right side: page links + palette trigger */}
          <div className="flex items-center gap-3">
            <nav className="hidden sm:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-sm px-2.5 py-1 text-xs font-medium transition-colors ${
                      isActive ? 'text-accent' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <div className="absolute inset-x-1 bottom-0 h-px bg-accent transition-opacity" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Command palette shortcut hint */}
            <kbd className="hidden items-center gap-1 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 sm:flex">
              <Keyboard className="h-3 w-3" />
              <span>⌘K</span>
            </kbd>
          </div>
        </div>
      </header>
    </>
  );
}
