/* =================== HUD =================== */
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ICON={food:'<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M2 11 H18 Q17 17 10 17 Q3 17 2 11 Z" fill="#8E6F52"/><path d="M3.5 12.5 H16.5" stroke="#6E5440" stroke-width="0.8"/><ellipse cx="7.5" cy="8.6" rx="4" ry="2.4" fill="#D9A55A"/><path d="M5.6 8 L6.6 9.4 M7.6 7.6 L8.6 9 M9.4 7.8 L10.2 9" stroke="#A9773A" stroke-width="0.7"/><path d="M11 9.6 Q14 5.4 17 8.2 L18.6 6.6 L18.4 10.6 L17 9.4 Q14 12 11 9.6 Z" fill="#9FB4BC" stroke="#5E7F8C" stroke-width="0.6"/><circle cx="12.7" cy="8.6" r="0.6" fill="#263035"/></svg>',
  water:'<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 6 H16 L14.6 17 H5.4 Z" fill="#8E6F52"/><path d="M4.5 9.6 H15.5 M4.9 13.4 H15.1" stroke="#5A4636" stroke-width="1"/><ellipse cx="10" cy="6" rx="6" ry="1.6" fill="#7FB0C2" stroke="#5A4636" stroke-width="0.8"/><path d="M4 6 Q10 -1 16 6" fill="none" stroke="#5A4636" stroke-width="0.9"/><path d="M10 9.8 Q12.2 12.6 12.2 13.6 A2.2 2.2 0 0 1 7.8 13.6 Q7.8 12.6 10 9.8 Z" fill="#B9DCE8"/></svg>',
  wood:'<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="6" width="13" height="5" rx="1" fill="#8E6F52"/><rect x="5" y="11.5" width="13" height="5" rx="1" fill="#7A5D44"/><ellipse cx="15" cy="8.5" rx="2.2" ry="2.5" fill="#D8B98A" stroke="#7A5D44" stroke-width="0.7"/><ellipse cx="18" cy="14" rx="2" ry="2.5" fill="#D8B98A" stroke="#6B503A" stroke-width="0.7"/><circle cx="15" cy="8.5" r="0.9" fill="none" stroke="#A9865C" stroke-width="0.6"/><circle cx="18" cy="14" r="0.9" fill="none" stroke="#A9865C" stroke-width="0.6"/><path d="M7 4 L9 6" stroke="#5E7F4E" stroke-width="1.2" stroke-linecap="round"/></svg>',
  planks:'<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M1.5 6 L17 3 L18.5 6 L3 9 Z" fill="#D8B784"/><path d="M1.5 11 L17 8 L18.5 11 L3 14 Z" fill="#C9A87A"/><path d="M1.5 16 L17 13 L18.5 16 L3 19 Z" fill="#B8956A"/><path d="M4 7.4 L13 5.6 M5 12.4 L15 10.4 M4 17.4 L12 15.8" stroke="#8E6F52" stroke-width="0.6"/></svg>',
  iron:'<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M2 15 L5 8 H15 L18 15 Z" fill="#8A8F94"/><path d="M5 8 H15 L13.6 6 H6.4 Z" fill="#C3C8CC"/><path d="M6 9.4 H13" stroke="#D9DDE0" stroke-width="1" stroke-linecap="round"/><path d="M2 15 H18 L17.4 16.4 H2.6 Z" fill="#5E6468"/><circle cx="6" cy="4" r="1.2" fill="#B5733F"/><circle cx="9" cy="3" r="0.8" fill="#9C5E32"/></svg>',
  tools:'<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 17 L13 6" stroke="#7A5D44" stroke-width="2" stroke-linecap="round"/><path d="M10 3 L16.5 3 L16.5 6.5 L13.5 7.5 L11 5.6 Z" fill="#8C9398" stroke="#5E6468" stroke-width="0.6"/><path d="M16 17 L7 7" stroke="#7A5D44" stroke-width="2" stroke-linecap="round"/><path d="M4.4 4.2 Q2.6 7.6 5 9.6 L8.4 6.2 Q6.6 3.8 4.4 4.2 Z" fill="#B7BCBF" stroke="#5E6468" stroke-width="0.6"/></svg>',
  fame:'<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><polygon points="10,1.5 12.4,7 18.4,7.5 13.8,11.4 15.3,17.4 10,14.2 4.7,17.4 6.2,11.4 1.6,7.5 7.6,7" fill="#C9A64A" stroke="#8C6A24" stroke-width="0.9" stroke-linejoin="round"/><polygon points="10,5 11.2,8.2 14.4,8.4 12,10.5 12.8,13.7 10,12 7.2,13.7 8,10.5 5.6,8.4 8.8,8.2" fill="#E8CF7A"/></svg>',
  people:'<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><circle cx="13.5" cy="5.6" r="2.6" fill="#7E8C92"/><path d="M8.6 17 Q9.2 9.4 13.5 9.4 Q17.8 9.4 18.4 17 Z" fill="#7E8C92"/><circle cx="7" cy="6.2" r="3" fill="#C9C2B2"/><path d="M1.4 18 Q2 10.6 7 10.6 Q12 10.6 12.6 18 Z" fill="#B5733F"/><path d="M4.2 5.2 Q7 2 9.8 5.2" fill="none" stroke="#8E6F52" stroke-width="1.2"/></svg>',
  warriors:'<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M15 2 L15 18" stroke="#7A5D44" stroke-width="1.3"/><path d="M15 0.8 L16.6 4 L13.4 4 Z" fill="#8C9398"/><circle cx="8.5" cy="11" r="7" fill="#A34A3A" stroke="#5A4636" stroke-width="1"/><path d="M8.5 4 V18 M1.5 11 H15.5" stroke="#E9E2D0" stroke-width="1.6"/><circle cx="8.5" cy="11" r="2.2" fill="#B7BCBF" stroke="#5E6468" stroke-width="0.7"/></svg>',
  morale:'<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.4" fill="#C9A64A" stroke="#8C6A24" stroke-width="0.9"/><path d="M5.8 11.4 Q10 15.6 14.2 11.4" stroke="#263035" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="7.2" cy="7.8" r="1.1" fill="#263035"/><circle cx="12.8" cy="7.8" r="1.1" fill="#263035"/></svg>',
  silver:'<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><ellipse cx="9" cy="14.5" rx="6.5" ry="2.6" fill="#8C9398"/><rect x="2.5" y="11" width="13" height="3.5" fill="#8C9398"/><ellipse cx="9" cy="11" rx="6.5" ry="2.6" fill="#C9CED1" stroke="#8C9398" stroke-width="0.6"/><ellipse cx="13" cy="7" rx="5" ry="4.6" fill="#DDE1E3" stroke="#8C9398" stroke-width="0.9"/><path d="M11 7 H15 M13 5 V9" stroke="#8C9398" stroke-width="0.9"/></svg>'};
