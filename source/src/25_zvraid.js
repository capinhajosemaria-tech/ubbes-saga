/* =================== raids on Kaldstrand (Town Hall 5+): landings, palisade HP and levels, a short visible fight =================== */
/* palisade levels: hit points per segment; gates are a little stronger */
const WALL_LV=[null,{n:'Stakes',hp:150},{n:'Double stakes',hp:300,c:{planks:3}},{n:'Iron-bound stakes',hp:500,c:{planks:3,iron:1}}];
const RAIDER={hp:26,dps:3.4,sp:1.05,carry:20};
const VR_COL={raid:['#3E4248','#2A2724'],def:['#5E6E4A','#9AA0A4']};
let VR=null;                       /* the fight on screen (not saved; a save mid-fight is settled on the next day) */
function wallLv(){return Math.max(1,Math.min(3,S.wallLvl||1));}
function wallMax(i){return WALL_LV[wallLv()].hp*(walls[i]===2?1.3:1);}
function wallHp(i){S.wdmg=S.wdmg||{};return Math.max(0,wallMax(i)-(S.wdmg[i]||0));}
function wallSegs(){let n=0;for(let i=0;i<N*N;i++)if(walls[i])n++;return n;}
function wallUpCost(){const L=WALL_LV[wallLv()+1];if(!L)return null;const n=wallSegs(),o={};for(const k in L.c)o[k]=L.c[k]*n;return o;}
function upgradeWalls(){const c=wallUpCost();if(!c)return 'The palisade is as strong as it gets.';if(!wallSegs())return 'Build a palisade first.';if(!afford(c))return 'Not enough: needs '+costStr(c)+'.';
  pay(c,1);S.wallLvl=wallLv()+1;S.wdmg={};return '';}
function repairCost(){const n=(S.wbroken||[]).length;return n?{wood:4*n,planks:(wallLv()-1)*3*n}:{};}
function repairWalls(){const br=S.wbroken||[];if(!br.length)return 'Nothing to repair.';if(VR)return 'Not while raiders are in the village.';const c=repairCost();if(c.planks===0)delete c.planks;if(!afford(c))return 'Not enough: needs '+costStr(c)+'.';
  pay(c,1);for(const q of br){if(!walls[q[0]]&&!occ[q[0]])walls[q[0]]=q[1];delete S.wdmg[q[0]];}S.wbroken=[];recomputeWalls();rebuildOcc();return '';}
function breakWall(i){const v=walls[i];if(!v||v===3)return;walls[i]=0;S.wbroken=S.wbroken||[];S.wbroken.push([i,v]);delete S.wdmg[i];recomputeWalls();if(VR){VR.broke++;vrFields();vrFx('dust',i%N,(i/N)|0);}}

/* --- planning: sails sighted, landing a few days later --- */
function vrModeF(){return S.mode==='relaxed'?0.75:S.mode==='challenge'?1.25:1;}
function vrPlanDay(){
  if(S.mode==='sandbox'||thLevel()<5){return;}
  if(S.vrNext===undefined||S.vrNext===null)S.vrNext=S.day+20;
  if(!S.vr&&S.day>=S.vrNext&&!isWinter()){const y=Math.max(0,Math.floor((S.day-(S.th5Day||S.day))/YDAYS));
    const n=Math.min(24,Math.round((6+2*y+S.day%3)*vrModeF()));S.vr={day:S.day+5,n:n,who:pick(['Hrolf the Grey','Sigvard of Jutland','the Orkney jarl','Kolbein Haraldsson','the sons of Thorir'])};
    S.saga.push({y:yearNow(),t:'Scouts saw the sails of '+S.vr.who+'. They mean to land.'});
    queueModal({k:'info',title:'Sails off the Coast',text:'Scouts on the headland saw the ships of '+S.vr.who+', about '+n+' raiders. They will land in 5 days. Keep your warriors at home, man the watchtowers and close the palisade.'});}
  if(S.vr&&!S.vr.on&&S.day>=S.vr.day){if(isWinter()){S.vr.day=S.day+1;}else vrStart();}
  else if(S.vr&&S.vr.on&&(!VR||(VR.t<1&&S.day>S.vr.day)))vrAuto();
  /* the village patches damaged stakes: a quarter of a segment a day */
  if(S.wdmg&&!VR){for(const k in S.wdmg){S.wdmg[k]-=WALL_LV[wallLv()].hp*0.25;if(S.wdmg[k]<=0)delete S.wdmg[k];}}}

