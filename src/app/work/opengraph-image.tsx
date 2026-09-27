import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE, ogFonts } from '@/lib/og';
import { profile } from '@/data/profile';

// Without its own image this page shared no preview at all: its page-level
// openGraph metadata replaces the root one, including the root image.
export const dynamic = 'force-static';

export const alt = `Work - ${profile.name}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="work"
        title={`Work - ${profile.name}`}
        description="Kubernetes and CI/CD for Wayship, a maritime SaaS platform running telemetry across 200+ vessels."
      />
    ),
    { ...size, fonts: await ogFonts() }
  );
}
