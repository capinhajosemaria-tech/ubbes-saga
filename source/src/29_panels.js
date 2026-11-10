/* =================== panels =================== */
let tabV='Stores',tabP='Overview',peopleFilter='All',worldSel=null,plan=null;
const tabsHtml=(list,cur,attr)=>'<div class="tabs" role="group">'+list.map(c=>'<button type="button" '+attr+'="'+c+'" aria-pressed="'+(c===cur)+'">'+c+'</button>').join('')+'</div>';
const bar=(v,col)=>'<span class="pbar"><i style="width:'+Math.round(clamp(v,0,100))+'%;background:'+(col||'var(--gold)')+'"></i></span>';
const factors=f=>'<table class="t">'+f.map(x=>'<tr><td>'+esc(x.t)+'</td><td style="color:'+(x.v>=0?'#3F5A35':'#8E3B2F')+'">'+(x.v>0?'+':'')+x.v+'</td></tr>').join('')+'</table>';
function polSeg(key,opts){return '<div class="prio" role="group">'+opts.map(o=>'<button type="button" data-pol="'+key+'" data-v="'+o[0]+'" aria-pressed="'+(String(S.pol[key])===String(o[0]))+'">'+esc(o[1])+'</button>').join('')+'</div>';}
function openPanel(p){
  sel=null;
  if(p==='build'){renderBuild();return;}
  if(p==='war'&&thLevel()<2){toast('War opens at Town Hall level 2 with the training ground.');return;}
  if(p==='world'&&thLevel()<3){toast('The world map opens at Town Hall level 3, when Kaldstrand turns to the sea.');return;}
  if(p==='village')return villagePanel();
  if(p==='people')return peoplePanel();
  if(p==='war')return warPanel();
  if(p==='world')return worldPanel();
  if(p==='saga')return sagaPanel();
}
function villagePanel(){const r=S.res,bal=S.bal||{},win=isWinter();const sgn=v=>v===undefined?'':(v>=0?'+':'')+v.toFixed(1);
  let h=head('Village','Morale '+Math.round(S.morale)+' · attractiveness '+Math.round(S.attr));
  h+=tabsHtml(['Stores','Winter','Policies'],tabV,'data-tv');
  if(tabV==='Stores'){const days=foodUnits()/Math.max(0.5,eatNeed());const variety=FOOD.filter(k=>r[k]>=1).length;
    h+='<h3>Food · '+fmt(foodUnits())+' meals · '+variety+' kinds</h3><table class="t">'+FOOD.filter(k=>r[k]>=0.5||['fish','berries'].includes(k)).map(k=>'<tr><td>'+RNAME[k]+(FRESH.includes(k)?' <span class="meta">spoils</span>':'')+' <span class="meta">×'+MEAL[k]+'</span></td><td>'+fmt(r[k])+'</td></tr>').join('')+'<tr><td>Granary space</td><td>'+fmt(foodItems())+' / '+capFood()+'</td></tr><tr><td>Lasts at today’s eating</td><td>'+fmt(days)+' days</td></tr><tr><td>Change yesterday</td><td>'+sgn(bal.food)+'</td></tr></table>';
    h+='<h3>Goods</h3><table class="t">'+MAT.filter(k=>r[k]>=0.5||['wood','planks','iron','tools'].includes(k)).map(k=>'<tr><td>'+RNAME[k]+'</td><td>'+(k==='tools'?r[k].toFixed(1):fmt(r[k]))+(bal[k]!==undefined?' <span class="meta">'+sgn(bal[k])+'</span>':'')+'</td></tr>').join('')+'<tr><td>Storage space <span class="meta">(tools are kept at the smithy)</span></td><td>'+fmt(matItems())+' / '+capMat()+'</td></tr><tr><td>Silver</td><td>'+fmt(r.silver)+'</td></tr></table>';
    if(thLevel()>=2)h+='<h3>Weapons</h3><table class="t">'+ARMS.filter(k=>r[k]>=0.5||k==='spears').map(k=>'<tr><td>'+RNAME[k]+'</td><td>'+fmt(r[k])+'</td></tr>').join('')+'<tr><td>Arsenal space</td><td>'+fmt(armsItems())+' / '+capArms()+'</td></tr></table>';
    h+='<h3>Reserves</h3><p>Workshops never use the last units you reserve here.</p><table class="t">'+RESV.map(k=>'<tr><td>'+RNAME[k]+'</td><td><button type="button" class="btn small" data-rv="'+k+'" data-d="-10" aria-label="Lower reserve">−</button> <strong>'+(k==='wood'?S.woodReserve:(S.reserve[k]||0))+'</strong> <button type="button" class="btn small" data-rv="'+k+'" data-d="10" aria-label="Raise reserve">+</button></td></tr>').join('')+'</table>';}
  if(tabV==='Winter'){const fw=fireNeed()*(S.winter.hard&&win?1.3:1),dr=drinkers()*DRINK;
    h+='<h3>Provisions</h3><table class="t"><tr><td>Food</td><td>'+fmt(foodUnits()/Math.max(0.5,eatNeed()))+' days</td></tr><tr><td>Firewood ('+fw.toFixed(0)+' a winter day)</td><td>'+fmt(r.wood/Math.max(1,fw))+' winter days</td></tr><tr><td>A whole winter needs</td><td>'+fmt(eatNeed()*15)+' meals, '+fmt(fw*15)+' wood</td></tr></table>';
    h+='<p>'+(S.winter.told?'The Völva says: '+(S.winter.said?'<strong>a hard winter is coming</strong>.':'the winter will be mild.'):'The Völva reads the signs near the end of summer.')+(S.adv==='thorbjorg'?' Thorbjörg is never wrong.':' She is right four times in five.')+'</p>';
    h+='<h3>Rationing</h3>'+polSeg('ration',[['normal','Normal'],['reduced','Reduced'],['severe','Severe']])+'<p class="meta">Reduced: 20% less food, −8 morale. Severe: 40% less, −20 morale, more sickness, fewer births.</p>';}
  if(tabV==='Policies'){h+='<h3>Funeral rite</h3>'+polSeg('rite',[['cremation','Cremation'],['burial','Burial']])+'<p class="meta">Cremation burns 8 wood at the pyre and keeps the river clean. Burial is free but fouls the water for a while.</p>';
    if(thLevel()>=2){h+='<h3>Child labour</h3>'+polSeg('child',[[false,'No'],[true,'From age 10']])+'<p class="meta">Children of 10–13 work at half pace. −10 morale.</p>';
      h+='<h3>Borders</h3>'+polSeg('borders',[['open','Open'],['closed','Closed']])+'<p class="meta">Open borders draw more newcomers (+8 attractiveness). Closed: −5, but a little safer later.</p>';}
    else h+='<p class="meta">More policies open with the Town Hall.</p>';
    if(thLevel()>=3){h+='<h3>Share of the loot</h3>'+polSeg('loot',[['jarl','To the Jarl'],['warriors','To the crews']])+'<p class="meta">Giving the crews a share keeps 15% of the plunder from the stores but raises morale.</p>';
      h+='<h3>Thralls</h3>'+polSeg('thralls',[['soft','Mild'],['harsh','Harsh']])+'<p class="meta">Harsh: thralls work 15% harder but flee three times as often. Mild: some save silver to buy freedom.</p>';}}
  openSheet(h,'panel');const card=$('sheet-card');card.dataset.p='village';
  card.querySelectorAll('[data-tv]').forEach(b=>b.onclick=()=>{tabV=b.dataset.tv;villagePanel();});
  card.querySelectorAll('[data-pol]').forEach(b=>b.onclick=()=>{const k=b.dataset.pol;let v=b.dataset.v;if(v==='true')v=true;if(v==='false')v=false;S.pol[k]=v;recalcMorale();assignWorkers();villagePanel();save();});
  card.querySelectorAll('[data-rv]').forEach(b=>b.onclick=()=>{const k=b.dataset.rv,d=+b.dataset.d;if(k==='wood')S.woodReserve=clamp(S.woodReserve+d,0,300);else S.reserve[k]=clamp((S.reserve[k]||0)+d,0,300);villagePanel();save();});}
