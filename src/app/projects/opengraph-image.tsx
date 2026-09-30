import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE, ogFonts } from '@/lib/og';
import { profile } from '@/data/profile';

// Without its own image this page shared no preview at all: its page-level
// openGraph metadata replaces the root one, including the root image.
export const dynamic = 'force-static';

export const alt = `Projects - ${profile.name}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="projects"
        title={`Projects - ${profile.name}`}
        description="Client work for a ship-management firm, RAG systems, cardiac MRI pipelines, cross-platform audio tooling, ESP32 fleets, and a self-hosted UPI gateway."
      />
    ),
    { ...size, fonts: await ogFonts() }
  );
}
