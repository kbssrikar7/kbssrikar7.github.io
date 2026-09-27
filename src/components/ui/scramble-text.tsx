'use client';

import { useEffect, useRef, useState } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';

/**
 * Resolves `text` left to right out of random glyphs - on mount, or
 * (`trigger="view"`) the first time it scrolls into view. Meant for monospace
 * text: every frame is the same length, so nothing reflows.
 *
 * 'mount' renders two stacked layers, the real text and a glyph layer, and CSS
 * picks one (see [data-scramble] in globals.css): glyphs from the very first
 * paint when JS is on, so the decode always plays AND the text counts as
 * painted immediately (it is the home page's LCP element - hiding it until
 * hydration cost ~6s of LCP on a throttled phone). No-JS visitors get the real
 * layer; if the script never arrives, a CSS failsafe swaps to it after 3s.
 */
export function ScrambleText({
  text,
  delay = 0,
  duration = 900,
  trigger = 'mount',
  replayOnHover,
  className,
}: {
  text: string;
  delay?: number;
  duration?: number;
  trigger?: 'mount' | 'view';
  /** Replay whenever the pointer enters the nearest ancestor matching this
   *  selector, or the text itself with `'self'`. */
  replayOnHover?: string;
  className?: string;
}) {
  const [shown, setShown] = useState(() => (trigger === 'mount' ? placeholder(text) : text));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Real layer only, no decode: reduced motion, or the failsafe already
    // showed the real text on a phone slow enough that hydration landed after
    // it - decoding then would flicker real -> garbage -> real.
    const settle = () => el.setAttribute('data-static', '');
    const goLive = () => {
      el.removeAttribute('data-static');
      el.setAttribute('data-live', '');
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (trigger === 'mount') settle();
      return;
    }

    let frame = 0;
    const play = (wait: number) => {
      cancelAnimationFrame(frame);
      let start = 0;
      const tick = (now: number) => {
        if (!start) start = now;
        const settled = Math.max(0, Math.floor(((now - start - wait) / duration) * text.length));
        if (settled >= text.length) {
          setShown(text);
          return;
        }
        setShown(text.slice(0, settled) + scramble(text.slice(settled)));
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const cleanups: (() => void)[] = [() => cancelAnimationFrame(frame)];

    if (trigger === 'mount') {
      const real = el.querySelector('[data-scramble-real]');
      if (real && getComputedStyle(real).visibility === 'visible') settle();
      else {
        goLive();
        play(delay);
      }
    } else if (el.getBoundingClientRect().top >= window.innerHeight) {
      // Below the fold: decode when it arrives. Already on screen at load: leave it.
      // Pre-scramble while it's out of sight, so the first visible frame is
      // glyphs rather than one frame of real text flicking to garbage.
      const pre = requestAnimationFrame(() => setShown(scramble(text)));
      cleanups.push(() => cancelAnimationFrame(pre));
      const io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        play(delay);
      });
      io.observe(el);
      cleanups.push(() => io.disconnect());
    }

    const hoverHost = replayOnHover === 'self' ? el : replayOnHover ? el.closest(replayOnHover) : null;
    if (hoverHost && window.matchMedia('(hover: hover)').matches) {
      const onEnter = () => {
        if (trigger === 'mount') goLive();
        play(0);
      };
      hoverHost.addEventListener('mouseenter', onEnter);
      cleanups.push(() => hoverHost.removeEventListener('mouseenter', onEnter));
    }

    return () => cleanups.forEach((fn) => fn());
  }, [text, delay, duration, trigger, replayOnHover]);

  if (trigger === 'mount') {
    return (
      <span ref={ref} className={`inline-grid ${className ?? ''}`} data-scramble="">
        {/* Screen readers get the real text once, not every scrambled frame. */}
        <span className="sr-only select-none">{text}</span>
        <span aria-hidden data-scramble-real="" className="[grid-area:1/1]">
          {text}
        </span>
        <span aria-hidden data-scramble-glyph="" className="[grid-area:1/1]">
          {shown}
        </span>
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {/* Screen readers get the real text once, not every scrambled frame.
          select-none so copying the line doesn't paste it twice. */}
      <span className="sr-only select-none">{text}</span>
      <span aria-hidden>{shown}</span>
    </span>
  );
}

/**
 * Server-rendered glyphs for a 'mount' decode. Deterministic, so the server
 * HTML and the first client render match (no hydration mismatch).
 */
function placeholder(text: string): string {
  return [...text].map((ch, i) => (ch === ' ' ? ch : GLYPHS[(ch.charCodeAt(0) * 7 + i * 13) % GLYPHS.length])).join('');
}

/** Every non-space character swapped for a random glyph - same length, so no reflow. */
function scramble(text: string): string {
  return [...text].map((ch) => (ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join('');
}
