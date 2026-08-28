export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

/** Deterministic id for a heading text (must match AutoHeading's slugging). */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

/**
 * Extract ##/###/#### headings from a markdown body, skipping fenced code
 * blocks. Returns entries with ids that match what AutoHeading renders.
 */
export function extractTocEntries(body: string): TocEntry[] {
  const entries: TocEntry[] = [];
  let inFence = false;

  for (const line of body.split('\n')) {
    if (line.trimStart().startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (!match) continue;

    const text = match[2].replace(/[*_`[\]#]/g, '').trim();
    if (!text) continue;
    entries.push({ id: headingId(text), text, level: match[1].length });
  }

  return entries;
}
