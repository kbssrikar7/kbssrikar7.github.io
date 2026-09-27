'use client';

import { PREVIEW_WIDTHS, variantName } from './preview-thumb';

/**
 * next/image loader for the GitHub Pages build, which has no image optimizer.
 * Previews are pre-rendered at 800 / 1200 / 2400px by scripts/shots.ts; this
 * maps each width Next asks for to the smallest file that covers it, so the
 * browser's srcset picks the right one. A phone card (~400 CSS px) used to
 * download the 1200px file; it now gets the 800px one.
 *
 * Anything that is not a preview is returned untouched.
 */
export default function previewLoader({ src, width }: { src: string; width: number }): string {
  const match = src.match(/^(.*\/previews\/.+?)(?:-(?:800|1200))?\.webp$/);
  if (!match) return src;
  const size = PREVIEW_WIDTHS.find((w) => w >= width) ?? 2400;
  return variantName(`${match[1]}.webp`, size);
}
