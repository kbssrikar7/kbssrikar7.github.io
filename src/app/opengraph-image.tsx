import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE, ogFonts } from '@/lib/og';
import { profile } from '@/data/profile';

// Required under output:'export' - opengraph-image is a Route Handler, and a
// static export refuses to prerender one unless it is explicitly marked.
export const dynamic = 'force-static';

export const alt = `${profile.name} - software engineer`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        // The short form, matching the page title. The full legal name filled
        // the card edge to edge and is not how anyone searches for him.
        eyebrow="software engineer"
        title={profile.name}
        description="Backend, applied ML, and infrastructure. B.Tech CSE, VIT Vellore, 2026."
        tags={['Python', 'TypeScript', 'Rust', 'Kubernetes']}
      />
    ),
    { ...size, fonts: await ogFonts() }
  );
}
