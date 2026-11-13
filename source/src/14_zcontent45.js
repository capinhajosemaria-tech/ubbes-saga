/* =================== levels 4–5: troops, regions, market, walls, banquets, advisors =================== */
Object.assign(TROOPS,{viking:{n:'Viking',lv:4,str:2.6,eq:{axes:1,shields:1},d:'Broad axe and shield. The heart of a raid.'},
  berserk:{n:'Berserker',lv:5,str:3.4,eq:{axes:1,shields:1,armour:1},d:'Axe, shield and mail. Terrible in battle, and costly.'},
  merc:{n:'Mercenary',lv:4,str:2.0,eq:{},d:'Sword-arms for hire from the south. Paid in silver for a year.'}});
Object.assign(SMITH,{axes:{n:'Axes',lv:4,per:0.35,c:{iron:1.5,wood:0.5}},armour:{n:'Armour',lv:5,per:0.15,c:{iron:4,hides:1}}});
Object.assign(PRIMARY,{viking:'axes',berserk:'axes',merc:''});
SHIPCAP.snekkja={crew:25,cargo:160};
/* regions and new targets */
const REGIONS={scand:{n:'Scandinavia',lv:3},isles:{n:'The Northern Isles',lv:4},england:{n:'England',lv:5,map:'england'}};
TARGETS.forEach(t=>{t.reg='scand';});
TARGETS.push(
  {id:'shet',reg:'isles',n:'Shetland',type:'Fishing steadings',x:0,y:0,d:4,def:12,loot:{fish:80,wool:40,smoked:30,silver:45},pris:6,herd:2},
  {id:'heb',reg:'isles',n:'The Hebrides',type:'Farms of the western isles',x:0,y:0,d:6,def:16,loot:{grain:90,meat:60,wool:40,silver:60},pris:8,herd:4},
  {id:'ork',reg:'isles',n:'Orkney',type:'Hall of the Orkney jarl',x:0,y:0,d:6,def:30,loot:{silver:150,gold:10,meat:50,swords:3},pris:10,jarl:true},
  {id:'lind',reg:'england',n:'Lindisfarne',type:'Monastery on a holy island',x:0,y:0,d:9,def:12,loot:{gold:40,silver:120,cloth:20,misc:20},pris:8},
  {id:'iona',reg:'england',n:'Iona',type:'Monastery of the west',x:0,y:0,d:10,def:10,loot:{gold:30,silver:90,cloth:15,misc:15},pris:6},
  {id:'york',reg:'england',n:'York',type:'Walled town of Northumbria',x:0,y:0,d:11,def:52,loot:{silver:320,gold:35,cloth:30,swords:6},pris:14,walls:true},
  {id:'london',reg:'england',n:'London',type:'Walled port of Mercia',x:0,y:0,d:12,def:64,loot:{silver:400,gold:50,cloth:40,tools:15},pris:16,walls:true,trade:true});
const regionOpen=r=>{const R=REGIONS[r||'scand'];return thLevel()>=R.lv&&(!R.map||!!(S.maps&&S.maps[R.map]));};
const hasAdv=k=>S.advs?S.advs.includes(k):S.adv===k;
const advSlots=()=>[1,1,2,3,4][thLevel()-1];   /* the council: 4 seats in all, the 4th at Town Hall 5 */
/* trading partners unlock step by step */
const PARTNERS={skir:{n:'Skiringssal',open:()=>thLevel()>=3,wants:['flour','smoked','planks','hides'],sells:['iron','tools','flour','pig','sheep','arrows']},
  hedeby:{n:'Hedeby',open:()=>thLevel()>=3&&S.ships.length>0,wants:['wool','cloth','hides','mead','misc'],sells:['tools','iron','swords','shields','thrall','gold']},
  birka:{n:'Birka',open:()=>thLevel()>=4,wants:['hides','honey','mead','rope','jam'],sells:['iron','axes','bows','armour','gold','sheep']},
  dublin:{n:'Dublin',open:()=>thLevel()>=5,wants:['clothes','mead','swords','thrall','cloth'],sells:['gold','silver','flour','tools','pig']},
  london:{n:'London',open:()=>thLevel()>=5&&!!(S.maps&&S.maps.england),wants:['hides','clothes','honey','smoked','mead'],sells:['gold','tools','cloth','armour','swords']}};
