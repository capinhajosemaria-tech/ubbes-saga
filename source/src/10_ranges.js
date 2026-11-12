/* =================== ranges =================== */
function rectDist(b,x,y){const dx=Math.max(b.fx-x,0,x-(b.fx+b.w-1)),dy=Math.max(b.fy-y,0,y-(b.fy+b.h-1));return Math.max(dx,dy);}
function tilesInRange(b,r,pred){let n=0;for(let y=b.fy-r;y<b.fy+b.h+r;y++)for(let x=b.fx-r;x<b.fx+b.w+r;x++){if(!inMap(x,y))continue;if(x>=b.fx&&x<b.fx+b.w&&y>=b.fy&&y<b.fy+b.h)continue;if(pred(ter[y*N+x]))n++;}return n;}
const isWater=t=>t===T.SEA||t===T.RIVER;
/* tiles from the building's edge to the nearest sea or river tile (13 if none within 12) */
function waterDist(b,pred){pred=pred||isWater;for(let r=1;r<=12;r++){for(let y=b.fy-r;y<b.fy+b.h+r;y++)for(let x=b.fx-r;x<b.fx+b.w+r;x++){if(y>b.fy-r&&y<b.fy+b.h+r-1&&x>b.fx-r&&x<b.fx+b.w+r-1)continue;if(inMap(x,y)&&pred(ter[y*N+x]))return r;}}return 13;}
/* Fisher's Hut: 100% within 5 tiles of water, then 16% less per tile, never under 20% */
const fishEff=d=>d<=5?1:Math.max(0.2,1-(d-5)*0.16);
function needCount(b,need,planned){
  if(!need)return {n:1,label:''};
  if(b.t&&SRC_OF[b.t]&&typeof srcLabel==='function')return srcLabel(b,planned);
  if(need.k==='tree'){const inR=trees.filter(t=>t.amt>0&&rectDist(b,t.x,t.y)<=need.r);const others=B.filter(o=>o.t==='wood'&&o!==b&&!(o.fx===b.fx&&o.fy===b.fy));const sh=inR.filter(t=>others.some(o=>rectDist(o,t.x,t.y)<=need.r)).length;return {n:inR.length,label:inR.length+' trees in range'+(sh?' ('+sh+' shared with another lodge)':'')};}
  if(need.k==='bush'){const n=bushes.filter(t=>rectDist(b,t.x,t.y)<=need.r).length;return {n:n,label:n+' berry bushes in range'};}
  if(need.k==='iron'){const n=tilesInRange(b,need.r,t=>t===T.IRON);return {n:n,label:n+' iron outcrops in range'};}
  if(need.k==='river'){const n=tilesInRange(b,need.r,t=>t===T.RIVER);return {n:n,label:n+' river tiles in range'};}
  if(need.k==='waterd'){const d=waterDist(b);if(d>12)return {n:0,label:'No sea or river within 12 tiles'};const e=fishEff(d);return {n:1,label:(d<=1?'Right by the water':'Water '+d+' tiles away')+' · '+Math.round(e*100)+'% catch'};}
  if(need.k==='water'){const n=tilesInRange(b,need.r,isWater);return {n:n,label:n+' water tiles in range'};}
  if(need.k==='sea'){const n=tilesInRange(b,need.r,t=>t===T.SEA);return {n:n,label:n+' sea tiles alongside'};}
  return {n:1,label:''};
}
function canPlace(t,fx,fy,rot,ignoreId){
  const D=DEF[t],d=dims(t,rot),b={t:t,fx:fx,fy:fy,w:d.w,h:d.h};let wet=0;const clears=[];
  for(let y=fy;y<fy+d.h;y++)for(let x=fx;x<fx+d.w;x++){
    if(!inMap(x,y))return {ok:false,why:'Outside the map'};
    if(!isUnl(x,y))return {ok:false,why:'This land is locked. Unlock it with fame.'};
    const tt=ter[y*N+x];if((D.water&&tt===T.SEA)||(D.river&&tt===T.RIVER)){wet++;}else if((tt===T.FOREST||tt===T.BERRY)&&!ignoreId){clears.push(y*N+x);}else if(!BUILDABLE.has(tt))return {ok:false,why:tt===T.FOREST?'Trees are in the way':tt===T.RIVER||tt===T.SEA?'Cannot build on water':tt===T.BERRY?'Berry bushes are in the way':tt===T.IRON?'Rock outcrop in the way':'Cannot build here'};
    const o=occ[y*N+x];if(o&&o!==ignoreId)return {ok:false,why:'Another building is here'};
    if(roads[y*N+x])return {ok:false,why:'A road is here'};
    if(typeof walls!=='undefined'&&walls[y*N+x])return {ok:false,why:'The palisade is here'};
  }
  if(D.river&&!wet)return {ok:false,why:'The water mill must stand on the river: its wheel turns in the water'};
  if(D.river&&wet>Math.floor(d.w*d.h/2))return {ok:false,why:'Needs a foothold on the bank: too much of it is over the river'};
  if(D.slip){if(!slipDir(b))return {ok:false,why:'The boathouse needs a row of dry shore, and its slipway must reach open sea on the far side'};}
  else if(D.pier){const ax=d.w>d.h,Lr=ax?d.w:d.h,Wr=ax?d.h:d.w,row=k=>{let n=0;for(let s=0;s<Wr;s++){const x=ax?fx+k:fx+s,y=ax?fy+s:fy+k;if(tAt(x,y)===T.SEA)n++;}return n;};const r0=row(0),r1=row(Lr-1);
    if(!((r0===0&&r1===Wr)||(r1===0&&r0===Wr)))return {ok:false,why:'The pier must run from dry shore straight out to open sea'};}
  else if(D.water&&wet>Math.floor(d.w*d.h*0.6))return {ok:false,why:'Needs a foothold on the shore: too much of it is over water'};
  const nc=needCount(b,D.need,!ignoreId);
  if(D.need&&nc.n===0){const k=D.need.k,r=D.need.r;return {ok:false,why:k==='tree'?'No trees within '+r+' tiles':k==='bush'?'No berry bushes within '+r+' tiles':k==='iron'?'No iron outcrop within '+r+' tiles':k==='water'?'No sea or river within '+r+' tiles':k==='river'?'Needs the river within '+r+' tiles':k==='waterd'?'No sea or river within 12 tiles':k==='sea'?(r===1?'Must stand right at the sea shore':'Needs the sea within '+r+' tiles'):'Needs water within '+r+' tiles',label:nc.label};}
  let lab=nc.label;if(typeof nbOf==='function'&&NB[t]){const nb=nbOf({t:t,fx:fx,fy:fy,w:d.w,h:d.h});lab=(lab?lab+' · ':'')+(nb?'+15% next to the '+nb:'Place within 4 tiles of a '+NB[t].map(x=>DEF[x].name).join(' or ')+' for +15%');}
  if(t==='house'){const hb={fx:fx,fy:fy,w:d.w,h:d.h};const m=B.some(o=>o.t==='market'&&bDist(hb,o)<=4),sm=B.some(o=>(o.t==='smith'||o.t==='smoke')&&bDist(hb,o)<=2);if(m||sm)lab=(m?'Near the market: +attractiveness':'')+(m&&sm?' · ':'')+(sm?'Next to smoke and soot: −attractiveness':'');}
  if(clears.length){let nt=0,nb=0;for(const i of clears){const p=plantsOn(i);nt+=p.t;nb+=p.b;}if(nt||nb){const w=[];if(nt)w.push(nt+' tree'+(nt>1?'s':''));if(nb)w.push(nb+' berry bush'+(nb>1?'es':''));lab=(lab?lab+' · ':'')+'Clears '+w.join(' and ');}}
  return {ok:true,label:lab,clears:clears};
}
