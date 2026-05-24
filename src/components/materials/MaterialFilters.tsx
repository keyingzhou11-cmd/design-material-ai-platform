'use client';

import { Heart, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import type { MaterialFilters } from '@/types';

interface MaterialFiltersBarProps {
  filters: MaterialFilters;
  onChange: (filters: MaterialFilters) => void;
}

export function MaterialFiltersBar({ filters, onChange }: MaterialFiltersBarProps) {
  return (
    <div className="sticky top-0 z-10 -mx-8 px-8 py-4 mb-6 bg-beige-100/80 backdrop-blur-md border-b border-beige-200/60">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <SearchInput
          value={filters.search}
          onChange={(search) => onChange({ ...filters, search })}
          placeholder="搜索素材..."
          className="w-full lg:w-80"
        />

        <div className="flex flex-wrap gap-2 flex-1">
          <button
            type="button"
            onClick={() => onChange({ ...filters, categoryId: null })}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              !filters.categoryId
                ? 'bg-ink text-white'
                : 'bg-white text-ink-muted border border-beige-200 hover:border-beige-300'
            )}
          >
            全部
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  categoryId: filters.categoryId === cat.id ? null : cat.id,
                })
              }
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                filters.categoryId === cat.id
                  ? 'bg-accent text-white'
                  : 'bg-white text-ink-muted border border-beige-200 hover:border-beige-300'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={filters.favoritesOnly ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onChange({ ...filters, favoritesOnly: !filters.favoritesOnly })}
          >
            <Heart className={cn('h-3.5 w-3.5', filters.favoritesOnly && 'fill-current')} />
            收藏
          </Button>

          <select
            value={filters.sortBy}
            onChange={(e) =>
              onChange({ ...filters, sortBy: e.target.value as MaterialFilters['sortBy'] })
            }
            className="rounded-xl border border-beige-200 bg-white px-3 py-1.5 text-xs text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            <option value="newest">最新优先</option>
            <option value="oldest">最早优先</option>
            <option value="title">按标题排序</option>
          </select>

          <Button variant="ghost" size="sm">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
