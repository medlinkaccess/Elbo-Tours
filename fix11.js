const fs = require('fs');
const raw = fs.readFileSync('app/[locale]/tours/page.tsx');
const slice = raw.slice(5216, 5232);
console.log([...slice].map(b=>b.toString(16).padStart(2,'0')).join(' '));
