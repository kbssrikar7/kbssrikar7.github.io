import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '@/components/site/icons';
import { GeneratedCover } from './generated-cover';
import type { Project } from '@/lib/projects';

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <article className="group relative flex flex-col">
      <Link
        href={`/projects/${project.slug}`}
        className="relative block overflow-hidden rounded-xl border border-border bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        aria-label={project.title}
      >
        {/* The full-width preview rectangle. Uniform 16:10 whether it is a real
            screenshot or a generated cover, so the grid never looks ragged. */}
        <div className="relative aspect-[1200/750] w-full">
          {project.preview ? (
            <Image
              src={project.preview}
              alt={`${project.title} interface`}
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
          <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-signal/30 bg-background/80 px-2.5 py-1 font-mono text-[10px] tracking-wide text-signal backdrop-blur">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
            </span>
            live
          </span>
        )}
      </Link>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-medium tracking-tight">
            <Link href={`/projects/${project.slug}`} className="hover:text-signal">
              {project.title}
            </Link>
          </h3>
          <div className="flex shrink-0 items-center gap-2 pt-0.5">
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

        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
          {project.tech.slice(0, 5).map((t) => (
            <span key={t} className="font-mono text-[11px] text-muted-foreground/70">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
