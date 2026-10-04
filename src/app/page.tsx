import Link from 'next/link';
import { Mail } from 'lucide-react';
import { SOCIAL_ICONS } from '@/components/site/social-links';
import { Hero } from '@/components/sections/hero';
import { Section } from '@/components/sections/section';
import { ExperienceList } from '@/components/sections/experience-list';
import { ContributionList } from '@/components/sections/contribution-list';
import { ProjectCard } from '@/components/project/project-card';
import { featuredProjects } from '@/lib/projects';
import { profile, socials, stack } from '@/data/profile';
import { jsonLdString, personJsonLd } from '@/lib/structured-data';

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(personJsonLd()) }} />
      <Hero />

      <Section id="work" label="experience" more={{ href: '/work', label: 'full history' }}>
        <ExperienceList />
      </Section>

      <Section
        id="open-source"
        label="open source contribution"
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
        {/* Plain rows, not a wall of chips: 38 bordered tags read as a
            keyword dump, a label and a line read as a spec sheet. */}
        <dl className="-mt-4 divide-y divide-border/60 border-b border-border/60">
          {stack.map((group) => (
            <div key={group.label} className="grid gap-x-8 gap-y-1 py-4 sm:grid-cols-[12rem_1fr]">
              <dt className="font-mono text-sm tracking-[0.16em] text-muted-foreground uppercase">
                {group.label}
              </dt>
              <dd className="text-base leading-relaxed text-foreground/90">
                {group.items.join(' · ')}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="contact" label="contact">
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
          Want to talk about any of the work above? My inbox is always open.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-base font-medium text-background transition-opacity hover:opacity-90"
          >
            <Mail className="size-4" />
            {profile.email}
          </a>
          {socials.map((s) => {
            const Icon = SOCIAL_ICONS[s.key];
            return (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-base transition-colors hover:border-signal/40 hover:text-signal"
              >
                <Icon className="size-4" />
                {s.label}
              </a>
            );
          })}
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
