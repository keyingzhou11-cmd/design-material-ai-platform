import { NextResponse } from 'next/server';
import { openai, ANALYSIS_SYSTEM_PROMPT } from '@/lib/openai';
import { MOCK_ANALYSIS } from '@/lib/mock-data';
import { syncMaterialTags } from '@/lib/materials/tags';

export async function POST(request: Request) {
  const { imageUrl, materialId } = await request.json();

  if (!imageUrl) {
    return NextResponse.json({ error: '缺少图片地址' }, { status: 400 });
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
            { type: 'text', text: '请分析这张设计图片，并返回中文结构化 JSON。' },
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
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const semanticText = [
          result.summary,
          result.mood,
          ...(result.tags || []),
          ...(result.styleKeywords || []),
          ...(result.typography || []),
          ...(result.layoutNotes || []),
        ]
          .filter(Boolean)
          .join(' ');

        let embedding: number[] | null = null;
        if (process.env.OPENAI_API_KEY && semanticText) {
          const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: semanticText,
          });
          embedding = embeddingResponse.data[0].embedding;
        }

        await supabase.from('ai_analyses').insert({
          material_id: materialId,
          user_id: user?.id,
          analysis_type: 'full',
          result,
          summary: result.summary,
          tags_suggested: result.tags,
        });

        if (result.tags?.length) {
          await syncMaterialTags(supabase, materialId, result.tags);
        }

        await supabase
          .from('materials')
          .update({
            metadata: {
              ai_summary: result.summary,
              ai_mood: result.mood,
              ai_tags: result.tags,
              semantic_text: semanticText,
            },
            ...(embedding ? { embedding: embedding as never } : {}),
          })
          .eq('id', materialId);
      } catch {
        // Non-blocking
      }
    }

    return NextResponse.json({ result, materialId });
  } catch {
    return NextResponse.json({ result: MOCK_ANALYSIS, materialId });
  }
}
