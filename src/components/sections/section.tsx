import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Section({
  id,
  label,
  title,
  more,
  children,
  className,
}: {
  id?: string;
  label: string;
  title?: string;
  more?: { href: string; label: string };
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn('mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24', className)}>
      <div className="mb-8 flex items-end justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h2 className="font-mono text-[13px] tracking-[0.2em] text-muted-foreground uppercase">
            {label}
          </h2>
          {title && <p className="mt-2 text-xl tracking-tight sm:text-2xl">{title}</p>}
        </div>
        {more && (
          <Link
            href={more.href}
            className="group inline-flex shrink-0 items-center gap-1.5 font-mono text-[13px] text-muted-foreground transition-colors hover:text-signal"
          >
            {more.label}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
