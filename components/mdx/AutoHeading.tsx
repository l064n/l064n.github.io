import type { ReactNode } from 'react';
import { headingId } from '@/lib/toc';

function extractText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join(' ');
  if (typeof node === 'object' && 'props' in node) {
    return extractText((node as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

/**
 * MDX heading wrapper that adds a deterministic id attribute, so TOC links
 * and in-page anchors resolve. Used for h1–h4 via the MDX components map.
 */
export function AutoHeading({ level, children }: { level: 1 | 2 | 3 | 4; children: ReactNode }) {
  const id = headingId(extractText(children));
  if (level === 1) return <h1 id={id}>{children}</h1>;
  if (level === 2) return <h2 id={id}>{children}</h2>;
  if (level === 3) return <h3 id={id}>{children}</h3>;
  return <h4 id={id}>{children}</h4>;
}