const BASEP={wood:0.4,planks:2,iron:3,tools:6,flour:1,fodder:0.5,wool:2,flax:1.2,grain:1,cloth:6,rope:5,hides:3,misc:1,honey:2.5,clothes:9,smoked:3,jam:2,bread:1,ale:2,mead:5,
  spears:5,shields:8,bows:6,arrows:0.6,swords:18,axes:10,armour:32,thrall:18,pig:6,sheep:8,gold:10,silver:1};
function partnerOk(id){const P=PARTNERS[id];return P&&P.open()&&!(((S.tg[id]||{}).ban||0)>S.day);}
function mktSat(k){S.mkt=S.mkt||{};return S.mkt[k]===undefined?1:S.mkt[k];}
function priceSell(k){const P=PARTNERS[S.trader.from]||{wants:[]};let p=BASEP[k]*(P.wants.includes(k)?1.35:1)*mktSat(k);if(hasAdv('athelstan'))p*=1.2;if(jt('wise'))p*=1.1;if(ut('trader'))p*=1.15;const d=(S.trader.deals||[]).find(x=>x.k===k&&x.left>0);if(d)p*=1.5;return p;}
/* buying: iron and tools cost more than their selling value; every iron or tool bought raises its price (2.5% each, up to ×2.5), easing back 1% a day */
const BUYX={iron:1.35,tools:1.35};
function mktDem(k){S.mktB=S.mktB||{};return S.mktB[k]===undefined?1:S.mktB[k];}
function bought(k,q){if(!BUYX[k])return;S.mktB=S.mktB||{};S.mktB[k]=Math.min(2.5,mktDem(k)*Math.pow(1.025,k==='arrows'?q/10:q));}
function priceBuy(k){const P=PARTNERS[S.trader.from]||{sells:[]};let p=BASEP[k]*1.45*0.85*(BUYX[k]||1)*mktDem(k);if(hasAdv('athelstan'))p*=0.85;if(ut('trader'))p*=0.87;return Math.max(1,p);}
function newTrader(){const ok=Object.keys(PARTNERS).filter(partnerOk);if(!ok.length)return null;const id=pick(ok),P=PARTNERS[id];
  const deals=[];const w=P.wants.slice().sort(()=>Math.random()-0.5).slice(0,2);w.forEach(k=>deals.push({k:k,left:Math.round(20+Math.random()*40)}));
  return {until:S.day+4,from:id,deals:deals};}
function marketDay(){if(thLevel()>=3&&S.day%5===0&&!B.some(b=>b.t==='shipyard')&&typeof claimShore==='function'){const c=claimShore();if(c){S.shoreClaimed=true;toast('No free shore was left for a shipyard, so your jarl claimed '+zoneName(c.zx,c.zy)+'.',6000);}}S.mkt=S.mkt||{};for(const k in S.mkt){S.mkt[k]=Math.min(1,S.mkt[k]+0.008);}S.mktB=S.mktB||{};for(const k in S.mktB){S.mktB[k]=Math.max(1,S.mktB[k]-0.01);}}
/* resources only appear once something can use them (or a merchant can buy them) */
const tradeOpen=()=>has('trade')&&has('harbour');
const woolUse=()=>has('weaver')||has('tailor')||tradeOpen();
const hideUse=()=>has('tailor')||tradeOpen()||thLevel()>=5;
const miscUse=()=>has('altar');
/* palisade: a tile grid; 1 = stakes, 2 = gate (roads pass) */
let walls=new Uint8Array(N*N);
function wallsClosed(){const th=B.find(b=>b.t==='th');if(!th)return false;if(!walls.some(v=>v===2))return false;
  const seen=new Uint8Array(N*N),q=[];const pass=i=>!walls[i]&&ter[i]!==T.MOUNT&&ter[i]!==T.FOOT&&ter[i]!==T.IRON;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x;if((x===0||y===0||x===N-1||y===N-1||ter[i]===T.SEA)&&pass(i)){seen[i]=1;q.push(i);}}
  while(q.length){const i=q.pop(),x=i%N,y=(i/N)|0;for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+d[0],ny=y+d[1];if(nx<0||ny<0||nx>=N||ny>=N)continue;const j=ny*N+nx;if(seen[j]||!pass(j))continue;seen[j]=1;q.push(j);}}
  for(let y=th.fy;y<th.fy+th.h;y++)for(let x=th.fx;x<th.fx+th.w;x++)if(seen[y*N+x])return false;return true;}
