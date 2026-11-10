/* =================== HUD =================== */
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ICON={food:'<svg width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="6" fill="#B5733F"></circle></svg>',
  wood:'<svg width="14" height="14" aria-hidden="true"><rect x="1" y="3" width="12" height="8" fill="#8E6F52"></rect></svg>',
  planks:'<svg width="14" height="14" aria-hidden="true"><rect x="1" y="2" width="12" height="4" fill="#C9A87A"></rect><rect x="1" y="8" width="12" height="4" fill="#C9A87A"></rect></svg>',
  iron:'<svg width="14" height="14" aria-hidden="true"><polygon points="2,11 7,3 12,11" fill="#4E4A45"></polygon></svg>',
  tools:'<svg width="14" height="14" aria-hidden="true"><path d="M3 12 L9 6" stroke="#5A4636" stroke-width="2"></path><path d="M7 2 L12 2 L12 5 L9 6 Z" fill="#8C9398"></path></svg>',
  water:'<svg width="14" height="14" aria-hidden="true"><path d="M7 1 Q12 7 12 9 A5 5 0 0 1 2 9 Q2 7 7 1 Z" fill="#5E7F8C"></path></svg>',
  fame:'<svg width="14" height="14" aria-hidden="true"><polygon points="7,1 9,5 13,5.5 10,8.5 11,13 7,10.8 3,13 4,8.5 1,5.5 5,5" fill="#A34A3A"></polygon></svg>',
  people:'<svg width="14" height="14" aria-hidden="true"><circle cx="7" cy="4" r="3" fill="#56636A"></circle><path d="M2 13 Q7 5 12 13 Z" fill="#56636A"></path></svg>'};
ICON.warriors='<svg width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="6" fill="#A34A3A"></circle><circle cx="7" cy="7" r="2" fill="#C9C2B2"></circle></svg>';
ICON.morale='<svg width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="6" fill="#C9A64A"></circle><path d="M4 8 Q7 11 10 8" stroke="#263035" stroke-width="1.4" fill="none"></path><circle cx="5" cy="5.5" r="0.9" fill="#263035"></circle><circle cx="9" cy="5.5" r="0.9" fill="#263035"></circle></svg>';
ICON.silver='<svg width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="6" fill="#B7BCBF"></circle><circle cx="7" cy="7" r="3" fill="none" stroke="#8C9398"></circle></svg>';
const CHIPS=[['food','Food'],['wood','Wood'],['planks','Planks'],['iron','Iron'],['tools','Tools'],['water','Water'],['fame','Fame'],['people','People'],['morale','Morale'],['warriors','Warriors'],['silver','Silver']];
$('res').innerHTML=CHIPS.map(c=>'<button type="button" class="chip" id="chip-'+c[0]+'" data-res="'+c[0]+'" aria-label="'+c[1]+'">'+ICON[c[0]]+'<span>'+c[1]+'</span> <strong id="r-'+c[0]+'">0</strong></button>').join('');
document.querySelectorAll('.chip').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.res==='warriors'?'war':(b.dataset.res==='people'||b.dataset.res==='morale')?'people':'village')));
function hud(){
  document.querySelectorAll('.seg .fast').forEach(b=>b.hidden=!(S.mode==='test'||S.mode==='sandbox'));
  const r=S.res;
  $('r-food').textContent=fmt(foodUnits());$('r-wood').textContent=fmt(r.wood);$('r-planks').textContent=fmt(r.planks);$('r-iron').textContent=fmt(r.iron);$('r-tools').textContent=fmt(r.tools);$('r-water').textContent=fmt(r.water);$('r-fame').textContent=fmt(S.fame);$('r-people').textContent=S.pop+'/'+housing();
  $('r-warriors').textContent=S.warriors+(S.train?'+'+S.train.n:'');$('r-silver').textContent=fmt(r.silver);$('r-morale').textContent=Math.round(S.morale);$('chip-morale').classList.toggle('warn',S.morale<40);
  $('chip-warriors').hidden=thLevel()<2;$('chip-silver').hidden=thLevel()<3;
  $('chip-food').classList.toggle('warn',foodUnits()<eatNeed()*3);$('chip-water').classList.toggle('warn',r.water<S.pop);$('chip-wood').classList.toggle('warn',isWinter()&&r.wood<fireNeed()*3);$('chip-tools').classList.toggle('warn',r.tools<1);
  const yt=S.gameT%YEAR,year=Math.floor(S.gameT/YEAR)+1,win=yt>=SUMMER;
  const day=win?Math.floor((yt-SUMMER)/DAY)+1:Math.floor(yt/DAY)+1,len=win?15:30,pr=win?(yt-SUMMER)/400:yt/SUMMER;
  $('date').textContent=(864+year)+' · '+(win?'Winter':'Summer')+' · Day '+day+'/'+len+' · Hall '+thLevel();$('prog').style.width=(pr*100).toFixed(1)+'%';
  const g=currentGoal();$('goal-txt').textContent=g?g.goal:(thLevel()<3?'Raise the Town Hall (tap it to see what is needed)':'All goals for this update are done');
  document.querySelector('.nav button[data-panel="war"]').classList.toggle('locked',thLevel()<2);document.querySelector('.nav button[data-panel="world"]').classList.toggle('locked',thLevel()<3);
}
let toastT=null;
function toast(msg,ms){const el=$('toast');el.textContent=msg;el.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{el.hidden=true;},ms||2800);}
document.querySelectorAll('.seg button').forEach(b=>b.addEventListener('click',()=>{speed=parseFloat(b.dataset.speed);document.querySelectorAll('.seg button').forEach(o=>o.setAttribute('aria-pressed',String(o===b)));}));
$('home').addEventListener('click',()=>{const p=iso(HOME_X,HOME_Y);camX=p[0];camY=p[1];});
$('goal').addEventListener('click',()=>openPanel('saga'));

