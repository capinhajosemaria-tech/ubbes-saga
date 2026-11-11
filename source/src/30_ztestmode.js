/* =================== planner, test mode and test tools =================== */
function nearConnRoad(x,y,w,h,r){let best=99;for(let yy=y-r;yy<y+h+r;yy++)for(let xx=x-r;xx<x+w+r;xx++){if(!inMap(xx,yy)||!conn[yy*N+xx])continue;const d=Math.max(Math.max(x-xx,0,xx-(x+w-1)),Math.max(y-yy,0,yy-(y+h-1)));if(d<best)best=d;}return best;}
function planSpot(t,all){const D=DEF[t],th=B.find(b=>b.t==='th');const cx=th?th.fx+3:HOME_X,cy=th?th.fy+3:HOME_Y;let best=null;const R=all&&S.mode==="test"?44:34,cand=[];
  for(let y=cy-R;y<cy+R;y++)for(let x=cx-R;x<cx+R;x++)for(const rot of [0,1]){if(rot&&D.w===D.h)continue;const c=canPlace(t,x,y,rot,0);if(!c.ok||(c.clears&&c.clears.length))continue;
    const d=dims(t,rot),dist=Math.hypot(x+d.w/2-cx,y+d.h/2-cy);let sc=-dist;
    if(D.need)sc+=Math.min(needCount({fx:x,fy:y,w:d.w,h:d.h},D.need).n,25)*2.5;
    if(D.farm||t==='pigpen'||t==='sheeppen'||t==='hives')sc=-Math.abs(dist-15);
    if(t!=='shipyard'&&t!=='harbour'&&t!=='mill'&&t!=='fish'){let sea=0;for(let yy=y-1;yy<=y+d.h;yy++)for(let xx=x-1;xx<=x+d.w;xx++)if(tAt(xx,yy)===T.SEA)sea++;if(sea)sc-=30;}
    if(D.road!==false&&!D.farm){const nr=nearConnRoad(x,y,d.w,d.h,4);if(nr>4)sc-=50;else sc-=nr*2;}
    cand.push({x:x,y:y,rot:rot,sc:sc});if(!best||sc>best.sc)best={x:x,y:y,rot:rot,sc:sc};}
  if(all){cand.sort((p,q)=>q.sc-p.sc);return cand.slice(0,D.water||D.river||D.need||S.mode==="test"?60:12);}return best;}
function connectRoad(b){recomputeConn();if(b.conn)return true;const prev=new Map(),q=[];const ok=(x,y)=>inMap(x,y)&&isUnl(x,y)&&!occ[y*N+x]&&!walls[y*N+x]&&(roads[y*N+x]||BUILDABLE.has(ter[y*N+x])||ter[y*N+x]===T.RIVER);
  for(const p of edgeTiles(b))if(ok(p[0],p[1])){const k=p[1]*N+p[0];prev.set(k,-1);q.push(k);}
  let found=-1,qi=0;while(qi<q.length){const k=q[qi++];if(roads[k]&&conn[k]){found=k;break;}const x=k%N,y=(k/N)|0;for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+d[0],ny=y+d[1];if(!ok(nx,ny))continue;const nk=ny*N+nx;if(prev.has(nk))continue;prev.set(nk,k);q.push(nk);}}
  if(found<0)return false;let k=found;while(k!==-1){roads[k]=1;k=prev.get(k);}recomputeConn();return true;}
