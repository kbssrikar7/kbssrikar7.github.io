'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

/** The address as a mailto link, with a copy button beside it: on webmail,
    mailto opens a desktop client nobody set up, so copying is often the
    faster path. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard blocked (insecure context, permissions): the link still works.
    }
  }

  return (
    <div className="inline-flex max-w-full items-stretch overflow-hidden rounded-full border border-border bg-card/60">
      <a
        href={`mailto:${email}`}
        className="flex min-w-0 items-center gap-2.5 py-3 pr-4 pl-5 text-base transition-colors hover:text-signal sm:text-lg"
      >
        <Mail aria-hidden className="size-4 shrink-0" />
        <span className="truncate">{email}</span>
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Email address copied' : 'Copy email address'}
        className={cn(
          'flex items-center gap-1.5 border-l border-border px-4 font-mono text-sm transition-colors',
          copied ? 'text-signal' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
        <span className="hidden sm:inline">{copied ? 'copied' : 'copy'}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </div>
  );
}
