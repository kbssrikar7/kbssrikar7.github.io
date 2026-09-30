import { manualProjects, type ManualProject } from '@/data/projects.manual';
import curated from '@/data/projects.curated.json';
import previewManifest from '../../public/previews/manifest.json';
import { thumbName } from './preview-thumb';

/** 'client-work' is set by hand (ManualProject.clientWork), never by the model. */
export type Bucket = 'client-work' | 'applied-ml' | 'full-stack' | 'embedded-iot' | 'systems-tooling';

export type Project = ManualProject & {
  /** Null for a private repo - no source link is shown. */
  repoUrl: string | null;
  score: number;
  bucket: Bucket;
  demoable: boolean;
  featured: boolean;
  /** Captured screenshot, or null when the card renders a generated cover. */
  preview: string | null;
  /** 1200px-wide copy of `preview` for cards. Null exactly when `preview` is. */
  thumb: string | null;
  /** Decorative hue for the generated cover and the OG card. See assignHues. */
  hue: number;
};

export const BUCKET_LABELS: Record<Bucket, string> = {
  'client-work': 'client work',
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

/**
 * projects.curated.json is model-written, so an unrecognised bucket is possible.
 * A bare cast would let one through and render an empty category label.
 */
function toBucket(value: string | undefined): Bucket {
  return value && value in BUCKET_LABELS ? (value as Bucket) : 'full-stack';
}

const merged: Project[] = manualProjects.map((m) => {
  const s = signals[m.slug];
  return {
    ...m,
    repoUrl: m.repo === null ? null : `https://github.com/kbssrikar7/${m.repo ?? m.slug}`,
    score: s?.score ?? 0,
    bucket: m.clientWork ? 'client-work' : toBucket(s?.bucket),
    // A dead hosted demo is still not demoable, whatever the model thinks. A
    // project the model never ranked (client work, no public repo) is judged
    // on its live URL alone.
    demoable: Boolean(m.liveUrl) && (s ? s.demoable : true),
    featured: false,
    preview: previewFor(m.slug),
    thumb: previews[m.slug] ? `/previews/${thumbName(previews[m.slug])}` : null,
    hue: 0,
  };
});

/**
 * Shipped client work leads the list regardless of score: it is live in
 * production for a real company, which the model's repo-based ranking cannot
 * see (the repo is private). Hues are assigned before it is inserted, so the
 * other cards keep their colours.
 */
const LEAD = 'libraa-website';
const LEAD_HUE = 215; // sea blue

const ranked = [...merged].filter((p) => p.slug !== LEAD).sort((a, b) => b.score - a.score);

/**
 * Hue comes from rank position, not from hashing the slug. A slug hash collided
 * outright (n8n-upi-payment-gateway-django and ytdlp-gui both landed on 147) and
 * left three covers within 11 degrees of each other. Golden-angle stepping gives
 * an even spread with no collisions, and because consecutive indices land ~137
 * degrees apart, cards sitting next to each other in the grid look maximally
 * different.
 *
 * Assigning it here means the DOM cover and the OG image read the same value
 * rather than each recomputing it, so the two cannot drift apart.
 */
const GOLDEN_ANGLE = 137.508;
ranked.forEach((p, i) => {
  p.hue = Math.round((i * GOLDEN_ANGLE) % 360);
});

const lead = merged.find((p) => p.slug === LEAD);
if (lead) {
  lead.hue = LEAD_HUE;
  ranked.unshift(lead);
}

// Only when it exists: a stale LEAD would otherwise hold a featured slot empty.
const featuredSlugs = new Set<string>([...(lead ? [LEAD] : []), ...FEATURED_PINS]);
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
