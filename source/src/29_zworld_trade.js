/* =================== world map (Bad North style), trade market, level 4–5 sheets =================== */
const WPOS={home:[236,96],hval:[244,50],sogn:[246,78],hord:[226,124],ringa:[272,112],skir:[264,152],jut:[248,212],hedeby:[252,248],birka:[338,150],
  shet:[160,62],ork:[136,98],heb:[92,126],lind:[160,184],iona:[86,150],york:[152,214],london:[178,272]};
const LANDS=[
  {r:'scand',p:'206,8 300,4 312,40 296,70 286,104 276,140 262,166 244,160 230,140 218,118 214,96 220,70 224,40'},
  {r:'scand',p:'300,4 398,0 398,190 360,200 336,176 318,150 296,120 290,90 312,40'},
  {r:'scand',p:'236,182 262,178 268,206 260,236 266,256 246,262 232,240 236,214'},
  {r:'scand',p:'276,232 296,226 302,240 284,246'},
  {r:'isles',p:'154,52 166,50 168,70 158,74'},{r:'isles',p:'128,92 144,90 146,104 130,106'},{r:'isles',p:'80,118 96,112 100,134 86,138'},
  {r:'england',p:'98,120 132,112 150,134 146,160 158,178 164,206 178,238 196,270 170,292 120,296 112,262 126,232 110,204 90,188 84,160 92,140'},
  {r:'england',p:'20,176 64,166 76,196 62,236 30,240 14,212'}];
