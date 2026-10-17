'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { NAV } from './nav-items';
import { OPEN_PALETTE_EVENT } from './command-palette';

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
                // extra item overflows a 360px screen.
                <li key={item.href} className={item.href === '/' ? 'hidden sm:block' : undefined}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      // One size down below 360px: four words plus the visitor
                      // count overflow a 320px screen by a few pixels at 13px.
                      'group flex items-center gap-1.5 rounded-md px-1 py-1.5 font-mono text-[13px] transition-colors max-[359px]:text-xs sm:px-2.5 sm:text-sm',
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
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            title="Search (⌘K)"
            className="ml-1 flex items-center gap-1.5 rounded-md border border-border px-2 py-1.5 font-mono text-[13px] text-muted-foreground transition-colors hover:border-signal/40 hover:text-signal sm:ml-2 sm:px-2.5"
          >
            <Search aria-hidden className="size-3.5" />
            {/* Named by text, not aria-label, so the name contains the visible
                "⌘K" - voice control users say what they see. */}
            <span className="sr-only">Search</span>
            <kbd className="hidden font-mono sm:inline">⌘K</kbd>
          </button>
        </div>
      </nav>
    </header>
  );
}
