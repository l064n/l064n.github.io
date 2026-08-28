import React from 'react';

interface CardProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

export function Card({ children, href, className = '' }: CardProps) {
  const baseClasses =
    'rounded-xl border border-zinc-800/60 bg-[#111111] p-5 transition-all duration-200 hover:border-zinc-700/60 hover:bg-[#151515] hover:shadow-lg hover:shadow-black/20';

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} block ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
}
