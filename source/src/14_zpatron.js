/* =================== 1D: Ubbe's trait, the patron god, the Feast (José, 2026-11-11) ===================
   A new saga starts with three choices: Ubbe's trait (bonuses only), a patron god and the first advisor.
   Only the patron has a favour bar. Below 25 favour the Patron's wrath falls (each god has his own).
   One Feast in the hall replaces the banquets and the three festivals; the holy days still double its favour. */
const UTRAITS={
  builder:{n:'Builder',d:'Buildings and upgrades go up 25% faster and cost 10% less.'},
  warrior:{n:'Warrior',d:'Warriors fight 15% harder, on raids and at home, and train 25% faster.'},
  trader:{n:'Trader',d:'Prices 15% better with every merchant; trading partners trust you faster.'},
  provider:{n:'Provider',d:'+10% food from fishers, gatherers, farms, beehives and the pens.'},
  skald:{n:'Skald',d:'+15% fame from every source, and +4 morale: the hall loves his songs.'}};
function ut(k){return typeof S!=='undefined'&&!!S&&S.utrait===k;}
function patron(){return (typeof S!=='undefined'&&S&&S.patron)||'odin';}
function fav(g){return g===patron()?((S.gods&&S.gods[g])||0):0;}   /* only the patron's favour exists */
function PN(){return GODS[patron()].n;}
/* favour from an event to one god: counts only if he is the patron; returns the text for the result */
function gfav(g,v){if(g!==patron())return '';addFavor(g,v);return ' '+GODS[g].n+' +'+v+'.';}
const PROVIDER=new Set(['fish','berry','grain','flax','fodder','pigpen','sheeppen','hives']);
function builderMul(o){if(!ut('builder'))return o;const r={};for(const q in o)r[q]=Math.ceil(o[q]*0.9);return r;}
function setPatron(g){S.patron=g;for(const k of Object.keys(S.gods))S.gods[k]=k===g?50:0;}

/* each patron asks his own offering, all of them Town Hall 1 goods */
const PATRON_OFF={odin:{k:'preserved',n:8,f:8,t:'preserved food'},thor:{k:'iron',n:6,f:8,t:'iron'},freyja:{k:'berries',n:15,f:8,t:'berries'},njord:{k:'fish',n:15,f:8,t:'fish'}};
const PRESERVED=['jam','smoked'];
const offHave=o=>o.k==='preserved'?PRESERVED.reduce((a,k)=>a+resv(k),0):resv(o.k);
function offPay(o){let n=o.n;if(o.k!=='preserved'){S.res[o.k]-=n;return;}for(const k of PRESERVED){const e=Math.min(resv(k),n);S.res[k]-=e;n-=e;if(n<=0)break;}}
const offerAtAltar=()=>has('altar');
function makeOffering(){const g=patron(),o=PATRON_OFF[g];if(SBX()?false:offHave(o)<o.n)return 'Not enough '+o.t+': needs '+o.n;if(!SBX())offPay(o);
  const v=o.f*(offerAtAltar()?1.5:1);addFavor(g,v);S.offers=(S.offers||0)+1;checkMilestones();return '';}
function askBlessing(){const g=patron();if(!has('altar'))return 'Blessings are asked at the Altar';if(S.gods[g]<80)return GODS[g].n+' needs 80 favour';if((S.blessCd[g]||0)>S.day)return 'Again in '+(S.blessCd[g]-S.day)+' days';
  S.gods[g]-=has('hof')?20:30;S.blessCd[g]=S.day+30;S.blessCount=(S.blessCount||0)+1;
  if(g==='freyja')S.blessOn.freyja=S.day+15;if(g==='thor')S.blessOn.thor=S.day+30;if(g==='odin')S.blessOn.odinR=1;if(g==='njord')S.blessOn.njordV=1;
  checkMilestones();return '';}

/* ---------- the Patron's wrath ---------- */
const WRATH_AT=25;
const WRATH={odin:{n:'Odin’s wrath',warn:'Black ravens circle the hall and will not leave. The Völva says Odin is angry.',d:'a plague lays a fifth of the people low'},
  thor:{n:'Thor’s wrath',warn:'Thunder rolls over the fjord with no rain. The Völva says Thor is angry.',d:'lightning burns four tenths of the timber and planks'},
  freyja:{n:'Freyja’s wrath',warn:'The cows give little milk and the berries rot on the branch. The Völva says Freyja is angry.',d:'blight: farms and gatherers bring 40% less and no child is born for 20 days'},
  njord:{n:'Njord’s wrath',warn:'The sea is grey and heavy, and the gulls fly inland. The Völva says Njord is angry.',d:'storms: the fishers bring 60% less for 20 days'}};
