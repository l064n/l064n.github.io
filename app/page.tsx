import { HeroSection } from '@/components/home/HeroSection';
import { StatusDashboard } from '@/components/home/StatusDashboard';
import { RecentActivity } from '@/components/home/RecentActivity';
import { getAllPostsMetadata } from '@/lib/mdx';
import { getAllProjectsMetadata } from '@/lib/projects';

export default function HomePage() {
  const allNotes = getAllPostsMetadata().map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    tags: p.tags,
  }));

  const allProjects = getAllProjectsMetadata();

  return (
    <>
      <HeroSection />
      <div className="border-t border-neutral-800" />
      <StatusDashboard />
      <div className="border-t border-neutral-800" />
      <RecentActivity posts={allNotes} projects={allProjects} />
    </>
  );
}
