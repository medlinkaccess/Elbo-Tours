const fs = require('fs');
let raw = fs.readFileSync('app/[locale]/tours/page.tsx');
const bad = Buffer.from([0xf0,0x9f,0x8f,0x99,0xef,0xb8,0x8f,0xaf,0xc2,0xb8,0xc2,0x8f]);
const good = Buffer.from([0xf0,0x9f,0x8f,0x99,0xef,0xb8,0x8f]);
let pos;
while ((pos = raw.indexOf(bad)) !== -1) {
  raw = Buffer.concat([raw.slice(0, pos), good, raw.slice(pos + bad.length)]);
}
fs.writeFileSync('app/[locale]/tours/page.tsx', raw);
console.log('done');