/* --- path costs: raiders head for the Town Hall, through the palisade if they must --- */
function vrPass(i){const t=ter[i];return t!==T.SEA&&t!==T.MOUNT;}
function vrDijkstra(src){const D=new Float32Array(N*N).fill(1e9),q=[];for(const i of src){D[i]=0;q.push([0,i]);}
  const push=(d,i)=>{q.push([d,i]);let k=q.length-1;while(k>0){const p=(k-1)>>1;if(q[p][0]<=q[k][0])break;[q[p],q[k]]=[q[k],q[p]];k=p;}};
  const popq=()=>{const top=q[0],last=q.pop();if(q.length){q[0]=last;let k=0;for(;;){const l=2*k+1,r=l+1;let m=k;if(l<q.length&&q[l][0]<q[m][0])m=l;if(r<q.length&&q[r][0]<q[m][0])m=r;if(m===k)break;[q[m],q[k]]=[q[k],q[m]];k=m;}}return top;};
  q.length=0;for(const i of src)push(0,i);
  while(q.length){const [d,i]=popq();if(d>D[i])continue;const x=i%N,y=(i/N)|0;
    for(const s of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+s[0],ny=y+s[1];if(nx<0||ny<0||nx>=N||ny>=N)continue;const j=ny*N+nx;if(!vrPass(j)||walls[j]===3)continue;/* towers cannot be broken */
      let c=1;if(walls[j])c=8+wallHp(j)/20;else if(occ[j])c=30;else if(ter[j]===T.RIVER)c=2.5;
      if(d+c<D[j]){D[j]=d+c;push(D[j],j);}}}
  return D;}
function vrFields(){if(!VR)return;const th=B.find(b=>b.t==='th');const g=[];
  for(let y=th.fy-1;y<=th.fy+th.h;y++)for(let x=th.fx-1;x<=th.fx+th.w;x++){if(!inMap(x,y))continue;const i=y*N+x;if(!occ[i]&&vrPass(i)&&!walls[i])g.push(i);}
  VR.fin=vrDijkstra(g);VR.fout=vrDijkstra([VR.land]);
  VR.ins=vrInside(g);}
function thRing(){const th=B.find(b=>b.t==='th'),g=[];if(!th)return g;for(let y=th.fy-1;y<=th.fy+th.h;y++)for(let x=th.fx-1;x<=th.fx+th.w;x++){if(!inMap(x,y))continue;const i=y*N+x;if(!occ[i]&&vrPass(i)&&!walls[i])g.push(i);}return g;}
/* inside the ring: tiles reachable from the Town Hall without crossing the palisade (where defenders may go) */
function vrInside(g){const ins=new Uint8Array(N*N),q=g.slice();for(const i of g)ins[i]=1;
  while(q.length){const i=q.pop(),x=i%N,y=(i/N)|0;for(const s of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+s[0],ny=y+s[1];if(!inMap(nx,ny))continue;const j=ny*N+nx;if(ins[j]||walls[j]||!vrPass(j))continue;ins[j]=1;q.push(j);}}
  return ins;}

