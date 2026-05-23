import { Image, FolderOpen, Sparkles, Heart } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const stats = [
  { label: 'Materials', value: '128', icon: Image, change: '+12 this week' },
  { label: 'Projects', value: '6', icon: FolderOpen, change: '2 active' },
  { label: 'AI Analyses', value: '34', icon: Sparkles, change: '+5 today' },
  { label: 'Favorites', value: '42', icon: Heart, change: 'Curated picks' },
];

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
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
