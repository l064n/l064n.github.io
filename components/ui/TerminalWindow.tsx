import React from 'react';

interface TerminalWindowProps {
  children: React.ReactNode;
  title?: string;
}

export function TerminalWindow({ children, title = 'terminal' }: TerminalWindowProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-800 bg-[#1a1a1a]">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-2.5">
        <span className="size-2 rounded-full bg-red-500/70" />
        <span className="size-2 rounded-full bg-yellow-500/70" />
        <span className="size-2 rounded-full bg-green-500/70" />
        <span className="ml-2 font-mono text-xs text-neutral-600">{title}</span>
      </div>
      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
