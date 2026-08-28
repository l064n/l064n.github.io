import { siteConfig } from '@/lib/data';
import { getAllPostsMetadata } from '@/lib/mdx';

// Built via concatenation so the entity text is preserved in source.
const AMP = '&' + 'amp;';
const LT = '&' + 'lt;';
const GT = '&' + 'gt;';
const QUOT = '&' + 'quot;';
const APOS = '&' + 'apos;';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, AMP)
    .replace(/</g, LT)
    .replace(/>/g, GT)
    .replace(/"/g, QUOT)
    .replace(/'/g, APOS);
}

export const dynamic = 'force-static';

export function GET() {
  const posts = getAllPostsMetadata();

  const items = posts
    .map((post) => {
      const link = `${siteConfig.url}/notes/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.summary ?? '')}</description>
      <category>${escapeXml(post.tags.join(', '))}</category>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name} — Technical Notes</title>
    <link>${siteConfig.url}/notes</link>
    <atom:link href="${siteConfig.url}/notes/feed.xml" rel="self" type="application/rss+xml" />
    <description>Engineering write-ups, teardowns, and infrastructure documentation.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
