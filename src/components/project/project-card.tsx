import Image from 'next/image';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '@/components/site/icons';
import { GeneratedCover } from './generated-cover';
import { CursorGlow } from '@/components/ui/cursor-glow';
import { ScrambleText } from '@/components/ui/scramble-text';
import { BUCKET_LABELS, type Project } from '@/lib/projects';

/** What the frame's address bar shows: the live host, else the repo path. */
function addressFor(project: Project): string {
  if (project.liveUrl) return new URL(project.liveUrl).host;
  return `github.com/kbssrikar7/${project.slug}`;
}

export function ProjectCard({
  project,
  index,
  priority = false,
  headingLevel = 'h3',
}: {
  project: Project;
  /** 0-based position in the list, shown as 01, 02, ... */
  index: number;
  priority?: boolean;
  /** h3 under a section's h2 (home); h2 directly under the page h1 (/projects). */
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;
  // The headline number. Some metrics are words ("multi-modal"); those stay
  // on the project page rather than posing as a figure here.
  const metric = project.metrics?.find((m) => /^[<>~]?\d/.test(m.value));

  return (
    <article className="group relative flex flex-col">
      {/* Not a link: the title below carries the single card-wide link, stretched
          over this with ::after. Two anchors to the same slug meant every card
          was announced twice and took two tab stops.

          The panel is tinted with the project's own hue (shared with its OG
          card), and every screenshot sits in the same browser frame - so six
          apps with six different palettes read as one set. */}
      <div
        className="relative aspect-[16/11] overflow-hidden rounded-xl border border-border transition-colors duration-500 group-hover:border-foreground/20"
        style={{
          background: `radial-gradient(ellipse 90% 75% at 50% 0%, oklch(0.62 0.13 ${project.hue} / 0.22), transparent 70%), oklch(0.17 0 0)`,
        }}
      >
        <CursorGlow />

        <div className="absolute inset-x-5 top-4 flex h-6 items-center justify-between gap-3">
          <p className="font-mono text-[13px] tracking-wide text-muted-foreground">
            <span className="text-foreground">{String(index + 1).padStart(2, '0')}</span>
            {' · '}
            {BUCKET_LABELS[project.bucket]}
          </p>
          {project.demoable && (
            <span className="flex items-center gap-1.5 rounded-full border border-signal/30 bg-background/70 px-2.5 py-0.5 font-mono text-[13px] tracking-wide text-signal backdrop-blur">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
              </span>
              live
            </span>
          )}
        </div>

        {/* The frame: inset from the sides, cropped by the panel's bottom edge. */}
        <div className="absolute inset-x-[7%] top-14 overflow-hidden rounded-lg border border-white/10 bg-background shadow-[0_24px_60px_-20px_rgb(0_0_0/0.8)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
          <div className="flex h-7 items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3">
            <span className="flex gap-1" aria-hidden>
              <span className="size-2 rounded-full bg-white/15" />
              <span className="size-2 rounded-full bg-white/15" />
              <span className="size-2 rounded-full bg-white/15" />
            </span>
            <span className="truncate font-mono text-[11px] text-muted-foreground">
              {addressFor(project)}
            </span>
          </div>
          {/* Shares a name with the project page's hero image: on navigation the
              screenshot morphs from this frame into it. */}
          <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
            <div className="relative aspect-[1200/750] w-full">
              {project.preview ? (
                <Image
                  src={project.thumb ?? project.preview}
                  alt=""
                  fill
                  priority={priority}
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover object-top"
                />
              ) : (
                <GeneratedCover project={project} framed />
              )}
            </div>
          </ViewTransition>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <Heading className="text-lg font-medium tracking-tight">
            <Link
              href={`/projects/${project.slug}`}
              className="rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none after:absolute after:inset-0 after:content-['']"
            >
              {project.title}
            </Link>
          </Heading>
          {/* z-10 lifts these above the title link's stretched ::after overlay. */}
          <div className="relative z-10 flex shrink-0 items-center gap-2 pt-0.5">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} source on GitHub`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <GithubIcon className="size-[18px]" />
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} live demo`}
                className="text-muted-foreground transition-colors hover:text-signal"
              >
                <ArrowUpRight className="size-[18px]" />
              </a>
            )}
          </div>
        </div>

        {metric && (
          <p className="flex items-baseline gap-2">
            <span className="font-mono text-2xl tracking-tight text-foreground">{metric.value}</span>
            <span className="font-mono text-[13px] tracking-wide text-muted-foreground uppercase">
              {metric.label}
            </span>
          </p>
        )}

        <p className="text-[15px] leading-relaxed text-muted-foreground">{project.blurb}</p>

        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {project.tech.slice(0, 5).map((t, i) => (
            <ScrambleText
              key={t}
              text={t}
              trigger="view"
              replayOnHover="article"
              delay={i * 90}
              duration={500}
              className="font-mono text-[13px] text-muted-foreground"
            />
          ))}
        </div>
      </div>
    </article>
  );
}
