/** Widths every preview is captured at (scripts/shots.ts writes all four).
    640 is for phones: Next asks for 640 for a ~330 CSS px card on a 1.75x screen. */
export const PREVIEW_WIDTHS = [640, 800, 1200, 2400] as const;

/** foo.webp -> foo-<width>.webp; 2400 is the base file itself. */
export function variantName(file: string, width: (typeof PREVIEW_WIDTHS)[number]): string {
  return width === 2400 ? file : file.replace(/\.webp$/, `-${width}.webp`);
}

/** foo.webp -> foo-1200.webp. Shared by scripts/shots.ts and lib/projects.ts. */
export function thumbName(file: string): string {
  return variantName(file, 1200);
}
