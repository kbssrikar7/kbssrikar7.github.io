'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV } from './nav-items';

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-pixel text-lg tracking-tight transition-colors hover:text-signal"
        >
          kbs
        </Link>

        <div className="flex items-center gap-1">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-[13px] transition-colors',
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
          {/* No-op until NEXT_PUBLIC_UMAMI_SHARE_URL is set - see README. */}
          {process.env.NEXT_PUBLIC_UMAMI_SHARE_URL && (
            <a
              href={process.env.NEXT_PUBLIC_UMAMI_SHARE_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Site visitor stats"
              title="Site visitor stats"
              className="ml-1 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Eye className="size-4" />
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}
