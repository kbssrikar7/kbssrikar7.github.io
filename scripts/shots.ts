/**
 * Capture project preview images. Run locally, commit the output:
 *     npm run shots
 *
 * Never runs in CI - it depends on third-party demo sites being up, and a
 * flaky capture would silently ship a broken-looking card.
 *
 * Tier 1: screenshot the live demo with the Chrome already on this machine,
 *         after its PREPARE step (if any) so the capture shows real output.
 * Tier 2: pull a screenshot the repo's own README already ships. Wins over
 *         tier 1 when set - for apps whose live URL opens on a login screen.
 * Tier 3 (no file): projects with neither get a DOM-rendered cover at runtime,
 *         see components/project/generated-cover.tsx.
 */
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';
import { manualProjects } from '../src/data/projects.manual.ts';
import { thumbName, variantName } from '../src/lib/preview-thumb.ts';

const CHROME = '/usr/bin/google-chrome';
const OUT = join(import.meta.dirname, '..', 'public', 'previews');
const WIDTH = 1200;
const HEIGHT = 750;

// Injected before capture: kills cookie banners and dev toolbars that would
// otherwise dominate the thumbnail.
const HIDE_CHROME = `
  [class*="cookie" i], [id*="cookie" i],
  [class*="consent" i], [id*="consent" i],
  vercel-live-feedback, [data-vercel-toolbar],
  iframe[src*="vercel.live"],
  a[href="https://github.com/kbssrikar7"][class*="fixed"],
  [class*="viewerBadge"], [class*="profileContainer"] { display: none !important; }
`;
// The last selectors: the "done by kbssrikar" credit pinned to several demos,
// and Streamlit Cloud's hosting badge - the portfolio already says who built
// them and where they run.

type Page = import('puppeteer-core').Page;

/**
 * An empty form or a blank chat box shows none of the work, so demos that only
 * come alive after input get driven before capture. Each waits for its backend,
 * which can take a minute to cold-start.
 */
const PREPARE: Record<string, (page: Page) => Promise<void>> = {
  'healthcare-qa-chatbot': async (page) => {
    await clickButton(page, /Type 2 Diabetes/);
    await page.waitForFunction(() => /Confidence/.test(document.body.innerText), { timeout: 180_000 });
    await sleep(2000);
    // Scroll the answer to its end so the confidence score and sources show.
    await clickButton(page, /Scroll to bottom/).catch(() => {});
    await sleep(1500);
  },
  'cardiac-risk-stratification': async (page) => {
    await clickButton(page, /Assess Risk/);
    await page.waitForFunction(() => /Rule-based cross-check/.test(document.body.innerText), { timeout: 180_000 });
    await sleep(1500);
  },
  'handwritten-equation-solver': async (page) => {
    // The model runs on a Hugging Face Space that sleeps when idle; a POST to a
    // sleeping Space just 503s - an ordinary GET is what wakes it.
    await fetch('https://kbsss-equation-solver.hf.space/').catch(() => {});
    await page.evaluate(() =>
      [...document.querySelectorAll('button')].find((b) => b.querySelector('img'))?.click()
    );
    await sleep(1500);
    for (let attempt = 0; ; attempt++) {
      await clickButton(page, /^Solve$/);
      const solved = await page
        .waitForFunction(() => /RESULT/i.test(document.body.innerText), { timeout: 18_000 })
        .then(() => true, () => false);
      if (solved) break;
      if (attempt === 9) throw new Error('solver backend never answered');
    }
    await page.evaluate(() => window.scrollTo(0, 160));
    await sleep(800);
  },
  'azure-cost-planner': async (page) => {
    // Streamlit renders the app inside a frame on streamlit.app, and the
    // button only exists once that frame has booted - poll for it.
    for (let i = 0; i < 30; i++) {
      for (const frame of page.frames()) {
        const done = await frame
          .evaluate(() => {
            if (/Cost Breakdown/.test(document.body.innerText)) return true;
            [...document.querySelectorAll('button')].find((b) => /Calculate/i.test(b.textContent ?? ''))?.click();
            return false;
          })
          .catch(() => false);
        if (done) {
          await sleep(1500);
          return;
        }
      }
      await sleep(1000);
    }
    throw new Error('cost breakdown never rendered');
  },
};