const RESV=['wood','iron','planks','fish','meat','grain','wool','flax'];
function personRow(p){return '<button type="button" class="prow" data-pid="'+p.id+'">'+portrait(p,40)+'<span><b>'+esc(pname(p))+'</b><span class="meta">'+Math.floor(p.a)+' · '+esc(roleOf(p))+(p.tr?' · '+esc(TRAITS[p.tr].n):'')+'</span></span></button>';}
function personSheet(p){const sp=p.sp?PB(p.sp):null,fa=PB(p.pa[0]),mo=PB(p.pa[1]),kids=kidsOf(p.id);
  let h=head(pname(p),Math.floor(p.a)+' years · '+roleOf(p));
  h+='<div class="pcard">'+portrait(p,110)+'<table class="t"><tr><td>Spouse</td><td>'+esc(sp?pname(sp):'—')+'</td></tr><tr><td>Parents</td><td>'+esc([fa,mo].filter(Boolean).map(pname).join(' and ')||'—')+'</td></tr><tr><td>Children</td><td>'+esc(kids.map(k=>k.n).join(', ')||'—')+'</td></tr>'+(p.w?'<tr><td>Raids</td><td>'+p.xp+(p.xp>=2?' · Drengr':'')+'</td></tr><tr><td>Weapon</td><td>'+(p.ua?'none: needs '+RNAME[PRIMARY[p.w]].toLowerCase():'equipped')+'</td></tr>':'')+'</table></div>';
  if(p.jt)h+='<h3>Traits of the Jarl</h3>'+p.jt.map(k=>'<p><strong>'+esc(JTRAITS[k].n)+'</strong> · '+esc(JTRAITS[k].d)+'</p>').join('');
  if(p.tr)h+='<p><strong>'+esc(TRAITS[p.tr].n)+'</strong> · '+esc(TRAITS[p.tr].d)+'</p>';
  const j=jarlP();if(j&&p.pa.includes(j.id)&&S.heir!==p.id&&p.id!==S.jarl)h+='<div class="acts">'+btn('mk-heir','Name as heir',{cls:'primary'})+'</div>';
  if(S.heir===p.id)h+='<p class="meta">Heir of Kaldstrand.</p>';
  openSheet(h,'panel');
  if($('mk-heir'))$('mk-heir').onclick=()=>{const eld=defaultHeir(j);S.heir=p.id;if(eld&&eld.id!==p.id&&eld.a>=6){addMod('passover','The eldest passed over',-10,45);S.saga.push({y:yearNow(),t:pname(j)+' named '+pname(p)+' heir, passing over '+pname(eld)+'. Brother looked at brother with cold eyes.'});}toast(pname(p)+' is now the heir.');personSheet(p);save();};}
