/* =================== production flows: what each building made and used, averaged per season =================== */
/* S.flow = {s:{n,p,u}, w:{n,p,u}}: s = summer days, w = winter days; p/u = {resource:{source:amount a day}}.
   Sources are building types plus 'pen' (herds), 'eat', 'fire', 'spoil' and 'other'. */
let FLOW_T=null;
const flowSnap=()=>Object.assign({},S.res);
function flowStart(){FLOW_T={p:{},u:{}};}
function flowDiff(s0,src){if(!FLOW_T)return;const r=S.res;
  for(const k in r){const d=r[k]-(s0[k]||0);if(Math.abs(d)<1e-6)continue;const L=d>0?FLOW_T.p:FLOW_T.u,o=L[k]||(L[k]={});o[src]=(o[src]||0)+Math.abs(d);}}
function flowEnd(win){if(!FLOW_T)return;S.flow=S.flow||{};const key=win?'w':'s',F=S.flow[key]||(S.flow[key]={n:0,p:{},u:{}});
  const a=Math.max(0.2,1/(F.n+1));
  for(const side of ['p','u']){const A=F[side],T=FLOW_T[side];
    for(const k in A)for(const s in A[k])A[k][s]*=1-a;
    for(const k in T)for(const s in T[k]){const o=A[k]||(A[k]={});o[s]=(o[s]||0)+a*T[k][s];}
    for(const k in A){for(const s in A[k])if(A[k][s]<0.005)delete A[k][s];if(!Object.keys(A[k]).length)delete A[k];}}
  F.n++;F.last=S.day;FLOW_T=null;}
/* a workshop waiting on inputs: say so when only the reserve holds it back */
function holdMsg(keys){const held=keys.filter(k=>S.res[k]>=0.5&&resv(k)<0.5);
  if(held.length){const k=held[0];return 'Holding: '+RNAME[k].toLowerCase()+' is at the reserve ('+resvOf(k)+')';}
  return 'Waiting for '+keys.map(k=>RNAME[k].toLowerCase()).join(' and ');}
const resvOf=k=>k==='wood'?S.woodReserve:((S.reserve&&S.reserve[k])||0);
function setResv(k,v){v=clamp(Math.round(v),0,1000);if(k==='wood')S.woodReserve=v;else S.reserve[k]=v;}
/* goods a workshop takes from the stores: these can be held back by a reserve */
const RESV_ALL=['wood','planks','iron','fish','berries','meat','grain','flour','honey','wool','flax','hides','ale','mead'];
const FLOW_NAME={pen:'Herds',eat:'Eaten',fire:'Burned as firewood',spoil:'Spoiled',other:'Events, rites and trade'};
const flowName=s=>FLOW_NAME[s]||(DEF[s]?DEF[s].name:s);
/* the season's average for one resource: {p:{src:v}, u:{src:v}} */
function flowOf(k,key){const F=S.flow&&S.flow[key||(isWinter()?'w':'s')];if(!F||!F.n)return null;return {p:F.p[k]||{},u:F.u[k]||{}};}
const sumV=o=>Object.values(o||{}).reduce((a,v)=>a+v,0);
/* winter output of a building type, as a share of its summer output */
function winterFactor(t){const D=DEF[t];if(!D)return t==='pen'?0:1;if(D.seasonal)return 0;
  if(t==='fish'){const fs=B.filter(b=>b.t==='fish');if(!fs.length)return 0.3;return fs.reduce((a,b)=>a+(waterDist(b,q=>q===T.SEA)<=3?0.4:0.25),0)/fs.length;}
  return 1;}
/* expected made / used on a winter day: the winter average when it is winter, otherwise this summer scaled by the winter losses.
   Eating and firewood are always worked out from today's village. Returns {p,u} per source. */
function winterFlow(k){const win=isWinter(),f=flowOf(k,win?'w':'s');if(!f&&!['wood','fodder'].includes(k)&&!FOOD.includes(k))return null;
  const p={},u={},src=f||{p:{},u:{}};
  for(const s in src.p){const v=src.p[s]*(win?1:winterFactor(s));if(v>0.005)p[s]=v;}
  for(const s in src.u){if(s==='eat'||s==='fire'||s==='pen')continue;const v=src.u[s]*(win?1:(winterFactor(s)?1:0));if(v>0.005)u[s]=v;}
  /* spoilage of fresh food: 3% of what is in store, the bread 2% */
  if(FRESH.includes(k)&&S.res[k]>0)u.spoil=S.res[k]*(k==='bread'?0.02:0.03);
  if(k==='wood'){const fw=fireNeed()*(S.winter&&S.winter.told&&S.winter.said?1.3:1);u.fire=fw;}
  if(k==='fodder'&&(has('pigpen')||has('sheeppen')))u.pen=herdTotal()*0.4;
  return {p:p,u:u};}
