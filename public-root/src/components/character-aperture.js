import {scene} from '../../../authoring/aperture/space.mjs';
import {command} from '../../../authoring/aperture/terminal.mjs';
import {follow,REST} from '../../../authoring/aperture/model.mjs';
const stage=document.querySelector('.aperture');
if(stage){
 const details=stage.querySelector('details'),threshold=stage.querySelector('summary'),close=stage.querySelector('.close-index'),maker=stage.querySelector('.maker-seam'),pause=stage.querySelector('.stillness'),art=stage.querySelector('.desktop-art');
 const form=stage.querySelector('.command-form'),input=form.querySelector('input'),output=stage.querySelector('.terminal-output'),shortcuts=stage.querySelector('.command-shortcuts'),status=stage.querySelector('.command-status');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let opener=threshold,opening=REST,target=REST,paused=false,visible=true,request=0,last=0,clock=0,draws=0,writes=0,totalMs=0,maxMs=0,cols=144,rows=84;
 stage.classList.add('enhanced');close.hidden=maker.hidden=pause.hidden=form.hidden=shortcuts.hidden=false;
 const draw=()=>{const start=performance.now(),next=scene(cols,rows,clock,opening);if(art.textContent!==next){art.textContent=next;writes++;}stage.dataset.writes=String(writes);stage.dataset.opening=opening.toFixed(4);stage.dataset.clock=clock.toFixed(3);stage.dataset.frame=String(++draws);const cost=performance.now()-start;totalMs+=cost;maxMs=Math.max(maxMs,cost);stage.dataset.drawMs=cost.toFixed(2);stage.dataset.drawTotalMs=totalMs.toFixed(2);stage.dataset.drawMaxMs=maxMs.toFixed(2);};
 const state=()=>document.hidden?'hidden':!visible?'offscreen':reduced.matches?'reduced':paused?'paused':opening===target?'drifting':'living';
 const tick=()=>{request=0;const now=performance.now(),dt=last?Math.min((now-last)/1000,.35):.25;last=now;clock+=dt;opening=follow(opening,target,dt);draw();stage.dataset.motion=state();if(['living','drifting'].includes(state()))request=setTimeout(tick,250);};
 function reconcile(){clearTimeout(request);request=0;last=0;if(reduced.matches||paused){opening=target;if(!document.hidden&&visible)draw();}stage.dataset.motion=state();pause.hidden=reduced.matches;if(['living','drifting'].includes(state()))request=setTimeout(tick,250);}
 function hold(value){paused=value;pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Resume movement':'Pause movement');pause.firstChild.textContent=paused?'[ RESUME SPACE ]':'[ HOLD SPACE ]';reconcile();}
 const shut=()=>{details.open=false;opener.focus({preventScroll:true});};
 threshold.addEventListener('click',()=>{opener=threshold;});maker.addEventListener('click',()=>{opener=maker;details.open=true;});close.addEventListener('click',shut);
 details.addEventListener('toggle',()=>{stage.dataset.open=String(details.open);target=details.open?1:REST;reconcile();if(details.open)details.querySelector('nav a').focus({preventScroll:true});});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&details.open){e.preventDefault();shut();}});
 pause.addEventListener('click',()=>hold(!paused));
 threshold.addEventListener('pointerenter',e=>{if(e.pointerType==='touch'||details.open)return;stage.dataset.approach='true';target=REST+.06;reconcile();});
 const leave=()=>{stage.dataset.approach='false';if(!details.open){target=REST;reconcile();}};
 threshold.addEventListener('pointerleave',leave);stage.addEventListener('pointercancel',leave);
 reduced.addEventListener('change',reconcile);document.addEventListener('visibilitychange',reconcile);
 new IntersectionObserver(entries=>{visible=entries[entries.length-1].isIntersecting;reconcile();}).observe(stage);
 function size(){const style=getComputedStyle(art),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');ctx.font=`${style.fontSize} ${style.fontFamily}`;const cell=ctx.measureText('M').width;cols=Math.max(40,Math.min(220,Math.floor(stage.clientWidth/cell)));rows=Math.max(24,Math.min(110,Math.floor(stage.clientHeight/parseFloat(style.lineHeight))));draw();}
 new ResizeObserver(size).observe(stage);window.addEventListener('pagehide',()=>{clearTimeout(request);request=0;});window.addEventListener('pageshow',reconcile);
 const history=[];let position=0,draft='';
 function execute(raw){
  const response=command(raw);history.push(raw);if(history.length>32)history.shift();position=history.length;draft='';
  if(response.kind==='clear')output.replaceChildren();else{if(output.querySelector('.output-intro'))output.replaceChildren();const entry=document.createElement('pre');entry.className='output-entry';entry.dataset.kind=response.kind;entry.textContent=`records> ${raw}\n${response.text}`;output.append(entry);while(output.children.length>6)output.firstElementChild.remove();output.scrollTop=entry.offsetTop;}
  status.textContent=response.text.split('\n')[0];stage.dataset.command=response.kind;
  if(response.kind==='directory'){opener=input;details.open=true;}
  if(response.kind==='hold')hold(true);if(response.kind==='resume')hold(false);
  if(response.kind==='navigate')location.assign(response.href);
 }
 form.addEventListener('submit',event=>{event.preventDefault();const raw=input.value;input.value='';execute(raw);});
 shortcuts.addEventListener('click',event=>{const button=event.target.closest('button[data-command]');if(button)execute(button.dataset.command);});
 input.addEventListener('keydown',event=>{if(!['ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();if(position===history.length)draft=input.value;position=Math.max(0,Math.min(history.length,position+(event.key==='ArrowUp'?-1:1)));input.value=position===history.length?draft:history[position];input.setSelectionRange(input.value.length,input.value.length);});
 size();reconcile();
}
