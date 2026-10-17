'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type Section = { id: string; label: string };

const STEP = 36; // px between rail stops

/**
 * Where you are in a long project page. Wide screens get a dotted rail in the
 * left margin with a marker that glides between sections as you scroll;
 * narrower ones get a pill at the bottom with a progress ring and the current
 * section, tapping it jumps to the next. Hidden until the first section is
 * reached, so it never sits over the page header.
 */
export function ScrollMap({ sections }: { sections: Section[] }) {
  // index of the current section plus progress through it, e.g. 1.4
  const [pos, setPos] = useState(-1);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const anchor = window.innerHeight * 0.3;
      const tops = sections.map((s) => document.getElementById(s.id)?.getBoundingClientRect().top ?? Infinity);
      const i = tops.findLastIndex((t) => t <= anchor);
      if (i === -1) return setPos(-1);
      // The last section runs to the end of the page, not to a next heading.
      const end =
        i + 1 < tops.length ? tops[i + 1] : document.documentElement.scrollHeight - window.scrollY - window.innerHeight + anchor + 1;
      const p = Math.min(1, Math.max(0, (anchor - tops[i]) / Math.max(1, end - tops[i])));
      setPos(i + (i === sections.length - 1 ? p : Math.min(p, 0.999)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sections]);

  const active = Math.floor(Math.max(0, pos));
  const visible = pos >= 0;
  // pos runs from 0 to sections.length (the last section's progress counts
  // through to the end of the page), so this is progress through all of them.
  const overall = visible ? Math.min(1, pos / sections.length) : 0;

  function go(id: string) {
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  }

  const next = sections[active + 1];
  const R = 9;
  const C = 2 * Math.PI * R;

  return (
    <>
      <nav
        aria-label="On this page"
        className={cn(
          'fixed top-1/2 z-30 hidden -translate-y-1/2 transition-opacity duration-300 min-[1400px]:block',
          visible ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        // Centred in the margin left of the 64rem content column.
        style={{ left: 'max(1rem, calc((100vw - 64rem) / 2 - 12rem))' }}
      >
        <div className="relative">
          {/* The dotted rail, then the marker riding it. */}
          <span
            aria-hidden
            className="absolute top-[7px] left-[3px] border-l border-dotted border-muted-foreground/50"
            style={{ height: (sections.length - 1) * STEP }}
          />
          <span
            aria-hidden
            className="absolute left-0 size-[7px] rounded-full bg-signal shadow-[0_0_10px_var(--signal)] transition-[top] duration-150 ease-out motion-reduce:transition-none"
            style={{ top: 4 + Math.max(0, pos) * STEP }}
          />
          <ol>
            {sections.map((s, i) => (
              <li key={s.id} style={{ height: STEP }}>
                <button
                  type="button"
                  onClick={() => go(s.id)}
                  aria-current={i === active && visible ? 'location' : undefined}
                  className={cn(
                    'pl-5 text-left font-mono text-xs tracking-wide transition-colors hover:text-signal',
                    i === active ? 'text-foreground' : i < active ? 'text-muted-foreground' : 'text-muted-foreground/60'
                  )}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <button
        type="button"
        onClick={() => next && go(next.id)}
        disabled={!next}
        aria-label={next ? `Jump to next section: ${next.label}` : `Last section: ${sections[active]?.label}`}
        className={cn(
          'fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-border bg-background/85 py-1.5 pr-4 pl-1.5 font-mono text-[13px] shadow-lg backdrop-blur-md transition-[opacity,translate] duration-300 min-[1400px]:hidden',
          visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        )}
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-6 -rotate-90">
          <circle cx="12" cy="12" r={R} fill="none" stroke="var(--border)" strokeWidth="2.5" />
          <circle
            cx="12"
            cy="12"
            r={R}
            fill="none"
            stroke="var(--signal)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - overall)}
          />
        </svg>
        <span className="text-foreground">{sections[active]?.label}</span>
        {next && <ChevronDown aria-hidden className="size-3.5 text-muted-foreground" />}
      </button>
    </>
  );
}