/* food counted in meals, all kinds together */
function foodFlow(key){const p={},u={};for(const k of FOOD){const f=key==='winter'?winterFlow(k):flowOf(k,key);if(!f)continue;
    for(const s in f.p)p[s]=(p[s]||0)+f.p[s]*MEAL[k];for(const s in f.u)u[s]=(u[s]||0)+f.u[s]*MEAL[k];}
  if(key==='winter'){u.eat=eatNeed();}
  return {p:p,u:u};}
/* winter days left (whole winter if it is summer) */
const winterLeft=()=>{const yt=S.gameT%YEAR;return isWinter()?Math.max(1,Math.ceil((YEAR-yt)/DAY)):Math.round((YEAR-SUMMER)/DAY);};
/* how many winter days a store lasts: Infinity if it does not shrink */
function winterDays(k){if(k==='food'){const f=foodFlow('winter'),net=sumV(f.p)-sumV(f.u);return net>=-0.01?Infinity:foodUnits()/(-net);}
  const f=winterFlow(k);if(!f)return null;const net=sumV(f.p)-sumV(f.u);if(net>=-0.01)return Infinity;
  let have=S.res[k];if(k==='wood')have+=Math.max(0,S.res.planks-resvOf('planks'))*2;return have/(-net);}

/* --- production recipes, per worker a day at level 1 (for the chain pictures) --- */
const RECIPES=[
  {b:'wood',out:{wood:3}},{b:'carp',in:{wood:4},out:{planks:2}},{b:'mine',out:{iron:2}},
  {b:'fish',out:{fish:4}},{b:'berry',out:{berries:4},note:'summer'},
  {b:'pres',in:{berries:5},out:{jam:2.5}},
  {b:'smoke',in:{meat:4,wood:1},out:{smoked:2}},{b:'smoke',in:{fish:4,wood:1},out:{smoked:2}},
  {b:'fodder',out:{fodder:5},note:'summer'},{b:'grain',out:{grain:4},note:'summer'},{b:'flax',out:{flax:4},note:'summer'},
  {b:'mill',in:{grain:4},out:{flour:4}},{b:'bakery',in:{flour:3,wood:0.5},out:{bread:3}},
  {b:'brewery',in:{grain:4,wood:1},out:{ale:4}},{b:'brewery',in:{honey:2},out:{mead:1}},
  {b:'hives',out:{honey:3},note:'summer'},
  {b:'weaver',in:{wool:2},out:{cloth:1}},{b:'weaver',in:{flax:2},out:{rope:1}},
  {b:'tailor',in:{wool:3.2,hides:1.6},out:{clothes:1.6}},
  {b:'pigpen',in:{fodder:0.4},out:{meat:10,hides:1},note:'per pig slaughtered · fodder per animal in winter'},
  {b:'sheeppen',in:{fodder:0.4},out:{wool:0.25,meat:8,hides:1},note:'wool per sheep a day in summer · meat per sheep slaughtered'}];
function recipesFor(k){const out=RECIPES.filter(r=>r.out[k]&&DEF[r.b]);
  if(typeof SMITH!=='undefined'&&SMITH[k]){const sm=SMITH[k],inp={};for(const j in sm.c)inp[j]=+(sm.c[j]*sm.per).toFixed(2);out.push({b:'smith',in:inp,out:{[k]:sm.per},lv:sm.lv});}
  return out;}
const RCOL={fish:'#7FA3B0',berries:'#A34A6A',meat:'#B0574A',bread:'#C99A5A',jam:'#8E3B5A',smoked:'#7A4E32',fodder:'#A8B060',flour:'#E6DCC4',wool:'#E9E2D0',flax:'#8FA6C0',grain:'#D9B45A',cloth:'#D8CCB0',rope:'#A9875A',hides:'#9C6E48',honey:'#E0A43A',clothes:'#6F7F9A',ale:'#C98E3A',mead:'#D7B04A',misc:'#8E877D',spears:'#8C949A',shields:'#A34A3A',bows:'#8E6A45',arrows:'#7A6A55',swords:'#B7BCBF',axes:'#9AA0A4',armour:'#6E7478',gold:'#D9B45A'};
/* a resource picture: the drawn icon if there is one, otherwise a small tinted sack */
function resIco(k,sz){sz=sz||16;if(ICON[k])return ICON[k].replace(/width="14" height="14"/,'width="'+sz+'" height="'+sz+'"');
  const c=RCOL[k]||'#9C8A6E';return '<svg width="'+sz+'" height="'+sz+'" viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4 H14 L12.6 6.4 Q17.6 9 17 14.6 Q16.4 18 10 18 Q3.6 18 3 14.6 Q2.4 9 7.4 6.4 Z" fill="'+c+'" stroke="#4A3C30" stroke-width="0.8" stroke-linejoin="round"/><path d="M7.4 6.4 H12.6" stroke="#4A3C30" stroke-width="1"/></svg>';}
