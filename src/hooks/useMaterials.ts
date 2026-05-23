'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Material, MaterialFilters } from '@/types';
import { MOCK_MATERIALS, filterMaterials } from '@/lib/mock-data';

export function useMaterials(initialFilters?: Partial<MaterialFilters>) {
  const [materials, setMaterials] = useState<Material[]>(MOCK_MATERIALS);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<MaterialFilters>({
    search: '',
    categoryId: null,
    tagIds: [],
    favoritesOnly: false,
    sortBy: 'newest',
    ...initialFilters,
  });

  const filtered = filterMaterials(materials, filters);

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/materials');
      if (res.ok) {
        const data = await res.json();
        if (data.length) setMaterials(data);
      }
    } catch {
      // Use mock data when API unavailable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const toggleFavorite = useCallback((id: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_favorite: !m.is_favorite } : m))
    );
  }, []);

  return { materials: filtered, allMaterials: materials, loading, filters, setFilters, toggleFavorite, refetch: fetchMaterials };
}
