/* =================== Remove tool: buildings, roads, trees and bushes =================== */
/* all removal lives here (next to Roads). Trees and bushes go for good and give a quarter of a season's output. */
const CLEAR_GIVE={tree:2,bush:3};   /* wood per tree, berries per bush */
let remArmed=null;   /* building waiting for the second click */
function startRemove(){closeSheet();if(typeof closeTray==='function')closeTray();mode='remove';remArmed=null;sel=null;removeBar();}
function removeBar(msg){if(mode!=='remove')return;
  const btns=[{label:'Close',fn:()=>{remArmed=null;sel=null;endMode();if(typeof renderDock==='function')renderDock();save();}}];
  if(remArmed){const b=remArmed,D=DEF[b.t];btns.unshift({label:'Remove '+D.name.toLowerCase(),cls:'danger',fn:()=>removeBuilding(b)});btns.unshift({label:'Keep it',fn:()=>{remArmed=null;sel=null;removeBar();}});}
  setModeBar(msg||(remArmed?'<strong>Remove the '+esc(DEF[remArmed.t].name)+'?</strong> '+esc(remRefundTxt(remArmed)):'<strong>Remove</strong> · Click a building, a road, trees or berry bushes to remove them. Trees and bushes go for good: you get '+CLEAR_GIVE.tree+' wood a tree and '+CLEAR_GIVE.bush+' berries a bush.'),false,btns);}
function plantsOn(i){const x=i%N,y=(i/N)|0;return {t:trees.filter(o=>o.x===x&&o.y===y&&!o.gone).length,b:bushes.filter(o=>o.x===x&&o.y===y&&!o.gone).length};}
/* remove the trees and bushes on these tiles; returns what was given back */
function clearTiles(list){let t=0,bu=0;for(const i of list){const p=plantsOn(i);if(!p.t&&!p.b)continue;t+=p.t;bu+=p.b;clearForest(i,false);}
  const gw=t?addRes('wood',t*CLEAR_GIVE.tree):0,gb=bu?addRes('berries',bu*CLEAR_GIVE.bush):0;return {t:t,b:bu,wood:gw,berries:gb};}
function clearTxt(g){const p=[];if(g.t)p.push(g.t+' tree'+(g.t>1?'s':''));if(g.b)p.push(g.b+' berry bush'+(g.b>1?'es':''));const q=[];if(g.wood)q.push('+'+fmt(g.wood)+' wood');if(g.berries)q.push('+'+fmt(g.berries)+' berries');return p.join(' and ')+' removed'+(q.length?': '+q.join(', '):'')+'.';}
function remRefundTxt(b){const full=underCons(b)&&b.cons.done<=0.001;return (full?'Nothing was built yet: all materials come back.':'Half the materials come back.');}
function removeBuilding(b){const D=DEF[b.t];remArmed=null;sel=null;
  if(D.fixed){removeBar('The '+esc(D.name)+' cannot be removed.');return;}
  if(D.housing&&!underCons(b)&&housing()-(b.t==='house'?HOUSE_CAP[b.lvl-1]:D.housing)<S.pop){removeBar('Not enough room elsewhere for the people living in this '+esc(D.name.toLowerCase())+'.');return;}
  const full=underCons(b)&&b.cons.done<=0.001;pay(b.paid||D.cost,full?-1:-0.5);B=B.filter(o=>o!==b);if(b.t==='tower'&&inMap(b.fx,b.fy)){const i=b.fy*N+b.fx;if(walls[i]===3){const x=b.fx,y=b.fy,nb=[[1,0],[-1,0],[0,1],[0,-1]].some(d=>inMap(x+d[0],y+d[1])&&walls[(y+d[1])*N+x+d[0]]);walls[i]=nb?1:0;}/* a tower in the ring leaves a stake behind */recomputeWalls();}rebuildOcc();recomputeConn();assignWorkers();
  removeBar(esc(D.name)+' removed. '+(full?'All':'Half')+' the materials came back.');save();}
function removeTap(tt){const x=tt[0],y=tt[1];if(!inMap(x,y))return;const i=y*N+x;
  /* the building on this tile, or one whose picture covers it */
  let id=occ[i];if(!id)for(let k=1;k<4&&!id;k++){if(inMap(x+k,y+k))id=occ[(y+k)*N+x+k];}
  if(id){const b=B.find(o=>o.id===id);if(b){if(DEF[b.t].fixed){removeBar('The '+esc(DEF[b.t].name)+' cannot be removed.');return;}remArmed=b;sel={b:b};removeBar();return;}}
  remArmed=null;sel={x:x,y:y};
  if(typeof walls!=='undefined'&&walls[i]){walls[i]=0;recomputeWalls();rebuildOcc();removeBar('Palisade removed.');save();return;}
  if(roads[i]){roads[i]=0;recomputeConn();assignWorkers();removeBar('Road removed.');save();return;}
  if(!isUnl(x,y)){removeBar('This land is not yours yet.');return;}
  const p=plantsOn(i);if(p.t||p.b){const g=clearTiles([i]);removeBar(clearTxt(g));save();return;}
  removeBar('Nothing to remove here.');}
