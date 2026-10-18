'use client';

import { useEffect, useRef, useState } from 'react';
import { FX, SPRITE_H, SPRITE_W, fx, sprite, toPaths, type Character, type Face, type PoseName } from './fight-sprites';

const STAGE_W = 160;
/** Rows of headroom above the fighters, for the crowd's raised fists. */
const HEADROOM = 3;
/** Where the ring starts: the fighters' own coordinates are offset by this. */
const RING_X = 50;

// The club, standing round the fight: who, where, and which way they face.
// Each one has a few pixels to himself, and the ring keeps clear of them.
const CROWD = [
  { who: 'buzz', x: 2, mirror: false },
  { who: 'angel', x: 23, mirror: false },
  { who: 'bob', x: 121, mirror: true },
  { who: 'buzz', x: 142, mirror: true },
] as const;

type Fig = { pose: PoseName; x: number; lift?: number; flash?: boolean; face?: Face };
type Effect = { name: keyof typeof FX; x: number; y: number };
/** One beat of the fight: both fighters, any effects, a 1px screen kick, and how long it holds. */
type Beat = { ms: number; t: Fig; n: Fig; fx?: Effect[]; shake?: number };

// x is each sprite's left edge on the stage; the Narrator is mirrored, so he
// faces left from his. A thrown punch reaches 19px past the puncher's x and
// lands on the other man's guard just inside his sprite; the lunges are
// measured from that, so every punch connects.
const t = (pose: PoseName, x = 9, more?: Partial<Fig>): Fig => ({ pose, x, ...more });
const n = (pose: PoseName, x = 29, more?: Partial<Fig>): Fig => ({ pose, x, ...more });
const spark = (x: number, frame: 1 | 2): Effect => ({ name: `spark${frame}`, x: x - 3, y: 10 });
const stars = (frame: 1 | 2 | 3): Effect => ({ name: `stars${frame}`, x: 45, y: 7 });
const speed = (x: number): Effect => ({ name: 'speed', x, y: 11 });
const dust = (frame: 1 | 2 | 3, y = 21): Effect[] => [
  { name: `dust${frame}`, x: 31, y },
  { name: `dust${frame}`, x: 56, y },
];

