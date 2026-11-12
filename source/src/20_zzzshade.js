/* =================== shadows and ground that follow each building's shape (José, 2026-11-12) ===================
   shShape(b) gives the solids that cast the shadow: {pts, h} (a box) or {pts, parts:[[points, h], ...]} (a gable, hip, pyramid or lean-to:
   the shadow is the outline of every point pushed along the sun by its own height). Heights in px of the drawing, / SHPX.
   Every redrawn building now has its own solids; the ground patch under a plot hugs those solids instead of filling the square. */
const SHPX=35;
function shKit(f){const P=(a,c)=>f(a,c,0),rect=(a,c,sa,sc)=>[P(a-sa,c-sc),P(a+sa,c-sc),P(a+sa,c+sc),P(a-sa,c+sc)];
  return {
    /* plain box */box:(a,c,sa,sc,hp)=>({pts:rect(a,c,sa,sc),h:hp/SHPX}),
    /* gable house: ridge along a; walls hW px, ridge hR px */
    gable:(a,c,sa,sc,hW,hR,ov)=>{ov=ov||0.06;const ft=rect(a,c,sa,sc);return {pts:ft,parts:[[ft,0],[rect(a,c,sa+ov,sc+ov),hW/SHPX],[[P(a-sa-ov,c),P(a+sa+ov,c)],hR/SHPX]]};},
    /* gable with the ridge across (along c) */
    gableC:(a,c,sa,sc,hW,hR,ov)=>{ov=ov||0.06;const ft=rect(a,c,sa,sc);return {pts:ft,parts:[[ft,0],[rect(a,c,sa+ov,sc+ov),hW/SHPX],[[P(a,c-sc-ov),P(a,c+sc+ov)],hR/SHPX]]};},
    /* hip roof: the ridge is shorter by the roof's half width */
    hip:(a,c,sa,sc,hW,hR,ov)=>{ov=ov||0.08;const ft=rect(a,c,sa,sc),r=Math.max(0.05,sa-sc);return {pts:ft,parts:[[ft,0],[rect(a,c,sa+ov,sc+ov),hW/SHPX],[[P(a-r,c),P(a+r,c)],hR/SHPX]]};},
    /* pyramid roof on a square: eaves hW, apex hR */
    pyr:(a,c,s,hW,hR)=>{const ft=rect(a,c,s,s);return {pts:ft,parts:[[ft,0],[ft,hW/SHPX],[[P(a,c)],hR/SHPX]]};},
    /* lean-to rising toward +c: back edge hB, front edge hF */
    lean:(a,c,sa,sc,hB,hF)=>{const ft=rect(a,c,sa,sc);return {pts:ft,parts:[[ft,0],[[P(a-sa,c-sc),P(a+sa,c-sc)],hB/SHPX],[[P(a-sa,c+sc),P(a+sa,c+sc)],hF/SHPX]]};},
    pole:(a,c,s,hp)=>({pts:rect(a,c,s,s),h:hp/SHPX})};}

