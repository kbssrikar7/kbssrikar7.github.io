import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pages has no clean-URL rewrite: without this, /projects 404s in
  // production while working fine in dev, because the export emits
  // projects.html rather than projects/index.html.
  trailingSlash: true,
  basePath: process.env.PAGES_BASE_PATH,
  images: { unoptimized: true },
};

export default nextConfig;
