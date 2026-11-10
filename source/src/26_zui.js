/* =================== game UI: dock, build tray, hover, suggested actions =================== */
const isWide=()=>innerWidth>=900;

/* --- building thumbnails, drawn once with the real renderer --- */
const THUMBS={};
function buildThumb(t,lvl){const key=t+':'+(lvl||1);if(THUMBS[key])return THUMBS[key];
  /* draw big on a scratch canvas, find the drawn pixels, then fit and centre them in the card picture */
  const D=DEF[t],w=D.w,h=D.h,cw=150,ch=112,k=2,G=900,pad=8;
  const g=document.createElement('canvas');g.width=G;g.height=G;const gc=g.getContext('2d');
  const fake={id:900000+Object.keys(THUMBS).length,t:t,fx:0,fy:0,w:w,h:h,rot:0,lvl:lvl||1,desired:0,workers:0,anvil:100,mode:'tools',proj:t==='tomb'?{done:0}:null,status:'',thumb:1};
  const cx=iso((w-1)/2,(h-1)/2),e0=elev[0]||2,sc=Math.min(1.6,560/((w+h)*HW));
  const prev=ctx,pz=zoom;ctx=gc;zoom=1.2;
  try{gc.setTransform(sc,0,0,sc,G/2-sc*cx[0],G*0.62-sc*(cx[1]-e0));drawGround(fake,false);drawBuilding(fake,false,1,false);}catch(err){}
  ctx=prev;zoom=pz;
  let x0=G,y0=G,x1=0,y1=0;try{const d=gc.getImageData(0,0,G,G).data;for(let y=0;y<G;y+=2)for(let x=0;x<G;x+=2){if(d[(y*G+x)*4+3]>70){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}}}catch(err){x0=0;y0=0;x1=G;y1=G;}
  if(x1<=x0){x0=0;y0=0;x1=G;y1=G;}
  const bw=x1-x0+2,bh=y1-y0+2,f=Math.min((cw*k-2*pad*k)/bw,(ch*k-2*pad*k)/bh,2.2);
  const c=document.createElement('canvas');c.width=cw*k;c.height=ch*k;const tc=c.getContext('2d');
  const dw=bw*f,dh=bh*f;tc.drawImage(g,x0,y0,bw,bh,(cw*k-dw)/2,(ch*k-dh)/2+2,dw,dh);
  return THUMBS[key]=c.toDataURL();}

/* --- category icons --- */
const CAT_ICON={
  Housing:'<path d="M3 11 L10 4 L17 11 M5 10 V16 H15 V10" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  Resources:'<path d="M4 16 L10 6 L16 16 Z M8 12 h4" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  Food:'<path d="M5 9 Q10 18 15 9 Z M7 9 Q7 4 10 4 Q13 4 13 9" stroke="currentColor" stroke-width="1.8" fill="none"/>',
  Farms:'<path d="M3 15 Q10 9 17 15 M6 13 V7 M10 11 V5 M14 13 V7" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  Storage:'<path d="M4 8 L10 5 L16 8 V15 L10 18 L4 15 Z M4 8 L10 11 L16 8 M10 11 V18" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/>',
  Village:'<path d="M10 3 V17 M5 7 Q10 4 15 7 M6 17 H14" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  War:'<path d="M5 15 L15 5 M12 5 H15 V8 M15 15 L5 5 M8 5 H5 V8" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  Sea:'<path d="M3 13 Q10 18 17 13 L15 11 H5 Z M10 11 V3 L15 8 H10" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/>',
  Decor:'<path d="M10 3 L12 8 L17 8 L13 11 L15 16 L10 13 L5 16 L7 11 L3 8 L8 8 Z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>',
  Roads:'<path d="M6 17 L9 3 M14 17 L11 3 M10 6 V7.5 M10 10.5 V12 M10 15 V16.5" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>'};
const ico=(k,sz)=>'<svg width="'+(sz||20)+'" height="'+(sz||20)+'" viewBox="0 0 20 20" aria-hidden="true">'+(CAT_ICON[k]||'')+'</svg>';

