import { PageHeader } from '@/components/layout/PageHeader';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { DailyRecommendations } from '@/components/dashboard/DailyRecommendations';
import { RecentMaterials } from '@/components/dashboard/RecentMaterials';

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your design inspiration at a glance"
      />
      <StatsOverview />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DailyRecommendations />
        </div>
        <div>
          <RecentMaterials />
        </div>
      </div>
    </>
  );
}
