/**
 * Next emits metadata images as extensionless files (out/opengraph-image) and
 * references them as `/opengraph-image?<hash>`. GitHub Pages serves by file
 * extension, so those land as application/octet-stream and every social
 * crawler rejects them. This gives each one a .png extension and repoints the
 * emitted HTML at it.
 */
import { readdir, readFile, writeFile, rename, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const OUT = 'out';
const NAMES = ['opengraph-image', 'twitter-image', 'icon', 'apple-icon'];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => {
      const p = join(dir, e.name);
      return e.isDirectory() ? walk(p) : Promise.resolve([p]);
    })
  );
  return files.flat();
}

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47]);

// Only static exports produce out/. On Vercel the app builds as a normal Next
// app and serves metadata routes itself, so there is nothing to rewrite.
if (!existsSync(OUT)) {
  console.log('fix-og: no out/ directory (not a static export) - skipping');
  process.exit(0);
}

const files = await walk(OUT);
let renamed = 0;

for (const file of files) {
  if (extname(file) !== '' || !NAMES.includes(basename(file))) continue;
  const head = (await readFile(file)).subarray(0, 4);
  if (!head.equals(PNG_MAGIC)) continue;
  await rename(file, `${file}.png`);
  renamed++;
}

let patched = 0;
for (const file of files.filter((f) => f.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  // `/opengraph-image?deadbeef` and bare `/icon` -> `.../opengraph-image.png`.
  // The leading slash and trailing boundary keep this inside URL paths: without
  // them the same names appear in attribute values like rel="icon", which this
  // would happily rewrite to rel="icon.png".
  const next = html.replace(
    new RegExp(`/(${NAMES.join('|')})(\\?[0-9a-f]+)?(?![\\w.-])`, 'g'),
    '/$1.png'
  );
  if (next !== html) {
    await writeFile(file, next);
    patched++;
  }
}

const sizes = await Promise.all(
  files
    .filter((f) => NAMES.includes(basename(f)))
    .map(async (f) => (await stat(`${f}.png`).catch(() => ({ size: 0 }))).size)
);

console.log(
  `fix-og: renamed ${renamed} image(s), patched ${patched} html file(s)` +
    (sizes.length ? ` [${sizes.map((s) => `${Math.round(s / 1024)}KB`).join(', ')}]` : '')
);
