import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { allPosts, getPost, renderPost } from '@/lib/posts';
import { profile } from '@/data/profile';
import { jsonLdString, postJsonLd } from '@/lib/structured-data';

// Posts are markdown read from disk at build time; there is nothing to render
// for a slug that was not built.
export const dynamicParams = false;

export function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `${profile.siteUrl}/blog/${slug}/`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: 'kbs',
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [profile.name],
      tags: post.tags,
      locale: 'en_US',
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(postJsonLd(post)) }} />
      <Link
        href="/blog"
        className="group inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        blog
      </Link>

      <header className="mt-8 max-w-[42rem] border-b border-border/60 pb-10">
        <p className="font-mono text-[13px] tracking-[0.2em] text-muted-foreground uppercase">
          <time dateTime={post.publishedAt}>{post.publishedLabel}</time>
          {' · '}
          {post.readingMinutes} min read
        </p>
        <h1 className="mt-4 text-4xl tracking-tight text-balance sm:text-5xl">{post.title}</h1>
      </header>

      {/* Trusted HTML: rendered at build time from markdown committed to this
          repo (src/content/blog), never from user input. */}
      <div className="post-body mt-10" dangerouslySetInnerHTML={{ __html: renderPost(post.slug) }} />

      {post.originalUrl && (
        <p className="mt-16 max-w-[42rem] border-t border-border/60 pt-6 font-mono text-sm text-muted-foreground">
          First published on{' '}
          <a
            href={post.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-signal"
          >
            {new URL(post.originalUrl).host}
            <ArrowUpRight aria-hidden className="size-3.5" />
          </a>
        </p>
      )}
    </article>
  );
}
