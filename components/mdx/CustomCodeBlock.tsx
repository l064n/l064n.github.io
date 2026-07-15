'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Copy, Terminal } from 'lucide-react';

interface CustomCodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CustomCodeBlock({ children, className }: CustomCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract language from className like "language-javascript"
  const langMatch = className?.match(/language-(\w+)/);
  const language = langMatch ? langMatch[1].toUpperCase() : 'CODE';

  const handleCopy = async () => {
    if (!children || typeof children !== 'string') return;
    await navigator.clipboard.writeText(children as string);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If this is a raw <pre> from MDX, wrap it with our toolbar
  if (children && typeof children === 'string') {
    return (
      <div className="my-6 overflow-hidden rounded-lg border border-border bg-[#111]">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <Terminal className="h-3.5 w-3.5" />
            {language}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-mono text-zinc-500 transition-colors hover:bg-surface-elevated hover:text-zinc-300"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </button>
        </div>

        {/* Code content */}
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
          <code className={cn('font-mono text-zinc-300', className)}>
            {children}
          </code>
        </pre>
      </div>
    );
  }

  // Fallback: render children as-is (for nested/pre-existing React elements)
  return <>{children}</>;
}
