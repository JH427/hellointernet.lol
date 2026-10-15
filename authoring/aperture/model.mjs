// The Interval: the camera sees only a fragment of two immense broken strata.
// Real Anatomy slabs, not an image-to-text effect. All units are fictional.
import * as k from './kit/iso-kit.mjs';
import ORDER from './order.json' with {type:'json'};
export const WORLD={x:-360,y:-150,w:720,d:300,r:0};
export const P={origin:[500,450],scale:1.25,azimuth:64,elevation:28};
export const PARTS=[];
function stratum(name,x,y,z,w,d,h,tone,slide=0){
 const plan={x,y,w,d,r:0},paths=k.slabOf(plan,z,h,P,1,.4);
 // The seams are strata, wrapping real silhouettes rather than floating marks.
 const detail=h>10?k.sideSeam(plan,z+h*.42,P,1):'';
 PARTS.push({name,plan,z,h,tone,slide,paths,detail,at:[x+w/2,y+d/2,z+h/2]});
}
// Two torn continuations, not a frame. The irregular ends form the negative space.
// Each terrace occupies a separate elevation interval; opening is a slight drift,
// not a shutter. Long ends continue beyond the viewport on purpose.
for(let i=0;i<24;i++){
 const tooth=[0,21,-12,34,8,-23,15,46][i%8];
 const end=-56-tooth-Math.pow((i-11)/11,2)*74;
 stratum(`near.upper.${i}`,-850-i*9,10+(i%4)*8,36+i*14,end+850+i*9,38+(i%3)*13,7+(i%4)*1.5,.75+(i%5)*.05,-1);
 const start=82+tooth+Math.pow((i-9)/12,2)*60;
 stratum(`near.lower.${i}`,start,-36+(i%5)*9,-90-i*15,900-start+i*12,48+(i%3)*18,8+(i%4)*1.5,.55+(i%5)*.06,1);
}
// In the gap, a remote, discontinuous second scale. No stars or random noise:
// eight paired cuts in a much more distant plane, with their own true thickness.
for(let i=0;i<8;i++){
 const x=-265+i*21,y=-315-i*9,z=-170+i*25;
 stratum(`far.cut.${i}`,x,y,z,27+(i%3)*17,13,3,.18);
 stratum(`far.echo.${i}`,x+62,y-40,z-5,12+(i%3)*8,8,2,.12);
}
export const TRAVEL=32;
export const REST=.6;
export function offset(part,opening){return part.slide*TRAVEL*(opening-REST);}
const key=({part,dx})=>(ORDER[part.name]??k.depthOf(part.at,P))+k.depthOf([dx,0,0],P);
export function ordered(opening){return PARTS.map(part=>({part,dx:offset(part,opening)})).sort((a,b)=>key(a)-key(b));}
export function shift(dx){const a=k.iso([dx,0,0],P),b=k.iso([0,0,0],P);return [a[0]-b[0],a[1]-b[1]];}
export const slit=k.iso([0,0,0],P);
export function follow(current,target,dt){return Math.abs(current-target)<.001?target:current+(target-current)*(1-Math.exp(-dt/.22));}
