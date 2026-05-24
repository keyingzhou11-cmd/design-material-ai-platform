'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_MATERIALS } from '@/lib/mock-data';

const dailyPicks = MOCK_MATERIALS.slice(0, 4);
const reason =
  '围绕温暖的编辑感、清晰的字体层级与克制版式，为你整理了今天值得参考的灵感方向。';

export function DailyRecommendations() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="font-display text-xl text-ink">今日精选</h2>
          <Badge variant="accent">AI 精选</Badge>
        </div>
        <Link href="/library" className="text-sm text-accent hover:underline flex items-center gap-1">
          查看全部 <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <p className="text-sm text-ink-muted mb-6 leading-relaxed">{reason}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dailyPicks.map((material) => (
          <Link key={material.id} href="/library" className="group">
            <div className="relative rounded-xl overflow-hidden aspect-[3/4] bg-beige-200">
              <Image
                src={material.image_url}
                alt={material.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-3">
                <p className="text-xs text-white font-medium truncate">{material.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
