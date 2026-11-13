import { execFileSync } from 'node:child_process';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  symlinkSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
const root = process.cwd();
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const packed = JSON.parse(
  execFileSync(npm, ['pack', './dist/ui-controls', '--json'], { encoding: 'utf8' }),
)[0];
const consumer = mkdtempSync(join(tmpdir(), 'ui-controls-consumer-'));
try {
  writeFileSync(
    join(consumer, 'package.json'),
    JSON.stringify({ name: 'ui-controls-consumer', private: true }),
  );
  execFileSync(
    npm,
    [
      'install',
      resolve(packed.filename),
      join(root, 'node_modules/tslib'),
      '--offline',
      '--ignore-scripts',
      '--legacy-peer-deps',
      '--no-audit',
      '--no-fund',
    ],
    { cwd: consumer, stdio: 'inherit' },
  );
  // Reuse the workspace's already-installed Angular peer dependencies, not its library build.
  for (const name of readdirSync(join(root, 'node_modules'))) {
    if (name.startsWith('.')) continue;
    if (name === '@abhilash-as' || name === 'tslib') continue;
    symlinkSync(join(root, 'node_modules', name), join(consumer, 'node_modules', name), 'junction');
  }
  cpSync(join(root, 'projects/demo'), join(consumer, 'projects/demo'), { recursive: true });
  const ts = JSON.parse(readFileSync(join(root, 'tsconfig.json'), 'utf8'));
  delete ts.compilerOptions.paths;
  writeFileSync(join(consumer, 'tsconfig.json'), JSON.stringify(ts));
  const angular = JSON.parse(readFileSync(join(root, 'angular.json'), 'utf8'));
  delete angular.projects['ui-controls'];
  writeFileSync(join(consumer, 'angular.json'), JSON.stringify(angular));
  execFileSync(
    process.execPath,
    [join(root, 'node_modules/@angular/cli/bin/ng.js'), 'build', 'demo'],
    { cwd: consumer, stdio: 'inherit' },
  );
  console.log('Consumer verified: npm-installed tarball, no TypeScript source paths.');
} finally {
  rmSync(consumer, { recursive: true, force: true });
}
