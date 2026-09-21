import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE, ogFonts } from '@/lib/og';
import { allProjects, getProject, BUCKET_LABELS } from '@/lib/projects';

export const dynamic = 'force-static';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Project';

// Separate from the page's generateStaticParams - without this every project
// silently falls back to the parent route's OG card.
export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

/** Same slug-derived hue the DOM covers use, so the two never drift. */
function hueFor(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 360;
  return h;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  return new ImageResponse(
    (
      <OgCard
        eyebrow={project ? BUCKET_LABELS[project.bucket] : 'project'}
        title={project?.title ?? 'Project'}
        description={project?.blurb}
        tags={project?.tech}
        hue={hueFor(slug)}
      />
    ),
    { ...size, fonts: await ogFonts() }
  );
}
