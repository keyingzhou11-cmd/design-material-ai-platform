import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  crawlDailyInspiration,
  saveCrawledInspirations,
} from '@/lib/crawler/daily-inspiration';

function isAuthorized(request: Request) {
  const secret = process.env.CRAWLER_SECRET;
  if (!secret) return process.env.NODE_ENV !== 'production';

  return request.headers.get('authorization') === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: '无权执行该操作' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const inspirations = await crawlDailyInspiration();
    const saved = await saveCrawledInspirations(supabase, inspirations);

    return NextResponse.json({
      crawled: inspirations.length,
      saved: saved.length,
      materials: saved,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '每日灵感采集失败' },
      { status: 500 }
    );
  }
}
