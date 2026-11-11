/* =================== resource sources: a fixed amount a year =================== */
/* Trees, berry bushes, iron outcrops and fishing water give a fixed amount each year and stay on the map.
   Everything refills at the start of summer (spring), so winter draws on what is left.
   A building works the sources within its radius; buildings of the same kind sharing a source split it. */
/* 0.15.3 (José): sources never run out; a building only needs one source in range for full output */
const SRC_ENDLESS=true;
const SRC_Y={tree:8,bush:25,iron:60,sea:20,river:12};
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
function maxYear(t,lvl,slots){const per={wood:3,berry:4,mine:2,fish:4}[t]||0,m=srcLvlMult(t,lvl);
  const days=t==='berry'?30:t==='fish'?30+15*0.4:45;return slots*per*m*days;}
/* expected share of maximum output, 0..1, and the source count; planned=true when b is not placed yet */
function srcInfo(b,planned){const t=b.t,list=srcList(b);let share=0,shared=0;
  for(const o of list){const k=srcShare(o,t,planned?null:b,planned);share+=o.cap/k;if(k>1)shared++;}
  const sl=planned?(DEF[t].slots||0):slotsOf(b),mx=maxYear(t,planned?1:b.lvl,Math.max(1,sl));
  let left=0;for(const o of list)left+=o.amt/srcShare(o,t,planned?null:b,planned);
  if(SRC_ENDLESS)return {n:list.length,shared:shared,share:share,pct:list.length?1:0,left:Infinity,list:list};
  return {n:list.length,shared:shared,share:share,pct:mx>0?Math.min(1,share/mx):0,left:left,list:list};}
function srcLabel(b,planned){const k=SRC_OF[b.t],w=SRC_WORD[k],I=srcInfo(b,planned);
  if(!I.n)return {n:0,label:'No '+w[1]+' in range'};
  if(SRC_ENDLESS)return {n:I.n,label:I.n+' '+(I.n===1?w[0]:w[1])+' in range · full output',pct:1};
  let s=I.n+' '+(I.n===1?w[0]:w[1])+' in range'+(I.shared?' ('+I.shared+' shared)':'')+' · '+Math.round(I.pct*100)+'% of full output';
  if(!planned)s+=' · '+fmt(I.left)+' '+RNAME[SRC_RES[b.t]].toLowerCase()+' left this year';
  return {n:I.n,label:s,pct:I.pct};}
/* take up to `want` from the building's sources, each shared source split between the buildings using it */
function harvest(b,want){if(want<=0)return 0;if(SRC_ENDLESS)return srcList(b).length?want:0;const list=srcList(b).filter(o=>o.amt>0.001);if(!list.length)return 0;
  const w=list.map(o=>1/srcShare(o,b.t,b,false)),ws=w.reduce((a,c)=>a+c,0);let got=0;
  list.forEach((o,i)=>{const take=Math.min(o.amt,want*w[i]/ws);o.amt-=take;got+=take;});
  let rest=want-got;for(const o of list){if(rest<=0.001)break;const take=Math.min(o.amt,rest);o.amt-=take;got+=take;rest-=take;}
  return got;}
/* save: only sources not full, as [kind, index, amount] */
function srcSave(){const out=[];[trees,bushes,ores,waters].forEach((a,k)=>a.forEach((o,i)=>{if(!o.gone&&o.amt<o.cap-0.05)out.push([k,i,Math.round(o.amt*10)/10]);}));return out;}
function srcLoad(d){refillSources();if(!Array.isArray(d))return;const A=[trees,bushes,ores,waters];for(const e of d){const a=A[e[0]];if(a&&a[e[1]])a[e[1]].amt=Math.max(0,Math.min(a[e[1]].cap,+e[2]||0));}}
