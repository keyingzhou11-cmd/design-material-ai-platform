import { NextResponse } from 'next/server';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(MOCK_CATEGORIES);
  }

  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data?.length ? data : MOCK_CATEGORIES);
  } catch {
    return NextResponse.json(MOCK_CATEGORIES);
  }
}
