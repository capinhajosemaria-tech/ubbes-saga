/* =================== guide: illustrated tutorial at the start of a new saga (1J, Beta 0.20) ===================
   S.guide: step index while the guide runs, -1 when finished or closed, undefined in old saves and test villages.
   Each step has a picture strip, a short text, an optional task list that ticks itself, a button that starts
   the placement or opens the right panel, and an optional UI element that pulses (hl). */
const gThumb=t=>'<img class="gth" alt="" src="'+buildThumb(t,1)+'">';
const gTick=ok=>'<i class="gck'+(ok?' ok':'')+'">'+(ok?'<svg viewBox="0 0 12 12"><path d="M2.5 6.5 L5 9 L9.5 3.5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>':'')+'</i>';
function gSeasons(){const yt=S.gameT%YEAR,d=Math.min(44,Math.floor(yt/DAY));let h='<svg class="gseas" viewBox="0 0 270 54" aria-hidden="true">';
  for(let k=0;k<45;k++){const x=4+k*5.9,w=k<30;h+='<rect x="'+x.toFixed(1)+'" y="'+(w?16:14)+'" width="4.9" height="'+(w?18:22)+'" rx="1.2" fill="'+(w?(k<d?'#A9B86A':'#C9D48C'):(k<d?'#7FA0B4':'#B9D0DC'))+'"/>';}
  const mx=4+d*5.9+2.4;h+='<path d="M'+mx+' 10 l-4 -6 h8 z" fill="#A34A3A"/><text x="4" y="50" font-size="9" fill="#5E5446">30 days of summer</text><text x="266" y="50" font-size="9" fill="#5E7F8C" text-anchor="end">15 of winter</text>';
  h+='<g transform="translate(92 2)"><circle cx="6" cy="6" r="3.4" fill="#E2C05A"/></g><g transform="translate(206 0)" stroke="#7FA0B4" stroke-width="1.3"><path d="M6 1 V11 M1.5 3.5 L10.5 8.5 M1.5 8.5 L10.5 3.5"/></g></svg>';return h;}
function gPrio(){return '<div class="gprio">'+[['Stopped','#8A7C66'],['Low','#7E8C92'],['High','#5E7A4E'],['Urgent','#A34A3A']].map(p=>'<span style="--pc:'+p[1]+'">'+p[0]+'</span>').join('')+'</div>';}
function gFire(){return '<svg class="gpic" viewBox="0 0 120 64" aria-hidden="true"><path d="M30 58 V34 L54 18 L78 34 V58 Z" fill="#8E6F52" stroke="#5A4636" stroke-width="1.5"/><path d="M26 36 L54 15 L82 36" fill="none" stroke="#5A4636" stroke-width="3" stroke-linecap="round"/><rect x="48" y="42" width="12" height="16" fill="#3A2C22"/><path d="M66 22 V12 h6 v14" fill="#6E5440"/><path d="M69 10 q-4 -5 1 -9 q-1 4 3 5 q3 -5 6 0 q3 6 -4 8 z" fill="#E2A04A" opacity=".85"/><path d="M68 4 q6 -6 12 -2" fill="none" stroke="#B9B2A6" stroke-width="2" stroke-linecap="round" opacity=".7"/><g transform="translate(92 34)"><rect x="0" y="12" width="22" height="5" rx="1" fill="#8E6F52"/><rect x="2" y="6" width="22" height="5" rx="1" fill="#7A5D44"/><rect x="0" y="0" width="22" height="5" rx="1" fill="#8E6F52"/><ellipse cx="22" cy="2.5" rx="2" ry="2.5" fill="#D8B98A"/><ellipse cx="24" cy="8.5" rx="2" ry="2.5" fill="#D8B98A"/><ellipse cx="22" cy="14.5" rx="2" ry="2.5" fill="#D8B98A"/></g></svg>';}
function gProd(){const r=(n,a,b,c)=>'<g transform="translate(0 '+a+')"><text x="6" y="10" font-size="9" fill="#4E4436">'+n+'</text><rect x="58" y="3" width="'+b+'" height="7" rx="2" fill="#A9B86A"/><rect x="'+(60+b)+'" y="3" width="'+c+'" height="7" rx="2" fill="#C98A6A"/></g>';
  return '<svg class="gpic" viewBox="0 0 160 64" aria-hidden="true"><rect x="1" y="1" width="158" height="62" rx="5" fill="#FBF8F1" stroke="#CDBFA6"/>'+r('Food',6,44,22)+r('Wood',22,52,30)+r('Planks',38,26,10)+'<path d="M128 46 h22" stroke="#C9A64A" stroke-width="2"/><text x="139" y="58" font-size="8" fill="#8A7C66" text-anchor="middle">reserve</text></svg>';}
