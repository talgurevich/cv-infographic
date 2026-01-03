import { NextRequest, NextResponse } from 'next/server';
import { getCV } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const cvData = await getCV(slug);

  if (!cvData) {
    return NextResponse.json(
      { error: 'CV not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(cvData);
}
