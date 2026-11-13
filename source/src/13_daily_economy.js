/* =================== daily economy =================== */
function dayTick(){
  S.day++;const win=isWinter(),r=S.res;assignWorkers();
  const before={food:foodUnits(),wood:r.wood,planks:r.planks,iron:r.iron,tools:r.tools,water:r.water,silver:r.silver,fame:S.fame};PRODLOG={};flowStart();
  let marketOn=false,tavernOn=0;
  for(const b of B){const D=DEF[b.t];b.made='';PRODSRC=b.t;
    if(underCons(b)){b.status=consStatus(b);continue;}
    if(!slotsOf(b)){b.status=b.cons?consStatus(b):'ok';continue;}
    if(D.seasonal&&win){b.status='Resting for winter: workers free for other jobs';continue;}
    if(!b.conn&&D.road!==false){b.status='No road to the Town Hall';continue;}
    if(b.workers===0){b.status=prioOf(b)===0?'Stopped':'No workers: raise its priority';continue;}
    const n=b.workers;let tf=1;const f0=flowSnap();
    if(D.tools){if(r.tools<=0)tf=D.farm?0.15:0.6;else r.tools=Math.max(0,r.tools-n/60);}
    const E=tf*(b.lvl>=5?1.55:b.lvl>=4?1.4:FIELDS.has(b.t)&&b.lvl>=3?1.3:b.lvl>=2?1.2:1)*prodMult(b);
    b.status=tf<1?'Working slowly: no tools':'Working';
    const mk=(k,a)=>{const g=addRes(k,a);b.made=(b.made?b.made+', ':'')+'+'+g.toFixed(1)+' '+(RNAME[k]||k).toLowerCase();if(a>0.01&&g<a*0.5)b.status='Storage full';return g;};
    switch(b.t){
      case 'wood':{const got=harvest(b,n*SRC_RATE.wood*E);if(got<=0.001)b.status=srcOwn(b).length?'Trees used up: they grow back 3 days after winter':srcList(b).length?'Every tree in range belongs to another lodge':'No trees in range';mk('wood',got);break;}
      case 'carp':{const av=Math.max(0,r.wood-S.woodReserve),p=Math.min(n*2*E,av/2);if(p<=0.05){b.status=holdMsg(['wood']);break;}r.wood-=p*2;mk('planks',p);break;}
      case 'mine':{const got=harvest(b,n*2*E);if(got<=0.001)b.status=srcOwn(b).length?'Ore used up: it comes back every two years, when winter starts':srcList(b).length?'Every outcrop in range belongs to another mine':'No iron in range';mk('iron',got);break;}
      case 'smith':{if(b.anvil<=0){if(r.iron>=10){r.iron-=10;b.anvil=100;toast('The smith forged a new anvil (10 iron).');}else{b.status='Anvil broken: needs 10 iron';break;}}
        let md=b.mode;if(!SMITH[md]||SMITH[md].lv>thLevel())md='tools';const sm=SMITH[md];let make=n*sm.per*E;
        for(const k in sm.c){make=Math.min(make,resv(k)/sm.c[k]);}
        if(make<=0.01){b.status=holdMsg(Object.keys(sm.c));break;}
        const g=mk(md,make);for(const k in sm.c)r[k]-=g*sm.c[k];b.anvil-=1;if(miscUse())addRes('misc',g*0.03*(md==='arrows'?0.1:1));break;}
      case 'fish':{const sea=waterDist(b,t=>t===T.SEA)<=3?1:0,got=harvest(b,n*4*E*(win?(sea>0?0.4:0.25):1));if(got<=0.001)b.status=srcOwn(b).length?'Fished out: the fish come back when summer starts':srcList(b).length?'Every water tile in range belongs to another hut':'No water in range';mk('fish',got);if(sea>0&&miscUse())addRes('misc',n*0.02);break;}
      case 'berry':{const got=harvest(b,n*4*E);if(got<=0.001)b.status=srcOwn(b).length?'Bushes picked clean: they come back next summer':srcList(b).length?'Every bush in range belongs to another gatherer':'No bushes in range';mk('berries',got);break;}
      case 'pres':{let made=0;for(let k=0;k<Math.round(n*(E>1?1.25:1));k++){
          if(resv('fish')>=2&&resv('fish')>=resv('berries')){r.fish-=2;made+=addRes('dfish',1);}
          else if(resv('berries')>=2){r.berries-=2;made+=addRes('jam',1);}}
        if(!made)b.status='Waiting for fish or berries';else b.made='+'+made+' preserved';break;}
      case 'market':{marketOn=true;b.made='Drawing newcomers';b.status='Drawing newcomers';break;}
      case 'fodder':mk('fodder',n*5*E);break;
      case 'grain':mk('grain',n*4*E);break;
      case 'flax':mk('flax',n*4*E);break;
      case 'smoke':{/* fractions carry over day to day, so every level counts */
        b.acc=(b.acc||0)+n*E;let made=0;
        while(b.acc>=1){if(resv('meat')>=2&&resv('wood')>=0.5){r.meat-=2;r.wood-=0.5;made+=addRes('smoked',1);}else if(resv('fish')>=2&&resv('wood')>=0.5){r.fish-=2;r.wood-=0.5;made+=addRes('smoked',1);}else break;b.acc-=1;}
        if(b.acc>1)b.acc=1;
        if(!made&&!(b.acc>0&&b.acc<1))b.status=resv('wood')<0.5&&r.wood>=0.5?holdMsg(['wood']):'Waiting for meat or fish';else b.made='+'+made+' smoked';break;}
      case 'mill':{const u=Math.min(n*4*E,resv('grain'));if(u<=0.05){b.status=holdMsg(['grain']);break;}r.grain-=u;mk('flour',u);break;}
      case 'bakery':{const u=Math.min(n*3*E,resv('flour'),resv('wood')*6);if(u<=0.05){b.status=holdMsg(['flour','wood']);break;}r.flour-=u;r.wood-=u/6;mk('bread',u);break;}
      case 'tavern':{/* drinks: 1 ale a day for every 15 people; mead counts double and cheers more */
        const need=Math.max(0.5,S.pop/15);let bonus=0;
        if(resv('mead')>=need/2){r.mead-=need/2;bonus=8;b.made='Mead flows';}else if(resv('ale')>=need){r.ale-=need;bonus=5;b.made='Ale flows';}
        if(!bonus)b.status='Waiting for ale or mead';tavernOn=Math.max(tavernOn,bonus);break;}
      case 'weaver':{let made='';for(let k=0;k<n;k++){const needCloth=r.cloth<=r.rope;
          if(needCloth&&resv('wool')>=2){r.wool-=2;addRes('cloth',E);made='cloth';}else if(resv('flax')>=2){r.flax-=2;addRes('rope',E);made=made||'rope';}else if(resv('wool')>=2){r.wool-=2;addRes('cloth',E);made='cloth';}}
        if(!made)b.status='Waiting for wool or flax';else b.made='Weaving '+made;break;}
      case 'pigpen':{const f=Math.min(1,n/2)*E;if(!win&&S.herd.pigs>=2)S.herdAccP=(S.herdAccP||0)+S.herd.pigs*0.05*f/count('pigpen');b.made=S.herd.pigs+' pigs';break;}
      case 'sheeppen':{const f=Math.min(1,n/2)*E;
        if(!win){if(S.herd.sheep>=2)S.herdAccS=(S.herdAccS||0)+S.herd.sheep*0.035*f/count('sheeppen');if(woolUse())mk('wool',S.herd.sheep*0.25*f/count('sheeppen'));else b.made='Sheep unshorn: wool waits for a weaver or a merchant';}
        b.made=(b.made?b.made+' · ':'')+S.herd.sheep+' sheep';break;}
      case 'brewery':{let made='';const ua=Math.min(n*E,resv('grain')/2,resv('wood')*2);if(ua>0.05){r.grain-=ua*2;r.wood-=ua*0.5;addRes('ale',ua*2);made='ale';}
        if(resv('honey')>=2){const um=Math.min(n*E*0.5,resv('honey')/2);r.honey-=um*2;addRes('mead',um);made=made?made+' and mead':'mead';}
        if(!made)b.status='Waiting for grain or honey';else b.made='Brewing '+made;break;}
      case 'hives':mk('honey',n*3*E);break;
      case 'tailor':{const u=Math.min(n*E*0.8,resv('wool')/2,resv('hides'));if(u<=0.05){b.status=holdMsg(['wool','hides']);break;}r.wool-=u*2;r.hides-=u;mk('clothes',u);break;}
      case 'hof':{const g=GOD_KEYS.slice().sort((a,c)=>S.gods[a]-S.gods[c])[0];addFavor(g,0.6*n);b.made='The gothi honours '+GODS[g].n;break;}
      case 'tomb':{if(!b.proj){b.status='Waiting to begin: needs 40 gold, 6 swords and a ship';break;}if(b.proj.done>=TOMB_WORK){b.status='Finished';b.made='Ragnar rests here';break;}b.proj.done+=n*E;b.made=Math.floor(100*b.proj.done/TOMB_WORK)+'% raised';
        if(b.proj.done>=TOMB_WORK){S.tombDone=1;S.saga.push({y:yearNow(),t:'Ragnar’s ship-tomb was finished. Its mound can be seen from the sea.'});queueModal({k:'info',title:'Ragnar’s Ship-Tomb',text:'The mound is closed over the ship. From now on, Odin’s favour never falls below 30, and the tomb adds to Kaldstrand’s fame every day.'});}break;}
      case 'shipyard':{if(!b.proj){b.status='Idle: choose a ship to build';break;}b.proj.done+=n*E;
        if(b.proj.done>=SHIPS[b.proj.type].work){const nm=SHIP_NAMES[(S.shipSeq-1)%SHIP_NAMES.length];S.ships.push({id:S.shipSeq++,type:b.proj.type,name:nm,away:0,voy:0});toast('The '+SHIPS[b.proj.type].name+' “'+nm+'” was launched!',4500);
          S.saga.push({y:Math.floor(S.gameT/YEAR)+1,t:'The '+SHIPS[b.proj.type].name.toLowerCase()+' '+nm+' slid down the slipway into the bay.'});b.proj=null;}
        else b.made=Math.floor(100*b.proj.done/SHIPS[b.proj.type].work)+'% built';break;}
    }
    flowDiff(f0,b.t);
  }
  S.tavernOn=tavernOn;
  PRODSRC='pen';let f0=flowSnap();/* herds: births, winter fodder, slaughter above the pens' room */
  if(has('pigpen')||has('sheeppen')){
    while((S.herdAccP||0)>=1){S.herdAccP-=1;S.herd.pigs++;}
    while((S.herdAccS||0)>=1){S.herdAccS-=1;S.herd.sheep++;}
    if(win){const need=herdTotal()*0.4;if(r.fodder>=need)r.fodder-=need;else{r.fodder=0;if(herdTotal()>2){if(S.herd.pigs>=S.herd.sheep&&S.herd.pigs>1)S.herd.pigs--;else if(S.herd.sheep>1)S.herd.sheep--;toast('An animal died for want of fodder.');}}}
    while(S.herd.pigs>pigCap()){S.herd.pigs--;addRes('meat',10);if(hideUse())addRes('hides',1);if(miscUse())addRes('misc',0.5);}
    while(S.herd.sheep>sheepCap()){S.herd.sheep--;addRes('meat',8);if(hideUse())addRes('hides',1);}
  }
  flowDiff(f0,'pen');PRODSRC='other';/* trader: in summer, every 12 days for 4 days, needs a trading house and a harbour */
  if(has('trade')&&has('harbour')&&!win){const d=S.day%12;if(d===1&&!S.trader){const tr=newTrader();if(tr){S.trader=tr;toast('A merchant ship from '+PARTNERS[tr.from].n+' is moored at the harbour. Open the trading house to trade.',4500);}}}
  if(S.trader&&(S.day>=S.trader.until||win))S.trader=null;
  /* consumption: fresh first, then bread, then preserved */
  let short='';
  let need=eatNeed();f0=flowSnap();
  for(const k of ['fish','berries','meat','bread','dfish','jam','smoked']){if(need<=0)break;const e=Math.min(r[k],need/MEAL[k]);r[k]-=e;need-=e*MEAL[k];}
  if(need>0.01)short='food';flowDiff(f0,'eat');f0=flowSnap();
  if(!burnFire(fireToday()))short=short||'firewood';flowDiff(f0,'fire');f0=flowSnap();
  ['fish','berries','meat'].forEach(k=>r[k]*=0.97);r.bread*=0.98;flowDiff(f0,'spoil');
  for(const k in r)if(r[k]<0)r[k]=0;
  /* people */
  if(short)S.lastShort=short;else{S.lastShort='';
    if(foodUnits()<eatNeed()*3)toast('Food runs out in under 3 days. Put more people on food.',3600);
    else if(win&&r.wood+Math.max(0,r.planks-((S.reserve&&S.reserve.planks)||0))*2<fireNeed()*3)toast('Firewood runs out in under 3 days.',3600);
    else if(matItems()>capMat()*0.95)toast('The storehouses are full. Build or upgrade a warehouse, or spend some goods.',3600);
    else if(r.tools<2&&B.some(b=>DEF[b.t].tools&&b.workers>0))toast(has('smith')?'Tools are almost gone. Put workers in the smithy.':'Tools are almost gone. Work will slow down until a smithy forges more.',3600);}
  f0=flowSnap();p2Day(short);flowDiff(f0,'other');flowEnd(win);
  /* nature */
  const yt=S.gameT%YEAR;if(S.day>1)sourceSeasons(Math.floor((yt+DAY*0.01)/DAY)%45,yearNow());
  S.bal={food:foodUnits()-before.food,wood:r.wood-before.wood,planks:r.planks-before.planks,iron:r.iron-before.iron,tools:r.tools-before.tools,water:r.water-before.water,silver:r.silver-before.silver,fame:S.fame-before.fame};S.prodLog=PRODLOG;PRODLOG=null;PRODSRC='other';
  checkMilestones();
}
function checkMilestones(){
  for(const m of MS)if(S.ms.includes(m.id))m.unlock.forEach(u=>{if(!S.avail.includes(u))S.avail.push(u);});/* older saves: grant unlocks moved to earlier goals */
  for(const m of MS){if(S.ms.includes(m.id))continue;if(m.test()){S.ms.push(m.id);addFame(m.fame);m.unlock.forEach(u=>{if(!S.avail.includes(u))S.avail.push(u);});
    S.saga.push({y:Math.floor(S.gameT/YEAR)+1,t:m.saga});
    const un=m.unlock.length?' Unlocked: '+m.unlock.map(u=>DEF[u].name).join(', ')+'.':'';
    toast('Saga · '+m.title+' · +'+m.fame+' fame.'+un,4200);}}
}
const currentGoal=()=>MS.find(m=>!S.ms.includes(m.id)&&m.lv<=thLevel());
function thReq(){const lv=thLevel()+1,u=TH_UP[lv];if(!u)return null;const hall=B.find(b=>b.t==='th');
  if(hall&&hall.cons)return {lv:lv,cost:u.cost,items:[{ok:false,t:consStatus(hall)}],ok:false,busy:true};
  const items=[{ok:S.pop>=u.pop,t:'At least '+u.pop+' people ('+S.pop+')'},
    {ok:B.some(b=>b.t==='house'&&b.lvl>=u.house),t:u.house>1?'A house at level '+u.house:'A house'},{ok:afford(u.cost),t:'Materials: '+costStr(u.cost)}];
  if(SBX())return {lv:lv,cost:u.cost,items:[{ok:true,t:'Sandbox: no requirements'}],ok:true};
  return {lv:lv,cost:u.cost,items:items,ok:items.every(i=>i.ok)};}
