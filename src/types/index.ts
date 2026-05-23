import type { Database } from './database';

export type Material = Database['public']['Tables']['materials']['Row'] & {
  category?: Database['public']['Tables']['categories']['Row'] | null;
  tags?: Database['public']['Tables']['tags']['Row'][];
};

export type Category = Database['public']['Tables']['categories']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Moodboard = Database['public']['Tables']['moodboards']['Row'];
export type CanvasState = Database['public']['Tables']['canvas_states']['Row'];
export type AIAnalysis = Database['public']['Tables']['ai_analyses']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface AnalysisResult {
  summary: string;
  colorPalette: string[];
  typography: string[];
  layoutNotes: string[];
  mood: string;
  tags: string[];
  styleKeywords: string[];
}

export interface MaterialFilters {
  search: string;
  categoryId: string | null;
  tagIds: string[];
  favoritesOnly: boolean;
  sortBy: 'newest' | 'oldest' | 'title';
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Library', href: '/library', icon: 'Library' },
  { label: 'Workspace', href: '/workspace/p1', icon: 'Palette' },
  { label: 'AI Analysis', href: '/analysis', icon: 'Sparkles' },
  { label: 'Projects', href: '/projects', icon: 'FolderOpen' },
  { label: 'Settings', href: '/settings', icon: 'Settings' },
];
