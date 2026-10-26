// Tyler Durden and the Narrator as chibi pixel sprites, for the footer fight.
// Each character is a head (hair and face differ) on a shared body pose,
// coloured through a palette, so both share every pose and only the look
// changes. All art faces right; the Narrator is drawn mirrored.
//
// Grid letters: K outline, S skin, s skin shade, H hair, h hair shade,
// L hair highlight, G glasses lens, g lens shade, E eye, W eye highlight,
// M mouth, J top (jacket / shirt), j top shade, T top highlight, C chest
// (Tyler's bare chest / the Narrator's tie), c chest shade, P trousers,
// p trousers shade, B shoes, b shoe highlight. Light comes from the top left.
//
// Outlines are coloured, not black (the standard small-sprite technique):
// every K takes the dark shade of the part it borders, so the red jacket is
// edged in dark red, the hair in dark gold, and so on.

import { STAGE_H } from './fight-stage';

type Grid = readonly string[];

const HEADS = {
  // Spiky blond hair lit from the top left, red aviators, a smirk.
  tyler: [
    '..K..K..K...',
    '.KLK.KLKKLK.',
    '.KLHKHLHKHHK',
    'KHLHHHLHHHHK',
    'KHHHHHHHHhHK',
    'KhHHhHSSHHhK',
    'KhHsSSSSSSSK',
    'KhsSSKKKKKKK',
    'KhsSKGGgGGGK',
    'KssSSKKSKKKK',
    '.KsSSSSSMMK.',
    '..KsSSSSSK..',
    '...KKSSKK...',
  ],
  // Neat brown hair with a side part; tired eyes with bags under them.
  narrator: [
    '...KKKKKK...',
    '..KHHLLHHKK.',
    '.KHHLLLHHHHK',
    'KHHHHHHHHHHK',
    'KhHHHHHHHHHK',
    'KhHHhhHSSHHK',
    'KhhSSSSSSSSK',
    'KhsSSSSKKSSK',
    'KhsSSSSEWSSK',
    'KssSSSSssSSK',
    '.KsSSSSSMMK.',
    '..KsSSSSSK..',
    '...KKSSKK...',
  ],
  // The crowd. Bob - Robert Paulson - big, bald and soft-faced.
  bob: [
    '............',
    '............',
    '...KKKKKK...',
    '..KSLLSSSKK.',
    '.KSLSSSSSSSK',
    'KSSSSSSSSSSK',
    'KsSSSSSKKSSK',
    'KsSSSSSKESSK',
    'KsSSSSSSSSSK',
    'KssSSSSSsSSK',
    '.KsSSSSSMMK.',
    '..KsSSSSSK..',
    '...KKSSKK...',
  ],
  // A regular with a dark buzz cut.
  buzz: [
    '............',
    '....KKKKK...',
    '..KKhhhhhKK.',
    '.KhhhHhhhhhK',
    'KhhHhhhhhhhK',
    'KhhSSSSSSShK',
    'KhSSSSSKKSSK',
    'KsSSSSSKESSK',
    'KsSSSSSSSSSK',
    'KssSSSSSSSSK',
    '.KsSSSSSMMK.',
    '..KsSSSSSK..',
    '...KKSSKK...',
  ],
  // Angel Face: slicked blond hair, a pretty face (for now).
  angel: [
    '....KKKKK...',
    '..KKLLHHHKK.',
    '.KHLLHHHHHHK',
    'KHHHHHHHHHHK',
    'KHHhHHHHHHHK',
    'KHhSSSSSSSSK',
    'KhSSSSSKKSSK',
    'KhSSSSSKESSK',
    'KsSSSSSSSSSK',
    'KssSSSSSSSSK',
    '.KsSSSSSMMK.',
    '..KsSSSSSK..',
    '...KKSSKK...',
  ],
} satisfies Record<string, Grid>;

