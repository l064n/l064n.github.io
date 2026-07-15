import { cn } from '@/lib/utils';
import { AlertTriangle, Info } from 'lucide-react';

interface CalloutProps {
  type?: 'warning' | 'info';
  children: React.ReactNode;
}

export function Callout({ type = 'info', children }: CalloutProps) {
  const variants = {
    warning: {
      container: 'border-amber-500/30 bg-amber-500/5',
      icon: <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />,
      label: 'WARNING',
      labelColor: 'text-amber-500',
    },
    info: {
      container: 'border-sky-500/30 bg-sky-500/5',
      icon: <Info className="h-4 w-4 text-sky-500 shrink-0" />,
      label: 'NOTE',
      labelColor: 'text-sky-500',
    },
  };

  const variant = variants[type];

  return (
    <div
      className={cn(
        'my-6 flex gap-3 rounded-lg border p-4 text-sm leading-relaxed',
        variant.container
      )}
      role="note"
    >
      {variant.icon}
      <div>
        <p className={cn('font-mono text-xs font-semibold mb-1.5', variant.labelColor)}>
          {variant.label}
        </p>
        <div>{children}</div>
      </div>
    </div>
  );
}
