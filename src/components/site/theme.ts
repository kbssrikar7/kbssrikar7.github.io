export const THEME_KEY = 'kbs:theme';

/** Fired by the "t" shortcut (command-palette.tsx); the toggle handles it. */
export const TOGGLE_THEME_EVENT = 'kbs:toggle-theme';

export type Theme = 'light' | 'dark';

/**
 * Runs inline in <head>, before first paint: the visitor's saved choice if
 * they made one, otherwise their system setting. Setting it any later would
 * flash the dark theme at light-mode visitors on every load.
 */
export const THEME_BOOTSTRAP = `(function(){var t;try{t=localStorage.getItem('${THEME_KEY}')}catch(e){}if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.theme=t})()`;
