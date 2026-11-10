/* =================== saga milestones =================== */
const MS=[
  {id:'settle',lv:1,title:'Settle the shore',goal:'Build a berry gatherer, a water carrier and a woodcutter’s lodge (the first of each is free)',fame:20,unlock:['carp','pyre'],test:()=>has('berry')&&has('water')&&has('wood'),saga:'Ubbe sent the women to the berry slopes, men to the river with buckets, and axes into the grove.'},
  {id:'planks',lv:1,title:'Timber and planks',goal:'Build a carpenter and store 40 planks',fame:20,unlock:['mine','ware'],test:()=>has('carp')&&S.res.planks>=40,saga:'Planks were sawn for better halls.'},
  {id:'iron',lv:1,title:'Iron from the hills',goal:'Build an iron mine and store 20 iron',fame:20,unlock:['smith','gran'],test:()=>has('mine')&&S.res.iron>=20,saga:'Ore was dug below the mountain.'},
  {id:'tools',lv:1,title:'The first tools',goal:'Build a smithy and stock 12 tools',fame:30,unlock:['pres'],test:()=>has('smith')&&S.res.tools>=12,saga:'The first tools came hot from the anvil.'},
  {id:'winter',lv:1,title:'Ready for winter',goal:'Build a preserver, a granary and a warehouse, and store 35 preserved food',fame:30,unlock:['market','jarl'],test:()=>has('pres')&&has('gran')&&has('ware')&&S.res.dfish+S.res.jam+S.res.pickles>=35,saga:'Fish hung to dry and the storehouses filled before the dark months.'},
  {id:'roof',lv:1,title:'A roof for every family',goal:'Have 4 houses',fame:20,unlock:[],test:()=>count('house')>=4,saga:'New houses rose along the shore of Kaldstrand.'},
  {id:'firstwinter',lv:1,title:'The first winter',goal:'Survive the first winter',fame:50,unlock:[],test:()=>Math.floor(S.gameT/YEAR)>=1,saga:'The first winter passed. Kaldstrand still stood when the ice broke.'},
  {id:'market',lv:1,title:'A gathering place',goal:'Build the market square',fame:30,unlock:[],test:()=>has('market'),saga:'Traders and neighbours met in the new square.'},
  {id:'twenty',lv:1,title:'A growing village',goal:'Reach 20 people',fame:30,unlock:[],test:()=>S.pop>=20,saga:'Twenty souls now called Kaldstrand home.'},
  {id:'th2',lv:1,title:'A greater hall',goal:'Raise the Town Hall to level 2 (tap the Town Hall)',fame:80,unlock:[],test:()=>thLevel()>=2,saga:'The Langhús was lengthened and its gables carved anew. Kaldstrand was a village no more.'},
  {id:'herd',lv:2,title:'Pigs and sheep',goal:'Build an animal pen and grow the herd to 10',fame:30,unlock:[],test:()=>has('pen')&&herdTotal()>=10,saga:'The pigs rooted in the pen and the sheep grew thick wool.'},
  {id:'fields',lv:2,title:'Tilled earth',goal:'Build a vegetable garden and a hay meadow',fame:20,unlock:[],test:()=>has('garden')&&has('hay'),saga:'Turnips and cabbages grew behind the houses, and hay was cut for the winter.'},
  {id:'smoke',lv:2,title:'Salt and smoke',goal:'Build salt works and a smokehouse, and store 20 smoked food or sausages',fame:30,unlock:[],test:()=>has('salt')&&has('smoke')&&S.res.smoked+S.res.sausage>=20,saga:'Salt was boiled from the sea and sausages hung in the smoke.'},
  {id:'gods',lv:2,title:'Honour the gods',goal:'Build an altar and make an offering',fame:30,unlock:[],test:()=>has('altar')&&(S.offers||0)>=1,saga:'Ubbe gave to the gods, and the gods answered.'},
  {id:'warriors',lv:2,title:'The first warriors',goal:'Train 5 warriors at the training ground',fame:40,unlock:[],test:()=>S.warriors>=5,saga:'Five spearmen swore their oath to Ubbe in the training yard.'},
  {id:'th3',lv:2,title:'Hall of the sea-kings',goal:'Raise the Town Hall to level 3',fame:100,unlock:[],test:()=>thLevel()>=3,saga:'The hall was raised a third time. Ubbe now looked to the sea.'},
  {id:'bread',lv:3,title:'Bread on the table',goal:'Build a grain field and a bakery',fame:30,unlock:[],test:()=>has('grain')&&has('bakery'),saga:'Barley bread came warm from the oven.'},
  {id:'sails',lv:3,title:'Sailcloth and rope',goal:'Store 10 sailcloth and 10 rope',fame:30,unlock:[],test:()=>S.res.cloth>=10&&S.res.rope>=10,saga:'The looms clattered, and the first sail was striped red.'},
  {id:'keel',lv:3,title:'Lay a keel',goal:'Build a shipyard and a harbour',fame:30,unlock:[],test:()=>has('shipyard')&&has('harbour'),saga:'A keel of oak was laid on the slipway.'},
  {id:'ship',lv:3,title:'The first ship',goal:'Launch a ship from the shipyard',fame:60,unlock:[],test:()=>S.ships.length>=1,saga:'The first ship of Kaldstrand slid into the bay.'},
  {id:'trade',lv:3,title:'Merchants at the pier',goal:'Trade with a visiting merchant',fame:30,unlock:[],test:()=>(S.trades||0)>=1,saga:'Foreign merchants tied up at the pier and silver changed hands.'},
  {id:'raid',lv:3,title:'The first raid',goal:'Bring a ship home from a raid with plunder or tribute',fame:60,unlock:[],test:()=>(S.raidsDone||0)>=1,saga:'The first raiders of Kaldstrand came home with their ships riding low.'},
  {id:'forty',lv:3,title:'A proper town',goal:'Reach 40 people',fame:30,unlock:[],test:()=>S.pop>=40,saga:'Forty souls now lived in Kaldstrand.'}
];
const START_AVAIL=['house','fish','berry','water','wood'];
const SHIP_NAMES=['Sea-Raven','Wave-Biter','Storm-Ox','Grey Goose','Long Serpent','Iron Swan','Foam-Wolf','Elk of the Waves'];
const SHIPS={karvi:{name:'Karvi',work:110,cost:{planks:80,iron:20,cloth:10,rope:10},desc:'Warship. Carries 15 men and 120 loads of plunder.'},knarr:{name:'Knarr',work:140,cost:{planks:100,iron:15,cloth:15,rope:15},desc:'Cargo ship. 8 men, 250 loads. Poor in battle.'}};
const BLESS_OLD={freyja:{name:'Freyja’s harvest',cost:{veg:20,berries:10},meals:40,text:'+25% from farms, gatherers and the pen',hits:['hay','garden','grain','flax','berry','pen']},
             njord:{name:'Njord’s catch',cost:{fish:20},meals:40,text:'+25% from fishers, salt works and hunters',hits:['fish','salt','hunter']},
             odin:{name:'Odin’s wisdom',cost:{planks:20,iron:10},text:'+25% from all crafts',hits:['carp','smith','pres','smoke','bakery','weaver']}};
