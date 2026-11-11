/* =================== light: time of day, colour grade, shadows, night lights ("Frost & Ember", Beta 0.12) ===================
   One light cycle lasts 3 game days, so dawn, dusk and night come now and then rather than every day.
   Summer: long warm day, short dawn/dusk, short blue night. Winter: shorter day, longer night.
   todForce (0..1) pins the cycle, for tests and screenshots. */
let todForce=null;
const TOD_CYCLE=3;
const TODP={
  day:  {grade:[255,160,70,.30],mul:[0,0,0,0],fog:[235,205,160,.30],sun:[.08,.0,255,210,140,.28],vign:.22,sh:[1,.34,15,.26],lights:0},
  dawn: {grade:[255,165,150,.34],mul:[90,70,130,.14],fog:[235,185,190,.42],sun:[.92,.08,255,200,150,.45],vign:.30,sh:[-1,.30,34,.30],lights:.55},
  dusk: {grade:[255,110,50,.42],mul:[70,45,110,.16],fog:[240,150,90,.42],sun:[.04,.14,255,150,70,.55],vign:.36,sh:[1,.24,40,.34],lights:.85},
  night:{grade:[90,120,200,.22],mul:[120,140,195,.52],fog:[60,75,120,.30],sun:[.5,.0,0,0,0,0],vign:.48,sh:[.4,.5,10,.14],lights:1}};
const TODW={day:{grade:[190,205,235,.22],fog:[205,215,230,.30],sun:[.08,.0,235,225,210,.18]}};
const TOD_S=[[0,'night'],[.08,'night'],[.14,'dawn'],[.22,'day'],[.72,'day'],[.80,'dusk'],[.88,'night'],[1,'night']];
const TOD_W=[[0,'night'],[.16,'night'],[.22,'dawn'],[.30,'day'],[.62,'day'],[.70,'dusk'],[.78,'night'],[1,'night']];
function todPhase(){if(todForce!==null)return todForce;const c=DAY*TOD_CYCLE;return (((S.gameT||0)/c+0.3)%1+1)%1;}  /* a saga starts in the morning */
function todPreset(n,win){const p=TODP[n];return win&&TODW[n]?Object.assign({},p,TODW[n]):p;}
function lerpA(a,b,k){return a.map((v,i)=>v+(b[i]-v)*k);}
/* current light: smooth blend between the two neighbouring keys */
function todNow(win){const t=todPhase(),K=win?TOD_W:TOD_S;let i=0;while(i<K.length-2&&t>=K[i+1][0])i++;
  const a=K[i],b=K[i+1],k0=(t-a[0])/Math.max(1e-6,b[0]-a[0]),k=k0*k0*(3-2*k0);
  const A=todPreset(a[1],win),Bp=todPreset(b[1],win),o={};for(const key in A)o[key]=Array.isArray(A[key])?lerpA(A[key],Bp[key],k):A[key]+(Bp[key]-A[key])*k;
  o.name=k<.5?a[1]:b[1];return o;}
const rgbaA=(c,a)=>'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+','+Math.max(0,a).toFixed(3)+')';

/* rough building heights (in tile units) for cast shadows */
const SH_H={th:2.4,tower:3.0,hof:2.7,jarl:1.8,trade:1.6,tomb:1.1,market:.55,pen:.45,train:.35,camp:.35,bench:.2,wattle:.45,rune:1.1,herbs:.12,prow:.9,nets:.8,hives:.5,altar:.9,pyre:.8,salt:.6,thrall:.9};
function shHull(P){P=P.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);const lo=[],up=[];
  for(const p of P){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p);}
  for(let i=P.length-1;i>=0;i--){const p=P[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p);}return lo.slice(0,-1).concat(up.slice(0,-1));}
/* cast shadows on the ground (world transform), drawn once as a union so overlaps do not darken twice */
function drawShadows(win,vis){const L=todNow(win),s=L.sh;if(s[3]<=0.01||s[2]<1)return;
  const dx=s[0]*s[2],dy=s[1]*s[2],path=new Path2D();
  for(const b of BS){if(FIELDS.has(b.t)||(place&&place.moving===b))continue;const pp=iso(b.fx,b.fy);if(!vis(pp[0],pp[1])&&!vis(pp[0],pp[1]+120))continue;
    const c=fp(b),e=elev[b.fy*N+b.fx],h=(SH_H[b.t]!==undefined?SH_H[b.t]:1.25+0.15*(Math.min(b.w,b.h)-2));
    const k=.16,cx=(c.T[0]+c.Bt[0])/2,cy=(c.T[1]+c.Bt[1])/2,ins=p=>[p[0]+(cx-p[0])*k,p[1]-e+(cy-p[1])*k];
    const base=[ins(c.T),ins(c.R),ins(c.Bt),ins(c.L)],top=base.map(p=>[p[0]+dx*h,p[1]+dy*h]);
    const q=shHull(base.concat(top));if(q.length<3)continue;path.moveTo(q[0][0],q[0][1]);for(let i=1;i<q.length;i++)path.lineTo(q[i][0],q[i][1]);path.closePath();}
  if(zoom>=0.55)for(const o of objs){if(o.kind!=='tree'||o.gone)continue;const sx=(o.x-o.y)*HW+o.ox,sy=(o.x+o.y)*HH-elev[o.y*N+o.x]+o.oy;if(!vis(sx,sy))continue;
    const r=o.s*26;path.moveTo(sx+dx*.9+r,sy+dy*.6);path.ellipse(sx+dx*.9,sy+dy*.6,r,r*.45,0,0,6.3);}
  for(let i=0;i<N*N;i++){if(!walls[i])continue;const x=i%N,y=(i/N)|0,sx=(x-y)*HW,sy=(x+y)*HH-elev[i];if(!vis(sx,sy))continue;
    const h=.9;path.moveTo(sx-HW*.5,sy);path.lineTo(sx+HW*.5,sy);path.lineTo(sx+HW*.5+dx*h,sy+dy*h);path.lineTo(sx-HW*.5+dx*h,sy+dy*h);path.closePath();}
  ctx.fillStyle=rgbaA(win?[40,50,80]:[40,30,70],s[3]);ctx.fill(path,'nonzero');}

