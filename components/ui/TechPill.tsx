import { cn } from '@/lib/utils';

interface TechPillProps {
  label: string;
  variant?: 'default' | 'accent';
  className?: string;
}

export function TechPill({ label, variant = 'default', className }: TechPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono tracking-tight ring-1 ring-inset transition-colors duration-200',
        variant === 'default' &&
          'bg-surface-elevated text-zinc-400 ring-zinc-800 hover:text-zinc-300',
        variant === 'accent' &&
          'bg-accent-dim text-accent ring-accent/20 hover:bg-accent/15',
        className
      )}
    >
      {label}
    </span>
  );
}
