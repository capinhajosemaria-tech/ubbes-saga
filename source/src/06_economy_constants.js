/* =================== economy constants =================== */
/* 1 day ≈ 27 s at 1×. People eat 0.5 meals a day; warriors eat 1.5× */
const EAT=0.5,DRINK=0.25,FIRE_HOUSE=1,FIRE_TH=2,WAR_EAT=1.5;
/* ale and mead are not meals: they are drunk at feasts and in the tavern (goods, kept in the warehouse) */
const MEAL={fish:1,berries:1,meat:1,bread:1.5,dfish:2,jam:2,smoked:2};
const FRESH=['fish','berries','meat','bread'];
const FOOD=Object.keys(MEAL);
const MAT=['wood','planks','iron','tools','fodder','flour','wool','flax','grain','cloth','rope','hides','misc','honey','clothes','ale','mead'];
const ARMS=['spears','shields','bows','arrows','swords','axes','armour'];
const RNAME={fish:'Fresh fish',berries:'Berries',meat:'Meat',bread:'Bread',dfish:'Dried fish',jam:'Jam',smoked:'Smoked food',
  wood:'Wood',planks:'Planks',iron:'Iron',tools:'Tools',fodder:'Fodder',flour:'Flour',wool:'Wool',flax:'Flax',grain:'Grain',cloth:'Sailcloth',rope:'Rope',hides:'Hides',honey:'Honey',clothes:'Warm clothing',ale:'Ale',mead:'Mead',axes:'Axes',armour:'Armour',gold:'Gold',spears:'Spears',shields:'Shields',bows:'Bows',arrows:'Arrows',swords:'Swords',misc:'Odds and ends',water:'Water',silver:'Silver'};
const EMPTY_RES=()=>{const r={water:0,silver:0,gold:0};FOOD.concat(MAT,ARMS).forEach(k=>r[k]=0);return r;};
