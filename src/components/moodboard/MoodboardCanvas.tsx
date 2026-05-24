'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Canvas } from 'fabric';
import {
  addImageToCanvas,
  deleteSelected,
  duplicateSelected,
  loadCanvasState,
  rotateSelected,
  serializeCanvas,
  zoomCanvas,
} from '@/lib/fabric/canvas-utils';
import { debounce } from '@/lib/utils';
import { useMoodboardStore } from '@/store/moodboard-store';

export interface MoodboardCanvasHandle {
  deleteSelected: () => void;
  rotateSelected: () => void;
  duplicateSelected: () => Promise<void>;
  zoomIn: () => void;
  zoomOut: () => void;
  saveNow: () => Promise<void>;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
}

interface MoodboardCanvasProps {
  moodboardId: string;
  width?: number;
  height?: number;
  onHistoryChange?: (history: { canUndo: boolean; canRedo: boolean }) => void;
}

export const MoodboardCanvas = forwardRef<MoodboardCanvasHandle, MoodboardCanvasProps>(
  function MoodboardCanvas(
    { moodboardId, width = 1200, height = 800, onHistoryChange },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<Canvas | null>(null);
    const undoStackRef = useRef<string[]>([]);
    const redoStackRef = useRef<string[]>([]);
    const restoringRef = useRef(false);
    const { selectedMaterial, setIsSaving, setLastSaved } = useMoodboardStore();
    const [, setHistoryVersion] = useState(0);

    const notifyHistory = useCallback(() => {
      const snapshot = {
        canUndo: undoStackRef.current.length > 1,
        canRedo: redoStackRef.current.length > 0,
      };
      setHistoryVersion((version) => version + 1);
      onHistoryChange?.(snapshot);
    }, [onHistoryChange]);

    const pushHistory = useCallback(
      (canvas: Canvas) => {
        if (restoringRef.current) return;

        const snapshot = JSON.stringify(serializeCanvas(canvas));
        const stack = undoStackRef.current;
        if (stack[stack.length - 1] === snapshot) return;

        stack.push(snapshot);
        if (stack.length > 50) stack.shift();
        redoStackRef.current = [];
        notifyHistory();
      },
      [notifyHistory]
    );

    const persistCanvas = useCallback(
      async (canvas: Canvas) => {
        setIsSaving(true);
        try {
          const state = serializeCanvas(canvas);
          const res = await fetch(`/api/canvas/${moodboardId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state }),
          });

          if (!res.ok) throw new Error('画板保存失败');
          setLastSaved(new Date());
        } finally {
          setIsSaving(false);
        }
      },
      [moodboardId, setIsSaving, setLastSaved]
    );

    const debouncedSave = useMemo(
      () =>
        debounce((canvas: Canvas) => {
          void persistCanvas(canvas);
        }, 1500),
      [persistCanvas]
    );

    const saveAndTrack = useCallback(
      (canvas: Canvas) => {
        pushHistory(canvas);
        debouncedSave(canvas);
      },
      [debouncedSave, pushHistory]
    );

    const restoreSnapshot = useCallback(
      async (snapshot: string) => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        restoringRef.current = true;
        await loadCanvasState(canvas, JSON.parse(snapshot));
        restoringRef.current = false;
        notifyHistory();
        await persistCanvas(canvas);
      },
      [notifyHistory, persistCanvas]
    );

    const undo = useCallback(async () => {
      if (undoStackRef.current.length <= 1) return;
      const current = undoStackRef.current.pop();
      if (current) redoStackRef.current.push(current);
      const previous = undoStackRef.current[undoStackRef.current.length - 1];
      if (previous) await restoreSnapshot(previous);
    }, [restoreSnapshot]);

    const redo = useCallback(async () => {
      const next = redoStackRef.current.pop();
      if (!next) return;
      undoStackRef.current.push(next);
      await restoreSnapshot(next);
    }, [restoreSnapshot]);

    useImperativeHandle(
      ref,
      () => ({
        deleteSelected: () => {
          if (fabricRef.current) deleteSelected(fabricRef.current);
        },
        rotateSelected: () => {
          if (fabricRef.current) rotateSelected(fabricRef.current);
        },
        duplicateSelected: async () => {
          if (fabricRef.current) await duplicateSelected(fabricRef.current);
        },
        zoomIn: () => {
          if (fabricRef.current) zoomCanvas(fabricRef.current, 1.1);
        },
        zoomOut: () => {
          if (fabricRef.current) zoomCanvas(fabricRef.current, 0.9);
        },
        saveNow: async () => {
          if (fabricRef.current) await persistCanvas(fabricRef.current);
        },
        undo,
        redo,
      }),
      [persistCanvas, redo, undo]
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

        canvas.on('object:modified', () => saveAndTrack(canvas));
        canvas.on('object:added', () => saveAndTrack(canvas));
        canvas.on('object:removed', () => saveAndTrack(canvas));

        try {
          const res = await fetch(`/api/canvas/${moodboardId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.state && Object.keys(data.state).length > 0) {
              restoringRef.current = true;
              await loadCanvasState(canvas, data.state);
              restoringRef.current = false;
            }
          }
        } catch {
          // Start with empty canvas.
        }

        pushHistory(canvas);
      }

      init();

      return () => {
        disposed = true;
        fabricRef.current?.dispose();
        fabricRef.current = null;
      };
    }, [moodboardId, width, height, saveAndTrack, pushHistory]);

    useEffect(() => {
      if (selectedMaterial && fabricRef.current) {
        void addImageToCanvas(
          fabricRef.current,
          selectedMaterial.image_url,
          selectedMaterial.id
        );
      }
    }, [selectedMaterial]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            void redo();
          } else {
            void undo();
          }
        }

        if ((e.key === 'Delete' || e.key === 'Backspace') && fabricRef.current) {
          deleteSelected(fabricRef.current);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [redo, undo]);

    return (
      <div className="flex-1 overflow-auto bg-beige-200/30 p-6 flex items-center justify-center">
        <div className="rounded-2xl shadow-soft overflow-hidden border border-beige-200/60">
          <canvas ref={canvasRef} />
        </div>
      </div>
    );
  }
);
