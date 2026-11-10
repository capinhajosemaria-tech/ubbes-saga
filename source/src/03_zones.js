/* =================== zones =================== */
const ZN=N/6;
let unlocked=new Set();
function defaultZones(){unlocked=new Set();for(let zx=ZC_X-1;zx<=ZC_X+1;zx++)for(let zy=ZC_Y-1;zy<=ZC_Y+1;zy++)unlocked.add(zx+','+zy);}
defaultZones();
const PRE=['Hrafn','Kald','Bjarkar','Ulfs','Stein','Myrar','Sólar','Asks','Elds','Fjall','Holm','Ís','Járn','Lyng','Odda','Sjó','Þórs','Vind','Ægis','Lunda','Ref'];
const SUF=['hóll','vík','lundr','dalr','nes','berg','mýrr','haugr','strönd','skógr','á','fell'];
const zoneName=(zx,zy)=>PRE[(zx*7+zy*3)%PRE.length]+SUF[(zx*5+zy*11)%SUF.length];
const zoneCost=(zx,zy)=>{const d=Math.max(Math.abs(zx-ZC_X),Math.abs(zy-ZC_Y));return d<=1?0:30*d-10;};
const isUnl=(x,y)=>unlocked.has(Math.floor(x/6)+','+Math.floor(y/6));
const zoneAdj=(zx,zy)=>[[1,0],[-1,0],[0,1],[0,-1]].some(d=>unlocked.has((zx+d[0])+','+(zy+d[1])));
