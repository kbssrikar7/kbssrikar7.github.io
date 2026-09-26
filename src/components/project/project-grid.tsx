'use client';

import { useMemo, useState } from 'react';
import { ProjectCard } from './project-card';
import { BUCKET_LABELS, type Bucket, type Project } from '@/lib/projects';
import { cn } from '@/lib/utils';

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Bucket | 'all'>('all');

  const buckets = useMemo(
    () => Array.from(new Set(projects.map((p) => p.bucket))) as Bucket[],
    [projects]
  );

  const shown = active === 'all' ? projects : projects.filter((p) => p.bucket === active);

  const filters: { key: Bucket | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'all', count: projects.length },
    ...buckets.map((b) => ({
      key: b,
      label: BUCKET_LABELS[b],
      count: projects.filter((p) => p.bucket === b).length,
    })),
  ];

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActive(f.key)}
            aria-pressed={active === f.key}
            className={cn(
              'rounded-full border px-3.5 py-1.5 font-mono text-sm transition-colors',
              active === f.key
                ? 'border-signal/40 bg-signal/10 text-signal'
                : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            )}
          >
            {f.label}
            <span className="ml-1.5 text-muted-foreground">{f.count}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
        {shown.map((p, i) => (
          <ProjectCard key={p.slug} project={p} priority={i < 2} />
        ))}
      </div>
    </>
  );
}
