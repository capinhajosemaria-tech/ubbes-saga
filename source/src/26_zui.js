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
  Homes:'<path d="M2 10.5 L10 4 L18 10.5 L16.6 11.2 L10 6 L3.4 11.2 Z" fill="#6E8B4E" stroke="#4D6438" stroke-width="0.6" stroke-linejoin="round"/><path d="M4 10.4 L10 5.8 L16 10.4 V17 H4 Z" fill="#B08A62" stroke="#6E5440" stroke-width="0.7"/><path d="M4 13 H16 M4 15 H16" stroke="#8E6F52" stroke-width="0.5"/><rect x="8.4" y="12" width="3.2" height="5" rx="1.4" fill="#4A3828"/><path d="M13.5 3 V6.4" stroke="#8E877D" stroke-width="1.4"/><path d="M13 2.4 Q14.6 1 13.8 0" stroke="#C9C2B2" stroke-width="0.8" fill="none"/>',
  Materials:'<path d="M2 15 L13 9 L15 12.6 L4 18.6 Z" fill="#8E6F52" stroke="#5A4636" stroke-width="0.6"/><ellipse cx="14" cy="10.8" rx="1.6" ry="2" transform="rotate(-28 14 10.8)" fill="#D8B98A" stroke="#7A5D44" stroke-width="0.6"/><path d="M6.4 13.2 L13.6 2.4" stroke="#7A5D44" stroke-width="1.6" stroke-linecap="round"/><path d="M11.2 3.2 Q13 0.4 16.4 2 L14.6 6 Q13 4.4 11.2 5.6 Z" fill="#B7BCBF" stroke="#5E6468" stroke-width="0.6"/>',
  Food:'<path d="M1.6 10 Q6 4.4 12.6 7.4 L17.6 4 L16.6 10 L18 15.4 L12.6 12.4 Q6 15.6 1.6 10 Z" fill="#9FB4BC" stroke="#5E7F8C" stroke-width="0.8" stroke-linejoin="round"/><path d="M7.6 6.8 Q9 10 7.6 13.2" stroke="#5E7F8C" stroke-width="0.7" fill="none"/><circle cx="4.6" cy="9.2" r="0.9" fill="#263035"/><path d="M9.6 9.4 L11.4 10.4 M10 11.2 L11.2 11.6" stroke="#C9D6DA" stroke-width="0.6"/>',
  Farms:'<path d="M10 18 V7 M10 18 L6 8 M10 18 L14 8 M10 18 L3.6 10.4 M10 18 L16.4 10.4" stroke="#B08A3E" stroke-width="1.1" stroke-linecap="round"/><ellipse cx="10" cy="5" rx="1.4" ry="2.8" fill="#D9B45A"/><ellipse cx="5.6" cy="6.4" rx="1.2" ry="2.4" transform="rotate(-22 5.6 6.4)" fill="#D9B45A"/><ellipse cx="14.4" cy="6.4" rx="1.2" ry="2.4" transform="rotate(22 14.4 6.4)" fill="#D9B45A"/><ellipse cx="3" cy="9.2" rx="1" ry="2" transform="rotate(-45 3 9.2)" fill="#C9A64A"/><ellipse cx="17" cy="9.2" rx="1" ry="2" transform="rotate(45 17 9.2)" fill="#C9A64A"/><path d="M6.6 14 H13.4" stroke="#8E5A2E" stroke-width="1.6"/>',
  Storage:'<path d="M4.4 3.6 H15.6 Q17.4 10 15.6 16.4 H4.4 Q2.6 10 4.4 3.6 Z" fill="#A9825A" stroke="#5A4636" stroke-width="0.7"/><path d="M3.4 6.6 H16.6 M3.2 13.4 H16.8" stroke="#5E6468" stroke-width="1.4"/><path d="M7.6 3.8 Q6.8 10 7.6 16.2 M12.4 3.8 Q13.2 10 12.4 16.2" stroke="#8E6F52" stroke-width="0.6" fill="none"/><ellipse cx="10" cy="3.6" rx="5.6" ry="1.2" fill="#C9A87A" stroke="#5A4636" stroke-width="0.6"/>',
  Village:'<path d="M1 11 Q10 4.4 19 11 L17.4 11.6 Q10 6.6 2.6 11.6 Z" fill="#6E8B4E" stroke="#4D6438" stroke-width="0.6"/><path d="M2.6 11.4 Q10 6.6 17.4 11.4 V17 H2.6 Z" fill="#9C7A54" stroke="#5A4636" stroke-width="0.7"/><rect x="8.4" y="12.4" width="3.2" height="4.6" fill="#4A3828"/><path d="M1.6 9.6 Q0.6 7.6 2.4 6.6 M18.4 9.6 Q19.4 7.6 17.6 6.6" stroke="#5A4636" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M4.4 13.6 H7 M13 13.6 H15.6" stroke="#C9A64A" stroke-width="0.9"/>',
  War:'<path d="M14.6 2 L16 3.4 L7 12.4 L5.6 11 Z" fill="#C3C8CC" stroke="#5E6468" stroke-width="0.6"/><path d="M4 10 L8 14 M3.2 15 L5 16.8" stroke="#7A5D44" stroke-width="1.6" stroke-linecap="round"/><circle cx="12.6" cy="12.6" r="5.8" fill="#A34A3A" stroke="#5A4636" stroke-width="0.8"/><path d="M12.6 6.8 V18.4 M6.8 12.6 H18.4" stroke="#E9E2D0" stroke-width="1.3"/><circle cx="12.6" cy="12.6" r="1.8" fill="#B7BCBF" stroke="#5E6468" stroke-width="0.6"/>',
  Sea:'<path d="M1.6 12.6 Q10 16.4 18.4 12.6 L16.4 16.4 Q10 18.4 3.6 16.4 Z" fill="#8E6F52" stroke="#5A4636" stroke-width="0.7"/><path d="M1.6 12.6 Q0.6 10.6 2 9.4 M18.4 12.6 Q19.4 10.6 18 9.4" stroke="#5A4636" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M10 13.4 V1.6" stroke="#5A4636" stroke-width="0.9"/><path d="M4.6 3 H15.4 V11 Q10 9.8 4.6 11 Z" fill="#E9E2D0" stroke="#8E877D" stroke-width="0.6"/><path d="M6.4 3 V10.6 M10 3 V10.2 M13.6 3 V10.6" stroke="#A34A3A" stroke-width="1.6"/>',
  Decor:'<path d="M6.4 18 L7 4 Q10 1.6 13 4 L13.6 18 Z" fill="#9AA0A4" stroke="#5E6468" stroke-width="0.7"/><path d="M10 5.4 V13 M10 7 L12 5.4 M10 9.4 L8 7.8 M10 11.4 L12 9.8" stroke="#A34A3A" stroke-width="0.9" fill="none" stroke-linecap="round"/><path d="M2 18 Q3.4 14.6 4.6 18 M15.4 18 Q16.6 14.6 18 18" stroke="#5E7A4E" stroke-width="1.2" fill="none"/><circle cx="3.4" cy="14.6" r="1.1" fill="#D9A55A"/><circle cx="16.6" cy="14.6" r="1.1" fill="#C98AA0"/>',
  Roads:'<path d="M3 18.6 L8.4 2 H11.6 L17 18.6 Z" fill="#C5B28C" stroke="#8E7A58" stroke-width="0.7"/><path d="M10 4 V6 M10 8.6 V11 M10 13.6 V16.4" stroke="#F1E7D2" stroke-width="1.2" stroke-linecap="round"/><path d="M1 18.6 Q2 15 3.4 13 M19 18.6 Q18 15 16.6 13" stroke="#5E7A4E" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
  Palisade:'<path d="M2.6 18 V6 L4 3.6 L5.4 6 V18 Z M7.4 18 V5 L8.8 2.6 L10.2 5 V18 Z M12.2 18 V6 L13.6 3.6 L15 6 V18 Z" fill="#9C7A54" stroke="#5A4636" stroke-width="0.6"/><path d="M15.6 18 V7 L17 4.6 L18.4 7 V18 Z" fill="#8E6F52" stroke="#5A4636" stroke-width="0.6"/><path d="M1.6 9 H19.2 M1.6 14 H19.2" stroke="#6B503A" stroke-width="1.1"/>'};
