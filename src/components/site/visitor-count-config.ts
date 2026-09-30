// countapi.mileshilliard.com: free, no signup, no API key - because there is
// nothing secret to protect, unlike the Umami API (which needs Pro to expose
// a single number). Every /hit call both increments and returns the new
// total, so this counts page loads, not unique visitors - same convention
// every GitHub-README visitor badge uses. Key must be globally unique across
// everyone using this free service, so it is namespaced to the domain.
const COUNTER_KEY = 'kbssrikar7-github-io-portfolio';
export const COUNTER_ORIGIN = 'https://countapi.mileshilliard.com';
export const COUNTER_URL = `${COUNTER_ORIGIN}/api/v1/hit/${COUNTER_KEY}`;
/** Read-only: returns the total without incrementing it. */
export const COUNTER_GET_URL = `${COUNTER_ORIGIN}/api/v1/get/${COUNTER_KEY}`;

/**
 * Local dev / preview builds read the count but never add to it - otherwise
 * every `next dev` reload and every test run was counted as a public visit.
 * The inline bootstrap below embeds the same regex via its source text.
 */
const LOCAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\])$|\.localhost$/;

export function counterUrl(): string {
  return LOCAL_HOST.test(location.hostname) ? COUNTER_GET_URL : COUNTER_URL;
}

/** Global the inline <head> script parks its in-flight request on. */
export const COUNTER_PROMISE = '__kbsVisitorCount';

/**
 * Runs before any bundle JS has downloaded, so the counter request overlaps
 * with it instead of waiting for hydration. Must stay dependency-free ES5-ish:
 * it is inlined verbatim into the HTML.
 */
export const COUNTER_BOOTSTRAP = `try{window.${COUNTER_PROMISE}=fetch(${LOCAL_HOST}.test(location.hostname)?${JSON.stringify(
  COUNTER_GET_URL
)}:${JSON.stringify(COUNTER_URL)}).then(function(r){return r.json()}).catch(function(){return null})}catch(e){}`;
