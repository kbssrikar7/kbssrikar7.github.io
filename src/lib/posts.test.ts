import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { posts } from '@/data/posts';
import { allPosts, getPost, renderPost, webpSize } from './posts';

const contentPath = (slug: string) => join(process.cwd(), 'src/content/blog', `${slug}.md`);

describe('posts', () => {
  it('has a markdown body for every post, with unique slugs', () => {
    expect(new Set(posts.map((p) => p.slug)).size).toBe(posts.length);
    for (const p of posts) expect(existsSync(contentPath(p.slug)), p.slug).toBe(true);
  });

  it('uses real YYYY-MM-DD dates and lists newest first', () => {
    for (const p of allPosts) {
      expect(p.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(p.publishedAt))).toBe(false);
    }
    const dates = allPosts.map((p) => p.publishedAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('formats the date without shifting it across time zones', () => {
    expect(getPost('why-version-control-exists')?.publishedLabel).toBe('January 17, 2026');
  });

  it('does not repeat the title as an h1 inside the body', () => {
    // The page renders the title as its h1; a "# " line would make a second one.
    for (const p of posts) expect(readFileSync(contentPath(p.slug), 'utf8')).not.toMatch(/^# /m);
  });

  it('renders every post, and every image it references exists locally', () => {
    for (const p of posts) {
      const html = renderPost(p.slug);
      expect(html).not.toContain('cdn.hashnode.com');
      for (const [, src] of html.matchAll(/<img src="([^"]+)"/g)) {
        expect(existsSync(join(process.cwd(), 'public', src)), src).toBe(true);
      }
    }
  });

  it('renders a standalone image as a sized figure, not inside a paragraph', () => {
    const html = renderPost('why-version-control-exists');
    expect(html).toMatch(/<figure><a [^>]+><img [^>]*width="1600" height="738"/);
    expect(html).not.toMatch(/<p><a [^>]+><img /);
  });

  it('reads webp dimensions from the file header', () => {
    const file = join(process.cwd(), 'public/blog/why-version-control-exists/pendrive-vs-version-control.webp');
    expect(webpSize(readFileSync(file))).toEqual({ width: 1600, height: 738 });
    expect(() => webpSize(Buffer.from('not an image'))).toThrow();
  });
});
