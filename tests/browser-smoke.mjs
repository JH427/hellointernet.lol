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
 socket.addEventListener('message',e=>{const d=JSON.parse(e.data);if(d.id){waiting.get(d.id)?.(d);waiting.delete(d.id);}if(d.method==='Runtime.exceptionThrown')errors.push(d.params.exceptionDetails.text);if(d.method==='Log.entryAdded'&&d.params.entry.level==='error')errors.push(d.params.entry.text);});
 async function cdp(method,params={}){const current=++id;return new Promise((done,fail)=>{const timer=setTimeout(()=>fail(Error(`Timeout ${method}`)),10000);waiting.set(current,d=>{clearTimeout(timer);d.error?fail(Error(JSON.stringify(d.error))):done(d.result);});socket.send(JSON.stringify({id:current,method,params}));});}
 async function ev(expression){const d=await cdp('Runtime.evaluate',{expression,returnByValue:true});assert.ok(!d.exceptionDetails,JSON.stringify(d.exceptionDetails));return d.result.value;}
 async function nav(route){await cdp('Page.navigate',{url:origin+route});for(let i=0;i<100;i++){if(await ev(`location.pathname===${JSON.stringify(route)}&&document.readyState==='complete'`))return;await new Promise(r=>setTimeout(r,30));}throw Error('navigation '+route);}
 const routes=['/','/work/','/about/','/contact/','/resume/','/hire/','/about/faq/','/about/no/',...['001','002','003','004','005'].map(id=>`/work/${id}/`)];
 await cdp('Runtime.enable');await cdp('Log.enable');await cdp('Emulation.setScriptExecutionDisabled',{value:true});
 let checks=0;
 for(const width of [320,390,768,1440]){
 await cdp('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
 for(const route of routes){await nav(route);const s=await ev(`({scroll:document.documentElement.scrollWidth,width:innerWidth,h1:document.querySelectorAll('h1').length,main:!!document.querySelector('#main'),images:[...document.images].every(i=>i.complete&&i.naturalWidth>0)})`);assert.ok(s.scroll<=s.width,`${width} ${route} overflow ${s.scroll}`);assert.equal(s.h1,1,route+' h1');assert.ok(s.main&&s.images,route+' main/images');checks++;}
 if(process.env.SCREENSHOT_DIR&&[390,1440].includes(width)){await nav('/');await mkdir(process.env.SCREENSHOT_DIR,{recursive:true});const height=await ev('document.documentElement.scrollHeight');const shot=await cdp('Page.captureScreenshot',{captureBeyondViewport:true,clip:{x:0,y:0,width,height,scale:1}});await writeFile(join(process.env.SCREENSHOT_DIR,`home-${width}.png`),Buffer.from(shot.data,'base64'));}
 }
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await nav('/');
 assert.equal(await ev('document.querySelector("details").open'),false,'native route layer starts concealed');
 await ev('document.querySelector("details").open=true');
 assert.equal(await ev(`[...document.querySelectorAll('.site-index nav a')].filter(a=>{const b=a.getBoundingClientRect();return b.height>=44&&b.left>=0&&b.right<=innerWidth}).length`),4,'mobile native layer has usable links');
 await ev('document.querySelector("details").open=false');
 // Real Tab + Enter, not scripted click; native focus and navigation with JS disabled.
 await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
 assert.equal(await ev('document.activeElement.textContent'),'Skip to content');assert.ok(await ev('document.activeElement.getBoundingClientRect().top>=0'));
 async function enter(){await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',windowsVirtualKeyCode:13});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});}
 await enter();assert.equal(await ev('document.activeElement.id'),'main','skip reaches main');
 await nav('/about/');await ev('document.querySelector("summary").focus()');await enter();assert.ok(await ev('document.querySelector("details").open'),'keyboard disclosure opens');await enter();assert.equal(await ev('document.querySelector("details").open'),false);
 await ev(`[...document.querySelectorAll('nav a')].find(a=>a.getAttribute('href')==='/contact/').focus()`);await enter();for(let i=0;i<100;i++){if(await ev('location.pathname==="/contact/"&&document.readyState==="complete"'))break;await new Promise(r=>setTimeout(r,20));}assert.equal(await ev('document.querySelector("h1").textContent'),'Contact Joshua','keyboard contact navigation');
 await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});assert.ok(await ev('matchMedia("(prefers-reduced-motion: reduce)").matches'));assert.equal(await ev('document.querySelectorAll("canvas").length'),0);
 assert.deepEqual(errors,[],'browser errors');console.log(`PASS ${checks} root-route layout checks, JS disabled; mobile nav, Tab/Enter skip link, disclosure, keyboard contact, reduced motion; no browser errors.`);
}finally{socket?.close();const stopped=once(browser,'exit');browser.kill('SIGTERM');await Promise.race([stopped,new Promise(r=>setTimeout(r,3000))]);if(browser.exitCode===null)browser.kill('SIGKILL');server.close();await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:200});}
