const fs = require('fs');
const raw = fs.readFileSync('app/[locale]/tours/page.tsx');
// Show bytes around position 541
const slice = raw.slice(551, 570);
console.log([...slice].map(b => b.toString(16).padStart(2,'0')).join(' '));