/* --- the dock (PC): panels on the left, build categories and roads on the right --- */
let trayCat=null;
function renderDock(){let d=$('dock');if(!d){d=document.createElement('div');d.id='dock';d.className='dock';document.body.appendChild(d);const tr=document.createElement('div');tr.id='tray';tr.className='tray';tr.hidden=true;document.body.appendChild(tr);}
  const navs=[...document.querySelectorAll('.nav button')].map(b=>'<button type="button" class="dk'+(b.classList.contains('locked')?' locked':'')+'" data-dp="'+b.dataset.panel+'">'+b.innerHTML+'</button>').join('');
  const cats=CATS.map(c=>{const any=Object.keys(DEF).some(k=>DEF[k].cat===c&&DEF[k].lvl<=thLevel());return '<button type="button" class="dk cat'+(trayCat===c?' on':'')+(any?'':' locked')+'" data-dc="'+c+'">'+ico(c)+'<span>'+c+'</span></button>';}).join('');
  d.innerHTML='<div class="dgrp">'+navs+'</div><div class="dsep"></div><div class="dgrp">'+cats+'</div><div class="dsep"></div><div class="dgrp"><button type="button" class="dk'+(mode==='road'&&roadKind==='road'?' on':'')+'" id="dk-road">'+ico('Roads')+'<span>Roads</span></button>'+(thLevel()>=5?'<button type="button" class="dk'+(mode==='road'&&roadKind==='wall'?' on':'')+'" id="dk-wall">'+ico('War')+'<span>Palisade</span></button>':'')+'</div>';
  d.querySelectorAll('[data-dp]').forEach(b=>b.onclick=()=>{closeTray();const nb=document.querySelector('.nav button[data-panel="'+b.dataset.dp+'"]');if(nb)nb.click();});
  d.querySelectorAll('[data-dc]').forEach(b=>b.onclick=()=>{if(mode!=='view')endMode();closeSheet();if(trayCat===b.dataset.dc){closeTray();return;}openTray(b.dataset.dc);});
  $('dk-road').onclick=()=>{closeTray();closeSheet();if(mode==='road'&&roadKind==='road'){endMode();}else startRoad();renderDock();};
  if($('dk-wall'))$('dk-wall').onclick=()=>{closeTray();closeSheet();startWall();renderDock();};}
function closeTray(){trayCat=null;const t=$('tray');if(t)t.hidden=true;if($('dock'))$('dock').querySelectorAll('.cat').forEach(b=>b.classList.remove('on'));}
function openTray(cat){trayCat=cat;buildCat=cat;const tr=$('tray');
  const keys=Object.keys(DEF).filter(k=>DEF[k].cat===cat);
  let h='<div class="trh"><b>'+esc(cat)+'</b><span>Town Hall level '+thLevel()+' · click a building, then choose its spot</span><button type="button" class="x" id="tray-x" aria-label="Close">×</button></div><div class="trl">';
  for(const k of keys){const D=DEF[k],av=isAvail(k),lim=limitOf(k),cnt=count(k),uq=cnt>=lim,cst=costOf(k),free=!Object.keys(cst).length&&Object.keys(D.cost).length,ok=av&&!uq&&afford(cst)&&D.lvl<=thLevel();
    const lock=D.lvl>thLevel()?'Town Hall '+D.lvl:!av?'Saga: '+(MS.find(m=>m.unlock.includes(k))||{title:'?'}).title:uq?'Limit reached':'';
    h+='<button type="button" class="tcard'+(ok?'':' no')+(lock?' lk':'')+'" data-b="'+k+'" title="'+esc(D.desc||'')+'"><img alt="" src="'+buildThumb(k,1)+'"><b>'+esc(D.name)+'</b><span class="tc2">'+(D.lvl<=thLevel()?cnt+' / '+lim:'')+(D.slots?' · '+D.slots+' workers':'')+(D.housing?' · '+D.housing+' people':'')+'</span><span class="cost'+(av&&!afford(cst)?' bad':'')+'">'+esc(lock||(free?'First one free':costStr(cst)))+'</span></button>';}
  tr.innerHTML=h+'</div>';tr.hidden=false;
  $('tray-x').onclick=closeTray;
  tr.querySelectorAll('.tcard').forEach(c=>c.onclick=()=>{const k=c.dataset.b,D=DEF[k];
    if(D.lvl>thLevel()){toast('Raise the Town Hall to level '+D.lvl+' to build this.');return;}
    if(!isAvail(k)){toast('Complete the saga goal "'+(MS.find(m=>m.unlock.includes(k))||{title:''}).title+'" to unlock this.');return;}
    if(count(k)>=limitOf(k)){toast('Limit reached: '+limitOf(k)+' at Town Hall level '+thLevel()+'.');return;}
    if(!afford(costOf(k))){toast('Not enough materials: needs '+costStr(costOf(k))+'.');return;}
    closeTray();startPlace(k,null);});
  if($('dock'))$('dock').querySelectorAll('.cat').forEach(b=>b.classList.toggle('on',b.dataset.dc===cat));}

