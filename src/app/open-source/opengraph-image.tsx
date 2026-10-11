import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE, ogFonts } from '@/lib/og';
import { profile } from '@/data/profile';

export const dynamic = 'force-static';
export const alt = `Open source contributions - ${profile.name}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="open source contributions"
      title={`Focuser - ${profile.name}`}
      description="Merged contributions: password and random-text unlocking across the Rust backend, CLI, and desktop UI, plus hidden CLI password prompts."
      tags={['Rust', 'TypeScript', 'Tauri', 'CLI']}
    />,
    { ...size, fonts: await ogFonts() }
  );
}
