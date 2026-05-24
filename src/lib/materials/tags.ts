import { slugify } from '@/lib/utils';

export async function syncMaterialTags(
  supabase: any,
  materialId: string,
  tagNames: string[]
) {
  const cleanNames = Array.from(
    new Set(tagNames.map((tag) => tag.trim()).filter(Boolean).slice(0, 12))
  );

  if (!cleanNames.length) return [];

  const tags: { id: string; name: string; slug: string }[] = [];

  for (const name of cleanNames) {
    const slug = slugify(name);
    const { data, error } = await supabase
      .from('tags')
      .upsert({ name, slug }, { onConflict: 'slug' })
      .select()
      .single();

    if (!error && data) tags.push(data);
  }

  if (!tags.length) return [];

  await supabase.from('material_tags').upsert(
    tags.map((tag) => ({ material_id: materialId, tag_id: tag.id })),
    { onConflict: 'material_id,tag_id' }
  );

  return tags;
}
