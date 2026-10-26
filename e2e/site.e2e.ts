import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, normalize } from 'node:path';
import puppeteer, { type Browser, type Page } from 'puppeteer-core';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Smoke tests for the built site: each one guards a bug that has shipped (or
// nearly shipped) before. Third-party requests (visitor counter, GitHub
// contributions mirror, analytics) are blocked, so their uptime can never
// fail a deploy.

const OUT = join(__dirname, '..', 'out');
const CHROME = process.env.CHROME_PATH ?? '/usr/bin/google-chrome';

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.pdf': 'application/pdf',
};

/** Serves out/ the way GitHub Pages does: /work/ is out/work/index.html. */
function serve(): Promise<Server> {
  const server = createServer((req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url!, 'http://x').pathname));
    let file = join(OUT, path);
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!file.startsWith(OUT) || !existsSync(file)) {
      res.writeHead(404, { 'content-type': TYPES['.html'] });
      return createReadStream(join(OUT, '404.html')).pipe(res);
    }
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

let server: Server;
let browser: Browser;
let base: string;

beforeAll(async () => {
  if (!existsSync(join(OUT, 'index.html'))) throw new Error('out/ is missing: run `npm run build` first');
  server = await serve();
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
});

afterAll(async () => {
  await browser?.close();
  server?.close();
});

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** A page that blocks third parties and records this site's own errors. */
async function open(width = 1280, height = 800) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, isMobile: width < 640, hasTouch: width < 640 });
  const errors: string[] = [];
  await page.setRequestInterception(true);
  page.on('request', (r) => (r.url().startsWith(base) ? r.continue() : r.abort()));
  page.on('pageerror', (e) => errors.push(`pageerror: ${(e as Error).message}`));
  page.on('console', (m) => {
    const from = m.location()?.url ?? '';
    if (m.type() === 'error' && from.startsWith(base) && !/status of 404/.test(m.text())) errors.push(m.text());
  });
  return { page, errors };
}

const sitemapPaths = () =>
  [...readFileSync(join(OUT, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

async function scrollToBottom(page: Page) {
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await wait(1500);
}

describe('every page', () => {
  it('loads with no errors and no sideways scroll on a 360px phone', async () => {
    const paths = sitemapPaths();
    expect(paths.length).toBeGreaterThan(5);
    const { page, errors } = await open(360, 780);
    for (const path of paths) {
      const res = await page.goto(base + path, { waitUntil: 'networkidle0' });
      expect(res?.status(), path).toBe(200);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow, `${path} scrolls sideways`).toBeLessThanOrEqual(0);
    }
    expect(errors).toEqual([]);
    await page.close();
  });

  it('serves a real 404 page', async () => {
    const { page, errors } = await open();
    const res = await page.goto(`${base}/no-such-page/`, { waitUntil: 'networkidle0' });
    expect(res?.status()).toBe(404);
    expect(await page.$eval('h1', (h) => h.textContent?.length)).toBeGreaterThan(0);
    expect(errors).toEqual([]);
    await page.close();
  });
});

describe('navigation', () => {
  it('a link to the page you are on scrolls back to the top', async () => {
    const { page } = await open();
    await page.goto(`${base}/`, { waitUntil: 'networkidle0' });
    await scrollToBottom(page);
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(1000);
    await page.click('header a[href="/"]');
    await wait(1500);
    expect(await page.evaluate(() => scrollY)).toBe(0);
    await page.close();
  });

  it('the search palette finds a project and opens it', async () => {
    const { page, errors } = await open();
    await page.goto(`${base}/`, { waitUntil: 'networkidle0' });
    await page.click('header button[title^="Search"]');
    await page.waitForSelector('[role="dialog"] input', { timeout: 10_000 });
    await page.keyboard.type('cardiac');
    await wait(300);
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => location.pathname.startsWith('/projects/cardiac'), { timeout: 10_000 });
    expect(errors).toEqual([]);
    await page.close();
  });
});

describe('home page', () => {
  it('loads every stack logo once the page is up', async () => {
    const { page } = await open();
    await page.goto(`${base}/`, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => !document.querySelector('#stack-rows img[data-src]'), { timeout: 15_000 });
    const broken = await page.$$eval('#stack-rows img', (imgs) =>
      imgs.filter((i) => !(i as HTMLImageElement).complete || !(i as HTMLImageElement).naturalWidth).length
    );
    expect(broken).toBe(0);
    await page.close();
  });

  it('draws the footer fight on approach, at its fixed size, and the twist removes Tyler', async () => {
    const { page, errors } = await open();
    await page.goto(`${base}/`, { waitUntil: 'networkidle0' });
    await scrollToBottom(page);
    await page.waitForSelector('svg.footer-fight .footer-fight-sheet', { timeout: 10_000 });
    const svg = (await page.$('svg.footer-fight'))!;
    const box = (await svg.boundingBox())!;
    expect([Math.round(box.width), Math.round(box.height)]).toEqual([320, 54]);

    const tyler = () => page.$$eval('svg.footer-fight use[href^="#ff-tyler"]', (u) => u.length);
    expect(await tyler()).toBeGreaterThan(0);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await wait(500);
    expect(await tyler()).toBe(0);
    await page.mouse.move(5, 5);
    await wait(500);
    expect(await tyler()).toBeGreaterThan(0);
    expect(errors).toEqual([]);
    await page.close();
  });
});