/* --- hover: buildings light up under the mouse and show their name --- */
let HOVER_B=null;
function buildingAt(px,py){const w=s2w(px,py),tt=w2t(w[0],w[1]);for(let k=0;k<4;k++){const x=tt[0]+k,y=tt[1]+k;if(!inMap(x,y))continue;const id=occ[y*N+x];if(id){const b=B.find(o=>o.id===id);if(b)return b;}}return null;}
function hoverAt(px,py){if(mode!=='view'||titleOn||modalOpen){setHover(null);return;}setHover(buildingAt(px,py),px,py);}
function setHover(b,px,py){HOVER_B=b;const tip=$('htip');cv.style.cursor=b?'pointer':'';if(!tip)return;if(!b){tip.hidden=true;return;}
  const D=DEF[b.t];tip.innerHTML='<b>'+esc(b.t==='th'?'Town Hall':D.name)+'</b>'+(D.up||b.t==='th'?' <span>level '+(b.t==='th'?thLevel():b.lvl)+'</span>':'')+(slotsOf(b)?'<em>'+b.workers+'/'+slotsOf(b)+' workers'+(b.status&&b.status!=='Working'?' · '+esc(b.status):'')+'</em>':'');
  tip.hidden=false;tip.style.left=Math.min(innerWidth-260,px+16)+'px';tip.style.top=(py+18)+'px';}
function drawHover(){const b=HOVER_B;if(!b||mode!=='view')return;const c=fp(b),e=elev[b.fy*N+b.fx]||2;
  ctx.save();ctx.translate(0,-e);ctx.strokeStyle='rgba(255,236,170,0.95)';ctx.lineWidth=2.4/zoom+0.6;ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(c.T[0],c.T[1]);ctx.lineTo(c.R[0],c.R[1]);ctx.lineTo(c.Bt[0],c.Bt[1]);ctx.lineTo(c.L[0],c.L[1]);ctx.closePath();ctx.stroke();
  ctx.fillStyle='rgba(255,236,170,0.12)';ctx.fill();ctx.restore();}
{const tip=document.createElement('div');tip.id='htip';tip.className='htip';tip.hidden=true;document.body.appendChild(tip);}
cv.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&!e.buttons)hoverAt(e.clientX,e.clientY);});
cv.addEventListener('pointerleave',()=>setHover(null));
cv.addEventListener('pointerdown',()=>{const t=$('htip');if(t)t.hidden=true;});

