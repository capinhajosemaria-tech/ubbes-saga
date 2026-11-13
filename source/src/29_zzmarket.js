/* =================== Market panel (dock button) =================== */
/* José, 2026-11-12: one place to sell and buy every good, with each village that trades with Kaldstrand.
   Prices move with each deal and drift back over the days. Each partner keeps its own prices:
   selling lowers what that village pays, buying raises what it asks. A merchant in port still brings special orders (+50%). */
let mktPartner=null,mktQ=10,mktTab='Sell';
const MKT_Q=[1,10,50];
const MKT_GOODS=()=>Object.keys(BASEP).filter(k=>k!=='silver');
const mkS=(id,k)=>{S.mk2=S.mk2||{};const o=S.mk2[id]||{};return o[k]===undefined?1:o[k];};
const mkB=(id,k)=>{S.mb2=S.mb2||{};const o=S.mb2[id]||{};return o[k]===undefined?1:o[k];};
function mkSet(store,id,k,v){S[store]=S[store]||{};S[store][id]=S[store][id]||{};S[store][id][k]=v;}
const mktUnit=k=>k==='arrows'?10:1;   /* arrows are traded in bundles of 10 */
function buyAt(id,k){const P=PARTNERS[id];let p=BASEP[k]*1.45*(P.sells.includes(k)?0.85:1.2)*(BUYX[k]||1)*mkB(id,k);if(hasAdv('athelstan'))p*=0.85;if(ut('trader'))p*=0.87;p*=relBuy(id);return Math.max(0.5,p);}
function mktDeal(id,k){return S.trader&&S.trader.from===id?(S.trader.deals||[]).find(x=>x.k===k&&x.left>0):null;}
function sellAt(id,k){const P=PARTNERS[id];let p=BASEP[k]*(P.wants.includes(k)?1.35:1)*mkS(id,k);if(hasAdv('athelstan'))p*=1.2;if(jt('wise'))p*=1.1;if(ut('trader'))p*=1.15;p*=relSell(id);if(mktDeal(id,k))p*=1.5;
  /* never more than 85% of the cheapest asking price anywhere, so buying to sell again always loses */
  let lo=Infinity;for(const q of mktPartners())lo=Math.min(lo,buyAt(q,k));if(lo<Infinity)p=Math.min(p,lo*0.85);return Math.max(0.05,p);}
const mktPartners=()=>Object.keys(PARTNERS).filter(partnerOk);
function mktHave(k){return k==='thrall'?S.thralls:k==='pig'?S.herd.pigs:k==='sheep'?S.herd.sheep:Math.floor(S.res[k]||0);}
const mktName=k=>k==='thrall'?'Thralls':k==='pig'?'Pigs':k==='sheep'?'Sheep':(RNAME[k]||k);
/* room left in the stores for n units of k */
function mktRoom(k){if(k==='thrall')return Math.max(0,thrallCap()-S.thralls);if(k==='pig'||k==='sheep')return Math.max(0,herdCap()-herdTotal());
  if(FOOD.includes(k))return Math.max(0,Math.floor(capFood()-foodItems()));if(MAT.includes(k)&&k!=='tools')return Math.max(0,Math.floor(capMat()-matItems()));
  if(ARMS.includes(k))return Math.max(0,Math.floor((capArms()-armsItems())*(k==='arrows'?10:1)));return Infinity;}
const canSell=k=>k!=='pig'&&k!=='sheep';
/* sell n units (bundles for arrows); returns silver earned */
function mktSell(id,k,n){const u=mktUnit(k);n=Math.min(n,Math.floor(mktHave(k)/u));if(n<=0||!canSell(k))return 0;let got=0;
  for(let i=0;i<n;i++){got+=sellAt(id,k)*u;const d=mktDeal(id,k);if(d)d.left=Math.max(0,d.left-u);mkSet('mk2',id,k,Math.max(0.35,mkS(id,k)*(k==='gold'||k==='thrall'?0.94:Math.pow(0.993,u))));}
  if(k==='thrall')S.thralls-=n;else S.res[k]-=n*u;
  S.res.silver=(S.res.silver||0)+got;S.trades=(S.trades||0)+1;return got;}
/* buy n units; returns silver spent (0 if not enough silver or room) */
function mktBuy(id,k,n){const u=mktUnit(k);n=Math.min(n,Math.floor(mktRoom(k)/u));if(n<=0)return 0;let cost=0;const sv=S.mb2&&S.mb2[id]&&S.mb2[id][k];
  let m=0;for(let i=0;i<n;i++){const c=buyAt(id,k)*u;if(cost+c>(S.res.silver||0)+1e-9)break;cost+=c;m++;mkSet('mb2',id,k,Math.min(2.5,mkB(id,k)*(k==='gold'||k==='thrall'||k==='pig'||k==='sheep'?1.05:Math.pow(1.006,u))));}
  if(!m){mkSet('mb2',id,k,sv===undefined?1:sv);return 0;}
  S.res.silver-=cost;if(k==='thrall')S.thralls+=m;else if(k==='pig')S.herd.pigs+=m;else if(k==='sheep')S.herd.sheep+=m;else S.res[k]=(S.res[k]||0)+m*u;
  S.trades=(S.trades||0)+1;return cost;}
