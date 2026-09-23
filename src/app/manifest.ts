import type { MetadataRoute } from 'next';
import { profile } from '@/data/profile';

// Same requirement as sitemap.ts/robots.ts: a static export will not prerender
// a Route Handler unless it is explicitly marked.
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: profile.fullName,
    short_name: profile.name,
    description: profile.tagline,
    start_url: '/',
    display: 'standalone',
    background_color: '#101012',
    theme_color: '#101012',
    icons: [{ src: '/icon', sizes: '64x64', type: 'image/png' }],
  };
}