function recomputeWalls(){S.wallClosed=thLevel()>=5&&wallsClosed();}
function defenceValue(){const home=S.people.filter(p=>p.w&&!p.away&&p.sick<=0);let d=home.reduce((a,p)=>a+soldierStr(p),0);
  const archers=home.filter(p=>p.w==='archer').length;const tw=B.filter(b=>b.t==='tower').length;d+=Math.min(tw,Math.floor(archers/2))*6;
  if(S.wallClosed)d*=1.5;if(fav('thor')>=50)d*=1.1;if(ut('warrior'))d*=1.15;return Math.round(d);}
/* banquets in the hall (Town Hall 4+): cost rises if repeated within a season */
const BANQ={people:{n:'People’s feast',d:'+12 morale for 20 days',c:()=>({smoked:Math.ceil(S.pop*0.25),ale:Math.ceil(S.pop*0.4)}),fx:()=>{addMod('banq','A feast in the hall',12,20);}},
  warriors:{n:'Warriors’ feast',d:'The next raid fights 15% harder',c:()=>({smoked:Math.ceil(S.warriors*0.6+4),mead:Math.ceil(S.warriors*0.4+2)}),fx:()=>{S.blessOn.feastR=1;addMod('banqw','The warriors feasted',4,15);}},
  council:{n:'Council feast',d:'+20 fame and the Gods take note',c:()=>({smoked:10,mead:10}),fx:()=>{addFame(20);GOD_KEYS.forEach(g=>addFavor(g,3));}}};
function banqCost(k){const base=BANQ[k].c(),m=1+0.5*(S.banqN||0);const o={};for(const x in base)o[x]=Math.ceil(base[x]*m);return o;}
function holdBanquet(k){const c=banqCost(k);if(!afford(c))return 'Not enough: needs '+costStr(c);pay(c,1);BANQ[k].fx();S.banqN=(S.banqN||0)+1;S.banqReset=S.day+20;S.feast={until:S.gameT+DAY*1.5};return '';}
/* mercenaries: hired for a year, paid in silver up front */
function hireMercs(){if(thLevel()<4)return 'Mercenaries come at Town Hall level 4';if(S.fame<300)return 'They only follow a Jarl of 300 fame or more';const n=Math.min(5,warCap()-S.warriors);if(n<=0)return 'No room for more warriors';const cost=n*14;if(S.res.silver<cost)return 'Needs '+cost+' silver';if(housing()-S.pop<n)return 'Needs room in the houses for '+n;
  S.res.silver-=cost;for(let i=0;i<n;i++)newPerson({g:'m',a:Math.round(U(22,38)),w:'merc',xp:1,tr:Math.random()<0.3?'hot':'',merc:S.day+YDAYS});syncPop();return '';}
function mercDay(){for(const p of S.people.slice())if(p.merc&&p.merc<=S.day&&!p.away){removePerson(p,'left');toast('A mercenary’s year is up. He takes his pay and sails south.');}}

EVTS.sails={cat:'War',c:()=>thLevel()>=5,w:0.7,mk:()=>({n:pick(['Hrolf the Grey','Sigvard of Jutland','the Orkney jarl'])}),t:a=>'Scouts on the headland saw the sails of '+a.n+' off the coast. They lay there a day, counting your defences, and turned away.',
  o:[{l:'Note it in the saga',f:()=>{const d=defenceValue();return 'Defence of Kaldstrand: '+d+'. Next time they may land.';}}]};