{const _sh0=shShape;shShape=function(b){const t=b.t,L=Math.min(5,b.lvl||1);
  if(t==='house'&&HOUSE_OPT){const f=hoFrame(b),K=1.45,V=1.35,hl=[0.42,0.5,0.52,0.58,0.62][L-1]*K,hw=[0.4,0.44,0.46,0.5,0.52][L-1]*K,fh=3.2*V,wh=[10,11,12,13,14][L-1]*V,rh=[13,14,15,17,18][L-1]*V,k=shKit(f);
    const V2=[k.gable(0,0,hl,hw,fh+wh,fh+wh+rh,0.07)];if(L>=3){const sl=0.22*K,off=-hl-sl+0.02;V2.push(k.gable(off,0,sl,hw,wh-3*V,wh+rh-7*V,0.06));}return V2;}
  if(t==='jarl'&&JARL_OPT){const k=shKit(hoFrame(b)),hl=1.22,hw=0.8,pad=0.13,ph=7.5;return [k.box(0,0,hl+pad,hw+pad,ph),k.hip(0,0,hl,hw,ph+24,ph+24+26,0.1)];}
  if(t==='th'&&TH_OPT){const hb=thHallRect(b),f0=hoFrame({fx:hb.fx,fy:hb.fy,w:hb.w,h:hb.h,rot:b.rot}),k=shKit(f0),LL=thLevel(),lv=a=>a[LL-1],hl=lv([1.42,1.5,1.58,1.66,1.74]),hw=lv([0.82,0.86,0.9,0.94,0.98]),
      wh=lv([26,28,30,32,34]),rh=lv([34,37,40,43,46]),vl=0.5,pad=0.14,ph=LL>=4?13:9,off=vl/2,V2=[];
    V2.push(k.box(0,off,hl+pad,hw+off+pad,ph),k.hip(0,0,hl,hw,ph+wh,ph+wh+rh,0.12));
    /* vestibule toward the plaza (+c), its gable ridge across */V2.push(k.gableC(0,hw+vl/2,0.36,vl/2,ph+wh*0.74,ph+wh*0.74+20,0.06));
    if(LL>=3)V2.push(k.box(0,0,hl*0.16,0.1,ph+wh+rh+(LL>=5?13:11)+11));return V2;}
  if(t==='hof'&&HOF_OPT){const f0=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.w>=b.h?0:1}),k=shKit(f0),hl=1.32,hw=0.6,gw=0.2,pad=0.1,ph=5,wh=19,rh=22,top=ph+wh+rh;
    return [k.box(0,pad/2,hl+gw+pad,hw+gw+pad/2,ph+wh*0.62+6),k.gable(0,0,hl,hw,ph+wh,top,0.06),k.box(0,0,0.34,0.34,top+13),k.pyr(0,0,0.46,top+8,top+24),k.pyr(0,0,0.31,top+32,top+72),
      k.pole(hl+gw+pad+0.32,-hw-gw+0.05,0.06,47),k.box(hl+gw+pad+0.28,-hw-gw-0.42,0.17,0.17,6.6)];}
  if(t==='gran'&&GRAN_OPT){const f0=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.w>=b.h?0:1}),J=GRAN_SET[GRAN_OPT]||GRAN_SET[1],V2=[];
    const stab=(ao,co,s)=>{const k=shKit((a,c,h)=>f0(a*s+ao,c*s+co,h));V2.push(k.gable(0,0,0.62,0.5,(9+11+10)*s,(9+11+10+13)*s,0.07));};
    if(J.barrack){const hh=L>=3?26:20,k=shKit(f0);V2.push(k.pyr(-0.82,0,0.42,hh,hh+12));}else if(L>=3)stab(-0.88,-0.28,0.7);
    stab(0.32,0,1);return V2;}
  if(t==='ware'&&WARE_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.w>=b.h?0:1}),hl=[0.95,1.0,1.05,1.12,1.25][L-1],hw=0.58,ao=L>=3?-0.18:0,k=shKit(f),V2=[k.gable(ao,0,hl,hw,3.2+18,3.2+18+13,0.07)];
    if(L>=3)V2.push(k.box(ao+hl+0.19,0,0.19,hw,12));return V2;}
  if(t==='wood'&&WOOD_OPT){const k=shKit(hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}));
    return [k.gable(-0.42,-0.38,0.42,0.36,2.6+11,2.6+11+11,0.06),k.box(0.45,-0.42,0.42,0.33,12),k.box(-0.35,0.62,0.4,0.12,L>=5?8:L>=3?7:5.5)];}
  if(t==='carp'&&CARP_OPT){const k=shKit(hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}));
    return [k.gable(-0.36,-0.4,L>=5?0.6:0.48,0.38,2.6+12,2.6+12+12,0.06),k.lean(0.42,0.18,0.55,0.37,10,14)];}
  if(t==='smith'&&SMITH_OPT){const k=shKit(hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}));
    return [k.gable(-0.38,-0.42,L>=5?0.56:0.46,0.36,2.6+12,2.6+12+12,0.06),k.lean(0.42,0.2,0.55,0.39,11,15),k.pole(0.17,0.3,0.08,23)];}
  if(t==='market'&&MK_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),k=shKit(f),V2=[];
    /* booths: back wall at -c of each booth's own frame, roof ~13 px */
    const booth=(a0,c0,face)=>{const fl=face.endsWith('-'),fc=face[0],ka=shKit(fc==='c'?(fl?(la,lc,h)=>f(a0-la,c0-lc,h):(la,lc,h)=>f(a0+la,c0+lc,h)):(fl?(la,lc,h)=>f(a0-lc,c0-la,h):(la,lc,h)=>f(a0+lc,c0+la,h)));V2.push(ka.lean(0,0,0.36,0.26,14,11));};
    booth(-1.38,-1.0,'a');booth(-0.25,-1.38,'c');booth(1.0,-1.38,'c');booth(-1.38,0.35,'a');booth(1.38,0.0,'a-');booth(0.0,1.38,'c-');booth(1.25,1.38,'c-');
    V2.push(k.pyr(0,0,0.3,14,22));return V2;}
  if(t==='harbour'&&HARB_OPT)return [];
  return _sh0(b);};}

