import type { NextConfig } from 'next';

// Deployed only to GitHub Pages, a static host: so a static export, plus the
// postbuild fixups in scripts/fix-og.mjs (Next emits metadata images with no
// file extension, which Pages serves as application/octet-stream).
const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pages has no clean-URL rewrite: without this, /projects 404s in
  // production while working fine in dev, because the export emits
  // projects.html rather than projects/index.html.
  trailingSlash: true,
  basePath: process.env.PAGES_BASE_PATH,
  // Pages serves no image optimization endpoint, so previews are pre-rendered
  // at fixed widths (scripts/shots.ts) and the loader picks among them.
  images: { loader: 'custom', loaderFile: './src/lib/image-loader.ts' },
};

export default nextConfig;