/** Face variants: head rows swapped in for a beat. */
const FACES = {
  // A glint sliding across Tyler's shades.
  glint1: { tyler: { 8: 'KhsSKWGgGGGK' } },
  glint2: { tyler: { 8: 'KhsSKGGgGWGK' } },
  // The Narrator blinks: brow up out of the way, the eye a 2px lid line.
  blink: { narrator: { 7: 'KhsSSSSSSSSK', 8: 'KhsSSSSKKSSK' } },
  // Knocked out: anime X eyes and a slack open mouth.
  ko: {
    narrator: { 7: 'KhsSSSKSKSSK', 8: 'KhsSSSSKSSSK', 9: 'KssSSSKSKSSK', 10: '.KsSSSSSKMK.' },
    tyler: { 7: 'KhsSSKKKKKKK', 8: 'KhsSKGKgKGGK', 10: '.KsSSSSSKMK.' },
  },
} satisfies Record<string, Partial<Record<string, Record<number, string>>>>;

export type Face = keyof typeof FACES;

/** A body pose: the grid below the neck, and where the head sits on it. */
type Body = {
  grid: Grid;
  head: [number, number];
  /** Painted after the head, at [x, y] from the body's top row: for a fist
      that has to land on the face rather than disappear behind it. */
  over?: { grid: Grid; at: [number, number] };
};

