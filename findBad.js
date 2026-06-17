const fs = require('fs');
const raw = fs.readFileSync('app/[locale]/tours/page.tsx');
const str = raw.toString('latin1');
// Find all mojibake patterns (c3 b0 = start of broken 4-byte emoji)
let idx = 0;
while ((idx = str.indexOf('\xc3\xb0', idx)) !== -1) {
  const slice = raw.slice(idx, idx+8);
  const context = str.substring(Math.max(0,idx-20), idx+20);
  console.log(idx, [...slice].map(b=>b.toString(16).padStart(2,'0')).join(' '), '|', JSON.stringify(context));
  idx++;
}
