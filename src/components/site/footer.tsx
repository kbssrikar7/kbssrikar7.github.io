import Link from 'next/link';
import { profile } from '@/data/profile';
import { NAV } from './nav-items';

const ELSEWHERE = [
  { label: 'github', href: profile.github },
  { label: 'linkedin', href: profile.linkedin },
  { label: 'email', href: `mailto:${profile.email}` },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 py-14 sm:grid-cols-3">
          <div className="col-span-2 sm:col-span-1">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground/60 uppercase">
              {profile.name}
            </p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              {profile.tagline}.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground/60 uppercase">
              navigate
            </p>
            <ul className="mt-3 space-y-1.5">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground/60 uppercase">
              elsewhere
            </p>
            <ul className="mt-3 space-y-1.5">
              {ELSEWHERE.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* The wordmark, clipped by the viewport edge. */}
      <div className="relative overflow-hidden" aria-hidden>
        <p className="font-pixel translate-y-[0.18em] text-center leading-[0.78] text-foreground/[0.07] select-none [font-size:clamp(7rem,26vw,20rem)]">
          kbs
        </p>
      </div>
    </footer>
  );
}
