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
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-mono tracking-tight ring-1 ring-inset transition-all duration-200 hover:scale-105',
        variant === 'default' &&
          'bg-zinc-800/50 text-zinc-400 ring-zinc-700/50 hover:bg-zinc-700/50 hover:text-zinc-300 hover:ring-zinc-600/50',
        variant === 'accent' &&
          'bg-amber-500/10 text-amber-400 ring-amber-500/20 hover:bg-amber-500/15 hover:ring-amber-500/30',
        className
      )}
    >
      {label}
    </span>
  );
}