function peoplePanel(){assignWorkers();
  let h=head('People',S.pop+' free people'+(S.thralls?' · '+S.thralls+' thralls':''));
  h+=tabsHtml(['Overview','Lineage','Everyone'],tabP,'data-tp');
  if(tabP==='Overview'){const ad=S.people.filter(p=>p.a>=14&&p.a<50).length,ch=S.people.filter(p=>p.a<14).length,el=S.people.filter(p=>p.a>=50).length,sk=S.people.filter(p=>p.sick>0).length;
    h+='<table class="t"><tr><td>Adults · children · elders</td><td>'+ad+' · '+ch+' · '+el+'</td></tr><tr><td>Housing</td><td>'+S.pop+' / '+housing()+'</td></tr>'+(thLevel()>=2?'<tr><td>Warriors</td><td>'+S.warriors+(S.train?' (+'+S.train.n+' training)':'')+'</td></tr>':'')+(S.thralls||thLevel()>=3?'<tr><td>Thralls</td><td>'+S.thralls+' / '+thrallCap()+'</td></tr>':'')+'<tr><td>Sick or wounded</td><td>'+sk+'</td></tr><tr><td>Able to work · free now</td><td>'+workforce()+' · '+freeWorkers+'</td></tr><tr><td>This year</td><td>'+S.yr.births+' born · '+S.yr.deaths+' died · '+S.yr.arrived+' came</td></tr></table>';
    h+='<h3>Morale · '+Math.round(S.morale)+' / 100</h3>'+bar(S.morale,S.morale<40?'#A34A3A':S.morale>=70?'#5E7A4E':'#C9A64A')+'<p class="meta">Above 70: +10% work and more births. Below 40: −15% work. Below 20 the people may rise. Heading to '+Math.round(S.moraleTarget||S.morale)+'.</p>'+factors(S.mf);
    h+='<h3>Attractiveness · '+Math.round(S.attr)+' / 100</h3>'+bar(S.attr,'#5E7F8C')+'<p class="meta">Draws newcomers when there is room and food.</p>'+factors(S.af);
    h+='<h3>Workplaces</h3><table class="t">'+B.filter(b=>slotsOf(b)).map(b=>'<tr><td>'+esc(DEF[b.t].name)+(b.lvl>1?' <span class="meta">lv '+b.lvl+'</span>':'')+'</td><td>'+b.workers+' / '+slotsOf(b)+'</td></tr>').join('')+'</table>';}
  if(tabP==='Lineage'){const j=jarlP();
    if(j){h+='<div class="pcard">'+portrait(j,110)+'<div><h2>'+esc(pname(j))+'</h2><p class="meta">Jarl of Kaldstrand · '+Math.floor(j.a)+' years · generation '+S.gen+'</p>'+(j.jt||[]).map(k=>'<p><strong>'+esc(JTRAITS[k].n)+'</strong> · '+esc(JTRAITS[k].d)+'</p>').join('')+'</div></div>';
      const sp=j.sp?PB(j.sp):null;if(sp)h+='<h3>Spouse</h3>'+personRow(sp);
      const k=kidsOf(j.id);h+='<h3>Children</h3>'+(k.length?k.map(personRow).join(''):'<p>No children yet.</p>');
      const hr=S.heir?PB(S.heir):null;h+='<h3>Heir</h3><p>'+(hr?'<strong>'+esc(pname(hr))+'</strong>, '+Math.floor(hr.a)+'. Tap a child to name another heir; passing over the eldest costs morale.':'No heir. '+(S.mode==='challenge'?'If the Jarl dies without one, the saga ends.':'If the Jarl dies without one, the people choose a new leader.'))+'</p>';}
    h+='<h3>Line of Ubbe</h3><p class="saga">Ragnar Lothbrok → Ubbe Ragnarsson'+(S.gen>1?' → … → '+esc(pname(j)):'')+'</p>';}
  if(tabP==='Everyone'){const F={All:()=>true,Workers:p=>roleOf(p)==='Worker',Warriors:p=>!!p.w,Children:p=>p.a<14,Elders:p=>p.a>=50,Sick:p=>p.sick>0};
    h+='<div class="tabs" role="group">'+Object.keys(F).map(c=>'<button type="button" data-pf="'+c+'" aria-pressed="'+(c===peopleFilter)+'">'+c+'</button>').join('')+'</div>';
    const list=S.people.filter(F[peopleFilter]).sort((a,b)=>(b.id===S.jarl)-(a.id===S.jarl)||b.a-a.a);h+='<div class="plist">'+list.map(personRow).join('')+'</div>'+(list.length?'':'<p>Nobody here.</p>');}
  openSheet(h,'panel');const card=$('sheet-card');card.dataset.p='people';
  card.querySelectorAll('[data-tp]').forEach(b=>b.onclick=()=>{tabP=b.dataset.tp;peoplePanel();});
  card.querySelectorAll('[data-pf]').forEach(b=>b.onclick=()=>{peopleFilter=b.dataset.pf;peoplePanel();});
  card.querySelectorAll('[data-pid]').forEach(b=>b.onclick=()=>{const p=PB(+b.dataset.pid);if(p)personSheet(p);});}