/* explicit colour icons for the panel buttons in the PC dock */
const PANEL_ICON={village:CAT_ICON.Village,
  people:'<circle cx="13.4" cy="5.4" r="2.6" fill="#E3C9A6"/><path d="M11 4.4 Q13.4 1.6 15.8 4.4" fill="#C9A64A"/><path d="M8.6 17.6 Q9 9.4 13.4 9.4 Q17.8 9.4 18.4 17.6 Z" fill="#5E7F8C"/><circle cx="6.8" cy="6.4" r="3" fill="#E3C9A6"/><path d="M3.8 6 Q4 2.8 6.8 2.8 Q9.6 2.8 9.8 6 Q8.4 4.6 6.8 4.8 Q5 4.6 3.8 6 Z" fill="#8E5A2E"/><path d="M1.2 18.4 Q1.8 10.8 6.8 10.8 Q11.8 10.8 12.4 18.4 Z" fill="#A34A3A"/><path d="M6.8 10.8 V14" stroke="#C9A64A" stroke-width="1"/>',
  war:CAT_ICON.War,
  world:'<rect x="1.6" y="2.6" width="16.8" height="14.8" rx="1" fill="#E3D3AE" stroke="#8E6F52" stroke-width="0.8"/><path d="M1.6 2.6 Q0.4 4 1.6 5.4 M18.4 14.6 Q19.6 16 18.4 17.4" stroke="#8E6F52" stroke-width="0.8" fill="none"/><path d="M4 6 Q6 4.4 7.6 6.4 Q7 9.6 5 10.4 Q3.6 8.6 4 6 Z M11 9 Q14 7.4 16 9.6 Q15.4 13.6 12.4 14.4 Q10.4 12 11 9 Z" fill="#9AAE7E" stroke="#5E7A4E" stroke-width="0.5"/><path d="M6 12.6 Q9 15.6 12.4 11.4" stroke="#A34A3A" stroke-width="0.9" stroke-dasharray="1.4 1" fill="none"/><path d="M13.2 4.4 L15.4 6.6 M15.4 4.4 L13.2 6.6" stroke="#A34A3A" stroke-width="1.1"/>',
  saga:'<path d="M3.4 3.4 H14.6 V16.6 H3.4 Z" fill="#E9DDC0" stroke="#8E6F52" stroke-width="0.8"/><path d="M2.4 2.4 Q3.4 1.4 4.4 2.4 V4.4 H2.4 Z M2.4 15.6 H4.4 V17.6 Q3.4 18.6 2.4 17.6 Z" fill="#B08A62"/><path d="M5.6 6.4 H12.4 M5.6 8.8 H12.4 M5.6 11.2 H10.4" stroke="#8E7A58" stroke-width="0.8"/><path d="M17.6 2 L11.6 13.6 L10.8 15.4 L12.4 14.2 L18.6 2.6 Z" fill="#E9E2D0" stroke="#5A4636" stroke-width="0.6"/>'};
