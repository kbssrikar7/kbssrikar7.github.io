import type { Metadata } from 'next';
import { Section } from '@/components/sections/section';
import { ContributionList } from '@/components/sections/contribution-list';
import { profile } from '@/data/profile';

const title = 'Open source contributions';
const description =
  'K.B.S Srikar’s merged contributions to Focuser, a Rust app blocker: password and random-text unlocking, and hidden CLI password prompts.';
const url = `${profile.siteUrl}/open-source/`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    siteName: profile.name,
    type: 'website',
    locale: 'en_US',
  },
};

export default function OpenSourcePage() {
  return (
    <Section label="open source" title="Open source contributions">
      <ContributionList detailed headingLevel="h2" />
    </Section>
  );
}
