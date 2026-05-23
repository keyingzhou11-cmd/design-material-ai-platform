'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import type { Material } from '@/types';

interface MaterialDetailSheetProps {
  material: Material | null;
  onClose: () => void;
  onAnalyze?: (material: Material) => void;
}

export function MaterialDetailSheet({ material, onClose, onAnalyze }: MaterialDetailSheetProps) {
  if (!material) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm" onClick={onClose} role="presentation" />
      <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white border-l border-beige-200 shadow-soft overflow-y-auto scrollbar-thin">
        <div className="sticky top-0 flex items-center justify-between bg-white/90 backdrop-blur-md px-6 py-4 border-b border-beige-200">
          <h2 className="font-display text-lg text-ink">{material.title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-beige-100">
            <X className="h-5 w-5 text-ink-faint" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <Image
            src={material.image_url}
            alt={material.title}
            width={400}
            height={500}
            className="w-full rounded-2xl object-cover"
          />

          {material.description && (
            <p className="text-sm text-ink-muted leading-relaxed">{material.description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {material.category && <Badge variant="accent">{material.category.name}</Badge>}
            {material.tags?.map((tag) => (
              <Badge key={tag.id} variant="outline">{tag.name}</Badge>
            ))}
          </div>

          <p className="text-xs text-ink-faint">Added {formatDate(material.created_at)}</p>

          {onAnalyze && (
            <Button className="w-full" onClick={() => onAnalyze(material)}>
              Analyze with AI
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
