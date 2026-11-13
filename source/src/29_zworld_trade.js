/* =================== world map (Bad North style), trade market, level 4–5 sheets =================== */
/* World chart: 1000 × 800 units, north up. Drag or swipe to move, wheel or pinch to zoom. */
const WPOS={dublin:[214,522],home:[590,240],hval:[610,125],sogn:[615,195],hord:[565,310],ringa:[680,280],skir:[660,385],jut:[620,530],hedeby:[632,615],birka:[896,398],
  shet:[402,155],ork:[342,246],heb:[232,315],lind:[408,462],iona:[214,374],york:[384,535],london:[448,676]};
const WLANDS=[
  {r:'scand',n:'Norway',lp:[760,150],p:'650,-160 640,0 618,40 600,88 586,130 570,170 576,210 560,250 548,300 556,340 584,380 618,408 650,424 700,440 760,470 800,500 832,480 862,420 882,360 902,300 932,240 962,170 1000,100 1160,70 1160,-160'},
  {r:'scand',p:'600,468 640,458 662,500 656,560 672,600 690,640 642,652 610,622 600,562 594,512'},
  {r:'scand',p:'690,556 728,560 734,598 700,604'},{r:'scand',p:'742,566 772,560 780,590 752,596'},
  {r:'scand',n:'Gotland',p:'918,468 934,460 940,500 924,508'},
  {r:'scand',p:'884,404 896,388 912,394 908,414 892,418'},{r:'scand',n:'Sweden',lp:[808,432]},
  {r:'isles',p:'390,130 412,126 418,170 398,182'},{r:'isles',p:'322,236 356,230 362,256 330,262'},{r:'isles',p:'212,290 242,284 252,330 226,348'},
  {r:'england',n:'Scotland',lp:[322,414],p:'330,280 382,268 402,300 386,340 410,380 420,420 432,462 300,470 270,460 250,420 238,380 268,340 298,302'},
  {r:'england',n:'England',lp:[380,600],p:'300,470 432,462 446,500 470,560 492,620 502,660 470,700 400,712 330,722 280,700 302,660 270,620 300,580 280,540 300,500'},
  {r:'england',p:'200,362 228,358 232,388 206,392'},
  {r:'west',n:'Ireland',lp:[150,560],p:'100,480 170,450 222,480 226,560 200,640 130,662 80,602 70,530'},
  {r:'far',n:'Iceland',lp:[120,70],p:'40,40 150,20 222,50 200,110 90,122 30,90'},
  {r:'far',n:'Frankia',lp:[700,740],p:'380,800 420,762 520,742 600,702 662,672 760,662 880,640 1000,622 1160,610 1160,960 350,960'},
  {r:'far',n:'Baltic',lp:[975,330],p:'1000,200 962,262 950,340 968,420 1000,462 1160,490 1160,170'}];
