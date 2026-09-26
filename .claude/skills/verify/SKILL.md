---
name: verify
description: Build, launch and drive the kbs portfolio (Next 16 static site) to observe a UI change at runtime.
---

# Verify the portfolio

## Launch
- Dev: `npx next dev -p 3300` (port 3000 is often taken by another local project -
  check `ss -ltnp | grep :3000` before assuming it is this site).
- Production (what GitHub Pages serves): `npm run build`, then
  `cd out && python3 -m http.server 3301`. Dev hydration is much slower than
  prod - anything timing-sensitive (entrance animations, hydration effects)
  must be re-checked against the prod export.

## Drive
- Headless Chrome via the repo's own `puppeteer-core`:
  `createRequire('<repo>/package.json')('puppeteer-core')`,
  `executablePath: '/usr/bin/google-chrome'`.
- Nav links carry trailing slashes in dev and export (`/work/`, not `/work`).
- For animation timing, sample in-page with `evaluateOnNewDocument` + a
  `requestAnimationFrame` loop - CDP round-trips are too coarse.
- Slow-device check: `Network.emulateNetworkConditions` (latency 150,
  ~200 KB/s) + `Emulation.setCPUThrottlingRate` 4.
- Worth probing on UI changes: `prefers-reduced-motion: reduce`, JS disabled,
  360px width (overflow = `scrollWidth - innerWidth`), client-side nav away
  and back.

## Gotchas
- `html` has `scrollbar-gutter: stable`; headless draws no scrollbar, so a
  ~15px plain strip on the right of full-bleed effects is a headless artefact.
