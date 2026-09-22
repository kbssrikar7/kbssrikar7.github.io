import type { NextConfig } from 'next';

// GitHub Pages is a dumb static host, so it needs `output: 'export'` plus the
// postbuild fixups in scripts/fix-og.mjs. Vercel runs Next properly and serves
// metadata routes itself - forcing export there produced /opengraph-image with
// no extension and an application/octet-stream content type, which every social
// crawler rejects. So each host gets the mode it is built for.
const isVercel = Boolean(process.env.VERCEL);

const nextConfig: NextConfig = {
  ...(isVercel
    ? {}
    : {
        output: 'export' as const,
        // GitHub Pages has no clean-URL rewrite: without this, /projects 404s
        // in production while working fine in dev, because the export emits
        // projects.html rather than projects/index.html.
        //
        // Vercel must NOT get this. It routes cleanly on its own, and with
        // trailingSlash on it 308-redirects /opengraph-image to
        // /opengraph-image/ - social crawlers do not follow redirects for
        // og:image, so link previews silently break.
        trailingSlash: true,
      }),
  basePath: process.env.PAGES_BASE_PATH,
  images: { unoptimized: true },
};

export default nextConfig;