/* ---------- sheet ---------- */
let sheetKind=null;
function openSheet(html,kind){$('sheet-card').innerHTML=html;$('sheet').hidden=false;sheetKind=kind||'info';const x=$('sheet-card').querySelector('[data-close]');if(x)x.addEventListener('click',closeSheet);}
function closeSheet(){$('sheet').hidden=true;sheetKind=null;sel=null;}
const head=(title,meta)=>'<div class="hd"><div><h2>'+esc(title)+'</h2>'+(meta?'<div class="meta">'+esc(meta)+'</div>':'')+'</div><button type="button" class="x" data-close aria-label="Close">×</button></div>';
function statusClass(s){if(s==='Working'||s==='Drawing newcomers')return '';if(s.indexOf('Resting')===0||s.indexOf('Holding')===0||s.indexOf('Idle')===0||s==='Paused'||s==='')return 'idle';return 'bad';}
const btn=(id,label,opts)=>'<button type="button" class="btn'+((opts&&opts.cls)?' '+opts.cls:'')+'" id="'+id+'"'+((opts&&opts.dis)?' disabled':'')+'>'+esc(label)+'</button>';
let demolishArmed=0;
function buildingSheet(b){
  sel={b:b};const D=DEF[b.t],sl=slotsOf(b);
  let h=head(D.name,(D.fixed||D.up?'Level '+(b.t==='th'?thLevel():b.lvl)+' · ':'')+(D.w*D.h>1?(b.w+'×'+b.h+' tiles'):'1 tile'));
  const on=[];
  if(sl){h+='<span class="status '+statusClass(b.status)+'">'+esc(b.status||'Starting')+'</span>';
    assignWorkers();h+='<div class="wk"><button type="button" class="btn small" id="w-minus" aria-label="Fewer workers" '+(b.desired<=0?'disabled':'')+'>−</button><span class="num">'+b.desired+' / '+sl+' <span class="meta">workers</span></span><button type="button" class="btn small" id="w-plus" aria-label="More workers" '+(b.desired>=sl||freeWorkers<=0?'disabled':'')+'>+</button><span class="meta">'+freeWorkers+' free in the village</span></div>';
    h+='<p>'+esc(D.out||'')+(b.made?' · <strong>Yesterday: '+esc(b.made)+'</strong>':'')+'</p>';
    if(D.need){const nc=needCount(b,D.need);h+='<div class="meta">'+esc(nc.label)+'</div>';}
    if(!b.conn&&D.road!==false)h+='<p style="color:#8E3B2F">Connect this building to the Town Hall with a road.</p>';
    on.push(()=>{$('w-minus').onclick=()=>{b.desired=Math.max(0,b.desired-1);assignWorkers();buildingSheet(b);save();};$('w-plus').onclick=()=>{assignWorkers();if(freeWorkers<=0){toast('No free workers. Take someone off another building first.');return;}b.desired=Math.min(sl,b.desired+1);assignWorkers();buildingSheet(b);save();};});
  }
  if(b.t==='smith')h+=smithHtml(b,on);
  if(b.t==='carp'){h+='<div class="wk"><span class="meta">Wood reserve</span><button type="button" class="btn small" id="rv-minus" aria-label="Lower the wood reserve">−10</button><span class="num">'+S.woodReserve+'</span><button type="button" class="btn small" id="rv-plus" aria-label="Raise the wood reserve">+10</button><span class="meta">never sawn</span></div>';
    on.push(()=>{$('rv-minus').onclick=()=>{S.woodReserve=Math.max(0,S.woodReserve-10);buildingSheet(b);save();};$('rv-plus').onclick=()=>{S.woodReserve=Math.min(300,S.woodReserve+10);buildingSheet(b);save();};});}
  if(b.t==='pen'){const hn=herdTotal()*0.4;h+='<table class="t"><tr><td>Pigs</td><td>'+S.herd.pigs+'</td></tr><tr><td>Sheep</td><td>'+S.herd.sheep+'</td></tr><tr><td>Room in the pens</td><td>'+herdCap()+'</td></tr><tr><td>Hay in store</td><td>'+fmt(S.res.hay)+'</td></tr><tr><td>Hay eaten per winter day</td><td>'+hn.toFixed(1)+' ('+fmt(hn*15)+' for a whole winter)</td></tr></table><p>Animals above the pen’s room are slaughtered for 10 meat and a hide each.</p>';}
  if(b.t==='altar')h+=altarHtml(on);
  if(b.t==='train')h+=trainHtml(b,on);
  if(b.t==='thrall')h+='<table class="t"><tr><td>Thralls</td><td>'+S.thralls+' / '+thrallCap()+'</td></tr><tr><td>Treatment</td><td>'+(S.pol.thralls==='harsh'?'Harsh':'Mild')+'</td></tr></table><p>Thralls come from raids (take prisoners) or from merchants. They work like anyone else but cannot be warriors. Set their treatment in Village → Policies.</p>';
  if(DEF[b.t].deco)h+='<div class="meta">Attractiveness +'+DEF[b.t].deco+' (decorations count up to +20 in all)</div>';
  if(NB[b.t]){const nb=nbOf(b);h+='<div class="meta">'+(nb?'+15% from the nearby '+esc(nb):'No '+NB[b.t].map(x=>DEF[x].name.toLowerCase()).join(' or ')+' within 4 tiles (+15% if there were)')+'</div>';}
  if(b.t==='shipyard'){
    if(b.proj){const sp=SHIPS[b.proj.type];h+='<p><strong>Building a '+esc(sp.name)+'</strong> · '+Math.floor(100*b.proj.done/sp.work)+'% ('+Math.ceil((sp.work-b.proj.done)/Math.max(0.5,b.workers*(b.lvl>=2?1.2:1)*prodMult(b)))+' days at this pace)</p>';}
    else{h+='<p>Choose a ship. Materials are paid when the keel is laid; workers then build it day by day.</p>';
      Object.keys(SHIPS).filter(k=>(SHIPS[k].lv||3)<=thLevel()).forEach(k=>{const sp=SHIPS[k],wars=S.ships.filter(s=>s.type!=='knarr').length,built=k==='knarr'?S.ships.filter(s=>s.type==='knarr').length:(wars>=SHIP_CAP_WAR[thLevel()-1]?1:0),dis=built>=1||!afford(shipCost(k));h+='<div class="wk"><button type="button" class="btn small'+(dis?'':' primary')+'" data-ship="'+k+'" '+(dis?'disabled':'')+'>Lay a '+esc(sp.name)+'</button><span class="meta">'+esc(sp.desc)+' · '+esc(costStr(shipCost(k)))+(built?' · limit reached for this level':'')+'</span></div>';});}
    on.push(()=>{$('sheet-card').querySelectorAll('[data-ship]').forEach(x=>x.onclick=()=>{const k=x.dataset.ship;if(!afford(shipCost(k)))return;pay(shipCost(k),1);b.proj={type:k,done:0};toast('The keel of a '+SHIPS[k].name+' is laid.');buildingSheet(b);save();});});}
  if(b.t==='harbour'){h+='<h3>Ships</h3>'+(S.ships.length?'<table class="t">'+S.ships.map(s=>'<tr><td>'+esc(s.name)+' <span class="meta">'+esc(SHIPS[s.type].name)+'</span></td><td>'+(s.away?'At sea':'Moored')+'</td></tr>').join('')+'</table>':'<p>No ships yet. Build one at the shipyard.</p>')+(thLevel()>=3?'<p>Plan raids from the World map.</p>':'');}
  if(b.t==='trade')h+=tradeHtml(b,on);
  if(b.t==='tomb')h+=tombHtml(b,on);
  if(b.t==='tower')h+='<p>Archers at home: '+S.people.filter(p=>p.w==='archer'&&!p.away).length+'. Each tower needs 2 to count.</p>';
  if(b.t==='th'){const q=thReq();h+='<p>'+esc(D.desc)+'</p>'+thExtraHtml(on);
    if(q){h+='<div class="wk"><span class="meta">Keep materials for the next hall</span><div class="prio" role="group"><button type="button" data-sh="1" aria-pressed="'+(S.saveHall!==false)+'">On</button><button type="button" data-sh="0" aria-pressed="'+(S.saveHall===false)+'">Off</button></div><span class="meta">Once every other requirement is met, workshops stop using the wood, planks and iron the hall needs.</span></div>';on.push(()=>{$('sheet-card').querySelectorAll('[data-sh]').forEach(x=>x.onclick=()=>{S.saveHall=x.dataset.sh==='1';buildingSheet(b);save();});});}
    if(q){h+='<h3>Raise to level '+q.lv+'</h3>'+q.items.map(i=>'<div class="ms'+(i.ok?' done':'')+'"><i aria-hidden="true"></i><div>'+esc(i.t)+'</div></div>').join('')+'<div class="acts">'+btn('th-up','Raise the hall to level '+q.lv,{cls:'primary',dis:!q.ok})+'</div>';
      on.push(()=>{$('th-up').onclick=()=>{if(upgradeTH()){closeSheet();save();}};});}
    else h+='<p>The hall stands at its highest level for this update.</p>';
    openSheet(h,'building');on.forEach(f=>f());return;}
  if(D.housing)h+='<div class="meta">Shelters '+(b.t==='house'?HOUSE_CAP[b.lvl-1]:D.housing)+' people'+(b.t==='house'&&b.lvl>=3?' · burns ¾ firewood':'')+'</div>';
  if(D.store)h+='<div class="meta">Storage: '+(D.store.food?(300+150*(b.lvl-1))+' food':D.store.mat?(300+150*(b.lvl-1))+' goods':(60+30*(b.lvl-1))+' weapons')+'</div>';
  h+='<p>'+esc(D.desc)+'</p>';
  if(D.up){const nx=b.lvl+1;if(b.lvl>=5)h+='<div class="meta">Highest level reached.</div>';
    else{const c=upCost(b),need=canUpgrade(b);const eff=b.t==='house'?(nx===2||nx===4?'+1 resident':nx===3?'Better insulated: −25% firewood':'A carved hall: draws newcomers'):D.store?'+150 storage':nx===2?'+20% output':nx===4?'+40% output in all':'+1 worker slot';
      h+='<div class="wk">'+btn('b-up','Upgrade to level '+nx,{cls:'primary',dis:!need||!afford(c)})+'<span class="meta">'+esc(eff)+' · '+esc(costStr(c))+(need?'':' · raise the Town Hall first')+'</span></div>';
      on.push(()=>{$('b-up').onclick=()=>{if(!canUpgrade(b)||!afford(upCost(b)))return;pay(upCost(b),1);b.lvl++;assignWorkers();toast(D.name+' upgraded to level '+b.lvl+'.');buildingSheet(b);save();};});}}
  if(!D.fixed){h+='<div class="acts"><button type="button" class="btn danger" id="b-demo">'+(demolishArmed===b.id?'Tap again to demolish':'Demolish (50% back)')+'</button><button type="button" class="btn" id="b-move">Move</button></div>';
    on.push(()=>{$('b-demo').onclick=()=>{if(demolishArmed!==b.id){demolishArmed=b.id;buildingSheet(b);return;}demolishArmed=0;
        if(D.housing&&housing()-D.housing<S.pop){toast('Not enough room elsewhere for the people living here.');return;}
        pay(b.paid||D.cost,-0.5);B=B.filter(o=>o!==b);rebuildOcc();recomputeConn();assignWorkers();closeSheet();toast(D.name+' demolished. Half the materials returned.');save();};
      $('b-move').onclick=()=>{closeSheet();startPlace(b.t,b);};});}
  openSheet(h,'building');on.forEach(f=>f());
}
let clearArmed=-1;
function tileSheet(x,y){
  sel={x:x,y:y};const tt=ter[y*N+x],zx=Math.floor(x/6),zy=Math.floor(y/6),un=isUnl(x,y),cost=zoneCost(zx,zy);
  const TN={0:'Sea',1:'Beach',2:'Meadow',3:'Forest',4:'Mountains',5:'Foothills',6:'River',7:'Berry bushes',8:'Iron outcrop'};
  const TX={0:'Open water. Fishers, salt works and the harbour work from the shore.',1:'Sand and shingle. Good ground for fishers, the salt works and the harbour.',2:'Open ground for houses, workshops, fields and roads.',3:'Woodcutters fell trees here; hunters stalk game. Felled trees grow back.',4:'The mountains close the land off. Nothing can be built here.',5:'Rocky ground at the foot of the mountains. Mines go here.',6:'Fresh water. Water carriers work from its banks; roads cross it as bridges.',7:'Gatherers pick berries here in summer. Bushes rest in winter.',8:'Iron ore. Place an iron mine within 4 tiles.'};
  let extra='';
  if(tt===T.FOREST){const ts=trees.filter(o=>o.x===x&&o.y===y);if(ts.length){const tr=ts[0];extra=tr.amt>0?'Wood left here: '+fmt(ts.reduce((a,o)=>a+o.amt,0)):'Felled · grows back in '+Math.ceil(tr.regrow)+' days';}}
  if(tt===T.BERRY){const bs=bushes.find(o=>o.x===x&&o.y===y);if(bs)extra='Berries left this summer: '+fmt(bs.amt);}
  let h=head(TN[tt],zoneName(zx,zy)+' · '+(un?'Unlocked':'Locked'))+'<p>'+esc(TX[tt])+'</p>'+(extra?'<div class="meta">'+esc(extra)+'</div>':'');
  const canClear=tt===T.FOREST&&un&&!occ[y*N+x];if(canClear)h+='<h3>Clear the land</h3><p>Fell and uproot these trees for good. You keep half their wood, but nothing grows back here: the tile becomes open meadow for building.</p><div class="acts"><button type="button" class="btn danger" id="t-clear">'+(clearArmed===y*N+x?'Tap again to clear for good':'Clear the trees')+'</button></div>';
  if(!un){const adj=zoneAdj(zx,zy);h+='<div class="acts"><button type="button" class="btn primary" id="z-un" '+(adj&&S.fame>=cost?'':'disabled')+'>Unlock for '+cost+' fame</button></div>'+(!adj?'<div class="meta">Unlock a neighbouring land first.</div>':S.fame<cost?'<div class="meta">You have '+fmt(S.fame)+' fame. Complete saga goals to earn more.</div>':'');}
  openSheet(h,'tile');
  if($('t-clear'))$('t-clear').onclick=()=>{const i=y*N+x;if(clearArmed!==i){clearArmed=i;tileSheet(x,y);return;}clearArmed=-1;const w=clearForest(i,false);const g=addRes('wood',w*0.5);toast('The trees are gone. +'+fmt(g)+' wood. The ground is open for building.');save();tileSheet(x,y);};
  if(!un&&$('z-un'))$('z-un').onclick=()=>{if(S.fame<cost)return;S.fame-=cost;unlocked.add(zx+','+zy);toast(zoneName(zx,zy)+' is now part of Kaldstrand.');save();tileSheet(x,y);};
}

