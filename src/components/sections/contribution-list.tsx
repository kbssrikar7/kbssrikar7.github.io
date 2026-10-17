import { ArrowUpRight, GitMerge } from 'lucide-react';
import { contributions } from '@/data/contributions';

type Contribution = (typeof contributions)[number];

/** One card per project, newest PR first: two PRs to the same repo used to be
    two near-identical cards repeating the project name and description. */
function byProject(list: readonly Contribution[]) {
  const groups = new Map<string, Contribution[]>();
  for (const c of list) groups.set(c.project, [...(groups.get(c.project) ?? []), c]);
  return [...groups.values()].map((prs) => [...prs].sort((a, b) => b.mergedAt.localeCompare(a.mergedAt)));
}

export function ContributionList({
  detailed = false,
  headingLevel = 'h3',
}: {
  detailed?: boolean;
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;
  const PrHeading = headingLevel === 'h2' ? 'h3' : 'h4';
  return (
    <div className="space-y-8">
      {byProject(contributions).map((prs) => {
        const { project, repositoryUrl, description } = prs[0];
        return (
          <article key={project} data-reveal suppressHydrationWarning className="rounded-xl border border-border bg-card p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Heading className="text-2xl tracking-tight">
                <a href={repositoryUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-signal">
                  {project}
                </a>
              </Heading>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/20 bg-signal/5 px-3 py-1 font-mono text-[13px] text-signal">
                <GitMerge aria-hidden="true" className="size-3.5" />
                {prs.length} merged PR{prs.length === 1 ? '' : 's'}
              </span>
            </div>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">{description}</p>

            <ol className="mt-6 divide-y divide-border/60 border-t border-border/60">
              {prs.map((pr) => (
                <li key={pr.pullRequestUrl} className="py-6 last:pb-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <PrHeading className="text-xl tracking-tight">{pr.title}</PrHeading>
                    <p className="font-mono text-[13px] text-muted-foreground">
                      PR #{pr.pullRequestNumber} · merged <time dateTime={pr.mergedAt}>{pr.mergedLabel}</time>
                    </p>
                  </div>
                  <p className="mt-2 max-w-2xl text-lg leading-relaxed text-muted-foreground">{pr.summary}</p>

                  {detailed && (
                    <ul className="mt-4 max-w-2xl space-y-2.5">
                      {pr.details.map((detail) => (
                        <li
                          key={detail}
                          className="relative pl-4 text-base leading-relaxed text-muted-foreground before:absolute before:top-[0.6em] before:left-0 before:size-1 before:rounded-full before:bg-signal/50"
                        >
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                    <p className="font-mono text-[13px] text-muted-foreground">{pr.stack.join(' · ')}</p>
                    <a
                      href={pr.pullRequestUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`view contribution: ${project} pull request #${pr.pullRequestNumber}`}
                      className="group inline-flex items-center gap-1.5 font-mono text-sm text-signal transition-opacity hover:opacity-80"
                    >
                      view contribution
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </article>
        );
      })}
    </div>
  );
}
