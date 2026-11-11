/* =================== resources & caps =================== */
const foodUnits=()=>FOOD.reduce((a,k)=>a+S.res[k]*MEAL[k],0);
const foodItems=()=>FOOD.reduce((a,k)=>a+S.res[k],0);
const matItems=()=>MAT.reduce((a,k)=>a+(k==='tools'?0:S.res[k]),0);
const armsItems=()=>ARMS.reduce((a,k)=>a+(k==='arrows'?S.res[k]/10:S.res[k]),0);
const lvlSum=t=>B.filter(b=>b.t===t&&!underCons(b)).reduce((a,b)=>a+300+150*(b.lvl-1),0);
const capFood=()=>200+lvlSum('gran');
const capMat=()=>300+lvlSum('ware');
const capArms=()=>20+B.filter(b=>b.t==='arsenal'&&!underCons(b)).reduce((a,b)=>a+60+30*(b.lvl-1),0);
const capWater=()=>150+100*count('water');
const HOUSE_CAP=[4,5,6,7,8];const housing=()=>B.reduce((a,b)=>{const D=DEF[b.t];return a+(D.housing&&!underCons(b)?(b.t==='house'?HOUSE_CAP[b.lvl-1]:D.housing):0);},0);
/* firewood a day: each house 0.5 in summer (cooking) and 1.2 in winter; insulated houses (lv3+) ×0.75; the Town Hall burns as much as 2 houses */
const fireBase=()=>B.reduce((a,b)=>a+(underCons(b)?0:b.t==='house'?(b.lvl>=3?0.75:1):b.t==='jarl'?1:0),0)*FIRE_HOUSE+FIRE_TH;
const FIRE_SUMMER=0.5,FIRE_WINTER=1.2;
const fireNeed=()=>fireBase()*FIRE_WINTER;   /* a winter day */
const fireSummer=()=>fireBase()*FIRE_SUMMER;
const fireToday=()=>isWinter()?fireNeed()*(S.winter&&S.winter.hard?1.3:1):fireSummer();
/* burn firewood: logs first, then planks (1 plank = 2 wood) down to the plank reserve; returns false if short */
function burnFire(fw){const r=S.res;if(r.wood>=fw){r.wood-=fw;return true;}fw-=r.wood;r.wood=0;
  const pk=Math.max(0,r.planks-((S.reserve&&S.reserve.planks)||0)),use=Math.min(pk,fw/2);r.planks-=use;fw-=use*2;return fw<=0.01;}
/* no warrior limit any more: training takes free workers and gear. WAR_TEST = how many a test village arms */
const WAR_TEST=[0,5,12,20,30];const warCap=()=>NOLIMIT;
const penRoom=t=>B.filter(b=>b.t===t&&!underCons(b)).reduce((a,b)=>a+12+8*(b.lvl-1),0);
const pigCap=()=>penRoom('pigpen'),sheepCap=()=>penRoom('sheeppen'),herdCap=()=>pigCap()+sheepCap();
function addRes(k,a){if(a<=0)return 0;let room=Infinity;if(FOOD.includes(k))room=capFood()-foodItems();else if(MAT.includes(k)&&k!=='tools')room=capMat()-matItems();else if(ARMS.includes(k))room=capArms()-armsItems();const g=Math.max(0,Math.min(a,room));S.res[k]+=g;if(PRODLOG&&g>0){const kk=FOOD.includes(k)?'food':k;const L=PRODLOG[kk]||(PRODLOG[kk]={});L[PRODSRC]=(L[PRODSRC]||0)+g;}return g;}
let PRODLOG=null,PRODSRC='other';
function afford(cost){return Object.keys(cost).every(k=>(S.res[k]||0)>=cost[k]);}
function pay(cost,sign){Object.keys(cost).forEach(k=>{S.res[k]=(S.res[k]||0)-cost[k]*sign;});}
const fmt=n=>Math.floor(n+1e-9).toString();
/* cost with resource icons (names on hover); falls back to words for goods without an icon */
const costIco=c=>Object.keys(c).length?Object.keys(c).map(k=>typeof ICON!=='undefined'&&ICON[k]?'<span class="ci" title="'+(RNAME[k]||k)+'">'+ICON[k]+c[k]+'</span>':'<span class="ci">'+c[k]+' '+(RNAME[k]||k).toLowerCase()+'</span>').join(''):'free';
const costStr=c=>Object.keys(c).length?Object.keys(c).map(k=>c[k]+' '+(RNAME[k]||k).toLowerCase()).join(', '):'free';