/**
 * Demos whose live URL opens on a login wall and whose README has no
 * screenshot. A login form shows none of the work, so these get a generated
 * cover instead of a capture.
 */
const LOGIN_WALLED = new Set(['led_control_deploy']);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Writes <slug>.webp (2400px), <slug>-1200.webp and <slug>-800.webp: the same
 * frame re-rendered at a lower device scale, not resampled. GitHub Pages has
 * no image optimizer, so src/lib/image-loader.ts serves the browser whichever
 * of these covers the width it needs.
 */
async function shoot(page: Page, slug: string): Promise<string> {
  const file = `${slug}.webp`;
  await page.screenshot({ path: join(OUT, file), type: 'webp', quality: 82 });
  for (const [width, scale] of [[1200, 1], [800, 2 / 3]] as const) {
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: scale });
    await sleep(300);
    await page.screenshot({ path: join(OUT, variantName(file, width)), type: 'webp', quality: 82 });
  }
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });
  return file;
}

async function clickButton(page: Page, label: RegExp) {
  const found = await page.evaluate((source) => {
    const re = new RegExp(source);
    const btn = [...document.querySelectorAll('button')].find(
      (b) => re.test((b.textContent ?? '').trim()) || re.test(b.getAttribute('aria-label') ?? '')
    );
    btn?.click();
    return Boolean(btn);
  }, label.source);
  if (!found) throw new Error(`no button matching ${label}`);
}

/**
 * Streamlit Community Cloud parks idle apps behind a "Zzzz / this app has gone
 * to sleep" interstitial. Capturing that is worse than having no screenshot, so
 * wake it and wait for the real app.
 */
async function wakeIfAsleep(page: import('puppeteer-core').Page): Promise<void> {
  const asleep = await page.evaluate(() =>
    document.body.innerText.includes('has gone to sleep')
  );
  if (!asleep) return;

  process.stdout.write('asleep, waking ... ');
  const clicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) =>
      /get this app back up/i.test(b.textContent ?? '')
    );
    btn?.click();
    return Boolean(btn);
  });
  if (!clicked) return;

  for (let i = 0; i < 30; i++) {
    await sleep(2000);
    const done = await page.evaluate(
      () =>
        !document.body.innerText.includes('has gone to sleep') &&
        !/in the oven|spinning up|Your app is|taking longer than normal/i.test(document.body.innerText)
    );
    if (done) {
      await sleep(3000); // let the first render settle
      return;
    }
  }
}

async function capture(
  page: import('puppeteer-core').Page,
  slug: string,
  url: string
): Promise<string | null> {
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45_000 });
    await wakeIfAsleep(page);
    // Streamlit also shows a "taking longer than normal" banner over a
    // half-loaded app without ever saying it is asleep.
    await page.waitForFunction(
      () => !/taking longer than normal|in the oven|spinning up/i.test(document.body.innerText),
      { timeout: 120_000 }
    );
    await page.addStyleTag({ content: HIDE_CHROME });
    // Let hero animations settle rather than catching them mid-fade.
    await sleep(2500);

    const stillAsleep = await page.evaluate(() =>
      document.body.innerText.includes('has gone to sleep')
    );
    if (stillAsleep) throw new Error('app still asleep after wake attempt');

    await PREPARE[slug]?.(page);
    return await shoot(page, slug);
  } catch (err) {
    console.error(`  FAIL  ${slug}: ${(err as Error).message.split('\n')[0]}`);
    return null;
  }
}

/**
 * Pull a screenshot the repo's own README ships, then letterbox it onto the
 * same 1200x750 dark canvas tier 1 produces, so the grid stays uniform.
 */