const PRICES={sell:{planks:2,salt:1,wool:2,cloth:6,rope:5,hides:3,smoked:3,sausage:4,jam:2,dfish:2,iron:3,tools:6,bread:1,misc:1},buy:{tools:9,salt:2,iron:5,pig:6,sheep:8,shields:12,bows:10,arrows:8,swords:30,thrall:25}};
const shipCost=k=>{const c=SHIPS[k].cost,o={};for(const x in c)o[x]=Math.round(c[x]*(hasAdv('floki')?0.8:1));return o;};

MS.splice(MS.findIndex(m=>m.id==='forty')+1,0,
  {id:'th4',lv:3,title:'The hall of plunder',goal:'Raise the Town Hall to level 4',fame:120,unlock:[],test:()=>thLevel()>=4,saga:'The hall was raised a fourth time, its roof hung with the shields of beaten men.'},
  {id:'ale',lv:4,title:'Ale and mead',goal:'Build a brewery and store 20 ale or mead',fame:40,unlock:[],test:()=>has('brewery')&&S.res.ale+S.res.mead>=20,saga:'The first ale was brewed in Kaldstrand, and the first fight over it followed.'},
  {id:'honey',lv:4,title:'The bees of Freyja',goal:'Keep beehives and store 20 honey',fame:30,unlock:[],test:()=>has('hives')&&S.res.honey>=20,saga:'Straw skeps hummed on the slope above the houses.'},
  {id:'vikings',lv:4,title:'True vikings',goal:'Train 5 Vikings',fame:50,unlock:[],test:()=>S.people.filter(p=>p.w==='viking').length>=5,saga:'Five men with broad axes swore to follow Ubbe’s line across the sea.'},
  {id:'snekkja',lv:4,title:'The swift serpent',goal:'Launch a snekkja',fame:60,unlock:[],test:()=>S.ships.some(s=>s.type==='snekkja'),saga:'A snekkja, long and narrow, slid into the bay. Nothing on the sea could catch her.'},
  {id:'isles',lv:4,title:'The Northern Isles',goal:'Raid or take tribute from Orkney, Shetland or the Hebrides',fame:60,unlock:[],test:()=>['ork','shet','heb'].some(id=>((S.tg[id]||{}).beaten||0)+((S.tg[id]||{}).trib||0)>0),saga:'The isles of the west paid in silver and sheep.'},
  {id:'tomb',lv:4,title:'A tomb for Ragnar',goal:'Lay the keel of Ragnar’s ship-tomb',fame:60,unlock:[],test:()=>B.some(b=>b.t==='tomb'&&b.proj),saga:'A ship was dragged up from the shore to become Ragnar’s grave.'},
  {id:'sixty',lv:4,title:'A small town',goal:'Reach 60 people',fame:40,unlock:[],test:()=>S.pop>=60,saga:'Sixty souls lived in Kaldstrand.'},
  {id:'th5',lv:4,title:'A hall of fame',goal:'Raise the Town Hall to level 5',fame:150,unlock:[],test:()=>thLevel()>=5,saga:'The hall was raised a fifth time. Skalds from far halls came to sing of it.'},
  {id:'warm',lv:5,title:'Warm cloaks',goal:'Build a tailor and store 20 warm clothing',fame:40,unlock:[],test:()=>has('tailor')&&S.res.clothes>=20,saga:'Wool cloaks and fur boots kept the winter out.'},
  {id:'hof',lv:5,title:'A temple',goal:'Build a hof',fame:60,unlock:[],test:()=>has('hof'),saga:'A hof was raised for the gods, and a gothi lit its fires.'},
  {id:'walls',lv:5,title:'Behind the stakes',goal:'Close a palisade around the village, with a gate',fame:60,unlock:[],test:()=>!!S.wallClosed,saga:'A palisade closed around Kaldstrand. The watchmen slept a little easier.'},
  {id:'england',lv:5,title:'The road to England',goal:'Buy the map of England from a traveller',fame:40,unlock:[],test:()=>!!(S.maps&&S.maps.england),saga:'A traveller sold Ubbe a map of England, drawn on calfskin.'},
  {id:'monastery',lv:5,title:'The holy island',goal:'Raid an English monastery',fame:80,unlock:[],test:()=>['lind','iona'].some(id=>((S.tg[id]||{}).beaten||0)>0),saga:'Kaldstrand’s ships came home heavy with church gold.'},
  {id:'berserk',lv:5,title:'Bear-shirts',goal:'Train 5 Berserkers',fame:60,unlock:[],test:()=>S.people.filter(p=>p.w==='berserk').length>=5,saga:'Five berserkers howled in the training yard. Even the dogs kept away.'},
  {id:'hundred',lv:5,title:'A hundred hearths',goal:'Reach 100 people',fame:60,unlock:[],test:()=>S.pop>=100,saga:'A hundred people now lived in Kaldstrand.'});
SHIPS.snekkja={name:'Snekkja',work:170,cost:{planks:140,iron:30,cloth:20,rope:20},desc:'Long and fast warship. 25 men, 160 loads. Voyages take a third less time.',lv:4};
const SHIP_CAP_WAR=[0,0,1,2,3];
