import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '@/components/site/icons';
import { GeneratedCover } from '@/components/project/generated-cover';
import { allProjects, getProject, BUCKET_LABELS } from '@/lib/projects';

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.blurb,
    openGraph: { title: project.title, description: project.blurb },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <Link
        href="/projects"
        className="group inline-flex items-center gap-1.5 font-mono text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        projects
      </Link>

      <header className="mt-8">
        <p className="font-mono text-[13px] tracking-[0.2em] text-muted-foreground uppercase">
          {BUCKET_LABELS[project.bucket]}
        </p>
        <h1 className="mt-4 text-3xl tracking-tight sm:text-4xl">{project.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {project.blurb}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              live demo
              <ArrowUpRight className="size-4" />
            </a>
          )}
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm transition-colors hover:border-signal/40 hover:text-signal"
          >
            <GithubIcon className="size-4" />
            source
          </a>
        </div>

        {project.liveNote && (
          <p className="mt-4 font-mono text-[13px] text-muted-foreground">{project.liveNote}</p>
        )}
      </header>

      <div className="relative mt-12 aspect-[1200/750] w-full overflow-hidden rounded-xl border border-border bg-card">
        {project.preview ? (
          <Image
            src={project.preview}
            alt={`${project.title} interface`}
            fill
            priority
            sizes="(min-width: 1024px) 64rem, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <GeneratedCover project={project} />
        )}
      </div>

      <div className="mt-12 grid gap-10 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <h2 className="font-mono text-[13px] tracking-[0.2em] text-muted-foreground uppercase">
            about
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{project.detail}</p>

          {project.metrics && (
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {project.metrics.map((m) => (
                <div key={m.label}>
                  <p className="font-mono text-xl tracking-tight text-signal">{m.value}</p>
                  <p className="mt-1 font-mono text-[13px] tracking-wide text-muted-foreground uppercase">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-mono text-[13px] tracking-[0.2em] text-muted-foreground uppercase">
            stack
          </h2>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <li
                key={t}
                className="rounded-md border border-border/70 px-2 py-0.5 font-mono text-[13px] text-muted-foreground"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
