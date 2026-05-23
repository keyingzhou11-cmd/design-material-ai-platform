import { PageHeader } from '@/components/layout/PageHeader';
import { AnalysisPanel } from '@/components/analysis/AnalysisPanel';

export default function AnalysisPage() {
  return (
    <>
      <PageHeader
        title="AI Analysis"
        description="Deep design insights powered by AI vision"
      />
      <AnalysisPanel />
    </>
  );
}
