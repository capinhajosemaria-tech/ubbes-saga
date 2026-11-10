/* =================== modal =================== */
let modalOpen=null,speedBefore=1,titleOn=false;
function setSpeed(v){speed=v;document.querySelectorAll('.seg button').forEach(o=>o.setAttribute('aria-pressed',String(parseFloat(o.dataset.speed)===v)));}
function modalSpec(m){
  if(!m)return null;
  if(m.k==='evt')return evtOpts(m);
  if(m.k==='raid')return raidOpts(m);
  if(m.k==='fest'){const F=FESTS[m.f],c=F.cost();const ok=foodUnits()>=c.meals&&(!c.wood||S.res.wood>=c.wood);
    return {title:F.n,text:F.t,opts:[{l:'Hold the '+F.n+' ('+c.meals+' meals'+(c.wood?', '+c.wood+' wood':'')+')',dis:!ok,f:()=>{spendMeals(c.meals);if(c.wood)S.res.wood-=c.wood;F.fx();S.feast={until:S.gameT+DAY*1.5};return 'The '+F.n+' was held. Spirits rise and the gods take note.';}},{l:'Skip it this year',f:()=>{addMod('nofest','No '+F.n+' this year',-3,10);return '';}}]};}
  if(m.k==='funeral'){const h=PB(m.heir);if(m.cause==='deposed')return {title:'A New Jarl',portrait:h,text:pname(h)+' takes the high seat. The old Jarl lives on, a man without a hall.',opts:[{l:'So be it',f:()=>''}]};
    return {title:'The Jarl Is Dead',portrait:h,text:'The old Jarl is dead. '+pname(h)+' takes the high seat of Kaldstrand. How shall the Jarl be sent to the gods?',opts:[
      {l:'Burn him in a ship (40 wood, 20 planks)',dis:S.res.wood<40||S.res.planks<20,f:()=>{S.res.wood-=40;S.res.planks-=20;addMod('funeral','A ship-burial for the Jarl',10,30);addFavor('odin',10);addFame(10);return 'The burning ship drifted out into the bay.';}},
      {l:'Burn him on the pyre (20 wood)',dis:S.res.wood<20,f:()=>{S.res.wood-=20;addMod('funeral','The Jarl’s pyre',4,20);addFavor('odin',4);return 'The pyre burned all night.';}},
      {l:'Bury him in a mound',f:()=>{S.contam=Math.max(S.contam,10);return 'A mound was raised above the shore.';}}]};}
  if(m.k==='info')return {title:m.title,text:m.text,opts:[{l:'So be it',f:()=>''}]};
  if(m.k==='report')return {title:m.title,text:m.text,table:[['Brought home',m.got.length?m.got.join(', '):'nothing'],['Dead',m.dead.length?m.dead.join(', '):'none'],['Wounded',String(m.wounded||0)]],opts:[{l:'To the hall',f:()=>''}]};
  if(m.k==='year')return {title:'The Year '+(864+m.y)+' Ends',text:'Year '+m.y+' of Kaldstrand is over. The skald adds it to the saga.',table:[['The skalds’ song of the year','+'+(m.yf||0)+' fame'],['Born',m.s.births],['Died',m.s.deaths],['Came to live here',m.s.arrived],['Left',m.s.left],['Raids',m.s.raids],['Silver won',m.s.silver],['Fame earned',Math.round(m.s.fame)],['People now',m.pop]],opts:[{l:'Onward',f:()=>''}]};
  if(m.k==='over')return {title:'The Saga Ends',text:m.text,opts:[{l:'Begin a new saga',f:()=>{setTimeout(()=>showTitle('home'),50);return '';}}]};
  return null;}
function applyModal(i,v){const m=S.modal[0];if(!m)return '';const sp=modalSpec(m);S.modal.shift();if(!sp)return '';const o=sp.opts[i]||sp.opts[0];if(o.dis)return '';const res=o.f(v)||'';syncPop();assignWorkers();checkMilestones();return res;}
function modalTick(){if(titleOn||!S||!S.modal||!S.modal.length)return;if(modalOpen)return;const m=S.modal[0];const sp=modalSpec(m);if(!sp){S.modal.shift();return;}
  modalOpen=m;if(speed>0)speedBefore=speed;setSpeed(0);
  let h='<div class="mhd">'+esc(sp.title)+'</div>';
  if(sp.portrait)h+='<div class="mport">'+portrait(sp.portrait,88)+'</div>';
  h+='<p class="mtext">'+esc(sp.text)+'</p>';
  if(sp.table)h+='<table class="t">'+sp.table.map(r=>'<tr><td>'+esc(r[0])+'</td><td>'+esc(String(r[1]))+'</td></tr>').join('')+'</table>';
  if(sp.slider){const sl=sp.slider;h+='<label class="meta" for="m-sl">Prisoners to take: <strong id="m-slv">0</strong> of '+sl.max+' · plunder carried: <strong id="m-slp">'+Math.round(Math.min(100,100*sl.cap/Math.max(1,sl.lu)))+'%</strong></label><input type="range" id="m-sl" min="0" max="'+sl.max+'" value="0" step="1">';}
  h+='<div class="mopts">'+sp.opts.map((o,i)=>'<button type="button" class="btn'+(i===0?' primary':'')+'" data-mo="'+i+'"'+(o.dis?' disabled':'')+'>'+esc(o.l)+'</button>').join('')+'</div>';
  $('modal-card').innerHTML=h;$('modal').hidden=false;
  if(sp.slider){const sl=sp.slider,inp=$('m-sl');inp.oninput=()=>{const v=+inp.value;$('m-slv').textContent=v;$('m-slp').textContent=Math.round(Math.min(100,100*Math.max(0,sl.cap-v*4)/Math.max(1,sl.lu)))+'%';};}
  $('modal-card').querySelectorAll('[data-mo]').forEach(b=>b.onclick=()=>{const v=sp.slider?+$('m-sl').value:0;const res=applyModal(+b.dataset.mo,v);$('modal').hidden=true;modalOpen=null;if(res)toast(res,3600);if(!S.modal.length&&!titleOn)setSpeed(speedBefore||1);save();});
  setTimeout(()=>{const f=$('modal-card').querySelector('button:not([disabled])');if(f)f.focus();},30);}
