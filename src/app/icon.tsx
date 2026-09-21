import { ImageResponse } from 'next/og';
import { ogFonts } from '@/lib/og';

// Same requirement as opengraph-image: a static export will not prerender a
// Route Handler unless it is explicitly marked.
export const dynamic = 'force-static';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default async function Icon() {
  const fonts = await ogFonts();
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Slight lift off pure black so the mark still reads as a tile
          // against a dark browser theme.
          background: '#101012',
          color: '#fafafa',
          // Only one glyph: "kbs" at favicon size is three illegible smudges.
          fontFamily: 'Pixel',
          fontSize: 44,
        }}
      >
        k
      </div>
    ),
    { ...size, fonts: fonts.filter((f) => f.name === 'Pixel') }
  );
}