const BODIES = {
  // Fists up: the front one by the chin, the back one at the ribs.
  idle: {
    head: [1, 0],
    grid: [
      '...KKTJCCJKK.KK.',
      '..KTJJCcJJjKKSSK',
      '.KTJJJCcJJjjKSSK',
      '.KJJjJCcJJjKKKK.',
      '.KJKjJCcJJjK....',
      '.KSSKJCcJjjK....',
      '.KSsKjjjjjjK....',
      '..KKKPPPpPPK....',
      '...KPPPKKPpK....',
      '..KPPpK..KPpK...',
      '..KBbK...KBbK...',
      '.KBBBK..KBBBBK..',
    ],
  },
  // Breathing out: a pixel lower, knees bent wider.
  bob: {
    head: [1, 1],
    grid: [
      '................',
      '...KKTJCCJKK.KK.',
      '..KTJJCcJJjKKSSK',
      '.KTJJJCcJJjjKSSK',
      '.KJJjJCcJJjKKKK.',
      '.KSSKJCcJjjK....',
      '.KSsKjjjjjjK....',
      '..KKPPPPpPPK....',
      '..KPPPKKKPPpK...',
      '.KPPpK...KPPpK..',
      '.KBbK.....KBbK..',
      'KBBBK.....KBBBK.',
    ],
  },
  // Mid-stride, legs passing: alternates with idle to walk.
  walk: {
    head: [1, 0],
    grid: [
      '...KKTJCCJKK.KK.',
      '..KTJJCcJJjKKSSK',
      '.KTJJJCcJJjjKSSK',
      '.KJJjJCcJJjKKKK.',
      '.KJKjJCcJJjK....',
      '.KSSKJCcJjjK....',
      '.KSsKjjjjjjK....',
      '..KKKPPPpPK.....',
      '...KPPKPpK......',
      '...KPpKPpK......',
      '...KBbKBbK......',
      '..KBBBKBBBK.....',
    ],
  },
  // Anticipation: lean back, punching fist drawn in to the chest.
  windup: {
    head: [0, 1],
    grid: [
      '................',
      '..KKTJCCJKK.....',
      '.KTJJCcJJjK.....',
      'KTJJJCcJKSSK....',
      'KJJjJCcJKSsK....',
      'KJKjJCcJJKK.....',
      'KSSKJCcJjK......',
      'KSsKjjjjjK......',
      '.KKKPPPpPK......',
      '.KPPPKKPpPK.....',
      'KPPpK...KPpK....',
      'KBBBK...KBBBK...',
    ],
  },
  // Front arm thrown fully straight, weight on the front foot. Wider than
  // the other poses: the arm reaches 19px out instead of 15.
  punch: {
    head: [2, 0],
    grid: [
      '....KKTJCCJKK.......',
      '...KTJJCcJJjKKKKKKK.',
      '..KTJJJCcJJjjjjjjSSK',
      '..KJJjJCcJJKKKKKKSsK',
      '..KJKjJCcJJK.....KK.',
      '..KSSKJCcJjK........',
      '..KSsKjjjjjK........',
      '...KKKPPPpPK........',
      '..KPPPKKKPpK........',
      '.KPPpK...KPpK.......',
      'KBbK......KBbK......',
      'KBBK......KBBBK.....',
    ],
  },
  // Rocked back off a hit: head snapped back, arms flung.
  hurt: {
    head: [-1, 1],
    grid: [
      '.KK.KTJCCJKK....',
      'KSSKKJJCcJjK....',
      'KSsKJJJCcJjK....',
      '.KKJJjJCcJjK.KK.',
      '..KJJjJCcJjKKSSK',
      '..KJJjJCcJjjjSsK',
      '..KjjjjjjjjKKKK.',
      '...KKPPPpPPK....',
      '...KPPKKKPpK....',
      '..KPPpK..KPpK...',
      '.KBbK....KBbK...',
      '.KBBBK...KBBBK..',
    ],
  },
  // The twist: his own fist driven into his own cheek, head snapped back
  // from it. Only ever seen on the Narrator, in place of "Tyler" hitting him.
  selfpunch: {
    head: [-1, 1],
    grid: [
      '...KKTJCCJKKjK..',
      '..KTJJCcJJjKKjK.',
      '.KTJJJCcJJjjjjK.',
      '.KJJjJCcJJjKKK..',
      '.KJKjJCcJJjK....',
      '.KSSKJCcJjjK....',
      '.KSsKjjjjjjK....',
      '..KKKPPPpPPK....',
      '...KPPPKKPpK....',
      '..KPPpK..KPpK...',
      '..KBbK...KBbK...',
      '.KBBBK..KBBBBK..',
    ],
    over: {
      at: [7, -3],
      grid: ['.KKKK.', 'KSSSSK', 'KSsSSK', '.KKjK.'],
    },
  },
  // Down on one knee, a hand on it, getting up.
  rise: {
    head: [1, 4],
    grid: [
      '................',
      '................',
      '................',
      '...KKTJCCJKK....',
      '..KTJJCcJJjK....',
      '.KTJJJCcJJjK....',
      '.KJJjJCcJJjKK...',
      '.KSSKjjjjjKSSK..',
      '..KKPPPPpKSsK...',
      '..KPPPPPPPpKK...',
      '.KPPpKKKKPPpK...',
      'KBBBK....KBBBK..',
    ],
  },
  // A hand held well out, down and forward: get up. Wider than the rest,
  // so the open hand clears his own body.
  reach: {
    head: [2, 1],
    grid: [
      '..................',
      '...KKTJCCJKK......',
      '..KTJJCcJJjKK.....',
      '.KTJJJCcJJjjjK....',
      '.KJJjJCcJJKKjjK...',
      '.KJKjJCcJJK.KjjK..',
      '.KSSKJCcJjK..KjjK.',
      '.KSsKjjjjjK...KSSK',
      '..KKKPPPpPK...KSsK',
      '...KPPKKPpK....KK.',
      '..KBbK..KBbK......',
      '.KBBBK..KBBBK.....',
    ],
  },
  // Cheering: both fists pumped in the air above the head, chibi style, the
  // arms running up either side of it. Taller than the rest (26 rows), so
  // it is drawn 2px higher, into the stage's headroom.
  cheer: {
    head: [1, 14],
    grid: [
      'KKKK.......KKKK.',
      'KSSK.......KSSK.',
      'KSsK.......KSsK.',
      'KjK.........KjK.',
      'KjK.........KjK.',
      'KjK.........KjK.',
      'KjK.........KjK.',
      'KjK.........KjK.',
      'KjK.........KjK.',
      'KjK.........KjK.',
      'KjK.........KjK.',
      'KjK.........KjK.',
      'KjK.........KjK.',
      '.KjK.......KjK..',
      '.KjKKTJCCJKKjK..',
      '..KTJJCcJJjjK...',
      '.KTJJJCcJJjK....',
      '.KJJjJCcJJjK....',
      '.KJjjJCcJJjK....',
      '.KJJjJCcJjjK....',
      '.KjjjjjjjjjK....',
      '..KKKPPPpPPK....',
      '...KPPPKKPpK....',
      '..KPPpK..KPpK...',
      '..KBbK...KBbK...',
      '.KBBBK..KBBBBK..',
    ],
  },
  // Stood straight, arms at the sides, legs together: only ever seen turned
  // on its side, as the knockout.
  flat: {
    head: [2, 0],
    grid: [
      '....KKTJCCJKK...',
      '...KTJJJCcJJjK..',
      '..KTKJJJCcJJKjK.',
      '..KJKJjJCcJJKjK.',
      '..KJKJjJCcJJKjK.',
      '..KSKJjJCcJjKSK.',
      '..KSKjjjjjjjKSK.',
      '...KKPPPPpPPKK..',
      '....KPPPKpPK....',
      '....KPpK.KPK....',
      '....KBbK.KBbK...',
      '...KBBBK.KBBBK..',
    ],
  },
} satisfies Record<string, Body>;

