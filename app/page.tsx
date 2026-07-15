import { HeroSection } from '@/components/home/HeroSection';
import { StatusDashboard } from '@/components/home/StatusDashboard';
import { RecentActivity } from '@/components/home/RecentActivity';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="border-t border-neutral-800" />
      <StatusDashboard />
      <div className="border-t border-neutral-800" />
      <RecentActivity />
    </>
  );
}
