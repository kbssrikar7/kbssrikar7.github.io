import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE, ogFonts } from '@/lib/og';
import { profile } from '@/data/profile';

// Without its own image this page shared no preview at all: its page-level
// openGraph metadata replaces the root one, including the root image.
export const dynamic = 'force-static';

export const alt = `Resume - ${profile.name}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="resume"
        title={`Resume - ${profile.name}`}
        description="Software engineer working across full-stack development, applied ML, and embedded IoT."
      />
    ),
    { ...size, fonts: await ogFonts() }
  );
}