/* ---------- panels ---------- */
let buildCat='Housing';
let newArmed=false;
function renderBuild(){
  let h=head('Build','Construction is instant. Town Hall level '+thLevel()+'.');
  h+='<div class="tabs" role="group" aria-label="Categories">'+CATS.map(c=>'<button type="button" data-cat="'+c+'" aria-pressed="'+(c===buildCat)+'">'+c+'</button>').join('')+'</div><div class="blist">';
  Object.keys(DEF).filter(k=>DEF[k].cat===buildCat).forEach(k=>{const D=DEF[k],av=isAvail(k),lim=limitOf(k),cnt=count(k),uq=cnt>=lim,cst=costOf(k),free=!Object.keys(cst).length&&Object.keys(D.cost).length,ok=av&&!uq&&afford(cst);
    const lock=D.lvl>thLevel()?'Needs Town Hall level '+D.lvl:!av?'Unlocks with: '+(MS.find(m=>m.unlock.includes(k))||{title:'?'}).title:uq?'Limit reached for this level':'';
    h+='<button type="button" class="bcard'+(ok?'':' no')+'" data-b="'+k+'"><b>'+esc(D.name)+'</b>'+(D.lvl<=thLevel()?'<span class="lim">Built '+cnt+' / '+lim+'</span>':'')+'<span>'+D.w+'×'+D.h+(D.slots?' · '+D.slots+' workers':'')+(D.housing?' · '+D.housing+' people':'')+'</span><span class="cost'+(av&&!afford(cst)?' bad':'')+'">'+esc(free?'First one free':costStr(cst))+'</span>'+(lock?'<span>'+esc(lock)+'</span>':'')+'</button>';});
  h+='</div>';openSheet(h,'build');
  $('sheet-card').querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{buildCat=b.dataset.cat;renderBuild();});
  $('sheet-card').querySelectorAll('.bcard').forEach(c=>c.onclick=()=>{const k=c.dataset.b,D=DEF[k];
    if(D.lvl>thLevel()){toast('Raise the Town Hall to level '+D.lvl+' to build this.');return;}
    if(!isAvail(k)){toast('Complete the saga goal "'+(MS.find(m=>m.unlock.includes(k))||{title:''}).title+'" to unlock this.');return;}
    if(count(k)>=limitOf(k)){toast('Limit reached: '+limitOf(k)+' at Town Hall level '+thLevel()+'.');return;}
    if(!afford(costOf(k))){toast('Not enough materials: needs '+costStr(costOf(k))+'.');return;}
    closeSheet();startPlace(k,null);});
}
document.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click',()=>{if(mode!=='view')endMode();if(sheetKind==='panel'&&$('sheet-card').dataset.p===b.dataset.panel){closeSheet();return;}openPanel(b.dataset.panel);$('sheet-card').dataset.p=b.dataset.panel;}));
$('btn-build').addEventListener('click',()=>{if(mode!=='view')endMode();openPanel('build');});
$('btn-road').addEventListener('click',()=>{closeSheet();startRoad();});

