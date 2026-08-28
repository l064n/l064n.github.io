import { siteConfig } from '@/lib/data';
import { getAllPostsMetadata } from '@/lib/mdx';

export const dynamic = 'force-static';

export function GET() {
  const lastModified = new Date().toISOString();
  const posts = getAllPostsMetadata();
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

  const entries: { url: string; changeFrequency: string; priority: number }[] = [
    { url: siteConfig.url, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteConfig.url}/projects`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteConfig.url}/notes`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteConfig.url}/experience`, changeFrequency: 'yearly', priority: 0.7 },
    ...posts.map((p) => ({
      url: `${siteConfig.url}/notes/${p.slug}`,
      changeFrequency: 'yearly',
      priority: 0.8,
    })),
    ...tags.map((tag) => ({
      url: `${siteConfig.url}/notes/tag/${encodeURIComponent(tag)}`,
      changeFrequency: 'yearly',
      priority: 0.6,
    })),
  ];

  const urlset = entries
    .map(
      (e) => `  <url>
    <loc>${e.url}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${e.changeFrequency}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