type Palette = Record<string, string>;

const PALETTES = {
  tyler: {
    S: '#f6c8a4',
    s: '#d99c7a',
    H: '#f0cd62',
    h: '#c49a32',
    L: '#fff2b0',
    G: '#e04646',
    g: '#a52a2a',
    E: '#2a1a1a',
    M: '#9e4a3c',
    W: '#ffd9d0',
    J: '#c8372d',
    j: '#8f2219',
    T: '#ec6a52',
    C: '#f6c8a4',
    c: '#d99c7a',
    P: '#343a5c',
    p: '#232842',
    B: '#2a2a30',
    b: '#55556a',
  },
  narrator: {
    S: '#f6c8a4',
    s: '#d99c7a',
    H: '#6b4630',
    h: '#4a2f20',
    L: '#9a6a48',
    G: '#e04646',
    g: '#a52a2a',
    E: '#2a1a1a',
    M: '#9e4a3c',
    W: '#ffffff',
    J: '#f4f2ec',
    j: '#c7c3ba',
    T: '#ffffff',
    C: '#3d3466',
    c: '#2a2348',
    P: '#5a5f6e',
    p: '#41454f',
    B: '#4a3020',
    b: '#7a5338',
  },
  // Bob: a stretched brown tee over the bulk.
  bob: {
    S: '#e8b490',
    s: '#c48a68',
    L: '#ffe2cc',
    H: '#e8b490',
    h: '#c48a68',
    E: '#2a1a1a',
    M: '#8e4a3c',
    W: '#ffffff',
    J: '#8a6a4a',
    j: '#6a4e34',
    T: '#a8865f',
    C: '#8a6a4a',
    c: '#6a4e34',
    P: '#3f4250',
    p: '#2e313c',
    B: '#2a2420',
    b: '#4a4038',
  },
  // The buzz cut: a grey vest.
  buzz: {
    S: '#d9a07c',
    s: '#b47d5c',
    L: '#4a4440',
    H: '#3a3430',
    h: '#262220',
    E: '#2a1a1a',
    M: '#8e4a3c',
    W: '#ffffff',
    J: '#8c9096',
    j: '#686c72',
    T: '#a9adb2',
    C: '#8c9096',
    c: '#686c72',
    P: '#2f3546',
    p: '#222736',
    B: '#1e1e22',
    b: '#3c3c44',
  },
  // Angel Face: a white tee, the cleanest shirt in the basement.
  angel: {
    S: '#f3c6a4',
    s: '#d49c7c',
    L: '#fff6c8',
    H: '#e8d27a',
    h: '#bfa64a',
    E: '#2a1a1a',
    M: '#b45a50',
    W: '#ffffff',
    J: '#e6e4de',
    j: '#bdbab2',
    T: '#ffffff',
    C: '#e6e4de',
    c: '#bdbab2',
    P: '#4a5a78',
    p: '#36445e',
    B: '#2a2a30',
    b: '#4a4a56',
  },
} satisfies Record<string, Palette>;

/** The outline shade for each part, by the letter it borders. */
const CROWD_OUTLINE: Palette = { S: '#7a4430', s: '#7a4430', L: '#7a4430', W: '#7a4430', M: '#7a4430', E: '#7a4430', H: '#3a2a10', h: '#3a2a10', J: '#3a3530', j: '#3a3530', T: '#3a3530', C: '#3a3530', c: '#3a3530', P: '#191c26', p: '#191c26', B: '#101014', b: '#101014', G: '#3a2a10', g: '#3a2a10' };