/* --- the fight --- */
function vrStart(){const th=B.find(b=>b.t==='th');if(!th){S.vr=null;return;}recomputeWalls();
  const cx=th.fx+th.w/2,cy=th.fy+th.h/2;let best=null;const ins=walls.some(v=>v)?vrInside(thRing()):null;
  for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++){const i=y*N+x;if(!vrPass(i)||occ[i]||walls[i]||(ins&&ins[i]&&S.wallClosed))continue;
    if(![[1,0],[-1,0],[0,1],[0,-1]].some(s=>OCEAN[(y+s[1])*N+x+s[0]]))continue;const d=Math.hypot(x-cx,y-cy);if(d<12)continue;const sc=Math.abs(d-20)+h2(x,y,S.day)*6;if(!best||sc<best.sc)best={sc:sc,i:i};}
  if(!best){S.vr=null;return;}
  S.vr.on=true;S.wdmg=S.wdmg||{};const lx=best.i%N,ly=(best.i/N)|0;
  VR={t:0,land:best.i,u:[],fx:[],broke:0,killed:0,loot:{},lost:[],stolen:{},arch:0};
  for(let k=0;k<S.vr.n;k++)VR.u.push({side:'raid',x:lx+U(-0.4,0.4),y:ly+U(-0.4,0.4),hp:RAIDER.hp,mx:RAIDER.hp,dps:RAIDER.dps*U(0.85,1.15),c:VR_COL.raid,sh:SHIELD_RAID,ph:Math.random()*6,carry:'spear',st:'in',bag:{},bagN:0,cd:0});
  const def=S.people.filter(p=>p.w&&!p.away&&p.sick<=0&&p.w!=='archer');
  def.forEach((p,k)=>{const a=k/Math.max(1,def.length)*6.283;VR.u.push({side:'def',p:p,x:cx+Math.cos(a)*(th.w/2+0.8),y:cy+Math.sin(a)*(th.h/2+0.8),hp:18+10*soldierStr(p),mx:18+10*soldierStr(p),dps:2.4*soldierStr(p),c:VR_COL.def,ph:Math.random()*6,carry:'spear',cd:0});});
  VR.towers=B.filter(b=>b.t==='tower').slice(0,Math.floor(S.people.filter(p=>p.w==='archer'&&!p.away&&p.sick<=0).length/2)).map(b=>({b:b,cd:Math.random()}));
  {const sea=[];for(const q of [[1,0],[-1,0],[0,1],[0,-1],[2,0],[-2,0],[0,2],[0,-2],[2,1],[1,2],[-2,-1],[-1,-2]]){const x=lx+q[0],y=ly+q[1];if(inMap(x,y)&&ter[y*N+x]===T.SEA)sea.push([x,y,Math.atan2(q[1],q[0])]);}
    VR.ships=sea.slice(0,Math.max(1,Math.min(3,Math.ceil(S.vr.n/8))));}
  vrFields();if(speed>1)setSpeed(1);
  const p=iso((lx+cx)/2,(ly+cy)/2);camX=p[0];camY=p[1];clampCam();
  toast(S.vr.who+' has landed with '+S.vr.n+' raiders!',4200);}
const vrAt=(x,y)=>{const tx=Math.round(x),ty=Math.round(y);return inMap(tx,ty)?ty*N+tx:-1;};
function vrStep(u,F,dt){const i=vrAt(u.x,u.y);if(i<0)return null;if(F[i]>=1e8)return 'lost';const x=i%N,y=(i/N)|0;let bj=-1,bd=F[i];
  for(const s of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+s[0],ny=y+s[1];if(!inMap(nx,ny))continue;const j=ny*N+nx;if(F[j]<bd){bd=F[j];bj=j;}}
  if(bj<0){u.moving=false;return 'there';}
  if(walls[bj]){u.moving=false;return bj;}
  const tx=bj%N,ty=(bj/N)|0,dx=tx-u.x,dy=ty-u.y,d=Math.hypot(dx,dy),s=Math.min(d,RAIDER.sp*dt*(ter[i]===T.RIVER?0.6:1));if(d>0.001){u.x+=dx/d*s;u.y+=dy/d*s;}u.moving=true;u.ph+=dt;return null;}
