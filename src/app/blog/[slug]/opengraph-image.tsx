import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE, ogFonts } from '@/lib/og';
import { allPosts, getPost } from '@/lib/posts';

export const dynamic = 'force-static';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Blog post';

// Separate from the page's generateStaticParams - without this every post
// silently falls back to the parent route's OG card.
export function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  return new ImageResponse(
    (
      <OgCard
        eyebrow={post ? `blog · ${post.publishedLabel}` : 'blog'}
        title={post?.title ?? 'Blog'}
        description={post?.description}
        tags={post?.tags}
      />
    ),
    { ...size, fonts: await ogFonts() }
  );
}
