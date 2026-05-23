'use client';

import { useCallback, useRef } from 'react';
import type { Canvas } from 'fabric';
import { PageHeader } from '@/components/layout/PageHeader';
import { MaterialTray } from '@/components/moodboard/MaterialTray';
import { MoodboardCanvas } from '@/components/moodboard/MoodboardCanvas';
import { CanvasToolbar } from '@/components/moodboard/CanvasToolbar';
import { useMaterials } from '@/hooks/useMaterials';
import { useMoodboardStore } from '@/store/moodboard-store';
import { deleteSelected } from '@/lib/fabric/canvas-utils';
import type { Material } from '@/types';

interface WorkspacePageProps {
  params: { id: string };
}

export default function WorkspacePage({ params }: WorkspacePageProps) {
  const { allMaterials } = useMaterials();
  const { setSelectedMaterial, isSaving, lastSaved, setLastSaved } = useMoodboardStore();
  const canvasInstanceRef = useRef<Canvas | null>(null);

  const handleSelect = useCallback(
    (material: Material) => {
      setSelectedMaterial(material);
    },
    [setSelectedMaterial]
  );

  const handleSave = async () => {
    // Save triggered via canvas auto-save; manual save is a no-op placeholder
    setLastSaved(new Date());
  };

  return (
    <div className="-mx-8 -my-8 flex flex-col h-[calc(100vh)]">
      <div className="px-8 pt-8 pb-4">
        <PageHeader
          title="Moodboard"
          description={`Workspace · Project ${params.id}`}
        />
      </div>

      <CanvasToolbar
        onDelete={() => canvasInstanceRef.current && deleteSelected(canvasInstanceRef.current)}
        onRotate={() => {
          const obj = canvasInstanceRef.current?.getActiveObject();
          if (obj) { obj.rotate((obj.angle || 0) + 15); canvasInstanceRef.current?.renderAll(); }
        }}
        onDuplicate={() => {
          const obj = canvasInstanceRef.current?.getActiveObject();
          if (obj && canvasInstanceRef.current) {
            obj.clone().then((cloned) => {
              cloned.set({ left: (obj.left || 0) + 20, top: (obj.top || 0) + 20 });
              canvasInstanceRef.current!.add(cloned);
              canvasInstanceRef.current!.setActiveObject(cloned);
              canvasInstanceRef.current!.renderAll();
            });
          }
        }}
        onReplace={() => {}}
        onSave={handleSave}
        onZoomIn={() => canvasInstanceRef.current?.setZoom((canvasInstanceRef.current.getZoom() || 1) * 1.1)}
        onZoomOut={() => canvasInstanceRef.current?.setZoom((canvasInstanceRef.current.getZoom() || 1) * 0.9)}
        onUndo={() => {}}
        isSaving={isSaving}
        lastSaved={lastSaved}
      />

      <div className="flex flex-1 overflow-hidden border-t border-beige-200">
        <MaterialTray materials={allMaterials} onSelect={handleSelect} />
        <MoodboardCanvas moodboardId={params.id} />
      </div>
    </div>
  );
}
