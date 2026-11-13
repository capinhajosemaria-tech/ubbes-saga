/* =================== resource sources: a fixed amount a year =================== */
/* Trees, berry bushes, iron outcrops and fishing water give a fixed amount each year and stay on the map.
   Everything refills at the start of summer (spring), so winter draws on what is left.
   A building works the sources within its radius; buildings of the same kind sharing a source split it. */
/* 0.15.4 (José): sources never run out, but each one belongs to a single building.
   Full output needs SRC_NEED sources of its own in range (fewer = less output). 0.15.5: lodges need 45 trees, fisher's huts 5 water tiles. */
const SRC_ENDLESS=true;
/* Beta 0.18 (José): sources run out again. Each source still belongs to one building, but holds a yearly amount that is used up.
   Trees regrow 3 days after winter ends (a used-up tree is drawn as a stump); bushes and water refill when summer starts;
   iron outcrops refill every two years, when winter starts. Lodges now need 20 trees (each gives far more wood). */
const SRC_NEED={wood:20,mine:5,berry:6,fish:5};
const SRC_RATE={wood:5,berry:4,mine:2,fish:4};
let CLAIM_KEY='',CLAIM=new Map();
/* every extractor claims the nearest free sources in its range, oldest building first */
function srcClaims(){const gone=trees.reduce((a,t)=>a+(t.gone?1:0),0)+bushes.reduce((a,t)=>a+(t.gone?1:0),0);
  const key=B.filter(b=>SRC_NEED[b.t]).map(b=>b.id+b.t+b.fx+','+b.fy+','+b.w).join('|')+'#'+gone;
  if(key===CLAIM_KEY)return CLAIM;CLAIM_KEY=key;CLAIM=new Map();const taken=new Set();
  for(const b of B.filter(q=>SRC_NEED[q.t]).sort((a,c)=>a.id-c.id)){const own=srcFree(b,taken);own.forEach(o=>taken.add(o));CLAIM.set(b.id,own);}
  CLAIM.taken=taken;return CLAIM;}
function srcFree(b,taken){return srcList(b).filter(o=>!taken.has(o)).sort((p,q)=>rectDist(b,p.x,p.y)-rectDist(b,q.x,q.y)).slice(0,SRC_NEED[b.t]);}
const srcOwn=b=>srcClaims().get(b.id)||[];
/* share of full output the sources allow: 0..1 */
function srcFactor(b){const need=SRC_NEED[b.t];if(!need)return srcList(b).length?1:0;return Math.min(1,srcOwn(b).length/need);}
const SRC_Y={tree:50,bush:45,iron:40,sea:100,river:85};
/* Beta 0.22 (B2): each source yields more for a higher-level owner (the map does not change; the same tree gives more wood).
   Stored amounts stay in base units: the owner takes 1 unit of source for every srcYMult units of output. */
const SRC_YM=[1,1.3,1.5,1.75,2];
const srcYMult=lvl=>SRC_YM[Math.max(1,Math.min(5,lvl||1))-1];
/* multiplier of the building that owns source o (1 when nobody owns it) */
function srcTileMult(o){const C=srcClaims();for(const b of B){const own=C.get(b.id);if(own&&own.includes(o))return srcYMult(b.lvl);}return 1;}
const SRC_OF={wood:'tree',berry:'bush',mine:'iron',fish:'water'};
const SRC_R={wood:6,berry:5,mine:4,fish:3};
const SRC_WORD={tree:['tree','trees'],bush:['berry bush','berry bushes'],iron:['iron outcrop','iron outcrops'],water:['water tile','water tiles']};
const SRC_RES={wood:'wood',berry:'berries',mine:'iron',fish:'fish'};
/* iron and fishing water: one source per tile, looked up by tile index */
const ores=[],waters=[],SRCAT=new Array(N*N);
for(let i=0;i<N*N;i++){const t=ter[i],x=i%N,y=(i/N)|0;
  if(t===T.IRON){const o={x:x,y:y,cap:SRC_Y.iron,amt:SRC_Y.iron};ores.push(o);SRCAT[i]=o;}
  else if(t===T.SEA||t===T.RIVER){const o={x:x,y:y,cap:t===T.SEA?SRC_Y.sea:SRC_Y.river,amt:0};o.amt=o.cap;waters.push(o);SRCAT[i]=o;}}
for(const t of trees){t.cap=SRC_Y.tree;t.amt=t.cap;t.regrow=0;}
for(const b of bushes){b.cap=SRC_Y.bush;b.amt=b.cap;}
function refillSources(){for(const a of [trees,bushes,ores,waters])for(const o of a)if(!o.gone)o.amt=o.cap;}
function refillKind(a){for(const o of a)if(!o.gone)o.amt=o.cap;}
/* called once at the start of each day: d = day of the year (0..44, winter from day 30) */
const SRC_BACK={tree:'3 days after winter ends',bush:'when summer starts',water:'when summer starts',iron:'every year, when winter starts'};
function sourceSeasons(d,year){if(d===0){refillKind(bushes);refillKind(waters);}if(d===3)refillKind(trees);if(d===30)refillKind(ores);}
/* sources a building (or a planned building {t,fx,fy,w,h}) works */
function srcList(b){const k=SRC_OF[b.t],r=SRC_R[b.t];if(!k)return [];
  if(k==='tree')return trees.filter(o=>!o.gone&&rectDist(b,o.x,o.y)<=r);
  if(k==='bush')return bushes.filter(o=>!o.gone&&rectDist(b,o.x,o.y)<=r);
  const out=[];for(let y=b.fy-r;y<b.fy+b.h+r;y++)for(let x=b.fx-r;x<b.fx+b.w+r;x++){if(!inMap(x,y))continue;const o=SRCAT[y*N+x];if(!o||o.gone)continue;
    const tt=ter[y*N+x];if(k==='iron'?tt!==T.IRON:!(tt===T.SEA||tt===T.RIVER))continue;out.push(o);}return out;}
