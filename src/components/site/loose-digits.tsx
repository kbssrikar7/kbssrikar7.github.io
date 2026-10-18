'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Pos = { x: number; y: number; tilt: number };

const HOME: Pos = { x: 0, y: 0, tilt: 0 };

/**
 * The 404's digits, loose: each one can be picked up and dropped anywhere.
 * Decorative - the page's real heading is the h1 below.
 */
export function LooseDigits({ text }: { text: string }) {
  const [pos, setPos] = useState<Pos[]>(() => [...text].map(() => HOME));
  const [held, setHeld] = useState<number | null>(null);
  const grab = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const moved = pos.some((p) => p.x !== 0 || p.y !== 0);

  function down(i: number, e: React.PointerEvent<HTMLSpanElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    grab.current = { x: e.clientX, y: e.clientY, ox: pos[i].x, oy: pos[i].y };
    setHeld(i);
  }

  function move(i: number, e: React.PointerEvent<HTMLSpanElement>) {
    if (held !== i) return;
    const dx = e.clientX - grab.current.x;
    const dy = e.clientY - grab.current.y;
    setPos((p) =>
      p.map((q, j) =>
        // Tilts toward the direction it is dragged, like something held by a corner.
        j === i ? { x: grab.current.ox + dx, y: grab.current.oy + dy, tilt: Math.max(-14, Math.min(14, e.movementX * 1.5)) } : q
      )
    );
  }

  function up(i: number) {
    setHeld(null);
    setPos((p) => p.map((q, j) => (j === i ? { ...q, tilt: 0 } : q)));
  }

  return (
    <div className="flex items-end gap-6">
      <p aria-hidden className="flex font-pixel text-[clamp(6rem,22vw,11rem)] leading-none text-signal select-none">
        {[...text].map((ch, i) => (
          <span
            key={i}
            onPointerDown={(e) => down(i, e)}
            onPointerMove={(e) => move(i, e)}
            onPointerUp={() => up(i)}
            onPointerCancel={() => up(i)}
            className={cn(
              'relative inline-block touch-none cursor-grab',
              held === i ? 'z-10 cursor-grabbing drop-shadow-[0_12px_24px_rgb(0_0_0/0.6)]' : 'transition-transform duration-300 ease-out'
            )}
            style={{ transform: `translate(${pos[i].x}px, ${pos[i].y}px) rotate(${pos[i].tilt}deg) scale(${held === i ? 1.06 : 1})` }}
          >
            {ch}
          </span>
        ))}
      </p>
      <button
        type="button"
        onClick={() => setPos((p) => p.map(() => HOME))}
        className={cn(
          'mb-4 font-mono text-[13px] text-muted-foreground underline underline-offset-2 transition-opacity hover:text-signal',
          moved ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        tabIndex={moved ? 0 : -1}
      >
        put it back
      </button>
    </div>
  );
}