// Timing follows fighting-game convention: a short wind-up, a near-instant
// launch with speed lines, then hit-stop - both men frozen on contact, the
// victim flashing white - before the knockback. Idles breathe at 400/300ms.
const SCRIPT: Beat[] = [
  { ms: 400, t: t('idle'), n: n('bob') },
  { ms: 180, t: t('bob'), n: n('idle') },
  { ms: 120, t: t('bob'), n: n('idle', 29, { face: 'blink' }) },
  { ms: 260, t: t('idle'), n: n('bob') },
  { ms: 70, t: t('idle', 9, { face: 'glint1' }), n: n('bob') },
  { ms: 70, t: t('idle', 9, { face: 'glint2' }), n: n('bob') },
  { ms: 300, t: t('bob'), n: n('idle') },

  // Tyler: wind-up, jab, hit-stop, knockback, settle.
  { ms: 100, t: t('windup', 8), n: n('idle') },
  { ms: 50, t: t('punch', 10), n: n('idle'), fx: [speed(23)] },
  { ms: 160, t: t('punch', 11), n: n('hurt', 28, { flash: true }), fx: [spark(30, 1)], shake: 1 },
  { ms: 90, t: t('punch', 11), n: n('hurt', 30), fx: [spark(30, 2)], shake: -1 },
  { ms: 120, t: t('idle', 11), n: n('hurt', 31) },
  { ms: 300, t: t('bob', 10), n: n('idle', 30) },
  { ms: 400, t: t('idle'), n: n('bob') },
  { ms: 300, t: t('bob'), n: n('idle') },

  // The Narrator answers.
  { ms: 100, t: t('idle'), n: n('windup', 30) },
  { ms: 50, t: t('idle'), n: n('punch', 24), fx: [speed(24)] },
  { ms: 160, t: t('hurt', 9, { flash: true }), n: n('punch', 23), fx: [spark(23, 1)], shake: -1 },
  { ms: 90, t: t('hurt', 8), n: n('punch', 23), fx: [spark(23, 2)], shake: 1 },
  { ms: 120, t: t('hurt', 7), n: n('idle', 28) },
  { ms: 300, t: t('bob', 8), n: n('idle', 28) },
  { ms: 400, t: t('idle'), n: n('bob') },

  // Tyler's finisher: a longer wind-up, a longer freeze, and he flies.
  { ms: 200, t: t('windup', 7), n: n('idle') },
  { ms: 50, t: t('punch', 10), n: n('idle'), fx: [speed(23)] },
  { ms: 230, t: t('punch', 11), n: n('hurt', 28, { flash: true }), fx: [spark(30, 1)], shake: 1 },
  { ms: 80, t: t('punch', 11), n: n('hurt', 31, { lift: 3 }), fx: [spark(30, 2)], shake: -1 },
  { ms: 80, t: t('idle', 11), n: n('hurt', 35, { lift: 4 }) },
  { ms: 90, t: t('idle', 11), n: n('ko', 33), fx: dust(1, 22), shake: 1 },
  { ms: 90, t: t('idle', 11), n: n('ko', 34, { lift: 1 }), fx: dust(2) },
  { ms: 160, t: t('idle', 11), n: n('ko', 34), fx: dust(3, 22) },

  // Seeing stars.
  { ms: 260, t: t('bob', 11), n: n('ko', 34), fx: [stars(1)] },
  { ms: 260, t: t('idle', 11), n: n('ko', 34), fx: [stars(2)] },
  { ms: 260, t: t('bob', 11), n: n('ko', 34), fx: [stars(3)] },

  // Tyler walks over and helps him up.
  { ms: 140, t: t('walk', 12), n: n('ko', 34), fx: [stars(1)] },
  { ms: 140, t: t('idle', 13), n: n('ko', 34), fx: [stars(2)] },
  { ms: 140, t: t('walk', 14), n: n('ko', 34), fx: [stars(3)] },
  { ms: 420, t: t('reach', 15), n: n('ko', 34), fx: [stars(1)] },
  { ms: 380, t: t('reach', 14), n: n('rise', 32) },
  { ms: 300, t: t('idle', 14), n: n('idle', 30) },

  // Both back to their marks for the next round.
  { ms: 140, t: t('walk', 13), n: n('idle', 30) },
  { ms: 140, t: t('idle', 12), n: n('bob', 29) },
  { ms: 140, t: t('walk', 11), n: n('idle', 29) },
  { ms: 140, t: t('idle', 10), n: n('bob', 29) },
];

/** Who is drawn in Tyler's place: Tyler, or - the twist - the Narrator,
    who was fighting himself all along. */
type Cast = Character | 'twin';

const spriteId = (who: Cast, f: Fig) => `ff-${who}-${f.pose}${f.flash ? '-flash' : ''}${f.face ? `-${f.face}` : ''}`;

/** Every sprite the script uses, drawn once for <defs>. */
function buildSprites() {
  const defs = new Map<string, { color: string; d: string }[]>();
  for (const beat of SCRIPT) {
    for (const [who, f] of [
      ['tyler', beat.t],
      ['narrator', beat.n],
    ] as const) {
      const id = spriteId(who, f);
      if (!defs.has(id)) defs.set(id, toPaths(sprite(who, f.pose, f.flash, f.face), who === 'narrator'));
      // The twist: the Narrator in every one of Tyler's poses.
      const twin = spriteId('twin', beat.t);
      if (!defs.has(twin)) defs.set(twin, toPaths(sprite('narrator', beat.t.pose, beat.t.flash, beat.t.face), false));
    }
    for (const e of beat.fx ?? []) if (!defs.has(`ff-fx-${e.name}`)) defs.set(`ff-fx-${e.name}`, fx(e.name));
  }
  for (const c of CROWD)
    for (const pose of ['idle', 'bob', 'cheer'] as const) {
      const id = `ff-crowd-${c.who}-${pose}-${c.mirror ? 'l' : 'r'}`;
      if (!defs.has(id)) defs.set(id, toPaths(sprite(c.who, pose), c.mirror));
    }
  defs.set('ff-fx-soap', fx('soap'));
  defs.set('ff-fx-shadow', fx('shadow'));
  defs.set('ff-fx-shadowWide', fx('shadowWide'));
  return defs;
}

