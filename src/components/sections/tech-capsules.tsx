import Image from 'next/image';
import { GitFork, Network } from 'lucide-react';
import type { CSSProperties } from 'react';
import { stack } from '@/data/profile';
import { techIcon } from '@/lib/tech-icons';
import { cn } from '@/lib/utils';
import styles from './tech-capsules.module.css';

// The six stack groups, paired into three rows that drift in alternating
// directions: what I write in, what I build with, where it runs.
const ROWS = [
  ['languages', 'frontend'],
  ['backend + ml', 'ai + retrieval'],
  ['infra', 'data + cloud'],
].map((labels) => stack.filter((g) => labels.includes(g.label)).flatMap((g) => g.items));

// Concepts with no logo get a plain glyph in the same circle.
const FALLBACK: Record<string, typeof Network> = { RAG: Network, XGBoost: GitFork };

function Capsule({ name }: { name: string }) {
  const icon = techIcon(name);
  const Glyph = FALLBACK[name] ?? Network;
  return (
    <li className="flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-card/60 py-1.5 pr-4 pl-1.5 transition-colors hover:border-signal/40">
      {icon ? (
        <Image src={icon} alt="" width={28} height={28} unoptimized className="size-7 rounded-full" />
      ) : (
        <span className="flex size-7 items-center justify-center rounded-full bg-muted text-signal">
          <Glyph aria-hidden className="size-4" />
        </span>
      )}
      <span className="text-[15px] whitespace-nowrap text-foreground/85">{name}</span>
    </li>
  );
}

export function TechCapsules() {
  return (
    <>
      {/* The moving rows are decoration; this is the list a screen reader gets. */}
      <ul className="sr-only">
        {stack.flatMap((g) => g.items).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div aria-hidden className="space-y-3">
        {ROWS.map((items, i) => (
          <div
            key={i}
            className={cn(styles.row, i % 2 === 1 && styles.reverse)}
            // Duration scales with length, so every row moves at the same speed.
            style={{ '--duration': `${items.length * 3.2}s` } as CSSProperties}
          >
            <div className={styles.track}>
              {[0, 1].map((copy) => (
                <ul key={copy} className={styles.copy}>
                  {items.map((item) => (
                    <Capsule key={item} name={item} />
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
