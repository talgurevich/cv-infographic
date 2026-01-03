import { NextRequest, NextResponse } from 'next/server';
import { parseCVWithAI } from '@/lib/parse-cv';
import { saveCV } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;
    const userPrompt = formData.get('prompt') as string || '';

    if (!file) {
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Convert file to buffer and extract text
    const bytes = await file.arrayBuffer();
    const uint8Array = new Uint8Array(bytes);

    // Use unpdf for PDF text extraction
    const { extractText } = await import('unpdf');
    const { text: pdfTextArray } = await extractText(uint8Array);
    const pdfText = pdfTextArray.join('\n');

    if (!pdfText || pdfText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF. The file may be image-based or corrupted.' },
        { status: 400 }
      );
    }

    // Parse CV with AI
    const cvData = await parseCVWithAI(pdfText, userPrompt);

    // Save to storage
    await saveCV(cvData);

    return NextResponse.json({
      success: true,
      slug: cvData.slug,
      url: `/cv/${cvData.slug}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process CV. Please try again.' },
      { status: 500 }
    );
  }
}
