import { notFound } from 'next/navigation';
import { getCV } from '@/lib/storage';
import { CVData } from '@/lib/types';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cvData = await getCV(slug);

  if (!cvData) {
    return { title: 'CV Not Found' };
  }

  return {
    title: `${cvData.profile.name} - CV Infographic`,
    description: cvData.profile.summary || `Professional CV of ${cvData.profile.name}`,
  };
}

export default async function CVPage({ params }: PageProps) {
  const { slug } = await params;
  const cvData = await getCV(slug);

  if (!cvData) {
    notFound();
  }

  const isRTL = cvData.language === 'he';
  const primaryColor = cvData.styleHints?.primaryColor || '#3B82F6';

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"
      style={{ '--primary-color': primaryColor } as React.CSSProperties}
    >
      {/* Header */}
      <header
        className="text-white py-12 px-4"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {cvData.profile.name}
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            {cvData.profile.title}
          </p>
          {cvData.profile.summary && (
            <p className="mt-4 text-lg opacity-80 max-w-2xl">
              {cvData.profile.summary}
            </p>
          )}
          <div className="flex flex-wrap gap-4 mt-6 text-sm">
            {cvData.profile.email && (
              <span className="flex items-center gap-1">
                <EmailIcon />
                {cvData.profile.email}
              </span>
            )}
            {cvData.profile.phone && (
              <span className="flex items-center gap-1">
                <PhoneIcon />
                {cvData.profile.phone}
              </span>
            )}
            {cvData.profile.location && (
              <span className="flex items-center gap-1">
                <LocationIcon />
                {cvData.profile.location}
              </span>
            )}
            {cvData.profile.linkedin && (
              <a
                href={cvData.profile.linkedin}
                className="flex items-center gap-1 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4">
        {/* Experience Section */}
        {cvData.experience && cvData.experience.length > 0 && (
          <Section title={isRTL ? 'ניסיון תעסוקתי' : 'Experience'} isRTL={isRTL}>
            <div className="space-y-6">
              {cvData.experience.map((exp, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-sm border-l-4"
                  style={{ borderColor: primaryColor }}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {exp.role}
                      </h3>
                      <p className="text-lg text-slate-600">{exp.company}</p>
                    </div>
                    <span className="text-sm text-slate-500 whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {exp.highlights.map((highlight, hIndex) => (
                        <li
                          key={hIndex}
                          className="text-slate-700 flex items-start gap-2"
                        >
                          <span
                            className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: primaryColor }}
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Education Section */}
        {cvData.education && cvData.education.length > 0 && (
          <Section title={isRTL ? 'השכלה' : 'Education'} isRTL={isRTL}>
            <div className="grid gap-4 md:grid-cols-2">
              {cvData.education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-5 shadow-sm"
                >
                  <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
                  <p className="text-slate-600">{edu.institution}</p>
                  <p className="text-sm text-slate-500 mt-1">{edu.period}</p>
                  {edu.details && (
                    <p className="text-sm text-slate-600 mt-2">{edu.details}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Skills Section */}
        {cvData.skills && cvData.skills.length > 0 && (
          <Section title={isRTL ? 'כישורים' : 'Skills'} isRTL={isRTL}>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                {cvData.skills.map((skillGroup, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-slate-700 mb-2">
                      {skillGroup.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill, sIndex) => (
                        <span
                          key={sIndex}
                          className="px-3 py-1 rounded-full text-sm text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* Languages Section */}
        {cvData.languages && cvData.languages.length > 0 && (
          <Section title={isRTL ? 'שפות' : 'Languages'} isRTL={isRTL}>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-wrap gap-4">
                {cvData.languages.map((lang, index) => (
                  <div key={index} className="text-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {lang.language.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="mt-2 font-medium text-slate-900">
                      {lang.language}
                    </p>
                    <p className="text-sm text-slate-500">{lang.level}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* Certifications Section */}
        {cvData.certifications && cvData.certifications.length > 0 && (
          <Section title={isRTL ? 'הסמכות' : 'Certifications'} isRTL={isRTL}>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <ul className="space-y-2">
                {cvData.certifications.map((cert, index) => (
                  <li key={index} className="flex items-center gap-2 text-slate-700">
                    <CertIcon color={primaryColor} />
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-400 text-sm">
        <p>
          {isRTL ? 'נוצר באמצעות' : 'Generated with'}{' '}
          <span className="font-medium">CV Infographic</span>
        </p>
      </footer>
    </div>
  );
}

function Section({
  title,
  children,
  isRTL,
}: {
  title: string;
  children: React.ReactNode;
  isRTL: boolean;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span
          className="w-1 h-8 rounded"
          style={{ backgroundColor: 'var(--primary-color)' }}
        />
        {title}
      </h2>
      {children}
    </section>
  );
}

function EmailIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

function CertIcon({ color }: { color: string }) {
  return (
    <svg className="w-5 h-5" fill={color} viewBox="0 0 24 24">
      <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.18l6.9 3.82L12 11.82 5.1 8 12 4.18zM5 9.82l6 3.33v6.67l-6-3.33V9.82zm8 10v-6.67l6-3.33v6.67l-6 3.33z"/>
    </svg>
  );
}
