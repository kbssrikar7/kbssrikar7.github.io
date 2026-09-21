import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Satori cannot read variable fonts or woff2.
 *
 * `geist` ships static .ttf for Sans/Mono, so those load straight from
 * node_modules. Geist Pixel ships woff2 only, so it is decompressed once to
 * assets/GeistPixel-Square.ttf (see the fonttools step in the README) and
 * committed.
 */
export async function ogFonts() {
  const [pixel, sans, mono] = await Promise.all([
    readFile(join(process.cwd(), 'assets/GeistPixel-Square.ttf')),
    readFile(join(process.cwd(), 'node_modules/geist/dist/fonts/geist-sans/Geist-Medium.ttf')),
    readFile(join(process.cwd(), 'node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf')),
  ]);
  return [
    { name: 'Pixel', data: pixel, style: 'normal' as const, weight: 400 as const },
    { name: 'Sans', data: sans, style: 'normal' as const, weight: 500 as const },
    { name: 'Mono', data: mono, style: 'normal' as const, weight: 400 as const },
  ];
}

const BG = '#0a0a0a';
const FG = '#fafafa';
const DIM = '#8b8b8b';
const SIGNAL = '#5ed9e6';

export function OgCard({
  eyebrow,
  title,
  description,
  tags,
  hue = 195,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  tags?: string[];
  hue?: number;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: BG,
        backgroundImage: `radial-gradient(ellipse 70% 60% at 12% 0%, hsla(${hue}, 70%, 55%, 0.20), transparent 70%)`,
        color: FG,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Pixel', fontSize: 30, color: FG }}>kbs</span>
        {eyebrow && (
          <span
            style={{
              fontFamily: 'Mono',
              fontSize: 19,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: DIM,
            }}
          >
            {eyebrow}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontFamily: 'Sans',
            fontSize: title.length > 26 ? 66 : 84,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontFamily: 'Sans',
              fontSize: 30,
              lineHeight: 1.4,
              color: DIM,
              marginTop: 22,
              maxWidth: 940,
            }}
          >
            {description}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {(tags ?? []).slice(0, 4).map((t) => (
            <span
              key={t}
              style={{
                fontFamily: 'Mono',
                fontSize: 19,
                color: DIM,
                border: '1px solid #2a2a2a',
                borderRadius: 999,
                padding: '6px 16px',
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <span style={{ fontFamily: 'Mono', fontSize: 19, color: SIGNAL }}>
          kbssrikar7.github.io
        </span>
      </div>
    </div>
  );
}
