'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { Canvas } from 'fabric';
import {
  addImageToCanvas,
  deleteSelected,
  serializeCanvas,
  loadCanvasState,
} from '@/lib/fabric/canvas-utils';
import { debounce } from '@/lib/utils';
import { useMoodboardStore } from '@/store/moodboard-store';

interface MoodboardCanvasProps {
  moodboardId: string;
  width?: number;
  height?: number;
}

export function MoodboardCanvas({
  moodboardId,
  width = 1200,
  height = 800,
}: MoodboardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const { selectedMaterial, setIsSaving, setLastSaved } = useMoodboardStore();

  const saveCanvas = useCallback(
    debounce(async (canvas: Canvas) => {
      setIsSaving(true);
      try {
        const state = serializeCanvas(canvas);
        await fetch(`/api/canvas/${moodboardId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state }),
        });
        setLastSaved(new Date());
      } catch {
        // Silent fail when API unavailable
      } finally {
        setIsSaving(false);
      }
    }, 1500),
    [moodboardId, setIsSaving, setLastSaved]
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    let canvas: Canvas;
    let disposed = false;

    async function init() {
      const { Canvas: FabricCanvas } = await import('fabric');
      if (disposed || !canvasRef.current) return;

      canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#F5F0EB',
        selection: true,
        preserveObjectStacking: true,
      });

      fabricRef.current = canvas;

      canvas.on('object:modified', () => saveCanvas(canvas));
      canvas.on('object:added', () => saveCanvas(canvas));
      canvas.on('object:removed', () => saveCanvas(canvas));

      try {
        const res = await fetch(`/api/canvas/${moodboardId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.state && Object.keys(data.state).length > 0) {
            await loadCanvasState(canvas, data.state);
          }
        }
      } catch {
        // Start with empty canvas
      }
    }

    init();

    return () => {
      disposed = true;
      fabricRef.current?.dispose();
      fabricRef.current = null;
    };
  }, [moodboardId, width, height, saveCanvas]);

  useEffect(() => {
    if (selectedMaterial && fabricRef.current) {
      addImageToCanvas(
        fabricRef.current,
        selectedMaterial.image_url,
        selectedMaterial.id
      );
    }
  }, [selectedMaterial]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && fabricRef.current) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        deleteSelected(fabricRef.current);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex-1 overflow-auto bg-beige-200/30 p-6 flex items-center justify-center">
      <div className="rounded-2xl shadow-soft overflow-hidden border border-beige-200/60">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
