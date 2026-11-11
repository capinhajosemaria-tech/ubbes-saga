/* =================== workers =================== */
let freeWorkers=0;
const isWinter=()=>(S.gameT%YEAR)>=SUMMER;
function assignWorkers(){
  let free=workforce();const win=isWinter();
  const list=B.filter(b=>slotsOf(b)>0).sort((a,b)=>a.id-b.id);
  for(const b of list){const D=DEF[b.t];const idle=D.seasonal&&win;if(b.desired>slotsOf(b))b.desired=slotsOf(b);if(!idle&&b.desired>free)b.desired=Math.max(0,free);b.workers=idle?0:b.desired;free-=b.workers;}
  freeWorkers=typeof assignBuilders==='function'?assignBuilders(free):free;
}