function gGodPic(){return '<span class="gemb">'+(typeof EMB!=='undefined'?EMB[patron()]:'')+'</span>';}
const GUIDE=[
  {h:'Welcome to Kaldstrand',art:()=>gSeasons(),t:()=>'A year is <b>30 days of summer and 15 of winter</b>; a day lasts about 27 seconds at 1×. In summer your people gather and build. In winter gatherers and fields rest, fishing drops and every house burns wood: what you store in summer must carry you through.',next:true},
  {h:'Food and wood',art:()=>gThumb('berry')+gThumb('wood'),t:()=>'Open <b>Food</b> and <b>Materials</b> in the bar below. The first Berry Gatherer and Woodcutter’s Lodge are free. Sources run out: a tree gives <b>50 wood a year</b>, a bush <b>45 berries</b>. A lodge needs <b>20 trees</b> of its own, a gatherer <b>6 bushes</b>; the circle shows how many it gets while you place it. Felled trees grow back 3 days after winter.',
    tasks:[['Place a Berry Gatherer',()=>has('berry')],['Place a Woodcutter’s Lodge',()=>has('wood')]],go:()=>placeType(has('berry')?'wood':'berry'),btn:()=>'Place '+DEF[has('berry')?'wood':'berry'].name,hl:()=>has('berry')?'#dock [data-dc="Materials"]':'#dock [data-dc="Food"]'},
  {h:'Building takes time',art:()=>gThumb('th'),t:()=>'A new building rises in <b>½ to 3 days</b>. The builders are the Town Hall’s <b>builder posts</b> (3 at Town Hall 1, one more each level); they only take people while scaffolding stands. With no builders free, a plot waits its turn.',next:true},
  {h:'Workers and priority',art:()=>gPrio(),t:()=>'People take jobs by themselves. Click any building to see what it makes and needs, and set its <b>priority</b>: Urgent places fill first, then High, then Low; Stopped takes nobody. Idle people show in the <b>To do</b> list on the right.',next:true,hl:()=>'#todo'},
  {h:'Fish',art:()=>gThumb('fish'),t:()=>'The Fisher’s Hut is your steadiest food: <b>4 fish per worker a day</b>. It needs <b>5 water tiles</b> within 3 tiles; a sea tile holds 100 fish a year, a river tile 70. In winter it catches less, more at sea than on the river.',
    tasks:[['Place a Fisher’s Hut',()=>has('fish')]],go:()=>placeType('fish'),btn:()=>'Place a Fisher’s Hut',hl:()=>'#dock [data-dc="Food"]'},
  {h:'Planks',art:()=>gThumb('carp'),t:()=>'The Carpenter saws <b>4 wood into 2 planks</b> per worker a day. Storing <b>40 planks</b> opens the Granary, Warehouse, Iron Mine and Smithy.',
    tasks:[['Place a Carpenter',()=>has('carp')]],go:()=>placeType('carp'),btn:()=>'Place a Carpenter',hl:()=>'#dock [data-dc="Materials"]'},
  {h:'Food for the winter',art:()=>gThumb('pres')+gThumb('gran'),t:()=>'Fresh fish, berries and meat lose <b>3% a day</b>. The Preserver turns them into dried fish and jam that <b>never spoil and count as two meals</b>. A Granary stores more food.',
    tasks:[['Place a Preserver',()=>has('pres')],['Place a Granary',()=>has('gran')]],go:()=>placeType(has('pres')?'gran':'pres'),btn:()=>has('pres')?(isAvail('gran')?'Place a Granary':''):'Place a Preserver'},
  {h:'Firewood',art:()=>gFire(),t:()=>{const w=Math.ceil(fireNeed()*15);return 'Each house burns about <b>⅓ wood a day in summer</b> and <b>under 1 in winter</b>. Your village needs about <b>'+w+' wood</b> to get through this winter, on top of what you build with. If the logs run out, the fires burn planks.';},next:true},
  {h:'Production and reserves',art:()=>gProd(),t:()=>'<b>Production</b> in the bar below lists every good: in store, made and used a day, and how many <b>winter days</b> it lasts. With − / + you set a <b>reserve</b>: workshops never use a good below it. “Reserve for next Town Hall” keeps the wood, planks and iron the next level costs.',next:true,go:()=>{const b=$('dk-prod');if(b)b.click();},btn:()=>'Open Production',hl:()=>'#dk-prod'},
  {h:'Your patron God',art:()=>gGodPic(),t:()=>{const g=patron(),G=GODS[g],o=PATRON_OFF[g];return '<b>'+G.n+'</b>’s favour fades a little every day. Make an <b>offering</b> at the Town Hall ('+o.n+' '+o.t+') to keep it above 50 for his gift; at 80, ask his blessing at an Altar. Below 25 his wrath falls. A <b>Feast</b> in the hall lifts morale and favour, twice as much near a holy day.';},next:true},
  {h:'Tools and the Town Hall',art:()=>gThumb('mine')+gThumb('smith'),t:()=>'Work slows without tools: build an <b>Iron Mine</b> and a <b>Smithy</b>. To raise the Town Hall you need <b>people, its materials and one house at the highest level</b> your hall allows. Follow the saga goal at the top; click the Town Hall to see what is missing.',next:true,last:true,go:()=>{const b=B.find(o=>o.t==='th');if(b)buildingSheet(b);},btn:()=>'Show the Town Hall'}];
