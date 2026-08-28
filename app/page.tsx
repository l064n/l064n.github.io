import { HeroSection } from '@/components/home/HeroSection';
import { StatusDashboard } from '@/components/home/StatusDashboard';
import { RecentActivity } from '@/components/home/RecentActivity';
import { getAllPostsMetadata } from '@/lib/mdx';
import { getAllProjectsMetadata } from '@/lib/projects';

export default function HomePage() {
  const recentNotes = getAllPostsMetadata()
    .slice(0, 3)
    .map((p) => ({ slug: p.slug, title: p.title, date: p.date, tags: p.tags }));

  const allProjects = getAllProjectsMetadata();
  const latestProject =
    allProjects.length > 0
      ? allProjects.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      : null;

  return (
    <>
      <HeroSection />
      <div className="border-t border-neutral-800" />
      <StatusDashboard />
      <div className="border-t border-neutral-800" />
      <RecentActivity posts={recentNotes} latestProject={latestProject} />
    </>
  );
}