const WMTN=[[600,60],[640,100],[700,90],[660,170],[620,150],[740,150],[700,220],[780,230],[640,250],[720,320],[812,290],[742,372],[310,330],[350,360],[140,60]];
let WV=null;/* view box */let WMODE='raid';/* 'trade' draws the trading partners instead of the raid targets */
function wOpen(r){return r==='west'||r==='far'?false:regionOpen(r);}
function worldSVG(){const reg=r=>wOpen(r);
  let o='<svg id="wsvg" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Map of the north"><defs>'
    +'<radialGradient id="wsea" cx="0.6" cy="0.4" r="0.8"><stop offset="0" stop-color="#3A5964"/><stop offset="1" stop-color="#28414B"/></radialGradient>'
    +'<filter id="wblur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="16"/></filter>'
    +'<filter id="wblur2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>'
    +'<linearGradient id="fgT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDE3E2" stop-opacity="1"/><stop offset="0.6" stop-color="#DDE3E2" stop-opacity="0.97"/><stop offset="0.8" stop-color="#DDE3E2" stop-opacity="0.55"/><stop offset="1" stop-color="#DDE3E2" stop-opacity="0"/></linearGradient>'
    +'<linearGradient id="fgB" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#DDE3E2" stop-opacity="1"/><stop offset="0.6" stop-color="#DDE3E2" stop-opacity="0.97"/><stop offset="0.8" stop-color="#DDE3E2" stop-opacity="0.55"/><stop offset="1" stop-color="#DDE3E2" stop-opacity="0"/></linearGradient>'
    +'<linearGradient id="fgL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#DDE3E2" stop-opacity="1"/><stop offset="0.6" stop-color="#DDE3E2" stop-opacity="0.97"/><stop offset="0.8" stop-color="#DDE3E2" stop-opacity="0.55"/><stop offset="1" stop-color="#DDE3E2" stop-opacity="0"/></linearGradient>'
    +'<linearGradient id="fgR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#DDE3E2" stop-opacity="1"/><stop offset="0.6" stop-color="#DDE3E2" stop-opacity="0.97"/><stop offset="0.8" stop-color="#DDE3E2" stop-opacity="0.55"/><stop offset="1" stop-color="#DDE3E2" stop-opacity="0"/></linearGradient>'
    +'<pattern id="wwave" width="60" height="40" patternUnits="userSpaceOnUse"><path d="M6 14 q6 -5 12 0 t12 0 M36 32 q6 -5 12 0 t12 0" stroke="#4E6C78" stroke-width="1.2" fill="none" opacity="0.55"/></pattern></defs>';
  o+='<rect x="-300" y="-300" width="1600" height="1400" fill="url(#wsea)"/><rect x="-300" y="-300" width="1600" height="1400" fill="url(#wwave)"/>';
  /* sailing routes under the land */
  const H=WPOS.home;
  if(WMODE==='trade')o+=tradeRoutesSVG();else for(const t of TARGETS){if(!reg(t.reg))continue;const p=WPOS[t.id];if(!p)continue;const mx=(H[0]+p[0])/2+(p[1]-H[1])*0.18,my=(H[1]+p[1])/2-(p[0]-H[0])*0.18;
    o+='<path d="M'+H[0]+' '+H[1]+' Q'+mx+' '+my+' '+p[0]+' '+p[1]+'" stroke="#E7E3D2" stroke-width="'+(worldSel===t.id?2.2:1.4)+'" stroke-dasharray="6 6" fill="none" opacity="'+(worldSel===t.id?0.95:0.35)+'"/>';}
  for(const L of WLANDS){if(!L.p)continue;const pts=L.p.split(' ').map(q=>q.split(',').map(Number));const sh=pts.map(q=>q[0]+','+(q[1]+9)).join(' ');const op=reg(L.r);
    o+='<polygon points="'+sh+'" fill="#4A5547"/><polygon points="'+L.p+'" fill="'+(op?'#B3BC9E':'#9AA392')+'" stroke="#EDE8D6" stroke-width="1.2" stroke-opacity="0.55" stroke-linejoin="round"/>';
    /* low-poly facets: two lighter planes toward the centre */
    const cx=pts.reduce((a,q)=>a+q[0],0)/pts.length,cy=pts.reduce((a,q)=>a+q[1],0)/pts.length;const half=pts.slice(0,Math.ceil(pts.length/2));
    o+='<polygon points="'+half.map(q=>((q[0]*0.55+cx*0.45))+','+((q[1]*0.55+cy*0.45))).join(' ')+' '+cx+','+cy+'" fill="#C8CFB4" opacity="0.5"/>';
    o+='<polygon points="'+pts.slice(Math.floor(pts.length/2)).map(q=>((q[0]*0.7+cx*0.3))+','+((q[1]*0.7+cy*0.3))).join(' ')+' '+cx+','+cy+'" fill="#8E9A80" opacity="0.28"/>';}
  for(const q of WMTN){o+='<polygon points="'+(q[0]-16)+','+(q[1]+10)+' '+q[0]+','+(q[1]-18)+' '+(q[0]+16)+','+(q[1]+10)+'" fill="#8F9A90"/><polygon points="'+q[0]+','+(q[1]-18)+' '+(q[0]+16)+','+(q[1]+10)+' '+(q[0]+4)+','+(q[1]+10)+'" fill="#7A847B"/><polygon points="'+(q[0]-6)+','+(q[1]-8)+' '+q[0]+','+(q[1]-18)+' '+(q[0]+6)+','+(q[1]-8)+'" fill="#F1F0EA"/>';}
  for(const L of WLANDS)if(L.n&&L.lp&&!(L.n==='England'&&!reg(L.r)))o+='<text x="'+L.lp[0]+'" y="'+L.lp[1]+'" text-anchor="middle" font-family="Marcellus SC, Georgia, serif" font-size="17" letter-spacing="3" fill="#56604E" opacity="0.75">'+esc(L.n.toUpperCase())+'</text>';
  /* places (dim when their land is still in the mist) */
  if(WMODE==='trade')o+=tradeMarkersSVG();else for(const t of TARGETS){const lk=!reg(t.reg);const p=WPOS[t.id];if(!p)continue;const st=S.tg[t.id]||{},sel=worldSel===t.id,col=t.walls?'#A34A3A':t.trade?'#C9A64A':'#F3EBD8';
    o+='<g '+(lk?'opacity="0.55"':'data-tg="'+t.id+'" style="cursor:pointer"')+' transform="translate('+p[0]+' '+p[1]+')"><circle r="22" fill="transparent"/>';
    if(/Monastery/.test(t.type))o+='<rect x="-6" y="-9" width="12" height="12" fill="'+col+'" stroke="#2F2620" stroke-width="1.5"/><path d="M0 -18 v9 M-4 -14 h8" stroke="#2F2620" stroke-width="2"/>';
    else if(t.walls)o+='<path d="M-9 5 v-12 h4 v4 h3 v-4 h4 v4 h3 v-4 h4 v12 z" fill="'+col+'" stroke="#2F2620" stroke-width="1.5"/>';
    else if(t.jarl)o+='<circle r="7.5" fill="'+col+'" stroke="#2F2620" stroke-width="1.8"/><circle r="2.4" fill="#2F2620"/>';
    else o+='<path d="M-8 5 v-6 l8 -6 l8 6 v6 z" fill="'+col+'" stroke="#2F2620" stroke-width="1.5"/>';
    if(sel)o+='<circle r="14" fill="none" stroke="#C9A64A" stroke-width="2.4"/>';
    if((st.pill||0)>S.day)o+='<circle cx="9" cy="-9" r="3.6" fill="#A34A3A"/>';
    o+='<text x="13" y="5" font-family="Marcellus SC, Georgia, serif" font-size="15" fill="#F3EBD8" stroke="#26404B" stroke-width="3.6" paint-order="stroke">'+esc(t.n)+'</text></g>';}
  /* mist over every land not yet open, and over the edges of the known world */
  o+='<g filter="url(#wblur)" pointer-events="none">';
  for(const L of WLANDS){if(reg(L.r)||!L.p)continue;o+='<polygon points="'+L.p+'" fill="#E2E7E6" opacity="'+(L.r==='far'?0.82:L.r==='england'?0.34:0.62)+'" transform="translate(0 0)"/>';}
  const blobs={isles:[[360,230,120,90]],west:[[150,560,120,140]],far:[[120,70,160,90],[700,760,380,90],[1000,320,80,200]]};
  for(const k in blobs){if(reg(k))continue;for(const e of blobs[k])o+='<ellipse cx="'+e[0]+'" cy="'+e[1]+'" rx="'+e[2]+'" ry="'+e[3]+'" fill="#E2E7E6" opacity="0.5"/>';}
  o+='</g>';
  for(const k in REGIONS){if(reg(k))continue;const c=k==='isles'?[330,200]:[392,604];o+='<g pointer-events="none"><text x="'+c[0]+'" y="'+c[1]+'" text-anchor="middle" font-family="Marcellus SC, Georgia, serif" font-size="22" fill="#3D3129">'+esc(REGIONS[k].n)+'</text><text x="'+c[0]+'" y="'+(c[1]+20)+'" text-anchor="middle" font-family=""Marcellus SC", serif" font-size="13" fill="#3D3129">'+(k==='england'&&thLevel()>=5?'Buy the traveller’s map':'Opens at Town Hall '+REGIONS[k].lv)+'</text></g>';}
  o+='<g pointer-events="none"><rect x="-300" y="-300" width="1600" height="440" fill="url(#fgT)"/><rect x="-300" y="660" width="1600" height="440" fill="url(#fgB)"/><rect x="-300" y="-300" width="440" height="1400" fill="url(#fgL)"/><rect x="925" y="-300" width="440" height="1400" fill="url(#fgR)"/></g>';
  /* home */
  o+='<g pointer-events="none"><circle cx="'+H[0]+'" cy="'+H[1]+'" r="10" fill="#2F2620" stroke="#C9A64A" stroke-width="2.6"/><text x="'+(H[0]+15)+'" y="'+(H[1]+6)+'" font-family="Marcellus SC, Georgia, serif" font-size="19" fill="#F3EBD8" stroke="#26404B" stroke-width="4" paint-order="stroke">Kaldstrand</text></g>';
  return o+'</svg>';}
