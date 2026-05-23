import { NextResponse } from 'next/server';
import { MOCK_MATERIALS } from '@/lib/mock-data';

export async function GET() {
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('materials')
      .select('*, category:categories(*), material_tags(tags(*))')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(MOCK_MATERIALS);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('materials')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create material' }, { status: 500 });
  }
}
