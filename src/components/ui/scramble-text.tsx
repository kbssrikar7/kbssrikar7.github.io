'use client';

import { useEffect, useRef, useState } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';

/**
 * Renders `text` and, once on mount, resolves it left to right out of random
 * glyphs. The server HTML is the final text, so crawlers, no-JS visitors and
 * reduced-motion users only ever see the real string. Meant for monospace
 * text: every frame is the same length, so nothing reflows.
 */
export function ScrambleText({
  text,
  delay = 0,
  duration = 900,
  className,
}: {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // The line fades in with CSS from first paint, but this only runs once
    // React hydrates - late on a slow phone. If the real text is already on
    // screen by then, scrambling it would read as real -> garbage -> real.
    if (ref.current && effectiveOpacity(ref.current) > 0.05) return;

    let frame = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start - delay;
      const settled = Math.max(0, Math.floor((elapsed / duration) * text.length));
      if (settled >= text.length) {
        setShown(text);
        return;
      }
      setShown(
        [...text]
          .map((ch, i) =>
            i < settled || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
          .join('')
      );
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, delay, duration]);

  return (
    <span ref={ref} className={className}>
      {/* Screen readers get the real text once, not every scrambled frame.
          select-none so copying the line doesn't paste the name twice. */}
      <span className="sr-only select-none">{text}</span>
      <span aria-hidden>{shown}</span>
    </span>
  );
}

/** Opacity as painted: the product of the element's and its ancestors'. */
function effectiveOpacity(el: Element): number {
  let opacity = 1;
  for (let node: Element | null = el; node && node !== document.body; node = node.parentElement) {
    opacity *= Number(getComputedStyle(node).opacity);
  }
  return opacity;
}
