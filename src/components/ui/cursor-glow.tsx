'use client';

import { useEffect, useRef } from 'react';

/**
 * A soft signal-coloured light that follows the pointer across its parent,
 * fading in on hover. Writes two CSS variables on pointermove - no React
 * re-render per frame. Decorative only: absolutely positioned, so no layout.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = ref.current;
    const host = glow?.parentElement;
    if (!glow || !host || !window.matchMedia('(hover: hover)').matches) return;
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      glow.style.setProperty('--x', `${e.clientX - r.left}px`);
      glow.style.setProperty('--y', `${e.clientY - r.top}px`);
    };
    host.addEventListener('pointermove', move);
    return () => host.removeEventListener('pointermove', move);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style={{
        background:
          'radial-gradient(420px circle at var(--x, 50%) var(--y, 0%), color-mix(in oklch, var(--signal) 14%, transparent), transparent 60%)',
      }}
    />
  );
}
