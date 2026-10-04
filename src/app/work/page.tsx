import type { Metadata } from 'next';
import { Section } from '@/components/sections/section';
import { ExperienceList } from '@/components/sections/experience-list';
import { profile } from '@/data/profile';

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
    <Section label="work" title="Where I've shipped.">
      <ExperienceList detailed headingLevel="h2" />
    </Section>
  );
}