function warPanel(){let h=head('War','Warriors '+S.warriors+' / '+warCap());
  const by={};S.people.filter(p=>p.w).forEach(p=>{by[p.w]=(by[p.w]||0)+1;});
  h+='<h3>Troops</h3><table class="t">'+Object.keys(TROOPS).filter(k=>TROOPS[k].lv<=thLevel()).map(k=>'<tr><td>'+TROOPS[k].n+' <span class="meta">strength '+TROOPS[k].str+'</span></td><td>'+(by[k]||0)+'</td></tr>').join('')+'<tr><td>In training</td><td>'+(S.train?S.train.n+' '+TROOPS[S.train.type].n.toLowerCase()+'s · '+S.train.left+' days':'none')+'</td></tr><tr><td>Unarmed</td><td>'+S.people.filter(p=>p.w&&p.ua).length+'</td></tr></table>';
  h+='<h3>Arsenal</h3><table class="t">'+ARMS.filter(k=>SMITH[k]&&SMITH[k].lv<=thLevel()).map(k=>'<tr><td>'+RNAME[k]+'</td><td>'+fmt(S.res[k])+'</td></tr>').join('')+'</table>';
  h+='<h3>Ships</h3>'+(S.ships.length?'<table class="t">'+S.ships.map(s=>'<tr><td>'+esc(s.name)+' <span class="meta">'+SHIPS[s.type].name+' · '+SHIPCAP[s.type].crew+' crew</span></td><td>'+(s.away?'At sea':'In harbour')+'</td></tr>').join('')+'</table>':'<p>No ships yet.</p>');
  if(S.raids.length){h+='<h3>Raids under way</h3><table class="t">'+S.raids.map(r=>'<tr><td>'+esc(TG(r.tgt).n)+' · '+r.crew.length+' men</td><td>'+(r.ph==='out'?'sailing out · '+r.t+' days':r.ph==='back'?'sailing home · '+r.t+' days':r.ph==='siege'?'siege':'ashore')+'</td></tr>').join('')+'</table>';}
  h+='<p>Train at the training ground. Set the smithy to forge weapons. Warriors stop working in summer, eat 1½ meals, and help with the chores in winter.</p>';
  const onW=[];h+=warExtraHtml(onW);
  if(thLevel()>=3)h+='<div class="acts">'+btn('w-world','Open the world map',{cls:'primary'})+'</div>';
  openSheet(h,'panel');$('sheet-card').dataset.p='war';onW.forEach(f=>f());if($('w-world'))$('w-world').onclick=()=>worldPanel();}
