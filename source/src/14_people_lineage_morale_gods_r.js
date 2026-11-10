/* =================== people, lineage, morale, gods, raids, events =================== */
const YDAYS=45;
const MNAMES=['Arne','Bjarni','Gunnar','Halfdan','Ivar','Ketil','Leif','Orm','Ragnvald','Sigurd','Sven','Thorkel','Ulf','Vidar','Asger','Brand','Eirik','Finn','Geir','Hakon','Hrafn','Kari','Njal','Olaf','Rolf','Skuli','Starkad','Toki','Yngvar','Agnar','Bodvar','Dag','Grim','Hogni','Knut','Steinar','Torvald','Vali','Hauk','Ottar'];
const FNAMES=['Astrid','Bergljot','Dagny','Freydis','Gudrun','Gunnhild','Helga','Hild','Ingrid','Jorunn','Ragnhild','Sigrid','Solveig','Thyra','Turid','Asa','Aud','Bodil','Eydis','Frida','Gyda','Halla','Herdis','Inga','Ragna','Rannveig','Signy','Svanhild','Tove','Ylva','Alfhild','Hallveig','Jofrid','Liv','Una','Vigdis','Embla','Geirny','Osk','Ulfhild'];
const TRAITS={steady:{n:'Steady Hand',d:'Crafts go faster (+3% each, up to 15%)'},strong:{n:'Strong',d:'Woodcutting and mining go faster; hits harder'},patient:{n:'Patient',d:'Fishing and preserving go faster'},hawk:{n:'Hawk-Eyed',d:'Better hunter; a deadly archer'},seafarer:{n:'Seafarer',d:'Ships are built faster'},hot:{n:'Hot-Blooded',d:'Fights harder, quarrels more'},frail:{n:'Frail',d:'Falls sick more easily'},lazy:{n:'Lazy',d:'Does a little less work'}};
const TRAIT_KEYS=Object.keys(TRAITS);
const JTRAITS={ambitious:{n:'Ambitious',d:'+10% fame'},devout:{n:'Devout',d:'The gods’ favour rises 25% faster'},wise:{n:'Wise',d:'Better prices and better at haggling'},brave:{n:'Brave',d:'+20% raid strength when he sails'},cruel:{n:'Cruel',d:'Harsh choices in events; −3 morale'},greedy:{n:'Greedy',d:'+15% loot; −3 morale'}};
const ADVISORS={floki:{n:'Floki',role:'Shipwright',b:'Ships cost 20% less and are built 20% faster.',q:'“The sea is a road, if your ship is honest.”'},
  lagertha:{n:'Lagertha',role:'Lawspeaker',b:'+6 morale. Warriors fight 5% better.',q:'“People follow a Jarl who is fair before he is feared.”'},
  bjorn:{n:'Bjorn',role:'Warlord',b:'Warriors fight 15% better.',q:'“Train them hard. The sea forgives nothing.”'},
  athelstan:{n:'Athelstan',role:'Merchant and scholar',b:'Merchants pay 20% more and sell 15% cheaper.',q:'“Silver opens more doors than axes.”'},
  thorbjorg:{n:'Thorbjörg',role:'Völva',b:'The gods’ favour rises 30% faster. Her winter forecasts are never wrong.',q:'“I see the winter before it comes.”'},
  egil:{n:'Egil',role:'Skald',b:'+20% fame from every source.',q:'“Deeds die. Songs do not.”'}};