function roadReach(){recomputeConn();const R=new Uint8Array(N*N),q=[];for(let i=0;i<N*N;i++)if(roads[i]&&conn[i]){R[i]=1;q.push(i);}
  let qi=0;while(qi<q.length){const k=q[qi++],x=k%N,y=(k/N)|0;for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+d[0],ny=y+d[1];if(!inMap(nx,ny))continue;const nk=ny*N+nx;if(R[nk]||occ[nk]||walls[nk]===1||!isUnl(nx,ny))continue;if(!(roads[nk]||BUILDABLE.has(ter[nk])||ter[nk]===T.RIVER))continue;R[nk]=1;q.push(nk);}}return R;}
function yardSpot(x0,y0,x1,y1,R){for(let y=Math.max(0,y0);y<Math.min(N,y1);y++)for(let x=Math.max(0,x0);x<Math.min(N,x1);x++)for(const rot of [0,1]){if(!canPlace('shipyard',x,y,rot,0).ok)continue;const d=dims('shipyard',rot);if(edgeTiles({fx:x,fy:y,w:d.w,h:d.h}).some(p=>R[p[1]*N+p[0]]))return true;}return false;}
function yardFits(){return yardSpot(0,0,N,N,roadReach());}
function claimShore(){if(B.some(b=>b.t==='shipyard')||yardFits())return null;let best=null;
  for(let zx=0;zx<ZN;zx++)for(let zy=0;zy<ZN;zy++){const k=zx+','+zy;if(unlocked.has(k))continue;let adj=false;for(const d of [[1,0],[-1,0],[0,1],[0,-1]])if(unlocked.has((zx+d[0])+','+(zy+d[1])))adj=true;if(!adj)continue;
    unlocked.add(k);const ok=yardSpot(zx*6-4,zy*6-4,zx*6+6,zy*6+6,roadReach());unlocked.delete(k);
    if(ok){const dd=Math.hypot(zx-ZC_X,zy-ZC_Y);if(!best||dd<best.d)best={k:k,d:dd,zx:zx,zy:zy};}}
  if(best){unlocked.add(best.k);return best;}return null;}
function upgradeTH(){const q=thReq();if(!q||!q.ok)return false;pay(q.cost,1);const hall=B.find(b=>b.t==='th');if(hall){startCons(hall,'th',q.lv);assignWorkers();toast('The builders start raising the Town Hall to level '+q.lv+'.',4000);return true;}finishTH(q.lv);return true;}
function finishTH(lv){const q={lv:lv};S.th=q.lv;assignWorkers();checkMilestones();
  if(q.lv===3){const c=claimShore();if(c)S.shoreClaimed=true;if(c)setTimeout(()=>toast('Your jarl claims a stretch of shore for the shipyard: '+zoneName(c.zx,c.zy)+' is now yours.',6000),6200);}
  toast('The Town Hall reached level '+q.lv+'! New buildings are in the Build menu.'+(q.lv===2?' Keep a stretch of the bay shore free: at level 3 it will hold a shipyard.':''),6000);}
