// The footer fight's stage size, in art pixels. Its own file so the lazy
// placeholder (footer-fight-lazy.tsx) can hold exactly the scene's box
// without importing the fight and its sprite data into the first bundle.

export const STAGE_W = 160;
/** Floor to the top of a standing fighter. */
export const STAGE_H = 24;
/** Rows of headroom above the fighters, for the crowd's raised fists. */
export const HEADROOM = 3;
export const STAGE_VIEWBOX = `0 ${-HEADROOM} ${STAGE_W} ${STAGE_H + HEADROOM}`;
