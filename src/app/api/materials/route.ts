import { NextResponse } from 'next/server';
import { MOCK_MATERIALS } from '@/lib/mock-data';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { Material } from '@/types';

type MaterialWithJoin = Material & {
  material_tags?: { tags: NonNullable<Material['tags']>[number] }[];
};

function normalizeMaterial(material: MaterialWithJoin): Material {
  const { material_tags, ...rest } = material;
  return {
    ...rest,
    tags: material_tags?.map((item) => item.tags).filter(Boolean) || material.tags || [],
  };
}

export async function GET(request: Request) {
  try {
    if (!isSupabaseConfigured()) return NextResponse.json(MOCK_MATERIALS);

    const url = new URL(request.url);
    const search = url.searchParams.get('q')?.trim();

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json(MOCK_MATERIALS);

    let query = supabase
      .from('materials')
      .select('*, category:categories(*), material_tags(tags(*))')
      .or(`user_id.eq.${user.id},user_id.is.null`)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json((data || []).map((item) => normalizeMaterial(item as MaterialWithJoin)));
  } catch {
    return NextResponse.json(MOCK_MATERIALS);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('materials')
      .insert({ ...body, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: '创建素材失败' }, { status: 500 });
  }
}
