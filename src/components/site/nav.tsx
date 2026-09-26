'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV } from './nav-items';
import { VisitorCount } from './visitor-count';

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="font-pixel text-xl tracking-tight transition-colors hover:text-signal"
        >
          kbs
        </Link>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <ul className="flex items-center gap-0 sm:gap-1">
            {NAV.map((item) => {
              const active =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                // The "kbs" wordmark already links home, and on a phone the
                // extra item plus the visitor count overflows a 360px screen.
                <li key={item.href} className={item.href === '/' ? 'hidden sm:block' : undefined}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex items-center gap-1.5 rounded-md px-1 py-1.5 font-mono text-[13px] transition-colors sm:px-2.5 sm:text-sm',
                      active
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span
                      aria-hidden
                      className="hidden text-muted-foreground transition-colors group-hover:text-signal sm:inline"
                    >
                      [{item.key}]
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <VisitorCount href={process.env.NEXT_PUBLIC_UMAMI_SHARE_URL} />
        </div>
      </nav>
    </header>
  );
}
