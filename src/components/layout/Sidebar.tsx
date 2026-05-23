'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Library,
  Palette,
  Sparkles,
  FolderOpen,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/types';

const iconMap = {
  LayoutDashboard,
  Library,
  Palette,
  Sparkles,
  FolderOpen,
  Settings,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-beige-200 bg-beige-50">
      <div className="flex h-16 items-center px-6 border-b border-beige-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-display text-sm font-bold">A</span>
          </div>
          <span className="font-display text-lg text-ink tracking-tight">Atelier</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const segment = item.href.split('/')[1];
          const isActive =
            pathname === item.href ||
            (segment && pathname.startsWith(`/${segment}`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white text-accent shadow-card border border-beige-200/60'
                  : 'text-ink-muted hover:text-ink hover:bg-beige-200/40'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-accent' : 'text-ink-faint')} />
              {item.label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-beige-200 p-4">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-beige-200 flex items-center justify-center text-sm font-medium text-ink-muted">
            D
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink truncate">Designer</p>
            <p className="text-xs text-ink-faint truncate">designer@atelier.app</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