/* drag / swipe to move, wheel / pinch to zoom */
function wSetView(){const sv=$('wsvg');if(sv&&WV)sv.setAttribute('viewBox',WV.x.toFixed(1)+' '+WV.y.toFixed(1)+' '+WV.w.toFixed(1)+' '+WV.h.toFixed(1));}
function wClamp(){const r=WV.h/WV.w;WV.w=Math.max(240,Math.min(1100,WV.w));WV.h=WV.w*r;if(WV.h>1000){WV.h=1000;WV.w=WV.h/r;}WV.x=Math.max(-100,Math.min(1100-WV.w,WV.x));WV.y=Math.max(-90,Math.min(890-WV.h,WV.y));}
function wInit(box){const sv=$('wsvg');const R=box.getBoundingClientRect();const asp=R.height/Math.max(1,R.width);
  if(!WV||Math.abs(WV.h/WV.w-asp)>0.01){let w=Math.min(1000,Math.max(420,R.width*0.9)),c=worldSel&&WPOS[worldSel]?WPOS[worldSel]:WPOS.home;if(!(worldSel&&WPOS[worldSel])){/* frame Kaldstrand and every open place, so new lands are not cut off */let x0=WPOS.home[0],x1=x0,y0=WPOS.home[1],y1=y0;for(const t of TARGETS){const p=WPOS[t.id];if(!p||!wOpen(t.reg))continue;x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]+70);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}c=[(x0+x1)/2,(y0+y1)/2];w=Math.min(1000,Math.max(w,x1-x0+140,(y1-y0+150)/asp));}WV={x:c[0]-w/2,y:c[1]-w*asp/2,w:w,h:w*asp};}
  wClamp();sv.setAttribute('preserveAspectRatio','none');wSetView();
  const pts=new Map();let moved=0,pinch=null;
  const toW=(px,py)=>[WV.x+(px-R.left)/R.width*WV.w,WV.y+(py-R.top)/R.height*WV.h];
  box.addEventListener('pointerdown',e=>{pts.set(e.pointerId,{x:e.clientX,y:e.clientY});moved=0;if(pts.size===2){const v=[...pts.values()];pinch={d:Math.hypot(v[0].x-v[1].x,v[0].y-v[1].y),w:WV.w,c:toW((v[0].x+v[1].x)/2,(v[0].y+v[1].y)/2)};}});
  box.addEventListener('pointermove',e=>{const p=pts.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
    if(pts.size===1){moved+=Math.abs(dx)+Math.abs(dy);if(moved>6&&!box.hasPointerCapture(e.pointerId)){try{box.setPointerCapture(e.pointerId);}catch(er){}}WV.x-=dx/R.width*WV.w;WV.y-=dy/R.height*WV.h;}
    else if(pinch&&pts.size===2){const v=[...pts.values()];const d=Math.hypot(v[0].x-v[1].x,v[0].y-v[1].y);const asp2=WV.h/WV.w;WV.w=pinch.w*pinch.d/Math.max(1,d);WV.h=WV.w*asp2;const m=[(v[0].x+v[1].x)/2,(v[0].y+v[1].y)/2];WV.x=pinch.c[0]-(m[0]-R.left)/R.width*WV.w;WV.y=pinch.c[1]-(m[1]-R.top)/R.height*WV.h;moved=99;}
    wClamp();wSetView();});
  const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch=null;};box.addEventListener('pointerup',up);box.addEventListener('pointercancel',up);
  box.addEventListener('click',e=>{if(moved>6){e.stopPropagation();e.preventDefault();}},true);
  box.addEventListener('wheel',e=>{e.preventDefault();const c=toW(e.clientX,e.clientY);const k=Math.exp(e.deltaY*0.0015);const asp2=WV.h/WV.w;WV.w*=k;WV.h=WV.w*asp2;wClamp();WV.x=c[0]-(e.clientX-R.left)/R.width*WV.w;WV.y=c[1]-(e.clientY-R.top)/R.height*WV.h;wClamp();wSetView();},{passive:false});
  /* zoom buttons */
  box.insertAdjacentHTML('beforeend','<div class="wzoom"><button type="button" data-wz="0.8" aria-label="Zoom in">+</button><button type="button" data-wz="1.25" aria-label="Zoom out">−</button><button type="button" data-wz="home" aria-label="Back to Kaldstrand">⌂</button></div>');
  box.querySelectorAll('[data-wz]').forEach(b=>{b.addEventListener('pointerdown',e=>e.stopPropagation());b.onclick=e=>{e.stopPropagation();const z=b.dataset.wz;if(z==='home'){WV.x=WPOS.home[0]-WV.w/2;WV.y=WPOS.home[1]-WV.h/2;}else{const cx=WV.x+WV.w/2,cy=WV.y+WV.h/2,asp2=WV.h/WV.w;WV.w*=+z;WV.h=WV.w*asp2;wClamp();WV.x=cx-WV.w/2;WV.y=cy-WV.h/2;}wClamp();wSetView();};});}