function targetSheet(id){const t=TG(id),st=S.tg[id]||{};worldSel=id;
  let h=head(t.n,t.type);
  h+='<table class="t"><tr><td>Voyage</td><td>'+travel(t)+' days each way</td></tr><tr><td>Defence</td><td>'+Math.round(tgtDef(t,'assault',false))+(t.walls?' (walls: 1.6×, or lay siege)':'')+'</td></tr><tr><td>Plunder</td><td>'+esc(costStr(t.loot))+'</td></tr><tr><td>Prisoners</td><td>up to '+t.pris+'</td></tr><tr><td>Raided</td><td>'+(st.beaten||0)+' times'+((st.pill||0)>S.day?' · plundered, '+(st.pill-S.day)+' days to recover':'')+'</td></tr><tr><td>Grudge</td><td>'+(st.grudge||0)+'</td></tr>'+(t.trade?'<tr><td>Trade</td><td>'+((st.ban||0)>S.day?'refuses to trade with you':'sends merchants to you')+'</td></tr>':'')+'</table>';
  if(t.trade)h+='<p class="meta">Raiding a trading town stops its merchants coming for a season.</p>';
  const why=canRaid()||(regionOpen(t.reg)?'':'This land is not open to you yet');h+='<div class="acts">'+btn('w-back','Back')+btn('w-plan','Plan a raid',{cls:'primary',dis:!!why})+'</div>'+(why?'<p class="meta">'+esc(why)+'.</p>':'');
  openSheet(h,'panel');$('w-back').onclick=()=>worldPanel();$('w-plan').onclick=()=>{plan={tgt:id,ships:S.ships.filter(s=>!s.away).slice(0,1).map(s=>s.id),cnt:{},tactic:t.walls?'siege':'assault',pris:true,jarl:false};planSheet();};}
