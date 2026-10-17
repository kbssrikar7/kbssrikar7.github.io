'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Elements already on screen when a page appears are shown as they are: the
// scroll-driven reveal (globals.css) would otherwise leave anything sitting
// at the bottom edge half-faded until the visitor scrolls.
//
// The inline copy sets data-revealed before React hydrates, so every
// data-reveal element carries suppressHydrationWarning: the extra attribute
// is expected, and React leaves it in place.
function markInView() {
  document.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) el.setAttribute('data-revealed', '');
  });
}

/** Inline, right after <main>: runs during HTML parsing, before first paint. */
export const REVEAL_BOOTSTRAP = `(${markInView.toString()})()`;

/** The same check after each client-side navigation. */
export function RevealInView() {
  const pathname = usePathname();
  useEffect(() => {
    const frame = requestAnimationFrame(markInView);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  return null;
}
