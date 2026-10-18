'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { NAV } from './nav-items';
import { TOGGLE_THEME_EVENT } from './theme';
import { isCurrentPage, scrollToTop } from './smooth-scroll';

type Entry = { slug: string; title: string };

const loadDialog = () => import('./palette-dialog');
// Out of the page bundle; see palette-dialog.tsx.
const PaletteDialog = dynamic(loadDialog, { ssr: false });

const SHORTCUTS_KEY = 'kbs:single-key-nav';

/** Fired by the nav's search button: touch screens have no ⌘K to press. */
export const OPEN_PALETTE_EVENT = 'kbs:open-palette';

// Asking for the page you are already on means "take me to the top".
function navigate(router: ReturnType<typeof useRouter>, href: string) {
  if (isCurrentPage(href)) scrollToTop();
  else router.push(href);
}

export function CommandPalette({ projects }: { projects: Entry[] }) {
  const [open, setOpen] = useState(false);
  // Mounted on first open, then kept, so closing and reopening is instant.
  const [loaded, setLoaded] = useState(false);
  if (open && !loaded) setLoaded(true);
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

      if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        window.dispatchEvent(new Event(TOGGLE_THEME_EVENT));
        return;
      }

      // Single-key navigation, the pawann.dev move - but routing, not scrolling.
      const hit = NAV.find((n) => n.key === e.key.toLowerCase());
      if (hit) {
        e.preventDefault();
        navigate(router, hit.href);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, router, singleKeyNav]);

  // Fetch the dialog's code once the page is idle, after it has loaded and
  // painted, so the first open does not wait on the network either.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2000));
    const prefetch = () => idle(() => void loadDialog());
    if (document.readyState === 'complete') prefetch();
    else window.addEventListener('load', prefetch, { once: true });
    return () => window.removeEventListener('load', prefetch);
  }, []);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_PALETTE_EVENT, show);
    return () => window.removeEventListener(OPEN_PALETTE_EVENT, show);
  }, []);

  function go(href: string) {
    setOpen(false);
    navigate(router, href);
  }

  return (
    loaded && (
      <PaletteDialog
        open={open}
        setOpen={setOpen}
        projects={projects}
        go={go}
        singleKeyNav={singleKeyNav}
        toggleSingleKeyNav={toggleSingleKeyNav}
      />
    )
  );
}
