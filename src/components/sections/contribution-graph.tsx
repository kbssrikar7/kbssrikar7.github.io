'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { profile } from '@/data/profile';
import { snapshotContributions, type ContributionDay } from '@/lib/github';

// GitHub has no CORS-friendly endpoint for the contribution calendar, so this
// reads a public mirror of it. The page renders the build-time snapshot first
// (so the graph is there on first paint, with no loading state), then swaps in
// the live calendar when it lands - a static export would otherwise freeze the
// graph at whatever day it was last deployed. If the live request fails, the
// snapshot simply stays.
const USER = new URL(profile.github).pathname.slice(1);
const API = `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`;

type Day = ContributionDay;
type Data = { total: number; days: Day[] };
type Mode = 'daily' | 'weekly' | 'cumulative';

const MODES: Mode[] = ['daily', 'weekly', 'cumulative'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const GAP = 3;

/** Signal mixed into the empty-cell grey; 0 is an empty cell. */
const shade = (pct: number) => `color-mix(in oklch, var(--signal) ${Math.round(pct)}%, var(--muted))`;
const LEVEL_PCT = [0, 28, 50, 75, 100];

const fmtDay = (date: string, withYear = false) =>
  new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(withYear ? { year: 'numeric' } : {}),
    timeZone: 'UTC',
  });

const plural = (n: number) => `${n.toLocaleString('en-US')} contribution${n === 1 ? '' : 's'}`;

