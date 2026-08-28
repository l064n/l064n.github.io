import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-zinc-800/80 text-zinc-400 border-zinc-700/50',
    accent: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    outline: 'bg-transparent text-zinc-600 border-zinc-800',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-mono font-medium tracking-tight transition-colors ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