function patronWrath(){const g=patron();let t;
  if(g==='odin'){const n=Math.ceil(S.pop*0.2);if(S.mode==='challenge'){for(let i=0;i<n;i++){const v=pick(S.people.filter(p=>p.id!==S.jarl));if(v)removePerson(v,'sickness');}t='Odin’s wrath fell on Kaldstrand. A plague took '+n+' lives.';}else{sicken(n);t='Odin’s wrath fell on Kaldstrand. A plague laid '+n+' people low.';}}
  else if(g==='thor'){S.res.wood*=0.6;S.res.planks*=0.6;if(S.mode==='challenge'){const h=B.filter(b=>b.t==='house');if(h.length>2&&housing()-4>=S.pop){const v=h[h.length-1];B=B.filter(o=>o!==v);rebuildOcc();recomputeConn();}}t='Thor’s wrath fell on Kaldstrand. Lightning struck the stores; four tenths of the timber burned.';}
  else if(g==='freyja'){S.fx.blight=S.day+20;S.fx.barren=S.day+20;t='Freyja’s wrath fell on Kaldstrand. Blight lies on the fields and the bushes, and no child will be born for 20 days.';}
  else{S.fx.storm=S.day+20;t='Njord’s wrath fell on Kaldstrand. Storms keep the boats ashore; the fishers bring little for 20 days.';}
  S.saga.push({y:yearNow(),t:t});queueModal({k:'info',title:WRATH[g].n,text:t+' Honour '+GODS[g].n+' before he'+(g==='freyja'?'r eyes turn':' looks')+' this way again.'});}
function odinWrath(){patronWrath();}

/* ---------- holy days: Sigrblót, Blót and Jól. A Feast within 5 days pleases the patron twice as much ---------- */
const HOLY={sigr:'Sigrblót, the summer sacrifice',blot:'The winter blót',jol:'Jól, the longest night'};
function holyDay(k){S.holy={k:k,until:S.day+5};toast(HOLY[k]+'. Hold a Feast in the hall in the next 5 days and '+PN()+' will be twice as pleased.',6000);}
const holyNow=()=>!!(S.holy&&S.holy.until>=S.day);

/* ---------- the Feast (replaces the banquets and the festivals) ---------- */
const FEAST={plain:{n:'Feast',d:'+8 morale for 15 days, patron +8, fame +4'},
  ale:{n:'Feast with ale',d:'+12 morale for 20 days, patron +10, fame +8'},
  mead:{n:'Feast with mead',d:'+14 morale for 20 days, patron +14, fame +14; at Town Hall 3+ the next raid fights 15% harder'}};
const feastSeason=()=>yearNow()+(isWinter()?'w':'s');
function feastMult(){if(S.feastS!==feastSeason()){S.feastS=feastSeason();S.feastN=0;}return 1+0.5*(S.feastN||0);}
function feastCost(k){const m=feastMult(),p=Math.max(8,S.pop);const o={meals:Math.ceil(p*(k==='plain'?0.8:0.6)*m)};if(k==='ale')o.ale=Math.ceil(p*0.5*m);if(k==='mead')o.mead=Math.ceil(p*0.35*m);return o;}
function feastOk(k){const c=feastCost(k);if(SBX())return true;return foodUnits()>=c.meals&&(!c.ale||S.res.ale>=c.ale)&&(!c.mead||S.res.mead>=c.mead);}
function feastCostStr(c){return c.meals+' meals'+(c.ale?' + '+c.ale+' ale':'')+(c.mead?' + '+c.mead+' mead':'');}
function holdFeast(k){const c=feastCost(k);if(!feastOk(k))return 'Not enough: needs '+feastCostStr(c);
  if(!SBX()){spendMeals(c.meals);if(c.ale)S.res.ale-=c.ale;if(c.mead)S.res.mead-=c.mead;}
  const h=holyNow()?2:1,g=patron();
  if(k==='plain'){addMod('feast','A feast in the hall',8+(h>1?3:0),15);addFavor(g,8*h);addFame(4);}
  else if(k==='ale'){addMod('feast','A feast with ale',12+(h>1?3:0),20);addFavor(g,10*h);addFame(8);}
  else{addMod('feast','A feast with mead',14+(h>1?3:0),20);addFavor(g,14*h);addFame(14);if(thLevel()>=3)S.blessOn.feastR=1;}
  S.feastN=(S.feastN||0)+1;S.feasts=(S.feasts||0)+1;S.feast={until:S.gameT+DAY*1.5};if(h>1)S.holy=null;return '';}

