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
  Redo2,
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
  onRedo: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
  canUndo?: boolean;
  canRedo?: boolean;
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
  onRedo,
  isSaving,
  lastSaved,
  canUndo,
  canRedo,
}: CanvasToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-beige-200">
      <div className="flex items-center gap-1">
        <ToolbarButton icon={Undo2} label="撤销" onClick={onUndo} disabled={!canUndo} />
        <ToolbarButton icon={Redo2} label="重做" onClick={onRedo} disabled={!canRedo} />
        <ToolbarButton icon={RotateCw} label="旋转" onClick={onRotate} />
        <ToolbarButton icon={Copy} label="复制" onClick={onDuplicate} />
        <ToolbarButton icon={Replace} label="替换" onClick={onReplace} />
        <ToolbarButton icon={Trash2} label="删除" onClick={onDelete} variant="danger" />
      </div>

      <div className="flex items-center gap-1">
        <ToolbarButton icon={ZoomOut} label="缩小" onClick={onZoomOut} />
        <ToolbarButton icon={ZoomIn} label="放大" onClick={onZoomIn} />
      </div>

      <div className="flex items-center gap-3">
        {lastSaved && (
          <span className="text-xs text-ink-faint">
            已保存 {lastSaved.toLocaleTimeString('zh-CN')}
          </span>
        )}
        <Button size="sm" onClick={onSave} disabled={isSaving}>
          <Save className={cn('h-3.5 w-3.5', isSaving && 'animate-pulse')} />
          {isSaving ? '保存中...' : '保存'}
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
  disabled,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?: 'danger';
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      disabled={disabled}
      className={cn(
        'rounded-lg p-2 text-ink-muted hover:text-ink hover:bg-beige-100 transition-colors',
        disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent hover:text-ink-muted',
        variant === 'danger' && 'hover:text-red-600 hover:bg-red-50'
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
