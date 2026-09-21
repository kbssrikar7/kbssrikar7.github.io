import type { MetadataRoute } from 'next';
import { allProjects, curatedMeta } from '@/lib/projects';
import { profile } from '@/data/profile';

// Same requirement as opengraph-image: this is a Route Handler, and a static
// export will not prerender it unless it is explicitly marked.
export const dynamic = 'force-static';

// Routes use trailing slashes to match `trailingSlash: true` in next.config.ts,
// so the sitemap advertises the same URLs the site actually serves.
const ROUTES = ['/', '/work/', '/projects/', '/resume/'];

export default function sitemap(): MetadataRoute.Sitemap {
  // A build-stable date rather than new Date(), so rebuilding an unchanged site
  // does not churn the sitemap.
  const lastModified = curatedMeta.generatedAt;

  return [
    ...ROUTES.map((route) => ({
      url: `${profile.siteUrl}${route}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: route === '/' ? 1 : 0.8,
    })),
    ...allProjects.map((p) => ({
      url: `${profile.siteUrl}/projects/${p.slug}/`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: p.featured ? 0.7 : 0.5,
    })),
  ];
}
