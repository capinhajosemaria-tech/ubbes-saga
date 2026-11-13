/* =================== 1E: the trade map (José, 2026-11-11) ===================
   A map with the trading partners. Click one to see what it asks for and to send an offer:
   our goods for silver or for one of its goods. They accept, refuse or counter.
   Each village keeps a relation (0–100) that rises with deals it likes and falls with insults and raids.
   Goods travel by knarr: the ship sails out with our cargo and comes home days later with the payment.
   The Market (silver for goods at once) stays; good relations give better prices there too. */
const REL0=30,TRADE_REQ_N=2;
const TRADE_DAYS0={dublin:9};
const relOf=id=>{S.rel=S.rel||{};return S.rel[id]===undefined?REL0:S.rel[id];};
function relAdd(id,v){S.rel=S.rel||{};if(v>0&&ut('trader'))v*=1.5;S.rel[id]=clamp(relOf(id)+v,0,100);}
function relSell(id){return 1+(relOf(id)-REL0)/400;}
function relBuy(id){return 1-(relOf(id)-REL0)/500;}
const relName=r=>r<20?'Cold':r<45?'Wary':r<70?'Friendly':'Sworn friends';
const relCol=r=>r<20?'#A34A3A':r<45?'#C9A64A':'#5E7A4E';
function tradeDays(id){const t=TG(id);if(t)return travel(t);if(TRADE_DAYS0[id])return TRADE_DAYS0[id];const p=WPOS[id]||WPOS.home;return Math.max(3,Math.round(Math.hypot(p[0]-WPOS.home[0],p[1]-WPOS.home[1])/55));}
const TR_GOODS=()=>Object.keys(BASEP).filter(k=>k!=='silver'&&k!=='thrall'&&k!=='pig'&&k!=='sheep');
const trName=k=>k==='silver'?'Silver':(RNAME[k]||k);
const trHave=k=>Math.floor(k==='silver'?(S.res.silver||0):resv(k));
/* what a village pays for one of our goods, and what it asks for one of its own */
function valIn(id,k){const P=PARTNERS[id];if(k==='silver')return 1;return BASEP[k]*(P.wants.includes(k)?1.35:1);}
function valOut(id,k){const P=PARTNERS[id];if(k==='silver')return 1;return BASEP[k]*(P.sells.includes(k)?1.05:1.4)*(BUYX[k]||1);}
/* how good a deal must be (their side ÷ ours) before they say yes */
function needOf(id){let n=1.12-(relOf(id)-REL0)/100*0.4;if(ut('trader'))n-=0.08;if(hasAdv('athelstan'))n-=0.06;if(jt('wise'))n-=0.04;return Math.max(0.8,n);}
const cargoOf=(k,n)=>k==='silver'||k==='gold'?0:k==='arrows'?n/10:n;
const knarrsHome=()=>S.ships.filter(s=>s.type==='knarr'&&!s.away);
const knarrCargo=()=>SHIPCAP.knarr?SHIPCAP.knarr.cargo:250;
function tradeReady(id){if(thLevel()<3)return 'Trade by sea opens at Town Hall level 3';if(!tradeOpen())return 'Needs a Harbour and a Trading House';if(!partnerOk(id))return ((S.tg[id]||{}).ban||0)>S.day?PARTNERS[id].n+' is angry after your raid':'Not open to you yet';
  if(!S.ships.some(s=>s.type==='knarr'))return 'Needs a knarr (build one at the Shipyard) to carry the goods';if(!knarrsHome().length)return 'Every knarr is at sea';return '';}
/* evaluate an offer: give {k,n} for get {k,n} */
function offerEval(id,g,w){const vg=valIn(id,g.k)*g.n*reqBoost(id,g.k,g.n),vw=valOut(id,w.k)*w.n,need=needOf(id),ratio=vw>0?vg/vw:99;
  if(ratio>=need)return {v:'accept',ratio:ratio,need:need,vg:vg,vw:vw};
  const cn=Math.floor(vg/(need*valOut(id,w.k)));if(ratio>=need*0.7&&cn>=1)return {v:'counter',n:w.k==='silver'?cn:cn,ratio:ratio,need:need,vg:vg,vw:vw};
  return {v:'refuse',ratio:ratio,need:need,vg:vg,vw:vw};}
