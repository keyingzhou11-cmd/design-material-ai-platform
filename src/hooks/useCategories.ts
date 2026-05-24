'use client';

import { useCallback, useEffect, useState } from 'react';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import type { Category } from '@/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('分类加载失败');
      const data = await res.json();
      if (Array.isArray(data) && data.length) setCategories(data);
    } catch {
      setCategories(MOCK_CATEGORIES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, refetch: fetchCategories };
}
