import { notFound } from 'next/navigation';
import { getCV } from '@/lib/storage';
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
  const primaryColor = cvData.styleHints?.primaryColor || '#2563eb';

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen py-10 px-4"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <div className="max-w-[1200px] mx-auto">
        {/* Header Card */}
        <header className="bg-white rounded-[20px] p-8 md:p-10 mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">
                {cvData.profile.name}
              </h1>
              <p className="text-xl font-medium mb-5" style={{ color: primaryColor }}>
                {cvData.profile.title}
              </p>
              <div className="flex flex-wrap gap-3">
                {cvData.profile.email && (
                  <ContactPill icon={<EmailIcon />} text={cvData.profile.email} />
                )}
                {cvData.profile.phone && (
                  <ContactPill icon={<PhoneIcon />} text={cvData.profile.phone} />
                )}
                {cvData.profile.location && (
                  <ContactPill icon={<LocationIcon />} text={cvData.profile.location} />
                )}
                {cvData.profile.linkedin && (
                  <a href={cvData.profile.linkedin} target="_blank" rel="noopener noreferrer">
                    <ContactPill icon={<LinkedInIcon />} text="LinkedIn" />
                  </a>
                )}
              </div>
            </div>
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, #0891b2)`,
                boxShadow: `0 10px 30px ${primaryColor}50`
              }}
            >
              {cvData.profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          </div>

          {cvData.profile.summary && (
            <p className="mt-6 text-slate-600 leading-relaxed text-[0.95rem]">
              {cvData.profile.summary}
            </p>
          )}
        </header>

        {/* Stats Section */}
        {cvData.experience && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            <StatCard
              number={`${cvData.experience.length}+`}
              label={isRTL ? 'תפקידים' : 'Positions'}
              color={primaryColor}
            />
            {cvData.skills && (
              <StatCard
                number={`${cvData.skills.reduce((acc, s) => acc + s.items.length, 0)}`}
                label={isRTL ? 'כישורים' : 'Skills'}
                color={primaryColor}
              />
            )}
            {cvData.languages && (
              <StatCard
                number={`${cvData.languages.length}`}
                label={isRTL ? 'שפות' : 'Languages'}
                color={primaryColor}
              />
            )}
            {cvData.education && (
              <StatCard
                number={`${cvData.education.length}`}
                label={isRTL ? 'תארים' : 'Degrees'}
                color={primaryColor}
              />
            )}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          {/* Timeline Section */}
          <div className="bg-white rounded-[20px] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            <SectionTitle title={isRTL ? 'ניסיון תעסוקתי' : 'Career Journey'} />

            <div className={`relative ${isRTL ? 'pr-8' : 'pl-8'}`}>
              {/* Timeline line */}
              <div
                className={`absolute ${isRTL ? 'right-[6px]' : 'left-[6px]'} top-0 bottom-0 w-[3px] rounded`}
                style={{ background: `linear-gradient(to bottom, ${primaryColor}, #0891b2, #f59e0b)` }}
              />

              {cvData.experience?.map((exp, index) => (
                <div key={index} className="relative pb-8 last:pb-0">
                  {/* Timeline dot */}
                  <div
                    className={`absolute ${isRTL ? '-right-8' : '-left-8'} top-1 w-4 h-4 rounded-full border-[3px] bg-white z-10`}
                    style={{ borderColor: primaryColor }}
                  />

                  <div className="mb-2">
                    <span className="text-sm font-semibold" style={{ color: primaryColor }}>
                      {exp.period}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">{exp.role}</h3>
                  <p className="text-[#0891b2] mb-2">{exp.company}</p>

                  {exp.highlights && exp.highlights.length > 0 && (
                    <p className="text-slate-500 text-sm leading-relaxed mb-3">
                      {exp.highlights[0]}
                    </p>
                  )}

                  {exp.highlights && exp.highlights.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.highlights.slice(1, 4).map((h, i) => (
                        <span
                          key={i}
                          className="text-white text-xs px-3 py-1 rounded-full"
                          style={{ background: `linear-gradient(135deg, ${primaryColor}, #0891b2)` }}
                        >
                          {h.length > 20 ? h.substring(0, 20) + '...' : h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Education */}
            {cvData.education && cvData.education.length > 0 && (
              <div className="bg-white rounded-[20px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                <SectionTitle title={isRTL ? 'השכלה' : 'Education'} />
                <div className="space-y-5">
                  {cvData.education.map((edu, index) => (
                    <div key={index} className="flex gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}, #0891b2)` }}
                      >
                        {edu.institution.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{edu.degree}</p>
                        <p className="text-[#0891b2] text-sm">{edu.institution}</p>
                        <p className="text-slate-400 text-sm">{edu.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {cvData.languages && cvData.languages.length > 0 && (
              <div className="bg-white rounded-[20px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                <SectionTitle title={isRTL ? 'שפות' : 'Languages'} />
                <div className="flex flex-wrap gap-3">
                  {cvData.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="text-white px-5 py-2 rounded-full font-medium"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
                    >
                      {lang.language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {cvData.skills && cvData.skills.length > 0 && (
              <div className="bg-white rounded-[20px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                <SectionTitle title={isRTL ? 'כישורים' : 'Expertise'} />
                <div className="grid grid-cols-2 gap-2">
                  {cvData.skills.flatMap(s => s.items).slice(0, 8).map((skill, index) => (
                    <div
                      key={index}
                      className="bg-slate-50 px-4 py-3 rounded-lg text-sm text-slate-700 text-center hover:bg-blue-600 hover:text-white transition-colors cursor-default"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {cvData.certifications && cvData.certifications.length > 0 && (
              <div className="bg-white rounded-[20px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                <SectionTitle title={isRTL ? 'הסמכות' : 'Certifications'} />
                <ul className="space-y-3">
                  {cvData.certifications.map((cert, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-700 text-sm border-b border-slate-100 pb-3 last:border-0">
                      <span style={{ color: primaryColor }} className="font-bold">&gt;</span>
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-white/60 text-sm">
          {isRTL ? 'נוצר באמצעות' : 'Generated with'}{' '}
          <span className="font-medium text-white/80">CV Infographic</span>
        </footer>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
      <span
        className="w-1 h-7 rounded"
        style={{ background: 'linear-gradient(to bottom, #2563eb, #0891b2)' }}
      />
      {title}
    </h2>
  );
}

function StatCard({ number, label, color }: { number: string; label: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 text-center shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-transform">
      <div className="text-3xl font-bold" style={{ color }}>{number}</div>
      <div className="text-slate-500 text-sm mt-1">{label}</div>
    </div>
  );
}

function ContactPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full text-sm text-slate-700 hover:bg-blue-600 hover:text-white transition-colors cursor-default">
      {icon}
      {text}
    </div>
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
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
