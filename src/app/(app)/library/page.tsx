'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { MaterialGrid } from '@/components/materials/MaterialGrid';
import { MaterialFiltersBar } from '@/components/materials/MaterialFilters';
import { MaterialUploader } from '@/components/materials/MaterialUploader';
import { MaterialDetailSheet } from '@/components/materials/MaterialDetailSheet';
import { Button } from '@/components/ui/Button';
import { useMaterials } from '@/hooks/useMaterials';
import type { Material } from '@/types';

export default function LibraryPage() {
  const router = useRouter();
  const { materials, loading, filters, setFilters, toggleFavorite, refetch } = useMaterials();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  return (
    <>
      <PageHeader
        title="素材库"
        description="管理你的设计参考、图片素材与灵感标签"
        actions={
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="h-4 w-4" />
            上传
          </Button>
        }
      />

      <MaterialFiltersBar filters={filters} onChange={setFilters} />
      <MaterialGrid
        materials={materials}
        loading={loading}
        onFavorite={toggleFavorite}
        onClick={setSelectedMaterial}
      />

      <MaterialUploader
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={async ({ title, categoryId, tags, file }) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('title', title);
          formData.append('categoryId', categoryId);
          formData.append('tags', tags);

          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          const data = await res.json().catch(() => null);

          if (!res.ok) {
            throw new Error(data?.error || '上传失败，请稍后重试。');
          }

          await refetch();
        }}
      />

      <MaterialDetailSheet
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        onAnalyze={(m) => router.push(`/analysis?material=${m.id}`)}
      />
    </>
  );
}
