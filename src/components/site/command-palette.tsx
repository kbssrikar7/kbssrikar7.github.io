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

const SHORTCUTS_KEY = 'kbs:single-key-nav';

export function CommandPalette({ projects }: { projects: Entry[] }) {
  const [open, setOpen] = useState(false);
  // WCAG 2.1.4: a single letter with no modifier must be possible to turn off,
  // for anyone on speech-input or switch-access software. Cmd/Ctrl+K keeps a
  // modifier, so it is exempt and stays on regardless.
  //
  // Read via a lazy initializer, not an effect: this only ever renders once the
  // dialog is opened by the user (well after hydration), so there is no SSR
  // value to mismatch against.
  const [singleKeyNav, setSingleKeyNav] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      return localStorage.getItem(SHORTCUTS_KEY) !== 'off';
    } catch {
      return true;
    }
  });
  const router = useRouter();

  function toggleSingleKeyNav() {
    setSingleKeyNav((was) => {
      const next = !was;
      try {
        localStorage.setItem(SHORTCUTS_KEY, next ? 'on' : 'off');
      } catch {
        // Nothing persists, but the in-session toggle still works.
      }
      return next;
    });
  }

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
      if (!singleKeyNav || typing || open || e.metaKey || e.ctrlKey || e.altKey) return;

      // Single-key navigation, the pawann.dev move - but routing, not scrolling.
      const hit = NAV.find((n) => n.key === e.key.toLowerCase());
      if (hit) {
        e.preventDefault();
        router.push(hit.href);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, router, singleKeyNav]);

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
              <span className="ml-auto font-mono text-[13px] text-muted-foreground">{n.key}</span>
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
              onSelect={() => window.open(s.href, '_blank', 'noopener,noreferrer')}
            >
              {s.label}
              <span className="ml-auto font-mono text-[13px] text-muted-foreground">@{s.handle}</span>
            </CommandItem>
          ))}
          <CommandItem
            value="Email"
            onSelect={() => {
              // mailto: must not go through window.open('_blank') - it leaves a
              // stray empty tab behind. See the same fix in footer.tsx.
              window.location.href = `mailto:${profile.email}`;
            }}
          >
            email
            <span className="ml-auto font-mono text-[13px] text-muted-foreground">
              {profile.email}
            </span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Preferences">
          <CommandItem value="Toggle single-key shortcuts" onSelect={toggleSingleKeyNav}>
            {singleKeyNav ? 'disable' : 'enable'} single-key shortcuts
            <span className="ml-auto font-mono text-[13px] text-muted-foreground">
              h w p r
            </span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