/** Each pose's sprite width (the punch is wider), to centre shadows under mirrored feet. */
const WIDTHS = new Map<string, number>(
  SCRIPT.flatMap((b) => [
    [`tyler-${b.t.pose}`, sprite('tyler', b.t.pose)[0].length] as const,
    [`narrator-${b.n.pose}`, sprite('narrator', b.n.pose)[0].length] as const,
  ])
);

/** Each crowd pose's height: the cheer is taller than the rest. */
const CROWD_H = new Map<PoseName, number>(
  (['idle', 'bob', 'cheer'] as const).map((pose) => [pose, sprite('bob', pose).length])
);

/**
 * What the crowd is doing on a beat: fists up on every hit and landing,
 * cheering in a ripple while he sees stars, otherwise breathing along with
 * the fight (half of them in step with Tyler, half with the Narrator).
 */
function crowdPose(beat: Beat, index: number, beatIndex: number): PoseName {
  const names = (beat.fx ?? []).map((e) => e.name);
  if (beat.shake || names.includes('spark1') || names.includes('dust2')) return 'cheer';
  if (names.some((name) => name.startsWith('stars'))) return (beatIndex + index) % 2 ? 'cheer' : 'idle';
  const lead = index % 2 ? beat.n : beat.t;
  return lead.pose === 'bob' ? 'bob' : 'idle';
}

/** The distinct frames, side by side on one sheet, and the order they play. */
function buildTimeline() {
  const keys = new Map<string, number>();
  const frames: { beat: Beat; crowd: PoseName[] }[] = [];
  const timeline: { frame: number; ms: number }[] = [];
  for (const [beatIndex, beat] of SCRIPT.entries()) {
    const crowd = CROWD.map((_, i) => crowdPose(beat, i, beatIndex));
    const key = JSON.stringify({ ...beat, ms: 0, crowd });
    if (!keys.has(key)) {
      keys.set(key, frames.length);
      frames.push({ beat, crowd });
    }
    timeline.push({ frame: keys.get(key)!, ms: beat.ms });
  }
  return { frames, timeline };
}

const { frames, timeline } = buildTimeline();
const TOTAL_MS = timeline.reduce((sum, b) => sum + b.ms, 0);

// One keyframe per beat, held (step-end) until the next; the sheet slides one
// stage width per frame. Paused off screen. Under reduced motion the site's
// global rule ends it at once and fill-mode holds the face-off.
const CSS = (() => {
  let at = 0;
  const steps = timeline.map(({ frame, ms }) => {
    const rule = `${((at / TOTAL_MS) * 100).toFixed(3)}%{transform:translateX(-${frame * STAGE_W}px)}`;
    at += ms;
    return rule;
  });
  return (
    `@keyframes footer-fight{${steps.join('')}100%{transform:translateX(-${timeline[0].frame * STAGE_W}px)}}` +
    `.footer-fight-sheet{animation:footer-fight ${TOTAL_MS}ms step-end infinite both paused}` +
    `.footer-fight[data-playing] .footer-fight-sheet{animation-play-state:running}`
  );
})();

