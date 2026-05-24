'use client';

import { MaterialCard } from './MaterialCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Material } from '@/types';

interface MaterialGridProps {
  materials: Material[];
  onFavorite?: (id: string) => void;
  onClick?: (material: Material) => void;
  onAddToCanvas?: (material: Material) => void;
  showAddButton?: boolean;
  loading?: boolean;
}

export function MaterialGrid({
  materials,
  onFavorite,
  onClick,
  onAddToCanvas,
  showAddButton,
  loading,
}: MaterialGridProps) {
  if (loading) {
    return (
      <div className="masonry-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="masonry-item animate-pulse">
            <div className="rounded-2xl bg-beige-200 h-64" />
          </div>
        ))}
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <EmptyState
        title="暂无匹配素材"
        description="可以调整筛选条件，或上传新的设计参考。"
      />
    );
  }

  return (
    <div className="masonry-grid">
      {materials.map((material) => (
        <div key={material.id} className="masonry-item">
          <MaterialCard
            material={material}
            onFavorite={onFavorite}
            onClick={onClick}
            onAddToCanvas={onAddToCanvas}
            showAddButton={showAddButton}
          />
        </div>
      ))}
    </div>
  );
}
