const fs = require('fs');

function flatten(obj, prefix = '') {
  let keys = [];
  for (const k in obj) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      keys = keys.concat(flatten(obj[k], path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

const [enPath, frPath] = process.argv.slice(2);
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));

const enKeys = new Set(flatten(en));
const frKeys = new Set(flatten(fr));

const missingInFr = [...enKeys].filter(k => !frKeys.has(k));
const missingInEn = [...frKeys].filter(k => !enKeys.has(k));

function getValue(obj, path) {
  return path.split('.').reduce((o, k) => (o || {})[k], obj);
}
const identical = [...enKeys].filter(k => {
  if (!frKeys.has(k)) return false;
  const a = getValue(en, k);
  const b = getValue(fr, k);
  return typeof a === 'string' && typeof b === 'string' && a === b && a.length > 3;
});

console.log(`\n=== Missing in FR (${missingInFr.length}) ===`);
missingInFr.forEach(k => console.log(' ', k));

console.log(`\n=== Missing in EN (${missingInEn.length}) ===`);
missingInEn.forEach(k => console.log(' ', k));

console.log(`\n=== Identical EN/FR values — likely untranslated (${identical.length}) ===`);
identical.forEach(k => console.log(' ', k, '=>', getValue(en, k)));
