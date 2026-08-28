import { cn } from '@/lib/utils';

const colorMap = {
  online: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
  warning: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
  offline: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
} as const;

interface StatusDotProps {
  variant?: 'online' | 'warning' | 'offline';
  pulse?: boolean;
  className?: string;
}

export function StatusDot({ variant = 'online', pulse = true, className }: StatusDotProps) {
  return (
    <span className={cn('relative inline-flex', className)}>
      <span
        className={cn(
          'inline-flex h-2 w-2 rounded-full',
          colorMap[variant]
        )}
      />
      {pulse && (
        <span
          className={cn(
            'absolute inset-0 -z-10 animate-ping rounded-full opacity-75',
            colorMap[variant].split(' ')[0]
          )}
        />
      )}
    </span>
  );
}