const OUTLINES: Record<keyof typeof PALETTES, Palette> = {
  bob: CROWD_OUTLINE,
  buzz: CROWD_OUTLINE,
  angel: { ...CROWD_OUTLINE, H: '#6e5a18', h: '#6e5a18', L: '#6e5a18' },
  tyler: { H: '#7a5a12', h: '#7a5a12', L: '#7a5a12', g: '#5e1414', T: '#5c120c', c: '#8a4a32', b: '#101014', S: '#8a4a32', s: '#8a4a32', W: '#8a4a32', M: '#8a4a32', E: '#8a4a32', C: '#8a4a32', G: '#5e1414', J: '#5c120c', j: '#5c120c', P: '#151829', p: '#151829', B: '#101014' },
  narrator: { H: '#2e1b10', h: '#2e1b10', L: '#2e1b10', g: '#5e1414', T: '#6f6a60', c: '#1e1838', b: '#22150c', S: '#8a4a32', s: '#8a4a32', W: '#8a4a32', M: '#8a4a32', E: '#8a4a32', C: '#1e1838', G: '#5e1414', J: '#6f6a60', j: '#6f6a60', P: '#262932', p: '#262932', B: '#22150c' },
};
// Where an outline borders several parts, the one nearest the viewer wins.
const OUTLINE_PRIORITY = 'GgEWMSsCcHhLJjTPpBb';

export type Character = keyof typeof HEADS;
export type PoseName = Exclude<keyof typeof BODIES, 'flat'> | 'ko';

/** A sprite as rows of colours (null = clear). */
type Pixels = (string | null)[][];

export const SPRITE_W = 16;
export const SPRITE_H = STAGE_H;

function paint(target: string[][], grid: Grid, x: number, y: number) {
  grid.forEach((row, r) => {
    [...row].forEach((ch, c) => {
      if (ch === '.') return;
      const ty = y + r;
      const tx = x + c;
      if (ty >= 0 && ty < target.length && tx >= 0 && tx < target[0].length) target[ty][tx] = ch;
    });
  });
}

/** The pose as letters, before colouring. */
function letters(who: Character, pose: keyof typeof BODIES, face?: Face) {
  const body = BODIES[pose];
  const width = Math.max(SPRITE_W, ...body.grid.map((r) => r.length));
  // Taller poses (the cheer) grow upward; their feet stay on the last row.
  const height = Math.max(SPRITE_H, body.grid.length);
  const out = Array.from({ length: height }, () => Array<string>(width).fill('.'));
  const top = height - body.grid.length;
  paint(out, body.grid, 0, top);
  // The head sits on the neck, over the collar, with any face variant swapped in.
  const rows: Record<number, string> = (face && (FACES[face] as Partial<Record<Character, Record<number, string>>>)[who]) || {};
  const head = HEADS[who].map((row, i) => rows[i] ?? row);
  paint(out, head, body.head[0], top - head.length + 1 + body.head[1]);
  if ('over' in body && body.over) paint(out, body.over.grid, body.over.at[0], top + body.over.at[1]);
  return out;
}

const FLASH = '#ffe9a0';

function colour(who: Character, grid: string[][], flash: boolean): Pixels {
  const fill = PALETTES[who] as Palette;
  const edge = OUTLINES[who];
  return grid.map((row, y) =>
    row.map((ch, x) => {
      if (ch === '.') return null;
      if (ch !== 'K') return flash ? FLASH : fill[ch];
      // Outline: the darkest-priority neighbour decides its shade.
      const around = [grid[y - 1]?.[x], grid[y + 1]?.[x], row[x - 1], row[x + 1]].filter(
        (n): n is string => !!n && n !== '.' && n !== 'K'
      );
      const part = [...OUTLINE_PRIORITY].find((p) => around.includes(p));
      return part ? edge[part] : '#1b1a24';
    })
  );
}

/**
 * A pose, coloured. `flash` is the hit flash: the whole figure one bright
 * colour for a beat, outlines kept. Pale gold rather than white, so it pops
 * on the light page too.
 */
