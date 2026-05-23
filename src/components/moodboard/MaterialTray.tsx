'use client';

import Image from 'next/image';
import { SearchInput } from '@/components/ui/SearchInput';
import { cn } from '@/lib/utils';
import type { Material } from '@/types';
import { useState } from 'react';

interface MaterialTrayProps {
  materials: Material[];
  onSelect: (material: Material) => void;
  selectedId?: string | null;
}

export function MaterialTray({ materials, onSelect, selectedId }: MaterialTrayProps) {
  const [search, setSearch] = useState('');

  const filtered = materials.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-72 flex-shrink-0 border-r border-beige-200 bg-beige-50 flex flex-col h-full">
      <div className="p-4 border-b border-beige-200">
        <h3 className="font-display text-sm text-ink mb-3">Materials</h3>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Filter materials..."
        />
        <p className="mt-2 text-xs text-ink-faint">Click to add to canvas</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
        {filtered.map((material) => (
          <button
            key={material.id}
            type="button"
            onClick={() => onSelect(material)}
            className={cn(
              'w-full flex items-center gap-3 rounded-xl p-2 text-left transition-all',
              selectedId === material.id
                ? 'bg-accent-light ring-2 ring-accent/30'
                : 'hover:bg-white hover:shadow-card'
            )}
          >
            <div className="relative h-14 w-14 rounded-lg overflow-hidden flex-shrink-0 bg-beige-200">
              <Image src={material.image_url} alt={material.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-ink truncate">{material.title}</p>
              <p className="text-[10px] text-ink-faint">{material.category?.name}</p>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
