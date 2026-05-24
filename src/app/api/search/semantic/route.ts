import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { MOCK_MATERIALS, filterMaterials } from '@/lib/mock-data';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function POST(request: Request) {
  const { query } = await request.json();

  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: '请输入搜索内容' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      results: filterMaterials(MOCK_MATERIALS, {
        search: query,
        categoryId: null,
        tagIds: [],
        favoritesOnly: false,
        sortBy: 'newest',
      }),
      mode: 'mock',
    });
  }

  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    if (process.env.OPENAI_API_KEY) {
      const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: query,
      });

      const { data, error } = await supabase.rpc('match_materials', {
        query_embedding: embedding.data[0].embedding,
        match_user_id: user.id,
        match_count: 24,
      });

      if (!error && data) {
        return NextResponse.json({ results: data, mode: 'vector' });
      }
    }

    const { data, error } = await supabase
      .from('materials')
      .select('*, category:categories(*), material_tags(tags(*))')
      .eq('user_id', user.id)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(24);

    if (error) throw error;

    return NextResponse.json({ results: data || [], mode: 'keyword' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '语义搜索失败' },
      { status: 500 }
    );
  }
}
