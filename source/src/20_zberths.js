/* =================== berths (José, 2026-11-12) ===================
   A Harbour pier moors 2 ships, one on each side. The Shipyard has a small pier of its own with 1 berth.
   A finished ship goes to a Harbour with a free berth; if none is free it stays at the Shipyard;
   if that berth is taken too, the Shipyard cannot lay another keel. Ships at sea keep their berth. */
const HARBOUR_BERTHS=2,YARD_BERTHS=1;
const harboursUp=()=>B.filter(b=>b.t==='harbour'&&!underCons(b));
const yardsUp=()=>B.filter(b=>b.t==='shipyard'&&!underCons(b));
function berthCap(){return harboursUp().length*HARBOUR_BERTHS+yardsUp().length*YARD_BERTHS;}
/* ship id → {b: the building it lies at (null = nowhere: a harbour was pulled down), k: berth index} */
function shipPlaces(){const hs=harboursUp(),ys=yardsUp(),out={};
  const order=S.ships.slice().sort((a,c)=>((c.type==='knarr')-(a.type==='knarr'))||(a.id-c.id));
  order.forEach((s,i)=>{const hi=Math.floor(i/HARBOUR_BERTHS);if(hi<hs.length){out[s.id]={b:hs[hi],k:i%HARBOUR_BERTHS};return;}
    const yi=i-hs.length*HARBOUR_BERTHS;out[s.id]=yi<ys.length*YARD_BERTHS?{b:ys[Math.floor(yi/YARD_BERTHS)],k:0}:{b:null,k:0};});
  return out;}
const shipsAt=b=>{const pl=shipPlaces();return S.ships.filter(s=>pl[s.id]&&pl[s.id].b===b);};
const freeBerths=()=>Math.max(0,berthCap()-S.ships.length);
function berthLine(){const h=harboursUp().length,y=yardsUp().length,cap=berthCap(),n=S.ships.length;
  return '<div class="meta">Berths: <b>'+n+' / '+cap+'</b> used ('+h+' harbour'+(h===1?'':'s')+' × 2'+(y?' + shipyard pier × 1':'')+'). '+(n>=cap?'All berths are taken: build another Harbour to keep more ships.':(cap-n)+' free.')+'</div>';}
