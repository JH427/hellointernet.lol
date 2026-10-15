import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {PARTS,REST,P,offset,ordered,follow} from '../authoring/aperture/model.mjs';
import {characters,layout} from '../authoring/aperture/characters.mjs';
assert.equal(PARTS.length,64);
assert.equal(new Set(PARTS.map(p=>p.name)).size,64);
assert.equal(PARTS.filter(p=>p.slide).length,48,'two fractured strata drift; remote fragments remain still');
for(const part of PARTS){assert.ok(part.plan.w>0&&part.plan.d>0&&part.h>0);assert.ok(part.paths.fill&&part.paths.outline);}
for(const [cols,rows] of [[44,70],[54,70],[106,83],[144,84],[199,83]]){
 const closed=characters(cols,rows,REST),open=characters(cols,rows,1);
 for(const art of [closed,open]){
  assert.match(art,/^[\x20-\x7e\n]+$/);const lines=art.split('\n');assert.equal(lines.length,rows);assert.ok(lines.every(l=>l.length===cols));
  const ink=art.replace(/\s/g,'').length;assert.ok(ink>=40&&ink<cols*rows*.05,'remote geometry remains intelligible while over 95% of the exterior is void');
 }
 assert.notEqual(closed,open,'one model actually opens the glyph structure');
 assert.equal(closed,characters(cols,rows,REST),'deterministic no-JS/live geometry');
 assert.ok(layout(cols,rows).scale>0);
}
assert.equal(PARTS.filter(p=>p.name.startsWith('far.')).length,16,'a second scale in the gap');
assert.ok(PARTS.every(p=>!/(frame|rail|leaf|shoe)/.test(p.name)),'no inherited shutter machinery');
const edges=characters(199,83,REST).split('\n');
assert.ok(edges.every(l=>l[0]===' '&&l.at(-1)===' '),'pulled-back view contains the complete remote formation, not close cropped slabs');
for(const q of [REST,.66,.8,1])assert.equal(ordered(q).length,64);
let q=REST;for(let i=0;i<300;i++){const next=follow(q,1,1/60);assert.ok(next>=q&&next<=1);q=next;}assert.equal(q,1,'motion settles exactly and can stop');
const provenance={'iso-kit': '6d3ecc725d30c3b0346da309cf61dfa5a65017c23620bbd4093009d4fb104018', 'audit': '2e92d6e4c18b05c4cb55d72d378bba3cb854a169b19e16d5ca8eb5ebc2fe234b', 'lathe': 'a4e7e974b1a37e603ad2b76363b6f9815cc101dfff0ad277a5d4e8f1dc56fccb', 'tube': 'bcb3cc360f6d83e6a5753f4c464b4587ab7965028b05a5d58e285abce58667c9'};
for(const [name,sha] of Object.entries(provenance))assert.equal(createHash('sha256').update(readFileSync(new URL(`../authoring/aperture/kit/${name}.mjs`,import.meta.url))).digest('hex'),sha,'unmodified installed Anatomy source');
console.log('PASS 64-part Anatomy model, exact kit provenance, five character layouts, real opening, deterministic SSR and monotone settled motion');