/* prices drift back toward normal: about a tenth of the gap each day */
function mktRecover(){for(const st of ['mk2','mb2']){const A=S[st];if(!A)continue;for(const id in A)for(const k in A[id]){const v=A[id][k];A[id][k]=1+(v-1)*0.9;if(Math.abs(A[id][k]-1)<0.005)delete A[id][k];}}}
{const _md=marketDay;marketDay=function(){_md.apply(this,arguments);mktRecover();};}
const pfmt=p=>p>=10?Math.round(p).toString():p.toFixed(1);
function marketPanel(){const ids=mktPartners(),sc=$('sheet-card')?$('sheet-card').scrollTop:0;
  let h=head('Market','Silver '+fmt(S.res.silver)+' · gold '+fmt(S.res.gold));
  if(thLevel()>=3)h+='<div class="acts"><button type="button" class="btn primary" id="m-trade">Trade map: offers by knarr</button></div><p class="meta">Here you sell and buy at once for silver. On the trade map you make offers to each village, answer their requests and build up friendships; the goods go by knarr.</p>';
  if(!tradeOpen()){h+='<p>Build a <strong>Harbour</strong> and a <strong>Trading House</strong> (Town Hall 3) to trade with other villages.</p>';}
  else if(!ids.length){h+='<p>No village trades with you yet.</p>';}
  if(!tradeOpen()||!ids.length){h+=mktPartnerList();openSheet(h,'market');if($('m-trade'))$('m-trade').onclick=()=>tradePanel();renderDock();return;}
  if(!ids.includes(mktPartner))mktPartner=ids[0];const id=mktPartner,P=PARTNERS[id];
  h+='<div class="tabs mtabs">'+ids.map(q=>'<button type="button" data-mp="'+q+'" aria-pressed="'+(q===id)+'">'+esc(PARTNERS[q].n)+(S.trader&&S.trader.from===q?' ⚓':'')+'</button>').join('')+'</div>';
  h+='<p class="meta">'+esc(P.n)+' pays more for '+P.wants.map(k=>mktName(k).toLowerCase()).join(', ')+' and sells '+P.sells.map(k=>mktName(k).toLowerCase()).join(', ')+' cheaper. Prices change with every deal and settle again over the days.'+(S.trader&&S.trader.from===id?' Its merchant is in port: special orders pay 50% more.':'')+'</p>';
  h+='<div class="wk"><span class="meta">Amount</span><div class="prio" role="group" aria-label="Amount per deal">'+MKT_Q.map(q=>'<button type="button" data-mq="'+q+'" aria-pressed="'+(q===mktQ)+'">'+q+'</button>').join('')+'</div><span class="meta">arrows in bundles of 10</span></div>';
  const rows=MKT_GOODS().sort((a,b)=>(P.wants.includes(b)-P.wants.includes(a))||(P.sells.includes(b)-P.sells.includes(a))||mktName(a).localeCompare(mktName(b)));
  h+='<table class="t mkt"><tr><th>Good</th><th>You have</th><th>Sell (each)</th><th>Buy (each)</th></tr>'+rows.map(k=>{const u=mktUnit(k),have=mktHave(k),sp=sellAt(id,k)*u,bp=buyAt(id,k)*u,n=mktQ;
    const sN=Math.min(n,Math.floor(have/u)),bN=Math.min(n,Math.floor(mktRoom(k)/u),Math.floor((S.res.silver||0)/bp));
    const tag=(P.wants.includes(k)?' <span class="meta">wanted</span>':'')+(mktDeal(id,k)?' <span class="meta">order: '+mktDeal(id,k).left+'</span>':'');
    const sDir=mkS(id,k)<0.97?' ▼':'',bDir=mkB(id,k)>1.03?' ▲':'';
    return '<tr><td>'+esc(mktName(k))+(u>1?' <span class="meta">×'+u+'</span>':'')+tag+'</td><td>'+have+'</td><td>'+(canSell(k)?'<button type="button" class="btn small" data-ms="'+k+'" '+(sN>0?'':'disabled')+'>Sell '+(sN||n)+'</button> <span class="meta">'+pfmt(sp)+sDir+'</span>':'<span class="meta">—</span>')+'</td><td><button type="button" class="btn small" data-mb="'+k+'" '+(bN>0?'':'disabled')+'>Buy '+(bN||n)+'</button> <span class="meta">'+pfmt(bp)+bDir+'</span></td></tr>';}).join('')+'</table>';
  h+=mktPartnerList();
  openSheet(h,'market');const card=$('sheet-card');card.scrollTop=sc;renderDock();hud();
  if($('m-trade'))$('m-trade').onclick=()=>tradePanel();
  card.querySelectorAll('[data-mp]').forEach(x=>x.onclick=()=>{mktPartner=x.dataset.mp;marketPanel();});
  card.querySelectorAll('[data-mq]').forEach(x=>x.onclick=()=>{mktQ=+x.dataset.mq;marketPanel();});
  card.querySelectorAll('[data-ms]').forEach(x=>x.onclick=()=>{const k=x.dataset.ms,g=mktSell(id,k,mktQ);if(g>0){toast('Sold to '+P.n+' for '+pfmt(g)+' silver.');checkMilestones();save();}marketPanel();});
  card.querySelectorAll('[data-mb]').forEach(x=>x.onclick=()=>{const k=x.dataset.mb,c=mktBuy(id,k,mktQ);if(c>0){toast('Bought from '+P.n+' for '+pfmt(c)+' silver.');checkMilestones();save();}else toast(mktRoom(k)<mktUnit(k)?'No room left in the stores.':'Not enough silver.');marketPanel();});}
function mktPartnerList(){return '<h3>Villages</h3><table class="t">'+Object.keys(PARTNERS).map(q=>{const P=PARTNERS[q],ok=partnerOk(q),ban=((S.tg[q]||{}).ban||0)>S.day;return '<tr><td>'+esc(P.n)+'</td><td>'+(ok?'Trades with you':ban?'Angry after your raid':'Not yet')+'</td></tr>';}).join('')+'</table>';}
