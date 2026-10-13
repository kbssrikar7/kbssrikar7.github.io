import type { Metadata } from 'next';
import { Section } from '@/components/sections/section';
import { PostList } from '@/components/blog/post-list';
import { allPosts } from '@/lib/posts';
import { profile } from '@/data/profile';

const title = 'Blog';
const description = 'Posts by K.B.S Srikar on software engineering.';
const url = `${profile.siteUrl}/blog/`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    siteName: 'kbs',
    type: 'website',
    locale: 'en_US',
  },
};

export default function BlogPage() {
  return (
    <Section label="blog" title="Things I've written.">
      <PostList posts={allPosts} headingLevel="h2" />
    </Section>
  );
}