function worldClose(){const w=$('wfs');if(w)w.remove();worldSel=null;}
function worldPanel(){WMODE='raid';closeSheet();let w=$('wfs');if(!w){w=document.createElement('div');w.id='wfs';w.className='wfs';document.body.appendChild(w);}
  let side='<div class="wside"><div class="whd"><div><h2>The World</h2><p>Where the ships of Kaldstrand can sail</p></div><button type="button" class="x" id="wfs-x" aria-label="Close map">×</button></div>';
  side+='<p class="meta">Red towers: walled. Gold: trades with you. Red dot: plundered, recovering. Lands in the mist open as Kaldstrand grows.</p>';
  if(thLevel()>=5&&!(S.maps&&S.maps.england))side+='<div class="god"><strong>A traveller from the west</strong><p>He sells a map of England, drawn on calfskin: monasteries, towns and the roads between.</p><div class="acts">'+btn('w-map','Buy the map (40 gold)',{cls:'primary',dis:S.res.gold<40})+'</div></div>';
  for(const k in REGIONS){const open=regionOpen(k);side+='<h3>'+esc(REGIONS[k].n)+'</h3>';if(!open){side+='<p class="meta">'+(k==='england'&&thLevel()>=5?'Buy the traveller’s map to sail here.':'Opens at Town Hall level '+REGIONS[k].lv+'.')+'</p>';continue;}
    side+='<div class="wlist">'+TARGETS.filter(t=>t.reg===k).map(t=>{const st=S.tg[t.id]||{};return '<button type="button" class="wrow'+(worldSel===t.id?' on':'')+'" data-tg="'+t.id+'"><b>'+esc(t.n)+'</b><span>'+esc(t.type)+' · '+travel(t)+' days · defence '+t.def+(t.walls?' · walls':'')+((st.pill||0)>S.day?' · plundered':'')+'</span></button>';}).join('')+'</div>';}
  side+='</div>';
  w.innerHTML='<div class="wm" id="wmbox">'+worldSVG()+'<div class="whint">Drag to sail around · wheel or pinch to zoom</div></div>'+side;requestAnimationFrame(()=>wInit($('wmbox')));
  $('wfs-x').onclick=worldClose;
  w.querySelectorAll('[data-tg]').forEach(b=>b.onclick=()=>{worldSel=b.dataset.tg;targetSheet(b.dataset.tg);});
  if($('w-map'))$('w-map').onclick=()=>{if(S.res.gold<40)return;S.res.gold-=40;S.maps=S.maps||{};S.maps.england=1;checkMilestones();toast('England lies open on the map.');worldPanel();save();};}