export function sprite(who: Character, pose: PoseName, flash = false, face?: Face): Pixels {
  if (pose === 'ko') {
    // Flat on his back with X eyes: the straight pose turned a quarter
    // anticlockwise, so the head lands behind him and the face points up.
    // Lying down he is SPRITE_H wide, so this sprite is wider than most.
    const flat = colour(who, letters(who, 'flat', 'ko'), flash);
    const out: Pixels = Array.from({ length: SPRITE_H }, () => Array<string | null>(SPRITE_H).fill(null));
    for (let y = 0; y < SPRITE_H; y++)
      for (let x = 0; x < SPRITE_W; x++) out[SPRITE_W - 1 - x + (SPRITE_H - SPRITE_W)][y] = flat[y][x];
    return out;
  }
  return colour(who, letters(who, pose, face), flash);
}

/** Same-colour horizontal runs as SVG path data, one path per colour. */
export function toPaths(px: Pixels, mirror: boolean) {
  const byColor = new Map<string, string>();
  px.forEach((row, y) => {
    const cells = mirror ? [...row].reverse() : row;
    let x = 0;
    while (x < cells.length) {
      const color = cells[x];
      let end = x + 1;
      while (end < cells.length && cells[end] === color) end++;
      if (color) byColor.set(color, (byColor.get(color) ?? '') + `M${x} ${y}h${end - x}v1h${x - end}z`);
      x = end;
    }
  });
  return [...byColor].map(([color, d]) => ({ color, d }));
}

/** Small effect sprites, drawn from letters: Y yellow, W white, D dust,
    Z star, V speed line, O ground shadow (translucent, so it darkens
    whatever page colour is under it), Q/q/R soap pink, shade and edge. */
const FX_COLORS: Palette = {
  Y: '#ffd23f',
  W: '#fffbe6',
  D: '#cfc8bd',
  d: '#a59d92',
  Z: '#ffe066',
  V: '#b9b4ab',
  O: '#0000002e',
  Q: '#f2a7c3',
  q: '#d77fa1',
  R: '#8c3d5e',
};

export const FX = {
  // Hit spark: the flash, then the scatter.
  spark1: ['...Y...', '.Y.W.Y.', '..WWW..', 'YWWWWWY', '..WWW..', '.Y.W.Y.', '...Y...'],
  spark2: ['Y.....Y', '.......', '...W...', '..W.W..', '...W...', '.......', 'Y.....Y'],
  // A bar of Paper Street soap, pink, on the basement floor.
  soap: ['.RRRRRR.', 'RQWQQQQR', 'RQQQQQqR', '.RRRRRR.'],
  // Anime speed lines trailing a thrown punch: above and below the arm,
  // never across it.
  speed: ['VVVVV.', '......', '......', '......', '......', '......', '.VVVVV'],
  // Contact shadows under a standing fighter and a fallen one.
  shadow: ['.OOOOOOOOOO.', 'OOOOOOOOOOOO'],
  shadowWide: ['..OOOOOOOOOOOOOOOOOO..', 'OOOOOOOOOOOOOOOOOOOOOO'],
  // Dust kicked up on landing, three frames, one puff at each end of him.
  dust1: ['.DD.', 'DddD'],
  dust2: ['D..D', '.DD.', 'DddD'],
  dust3: ['D...', '...d'],
  // Dizzy stars circling a knocked-out head, three positions.
  stars1: ['.Z.......', 'ZZZ...Z..', '.Z..........', '...........Z'],
  stars2: ['....Z......', '...ZZZ....Z', '....Z....ZZZ', 'Z.........Z.'],
  stars3: ['Z..........', '.......Z...', '......ZZZ..', '..Z....Z...'],
} satisfies Record<string, Grid>;

export function fx(name: keyof typeof FX) {
  const grid = FX[name];
  const width = Math.max(...grid.map((r) => r.length));
  const px: Pixels = grid.map((row) => [...row.padEnd(width, '.')].map((ch) => (ch === '.' ? null : FX_COLORS[ch])));
  return toPaths(px, false);
}
