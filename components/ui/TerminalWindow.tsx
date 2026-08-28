import React from 'react';

interface TerminalWindowProps {
  children: React.ReactNode;
  title?: string;
}

export function TerminalWindow({ children, title = 'terminal' }: TerminalWindowProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] shadow-2xl shadow-black/40">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-[#1a1a1a] px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]/80 hover:bg-[#ff5f57] transition-colors" />
        <span className="size-2.5 rounded-full bg-[#febc2e]/80 hover:bg-[#febc2e] transition-colors" />
        <span className="size-2.5 rounded-full bg-[#28c840]/80 hover:bg-[#28c840] transition-colors" />
        <span className="ml-3 font-mono text-xs text-zinc-600">{title}</span>
      </div>
      {/* Content */}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}
