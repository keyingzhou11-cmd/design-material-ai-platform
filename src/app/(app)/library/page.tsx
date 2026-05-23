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
  const { materials, loading, filters, setFilters, toggleFavorite } = useMaterials();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  return (
    <>
      <PageHeader
        title="Library"
        description="Browse and manage your design materials"
        actions={
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="h-4 w-4" />
            Upload
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
        onUpload={async ({ title, categoryId, file }) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('title', title);
          formData.append('categoryId', categoryId);
          await fetch('/api/upload', { method: 'POST', body: formData });
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
