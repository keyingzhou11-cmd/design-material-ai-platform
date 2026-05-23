import { NextResponse } from 'next/server';
import { MOCK_MATERIALS } from '@/lib/mock-data';

export async function GET() {
  const picks = MOCK_MATERIALS.slice(0, 4).map((m) => m.id);
  const reason =
    'Curated for your editorial minimal aesthetic — warm tones, strong typography, and clean layouts.';

  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data } = await supabase
      .from('daily_recommendations')
      .select('*')
      .eq('recommendation_date', new Date().toISOString().split('T')[0])
      .single();

    if (data) {
      return NextResponse.json(data);
    }
  } catch {
    // fall through
  }

  return NextResponse.json({
    material_ids: picks,
    reason,
    recommendation_date: new Date().toISOString().split('T')[0],
  });
}
