'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenis: Lenis | null = null;
let topPending = false;

/** Scroll to an element through Lenis when it is running, so a programmatic
    jump glides with the same easing as the wheel instead of fighting it. */
export function scrollToElement(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el, { offset: -88 });
  else {
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  }
}

/** Back to the top, gliding like scrollToElement. */
export function scrollToTop() {
  // Picked from the search palette, Lenis is still stopped behind the
  // dialog, and restarting it would cancel the scroll: wait for the restart.
  if (lenis?.isStopped) topPending = true;
  else if (lenis) lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

const trim = (path: string) => path.replace(/\/+$/, '') || '/';

/** True when href points at the page already open (no #fragment), where a
    router push is a no-op and leaves the visitor wherever they had scrolled. */
export function isCurrentPage(href: string) {
  const url = new URL(href, location.href);
  return url.origin === location.origin && !url.hash && trim(url.pathname) === trim(location.pathname);
}

/**
 * Eased, inertial wheel scrolling. Touch scrolling stays native (phones
 * already have momentum, and fighting it feels wrong), and Lenis switches
 * itself off under prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      anchors: { offset: -88 },
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      // The search palette scrolls its own list; leave dialogs alone.
      prevent: (node) => node.closest('[role="dialog"]') !== null,
    });

    // Radix locks the page behind an open dialog with data-scroll-locked on
    // <body>; Lenis drives scrolling itself, so it has to stop too, or the
    // page scrolls underneath the palette.
    const body = document.body;
    const sync = () => {
      if (body.hasAttribute('data-scroll-locked')) return lenis?.stop();
      lenis?.start();
      if (topPending) {
        topPending = false;
        lenis?.scrollTo(0);
      }
    };
    const observer = new MutationObserver(sync);
    observer.observe(body, { attributes: true, attributeFilter: ['data-scroll-locked'] });

    // A link to the page you are on (the wordmark or "home" on the homepage,
    // "work" on /work/) should take you back to the top, as a full page load
    // would; Next treats it as a no-op and the page stays where it was.
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest?.('a[href]');
      if (!link || (link.getAttribute('target') ?? '_self') !== '_self' || !isCurrentPage(link.getAttribute('href')!)) return;
      scrollToTop();
    };
    // Capture phase: next/link cancels the click before it bubbles up here.
    document.addEventListener('click', onClick, true);

    return () => {
      document.removeEventListener('click', onClick, true);
      observer.disconnect();
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