/** Sunday-first week columns, padded at both ends so every column has 7 cells. */
function toWeeks(days: Day[]): (Day | null)[][] {
  const lead = new Date(days[0].date + 'T00:00:00Z').getUTCDay();
  const cells: (Day | null)[] = [...Array(lead).fill(null), ...days];
  while (cells.length % 7) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function summarize(weeks: (Day | null)[][]) {
  const weekTotals = weeks.map((w) => w.reduce((s, d) => s + (d?.count ?? 0), 0));
  const maxWeek = Math.max(1, ...weekTotals);
  const busiest = weekTotals.indexOf(maxWeek);
  // Running total at the end of each day, in grid order.
  let running = 0;
  const cumulative = weeks.map((w) => w.map((d) => (d ? (running += d.count) : null)));
  return { weekTotals, maxWeek, busiest, cumulative, total: Math.max(1, running) };
}

const SNAPSHOT = snapshotContributions();

// While loading, the same grid empty, so the section does not change height
// when the data lands.
const PLACEHOLDER: (Day | null)[][] = Array.from({ length: 53 }, () => Array(7).fill(null));

export function ContributionGraph() {
  const [data, setData] = useState<Data | 'loading' | 'failed'>(() => SNAPSHOT ?? 'loading');
  const [mode, setMode] = useState<Mode>('daily');
  const [hover, setHover] = useState<{ week: number; day: number } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(API, { signal: AbortSignal.timeout(8000) })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json: { total: { lastYear: number }; contributions: Day[] }) => {
        if (!json.contributions?.length) throw new Error('empty');
        setData({ total: json.total.lastYear, days: json.contributions });
      })
      .catch(() => setData((prev) => (typeof prev === 'object' ? prev : 'failed')));
  }, []);

  // On a phone the grid is wider than the screen; start at the recent end.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [data]);

  const weeks = useMemo(() => (typeof data === 'object' ? toWeeks(data.days) : PLACEHOLDER), [data]);

  const stats = useMemo(() => summarize(weeks), [weeks]);

  function switchTo(next: Mode) {
    if (next === mode) return;
    setMode(next);
    // Cells shrink to dots and grow back as the new shading sweeps left to
    // right - the colour change alone is easy to miss on a wide grid.
    if (!grid.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    grid.current.querySelectorAll<HTMLElement>('[data-week]').forEach((el) => {
      el.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.35)', offset: 0.35 }, { transform: 'scale(1)' }], {
        duration: 520,
        delay: Number(el.dataset.week) * 7,
        easing: 'cubic-bezier(0.3, 0, 0.2, 1)',
      });
    });
  }

  if (data === 'failed') {
    return (
      <p className="font-mono text-sm text-muted-foreground">
        Could not load the graph.{' '}
        <a href={profile.github} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-signal">
          See it on GitHub
        </a>
        .
      </p>
    );
  }

  const loading = data === 'loading';

  function cellColor(w: number, d: number): string | null {
    const day = weeks[w][d];
    if (mode === 'weekly') {
      // The whole column is one bar, padding cells included, so a partial
      // first or last week still draws full height.
      const t = stats.weekTotals[w];
      return shade(t ? 18 + 82 * Math.sqrt(t / stats.maxWeek) : 0);
    }
    if (!day) return null;
    if (mode === 'daily') return shade(LEVEL_PCT[day.level]);
    return shade(8 + 92 * ((stats.cumulative[w][d] ?? 0) / stats.total));
  }

  function readout() {
    if (loading) return <span className="inline-block h-3.5 w-56 animate-pulse rounded bg-muted align-middle" />;
    if (hover) {
      const day = weeks[hover.week][hover.day];
      if (mode === 'weekly') {
        const first = weeks[hover.week].find((x) => x !== null);
        return first ? `${plural(stats.weekTotals[hover.week])} in the week of ${fmtDay(first.date)}` : null;
      }
      if (!day) return null;
      if (mode === 'daily') return `${plural(day.count)} on ${fmtDay(day.date, true)}`;
      return `${plural(stats.cumulative[hover.week][hover.day] ?? 0)} by ${fmtDay(day.date, true)}`;
    }
    if (mode === 'weekly') {
      const first = weeks[stats.busiest].find((x) => x !== null);
      return `Busiest week: ${plural(stats.weekTotals[stats.busiest])}, week of ${first ? fmtDay(first.date, true) : ''}`;
    }
    return (
      <>
        {plural((data as Data).total)} in the last year on{' '}
        <a href={profile.github} target="_blank" rel="noreferrer" className="text-foreground underline underline-offset-2 hover:text-signal">
          GitHub
        </a>
      </>
    );
  }

  return (
    <div>
      <div role="group" aria-label="Graph view" className="inline-flex rounded-md border border-border p-0.5 font-mono text-sm">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            disabled={loading}
            onClick={() => switchTo(m)}
            className={cn(
              'rounded-[5px] px-3 py-1 transition-colors',
              mode === m ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-signal'
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Phones scroll the year sideways (see the scrollLeft effect). The
          scrollbar is hidden and the left edge fades, so the clipped side
          reads as "more this way" instead of a cut-off label. */}
      <div
        ref={scroller}
        className="mt-6 overflow-x-auto [scrollbar-width:none] max-sm:[mask-image:linear-gradient(to_right,transparent,black_2rem)] [&::-webkit-scrollbar]:hidden"
      >
        <div className="min-w-[44rem]">
          <div
            ref={grid}
            className="grid grid-flow-col auto-cols-fr"
            style={{ gap: GAP }}
            onPointerLeave={() => setHover(null)}
            aria-label={loading ? 'Loading contribution graph' : `Contribution graph, ${mode} view`}
            role="img"
          >
            {weeks.map((week, w) => (
              <div key={w} className="grid grid-rows-7" style={{ gap: GAP }}>
                {week.map((_, d) => {
                  const color = loading ? null : cellColor(w, d);
                  const bar = mode === 'weekly';
                  const isHover = hover?.week === w && (bar || hover.day === d);
                  return (
                    <span
                      key={d}
                      data-week={w}
                      onPointerEnter={() => color && setHover({ week: w, day: d })}
                      className={cn(
                        'aspect-square',
                        loading && 'animate-pulse bg-muted',
                        isHover && 'outline outline-1 outline-foreground/60'
                      )}
                      style={{
                        backgroundColor: color ?? 'transparent',
                        // Weekly: each cell paints the gap below it in its own
                        // colour and squares its inner corners, so the column
                        // reads as one bar without the grid changing height.
                        // One pixel past the gap: an exact fit left hairline
                        // seams where fractional row heights round apart.
                        boxShadow: `0 ${GAP + 1}px 0 0 ${bar && d < 6 && color ? color : 'transparent'}`,
                        borderRadius: bar ? `${d === 0 ? 3 : 0}px ${d === 0 ? 3 : 0}px ${d === 6 ? 3 : 0}px ${d === 6 ? 3 : 0}px` : 3,
                        transitionProperty: 'background-color, box-shadow, border-radius',
                        transitionDuration: '420ms',
                        transitionDelay: `${w * 7}ms`,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Month label under the first week that starts in that month. */}
          <div className="mt-3 grid h-4 grid-flow-col auto-cols-fr font-mono text-xs text-muted-foreground" style={{ gap: GAP }}>
            {weeks.map((week, i) => {
              const first = week.find((d) => d !== null);
              const prev = weeks[i - 1]?.find((d) => d !== null);
              const month = first ? Number(first.date.slice(5, 7)) - 1 : -1;
              const show = first && (!prev || Number(prev.date.slice(5, 7)) - 1 !== month) && i < weeks.length - 2;
              return (
                <span key={i} className="whitespace-nowrap">
                  {show ? MONTHS[month] : ''}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed height (two lines on a phone, where it wraps): the hover text
          must not push the page around. */}
      <p className="mt-4 h-12 font-mono text-sm leading-6 text-muted-foreground tabular-nums sm:h-6" aria-live="polite">
        {readout()}
      </p>
    </div>
  );
}
