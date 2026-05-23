import { NextResponse } from 'next/server';
import { openai, ANALYSIS_SYSTEM_PROMPT } from '@/lib/openai';
import { MOCK_ANALYSIS } from '@/lib/mock-data';

export async function POST(request: Request) {
  const { imageUrl, materialId } = await request.json();

  if (!imageUrl) {
    return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ result: MOCK_ANALYSIS, materialId });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this design image and return structured JSON.' },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    const result = content ? JSON.parse(content) : MOCK_ANALYSIS;

    if (materialId) {
      try {
        const { createClient } = await import('@/lib/supabase/server');
        const supabase = await createClient();
        await supabase.from('ai_analyses').insert({
          material_id: materialId,
          analysis_type: 'full',
          result,
          summary: result.summary,
          tags_suggested: result.tags,
        });
      } catch {
        // Non-blocking
      }
    }

    return NextResponse.json({ result, materialId });
  } catch {
    return NextResponse.json({ result: MOCK_ANALYSIS, materialId });
  }
}