function Scene({ twist }: { twist: boolean }) {
  const [sprites] = useState(buildSprites);
  const place = (who: Cast, f: Fig) => <use href={`#${spriteId(who, f)}`} x={f.x} y={-(f.lift ?? 0)} />;
  // A contact shadow on the floor under each man's feet - it stays down when
  // he is knocked into the air, which is what sells the height.
  const shadow = (who: Character, f: Fig) => {
    if (f.pose === 'ko') return <use href="#ff-fx-shadowWide" x={f.x + 1} y={22} />;
    const width = WIDTHS.get(`${who}-${f.pose}`) ?? SPRITE_W;
    return <use href="#ff-fx-shadow" x={who === 'tyler' ? f.x + 1 : f.x + width - 13} y={22} />;
  };
  return (
    <>
      <defs>
        {[...sprites].map(([id, paths]) => (
          <g key={id} id={id}>
            {paths.map((p, i) => (
              <path key={i} d={p.d} fill={p.color} />
            ))}
          </g>
        ))}
      </defs>
      <style>{CSS}</style>
      <use href="#ff-fx-soap" x={RING_X + 1} y={20} />
      <g className="footer-fight-sheet">
        {frames.map(({ beat, crowd }, i) => (
          <g key={i} transform={`translate(${i * STAGE_W + (beat.shake ?? 0)} 0)`}>
            {/* The crowd stands a step back: drawn first, a shade dimmer. */}
            <g opacity={0.85}>
              {CROWD.map((c, j) => (
                <g key={j}>
                  <use href="#ff-fx-shadow" x={c.mirror ? c.x + 3 : c.x + 1} y={22} />
                  <use
                    href={`#ff-crowd-${c.who}-${crowd[j]}-${c.mirror ? 'l' : 'r'}`}
                    x={c.x}
                    // A taller sprite stands on the same floor.
                    y={SPRITE_H - (CROWD_H.get(crowd[j]) ?? SPRITE_H)}
                  />
                </g>
              ))}
            </g>
            <g transform={`translate(${RING_X} 0)`}>
              {shadow('tyler', beat.t)}
              {shadow('narrator', beat.n)}
              {place(twist ? 'twin' : 'tyler', beat.t)}
              {place('narrator', beat.n)}
              {beat.fx?.map((e, j) => (
                <use key={j} href={`#ff-fx-${e.name}`} x={e.x} y={e.y} />
              ))}
            </g>
          </g>
        ))}
      </g>
    </>
  );
}

let greeted = false;

/**
 * Tyler Durden and the Narrator as little pixel sprites, going at it on the
 * footer rule: a jab, a counter, a knockout with stars, and Tyler helping him
 * up for the next round. Hover it (or tap it) for the film's twist: there is
 * no Tyler - the Narrator has been fighting himself. Built only once the footer scrolls into view,
 * so it adds nothing to the page's HTML.
 */
export function FooterFight({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [seen, setSeen] = useState(false);
  const [inView, setInView] = useState(false);
  const [twist, setTwist] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (!entry.isIntersecting) return;
      setSeen(true);
      if (!greeted) {
        greeted = true;
        // For whoever has the console open.
        console.log('%cI am Jack\'s console. You found it.', 'font: 12px ui-monospace, monospace; color: #e04646');
      }
    });
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);

  const isMouse = (e: { nativeEvent: Event }) => (e.nativeEvent as PointerEvent).pointerType === 'mouse';

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox={`0 ${-HEADROOM} ${STAGE_W} ${SPRITE_H + HEADROOM}`}
      shapeRendering="crispEdges"
      data-playing={inView || undefined}
      className={`footer-fight ${className ?? ''}`}
      onPointerEnter={(e) => isMouse(e) && setTwist(true)}
      onPointerLeave={(e) => isMouse(e) && setTwist(false)}
      // Touch has no hover: a tap flips it instead.
      onClick={(e) => !isMouse(e) && setTwist((v) => !v)}
    >
      <title>you do not talk about this footer</title>
      {seen && <Scene twist={twist} />}
    </svg>
  );
}
