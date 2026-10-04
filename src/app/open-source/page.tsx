import type { Metadata } from 'next';
import { Section } from '@/components/sections/section';
import { ContributionList } from '@/components/sections/contribution-list';
import { profile } from '@/data/profile';

const title = 'Open source contribution';
const description =
  'K.B.S Srikar’s merged contribution to Focuser: password and random-text unlocking across the Rust backend, CLI, and desktop UI.';
const url = `${profile.siteUrl}/open-source/`;

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

export default function OpenSourcePage() {
  return (
    <Section label="open source" title="Open source contribution">
      <ContributionList detailed headingLevel="h2" />
    </Section>
  );
}