/* screen-space grade, then warm lights through the dark (called at the end of render) */
const LIT_BIG={th:1.6,smith:1.4,camp:1.5,pyre:1.3,bakery:1.2,smoke:1.1,brewery:1.1,jarl:1.3,hof:1.4,tower:1,market:1.2};
function drawLight(win,vis){const L=todNow(win);ctx.save();ctx.setTransform(dpr,0,0,dpr,0,0);
  if(L.mul[3]>0.01){ctx.globalCompositeOperation='multiply';ctx.fillStyle=rgbaA(L.mul,L.mul[3]);ctx.fillRect(0,0,W,H);}
  ctx.globalCompositeOperation='soft-light';ctx.fillStyle=rgbaA(L.grade,L.grade[3]);ctx.fillRect(0,0,W,H);
  ctx.globalCompositeOperation='source-over';
  const ov=lightOverlay(L);if(ov){ctx.globalCompositeOperation='screen';ctx.drawImage(ov.sun,0,0,W,H);ctx.globalCompositeOperation='source-over';ctx.drawImage(ov.base,0,0,W,H);}
  /* lamps: doors and windows glow, fires throw a warm pool */
  if(L.lights>0.02){ctx.setTransform(dpr*zoom,0,0,dpr*zoom,dpr*(W/2-camX*zoom),dpr*(H/2-camY*zoom));ctx.globalCompositeOperation='lighter';const a=L.lights;
    for(const b of BS){if(FIELDS.has(b.t)||b.t==='pigpen'||b.t==='sheeppen'||b.t==='bench'||b.t==='wattle'||b.t==='herbs'||b.t==='hives')continue;
      const st=sideTiles(b,SIDES[(b.rot||0)&3]);const m=st[Math.floor((st.length-1)/2)];if(!m)continue;
      const fx=(m[0]+(b.fx+b.w/2-.5))/2,fy=(m[1]+(b.fy+b.h/2-.5))/2;const sx=(fx-fy)*HW,sy=(fx+fy)*HH-elev[b.fy*N+b.fx];if(!vis(sx,sy))continue;
      const k=LIT_BIG[b.t]||1,R=34*k;ctx.globalAlpha=a;ctx.drawImage(GLOW,sx-R,sy-6-R,R*2,R*2);ctx.globalAlpha=1;ctx.fillStyle='rgba(255,214,150,'+(0.85*a).toFixed(3)+')';ctx.fillRect(sx-2,sy-15,4,5);}
  }
  ctx.restore();}

/* a soft warm glow, drawn once and stamped for every lamp */
const GLOW=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,170,80,0.42)');r.addColorStop(1,'rgba(255,120,40,0)');g.fillStyle=r;g.fillRect(0,0,64,64);return c;})();
/* haze, sun glow and vignette change slowly: rebuild them at low resolution only when the light has moved */
let LOV=null;
function lightOverlay(L){const w=Math.max(64,Math.round(W/4)),h=Math.max(64,Math.round(H/4));
  const key=[w,h,...L.fog.map(v=>Math.round(v*(v<=1?50:1/4))),...L.sun.map(v=>Math.round(v*(v<=1?50:1/4))),Math.round(L.vign*50)].join(',');
  if(LOV&&LOV.key===key)return LOV;
  const mk=()=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};const base=LOV&&LOV.w===w&&LOV.h===h?LOV.base:mk(),sun=LOV&&LOV.w===w&&LOV.h===h?LOV.sun:mk();
  let g=base.getContext('2d');g.clearRect(0,0,w,h);{const l=g.createLinearGradient(0,0,0,h);l.addColorStop(0,rgbaA(L.fog,L.fog[3]));l.addColorStop(.42,rgbaA(L.fog,0));g.fillStyle=l;g.fillRect(0,0,w,h);}
  if(L.vign>0.01){const r=g.createRadialGradient(w/2,h/2,Math.min(w,h)*.35,w/2,h/2,Math.max(w,h)*.75);r.addColorStop(0,'rgba(12,14,26,0)');r.addColorStop(1,'rgba(12,14,26,'+L.vign.toFixed(3)+')');g.fillStyle=r;g.fillRect(0,0,w,h);}
  g=sun.getContext('2d');g.clearRect(0,0,w,h);if(L.sun[5]>0.01){const x=w*L.sun[0],y=h*L.sun[1],r=g.createRadialGradient(x,y,0,x,y,Math.max(w,h)*.5);r.addColorStop(0,rgbaA(L.sun.slice(2),L.sun[5]));r.addColorStop(1,rgbaA(L.sun.slice(2),0));g.fillStyle=r;g.fillRect(0,0,w,h);}
  LOV={key,w,h,base,sun};return LOV;}
