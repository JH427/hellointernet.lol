import * as k from './kit/iso-kit.mjs';
import * as A from './kit/audit.mjs';
import {PARTS,P,REST,TRAVEL,offset,shift} from './model.mjs';
import {writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
assert.equal(PARTS.length,64);
const R=A.recorder(P);
// These fictional suspended fragments have no stand or structural supports.
// `ground` opts every fragment out of the kit's support-chain requirement;
// the zero support line is NOT a claim of physically buildable architecture.
// True slab coverage, depth and exact pairwise collision checks remain enabled.
for(const part of PARTS){
 const dx=offset(part,REST),plan={...part.plan,x:part.plan.x+dx};
 const svg=`<g transform="${k.translateAlong(P,[dx,0,0])}">${k.solidSvg(part.paths,{tone:'mid',inner:k.lineSvg(part.detail,{tone:'lo'})})}</g>`;
 R.put({name:part.name,piece:part.slide<0?'left':part.slide>0?'right':'structure',at:[part.at[0]+dx,...part.at.slice(1)],move:[part.slide*TRAVEL*(1-REST),0,0],svg,shapes:[R.solid(A.slab(plan,part.z,part.h,{name:part.name,ground:true}))]});
}
console.log('Settling 64 true source solids across rest / intermediate / drifted poses.');
A.settle(R,P,{states:[0,.25,.5,.75,1]});
mkdirSync(new URL('./output/',import.meta.url),{recursive:true});
writeFileSync(new URL('./order.json',import.meta.url),JSON.stringify(Object.fromEntries(R.items.map(i=>[i.name,i.key])),null,2)+'\n');
const svg=k.figureSvg({width:1000,height:900,label:'Anatomy source solids: character aperture',body:R.items.slice().sort((a,b)=>a.key-b.key).map(i=>i.svg)});
writeFileSync(new URL('./output/source.html',import.meta.url),k.pageHtml({title:'Character aperture: source geometry audit',body:svg,theme:'dark'}));
const openSvg=k.figureSvg({width:1000,height:900,label:'Anatomy source solids: open aperture',body:R.items.slice().sort((a,b)=>(a.key+k.depthOf(a.move,P))-(b.key+k.depthOf(b.move,P))).map(i=>`<g transform="${k.translateAlong(P,i.move)}">${i.svg}</g>`)});
writeFileSync(new URL('./output/source-open.html',import.meta.url),k.pageHtml({title:'Open aperture: source audit',body:openSvg,theme:'dark'}));
A.auditOrExit(R,P);
// Exact AABB checks throughout the actual straight slide; all source solids are axis-aligned.
let checks=0;
for(let step=0;step<=200;step++){
 const q=REST+(1-REST)*step/200;
 const b=PARTS.map(p=>({name:p.name,min:[p.plan.x+offset(p,q),p.plan.y,p.z],max:[p.plan.x+offset(p,q)+p.plan.w,p.plan.y+p.plan.d,p.z+p.h]}));
 for(let i=0;i<b.length;i++)for(let j=i+1;j<b.length;j++){
  const a=b[i],c=b[j];
  const overlap=a.min.map((_,axis)=>Math.min(a.max[axis],c.max[axis])-Math.max(a.min[axis],c.min[axis]));
  assert.ok(!overlap.every(v=>v>.001),`interpenetration at ${q}: ${a.name} / ${c.name}`);checks++;
 }
}
console.log(`PASS ${checks} exact solid-pair clearance checks in 201 slide poses; 64 source parts.`);