/* ---------- sheets ---------- */
function patronHtml(on,atAltar){const g=patron(),G=GODS[g],f=fav(g),o=PATRON_OFF[g],cd=Math.max(0,(S.blessCd[g]||0)-S.day),altar=has('altar');
  let h='<div class="god"><div class="gh"><strong>Patron: '+G.n+'</strong> '+bar(f,f<WRATH_AT?'#A34A3A':f>=50?'#5E7A4E':'#C9A64A')+' <span class="num">'+Math.round(f)+'</span></div>'
    +'<div class="meta">Likes: '+esc(G.likes)+'. Gift at 50: '+esc(G.pass)+(f>=50?' (active)':'')+'. Below '+WRATH_AT+': '+esc(WRATH[g].n)+' — '+esc(WRATH[g].d)+'.'+(S.wrathWarn?' <b>He is angry now.</b>':'')+'</div>'
    +'<div class="gb"><button type="button" class="btn small" id="pt-off" '+(SBX()||offHave(o)>=o.n?'':'disabled')+'>Offer '+o.n+' '+esc(o.t)+' → +'+Math.round(o.f*(altar?1.5:1))+'</button>'
    +'<button type="button" class="btn small primary" id="pt-bl" '+(altar&&f>=80&&!cd?'':'disabled')+'>'+esc(G.bless.n)+'</button></div>'
    +'<div class="meta">'+esc(G.bless.d)+'. '+(altar?'Blessing at 80 favour, costs '+(has('hof')?20:30)+(cd?' · again in '+cd+' days':''):'Build an Altar (Town Hall 2): offerings there give 50% more, and blessings are asked there.')+'</div></div>';
  on.push(()=>{if($('pt-off'))$('pt-off').onclick=()=>{const w=makeOffering();toast(w||G.n+' accepts the offering.');reopenSheet();save();};
    if($('pt-bl'))$('pt-bl').onclick=()=>{const w=askBlessing();toast(w||G.bless.n+': '+G.bless.d+'.',4000);reopenSheet();save();};});
  return h;}
function feastHtml(on){const lv=thLevel(),ks=['plain'].concat(lv>=3?['ale','mead']:[]);
  let h='<h3>Feast</h3><p class="meta">Feed the village in the hall. Each feast this season costs half as much again as the last.'+(holyNow()?' <b>'+esc(HOLY[S.holy.k])+':</b> a feast in the next '+Math.max(1,S.holy.until-S.day+1)+' days pleases '+esc(PN())+' twice as much.':' On the holy days (start of summer, start of winter, midwinter) a feast pleases '+esc(PN())+' twice as much.')+(lv<3?' Ale and mead feasts come with the Brewery (Town Hall 3).':'')+'</p>';
  h+=ks.map(k=>{const c=feastCost(k),ok=feastOk(k);return '<div class="wk"><button type="button" class="btn small'+(ok?' primary':'')+'" data-fe="'+k+'" '+(ok?'':'disabled')+'>'+esc(FEAST[k].n)+'</button><span class="meta">'+esc(FEAST[k].d)+' · '+esc(feastCostStr(c))+'</span></div>';}).join('');
  on.push(()=>{$('sheet-card').querySelectorAll('[data-fe]').forEach(x=>x.onclick=()=>{const w=holdFeast(x.dataset.fe);if(w){toast(w);return;}toast('The hall roars. '+PN()+' is pleased.');closeSheet();save();});});
  return h;}
function reopenSheet(){if(typeof sel!=='undefined'&&sel&&sel.b)buildingSheet(sel.b);}