CAT_ICON.Housing=CAT_ICON.Homes;CAT_ICON.Community=CAT_ICON.Village;CAT_ICON.Military=CAT_ICON.War;CAT_ICON.Resources=CAT_ICON.Materials;
CAT_ICON.Crafts='<path d="M3 9.6 H14.6 Q17.6 9.6 18 7.6 H11.4 V6 H3 Z" fill="#6E7478" stroke="#3E4448" stroke-width="0.7" stroke-linejoin="round"/><path d="M7 9.6 L6 14.6 H12 L11 9.6 Z" fill="#5A6064" stroke="#3E4448" stroke-width="0.6"/><path d="M4.4 14.6 H13.6 V17.4 H4.4 Z" fill="#8E6F52" stroke="#5A4636" stroke-width="0.6"/><path d="M13.4 1.6 L17.8 4.4 L16.8 5.8 L12.4 3 Z" fill="#A9AFB3" stroke="#3E4448" stroke-width="0.5"/><path d="M14.8 3.6 L11 9" stroke="#8E6F52" stroke-width="1.4" stroke-linecap="round"/>';
const ico=(k,sz)=>'<svg width="'+(sz||20)+'" height="'+(sz||20)+'" viewBox="0 0 20 20" aria-hidden="true">'+(CAT_ICON[k]||'')+'</svg>';

