'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ComponentType } from 'react';
import { STAGE_VIEWBOX } from './fight-stage';

// The fight and its sprite data sit at the very bottom of every page, so
// they stay out of the bundle that loads before first paint. An empty box
// of the scene's exact size holds the spot (nothing shifts when it swaps
// in), and the code is fetched once the footer comes within ~600px.

type Fight = ComponentType<{ className?: string }>;

export function LazyFooterFight({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [Fight, setFight] = useState<Fight | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        void import('./footer-fight').then((m) => setFight(() => m.FooterFight));
      },
      { rootMargin: '600px 0px' }
    );
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);

  if (Fight) return <Fight className={className} />;
  return <svg ref={ref} aria-hidden viewBox={STAGE_VIEWBOX} className={`footer-fight ${className ?? ''}`} />;
}

/** Subliminal Tyler shares the sprite code: loaded after the page is up. */
export const LazySubliminalTyler = dynamic(
  () => import('./fight-club-eggs').then((m) => m.SubliminalTyler),
  { ssr: false }
);
