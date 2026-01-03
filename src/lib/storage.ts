import { kv } from '@vercel/kv';
import { CVData, StoredCV } from './types';

const CV_PREFIX = 'cv:';

export async function saveCV(data: CVData): Promise<void> {
  const stored: StoredCV = {
    slug: data.slug,
    data,
    createdAt: new Date().toISOString(),
  };
  await kv.set(`${CV_PREFIX}${data.slug}`, stored);
}

export async function getCV(slug: string): Promise<CVData | null> {
  try {
    const stored = await kv.get<StoredCV>(`${CV_PREFIX}${slug}`);
    return stored?.data || null;
  } catch {
    return null;
  }
}

export async function cvExists(slug: string): Promise<boolean> {
  try {
    const exists = await kv.exists(`${CV_PREFIX}${slug}`);
    return exists > 0;
  } catch {
    return false;
  }
}
