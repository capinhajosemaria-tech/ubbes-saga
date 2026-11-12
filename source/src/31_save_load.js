/* =================== save / load =================== */
function snapshot(){const s=Object.assign({},S);delete s.bal;delete s.tc;s.meta={name:pname(jarlP())||'Kaldstrand',year:yearNow(),pop:S.pop,th:thLevel(),mode:S.mode};
  return {v:4,n:N,S:s,meta:s.meta,b:B.map(b=>[b.t,b.fx,b.fy,b.rot,b.desired,b.lvl,Math.round(b.anvil),b.mode,b.proj,b.sch===undefined?null:b.sch,b.cons||null]),roads:Array.from(roads.reduce((a,v,i)=>{if(v)a.push(i);return a;},[])),walls:Array.from(walls.reduce((a,v,i)=>{if(v)a.push(i*4+v);return a;},[])),
  zones:Array.from(unlocked),src:srcSave()};}
function apply(d){
  if(!d||d.v!==4||d.n!==N||!d.S||!Array.isArray(d.b))return false;
  const num=(v,def)=>Number.isFinite(+v)?+v:def;
  freshState(d.S.mode||'relaxed',d.S.adv||'');
  const base=S;S=Object.assign(base,d.S);S.res=Object.assign(EMPTY_RES(),d.S.res||{});for(const k in S.res)S.res[k]=Math.max(0,num(S.res[k],0));
  S.pol=Object.assign({ration:'normal',rite:'cremation',child:false,borders:'open',loot:'jarl',thralls:'soft'},d.S.pol||{});S.gods=Object.assign({odin:40,thor:40,freyja:40,njord:40,loki:30},d.S.gods||{});
  S.bal=null;S.modal=Array.isArray(S.modal)?S.modal:[];S.people=Array.isArray(S.people)?S.people:[];S.ships=Array.isArray(S.ships)?S.ships:[];S.raids=Array.isArray(S.raids)?S.raids:[];
  S.reserve=S.reserve||{};S.flow=S.flow||{};S.tg=S.tg||{};S.blessCd=S.blessCd||{};S.blessOn=S.blessOn||{};S.fx=S.fx||{};S.mods=S.mods||[];S.evtSeen=S.evtSeen||{};S.yr=S.yr||{births:0,deaths:0,arrived:0,left:0,raids:0,silver:0,fame:0};S.winter=S.winter||{hard:false,said:false,told:false};
  B=[];nextId=1;for(const a of d.b){if(!DEF[a[0]])continue;const b=addBuilding(a[0],a[1]|0,a[2]|0,(a[3]|0)&3,true);
    b.lvl=Math.min(5,Math.max(1,a[5]|0||1));b.anvil=num(a[6],100);b.mode=SMITH[a[7]]?a[7]:'tools';b.proj=a[8]&&SHIPS[a[8].type]?{type:a[8].type,done:num(a[8].done,0)}:(a[8]&&b.t==='tomb'?{done:num(a[8].done,0)}:null);if(a[9]!==null&&a[9]!==undefined&&HOUSE_SCH[a[9]])b.sch=a[9]|0;if(a[10]&&typeof a[10]==='object')b.cons={k:a[10].k,days:num(a[10].days,1),w:num(a[10].w,1),done:num(a[10].done,0),lv:num(a[10].lv,b.lvl),builders:0};
    b.desired=Math.min(slotsOf(b),Math.max(0,a[4]|0));}
  /* Beta 0.17: the shipyard became 3×3 (boathouse on the shore + quay and slipway over the sea); move old ones to the nearest spot that fits */
  rebuildOcc();for(const b of B){if(b.t!=='shipyard'||canPlace('shipyard',b.fx,b.fy,b.rot,b.id).ok)continue;let best=null;for(let dy=-1;dy<=2&&!best;dy++)for(let dx=-1;dx<=2&&!best;dx++)if(canPlace('shipyard',b.fx+dx,b.fy+dy,b.rot,b.id).ok)best=[b.fx+dx,b.fy+dy];if(best){b.fx=best[0];b.fy=best[1];rebuildOcc();}}
  roads=new Uint8Array(N*N);(d.roads||[]).forEach(i=>{if(i>=0&&i<N*N)roads[i]=1;});
  walls=new Uint8Array(N*N);(d.walls||[]).forEach(q=>{const i=q>>2;if(i>=0&&i<N*N)walls[i]=q&3;});S.maps=S.maps||{};S.mkt=S.mkt||{};S.advs=S.advs||(S.adv?[S.adv]:[]);
  unlocked=new Set((d.zones||[]).filter(z=>typeof z==='string'));if(!unlocked.size)defaultZones();
  srcLoad(d.src);
  S.cleared=Array.isArray(S.cleared)?S.cleared:[];S.cleared.forEach(i=>clearForest(i,true));
  syncPop();rebuildOcc();recomputeConn();assignWorkers();recalcMorale();dayAcc=S.gameT%DAY;return true;}
function save(){if(titleOn||!curSlot||!S||S.over&&!S.modal.length)return;try{localStorage.setItem(SLOT_KEY(curSlot),JSON.stringify(snapshot()));localStorage.setItem(LAST_KEY,String(curSlot));}catch(e){}}
function exportCode(){const s=JSON.stringify(snapshot());return 'UBBE4:'+btoa(unescape(encodeURIComponent(s)));}
function importCode(code){try{if(/^UBBE[123]:/.test(code)){toast('That code is from an older version of the game and cannot be loaded.');return false;}const s=decodeURIComponent(escape(atob(code.replace(/^UBBE4:/,'').replace(/\s+/g,''))));const ok=apply(JSON.parse(s));if(ok){if(!curSlot)curSlot=1;syncWalkers();save();}return ok;}catch(e){return false;}}
freshState('relaxed','');S.modal=[];
syncWalkers();assignWorkers();
setInterval(save,10000);
document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});
window.addEventListener('pagehide',save);
showTitle('home');
