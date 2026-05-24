'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Sparkles, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AnalysisResultCard } from './AnalysisResultCard';
import { MOCK_ANALYSIS } from '@/lib/mock-data';
import { useMaterials } from '@/hooks/useMaterials';
import type { Material, AnalysisResult } from '@/types';
import { cn } from '@/lib/utils';

export function AnalysisPanel() {
  const searchParams = useSearchParams();
  const { allMaterials, loading } = useMaterials();
  const [selected, setSelected] = useState<Material | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const selectedId = searchParams.get('material');

  const handleAnalyze = async (material: Material) => {
    setSelected(material);
    setAnalyzing(true);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId: material.id, imageUrl: material.image_url }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data.result);
      } else {
        setResult(MOCK_ANALYSIS);
      }
    } catch {
      setResult(MOCK_ANALYSIS);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    if (!selectedId || selected?.id === selectedId || !allMaterials.length) return;

    const material = allMaterials.find((item) => item.id === selectedId);
    if (material) void handleAnalyze(material);
  }, [allMaterials, selected?.id, selectedId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-12rem)]">
      <Card className="lg:col-span-2 p-4 overflow-y-auto scrollbar-thin">
        <h3 className="font-display text-sm text-ink mb-4">选择素材</h3>
        <div className="grid grid-cols-2 gap-3">
          {loading && <p className="text-sm text-ink-muted">素材加载中...</p>}
          {allMaterials.map((material) => (
            <button
              key={material.id}
              type="button"
              onClick={() => handleAnalyze(material)}
              className={cn(
                'relative rounded-xl overflow-hidden aspect-square group',
                (selected?.id === material.id || selectedId === material.id) && 'ring-2 ring-accent'
              )}
            >
              <Image src={material.image_url} alt={material.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card className="lg:col-span-3 p-6 overflow-y-auto scrollbar-thin">
        {!selected && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Sparkles className="h-10 w-10 text-ink-faint mb-4" />
            <p className="font-display text-lg text-ink">AI 灵感分析</p>
            <p className="text-sm text-ink-muted mt-1 max-w-sm">
              选择一张素材，分析色彩、字体、版式与风格气质。
            </p>
          </div>
        )}

        {selected && analyzing && (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 text-accent animate-spin mb-4" />
            <p className="text-sm text-ink-muted">正在分析「{selected.title}」...</p>
          </div>
        )}

        {selected && !analyzing && result && (
          <AnalysisResultCard material={selected} result={result} />
        )}
      </Card>
    </div>
  );
}
