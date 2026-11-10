/* =================== resources & caps =================== */
const foodUnits=()=>FOOD.reduce((a,k)=>a+S.res[k]*MEAL[k],0);
const foodItems=()=>FOOD.reduce((a,k)=>a+S.res[k],0);
const matItems=()=>MAT.reduce((a,k)=>a+(k==='tools'?0:S.res[k]),0);
const armsItems=()=>ARMS.reduce((a,k)=>a+(k==='arrows'?S.res[k]/10:S.res[k]),0);
const lvlSum=t=>B.filter(b=>b.t===t).reduce((a,b)=>a+300+150*(b.lvl-1),0);
const capFood=()=>200+lvlSum('gran');
const capMat=()=>300+lvlSum('ware');
const capArms=()=>20+B.filter(b=>b.t==='arsenal').reduce((a,b)=>a+60+30*(b.lvl-1),0);
const capWater=()=>150+100*count('water');
const HOUSE_CAP=[4,5,5,6,6];const housing=()=>B.reduce((a,b)=>{const D=DEF[b.t];return a+(D.housing?(b.t==='house'?HOUSE_CAP[b.lvl-1]:D.housing):0);},0);
const fireNeed=()=>B.reduce((a,b)=>a+(b.t==='house'?(b.lvl>=3?0.75:1):b.t==='jarl'?1:0),0)*FIRE_HOUSE+FIRE_TH;
const warCap=()=>Math.round([0,5,12,20,30][thLevel()-1]*(S.mobilUntil>S.day?1.2:1));
const herdCap=()=>B.filter(b=>b.t==='pen').reduce((a,b)=>a+12+8*(b.lvl-1),0);
function addRes(k,a){if(a<=0)return 0;let room=Infinity;if(FOOD.includes(k))room=capFood()-foodItems();else if(MAT.includes(k)&&k!=='tools')room=capMat()-matItems();else if(ARMS.includes(k))room=capArms()-armsItems();else if(k==='water')room=capWater()-S.res.water;const g=Math.max(0,Math.min(a,room));S.res[k]+=g;return g;}
function afford(cost){return Object.keys(cost).every(k=>(S.res[k]||0)>=cost[k]);}
function pay(cost,sign){Object.keys(cost).forEach(k=>{S.res[k]=(S.res[k]||0)-cost[k]*sign;});}
const fmt=n=>Math.floor(n+1e-9).toString();
const costStr=c=>Object.keys(c).length?Object.keys(c).map(k=>c[k]+' '+(RNAME[k]||k).toLowerCase()).join(', '):'free';