function placeAuto(t){const list=planSpot(t,true);for(const sp of list){const b=addBuilding(t,sp.x,sp.y,sp.rot,false);if(DEF[t].road===false||connectRoad(b))return b;B.splice(B.indexOf(b),1);rebuildOcc();recomputeConn();}return null;}
function buildTestVillage(L){
  freshState('test','lagertha');S.mode='test';S.th=L;S.advs=Object.keys(ADVISORS).slice(0,[1,1,1,2,3][L-1]);
  unlocked=new Set();for(let zx=0;zx<ZN;zx++)for(let zy=0;zy<ZN;zy++){if(Math.max(Math.abs(zx-ZC_X),Math.abs(zy-ZC_Y))<=Math.min(4,1+L))unlocked.add(zx+','+zy);}
  Object.keys(DEF).forEach(k=>{if(DEF[k].lvl===1&&!S.avail.includes(k))S.avail.push(k);});
  for(const m of MS)if(m.lv<L&&!S.ms.includes(m.id))S.ms.push(m.id);
  const order=['shipyard','harbour','market','jarl','tomb','hof','train','arsenal','trade','thrall','gran','ware','pyre','altar'];
  const keys=order.concat(Object.keys(DEF).filter(k=>!order.includes(k)));const missing=[];
  for(const k of keys){const D=DEF[k];if(k==='th'||D.lvl>L||D.hidden)continue;const n=D.cat==='Decor'?1:Math.max(0,(TEST_COUNT[k]?TEST_COUNT[k][L-1]:limitOf(k))-count(k));
    for(let i=0;i<n;i++){const b=placeAuto(k);if(!b){missing.push(DEF[k].name);break;}if(D.up)b.lvl=Math.min(L,5);b.desired=slotsOf(b);}}
  for(const b of B)if(DEF[b.t].up&&b.t!=='th')b.lvl=Math.min(L,5);  /* the starting houses too */
  rebuildOcc();recomputeConn();
  const r=S.res;for(const k in r)r[k]=0;FOOD.forEach(k=>r[k]=Math.round(capFood()*0.6/FOOD.length));MAT.forEach(k=>r[k]=Math.round(capMat()*0.5/MAT.length));ARMS.forEach(k=>r[k]=Math.round(capArms()*0.6/ARMS.length));
  r.tools=40;r.water=capWater()*0.8;r.silver=500;r.gold=100;r.wood=Math.max(r.wood,150);r.planks=Math.max(r.planks,150);r.iron=Math.max(r.iron,80);
  S.fame=2000;S.fameEarned=2000;GOD_KEYS.forEach(g=>S.gods[g]=60);
  const cap=housing(),kidsT=Math.round(cap*0.24),couples=[];while(S.people.length<cap-kidsT){const a=newPerson({a:Math.round(U(18,44)),tr:randTrait()});if(S.people.length<cap-kidsT){const b=newPerson({g:a.g==='m'?'f':'m',a:Math.round(U(18,44))});marry(a,b);couples.push([a,b]);}}
  for(let k=0;S.people.length<cap&&couples.length;k++){const c=couples[k%couples.length];newPerson({a:Math.round(U(1,13)),pa:[c[0].id,c[1].id]});}
  const types=Object.keys(TROOPS).filter(k=>TROOPS[k].lv<=L&&k!=='merc');const fit=S.people.filter(p=>p.id!==S.jarl&&p.a>=16&&p.a<45);for(let i=0;i<Math.min(WAR_TEST[L-1],fit.length);i++){fit[i].w=types[(types.length-1)-(i%types.length)];fit[i].xp=i%3;}
  if(L>=3){S.ships.push({id:S.shipSeq++,type:'knarr',name:SHIP_NAMES[1],away:0,voy:0});for(let i=0;i<SHIP_CAP_WAR[L-1];i++)S.ships.push({id:S.shipSeq++,type:i===0?'karvi':'snekkja',name:SHIP_NAMES[(2+i)%SHIP_NAMES.length],away:0,voy:0});}
  if(L>=2){S.herd={pigs:Math.floor(pigCap()/2),sheep:Math.floor(sheepCap()/2)};}if(L>=3)S.thralls=Math.floor(thrallCap()/2);
  syncPop();recalcMorale();S.morale=60;assignWorkers();S.testMissing=missing;
  S.saga.push({y:1,t:'A test village at Town Hall level '+L+'.'+(missing.length?' No room for: '+missing.join(', ')+'.':'')});}
const TEST_TOOLS=[['res','+500 of everything',()=>{for(const k in S.res)S.res[k]+=500;return 'Stores filled.';}],
  ['th','Town Hall +1 (no requirements)',()=>{if(thLevel()>=5)return 'Already at the highest level of this beta.';S.th++;checkMilestones();return 'Town Hall level '+S.th+'.';}],
  ['d10','Skip 10 days',()=>{for(let i=0;i<10;i++){S.gameT+=DAY;dayTick();}return 'Ten days passed.';}],
  ['season','Skip to the next season',()=>{const w=isWinter();let g=0;while(isWinter()===w&&g++<60){S.gameT+=DAY;dayTick();}return isWinter()?'Winter.':'Summer.';}],
  ['evt','Trigger an event',()=>{S.nextEvt=0;S.evtSeen={};eventDay();return S.modal.length?'An event is waiting.':'No event fits right now.';}],
  ['feast','Light the feast fire',()=>{S.feast={until:S.gameT+DAY*2};return 'The pig turns on the spit.';}],
  ['raids','Bring all raids home now',()=>{for(const r of S.raids.slice()){if(r.ph==='out'){r.t=0;arrive(r);}else{r.ph='back';r.t=1;}}return 'The ships are on their way home.';}],
  ['jarl','Kill the Jarl',()=>{const j=jarlP();if(j)removePerson(j,'age');return 'The Jarl is dead.';}],
  ['gods','All gods to 90 favour',()=>{GOD_KEYS.forEach(g=>S.gods[g]=90);return 'The gods are pleased.';}],
  ['mhi','Morale 90',()=>{S.mods.push({k:'test',t:'Test: high spirits',v:40,until:S.day+20});S.morale=90;return 'Morale 90.';}],
  ['mlo','Morale 15',()=>{S.mods.push({k:'test',t:'Test: misery',v:-45,until:S.day+20});S.morale=15;return 'Morale 15.';}],
  ['pop','Fill every house',()=>{const cap=housing();while(S.people.length<cap)newPerson({a:Math.round(U(18,40)),tr:randTrait()});syncPop();return 'The houses are full.';}],
  ['zones','Unlock all land',()=>{for(let zx=0;zx<ZN;zx++)for(let zy=0;zy<ZN;zy++)unlocked.add(zx+','+zy);return 'All land is yours.';}]];
