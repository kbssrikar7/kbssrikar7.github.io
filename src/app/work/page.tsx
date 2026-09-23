import type { Metadata } from 'next';
import { Section } from '@/components/sections/section';
import { ExperienceList } from '@/components/sections/experience-list';
import { education, profile } from '@/data/profile';

const title = 'Work';
const description =
  'Kubernetes and CI/CD for Wayship, a maritime SaaS platform running telemetry across 200+ vessels.';
const url = `${profile.siteUrl}/work/`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    siteName: 'kbs',
    type: 'website',
    locale: 'en_US',
  },
};

export default function WorkPage() {
  return (
    <>
      <Section label="work" title="Where I've shipped.">
        <ExperienceList detailed />
      </Section>

      <Section label="education">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-lg tracking-tight">{education.school}</h3>
          <p className="font-mono text-[13px] text-muted-foreground">{education.period}</p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{education.degree}</p>
        <p className="mt-1 font-mono text-[13px] text-muted-foreground">
          {education.campus} · CGPA {education.cgpa}
        </p>
      </Section>
    </>
  );
}
