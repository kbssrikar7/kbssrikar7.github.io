import snapshot from '@/data/github.json';

// Build-time GitHub data; see scripts/snapshot-github.mjs.

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

type Snapshot = {
  contributions: { total: number; start: string; counts: number[]; levels: number[] } | null;
  stars: Record<string, number>;
};

const data = snapshot as Snapshot;

/** The calendar as of the last build, or null if no build has fetched one. */
export function snapshotContributions(): { total: number; days: ContributionDay[] } | null {
  const c = data.contributions;
  if (!c) return null;
  const start = Date.parse(c.start + 'T00:00:00Z');
  return {
    total: c.total,
    days: c.counts.map((count, i) => ({
      date: new Date(start + i * 86_400_000).toISOString().slice(0, 10),
      count,
      level: c.levels[i] as ContributionDay['level'],
    })),
  };
}

/** Stars on a repo of the site owner's, by its GitHub URL; 0 if none or unknown. */
export function starsFor(repoUrl: string | null): number {
  if (!repoUrl) return 0;
  return data.stars[repoUrl.split('/').pop() ?? ''] ?? 0;
}
