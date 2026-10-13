import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Marked } from 'marked';
import { posts as postMeta, type PostMeta } from '@/data/posts';

/**
 * Server-only: reads markdown from disk. Every page that uses this is
 * prerendered, so it runs at build time and ships no markdown parser to the
 * browser. The client-safe metadata is in data/posts.ts.
 */

export type Post = PostMeta & {
  /** e.g. "January 17, 2026". */
  publishedLabel: string;
  readingMinutes: number;
};

const CONTENT_DIR = join(process.cwd(), 'src/content/blog');
const PUBLIC_DIR = join(process.cwd(), 'public');
// Next adds basePath to next/image and <Link>, but not to raw HTML, so the
// rendered markdown has to add it itself or images 404 on GitHub Pages.
const BASE_PATH = process.env.PAGES_BASE_PATH ?? '';
const WORDS_PER_MINUTE = 200;

function source(slug: string): string {
  return readFileSync(join(CONTENT_DIR, `${slug}.md`), 'utf8');
}

function withDerived(meta: PostMeta): Post {
  const words = source(meta.slug).split(/\s+/).filter(Boolean).length;
  return {
    ...meta,
    publishedLabel: new Date(`${meta.publishedAt}T00:00:00Z`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }),
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  };
}

export const allPosts: Post[] = postMeta
  .map(withDerived)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export function getPost(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug);
}

/**
 * Pixel size of a .webp, read from its header, so every image gets explicit
 * width/height and the page does not jump as it loads.
 */
export function webpSize(buf: Buffer): { width: number; height: number } {
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('not a webp file');
  }
  const chunk = buf.toString('ascii', 12, 16);
  if (chunk === 'VP8X') {
    return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
  }
  if (chunk === 'VP8 ') {
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === 'VP8L') {
    const bits = buf.readUInt32LE(21);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
  }
  throw new Error(`unknown webp chunk ${chunk}`);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>|&\w+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

const marked = new Marked({
  gfm: true,
  renderer: {
    heading({ tokens, depth, text }) {
      return `<h${depth} id="${slugify(text)}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
    },
    link({ href, title, tokens }) {
      const external = /^https?:\/\//.test(href);
      const attrs = [
        `href="${escapeAttr(href)}"`,
        title ? `title="${escapeAttr(title)}"` : '',
        external ? 'target="_blank" rel="noreferrer"' : '',
      ];
      return `<a ${attrs.filter(Boolean).join(' ')}>${this.parser.parseInline(tokens)}</a>`;
    },
    image({ href, text }) {
      if (!href.startsWith('/') || !href.endsWith('.webp')) {
        throw new Error(`post images must be local .webp files under public/: ${href}`);
      }
      const { width, height } = webpSize(readFileSync(join(PUBLIC_DIR, href)));
      const src = escapeAttr(`${BASE_PATH}${href}`);
      // Linked to the full-size file: diagram labels are small on a phone.
      return (
        `<a href="${src}" target="_blank" rel="noreferrer">` +
        `<img src="${src}" alt="${escapeAttr(text)}" width="${width}" height="${height}" loading="lazy" decoding="async">` +
        `</a>`
      );
    },
    paragraph({ tokens }) {
      // An image on its own line is a figure, not a paragraph of text, so it
      // can be laid out wider than the text column.
      const content = tokens.filter((t) => !(t.type === 'text' && !t.raw.trim()));
      const tag = content.length === 1 && content[0].type === 'image' ? 'figure' : 'p';
      return `<${tag}>${this.parser.parseInline(tokens)}</${tag}>\n`;
    },
  },
});

export function renderPost(slug: string): string {
  return marked.parse(source(slug), { async: false });
}
