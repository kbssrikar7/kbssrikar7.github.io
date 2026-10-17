'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenis: Lenis | null = null;

/** Scroll to an element through Lenis when it is running, so a programmatic
    jump glides with the same easing as the wheel instead of fighting it. */
export function scrollToElement(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el, { offset: -88 });
  else {
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  }
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
    const sync = () => (body.hasAttribute('data-scroll-locked') ? lenis?.stop() : lenis?.start());
    const observer = new MutationObserver(sync);
    observer.observe(body, { attributes: true, attributeFilter: ['data-scroll-locked'] });

    return () => {
      observer.disconnect();
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