const CHIPS=[['food','Food'],['wood','Wood'],['planks','Planks'],['iron','Iron'],['tools','Tools'],['fame','Fame'],['people','People'],['morale','Morale'],['warriors','Warriors'],['silver','Silver']];
const RGROUPS=[['people','morale'],['food'],['wood','planks','iron','tools'],['silver','fame','warriors']];
$('res').innerHTML=RGROUPS.map(g=>'<div class="rg">'+g.map(k=>{const c=CHIPS.find(q=>q[0]===k);return '<button type="button" class="chip" id="chip-'+k+'" data-res="'+k+'" aria-label="'+c[1]+'">'+ICON[k]+'<span class="v"><span class="lbl">'+c[1]+'</span><span class="n"><strong id="r-'+k+'">0</strong><em id="d-'+k+'"></em></span></span></button>';}).join('')+'</div>').join('');
{const tip=document.createElement('div');tip.id='rtip';tip.className='rtip';tip.hidden=true;document.body.appendChild(tip);}
const RTIP={food:'Everything people eat. Each person eats about 1 a day, more in winter.',water:'Carried from wells. Each person drinks every day.',wood:'Felled by woodcutters. Burned as firewood in winter and turned into planks.',planks:'Sawn from wood at the carpenter.',iron:'Dug at the mine.',tools:'Forged by the smith. Workers wear them out.',silver:'From trade and plunder.',fame:'Earned by deeds. Spend it on land.',people:'People living in Kaldstrand / beds in houses.',morale:'How content the village is.',warriors:'Trained fighters (+ in training).'};
function tipHtml(k){const c=CHIPS.find(q=>q[0]===k),r=S.res,bal=(S.bal||{})[k],L=(S.prodLog||{})[k]||{};
  let h='<b>'+c[1]+'</b><p>'+RTIP[k]+'</p>';
  const cap={food:capFood(),water:capWater(),wood:capMat(),planks:capMat(),iron:capMat()}[k];
  if(k==='food')h+='<div class="tr"><span>In store</span><span>'+fmt(foodUnits())+' / '+fmt(cap)+'</span></div>';
  else if(cap)h+='<div class="tr"><span>In store</span><span>'+fmt(r[k])+(k==='water'?' / '+fmt(cap):'')+'</span></div>';
  if(bal!==undefined){const prod=Object.values(L).reduce((a,v)=>a+v,0),used=Math.max(0,prod-bal);
    h+='<div class="tr"><span>Yesterday</span><span class="'+(bal>=0?'up':'dn')+'">'+(bal>=0?'+':'')+bal.toFixed(1)+' / day</span></div>';
    const items=Object.entries(L).sort((a,b)=>b[1]-a[1]).slice(0,6);
    if(items.length)h+='<div class="ts">Made by</div>'+items.map(e=>'<div class="tr"><span>'+esc(DEF[e[0]]?DEF[e[0]].name:e[0]==='pen'?'Herds':'Trade and finds')+'</span><span class="up">+'+e[1].toFixed(1)+'</span></div>').join('');
    if(used>0.05)h+='<div class="tr"><span>'+(k==='food'?'Eaten':k==='wood'?'Burned and worked':k==='water'?'Drunk':'Used')+'</span><span class="dn">−'+used.toFixed(1)+'</span></div>';
    if(k==='food'||k==='water'||k==='wood'){const lim=k==='food'?eatNeed():k==='water'?S.pop:fireToday();if(bal<0){const have=k==='food'?foodUnits():r[k];h+='<p class="warnp">Lasts about '+Math.max(0,Math.floor(have/(-bal)))+' days at this rate.</p>';}}}
  if(k==='morale'&&S.mf)h+=S.mf.slice().sort((a,b)=>Math.abs(b.v)-Math.abs(a.v)).slice(0,6).map(f=>'<div class="tr"><span>'+esc(f.t)+'</span><span class="'+(f.v>=0?'up':'dn')+'">'+(f.v>0?'+':'')+f.v+'</span></div>').join('');
  return h;}
