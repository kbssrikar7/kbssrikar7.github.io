import type { Metadata } from 'next';
import { Section } from '@/components/sections/section';
import { ProjectGrid } from '@/components/project/project-grid';
import { allProjects, curatedMeta } from '@/lib/projects';
import { profile } from '@/data/profile';

const title = 'Projects';
const description =
  'RAG systems, cardiac MRI pipelines, cross-platform audio tooling, ESP32 fleets, and a self-hosted UPI gateway.';
const url = `${profile.siteUrl}/projects/`;

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

export default function ProjectsPage() {
  return (
    <Section label="projects" title="Things I've built.">
      <ProjectGrid projects={allProjects} />

      <p className="mt-12 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        Projects are ranked at build time by a{' '}
        <a
          href="https://typesafe.ai"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-signal"
        >
          TypeSafe
        </a>{' '}
        System One model, then reviewed by hand. Last ranked on{' '}
        {curatedMeta.generatedAt.slice(0, 10)} with {curatedMeta.model}.
      </p>
    </Section>
  );
}