function planCrew(){const ids=[];for(const k in plan.cnt){const av=S.people.filter(p=>p.w===k&&!p.away&&p.sick<=0).sort((a,b)=>b.xp-a.xp);ids.push(...av.slice(0,plan.cnt[k]).map(p=>p.id));}return ids;}
function planSheet(){const t=TG(plan.tgt);const home=S.ships.filter(s=>!s.away);const cap=plan.ships.map(shipById).filter(Boolean).reduce((a,s)=>a+SHIPCAP[s.type].crew,0);
  const avail={};S.people.filter(p=>p.w&&!p.away&&p.sick<=0).forEach(p=>{avail[p.w]=(avail[p.w]||0)+1;});
  if(!Object.keys(plan.cnt).length){let room=cap;for(const k of ['warrior','spear','archer','skirm']){const n=Math.min(avail[k]||0,room);if(n)plan.cnt[k]=n;room-=n;}}
  const crew=planCrew();const r={tgt:plan.tgt,crew:crew,ships:plan.ships,tactic:plan.tactic,jarl:plan.jarl,odin:(S.blessOn.odinR||0)>0};const e=crew.length?estimate(r):{ratio:0,label:'—'};const prov=raidProvNeed(crew.length,t,plan.jarl);
  let h=head('Raid on '+t.n,travel(t)+' days each way · defence '+Math.round(tgtDef(t,plan.tactic,plan.tactic==='siege')));
  h+='<h3>Ships</h3>'+home.map(s=>'<label class="chk"><input type="checkbox" data-ps="'+s.id+'" '+(plan.ships.includes(s.id)?'checked':'')+'> '+esc(s.name)+' <span class="meta">'+SHIPS[s.type].name+' · '+SHIPCAP[s.type].crew+' crew · '+SHIPCAP[s.type].cargo+' cargo'+(s.type==='knarr'?' · poor in battle':'')+'</span></label>').join('');
  h+='<h3>Crew · '+crew.length+(plan.jarl?' + the Jarl':'')+' / '+cap+'</h3><table class="t">'+Object.keys(TROOPS).filter(k=>avail[k]).map(k=>'<tr><td>'+TROOPS[k].n+' <span class="meta">'+avail[k]+' ready</span></td><td><button type="button" class="btn small" data-pc="'+k+'" data-d="-1" aria-label="Fewer">−</button> <strong>'+(plan.cnt[k]||0)+'</strong> <button type="button" class="btn small" data-pc="'+k+'" data-d="1" aria-label="More">+</button></td></tr>').join('')+'</table>';
  h+='<h3>Tactic</h3><div class="prio" role="group">'+[['quick','Quick strike'],['assault','Full assault']].concat(t.walls?[['siege','Siege']]:[]).map(o=>'<button type="button" data-pt="'+o[0]+'" aria-pressed="'+(plan.tactic===o[0])+'">'+o[1]+'</button>').join('')+'</div><p class="meta">'+(plan.tactic==='quick'?'Surprise: the defence counts 20% less if the watchmen are caught napping (7 times in 10). You carry off 60% of the plunder and half the prisoners.':plan.tactic==='siege'?'Dig in for 3–5 rounds; each blockade round weakens the defenders by a tenth. Walls still help them. Costs more provisions.':'Everything on one blow.')+'</p>';
  h+='<label class="chk"><input type="checkbox" id="p-pris" '+(plan.pris?'checked':'')+'> Take prisoners as thralls</label>';
  const j=jarlP();if(j&&j.a<60)h+='<label class="chk"><input type="checkbox" id="p-jarl" '+(plan.jarl?'checked':'')+'> '+esc(pname(j))+' sails with them <span class="meta">+'+(jt('brave')?20:10)+'% strength, risks his life</span></label>';
  h+='<table class="t"><tr><td>Provisions</td><td>'+prov+' meals</td></tr><tr><td>Estimate</td><td><strong style="color:'+(e.label==='Easy'?'#3F5A35':e.label==='Risky'?'#8A6A1A':'#8E3B2F')+'">'+e.label+'</strong>'+(crew.length?' · about '+Math.round(e.chance*100)+'% to win':'')+'</td></tr></table>';
  const why=canRaid()||(!plan.ships.length?'Choose a ship':'')||(!crew.length?'Choose a crew':'')||(crew.length+(plan.jarl?1:0)>cap?'Too many men for the ships':'')||(foodUnits()<prov?'Not enough food for provisions':'');
  h+='<div class="acts">'+btn('p-back','Back')+btn('p-go','Send the raid',{cls:'primary',dis:!!why})+'</div>'+(why?'<p class="meta">'+esc(why)+'.</p>':'');
  openSheet(h,'panel');const card=$('sheet-card');
  card.querySelectorAll('[data-ps]').forEach(b=>b.onchange=()=>{const id=+b.dataset.ps;plan.ships=b.checked?plan.ships.concat([id]):plan.ships.filter(x=>x!==id);planSheet();});
  card.querySelectorAll('[data-pc]').forEach(b=>b.onclick=()=>{const k=b.dataset.pc;plan.cnt[k]=clamp((plan.cnt[k]||0)+(+b.dataset.d),0,avail[k]||0);planSheet();});
  card.querySelectorAll('[data-pt]').forEach(b=>b.onclick=()=>{plan.tactic=b.dataset.pt;planSheet();});
  $('p-pris').onchange=()=>{plan.pris=$('p-pris').checked;};if($('p-jarl'))$('p-jarl').onchange=()=>{plan.jarl=$('p-jarl').checked;planSheet();};
  $('p-back').onclick=()=>targetSheet(plan.tgt);
  $('p-go').onclick=()=>{const w=launchRaid({tgt:plan.tgt,ships:plan.ships,crew:planCrew(),tactic:plan.tactic,pris:plan.pris,jarl:plan.jarl});if(w){toast(w);return;}closeSheet();worldClose();save();};}
