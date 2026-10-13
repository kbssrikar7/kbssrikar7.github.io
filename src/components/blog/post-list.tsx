import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Post } from '@/lib/posts';

export function PostList({
  posts,
  headingLevel = 'h3',
}: {
  posts: Post[];
  /** h3 under a section's h2 (home); h2 directly under the page h1 (/blog). */
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;
  return (
    <ul className="-mt-4 divide-y divide-border/60 border-b border-border/60">
      {posts.map((post) => (
        <li key={post.slug} className="group relative grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[12rem_1fr]">
          <p className="font-mono text-sm tracking-wide text-muted-foreground sm:pt-1">
            <time dateTime={post.publishedAt}>{post.publishedLabel}</time>
          </p>
          <div>
            <Heading className="text-xl tracking-tight">
              {/* One link per row, stretched over the whole row with ::after. */}
              <Link
                href={`/blog/${post.slug}`}
                className="rounded-sm transition-colors group-hover:text-signal focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none after:absolute after:inset-0 after:content-['']"
              >
                {post.title}
              </Link>
            </Heading>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {post.description}
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-[13px] text-muted-foreground">
              {post.readingMinutes} min read
              <ArrowRight
                aria-hidden
                className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:text-signal"
              />
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
