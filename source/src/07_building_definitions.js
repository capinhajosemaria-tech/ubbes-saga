/* =================== building definitions =================== */
/* lvl: Town Hall level that unlocks it (level-1 buildings unlock through the saga goals instead) */
const DEF={
  th:{name:'Town Hall · Langhús',w:6,h:6,cost:{},slots:0,housing:4,road:false,fixed:true,lvl:1,desc:'The heart of Kaldstrand. Shelters the Jarl’s household. Raise it to unlock a new age of buildings.'},
  house:{name:'House',w:2,h:2,cost:{wood:20},slots:0,housing:4,road:false,cat:'Homes',lvl:1,up:true,desc:'Home for 4 people, 5 after the first upgrade; the second upgrade insulates it (−25% firewood). Burns ½ wood a day in summer and 1.2 in winter; when the logs run out, planks are burned (1 plank = 2 wood).'},
  jarl:{name:'Jarl’s House',w:3,h:3,cost:{wood:60,planks:30},slots:0,housing:4,road:false,cat:'Homes',lvl:1,desc:'Home of Ubbe and his heirs.'},
  pyre:{name:'Funeral Pyre',w:2,h:2,cost:{wood:10},slots:0,road:false,cat:'Community',lvl:1,desc:'The dead are burned here, so the river stays clean.'},
  wood:{name:'Woodcutter’s Lodge',w:2,h:2,cost:{wood:15},slots:3,tools:true,need:{k:'tree',r:6},cat:'Materials',lvl:1,up:true,out:'3 wood per worker a day',desc:'Fells trees within 6 tiles. Full output needs 90 trees of its own; trees never run out, but each belongs to one lodge only. Works through winter.'},
  carp:{name:'Carpenter',w:2,h:2,cost:{wood:25},slots:2,tools:true,cat:'Materials',lvl:1,up:true,out:'4 wood → 2 planks per worker a day',desc:'Saws timber into planks. Never touches the wood reserve you set.'},
  mine:{name:'Iron Mine',w:2,h:2,cost:{wood:30,planks:10},slots:3,tools:true,need:{k:'iron',r:4},cat:'Materials',lvl:1,up:true,out:'2 iron per worker a day',desc:'Digs ore within 4 tiles at the foot of the mountains. Full output needs 5 iron outcrops of its own; ore never runs out, but each outcrop belongs to one mine only.'},
  smith:{name:'Smithy',w:2,h:2,cost:{wood:15,planks:20,iron:10},slots:2,cat:'Crafts',lvl:1,up:true,out:'Tools, and later weapons',desc:'Forges tools; from Town Hall 2 spears, from Town Hall 3 shields, bows, arrows and swords. Needs a working anvil; a new one costs 10 iron. +15% next to a mine.'},
  fish:{name:'Fisher’s Hut',w:2,h:1,cost:{wood:15},slots:3,tools:true,need:{k:'water',r:3},cat:'Food',lvl:1,up:true,out:'4 fish per worker a day',desc:'A small hut with boats. Fishes the water within 3 tiles; the fish never run out. Catches far less in winter, more at sea than on the river.'},
  berry:{name:'Berry Gatherer',w:2,h:2,cost:{wood:10},slots:2,tools:true,need:{k:'bush',r:5},seasonal:true,cat:'Food',lvl:1,up:true,out:'4 berries per worker a day (summer)',desc:'Picks berries within 5 tiles. Full output needs 6 bushes of its own; bushes never run out, but each belongs to one gatherer only. Rests in winter; its workers are free for other jobs.'},
  pres:{name:'Preserver',w:2,h:2,cost:{wood:15,planks:20},slots:2,cat:'Food',lvl:1,up:true,out:'Dried fish and jam',desc:'Preserved food never spoils and feeds twice as much.'},
  gran:{name:'Granary',w:3,h:2,cost:{wood:30,planks:10},slots:0,road:false,store:{food:300},cat:'Storage',lvl:1,up:true,desc:'Raised storehouse. Holds 300 more food, +150 per upgrade.'},
  ware:{name:'Warehouse',w:3,h:2,cost:{wood:30,planks:10},slots:0,road:false,store:{mat:300},cat:'Storage',lvl:1,up:true,desc:'Holds 300 more goods, +150 per upgrade.'},
  market:{name:'Market Square',w:4,h:4,cost:{wood:40,planks:40},slots:1,cat:'Community',lvl:1,out:'More families settle here',desc:'Open square with stalls. Draws newcomers to Kaldstrand.'},
  /* ---- Town Hall level 2 ---- */
  pigpen:{name:'Pig Pen',w:3,h:3,cost:{wood:40,planks:10},slots:2,road:false,cat:'Farms',lvl:2,up:true,out:'Breeds pigs: meat and hides',desc:'Pigs breed in summer and eat fodder in winter. Pigs above the pen’s room are slaughtered for meat. Holds 12 pigs, +8 per upgrade.'},
  sheeppen:{name:'Sheep Pen',w:3,h:3,cost:{wood:40,planks:10},slots:2,road:false,cat:'Farms',lvl:2,up:true,out:'Keeps sheep: wool for sails and warm clothing',desc:'Sheep are shorn in summer and eat fodder in winter. Holds 12 sheep, +8 per upgrade.'},
  fodder:{name:'Fodder Field',w:3,h:3,cost:{wood:15},slots:2,road:false,tools:true,farm:true,seasonal:true,cat:'Farms',lvl:2,up:true,out:'5 fodder per worker a day (summer)',desc:'Grass and oats for the animals through winter. Not food for people. Needs tools.'},
  smoke:{name:'Smokehouse',w:2,h:2,cost:{wood:20,planks:15},slots:2,cat:'Food',lvl:2,up:true,out:'Smoked fish and meat',desc:'2 meat or fish + ½ wood → 1 smoked food (2 meals) per worker a day. Smoked food never spoils.'},
  altar:{name:'Altar',w:2,h:2,cost:{wood:20,planks:20,iron:5},slots:0,road:false,cat:'Community',lvl:2,desc:'Make offerings to Odin, Thor, Freyja, Njord and Loki. Favoured gods give gifts and blessings.'},
  train:{name:'Training Ground',w:3,h:3,cost:{wood:40,planks:30},slots:0,cat:'Military',lvl:2,up:true,desc:'Turns villagers into warriors in batches. Each recruit needs weapons. Warriors stop working in summer and eat 1½ meals.'},
  arsenal:{name:'Arsenal',w:3,h:2,cost:{wood:30,planks:30,iron:10},slots:0,road:false,store:{arms:60},cat:'Military',lvl:2,up:true,desc:'Stores weapons. Holds 60 more.'},
  /* ---- Town Hall level 3 ---- */
  mill:{name:'Water Mill',river:true,w:2,h:2,cost:{wood:30,planks:30,iron:5},slots:1,cat:'Food',lvl:3,up:true,out:'4 grain → 4 flour per worker a day',desc:'Stands on the river: the wheel turns the millstones. Flour keeps for ever and goes to the bakery.'},
  tavern:{name:'Tavern',w:3,h:2,cost:{wood:30,planks:30},slots:1,cat:'Community',lvl:3,needB:'brewery',out:'Morale while it has ale or mead',desc:'Folk drink here in the evenings. While it has a keeper and ale or mead in store it uses a little every day and raises morale (more with mead). Opens once you have a brewery.'},
  grain:{name:'Grain Field',w:3,h:3,cost:{wood:20},slots:2,road:false,tools:true,farm:true,seasonal:true,cat:'Farms',lvl:3,up:true,out:'4 grain per worker a day (summer)',desc:'Barley for the mill and the brewery. Needs tools.'},
  bakery:{name:'Bakery',w:2,h:2,cost:{wood:20,planks:25},slots:2,cat:'Food',lvl:3,up:true,out:'3 flour + ½ wood → 3 bread per worker a day',desc:'Flat bread from a clay oven, all year round. Bread keeps a while and feeds 1½.'},
  flax:{name:'Flax Field',w:3,h:3,cost:{wood:20},slots:2,road:false,tools:true,farm:true,seasonal:true,cat:'Farms',lvl:3,up:true,out:'4 flax per worker a day (summer)',desc:'Flax for rope.'},
  weaver:{name:'Weaver',w:2,h:2,cost:{wood:20,planks:25},slots:2,cat:'Crafts',lvl:3,up:true,out:'2 wool → 1 sailcloth; 2 flax → 1 rope',desc:'Weaves wool into sailcloth and twists flax into rope for ships.'},
  shipyard:{name:'Shipyard',water:true,w:4,h:3,cost:{wood:60,planks:60,iron:10},slots:4,need:{k:'sea',r:1},cat:'Sea',lvl:3,desc:'Builds ships on a slipway. Its slipway may run out over the water, but it needs a foothold on the shore. A ship takes many worker-days.'},
  harbour:{name:'Harbour',water:true,pier:true,w:2,h:6,cost:{wood:40,planks:50},slots:0,road:false,need:{k:'sea',r:1},cat:'Sea',lvl:3,desc:'A long pier where ships moor and merchants land. It runs from the shore straight out to sea.'},
  thrall:{name:'Thrall Pen',w:3,h:2,cost:{wood:40,planks:20,iron:5},slots:0,road:false,cat:'Homes',lvl:3,up:true,desc:'Holds 8 thralls (+4 per upgrade). Thralls work without pay, eat half a meal and may try to flee.'},
  camp:{name:'Community Fire',w:1,h:1,cost:{wood:10},slots:0,road:false,cat:'Decor',lvl:1,deco:3,desc:'A ring of stones where neighbours gather. +3 attractiveness.'},
  bench:{name:'Wooden Benches',w:1,h:1,cost:{wood:5},slots:0,road:false,cat:'Decor',lvl:1,deco:1,desc:'Somewhere to sit in the evening. +1 attractiveness.'},
  wattle:{name:'Wattle Fence',w:1,h:1,cost:{wood:2},slots:0,road:false,cat:'Decor',lvl:1,deco:0.5,desc:'Woven hazel fencing. +½ attractiveness.'},
  rune:{name:'Rune Post',w:1,h:1,cost:{wood:10,planks:5},slots:0,road:false,cat:'Decor',lvl:2,deco:3,desc:'A carved post painted red. +3 attractiveness.'},
  herbs:{name:'Herb Garden',w:1,h:1,cost:{wood:8},slots:0,road:false,cat:'Decor',lvl:2,deco:2,desc:'Angelica, thyme and chives. +2 attractiveness.'},
  prow:{name:'Carved Prow',w:1,h:1,cost:{planks:20,iron:2},slots:0,road:false,cat:'Decor',lvl:3,deco:4,desc:'A dragon prow set up on a stand. +4 attractiveness.'},
  nets:{name:'Drying Nets',w:1,h:1,cost:{wood:6,rope:2},slots:0,road:false,cat:'Decor',lvl:3,deco:2,desc:'Nets hung between poles. +2 attractiveness.'},
  trade:{name:'Trading House',w:3,h:2,cost:{wood:40,planks:40,iron:10},slots:0,cat:'Sea',lvl:3,desc:'Merchants sail in during summer. Sell surplus for silver, buy what you lack. Needs a harbour.'}
};
/* limits per Town Hall level [1,2,3] */
const LIMITS={th:[1,1,1],house:[6,10,14],jarl:[1,1,1],pyre:[1,1,2],wood:[2,3,4],carp:[1,2,2],mine:[1,2,2],smith:[1,1,2],fish:[2,2,2],berry:[2,2,3],pres:[1,1,2],gran:[1,2,2],ware:[1,2,2],market:[1,1,1],
  pigpen:[0,1,1],sheeppen:[0,1,1],fodder:[0,1,2],smoke:[0,1,2],altar:[0,1,1],train:[0,1,1],arsenal:[0,1,1],grain:[0,0,3],bakery:[0,0,1],flax:[0,0,2],weaver:[0,0,1],mill:[0,0,1],tavern:[0,0,1],shipyard:[0,0,1],harbour:[0,0,1],trade:[0,0,1],thrall:[0,0,1],camp:[4,6,8],bench:[6,8,10],wattle:[20,30,40],rune:[0,4,6],herbs:[0,4,6],prow:[0,0,3],nets:[0,0,4]};
