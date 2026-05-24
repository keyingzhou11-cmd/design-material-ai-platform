import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('PROJECTS GET ERROR', error);
    return NextResponse.json({ error: '项目加载失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const description = String(body.description || '').trim();
    const coverUrl = String(body.cover_url || '').trim();

    if (!name) {
      return NextResponse.json({ error: '请输入项目名称' }, { status: 400 });
    }

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        description: description || null,
        cover_url: coverUrl || null,
        status: 'active',
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('PROJECTS POST ERROR', error);
    return NextResponse.json({ error: '创建项目失败' }, { status: 500 });
  }
}