const STEAL=['silver','gold','iron','tools','planks','wood','smoked','bread','fish','meat','ale','mead','cloth'];
function vrUpdate(gdt){let left=Math.min(gdt,8);while(VR&&left>0){const st=Math.min(left,0.25);vrTick(st);left-=st;}}
function vrTick(dt){if(!VR)return;VR.t+=dt;
  if(VR.t>120){for(const u of VR.u)if(u.side==='raid'&&u.hp>0){u.gone=1;u.hp=0;for(const k in u.bag)VR.stolen[k]=(VR.stolen[k]||0)+u.bag[k];}vrEnd();return;}
  const R=VR.u.filter(u=>u.side==='raid'&&u.hp>0),Dd=VR.u.filter(u=>u.side==='def'&&u.hp>0);
  const near=(u,L,r)=>{let b=null,bd=r;for(const o of L){const d=Math.hypot(o.x-u.x,o.y-u.y);if(d<bd){bd=d;b=o;}}return b;};
  const atk={};for(const u of R)if(u.wt!==undefined)atk[u.wt]=(atk[u.wt]||0)+1;for(const u of R)u.wt=undefined;
  const hitWall=(u,r)=>{u.wt=r;if(u.cd>0)return;S.wdmg[r]=(S.wdmg[r]||0)+u.dps*1.2*Math.min(1,3/Math.max(1,atk[r]||1));u.cd=1;vrFx('chop',r%N,(r/N)|0);if(wallHp(r)<=0)breakWall(r);};
  for(const u of R){u.cd-=dt;
    const foe=near(u,Dd,0.95);if(foe){u.moving=false;if(u.cd<=0){foe.hp-=u.dps;u.cd=1;vrFx('hit',foe.x,foe.y);}continue;}
    if(VR.t>60&&u.st!=='out')u.st='out';
    if(u.st==='in'){const r=vrStep(u,VR.fin,dt);
      if(typeof r==='number')hitWall(u,r);
      else if(r==='there')u.st='loot';else if(r==='lost')u.st='out';}
    else if(u.st==='loot'){u.moving=false;if(u.cd<=0){u.cd=1;const ks=STEAL.filter(k=>(S.res[k]||0)>=1);if(!ks.length||u.bagN>=RAIDER.carry){u.st='out';continue;}const k=pick(ks),a=Math.min(S.res[k],k==='silver'?6:3);S.res[k]-=a;u.bag[k]=(u.bag[k]||0)+a;u.bagN+=a;}}
    else{const r=vrStep(u,VR.fout,dt);if(typeof r==='number')hitWall(u,r);
      else if(r==='there'||r==='lost'){u.hp=0;u.gone=1;for(const k in u.bag)VR.stolen[k]=(VR.stolen[k]||0)+u.bag[k];}}}
  VR.fdT=(VR.fdT||0)-dt;if(VR.fdT<=0){VR.fdT=0.5;VR.fdef=vrDefMap(R);}
  for(const u of Dd){u.cd-=dt;
    /* spears reach over the stakes: raiders hacking at the palisade can be struck from inside */
    const R2=R.filter(o=>o.hp>0&&!o.gone),foe=near(u,R2,1.0)||R2.find(o=>o.st==='in'&&!o.moving&&Math.hypot(o.x-u.x,o.y-u.y)<1.7);
    if(foe){u.moving=false;if(u.cd<=0){foe.hp-=u.dps;u.cd=1;vrFx('hit',foe.x,foe.y);if(foe.hp<=0)vrKill(foe);}continue;}
    /* follow the defenders' map toward the nearest raider; close in directly once on the same tile */
    const i=vrAt(u.x,u.y),F=VR.fdef;let moved=false;
    if(F&&i>=0&&F[i]<1e8){const x=i%N,y=(i/N)|0;let bj=-1,bd=F[i];for(const q of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+q[0],ny=y+q[1];if(!inMap(nx,ny))continue;const j=ny*N+nx;if(F[j]<bd){bd=F[j];bj=j;}}
      let tx,ty;if(bj>=0){tx=bj%N;ty=(bj/N)|0;}else{const t=near(u,R2,3);if(t){tx=t.x;ty=t.y;}}
      if(tx!==undefined){const dx=tx-u.x,dy=ty-u.y,d=Math.hypot(dx,dy),st=Math.min(d,1.15*dt);if(d>0.001){u.x+=dx/d*st;u.y+=dy/d*st;moved=true;}}}
    u.moving=moved;if(moved)u.ph+=dt;}
  /* keep a little room between fighters so a crowd reads as a crowd */
  {const A=VR.u.filter(u=>u.hp>0&&!u.gone);for(let a=0;a<A.length;a++)for(let b=a+1;b<A.length;b++){const p=A[a],q=A[b],dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy);if(d>0.42||d<1e-4)continue;const k=(0.42-d)*0.5*Math.min(1,dt*6)/d;
    const mv=(u,sx,sy)=>{const nx=u.x+sx,ny=u.y+sy,j=vrAt(nx,ny);if(j>=0&&vrPass(j)&&!walls[j]){u.x=nx;u.y=ny;}};mv(p,-dx*k,-dy*k);mv(q,dx*k,dy*k);}}
  /* watchtower archers */
  for(const t of VR.towers){t.cd-=dt;if(t.cd>0)continue;const b=t.b,o={x:b.fx+b.w/2-0.5,y:b.fy+b.h/2-0.5};const foe=near(o,R.filter(u=>u.hp>0),7.5);if(!foe)continue;
    t.cd=1.3;foe.hp-=7;VR.arch++;VR.fx.push({k:'arrow',a:[o.x,o.y],b:[foe.x,foe.y],t:0.35});if(foe.hp<=0)vrKill(foe);}
  for(const u of R)if(u.hp<=0&&!u.dead&&!u.gone)vrKill(u);
  for(const f of VR.fx)f.t-=dt;VR.fx=VR.fx.filter(f=>f.t>0);
  if(!VR.u.some(u=>u.side==='raid'&&u.hp>0))vrEnd();}
