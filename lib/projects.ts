import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import type { ProjectFrontmatter } from '@/content/projects/project-schema';
import { parseFrontmatter } from '@/lib/mdx';
import { mdxComponents } from '@/lib/mdx-components';

const projectsDirectory = path.join(process.cwd(), 'content/projects');

/** Get all project MDX slugs (filenames without .mdx extension). */
export function getAllProjectSlugs(): string[] {
  if (!fs.existsSync(projectsDirectory)) return [];
  const files = fs.readdirSync(projectsDirectory);
  return files.filter((file) => file.endsWith('.mdx')).map((file) => file.replace(/\.mdx$/, ''));
}

/** Get frontmatter metadata for all projects, newest first. */
export function getAllProjectsMetadata(): (ProjectFrontmatter & { slug: string })[] {
  return getAllProjectSlugs()
    .map((slug) => ({ ...getProjectMetadata(slug), slug }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Get frontmatter for a single project by slug. */
export function getProjectMetadata(slug: string): ProjectFrontmatter {
  const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const metadata = parseFrontmatter(fileContents);
  if (!metadata) {
    throw new Error(`No frontmatter found in ${slug}.mdx`);
  }
  return metadata as unknown as ProjectFrontmatter;
}

/** Compile a project's MDX content with custom component injection. */
export async function getProject(slug: string) {
  const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
  const source = fs.readFileSync(fullPath, 'utf8');
  const metadata = getProjectMetadata(slug);
  const result = await compileMDX({ source, components: mdxComponents });
  return { content: result.content, frontmatter: metadata };
}
