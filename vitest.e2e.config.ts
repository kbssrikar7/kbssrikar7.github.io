import { defineConfig } from 'vitest/config';

// Browser tests against the built site in out/ (run `npm run build` first).
// Kept apart from the unit tests, which run before the build in CI.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['e2e/**/*.e2e.ts'],
    testTimeout: 60_000,
    hookTimeout: 60_000,
    // One browser, one server: the files share nothing and run in sequence.
    fileParallelism: false,
  },
});
