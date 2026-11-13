/* =================== what each building does and needs (build tray, sheets) =================== */
const ROLE={house:'Beds for 4 people, 5 after an upgrade',jarl:'Home of Ubbe and his heirs',pyre:'Where the dead are burned',
  wood:'Fells trees for wood',carp:'Saws wood into planks',mine:'Digs iron from the mountain foot',
  smith:'Forges tools, later weapons',weaver:'Sailcloth and rope for ships',tailor:'Warm clothing against winter sickness',
  fish:'Catches fish for food',berry:'Picks berries for food, not in winter',pres:'Preserved food never spoils',
  smoke:'Smoked meat and fish',mill:'Grinds grain into flour, on the river',bakery:'Bakes bread from flour, all year',brewery:'Brews ale and mead',tavern:'Ale and mead raise morale',
  pigpen:'Pigs: meat and hides',sheeppen:'Sheep: wool',fodder:'Fodder for the animals in winter',grain:'Grows grain for flour and ale',flax:'Grows flax for rope',hives:'Honey for mead and offerings',
  gran:'Stores more food',ware:'Stores more goods',arsenal:'Stores more weapons',
  market:'Draws newcomers to the village',altar:'Offerings to the Gods for blessings',hof:'Temple: the Gods favour you faster',tomb:'A great mound for Ragnar Lothbrok',
  train:'Turns villagers into warriors',tower:'Two archers defend the village',
  shipyard:'Builds ships',harbour:'Moors ships; merchants land here',trade:'Trade with merchants in summer',
  thrall:'Houses thralls, unpaid workers'};
function roleOf(k){const D=DEF[k];if(ROLE[k])return ROLE[k];if(D.deco)return 'Decoration: +'+D.deco+' attractiveness';return (D.desc||'').split('. ')[0];}
const NEED_TXT={tree:r=>['trees within '+r+' tiles','trees nearby'],iron:r=>['iron ore within '+r+' tiles (mountain foot)','iron ore nearby'],bush:r=>['berry bushes within '+r+' tiles','bushes nearby'],
  water:r=>['sea or river within '+r+' tiles','water nearby'],waterd:r=>['sea or river within '+r+' tiles for a full catch','water nearby'],sea:r=>r<=1?['a spot on the shore','the shore']:['the sea within '+r+' tiles','the sea']};
function needsList(k,short){const D=DEF[k],a=[];if(!D)return a;
  if(D.slots)a.push(D.slots+(short?' workers':' worker'+(D.slots>1?'s':'')));
  if(D.need&&NEED_TXT[D.need.k])a.push(NEED_TXT[D.need.k](D.need.r)[short?1:0]);
  if(D.tools)a.push(short?'tools':'tools (much slower without)');
  if(k==='trade')a.push('a harbour');
  if(!short&&D.slots&&D.road!==false)a.push('a road to the Town Hall');
  return a;}
function needsOf(k){return needsList(k,false);}
function needsShort(k){return needsList(k,true).filter(x=>!/workers$/.test(x)).join(', ');}
