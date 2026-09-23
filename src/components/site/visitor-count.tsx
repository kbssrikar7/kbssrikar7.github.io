'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

// countapi.mileshilliard.com: free, no signup, no API key - because there is
// nothing secret to protect, unlike the Umami API (which needs Pro to expose
// a single number). Every /hit call both increments and returns the new
// total, so this counts page loads, not unique visitors - same convention
// every GitHub-README visitor badge uses. Key must be globally unique across
// everyone using this free service, so it is namespaced to the domain.
const COUNTER_KEY = 'kbssrikar7-github-io-portfolio';
const COUNTER_URL = `https://countapi.mileshilliard.com/api/v1/hit/${COUNTER_KEY}`;

export function VisitorCount({ href }: { href?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(COUNTER_URL)
      .then((r) => r.json())
      .then((data) => {
        const value = Number(data.value);
        if (!cancelled && Number.isFinite(value)) setCount(value);
      })
      .catch(() => {
        // Ad blockers commonly flag counter services as trackers - fail
        // silent, same as everything else here that depends on a 3rd party.
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
