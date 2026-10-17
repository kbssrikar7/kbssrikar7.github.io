import Link from 'next/link';
import { Hero } from '@/components/sections/hero';
import { Section } from '@/components/sections/section';
import { ExperienceList } from '@/components/sections/experience-list';
import { ContributionList } from '@/components/sections/contribution-list';
import { ContributionGraph } from '@/components/sections/contribution-graph';
import { TechCapsules } from '@/components/sections/tech-capsules';
import { CopyEmail } from '@/components/sections/copy-email';
import { ProjectCard } from '@/components/project/project-card';
import { featuredProjects } from '@/lib/projects';
import { profile } from '@/data/profile';
import { jsonLdString, personJsonLd } from '@/lib/structured-data';

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(personJsonLd()) }} />
      <Hero />

      <Section id="work" label="experience" more={{ href: '/work', label: 'full history' }}>
        <ExperienceList />
      </Section>

      <Section id="activity" label="github activity">
        <ContributionGraph />
      </Section>

      <Section
        id="open-source"
        label="open source contributions"
        more={{ href: '/open-source/', label: 'more details' }}
      >
        <ContributionList />
      </Section>

      <Section
        id="projects"
        label="selected projects"
        more={{ href: '/projects', label: 'all projects' }}
      >
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
          {featuredProjects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </Section>

      <Section id="stack" label="stack">
        <TechCapsules />
      </Section>

      <Section id="contact" label="contact">
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
          Want to talk about any of the work above? My inbox is always open.
        </p>

        <div className="mt-8">
          <CopyEmail email={profile.email} />
        </div>

        <p className="mt-8 font-mono text-sm text-muted-foreground">
          {/* The shortcut hint is meaningless on a phone - there is no keyboard. */}
          <span className="hidden sm:inline">
            press{' '}
            <kbd className="rounded border border-border px-1 py-px text-foreground">⌘K</kbd> to
            search, or{' '}
          </span>
          <Link href="/projects" className="underline underline-offset-2 hover:text-signal">
            browse everything
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