const thLevel=()=>S.th||1;
/* houses, granaries and warehouses have no limit (granaries and warehouses cost more after the second) */
const UNLIMITED=new Set(['house','gran','ware']),NOLIMIT=9999;
/* how many of these a test village builds */
const TEST_COUNT={house:[11,15,22,25,27],gran:[1,2,2,3,3],ware:[1,2,2,3,3]};
const limitOf=k=>UNLIMITED.has(k)?NOLIMIT:(LIMITS[k]||[1,1,1])[thLevel()-1];
const limTxt=k=>UNLIMITED.has(k)?'no limit':limitOf(k);
const FIRST_FREE=['berry','wood'];
/* 1st and 2nd at base price, 3rd–5th each +30% on the one before, then each +50% */
const storeMult=n=>{let m=1;for(let i=3;i<=n;i++)m*=i<=5?1.3:1.5;return m;};
const costOf=k=>{if(FIRST_FREE.includes(k)&&!B.some(b=>b.t===k))return {};const c=DEF[k].cost;if(k!=='gran'&&k!=='ware')return c;
  const m=storeMult(B.filter(b=>b.t===k).length+1);if(m===1)return c;const o={};for(const q in c)o[q]=Math.round(c[q]*m);return o;};
const CATS=['Homes','Food','Farms','Materials','Crafts','Storage','Community','Military','Sea','Decor'];
const BUILDABLE=new Set([T.GRASS,T.BEACH,T.FOOT]);
const isAvail=k=>{const D=DEF[k];if(D.needB&&!has(D.needB))return false;if(D.lvl>1||D.cat==='Decor')return thLevel()>=D.lvl;return S.avail.includes(k);};
/* Town Hall: people + materials + at least one house at the highest level the current hall allows */
const TH_UP={2:{cost:{wood:110,planks:70,iron:20},pop:22,house:1},
             3:{cost:{wood:190,planks:150,iron:50,tools:10},pop:32,house:2}};
