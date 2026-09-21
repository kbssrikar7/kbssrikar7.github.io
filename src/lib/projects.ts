import { manualProjects, type ManualProject } from '@/data/projects.manual';
import curated from '@/data/projects.curated.json';
import previewManifest from '../../public/previews/manifest.json';

export type Bucket = 'applied-ml' | 'full-stack' | 'embedded-iot' | 'systems-tooling';

export type Project = ManualProject & {
  repoUrl: string;
  score: number;
  bucket: Bucket;
  demoable: boolean;
  featured: boolean;
  /** Captured screenshot, or null when the card renders a generated cover. */
  preview: string | null;
};

export const BUCKET_LABELS: Record<Bucket, string> = {
  'applied-ml': 'applied ml',
  'full-stack': 'full-stack',
  'embedded-iot': 'embedded + iot',
  'systems-tooling': 'systems + tooling',
};

/**
 * Human gate over the model's ranking.
 *
 * TypeSafe ranks on evidence it can see in a repo, which systematically
 * under-rates two things here: a CNN trained from scratch reads as "small"
 * next to a RAG stack, and a four-platform audio project has no hosted demo to
 * point at. Both are stronger than their score, so they are pinned.
 *
 * Re-running `npm run curate` never touches this list.
 */
const FEATURED_PINS = new Set(['handwritten-equation-solver', 'headphonesafety']);

const FEATURED_COUNT = 6;

const signals = curated.projects as Record<
  string,
  { score: number; bucket: string; demoable: boolean; demoableProbability: number }
>;

const previews = previewManifest as Record<string, string>;

function previewFor(slug: string): string | null {
  const file = previews[slug];
  return file ? `/previews/${file}` : null;
}

const merged: Project[] = manualProjects.map((m) => {
  const s = signals[m.slug];
  return {
    ...m,
    repoUrl: `https://github.com/kbssrikar7/${m.slug}`,
    score: s?.score ?? 0,
    bucket: (s?.bucket as Bucket) ?? 'full-stack',
    // A dead hosted demo is still not demoable, whatever the model thinks.
    demoable: Boolean(m.liveUrl) && (s?.demoable ?? false),
    featured: false,
    preview: previewFor(m.slug),
  };
});

const ranked = [...merged].sort((a, b) => b.score - a.score);

const featuredSlugs = new Set<string>(FEATURED_PINS);
for (const p of ranked) {
  if (featuredSlugs.size >= FEATURED_COUNT) break;
  featuredSlugs.add(p.slug);
}

for (const p of ranked) p.featured = featuredSlugs.has(p.slug);

export const allProjects: Project[] = ranked;
export const featuredProjects: Project[] = ranked.filter((p) => p.featured);
export const archivedProjects: Project[] = ranked.filter((p) => !p.featured);

export const buckets: Bucket[] = Array.from(
  new Set(ranked.map((p) => p.bucket))
) as Bucket[];

export function getProject(slug: string): Project | undefined {
  return ranked.find((p) => p.slug === slug);
}

export const curatedMeta = {
  generatedAt: curated.generatedAt,
  model: curated.model,
};
