// Node 22+ and Chromium. Local build only, no browser dependencies.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,readdir,mkdtemp,mkdir,rm,writeFile} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
const root=resolve(process.argv[2]||'public-root/dist');
const scratch=process.env.TMPDIR;
assert.ok(scratch,'Set TMPDIR to a scratch directory');
const profile=await mkdtemp(join(scratch,'jh-browser-'));
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));if(p!==root&&!p.startsWith(root+sep))throw Error('outside tree');if(!extname(p))p=join(p,'index.html');const body=await readFile(p);res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.js':'text/javascript','.ico':'image/x-icon'})[extname(p)]||'application/octet-stream'});res.end(body);}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=`http://127.0.0.1:${server.address().port}`;
const browser=spawn('chromium',['--headless','--disable-gpu','--disable-extensions','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
let socket;
try{
 let port;for(let i=0;i<100;i++){try{port=(await readFile(join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];break;}catch{await new Promise(r=>setTimeout(r,100));}}
 assert.ok(port,'Chromium started');
 const tabs=await(await fetch(`http://127.0.0.1:${port}/json`)).json();socket=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await once(socket,'open');
 let id=0;const waiting=new Map(),errors=[];
 socket.addEventListener('message',e=>{const d=JSON.parse(e.data);if(d.id){waiting.get(d.id)?.(d);waiting.delete(d.id);}if(d.method==='Network.responseReceived'&&d.params.response.status>=400)errors.push(d.params.response.url+' '+d.params.response.status);if(d.method==='Network.loadingFailed'&&!d.params.canceled)errors.push(d.params.errorText);if(d.method==='Runtime.consoleAPICalled'&&d.params.type==='error')errors.push(JSON.stringify(d.params.args));if(d.method==='Runtime.exceptionThrown')errors.push(d.params.exceptionDetails.text);if(d.method==='Log.entryAdded'&&d.params.entry.level==='error')errors.push(d.params.entry.text);});
 async function cdp(method,params={}){const current=++id;return new Promise((done,fail)=>{const timer=setTimeout(()=>fail(Error(`Timeout ${method}`)),10000);waiting.set(current,d=>{clearTimeout(timer);d.error?fail(Error(JSON.stringify(d.error))):done(d.result);});socket.send(JSON.stringify({id:current,method,params}));});}
 async function ev(expression){const d=await cdp('Runtime.evaluate',{expression,returnByValue:true});assert.ok(!d.exceptionDetails,JSON.stringify(d.exceptionDetails));return d.result.value;}
 async function nav(route){await cdp('Page.navigate',{url:origin+route});for(let i=0;i<100;i++){if(await ev(`location.pathname===${JSON.stringify(route)}&&document.readyState==='complete'`))return;await new Promise(r=>setTimeout(r,30));}throw Error('navigation '+route);}
 await cdp('Runtime.enable');await cdp('Log.enable');await cdp('Network.enable');await cdp('Page.enable');await cdp('Page.bringToFront');
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 async function shot(name,clip){if(!process.env.SCREENSHOT_DIR)return;await mkdir(process.env.SCREENSHOT_DIR,{recursive:true});const s=await cdp('Page.captureScreenshot',clip?{clip}:{});await writeFile(join(process.env.SCREENSHOT_DIR,name+'.png'),Buffer.from(s.data,'base64'));}
 await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await nav('/');await wait(150);
 assert.ok(await ev('!!document.querySelector(".aperture")'),'authored ASCII structure present');
 assert.equal(await ev('document.querySelector("details").open'),false);
 assert.ok(await ev('![...document.querySelectorAll("nav a")].some(a=>a.getClientRects().length)'),'no route labels on arrival');
 await shot('aperture-desktop-first');await shot('aperture-detail',{x:180,y:100,width:700,height:650,scale:4});
 async function key(key,code=key,n=13){await cdp('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:n,...(key==='Enter'?{text:'\r'}:{})});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n});await wait(80);}
 async function point(selector){return ev(`(()=>{const b=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2};})()`);}
 async function click(p){await cdp('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',clickCount:1});await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',clickCount:1});await wait(150);}
 await key('Tab','Tab',9);assert.equal(await ev('document.activeElement.textContent'),'Skip to content');
 await key('Enter');assert.equal(await ev('document.activeElement.id'),'main');
 await key('Tab','Tab',9);assert.equal(await ev('document.activeElement.className'),'threshold','first entrance focus is the actual light');
 assert.equal(await ev('getComputedStyle(document.querySelector(".enter-word")).opacity'),'1','keyboard focus reveals Enter immediately');
 await shot('aperture-focus');await key('Enter');
 assert.equal(await ev('document.querySelector("details").open'),true);
 assert.equal(await ev('getComputedStyle(document.querySelector(".aperture"),"::before").animationIterationCount'),'1','read scan is a single pass, not an idle loop');
 assert.equal(await ev('document.activeElement.getAttribute("href")'),'/work/','opening focuses first route');
 await wait(120);await shot('aperture-mid-opening');await wait(1500);await shot('aperture-desktop-open');await key('Escape','Escape',27);
 assert.equal(await ev('document.querySelector("details").open'),false);
 assert.equal(await ev('document.activeElement.tagName'),'SUMMARY','Escape restores threshold');
 console.log('PASS native threshold, hidden arrival, keyboard reveal, inner route focus, Escape restoration');
 await click(await point('.maker-seam'));await key('Escape','Escape',27);
 assert.equal(await ev('document.activeElement.className'),'maker-seam','alternate seam focus restored');
 await click(await point('.threshold'));assert.equal(await ev('document.querySelector("details").open'),true);await click(await point('.close-index'));assert.equal(await ev('document.querySelector("details").open'),false,'real close button');assert.equal(await ev('document.activeElement.tagName'),'SUMMARY','close restores threshold focus');
 await wait(1800);assert.equal(await ev('document.querySelector(".aperture").dataset.motion'),'drifting','explicitly requested exterior keeps drifting after the structure settles');
 await click(await point('.stillness'));assert.equal(await ev('document.querySelector(".aperture").dataset.motion'),'paused');
 let frozen=await ev('document.querySelector(".aperture").dataset.frame');await wait(600);assert.equal(await ev('document.querySelector(".aperture").dataset.frame'),frozen,'paused has no frame loop');
 await click(await point('.stillness'));
 await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await wait(100);
 assert.equal(await ev('document.querySelector(".aperture").dataset.motion'),'reduced');frozen=await ev('document.querySelector(".aperture").dataset.frame');await wait(600);assert.equal(await ev('document.querySelector(".aperture").dataset.frame'),frozen);
 await click(await point('.threshold'));assert.equal(await ev('document.querySelector("details").open'),true);await click(await point('.close-index'));assert.equal(await ev('document.querySelector("details").open'),false,'real close button');assert.equal(await ev('document.activeElement.tagName'),'SUMMARY','close restores threshold focus');
 await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
 await ev('document.querySelector("details").open=true');await wait(80);await ev('document.querySelector(".aperture").style.marginTop="200vh"');await wait(150);assert.equal(await ev('document.querySelector(".aperture").dataset.motion'),'offscreen');assert.equal(await ev('getComputedStyle(document.querySelector(".aperture"),"::before").animationPlayState'),'paused','CSS read scan also suspends offscreen');frozen=await ev('document.querySelector(".aperture").dataset.frame');await wait(600);assert.equal(await ev('document.querySelector(".aperture").dataset.frame'),frozen);await ev('document.querySelector(".aperture").style.marginTop=""');await wait(150);
 await ev('document.querySelector("details").open=false');await wait(80);const original=(await cdp('Target.getTargetInfo')).targetInfo.targetId;const other=await cdp('Target.createTarget',{url:'about:blank'});await cdp('Target.activateTarget',{targetId:other.targetId});await wait(250);assert.equal(await ev('document.querySelector(".aperture").dataset.motion'),'hidden');assert.equal(await ev('getComputedStyle(document.querySelector(".aperture"),"::before").animationPlayState'),'paused','CSS read scan also suspends in background');frozen=await ev('document.querySelector(".aperture").dataset.frame');await wait(600);assert.equal(await ev('document.querySelector(".aperture").dataset.frame'),frozen);await cdp('Target.closeTarget',{targetId:other.targetId});await cdp('Target.activateTarget',{targetId:original});await wait(150);
 console.log('PASS mouse/alternate entry, pause, live reduced motion, offscreen and background: no frame loops');
 for (const width of [320,390,768,1440]) {
  await cdp('Emulation.setDeviceMetricsOverride',{width,height:width<650?844:1000,deviceScaleFactor:width<650?3:1,mobile:width<650});await nav('/');await wait(100);
  assert.ok(await ev('document.documentElement.scrollWidth<=innerWidth'),width+' no overflow');
  assert.ok(await ev('parseFloat(getComputedStyle(document.querySelector(".desktop-art")).fontSize)>=12'),'legible glyph size, independent of DPR');assert.ok(await ev('/^[\\x20-\\x7e\\n]+$/.test(document.querySelector("pre").textContent)'),'live drawing is genuine ASCII');
  assert.ok(await ev('(()=>{const b=document.querySelector(".threshold").getBoundingClientRect();return b.left>=0&&b.right<=innerWidth&&b.top>=0&&b.bottom<=innerHeight})()'),width+' threshold in viewport');
  if(width===390) {
   await shot('aperture-mobile-first');const touch=await point('.threshold');
   await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch]});await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await wait(1400);
   assert.equal(await ev('document.querySelector("details").open'),true,'first tap opens only inner layer');await shot('aperture-mobile-open');
   assert.equal(await ev('[...document.querySelectorAll("nav a")].filter(a=>{const b=a.getBoundingClientRect();return b.height>=44&&b.left>=0&&b.right<=innerWidth&&b.bottom<=innerHeight}).length'),4,'all routes readable and touchable');
   const contact=await point('a[href="/contact/"]');await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[contact]});await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await wait(180);assert.equal(await ev('location.pathname'),'/contact/','second tap routes');
   await nav('/');await wait(120);const cancel=await point('.threshold');await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[cancel]});await cdp('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cancel.x-65,y:cancel.y+20}]});await cdp('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await wait(100);
   assert.equal(await ev('document.querySelector(".aperture").dataset.approach'),'false');assert.equal(await ev('document.querySelector("details").open'),false,'cancellation never opens');
  }
 }
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await nav('/');await click(await point('.threshold'));await cdp('Emulation.setDeviceMetricsOverride',{width:768,height:1000,deviceScaleFactor:1,mobile:false});await wait(600);assert.equal(await ev('document.querySelector("details").open'),true,'live viewport resize preserves open state');assert.equal(await ev('[...document.querySelectorAll("nav a")].filter(a=>a.getBoundingClientRect().height>=44).length'),4,'resize preserves usable routes');await key('Escape','Escape',27);
 await cdp('Emulation.setDeviceMetricsOverride',{width:844,height:390,deviceScaleFactor:2,mobile:true});await nav('/');await wait(100);
 assert.ok(await ev('document.documentElement.scrollHeight<=innerHeight'),'short landscape does not force scrolling');
 await ev('document.querySelector("summary").focus()');await key('Enter');await wait(1300);
 assert.equal(await ev('[...document.querySelectorAll("nav a")].filter(a=>{const b=a.getBoundingClientRect();return b.height>=44&&b.top>=0&&b.bottom<=innerHeight}).length'),4,'all landscape routes available');await shot('aperture-landscape-open');await key('Escape','Escape',27);
 await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await nav('/');await wait(100);
 await ev('document.querySelector(".threshold").focus()');await key('Enter');await key('Enter');await wait(180);assert.equal(await ev('location.pathname'),'/work/','real keyboard route');
 await cdp('Emulation.setScriptExecutionDisabled',{value:true});await nav('/');
 assert.equal(await ev('document.querySelector(".aperture").dataset.motion'),'still');assert.ok(await ev('[...document.querySelectorAll(".character-art")].some(a=>a.getBoundingClientRect().height>0)'));
 await shot('aperture-nojs-first');await ev('document.querySelector("summary").focus()');await key('Enter');await wait(1400);
 assert.equal(await ev('document.querySelector("details").open'),true,'native no-JS threshold');assert.equal(await ev('[...document.querySelectorAll("nav a")].filter(a=>a.getClientRects().length&&a.getBoundingClientRect().height>=44).length'),4);await shot('aperture-nojs-open');
 await ev('document.querySelector("nav a").focus()');await key('Enter');await wait(180);assert.equal(await ev('location.pathname'),'/work/','native no-JS route');
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await nav('/');await wait(100);assert.ok(await ev('document.querySelector(".mobile-art").getBoundingClientRect().height>0'),'authored mobile no-JS composition');await shot('aperture-nojs-mobile');await ev('document.querySelector("summary").focus()');await key('Enter');assert.equal(await ev('document.querySelector("details").open'),true,'mobile no-JS native disclosure');
 await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await cdp('Emulation.setScriptExecutionDisabled',{value:false});await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await nav('/');await wait(100);assert.equal(await ev('document.querySelector(".aperture").dataset.motion'),'reduced');await shot('aperture-reduced');assert.equal(await ev('getComputedStyle(document.querySelector(".aperture"),"::before").animationName'),'none','reduced motion disables CSS scan too');
 await ev('document.querySelector("summary").focus()');await key('Enter');await key('Escape','Escape',27);
 await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});await nav('/');await wait(150);
 const p=await point('.threshold');await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',...p});await wait(400);assert.equal(await ev('document.querySelector(".aperture").dataset.approach'),'true');await shot('aperture-approach');
 await ev('document.querySelector(".aperture").dispatchEvent(new PointerEvent("pointercancel",{bubbles:true}))');assert.equal(await ev('document.querySelector(".aperture").dataset.approach'),'false');
 console.log('PASS layouts 320/390/768/1440, legible ASCII glyphs, first/second touch, pointercancel, native no-JS, initial reduced motion, approach');

 // Real native input, safe parser, editing/history and shortcuts. Never execute a shell.
 await nav('/');await wait(100);
 async function typeCommand(text){await ev('document.querySelector(".command-form input").focus()');await cdp('Input.insertText',{text});await key('Enter');}
 await ev('document.querySelector(".command-form input").focus()');await cdp('Input.insertText',{text:'hep'});await key('ArrowLeft','ArrowLeft',37);await cdp('Input.insertText',{text:'l'});assert.equal(await ev('document.querySelector("input").value'),'help','native caret editing is not hijacked');await key('Enter');assert.ok(await ev('document.querySelector(".terminal-output").textContent.includes("AVAILABLE COMMANDS")'));await shot('terminal-help');
 await typeCommand('inspect');assert.ok(await ev('document.querySelector(".terminal-output").textContent.includes("64 source solids")'));
 await ev('document.querySelector(".command-form input").focus()');await key('ArrowUp','ArrowUp',38);assert.equal(await ev('document.querySelector("input").value'),'inspect');await key('ArrowUp','ArrowUp',38);assert.equal(await ev('document.querySelector("input").value'),'help');await key('ArrowDown','ArrowDown',40);assert.equal(await ev('document.querySelector("input").value'),'inspect');await key('ArrowDown','ArrowDown',40);assert.equal(await ev('document.querySelector("input").value'),'');
 await click(await point('[data-command="map"]'));assert.ok(await ev('document.querySelector(".terminal-output").textContent.includes("ANATOMY SOURCE")'));await shot('terminal-map');
 await click(await point('[data-command="log"]'));assert.ok(await ev('document.querySelector(".terminal-output").textContent.includes("RECOVERED NOTICE / FICTION")'));await shot('terminal-log');
 await typeCommand('hold');assert.equal(await ev('document.querySelector(".aperture").dataset.motion'),'paused');let held=await ev('document.querySelector(".aperture").dataset.frame');await wait(300);assert.equal(await ev('document.querySelector(".aperture").dataset.frame'),held,'typed hold stops actual scene writes');await typeCommand('resume');await wait(350);assert.notEqual(await ev('document.querySelector(".aperture").dataset.frame'),held);
 await typeCommand('ls');assert.equal(await ev('document.querySelector("details").open'),true);await key('Escape','Escape',27);assert.equal(await ev('document.activeElement.id'),'command-input','typed directory restores input focus');
 await typeCommand('<img src=x onerror=alert(1)>');assert.equal(await ev('document.querySelectorAll(".terminal-output img").length'),0,'untrusted input is literal text, not markup');assert.ok(await ev('document.querySelector(".terminal-output").textContent.includes("NO SUCH RECORD")'));
 await typeCommand('clear');assert.equal(await ev('document.querySelector(".terminal-output").children.length'),0);
 for(const [typed,path] of [[' OPEN /work/ ','/work/'],['ABOUT','/about/'],['cd /contact/','/contact/']]){await nav('/');await wait(100);await typeCommand(typed);await wait(150);assert.equal(await ev('location.pathname'),path,'typed site route '+typed);}
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await nav('/');await wait(100);const helpTouch=await point('[data-command="help"]');await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[helpTouch]});await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await wait(100);assert.ok(await ev('document.querySelector(".terminal-output").textContent.includes("AVAILABLE COMMANDS")'),'touch shortcut needs no typing');assert.ok(await ev('document.documentElement.scrollWidth<=innerWidth'));
 await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await nav('/');await wait(100);
 console.log('PASS typed help/inspect/map/log/hold/resume/clear/ls, safe text, history, forgiving real routes, touch shortcut');
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:450,deviceScaleFactor:1,mobile:true});await nav('/');await wait(100);assert.ok(await ev('(()=>{const b=document.querySelector("input").getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight})()'),'narrow keyboard-height viewport keeps native command input visible');await click(await point('.threshold'));assert.equal(await ev('[...document.querySelectorAll("nav a")].filter(a=>{const b=a.getBoundingClientRect();return b.height>=44&&b.top>=0&&b.bottom<=innerHeight}).length'),4,'narrow short viewport retains all routes');await shot('terminal-short-mobile');
 await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await nav('/');await wait(100);
 await cdp('Performance.enable');const before=(await cdp('Performance.getMetrics')).metrics;
 await wait(1800);const startWrites=await ev('Number(document.querySelector(".aperture").dataset.writes)');await ev('window.actualSpaceWrites=0;new MutationObserver(m=>window.actualSpaceWrites+=m.length).observe(document.querySelector(".desktop-art"),{childList:true})');const start=await ev('Number(document.querySelector(".aperture").dataset.frame)'),spaceBefore=await ev('document.querySelector(".desktop-art").textContent'),backgroundCost=await ev('Number(document.querySelector(".aperture").dataset.drawTotalMs)');await wait(6000);const driftCount=(await ev('Number(document.querySelector(".aperture").dataset.frame)'))-start;assert.ok(driftCount>=20&&driftCount<=24,'exterior capped at four actual character renders per second');assert.notEqual(await ev('document.querySelector(".desktop-art").textContent'),spaceBefore,'the requested ASCII space actually moves');await shot('space-drift');const spaceWrites=await ev('window.actualSpaceWrites');assert.equal(spaceWrites,(await ev('Number(document.querySelector(".aperture").dataset.writes)'))-startWrites,'write counter matches actual DOM mutations');assert.ok(spaceWrites>0&&spaceWrites<=driftCount,'actual background text changes without duplicate writes');console.log('Actual moving background over 6000ms:',{draws:driftCount,actualDOMWrites:spaceWrites,totalDrawMs:(await ev('Number(document.querySelector(".aperture").dataset.drawTotalMs)'))-backgroundCost});
 await ev('document.querySelector("details").open=true');const began=performance.now();const initial=await ev('Number(document.querySelector(".aperture").dataset.frame)');const initialCost=await ev('Number(document.querySelector(".aperture").dataset.drawTotalMs)');await wait(1500);
 const count=(await ev('Number(document.querySelector(".aperture").dataset.frame)'))-initial;assert.ok(count>=5&&count<=6,'actual character draw cadence, not RAF alone');console.log('Actual character draws during opening:',{draws:count,elapsedMs:performance.now()-began,lastDrawMs:await ev('document.querySelector(".aperture").dataset.drawMs'),totalDrawMs:(await ev('Number(document.querySelector(".aperture").dataset.drawTotalMs)'))-initialCost,maxDrawMs:await ev('document.querySelector(".aperture").dataset.drawMaxMs')});
 const cadence=await cdp('Runtime.evaluate',{expression:'new Promise(resolve=>{let a=[],last;function f(t){if(last)a.push(t-last);last=t;if(a.length<90)requestAnimationFrame(f);else resolve({samples:a.length,meanMs:a.reduce((s,n)=>s+n,0)/a.length,maxMs:Math.max(...a)});}requestAnimationFrame(f);})',awaitPromise:true,returnByValue:true});console.log('RAF cadence:',cadence.result.value);
 const after=(await cdp('Performance.getMetrics')).metrics;const metric=(m,n)=>m.find(x=>x.name===n).value;console.log('Observation metrics:',{scriptSeconds:metric(after,'ScriptDuration')-metric(before,'ScriptDuration'),taskSeconds:metric(after,'TaskDuration')-metric(before,'TaskDuration'),heapMB:metric(after,'JSHeapUsedSize')/1048576});
 assert.equal(await ev('document.getAnimations().filter(a=>a.playState==="running").length'),0,'read scan finishes; no perpetual CSS animation');
 assert.deepEqual(errors,[],'browser errors');console.log('PASS zero network, console or JS errors; CSS scan finishes');
}finally{socket?.close();const stopped=once(browser,'exit');browser.kill('SIGTERM');await Promise.race([stopped,new Promise(r=>setTimeout(r,3000))]);if(browser.exitCode===null)browser.kill('SIGKILL');server.close();await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:200});}