const slotsOf=b=>(b.cons&&b.cons.k==='build')?0:(DEF[b.t].slots||0)+(DEF[b.t].slots&&!DEF[b.t].wonder&&!FIELDS.has(b.t)&&b.lvl>=3?1:0);
const upCost=b=>{const c=DEF[b.t].cost,o={};Object.keys(c).forEach(k=>o[k]=Math.round(c[k]*(b.lvl)*1.0));if(!Object.keys(o).length)o.wood=20*b.lvl;return o;};
const canUpgrade=b=>DEF[b.t].up&&b.lvl<thLevel()&&!b.cons;

/* ---- Town Hall levels 4 and 5 ---- */
Object.assign(DEF,{
  brewery:{name:'Brewery',w:2,h:2,cost:{wood:30,planks:30,iron:5},slots:2,cat:'Food',lvl:3,up:true,out:'2 grain + ½ wood → 2 ale; 2 honey → 1 mead',desc:'Brews ale from grain and mead from honey. Ale and mead are not meals: they are drunk at feasts and in the tavern, and merchants pay well for mead.'},
  hives:{name:'Beehives',w:2,h:2,cost:{wood:20,planks:10},slots:1,road:false,seasonal:true,farm:true,cat:'Farms',lvl:3,up:true,out:'3 honey per keeper a day (summer)',desc:'Straw skeps on a sunny slope. Honey for mead, offerings to Freyja and trade.'},
  tomb:{name:'Ragnar’s Ship-Tomb',w:4,h:4,cost:{planks:150,iron:40},slots:5,cat:'Community',lvl:4,wonder:true,out:'A wonder: up to 5 builders raise it, year after year',desc:'A great mound over a sacrificed ship, for Ragnar Lothbrok. To begin: 40 gold, 6 swords and one of your ships. When finished, Odin’s favour never falls below 30 and Kaldstrand gains 1 fame every day.'},
  tailor:{name:'Tailor',w:2,h:2,cost:{wood:20,planks:30},slots:2,cat:'Crafts',lvl:5,up:true,out:'2 wool + 1 hide → 1 warm clothing',desc:'Sews wool cloaks and fur-lined boots. With enough warm clothing for everyone, winter sickness is halved and spirits rise.'},
  hof:{name:'Hof',w:4,h:3,cost:{wood:80,planks:80,iron:20,silver:50},slots:1,cat:'Community',lvl:5,desc:'A temple hall kept by a gothi. Favour rises 25% faster, the gothi tends the least-honoured god, and blessings cost 20 favour instead of 30.'},
  tower:{name:'Watchtower',w:2,h:2,cost:{wood:40,planks:30},slots:0,road:false,cat:'Military',lvl:5,desc:'A timber tower for two archers. Adds to the village’s defence, more if it stands by the palisade.'}
});
for(const k in LIMITS){const a=LIMITS[k];while(a.length<5)a.push(a[a.length-1]);}
Object.assign(LIMITS,{house:[6,10,14,18,22],wood:[2,3,4,4,5],mine:[1,2,2,2,3],carp:[1,2,2,3,3],smith:[1,1,2,2,3],berry:[2,2,3,3,3],pres:[1,1,2,2,2],gran:[1,2,2,3,3],ware:[1,2,2,3,3],
  smoke:[0,1,2,2,2],flax:[0,0,2,3,3],
tomb:[0,0,0,1,1],tailor:[0,0,0,0,1],hof:[0,0,0,0,1],tower:[0,0,0,0,2],camp:[4,6,8,10,12],bench:[6,8,10,12,14],rune:[0,4,6,8,10],herbs:[0,4,6,8,10],prow:[0,0,3,4,6],nets:[0,0,4,5,6]});
Object.assign(LIMITS,{wood:[2,3,4,4,5],carp:[1,2,2,2,2],mine:[1,1,2,2,2],smith:[1,1,1,2,2],berry:[2,2,2,2,2],pres:[1,1,1,1,2],smoke:[0,1,1,1,2],flax:[0,0,1,2,2],
  pigpen:[0,1,1,2,2],sheeppen:[0,1,1,2,2],fodder:[0,1,2,3,3],grain:[0,0,2,3,3],mill:[0,0,1,1,2],bakery:[0,0,1,2,2],brewery:[0,0,1,1,2],hives:[0,0,2,2,3],tavern:[0,0,1,1,1]});
TH_UP[4]={cost:{wood:320,planks:270,iron:100,tools:20,silver:100},pop:48,house:3};
TH_UP[5]={cost:{wood:460,planks:400,iron:170,tools:30,silver:250,gold:20},pop:80,house:4};
