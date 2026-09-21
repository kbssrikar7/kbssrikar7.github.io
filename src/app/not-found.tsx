import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-start px-4 py-28 sm:px-6 sm:py-40">
      <p className="font-pixel text-6xl text-signal sm:text-7xl">404</p>
      <h1 className="mt-6 text-2xl tracking-tight">This page doesn&apos;t exist.</h1>
      <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
        The link may be stale, or I may have moved something. Try the projects index, or press{' '}
        <kbd className="rounded border border-border px-1 py-px font-mono text-xs">⌘K</kbd>.
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
