'use client';

import Image from 'next/image';
import { Heart, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { Material } from '@/types';

interface MaterialCardProps {
  material: Material;
  onFavorite?: (id: string) => void;
  onClick?: (material: Material) => void;
  onAddToCanvas?: (material: Material) => void;
  showAddButton?: boolean;
}

export function MaterialCard({
  material,
  onFavorite,
  onClick,
  onAddToCanvas,
  showAddButton,
}: MaterialCardProps) {
  return (
    <article
      className="group relative rounded-2xl overflow-hidden bg-white border border-beige-200/60 shadow-card transition-all duration-300 hover:shadow-soft hover:border-beige-300 cursor-pointer"
      onClick={() => onClick?.(material)}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(material)}
      role="button"
      tabIndex={0}
    >
      <div className="relative overflow-hidden">
        <Image
          src={material.image_url}
          alt={material.title}
          width={material.width || 400}
          height={material.height || 500}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFavorite(material.id);
              }}
              className={cn(
                'rounded-full p-2 backdrop-blur-md transition-colors',
                material.is_favorite
                  ? 'bg-accent text-white'
                  : 'bg-white/80 text-ink hover:bg-white'
              )}
            >
              <Heart className={cn('h-4 w-4', material.is_favorite && 'fill-current')} />
            </button>
          )}
          {showAddButton && onAddToCanvas && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCanvas(material);
              }}
              className="rounded-full p-2 bg-accent text-white backdrop-blur-md hover:bg-accent-hover transition-colors"
              title="添加到画板"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-sm text-ink truncate">{material.title}</h3>
        {material.category && (
          <Badge variant="outline" className="mt-2">
            {material.category.name}
          </Badge>
        )}
      </div>
    </article>
  );
}
