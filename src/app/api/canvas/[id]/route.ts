import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const canvasStore = new Map<string, object>();

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

async function resolveMoodboardId(
  supabase: any,
  workspaceId: string,
  userId: string
) {
  if (!isUuid(workspaceId)) return null;

  const { data: existingBoard } = await supabase
    .from('moodboards')
    .select('id, project:projects!inner(user_id)')
    .eq('id', workspaceId)
    .eq('project.user_id', userId)
    .maybeSingle();

  if (existingBoard?.id) return existingBoard.id;

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', workspaceId)
    .eq('user_id', userId)
    .maybeSingle();

  if (!project) return null;

  const { data: board } = await supabase
    .from('moodboards')
    .select('id')
    .eq('project_id', project.id)
    .maybeSingle();

  if (board?.id) return board.id;

  const { data: created, error } = await supabase
    .from('moodboards')
    .insert({ project_id: project.id, name: '灵感画板' })
    .select('id')
    .single();

  if (error) throw error;
  return created.id;
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ state: canvasStore.get(params.id) || {} });
    }

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ state: canvasStore.get(params.id) || {} });

    const moodboardId = await resolveMoodboardId(supabase, params.id, user.id);
    if (!moodboardId) return NextResponse.json({ state: canvasStore.get(params.id) || {} });

    const { data } = await supabase
      .from('canvas_states')
      .select('state')
      .eq('moodboard_id', moodboardId)
      .maybeSingle();

    if (data) return NextResponse.json({ state: data.state });
  } catch {
    // Fall back to in-memory state for local/mock workspaces.
  }

  return NextResponse.json({ state: canvasStore.get(params.id) || {} });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { state } = await request.json();

  try {
    if (!isSupabaseConfigured()) {
      canvasStore.set(params.id, state);
      return NextResponse.json({ success: true, mode: 'memory' });
    }

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      canvasStore.set(params.id, state);
      return NextResponse.json({ success: true, mode: 'memory' });
    }

    const moodboardId = await resolveMoodboardId(supabase, params.id, user.id);
    if (!moodboardId) throw new Error('未找到画板');

    const { error } = await supabase
      .from('canvas_states')
      .upsert(
        { moodboard_id: moodboardId, state, version: 1 },
        { onConflict: 'moodboard_id' }
      );

    if (error) throw error;
  } catch {
    canvasStore.set(params.id, state);
    return NextResponse.json({ success: true, mode: 'memory' });
  }

  return NextResponse.json({ success: true, mode: 'database' });
}