/* ---------- the ground patch follows the building ---------- */
/* plots whose yard is the whole fenced or paved square keep the old patch */
const GS_KEEP=new Set(['pigpen','thrall','market','th','harbour','shipyard','mill']);
function gsHull(vols,m){const pts=[],n=10;for(const v of vols){const P2=v.pts||(v.parts&&v.parts[0][0]);if(!P2)continue;
    for(const p of P2)for(let k=0;k<n;k++){const t2=k/n*6.283;pts.push([p[0]+Math.cos(t2)*HW*m,p[1]+Math.sin(t2)*HH*m]);}}
  return pts.length>2?shHull(pts):null;}
{const _gs0=groundShape;groundShape=function(b,win){if(_gs0(b,win))return true;
  if(FIELDS.has(b.t)||GS_KEEP.has(b.t))return false;const vols=shShape(b);if(!vols||!vols.length)return false;
  const outer=gsHull(vols,0.5),inner=gsHull(vols,0.24);if(!outer||!inner)return false;const sd=(b.id||0)*11+3;
  const fill=(q,col)=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(q[0][0],q[0][1]);for(let i=1;i<q.length;i++)ctx.lineTo(q[i][0],q[i][1]);ctx.closePath();ctx.fill();};
  fill(outer,win?'rgba(205,210,206,0.3)':'rgba(140,140,96,0.14)');fill(inner,win?'rgba(214,217,213,0.62)':'rgba(160,150,112,0.38)');
  /* worked earth: a few damp and dusty spots and pebbles, only inside the trodden patch */
  ctx.save();ctx.beginPath();ctx.moveTo(inner[0][0],inner[0][1]);for(let i=1;i<inner.length;i++)ctx.lineTo(inner[i][0],inner[i][1]);ctx.closePath();ctx.clip();
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of inner){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}
  const n=Math.min(14,4+b.w*b.h*2);for(let k=0;k<n;k++){const px=x0+h2(sd,k,400)*(x1-x0),py=y0+h2(sd,k,401)*(y1-y0),r=2+h2(sd,k,402)*5;
    ctx.fillStyle=win?(k%2?'rgba(255,255,255,0.3)':'rgba(170,176,178,0.22)'):(k%2?'rgba(214,196,150,0.28)':'rgba(110,92,62,0.16)');ctx.beginPath();ctx.ellipse(px,py,r,r*0.5,0,0,6.3);ctx.fill();}
  if(zoom>1.1)for(let k=0;k<n;k++){const px=x0+h2(sd,k,410)*(x1-x0),py=y0+h2(sd,k,411)*(y1-y0);
    ctx.fillStyle=win?'#B9BCB8':'#8A8274';ctx.beginPath();ctx.ellipse(px,py+0.4,1.5,0.9,0,0,6.3);ctx.fill();ctx.fillStyle=win?'#E9EAE6':'#B8AE98';ctx.beginPath();ctx.ellipse(px-0.2,py-0.1,1.1,0.55,0,0,6.3);ctx.fill();}
  ctx.restore();return true;};}
