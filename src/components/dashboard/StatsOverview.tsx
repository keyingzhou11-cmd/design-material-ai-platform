'use client';

import { useEffect, useState } from 'react';
import { Image, FolderOpen, Sparkles, Heart } from 'lucide-react';
import { Card } from '@/components/ui/Card';

type DashboardStats = {
  materialsTotal: number;
  projectsTotal: number;
  analysesTotal: number;
  favoritesTotal: number;
};

const EMPTY_STATS: DashboardStats = {
  materialsTotal: 0,
  projectsTotal: 0,
  analysesTotal: 0,
  favoritesTotal: 0,
};

export function StatsOverview() {
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);

  useEffect(() => {
    let active = true;

    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats', { cache: 'no-store' });
        if (!res.ok) throw new Error('Dashboard stats request failed');
        const data = (await res.json()) as Partial<DashboardStats>;

        if (!active) return;
        setStats({
          materialsTotal: Number(data.materialsTotal ?? 0),
          projectsTotal: Number(data.projectsTotal ?? 0),
          analysesTotal: Number(data.analysesTotal ?? 0),
          favoritesTotal: Number(data.favoritesTotal ?? 0),
        });
      } catch {
        if (active) setStats(EMPTY_STATS);
      }
    }

    void fetchStats();

    return () => {
      active = false;
    };
  }, []);

  const statItems = [
    { label: '素材总数', value: stats.materialsTotal, icon: Image, change: '已上传素材' },
    { label: '项目空间', value: stats.projectsTotal, icon: FolderOpen, change: '当前项目' },
    { label: 'AI 分析', value: stats.analysesTotal, icon: Sparkles, change: '分析记录' },
    { label: '收藏灵感', value: stats.favoritesTotal, icon: Heart, change: '已收藏素材' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((stat) => (
        <Card key={stat.label} className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-ink-faint uppercase tracking-wider">{stat.label}</p>
              <p className="mt-1 font-display text-3xl text-ink">{stat.value}</p>
              <p className="mt-1 text-xs text-ink-muted">{stat.change}</p>
            </div>
            <div className="rounded-xl bg-beige-100 p-2.5">
              <stat.icon className="h-4 w-4 text-accent" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
