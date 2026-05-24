'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { MOCK_MATERIALS } from '@/lib/mock-data';

const recent = MOCK_MATERIALS.slice(0, 5);

export function RecentMaterials() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-5">
        <Clock className="h-4 w-4 text-ink-faint" />
        <h2 className="font-display text-lg text-ink">最近上传</h2>
      </div>

      <div className="space-y-3">
        {recent.map((material) => (
          <Link
            key={material.id}
            href="/library"
            className="flex items-center gap-3 rounded-xl p-2 -mx-2 hover:bg-beige-50 transition-colors"
          >
            <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-beige-200">
              <Image src={material.image_url} alt={material.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{material.title}</p>
              <p className="text-xs text-ink-faint">{formatDate(material.created_at)}</p>
            </div>
            {material.category && (
              <Badge variant="outline" className="hidden sm:inline-flex">
                {material.category.name}
              </Badge>
            )}
          </Link>
        ))}
      </div>
    </Card>
  );
}
