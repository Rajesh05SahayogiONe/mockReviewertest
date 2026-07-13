// Minimal, dependency-free test runner for the sandbox. Verifies the exports of
// each product surface. Intentionally fails right now to exercise a BROKEN CI
// run end-to-end (dashboard should show the run red + this log).
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

console.log('Running sandbox tests...');

// boss/web must export surface = "web".
const bossWeb = readFileSync(
  join(root, 'apps/boss/web/src/index.js'),
  'utf8',
);
console.log('Test: apps/boss/web/src/index.js exports surface "web"');

// BUG (on purpose): the source exports surface = "web", but this test now
// expects "mobile" — so it fails, producing a clear CI failure to inspect.
assert.ok(
  bossWeb.includes("surface = 'mobile'"),
  'apps/boss/web/src/index.js: expected surface = "mobile" but the file exports "web"',
);

console.log('All tests passed');