/* ---------- modes ---------- */
function setModeBar(msg,bad,buttons){$('modebar').hidden=false;$('fabs').hidden=true;const m=$('mode-msg');m.innerHTML=msg;m.className='msg'+(bad?' bad':'');const a=$('mode-acts');a.innerHTML='';buttons.forEach(bt=>{const e=document.createElement('button');e.type='button';e.className='btn'+(bt.cls?' '+bt.cls:'');e.textContent=bt.label;if(bt.pressed!==undefined)e.setAttribute('aria-pressed',String(bt.pressed));e.disabled=!!bt.disabled;e.onclick=bt.fn;a.appendChild(e);});}
function endMode(){mode='view';place=null;$('modebar').hidden=true;$('fabs').hidden=false;}
function startPlace(t,moving){mode='place';place={t:t,rot:moving?moving.rot:0,moving:moving};
  if(moving){const p=iso(moving.fx+moving.w/2-0.5,moving.fy+moving.h/2-0.5);camX=p[0];camY=p[1];}
  updatePlaceBar();}
let lastPlaceKey='';
function updatePlaceBar(){if(mode!=='place'||!place)return;const D=DEF[place.t],chk=place.chk||{ok:false,why:'Move the map to choose a spot'};
  const key=place.t+place.rot+(chk.ok?1:0)+(chk.why||'')+(chk.label||'');if(key===lastPlaceKey)return;lastPlaceKey=key;
  const msg='<strong>'+esc(D.name)+'</strong> · '+esc(place.moving?'moving (free)':(Object.keys(costOf(place.t)).length?costStr(costOf(place.t)):'free'))+'<br>'+(chk.ok?esc(chk.label||'Drag the map to choose a spot, then place.'):esc(chk.why))+(D.cat!=='Decor'&&!FIELDS.has(place.t)?'<br><span class="meta">Entrance faces '+SIDE_ARROW[place.rot&3]+'. Rotate to turn it to any side.</span>':'');
  setModeBar(msg,!chk.ok,[{label:'Cancel',fn:()=>{endMode();}},{label:'Rotate '+SIDE_ARROW[place.rot&3],fn:()=>{place.rot=((place.rot|0)+1)%4;lastPlaceKey='';}},{label:place.moving?'Move here':'Place',cls:'primary',disabled:!chk.ok,fn:confirmPlace}]);}
