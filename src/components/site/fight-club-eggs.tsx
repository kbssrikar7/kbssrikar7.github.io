'use client';

import { useSyncExternalStore } from 'react';
import { sprite, toPaths } from './fight-sprites';

/**
 * Tyler, spliced in for a single frame, the way he flickers into the film
 * before anyone has met him. Drawn after mount, so it costs the page's HTML
 * nothing; the flash itself is CSS (globals.css, .subliminal).
 */
const noop = () => () => {};

export function SubliminalTyler({ className }: { className?: string }) {
  // False while server rendering and hydrating, true after.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  if (!mounted) return null;
  const paths = toPaths(sprite('tyler', 'idle'), false);
  return (
    <svg aria-hidden viewBox="0 0 16 24" shapeRendering="crispEdges" className={`subliminal ${className ?? ''}`}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} />
      ))}
    </svg>
  );
}
