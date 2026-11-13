/* =================== event choices: what you pay and what you get =================== */
/* per event: one [pay, get] pair per option, in the same order as EVTS[id].o. Items: [amount, resource] or plain text; a function gets the event args. */
const EVT_FX={
  storm:[[[[15,'planks']],['Roofs repaired']],[['Morale −6 for 15 days','2 people fall sick'],[]]],
  dry:[[[[10,'Freyja’s favour']],['Rain comes back']],[['Farms and gatherers bring in less for 15 days'],[]]],
  herring:[[[],[[60,'fish']]],[[],[]]],
  wolves:[[['A man may be hurt'],[[2,'hides'],'The herd is safe']],[['Lose 1 sheep and 1 pig'],[]]],
  bear:[[['A hunter may be hurt'],[[30,'meat'],[2,'hides']]],[['Woodcutters at half pace for 5 days'],[]]],
  aurora:[[[[10,'food']],['All Gods +5 favour']],[[],['Morale +3 for 10 days']]],
  twins:[[[],['2 children','Freyja +5 favour']]],
  holmgang:[[['One of them may die'],['Morale +3 if both live']],[[[20,'food']],['The quarrel ends']],[['Morale −4 for 15 days'],[[10,'silver']]]],
  feud:[[[[25,'food']],['The families make peace']],[['Morale −8 for 20 days'],[]]],
  prodigy:[[[],['The child gains Steady Hand']]],
  oldwarrior:[[[[1,'spears']],['+1 warrior','Odin +4 favour']],[[],[]]],
  monk:[[['Takes a free bed'],[[1,'people']]],[[],[]],[[],['+1 thrall','Odin +2 favour']]],
  peddler:[[[[30,'silver']],[[5,'tools']]],[[[40,'food']],[[5,'tools']]],[[],[]]],
  skald:[[[[20,'food']],[[15,'fame'],'Morale +4 for 15 days']],[[],[]]],
  refugees:[[[[30,'food']],[[3,'people']]],[['Morale −3 for 15 days'],[]]],
  messenger:[[[[20,'planks']],[[15,'silver'],[10,'fame']]],[['Hrolf will hold a grudge'],[[15,'silver']]]],
  wreck:[[[],[[30,'planks'],[10,'iron'],[5,'misc']]],[['Takes 2 free beds'],[[2,'people'],'Njord +4 favour']],[[],['+2 thralls']]],
  whale:[[[],[[60,'meat'],[8,'misc']]]],
  amber:[[[],[[10,'misc']]]],
  fever:[[['2 people fall sick'],[]],[[[10,'Freyja’s favour'],'1 person falls sick'],[]]],
  fire:[[['15% of the wood','A man may be burned'],[]],[['Half the wood'],[]]],
  thrallflee:[[[],[a=>'About '+Math.round(a.n*0.7)+' of '+a.n+' brought back']],[[a=>'Lose '+a.n+' thrall'+(a.n>1?'s':'')],[]]],
  rumours:[[[()=>[S.pop,'food']],['Morale +10 for 15 days']],[['Morale −4 for 20 days'],['The muttering stops']],[['The unrest goes on'],[]]],
  freedom:[[['−1 thrall'],[[10,'silver'],'+1 free man']],[['Morale −2 for 10 days'],[]]],
  curse:[[['The God’s anger falls on the village'],[]]]};
const FX_NAME={food:'meals',misc:'odds and ends',people:'people'};
function fxItems(list,a){return (list||[]).map(x=>typeof x==='function'?x(a):x).map(x=>Array.isArray(x)?{n:x[0],k:x[1]}:{t:x});}
/* labels keep only the action; the amounts move to the pay / get lines */
const fxLabel=l=>l.replace(/\s*\([^)]*\)\s*$/,'');
function fxHtml(pay,get){const one=(it,sign)=>{if(it.t)return '<span>'+esc(it.t)+'</span>';const ic=ICON[it.k]||'';return '<span>'+ic+'<b>'+sign+fmt(it.n)+'</b> '+esc(FX_NAME[it.k]||it.k)+'</span>';};
  let h='';if(pay&&pay.length)h+='<span class="fx pay"><i>You pay</i>'+pay.map(it=>one(it,'−')).join('')+'</span>';
  if(get&&get.length)h+='<span class="fx get"><i>You get</i>'+get.map(it=>one(it,'+')).join('')+'</span>';
  return h?'<span class="fxs">'+h+'</span>':'';}