function confirmPlace(){if(!place||!place.chk||!place.chk.ok)return;const D=DEF[place.t];
  if(place.moving){const b=place.moving;const d=dims(b.t,place.rot);b.fx=place.fx;b.fy=place.fy;b.rot=place.rot;b.w=d.w;b.h=d.h;rebuildOcc();recomputeConn();assignWorkers();toast(D.name+' moved.');endMode();save();return;}
  const cst=costOf(place.t);if(!afford(cst)){toast('Not enough materials.');endMode();return;}
  pay(cst,1);const b=addBuilding(place.t,place.fx,place.fy,place.rot,false);b.paid=cst;assignWorkers();b.desired=Math.min(slotsOf(b),freeWorkers);assignWorkers();checkMilestones();
  toast(D.name+' built.'+(D.slots&&!b.conn&&D.road!==false?' Connect it with a road.':''));save();
  if(count(place.t)>=limitOf(place.t)||!afford(costOf(place.t)))endMode();else lastPlaceKey='';}
let roadErase=false;
/* roads: tap a start, tap an end, see a ghost of the road, confirm */
let roadA=null,roadPrev=null,roadFail=false,roadHover='';
let roadKind='road';
function startWall(){startRoad();roadKind='wall';roadBar();}
function startRoad(){roadKind='road';mode='road';roadErase=false;roadA=null;roadPrev=null;roadFail=false;roadBar();}
function roadOK(x,y){if(!inMap(x,y))return false;const i=y*N+x;if(roadKind==='wall'){if(roadErase)return !!walls[i];if(walls[i])return true;return !occ[i]&&isUnl(x,y)&&BUILDABLE.has(ter[i]);}
  if(roadErase)return !!roads[i];if(walls[i]===1)return false;if(roads[i])return true;return !occ[i]&&isUnl(x,y)&&(BUILDABLE.has(ter[i])||ter[i]===T.RIVER);}
