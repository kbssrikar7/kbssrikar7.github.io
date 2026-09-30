import { ArrowUpRight, Star } from 'lucide-react';
import { GithubIcon } from './icons';
import { profile } from '@/data/profile';

const REPO_URL = `https://github.com/${profile.sourceRepo}`;

/**
 * GitHub mark + arrow | star: links this site's repo, where the Star button
 * lives (a link cannot star on the visitor's behalf; GitHub needs them logged
 * in). Icons only, so the aria-label carries the meaning.
 */
export function StarOnGitHub() {
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="This site's source on GitHub - star the repo"
      title="Star this site on GitHub"
      className="group inline-flex items-center overflow-hidden rounded-md border border-border text-muted-foreground transition-colors hover:border-signal/40 hover:text-signal"
    >
      <span className="flex items-center gap-1 px-2.5 py-1.5">
        <GithubIcon className="size-4" />
        <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
      <span className="flex items-center border-l border-border px-2.5 py-1.5 transition-colors group-hover:border-signal/40">
        <Star className="size-3.5 transition-colors group-hover:fill-current" />
      </span>
    </a>
  );
}
