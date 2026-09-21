import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { experience } from '@/data/experience';

export function ExperienceList({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="space-y-12">
      {experience.map((job) => (
        <article key={job.company} className="relative pl-5 sm:pl-6">
          {/* Single hairline rail - with one role, a heavy timeline looks thin. */}
          <span
            aria-hidden
            className="absolute top-1.5 bottom-0 left-0 w-px bg-gradient-to-b from-signal/50 via-border to-transparent"
          />
          <span
            aria-hidden
            className="absolute top-1.5 -left-[3px] size-[7px] rounded-full bg-signal"
          />

          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-lg tracking-tight">
              {job.companyUrl ? (
                <a
                  href={job.companyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-signal"
                >
                  {job.company}
                </a>
              ) : (
                job.company
              )}
            </h3>
            <p className="font-mono text-[11px] text-muted-foreground/70">{job.period}</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{job.role}</p>
          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground/55">{job.location}</p>

          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
            {job.metrics.map((m) => (
              <div key={m.label}>
                <p className="font-mono text-xl tracking-tight text-signal">{m.value}</p>
                <p className="mt-0.5 font-mono text-[10px] tracking-wide text-muted-foreground/60 uppercase">
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          {job.product && (
            <a
              href={job.product.url}
              target="_blank"
              rel="noreferrer"
              className="group/product mt-7 block max-w-3xl overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-signal/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <div className="relative aspect-[1200/750] w-full">
                <Image
                  src={job.product.preview}
                  alt={`${job.product.name} product page`}
                  fill
                  sizes="(min-width: 640px) 42rem, 100vw"
                  className="object-cover object-top transition-transform duration-500 group-hover/product:scale-[1.02]"
                />
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-border/60 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm">
                    {job.product.name}
                    <span className="ml-2 font-mono text-[11px] text-muted-foreground/60">
                      the product I worked on
                    </span>
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {job.product.tagline}
                  </p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover/product:text-signal" />
              </div>
            </a>
          )}

          {detailed && (
            <>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {job.summary}
              </p>
              <ul className="mt-4 max-w-2xl space-y-2.5">
                {job.bullets.map((b) => (
                  <li
                    key={b}
                    className="relative pl-4 text-sm leading-relaxed text-muted-foreground before:absolute before:top-[0.6em] before:left-0 before:size-1 before:rounded-full before:bg-muted-foreground/40"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </>
          )}
        </article>
      ))}
    </div>
  );
}
