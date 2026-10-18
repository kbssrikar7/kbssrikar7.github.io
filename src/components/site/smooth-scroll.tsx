'use client';

import { useEffect } from 'react';

// Native scrolling only. Lenis (JS smooth scrolling) was here, and it moved
// every scroll frame onto the main thread: measured scrolling through the
// stack at 4x CPU throttle, layer updates took 2.2s with it and 0.08s
// without, and frames dropped. The browser's own smooth scrolling runs on
// the compositor and stays smooth however busy the page is.

const NAV_OFFSET = 88;

const smooth = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Glide to an element, leaving room for the sticky nav. */
export function scrollToElement(el: HTMLElement) {
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET,
    behavior: smooth() ? 'smooth' : 'auto',
  });
}

/** Back to the top. Picked from the search palette, the page is still
    scroll-locked behind the closing dialog, so wait for the lock to lift. */
export function scrollToTop() {
  const go = () => window.scrollTo({ top: 0, behavior: smooth() ? 'smooth' : 'auto' });
  const body = document.body;
  if (!body.hasAttribute('data-scroll-locked')) return go();
  const observer = new MutationObserver(() => {
    if (body.hasAttribute('data-scroll-locked')) return;
    observer.disconnect();
    go();
  });
  observer.observe(body, { attributes: true, attributeFilter: ['data-scroll-locked'] });
}

const trim = (path: string) => path.replace(/\/+$/, '') || '/';

/** True when href points at the page already open (no #fragment), where a
    router push is a no-op and leaves the visitor wherever they had scrolled. */
export function isCurrentPage(href: string) {
  const url = new URL(href, location.href);
  return url.origin === location.origin && !url.hash && trim(url.pathname) === trim(location.pathname);
}

/**
 * A link to the page you are on (the wordmark or "home" on the homepage,
 * "work" on /work/) takes you back to the top, as a full page load would;
 * Next treats it as a no-op and the page stays where it was.
 */
export function SamePageLinks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest?.('a[href]');
      if (!link || (link.getAttribute('target') ?? '_self') !== '_self' || !isCurrentPage(link.getAttribute('href')!)) return;
      scrollToTop();
    };
    // Capture phase: next/link cancels the click before it bubbles up here.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return null;
}
