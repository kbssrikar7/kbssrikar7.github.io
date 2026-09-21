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
        hue={project?.hue ?? 195}
      />
    ),
    { ...size, fonts: await ogFonts() }
  );
}
