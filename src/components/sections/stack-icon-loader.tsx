'use client';

import { useEffect } from 'react';

/**
 * Gives the stack's logos their src once the page has loaded and gone idle,
 * or once the section is within ~1000px of the viewport, whichever is first. Native lazy loading misses images clipped by the moving rows
 * (they loaded only as they slid into view, so capsules showed empty circles
 * on a slow phone), and loading all 36 eagerly put them in front of the page's
 * first paint. This keeps them behind the first paint, and still has them
 * in hand before anyone scrolls (or jumps) to the rows.
 */
export function StackIconLoader({ target }: { target: string }) {
  useEffect(() => {
    const root = document.getElementById(target);
    if (!root) return;
    const load = () => {
      observer.disconnect();
      root.querySelectorAll<HTMLImageElement>('img[data-src]').forEach((img) => {
        img.src = img.dataset.src!;
        img.removeAttribute('data-src');
      });
    };
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && load(), {
      rootMargin: '1000px 0px',
    });
    observer.observe(root);
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1000));
    const afterLoad = () => idle(load);
    if (document.readyState === 'complete') afterLoad();
    else window.addEventListener('load', afterLoad, { once: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('load', afterLoad);
    };
  }, [target]);
  return null;
}
