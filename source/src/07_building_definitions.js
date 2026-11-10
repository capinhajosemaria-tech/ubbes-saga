/* =================== building definitions =================== */
/* lvl: Town Hall level that unlocks it (level-1 buildings unlock through the saga goals instead) */
const DEF={
  th:{name:'Town Hall · Langhús',w:6,h:6,cost:{},slots:0,housing:4,road:false,fixed:true,lvl:1,desc:'The heart of Kaldstrand. Shelters the Jarl’s household. Raise it to unlock a new age of buildings.'},
  house:{name:'House',w:2,h:2,cost:{wood:20},slots:0,housing:4,road:false,cat:'Housing',lvl:1,up:true,desc:'Home for 4 people, 5 after the first upgrade; the second upgrade insulates it (−25% firewood). Burns 1 wood a day in winter.'},
  jarl:{name:'Jarl’s House',w:3,h:3,cost:{wood:60,planks:30},slots:0,housing:4,road:false,cat:'Housing',lvl:1,desc:'Home of Ubbe and his heirs.'},
  pyre:{name:'Funeral Pyre',w:2,h:2,cost:{wood:10},slots:0,road:false,cat:'Housing',lvl:1,desc:'The dead are burned here, so the river stays clean.'},
  wood:{name:'Woodcutter’s Lodge',w:2,h:2,cost:{wood:15},slots:3,tools:true,need:{k:'tree',r:6},cat:'Resources',lvl:1,up:true,out:'3 wood per worker a day',desc:'Fells trees within 6 tiles. Felled trees grow back in about a year and a half.'},
  carp:{name:'Carpenter',w:2,h:2,cost:{wood:25},slots:2,tools:true,cat:'Resources',lvl:1,up:true,out:'4 wood → 2 planks per worker a day',desc:'Saws timber into planks. Never touches the wood reserve you set.'},
  mine:{name:'Iron Mine',w:2,h:2,cost:{wood:30,planks:10},slots:3,tools:true,need:{k:'iron',r:4},cat:'Resources',lvl:1,up:true,out:'2 iron per worker a day',desc:'Digs ore at the foot of the mountains.'},
  smith:{name:'Smithy',w:2,h:2,cost:{wood:15,planks:20,iron:10},slots:2,cat:'Resources',lvl:1,up:true,out:'Tools, and later weapons',desc:'Forges tools; from Town Hall 2 spears, from Town Hall 3 shields, bows, arrows and swords. Needs a working anvil; a new one costs 10 iron. +15% next to a mine.'},
  water:{name:'Water Carrier',w:1,h:1,cost:{wood:5},slots:2,tools:true,need:{k:'river',r:3},cat:'Resources',lvl:1,up:true,out:'6 water per worker a day',desc:'Fetches fresh water from the river.'},
  fish:{name:'Fisher’s Hut',w:2,h:1,cost:{wood:15},slots:3,tools:true,need:{k:'water',r:3},cat:'Food',lvl:1,up:true,out:'4 fish per worker a day',desc:'A small hut with boats. One by the bay and one by the river is enough: set how many fish with the workers. Catches far less in winter.'},
  berry:{name:'Berry Gatherer',w:2,h:2,cost:{wood:10},slots:2,tools:true,need:{k:'bush',r:5},seasonal:true,cat:'Food',lvl:1,up:true,out:'4 berries per worker a day (summer)',desc:'Picks berries within 5 tiles. Rests in winter; its workers are free for other jobs.'},
  pres:{name:'Preserver',w:2,h:2,cost:{wood:15,planks:20},slots:2,cat:'Food',lvl:1,up:true,out:'Dried fish, jam and (with salt) pickles',desc:'Preserved food never spoils and feeds twice as much.'},
  gran:{name:'Granary',w:3,h:2,cost:{wood:30,planks:10},slots:0,road:false,store:{food:300},cat:'Storage',lvl:1,up:true,desc:'Raised storehouse. Holds 300 more food, +150 per upgrade.'},
  ware:{name:'Warehouse',w:3,h:2,cost:{wood:30,planks:10},slots:0,road:false,store:{mat:300},cat:'Storage',lvl:1,up:true,desc:'Holds 300 more goods, +150 per upgrade.'},
  market:{name:'Market Square',w:4,h:4,cost:{wood:40,planks:40},slots:1,cat:'Village',lvl:1,out:'More families settle here',desc:'Open square with stalls. Draws newcomers to Kaldstrand.'},
  /* ---- Town Hall level 2 ---- */
  pen:{name:'Animal Pen',w:3,h:3,cost:{wood:40,planks:10},slots:2,road:false,cat:'Farms',lvl:2,up:true,out:'Breeds pigs and sheep: meat, wool, hides',desc:'Keeps the herd. Animals breed in summer and eat hay in winter. Surplus animals are slaughtered for meat.'},
  hay:{name:'Hay Meadow',w:3,h:3,cost:{wood:15},slots:2,road:false,tools:true,farm:true,seasonal:true,cat:'Farms',lvl:2,up:true,out:'5 hay per worker a day (summer)',desc:'Scythed grass to feed the herd through winter. Needs tools.'},
  garden:{name:'Vegetable Garden',w:3,h:3,cost:{wood:20},slots:2,road:false,tools:true,farm:true,seasonal:true,cat:'Farms',lvl:2,up:true,out:'3 vegetables per worker a day (summer)',desc:'Cabbages, turnips and onions. Without hoes (tools) it yields almost nothing.'},
  salt:{name:'Salt Works',w:2,h:2,cost:{wood:25,planks:10},slots:2,need:{k:'sea',r:2},cat:'Food',lvl:2,up:true,out:'1 wood → 2 salt per worker a day',desc:'Boils sea water in iron pans. Salt makes pickles and sausages.'},
  smoke:{name:'Smokehouse',w:2,h:2,cost:{wood:20,planks:15},slots:2,cat:'Food',lvl:2,up:true,out:'Smoked fish and meat; sausages with salt',desc:'2 meat or fish + ½ wood → 1 smoked (2 meals). 2 meat + 1 salt → 1 sausage (3 meals).'},
  altar:{name:'Altar',w:2,h:2,cost:{wood:20,planks:20,iron:5},slots:0,road:false,cat:'Village',lvl:2,desc:'Make offerings to Odin, Thor, Freyja, Njord and Loki. Favoured gods give gifts and blessings.'},
  train:{name:'Training Ground',w:3,h:3,cost:{wood:40,planks:30},slots:0,cat:'War',lvl:2,up:true,desc:'Turns villagers into warriors in batches. Each recruit needs weapons. Warriors stop working in summer and eat 1½ meals.'},
  arsenal:{name:'Arsenal',w:3,h:2,cost:{wood:30,planks:30,iron:10},slots:0,road:false,store:{arms:60},cat:'War',lvl:2,up:true,desc:'Stores weapons. Holds 60 more.'},
  /* ---- Town Hall level 3 ---- */
  grain:{name:'Grain Field',w:3,h:3,cost:{wood:20},slots:2,road:false,tools:true,farm:true,seasonal:true,cat:'Farms',lvl:3,up:true,out:'4 barley per worker a day (summer)',desc:'Barley for bread. Needs tools.'},
  bakery:{name:'Bakery',w:2,h:2,cost:{wood:20,planks:25},slots:2,cat:'Food',lvl:3,up:true,out:'2 barley + ½ wood → 2 bread per worker',desc:'Flat bread from a clay oven. Bread keeps a while and feeds 1½.'},
  flax:{name:'Flax Field',w:3,h:3,cost:{wood:20},slots:2,road:false,tools:true,farm:true,seasonal:true,cat:'Farms',lvl:3,up:true,out:'4 flax per worker a day (summer)',desc:'Flax for rope.'},
  weaver:{name:'Weaver',w:2,h:2,cost:{wood:20,planks:25},slots:2,cat:'Resources',lvl:3,up:true,out:'2 wool → 1 sailcloth; 2 flax → 1 rope',desc:'Weaves wool into sailcloth and twists flax into rope for ships.'},
  hunter:{name:'Hunter’s Lodge',w:2,h:2,cost:{wood:25,planks:10},slots:2,tools:true,need:{k:'tree',r:6},cat:'Food',lvl:3,up:true,out:'2 meat + ½ hide per worker a day',desc:'Hunts deer and boar in the forest.'},
  shipyard:{name:'Shipyard',water:true,w:4,h:3,cost:{wood:60,planks:60,iron:10},slots:4,need:{k:'sea',r:1},cat:'Sea',lvl:3,desc:'Builds ships on a slipway. Its slipway may run out over the water, but it needs a foothold on the shore. A ship takes many worker-days.'},
  harbour:{name:'Harbour',water:true,w:3,h:3,cost:{wood:40,planks:50},slots:0,road:false,need:{k:'sea',r:1},cat:'Sea',lvl:3,desc:'Pier where ships moor and merchants land.'},
  thrall:{name:'Thrall Pen',w:3,h:2,cost:{wood:40,planks:20,iron:5},slots:0,road:false,cat:'Housing',lvl:3,up:true,desc:'Holds 8 thralls (+4 per upgrade). Thralls work without pay, eat half a meal and may try to flee.'},
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
const LIMITS={th:[1,1,1],house:[6,10,14],jarl:[1,1,1],pyre:[1,1,2],wood:[2,3,4],carp:[1,2,2],mine:[1,2,2],smith:[1,1,2],water:[2,3,3],fish:[2,2,2],berry:[2,2,3],pres:[1,1,2],gran:[1,2,2],ware:[1,2,2],market:[1,1,1],
  pen:[0,1,2],hay:[0,2,3],garden:[0,2,3],salt:[0,1,1],smoke:[0,1,2],altar:[0,1,1],train:[0,1,1],arsenal:[0,1,1],grain:[0,0,3],bakery:[0,0,1],flax:[0,0,2],weaver:[0,0,1],hunter:[0,0,2],shipyard:[0,0,1],harbour:[0,0,1],trade:[0,0,1],thrall:[0,0,1],camp:[4,6,8],bench:[6,8,10],wattle:[20,30,40],rune:[0,4,6],herbs:[0,4,6],prow:[0,0,3],nets:[0,0,4]};
const thLevel=()=>S.th||1;
const limitOf=k=>(LIMITS[k]||[1,1,1])[thLevel()-1];
const FIRST_FREE=['berry','wood','water'];
const costOf=k=>FIRST_FREE.includes(k)&&!B.some(b=>b.t===k)?{}:DEF[k].cost;
const CATS=['Housing','Resources','Food','Farms','Storage','Village','War','Sea','Decor'];
const BUILDABLE=new Set([T.GRASS,T.BEACH,T.FOOT]);
const isAvail=k=>{const D=DEF[k];if(D.lvl>1||D.cat==='Decor')return thLevel()>=D.lvl;return S.avail.includes(k);};
const TH_UP={2:{cost:{wood:90,planks:60,iron:16},pop:22,fame:150,bld:[['gran',1]],ms:['winter']},
             3:{cost:{wood:150,planks:120,iron:42,tools:8},pop:32,fame:450,bld:[['ware',2]],ms:['herd','warriors','smoke']}};
const slotsOf=b=>(DEF[b.t].slots||0)+(DEF[b.t].slots&&!DEF[b.t].wonder&&!FIELDS.has(b.t)&&b.lvl>=3?1:0);
const upCost=b=>{const c=DEF[b.t].cost,o={};Object.keys(c).forEach(k=>o[k]=Math.round(c[k]*(b.lvl)*1.0));if(!Object.keys(o).length)o.wood=20*b.lvl;return o;};
const canUpgrade=b=>DEF[b.t].up&&b.lvl<thLevel();

/* ---- Town Hall levels 4 and 5 ---- */
Object.assign(DEF,{
  brewery:{name:'Brewery',w:2,h:2,cost:{wood:30,planks:30,iron:5},slots:2,cat:'Food',lvl:4,up:true,out:'2 barley + ½ wood → 2 ale; 2 honey → 1 mead',desc:'Brews ale from barley and mead from honey. Banquets need it, and merchants pay well for mead.'},
  hives:{name:'Beehives',w:2,h:2,cost:{wood:20,planks:10},slots:1,road:false,seasonal:true,farm:true,cat:'Farms',lvl:4,up:true,out:'3 honey per keeper a day (summer)',desc:'Straw skeps on a sunny slope. Honey for mead, offerings to Freyja and trade.'},
  tomb:{name:'Ragnar’s Ship-Tomb',w:4,h:4,cost:{planks:150,iron:40},slots:5,cat:'Village',lvl:4,wonder:true,out:'A wonder: up to 5 builders raise it, year after year',desc:'A great mound over a sacrificed ship, for Ragnar Lothbrok. To begin: 40 gold, 6 swords and one of your ships. When finished, Odin’s favour never falls below 30 and Kaldstrand gains 1 fame every day.'},
  tailor:{name:'Tailor',w:2,h:2,cost:{wood:20,planks:30},slots:2,cat:'Resources',lvl:5,up:true,out:'2 wool + 1 hide → 1 warm clothing',desc:'Sews wool cloaks and fur-lined boots. With enough warm clothing for everyone, winter sickness is halved and spirits rise.'},
  hof:{name:'Hof',w:4,h:3,cost:{wood:80,planks:80,iron:20,silver:50},slots:1,cat:'Village',lvl:5,desc:'A temple hall kept by a gothi. Favour rises 25% faster, the gothi tends the least-honoured god, and blessings cost 20 favour instead of 30.'},
  tower:{name:'Watchtower',w:2,h:2,cost:{wood:40,planks:30},slots:0,road:false,cat:'War',lvl:5,desc:'A timber tower for two archers. Adds to the village’s defence, more if it stands by the palisade.'}
});
for(const k in LIMITS){const a=LIMITS[k];while(a.length<5)a.push(a[a.length-1]);}
Object.assign(LIMITS,{house:[6,10,14,18,22],wood:[2,3,4,4,5],mine:[1,2,2,2,3],carp:[1,2,2,3,3],smith:[1,1,2,2,3],water:[2,3,3,4,4],berry:[2,2,3,3,3],pres:[1,1,2,2,2],gran:[1,2,2,3,3],ware:[1,2,2,3,3],
  pen:[0,1,2,2,3],hay:[0,2,3,3,4],garden:[0,2,3,4,4],smoke:[0,1,2,2,2],grain:[0,0,3,4,5],flax:[0,0,2,3,3],hunter:[0,0,2,2,3],salt:[0,1,1,2,2],
  brewery:[0,0,0,1,2],hives:[0,0,0,3,4],tomb:[0,0,0,1,1],tailor:[0,0,0,0,1],hof:[0,0,0,0,1],tower:[0,0,0,0,2],camp:[4,6,8,10,12],bench:[6,8,10,12,14],rune:[0,4,6,8,10],herbs:[0,4,6,8,10],prow:[0,0,3,4,6],nets:[0,0,4,5,6]});
/* Beta 0.6: limits tuned so a full village always has 4–8 more workers than jobs, with every warrior place filled */
Object.assign(LIMITS,{house:[11,15,22,25,27],wood:[2,3,3,3,4],carp:[1,2,2,2,2],mine:[1,1,2,2,2],smith:[1,1,1,2,2],water:[2,2,3,3,3],berry:[2,2,2,2,2],pres:[1,1,1,1,2],pen:[0,1,1,2,2],hay:[0,1,1,2,3],garden:[0,2,2,3,3],salt:[0,1,1,1,1],smoke:[0,1,1,1,2],grain:[0,0,2,2,3],flax:[0,0,1,2,2],hunter:[0,0,1,2,2],brewery:[0,0,0,1,1],hives:[0,0,0,2,3]});
TH_UP[4]={cost:{wood:260,planks:220,iron:80,tools:15,silver:100},pop:48,fame:950,bld:[['gran',3],['ware',3]],ms:['ship','raid','bread']};
TH_UP[5]={cost:{wood:380,planks:320,iron:140,tools:25,silver:250,gold:20},pop:80,fame:1700,bld:[['brewery',1],['house',4]],ms:['ale','vikings','snekkja','isles','tomb']};