function vrDefMap(R){const F=new Float32Array(N*N).fill(1e9),q=[];
  for(const u of R){if(u.hp<=0||u.gone)continue;const i=vrAt(u.x,u.y);if(i<0)continue;
    /* a raider at the palisade is reached from the inside of it */
    if(walls[i]||!VR.ins[i]){const x=i%N,y=(i/N)|0;for(const d of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+d[0],ny=y+d[1];if(!inMap(nx,ny))continue;const j=ny*N+nx;if(VR.ins[j]&&!walls[j]&&F[j]>0){F[j]=0;q.push(j);}}}
    else if(F[i]>0){F[i]=0;q.push(i);}}
  for(let k=0;k<q.length;k++){const i=q[k],x=i%N,y=(i/N)|0;for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+d[0],ny=y+d[1];if(!inMap(nx,ny))continue;const j=ny*N+nx;if(F[j]<1e9||walls[j]||!vrPass(j)||!VR.ins[j])continue;F[j]=F[i]+(occ[j]?2:1);q.push(j);}}
  return F;}
function vrKill(u){if(u.dead||u.gone)return;u.dead=1;u.hp=0;VR.killed++;for(const k in u.bag)S.res[k]=(S.res[k]||0)+u.bag[k];u.bag={};}
function vrFx(k,x,y){if(VR)VR.fx.push({k:k,x:x,y:y,t:k==='dust'?1.2:0.3});}
function vrCasualty(p,out){if(!p||!S.people.includes(p))return;
  if(S.mode!=='relaxed'&&!p.num&&Math.random()<0.45){out.dead.push(pname(p));removePerson(p,'battle');}
  else{p.wound=1;p.sick=Math.max(p.sick||0,6);out.wounded++;}}
function vrEnd(){const out={dead:[],wounded:0};for(const u of VR.u)if(u.side==='def'&&u.hp<=0)vrCasualty(u.p,out);
  vrReport(VR.killed,S.vr.n,VR.stolen,out,VR.broke);VR=null;}
function vrAuto(){/* settled without the scene (a save mid-fight, or no screen) */
  /* a closed palisade makes the village harder to take; survivors carry off what they can, as in the scene (6 silver or 3 of a good per grab, 20 each) */
  const a=S.vr.n*RAIDER.dps*2.2,d=defenceValue()/(S.wallClosed?1.5:1)*3.2*(S.wallClosed?1.2+0.4*wallLv():1)/* O3: the palisade bonus counted once (×1.6 / 2.0 / 2.4 by palisade level) */;const k=Math.min(S.vr.n,Math.round(S.vr.n*Math.min(1,d/Math.max(1,a))));const stolen={};
  if(d<a){for(let r=0;r<S.vr.n-k;r++){let bag=0;while(bag<RAIDER.carry){const ks=STEAL.filter(x=>(S.res[x]||0)>=1);if(!ks.length)break;const key=pick(ks),v=Math.min(Math.floor(S.res[key]),key==='silver'?6:3,RAIDER.carry-bag);if(v<=0)break;S.res[key]-=v;stolen[key]=(stolen[key]||0)+v;bag+=v;}}}
  const out={dead:[],wounded:0};const def=S.people.filter(p=>p.w&&!p.away);const hurt=Math.min(def.length,Math.round(S.vr.n*0.25*Math.min(1.5,a/Math.max(1,d))));for(let i=0;i<hurt;i++)vrCasualty(def[i],out);
  VR=null;vrReport(k,S.vr.n,stolen,out,0);}
