import React from 'react';

interface MDXRendererProps {
  children: React.ReactNode;
}

/** Wraps compiled MDX content with prose styling. */
export function MDXRenderer({ children }: MDXRendererProps) {
  return (
    <article className="prose-custom prose-invert max-w-none">
      {children}
    </article>
  );
}
