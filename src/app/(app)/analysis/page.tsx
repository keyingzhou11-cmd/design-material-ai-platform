import { PageHeader } from '@/components/layout/PageHeader';
import { AnalysisPanel } from '@/components/analysis/AnalysisPanel';

export default function AnalysisPage() {
  return (
    <>
      <PageHeader
        title="AI 灵感分析"
        description="从色彩、字体、版式与风格气质中提炼设计判断"
      />
      <AnalysisPanel />
    </>
  );
}
