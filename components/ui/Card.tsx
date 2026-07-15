import React from 'react';

interface CardProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

export function Card({ children, href, className = '' }: CardProps) {
  const baseClasses =
    'rounded-md border border-neutral-800 bg-[var(--surface)] p-5 transition-colors hover:border-neutral-700';

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
