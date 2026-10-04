import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE, ogFonts } from '@/lib/og';
import { profile } from '@/data/profile';
import { contributions } from '@/data/contributions';

export const dynamic = 'force-static';
export const alt = `Open source contribution - ${profile.name}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="open source contribution"
      title={`Focuser - ${profile.name}`}
      description="Merged contribution: password and random-text unlocking across the Rust backend, CLI, and desktop UI."
      tags={[...contributions[0].stack]}
    />,
    { ...size, fonts: await ogFonts() }
  );
}
