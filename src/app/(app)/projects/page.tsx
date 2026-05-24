'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Plus, FolderOpen } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import type { Project } from '@/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects', { cache: 'no-store' });
      if (!res.ok) throw new Error('项目加载失败');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setCoverUrl('');
    setError(null);
  };

  const handleCreate = async () => {
    if (!name.trim() || creating) return;

    setCreating(true);
    setError(null);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          cover_url: coverUrl,
        }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || '创建项目失败');
      }

      resetForm();
      setModalOpen(false);
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建项目失败');
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    if (creating) return;
    resetForm();
    setModalOpen(false);
  };

  return (
    <>
      <PageHeader
        title="项目空间"
        description="沉淀不同方向的画板、参考与设计探索"
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            新建项目
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-beige-200" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-2/3 rounded bg-beige-200" />
                <div className="h-4 w-full rounded bg-beige-200" />
                <div className="h-3 w-1/3 rounded bg-beige-200" />
              </div>
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="暂无项目"
          description="创建第一个项目，用来保存不同方向的灵感画板。"
          icon={<FolderOpen className="h-8 w-8" />}
          action={
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" />
              新建项目
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} hover className="overflow-hidden">
              <Link href={`/workspace/${project.id}`}>
                <div className="relative aspect-[16/10] bg-beige-200">
                  {project.cover_url ? (
                    <Image
                      src={project.cover_url}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#E85D0430,transparent_32%),linear-gradient(135deg,#F5F0EB,#FFFFFF)]" />
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge variant="accent">
                      {project.status === 'active' ? '进行中' : '已归档'}
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <FolderOpen className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-display text-lg text-ink">{project.name}</h3>
                      {project.description && (
                        <p className="text-sm text-ink-muted mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      <p className="text-xs text-ink-faint mt-3">
                        更新于 {formatDate(project.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={handleClose} title="新建项目">
        <div className="space-y-4">
          <Input
            placeholder="项目名称"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="项目描述"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            placeholder="封面图片 URL（可选）"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={handleClose} disabled={creating}>
              取消
            </Button>
            <Button onClick={handleCreate} disabled={!name.trim() || creating}>
              {creating ? '创建中...' : '创建'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