function roadPath(a,b){if(!roadOK(a[0],a[1])||!roadOK(b[0],b[1]))return null;
  const x0=Math.max(0,Math.min(a[0],b[0])-12),x1=Math.min(N-1,Math.max(a[0],b[0])+12),y0=Math.max(0,Math.min(a[1],b[1])-12),y1=Math.min(N-1,Math.max(a[1],b[1])+12);
  const DX=[1,-1,0,0],DY=[0,0,1,-1],best=new Map(),prev=new Map(),H=[];
  const push=(c,s)=>{H.push([c,s]);let i=H.length-1;while(i>0){const p=(i-1)>>1;if(H[p][0]<=H[i][0])break;const t0=H[p];H[p]=H[i];H[i]=t0;i=p;}};
  const pop=()=>{const top=H[0],last=H.pop();if(H.length){H[0]=last;let i=0;for(;;){const l=2*i+1,r=l+1;let m=i;if(l<H.length&&H[l][0]<H[m][0])m=l;if(r<H.length&&H[r][0]<H[m][0])m=r;if(m===i)break;const t0=H[m];H[m]=H[i];H[i]=t0;i=m;}}return top;};
  const st=(a[1]*N+a[0])*5+4;best.set(st,0);push(0,st);let end=-1;
  while(H.length){const q=pop(),c=q[0],s=q[1];if(c>best.get(s))continue;const i=(s/5)|0,d=s%5,x=i%N,y=(i/N)|0;if(x===b[0]&&y===b[1]){end=s;break;}
    for(let k=0;k<4;k++){const nx=x+DX[k],ny=y+DY[k];if(nx<x0||nx>x1||ny<y0||ny>y1||!roadOK(nx,ny))continue;const ns=(ny*N+nx)*5+k;const nc=c+1+(d!==4&&d!==k?0.7:0);if(nc<(best.has(ns)?best.get(ns):1e9)){best.set(ns,nc);prev.set(ns,s);push(nc,ns);}}}
  if(end<0)return null;const out=[];let s=end;while(s!==undefined){const i=(s/5)|0;out.push([i%N,(i/N)|0]);s=prev.get(s);}return out.reverse();}
