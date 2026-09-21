import type { Metadata } from 'next';
import { Section } from '@/components/sections/section';
import { ExperienceList } from '@/components/sections/experience-list';
import { education } from '@/data/profile';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Kubernetes and CI/CD for Wayship, a maritime SaaS platform running telemetry across 200+ vessels.',
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
          <p className="font-mono text-[11px] text-muted-foreground/70">{education.period}</p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{education.degree}</p>
        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground/55">
          {education.campus} · CGPA {education.cgpa}
        </p>
      </Section>
    </>
  );
}
