(function(DAYS,O){O=O||{};
const G=window.__G;window.__P={};const AUD={work:{},eat:{},stock:{},causes:{},evts:{},god:[],mor:[]};G.freshState(O.mode||'relaxed',O.adv||'lagertha');G.S.modal=[];if(O.child)G.S.pol.child=true;
const log=[],events=[];let LAZYF=false;const LAZY=()=>LAZYF;const BAD=new Set();let NOSPOT=0;
const RES=(()=>{const U=G.unlockedSet();let best=null;for(let y=20;y<64;y++)for(let x=20;x<64;x++)for(const rot of [0,1]){if(!G.isUnl(x,y))continue;const c=G.canPlace('shipyard',x,y,rot,0);if(!c.ok)continue;const dd=G.dims('shipyard',rot);const dist=Math.hypot(x-38,y-40);if(!best||dist<best.dist)best={x,y,w:dd.w,h:dd.h,dist};}return best;})();
const inRes=(x,y,w,h)=>RES&&x<RES.x+RES.w+1&&x+w>RES.x-1&&y<RES.y+RES.h+1&&y+h>RES.y-1;const N=G.N;
function setRoadPath(b){G.recomputeConn();if(b.conn)return true;const R=G.roads,O=G.occ,C=G.conn;const prev=new Map(),q=[];
  const ok=(x,y)=>G.inMap(x,y)&&G.isUnl(x,y)&&!O[y*N+x]&&(R[y*N+x]||G.BUILDABLE.has(G.ter[y*N+x])||G.ter[y*N+x]===G.T.RIVER);
  for(let x=b.fx-1;x<=b.fx+b.w;x++)for(let y=b.fy-1;y<=b.fy+b.h;y++){const inside=x>=b.fx&&x<b.fx+b.w&&y>=b.fy&&y<b.fy+b.h;const corner=(x<b.fx||x>=b.fx+b.w)&&(y<b.fy||y>=b.fy+b.h);if(!inside&&!corner&&ok(x,y)){const k=y*N+x;prev.set(k,-1);q.push(k);}}
  let found=-1;while(q.length){const k=q.shift();if(R[k]&&C[k]){found=k;break;}const x=k%N,y=(k/N)|0;for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+d[0],ny=y+d[1];if(!ok(nx,ny))continue;const nk=ny*N+nx;if(prev.has(nk))continue;prev.set(nk,k);q.push(nk);}}
  if(found<0)return false;let k=found;while(k!==-1){R[k]=1;k=prev.get(k);}G.recomputeConn();return true;}
function findSpot(t){const D=G.DEF[t];let best=null;
  for(let y=18;y<66;y++)for(let x=18;x<66;x++)for(const rot of [0,1]){if(rot&&D.w===D.h)continue;if(BAD.has(t+':'+x+','+y))continue;if(t!=='shipyard'){const dd0=G.dims(t,rot);if(inRes(x,y,dd0.w,dd0.h))continue;}if(!['shipyard','harbour','salt'].includes(t)){let sea=false;const dd=G.dims(t,rot);for(let yy=y-1;yy<=y+dd.h&&!sea;yy++)for(let xx=x-1;xx<=x+dd.w;xx++)if(G.inMap(xx,yy)&&G.ter[yy*N+xx]===G.T.SEA){sea=true;break;}if(sea)continue;}const c=G.canPlace(t,x,y,rot,0);if(!c.ok)continue;
    const d=G.dims(t,rot);const b={fx:x,fy:y,w:d.w,h:d.h};const dist=Math.hypot(x+d.w/2-38.5,y+d.h/2-38.5);
    let sc=D.need?Math.min(G.needCount(b,D.need).n,25)*3-dist*0.4:-dist;if(G.DEF[t].farm||t==='pen')sc=-Math.abs(dist-15)-(x>38?3:0);
    if(G.DEF[t].road!==false&&!G.DEF[t].farm){let near=99;for(let yy=y-3;yy<y+d.h+3;yy++)for(let xx=x-3;xx<x+d.w+3;xx++)if(G.inMap(xx,yy)&&G.conn[yy*N+xx])near=Math.min(near,Math.max(Math.abs(xx-x),Math.abs(yy-y)));if(near>2&&!D.need)continue;sc-=near*2;}
    if(!best||sc>best.sc)best={x,y,rot,sc};}return best;}
function oracle(t){const S=G.S;let any=false;for(let y=0;y<G.N&&!any;y++)for(let x=0;x<G.N&&!any;x++)for(const rot of [0,1]){if(G.canPlace(t,x,y,rot,0).ok){any=true;break;}}
  if(any)return 'bot';let cheap=1e9;const U=G.unlockedSet();for(let zx=0;zx<18;zx++)for(let zy=0;zy<18;zy++){const k=zx+','+zy;if(U.has(k)||!G.zoneAdj(zx,zy))continue;cheap=Math.min(cheap,G.zoneCost(zx,zy));}
  return S.fame>=cheap?'land-affordable':'game-no-fame';}
const FAIL={};
function build(t){if(LAZY())return false;if(window.__SAVING&&['jarl','camp','bench','wattle','rune','herbs','prow','nets','tomb','hof','tower','thrall','tailor','hives'].includes(t))return false;
  if(O.planner){if(G.DEF[t].lvl>G.thLevel())return false;if(G.DEF[t].lvl===1&&!G.S.avail.includes(t))return false;if(G.count(t)>=G.limitOf(t))return false;const cst=G.costOf(t);if(!G.afford(cst))return false;
    const nb=G.placeAuto(t);if(!nb){if(t==='shipyard'&&!window.__YD){window.__YD=1;const L=G.planSpot(t,true);events.push('day '+G.S.day+': YARDFAIL cands '+L.length+' '+JSON.stringify(L.slice(0,3))+' unl '+G.unlockedSet().size);}const k=t+':'+oracle(t);FAIL[k]=(FAIL[k]||0)+1;NOSPOT=5;return false;}G.pay(cst,1);nb.paid=cst;G.assignWorkers();nb.desired=Math.min(G.slotsOf(nb),G.free);G.assignWorkers();events.push('day '+G.S.day+': built '+t);G.checkMilestones();return true;}if(G.DEF[t].lvl>G.thLevel())return false;if(G.DEF[t].lvl===1&&!G.S.avail.includes(t))return false;if(G.count(t)>=G.limitOf(t))return false;
  const cst=G.costOf(t);if(!G.afford(cst))return false;const sp=findSpot(t);if(!sp){if(!G.__nospot)G.__nospot={};if(!G.__nospot[t]){G.__nospot[t]=1;events.push('day '+G.S.day+': no spot for '+t);const k=t+':'+oracle(t);FAIL[k]=(FAIL[k]||0)+1;}NOSPOT=5;return false;}
  let b=null;for(let tries=0;tries<6;tries++){const s2=tries?findSpot(t):sp;if(!s2)break;b=G.addBuilding(t,s2.x,s2.y,s2.rot,false);
    if(G.DEF[t].road===false||setRoadPath(b))break;G.B.splice(G.B.indexOf(b),1);G.rebuildOcc();G.recomputeConn();BAD.add(t+':'+s2.x+','+s2.y);b=null;}
  if(!b){events.push('day '+G.S.day+': no road for '+t);return false;}G.pay(cst,1);b.paid=cst;
  G.assignWorkers();events.push('day '+G.S.day+': built '+t);G.checkMilestones();return true;}
function staff(){const S=G.S,r=S.res,win=G.isWinter();const list=G.B.filter(b=>G.slotsOf(b)>0);list.forEach(b=>b.desired=0);let free=G.workforce();
  const give=(t,n)=>{for(const b of list.filter(b=>b.t===t)){if(G.DEF[b.t].seasonal&&win)continue;const k=Math.max(0,Math.min(n,G.slotsOf(b)-b.desired,free));b.desired+=k;free-=k;n-=k;if(n<=0)break;}};
  const pop=S.pop;if(r.iron<30)give('mine',2);
  const need=G.eatNeed()*(G.foodUnits()<G.eatNeed()*10?1.5:1.1);let f=need;
  if(!win){const g=Math.min(Math.ceil(f/4.8),G.count('garden')*2);give('garden',g);f-=g*4.8;const bN=Math.min(Math.max(0,Math.ceil(f/4)),G.count('berry')*2);give('berry',bN);f-=bN*4;}
  const hN=Math.min(Math.max(0,Math.ceil(f/2.4)),G.count('hunter')*2);give('hunter',hN);f-=hN*2.4;
  give('fish',Math.max(0,Math.ceil(f/(win?1.6:4))));
  if(G.has('pen'))give('pen',2);if(G.has('hay')&&r.hay<G.herdTotal()*9)give('hay',4);
  const spearsWanted0=G.thLevel()>=2&&r.spears<12;{const tq=G.TH_UP[G.thLevel()+1];const tn=Math.max(10,(tq&&tq.cost.tools||0)+3);if(r.tools<tn)give('smith',2);}
  const TQ=(G.TH_UP[G.thLevel()+1]||{cost:{}}).cost;const needW=(TQ.wood||0)+60;give('wood',r.wood<200||(window.__SAVING&&r.wood<needW)?6:2);if(window.__SAVING){if(r.planks<(TQ.planks||0)+20)give('carp',3);if(r.iron<(TQ.iron||0)+20)give('mine',3);}
  const roomy=(r.wood+r.planks+r.iron+r.salt+r.hay+r.wool+r.flax+r.grain+r.cloth+r.rope+r.hides)<G.capMat()*0.85;
  if(r.planks<250&&(roomy||r.planks<170))give('carp',3);if((r.iron<80||r.tools<10)&&(roomy||r.iron<70))give('mine',3);
  let wantW=null;if(G.thLevel()>=2&&S.warriors<G.warCap()&&!O.noWar){if(G.thLevel()>=3){if(r.shields<8)wantW='shields';else if(G.thLevel()>=4&&r.axes<8)wantW='axes';else if(G.thLevel()>=5&&r.armour<5&&r.hides>=1)wantW='armour';else if(r.swords<8)wantW=(r.iron>40?'swords':'spears');}else if(r.spears<8)wantW='spears';}
  const spearsWanted=!!wantW;G.B.filter(b=>b.t==='smith').forEach((b,i)=>b.mode=(r.tools>=Math.max(12,((G.TH_UP[G.thLevel()+1]||{cost:{}}).cost.tools||0)+3)&&wantW)?(i===0||!G.SMITH[wantW]?wantW:wantW):'tools');
  if(r.tools<14||spearsWanted)give('smith',2);
  if(G.has('salt')&&r.salt<40)give('salt',1);if(G.has('smoke')&&(r.meat>4||r.fish>10))give('smoke',2);if(G.has('pres')&&(r.fish>8||r.berries>8||r.veg>8))give('pres',2);
  if(G.has('grain'))give('grain',2);if(G.has('brewery')&&r.grain>6&&(r.ale||0)<40)give('brewery',2);if(G.has('bakery')&&r.grain>(G.has('brewery')&&(r.ale||0)<25?30:4))give('bakery',2);if(G.has('flax'))give('flax',2);if(G.has('weaver')&&(r.wool>=2||r.flax>=2))give('weaver',2);
  G.B.filter(b=>b.t==='shipyard'&&b.proj).forEach(b=>give('shipyard',4));
  if(G.has('market'))give('market',1);
  give('fish',6);give('wood',6);G.assignWorkers();}
const L1=['berry','wood','fish','carp','mine','ware','smith','gran','pres','market','jarl','pyre'];
const L2=['pen','hay','garden','salt','smoke','altar','train','arsenal'];
const L3=['shipyard','harbour','trade','weaver','flax','grain','bakery','hunter'];
let prevPop=G.S.pop,prevMs=0,prevTh=1;const msDay={};
for(let d=0;d<DAYS;d++){if(G.S.over)break;const S=G.S,r=S.res;
  if(d%50===0&&G.thReq()){events.push('day '+d+': MISS '+G.thReq().items.filter(i=>!i.ok).map(i=>i.t).join('; ')+' | w'+(G.S.res.wood|0)+' p'+(G.S.res.planks|0)+' i'+(G.S.res.iron|0)+' t'+(G.S.res.tools|0)+' s'+(G.S.res.silver|0)+' g'+(G.S.res.gold|0)+' fame'+(G.S.fame|0)+' ships'+G.S.ships.length+' yard'+G.count('shipyard'));}
  if(G.thReq()&&G.thReq().ok){G.upgradeTH();events.push('day '+S.day+': TOWN HALL -> '+S.th);}
  LAZYF=!!(O.lazy&&d%3!==0);
  let SAVING=false;{const q=G.thReq();if(q){const miss=q.items.filter(i=>!i.ok);SAVING=miss.length>0&&miss.every(i=>/^Materials|at level/.test(i.t));
    for(const it of miss){const m=/^(.*) at level (\d)$/.exec(it.t);if(m){const k=Object.keys(G.DEF).find(z=>G.DEF[z].name===m[1]);const bb=G.B.filter(x=>x.t===k).sort((p,q2)=>q2.lvl-p.lvl)[0];if(bb&&G.canUpgrade(bb)&&G.afford(G.upCost(bb))){G.pay(G.upCost(bb),1);bb.lvl++;events.push('day '+S.day+': upgraded '+k+' to '+bb.lvl+' (for TH)');}}}}}
  window.__SAVING=SAVING;
  const saveForYard=G.thLevel()>=3&&!G.has('shipyard')&&(r.wood<110||r.planks<70);
  if(S.pop>=G.housing()-2&&!saveForYard)build('house');
  if(G.thLevel()>=3)for(const t of ['shipyard','harbour'])if(G.count(t)===0)build(t);
  for(const t of L1){if(t==='fish'&&G.count('fish')>=1&&S.pop<16)continue;if(G.count(t)===0)build(t);}
  if(G.thLevel()>=2)for(const t of L2)if(G.count(t)===0)build(t);
  if(G.thLevel()>=3)for(const t of L3)if(G.count(t)===0)build(t);
  if(G.thLevel()>=4)for(const t of ['brewery','hives','tomb','hives'])if(G.count(t)<(t==='hives'?2:1))build(t);
  if(G.thLevel()>=5)for(const t of ['tailor','hof','tower'])if(G.count(t)===0)build(t);
  if(G.thLevel()>=4&&S.pop>=52){build('grain');build('wood');build('mine');build('fish');build('garden');build('house');}
  {const tb=G.B.find(x=>x.t==='tomb');const sh=S.ships.find(s=>!s.away&&s.type==='knarr')||null;if(tb&&!tb.proj&&r.gold>=40&&r.swords>=6&&S.ships.length>=3&&sh){r.gold-=40;r.swords-=6;S.ships=S.ships.filter(s=>s!==sh);tb.proj={done:0};events.push('day '+S.day+': TOMB begun');G.checkMilestones();}
   if(tb&&tb.proj)tb.desired=G.slotsOf(tb);}
  if(G.thLevel()>=5&&!(S.maps&&S.maps.england)&&r.gold>=40){r.gold-=40;S.maps=S.maps||{};S.maps.england=1;events.push('day '+S.day+': bought England map');G.checkMilestones();}
  if(S.pop>=16)build('fish');if(r.wood<80&&d>20)build('wood');if(S.pop>=14)build('berry');
  if(G.thLevel()>=2){const used=r.wood+r.planks+r.iron+r.salt+r.hay+r.wool+r.flax+r.grain+r.cloth+r.rope+r.hides;if(used>G.capMat()*0.65)build('ware');}
  if(G.thLevel()>=2&&S.pop>=26){build('garden');build('carp');build('mine');build('hay');build('wood');}
  if(G.thLevel()>=3&&S.pop>=36){build('grain');build('hunter');build('fish');build('wood');build('gran');build('ware');}
  // upgrades: houses when housing tight, storage when near full
  for(const b of G.B){if(SAVING)break;if(!G.canUpgrade(b))continue;const c=G.upCost(b);if(!G.afford(c))continue;
    const want=(b.t==='house'&&S.pop>=G.housing()-3&&r.wood>120)||(b.t==='gran'&&G.foodUnits()>G.capFood()*0.75)||(b.t==='ware'&&(r.wood+r.planks)>G.capMat()*0.7)||(['wood','fish','carp'].includes(b.t)&&r.planks>150&&r.wood>150);
    if(want){G.pay(c,1);b.lvl++;events.push('day '+S.day+': upgraded '+b.t+' to '+b.lvl);}}
  if(G.thLevel()===2){const w=G.B.find(x=>x.t==='ware');if(w&&w.lvl<2&&G.canUpgrade(w)&&G.afford(G.upCost(w))){G.pay(G.upCost(w),1);w.lvl++;events.push('day '+S.day+': upgraded ware to 2 (for TH3)');}}
  // altar: keep gods content, bless Freyja in summer
  if(G.has('altar')){for(const k of G.GOD_KEYS){if(S.gods[k]>=55)continue;for(const o of G.GODS[k].off){const keep=o[0]==='silver'?60:o[0]==='spears'?20:o[0]==='iron'?60:30;if(r[o[0]]>=o[1]+keep){r[o[0]]-=o[1];G.addFavor(k,o[2]);S.offers=(S.offers||0)+1;break;}}}
    if(S.gods.freyja>=80&&!G.isWinter()&&!((S.blessCd.freyja||0)>S.day)){S.gods.freyja-=30;S.blessCd.freyja=S.day+30;S.blessOn.freyja=S.day+15;events.push('day '+S.day+': blessing freyja');}
    G.checkMilestones();}
  // training: best type we can equip
  if(G.has('train')&&!S.train&&S.warriors<G.warCap()&&!(O.noWar)){const types=G.thLevel()>=5?['berserk','viking','warrior','spear','skirm']:G.thLevel()>=4?['viking','warrior','spear','skirm']:G.thLevel()>=3?['warrior','spear','skirm']:['skirm'];for(const ty of types){const why=G.startTraining(ty);if(!why){events.push('day '+S.day+': training '+S.train.n+' '+ty);break;}}}
  // ships
  const sy=G.B.find(b=>b.t==='shipyard');if(sy&&!sy.proj){for(const k of ['karvi','knarr','snekkja']){const wars=S.ships.filter(s=>s.type!=='knarr').length;const capW=[0,0,1,2,3][G.thLevel()-1];if((G.SHIPS[k].lv||3)>G.thLevel())continue;if((k==='knarr'?S.ships.filter(s=>s.type==='knarr').length<1:wars<capW&&!(k==='karvi'&&S.ships.some(s=>s.type==='karvi')))&&G.afford(G.shipCost(k))){G.pay(G.shipCost(k),1);sy.proj={type:k,done:0};events.push('day '+S.day+': keel laid '+k);break;}}}
  // trade
  if(S.trader){const keep={planks:200,wood:200,iron:80,salt:40,hay:9999,grain:60,wool:30,flax:30,hides:10,meat:20,fish:20,ale:30,mead:20,sausage:30,smoked:30,honey:20};
    for(const k of ['planks','smoked','sausage','jam','hides','salt','wool','flax','honey','mead','ale','misc','cloth','rope','dfish','pickles']){if(SAVING&&(k==='planks'))continue;let g=0;while((r[k]||0)>=(keep[k]||(O.trader?20:60))+10&&g++<20){if(G.mktSat(k)<0.8)break;r[k]-=10;r.silver+=G.priceSell(k)*10;S.mkt[k]=Math.max(0.4,G.mktSat(k)*0.93);S.trades=(S.trades||0)+1;}}
    if(SAVING){const TQ=(G.TH_UP[G.thLevel()+1]||{cost:{}}).cost;const P=G.PARTNERS[S.trader.from];for(const k of ['iron','tools','gold'])if(P&&P.sells.includes(k)){let g=0;while((r[k]||0)<(TQ[k]||0)&&r.silver>(TQ.silver||0)+G.priceBuy(k)&&g++<200){r.silver-=G.priceBuy(k);r[k]=(r[k]||0)+1;S.trades=(S.trades||0)+1;}}}
    if(G.thLevel()>=4&&r.gold<45&&r.silver>200){while(r.silver>200+G.priceBuy('gold')&&r.gold<45){r.silver-=G.priceBuy('gold');r.gold+=1;}}}
  // land
  {const U=G.unlockedSet();let best=null;for(let zx=0;zx<14;zx++)for(let zy=0;zy<14;zy++){const k=zx+','+zy;if(U.has(k)||!G.zoneAdj(zx,zy))continue;const c=G.zoneCost(zx,zy);if(c>S.fame)continue;let g=0;let sea=0;for(let y=zy*6;y<zy*6+6;y++)for(let x=zx*6;x<zx*6+6;x++){if(G.ter[y*N+x]===G.T.GRASS||G.ter[y*N+x]===G.T.BEACH)g++;if(G.ter[y*N+x]===G.T.SEA)sea++;}const wantSea=G.thLevel()>=3&&!G.has('shipyard');if(wantSea&&sea>3)g+=40;if(g>=12&&(!best||g/c>best.v))best={k,c,v:g/c};}
    let freeG=0;for(let y=18;y<66;y++)for(let x=18;x<66;x++){const i=y*N+x;if(G.isUnl(x,y)&&G.ter[i]===G.T.GRASS&&!G.occ[i]&&!G.roads[i])freeG++;}
    if(best&&(freeG<160||S.fame>=150||NOSPOT>0)){S.fame-=best.c;U.add(best.k);events.push('day '+S.day+': unlocked '+best.k+' ('+best.c+')');}}
  // raids
  if(G.thLevel()>=3&&!G.canRaid()&&!S.raids.length&&!O.noRaid){let fl=S.ships.filter(s=>!s.away&&s.type!=='knarr');if(!fl.length)fl=S.ships.filter(s=>!s.away).slice(0,1);const cap=fl.reduce((a,s)=>a+G.SHIPCAP[s.type].crew,0);const ship={id:fl.length?fl[0].id:null};const fleet=fl.map(s=>s.id);
    const crew=S.people.filter(p=>p.w&&!p.away&&p.sick<=0).sort((p,q)=>(['berserk','viking','warrior','merc','spear','skirm'].indexOf(p.w))-(['berserk','viking','warrior','merc','spear','skirm'].indexOf(q.w))).slice(0,cap).map(p=>p.id);
    if(fl.length&&crew.length>=5){let best=null;for(const t of G.TARGETS){if(t.walls||!G.regionOpen(t.reg))continue;const e=G.estimate({tgt:t.id,crew,ships:fleet,tactic:'assault',jarl:false});let v=Object.keys(t.loot).reduce((a,k)=>a+t.loot[k]*(k==='silver'?3:1),0);if(t.reg==='isles'&&!S.ms.includes('isles'))v*=3;if(e.ratio>=(O.bold?1.1:1.5)&&(!best||v>best.v))best={t,v,e};}
      if(best){const w=G.launchRaid({tgt:best.t.id,ships:fleet,crew,tactic:'assault',pris:true,jarl:false});events.push('day '+S.day+': RAID '+best.t.id+' ratio '+best.e.ratio.toFixed(2)+(w?' FAILED '+w:''));}}}
  if(NOSPOT>0)NOSPOT--;if(G.__nospot&&d%20===0)G.__nospot={};
  staff();
  {const y=Math.floor(S.gameT/1200),k=y+(G.isWinter()?'W':'S');const W=AUD.work[k]=AUD.work[k]||{};for(const bb of G.B)if(bb.workers)W[bb.t]=(W[bb.t]||0)+bb.workers;W._days=(W._days||0)+1;W._wf=(W._wf||0)+G.workforce();
   AUD.eat[y]=(AUD.eat[y]||0)+G.eatNeed();}
  const deadBefore=S.yr.deaths;S.gameT+=G.DAY;G.dayTick();
  let guard=0;while(S.modal.length&&guard++<20){const m=S.modal[0];const sp=G.modalSpec(m);if(!sp){S.modal.shift();continue;}let i=0,v=0;
    if(m.k==='fest')i=G.foodUnits()>G.eatNeed()*25?0:1;
    if(m.k==='evt'){i=sp.opts.findIndex(o=>!o.dis);if(i<0)i=sp.opts.length-1;}
    if(m.k==='funeral')i=sp.opts.findIndex(o=>!o.dis);
    if(m.k==='raid'){if(m.step==='siege')i=sp.opts.length-2;if(m.step==='load')v=sp.slider?Math.ceil(sp.slider.max/2):0;}
    if(m.k==='over'){events.push('day '+S.day+': GAME OVER '+m.text);S.modal=[];DAYS=0;break;}
    const t0=m.k+(m.id?':'+m.id:m.step?':'+m.step:m.f?':'+m.f:'');const res=G.applyModal(i,v);if(m.k!=='year')events.push('day '+S.day+': '+t0+' -> '+(sp.opts[i]?sp.opts[i].l:'?')+(res?' ('+res+')':''));
    if(m.k==='report')events.push('day '+S.day+': REPORT '+m.title+' | '+m.got.join(', ')+' | dead '+m.dead.length);
    if(m.k==='year')events.push('day '+S.day+': YEAR '+m.y+' births '+m.s.births+' deaths '+m.s.deaths+' arrived '+m.s.arrived+' left '+m.s.left+' pop '+m.pop);}
  if(O.mf&&d%40===39)events.push('day '+S.day+': MF '+Math.round(S.morale)+' '+S.mf.map(f=>f.t+' '+f.v).join(', '));
  {const y=Math.floor(S.gameT/1200);AUD.mor.push(Math.round(S.morale));if(d%15===0)AUD.god.push(G.GOD_KEYS.map(k=>Math.round(S.gods[k])).join('/'));
   if(d%45===44){AUD.stock[y]=Object.fromEntries(Object.entries(S.res).filter(e=>e[1]>=1).map(e=>[e[0],Math.round(e[1])]));AUD.stock[y]._food=Math.round(G.foodUnits());AUD.stock[y]._capF=G.capFood();AUD.stock[y]._capM=G.capMat();}}
  for(const e of events.slice(-12)){const m=/: evt:(\w+)/.exec(e);if(m&&!e.__c){}}
  if(d>=DAYS-1)break;
  if(S.pop<prevPop&&S.lastShort)events.push('day '+S.day+': LOST pop '+prevPop+'→'+S.pop+' ('+S.lastShort+')');prevPop=S.pop;
  if(S.ms.length!==prevMs){S.ms.slice(prevMs).forEach(m=>msDay[m]=S.day);prevMs=S.ms.length;}
  log.push([S.day,G.isWinter()?'W':'S',S.th,S.pop,G.housing(),S.warriors,G.workforce(),G.free,Math.round(G.foodUnits()),Math.round(r.water),Math.round(r.wood),Math.round(r.planks),Math.round(r.iron),r.tools.toFixed(0),Math.round(r.spears),Math.round(r.hay),G.herdTotal(),Math.round(r.cloth)+'/'+Math.round(r.rope),Math.round(r.silver),Math.round(S.fame),FOOD_KINDS(),Math.round(S.morale),Math.round(S.attr),S.thralls,S.raidsDone,Math.round(G.GOD_KEYS.reduce((a,k)=>a+S.gods[k],0)/5),G.unlockedSet().size,Math.round(S.fameEarned||0)].join(' '));
}
function FOOD_KINDS(){const r=G.S.res;return ['fish','berries','meat','veg','bread','dfish','jam','smoked','pickles','sausage'].filter(k=>r[k]>=1).length;}
const st=G.B.filter(b=>G.slotsOf(b)).map(b=>b.t+(b.lvl>1?'L'+b.lvl:'')+':'+b.workers+'/'+G.slotsOf(b)+' '+b.status).join(' | ');
AUD.P=window.__P;AUD.evtc={};for(const e of events){const m=/: evt:(\w+)/.exec(e);if(m)AUD.evtc[m[1]]=(AUD.evtc[m[1]]||0)+1;const f=/: fest:(\w+) -> (\w+)/.exec(e);if(f)AUD.evtc['fest_'+f[1]+'_'+f[2]]=(AUD.evtc['fest_'+f[1]+'_'+f[2]]||0)+1;}
return {fail:FAIL,aud:AUD,log,events,final:st,ms:msDay,ships:G.S.ships,thr:G.thReq()?G.thReq().items.filter(i=>!i.ok).map(i=>i.t):[]};
})