function sagaPanel(){const g=currentGoal();
  let h=head('Saga of Kaldstrand','Fame '+fmt(S.fame)+' · '+MODES[S.mode].n+' · slot '+(curSlot||1));
  h+='<h3>Goals</h3>'+MS.filter(m=>m.lv<=thLevel()).map(m=>{const done=S.ms.includes(m.id),now=g&&g.id===m.id;return '<div class="ms'+(done?' done':now?' now':'')+'"><i aria-hidden="true"></i><div><strong>'+esc(m.title)+'</strong><br><span class="meta">'+esc(m.goal)+(m.unlock.length?' · unlocks '+esc(m.unlock.map(u=>DEF[u].name).join(', ')):'')+'</span></div><span class="f">+'+m.fame+'</span></div>';}).join('');
  if(S.guide===-1)h+='<p><button type="button" class="btn" id="sg-guide">Show the guide again</button></p>';
  const onA=[];h+=advisorsHtml(onA);h+=testToolsHtml(onA);
  h+='<h3>The gods</h3><table class="t">'+GOD_KEYS.map(k=>'<tr><td>'+GODS[k].n+'</td><td>'+bar(S.gods[k],S.gods[k]<20?'#A34A3A':S.gods[k]>=50?'#5E7A4E':'#C9A64A')+' '+Math.round(S.gods[k])+'</td></tr>').join('')+'</table><p class="meta">50+: the god’s gift is active. 80+: you may ask a blessing at the altar. Below 20: the god may curse you.</p>';
  h+='<h3>The saga so far</h3>'+S.saga.slice().reverse().slice(0,40).map(e=>'<p class="saga">Year '+e.y+'. '+esc(e.t)+'</p>').join('');
  h+='<h3>Controls on a computer</h3><div class="keys"><kbd>Drag · right-drag</kbd><span>Move the map</span><kbd>Roads</kbd><span>Click a start, move to the end, click, then Build road (or Enter)</span><kbd>W A S D / arrows</kbd><span>Move the map</span><kbd>Wheel · + −</kbd><span>Zoom</span><kbd>Space</kbd><span>Pause or resume</span><kbd>0 1 2 3</kbd><span>Speed ½× 1× 2× 4×</span><kbd>B · E</kbd><span>Build · roads</span><kbd>R · Enter</kbd><span>Rotate · place a building</span><kbd>Esc</kbd><span>Cancel or close</span><kbd>V P G M J · H</kbd><span>Village, People, War, World, Saga · home</span></div>';
  h+='<p class="meta">Ubbe’s Saga '+esc(GAME_VERSION)+'</p>';
  h+='<h3>Save</h3><p>The saga saves itself in this browser. Export a code to keep a copy or move it to another device.</p><div class="acts"><button type="button" class="btn" id="sv-title">Title screen</button><button type="button" class="btn" id="sv-imp">Import</button><button type="button" class="btn primary" id="sv-exp">Export</button></div><div id="sv-box"></div>';
  openSheet(h,'panel');$('sheet-card').dataset.p='saga';onA.forEach(f=>f());
  if($('sg-guide'))$('sg-guide').onclick=()=>{S.guide=0;guideKey='';closeSheet();renderGuide();};
  $('sv-exp').onclick=()=>{save();const code=exportCode();$('sv-box').innerHTML='<textarea id="sv-code" readonly aria-label="Save code"></textarea><div class="acts"><button type="button" class="btn small" id="sv-copy">Copy</button></div>';$('sv-code').value=code;$('sv-copy').onclick=()=>{const ta=$('sv-code');try{navigator.clipboard.writeText(code).then(()=>toast('Save code copied.'),()=>{ta.select();toast('Select the code and copy it.');});}catch(e){ta.select();toast('Select the code and copy it.');}};};
  $('sv-imp').onclick=()=>{$('sv-box').innerHTML='<textarea id="sv-in" aria-label="Paste a save code" placeholder="Paste a save code here"></textarea><div class="acts"><button type="button" class="btn small primary" id="sv-load">Load into this slot</button></div>';$('sv-load').onclick=()=>{const ok=importCode($('sv-in').value.trim());if(ok){closeSheet();toast('Saga loaded.');}else toast('That code could not be read. Check it was copied whole.');};};
  $('sv-title').onclick=()=>{save();closeSheet();showTitle('home');};}
const ADV_P={floki:{g:'m',a:44,look:901,tr:'',xp:0,id:-1},lagertha:{g:'f',a:40,look:77,xp:0,id:-2},bjorn:{g:'m',a:30,look:5,xp:3,w:'warrior',id:-3},athelstan:{g:'m',a:33,look:640,xp:0,id:-4},thorbjorg:{g:'f',a:62,look:313,xp:0,id:-5},egil:{g:'m',a:52,look:1203,xp:0,id:-6}};

