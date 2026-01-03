import { promises as fs } from 'fs';
import path from 'path';
import { CVData, StoredCV } from './types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data', 'cvs');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function saveCV(data: CVData): Promise<void> {
  await ensureDataDir();
  const stored: StoredCV = {
    slug: data.slug,
    data,
    createdAt: new Date().toISOString(),
  };
  const filePath = path.join(DATA_DIR, `${data.slug}.json`);
  await fs.writeFile(filePath, JSON.stringify(stored, null, 2));
}

export async function getCV(slug: string): Promise<CVData | null> {
  try {
    const filePath = path.join(DATA_DIR, `${slug}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    const stored: StoredCV = JSON.parse(content);
    return stored.data;
  } catch {
    return null;
  }
}

export async function cvExists(slug: string): Promise<boolean> {
  try {
    const filePath = path.join(DATA_DIR, `${slug}.json`);
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
