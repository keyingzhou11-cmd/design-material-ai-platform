'use client';

import {
  Trash2,
  RotateCw,
  Copy,
  Replace,
  Save,
  ZoomIn,
  ZoomOut,
  Undo2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface CanvasToolbarProps {
  onDelete: () => void;
  onRotate: () => void;
  onDuplicate: () => void;
  onReplace: () => void;
  onSave: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onUndo: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
}

export function CanvasToolbar({
  onDelete,
  onRotate,
  onDuplicate,
  onReplace,
  onSave,
  onZoomIn,
  onZoomOut,
  onUndo,
  isSaving,
  lastSaved,
}: CanvasToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-beige-200">
      <div className="flex items-center gap-1">
        <ToolbarButton icon={Undo2} label="Undo" onClick={onUndo} />
        <ToolbarButton icon={RotateCw} label="Rotate" onClick={onRotate} />
        <ToolbarButton icon={Copy} label="Duplicate" onClick={onDuplicate} />
        <ToolbarButton icon={Replace} label="Replace" onClick={onReplace} />
        <ToolbarButton icon={Trash2} label="Delete" onClick={onDelete} variant="danger" />
      </div>

      <div className="flex items-center gap-1">
        <ToolbarButton icon={ZoomOut} label="Zoom out" onClick={onZoomOut} />
        <ToolbarButton icon={ZoomIn} label="Zoom in" onClick={onZoomIn} />
      </div>

      <div className="flex items-center gap-3">
        {lastSaved && (
          <span className="text-xs text-ink-faint">
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        )}
        <Button size="sm" onClick={onSave} disabled={isSaving}>
          <Save className={cn('h-3.5 w-3.5', isSaving && 'animate-pulse')} />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
  variant,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?: 'danger';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={cn(
        'rounded-lg p-2 text-ink-muted hover:text-ink hover:bg-beige-100 transition-colors',
        variant === 'danger' && 'hover:text-red-600 hover:bg-red-50'
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
