'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { profile } from '@/data/profile';

// Both hosts hit the same URL: GitHub Pages has no server to run the API
// route on, and Vercel serving its own copy at a relative path would still
// need the same absolute-URL code path, so there is no reason to branch.
const VISITOR_COUNT_URL = `${profile.vercelUrl}/api/visitor-count`;

export function VisitorCount({ href }: { href?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(VISITOR_COUNT_URL)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && typeof data.visitors === 'number') setCount(data.visitors);
      })
      .catch(() => {
        // No API key configured yet, or the request failed - stay hidden.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) return null;

  const badge = (
    <span className="flex items-center gap-1.5 rounded-md px-1.5 py-1.5 font-mono text-[13px] text-muted-foreground">
      <Eye className="size-4" />
      {count.toLocaleString()}
    </span>
  );

  if (!href) return badge;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title="Site visitor stats"
      className="transition-colors hover:text-foreground"
    >
      {badge}
    </a>
  );
}