function tradeHtml(b,on){if(!has('harbour'))return '<p style="color:#8E3B2F">Merchants need a harbour to land.</p>';
  if(!S.trader){on.push(()=>{$('t-mkt').onclick=()=>marketPanel();$('t-trd').onclick=()=>tradePanel();});return '<div class="acts"><button type="button" class="btn primary" id="t-mkt">Open the market</button><button type="button" class="btn" id="t-trd">Trade map</button></div><p>Trade with every partner village from the market at any time. In summer a merchant ship also calls every 12 days and stays 4 days, bringing special orders that pay 50% more.</p><h3>Trading partners</h3><table class="t">'+Object.keys(PARTNERS).map(id=>{const P=PARTNERS[id],ok=partnerOk(id),ban=((S.tg[id]||{}).ban||0)>S.day;return '<tr><td>'+esc(P.n)+'<br><span class="meta">Wants '+P.wants.map(k=>RNAME[k]?RNAME[k].toLowerCase():k).join(', ')+'</span></td><td>'+(ok?'Trades':ban?'Angry after your raid':'Not yet')+'</td></tr>';}).join('')+'</table>';}
  const P=PARTNERS[S.trader.from];let h='<p><strong>A merchant from '+esc(P.n)+' is in port</strong> for '+(S.trader.until-S.day)+' more days. Silver '+fmt(S.res.silver)+' · gold '+fmt(S.res.gold)+'</p>';
  const deals=(S.trader.deals||[]).filter(d=>d.left>0);if(deals.length)h+='<h3>Special orders</h3><table class="t">'+deals.map(d=>'<tr><td>Wants '+d.left+' '+esc((RNAME[d.k]||d.k).toLowerCase())+'</td><td>pays 50% more</td></tr>').join('')+'</table>';
  h+='<div class="acts"><button type="button" class="btn primary" id="t-mkt">Open the market</button></div><p class="meta">Sell and buy every good with each village that trades with you, also from the Market button in the bottom bar.</p>';
  on.push(()=>{$('t-mkt').onclick=()=>{mktPartner=S.trader.from;marketPanel();};});
  return h;}
