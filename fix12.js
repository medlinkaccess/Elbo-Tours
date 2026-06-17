const fs = require('fs');
let raw = fs.readFileSync('app/[locale]/tours/page.tsx');
const bad = Buffer.from([0xc3,0xb0,0xc5,0xb8,0xe2,0x80,0x9d,0xc2,0x8d]);
const good = Buffer.from([0xF0,0x9F,0x97,0xBA,0xEF,0xB8,0x8F]);
let pos;
while ((pos = raw.indexOf(bad)) !== -1) {
  raw = Buffer.concat([raw.slice(0, pos), good, raw.slice(pos + bad.length)]);
}
fs.writeFileSync('app/[locale]/tours/page.tsx', raw);
console.log('done');
