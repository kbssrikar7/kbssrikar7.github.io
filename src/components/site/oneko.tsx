'use client';

import { useEffect } from 'react';

// oneko.js by adryd (MIT) - https://github.com/adryd325/oneko.js
// Ported from the plain script so it mounts once in the root layout and
// survives client-side navigation, with the fixes the original lacks: it
// runs on requestAnimationFrame (so it stops in background tabs), never takes
// clicks, adds a listener instead of overwriting document.onmousemove, and
// stays off for anyone who asked for reduced motion. Pointer events cover
// mouse, pen and touch alike, so on a phone it runs to wherever you tap.

const SPRITE = 32;
const SPEED = 10;
const TICK_MS = 100;
// Just under the sticky nav (64px tall), in the left gutter - the original
// started at (32, 32), on top of the "kbs" logo on phones.
const START_X = 32;
const START_Y = 96;

type Frame = readonly [number, number];

const SPRITES: Record<string, readonly Frame[]> = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratch: [[-5, 0], [-6, 0], [-7, 0]],
  tired: [[-3, -2]],
  sleeping: [[-2, 0], [-2, -1]],
  N: [[-1, -2], [-1, -3]],
  NE: [[0, -2], [0, -3]],
  E: [[-3, 0], [-3, -1]],
  SE: [[-5, -1], [-5, -2]],
  S: [[-6, -3], [-7, -2]],
  SW: [[-5, -3], [-6, -1]],
  W: [[-4, -2], [-4, -3]],
  NW: [[-1, 0], [-1, -1]],
};

export function Oneko() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = document.createElement('div');
    el.setAttribute('aria-hidden', 'true');
    Object.assign(el.style, {
      width: `${SPRITE}px`,
      height: `${SPRITE}px`,
      position: 'fixed',
      left: `${START_X - SPRITE / 2}px`,
      top: `${START_Y - SPRITE / 2}px`,
      // Above the sticky nav (z-40), below the ⌘K dialog (z-50).
      zIndex: '45',
      pointerEvents: 'none',
      backgroundImage: "url('/oneko.gif')",
      imageRendering: 'pixelated',
    });
    document.body.appendChild(el);
    setSprite('idle', 0);

    let catX = START_X;
    let catY = START_Y;
    // Sits still until the first move or tap.
    let mouseX = START_X;
    let mouseY = START_Y;
    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation: 'sleeping' | 'scratch' | null = null;
    let idleFrame = 0;

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    // pointerdown for taps, which never fire a move; passive so scrolling
    // is never held up.
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onMove, { passive: true });

    function setSprite(name: string, n: number) {
      const [x, y] = SPRITES[name][n % SPRITES[name].length];
      el.style.backgroundPosition = `${x * SPRITE}px ${y * SPRITE}px`;
    }

    function idle() {
      idleTime += 1;
      // Roughly every 20 seconds of standing still, sleep or scratch.
      if (idleTime > 10 && idleAnimation === null && Math.floor(Math.random() * 200) === 0) {
        idleAnimation = Math.random() < 0.5 ? 'sleeping' : 'scratch';
      }
      switch (idleAnimation) {
        case 'sleeping':
          if (idleFrame < 8) {
            setSprite('tired', 0);
            break;
          }
          setSprite('sleeping', Math.floor(idleFrame / 4));
          if (idleFrame > 192) {
            idleAnimation = null;
            idleFrame = 0;
          }
          break;
        case 'scratch':
          setSprite('scratch', idleFrame);
          if (idleFrame > 9) {
            idleAnimation = null;
            idleFrame = 0;
          }
          break;
        default:
          setSprite('idle', 0);
          return;
      }
      idleFrame += 1;
    }

    function step() {
      frameCount += 1;
      const dx = catX - mouseX;
      const dy = catY - mouseY;
      const distance = Math.hypot(dx, dy);

      if (distance < 48) {
        idle();
        return;
      }

      idleAnimation = null;
      idleFrame = 0;

      if (idleTime > 1) {
        // A short "alert" pause before it starts running.
        setSprite('alert', 0);
        idleTime = Math.min(idleTime, 7) - 1;
        return;
      }

      let direction = dy / distance > 0.5 ? 'N' : '';
      direction += dy / distance < -0.5 ? 'S' : '';
      direction += dx / distance > 0.5 ? 'W' : '';
      direction += dx / distance < -0.5 ? 'E' : '';
      setSprite(direction, frameCount);

      catX -= (dx / distance) * SPEED;
      catY -= (dy / distance) * SPEED;
      el.style.left = `${catX - SPRITE / 2}px`;
      el.style.top = `${catY - SPRITE / 2}px`;
    }

    let raf = 0;
    let last: number | null = null;
    const loop = (t: number) => {
      last ??= t;
      if (t - last > TICK_MS) {
        last = t;
        step();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onMove);
      el.remove();
    };
  }, []);

  return null;
}
