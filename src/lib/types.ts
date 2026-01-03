export interface CVData {
  slug: string;
  language: 'en' | 'he';
  userPrompt: string;
  createdAt: string;
  profile: {
    name: string;
    title: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
    summary?: string;
  };
  experience: Array<{
    company: string;
    role: string;
    period: string;
    highlights: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    period: string;
    details?: string;
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  languages?: Array<{
    language: string;
    level: string;
  }>;
  certifications?: string[];
  styleHints: {
    primaryColor: string;
    layout: 'timeline' | 'cards' | 'minimal' | 'modern';
    emphasis: string[];
  };
}

export interface StoredCV {
  slug: string;
  data: CVData;
  createdAt: string;
}