document.querySelectorAll('.chip').forEach(b=>{b.addEventListener('mouseenter',()=>{const t=$('rtip');t.innerHTML=tipHtml(b.dataset.res);t.hidden=false;const rc=b.getBoundingClientRect();t.style.left=Math.max(8,Math.min(innerWidth-288,rc.left+rc.width/2-140))+'px';t.style.top=(rc.bottom+8)+'px';});
  b.addEventListener('mouseleave',()=>{$('rtip').hidden=true;});});
document.querySelectorAll('.chip').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.res==='warriors'?'war':(b.dataset.res==='people'||b.dataset.res==='morale')?'people':'village')));
function hud(){
  document.querySelectorAll('.seg .fast').forEach(b=>b.hidden=!(S.mode==='test'||S.mode==='sandbox'));
  const r=S.res;
  $('r-food').textContent=fmt(foodUnits());$('r-wood').textContent=fmt(r.wood);$('r-planks').textContent=fmt(r.planks);$('r-iron').textContent=fmt(r.iron);$('r-tools').textContent=fmt(r.tools);$('r-fame').textContent=fmt(S.fame);$('r-people').textContent=S.pop+'/'+housing();
  const B0=S.bal||{};for(const k of ['food','wood','planks','iron','tools','silver','fame']){const e=$('d-'+k);if(!e)continue;const v=B0[k];if(v===undefined||Math.abs(v)<0.05){e.textContent='';e.className='';continue;}e.textContent=(v>0?'▲':'▼')+fmt(Math.abs(v));e.className=v>0?'up':'dn';}
  if(!$('rtip').hidden){const hv=document.querySelector('.chip:hover');if(hv)$('rtip').innerHTML=tipHtml(hv.dataset.res);}
  $('r-warriors').textContent=S.warriors+(S.train?'+'+S.train.n:'');$('r-silver').textContent=fmt(r.silver);$('r-morale').textContent=Math.round(S.morale);$('chip-morale').classList.toggle('warn',S.morale<40);
  $('chip-warriors').hidden=thLevel()<2;$('chip-silver').hidden=thLevel()<3;
  $('chip-food').classList.toggle('warn',foodUnits()<eatNeed()*3);$('chip-wood').classList.toggle('warn',isWinter()&&r.wood<fireNeed()*3);$('chip-tools').classList.toggle('warn',r.tools<1);
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
function openSheet(html,kind){$('sheet-card').innerHTML=html;$('sheet').hidden=false;$('sheet').classList.toggle('wide',kind==='prod');sheetKind=kind||'info';const x=$('sheet-card').querySelector('[data-close]');if(x)x.addEventListener('click',closeSheet);}
function closeSheet(){$('sheet').hidden=true;sheetKind=null;sel=null;}
const head=(title,meta)=>'<div class="hd"><div><h2>'+esc(title)+'</h2>'+(meta?'<div class="meta">'+esc(meta)+'</div>':'')+'</div><button type="button" class="x" data-close aria-label="Close">×</button></div>';
function statusClass(s){if(s==='Working'||s==='Drawing newcomers')return '';if(s.indexOf('Resting')===0||s.indexOf('Holding')===0||s.indexOf('Idle')===0||s==='Paused'||s==='')return 'idle';return 'bad';}
const btn=(id,label,opts)=>'<button type="button" class="btn'+((opts&&opts.cls)?' '+opts.cls:'')+'" id="'+id+'"'+((opts&&opts.dis)?' disabled':'')+'>'+esc(label)+'</button>';
let demolishArmed=0;
function buildingSheet(b){
  sel={b:b};const D=DEF[b.t],sl=slotsOf(b);
  let h=head(D.name,(D.fixed||D.up?'Level '+(b.t==='th'?thLevel():b.lvl)+' · ':'')+(D.w*D.h>1?(b.w+'×'+b.h+' tiles'):'1 tile'));
  const on=[];
  if(b.t!=='th'){h+='<p class="role"><strong>'+esc(roleOf(b.t))+'.</strong> '+esc(D.desc||'')+'</p>';const nd=needsOf(b.t);if(nd.length)h+='<div class="meta needs">Needs: '+esc(nd.join(' · '))+'</div>';}
  if(sl){h+='<span class="status '+statusClass(b.status)+'">'+esc(b.status||'Starting')+'</span>';
    assignWorkers();h+='<div class="wk"><button type="button" class="btn small" id="w-minus" aria-label="Fewer workers" '+(b.desired<=0?'disabled':'')+'>−</button><span class="num">'+b.desired+' / '+sl+' <span class="meta">workers</span></span><button type="button" class="btn small" id="w-plus" aria-label="More workers" '+(b.desired>=sl||freeWorkers<=0?'disabled':'')+'>+</button><span class="meta">'+freeWorkers+' free in the village</span></div>';
    if(D.out){const pc=Math.round(100*(b.workers||0)/sl);h+='<div class="outpct"><span class="meta">Output from workers</span><span class="bar"><i style="width:'+pc+'%"></i></span><strong>'+pc+'%</strong><span class="meta">'+(b.workers||0)+' of '+sl+' working · each worker adds '+Math.round(100/sl)+'%</span></div>';}
    h+='<p>'+esc(D.out||'')+(b.made?' · <strong>Yesterday: '+esc(b.made)+'</strong>':'')+'</p>';
    if(SRC_OF[b.t]){const I=srcInfo(b,false),pc=Math.round(I.pct*100);h+='<div class="outpct"><span class="meta">Sources in range</span><span class="bar"><i style="width:'+pc+'%"></i></span><strong>'+pc+'%</strong><span class="meta">of maximum yearly output, with all workers</span></div>';}
    if(D.need){const nc=needCount(b,D.need);h+='<div class="meta">'+esc(nc.label)+'</div>';}
    if(!b.conn&&D.road!==false)h+='<p style="color:#8E3B2F">Connect this building to the Town Hall with a road.</p>';
    on.push(()=>{$('w-minus').onclick=()=>{b.desired=Math.max(0,b.desired-1);assignWorkers();buildingSheet(b);save();};$('w-plus').onclick=()=>{assignWorkers();if(freeWorkers<=0){toast('No free workers. Take someone off another building first.');return;}b.desired=Math.min(sl,b.desired+1);assignWorkers();buildingSheet(b);save();};});
  }
  if(b.t==='smith')h+=smithHtml(b,on);
  if(b.t==='carp'){h+='<div class="wk"><span class="meta">Wood reserve</span><button type="button" class="btn small" id="rv-minus" aria-label="Lower the wood reserve">−10</button><span class="num">'+S.woodReserve+'</span><button type="button" class="btn small" id="rv-plus" aria-label="Raise the wood reserve">+10</button><span class="meta">never sawn</span></div>';
    on.push(()=>{$('rv-minus').onclick=()=>{S.woodReserve=Math.max(0,S.woodReserve-10);buildingSheet(b);save();};$('rv-plus').onclick=()=>{S.woodReserve=Math.min(1000,S.woodReserve+10);buildingSheet(b);save();};});}
  if(b.t==='pigpen'||b.t==='sheeppen'){const sheep=b.t==='sheeppen',hn=herdTotal()*0.4;h+='<table class="t"><tr><td>'+(sheep?'Sheep':'Pigs')+'</td><td>'+(sheep?S.herd.sheep:S.herd.pigs)+' / '+(sheep?sheepCap():pigCap())+'</td></tr><tr><td>Fodder in store</td><td>'+fmt(S.res.fodder)+'</td></tr><tr><td>Fodder eaten per winter day (all animals)</td><td>'+hn.toFixed(1)+' ('+fmt(hn*15)+' for a whole winter)</td></tr></table><p>'+(sheep?'Sheep above the pens’ room are slaughtered for 8 meat and a hide each.':'Pigs above the pens’ room are slaughtered for 10 meat and a hide each.')+'</p>';}
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
    if(q){h+='<h3>Raise to level '+q.lv+'</h3>'+q.items.map(i=>'<div class="ms'+(i.ok?' done':'')+'"><i aria-hidden="true"></i><div>'+esc(i.t)+'</div></div>').join('')+'<div class="acts">'+btn('th-up','Raise the hall to level '+q.lv,{cls:'primary',dis:!q.ok})+'</div>';
      on.push(()=>{$('th-up').onclick=()=>{if(upgradeTH()){closeSheet();save();}};});}
    else h+='<p>The hall stands at its highest level for this update.</p>';
    openSheet(h,'building');on.forEach(f=>f());return;}
  if(b.t==='house'){const cur=houseSch(b);h+='<h3>Colours</h3><div class="swatches" role="group" aria-label="House colours">'+HOUSE_SCH.map((q,i)=>'<button type="button" class="sw'+(i===cur?' on':'')+'" data-sch="'+i+'" title="'+q.n+'" aria-label="'+q.n+'"><i style="background:'+q.roof+'"></i><i style="background:'+q.wall+'"></i></button>').join('')+'</div><div class="acts">'+btn('sch-all','Use on every house')+btn('sch-mix','Mixed village')+'</div>';
    on.push(()=>{$('sheet-card').querySelectorAll('[data-sch]').forEach(x=>x.onclick=()=>{b.sch=+x.dataset.sch;save();buildingSheet(b);});$('sch-all').onclick=()=>{S.houseSch=houseSch(b);for(const o of B)if(o.t==='house')delete o.sch;save();toast('Every house now uses '+HOUSE_SCH[S.houseSch].n.toLowerCase()+'.');buildingSheet(b);};$('sch-mix').onclick=()=>{S.houseSch=null;for(const o of B)if(o.t==='house')delete o.sch;save();buildingSheet(b);};});}
  if(D.housing)h+='<div class="meta">Shelters '+(b.t==='house'?HOUSE_CAP[b.lvl-1]:D.housing)+' people'+(b.t==='house'&&b.lvl>=3?' · burns ¾ firewood':'')+'</div>';
  if(D.store)h+='<div class="meta">Storage: '+(D.store.food?(300+150*(b.lvl-1))+' food':D.store.mat?(300+150*(b.lvl-1))+' goods':(60+30*(b.lvl-1))+' weapons')+'</div>';

  if(b.cons)h+=consHtml(b);
  if(D.up&&!(b.cons&&b.cons.k==='build')){const nx=b.lvl+1;if(b.cons&&b.cons.k==='up');else if(b.lvl>=5)h+='<div class="meta">Highest level reached.</div>';
    else{const c=upCost(b),need=canUpgrade(b);const eff=b.t==='house'?('+1 resident'+(nx===3?', better insulated: −25% firewood':nx===5?', a carved hall that draws newcomers':'')):D.store?'+150 storage':nx===2?'+20% output':nx===3?(FIELDS.has(b.t)?'+30% output in all':'+1 worker slot'):nx===4?'+40% output in all':'Finest work: +55% output in all';
      h+='<div class="wk">'+btn('b-up','Upgrade to level '+nx,{cls:'primary',dis:!need||!afford(c)})+'<span class="meta">'+esc(eff)+' · '+costIco(c)+(need?'':' · raise the Town Hall first')+'</span></div>';
      on.push(()=>{$('b-up').onclick=()=>{if(!canUpgrade(b)||!afford(upCost(b)))return;pay(upCost(b),1);startCons(b,'up',b.lvl+1);assignWorkers();toast(D.name+': upgrade to level '+b.cons.lv+' started. It keeps working meanwhile.');buildingSheet(b);save();};});}}
  if(b.t==='th'){h+='<div class="acts"><button type="button" class="btn" id="b-move">Move or rotate</button></div>';on.push(()=>{$('b-move').onclick=()=>{closeSheet();startPlace('th',b);};});}
  if(!D.fixed){h+='<div class="acts"><button type="button" class="btn" id="b-move">Move</button></div><div class="meta">To remove it, use Remove next to Roads.</div>';
    on.push(()=>{      $('b-move').onclick=()=>{closeSheet();startPlace(b.t,b);};});}
  openSheet(h,'building');on.forEach(f=>f());
}
let clearArmed=-1;
function tileSheet(x,y){
  sel={x:x,y:y};const tt=ter[y*N+x],zx=Math.floor(x/6),zy=Math.floor(y/6),un=isUnl(x,y),cost=zoneCost(zx,zy);
  const TN={0:'Sea',1:'Beach',2:'Meadow',3:'Forest',4:'Mountains',5:'Foothills',6:'River',7:'Berry bushes',8:'Iron outcrop'};
  const TX={0:'Open water. Each tile within 3 of a fisher’s hut gives 20 fish a year (river 12).',1:'Sand and shingle. Good ground for fishers and the harbour.',2:'Open ground for houses, workshops, fields and roads.',3:'Woodcutters work these trees. Each tree gives 8 wood a year, refilled every spring.',4:'The mountains close the land off. Nothing can be built here.',5:'Rocky ground at the foot of the mountains. Mines go here.',6:'Fresh water. Fishers work from its banks; roads cross it as bridges.',7:'Gatherers pick berries here in summer: 25 a bush each year. Bushes rest in winter.',8:'Iron ore: 60 iron a year. Place an iron mine within 4 tiles.'};
  let extra='';
  if(tt===T.FOREST){const ts=trees.filter(o=>o.x===x&&o.y===y&&!o.gone);if(ts.length)extra='Wood left here this year: '+fmt(ts.reduce((a,o)=>a+o.amt,0))+' of '+ts.reduce((a,o)=>a+o.cap,0);}
  if(tt===T.BERRY){const bs=bushes.find(o=>o.x===x&&o.y===y&&!o.gone);if(bs)extra='Berries left this year: '+fmt(bs.amt)+' of '+bs.cap;}
  if(tt===T.IRON||tt===T.SEA||tt===T.RIVER){const o=SRCAT[y*N+x];if(o)extra=(tt===T.IRON?'Iron':'Fish')+' left here this year: '+fmt(o.amt)+' of '+o.cap;}
  let h=head(TN[tt],zoneName(zx,zy)+' · '+(un?'Unlocked':'Locked'))+'<p>'+esc(TX[tt])+'</p>'+(extra?'<div class="meta">'+esc(extra)+'</div>':'');
  if((tt===T.FOREST||tt===T.BERRY)&&un)h+='<div class="meta">To clear these for good, use Remove next to Roads.</div>';
  if(!un){const adj=zoneAdj(zx,zy);h+='<div class="acts"><button type="button" class="btn primary" id="z-un" '+(adj&&S.fame>=cost?'':'disabled')+'>Unlock for '+cost+' fame</button></div>'+(!adj?'<div class="meta">Unlock a neighbouring land first.</div>':S.fame<cost?'<div class="meta">You have '+fmt(S.fame)+' fame. Complete saga goals to earn more.</div>':'');}
  openSheet(h,'tile');
  if(!un&&$('z-un'))$('z-un').onclick=()=>{if(S.fame<cost)return;S.fame-=cost;unlocked.add(zx+','+zy);toast(zoneName(zx,zy)+' is now part of Kaldstrand.');save();tileSheet(x,y);};
}

