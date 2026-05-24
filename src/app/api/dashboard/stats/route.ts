import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

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

async function getCount(query: PromiseLike<{ count: number | null; error: unknown }>) {
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(EMPTY_STATS);
    }

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(EMPTY_STATS);
    }

    const [materialsTotal, projectsTotal, analysesTotal, favoritesTotal] = await Promise.all([
      getCount(
        supabase
          .from('materials')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
      ),
      getCount(
        supabase
          .from('projects')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
      ),
      getCount(
        supabase
          .from('ai_analyses')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
      ),
      getCount(
        supabase
          .from('materials')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_favorite', true)
      ),
    ]);

    return NextResponse.json({
      materialsTotal,
      projectsTotal,
      analysesTotal,
      favoritesTotal,
    });
  } catch (error) {
    console.error('DASHBOARD STATS ERROR', error);
    return NextResponse.json(EMPTY_STATS);
  }
}