function thExtraHtml(on){let h='<h3>The patron God</h3>'+patronHtml(on,false)+feastHtml(on);return h;}
function thExtraHtmlOld(on){let h='';
  h+='<h3>Banquets</h3><p class="meta">Each banquet this season costs more than the last.</p>'+Object.keys(BANQ).map(k=>{const c=banqCost(k);return '<div class="wk"><button type="button" class="btn small'+(afford(c)?' primary':'')+'" data-bq="'+k+'" '+(afford(c)?'':'disabled')+'>'+esc(BANQ[k].n)+'</button><span class="meta">'+esc(BANQ[k].d)+' · '+esc(costStr(c))+'</span></div>';}).join('');
  on.push(()=>{$('sheet-card').querySelectorAll('[data-bq]').forEach(x=>x.onclick=()=>{const w=holdBanquet(x.dataset.bq);if(w){toast(w);return;}toast(BANQ[x.dataset.bq].n+': the hall roars.');closeSheet();save();});});return h;}
const TOMB_WORK=520;
function tombHtml(b,on){if(b.proj)return '<p>'+(S.tombDone?'Ragnar rests in his ship beneath the mound. Odin’s favour never falls below 30, and the tomb adds 1 fame a day.':'Raised: '+Math.floor(100*b.proj.done/TOMB_WORK)+'%. Builders work on it day by day; a full crew of 5 needs about two years.')+'</p>';
  const ship=S.ships.find(s=>!s.away);const ok=S.res.gold>=40&&S.res.swords>=6&&ship;
  on.push(()=>{if($('tb-go'))$('tb-go').onclick=()=>{const sh=S.ships.find(s=>!s.away);if(!sh||S.res.gold<40||S.res.swords<6)return;S.res.gold-=40;S.res.swords-=6;S.ships=S.ships.filter(s=>s!==sh);b.proj={done:0};S.saga.push({y:yearNow(),t:'The '+sh.name+' was dragged ashore to be Ragnar’s grave-ship.'});checkMilestones();toast('The keel of Ragnar’s tomb is laid.');buildingSheet(b);save();};});
  return '<p>To begin, give 40 gold, 6 swords and one ship from the harbour'+(ship?' (the '+esc(ship.name)+')':'')+'.</p><div class="acts">'+btn('tb-go','Begin the tomb',{cls:'primary',dis:!ok})+'</div>';}