/* --- suggested actions: what needs doing, one click to get there --- */
function focusOn(b,open){const p=iso(b.fx+b.w/2-0.5,b.fy+b.h/2-0.5);camX=p[0];camY=p[1]-(isWide()?0:60);zoom=Math.max(zoom,0.9);clampCam();if(open)buildingSheet(b);}
function canBuildNow(k){return DEF[k]&&DEF[k].lvl<=thLevel()&&isAvail(k)&&count(k)<limitOf(k)&&afford(costOf(k));}
function placeType(k){closeSheet();closeTray();if(!canBuildNow(k)){const D=DEF[k];toast(count(k)>=limitOf(k)?'Limit reached for '+D.name.toLowerCase()+'.':'Not enough materials for a '+D.name.toLowerCase()+': '+costStr(costOf(k))+'.');return;}startPlace(k,null);}
function suggestions(){const out=[],r=S.res,win=isWinter();
  const th=B.find(b=>b.t==='th');const q=thReq();
  if(q&&q.ok)out.push({p:0,ic:'Village',t:'The Town Hall can be raised to level '+q.lv,go:()=>focusOn(th,true),cls:'good'});
  /* shortages */
  const ed=eatNeed(),fd=foodUnits()/Math.max(1,ed);
  if(fd<6)out.push({p:1,ic:'Food',t:'Food for only '+Math.floor(fd)+' days',sub:'Put more people on fishers, hunters or berries',go:()=>{const b=B.find(b=>['fish','berry','hunter','garden'].includes(b.t)&&b.workers<slotsOf(b));if(b)focusOn(b,true);else placeType(has('fish')?'berry':'fish');},cls:'bad'});
  if(win&&r.wood<fireNeed()*4)out.push({p:1,ic:'Resources',t:'Firewood for only '+Math.floor(r.wood/Math.max(1,fireNeed()))+' days',go:()=>{const b=B.find(b=>b.t==='wood'&&b.workers<slotsOf(b));if(b)focusOn(b,true);else placeType('wood');},cls:'bad'});
  {const fr=housing()-S.pop;if(fr<=1&&canBuildNow('house'))out.push({p:2,ic:'Housing',t:fr<=0?'Every bed is taken':'Only 1 bed left',sub:fr<=0?'Build a house so newcomers can stay':'Build a house so more newcomers can stay',go:()=>placeType('house')});}
  if(freeWorkers>0)out.push({p:2,ic:'Village',t:freeWorkers+' '+(freeWorkers>1?'people have':'person has')+' no work',sub:'Open the work overview',go:()=>openPanel('village')});
  /* buildings in trouble */
  const bad=B.filter(b=>slotsOf(b)&&b.status&&!(b.status==='Working'||b.status==='Drawing newcomers'||b.status.indexOf('Resting')===0||b.status.indexOf('Holding')===0||b.status==='Paused'));
  for(const b of bad.slice(0,3))out.push({p:3,ic:DEF[b.t].cat,t:DEF[b.t].name+': '+b.status,go:()=>focusOn(b,true),cls:'warn'});
  /* the saga goal */
  const g=currentGoal();if(g){const lo=g.goal.toLowerCase();const want=Object.keys(DEF).filter(k=>k!=='th'&&(lo.indexOf(DEF[k].name.toLowerCase().replace('’',"'"))>=0||lo.indexOf(DEF[k].name.toLowerCase())>=0)).filter(k=>!has(k));
    out.push({p:4,ic:'Decor',t:g.title,sub:g.goal,go:()=>{if(want.length)placeType(want[0]);else openPanel('saga');}});}
  if(q&&!q.ok&&!out.some(o=>o.p===0)){const miss=q.items.filter(i=>!i.ok);if(miss.length)out.push({p:5,ic:'Village',t:'Next Town Hall: '+miss.length+' thing'+(miss.length>1?'s':'')+' left',sub:miss[0].t,go:()=>focusOn(th,true)});}
  if(thLevel()>=3&&S.ships.some(s=>!s.away)&&S.warriors>=5&&!S.raids.length&&!canRaid())out.push({p:6,ic:'Sea',t:'Ships and warriors are ready to sail',go:()=>worldPanel()});
  return out.sort((a,b)=>a.p-b.p).slice(0,6);}
let todoOpen=innerWidth>=900,todoKey='';
function renderTodo(){let el=$('todo');if(!el){el=document.createElement('div');el.id='todo';el.className='todo';document.querySelector('.side').appendChild(el);}
  if(titleOn){el.hidden=true;return;}el.hidden=false;
  const L=suggestions();const key=todoOpen+'|'+L.map(o=>o.t+(o.sub||'')).join('|');if(key===todoKey)return;todoKey=key;
  el.innerHTML='<button type="button" class="tdh" id="todo-h" aria-expanded="'+todoOpen+'"><b>To do</b><span>'+L.length+'</span></button>'+(todoOpen?'<div class="tdl">'+L.map((o,i)=>'<button type="button" class="td '+(o.cls||'')+'" data-td="'+i+'">'+ico(o.ic,16)+'<span><b>'+esc(o.t)+'</b>'+(o.sub?'<em>'+esc(o.sub)+'</em>':'')+'</span></button>').join('')+'</div>':'');
  $('todo-h').onclick=()=>{todoOpen=!todoOpen;todoKey='';renderTodo();};
  el.querySelectorAll('[data-td]').forEach(b=>b.onclick=()=>{const o=L[+b.dataset.td];if(mode!=='view')endMode();o.go();todoKey='';});}
setInterval(()=>{try{renderTodo();if(isWide()&&!$('dock'))renderDock();if($('dock')){const lv=thLevel();if(renderDock.lv!==lv||renderDock.m!==mode+roadKind){renderDock.lv=lv;renderDock.m=mode+roadKind;renderDock();}}}catch(e){}},700);
window.addEventListener('resize',()=>{if(isWide())renderDock();});
