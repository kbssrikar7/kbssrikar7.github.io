import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '@/components/site/icons';
import { GeneratedCover } from './generated-cover';
import type { Project } from '@/lib/projects';

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <article className="group relative flex flex-col">
      {/* Not a link: the title below carries the single card-wide link, stretched
          over this with ::after. Two anchors to the same slug meant every card
          was announced twice and took two tab stops. */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card">
        {/* The full-width preview rectangle. Uniform 16:10 whether it is a real
            screenshot or a generated cover, so the grid never looks ragged. */}
        <div className="relative aspect-[1200/750] w-full">
          {project.preview ? (
            <Image
              src={project.preview}
              alt=""
              fill
              priority={priority}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <GeneratedCover project={project} />
          )}
        </div>

        {project.demoable && (
          <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-signal/30 bg-background/80 px-2.5 py-1 font-mono text-[13px] tracking-wide text-signal backdrop-blur">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
            </span>
            live
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-medium tracking-tight">
            <Link
              href={`/projects/${project.slug}`}
              className="rounded-sm hover:text-signal focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none after:absolute after:inset-0 after:content-['']"
            >
              {project.title}
            </Link>
          </h3>
          {/* z-10 lifts these above the title link's stretched ::after overlay. */}
          <div className="relative z-10 flex shrink-0 items-center gap-2 pt-0.5">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} source on GitHub`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <GithubIcon className="size-4" />
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} live demo`}
                className="text-muted-foreground transition-colors hover:text-signal"
              >
                <ArrowUpRight className="size-4" />
              </a>
            )}
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">{project.blurb}</p>

        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {project.tech.slice(0, 5).map((t) => (
            <span key={t} className="font-mono text-[13px] text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