function warExtraHtml(on){let h='';
  if(thLevel()>=4){h+='<h3>Hire and levy</h3><div class="wk">'+btn('w-merc','Hire 5 mercenaries ('+5*MERC_SILVER+' silver)',{cls:'small'})+'<span class="meta">Strength 2, ready at once, stay one year. Needs 300 fame.</span></div>';
    const lev=S.mobilUntil>S.day;h+='<div class="wk">'+btn('w-levy',lev?'Levy called ('+(S.mobilUntil-S.day)+' days)':'Call the levy',{cls:'small',dis:lev})+'<span class="meta">+20% warrior limit for 30 days. −5 morale.</span></div>';}
  if(thLevel()>=5){recomputeWalls();h+='<h3>Defence</h3><table class="t"><tr><td>Defence of the village</td><td>'+defenceValue()+'</td></tr><tr><td>Palisade</td><td>'+(S.wallClosed?'closed':walls.some(v=>v)?'open: there is a gap':'none')+'</td></tr><tr><td>Watchtowers manned</td><td>'+Math.min(B.filter(b=>b.t==='tower').length,Math.floor(S.people.filter(p=>p.w==='archer'&&!p.away).length/2))+' / '+B.filter(b=>b.t==='tower').length+'</td></tr></table><p class="meta">From Town Hall 5 raiders land on the shore now and then; scouts give you 5 days’ warning. A closed palisade (with a gate) keeps them out until they hack through it.</p><div class="acts">'+btn('w-wall','Build the palisade',{cls:'primary'})+'</div>'+wallDefHtml(on);}
  on.push(()=>{if($('w-merc'))$('w-merc').onclick=()=>{const w=hireMercs();toast(w||'Five mercenaries came ashore.');if(!w){warPanel();save();}};
    if($('w-levy'))$('w-levy').onclick=()=>{S.mobilUntil=S.day+30;toast('The levy is called. Every able man takes up a weapon.');warPanel();save();};
    if($('w-wall'))$('w-wall').onclick=()=>{closeSheet();startWall();};});return h;}
function advisorsHtml(on){S.advs=S.advs||(S.adv?[S.adv]:[]);let h='<h3>Council</h3>'+S.advs.map(k=>{const A=ADVISORS[k];return '<div class="pcard">'+portrait(ADV_P[k],56)+'<div><strong>'+esc(A.n)+'</strong> · '+esc(A.role)+'<br><span class="meta">'+esc(A.b)+'</span></div></div>';}).join('');
  if(S.advs.length<advSlots()){h+='<p>The hall has room for another voice. Choose one:</p><div class="advs">'+Object.keys(ADVISORS).filter(k=>!S.advs.includes(k)).map(k=>'<button type="button" class="adv" data-adv="'+k+'">'+portrait(ADV_P[k],44)+'<span><b>'+esc(ADVISORS[k].n)+'</b> · '+esc(ADVISORS[k].role)+'<br><span class="meta">'+esc(ADVISORS[k].b)+'</span></span></button>').join('')+'</div>';}
  else if(thLevel()<5)h+='<p class="meta">More advisors join at Town Hall '+(thLevel()<4?4:5)+'.</p>';
  on.push(()=>{$('sheet-card').querySelectorAll('[data-adv]').forEach(x=>x.onclick=()=>{S.advs.push(x.dataset.adv);S.saga.push({y:yearNow(),t:ADVISORS[x.dataset.adv].n+' joined the council of Kaldstrand.'});toast(ADVISORS[x.dataset.adv].n+' joins the council.');sagaPanel();save();});});return h;}