function vrReport(killed,n,stolen,out,broke){const got=Object.keys(stolen).filter(k=>stolen[k]>0).map(k=>Math.round(stolen[k])+' '+k);
  const won=!got.length;S.vrNext=S.day+(S.mode==='relaxed'?55:40)+Math.floor(Math.random()*20);
  if(won){addFame(4+killed*2);addMod('vraid','We drove the raiders into the sea',6,20);}else addMod('vraid','Raiders plundered the village',-6,20);
  S.saga.push({y:yearNow(),t:(won?'The raiders of '+S.vr.who+' were beaten back at Kaldstrand.':S.vr.who+' plundered Kaldstrand and sailed off.')+' '+killed+' of '+n+' fell.'});
  queueModal({k:'vraid',won:won,title:won?'The Raiders Are Beaten':'The Raiders Got Away',text:won?'The raiders of '+S.vr.who+' broke against Kaldstrand. '+(killed>=n?'None of them saw home again.':'The rest ran for their ships.'):'The raiders of '+S.vr.who+' carried off what they could.',
    table:[['Raiders slain',killed+' of '+n],['Taken by the raiders',got.length?got.join(', '):'nothing'],['Our dead',out.dead.length?out.dead.join(', '):'none'],['Wounded',String(out.wounded)],['Palisade segments broken',String(broke)+(broke?' (repair them in War → Defence)':'')]]});
  S.vr=null;syncPop();assignWorkers();}

/* --- drawing: units, arrows, chips of wood, damaged and broken palisade --- */
function vrDyn(dyn){if(VR)for(const u of VR.u)if(u.hp>0&&!u.gone)dyn.push({d:u.x+u.y+0.3,f:w=>{drawWalker(u,w);if(u.hp<u.mx){const p=iso(u.x,u.y);ctx.fillStyle='rgba(30,24,18,.6)';ctx.fillRect(p[0]-7,p[1]-30,14,3);ctx.fillStyle=u.side==='raid'?'#C0503A':'#7FA05A';ctx.fillRect(p[0]-7,p[1]-30,14*Math.max(0,u.hp/u.mx),3);}}});
  for(const q of (S.wbroken||[])){const i=q[0];if(walls[i])continue;const x=i%N,y=(i/N)|0;dyn.push({d:x+y+0.4,f:()=>{const p=iso(x,y);const e=elev[i]||2;ctx.fillStyle='#6E543D';for(let k=0;k<4;k++){const a=h2(x,y,k)*6.28;ctx.save();ctx.translate(p[0]+Math.cos(a)*6,p[1]-e+Math.sin(a)*3);ctx.rotate(a);ctx.fillRect(-5,-1,10,2.4);ctx.restore();}ctx.fillStyle='#4E3C2E';ctx.fillRect(p[0]-2,p[1]-e-5,4,5);}});}}
function vrShips(win){if(!VR||!VR.ships)return;for(const sh of VR.ships){const p=iso(sh[0],sh[1]),a=sh[2];ctx.save();ctx.translate(p[0],p[1]+2);ctx.scale(Math.cos(a)>0?1:-1,1);
  poly([-26,-2,26,-2,32,-12,22,4,-22,4,-32,-12],'#3E3028');poly([-22,-3,22,-3,20,1,-20,1],'#5C4634');ctx.strokeStyle='#2E2620';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(0,-2);ctx.lineTo(0,-34);ctx.stroke();
  for(let k=0;k<5;k++)poly([-12,-32+k*5,12,-32+k*5,12,-27+k*5,-12,-27+k*5],k%2?(win?'#E6E1D8':'#E9E1CF'):'#2E3A4A');
  ctx.fillStyle='#8E2F2A';for(let k=-3;k<=3;k++){ctx.beginPath();ctx.arc(k*6,-3,2.2,0,6.3);ctx.fill();}ctx.restore();}}
function vrDraw(win){if(!VR)return;vrShips(win);for(const f of VR.fx){
  if(f.k==='arrow'){const a=iso(f.a[0],f.a[1]),b=iso(f.b[0],f.b[1]),u=1-f.t/0.35,x=a[0]+(b[0]-a[0])*u,y=a[1]-46+(b[1]-12-a[1]+46)*u;ctx.strokeStyle='#3E3028';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-(b[0]-a[0])*0.06,y-(b[1]-a[1]-34)*0.06);ctx.stroke();}
  else{const p=iso(f.x,f.y);ctx.fillStyle=f.k==='hit'?'rgba(230,220,200,.8)':f.k==='dust'?'rgba(180,160,130,'+(f.t/1.2*0.6).toFixed(2)+')':'#C9A27A';
    if(f.k==='dust'){ctx.beginPath();ctx.arc(p[0],p[1]-10,14*(1.3-f.t/1.2),0,6.3);ctx.fill();}else for(let k=0;k<3;k++)ctx.fillRect(p[0]-4+k*3,p[1]-16-k*3*(f.t/0.3),2,2);}}}
