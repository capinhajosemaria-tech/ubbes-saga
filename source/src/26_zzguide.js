/* =================== guide: short dynamic tutorial at the start of a new saga =================== */
/* S.guide: step index while the guide runs, -1 when finished or closed, undefined in old saves and test villages */
const GUIDE=[
  {h:'Welcome to Kaldstrand',t:()=>'A year has 30 days of summer and 15 of winter. In summer your people gather and build. In winter they live on what you stored, and every house burns wood to keep warm.',next:true},
  {h:'Food and wood',t:()=>'Pick a Berry Gatherer and a Woodcutter’s Lodge from the bar at the bottom (the first of each is free). Berries feed people in summer; wood builds everything and heats the houses. Trees and bushes never run out, but each one serves a single building: a lodge needs 90 trees of its own for full output, a gatherer 6 bushes. When placing, the circle shows how many it gets.',done:()=>has('berry')&&has('wood'),go:()=>placeType(has('berry')?'wood':'berry'),btn:()=>'Place '+DEF[has('berry')?'wood':'berry'].name},
  {h:'Workers',t:()=>'People take jobs on their own. Click a building to see what it makes and what it needs, and use − and + to choose how many work there. Idle people show up in the To do list. New buildings take 1 to 3 days to raise and borrow 1 to 3 workers while the scaffolding stands.',next:true},
  {h:'Fish',t:()=>'The Fisher’s Hut is your steadiest food: 4 fish per worker a day. It fishes the water within 3 tiles; the fish never run out, but it catches more at sea than on the river in winter.',done:()=>has('fish'),go:()=>placeType('fish'),btn:()=>'Place a Fisher’s Hut'},
  {h:'Planks',t:()=>'The Carpenter saws wood into planks. Storing 40 planks opens the Granary, Warehouse, Iron Mine and Smithy.',done:()=>has('carp'),go:()=>placeType('carp'),btn:()=>'Place a Carpenter'},
  {h:'Food for the winter',t:()=>'Fresh food loses 3% a day. The Preserver turns fish and berries into dried fish and jam that never spoil and feed twice as much. A Granary holds 300 more food.',done:()=>has('pres')&&has('gran'),go:()=>placeType(has('pres')?'gran':'pres'),btn:()=>has('pres')?(isAvail('gran')?'Place a Granary':''):'Place a Preserver'},
  {h:'Firewood',t:()=>{const w=Math.ceil(fireNeed()*15);return 'Each house burns about ⅓ wood a day in summer and under 1 in winter. Your village needs about '+w+' wood to get through this winter, on top of what you build with. Keep the woodcutters busy; if the logs run out, the fires burn planks.';},next:true},
  {h:'Tools and the Town Hall',t:()=>'Work slows down without tools: build an Iron Mine and a Smithy. Follow the goal at the top and the To do list on the right. To raise the Town Hall you need enough people, its cost in materials, and at least one house at the highest level your hall allows. Click the Town Hall to see what is missing.',next:true,last:true}];
function guideStep(){if(typeof S.guide!=='number'||S.guide<0)return null;while(S.guide<GUIDE.length&&GUIDE[S.guide].done&&GUIDE[S.guide].done())S.guide++;if(S.guide>=GUIDE.length){S.guide=-1;return null;}return GUIDE[S.guide];}
function winterIn(){const yt=S.gameT%YEAR;return yt<SUMMER?Math.max(1,Math.ceil((SUMMER-yt)/DAY)):0;}
let guideKey='';
function renderGuide(){const side=document.querySelector('.side');if(!side)return;let el=$('guide');
  const g=titleOn?null:guideStep();
  if(!g){if(el)el.hidden=true;return;}
  if(!el){el=document.createElement('div');el.id='guide';el.className='guide';side.insertBefore(el,side.firstChild);}
  el.hidden=false;
  const wi=winterIn(),body=g.t(),b=g.btn?g.btn():'';
  const key=S.guide+'|'+body+'|'+b+'|'+wi;if(key===guideKey)return;guideKey=key;
  el.innerHTML='<div class="gh"><b>Guide</b><span>'+(S.guide+1)+' / '+GUIDE.length+'</span><button type="button" class="gx" id="g-x" aria-label="Close the guide" title="Close the guide">×</button></div>'+
    '<div class="gb"><strong>'+esc(g.h)+'</strong><p>'+esc(body)+'</p>'+(wi?'<p class="gw">Winter comes in '+wi+' day'+(wi>1?'s':'')+'.</p>':'<p class="gw">It is winter now.</p>')+
    '<div class="ga">'+(b&&g.go?'<button type="button" class="btn primary" id="g-go">'+esc(b)+'</button>':'')+(g.next?'<button type="button" class="btn'+(g.go?'':' primary')+'" id="g-next">'+(g.last?'Done':'Next')+'</button>':'')+'</div></div>';
  $('g-x').onclick=()=>{S.guide=-1;guideKey='';renderGuide();toast('Guide closed. You can open it again from the Saga panel.',3200);};
  if($('g-go'))$('g-go').onclick=()=>{if(mode!=='view')endMode();g.go();};
  if($('g-next'))$('g-next').onclick=()=>{S.guide++;guideKey='';renderGuide();};}
setInterval(()=>{try{renderGuide();}catch(e){}},700);