/* --- the dock (PC): panels on the left, build categories and roads on the right --- */
let trayCat=null;
function renderDock(){let d=$('dock');if(!d){d=document.createElement('div');d.id='dock';d.className='dock';document.body.appendChild(d);const tr=document.createElement('div');tr.id='tray';tr.className='tray';tr.hidden=true;document.body.appendChild(tr);}
  const navs=[...document.querySelectorAll('.nav button')].map(b=>{const pi=PANEL_ICON[b.dataset.panel];return '<button type="button" class="dk'+(b.classList.contains('locked')?' locked':'')+'" data-dp="'+b.dataset.panel+'">'+(pi?'<svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true">'+pi+'</svg>'+esc(b.textContent.trim()):b.innerHTML)+'</button>';}).join('');
  const cats=CATS.map(c=>{const any=Object.keys(DEF).some(k=>DEF[k].cat===c&&DEF[k].lvl<=thLevel());return '<button type="button" class="dk cat'+(trayCat===c?' on':'')+(any?'':' locked')+'" data-dc="'+c+'">'+ico(c)+'<span>'+c+'</span></button>';}).join('');
  d.innerHTML='<div class="dgrp">'+navs+'</div><div class="dsep"></div><div class="dgrp">'+cats+'</div><div class="dsep"></div><div class="dgrp"><button type="button" class="dk'+(mode==='road'&&roadKind==='road'?' on':'')+'" id="dk-road">'+ico('Roads')+'<span>Roads</span></button>'+(thLevel()>=5?'<button type="button" class="dk'+(mode==='road'&&roadKind==='wall'?' on':'')+'" id="dk-wall">'+ico('Palisade')+'<span>Palisade</span></button>':'')+'</div>';
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
    h+='<button type="button" class="tcard'+(ok?'':' no')+(lock?' lk':'')+'" data-b="'+k+'" title="'+esc((D.desc||'')+(needsOf(k).length?' Needs: '+needsOf(k).join(', ')+'.':''))+'"><img alt="" src="'+buildThumb(k,1)+'"><b>'+esc(D.name)+'</b><span class="tc3">'+esc(roleOf(k))+'</span><span class="tc2">'+(D.lvl<=thLevel()?cnt+' / '+lim:'')+(D.slots?' · '+D.slots+' workers':'')+(D.housing?' · '+D.housing+' beds':'')+(needsShort(k)?'<br>Needs '+esc(needsShort(k)):'')+'</span><span class="cost'+(av&&!afford(cst)?' bad':'')+'">'+(lock?esc(lock):free?'First one free':costIco(cst))+'</span></button>';}
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
  if(fd<6)out.push({p:1,ic:'food',t:'Food for only '+Math.floor(fd)+' days',sub:'Put more people on fishers, hunters or berries',go:()=>{const b=B.find(b=>['fish','berry','hunter','garden'].includes(b.t)&&b.workers<slotsOf(b));if(b)focusOn(b,true);else placeType(has('fish')?'berry':'fish');},cls:'bad'});
  {const yt=S.gameT%YEAR,left=Math.ceil((SUMMER-yt)/DAY),need=Math.ceil(fireNeed()*15);if(!win&&left<=10&&r.wood<need)out.push({p:2,ic:'wood',t:'Winter in '+left+' day'+(left>1?'s':'')+': '+Math.floor(r.wood)+' of '+need+' firewood',sub:'Put more people on woodcutting, or build less until winter.',go:()=>{const b=B.find(b=>b.t==='wood'&&b.workers<slotsOf(b));if(b)focusOn(b,true);else placeType('wood');},cls:'warn'});}
  if(win&&r.wood<fireNeed()*4)out.push({p:1,ic:'wood',t:'Firewood for only '+Math.floor(r.wood/Math.max(1,fireNeed()))+' days',go:()=>{const b=B.find(b=>b.t==='wood'&&b.workers<slotsOf(b));if(b)focusOn(b,true);else placeType('wood');},cls:'bad'});
  {const fr=housing()-S.pop;if(fr<=1&&canBuildNow('house'))out.push({p:2,ic:'Housing',t:fr<=0?'Every bed is taken':'Only 1 bed left',sub:fr<=0?'Build a house so newcomers can stay':'Build a house so more newcomers can stay',go:()=>placeType('house')});}
  if(freeWorkers>0)out.push({p:2,ic:'people',t:freeWorkers+' '+(freeWorkers>1?'people have':'person has')+' no work',sub:'Open the work overview',go:()=>openPanel('village')});
  /* buildings in trouble */
  const bad=B.filter(b=>slotsOf(b)&&b.status&&!(b.status==='Working'||b.status==='Drawing newcomers'||b.status.indexOf('Resting')===0||b.status.indexOf('Holding')===0||b.status==='Paused'));
  for(const b of bad.slice(0,3))out.push({p:3,ic:DEF[b.t].cat,t:DEF[b.t].name+': '+b.status,go:()=>focusOn(b,true),cls:'warn'});
  /* the saga goal */
  const g=currentGoal();if(g){const lo=g.goal.toLowerCase();const want=Object.keys(DEF).filter(k=>k!=='th'&&(lo.indexOf(DEF[k].name.toLowerCase().replace('’',"'"))>=0||lo.indexOf(DEF[k].name.toLowerCase())>=0)).filter(k=>!has(k));
    out.push({p:4,ic:'fame',t:g.title,sub:g.goal,go:()=>{if(want.length)placeType(want[0]);else openPanel('saga');}});}
  if(q&&!q.ok&&!out.some(o=>o.p===0)){const miss=q.items.filter(i=>!i.ok);if(miss.length)out.push({p:5,ic:'Village',t:'Next Town Hall: '+miss.length+' thing'+(miss.length>1?'s':'')+' left',sub:miss[0].t,go:()=>focusOn(th,true)});}
  if(thLevel()>=3&&S.ships.some(s=>!s.away)&&S.warriors>=5&&!S.raids.length&&!canRaid())out.push({p:6,ic:'Sea',t:'Ships and warriors are ready to sail',go:()=>worldPanel()});
  return out.sort((a,b)=>a.p-b.p).slice(0,6);}
