import { cn } from '@/lib/utils';

interface TechPillProps {
  label: string;
  variant?: 'default' | 'accent';
  href?: string;
  className?: string;
}

export function TechPill({ label, variant = 'default', href, className }: TechPillProps) {
  const classes = cn(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-mono tracking-tight ring-1 ring-inset transition-all duration-200',
    variant === 'default' &&
      'bg-zinc-800/50 text-zinc-400 ring-zinc-700/50 hover:bg-zinc-700/50 hover:text-zinc-300 hover:ring-zinc-600/50',
    variant === 'accent' &&
      'bg-accent/10 text-accent ring-accent/20 hover:bg-accent/15 hover:ring-accent/30',
    href && 'cursor-pointer hover:scale-105',
    className
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {label}
      </a>
    );
  }

  return <span className={classes}>{label}</span>;
}