/* requests: each village asks for a few goods and pays half again for them */
function reqBoost(id,k,n){const r=(S.treq[id]||[]).find(q=>q.k===k&&q.until>=S.day);return r&&n>=r.n?1.5:1;}
function genReq(id){const P=PARTNERS[id],k=pick(P.wants.filter(x=>TR_GOODS().includes(x)&&!(S.treq[id]||[]).some(q=>q.k===x)));if(!k)return null;
  const n=Math.max(5,Math.min(150,Math.round(U(90,220)/BASEP[k]/5)*5));const v=valIn(id,k)*n*1.5;let pay;
  if(Math.random()<0.6)pay={k:'silver',n:Math.round(v)};else{const ks=P.sells.filter(x=>TR_GOODS().includes(x));const k2=pick(ks);pay=k2?{k:k2,n:Math.max(1,Math.floor(v/valOut(id,k2)))}:{k:'silver',n:Math.round(v)};}
  return {k:k,n:n,pay:pay,until:S.day+Math.round(U(18,30))};}
function tradeDay(){S.treq=S.treq||{};S.voy=S.voy||[];
  for(const id in PARTNERS){if(!partnerOk(id)){if(((S.tg[id]||{}).ban||0)>S.day&&relOf(id)>5)S.rel[id]=5;continue;}
    const L=(S.treq[id]||[]).filter(q=>q.until>=S.day);if(L.length<TRADE_REQ_N&&(Math.random()<0.12||!S.treq[id])){const q=genReq(id);if(q)L.push(q);}S.treq[id]=L;}
  for(const v of S.voy.slice()){if(!v.told&&S.day>=v.arr){v.told=1;}
    if(S.day>=v.back){const sh=shipById(v.ship);if(sh)sh.away=0;let got=0;if(v.get.k==='silver'){S.res.silver=(S.res.silver||0)+v.get.n;got=v.get.n;}else got=addRes(v.get.k,v.get.n)||0;
      S.voy=S.voy.filter(x=>x!==v);const lost=v.get.k!=='silver'&&got<v.get.n-0.5;
      toast('The knarr'+(sh?' “'+sh.name+'”':'')+' is home from '+PARTNERS[v.to].n+' with '+Math.round(v.get.k==='silver'?got:got)+' '+trName(v.get.k).toLowerCase()+'.'+(lost?' The stores were full: '+Math.round(v.get.n-got)+' had to be left on the quay.':''),5000);}}}
{const _md2=marketDay;marketDay=function(){_md2.apply(this,arguments);if(thLevel()>=3)tradeDay();};}
/* send a deal by knarr; the goods leave the stores now and the payment comes home with the ship */
function sendDeal(id,g,w,relGain,reqDone){const sh=knarrsHome()[0];if(!sh)return 'Every knarr is at sea';if(trHave(g.k)<g.n)return 'Not enough '+trName(g.k).toLowerCase();
  if(cargoOf(g.k,g.n)>knarrCargo()||cargoOf(w.k,w.n)>knarrCargo())return 'A knarr carries at most '+knarrCargo()+' goods';
  if(g.k==='silver')S.res.silver-=g.n;else S.res[g.k]-=g.n;const d=tradeDays(id);sh.away=1;
  S.voy.push({to:id,ship:sh.id,give:g,get:w,arr:S.day+d,back:S.day+2*d});relAdd(id,relGain);S.trades=(S.trades||0)+1;
  if(reqDone)S.treq[id]=(S.treq[id]||[]).filter(q=>q!==reqDone);checkMilestones();return '';}
