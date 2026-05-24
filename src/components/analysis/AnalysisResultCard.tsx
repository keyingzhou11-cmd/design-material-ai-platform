import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import type { Material, AnalysisResult } from '@/types';

interface AnalysisResultCardProps {
  material: Material;
  result: AnalysisResult;
}

export function AnalysisResultCard({ material, result }: AnalysisResultCardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0">
          <Image src={material.image_url} alt={material.title} fill className="object-cover" />
        </div>
        <div>
          <h3 className="font-display text-xl text-ink">{material.title}</h3>
          <Badge variant="accent" className="mt-1">{result.mood}</Badge>
        </div>
      </div>

      <section>
        <h4 className="text-xs font-medium text-ink-faint uppercase tracking-wider mb-2">设计解读</h4>
        <p className="text-sm text-ink-muted leading-relaxed">{result.summary}</p>
      </section>

      <section>
        <h4 className="text-xs font-medium text-ink-faint uppercase tracking-wider mb-3">色彩方案</h4>
        <div className="flex gap-2 flex-wrap">
          {result.colorPalette.map((color) => (
            <div key={color} className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-lg border border-beige-200 shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-ink-muted font-mono">{color}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h4 className="text-xs font-medium text-ink-faint uppercase tracking-wider mb-2">字体观察</h4>
        <ul className="space-y-1">
          {result.typography.map((note) => (
            <li key={note} className="text-sm text-ink-muted flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {note}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="text-xs font-medium text-ink-faint uppercase tracking-wider mb-2">版式要点</h4>
        <ul className="space-y-1">
          {result.layoutNotes.map((note) => (
            <li key={note} className="text-sm text-ink-muted flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {note}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="text-xs font-medium text-ink-faint uppercase tracking-wider mb-2">推荐标签</h4>
        <div className="flex flex-wrap gap-2">
          {result.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      </section>
    </div>
  );
}
