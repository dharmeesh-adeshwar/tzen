const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'app');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      fixFile(full);
    }
  }
}

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const regex = /from\s+(["'])~\/(.+?)\1/g;
  let m;
  let changed = false;
  const dir = path.dirname(file);
  const replacements = [];
  while ((m = regex.exec(content)) !== null) {
    const quote = m[1];
    const target = m[2];
    const absTarget = path.join(root, target);
    let rel = path.relative(dir, absTarget).replace(/\\/g, '/');
    if (!rel.startsWith('.')) rel = './' + rel;
    replacements.push({from: m[0], to: `from ${quote}${rel}${quote}`});
  }
  if (replacements.length) {
    for (const r of replacements) {
      content = content.split(r.from).join(r.to);
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', path.relative(process.cwd(), file));
  }
}

walk(root);
console.log('Done');