const ROMAN=['','','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
const MODES={relaxed:{n:'Relaxed',d:'Hunger drives families away but never kills. Odin’s wrath is mild. Recommended.'},challenge:{n:'Challenge',d:'Hard winters. People starve. The Jarl can fall in battle. A revolt or a broken line ends the saga.'},sandbox:{n:'Sandbox',d:'Endless stores and every building of level 1 open. For building freely.'},
  test:{n:'Test',d:'Pick a Town Hall level and start in a finished village of that age: every building at its limit and highest level. Test tools and 8×/16× speed.'}};
const RATION={normal:{f:1,m:0,n:'Normal'},reduced:{f:0.8,m:-8,n:'Reduced'},severe:{f:0.6,m:-20,n:'Severe'}};
const FARMLIKE=new Set(['hay','garden','grain','flax','berry','pen']);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const U=(a,b)=>a+Math.random()*(b-a);
const yearNow=()=>Math.floor(S.gameT/YEAR)+1;
const PB=id=>{for(const p of S.people)if(p.id===id)return p;return null;};
const jarlP=()=>PB(S.jarl);
const jt=k=>{const j=jarlP();return !!(j&&j.jt&&j.jt.includes(k));};
function pname(p){if(!p)return '—';if(p.num)return p.num===1?'Ubbe Ragnarsson':'Ubbe '+ROMAN[p.num];return p.n;}
function roleOf(p){if(p.id===S.jarl)return 'Jarl';if(p.away)return 'At sea';if(S.train&&S.train.ids.includes(p.id))return 'In training';if(p.w)return (TROOPS[p.w]||{n:'Warrior'}).n+(p.xp>=2?' · Drengr':'');if(p.sick>0)return p.wound?'Wounded':'Sick';if(p.a<14)return S.pol.child&&p.a>=10?'Child (works)':'Child';if(p.a>=50)return 'Elder';return 'Worker';}

/* ---------- troops & weapons ---------- */
const TROOPS={skirm:{n:'Skirmisher',lv:2,str:1,eq:{spears:1},d:'Light spear. Cheap and quick to train.'},
  spear:{n:'Spearman',lv:3,str:1.6,eq:{spears:1,shields:1},d:'Spear and shield. Good value.'},
  archer:{n:'Archer',lv:3,str:1.4,eq:{bows:1,arrows:20},d:'Bow and 20 arrows. Strikes from range.'},
  warrior:{n:'Warrior',lv:3,str:2.2,eq:{swords:1,shields:1},d:'Sword and shield. The battle line.'}};
const SMITH={tools:{n:'Tools',lv:1,per:0.5,c:{iron:1,wood:0.5}},spears:{n:'Spears',lv:2,per:0.5,c:{iron:1,wood:0.5}},
  shields:{n:'Shields',lv:3,per:0.5,c:{planks:1,iron:0.5}},bows:{n:'Bows',lv:3,per:0.5,c:{wood:1.5}},
  arrows:{n:'Arrows',lv:3,per:6,c:{wood:0.1,iron:0.05}},swords:{n:'Swords',lv:3,per:0.25,c:{iron:2,wood:0.5}}};
const PRIMARY={skirm:'spears',spear:'spears',archer:'bows',warrior:'swords'};

/* ---------- gods ---------- */
const GODS={odin:{n:'Odin',likes:'Fame, brave deaths, sacrifice',pass:'+10% fame',bless:{n:'Raven’s Eye',d:'The next raid fights 25% harder'},off:[['hides',5,5],['spears',2,6],['silver',10,8],['misc',4,6]]},
  thor:{n:'Thor',likes:'Victories and a strong defence',pass:'+10% strength in battle',bless:{n:'Hammer Ward',d:'Warriors fight 20% harder for 30 days'},off:[['meat',10,5],['iron',5,5],['misc',4,6]]},
  freyja:{n:'Freyja',likes:'Harvests and births',pass:'+10% from farms, gatherers and the pen; more births',bless:{n:'Rich Harvest',d:'+30% from farms and gatherers for 15 days'},off:[['wool',5,6],['berries',15,5],['veg',10,5],['misc',4,5]]},
  njord:{n:'Njord',likes:'Ships, fishing and trade',pass:'+10% fishing and salt; fewer storms',bless:{n:'Fair Winds',d:'The next voyage is safe and twice as fast'},off:[['fish',15,5],['rope',3,6],['dfish',5,5],['misc',4,5]]},
  loki:{n:'Loki',likes:'Chaos and cunning',pass:'Strange things happen more often',bless:{n:'Trickster’s Wager',d:'The next raid brings double loot, or none'},off:[['misc',3,6],['planks',10,5],['silver',5,6]]}};
const GOD_KEYS=Object.keys(GODS);
function addFavor(g,v){if(!S.gods)return;if(v>0){if(jt('devout'))v*=1.25;if(has('hof'))v*=1.25;if(hasAdv('thorbjorg'))v*=1.3;}S.gods[g]=clamp(S.gods[g]+v,0,100);if(g==='loki'&&v>0)S.gods.thor=Math.max(0,S.gods.thor-v*0.3);}
function addFame(v){if(v>0){if(hasAdv('egil'))v*=1.2;if(jt('ambitious'))v*=1.1;if(S.gods&&S.gods.odin>=50)v*=1.1;S.fameEarned=(S.fameEarned||0)+v;}S.fame=Math.max(0,S.fame+v);if(S.yr)S.yr.fame+=v;return v;}

/* ---------- world ---------- */
const TARGETS=[
  {id:'hval',n:'Hvalsey',type:'Fishing hamlet',x:46,y:92,d:3,def:4,loot:{fish:60,dfish:30,misc:6,silver:10},pris:4},
  {id:'sogn',n:'Sogn outpost',type:'Outpost',x:96,y:100,d:3,def:8,loot:{wood:80,iron:30,hides:10,silver:20},pris:4},
  {id:'hord',n:'Hordaland',type:'Hall of Jarl Hrolf the Grey',x:58,y:158,d:4,def:18,loot:{silver:70,iron:40,spears:6,shields:4,meat:30},pris:8,jarl:true},
  {id:'ringa',n:'Ringsaker',type:'Farmsteads by the lake',x:138,y:118,d:4,def:9,loot:{grain:80,meat:60,wool:30,silver:25},pris:6,herd:3},
  {id:'skir',n:'Skiringssal',type:'Market town',x:134,y:190,d:5,def:15,loot:{silver:90,cloth:15,salt:30,tools:4},pris:6,trade:true},
  {id:'jut',n:'Jutland',type:'Hall of Jarl Sigvard',x:118,y:248,d:6,def:24,loot:{silver:110,swords:3,iron:50,meat:40},pris:8,jarl:true},
  {id:'hedeby',n:'Hedeby',type:'Great market behind a rampart',x:140,y:282,d:7,def:44,loot:{silver:320,cloth:30,swords:6,tools:10},pris:12,trade:true,walls:true},
  {id:'birka',n:'Birka',type:'Trading town on an island',x:236,y:176,d:9,def:32,loot:{silver:240,hides:30,cloth:20,misc:12},pris:10,trade:true,walls:true}];
const TG=id=>TARGETS.find(t=>t.id===id);
const SHIPCAP={karvi:{crew:15,cargo:120},knarr:{crew:8,cargo:250}};
const TRADE_MULT={skir:{sell:1,buy:1},hedeby:{sell:1.1,buy:0.9},birka:{sell:1.15,buy:1}};

/* ---------- state ---------- */
function newPerson(o){const p=Object.assign({id:S.nextPid++,n:'',g:Math.random()<0.5?'m':'f',a:20,sp:0,pa:[0,0],tr:'',w:'',xp:0,sick:0,wound:0,ua:0,away:0,look:Math.floor(Math.random()*1e6),num:0,jt:null},o||{});
  if(!p.n)p.n=pick(p.g==='m'?MNAMES:FNAMES);if(p.tr===undefined||p.tr===null)p.tr='';S.people.push(p);return p;}
function randTrait(){return Math.random()<0.25?pick(TRAIT_KEYS):'';}
function marry(a,b){a.sp=b.id;b.sp=a.id;}
function freshState(mode,adv){
  mode=mode||'relaxed';
  const r=EMPTY_RES();Object.assign(r,{fish:40,berries:40,dfish:20,wood:80,planks:20,tools:6,water:100});
  S={v:3,mode:mode,gameT:20,day:0,pop:11,fame:0,res:r,woodReserve:40,reserve:{},th:1,herd:{pigs:2,sheep:2},herdAcc:0,warriors:0,train:null,ships:[],trades:0,trader:null,
     ms:[],avail:START_AVAIL.slice(),saga:[{y:1,t:'Ragnar has fallen. Ubbe, his son, came to this cold shore with eleven souls and raised a hall.'}],bal:null,lastShort:'',
     people:[],nextPid:1,jarl:0,heir:0,gen:1,morale:60,mf:[],attr:35,af:[],mods:[],gods:{odin:40,thor:40,freyja:40,njord:40,loki:30},blessCd:{},blessOn:{},offers:0,
     adv:adv||'',pol:{ration:'normal',rite:'cremation',child:false,borders:'open',loot:'jarl',thralls:'soft'},thralls:0,thrallSave:0,contam:0,
     raids:[],tg:{},raidsDone:0,winter:{hard:false,said:false,told:false},fx:{},modal:[],nextEvt:14,evtSeen:{},yr:{births:0,deaths:0,arrived:0,left:0,raids:0,silver:0,fame:0},
     lowDays:0,wrathWarn:0,wrathCd:0,shipSeq:1,over:false,meta:null,maps:{},mkt:{},advs:adv?[adv]:[],mobilUntil:0,banqN:0,wallClosed:false,feast:null};
  walls=new Uint8Array(N*N);
  B=[];nextId=1;roads=new Uint8Array(N*N);defaultZones();ter.set(TER0);
  for(const t of trees){t.amt=TREE_WOOD;t.regrow=0;t.gone=0;}S.cleared=[];for(const b of bushes)b.amt=15;
  addBuilding('th',TH_POS.fx,TH_POS.fy,0,true);
  rebuildOcc();[[46,46],[56,46]].forEach(q=>{if(canPlace('house',q[0],q[1],0,0).ok)addBuilding('house',q[0],q[1],0,true);rebuildOcc();});
  for(let x=46;x<=57;x++){if(BUILDABLE.has(tAt(x,49))&&!occ[49*N+x])roads[49*N+x]=1;}[[51,50],[51,51],[51,52]].forEach(p=>{if(BUILDABLE.has(tAt(p[0],p[1])))roads[p[1]*N+p[0]]=1;});
  rebuildOcc();recomputeConn();
  /* the founding household */
  const ubbe=newPerson({n:'Ubbe',g:'m',a:31,num:1,jt:['ambitious','devout'],look:31,tr:'',scar:1});
  const thora=newPerson({n:'Thora',g:'f',a:28,look:28});marry(ubbe,thora);
  const son=newPerson({n:'Ubbe',g:'m',a:6,num:2,pa:[ubbe.id,thora.id],look:6});
  S.jarl=ubbe.id;S.heir=son.id;
  [['Arne','m',34,'Gudrun','f',31],['Ketil','m',27,'Sigrid','f',25],['Orm','m',38,'Helga','f',36]].forEach(c=>{const a=newPerson({n:c[0],g:c[1],a:c[2],tr:randTrait()}),b=newPerson({n:c[3],g:c[4],a:c[5],tr:randTrait()});marry(a,b);});
  newPerson({n:'Leif',g:'m',a:19,tr:'strong'});newPerson({n:'Ylva',g:'f',a:18,tr:randTrait()});
  if(mode==='sandbox'){S.fame=5000;Object.keys(DEF).forEach(k=>{if(DEF[k].lvl===1&&!S.avail.includes(k))S.avail.push(k);});}
  syncPop();recalcMorale();
}
function syncPop(){S.pop=S.people.length;S.warriors=S.people.filter(p=>p.w).length;}

/* ---------- workforce, food ---------- */
function workerVal(p,win){if(p.id===S.jarl||p.sick>0||p.away)return 0;if(S.train&&S.train.ids.includes(p.id))return 0;if(p.w&&!win)return 0;
  let v=p.a>=14?(p.a>=50?0.5:1):(S.pol.child&&p.a>=10?0.5:0);if(p.tr==='lazy')v*=0.85;return v;}
function workforce(){if(!S.people)return 0;const win=isWinter();let s=0;for(const p of S.people)s+=workerVal(p,win);s+=S.thralls*(S.pol.thralls==='harsh'?1.15:1);return Math.max(0,Math.round(s));}
function eatNeed(){if(!S.people)return 0;let s=0;for(const p of S.people){if(p.away)continue;s+=p.w?EAT*WAR_EAT:(p.a<14||p.a>=50?EAT*0.5:EAT);}s+=S.thralls*EAT*0.5;return s*RATION[S.pol.ration].f;}
function drinkers(){let n=S.thralls;for(const p of S.people)if(!p.away)n++;return n;}
function thrallCap(){return B.filter(b=>b.t==='thrall').reduce((a,b)=>a+8+4*(b.lvl-1),0);}
function spendMeals(m){const order=['fish','berries','meat','veg','bread','dfish','jam','pickles','smoked','sausage'];if(foodUnits()<m)return false;for(const k of order){if(m<=0)break;const e=Math.min(S.res[k],m/MEAL[k]);S.res[k]-=e;m-=e*MEAL[k];}return true;}
let _hk={d:-1,on:false};
const hallKeep=k=>{if(S.saveHall===false)return 0;const d=Math.floor(S.gameT/DAY);if(_hk.d!==d){_hk.d=d;const q=thReq();_hk.on=!!q&&q.items.slice(0,-1).every(i=>i.ok||/^Survive/.test(i.t));}if(!_hk.on)return 0;const q=TH_UP[thLevel()+1];return q&&q.cost[k]?q.cost[k]:0;};
const resv=k=>Math.max(0,S.res[k]-Math.max((S.reserve&&S.reserve[k])||0,hallKeep(k))-(k==='wood'?S.woodReserve:0));

/* ---------- morale & attractiveness ---------- */
function addMod(k,t,v,days){S.mods=S.mods.filter(m=>m.k!==k);S.mods.push({k:k,t:t,v:v,until:S.day+days});}
function bDist(a,b){const dx=Math.max(0,a.fx-(b.fx+b.w-1),b.fx-(a.fx+a.w-1)),dy=Math.max(0,a.fy-(b.fy+b.h-1),b.fy-(a.fy+a.h-1));return Math.max(dx,dy);}
function recalcMorale(){
  const f=[],r=S.res,add=(t,v)=>{if(v)f.push({t:t,v:Math.round(v)});};
  const ls=S.lastShort;
  if(ls==='food')add('Hunger',-20);else if(ls==='water')add('Thirst',-15);else if(ls==='firewood')add('Cold houses',-15);
  const variety=FOOD.filter(k=>r[k]>=1).length;add(variety>=6?'A rich table ('+variety+' foods)':variety>=4?'Varied food ('+variety+' kinds)':variety<=2?'Dull food':'',variety>=6?10:variety>=4?5:variety<=2?-5:0);
  add(RATION[S.pol.ration].m?'Rationing: '+RATION[S.pol.ration].n.toLowerCase():'',RATION[S.pol.ration].m);
  if(has('altar'))add('An altar in the village',4);
  const avg=GOD_KEYS.reduce((a,g)=>a+S.gods[g],0)/5;if(avg>=50)add('The gods are pleased',5);if(GOD_KEYS.some(g=>S.gods[g]<20))add('A god is angry',-5);
  const sick=S.people.filter(p=>p.sick>0).length;if(sick)add(sick+' sick or wounded',-Math.min(15,sick*3));
  if(hasAdv('lagertha'))add('Lagertha’s fair judgement',6);
  if(S.pol.child)add('Children at work',-10);
  if(jt('cruel'))add('A cruel Jarl',-3);if(jt('greedy'))add('A greedy Jarl',-3);
  if(S.pol.loot==='warriors'&&S.raidsDone)add('Loot shared with the crews',4);
  if(S.thralls>0&&S.pol.thralls==='harsh')add('Thralls beaten in the yard',-2);
  if(S.pop>housing())add('Crowded houses',-6);if(isWinter()&&S.res.clothes>=S.pop)add('Warm cloaks for all',4);if(S.mobilUntil>S.day)add('Mobilised for war',-5);
  for(const m of S.mods)if(m.until>S.day)add(m.t,m.v);
  S.mods=S.mods.filter(m=>m.until>S.day);
  S.mf=f;const target=clamp(52+f.reduce((a,x)=>a+x.v,0),0,100);
  S.moraleTarget=target;const d=target-S.morale;S.morale=clamp(S.morale+Math.sign(d)*Math.min(Math.abs(d),3),0,100);
  /* attractiveness */
  const a=[],ad=(t,v)=>{if(v)a.push({t:t,v:Math.round(v)});};
  ad('Base',25);if(has('market'))ad('Market square',15);if(has('jarl'))ad('Jarl’s House',8);
  ad('Fame',Math.min(15,S.fame/25));
  const deco=Math.min(20,B.reduce((s,b)=>s+(DEF[b.t].deco||0),0));ad('Decorations',deco);
  const hs=B.filter(b=>b.t==='house');if(hs.length){ad('Better houses',4*(hs.reduce((s,b)=>s+b.lvl,0)/hs.length-1));
    const near=(t,rr)=>hs.filter(h=>B.some(o=>o.t===t&&bDist(h,o)<=rr)).length;
    ad('Houses by the market',Math.min(6,near('market',4)));ad('Houses by the smithy or smokehouse',-Math.min(8,2*(near('smith',2)+near('smoke',2))));}
  if(S.contam>0)ad('Foul water',-10);
  ad(S.pol.borders==='open'?'Open borders':'Closed borders',S.pol.borders==='open'?8:-5);
  if(S.morale>=70)ad('Happy people',5);else if(S.morale<40)ad('Unhappy people',-10);
  S.af=a;S.attr=clamp(a.reduce((s,x)=>s+x.v,0),0,100);
}
const moraleProd=()=>S.morale>=70?1.1:S.morale<40?0.85:1;

/* ---------- production multipliers ---------- */
const NB={smith:['mine'],carp:['wood'],pres:['fish','hunter'],smoke:['fish','hunter']};
function nbOf(b){const l=NB[b.t];if(!l)return null;const o=B.find(x=>x!==b&&l.includes(x.t)&&bDist(b,x)<=4);return o?DEF[o.t].name:null;}
function traitBonus(t){const tc=S.tc||{};const m=k=>Math.min(0.15,0.03*(tc[k]||0));
  if(['carp','smith','weaver','bakery'].includes(t))return 1+m('steady');if(t==='wood'||t==='mine')return 1+m('strong');if(['fish','pres','smoke'].includes(t))return 1+m('patient');if(t==='hunter')return 1+m('hawk');if(t==='shipyard')return 1+m('seafarer');return 1;}
function prodMult(b){const t=b.t;let m=moraleProd()*traitBonus(t);
  if(nbOf(b))m*=1.15;
  if(S.gods.freyja>=50&&FARMLIKE.has(t))m*=1.1;if(S.gods.njord>=50&&(t==='fish'||t==='salt'))m*=1.1;
  if((S.blessOn.freyja||0)>S.day&&FARMLIKE.has(t))m*=1.3;
  if((S.fx.dry||0)>S.day&&FARMLIKE.has(t))m*=0.7;if((S.fx.bear||0)>S.day&&t==='wood')m*=0.5;if((S.fx.nofish||0)>S.day&&t==='fish')m*=0.7;
  if(t==='fish'&&isWinter()&&S.winter.hard)m*=0.8;
  if(t==='shipyard'&&hasAdv('floki'))m*=1.2;
  return m;}

/* ---------- daily people simulation ---------- */
function removePerson(p,cause){S.people=S.people.filter(o=>o!==p);if(p.sp){const s=PB(p.sp);if(s)s.sp=0;}
  if(S.train)S.train.ids=S.train.ids.filter(i=>i!==p.id);
  for(const r of S.raids)r.crew=r.crew.filter(i=>i!==p.id);
  if(S.heir===p.id)S.heir=0;
  if(cause!=='left'){S.yr.deaths++;
    if(S.pol.rite==='cremation'&&has('pyre')&&S.res.wood>=8)S.res.wood-=8;else S.contam=Math.max(S.contam,12);
    if(cause==='battle'){if(S.gods.freyja>=70&&Math.random()<0.5)addFavor('freyja',2);else addFavor('odin',2);}
    if(p.sp||p.pa[0]||p.pa[1])addMod('grief'+S.day,'Mourning the dead',-2,15);}
  else S.yr.left++;
  if(p.id===S.jarl)succession(cause);
  syncPop();}
function kidsOf(id){return S.people.filter(p=>p.pa[0]===id||p.pa[1]===id).sort((a,b)=>b.a-a.a);}
function defaultHeir(j){const k=kidsOf(j.id);return (k.find(p=>p.g==='m')||k[0]||null);}
function succession(cause){const was=S.jarl;let h=S.heir?PB(S.heir):null;
  if(!h){const k=S.people.filter(p=>p.pa.includes(was)).sort((a,b)=>b.a-a.a);h=k.find(p=>p.g==='m')||k[0]||null;}
  if(!h){if(S.mode==='challenge'){S.jarl=0;gameOver('The line of Ubbe is broken. No son or daughter of his blood remains, and Kaldstrand passes to strangers.');return;}
    h=S.people.filter(p=>p.a>=16).sort((a,b)=>(b.xp-a.xp)||(b.a-a.a))[0];if(!h){S.jarl=0;return;}
    addMod('noline','A Jarl not of Ubbe’s blood',-8,90);}
  S.gen++;S.jarl=h.id;if(!h.jt)h.jt=[pick(Object.keys(JTRAITS))].concat(Math.random()<0.5?[]:[pick(Object.keys(JTRAITS))]).filter((v,i,a)=>a.indexOf(v)===i);
  if(h.w){h.w='';}h.away=0;
  const nh=defaultHeir(h);S.heir=nh?nh.id:0;
  addMod('succ','A new Jarl',-6,30);
  S.saga.push({y:yearNow(),t:(cause==='battle'?'The Jarl fell in battle. ':cause==='deposed'?'':'The Jarl died. ')+pname(h)+' took the high seat of Kaldstrand.'});
  queueModal({k:'funeral',name:cause==='deposed'?'':'x',heir:h.id,cause:cause});}
function gameOver(text){S.over=true;S.modal=[{k:'over',text:text}];}
function sicken(n,wound){const pool=S.people.filter(p=>p.sick<=0&&!p.away);for(let i=0;i<n&&pool.length;i++){const p=pool.splice(Math.floor(Math.random()*pool.length),1)[0];p.sick=wound?10:Math.round(U(4,8));p.wound=wound?1:0;}}
function peopleDay(short){
  const win=isWinter(),hard=win&&S.winter.hard;
  const tc={};for(const p of S.people)if(p.tr&&p.a>=14&&!p.away)tc[p.tr]=(tc[p.tr]||0)+1;S.tc=tc;
  const crowd=S.pop/Math.max(1,housing());
  const sickN=S.people.filter(p=>p.sick>0&&!p.wound).length;
  for(const p of S.people.slice()){
    p.a+=1/YDAYS;
    if(p.sick>0){p.sick--;if(p.sick<=0){p.sick=0;const dieP=(S.mode==='challenge'?0.06:0.01)*(p.a>=50||p.a<5?3:1)*(p.wound?2:1);p.wound=0;if(Math.random()<dieP){note(pname(p)+' did not recover.');removePerson(p,'sickness');continue;}}}
    else if(!p.away){let ch=0;
      if(win)ch+=0.0015*(crowd>0.9?1.5:1)*(short==='firewood'?3:1)*(hard?1.5:1);
      if(S.contam>0)ch+=0.003;ch+=0.02*sickN/Math.max(1,S.pop);
      if(S.pol.ration==='severe')ch*=2;if(p.tr==='frail')ch*=2;if(win&&S.res.clothes>=S.pop)ch*=0.5;if(p.a<5||p.a>=55)ch*=1.5;
      if(Math.random()<ch){p.sick=Math.round(U(4,8));}}
    if(p.a>=48){const h=0.012*(p.a-48)/YDAYS;if(Math.random()<h){note(pname(p)+' died of old age, at '+Math.floor(p.a)+'.');removePerson(p,'age');continue;}}
  }
  /* shortages */
  if(short){
    if(S.mode==='challenge'&&short!=='firewood'){const pool=S.people.filter(p=>p.id!==S.jarl&&!p.away).sort((a,b)=>(Math.abs(b.a-30))-(Math.abs(a.a-30)));const v=pool[0];if(v&&Math.random()<0.5){note(pname(v)+' died of '+(short==='food'?'hunger':'thirst')+'.');removePerson(v,'hunger');}}
    else if(S.pop>8&&Math.random()<0.6){const pool=S.people.filter(p=>p.id!==S.jarl&&p.a>=14&&!p.w&&!p.away&&!S.people.some(k=>k.pa.includes(p.id)&&k.a<14)&&(!p.sp||PB(p.sp)&&!PB(p.sp).w));
      const v=pool.find(p=>!p.sp)||pool[0];if(v){const sp=v.sp?PB(v.sp):null;removePerson(v,'left');if(sp&&sp.id!==S.jarl)removePerson(sp,'left');toast((sp?'A couple':'A family member')+' left Kaldstrand: not enough '+short+'.');}}
    else toast('Kaldstrand is going hungry: not enough '+short+'. The last families hold on, but nobody will join until it is fixed.',4000);
  }
  /* marriages */
  const singles=S.people.filter(p=>!p.sp&&p.a>=17&&p.a<45&&!p.away);
  const men=singles.filter(p=>p.g==='m'),women=singles.filter(p=>p.g==='f');
  if(men.length&&women.length&&Math.random()<0.06){const a=pick(men),b=women.find(w=>!(w.pa[0]&&w.pa[0]===a.pa[0]))||null;if(b){marry(a,b);if(a.id===S.jarl||b.id===S.jarl)note(pname(a.id===S.jarl?a:b)+' took a spouse.');}}
  /* births */
  const room=housing()-S.pop;const fed=!short&&foodUnits()>=eatNeed()*6&&S.res.water>=drinkers()*DRINK*3;
  if(room>0&&fed&&S.mode!=='x'){
    let bm=(S.morale>=70?1.3:S.morale<40?0.6:1)*(S.gods.freyja>=50?1.15:1)*(S.pol.ration==='normal'?1:0.5);
    for(const w of S.people){if(w.g!=='f'||!w.sp||w.a<16||w.a>=44||w.away)continue;const h=PB(w.sp);if(!h||h.away)continue;
      if(S.people.some(k=>k.pa[1]===w.id&&k.a<1.2))continue;
      if(Math.random()<0.007*bm&&S.pop<housing()){const g=Math.random()<0.5?'m':'f';const isJ=h.id===S.jarl||w.id===S.jarl;
        let o={g:g,a:0,pa:[h.id,w.id],tr:(h.tr&&Math.random()<0.35)?h.tr:(w.tr&&Math.random()<0.35)?w.tr:(Math.random()<0.12?pick(TRAIT_KEYS):'')};
        if(isJ&&g==='m'&&!kidsOf(S.jarl).some(k=>k.num)){o.n='Ubbe';o.num=S.gen+1;}
        const c=newPerson(o);S.yr.births++;addFavor('freyja',1);
        if(isJ){if(!S.heir)S.heir=c.id;S.saga.push({y:yearNow(),t:'A '+(g==='m'?'son':'daughter')+', '+pname(c)+', was born to the Jarl.'});toast('A '+(g==='m'?'son':'daughter')+' was born to the Jarl: '+pname(c)+'.',3600);}
        else toast('A child was born in Kaldstrand: '+c.n+'.');syncPop();}}
  }
  /* newcomers */
  if(housing()-S.pop>0&&fed&&!short){const p=(0.06+S.attr/100*0.16)*(has('market')?1.25:1)*(S.morale<40?0.5:1);
    S.immAcc=(S.immAcc||0)+p;if(S.immAcc>=1){S.immAcc-=1;const pair=Math.random()<0.3&&housing()-S.pop>=2;const a=newPerson({a:Math.round(U(17,36)),tr:randTrait()});S.yr.arrived++;
      if(pair){const b=newPerson({g:a.g==='m'?'f':'m',a:Math.round(U(17,36)),tr:randTrait()});marry(a,b);S.yr.arrived++;toast('A couple, '+a.n+' and '+b.n+', settled in Kaldstrand.');}
      else toast(a.n+' arrived and settled in Kaldstrand.');syncPop();}}
  /* thralls */
  if(S.thralls>0){const cap=thrallCap();let esc=0;const pe=(S.pol.thralls==='harsh'?0.005:0.0015)*(S.thralls>cap?3:1);for(let i=0;i<S.thralls;i++)if(Math.random()<pe)esc++;
    if(esc){S.thralls-=esc;toast(esc+' thrall'+(esc>1?'s':'')+' fled in the night.');}
    if(S.pol.thralls==='soft')S.thrallSave+=0.02*S.thralls;}
  if(S.contam>0)S.contam--;
  syncPop();
}
function note(t){toast(t,3200);}

/* ---------- modal queue ---------- */
function queueModal(m){S.modal.push(m);}

/* ---------- winter forecast, festivals, wrath ---------- */
function seasonDay(){const yt=S.gameT%YEAR;return yt<SUMMER?{win:false,d:Math.floor(yt/DAY)+1}:{win:true,d:Math.floor((yt-SUMMER)/DAY)+1};}
function calendarDay(){const sd=seasonDay(),y=yearNow();
  if(!sd.win&&sd.d===26&&!S.winter.told){const hardP=y===1?0:(S.mode==='challenge'?0.5:0.3);const hard=Math.random()<hardP;const right=hasAdv('thorbjorg')||Math.random()<0.8;
    S.winter={hard:hard,said:right?hard:!hard,told:true};toast('The Völva speaks: “'+(S.winter.said?'A hard winter is coming. Stock firewood and food.':'The winter will be mild.')+'”',5200);}
  if(!sd.win&&sd.d===1&&y>1&&S.lastFest!=='sig'+y){S.lastFest='sig'+y;queueModal({k:'fest',f:'sigr'});}
  if(sd.win&&sd.d===1&&S.lastFest!=='blot'+y){S.lastFest='blot'+y;S.winter.told=false;queueModal({k:'fest',f:'blot'});}
  if(sd.win&&sd.d===8&&S.lastFest!=='jol'+y){S.lastFest='jol'+y;queueModal({k:'fest',f:'jol'});}
}
const FESTS={sigr:{n:'Sigrblót',t:'Summer has come. The men want a sacrifice to Odin for victory in the season of raids.',cost:()=>({meals:Math.ceil(S.pop*0.8)}),fx:()=>{addFavor('odin',15);addFavor('thor',5);addMod('fest','Sigrblót feast',8,15);addFame(5);}},
  blot:{n:'Blót',t:'Winter nights begin. It is time for the great sacrifice, so the gods watch over the dark months.',cost:()=>({meals:Math.ceil(S.pop*1.2)}),fx:()=>{GOD_KEYS.forEach(g=>addFavor(g,8));addMod('fest','Winter blót',6,15);addFame(5);}},
  jol:{n:'Jól',t:'Midwinter. The longest night. Fires are lit and the ale passes from hand to hand.',cost:()=>({meals:Math.ceil(S.pop*1.2),wood:15}),fx:()=>{GOD_KEYS.forEach(g=>addFavor(g,4));addMod('fest','Jól feast',12,15);addFame(5);}}};
function godsDay(){for(const g of GOD_KEYS)S.gods[g]=Math.max(0,S.gods[g]-0.15-0.004*S.gods[g]);
  const others=(S.gods.thor+S.gods.freyja+S.gods.njord+S.gods.loki)/4;
  if(S.gods.odin<=1&&others<25&&S.day>S.wrathCd){if(!S.wrathWarn){S.wrathWarn=S.day;toast('Black ravens circle the hall and will not leave. The Völva says Odin is angry.',5000);}
    else if(S.day-S.wrathWarn>=10){S.wrathWarn=0;S.wrathCd=S.day+90;odinWrath();}}else if(S.wrathWarn&&S.gods.odin>1)S.wrathWarn=0;}
function odinWrath(){const k=pick(['plague','fire']);let t;
  if(k==='plague'){const n=Math.ceil(S.pop*0.2);if(S.mode==='challenge'){for(let i=0;i<n;i++){const v=pick(S.people.filter(p=>p.id!==S.jarl));if(v)removePerson(v,'sickness');}t='Odin’s wrath fell on Kaldstrand. A plague took '+n+' lives.';}else{sicken(n);t='Odin’s wrath fell on Kaldstrand. A plague laid '+n+' people low.';}}
  else{S.res.wood*=0.6;S.res.planks*=0.6;if(S.mode==='challenge'){const h=B.filter(b=>b.t==='house');if(h.length>2&&housing()-4>=S.pop){const v=h[h.length-1];B=B.filter(o=>o!==v);rebuildOcc();recomputeConn();}}t='Odin’s wrath fell on Kaldstrand. Fire ran through the stores; four tenths of the timber burned.';}
  S.saga.push({y:yearNow(),t:t});queueModal({k:'info',title:'Odin’s Wrath',text:t+' Honour the Allfather before he looks this way again.'});}

/* ---------- revolt ---------- */
function revoltDay(){if(S.morale<20){S.lowDays++;if(S.lowDays===1)queueModal({k:'info',title:'Murmurs of Revolt',text:'Men gather by the well and fall silent when the Jarl passes. If spirits stay this low, they will rise. Feed them, warm them, hold a feast.'});}
  else S.lowDays=Math.max(0,S.lowDays-1);
  if(S.lowDays>=20){S.lowDays=0;if(S.mode==='challenge'){gameOver('The people rose against the Jarl. His hall was burned and his name was struck from the songs.');return;}
    const j=jarlP();const h=S.heir?PB(S.heir):null;
    if(j&&h){S.saga.push({y:yearNow(),t:'The people rose and cast '+pname(j)+' from the high seat.'});j.jt=null;const old=j;S.jarl=0;old.num=old.num;succession('deposed');S.morale=45;addFame(-30);}}}

/* ---------- training ---------- */
function startTraining(type){type=type||'skirm';const tg=B.find(b=>b.t==='train');if(!tg||S.train)return 'A batch is already training';const T=TROOPS[type];if(T.lv>thLevel())return 'Needs Town Hall level '+T.lv;
  const room=warCap()-S.warriors;const batch=Math.min(room,tg.lvl>=2?8:5);if(batch<=0)return 'Warrior limit reached for this Town Hall level';
  for(const k in T.eq)if(S.res[k]<T.eq[k]*batch)return 'Needs '+T.eq[k]*batch+' '+RNAME[k].toLowerCase()+' (you have '+fmt(S.res[k])+')';
  if(type==='merc')return 'Mercenaries are hired, not trained';const pool=S.people.filter(p=>p.id!==S.jarl&&!p.w&&p.a>=16&&p.a<45&&!p.away&&p.sick<=0).sort((a,b)=>((b.g==='m')-(a.g==='m'))||((b.tr==='hot'||b.tr==='strong'||(type==='archer'&&b.tr==='hawk'))-(a.tr==='hot'||a.tr==='strong'||(type==='archer'&&a.tr==='hawk'))));
  if(pool.length<batch)return 'Needs '+batch+' fit adults aged 16–44 (you have '+pool.length+')';
  assignWorkers();if(freeWorkers<batch)return 'Needs '+batch+' free workers (you have '+freeWorkers+'). Take people off a building first.';
  for(const k in T.eq)S.res[k]-=T.eq[k]*batch;S.train={n:batch,left:10,type:type,ids:pool.slice(0,batch).map(p=>p.id)};assignWorkers();return '';}
function trainDay(){if(!S.train)return;S.train.left-=1;if(S.train.left<=0){const T=TROOPS[S.train.type];let n=0;for(const id of S.train.ids){const p=PB(id);if(p){p.w=S.train.type;p.ua=0;n++;}}S.train=null;syncPop();toast(n+' '+T.n.toLowerCase()+'s finished their training.',3600);}}
function rearm(p){const k=PRIMARY[p.w];if(!k)return;if(S.res[k]>=1){S.res[k]-=1;p.ua=0;}else p.ua=1;}

/* ---------- raids ---------- */
function soldierStr(p){const T=TROOPS[p.w]||TROOPS.skirm;let s=T.str;if(p.ua)s*=0.5;s*=1+0.1*Math.min(3,p.xp);if(p.tr==='hot')s*=1.15;if(p.tr==='strong')s*=1.1;if(p.tr==='hawk'&&p.w==='archer')s*=1.25;if(p.a>=50)s*=0.8;return s;}
const shipById=id=>S.ships.find(s=>s.id===id);
function raidMult(r){let m=1;if(S.gods.thor>=50)m*=1.1;if((S.blessOn.thor||0)>S.day)m*=1.2;if(r.odin)m*=1.25;if(r.feast)m*=1.15;if(hasAdv('bjorn'))m*=1.15;if(hasAdv('lagertha'))m*=1.05;
  if(r.jarl)m*=jt('brave')?1.2:1.1;m*=S.morale>=70?1.1:S.morale<40?0.85:1;
  const sh=r.ships.map(shipById).filter(Boolean);if(sh.length&&sh.every(s=>s.type==='knarr'))m*=0.75;else if(sh.some(s=>s.type==='knarr'))m*=0.9;
  if(r.prov!==undefined&&r.prov<=0)m*=0.7;return m;}
function crewStr(ids){return ids.reduce((a,id)=>{const p=PB(id);return a+(p?soldierStr(p):0);},0);}
function tgtDef(t,tactic,siege){const st=S.tg[t.id]||{};let d=t.def*((st.pill||0)>S.day?1.3:1)*(1+0.05*Math.min(4,st.beaten||0));if(t.walls)d*=siege?1.25:1.6;if(tactic==='quick')d*=0.8;return d;}
const winChance=r=>clamp((1.35-1/Math.max(0.01,r))/0.7,0,1);
function estimate(r){const t=TG(r.tgt);const ratio=crewStr(r.crew)*raidMult(r)/tgtDef(t,r.tactic,r.tactic==='siege');const ch=winChance(ratio);return {ratio:ratio,chance:ch,label:ch>=0.9?'Easy':ch>=0.35?'Risky':'Suicidal'};}
function lootFor(t,mult){const st=S.tg[t.id]||{};const f=mult*1.75*((st.pill||0)>S.day?0.4:1)*(jt('greedy')?1.15:1);const o={};for(const k in t.loot)o[k]=Math.round(t.loot[k]*f*1.4*U(0.85,1.15));return o;}
function lootUnits(l){let u=0;for(const k in l)u+=k==='silver'?l[k]*0.1:l[k];return u;}
function cargoCap(r){return r.ships.map(shipById).filter(Boolean).reduce((a,s)=>a+SHIPCAP[s.type].cargo,0);}
const travel=t=>Math.max(2,Math.round(t.d*0.7));
function raidProvNeed(crew,t,jarl){return Math.ceil((crew+(jarl?1:0))*EAT*1.5*(2*travel(t)+3));}
function canRaid(t){if(t&&!regionOpen(t.reg))return 'That land is not open to you yet';if(thLevel()<3)return 'Raids open at Town Hall level 3';if(isWinter())return 'Ships do not sail in winter';const home=S.ships.filter(s=>!s.away);if(!home.length)return 'No ship in the harbour';
  if(!S.people.some(p=>p.w&&!p.away))return 'No warriors at home';return '';}
function launchRaid(plan){const t=TG(plan.tgt);const why=canRaid(t);if(why)return why;
  if(!plan.ships.length)return 'Choose at least one ship';if(!plan.crew.length)return 'Choose a crew';
  const cap=plan.ships.map(shipById).reduce((a,s)=>a+SHIPCAP[s.type].crew,0);if(plan.crew.length+(plan.jarl?1:0)>cap)return 'The ships hold '+cap+' men';
  const prov=raidProvNeed(plan.crew.length,t,plan.jarl);if(foodUnits()<prov)return 'Needs '+prov+' meals of provisions';
  spendMeals(prov);
  const r={id:S.day*10+S.raids.length,tgt:t.id,ships:plan.ships.slice(),crew:plan.crew.slice(),tactic:plan.tactic,pris:!!plan.pris,jarl:!!plan.jarl,ph:'out',t:Math.max(1,Math.round(travel(t)*(((S.blessOn.njordV||0)>0)?0.5:1)*(plan.ships.map(shipById).every(s=>s&&s.type==='snekkja')?0.67:1))),d:Math.max(1,Math.round(travel(t)*(plan.ships.map(shipById).every(s=>s&&s.type==='snekkja')?0.67:1))),prov:prov,provUse:(plan.crew.length+(plan.jarl?1:0))*EAT*1.5,
    safe:(S.blessOn.njordV||0)>0,odin:(S.blessOn.odinR||0)>0,feast:(S.blessOn.feastR||0)>0,loki:(S.blessOn.lokiR||0)>0,evDone:false,loot:{},prisoners:0,dead:[],wounded:0,log:[],start:S.day,result:''};
  S.blessOn.njordV=0;S.blessOn.odinR=0;S.blessOn.lokiR=0;S.blessOn.feastR=0;
  r.ships.forEach(id=>{const s=shipById(id);if(s)s.away=1;});r.crew.forEach(id=>{const p=PB(id);if(p)p.away=1;});if(r.jarl){const j=jarlP();if(j)j.away=1;}
  S.raids.push(r);S.yr.raids++;assignWorkers();animRaidOut(r);toast('The ships put out for '+t.n+'.',3600);return '';}
function raidDay(){for(const r of S.raids.slice()){
    if(r.ph==='out'||r.ph==='back'||r.ph==='siege'){r.prov=Math.max(0,r.prov-r.provUse*(r.ph==='siege'?1.5:1));}
    if(r.ph==='out'){r.t--;
      if(!r.evDone&&r.t<=Math.floor(r.d/2)){r.evDone=true;const stormP=r.safe?0:(S.gods.njord>=50?0.07:0.14);const roll=Math.random();
        if(roll<stormP){const n=Math.min(r.crew.length,1+Math.floor(Math.random()*2));const lost=[];for(let i=0;i<n;i++){const id=pick(r.crew);const p=PB(id);if(p){lost.push(p.n);r.dead.push(p.n);removePerson(p,'battle');}}
          r.log.push('A storm broke over the ships. '+(lost.length?lost.join(' and ')+' went over the side.':'') );queueModal({k:'raid',rid:r.id,step:'storm',lost:lost});}
        else if(roll<stormP+0.08)queueModal({k:'raid',rid:r.id,step:'merchant'});}
      if(r.t<=0)arrive(r);}
    else if(r.ph==='siege'){r.t--;if(r.t<=0){r.t=2;r.round++;queueModal({k:'raid',rid:r.id,step:'siege'});}}
    else if(r.ph==='back'){r.t--;if(r.t===1)animRaidIn(r);if(r.t<=0)homecoming(r);}
  }}
function arrive(r){const t=TG(r.tgt);const st=S.tg[t.id]||{};const e=estimate(r);r.ph='wait';
  if(e.ratio>=2||(st.beaten||0)>0){const offer={};const pot=lootFor(t,1);for(const k in pot)offer[k]=Math.round(pot[k]*0.6);r.offer=offer;queueModal({k:'raid',rid:r.id,step:'tribute'});}
  else if(t.walls&&r.tactic==='siege'){r.ph='siege';r.round=0;r.rounds=3+Math.floor(Math.random()*3);r.defF=1;r.t=2;r.log.push('The walls of '+t.n+' rose before them. The siege began.');queueModal({k:'raid',rid:r.id,step:'siegeStart'});}
  else battle(r,1);}
function battle(r,defMul){const t=TG(r.tgt);const siege=r.ph==='siege';let def=tgtDef(t,r.tactic,siege)*defMul;if(siege)def*=r.defF;
  if(r.tactic==='quick'&&!siege&&Math.random()<0.3){def/=0.8;r.log.push('The watchmen saw the sails in time: there was no surprise.');}
  const str=crewStr(r.crew)*raidMult(r)*U(0.65,1.35);const ratio=str/def;const win=ratio>=1;
  const dfrac=win?clamp(0.2/Math.pow(ratio,1.3)*U(0.6,1.4),0,0.6):clamp(0.35/ratio*U(0.7,1.2),0.15,0.6);
  const nDead=Math.round(r.crew.length*dfrac);const dead=[];for(let i=0;i<nDead&&r.crew.length;i++){const id=pick(r.crew);const p=PB(id);if(p){dead.push(p.n);r.dead.push(p.n);removePerson(p,'battle');}}
  let nW=Math.round(r.crew.length*dfrac*0.8);r.wounded+=nW;for(const id of r.crew.slice(0,nW)){const p=PB(id);if(p){p.sick=10;p.wound=1;}}
  for(const id of r.crew){const p=PB(id);if(!p)continue;p.xp++;if(Math.random()<0.12)p.broke=1;}
  if(r.jarl){const j=jarlP();if(j&&Math.random()<(win?0.04:0.25)){r.jarlDied=pname(j);r.dead.push(pname(j));r.jarl=false;removePerson(j,'battle');}}
  if(win){let mult=r.tactic==='quick'?0.6:1;if(r.loki)mult*=Math.random()<0.5?2:0;r.loot=lootFor(t,mult);r.prisPot=r.pris?Math.round(t.pris*(r.tactic==='quick'?0.5:1)*U(0.7,1.2)):0;
    if(t.herd)r.loot.animals=t.herd;
    r.result='win';r.log.push('They fell on '+t.n+' and carried the day.'+(dead.length?' '+dead.join(', ')+' fell.':' Not one man was lost.'));
    if(r.loki&&mult===0)r.log.push('Loki laughed: the plunder slipped through their fingers.');
    queueModal({k:'raid',rid:r.id,step:'load'});}
  else{r.result='loss';r.log.push('The men of '+t.n+' stood firm. The raiders were thrown back.'+(dead.length?' '+dead.join(', ')+' fell.':''));
    if(ratio<0.6&&Math.random()<0.3&&r.ships.length){const sid=r.ships.pop();const s=shipById(sid);if(s){r.log.push('The '+s.name+' was lost.');S.ships=S.ships.filter(x=>x!==s);}}
    goHome(r);}}
function goHome(r){r.ph='back';r.t=Math.max(1,Math.round(r.d*(r.safe?0.5:1)));}
function homecoming(r){const t=TG(r.tgt);const st=S.tg[t.id]=S.tg[t.id]||{};
  r.ships.forEach(id=>{const s=shipById(id);if(s){s.away=0;s.voy=(s.voy||0)+1;}});
  for(const id of r.crew){const p=PB(id);if(p){p.away=0;if(p.broke){p.broke=0;rearm(p);}if(p.w==='archer'){if(S.res.arrows>=10)S.res.arrows-=10;else p.ua=1;}}}
  if(r.jarl){const j=jarlP();if(j)j.away=0;}
  let got=[];
  if(r.result==='win'||r.result==='tribute'){
    let share=S.pol.loot==='warriors'?0.85:1;
    for(const k in r.loot){if(k==='animals'){const n=Math.min(r.loot[k],Math.max(0,herdCap()-herdTotal()));for(let i=0;i<n;i++){if(S.herd.pigs<=S.herd.sheep)S.herd.pigs++;else S.herd.sheep++;}if(n)got.push(n+' animals');continue;}
      const v=Math.round(r.loot[k]*share);if(!v)continue;if(k==='silver'){S.res.silver+=v;S.yr.silver+=v;}else addRes(k,v);got.push(v+' '+(RNAME[k]||k).toLowerCase());}
    if(r.prisoners){const room=Math.max(0,thrallCap()-S.thralls);const keep=Math.min(room,r.prisoners),sold=r.prisoners-keep;S.thralls+=keep;if(sold)S.res.silver+=sold*12;got.push(r.prisoners+' prisoners'+(sold?' ('+sold+' sold for '+sold*12+' silver)':''));}
    st.pill=S.day+90;st.beaten=(st.beaten||0)+(r.result==='win'?1:0);st.grudge=(st.grudge||0)+1;if(t.trade)st.ban=S.day+90;
    const fame=r.result==='win'?Math.round((15+t.def*0.75)*(r.tactic==='quick'?0.7:1)):8;addFame(fame);if(r.result==='tribute')st.trib=(st.trib||0)+1;
    if(r.result==='win'){addFavor('thor',5);addFavor('odin',3);addMod('victory','Victory at '+t.n,8,45);}
    S.raidsDone++;got.push('+'+fame+' fame');
  }else if(r.result==='retreat'){addFame(-10);addMod('defeat','Retreat from '+t.n,-5,30);st.grudge=(st.grudge||0)+1;}
  else{addFame(-5);addMod('defeat','Defeat at '+t.n,-10,45);st.grudge=(st.grudge||0)+1;}
  if(r.ships.length)addFavor('njord',3);
  S.raids=S.raids.filter(x=>x!==r);syncPop();assignWorkers();checkMilestones();
  const txt=r.log.join(' ')+(r.jarlDied?' '+r.jarlDied+' fell among them.':'');
  S.saga.push({y:yearNow(),t:(r.result==='win'?'Kaldstrand raided '+t.n+'.':r.result==='tribute'?t.n+' paid tribute to Kaldstrand.':'The raid on '+t.n+' failed.')+(r.dead.length?' '+r.dead.length+' did not come home.':'')});
  queueModal({k:'report',title:(r.result==='win'?'Victory at ':r.result==='tribute'?'Tribute from ':r.result==='retreat'?'Back from ':'Defeat at ')+t.n,text:txt,got:got,dead:r.dead.slice(),wounded:r.wounded});}

/* raid modal steps → options */
function raidOpts(m){const r=S.raids.find(x=>x.id===m.rid);if(!r)return null;const t=TG(r.tgt);
  switch(m.step){
    case 'storm':return {title:'Storm at Sea',text:'A storm broke over the ships on the way to '+t.n+'.'+(m.lost.length?' '+m.lost.join(' and ')+' went over the side.':' The ships held together.')+' Go on, or turn for home?',opts:[{l:'Press on',f:()=>''},{l:'Turn back',f:()=>{r.result='retreat';r.log.push('They turned back after the storm.');goHome(r);return 'The ships turned for home.';}}]};
    case 'merchant':return {title:'A Sail on the Horizon',text:'A fat merchant ship crosses their course, low in the water.',opts:[{l:'Take her',f:()=>{const s=crewStr(r.crew)*raidMult(r);if(s*U(0.7,1.3)>4){r.bonus={silver:30,cloth:5};r.log.push('On the way they took a merchant ship.');return 'The merchant struck her sail. 30 silver and 5 sailcloth taken.';}const p=PB(pick(r.crew));if(p){r.dead.push(p.n);removePerson(p,'battle');}return 'The merchant’s crew fought back and got away. '+(p?p.n+' fell.':'');}},{l:'Let her pass',f:()=>''}]};
    case 'tribute':{const est=estimate(r);return {title:t.n+' Offers Tribute',text:'Before a shield is raised, the elders of '+t.n+' come down to the shore with an offer: '+costStr(r.offer)+'. Your crew judges the fight '+est.label.toLowerCase()+'.',opts:[
      {l:'Accept the tribute',f:()=>{r.loot=r.offer;r.result='tribute';r.log.push(t.n+' paid tribute. No blood was spilled.');goHome(r);return 'The tribute was loaded aboard.';}},
      {l:'Haggle for more',f:()=>{if(Math.random()<(jt('wise')?0.65:0.5)){const o={};for(const k in r.offer)o[k]=Math.round(r.offer[k]*1.3);r.loot=o;r.result='tribute';r.log.push('They haggled, and '+t.n+' paid more.');goHome(r);return 'They paid more: '+costStr(o)+'.';}
        r.log.push('The haggling failed. '+t.n+' called its men to arms.');battle(r,1.2);return 'They refused and called their men to arms.';}},
      {l:'Attack',f:()=>{if(t.walls&&r.tactic==='siege'){r.ph='siege';r.round=0;r.rounds=3+Math.floor(Math.random()*3);r.defF=1;r.t=2;return 'The siege began.';}battle(r,1);return '';}}]};}
    case 'siegeStart':return {title:'Siege of '+t.n,text:'The rampart of '+t.n+' is too strong to storm at once. The crews dig in. Every two days you choose how to press the siege.',opts:[{l:'Begin the blockade',f:()=>''}]};
    case 'siege':{const last=r.round>=r.rounds;const o=[];
      if(!last)o.push({l:'Hold the blockade',f:()=>{r.defF*=0.9;if(Math.random()<0.25&&r.crew.length){const p=PB(pick(r.crew));if(p){r.dead.push(p.n);removePerson(p,'battle');return 'The defenders weaken. '+p.n+' died of a fever in camp.';}}return 'The defenders weaken.';}});
      o.push({l:'Night assault',f:()=>{battle(r,0.9);return '';}});
      if(r.defF<0.75)o.push({l:'Demand surrender',f:()=>{if(Math.random()<(1-r.defF)*1.3){r.loot=lootFor(t,0.8);r.result='tribute';r.log.push(t.n+' opened its gates and paid to be spared.');goHome(r);return t.n+' surrendered and paid.';}return 'They refused, and jeered from the walls.';}});
      o.push({l:'Withdraw',f:()=>{r.result='retreat';r.log.push('The siege was lifted.');goHome(r);return 'The crews broke camp and sailed home.';}});
      return {title:'Siege of '+t.n+' · round '+r.round+(last?' (last)':''),text:'The defenders hold at '+Math.round(r.defF*100)+'% of their strength. Provisions left: '+fmt(r.prov)+' meals.'+(r.prov<=0?' The men are starving.':''),opts:o};}
    case 'load':{const cap=cargoCap(r);const lu=lootUnits(r.loot);return {title:'Loading the Ships',text:'The ships can carry '+cap+' loads. The plunder fills '+Math.round(lu)+(r.prisPot?'; each prisoner takes 4.':'.'),slider:r.prisPot?{max:r.prisPot,cap:cap,lu:lu}:null,
      opts:[{l:'Sail home',f:v=>{const pr=r.prisPot?Math.min(r.prisPot,Math.max(0,Math.round(v||0))):0;const room=Math.max(0,cap-pr*4);const k=lu>0?Math.min(1,room/lu):1;const l={};for(const x in r.loot)l[x]=x==='animals'?r.loot[x]:Math.round(r.loot[x]*k);r.loot=l;r.prisoners=pr;if(r.bonus)for(const x in r.bonus)r.loot[x]=(r.loot[x]||0)+r.bonus[x];goHome(r);return '';}}]};}
  }return null;}

/* ---------- events ---------- */
const adultsHome=()=>S.people.filter(p=>p.a>=14&&!p.away&&p.id!==S.jarl);
const EVTS={
  storm:{cat:'Nature',c:()=>isWinter(),w:1,mk:()=>({}),t:()=>'A storm out of the north tore turf from the roofs.',o:[{l:'Repair at once (15 planks)',ok:()=>S.res.planks>=15,f:()=>{S.res.planks-=15;return 'The roofs held. Nobody froze.';}},{l:'Let it wait',f:()=>{addMod('storm','Damaged roofs',-6,15);sicken(2);return 'Snow came in through the gaps. Two fell sick.';}}]},
  dry:{cat:'Nature',c:()=>!isWinter()&&B.some(b=>FARMLIKE.has(b.t)),w:0.8,mk:()=>({}),t:()=>'No rain for weeks. The ground cracks and the berries wither on the branch.',o:[{l:'Offer to Freyja (10 favour)',ok:()=>S.gods.freyja>=10,f:()=>{S.gods.freyja-=10;return 'Rain came three days later.';}},{l:'Endure it',f:()=>{S.fx.dry=S.day+15;return 'Farms and gatherers will bring in less for 15 days.';}}]},
  herring:{cat:'Nature',good:1,c:()=>!isWinter()&&has('fish'),w:1,mk:()=>({}),t:()=>'Herring fill the bay, so thick the water boils silver.',o:[{l:'Every boat out',f:()=>{const g=addRes('fish',60);return '+'+fmt(g)+' fish.';}},{l:'Let them pass',f:()=>''}]},
  wolves:{cat:'Nature',c:()=>isWinter()&&has('pen')&&herdTotal()>3,w:1,mk:()=>({}),t:()=>'Wolves came to the pen in the night. The sheep are screaming.',o:[{l:'Send men with spears',ok:()=>S.warriors>0||S.res.spears>=2,f:()=>{if(Math.random()<0.25)sicken(1,true);addRes('hides',2);return 'The wolves were driven off. Two pelts were taken.';}},{l:'Bar the doors',f:()=>{S.herd.sheep=Math.max(1,S.herd.sheep-1);S.herd.pigs=Math.max(1,S.herd.pigs-1);return 'At dawn two animals were gone.';}}]},
  bear:{cat:'Nature',c:()=>has('wood'),w:0.8,mk:()=>({}),t:()=>'A bear walks the edge of the forest. The woodcutters will not go in.',o:[{l:'Hunt it',f:()=>{addRes('meat',30);addRes('hides',2);if(Math.random()<0.3){sicken(1,true);return 'The bear is dead. One hunter was mauled.';}return 'The bear is dead. +30 meat, +2 hides.';}},{l:'Keep away for now',f:()=>{S.fx.bear=S.day+5;return 'Woodcutters work at half pace for 5 days.';}}]},
  aurora:{cat:'Omen',good:1,c:()=>isWinter(),w:0.7,mk:()=>({}),t:()=>'Green fire danced across the sky all night. The Völva says the gods are watching.',o:[{l:'Make an offering (10 meals)',ok:()=>foodUnits()>=10,f:()=>{spendMeals(10);GOD_KEYS.forEach(g=>addFavor(g,5));return 'All gods +5 favour.';}},{l:'Watch in silence',f:()=>{addMod('aurora','The sky-fire',3,10);return '';}}]},
  twins:{cat:'People',good:1,c:()=>S.people.some(p=>p.g==='f'&&p.sp&&p.a>=18&&p.a<40)&&housing()-S.pop>=2,w:0.6,mk:()=>{const w=pick(S.people.filter(p=>p.g==='f'&&p.sp&&p.a>=18&&p.a<40));return {a:w.id};},t:a=>{const w=PB(a.a);return 'Twins were born to '+(w?w.n:'a woman of the village')+'. The old women say Freyja smiled on her.';},
    o:[{l:'Give thanks to Freyja',f:a=>{const w=PB(a.a);if(w&&w.sp){for(let i=0;i<2;i++){newPerson({a:0,pa:[w.sp,w.id]});S.yr.births++;}syncPop();}addFavor('freyja',5);return 'Two children. Freyja +5.';}}]},
  holmgang:{cat:'People',c:()=>adultsHome().filter(p=>p.g==='m').length>=4,w:0.7,mk:()=>{const m=adultsHome().filter(p=>p.g==='m');const a=pick(m);const b=pick(m.filter(x=>x!==a));return {a:a.id,b:b.id};},
    t:a=>{const x=PB(a.a),y=PB(a.b);return (x?x.n:'One man')+' and '+(y?y.n:'another')+' quarrel over a strip of field. Both call for holmgang.';},
    o:[{l:'Allow the duel',f:a=>{const x=PB(a.a),y=PB(a.b);const l=Math.random()<0.5?x:y;if(!l)return '';if(Math.random()<0.35){removePerson(l,'duel');return l.n+' died on the cloak. The matter is settled.';}l.sick=8;l.wound=1;addMod('duel','A fair fight',3,10);return l.n+' was wounded and yielded.';}},
      {l:'Settle it yourself (20 meals)',ok:()=>foodUnits()>=20,f:()=>{spendMeals(20);return 'Both ate at the Jarl’s table and the quarrel cooled.';}},
      {l:'Fine them both',cruel:1,f:()=>{addMod('fine','A harsh judgement',-4,15);S.res.silver+=10;return '+10 silver. The village grumbles.';}}]},
  feud:{cat:'People',c:()=>S.pop>=16,w:0.6,mk:()=>({}),t:()=>'Two families feud over an insult at the well. Knives have been drawn.',o:[{l:'Pay wergild (25 meals)',ok:()=>foodUnits()>=25,f:()=>{spendMeals(25);return 'The families made peace.';}},{l:'Let them be',f:()=>{addMod('feud','A feud in the village',-8,20);return 'The feud festers.';}}]},
  prodigy:{cat:'People',good:1,c:()=>S.people.some(p=>p.a>=8&&p.a<14&&!p.tr),w:0.5,mk:()=>({a:pick(S.people.filter(p=>p.a>=8&&p.a<14&&!p.tr)).id}),t:a=>{const p=PB(a.a);return 'Young '+(p?p.n:'one')+' carves runes cleaner than the old men.';},o:[{l:'Praise the child',f:a=>{const p=PB(a.a);if(p)p.tr='steady';return (p?p.n:'The child')+' gained Steady Hand.';}}]},
  oldwarrior:{cat:'People',c:()=>thLevel()>=3&&S.people.some(p=>p.g==='m'&&p.a>=50&&!p.w&&p.id!==S.jarl),w:0.4,mk:()=>({a:pick(S.people.filter(p=>p.g==='m'&&p.a>=50&&!p.w&&p.id!==S.jarl)).id}),t:a=>{const p=PB(a.a);return 'Old '+(p?p.n:'a man')+' says he will not die in his bed. He asks for a spear and a place at the oars.';},
    o:[{l:'Give him a spear',ok:()=>S.res.spears>=1&&S.warriors<warCap(),f:a=>{const p=PB(a.a);if(p){S.res.spears--;p.w='skirm';syncPop();}addFavor('odin',4);return 'He joins the warriors. Odin +4.';}},{l:'Refuse him gently',f:()=>''}]},
  monk:{cat:'Visitor',c:()=>thLevel()>=2,w:0.5,mk:()=>({}),t:()=>'A monk from the west, thin as a reed, begs for shelter. He has a book and nothing else.',o:[{l:'Take him in',ok:()=>housing()>S.pop,f:()=>{newPerson({n:'Aldhelm',g:'m',a:34,tr:'patient'});S.yr.arrived++;syncPop();return 'Aldhelm the monk lives among you now. He is patient.';}},{l:'Send him away',f:()=>''},{l:'Make him a thrall',cruel:1,ok:()=>thrallCap()>S.thralls,f:()=>{S.thralls++;addFavor('odin',2);return '+1 thrall.';}}]},
  peddler:{cat:'Visitor',c:()=>!isWinter(),w:0.8,mk:()=>({}),t:()=>'A peddler walks in from the hills with a pack of iron goods.',o:[{l:'Buy 5 tools (30 silver)',ok:()=>S.res.silver>=30,f:()=>{S.res.silver-=30;S.res.tools+=5;return '+5 tools.';}},{l:'Buy 5 tools (40 meals)',ok:()=>foodUnits()>=40,f:()=>{spendMeals(40);S.res.tools+=5;return '+5 tools.';}},{l:'Send him on',f:()=>''}]},
  skald:{cat:'Visitor',good:1,c:()=>true,w:0.6,mk:()=>({}),t:()=>'A wandering skald asks for a seat by the fire. He knows the songs of Ragnar.',o:[{l:'Feast him (20 meals)',ok:()=>foodUnits()>=20,f:()=>{spendMeals(20);const f=addFame(15);addMod('skald','Songs in the hall',4,15);return '+'+Math.round(f)+' fame.';}},{l:'Give him bread and send him on',f:()=>''}]},
  refugees:{cat:'Visitor',c:()=>housing()-S.pop>=3,w:0.6,mk:()=>({}),t:()=>'Three people come over the pass. Their village was burned. They ask for a home.',o:[{l:'Welcome them (30 meals)',ok:()=>foodUnits()>=30,f:()=>{spendMeals(30);const a=newPerson({a:Math.round(U(20,35)),tr:randTrait()}),b=newPerson({g:a.g==='m'?'f':'m',a:Math.round(U(20,35))});marry(a,b);newPerson({a:Math.round(U(3,10)),pa:[a.id,b.id]});S.yr.arrived+=3;syncPop();return '+3 people.';}},{l:'Turn them away',f:()=>{addMod('refuse','Refugees turned away',-3,15);return '';}}]},
  messenger:{cat:'Visitor',c:()=>thLevel()>=2,w:0.5,mk:()=>({}),t:()=>'A messenger from Jarl Hrolf the Grey of Hordaland brings a silver arm-ring. He waits for a gift in return.',o:[{l:'Send 20 planks back',ok:()=>S.res.planks>=20,f:()=>{S.res.planks-=20;S.res.silver+=15;addFame(10);return '+15 silver, +10 fame. Hrolf is pleased.';}},{l:'Keep the ring and send nothing',f:()=>{S.res.silver+=15;const st=S.tg.hord=S.tg.hord||{};st.grudge=(st.grudge||0)+1;return '+15 silver. Hrolf will remember this.';}}]},
  wreck:{cat:'Sea',good:1,c:()=>!isWinter(),w:0.6,mk:()=>({}),t:()=>'A foreign ship broke on the rocks in the night. Men cling to the wreck.',o:[{l:'Salvage the wreck',f:()=>{addRes('planks',30);addRes('iron',10);addRes('misc',5);return '+30 planks, +10 iron.';}},{l:'Rescue the sailors',ok:()=>housing()-S.pop>=2,f:()=>{newPerson({g:'m',a:26,tr:'seafarer'});newPerson({g:'m',a:30});S.yr.arrived+=2;syncPop();addFavor('njord',4);return 'Two sailors stay in Kaldstrand. Njord +4.';}},{l:'Rescue them and keep them as thralls',cruel:1,ok:()=>thrallCap()-S.thralls>=2,f:()=>{S.thralls+=2;return '+2 thralls.';}}]},
  whale:{cat:'Sea',good:1,c:()=>true,w:0.4,mk:()=>({}),t:()=>'A whale lies stranded on the beach, as long as a longhouse.',o:[{l:'Butcher it',f:()=>{const g=addRes('meat',60);addRes('misc',8);return '+'+fmt(g)+' meat, +8 odds and ends.';}}]},
  amber:{cat:'Sea',good:1,c:()=>true,w:0.4,mk:()=>({}),t:()=>'After the storm, amber lies along the tideline like honey.',o:[{l:'Gather it',f:()=>{addRes('misc',10);return '+10 odds and ends for the gods.';}}]},
  fever:{cat:'Crisis',crisis:1,c:()=>S.pop>=12,w:0.6,mk:()=>({}),t:()=>'A fever goes from house to house.',o:[{l:'Keep the sick apart',f:()=>{sicken(2);return 'Two fell sick.';}},{l:'Pray to Freyja (10 favour)',ok:()=>S.gods.freyja>=10,f:()=>{S.gods.freyja-=10;sicken(1);return 'Only one fell sick.';}}]},
  fire:{cat:'Crisis',crisis:1,c:()=>S.res.wood>40,w:0.5,mk:()=>({}),t:()=>'Fire in the woodpile! Sparks fly toward the roofs.',o:[{l:'Form a bucket chain',f:()=>{S.res.wood*=0.85;if(Math.random()<0.3){sicken(1,true);return 'The fire is out. One man was burned.';}return 'The fire is out. Some timber was lost.';}},{l:'Let it burn out',f:()=>{S.res.wood*=0.5;return 'Half the wood burned.';}}]},
  thrallflee:{cat:'Crisis',crisis:1,c:()=>S.thralls>=3,w:0.5,mk:()=>({n:Math.max(1,Math.round(S.thralls*0.3))}),t:a=>a.n+' thralls slipped away toward the hills.',o:[{l:'Send warriors after them',ok:()=>S.people.some(p=>p.w&&!p.away),f:a=>{const back=Math.round(a.n*0.7);S.thralls-=a.n-back;return back+' brought back.';}},{l:'Let them go',f:a=>{S.thralls-=a.n;return '';}}]},
  rumours:{cat:'Crisis',crisis:1,c:()=>S.morale<35,w:1.2,mk:()=>({}),t:()=>'Men mutter against the Jarl at the well. They say he cares more for his hall than for them.',o:[{l:'Hold a feast ('+'1 meal each)',ok:()=>foodUnits()>=S.pop,f:()=>{spendMeals(S.pop);addMod('feast','A feast in the hall',10,15);return 'Spirits rise.';}},{l:'Make an example',cruel:1,f:()=>{addMod('example','Fear',-4,20);S.lowDays=0;return 'The muttering stops. For now.';}},{l:'Ignore it',f:()=>''}]},
  freedom:{cat:'People',c:()=>S.thralls>0&&S.pol.thralls==='soft'&&S.thrallSave>=10,w:0.8,mk:()=>({}),t:()=>'A thrall has saved ten pieces of silver. He offers them for his freedom.',o:[{l:'Accept',ok:()=>housing()>S.pop,f:()=>{S.thralls--;S.thrallSave-=10;S.res.silver+=10;newPerson({g:'m',a:Math.round(U(20,35))});syncPop();return 'He is a free man of Kaldstrand. +10 silver.';}},{l:'Refuse',f:()=>{addMod('refusefree','A broken promise',-2,10);return '';}}]},
  curse:{cat:'Omen',crisis:1,c:()=>GOD_KEYS.some(g=>S.gods[g]<20),w:0.8,mk:()=>({g:pick(GOD_KEYS.filter(g=>S.gods[g]<20))}),t:a=>'The Völva throws the bones and goes pale. '+GODS[a.g].n+' is angry with Kaldstrand.',
    o:[{l:'Accept the god’s anger',f:a=>{const g=a.g;if(g==='freyja'){S.fx.dry=S.day+10;return 'Crops wither for 10 days.';}if(g==='njord'){S.fx.nofish=S.day+10;return 'The fish stay away for 10 days.';}if(g==='odin'){addFame(-10);return '−10 fame.';}if(g==='thor'){S.blessOn.thor=0;addMod('thor','Thunder without rain',-4,15);return 'Spirits fall.';}S.res.wood*=0.8;return 'Things go missing. A fifth of the wood is gone.';}}]}
};
function eventDay(){if(S.day<S.nextEvt||S.modal.length)return;
  const crisisW=S.mode==='challenge'?1.5:0.8,goodW=S.mode==='relaxed'?1.4:1;const lokiW=S.gods.loki>=50?1.3:1;
  const pool=[];for(const id in EVTS){const e=EVTS[id];if((S.evtSeen[id]||-99)>S.day-40)continue;let ok=false;try{ok=e.c();}catch(x){ok=false;}if(!ok)continue;pool.push([id,e.w*(e.crisis?crisisW:1)*(e.good?goodW:1)]);}
  S.nextEvt=S.day+Math.round(U(11,20)/lokiW);if(!pool.length)return;
  let tot=pool.reduce((a,x)=>a+x[1],0),r=Math.random()*tot;let id=pool[0][0];for(const x of pool){r-=x[1];if(r<=0){id=x[0];break;}}
  const e=EVTS[id];const args=e.mk();S.evtSeen[id]=S.day;queueModal({k:'evt',id:id,a:args,text:e.t(args)});}
function evtOpts(m){const e=EVTS[m.id];if(!e)return null;const cruel=jt('cruel');return {title:e.cat,text:m.text,opts:e.o.filter(o=>!o.cruel||cruel||S.mode==='sandbox'||true).filter(o=>!o.cruel||cruel).map(o=>({l:o.l,dis:o.ok&&!o.ok(m.a),f:()=>o.f(m.a)}))};}

/* ---------- year summary ---------- */
function yearRoll(){const y=yearNow()-1;const s=S.yr;
  const line='Year '+y+' of Kaldstrand ('+(864+y)+'): '+s.births+' born, '+s.deaths+' died, '+s.arrived+' came, '+s.left+' left'+(s.raids?', '+s.raids+' raid'+(s.raids>1?'s':''):'')+'.';
  S.saga.push({y:y,t:line});
  const yf=addFame(10+Math.round(S.pop/3));s.fame+=0;S.lastYearFame=Math.round(yf);
  queueModal({k:'year',y:y,s:Object.assign({},s),pop:S.pop,fame:Math.round(S.fame),yf:S.lastYearFame});
  S.yr={births:0,deaths:0,arrived:0,left:0,raids:0,silver:0,fame:0};}

/* ---------- daily hook ---------- */
function p2Day(short){const yBefore=Math.floor((S.gameT-DAY)/YEAR);
  peopleDay(short);godsDay();trainDay();raidDay();marketDay();mercDay();if(S.tombDone){addFame(1);S.gods.odin=Math.max(30,S.gods.odin);}if(S.banqReset&&S.day>=S.banqReset){S.banqN=0;S.banqReset=0;}
  if(isWinter()&&S.res.clothes>0)S.res.clothes=Math.max(0,S.res.clothes-S.pop/120);calendarDay();recalcMorale();revoltDay();eventDay();
  if(S.mode==='sandbox'||S.mode==='test'){S.res.wood=Math.max(S.res.wood,250);S.res.planks=Math.max(S.res.planks,250);S.res.iron=Math.max(S.res.iron,150);S.res.tools=Math.max(S.res.tools,30);S.res.water=Math.max(S.res.water,100);if(foodUnits()<150)S.res.dfish+=60;}
  if(Math.floor(S.gameT/YEAR)>yBefore&&yBefore>=0&&S.day>2)yearRoll();}