/* ---------- panels ---------- */
let buildCat='Homes';
let newArmed=false;
function renderBuild(){if(isWide()){if(mode!=='view')endMode();closeSheet();openTray(buildCat);return;}
  let h=head('Build','Construction is instant. Town Hall level '+thLevel()+'.');
  h+='<div class="tabs" role="group" aria-label="Categories">'+CATS.map(c=>'<button type="button" data-cat="'+c+'" aria-pressed="'+(c===buildCat)+'">'+c+'</button>').join('')+'</div><div class="blist">';
  Object.keys(DEF).filter(k=>DEF[k].cat===buildCat).forEach(k=>{const D=DEF[k],av=isAvail(k),lim=limitOf(k),cnt=count(k),uq=cnt>=lim,cst=costOf(k),free=!Object.keys(cst).length&&Object.keys(D.cost).length,ok=av&&!uq&&afford(cst);
    const lock=D.lvl>thLevel()?'Needs Town Hall level '+D.lvl:!av?'Unlocks with: '+(MS.find(m=>m.unlock.includes(k))||{title:'?'}).title:uq?'Limit reached for this level':'';
    h+='<button type="button" class="bcard'+(ok?'':' no')+'" data-b="'+k+'"><img class="bth" alt="" src="'+buildThumb(k,1)+'"><b>'+esc(D.name)+'</b>'+(D.lvl<=thLevel()?'<span class="lim">Built '+cnt+(UNLIMITED.has(k)?'':' / '+lim)+'</span>':'')+'<span>'+D.w+'×'+D.h+(D.slots?' · '+D.slots+' workers':'')+(D.housing?' · '+D.housing+' people':'')+'</span><span class="cost'+(av&&!afford(cst)?' bad':'')+'">'+(free?'First one free':costIco(cst))+'</span>'+(lock?'<span>'+esc(lock)+'</span>':'')+'</button>';});
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
function updatePlaceBar(){if(mode!=='place'||!place)return;if(place.asking){if(place.asking===place.fx+','+place.fy+','+place.rot)return;place.asking=null;lastPlaceKey='';}const D=DEF[place.t],chk=place.chk||{ok:false,why:'Move the map to choose a spot'};
  const key=place.t+place.rot+(chk.ok?1:0)+(chk.why||'')+(chk.label||'');if(key===lastPlaceKey)return;lastPlaceKey=key;
  const msg='<strong>'+esc(D.name)+'</strong> · '+esc(place.moving?'moving (free)':(Object.keys(costOf(place.t)).length?costStr(costOf(place.t)):'free'))+'<br>'+(chk.ok?esc(chk.label||'Drag the map to choose a spot, then place.'):esc(chk.why))+(D.cat!=='Decor'&&!FIELDS.has(place.t)?'<br><span class="meta">Entrance faces '+SIDE_ARROW[place.rot&3]+'. Rotate to turn it to any side.</span>':'');
  setModeBar(msg,!chk.ok,[{label:'Cancel',fn:()=>{endMode();}},{label:'Rotate '+SIDE_ARROW[place.rot&3],fn:()=>{place.rot=((place.rot|0)+1)%4;lastPlaceKey='';}},{label:place.moving?'Move here':'Place',cls:'primary',disabled:!chk.ok,fn:confirmPlace}]);}
function confirmPlace(){if(!place||!place.chk||!place.chk.ok)return;const D=DEF[place.t];
  /* building over trees or bushes: ask first */
  const cl=(place.chk.clears||[]).filter(i=>{const p=plantsOn(i);return p.t||p.b;});
  if(cl.length&&!place.moving&&place.asked!==place.fx+','+place.fy+','+place.rot){let nt=0,nb=0;cl.forEach(i=>{const p=plantsOn(i);nt+=p.t;nb+=p.b;});const w=[],g=[];if(nt){w.push(nt+' tree'+(nt>1?'s':''));g.push(nt*CLEAR_GIVE.tree+' wood');}if(nb){w.push(nb+' berry bush'+(nb>1?'es':''));g.push(nb*CLEAR_GIVE.bush+' berries');}
    const k=place.fx+','+place.fy+','+place.rot;place.asking=k;
    setModeBar('<strong>Remove these resource sources?</strong> '+esc(w.join(' and '))+' will go for good. You get '+esc(g.join(' and '))+'.',false,[{label:'No',fn:()=>{place.asking=null;lastPlaceKey='';updatePlaceBar();}},{label:'Yes, remove and place',cls:'primary',fn:()=>{place.asking=null;place.asked=k;lastPlaceKey='';confirmPlace();}}]);return;}
  if(cl.length&&!place.moving){const gv=clearTiles(cl);toast(clearTxt(gv));}
  if(place.moving){const b=place.moving;const d=dims(b.t,place.rot);b.fx=place.fx;b.fy=place.fy;b.rot=place.rot;b.w=d.w;b.h=d.h;rebuildOcc();recomputeConn();assignWorkers();toast(D.name+' moved.');endMode();save();return;}
  const cst=costOf(place.t);if(!afford(cst)){toast('Not enough materials.');endMode();return;}
  pay(cst,1);const b=addBuilding(place.t,place.fx,place.fy,place.rot,false);b.paid=cst;startCons(b,'build');assignWorkers();if(!b.cons){b.desired=Math.min(slotsOf(b),freeWorkers);assignWorkers();}checkMilestones();
  toast(b.cons?D.name+': construction started ('+(b.cons.days<1?'half a day':b.cons.days+' day'+(b.cons.days>1?'s':''))+', '+b.cons.w+' builder'+(b.cons.w>1?'s':'')+').'+(b.cons.builders?'':' It waits for a free worker.'):D.name+' built.');save();
  if(count(place.t)>=limitOf(place.t)||!afford(costOf(place.t)))endMode();else lastPlaceKey='';}
let roadErase=false;
/* roads: tap a start, tap an end, see a ghost of the road, confirm */
let roadA=null,roadPrev=null,roadFail=false,roadHover='',roadLock=false;
let roadKind='road';
function startWall(){startRoad();roadKind='wall';roadBar();}
function startRoad(){roadKind='road';mode='road';roadErase=false;roadReset();}
function roadReset(){roadA=null;roadPrev=null;roadFail=false;roadLock=false;roadHover='';roadBar();}
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
  const what=W?(roadErase?'Remove palisade':'Palisade'):(roadErase?'Remove roads':'Roads');
  let msg='<strong>'+what+'</strong> · ';
  if(!roadA)msg+=(roadErase?'Click the start of the stretch to remove.':W?'Click where the palisade starts. Where it crosses a road, a gate is built.':'Click where the road starts.');
  else if(!roadLock)msg+=(roadFail?'No way through to there. ':'')+'Now click where it ends.';
  else if(roadFail)msg+='No way through to there. Click another end point, or Cancel.';
  else msg+=(roadErase?n+' tiles will be removed.':W?n+' stakes: '+costStr(wc)+(afford(wc)?'':' (not enough)')+'.':n+' new tiles'+(bridge?', with a bridge':'')+'. Roads are free.')+' Check the plan, then press '+(roadErase?'Remove':W?'Build palisade':'Build road')+'.';
  if(W)msg+=' <span class="meta">Palisade: '+(S.wallClosed?'closed':'not closed yet')+'.</span>';
  if(!roadLock)msg+=' <span class="meta">Drag to move the map. Gold dots: not connected to the Town Hall.</span>';
  const btns=roadLock?[{label:'Cancel',fn:roadReset},{label:roadErase?'Remove':W?'Build palisade':'Build road',cls:'primary',disabled:!roadPrev||!n||(W&&!roadErase&&!afford(wc)),fn:confirmRoad}]
    :[{label:'Close',fn:()=>{endMode();save();}},{label:'Remove…',fn:()=>{endMode();startRemove();if(typeof renderDock==='function')renderDock();}}].concat(roadA?[{label:'Cancel',fn:roadReset}]:[]);
  setModeBar(msg,roadFail&&roadLock,btns);}
