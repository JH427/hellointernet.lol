import {ordered,shift,REST} from './model.mjs';
// Direct polygon-to-character scan conversion: no image, WebGL or pixel filter.
// Anatomy emits M/L/Z polygon paths. Filled faces erase occluded characters.
function paths(d){return (d?.match(/M[^M]+/g)||[]).map(s=>({closed:s.endsWith('Z'),p:[...s.matchAll(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)].map(m=>[+m[1],+m[2]])}));}
const glyphs=' .:;=+*#%@';
// Pulled-back camera: the complete remote formation occupies a small fraction
// of the field. The phone is separately composed, never miniaturized glyphs.
export function layout(cols,rows,zoom=1){const scale=(cols<80?.12:.08)*Math.min(cols/1000,rows/.6/900)*zoom;return {scale,ox:cols*(zoom>1?.5:cols<80?.46:.29)-500*scale,oy:rows*(zoom>1?.5:.30)-450*scale*.6};}
export function characters(cols=144,rows=84,opening=REST,background='',zoom=1){
 const backgroundRows=background.split('\n');
 const grid=Array.from({length:rows},(_,y)=>Array.from({length:cols},(_,x)=>backgroundRows[y]?.[x]??' '));
 const {scale,ox,oy}=layout(cols,rows,zoom);
 function transformed(d,move){return paths(d).map(({p,closed})=>({closed,p:p.map(([x,y])=>[(x+move[0])*scale+ox,(y+move[1])*scale*.6+oy])}));}
 function fill(d,char,move){for(const {p} of transformed(d,move)){
  if(p.length<3)continue;
  const ymin=Math.max(0,Math.ceil(Math.min(...p.map(p=>p[1])))),ymax=Math.min(rows-1,Math.floor(Math.max(...p.map(p=>p[1]))));
  for(let y=ymin;y<=ymax;y++){const cuts=[];for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y+.5)!==(b[1]>y+.5))cuts.push((b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])+a[0]);}cuts.sort((a,b)=>a-b);for(let i=0;i<cuts.length;i+=2)for(let x=Math.max(0,Math.ceil(cuts[i]));x<Math.min(cols,cuts[i+1]);x++)grid[y][x]=char;}
 }}
 function line(d,move,bright=false){for(const {p,closed} of transformed(d,move)){const pts=closed?[...p,p[0]]:p;for(let i=1;i<pts.length;i++){
  const [a,b]=[pts[i-1],pts[i]],dx=b[0]-a[0],dy=b[1]-a[1],steps=Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))*1.5);
  const char=bright<.3?(bright<.15?'.':':'):Math.abs(dx)<Math.abs(dy)*.5?'|':Math.abs(dy)<Math.abs(dx)*.28?'_':dx*dy>0?'\\':'/';
  for(let j=0;j<=steps;j++){const x=Math.round(a[0]+dx*j/steps),y=Math.round(a[1]+dy*j/steps);if(grid[y]?.[x]!==undefined)grid[y][x]=char;}
 }}}
 for(const {part,dx} of ordered(opening)){
  const move=shift(dx),p=part.paths;
  fill(p.fill,' ',move);
  p.shades.forEach((d,i)=>fill(d,glyphs[Math.round((2+i*.7)*part.tone)],move));
  fill(p.top,glyphs[Math.round(6*part.tone)],move);
  line(p.crease,move,part.tone);line(part.detail,move,part.tone);line(p.outline,move,part.tone);
 }
 return grid.map(r=>r.join('')).join('\n');
}
