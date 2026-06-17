const fs = require('fs');
let c = fs.readFileSync('app/[locale]/tours/page.tsx', 'utf8');
const bad = "City Tours': '\xf0\x9f\x99\x8f\xef\xb8\x8f'";
const good = "City Tours': '\uD83C\uDFD9\uFE0F'";
c = c.split(bad).join(good);
fs.writeFileSync('app/[locale]/tours/page.tsx', c, 'utf8');
console.log('replacements:', (c.match(/City Tours.*emoji/g) || []).length);