let todoOpen=innerWidth>=900,todoKey='';
function renderTodo(){let el=$('todo');if(!el){el=document.createElement('div');el.id='todo';el.className='todo';document.querySelector('.side').appendChild(el);}
  if(titleOn){el.hidden=true;return;}el.hidden=false;
  const L=suggestions();const key=todoOpen+'|'+L.map(o=>o.t+(o.sub||'')).join('|');if(key===todoKey)return;todoKey=key;
  el.innerHTML='<button type="button" class="tdh" id="todo-h" aria-expanded="'+todoOpen+'"><b>To do</b><span>'+L.length+'</span></button>'+(todoOpen?'<div class="tdl">'+L.map((o,i)=>'<button type="button" class="td '+(o.cls||'')+'" data-td="'+i+'">'+(ICON[o.ic]?ICON[o.ic].replace(/width="14" height="14"/,'width="16" height="16"'):ico(o.ic,16))+'<span><b>'+esc(o.t)+'</b>'+(o.sub?'<em>'+esc(o.sub)+'</em>':'')+'</span></button>').join('')+'</div>':'');
  $('todo-h').onclick=()=>{todoOpen=!todoOpen;todoKey='';renderTodo();};
  el.querySelectorAll('[data-td]').forEach(b=>b.onclick=()=>{const o=L[+b.dataset.td];if(mode!=='view')endMode();o.go();todoKey='';});}
setInterval(()=>{try{renderTodo();if(isWide()&&!$('dock'))renderDock();if($('dock')){const lv=thLevel();if(renderDock.lv!==lv||renderDock.m!==mode+roadKind){renderDock.lv=lv;renderDock.m=mode+roadKind;renderDock();}}}catch(e){}},700);
window.addEventListener('resize',()=>{if(isWide())renderDock();});
