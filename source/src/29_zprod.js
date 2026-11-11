/* =================== production panel and upgrades list =================== */
let prodSel='food';
const PROD_GROUPS=[['Food',['food'].concat(FOOD)],['Materials',['wood','planks','iron','tools']],
  ['Farms and herds',['fodder','grain','flax','honey','wool','hides']],['Crafts',['flour','cloth','rope','clothes','ale','mead']],['Weapons',ARMS]];
const fmtA=v=>v>=10?Math.round(v).toString():v>=1?(+v.toFixed(1)).toString():v>=0.05?(+v.toFixed(2)).toString():'0';
function prodRowData(k,key){if(k==='food'){const f=foodFlow(key);return {stock:foodUnits(),p:sumV(f.p),u:sumV(f.u)};}
  const f=flowOf(k,key)||{p:{},u:{}};return {stock:S.res[k]||0,p:sumV(f.p),u:sumV(f.u)};}
function prodShown(k){if(k==='food'||['wood','planks','iron','tools','fish','berries'].includes(k))return true;
  if(ARMS.includes(k)&&thLevel()<2)return false;const d=prodRowData(k);return d.stock>=0.5||d.p>0.01||d.u>0.01||resvOf(k)>0;}
function winterCell(k){if(FOOD.includes(k))return '<span class="meta" title="Counted for all food together">·</span>';const d=winterDays(k);if(d===null)return '<span class="meta">—</span>';const need=winterLeft();
  if(d>=need)return '<span class="up">all winter</span>';
  return '<span class="'+(d>=need?'up':'dn')+'">'+Math.floor(d)+' day'+(Math.floor(d)===1?'':'s')+'</span>';}
function resvCell(k){if(!RESV_ALL.includes(k))return '<span class="meta">—</span>';
  return '<span class="rvc"><button type="button" class="btn small" data-rv="'+k+'" data-d="-10" aria-label="Lower the '+esc(RNAME[k])+' reserve">−</button><b>'+resvOf(k)+'</b><button type="button" class="btn small" data-rv="'+k+'" data-d="10" aria-label="Raise the '+esc(RNAME[k])+' reserve">+</button></span>';}
/* the chain picture: raw goods on the left, the chosen good on the right */
function chainNode(r){const D=DEF[r.b],n=count(r.b),k=Object.keys(r.out)[0];
  const lockLv=r.lv||D.lvl,locked=lockLv>thLevel();
  return '<div class="chb'+(n?'':' none')+'" title="'+esc(D.desc||'')+'"><img alt="" src="'+buildThumb(r.b,1)+'"><b>'+esc(D.name)+'</b><em>makes '+Object.keys(r.out).map(j=>fmtA(r.out[j])+' '+resIco(j,13)).join(' ')+'</em><span>'+(n?n+' built':locked?'Town Hall '+lockLv:'not built')+'</span></div>';}
function chainHtml(k,depth,seen){const rs=recipesFor(k);
  if(!rs.length)return '<div class="chl">'+resIco(k,18)+'<span>'+(k==='silver'||k==='gold'?'Trade and raids':'Trade, raids and events')+'</span></div>';
  return '<div class="chalt">'+rs.map(r=>{const ins=Object.keys(r.in||{});
    const left=ins.length?'<div class="chi">'+ins.map(j=>'<div class="chr">'+(depth<3&&!seen.has(j)?chainHtml(j,depth+1,new Set([...seen,j])):'<div class="chl">'+resIco(j,18)+'<span>'+esc(RNAME[j])+'</span></div>')+'<span class="char"><i>'+fmtA(r.in[j])+'</i>'+resIco(j,14)+'<s></s></span></div>').join('')+'</div>':'';
    return '<div class="chn">'+left+chainNode(r)+'</div>';}).join('<div class="chor">or</div>')+'</div>';}
function chainBox(k){if(k==='food')return '<p class="meta">Food is every kind together. Pick a kind of food in the table to see how it is made.</p>';
  return '<div class="chain"><div class="chn">'+chainHtml(k,1,new Set([k]))+'<span class="char"><i></i><s></s></span><div class="chl end">'+resIco(k,22)+'<span>'+esc(RNAME[k])+'</span></div></div></div><p class="meta">Amounts per worker a day at level 1. Upgrades add 20–55%.</p>';}
