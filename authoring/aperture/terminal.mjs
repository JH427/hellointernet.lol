import {characters} from './characters.mjs';
import {PARTS,REST} from './model.mjs';
export const ROUTES={work:'/work/',notes:'https://wiki.hellointernet.lol/',about:'/about/',contact:'/contact/'};
// An allowlisted literary interface. No eval, shell, fetch or arbitrary URL action.
export function command(raw){
 const text=String(raw).trim().toLowerCase().replace(/^>\s*/,''),words=text.split(/\s+/);
 const route=(['open','cd','go'].includes(words[0])?words.slice(1).join(' '):text).replace(/^\/+|\/+$/g,'');
 if(Object.hasOwn(ROUTES,route))return {kind:'navigate',href:ROUTES[route],text:`OPENING ${route.toUpperCase()} RECORD.`};
 if(['help','?'].includes(text))return {kind:'text',text:'AVAILABLE COMMANDS\n\nwork  notes  about  contact   Open a record channel\ndir / ls                     Open the touch directory\ninspect                      Inspect the spatial model\nmap                          Print the Anatomy cross-section\nlog                          Read a fictional recovered notice\nhold / resume                Pause / resume exterior drift\nclear                        Clear this display\n\nOpen work, cd /work/ and WORK also work.\nThis is an artwork. Commands never run a shell.'};
 if(['dir','ls','directory'].includes(text))return {kind:'directory',text:'DIRECTORY CHANNEL OPEN.'};
 if(text==='inspect')return {kind:'text',text:`SPATIAL RECORD / ANATOMY\n${PARTS.length} source solids. Two remote strata. Sixteen further fragments.\nThe cross-section is real geometry rendered as characters.\nScale, location and the absent authority are fictional.\nThe exterior points are an authored moving space study.\nNo live vessel or machine telemetry is connected.`};
 if(text==='map')return {kind:'map',text:'SPATIAL RECORD / CHARACTER CROSS-SECTION\n'+characters(60,20,REST,'',2)+'\nANATOMY SOURCE / FICTIONAL SCALE'};
 if(text==='log')return {kind:'text',text:'RECOVERED NOTICE / FICTION\n\nTo the next operator:\nDo not mistake availability for permission.\nThe office can no longer revoke either.\n\nA final instruction was expected.\nNone has been retained.\n\nThe archive will continue.'};
 if(['hold','pause'].includes(text))return {kind:'hold',text:'EXTERIOR HELD. THE RECORDS REMAIN AVAILABLE.'};
 if(['resume','continue'].includes(text))return {kind:'resume',text:'EXTERIOR DRIFT RESUMED. REDUCED-MOTION PREFERENCE TAKES PRIORITY.'};
 if(text==='clear')return {kind:'clear',text:'DISPLAY CLEARED. RECORDS RETAINED.'};
 return {kind:'text',text:text?'NO SUCH RECORD. TYPE HELP OR SELECT DIRECTORY.':'ENTER A COMMAND. HELP IS AVAILABLE.'};
}
