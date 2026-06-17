const fs = require('fs');
const raw = fs.readFileSync('app/[locale]/tours/page.tsx');
const str = raw.toString('latin1');
const idx = str.indexOf("'City Tours': '", 500);
const slice = raw.slice(idx + 15, idx + 30);
console.log([...slice].map(b => b.toString(16).padStart(2,'0')).join(' '));