function flowList(o,cls,meals){const e=Object.entries(o).sort((a,b)=>b[1]-a[1]);if(!e.length)return '<p class="meta">Nothing yet.</p>';
  return '<table class="t">'+e.map(x=>'<tr><td>'+esc(flowName(x[0]))+'</td><td class="'+cls+'">'+(cls==='up'?'+':'−')+fmtA(x[1])+'</td></tr>').join('')+'</table>';}
function prodPanel(){const key=isWinter()?'w':'s',F=S.flow&&S.flow[key],win=isWinter();
  const sc=$('sheet-card')&&$('sheet-card').dataset.p==='prod'?$('sheet-card').scrollTop:0;
  let h=head('Production',(win?'Winter':'Summer')+' average a day'+(F&&F.n?' · '+Math.min(F.n,30)+' day'+(F.n>1?'s':'')+' counted':' · counted from tomorrow'));
  const nx=TH_UP[thLevel()+1];
  h+='<div class="prbtns">'+(nx?'<button type="button" class="btn small" id="pr-th">Reserve for next Town Hall</button>':'')+'<button type="button" class="btn small" id="pr-clr">Clear reserves</button><span class="meta">Workshops never use goods below the reserve. Building and firewood still may.</span></div>';
  h+='<table class="t prodt"><thead><tr><th>Good</th><th>Store</th><th>Made</th><th>Used</th><th>Net</th><th title="How long the store lasts in winter, counting what stops in winter">Winter</th><th>Reserve</th></tr></thead><tbody>';
  for(const g of PROD_GROUPS){const ks=g[1].filter(prodShown);if(!ks.length)continue;
    h+='<tr class="grp"><td colspan="7">'+esc(g[0])+'</td></tr>';
    for(const k of ks){const d=prodRowData(k),net=d.p-d.u,nm=k==='food'?'All food (meals)':RNAME[k];
      h+='<tr class="pr'+(k===prodSel?' on':'')+(k==='food'?' tot':'')+'" data-pk="'+k+'"><td><span class="rn">'+resIco(k,16)+esc(nm)+'</span></td><td>'+fmt(d.stock)+'</td><td class="up">'+(d.p>0.01?'+'+fmtA(d.p):'')+'</td><td class="dn">'+(d.u>0.01?'−'+fmtA(d.u):'')+'</td><td class="'+(net>=0?'up':'dn')+'">'+(Math.abs(net)>=0.05?(net>0?'+':'−')+fmtA(Math.abs(net)):'0')+'</td><td>'+winterCell(k)+'</td><td>'+resvCell(k)+'</td></tr>';}}
  h+='</tbody></table>';
  const k=prodSel,nm=k==='food'?'Food':RNAME[k];
  h+='<h3>'+resIco(k,18)+' '+esc(nm)+': how it is made</h3>'+chainBox(k);
  const cur=k==='food'?foodFlow(key):(flowOf(k,key)||{p:{},u:{}});
  h+='<div class="prcols"><div><h3>Made by</h3>'+flowList(cur.p,'up')+'</div><div><h3>Used by</h3>'+flowList(cur.u,'dn')+'</div></div>';
  if(!win){const w=k==='food'?foodFlow('winter'):winterFlow(k);if(w)h+='<h3>On a winter day</h3><p class="meta">Expected from today’s village: fields, berries and bees rest, fishing falls, firewood triples.</p><div class="prcols"><div>'+flowList(w.p,'up')+'</div><div>'+flowList(w.u,'dn')+'</div></div>';}
  openSheet(h,'prod');const card=$('sheet-card');card.dataset.p='prod';card.scrollTop=sc;prodPanel.day=S.day;
  card.querySelectorAll('[data-pk]').forEach(r=>r.onclick=e=>{if(e.target.closest('[data-rv]'))return;prodSel=r.dataset.pk;prodPanel();});
  card.querySelectorAll('[data-rv]').forEach(b=>b.onclick=e=>{e.stopPropagation();const k=b.dataset.rv;setResv(k,resvOf(k)+(+b.dataset.d));prodPanel();save();});
  if($('pr-th'))$('pr-th').onclick=()=>{const c=TH_UP[thLevel()+1].cost,set=[];for(const j in c)if(RESV_ALL.includes(j)&&resvOf(j)<c[j]){setResv(j,c[j]);set.push(c[j]+' '+RNAME[j].toLowerCase());}
    toast(set.length?'Reserved for the next Town Hall: '+set.join(', ')+'. Workshops will leave these alone.':'The reserves already cover the next Town Hall.',4200);prodPanel();save();};
  $('pr-clr').onclick=()=>{for(const j of RESV_ALL)setResv(j,0);toast('All reserves cleared.');prodPanel();save();};}

