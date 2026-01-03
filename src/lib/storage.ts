import { createClient } from '@supabase/supabase-js';
import { CVData } from './types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function saveCV(data: CVData): Promise<void> {
  const { error } = await supabase.from('cvs').insert({
    slug: data.slug,
    data: data,
    created_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`Failed to save CV: ${error.message}`);
  }
}

export async function getCV(slug: string): Promise<CVData | null> {
  const { data, error } = await supabase
    .from('cvs')
    .select('data')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data.data as CVData;
}

export async function cvExists(slug: string): Promise<boolean> {
  const { data } = await supabase
    .from('cvs')
    .select('slug')
    .eq('slug', slug)
    .single();

  return !!data;
}
