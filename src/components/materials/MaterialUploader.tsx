'use client';

import { useCallback, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface MaterialUploaderProps {
  open: boolean;
  onClose: () => void;
  onUpload?: (data: { title: string; categoryId: string; file: File }) => void;
}

export function MaterialUploader({ open, onClose, onUpload }: MaterialUploaderProps) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
  }, [title]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f?.type.startsWith('image/')) handleFile(f);
    },
    [handleFile]
  );

  const handleSubmit = () => {
    if (file && title) {
      onUpload?.({ title, categoryId, file });
      setTitle('');
      setCategoryId('');
      setFile(null);
      setPreview(null);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Upload Material">
      <div className="space-y-4">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
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
              <img src={preview} alt="Preview" className="mx-auto max-h-48 rounded-xl object-contain" />
              <button
                type="button"
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-0 right-0 rounded-full bg-white p-1 shadow-card"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <ImageIcon className="mx-auto h-10 w-10 text-ink-faint mb-3" />
              <p className="text-sm text-ink-muted mb-2">Drag & drop an image, or click to browse</p>
              <label className="cursor-pointer">
                <span className="text-sm text-accent font-medium hover:underline">Choose file</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </label>
            </>
          )}
        </div>

        <Input
          placeholder="Material title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-xl border border-beige-200 bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/20"
        >
          <option value="">Select category</option>
          {MOCK_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!file || !title}>
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>
    </Modal>
  );
}