function testToolsHtml(on){if(S.mode!=='test'&&S.mode!=='sandbox')return '';let h='<h3>Test tools</h3><div class="gb">'+TEST_TOOLS.map(x=>'<button type="button" class="btn small" data-tt0="'+x[0]+'">'+esc(x[1])+'</button>').join('')+'</div>';
  if(S.testMissing&&S.testMissing.length)h+='<p class="meta">The planner found no room for: '+esc(S.testMissing.join(', '))+'.</p>';
  on.push(()=>{$('sheet-card').querySelectorAll('[data-tt0]').forEach(x=>x.onclick=()=>{const f=TEST_TOOLS.find(q=>q[0]===x.dataset.tt0);const r=f[2]();assignWorkers();syncPop();recalcMorale();checkMilestones();toast(r);save();sagaPanel();});});return h;}

/* Gallery: every asset side by side, in rows, on cleared meadow (test mode only). */
const GAL={x0:0,y0:0};
function buildGallery(){
  buildTestVillage(5);S.saga=[{y:1,t:'The gallery of Kaldstrand: every building at every level.'}];
  for(let zx=0;zx<ZN;zx++)for(let zy=0;zy<ZN;zy++)unlocked.add(zx+','+zy);
  const items=[];
  for(let sc=0;sc<HOUSE_SCH.length;sc++)for(let l=1;l<=5;l++)items.push({t:'house',l:l,sch:sc,row:'h'+sc});
  for(const k of Object.keys(DEF)){const D=DEF[k];if(k==='house'||k==='th'||D.hidden||D.water)continue;for(const l of (D.up?[1,3,5]:[1]))items.push({t:k,l:l,row:k});}
  /* find the most open stretch of land for a 70 × 56 field */
  const W0=84,H0=84,bad=(xx,yy)=>{const t=ter[yy*N+xx];return t===T.SEA||t===T.RIVER||t===T.MOUNT||t===T.FOOT||t===T.IRON;};
  let best=null;for(let y=6;y+H0<N-6;y+=3)for(let x=6;x+W0<N-6;x+=3){let n=0;for(let yy=y;yy<y+H0;yy+=2)for(let xx=x;xx<x+W0;xx+=2)if(bad(xx,yy))n++;if(!best||n<best.n)best={x:x,y:y,n:n};}
  const x0=best.x,y0=best.y;GAL.x0=x0;GAL.y0=y0;
  /* clear the field: the village there is moved aside, trees and bushes go */
  B=B.filter(b=>b.t==='th'||b.fx+b.w<x0-1||b.fx>x0+W0+1||b.fy+b.h<y0-1||b.fy>y0+H0+1);
  for(let yy=y0-2;yy<y0+H0+2;yy++)for(let xx=x0-2;xx<x0+W0+2;xx++){if(!inMap(xx,yy))continue;const i=yy*N+xx;roads[i]=0;if(ter[i]===T.FOREST||ter[i]===T.BERRY)clearForest(i,true);}
  for(const o of trees)if(o.x>=x0-2&&o.x<x0+W0+2&&o.y>=y0-2&&o.y<y0+H0+2){o.gone=1;o.amt=0;}
  for(const o of bushes)if(o.x>=x0-2&&o.x<x0+W0+2&&o.y>=y0-2&&o.y<y0+H0+2){o.gone=1;o.amt=0;}
  rebuildOcc();
  const free=(fx,fy,w,h)=>{if(fx+w>x0+W0||fy+h>y0+H0)return false;for(let yy=fy;yy<fy+h;yy++)for(let xx=fx;xx<fx+w;xx++){if(!inMap(xx,yy)||bad(xx,yy)||occ[yy*N+xx])return false;}return true;};
  let x=x0,y=y0,rowH=0,cur=null;
  for(const it of items){const d=dims(it.t,0);
    if(cur!==null&&it.row!==cur&&it.t==='house'){x=x0;y+=rowH+2;rowH=0;}else if(cur!==null&&it.row!==cur)x+=2;cur=it.row;
    let tries=0;while(!free(x,y,d.w,d.h)&&tries++<600){x+=1;if(x+d.w>x0+W0){x=x0;y+=Math.max(rowH,1)+2;rowH=0;}}
    if(tries>=600||y>y0+H0){GAL.skip=(GAL.skip||[]).concat(it.t);continue;}
    const b=addBuilding(it.t,x,y,0,true);b.lvl=it.l;if(it.sch!==undefined)b.sch=it.sch;b.gallery=1;rebuildOcc();
    x+=d.w+1;rowH=Math.max(rowH,d.h);}
  rebuildOcc();recomputeConn();syncPop();assignWorkers();S.testMissing=[];}