/* ---------- the screen ---------- */
let trSel=null,trOffer={g:'',gn:20,w:'silver',wn:40},trMsg='';
function tradeRoutesSVG(){const H=WPOS.home;let o='';for(const id in PARTNERS){const p=WPOS[id];if(!p||!partnerOk(id))continue;const mx=(H[0]+p[0])/2+(p[1]-H[1])*0.18,my=(H[1]+p[1])/2-(p[0]-H[0])*0.18;
  o+='<path d="M'+H[0]+' '+H[1]+' Q'+mx+' '+my+' '+p[0]+' '+p[1]+'" stroke="#E7D7A0" stroke-width="'+(trSel===id?2.4:1.4)+'" stroke-dasharray="6 6" fill="none" opacity="'+(trSel===id?0.95:0.45)+'"/>';
  for(const v of (S.voy||[]).filter(v=>v.to===id)){const d=Math.max(1,v.back-v.arr),f=clamp((S.day-(v.arr-d))/(2*d),0,1),u=f<=0.5?f*2:2-f*2;
    const x=(1-u)*(1-u)*H[0]+2*(1-u)*u*mx+u*u*p[0],y=(1-u)*(1-u)*H[1]+2*(1-u)*u*my+u*u*p[1];o+='<g transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+')"><path d="M-9 0 q9 6 18 0 l-3 -2 h-12 z" fill="#5A4636"/><path d="M0 -1 v-12 l7 6 z" fill="#E7D7A0"/></g>';}}
  return o;}
function tradeMarkersSVG(){let o='';for(const id in PARTNERS){const p=WPOS[id];if(!p)continue;const ok=partnerOk(id),r=relOf(id),sel=trSel===id,nq=ok?(S.treq[id]||[]).length:0;
  o+='<g '+(ok?'data-tp="'+id+'" style="cursor:pointer"':'opacity="0.5"')+' transform="translate('+p[0]+' '+p[1]+')"><circle r="24" fill="transparent"/>'
    +'<path d="M-10 6 v-8 l10 -8 l10 8 v8 z" fill="'+(ok?'#C9A64A':'#9AA392')+'" stroke="#2F2620" stroke-width="1.6"/>'
    +(sel?'<circle r="16" fill="none" stroke="#C9A64A" stroke-width="2.6"/>':'')
    +(ok?'<rect x="-14" y="10" width="28" height="4" fill="#2F2620" opacity="0.6"/><rect x="-14" y="10" width="'+(28*r/100).toFixed(1)+'" height="4" fill="'+relCol(r)+'"/>':'')
    +(nq?'<circle cx="11" cy="-11" r="7" fill="#A34A3A" stroke="#2F2620" stroke-width="1.2"/><text x="11" y="-7.5" text-anchor="middle" font-size="10" font-family="Georgia,serif" fill="#F3EBD8">'+nq+'</text>':'')
    +'<text x="16" y="5" font-family="Marcellus SC, Georgia, serif" font-size="15" fill="#F3EBD8" stroke="#26404B" stroke-width="3.6" paint-order="stroke">'+esc(PARTNERS[id].n)+'</text></g>';}
  return o;}
function tradePanel(id){closeSheet();WMODE='trade';if(id)trSel=id;const ids=Object.keys(PARTNERS);if(!trSel||!PARTNERS[trSel])trSel=ids.find(partnerOk)||null;
  let w=$('wfs');const keep=!!w;if(!w){w=document.createElement('div');w.id='wfs';w.className='wfs';document.body.appendChild(w);}
  const sc=w.querySelector('.wside')?w.querySelector('.wside').scrollTop:0;
  let side='<div class="wside"><div class="whd"><div><h2>Trade</h2><p>Send goods by knarr to the villages of the north</p></div><button type="button" class="x" id="wfs-x" aria-label="Close map">×</button></div>';
  const kn=S.ships.filter(s=>s.type==='knarr');
  side+='<p class="meta">Knarrs in port: <b>'+knarrsHome().length+' of '+kn.length+'</b>'+(kn.length?' · each carries up to '+knarrCargo()+' goods (silver and gold weigh nothing).':' · build a knarr at the Shipyard to trade by sea.')+' For silver at once, use the <a href="#" id="tr-mkt">Market</a>.</p>';
  if((S.voy||[]).length)side+='<h3>At sea</h3><table class="t">'+S.voy.map(v=>{const sh=shipById(v.ship);return '<tr><td>'+esc(sh?sh.name:'Knarr')+' → '+esc(PARTNERS[v.to].n)+'<br><span class="meta">'+v.give.n+' '+esc(trName(v.give.k).toLowerCase())+' for '+v.get.n+' '+esc(trName(v.get.k).toLowerCase())+'</span></td><td>'+(S.day<v.arr?'arrives in '+(v.arr-S.day)+' d':'home in '+Math.max(0,v.back-S.day)+' d')+'</td></tr>';}).join('')+'</table>';
  side+='<h3>Villages</h3><div class="wlist">'+ids.map(q=>{const ok=partnerOk(q),r=relOf(q),ban=((S.tg[q]||{}).ban||0)>S.day;return '<button type="button" class="wrow'+(trSel===q?' on':'')+'" data-tp="'+q+'" '+(ok?'':'disabled')+'><b>'+esc(PARTNERS[q].n)+'</b><span>'+(ok?relName(r)+' ('+Math.round(r)+') · '+tradeDays(q)+' days by sea'+((S.treq[q]||[]).length?' · '+(S.treq[q]||[]).length+' request'+((S.treq[q]||[]).length>1?'s':''):''):ban?'Angry after your raid':'Not open yet')+'</span></button>';}).join('')+'</div>';
  if(trSel&&partnerOk(trSel))side+=partnerCard(trSel);
  side+='</div>';
  w.innerHTML='<div class="wm" id="wmbox">'+worldSVG()+'<div class="whint">Drag to move · wheel or pinch to zoom · click a village</div></div>'+side;requestAnimationFrame(()=>{wInit($('wmbox'));const sd=w.querySelector('.wside');if(sd&&keep)sd.scrollTop=sc;});
  $('wfs-x').onclick=()=>{WMODE='raid';worldClose();};if($('tr-mkt'))$('tr-mkt').onclick=e=>{e.preventDefault();WMODE='raid';worldClose();marketPanel();};
  w.querySelectorAll('[data-tp]').forEach(b=>b.onclick=()=>{trSel=b.dataset.tp;trMsg='';tradePanel();});
  wireOffer(trSel);}
function partnerCard(id){const P=PARTNERS[id],r=relOf(id),why=tradeReady(id);
  let h='<h3>'+esc(P.n)+'</h3><div class="god"><div class="gh"><strong>'+relName(r)+'</strong> '+bar(r,relCol(r))+' <span class="num">'+Math.round(r)+'</span></div>'
    +'<div class="meta">Deals they like raise the relation; poor offers and raids lower it. A warmer village takes smaller margins and pays better at the Market ('+(relSell(id)>=1?'+':'')+Math.round((relSell(id)-1)*100)+'% when you sell).</div></div>';
  h+='<p class="meta">Pays well for '+P.wants.map(k=>trName(k).toLowerCase()).join(', ')+'. Sells cheaply: '+P.sells.filter(k=>TR_GOODS().includes(k)).map(k=>trName(k).toLowerCase()).join(', ')+'. '+tradeDays(id)+' days each way.</p>';
  const rq=S.treq[id]||[];
  h+='<h3>Their requests</h3>'+(rq.length?rq.map((q,i)=>{const can=!why&&trHave(q.k)>=q.n;return '<div class="wk"><button type="button" class="btn small'+(can?' primary':'')+'" data-rq="'+i+'" '+(can?'':'disabled')+'>Send</button><span class="meta">'+q.n+' '+esc(trName(q.k).toLowerCase())+' (you have '+trHave(q.k)+') → '+q.pay.n+' '+esc(trName(q.pay.k).toLowerCase())+' · '+(q.until-S.day)+' days left</span></div>';}).join(''):'<p class="meta">Nothing just now. New requests come every few days.</p>');
  const gl=TR_GOODS().filter(k=>trHave(k)>=1).sort((a,b)=>(P.wants.includes(b)-P.wants.includes(a))||trName(a).localeCompare(trName(b)));
  if(!gl.includes(trOffer.g))trOffer.g=gl[0]||'';const wl=['silver'].concat(TR_GOODS().filter(k=>k!==trOffer.g).sort((a,b)=>(P.sells.includes(b)-P.sells.includes(a))||trName(a).localeCompare(trName(b))));if(!wl.includes(trOffer.w))trOffer.w='silver';
  const opt=(l,v,f)=>l.map(k=>'<option value="'+k+'"'+(k===v?' selected':'')+'>'+esc(trName(k))+f(k)+'</option>').join('');
  h+='<h3>Make an offer</h3>'+(why?'<p class="meta">'+esc(why)+'.</p>':'')
    +'<div class="trf"><label>Send <input type="number" id="tr-gn" min="1" step="1" value="'+trOffer.gn+'"> <select id="tr-g">'+opt(gl,trOffer.g,k=>' ('+trHave(k)+')'+(P.wants.includes(k)?' ★':''))+'</select></label>'
    +'<label>For <input type="number" id="tr-wn" min="1" step="1" value="'+trOffer.wn+'"> <select id="tr-w">'+opt(wl,trOffer.w,k=>P.sells.includes(k)?' ★':'')+'</select></label></div>'
    +'<p class="meta" id="tr-val"></p><div class="acts"><button type="button" class="btn primary" id="tr-send" '+(why||!gl.length?'disabled':'')+'>Send the offer</button></div>'
    +(trMsg?'<div class="god" id="tr-msg">'+trMsg+'</div>':'');
  return h;}
function readOffer(){const g=$('tr-g'),w=$('tr-w');if(!g||!w)return null;trOffer.g=g.value;trOffer.w=w.value;trOffer.gn=Math.max(1,Math.floor(+$('tr-gn').value||1));trOffer.wn=Math.max(1,Math.floor(+$('tr-wn').value||1));return {g:{k:trOffer.g,n:trOffer.gn},w:{k:trOffer.w,n:trOffer.wn}};}
function wireOffer(id){if(!id||!$('tr-send'))return;
  const upd=()=>{const o=readOffer();if(!o||!o.g.k)return;const e=offerEval(id,o.g,o.w);$('tr-val').textContent='They value what you send at about '+Math.round(e.vg)+' silver and what you ask for at about '+Math.round(e.vw)+'. '+(o.g.n>trHave(o.g.k)?'You only have '+trHave(o.g.k)+'. ':'')+(cargoOf(o.g.k,o.g.n)>knarrCargo()||cargoOf(o.w.k,o.w.n)>knarrCargo()?'Too much for one knarr ('+knarrCargo()+'). ':'');};
  ['tr-g','tr-w','tr-gn','tr-wn'].forEach(k=>{const el=$(k);if(el){el.oninput=upd;el.onchange=()=>{upd();if(k==='tr-g'||k==='tr-w'){readOffer();tradePanel();}};}});upd();
  $('tr-send').onclick=()=>{const o=readOffer();if(!o)return;if(trHave(o.g.k)<o.g.n){toast('You only have '+trHave(o.g.k)+' '+trName(o.g.k).toLowerCase()+'.');return;}
    if(S.trOff&&S.trOff[id]===S.day){trMsg='<strong>'+esc(PARTNERS[id].n)+' will not hear another offer today.</strong> Their headman is tired of haggling; try again tomorrow.';tradePanel();return;}
    const e=offerEval(id,o.g,o.w),P=PARTNERS[id];
    if(e.v==='accept'){const w=sendDeal(id,o.g,o.w,clamp(Math.round((e.ratio-e.need)*25)+1,1,6),null);trMsg=w?esc(w)+'.':'<strong>'+esc(P.n)+' accepts.</strong> The knarr sails with '+o.g.n+' '+esc(trName(o.g.k).toLowerCase())+' and will be home in '+2*tradeDays(id)+' days with '+o.w.n+' '+esc(trName(o.w.k).toLowerCase())+'.';if(!w)save();}
    else if(e.v==='counter'){S.trCounter={id:id,g:o.g,w:{k:o.w.k,n:e.n},day:S.day};trMsg='<strong>'+esc(P.n)+' haggles:</strong> “For '+o.g.n+' '+esc(trName(o.g.k).toLowerCase())+' we give '+e.n+' '+esc(trName(o.w.k).toLowerCase())+', not '+o.w.n+'.”<div class="acts"><button type="button" class="btn small primary" id="tr-cok">Take it</button><button type="button" class="btn small" id="tr-cno">No</button></div>';}
    else{S.trOff=S.trOff||{};S.trOff[id]=S.day;relAdd(id,e.ratio<0.5?-3:-1);trMsg='<strong>'+esc(P.n)+' refuses.</strong> '+(e.ratio<0.5?'“Do you take us for fools?” The relation suffers.':'“That is not worth our while.” Offer more, or ask for less.');save();}
    tradePanel();};
  if($('tr-cok'))$('tr-cok').onclick=()=>{const c=S.trCounter;if(!c||c.id!==id){tradePanel();return;}const w=sendDeal(id,c.g,c.w,1,null);S.trCounter=null;trMsg=w?esc(w)+'.':'<strong>Done.</strong> The knarr sails for '+esc(PARTNERS[id].n)+' and will be home in '+2*tradeDays(id)+' days with '+c.w.n+' '+esc(trName(c.w.k).toLowerCase())+'.';save();tradePanel();};
  if($('tr-cno'))$('tr-cno').onclick=()=>{S.trCounter=null;trMsg='';tradePanel();};
  document.querySelectorAll('#wfs [data-rq]').forEach(b=>b.onclick=()=>{const q=(S.treq[id]||[])[+b.dataset.rq];if(!q)return;const w=sendDeal(id,{k:q.k,n:q.n},q.pay,8,q);trMsg=w?esc(w)+'.':'<strong>'+esc(PARTNERS[id].n)+' is glad.</strong> The knarr sails with '+q.n+' '+esc(trName(q.k).toLowerCase())+'; it will be home in '+2*tradeDays(id)+' days with '+q.pay.n+' '+esc(trName(q.pay.k).toLowerCase())+'.';save();tradePanel();});}
