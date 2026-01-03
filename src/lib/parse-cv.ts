import Anthropic from '@anthropic-ai/sdk';
import { CVData } from './types';
import { v4 as uuidv4 } from 'uuid';

const anthropic = new Anthropic();

function detectLanguage(text: string): 'en' | 'he' {
  const hebrewPattern = /[\u0590-\u05FF]/;
  const hebrewMatches = (text.match(hebrewPattern) || []).length;
  const totalChars = text.replace(/\s/g, '').length;
  return hebrewMatches / totalChars > 0.3 ? 'he' : 'en';
}

export async function parseCVWithAI(
  pdfText: string,
  userPrompt: string
): Promise<CVData> {
  const language = detectLanguage(pdfText);
  const slug = uuidv4().slice(0, 8);

  const systemPrompt = `You are a CV/resume parser that extracts structured data and generates infographic-ready content.
Your task is to:
1. Extract all relevant information from the CV
2. Structure it according to the JSON schema
3. Apply the user's style preferences to generate appropriate styleHints
4. Respond ONLY with valid JSON, no markdown or explanation

The CV is in ${language === 'he' ? 'Hebrew' : 'English'}. Keep all extracted text in its original language.

JSON Schema:
{
  "profile": {
    "name": "string",
    "title": "string (professional title/headline)",
    "email": "string or null",
    "phone": "string or null",
    "location": "string or null",
    "linkedin": "string or null",
    "website": "string or null",
    "summary": "string (2-3 sentence professional summary) or null"
  },
  "experience": [
    {
      "company": "string",
      "role": "string",
      "period": "string (e.g., '2020 - Present')",
      "highlights": ["string (key achievement or responsibility)"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "period": "string",
      "details": "string or null"
    }
  ],
  "skills": [
    {
      "category": "string (e.g., 'Programming', 'Languages', 'Tools')",
      "items": ["string"]
    }
  ],
  "languages": [
    {
      "language": "string",
      "level": "string"
    }
  ],
  "certifications": ["string"] or null,
  "styleHints": {
    "primaryColor": "string (hex color based on user preference, e.g., #3B82F6 for professional blue)",
    "layout": "timeline | cards | minimal | modern",
    "emphasis": ["string (sections to emphasize based on user prompt)"]
  }
}`;

  const userMessage = `Here is the CV text:
---
${pdfText}
---

User's preferences for the infographic:
${userPrompt || 'Create a clean, professional infographic'}

Extract the CV data and generate appropriate styleHints based on the preferences. Return only valid JSON.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: userMessage,
      },
    ],
    system: systemPrompt,
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  let jsonText = content.text.trim();

  // Remove markdown code blocks if present
  if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
  }

  const parsed = JSON.parse(jsonText);

  return {
    slug,
    language,
    userPrompt,
    createdAt: new Date().toISOString(),
    ...parsed,
  };
}