async function fromReadme(
  page: import('puppeteer-core').Page,
  slug: string,
  url: string
): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const b64 = Buffer.from(await res.arrayBuffer()).toString('base64');

    await page.setContent(
      `<html><body style="margin:0;width:${WIDTH}px;height:${HEIGHT}px;background:#09090b;
         display:flex;align-items:center;justify-content:center;overflow:hidden">
         <img src="data:image/png;base64,${b64}"
              style="max-width:100%;max-height:100%;object-fit:contain"/>
       </body></html>`,
      { waitUntil: 'load' }
    );
    await sleep(300);
    return await shoot(page, slug);
  } catch (err) {
    console.error(`  FAIL  ${slug}: ${(err as Error).message}`);
    return null;
  }
}

/** Non-project captures: products worked on, shown in the experience section. */
const EXTRA: { slug: string; liveUrl: string }[] = [
  { slug: 'wayship', liveUrl: 'https://volteomaritime.com/wayship' },
];

const readme = manualProjects.filter((p) => p.readmeImage);
const live = [
  ...manualProjects.filter((p) => p.liveUrl && !p.readmeImage && !LOGIN_WALLED.has(p.slug)),
  ...EXTRA,
];
const generated = manualProjects.filter(
  (p) => (!p.liveUrl || LOGIN_WALLED.has(p.slug)) && !p.readmeImage
);

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'],
});
const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });
await page.emulateMediaFeatures([
  { name: 'prefers-color-scheme', value: 'dark' },
  { name: 'prefers-reduced-motion', value: 'reduce' },
]);

const manifest: Record<string, string> = {};
const failed: string[] = [];
// A demo that is down today keeps its last good image rather than silently
// dropping to a generated cover.
const previous: Record<string, string> = JSON.parse(
  await readFile(join(OUT, 'manifest.json'), 'utf8').catch(() => '{}')
);

console.log(`tier 1 - capturing ${live.length} live demos`);
for (const p of live) {
  process.stdout.write(`  ${p.slug} ... `);
  const t0 = Date.now();
  const file = await capture(page, p.slug, p.liveUrl!);
  if (file) {
    console.log(`ok (${Date.now() - t0}ms)`);
    manifest[p.slug] = file;
  } else {
    failed.push(p.slug);
    if (previous[p.slug]) manifest[p.slug] = previous[p.slug];
  }
}

console.log(`\ntier 2 - pulling ${readme.length} README screenshot(s)`);
for (const p of readme) {
  process.stdout.write(`  ${p.slug} ... `);
  const file = await fromReadme(page, p.slug, p.readmeImage!);
  if (file) {
    console.log('ok');
    manifest[p.slug] = file;
  } else {
    failed.push(p.slug);
    if (previous[p.slug]) manifest[p.slug] = previous[p.slug];
  }
}

await browser.close();

console.log(`\ntier 3 - ${generated.length} DOM-rendered covers (no capture needed)`);
for (const p of generated) console.log(`  ${p.slug}`);

// Anything not in the manifest renders a generated cover instead.
await writeFile(
  join(OUT, 'manifest.json'),
  JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 2) + '\n'
);

// Drop images nothing points at any more (a project moved to a generated
// cover), or they ship forever.
const keep = new Set(Object.values(manifest).flatMap((f) => [f, thumbName(f), variantName(f, 800)]));
for (const f of await readdir(OUT)) {
  if (f.endsWith('.webp') && !keep.has(f)) {
    await rm(join(OUT, f));
    console.log(`  removed stale ${f}`);
  }
}

console.log(`\ncaptured ${Object.keys(manifest).length - failed.filter((s) => previous[s]).length}, failed ${failed.length}`);
if (failed.length) {
  console.log(`failed: ${failed.join(', ')}`);
  console.log('These keep their previous image if they had one - re-run if the site was merely slow.');
}