function worldSVG(){const reg=r=>regionOpen(r);
  let o='<svg viewBox="0 0 400 300" width="100%" role="img" aria-label="Map of the north"><defs><linearGradient id="wsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34505C"/><stop offset="1" stop-color="#26404B"/></linearGradient>'
    +'<radialGradient id="wfog"><stop offset="0" stop-color="#E9ECEA" stop-opacity="0.92"/><stop offset="1" stop-color="#E9ECEA" stop-opacity="0"/></radialGradient></defs>';
  o+='<rect width="400" height="300" fill="url(#wsea)"/>';
  for(let k=0;k<26;k++){const x=(k*67)%400,y=(k*41)%300;o+='<path d="M'+x+' '+y+' q4 -3 8 0 t8 0" stroke="#4F6C78" stroke-width="1" fill="none" opacity="0.6"/>';}
  for(const L of LANDS){const pts=L.p.split(' ').map(q=>q.split(',').map(Number));const sh=pts.map(q=>q[0]+','+(q[1]+5)).join(' ');
    o+='<polygon points="'+sh+'" fill="#55604F"/><polygon points="'+L.p+'" fill="'+(reg(L.r)?'#B3BC9E':'#8E978A')+'" stroke="#E7E3D2" stroke-width="0.6" stroke-opacity="0.5"/>';
    const cx=pts.reduce((a,q)=>a+q[0],0)/pts.length,cy=pts.reduce((a,q)=>a+q[1],0)/pts.length;o+='<polygon points="'+pts.slice(0,Math.ceil(pts.length/2)).map(q=>((q[0]+cx)/2)+','+((q[1]+cy)/2)).join(' ')+' '+cx+','+cy+'" fill="#C6CDB2" opacity="0.55"/>';}
  [[262,40],[282,70],[300,30],[330,60],[268,100]].forEach(q=>{o+='<polygon points="'+(q[0]-9)+','+(q[1]+6)+' '+q[0]+','+(q[1]-10)+' '+(q[0]+9)+','+(q[1]+6)+'" fill="#8F9A90"/><polygon points="'+(q[0]-3)+','+(q[1]-5)+' '+q[0]+','+(q[1]-10)+' '+(q[0]+3)+','+(q[1]-5)+'" fill="#F1F0EA"/>';});
  const H=WPOS.home;
  for(const t of TARGETS){if(!reg(t.reg))continue;const p=WPOS[t.id];if(!p)continue;const mx=(H[0]+p[0])/2+(p[1]-H[1])*0.18,my=(H[1]+p[1])/2-(p[0]-H[0])*0.18;
    o+='<path d="M'+H[0]+' '+H[1]+' Q'+mx+' '+my+' '+p[0]+' '+p[1]+'" stroke="#E7E3D2" stroke-width="1" stroke-dasharray="3 3" fill="none" opacity="'+(worldSel===t.id?0.95:0.4)+'"/>';}
  for(const k in REGIONS){if(reg(k))continue;const c=k==='isles'?[120,92]:[130,220];o+='<ellipse cx="'+c[0]+'" cy="'+c[1]+'" rx="'+(k==='isles'?70:95)+'" ry="'+(k==='isles'?50:90)+'" fill="url(#wfog)"/><text x="'+c[0]+'" y="'+c[1]+'" text-anchor="middle" font-family="Marcellus SC, Georgia, serif" font-size="11" fill="#3D3129">'+esc(REGIONS[k].n)+'</text><text x="'+c[0]+'" y="'+(c[1]+13)+'" text-anchor="middle" font-family="Inter, sans-serif" font-size="8" fill="#3D3129">'+(k==='england'&&thLevel()>=5?'Buy the traveller’s map':'Town Hall '+REGIONS[k].lv)+'</text>';}
  for(const t of TARGETS){if(!reg(t.reg))continue;const p=WPOS[t.id];if(!p)continue;const st=S.tg[t.id]||{},sel=worldSel===t.id,col=t.walls?'#A34A3A':t.trade?'#C9A64A':'#F3EBD8';
    o+='<g data-tg="'+t.id+'" style="cursor:pointer"><circle cx="'+p[0]+'" cy="'+p[1]+'" r="12" fill="transparent"/>';
    if(/Monastery/.test(t.type))o+='<rect x="'+(p[0]-4)+'" y="'+(p[1]-6)+'" width="8" height="8" fill="'+col+'" stroke="#2F2620"/><path d="M'+p[0]+' '+(p[1]-12)+' v6 M'+(p[0]-2.5)+' '+(p[1]-9.5)+' h5" stroke="#2F2620" stroke-width="1.4"/>';
    else if(t.walls)o+='<path d="M'+(p[0]-6)+' '+(p[1]+3)+' v-8 h3 v3 h2 v-3 h2 v3 h2 v-3 h3 v8 z" fill="'+col+'" stroke="#2F2620"/>';
    else if(t.jarl)o+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5" fill="'+col+'" stroke="#2F2620" stroke-width="1.2"/><circle cx="'+p[0]+'" cy="'+p[1]+'" r="1.6" fill="#2F2620"/>';
    else o+='<path d="M'+(p[0]-5)+' '+(p[1]+3)+' v-4 l5 -4 l5 4 v4 z" fill="'+col+'" stroke="#2F2620"/>';
    if(sel)o+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="9" fill="none" stroke="#C9A64A" stroke-width="1.6"/>';
    if((st.pill||0)>S.day)o+='<circle cx="'+(p[0]+6)+'" cy="'+(p[1]-6)+'" r="2.4" fill="#A34A3A"/>';
    o+='<text x="'+(p[0]+8)+'" y="'+(p[1]+3)+'" font-family="Marcellus SC, Georgia, serif" font-size="9" fill="#F3EBD8" stroke="#26404B" stroke-width="2.4" paint-order="stroke">'+esc(t.n)+'</text></g>';}
  o+='<g><circle cx="'+H[0]+'" cy="'+H[1]+'" r="6" fill="#2F2620" stroke="#C9A64A" stroke-width="1.6"/><text x="'+(H[0]+9)+'" y="'+(H[1]+4)+'" font-family="Marcellus SC, Georgia, serif" font-size="11" fill="#F3EBD8" stroke="#26404B" stroke-width="2.6" paint-order="stroke">Kaldstrand</text></g>';
  return o+'</svg>';}
