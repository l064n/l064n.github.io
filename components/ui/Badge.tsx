import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-neutral-800 text-neutral-400 border-neutral-700',
    accent: 'bg-accent-dim text-accent border-accent/20',
    outline: 'bg-transparent text-neutral-500 border-neutral-700',
  };

  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-mono font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
