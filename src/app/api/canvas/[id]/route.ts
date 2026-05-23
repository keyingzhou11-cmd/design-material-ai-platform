import { NextResponse } from 'next/server';

const canvasStore = new Map<string, object>();

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data } = await supabase
      .from('canvas_states')
      .select('state')
      .eq('moodboard_id', params.id)
      .single();

    if (data) return NextResponse.json({ state: data.state });
  } catch {
    // fall through
  }

  return NextResponse.json({ state: canvasStore.get(params.id) || {} });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { state } = await request.json();

  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { error } = await supabase
      .from('canvas_states')
      .upsert(
        { moodboard_id: params.id, state, version: 1 },
        { onConflict: 'moodboard_id' }
      );

    if (error) throw error;
  } catch {
    canvasStore.set(params.id, state);
  }

  return NextResponse.json({ success: true });
}
