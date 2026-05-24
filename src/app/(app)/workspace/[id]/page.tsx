'use client';

import { useCallback, useRef, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { MaterialTray } from '@/components/moodboard/MaterialTray';
import {
  MoodboardCanvas,
  type MoodboardCanvasHandle,
} from '@/components/moodboard/MoodboardCanvas';
import { CanvasToolbar } from '@/components/moodboard/CanvasToolbar';
import { useMaterials } from '@/hooks/useMaterials';
import { useMoodboardStore } from '@/store/moodboard-store';
import type { Material } from '@/types';

interface WorkspacePageProps {
  params: { id: string };
}

export default function WorkspacePage({ params }: WorkspacePageProps) {
  const { allMaterials } = useMaterials();
  const { setSelectedMaterial, isSaving, lastSaved } = useMoodboardStore();
  const canvasRef = useRef<MoodboardCanvasHandle | null>(null);
  const [history, setHistory] = useState({ canUndo: false, canRedo: false });

  const handleSelect = useCallback(
    (material: Material) => {
      setSelectedMaterial(material);
    },
    [setSelectedMaterial]
  );

  const handleSave = async () => {
    await canvasRef.current?.saveNow();
  };

  return (
    <div className="-mx-8 -my-8 flex flex-col h-[calc(100vh)]">
      <div className="px-8 pt-8 pb-4">
        <PageHeader
          title="灵感画板"
          description={`项目画板 / ${params.id}`}
        />
      </div>

      <CanvasToolbar
        onDelete={() => canvasRef.current?.deleteSelected()}
        onRotate={() => canvasRef.current?.rotateSelected()}
        onDuplicate={() => void canvasRef.current?.duplicateSelected()}
        onReplace={() => {}}
        onSave={handleSave}
        onZoomIn={() => canvasRef.current?.zoomIn()}
        onZoomOut={() => canvasRef.current?.zoomOut()}
        onUndo={() => void canvasRef.current?.undo()}
        onRedo={() => void canvasRef.current?.redo()}
        isSaving={isSaving}
        lastSaved={lastSaved}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
      />

      <div className="flex flex-1 overflow-hidden border-t border-beige-200">
        <MaterialTray materials={allMaterials} onSelect={handleSelect} />
        <MoodboardCanvas
          ref={canvasRef}
          moodboardId={params.id}
          onHistoryChange={setHistory}
        />
      </div>
    </div>
  );
}