function worldPanel(){let h=head('The World','Where the ships of Kaldstrand can sail');
  h+='<div class="wmap">'+worldSVG()+'</div><p class="meta">Red towers: walled. Gold: trades with you. A red dot: plundered, recovering.</p>';
  if(thLevel()>=5&&!(S.maps&&S.maps.england))h+='<div class="god"><div><strong>A traveller from the west</strong></div><p>He sells a map of England, drawn on calfskin: monasteries, towns and the roads between.</p><div class="acts">'+btn('w-map','Buy the map (40 gold)',{cls:'primary',dis:S.res.gold<40})+'</div></div>';
  for(const k in REGIONS){const open=regionOpen(k);h+='<h3>'+esc(REGIONS[k].n)+'</h3>';if(!open){h+='<p class="meta">'+(k==='england'&&thLevel()>=5?'Buy the traveller’s map to sail here.':'Opens at Town Hall level '+REGIONS[k].lv+'.')+'</p>';continue;}
    h+='<div class="blist">'+TARGETS.filter(t=>t.reg===k).map(t=>{const st=S.tg[t.id]||{};return '<button type="button" class="bcard" data-tg="'+t.id+'"><b>'+esc(t.n)+'</b><span>'+esc(t.type)+'</span><span>'+travel(t)+' days away · defence '+t.def+(t.walls?' (walls)':'')+'</span>'+((st.pill||0)>S.day?'<span>Plundered, recovering</span>':'')+'</button>';}).join('')+'</div>';}
  openSheet(h,'panel');$('sheet-card').dataset.p='world';$('sheet-card').querySelectorAll('[data-tg]').forEach(b=>b.onclick=()=>targetSheet(b.dataset.tg));
  if($('w-map'))$('w-map').onclick=()=>{if(S.res.gold<40)return;S.res.gold-=40;S.maps=S.maps||{};S.maps.england=1;checkMilestones();toast('England lies open on the map.');worldPanel();save();};}