function wallCost(){if(!roadPrev)return {};let w=0,pl=0;for(const p of roadPrev){const i=p[1]*N+p[0];if(walls[i])continue;w+=4;if(roads[i])pl+=6;}return pl?{wood:w,planks:pl}:{wood:w};}
function roadBar(){const G=roadKind==='wall'?walls:roads;const n=roadPrev?roadPrev.filter(p=>roadErase?G[p[1]*N+p[0]]:!G[p[1]*N+p[0]]).length:0;
  const bridge=!roadErase&&roadPrev&&roadPrev.some(p=>ter[p[1]*N+p[0]]===T.RIVER&&!roads[p[1]*N+p[0]]);
  const W=roadKind==='wall',wc=W?wallCost():{};
  const msg='<strong>'+(W?(roadErase?'Remove palisade':'Palisade'):(roadErase?'Remove roads':'Roads'))+'</strong> · '+(!roadA?(roadErase?'Tap the start of the stretch to remove.':W?'Tap where the palisade starts. Where it crosses a road, a gate is built.':'Tap where the road starts.')
    :roadFail?'No way through to there. Tap another end point.'
    :!roadPrev?'Now tap where it ends.'
    :(roadErase?n+' tiles will be removed.':W?n+' stakes: '+costStr(wc)+(afford(wc)?'':' (not enough)')+'.':n+' new tiles'+(bridge?', with a bridge':'')+'. Roads are free.')+' Tap elsewhere to move the end.')+(W?' <span class="meta">Palisade: '+(S.wallClosed?'closed':'not closed yet')+'.</span>':'')
    +' <span class="meta">Drag to move the map. Gold dots: not connected to the Town Hall.</span>';
  setModeBar(msg,roadFail,[{label:'Done',fn:()=>{endMode();save();}},{label:roadErase?'Draw':'Erase',fn:()=>{roadErase=!roadErase;roadA=null;roadPrev=null;roadFail=false;roadBar();}},{label:'Clear',disabled:!roadA,fn:()=>{roadA=null;roadPrev=null;roadFail=false;roadBar();}},{label:roadErase?'Remove':W?'Build palisade':'Build road',cls:'primary',disabled:!roadPrev||!n||(W&&!roadErase&&!afford(wc)),fn:confirmRoad}]);}
function roadTarget(t){if(!roadA)return;if(t[0]===roadA[0]&&t[1]===roadA[1]){roadPrev=roadOK(t[0],t[1])?[t]:null;roadFail=false;return;}const p=roadPath(roadA,t);roadFail=!p;roadPrev=p;}
function roadTap(t){if(!inMap(t[0],t[1]))return;
  if(!roadA){if(!roadOK(t[0],t[1])){toast(roadErase?'There is no road there.':'A road cannot go there: '+(!isUnl(t[0],t[1])?'the land is locked.':occ[t[1]*N+t[0]]?'a building stands there.':'the ground is not open.'));return;}roadA=t;roadPrev=null;roadFail=false;roadBar();return;}
  roadTarget(t);roadHover=t[0]+','+t[1];roadBar();}
function roadHoverAt(px,py){if(!roadA)return;const w=s2w(px,py),t=w2t(w[0],w[1]);const k=t[0]+','+t[1];if(k===roadHover||!inMap(t[0],t[1]))return;roadHover=k;roadTarget(t);roadBar();}
function confirmRoad(){if(!roadPrev)return;if(roadKind==='wall'){if(!roadErase){const c=wallCost();if(!afford(c)){toast('Not enough: needs '+costStr(c));return;}pay(c,1);}
    for(const p of roadPrev){const i=p[1]*N+p[0];if(roadErase)walls[i]=0;else if(!walls[i])walls[i]=roads[i]?2:1;}recomputeWalls();const end=roadPrev[roadPrev.length-1];roadPrev=null;roadA=roadErase?null:end;roadFail=false;rebuildOcc();checkMilestones();save();roadBar();return;}
  for(const p of roadPrev){const i=p[1]*N+p[0];if(roadErase)roads[i]=0;else if(roadOK(p[0],p[1]))roads[i]=1;}
  const end=roadPrev[roadPrev.length-1];roadPrev=null;roadA=roadErase?null:end;roadFail=false;recomputeConn();assignWorkers();checkMilestones();save();roadBar();}
function drawRoadGhost(){
  if(roadPrev)for(const p of roadPrev){const i=p[1]*N+p[0];const sx=(p[0]-p[1])*HW,sy=(p[0]+p[1])*HH-(ter[i]===T.RIVER?-2:elev[i]);
    poly([sx,sy-HH*0.78,sx+HW*0.78,sy,sx,sy+HH*0.78,sx-HW*0.78,sy],roadErase?'rgba(163,74,58,0.55)':roads[i]?'rgba(201,166,74,0.28)':ter[i]===T.RIVER?'rgba(138,110,82,0.6)':'rgba(222,200,150,0.62)');}
  const mark=(t,ring)=>{const i=t[1]*N+t[0];const sx=(t[0]-t[1])*HW,sy=(t[0]+t[1])*HH-elev[i];ctx.lineWidth=2.5;ctx.strokeStyle='#2F2620';ctx.fillStyle=ring?'rgba(243,235,216,0.95)':'#C9A64A';ctx.beginPath();ctx.arc(sx,sy,6.5,0,6.3);ctx.fill();ctx.stroke();};
  if(roadA)mark(roadA,false);if(roadPrev&&roadPrev.length>1)mark(roadPrev[roadPrev.length-1],true);}