/* --- upgrades list: a floating panel beside the dock --- */
let uplOpen=false,uplKey='',uplIdx={};
function upgradeItems(){const out=[],q=thReq(),th=B.find(b=>b.t==='th');
  const lack=c=>Object.keys(c).filter(j=>(S.res[j]||0)<c[j]).map(j=>Math.ceil(c[j]-(S.res[j]||0))+' '+RNAME[j].toLowerCase());
  if(q&&th&&!q.busy){const other=q.items.slice(0,2).filter(i=>!i.ok).map(i=>i.t),m=lack(q.cost);
    out.push({id:'th',name:'Town Hall',from:thLevel(),cost:q.cost,ok:q.ok,why:q.ok?'':other.concat(m.length?['Needs '+m.join(', ')+' more']:[]).join(' · '),bs:[th]});}
  const g={};for(const b of B){if(!canUpgrade(b))continue;const k=b.t+':'+b.lvl;(g[k]||(g[k]={t:b.t,lvl:b.lvl,bs:[]})).bs.push(b);}
  for(const k in g){const o=g[k],c=upCost(o.bs[0]),ok=afford(c);
    const miss=lack(c);
    out.push({id:k,name:DEF[o.t].name,from:o.lvl,cost:c,ok:ok,why:ok?'':'Needs '+miss.join(', ')+' more',bs:o.bs});}
  return out.sort((a,b)=>(b.ok-a.ok)||(a.id==='th'?-1:b.id==='th'?1:0)||a.name.localeCompare(b.name));}
function renderUpl(force){let el=$('upl');if(!uplOpen||titleOn||!isWide()||($('tray')&&!$('tray').hidden)){if(el)el.hidden=true;return;}
  if(!el){el=document.createElement('div');el.id='upl';el.className='upl';document.body.appendChild(el);}
  const L=upgradeItems(),key=L.map(o=>o.id+o.ok+o.bs.length+(o.why||'')).join('|');el.hidden=false;if(key===uplKey&&!force)return;uplKey=key;
  el.innerHTML='<div class="uph"><b>Upgrades</b><span>'+L.filter(o=>o.ok).length+' ready</span><button type="button" class="x" id="upl-x" aria-label="Close">×</button></div><div class="upb">'+(L.length?L.map((o,i)=>'<button type="button" class="upi'+(o.ok?' ok':'')+'" data-ui="'+i+'"><img alt="" src="'+buildThumb(o.bs[0].t,o.from)+'"><span><b>'+esc(o.name)+(o.bs.length>1?' ×'+o.bs.length:'')+'</b><em>level '+o.from+' → '+(o.from+1)+'</em><span class="cost">'+costHave(o.cost)+'</span>'+(o.why?'<em class="dn">'+esc(o.why)+'</em>':'')+'</span></button>').join(''):'<p class="meta">Nothing can be upgraded now. Buildings can rise one level below the Town Hall’s level.</p>')+'</div>';
  $('upl-x').onclick=()=>{uplOpen=false;renderUpl();renderDock();};
  el.querySelectorAll('[data-ui]').forEach(b=>b.onclick=()=>{const o=L[+b.dataset.ui],i=(uplIdx[o.id]||0)%o.bs.length;uplIdx[o.id]=i+1;if(mode!=='view')endMode();closeTray();focusOn(o.bs[i],true);});}
const upReady=()=>upgradeItems().filter(o=>o.ok).length;
setInterval(()=>{try{renderUpl();
  const bd=$('dk-upl')&&$('dk-upl').querySelector('.bdg');if(bd){const n=upReady();bd.textContent=n||'';bd.hidden=!n;}
  if(!$('sheet').hidden&&sheetKind==='prod'&&prodPanel.day!==S.day)prodPanel();}catch(e){}},700);
