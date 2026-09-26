'use client';

import { useSyncExternalStore } from 'react';
import { Eye } from 'lucide-react';
import { COUNTER_URL, COUNTER_PROMISE } from './visitor-count-config';

// Why the count used to show up late: the request only started in a
// useEffect, i.e. after the whole JS bundle had downloaded and React had
// hydrated, and then it still had to wait ~300-500ms for the counter API.
// Three things fix that:
//
// 1. The request starts from an inline <head> script (see layout.tsx), in
//    parallel with the bundle download instead of after it.
// 2. The last value seen is cached in localStorage, so repeat visitors see a
//    number on the very first client render and it just ticks up.
// 3. A fixed-width placeholder holds the space meanwhile, so the nav never
//    jumps when the number arrives.

const CACHE_KEY = 'kbs:visitor-count';

type State = number | 'loading' | 'failed';

let state: State = 'loading';
let started = false;
const listeners = new Set<() => void>();

function set(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

function readCache(): number | null {
  try {
    const v = Number(localStorage.getItem(CACHE_KEY));
    return Number.isFinite(v) && v > 0 ? v : null;
  } catch {
    return null;
  }
}

function start() {
  // Module-level guard: one hit per page load, not one per mount. The nav
  // stays mounted across client-side navigation, but StrictMode and remounts
  // would otherwise increment the counter twice.
  if (started) return;
  started = true;

  const cached = readCache();
  if (cached !== null) state = cached;

  const early = (window as unknown as Record<string, unknown>)[COUNTER_PROMISE] as
    | Promise<unknown>
    | undefined;
  const request =
    early ??
    fetch(COUNTER_URL, { signal: AbortSignal.timeout(8000) }).then((r) => r.json());

  request
    .then((data) => {
      const value = Number((data as { value?: unknown } | null)?.value);
      if (!Number.isFinite(value)) throw new Error('bad counter response');
      try {
        localStorage.setItem(CACHE_KEY, String(value));
      } catch {
        // Private mode - still show the live value, just don't remember it.
      }
      set(value);
    })
    .catch(() => {
      // Ad blockers commonly flag counter services as trackers. Keep showing
      // the cached number if there is one, otherwise disappear quietly.
      if (typeof state !== 'number') set('failed');
    });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  start();
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;
const getServerSnapshot = (): State => 'loading';

export function VisitorCount({ href }: { href?: string }) {
  const count = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (count === 'failed') return null;

  const badge = (
    <span
      className="flex items-center gap-1 rounded-md px-1 py-1.5 font-mono text-[13px] text-muted-foreground tabular-nums sm:gap-1.5 sm:px-1.5 sm:text-sm"
      aria-label={count === 'loading' ? 'Loading visitor count' : `${count} visits`}
    >
      <Eye className="size-4 shrink-0" aria-hidden />
      {count === 'loading' ? (
        // Sized in ch of the same mono font, so it is exactly as wide as a
        // 3-digit count: a fixed w-7 was 3px wider than "115", and the swap
        // slid every nav link sideways (a layout shift) when the count landed.
        <span aria-hidden className="h-3.5 w-[3ch] animate-pulse rounded bg-muted" />
      ) : (
        count.toLocaleString('en-US')
      )}
    </span>
  );

  if (!href) return badge;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title="Site visitor stats"
      className="transition-colors hover:text-foreground"
    >
      {badge}
    </a>
  );
}
