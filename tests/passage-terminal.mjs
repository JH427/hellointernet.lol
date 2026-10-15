import assert from 'node:assert/strict';
import {command,ROUTES} from '../authoring/aperture/terminal.mjs';
import {space,scene} from '../authoring/aperture/space.mjs';
import {characters} from '../authoring/aperture/characters.mjs';
import {REST} from '../authoring/aperture/model.mjs';
for(const [name,href] of Object.entries(ROUTES))for(const text of [name,name.toUpperCase(),`  open /${name}/  `,`cd ${name}`,`go /${name}/`])assert.equal(command(text).href,href);
for(const text of ['; rm -rf /','$(whoami)','https://evil.invalid/','open javascript:alert(1)','<img src=x onerror=alert(1)>','constructor','__proto__'])assert.equal(command(text).kind,'text','input has no executable or arbitrary navigation interpretation');
for(const text of ['help','?','inspect','log'])assert.equal(command(text).kind,'text');
for(const text of ['ls','dir','directory'])assert.equal(command(text).kind,'directory');
assert.equal(command('map').kind,'map');assert.match(command('map').text,/ANATOMY SOURCE/);assert.match(command('inspect').text,/64 source solids/);assert.match(command('log').text,/FICTION/);assert.equal(command('hold').kind,'hold');assert.equal(command('resume').kind,'resume');assert.equal(command('clear').kind,'clear');
for(const [cols,rows] of [[44,70],[54,70],[199,83],[220,84]]){
 const a=scene(cols,rows,0,REST),b=scene(cols,rows,4,REST);
 assert.match(a,/^[\x20-\x7e\n]+$/);assert.notEqual(a,b,'genuinely moving ASCII scene');assert.equal(a,scene(cols,rows,0,REST),'deterministic SSR');
 assert.equal(a.split('\n').length,rows);assert.ok(a.split('\n').every(l=>l.length===cols));
 const pure=characters(cols,rows,REST),background=space(cols,rows,0),full=scene(cols,rows,0,REST);
 const solids=[...pure].filter(c=>c!==' '&&c!=='\n').length;assert.ok(solids>=40&&solids<cols*rows*.05,'sparse but genuine Anatomy formation');
 // Existing source glyphs survive, while filled face interiors erase background stars.
 for(let i=0;i<pure.length;i++)if(pure[i]!==' '&&pure[i]!=='\n')assert.equal(full[i],pure[i]);
 assert.notEqual(full,background,'Anatomy is actually integrated, not hidden provenance');
}
console.log('PASS safe terminal allowlist, forgiving route parser, fictional records, deterministic moving ASCII space and real Anatomy integration');
