'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { THEME_KEY, TOGGLE_THEME_EVENT, type Theme } from './theme';

const read = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

function saved(): Theme | null {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === 'light' || t === 'dark' ? t : null;
  } catch {
    return null;
  }
}

/**
 * Sun/moon switch. Until the visitor picks one, the site follows their
 * system setting, live (flip the OS to light at sunset and the page follows).
 * Picking one pins it. The switch itself is a circle of the new theme
 * spreading out from the button, where the browser supports it.
 */
export function ThemeToggle() {
  // The server cannot know the theme; dark is what it renders, and the inline
  // head script has already set the real one before hydration.
  const theme = useSyncExternalStore(subscribe, read, () => 'dark' as Theme);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: light)');
    const follow = () => {
      if (!saved()) document.documentElement.dataset.theme = media.matches ? 'light' : 'dark';
    };
    media.addEventListener('change', follow);
    // The "t" shortcut: same switch, spreading from this button.
    const shortcut = () => toggle();
    window.addEventListener(TOGGLE_THEME_EVENT, shortcut);
    return () => {
      media.removeEventListener('change', follow);
      window.removeEventListener(TOGGLE_THEME_EVENT, shortcut);
    };
  }, []);

  function toggle() {
    const next: Theme = read() === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private mode: the switch still works for this page view.
    }
    const apply = () => {
      document.documentElement.dataset.theme = next;
    };
    const root = document.documentElement;
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply();
      return;
    }
    const { left, top, width, height } = button.current!.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    // The class scopes the custom view-transition CSS to theme switches, so
    // the project-card morph keeps the browser's default crossfade.
    root.classList.add('theme-switch');
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 550, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
    transition.finished.finally(() => root.classList.remove('theme-switch'));
  }

  // The icon shows the theme it switches TO, so it reads as an action.
  const target = theme === 'light' ? 'dark' : 'light';
  const label = `Switch to ${target} theme`;
  return (
    <button
      ref={button}
      type="button"
      onClick={toggle}
      aria-label={label}
      title={`${label} (t)`}
      className="flex size-[30px] items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-signal/40 hover:text-signal"
    >
      {target === 'dark' ? <Moon aria-hidden className="size-4" /> : <Sun aria-hidden className="size-4" />}
    </button>
  );
}
