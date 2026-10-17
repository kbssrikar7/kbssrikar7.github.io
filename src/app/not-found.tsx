import type { Metadata } from 'next';
import Link from 'next/link';
import { LooseDigits } from '@/components/site/loose-digits';

// A 404 should never be indexed, or claim the home page as its canonical.
export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-start px-4 py-28 sm:px-6 sm:py-40">
      <LooseDigits text="404" />
      <h1 className="mt-8 text-2xl tracking-tight">This page doesn&apos;t exist.</h1>
      <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
        The link may be stale, or I may have moved something. Try the projects index, or search
        from the top bar. (The digits can be dragged.)
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          home
        </Link>
        <Link
          href="/projects"
          className="rounded-lg border border-border px-4 py-2.5 text-sm transition-colors hover:border-signal/40 hover:text-signal"
        >
          projects
        </Link>
      </div>
    </section>
  );
}
