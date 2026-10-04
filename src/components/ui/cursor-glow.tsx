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
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const paint = () => {
      frame = 0;
      const r = host.getBoundingClientRect();
      glow.style.setProperty('--x', `${pointerX - r.left}px`);
      glow.style.setProperty('--y', `${pointerY - r.top}px`);
    };
    const move = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    host.addEventListener('pointermove', move, { passive: true });
    return () => {
      host.removeEventListener('pointermove', move);
      cancelAnimationFrame(frame);
    };
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
