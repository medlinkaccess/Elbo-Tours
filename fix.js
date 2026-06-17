const fs = require('fs');
let c = fs.readFileSync('app/[locale]/tours/page.tsx', 'utf8');
c = c.replace(/\\uD83C\\uDFDC\\uFE0F/g, '\u{1F3DC}\uFE0F');
c = c.replace(/\xf0\x9f\x99\x8f\xef\xb8\x8f/g, '\u{1F3D9}\uFE0F');
fs.writeFileSync('app/[locale]/tours/page.tsx', c, 'utf8');
console.log('done');