function tradeHtml(b,on){if(!has('harbour'))return '<p style="color:#8E3B2F">Merchants need a harbour to land.</p>';
  if(!S.trader){return '<p>No merchant in port. In summer a ship calls every 12 days and stays 4 days.</p><h3>Trading partners</h3><table class="t">'+Object.keys(PARTNERS).map(id=>{const P=PARTNERS[id],ok=partnerOk(id),ban=((S.tg[id]||{}).ban||0)>S.day;return '<tr><td>'+esc(P.n)+'<br><span class="meta">Wants '+P.wants.map(k=>RNAME[k]?RNAME[k].toLowerCase():k).join(', ')+'</span></td><td>'+(ok?'Trades':ban?'Angry after your raid':'Not yet')+'</td></tr>';}).join('')+'</table>';}
  const P=PARTNERS[S.trader.from];let h='<p><strong>A merchant from '+esc(P.n)+' is in port</strong> for '+(S.trader.until-S.day)+' more days. Silver '+fmt(S.res.silver)+' · gold '+fmt(S.res.gold)+'</p>';
  const deals=(S.trader.deals||[]).filter(d=>d.left>0);if(deals.length)h+='<h3>Special orders</h3><table class="t">'+deals.map(d=>'<tr><td>Wants '+d.left+' '+esc((RNAME[d.k]||d.k).toLowerCase())+'</td><td>pays 50% more</td></tr>').join('')+'</table>';
  const sellKeys=Object.keys(BASEP).filter(k=>k!=='silver'&&k!=='pig'&&k!=='sheep'&&(k==='thrall'?S.thralls>0:(S.res[k]||0)>=1));
  h+='<h3>Sell</h3>'+(sellKeys.length?'<table class="t">'+sellKeys.map(k=>{const have=k==='thrall'?S.thralls:Math.floor(S.res[k]),p=priceSell(k);return '<tr><td>'+esc(k==='thrall'?'Thralls':RNAME[k])+' <span class="meta">'+have+' · '+p.toFixed(1)+' silver each'+(mktSat(k)<0.95?' (they have plenty)':'')+'</span></td><td><button type="button" class="btn small" data-sell="'+k+'" data-q="'+(k==='thrall'||k==='gold'?1:10)+'">Sell '+(k==='thrall'||k==='gold'?1:10)+'</button></td></tr>';}).join('')+'</table>':'<p>Nothing to sell.</p>');
  h+='<h3>Buy</h3><table class="t">'+P.sells.map(k=>{const p=priceBuy(k),q=k==='arrows'?10:1;return '<tr><td>'+esc(k==='pig'?'A pig':k==='sheep'?'A sheep':k==='thrall'?'A thrall':q+' '+(RNAME[k]||k).toLowerCase())+'</td><td><button type="button" class="btn small" data-buy="'+k+'" '+(S.res.silver<p*q?'disabled':'')+'>'+Math.ceil(p*q)+' silver</button></td></tr>';}).join('')+'</table>';
  on.push(()=>{const card=$('sheet-card');
    card.querySelectorAll('[data-sell]').forEach(x=>x.onclick=()=>{const k=x.dataset.sell;let q=+x.dataset.q;if(k==='thrall'){if(S.thralls<1)return;S.thralls--;}else{q=Math.min(q,Math.floor(S.res[k]));if(q<=0)return;S.res[k]-=q;}
      const p=priceSell(k)*q;S.res.silver+=p;const d=(S.trader.deals||[]).find(z=>z.k===k&&z.left>0);if(d)d.left=Math.max(0,d.left-q);S.mkt[k]=Math.max(0.4,mktSat(k)*Math.pow(0.93,q/10*(k==='gold'?10:1)));S.trades=(S.trades||0)+1;checkMilestones();buildingSheet(b);save();});
    card.querySelectorAll('[data-buy]').forEach(x=>x.onclick=()=>{const k=x.dataset.buy,q=k==='arrows'?10:1,p=Math.ceil(priceBuy(k)*q);if(S.res.silver<p)return;if((k==='pig'||k==='sheep')&&herdTotal()>=herdCap()){toast('No room in the pens.');return;}if(k==='thrall'&&S.thralls>=thrallCap()){toast('No room in the thrall pen.');return;}
      S.res.silver-=p;if(k==='pig')S.herd.pigs++;else if(k==='sheep')S.herd.sheep++;else if(k==='thrall')S.thralls++;else S.res[k]=(S.res[k]||0)+q;S.trades=(S.trades||0)+1;checkMilestones();buildingSheet(b);save();});});
  return h;}
function thExtraHtml(on){let h='';if(thLevel()<4)return h;
  h+='<h3>Banquets</h3><p class="meta">Each banquet this season costs more than the last.</p>'+Object.keys(BANQ).map(k=>{const c=banqCost(k);return '<div class="wk"><button type="button" class="btn small'+(afford(c)?' primary':'')+'" data-bq="'+k+'" '+(afford(c)?'':'disabled')+'>'+esc(BANQ[k].n)+'</button><span class="meta">'+esc(BANQ[k].d)+' · '+esc(costStr(c))+'</span></div>';}).join('');
  on.push(()=>{$('sheet-card').querySelectorAll('[data-bq]').forEach(x=>x.onclick=()=>{const w=holdBanquet(x.dataset.bq);if(w){toast(w);return;}toast(BANQ[x.dataset.bq].n+': the hall roars.');closeSheet();save();});});return h;}
const TOMB_WORK=520;
function tombHtml(b,on){if(b.proj)return '<p>'+(S.tombDone?'Ragnar rests in his ship beneath the mound. Odin’s favour never falls below 30, and the tomb adds 1 fame a day.':'Raised: '+Math.floor(100*b.proj.done/TOMB_WORK)+'%. Builders work on it day by day; a full crew of 5 needs about two years.')+'</p>';
  const ship=S.ships.find(s=>!s.away);const ok=S.res.gold>=40&&S.res.swords>=6&&ship;
  on.push(()=>{if($('tb-go'))$('tb-go').onclick=()=>{const sh=S.ships.find(s=>!s.away);if(!sh||S.res.gold<40||S.res.swords<6)return;S.res.gold-=40;S.res.swords-=6;S.ships=S.ships.filter(s=>s!==sh);b.proj={done:0};S.saga.push({y:yearNow(),t:'The '+sh.name+' was dragged ashore to be Ragnar’s grave-ship.'});checkMilestones();toast('The keel of Ragnar’s tomb is laid.');buildingSheet(b);save();};});
  return '<p>To begin, give 40 gold, 6 swords and one ship from the harbour'+(ship?' (the '+esc(ship.name)+')':'')+'.</p><div class="acts">'+btn('tb-go','Begin the tomb',{cls:'primary',dis:!ok})+'</div>';}
