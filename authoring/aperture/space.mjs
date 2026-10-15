import {characters} from './characters.mjs';
import {REST} from './model.mjs';
// Fixed, sparse points at three remote depths; no near debris or twinkle.
// Scene time is fictional camera drift, not a real orbit or telemetry.
const fract=n=>n-Math.floor(n);
const stars=Array.from({length:27},(_,i)=>({x:fract(i*.61803398875+.13),y:fract(i*.41421356237+.31),depth:[.08,.18,.32][i%3]}));
export function space(cols,rows,time=0){
 const grid=Array.from({length:rows},()=>Array(cols).fill(' '));
 for(const s of stars){const x=Math.floor(fract(s.x+time*.0012*s.depth)*cols),y=Math.floor(fract(s.y+time*.00025*s.depth)*rows);grid[y][x]=s.depth>.3?':':'.';}
 return grid.map(row=>row.join('')).join('\n');
}
export function scene(cols=144,rows=84,time=0,opening=REST){return characters(cols,rows,opening,space(cols,rows,time));}