/* building sheets for new systems (called from buildingSheet) */
function altarHtml(on){let h='<p>Offer goods to raise a god’s favour. At 50 the god’s gift works for you; at 80 you can ask a blessing (costs 30 favour).</p>';
  for(const k of GOD_KEYS){const G=GODS[k],f=S.gods[k],cd=Math.max(0,(S.blessCd[k]||0)-S.day);
    h+='<div class="god"><div class="gh"><strong>'+G.n+'</strong> '+bar(f,f<20?'#A34A3A':f>=50?'#5E7A4E':'#C9A64A')+' <span class="num">'+Math.round(f)+'</span></div><div class="meta">Likes: '+esc(G.likes)+'. Gift at 50: '+esc(G.pass)+(f>=50?' (active)':'')+'.</div><div class="gb">'+
      G.off.map((o,i)=>'<button type="button" class="btn small" data-off="'+k+'" data-i="'+i+'" '+(S.res[o[0]]>=o[1]?'':'disabled')+'>'+o[1]+' '+esc(RNAME[o[0]].toLowerCase())+' → +'+o[2]+'</button>').join('')+
      '<button type="button" class="btn small primary" data-bl="'+k+'" '+(f>=80&&!cd?'':'disabled')+'>'+esc(G.bless.n)+'</button></div><div class="meta">'+esc(G.bless.d)+(cd?' · again in '+cd+' days':'')+'</div></div>';}
  on.push(()=>{const card=$('sheet-card');card.querySelectorAll('[data-off]').forEach(b=>b.onclick=()=>{const k=b.dataset.off,o=GODS[k].off[+b.dataset.i];if(S.res[o[0]]<o[1])return;S.res[o[0]]-=o[1];addFavor(k,o[2]);S.offers=(S.offers||0)+1;if(k==='loki'&&Math.random()<0.3){const good=Math.random()<0.5;if(good){S.res.silver+=15;toast('Loki laughs. You find 15 silver in the offering bowl.');}else{S.res.wood*=0.9;toast('Loki laughs. Some wood has gone missing.');}}checkMilestones();buildingSheet(sel.b);save();});
    card.querySelectorAll('[data-bl]').forEach(b=>b.onclick=()=>{const k=b.dataset.bl;if(S.gods[k]<80)return;S.gods[k]-=has('hof')?20:30;S.blessCd[k]=S.day+30;S.blessCount=(S.blessCount||0)+1;
      if(k==='freyja')S.blessOn.freyja=S.day+15;if(k==='thor')S.blessOn.thor=S.day+30;if(k==='odin')S.blessOn.odinR=1;if(k==='njord')S.blessOn.njordV=1;if(k==='loki')S.blessOn.lokiR=1;
      toast(GODS[k].bless.n+': '+GODS[k].bless.d+'.',4000);checkMilestones();buildingSheet(sel.b);save();});});
  return h;}
function trainHtml(b,on){const room=warCap()-S.warriors,batch=Math.min(room,b.lvl>=2?8:5);const avT=Object.keys(TROOPS).filter(k=>TROOPS[k].lv<=thLevel()&&k!=='merc');if(!avT.includes(S.trainType))S.trainType=avT[avT.length-1];
  let h='<table class="t"><tr><td>Warriors</td><td>'+S.warriors+' / '+warCap()+'</td></tr>'+(S.train?'<tr><td>In training</td><td>'+S.train.n+' '+TROOPS[S.train.type].n.toLowerCase()+'s · '+S.train.left+' days left</td></tr>':'')+'</table>';
  h+='<h3>Train as</h3><div class="prio" role="group">'+avT.map(k=>'<button type="button" data-tt="'+k+'" aria-pressed="'+(S.trainType===k)+'">'+TROOPS[k].n+'</button>').join('')+'</div>';
  const T=TROOPS[S.trainType];h+='<p>'+esc(T.d)+' Strength '+T.str+'. Each recruit takes '+esc(costStr(T.eq))+'.</p><p class="meta">A batch trains for 10 days. Recruits leave their work. Warriors eat 1½ meals but help with chores in winter.</p>';
  if(!S.train&&batch>0)h+='<div class="acts">'+btn('tr-go','Train '+batch+' '+T.n.toLowerCase()+'s',{cls:'primary'})+'</div>';
  if(batch<=0)h+='<div class="meta">The Town Hall must rise to hold more warriors.</div>';
  on.push(()=>{$('sheet-card').querySelectorAll('[data-tt]').forEach(x=>x.onclick=()=>{S.trainType=x.dataset.tt;buildingSheet(b);});if($('tr-go'))$('tr-go').onclick=()=>{const why=startTraining(S.trainType);if(why){toast(why);return;}toast('Training has begun.');buildingSheet(b);save();};});
  return h;}
function smithHtml(b,on){const modes=Object.keys(SMITH).filter(k=>SMITH[k].lv<=thLevel());if(!modes.includes(b.mode))b.mode='tools';
  let h='<div class="meta">Anvil: '+Math.max(0,Math.round(b.anvil))+'% · iron in store: '+fmt(S.res.iron)+(S.res.iron<10?' (keep 10 for a new anvil)':'')+'</div>';
  if(modes.length>1){h+='<h3>Forging</h3><div class="tabs" role="group">'+modes.map(k=>'<button type="button" data-m="'+k+'" aria-pressed="'+(b.mode===k)+'">'+SMITH[k].n+'</button>').join('')+'</div><p class="meta">'+SMITH[b.mode].per+' per worker a day from '+esc(costStr(SMITH[b.mode].c))+' each. In store: '+fmt(S.res[b.mode])+'.</p>';
    on.push(()=>{$('sheet-card').querySelectorAll('[data-m]').forEach(x=>x.onclick=()=>{b.mode=x.dataset.m;buildingSheet(b);save();});});}
  return h;}
