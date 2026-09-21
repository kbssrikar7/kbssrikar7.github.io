import type { Metadata } from 'next';
import { Section } from '@/components/sections/section';
import { ProjectGrid } from '@/components/project/project-grid';
import { allProjects, curatedMeta } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'RAG systems, cardiac MRI pipelines, cross-platform audio tooling, ESP32 fleets, and a self-hosted UPI gateway.',
};

export default function ProjectsPage() {
  return (
    <Section label="projects" title="Things I've built.">
      <ProjectGrid projects={allProjects} />

      <p className="mt-16 max-w-xl text-xs leading-relaxed text-muted-foreground/60">
        Ordering is scored at build time by a{' '}
        <a
          href="https://typesafe.ai"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-signal"
        >
          TypeSafe
        </a>{' '}
        System One model, then reviewed by hand. Ranked{' '}
        {curatedMeta.generatedAt.slice(0, 10)} with {curatedMeta.model}.
      </p>
    </Section>
  );
}
