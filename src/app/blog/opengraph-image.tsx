import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE, ogFonts } from '@/lib/og';
import { profile } from '@/data/profile';

// Without its own image this page shared no preview at all: its page-level
// openGraph metadata replaces the root one, including the root image.
export const dynamic = 'force-static';

export const alt = `Blog - ${profile.name}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="blog"
        title={`Blog - ${profile.name}`}
        description="Posts by K.B.S Srikar on software engineering."
      />
    ),
    { ...size, fonts: await ogFonts() }
  );
}
