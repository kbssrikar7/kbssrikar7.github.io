import { BUCKET_LABELS, type Project } from '@/lib/projects';

/**
 * Cover for projects with nothing to screenshot - firmware, desktop apps, a
 * PCB, a retired demo. Rendered in the DOM rather than generated as a PNG, so
 * it stays sharp at any size and costs no bytes.
 *
 * `project.hue` is assigned once in lib/projects.ts and shared with the OG card.
 */
export function GeneratedCover({ project }: { project: Project }) {
  const hue = project.hue;
  const tint = `oklch(0.62 0.13 ${hue})`;

  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden p-6"
      style={{
        background: `
          radial-gradient(ellipse 90% 70% at 15% 0%, color-mix(in oklch, ${tint} 26%, transparent), transparent),
          linear-gradient(160deg, oklch(0.20 0 0), oklch(0.145 0 0))
        `,
      }}
      aria-hidden
    >
      {/* Hairline grid, echoing the schematic / terminal register of this work. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 30% 40%, black, transparent)',
        }}
      />

      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[13px] uppercase tracking-[0.18em] text-white/80">
          {BUCKET_LABELS[project.bucket]}
        </span>
        <span className="font-pixel text-sm text-white/60">kbs</span>
      </div>

      <div className="relative">
        <h3
          className="font-mono text-2xl leading-tight font-medium tracking-tight sm:text-3xl"
          style={{ color: `oklch(0.95 0.03 ${hue})` }}
        >
          {project.title}
        </h3>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/12 bg-white/[0.04] px-2 py-0.5 font-mono text-[13px] text-white/60"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
