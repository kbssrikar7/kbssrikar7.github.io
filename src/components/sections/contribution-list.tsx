import { ArrowUpRight, GitMerge } from 'lucide-react';
import { contributions } from '@/data/contributions';

export function ContributionList({
  detailed = false,
  headingLevel = 'h3',
}: {
  detailed?: boolean;
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;
  const FeatureHeading = headingLevel === 'h2' ? 'h3' : 'h4';
  return (
    <div className="space-y-8">
      {contributions.map((contribution) => (
        <article
          key={contribution.pullRequestUrl}
          className="rounded-xl border border-border bg-card p-5 sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Heading className="text-2xl tracking-tight">
              <a
                href={contribution.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-signal"
              >
                {contribution.project}
              </a>
            </Heading>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/20 bg-signal/5 px-3 py-1 font-mono text-[13px] text-signal">
              <GitMerge aria-hidden="true" className="size-3.5" />
              merged · PR #{contribution.pullRequestNumber}
            </span>
          </div>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            {contribution.description}
          </p>

          <FeatureHeading className="mt-6 text-xl tracking-tight">{contribution.title}</FeatureHeading>
          <p className="mt-2 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {contribution.summary}
          </p>

          {detailed && (
            <ul className="mt-4 max-w-2xl space-y-2.5">
              {contribution.details.map((detail) => (
                <li
                  key={detail}
                  className="relative pl-4 text-base leading-relaxed text-muted-foreground before:absolute before:top-[0.6em] before:left-0 before:size-1 before:rounded-full before:bg-signal/50"
                >
                  {detail}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-border/60 pt-4">
            <div className="font-mono text-[13px] leading-relaxed text-muted-foreground">
              <p>{contribution.stack.join(' · ')}</p>
              <p className="mt-1">
                merged <time dateTime={contribution.mergedAt}>{contribution.mergedLabel}</time>
              </p>
            </div>
            <a
              href={contribution.pullRequestUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${contribution.project} pull request #${contribution.pullRequestNumber}`}
              className="group inline-flex items-center gap-1.5 font-mono text-sm text-signal transition-opacity hover:opacity-80"
            >
              view contribution
              <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
