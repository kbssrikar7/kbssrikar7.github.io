import Link from 'next/link';
import { profile, socials } from '@/data/profile';
import { NAV } from './nav-items';

const YEAR = new Date().getFullYear();

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[13px] tracking-[0.18em] text-muted-foreground uppercase">
      {children}
    </p>
  );
}

const linkClass =
  'font-mono text-sm text-muted-foreground transition-colors hover:text-foreground';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16 sm:grid-cols-4">
          <div className="col-span-2">
            <ColumnHeading>{profile.name}</ColumnHeading>
            {/* The email, not a tagline: it is the one thing someone might
                actually want out of a footer. */}
            <a
              href={`mailto:${profile.email}`}
              className="mt-3 inline-block text-base text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-signal hover:decoration-signal"
            >
              {profile.email}
            </a>
            <p className="mt-3 font-mono text-[13px] text-muted-foreground">
              {profile.location}
            </p>
          </div>

          <nav aria-label="Footer">
            <ColumnHeading>navigate</ColumnHeading>
            <ul className="mt-4 space-y-2">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={linkClass}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <ColumnHeading>elsewhere</ColumnHeading>
            {/* Only real external links get target="_blank" - the old list
                included the mailto, which opens a stray blank tab. */}
            <ul className="mt-4 space-y-2">
              {socials.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noreferrer" className={linkClass}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border/60 py-6">
          <p className="font-mono text-[13px] text-muted-foreground">
            © {YEAR} {profile.name}
          </p>
          <p className="font-mono text-[13px] text-muted-foreground">
            built with next.js · deployed on github pages
          </p>
        </div>
      </div>

      {/* Decorative wordmark, clipped by the viewport edge. */}
      <div className="relative overflow-hidden" aria-hidden>
        <p className="font-pixel translate-y-[0.18em] text-center leading-[0.78] text-foreground/[0.13] select-none [font-size:clamp(7rem,26vw,20rem)]">
          kbs
        </p>
      </div>
    </footer>
  );
}