function roadTarget(t){if(!roadA)return;if(t[0]===roadA[0]&&t[1]===roadA[1]){roadPrev=roadOK(t[0],t[1])?[t]:null;roadFail=false;return;}const p=roadPath(roadA,t);roadFail=!p;roadPrev=p;}
function roadTap(t){if(!inMap(t[0],t[1]))return;
  if(!roadA){if(!roadOK(t[0],t[1])){toast(roadErase?'There is no road there.':'A road cannot go there: '+(!isUnl(t[0],t[1])?'the land is locked.':occ[t[1]*N+t[0]]?'a building stands there.':'the ground is not open.'));return;}roadA=t;roadPrev=null;roadFail=false;roadLock=false;roadBar();return;}
  roadTarget(t);roadHover=t[0]+','+t[1];roadLock=true;roadBar();}
function roadHoverAt(px,py){if(!roadA||roadLock)return;const w=s2w(px,py),t=w2t(w[0],w[1]);const k=t[0]+','+t[1];if(k===roadHover||!inMap(t[0],t[1]))return;roadHover=k;roadTarget(t);roadBar();}
function confirmRoad(){if(!roadPrev)return;if(roadKind==='wall'){if(!roadErase){const c=wallCost();if(!afford(c)){toast('Not enough: needs '+costStr(c));return;}pay(c,1);}
    for(const p of roadPrev){const i=p[1]*N+p[0];if(roadErase)walls[i]=0;else if(!walls[i])walls[i]=roads[i]?2:1;}recomputeWalls();roadPrev=null;roadA=null;roadLock=false;roadFail=false;rebuildOcc();checkMilestones();save();roadBar();return;}
  for(const p of roadPrev){const i=p[1]*N+p[0];if(roadErase)roads[i]=0;else if(roadOK(p[0],p[1]))roads[i]=1;}
  roadPrev=null;roadA=null;roadLock=false;roadFail=false;recomputeConn();assignWorkers();checkMilestones();save();roadBar();}
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
  if(mode==='remove'){removeTap(tt);return;}
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
