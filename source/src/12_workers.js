/* =================== workers =================== */
/* Beta 0.x: every workplace has a priority instead of a chosen head count.
   0 Stopped · 1 Low · 2 High · 3 Urgent. Urgent places are filled to the last post first (oldest first),
   then High places share what is left one worker at a time, then Low places do the same.
   Seasonal places (berry gatherers) stop in winter and go back to their own priority in summer.
   Construction is done by the builders of the Town Hall: 2 + Town Hall level posts, with their own priority;
   builders only take people while something is being built. */
let freeWorkers=0,buildersWorking=0;
const isWinter=()=>(S.gameT%YEAR)>=SUMMER;
const PRIO=['Stopped','Low','High','Urgent'];
const PRIO_DEF=2;
const builderSlots=()=>2+(typeof thLevel==='function'?thLevel():1);
const prioOf=b=>(b.prio===undefined||b.prio===null)?PRIO_DEF:b.prio;
const builderPrio=()=>(S.bPrio===undefined||S.bPrio===null)?PRIO_DEF:S.bPrio;
const winterStopped=b=>!!(DEF[b.t].seasonal&&isWinter());
/* an extractor whose own sources are all used up sends its workers elsewhere until they come back */
const srcEmpty=b=>{if(typeof SRC_NEED==='undefined'||!SRC_NEED[b.t]||typeof srcOwn!=='function')return false;const o=srcOwn(b);return o.length>0&&o.every(q=>q.amt<=0.01);};
/* how many builders the sites could use right now */
const builderDemand=()=>Math.min(builderSlots(),B.filter(q=>q.cons).reduce((s,q)=>s+q.cons.w,0));
function assignWorkers(){
  let free=workforce();
  const list=B.filter(b=>slotsOf(b)>0).sort((a,b)=>a.id-b.id);
  /* balance bots still pick head counts themselves (b.desired) */
  if(S.manualStaff){for(const b of list){const idle=winterStopped(b);if(b.desired>slotsOf(b))b.desired=slotsOf(b);if(!idle&&b.desired>free)b.desired=Math.max(0,free);b.workers=idle?0:b.desired;free-=b.workers;}
    const nb=Math.min(free,B.filter(q=>q.cons).reduce((s,q)=>s+q.cons.w,0));buildersWorking=nb;spreadBuilders(nb);freeWorkers=free-nb;return;}
  const E=list.map(b=>({b:b,p:prioOf(b),cap:(winterStopped(b)||srcEmpty(b))?0:slotsOf(b),n:0}));
  E.unshift({b:null,p:builderPrio(),cap:builderDemand(),n:0});
  for(const e of E)if(e.p<=0)e.cap=0;
  for(const e of E)if(e.p===3){const k=Math.min(e.cap,free);e.n=k;free-=k;}
  for(const p of [2,1]){const T=E.filter(e=>e.p===p&&e.cap>0);let go=true;
    while(free>0&&go){go=false;for(const e of T){if(free<=0)break;if(e.n<e.cap){e.n++;free--;go=true;}}}}
  for(const e of E){if(e.b){e.b.workers=e.n;e.b.desired=e.n;}else buildersWorking=e.n;}
  spreadBuilders(buildersWorking);
  freeWorkers=free;
}
/* builders go to the oldest site first */
function spreadBuilders(n){for(const b of B.filter(q=>q.cons).sort((a,c)=>a.id-c.id)){const k=Math.max(0,Math.min(b.cons.w,n));b.cons.builders=k;n-=k;}}
/* people who could be taken off work for training: the free ones plus everyone not on an Urgent job */
function spareWorkers(){if(S.manualStaff)return freeWorkers;let s=freeWorkers;for(const b of B)if(slotsOf(b)>0&&prioOf(b)<3)s+=b.workers||0;if(builderPrio()<3)s+=buildersWorking;return s;}
/* the priority buttons used on building sheets and the Town Hall */
function prioHtml(id,p){return '<div class="prio" role="group" aria-label="Work priority">'+PRIO.map((n,i)=>'<button type="button" data-'+id+'="'+i+'" aria-pressed="'+(i===p)+'">'+n+'</button>').join('')+'</div>';}