function paintRoad(x,y){if(!inMap(x,y))return;const i=y*N+x;
  if(roadErase){if(roads[i]){roads[i]=0;roadDirty=true;}return;}
  if(roads[i]||occ[i]||!isUnl(x,y)||!(BUILDABLE.has(ter[i])||ter[i]===T.RIVER))return;roads[i]=1;roadDirty=true;}
let roadDirty=false,lastRoadTile=null;
function paintLine(a,b){let x=a[0],y=a[1];paintRoad(x,y);let guard=0;while((x!==b[0]||y!==b[1])&&guard++<200){if(x!==b[0])x+=Math.sign(b[0]-x);else y+=Math.sign(b[1]-y);paintRoad(x,y);}}

/* ---------- tap ---------- */
function tap(px,py){
  if(titleOn||modalOpen)return;
  {const w0=s2w(px,py);if(mode==='view'){for(const h of SHIP_HITS){if(Math.hypot(w0[0]-h[0],w0[1]-(h[1]-4))<34){if(thLevel()>=3)worldPanel();else{const hb=B.find(b=>b.t==='harbour');if(hb)buildingSheet(hb);}return;}}}}
  const w=s2w(px,py),tt=w2t(w[0],w[1]);
  if(mode==='place'){camX=w[0];camY=w[1];clampCam();return;}
  if(mode==='road'){roadTap(tt);return;}
  for(let k=0;k<4;k++){const x=tt[0]+k,y=tt[1]+k;if(!inMap(x,y))continue;const id=occ[y*N+x];if(id){const b=B.find(o=>o.id===id);if(b){demolishArmed=0;buildingSheet(b);return;}}}
  if(!inMap(tt[0],tt[1])){closeSheet();return;}
  tileSheet(tt[0],tt[1]);
}

/* ---------- input ---------- */
const pts=new Map();let down=null,pinch=null,painting=false;
const mid=(a,b)=>[(a.x+b.x)/2,(a.y+b.y)/2],dst=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
let panPtr=null,panLast=null;
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0){cv.setPointerCapture(e.pointerId);panPtr=e.pointerId;panLast={x:e.clientX,y:e.clientY};return;}
  cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pts.size===1){down={x:e.clientX,y:e.clientY,moved:false};
}
  else if(pts.size===2){painting=false;const v=[...pts.values()],m=mid(v[0],v[1]);pinch={d:dst(v[0],v[1]),z:zoom,w:s2w(m[0],m[1])};if(down)down.moved=true;}});
cv.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&!pts.size&&panPtr===null&&mode==='road'){roadHoverAt(e.clientX,e.clientY);return;}if(e.pointerId===panPtr&&panLast){camX-=(e.clientX-panLast.x)/zoom;camY-=(e.clientY-panLast.y)/zoom;panLast={x:e.clientX,y:e.clientY};clampCam();return;}const p=pts.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
  if(pts.size===1&&!pinch){if(painting){const w=s2w(e.clientX,e.clientY),tl=w2t(w[0],w[1]);if(!lastRoadTile||tl[0]!==lastRoadTile[0]||tl[1]!==lastRoadTile[1]){paintLine(lastRoadTile||tl,tl);lastRoadTile=tl;}if(down)down.moved=true;return;}
    camX-=dx/zoom;camY-=dy/zoom;clampCam();if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>8)down.moved=true;}
  else if(pts.size===2&&pinch){const v=[...pts.values()],m=mid(v[0],v[1]);zoom=Math.max(ZMIN,Math.min(ZMAX,pinch.z*dst(v[0],v[1])/pinch.d));camX=pinch.w[0]-(m[0]-W/2)/zoom;camY=pinch.w[1]-(m[1]-H/2)/zoom;clampCam();}});
function onUp(e){if(e.pointerId===panPtr){panPtr=null;panLast=null;return;}const had=pts.has(e.pointerId);pts.delete(e.pointerId);if(!had)return;
  if(pts.size===0){if(down&&!down.moved)tap(e.clientX,e.clientY);down=null;pinch=null;
    if(painting){painting=false;lastRoadTile=null;if(roadDirty){roadDirty=false;recomputeConn();assignWorkers();checkMilestones();}}}
  else if(pts.size===1){pinch=null;if(down)down.moved=true;}}
cv.addEventListener("pointerup",onUp);cv.addEventListener("pointercancel",onUp);
cv.addEventListener('wheel',e=>{e.preventDefault();const w=s2w(e.clientX,e.clientY);zoom=Math.max(ZMIN,Math.min(ZMAX,zoom*Math.exp(-e.deltaY*0.0015)));camX=w[0]-(e.clientX-W/2)/zoom;camY=w[1]-(e.clientY-H/2)/zoom;clampCam();},{passive:false});
