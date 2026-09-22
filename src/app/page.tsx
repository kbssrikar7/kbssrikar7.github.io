import Link from 'next/link';
import { Mail } from 'lucide-react';
import { SOCIAL_ICONS } from '@/components/site/social-links';
import { Hero } from '@/components/sections/hero';
import { Section } from '@/components/sections/section';
import { ExperienceList } from '@/components/sections/experience-list';
import { ProjectCard } from '@/components/project/project-card';
import { featuredProjects } from '@/lib/projects';
import { profile, socials, stack } from '@/data/profile';

export default function Home() {
  return (
    <>
      <Hero />

      <Section id="work" label="experience" more={{ href: '/work', label: 'full history' }}>
        <ExperienceList />
      </Section>

      <Section
        id="projects"
        label="selected projects"
        more={{ href: '/projects', label: 'all projects' }}
      >
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
          {featuredProjects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} priority={i < 2} />
          ))}
        </div>
      </Section>

      <Section id="stack" label="stack">
        <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
          {stack.map((group) => (
            <div key={group.label}>
              <dt className="font-mono text-[13px] tracking-[0.16em] text-muted-foreground uppercase">
                {group.label}
              </dt>
              <dd className="mt-4 flex flex-wrap gap-x-2 gap-y-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-border/70 px-2 py-0.5 font-mono text-[13px] text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="contact" label="contact">
        <p className="max-w-xl leading-relaxed text-muted-foreground">
          If you want to talk about any of the work above, my inbox is open.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
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
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm transition-colors hover:border-signal/40 hover:text-signal"
              >
                <Icon className="size-4" />
                {s.label}
              </a>
            );
          })}
        </div>

        <p className="mt-8 font-mono text-[13px] text-muted-foreground">
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
