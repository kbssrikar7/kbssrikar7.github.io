// Snapshots GitHub data the site shows: the contribution calendar and repo
// star counts. Runs before every build (see package.json), and the output is
// committed, so a build with no network - or a GitHub outage - ships the last
// good snapshot instead of failing or showing nothing.
//
// The contribution graph still fetches live in the browser; this is what it
// renders before (and if) that request lands. Stars come only from here: one
// unauthenticated API call per visitor per card would hit GitHub's rate limit.

import { readFile, writeFile } from 'node:fs/promises';

const USER = 'kbssrikar7';
const OUT = new URL('../src/data/github.json', import.meta.url);
const TIMEOUT = AbortSignal.timeout(15000);

async function json(url) {
  const res = await fetch(url, { signal: TIMEOUT, headers: { 'user-agent': `${USER}-portfolio-build` } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

async function contributions() {
  const data = await json(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`);
  const days = data.contributions;
  if (!Array.isArray(days) || days.length === 0) throw new Error('no contribution days');
  // Parallel arrays from a start date: ~2KB instead of ~15KB of {date,count,level}.
  return {
    total: data.total.lastYear,
    start: days[0].date,
    counts: days.map((d) => d.count),
    levels: days.map((d) => d.level),
  };
}

async function stars() {
  const repos = await json(`https://api.github.com/users/${USER}/repos?per_page=100`);
  return Object.fromEntries(
    repos
      .filter((r) => r.stargazers_count > 0)
      .map((r) => [r.name, r.stargazers_count])
      .sort(([a], [b]) => a.localeCompare(b))
  );
}

let previous = { contributions: null, stars: {} };
try {
  previous = JSON.parse(await readFile(OUT, 'utf8'));
} catch {
  // First run.
}

const [c, s] = await Promise.allSettled([contributions(), stars()]);
for (const [name, r] of [['contributions', c], ['stars', s]]) {
  if (r.status === 'rejected') console.warn(`snapshot-github: kept previous ${name} (${r.reason.message})`);
}

const next = {
  contributions: c.status === 'fulfilled' ? c.value : previous.contributions,
  stars: s.status === 'fulfilled' ? s.value : previous.stars,
};
await writeFile(OUT, JSON.stringify(next) + '\n');
console.log(
  `snapshot-github: ${next.contributions?.total ?? 'no'} contributions, ${Object.keys(next.stars).length} starred repos`
);
