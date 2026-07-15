import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import type { PostFrontmatter } from '@/content/notes/frontmatter-schema';
import { Callout } from '@/components/mdx/Callout';
import { CustomCodeBlock } from '@/components/mdx/CustomCodeBlock';

const notesDirectory = path.join(process.cwd(), 'content/notes');

/** Get all MDX file slugs (filenames without .mdx extension). */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(notesDirectory)) return [];
  const files = fs.readdirSync(notesDirectory);
  return files.filter((file) => file.endsWith('.mdx')).map((file) => file.replace(/\.mdx$/, ''));
}

/** Get frontmatter metadata for all posts. */
export function getAllPostsMetadata(): (PostFrontmatter & { slug: string; bodyOnly: string })[] {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => {
    const meta = getPostMetadata(slug);
    const fullPath = path.join(notesDirectory, `${slug}.mdx`);
    const source = fs.readFileSync(fullPath, 'utf8');
    const bodyOnly = source.replace(/^---\n[\s\S]*?\n---/, '').trim();
    return { ...meta, slug, bodyOnly };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Get frontmatter for a single post by slug using custom YAML parser. */
export function getPostMetadata(slug: string): PostFrontmatter {
  const fullPath = path.join(notesDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Extract YAML-like frontmatter between --- delimiters
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = fileContents.match(frontmatterRegex);

  if (!match) {
    throw new Error(`No frontmatter found in ${slug}.mdx`);
  }

  const frontmatterBlock = match[1];
  const metadata: Partial<Record<string, unknown>> = {};

  frontmatterBlock.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Handle array values like [tag1, tag2]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1);
      metadata[key] = value.split(',').map((s: string) => s.trim());
    } else {
      metadata[key] = value;
    }
  });

  return metadata as unknown as PostFrontmatter;
}

/** MDX components map — injects custom Callout and CodeBlock. */
const mdxComponents = {
  Callout,
  CustomCodeBlock,
};

/** Compile MDX content with custom component injection. */
export async function getPost(slug: string) {
  const fullPath = path.join(notesDirectory, `${slug}.mdx`);
  const source = fs.readFileSync(fullPath, 'utf8');

  // Extract body-only text for reading time calculation
  const bodyOnly = source.replace(/^---\n[\s\S]*?\n---/, '').trim();

  // Use custom parser for frontmatter
  const metadata = getPostMetadata(slug);

  // Compile MDX to React element with component injection
  const result = await compileMDX({
    source,
    components: mdxComponents,
  });

  return {
    content: result.content,
    frontmatter: metadata,
    bodyOnly,
  };
}
