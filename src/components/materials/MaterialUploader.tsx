'use client';

import { useCallback, useState } from 'react';
import { Upload, X, ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/lib/utils';

interface MaterialUploaderProps {
  open: boolean;
  onClose: () => void;
  onUpload?: (data: {
    title: string;
    categoryId: string;
    tags: string;
    file: File;
  }) => Promise<void> | void;
}

export function MaterialUploader({ open, onClose, onUpload }: MaterialUploaderProps) {
  const { categories, loading: categoriesLoading } = useCategories();
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setTitle('');
    setCategoryId('');
    setTags('');
    setFile(null);
    setPreview(null);
    setError(null);
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      setError(null);

      if (!f.type.startsWith('image/')) {
        setError('请上传图片格式的素材。');
        return;
      }

      setFile(f);
      setPreview(URL.createObjectURL(f));
      if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
    },
    [title]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleSubmit = async () => {
    if (!file || !title || uploading) return;

    setUploading(true);
    setError(null);

    try {
      await onUpload?.({ title, categoryId, tags, file });
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败，请稍后重试。');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (uploading) return;
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="上传素材">
      <div className="space-y-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'relative rounded-2xl border-2 border-dashed p-8 text-center transition-colors',
            dragging ? 'border-accent bg-accent-light' : 'border-beige-300 bg-beige-50'
          )}
        >
          {preview ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="素材预览" className="mx-auto max-h-48 rounded-xl object-contain" />
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                className="absolute top-0 right-0 rounded-full bg-white p-1 shadow-card"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <ImageIcon className="mx-auto h-10 w-10 text-ink-faint mb-3" />
              <p className="text-sm text-ink-muted mb-2">拖入图片，或点击选择文件</p>
              <label className="cursor-pointer">
                <span className="text-sm text-accent font-medium hover:underline">选择文件</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) handleFile(selectedFile);
                  }}
                />
              </label>
            </>
          )}
        </div>

        <Input
          placeholder="素材标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-xl border border-beige-200 bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/20"
        >
          <option value="">{categoriesLoading ? '正在加载分类...' : '选择分类'}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <Input
          placeholder="标签，用逗号分隔"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={handleClose} disabled={uploading}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={!file || !title || uploading}>
            <Upload className="h-4 w-4" />
            {uploading ? '上传中...' : '上传'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
