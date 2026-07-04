// Trivial, dependency-free "CI" for the sandbox. Its only job is to prove that
// a SELF-HOSTED runner (your machine) executed it — not a GitHub-hosted runner.
// It mirrors sahayogi_one's apps/<product>/<surface> layout so the platform's
// product switcher has real products to detect.
import { readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const appsDir = join(root, 'apps');

const products = readdirSync(appsDir).filter((name) =>
  statSync(join(appsDir, name)).isDirectory(),
);

console.log(`Sandbox CI on host: ${process.env.RUNNER_NAME ?? 'local'}`);
console.log(`Node: ${process.version}`);
console.log(`Products found: ${products.join(', ') || '(none)'}`);

for (const product of products) {
  const surfaces = readdirSync(join(appsDir, product)).filter((s) =>
    existsSync(join(appsDir, product, s, 'package.json')),
  );
  console.log(`  - ${product}: surfaces = ${surfaces.join(', ')}`);
}

console.log('CI OK');
