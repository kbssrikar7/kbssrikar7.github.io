'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import { profile, socials } from '@/data/profile';
import { NAV } from './nav-items';

export type PaletteEntry = { slug: string; title: string };

/**
 * The search dialog itself. It and its libraries (cmdk, the Radix dialog) are
 * split out of the page bundle and loaded on demand by command-palette.tsx:
 * ~29KB of script nobody needs until they search.
 */
export default function PaletteDialog({
  open,
  setOpen,
  projects,
  go,
  singleKeyNav,
  toggleSingleKeyNav,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  projects: PaletteEntry[];
  go: (href: string) => void;
  singleKeyNav: boolean;
  toggleSingleKeyNav: () => void;
}) {
  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Search" description="Jump to anything">
      <CommandInput placeholder="Jump to a page or project..." />
      <CommandList>
        <CommandEmpty>Nothing found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {NAV.map((n) => (
            <CommandItem key={n.href} value={n.label} onSelect={() => go(n.href)}>
              {n.label}
              <CommandShortcut className="font-mono text-[13px] tracking-normal">{n.key}</CommandShortcut>
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
              <CommandShortcut className="font-mono text-[13px] tracking-normal">@{s.handle}</CommandShortcut>
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
            <CommandShortcut className="font-mono text-[13px] tracking-normal">
              {profile.email}
            </CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Preferences">
          <CommandItem value="Toggle single-key shortcuts" onSelect={toggleSingleKeyNav}>
            {singleKeyNav ? 'disable' : 'enable'} single-key shortcuts
            <CommandShortcut className="font-mono text-[13px] tracking-normal">
              {NAV.map((n) => n.key).join(' ')}
            </CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