/* damage on a palisade tile: 0 (whole) .. 1 (about to break) */
function wallWear(i){if(!S.wdmg||!S.wdmg[i])return 0;return Math.min(1,S.wdmg[i]/wallMax(i));}

/* --- hooks into the day, the frame, the modal and the To do list --- */
{const _dt=dayTick;dayTick=function(){_dt();if(thLevel()>=5&&S.th5Day===undefined)S.th5Day=S.day;vrPlanDay();};}
{const _up=update;update=function(dt){_up(dt);if(VR)vrUpdate(dt*speed);};}
{const _ms=modalSpec;modalSpec=function(m){if(m&&m.k==='vraid')return {title:m.title,text:m.text,table:m.table,opts:[{l:m.won?'Raise a cheer':'Rebuild',f:()=>''}]};return _ms(m);};}
{const _sg=suggestions;suggestions=function(){const out=_sg();
  if(S.vr&&!S.vr.on){const d=S.vr.day-S.day;out.unshift({p:0,ic:'War',t:'Raiders land in '+d+' day'+(d===1?'':'s'),sub:S.vr.n+' raiders. Keep warriors home and close the palisade',go:()=>warPanel(),cls:'bad'});}
  if(VR){const left=VR.u.filter(u=>u.side==='raid'&&u.hp>0).length;out.unshift({p:0,ic:'War',t:'Raiders in the village: '+left+' left',sub:'Click to watch the fight',go:()=>{const u=VR&&VR.u.find(u=>u.side==='raid'&&u.hp>0);if(u){const p=iso(u.x,u.y);camX=p[0];camY=p[1];clampCam();}},cls:'bad'});}
  if((S.wbroken||[]).length&&!VR)out.push({p:1,ic:'Palisade',t:'Palisade broken in '+S.wbroken.length+' place'+(S.wbroken.length>1?'s':''),sub:'Repair it: '+costStr(repairCost()),go:()=>warPanel()});
  return out;};}
function wallDefHtml(on){if(thLevel()<5)return '';const L=wallLv(),nx=WALL_LV[L+1],uc=wallUpCost(),rc=repairCost(),nb=(S.wbroken||[]).length;
  let h='<h3>Palisade</h3><table class="t"><tr><td>Level</td><td>'+L+' · '+WALL_LV[L].n+'</td></tr><tr><td>Strength of each segment</td><td>'+WALL_LV[L].hp+' (gates '+Math.round(WALL_LV[L].hp*1.3)+')</td></tr><tr><td>Segments</td><td>'+wallSegs()+(nb?' · '+nb+' broken':'')+'</td></tr></table>';
  h+='<p class="meta">Raiders must hack through the palisade, segment by segment, unless they find a gap. Spearmen strike over the stakes; archers in manned towers shoot from 7 tiles. Damaged stakes are patched for free in a few days; broken ones must be rebuilt.</p>';
  if(nb)h+='<div class="wk">'+btn('w-rep','Repair '+nb+' broken segment'+(nb>1?'s':''),{cls:'small primary',dis:!afford(rc)||!!VR})+'<span class="meta">'+esc(costStr(rc))+'</span></div>';
  if(nx)h+='<div class="wk">'+btn('w-wup','Upgrade to '+nx.n,{cls:'small',dis:!wallSegs()||!afford(uc)})+'<span class="meta">'+nx.hp+' per segment · '+(wallSegs()?esc(costStr(uc)):'build a palisade first')+'</span></div>';
  if(S.vr&&!S.vr.on)h+='<p><strong>'+esc(S.vr.who)+' will land in '+(S.vr.day-S.day)+' days with about '+S.vr.n+' raiders.</strong></p>';
  on.push(()=>{if($('w-rep'))$('w-rep').onclick=()=>{const w=repairWalls();toast(w||'The palisade is whole again.');if(!w){warPanel();save();}};
    if($('w-wup'))$('w-wup').onclick=()=>{const w=upgradeWalls();toast(w||'The palisade is now '+WALL_LV[wallLv()].n.toLowerCase()+'.');if(!w){warPanel();save();}};});
  return h;}
