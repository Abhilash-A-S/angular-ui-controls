const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = 'projects/ui-controls/src/lib';
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
function bindings(file, text) {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const found = [];
  for (const declaration of source.statements.filter(ts.isClassDeclaration))
    for (const member of declaration.members) {
      for (const decorator of ts.getDecorators(member) || []) {
        if (!ts.isCallExpression(decorator.expression)) continue;
        const kind = decorator.expression.expression.getText(source);
        if (kind === 'Input' || kind === 'Output')
          found.push(`${declaration.name.text}.${kind}.${member.name.getText(source)}`);
      }
    }
  return found;
}
const baselineFile = 'tests/public-bindings.json';
if (process.argv.includes('--baseline')) {
  const baseline = {};
  for (const file of walk(root).filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts'))) {
    try {
      const old = execFileSync('git', ['show', `HEAD:${file}`], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      const items = bindings(file, old);
      if (items.length) baseline[file] = items;
    } catch {}
  }
  fs.writeFileSync(baselineFile, JSON.stringify(baseline, null, 2) + '\n');
} else {
  const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));
  let count = 0;
  for (const [file, items] of Object.entries(baseline)) {
    const current = new Set(bindings(file, fs.readFileSync(file, 'utf8')));
    for (const item of items) {
      if (!current.has(item)) throw new Error(`Public binding removed: ${item}`);
      count++;
    }
  }
  console.log(`Compatibility verified: ${count} original input/output declarations retained.`);
}
