/**
 * Capture project preview images. Run locally, commit the output:
 *     npm run shots
 *
 * Never runs in CI - it depends on third-party demo sites being up, and a
 * flaky capture would silently ship a broken-looking card.
 *
 * Tier 1: screenshot the live demo with the Chrome already on this machine.
 * Tier 2: pull a screenshot the repo's own README already ships.
 * Tier 3 (no file): projects with neither get a DOM-rendered cover at runtime,
 *         see components/project/generated-cover.tsx.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';
import { manualProjects } from '../src/data/projects.manual.ts';

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
  iframe[src*="vercel.live"] { display: none !important; }
`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
        !/in the oven|spinning up|Your app is/i.test(document.body.innerText)
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
    await page.addStyleTag({ content: HIDE_CHROME });
    // Let hero animations settle rather than catching them mid-fade.
    await sleep(2500);

    const stillAsleep = await page.evaluate(() =>
      document.body.innerText.includes('has gone to sleep')
    );
    if (stillAsleep) throw new Error('app still asleep after wake attempt');

    const file = `${slug}.webp`;
    await page.screenshot({ path: join(OUT, file), type: 'webp', quality: 82 });
    return file;
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

    const file = `${slug}.webp`;
    await page.screenshot({ path: join(OUT, file), type: 'webp', quality: 82 });
    return file;
  } catch (err) {
    console.error(`  FAIL  ${slug}: ${(err as Error).message}`);
    return null;
  }
}

const live = manualProjects.filter((p) => p.liveUrl);
const readme = manualProjects.filter((p) => !p.liveUrl && p.readmeImage);
const generated = manualProjects.filter((p) => !p.liveUrl && !p.readmeImage);

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

console.log(`tier 1 - capturing ${live.length} live demos`);
for (const p of live) {
  process.stdout.write(`  ${p.slug} ... `);
  const t0 = Date.now();
  const file = await capture(page, p.slug, p.liveUrl!);
  if (file) {
    console.log(`ok (${Date.now() - t0}ms)`);
    manifest[p.slug] = file;
  } else failed.push(p.slug);
}

console.log(`\ntier 2 - pulling ${readme.length} README screenshot(s)`);
for (const p of readme) {
  process.stdout.write(`  ${p.slug} ... `);
  const file = await fromReadme(page, p.slug, p.readmeImage!);
  if (file) {
    console.log('ok');
    manifest[p.slug] = file;
  } else failed.push(p.slug);
}

await browser.close();

console.log(`\ntier 3 - ${generated.length} DOM-rendered covers (no capture needed)`);
for (const p of generated) console.log(`  ${p.slug}`);

// Anything not in the manifest renders a generated cover instead.
await writeFile(
  join(OUT, 'manifest.json'),
  JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 2) + '\n'
);

console.log(`\ncaptured ${Object.keys(manifest).length}, failed ${failed.length}`);
if (failed.length) {
  console.log(`failed: ${failed.join(', ')}`);
  console.log('These fall back to a generated cover - re-run if the site was merely slow.');
}
