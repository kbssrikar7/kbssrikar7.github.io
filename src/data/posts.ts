/**
 * Blog posts, newest first. Each body lives at src/content/blog/<slug>.md and
 * is rendered to HTML at build time (see lib/posts.ts). Images go in
 * public/blog/<slug>/ as .webp and are referenced from the markdown by their
 * public path.
 */
export type PostMeta = {
  slug: string;
  title: string;
  /** One or two plain sentences: meta description, OG card, and list blurb. */
  description: string;
  /** YYYY-MM-DD. */
  publishedAt: string;
  /** Where the post was first published, if it started somewhere else. */
  originalUrl?: string;
  tags: string[];
};

export const posts: PostMeta[] = [
  {
    slug: 'why-version-control-exists',
    title: 'Why Version Control Exists: The Pendrive Problem',
    description:
      'How teams shared code before version control - pendrives, email attachments, and folders named final_v2 - and the problems that made version control necessary.',
    publishedAt: '2026-01-17',
    originalUrl: 'https://kbss0000.hashnode.dev/why-version-control-exists-the-pendrive-problem-1',
    tags: ['git', 'version control'],
  },
];