function gDone(g){return g.tasks?g.tasks.every(t=>t[1]()):(g.done?g.done():false);}
function guideStep(){if(typeof S.guide!=='number'||S.guide<0)return null;while(S.guide<GUIDE.length&&!GUIDE[S.guide].next&&gDone(GUIDE[S.guide]))S.guide++;if(S.guide>=GUIDE.length){S.guide=-1;return null;}return GUIDE[S.guide];}
function winterIn(){const yt=S.gameT%YEAR;return yt<SUMMER?Math.max(1,Math.ceil((SUMMER-yt)/DAY)):0;}
let guideKey='';
function guideHl(sel){document.querySelectorAll('.gpulse').forEach(e=>{if(!sel||!e.matches(sel))e.classList.remove('gpulse');});if(sel){const e=document.querySelector(sel);if(e)e.classList.add('gpulse');}}
function renderGuide(){let el=$('guide');
  const g=titleOn?null:guideStep();
  if(!g){if(el)el.hidden=true;guideHl(null);return;}
  if(!el){el=document.createElement('div');el.id='guide';el.className='guide';document.body.appendChild(el);}
  el.hidden=false;placeGuide();guideHl(g.hl?g.hl():null);
  const wi=winterIn(),body=g.t(),b=g.btn?g.btn():'',tk=g.tasks?g.tasks.map(t=>t[1]()?1:0).join(''):'';
  const key=S.guide+'|'+body+'|'+b+'|'+wi+'|'+tk+'|'+(S.guide===0?Math.floor((S.gameT%YEAR)/DAY):'');if(key===guideKey)return;guideKey=key;
  const dots=GUIDE.map((_,k)=>'<i class="'+(k<S.guide?'d':k===S.guide?'on':'')+'"></i>').join('');
  el.innerHTML='<div class="gh"><svg class="grune" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1 V15 M8 5 L13 1 M8 9 L13 5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg><b>Saga guide</b><span>'+(S.guide+1)+' / '+GUIDE.length+'</span><button type="button" class="gx" id="g-x" aria-label="Close the guide" title="Close the guide">×</button></div>'+
    '<div class="gdots">'+dots+'</div><div class="gart">'+g.art()+'</div>'+
    '<div class="gb"><strong>'+esc(g.h)+'</strong><p>'+body+'</p>'+
    (g.tasks?'<ul class="gtasks">'+g.tasks.map(t=>'<li class="'+(t[1]()?'ok':'')+'">'+gTick(t[1]())+esc(t[0])+'</li>').join('')+'</ul>':'')+
    '<p class="gw">'+(wi?'<span>❄</span> Winter comes in '+wi+' day'+(wi>1?'s':''):'<span>❄</span> It is winter now')+'</p>'+
    '<div class="ga">'+(S.guide>0?'<button type="button" class="btn" id="g-prev" aria-label="Previous step">‹</button>':'')+(b&&g.go?'<button type="button" class="btn'+(g.next?'':' primary')+'" id="g-go">'+esc(b)+'</button>':'')+(g.next?'<button type="button" class="btn primary" id="g-next">'+(g.last?'Done':'Next')+'</button>':'')+'</div></div>';
  if(renderGuide.st!==S.guide){renderGuide.st=S.guide;el.classList.remove('gin');void el.offsetWidth;el.classList.add('gin');}
  $('g-x').onclick=()=>{S.guide=-1;guideKey='';renderGuide();toast('Guide closed. You can open it again from the Saga panel.',3200);};
  if($('g-go'))$('g-go').onclick=()=>{if(mode!=='view')endMode();g.go();};
  if($('g-prev'))$('g-prev').onclick=()=>{S.guide=Math.max(0,S.guide-1);while(S.guide>0&&!GUIDE[S.guide].next&&gDone(GUIDE[S.guide]))S.guide--;guideKey='';renderGuide();};
  if($('g-next'))$('g-next').onclick=()=>{S.guide++;guideKey='';renderGuide();};}
/* PC: the guide sits on the left under the date bar, and steps aside when a sheet docks there */
function placeGuide(){const el=$('guide');if(!el)return;const sh=$('sheet');let x=16;if(isWide()&&sh&&!sh.hidden)x=16+(sh.classList.contains('wide')?660:420)+12;el.style.left=isWide()?x+'px':'';}
{const _o=openSheet,_c=closeSheet;openSheet=function(){const r=_o.apply(this,arguments);placeGuide();return r;};closeSheet=function(){const r=_c.apply(this,arguments);placeGuide();return r;};}
setInterval(()=>{try{renderGuide();}catch(e){}},700);