/* how many buildings of kind t work source o (plus a planned one) */
function srcShare(o,t,self,extra){let n=0;for(const q of B)if(q.t===t&&q!==self&&rectDist(q,o.x,o.y)<=SRC_R[t])n++;if(extra)n++;return n||1;}
/* most a building could make in a year: all slots filled, at its level, no morale or tools effects */
function srcLvlMult(t,lvl){return lvl>=5?1.55:lvl>=4?1.4:lvl>=2?1.2:1;}
function maxYear(t,lvl,slots){const per=SRC_RATE[t]||0,m=srcLvlMult(t,lvl);
  const days=t==='berry'?30:t==='fish'?30+15*0.4:45;return slots*per*m*days;}
/* expected share of maximum output, 0..1, and the source count; planned=true when b is not placed yet */
function srcInfo(b,planned){const t=b.t,list=srcList(b);let share=0,shared=0;
  for(const o of list){const k=srcShare(o,t,planned?null:b,planned);share+=o.cap/k;if(k>1)shared++;}
  const sl=planned?(DEF[t].slots||0):slotsOf(b),mx=maxYear(t,planned?1:b.lvl,Math.max(1,sl));
  let left=0;for(const o of list)left+=o.amt/srcShare(o,t,planned?null:b,planned);
  if(SRC_ENDLESS){const need=SRC_NEED[t];if(!need)return {n:list.length,need:0,inR:list.length,pct:list.length?1:0,left:Infinity,list:list};
    const C=srcClaims(),own=planned?srcFree(b,C.taken):srcOwn(b),ym=srcYMult(planned?1:b.lvl);let lf=0,cp=0;for(const o of own){lf+=o.amt*ym;cp+=o.cap*ym;}return {n:own.length,need:need,inR:list.length,pct:Math.min(1,own.length/need),left:lf,cap:cp,empty:own.filter(o=>o.amt<=0.01).length,list:own};}
  return {n:list.length,shared:shared,share:share,pct:mx>0?Math.min(1,share/mx):0,left:left,list:list};}
function srcLabel(b,planned){const k=SRC_OF[b.t],w=SRC_WORD[k],I=srcInfo(b,planned);
  if(!I.n)return {n:0,label:'No '+w[1]+' in range'};
  if(SRC_ENDLESS){if(!I.need)return {n:I.n,label:I.n+' '+(I.n===1?w[0]:w[1])+' in range · full output',pct:1};
    const other=I.inR-I.n;return {n:I.n,pct:I.pct,label:I.n+' of '+I.need+' '+w[1]+' its own · '+Math.round(I.pct*100)+'% output'+(planned?'':' · '+fmt(I.left)+' of '+fmt(I.cap)+' '+RNAME[SRC_RES[b.t]].toLowerCase()+' left'+(I.left<=0.01?', comes back '+SRC_BACK[k]:''))+(other>0?' · '+other+' more in range belong to other buildings':'')};}
  let s=I.n+' '+(I.n===1?w[0]:w[1])+' in range'+(I.shared?' ('+I.shared+' shared)':'')+' · '+Math.round(I.pct*100)+'% of full output';
  if(!planned)s+=' · '+fmt(I.left)+' '+RNAME[SRC_RES[b.t]].toLowerCase()+' left this year';
  return {n:I.n,label:s,pct:I.pct};}
/* take up to `want` from the building's sources, each shared source split between the buildings using it */
function harvest(b,want){if(want<=0)return 0;if(SRC_ENDLESS){const ym=srcYMult(b.lvl);want*=srcFactor(b)/ym;const own=srcOwn(b).filter(o=>o.amt>0.001);if(!own.length)return 0;
    /* take evenly from the building's own sources (the fullest first when some run dry) */
    let got=0,rest=want;own.sort((p,q)=>q.amt-p.amt);for(let i=0;i<own.length&&rest>0.0001;i++){const o=own[i],take=Math.min(o.amt,rest/(own.length-i));o.amt-=take;got+=take;rest-=take;}
    if(rest>0.0001)for(const o of own){const take=Math.min(o.amt,rest);o.amt-=take;got+=take;rest-=take;if(rest<=0.0001)break;}
    return got*ym;}const list=srcList(b).filter(o=>o.amt>0.001);if(!list.length)return 0;
  const w=list.map(o=>1/srcShare(o,b.t,b,false)),ws=w.reduce((a,c)=>a+c,0);let got=0;
  list.forEach((o,i)=>{const take=Math.min(o.amt,want*w[i]/ws);o.amt-=take;got+=take;});
  let rest=want-got;for(const o of list){if(rest<=0.001)break;const take=Math.min(o.amt,rest);o.amt-=take;got+=take;rest-=take;}
  return got;}
/* save: only sources not full, as [kind, index, amount] */
function srcSave(){const out=[];[trees,bushes,ores,waters].forEach((a,k)=>a.forEach((o,i)=>{if(!o.gone&&o.amt<o.cap-0.05)out.push([k,i,Math.round(o.amt*10)/10]);}));return out;}
function srcLoad(d){refillSources();if(!Array.isArray(d))return;const A=[trees,bushes,ores,waters];for(const e of d){const a=A[e[0]];if(a&&a[e[1]])a[e[1]].amt=Math.max(0,Math.min(a[e[1]].cap,+e[2]||0));}}
