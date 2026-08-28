import { HeroSection } from '@/components/home/HeroSection';
import { StatusDashboard } from '@/components/home/StatusDashboard';
import { RecentActivity } from '@/components/home/RecentActivity';
import { getAllPostsMetadata } from '@/lib/mdx';

export default function HomePage() {
  const recentNotes = getAllPostsMetadata()
    .slice(0, 3)
    .map((p) => ({ slug: p.slug, title: p.title, date: p.date, tags: p.tags }));

  return (
    <>
      <HeroSection />
      <div className="border-t border-neutral-800" />
      <StatusDashboard />
      <div className="border-t border-neutral-800" />
      <RecentActivity posts={recentNotes} />
    </>
  );
}
