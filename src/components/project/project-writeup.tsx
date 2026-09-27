import type { ManualProject } from '@/data/projects.manual';

type Writeup = NonNullable<ManualProject['writeup']>;

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-[13px] tracking-[0.2em] text-muted-foreground uppercase">
      {children}
    </h2>
  );
}

/**
 * The part of a project page an engineer reads: how the thing works, the
 * decisions behind it, and what it does not do. Content lives with the project
 * in projects.manual.ts.
 */
export function ProjectWriteup({ writeup }: { writeup: Writeup }) {
  return (
    <div className="mt-20 space-y-20">
      <section>
        <Label>how it works</Label>
        {/* A pipeline, drawn like a trace: numbered stages on a single rail. */}
        <ol className="relative mt-8 space-y-8 border-l border-border pl-8">
          {writeup.pipeline.map((s, i) => (
            <li key={`${s.step}-${i}`} className="relative">
              <span className="absolute top-0.5 -left-[2.55rem] flex size-5 items-center justify-center rounded-full border border-border bg-background font-mono text-[10px] text-muted-foreground">
                {i + 1}
              </span>
              <p className="font-mono text-sm tracking-wide text-foreground">{s.step}</p>
              <p className="mt-1.5 max-w-2xl text-base leading-relaxed text-muted-foreground">{s.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <Label>engineering notes</Label>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {writeup.notes.map((n) => (
            <div key={n.title} className="rounded-xl border border-border bg-card/50 p-6">
              <h3 className="text-lg font-medium tracking-tight">{n.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{n.body}</p>
            </div>
          ))}
        </div>
      </section>

      {writeup.limits && writeup.limits.length > 0 && (
        <section>
          <Label>known limits</Label>
          <ul className="mt-6 max-w-2xl space-y-3">
            {writeup.limits.map((l) => (
              <li
                key={l}
                className="relative pl-5 text-[15px] leading-relaxed text-muted-foreground before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-muted-foreground/60"
              >
                {l}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
