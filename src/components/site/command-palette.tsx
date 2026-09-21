'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { profile, socials } from '@/data/profile';
import { NAV } from './nav-items';

type Entry = { slug: string; title: string };

export function CommandPalette({ projects }: { projects: Entry[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (typing || open || e.metaKey || e.ctrlKey || e.altKey) return;

      // Single-key navigation, the pawann.dev move - but routing, not scrolling.
      const hit = NAV.find((n) => n.key === e.key.toLowerCase());
      if (hit) {
        e.preventDefault();
        router.push(hit.href);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, router]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Search" description="Jump to anything">
      <CommandInput placeholder="Jump to a page or project..." />
      <CommandList>
        <CommandEmpty>Nothing found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {NAV.map((n) => (
            <CommandItem key={n.href} value={n.label} onSelect={() => go(n.href)}>
              {n.label}
              <span className="ml-auto font-mono text-xs text-muted-foreground">{n.key}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Projects">
          {projects.map((p) => (
            <CommandItem
              key={p.slug}
              value={p.title}
              onSelect={() => go(`/projects/${p.slug}`)}
            >
              {p.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Elsewhere">
          {socials.map((s) => (
            <CommandItem
              key={s.key}
              value={`${s.label} ${s.handle}`}
              onSelect={() => window.open(s.href, '_blank')}
            >
              {s.label}
              <span className="ml-auto font-mono text-xs text-muted-foreground">@{s.handle}</span>
            </CommandItem>
          ))}
          <CommandItem
            value="Email"
            onSelect={() => window.open(`mailto:${profile.email}`, '_blank')}
          >
            email
            <span className="ml-auto font-mono text-xs text-muted-foreground">
              {profile.email}
            </span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
