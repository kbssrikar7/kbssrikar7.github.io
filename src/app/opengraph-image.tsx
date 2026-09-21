import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE, ogFonts } from '@/lib/og';
import { profile } from '@/data/profile';

// Required under output:'export' - opengraph-image is a Route Handler, and a
// static export refuses to prerender one unless it is explicitly marked.
export const dynamic = 'force-static';

export const alt = `${profile.name} - ${profile.tagline}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        title={profile.fullName}
        description={profile.tagline}
        tags={['Python', 'TypeScript', 'Rust', 'Kubernetes']}
      />
    ),
    { ...size, fonts: await ogFonts() }
  );
}
