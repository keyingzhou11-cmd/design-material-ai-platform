'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus, FolderOpen } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { MOCK_PROJECTS } from '@/lib/mock-data';

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="项目空间"
        description="沉淀不同方向的画板、参考与设计探索"
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            新建项目
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROJECTS.map((project) => (
          <Card key={project.id} hover className="overflow-hidden">
            <Link href={`/workspace/${project.id}`}>
              <div className="relative aspect-[16/10] bg-beige-200">
                {project.cover_url && (
                  <Image
                    src={project.cover_url}
                    alt={project.name}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute top-3 left-3">
                  <Badge variant="accent">{project.status === 'active' ? '进行中' : '已归档'}</Badge>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <FolderOpen className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-display text-lg text-ink">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-ink-muted mt-1 line-clamp-2">{project.description}</p>
                    )}
                    <p className="text-xs text-ink-faint mt-3">更新于 {formatDate(project.updated_at)}</p>
                  </div>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </>
  );
}


