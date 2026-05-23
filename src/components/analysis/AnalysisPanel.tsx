'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AnalysisResultCard } from './AnalysisResultCard';
import { MOCK_MATERIALS, MOCK_ANALYSIS } from '@/lib/mock-data';
import type { Material, AnalysisResult } from '@/types';
import { cn } from '@/lib/utils';

export function AnalysisPanel() {
  const [selected, setSelected] = useState<Material | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-12rem)]">
      <Card className="lg:col-span-2 p-4 overflow-y-auto scrollbar-thin">
        <h3 className="font-display text-sm text-ink mb-4">Select a material</h3>
        <div className="grid grid-cols-2 gap-3">
          {MOCK_MATERIALS.map((material) => (
            <button
              key={material.id}
              type="button"
              onClick={() => handleAnalyze(material)}
              className={cn(
                'relative rounded-xl overflow-hidden aspect-square group',
                selected?.id === material.id && 'ring-2 ring-accent'
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
            <p className="font-display text-lg text-ink">AI Design Analysis</p>
            <p className="text-sm text-ink-muted mt-1 max-w-sm">
              Select a material to analyze colors, typography, layout, and mood with AI.
            </p>
          </div>
        )}

        {selected && analyzing && (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 text-accent animate-spin mb-4" />
            <p className="text-sm text-ink-muted">Analyzing {selected.title}...</p>
          </div>
        )}

        {selected && !analyzing && result && (
          <AnalysisResultCard material={selected} result={result} />
        )}
      </Card>
    </div>
  );
}