function warExtraHtml(on){let h='';
  if(thLevel()>=4){h+='<h3>Hire and levy</h3><div class="wk">'+btn('w-merc','Hire 5 mercenaries (70 silver)',{cls:'small'})+'<span class="meta">Strength 2, ready at once, stay one year. Needs 300 fame.</span></div>';
    const lev=S.mobilUntil>S.day;h+='<div class="wk">'+btn('w-levy',lev?'Levy called ('+(S.mobilUntil-S.day)+' days)':'Call the levy',{cls:'small',dis:lev})+'<span class="meta">+20% warrior limit for 30 days. −5 morale.</span></div>';}
  if(thLevel()>=5){recomputeWalls();h+='<h3>Defence</h3><table class="t"><tr><td>Defence of the village</td><td>'+defenceValue()+'</td></tr><tr><td>Palisade</td><td>'+(S.wallClosed?'closed':walls.some(v=>v)?'open: there is a gap':'none')+'</td></tr><tr><td>Watchtowers manned</td><td>'+Math.min(B.filter(b=>b.t==='tower').length,Math.floor(S.people.filter(p=>p.w==='archer'&&!p.away).length/2))+' / '+B.filter(b=>b.t==='tower').length+'</td></tr></table><p class="meta">Raiders will not come before Town Hall 6, but scouts already watch the sea. A closed palisade (with a gate) counts 1.5×.</p><div class="acts">'+btn('w-wall','Build the palisade',{cls:'primary'})+'</div>';}
  on.push(()=>{if($('w-merc'))$('w-merc').onclick=()=>{const w=hireMercs();toast(w||'Five mercenaries came ashore.');if(!w){warPanel();save();}};
    if($('w-levy'))$('w-levy').onclick=()=>{S.mobilUntil=S.day+30;toast('The levy is called. Every able man takes up a weapon.');warPanel();save();};
    if($('w-wall'))$('w-wall').onclick=()=>{closeSheet();startWall();};});return h;}
function advisorsHtml(on){S.advs=S.advs||(S.adv?[S.adv]:[]);let h='<h3>Council</h3>'+S.advs.map(k=>{const A=ADVISORS[k];return '<div class="pcard">'+portrait(ADV_P[k],56)+'<div><strong>'+esc(A.n)+'</strong> · '+esc(A.role)+'<br><span class="meta">'+esc(A.b)+'</span></div></div>';}).join('');
  if(S.advs.length<advSlots()){h+='<p>The hall has room for another voice. Choose one:</p><div class="advs">'+Object.keys(ADVISORS).filter(k=>!S.advs.includes(k)).map(k=>'<button type="button" class="adv" data-adv="'+k+'">'+portrait(ADV_P[k],44)+'<span><b>'+esc(ADVISORS[k].n)+'</b> · '+esc(ADVISORS[k].role)+'<br><span class="meta">'+esc(ADVISORS[k].b)+'</span></span></button>').join('')+'</div>';}
  else if(thLevel()<5)h+='<p class="meta">More advisors join at Town Hall '+(thLevel()<4?4:5)+'.</p>';
  on.push(()=>{$('sheet-card').querySelectorAll('[data-adv]').forEach(x=>x.onclick=()=>{S.advs.push(x.dataset.adv);S.saga.push({y:yearNow(),t:ADVISORS[x.dataset.adv].n+' joined the council of Kaldstrand.'});toast(ADVISORS[x.dataset.adv].n+' joins the council.');sagaPanel();save();});});return h;}
