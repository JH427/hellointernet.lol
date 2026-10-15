import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const path='../public-root/src/components/multiplex-model.mjs';
assert.ok(existsSync(new URL(path,import.meta.url)), 'multiplex pure model exists');
const {createModel,advance,spawn,close,command,makeCodec}=await import(path);
const m=createModel(8192);assert.equal(m.sessions.length,4);
for(let i=0;i<12;i++)advance(m);assert.ok(m.sessions.some(s=>s.lines.some(t=>/Received packet .* from /.test(t))),'handoffs deliver actual shared packets to another session');
const reset=createModel(8192);Object.assign(m,reset);
const other=createModel(8192);for(let n=0;n<2000;n++){advance(m);advance(other);assert.ok(m.sessions.length<=6&&m.sessions.length>=2);assert.ok(m.sessions.every(s=>s.lines.length<=18));}assert.deepEqual(m,other,'seeded bounded simulation');
const user=m.sessions[0];m.focus=user.id;for(let n=0;n<200;n++)advance(m);assert.ok(m.sessions.some(s=>s.id===user.id),'focused session survives');
spawn(m);assert.ok(m.sessions.length<=6);close(m,m.focus);assert.ok(m.sessions.some(s=>s.id===m.focus),'close restores valid focus');
assert.match(command(m,'help'),/spawn/);assert.match(command(m,'map'),/CHANNEL MAP/);assert.match(command(m,'log'),/FICTIONAL EVENT LOG/);assert.match(command(m,'ls'),/VESPER|SPOOL|ERRANT|KEEPER|MOTH|WITNESS|NULL/);assert.match(command(m,'hold'),/held/);assert.match(command(m,'resume'),/resumed/);assert.match(command(m,'<script>alert(1)</script>'),/Unknown/);assert.match(command(m,'rm -rf /'),/Unknown/);
assert.match(command(m,'translate'),/Unknown/,'translation mode removed');assert.ok(!command(m,'help').includes('translate'),'no translation help entry');
const d=JSON.parse(readFileSync(new URL('../public-root/public/local-glyph/vocabulary.json',import.meta.url)));const codec=makeCodec(d);assert.equal(d.tokens.length,8192);
for(const s of ['RELAY / carrier retained.','I’m not an oracle.\n  just a relay.','你好 / café / 👾',"we're WAITING\t\n"]){const ids=codec.encode(s);assert.ok(ids.every(n=>n>=0&&n<8192));assert.equal(codec.decode(ids),s);assert.deepEqual([...codec.glyph(s)].map(c=>c.codePointAt(0)-0xF0000),ids);}
// Exact non-song reference IDs from upstream tests/reference.json, not only self-roundtrips.
assert.deepEqual(codec.encode('Hello, other world.'),[39,6053,11,1273,2375,13]);
assert.deepEqual(codec.encode('Bonjour, 世界. مرحبا 🛸'),[33,263,73,401,11,220,624,244,163,243,234,13,752,433,949,657,320,220,4103,249,116]);
assert.deepEqual(codec.encode('Hello\t\r\n world  '),[39,6053,7709,2375,256]);
console.log('PASS deterministic lifecycle, bounded sessions/transcripts, focus protection, allowlist, reversible real 8192 vocabulary');
