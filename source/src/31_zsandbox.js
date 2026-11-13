/* =================== Sandbox mode =================== */
/* Endless stores (building costs are free, stores are topped up every frame), every building and every upgrade
   open (gateLv() = MAX_TH, see 07_building_definitions.js), construction and upgrades finish at once
   (12_zconstruction.js), the Town Hall rises without requirements (13_daily_economy.js) and all land is ours.
   People still move in, eat, work and live as in the other modes. */
const SBX_STOCK=999;
function sbxUnlockAll(){for(let zx=0;zx<ZN;zx++)for(let zy=0;zy<ZN;zy++)unlocked.add(zx+','+zy);}
function sbxFill(){const r=S.res;for(const k in r){const v=SBX_STOCK;if(!(r[k]>=v))r[k]=v;}
  if(S.fame<5000)S.fame=5000;}
{const _fs=freshState;freshState=function(mode,adv){const x=_fs.apply(this,arguments);if(SBX()){sbxUnlockAll();sbxFill();}return x;};}
{const _ap=apply;apply=function(d){const ok=_ap.apply(this,arguments);if(ok&&SBX()){sbxUnlockAll();sbxFill();}return ok;};}
{const _up=update;update=function(dt){_up(dt);if(SBX())sbxFill();};}
{const _dt=dayTick;dayTick=function(){_dt.apply(this,arguments);if(SBX())sbxFill();};}
{const _hd=hud;hud=function(){_hd.apply(this,arguments);if(!SBX())return;
  for(const k of ['food','wood','planks','iron','tools','silver']){const e=$('r-'+k);if(e)e.textContent='∞';const d=$('d-'+k);if(d){d.textContent='';d.className='';}}};}
