interface CrawledInspiration {
  title: string;
  imageUrl: string;
  sourceUrl: string;
}

const DEFAULT_SOURCES = [
  'https://www.awwwards.com/',
  'https://www.behance.net/galleries/graphic-design',
  'https://dribbble.com/shots/popular/web-design',
];

function extractMeta(content: string, property: string) {
  const pattern = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    'i'
  );
  return content.match(pattern)?.[1]?.trim();
}

export async function crawlDailyInspiration(limit = 12): Promise<CrawledInspiration[]> {
  const sources = (process.env.DESIGN_INSPIRATION_SOURCES || DEFAULT_SOURCES.join(','))
    .split(',')
    .map((source) => source.trim())
    .filter(Boolean)
    .slice(0, limit);

  const results: CrawledInspiration[] = [];

  for (const sourceUrl of sources) {
    try {
      const response = await fetch(sourceUrl, {
        headers: {
          'User-Agent': 'Atelier Design Inspiration Crawler/1.0',
        },
        next: { revalidate: 60 * 60 * 12 },
      });

      if (!response.ok) continue;

      const html = await response.text();
      const imageUrl = extractMeta(html, 'og:image') || extractMeta(html, 'twitter:image');
      const title =
        extractMeta(html, 'og:title') ||
        html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ||
        new URL(sourceUrl).hostname;

      if (!imageUrl) continue;

      results.push({ title, imageUrl, sourceUrl });
    } catch {
      // Keep crawling other sources.
    }
  }

  return results;
}

export async function saveCrawledInspirations(
  supabase: any,
  inspirations: CrawledInspiration[]
) {
  const saved: unknown[] = [];

  for (const inspiration of inspirations) {
    const { data: existing } = await supabase
      .from('materials')
      .select('id')
      .eq('source_url', inspiration.sourceUrl)
      .maybeSingle();

    if (existing) continue;

    const { data, error } = await supabase
      .from('materials')
      .insert({
        title: inspiration.title,
        image_url: inspiration.imageUrl,
        source_url: inspiration.sourceUrl,
        metadata: {
          crawler: 'daily-inspiration',
          semantic_text: inspiration.title,
        },
      })
      .select()
      .single();

    if (!error && data) saved.push(data);
  }

  return saved;
}
