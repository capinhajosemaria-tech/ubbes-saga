/* =================== ground and roads: "trodden earth" (option B, chosen 2026-11-11) =================== */
/* ARTV 2 = released look (B). 1 and 3 were the other prototype options, kept for comparison in the test page (window.__setArt). 0 = the old look. */
let ARTV=2;
const _drawTile0=drawTile,_drawRoads0=drawRoads,_hall0=hall,_tileF0=tileF;
const AV={/* per-variant palette */
  1:{lush:'rgba(78,108,58,',dry:'rgba(196,184,120,',lite:'rgba(214,214,150,',tuft:'rgba(86,112,66,0.75)',tuft2:'rgba(150,160,96,0.7)',
     road:['rgba(92,100,58,0.22)','#7E6748','#987D58','#A98E68'],rut:'rgba(92,72,48,0.6)',mid:'#8E9B62'},
  2:{lush:'rgba(64,96,48,',dry:'rgba(186,170,104,',lite:'rgba(206,210,140,',tuft:'rgba(74,100,56,0.8)',tuft2:'rgba(160,166,100,0.75)',
     road:['rgba(80,84,50,0.28)','#5E4A34','#76603F','#84694A'],rut:'rgba(60,46,30,0.7)',mid:'#7C8A55'},
  3:{lush:'rgba(84,104,72,',dry:'rgba(168,160,120,',lite:'rgba(196,204,170,',tuft:'rgba(88,106,74,0.75)',tuft2:'rgba(140,120,128,0.7)',
     road:['rgba(90,96,70,0.22)','#6E6252','#8A7D6A','#988B76'],rut:'rgba(70,62,52,0.55)',mid:'#8A947A'},
  /* winter: slush and trodden snow over the mud */
  w:{road:['rgba(120,128,132,0.22)','#8E8A80','#ABA79D','#C4C1B8'],rut:'rgba(84,76,66,0.6)',mid:'#B9BCB8',tuft:'rgba(150,150,140,0.5)'}};
/* stronger large-scale colour drift, weaker per-tile noise: meadows read as one surface, not a chessboard */
tileF=function(x,y,i){if(!ARTV)return _tileF0(x,y,i);let f=TF[i];if(f<0){f=TF[i]=1+(vn(x*0.07,y*0.07,11)-0.5)*0.16+(vn(x*0.22,y*0.22,12)-0.5)*0.05+(h2(x,y,11)-0.5)*0.006;
  TDRY[i]=sat((vn(x*0.06,y*0.06,13)-0.38)*2.4)*0.7;}return f;};
function grassy(tt){return tt===T.GRASS||tt===T.FOREST||tt===T.BERRY;}
drawTile=function(x,y,PL,win){
  if(!ARTV||win)return _drawTile0(x,y,PL,win);
  const i=y*N+x,tt=ter[i];
  if(!grassy(tt)||occ[i]||roads[i]){_drawTile0(x,y,PL,win);return;}
  /* draw the base tile without the old patches/tufts: pretend zoom is low for the base call */
  const z0=zoom;zoom=0.5;_drawTile0(x,y,PL,win);zoom=z0;
  const A=AV[ARTV],e=elev[i],sx=(x-y)*HW,top=(x+y)*HH-e;
  /* big soft patches that cross tile edges (lush hollows, sun-dried tops) */
  const lush=vn(x*0.11,y*0.11,21),dry=TDRY[i];
  for(let k=0;k<3;k++){const ox=(h2(x,y,500+k)-0.5)*44,oy=(h2(x,y,503+k)-0.5)*20,rr=22+h2(x,y,506+k)*22;
    const c=k===0?A.lush+(0.05+lush*0.12).toFixed(3)+')':k===1?A.dry+(0.04+dry*0.16).toFixed(3)+')':A.lite+'0.07)';
    ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(sx+ox,top+oy,rr,rr*0.5,0,0,6.3);ctx.fill();}
  /* ambient occlusion: grass darkens next to buildings and forest edges */
  let nearB=0;for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+d[0],ny=y+d[1];if(inMap(nx,ny)&&occ[ny*N+nx])nearB++;}
  if(nearB){ctx.fillStyle='rgba(40,52,30,'+(0.06*nearB).toFixed(3)+')';ctx.beginPath();ctx.ellipse(sx,top,HW*0.9,HH*0.9,0,0,6.3);ctx.fill();
    if(ARTV===2){/* trampled, worn earth around busy buildings */ctx.fillStyle='rgba(140,116,80,'+(0.09*nearB).toFixed(3)+')';ctx.beginPath();ctx.ellipse(sx+(h2(x,y,520)-0.5)*16,top+(h2(x,y,521)-0.5)*6,14,6,0,0,6.3);ctx.fill();}}
  if(z0<0.7)return;
  /* clumps of grass: blades in two tones, density grows with zoom */
  const n=Math.round((ARTV===2?7:4)*Math.min(2.2,z0));ctx.lineWidth=z0>1.4?0.9:1.2;
  for(const pass of [0,1]){ctx.strokeStyle=pass?A.tuft2:A.tuft;ctx.beginPath();
    for(let k=0;k<n;k++){if((k%3===0)!==!!pass)continue;const ox=(h2(x,y,530+k)-0.5)*50,oy=(h2(x,y,560+k)-0.5)*22;if(Math.abs(ox)/HW+Math.abs(oy)/HH>1.05)continue;const hh=2.5+h2(x,y,590+k)*3.5;
      const px=sx+ox,py=top+oy;ctx.moveTo(px-2.2,py);ctx.lineTo(px-1.4,py-hh*0.8);ctx.moveTo(px,py);ctx.lineTo(px+0.3,py-hh);ctx.moveTo(px+2,py);ctx.lineTo(px+3,py-hh*0.75);}
    ctx.stroke();}
  if(ARTV===3){/* heather and lichen-grey stones bedded in the turf */
    if(h2(x,y,610)>0.62){ctx.fillStyle='rgba(126,92,116,0.45)';for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(sx+(h2(x,y,611+k)-0.5)*34+(k-1.5)*3,top+(h2(x,y,615+k)-0.5)*12,3.2,1.6,0,0,6.3);ctx.fill();}}
    if(h2(x,y,620)>0.8){const px=sx+(h2(x,y,621)-0.5)*30,py=top+(h2(x,y,622)-0.5)*12;ctx.fillStyle='rgba(60,64,58,0.25)';ctx.beginPath();ctx.ellipse(px+1,py+1.5,5,2.2,0,0,6.3);ctx.fill();
      ctx.fillStyle='#8C8A80';ctx.beginPath();ctx.ellipse(px,py,4.2,2.4,0,0,6.3);ctx.fill();ctx.fillStyle='#A9A79B';ctx.beginPath();ctx.ellipse(px-0.6,py-0.8,3,1.4,0,0,6.3);ctx.fill();
      ctx.fillStyle='rgba(190,196,120,0.7)';ctx.beginPath();ctx.arc(px+1.2,py-0.4,0.9,0,6.3);ctx.fill();}}
  if(z0>1.1&&h2(x,y,640)>(ARTV===2?0.7:0.82)){const fl=['#EFE9DA','#E8D36A','#C98FB8','#9DB2DD'][Math.floor(h2(x,y,641)*4)];ctx.fillStyle=fl;
    for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(sx+(h2(x,y,642)-0.5)*26+k*2.4,top+(h2(x,y,643)-0.5)*10-2-(k%2),1.1,0,6.3);ctx.fill();}}
};
/* roads: shared shape builder, three looks */
drawRoads=function(win,vis){
  if(!ARTV)return _drawRoads0(win,vis);
  const A=win?AV.w:AV[ARTV],arms=[[1,0],[-1,0],[0,1],[0,-1]];
  const g=(sx,sy,u,v)=>[sx+(u-v)*HW,sy+(u+v)*HH];
  const list=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x;if(!roads[i]||ter[i]===T.RIVER)continue;const sx=(x-y)*HW,sy=(x+y)*HH-elev[i];if(!vis(sx,sy))continue;list.push([x,y,sx,sy]);}
  const rd=(x,y)=>inMap(x,y)&&roads[y*N+x]&&ter[y*N+x]!==T.RIVER;
  const addP=(p,c)=>{let ar=0;for(let k=0;k<c.length;k++){const q=c[k],r=c[(k+1)%c.length];ar+=q[0]*r[1]-r[0]*q[1];}if(ar<0)c=c.slice().reverse();p.moveTo(c[0][0],c[0][1]);for(let k=1;k<c.length;k++)p.lineTo(c[k][0],c[k][1]);p.closePath();};
  const pass=(w,col,jit)=>{const p=new Path2D();
    for(const q of list){const [x,y,sx,sy]=q;const ww=w+(h2(x,y,140)-0.5)*jit;
      /* round-ish node so bends and ends look worn, not square */
      const nd=[];for(let k=0;k<8;k++){const a=k/8*6.283,r=ww*(0.92+0.16*h2(x,y,700+k));nd.push(g(sx,sy,Math.cos(a)*r,Math.sin(a)*r));}addP(p,nd);
      for(const a of arms){const nx=x+a[0],ny=y+a[1];if(!rd(nx,ny))continue;const ww2=w+(h2(nx,ny,140)-0.5)*jit,wm=(ww+ww2)/2;
        const dz=(elev[y*N+x]-elev[ny*N+nx])/2,m=(u,v)=>{const r=g(sx,sy,u,v);r[1]+=dz;return r;};
        let c;if(a[0])c=[g(sx,sy,0,-ww),m(a[0]*0.5,-wm),m(a[0]*0.5,wm),g(sx,sy,0,ww)];else c=[g(sx,sy,-ww,0),m(-wm,a[1]*0.5),m(wm,a[1]*0.5),g(sx,sy,ww,0)];addP(p,c);}}
    ctx.fillStyle=col;ctx.fill(p,'nonzero');};
  const plank=ARTV===3;
  pass(0.5,A.road[0],0.24);
  pass(plank?0.36:0.36,A.road[1],0.12);
  pass(plank?0.33:0.31,A.road[2],0.12);
  if(!plank)pass(0.2,A.road[3],0.1);
  if(plank){/* Hedeby-style plank street: boards laid across the way, gaps and a few darker, worn boards */
    const th=__thPos();ctx.lineWidth=1;
    for(const q of list){const [x,y,sx,sy]=q;const near=th&&Math.hypot(x-th[0],y-th[1])<14;
      if(!near){/* outside the core: gravel */for(let k=0;k<10;k++){const ox=(h2(x,y,800+k)-0.5)*26,oy=(h2(x,y,810+k)-0.5)*11;ctx.fillStyle=k%3?'rgba(110,100,86,0.7)':'rgba(190,180,160,0.8)';ctx.beginPath();ctx.ellipse(sx+ox,sy+oy,1.3,0.8,0,0,6.3);ctx.fill();}continue;}
      for(const a of arms){const nx=x+a[0],ny=y+a[1];const conn=rd(nx,ny);const L=conn?0.5:0.22;const dz=conn?(elev[y*N+x]-elev[ny*N+nx])/2:0;
        for(let s=0.02;s<L;s+=0.085){const u0=s,u1=s+0.07,ww=0.3+(h2(x+a[0]*7,y+a[1]*7,s*100|0)-0.5)*0.05,dd=dz*(s/0.5);
          const quad=a[0]?[g(sx,sy,a[0]*u0,-ww),g(sx,sy,a[0]*u1,-ww),g(sx,sy,a[0]*u1,ww),g(sx,sy,a[0]*u0,ww)]:[g(sx,sy,-ww,a[1]*u0),g(sx,sy,-ww,a[1]*u1),g(sx,sy,ww,a[1]*u1),g(sx,sy,ww,a[1]*u0)];
          quad.forEach(p=>p[1]+=dd);const hv=h2(x*3+a[0],y*3+a[1],s*1000|0);
          poly(P(...quad),hv>0.85?'#6E5640':hv>0.5?'#8C7052':'#9C8060');ctx.strokeStyle='rgba(50,36,24,0.45)';ctx.beginPath();ctx.moveTo(quad[0][0],quad[0][1]);ctx.lineTo(quad[3][0],quad[3][1]);ctx.stroke();}}}
  }else{
    /* wheel ruts: two darker tracks; option A keeps a grass strip between them (old two-track lane) */
    for(const q of list){const [x,y,sx,sy]=q;for(const a of [[1,0],[0,1]]){const nx=x+a[0],ny=y+a[1];if(!rd(nx,ny))continue;const dz=elev[y*N+x]-elev[ny*N+nx];
      const seg=(o,w,col)=>{const A0=a[0]?g(sx,sy,0,o):g(sx,sy,o,0),B0=a[0]?g(sx,sy,1,o):g(sx,sy,o,1);ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(A0[0],A0[1]);ctx.lineTo(B0[0],B0[1]+dz);ctx.stroke();};
      if(ARTV===1&&!(rd(x+a[1],y+a[0])||rd(x-a[1],y-a[0]))){seg(0,2.4,A.mid);}
      seg(-0.12,ARTV===2?2.6:1.8,A.rut);seg(0.12,ARTV===2?2.6:1.8,A.rut);
      if(ARTV===2){const hl=win?'rgba(236,238,236,0.6)':'rgba(170,146,104,0.5)';seg(-0.075,0.8,hl);seg(0.165,0.8,hl);}}}
    /* mottling, puddles, stones */
    for(const q of list){const [x,y,sx,sy]=q;
      for(let k=0;k<3;k++){const ox=(h2(x,y,203+k)-0.5)*20,oy=(h2(x,y,206+k)-0.5)*9,r=3+h2(x,y,200+k)*5;ctx.fillStyle=k%2?'rgba(70,54,36,0.18)':'rgba(220,200,160,0.16)';ctx.beginPath();ctx.ellipse(sx+ox,sy+oy,r,r*0.5,0,0,6.3);ctx.fill();}
      if(h2(x,y,210)>(ARTV===2?0.7:0.88)){const px=sx+(h2(x,y,211)-0.5)*12,py=sy+(h2(x,y,212)-0.5)*5;ctx.fillStyle='rgba(60,50,40,0.5)';ctx.beginPath();ctx.ellipse(px,py+0.6,6.5,2.8,0,0,6.3);ctx.fill();
        ctx.fillStyle=win?'rgba(206,222,230,0.9)':'rgba(120,148,160,0.75)';ctx.beginPath();ctx.ellipse(px,py,5.5,2.2,0,0,6.3);ctx.fill();ctx.fillStyle='rgba(225,236,240,0.55)';ctx.beginPath();ctx.ellipse(px-1.8,py-0.6,2.4,0.7,0,0,6.3);ctx.fill();}
      const ns=ARTV===2?5:3;for(let k=0;k<ns;k++){if(h2(x,y,90+k)<0.45)continue;const px=sx+(h2(x,y,93+k)-0.5)*24,py=sy+(h2(x,y,96+k)-0.5)*10,r=1.2+h2(x,y,99+k)*1.4;
        ctx.fillStyle='rgba(50,40,30,0.35)';ctx.beginPath();ctx.ellipse(px+0.5,py+0.7,r+0.4,r*0.6,0,0,6.3);ctx.fill();ctx.fillStyle='#8E867A';ctx.beginPath();ctx.ellipse(px,py,r,r*0.62,0,0,6.3);ctx.fill();ctx.fillStyle='#B8B0A0';ctx.beginPath();ctx.ellipse(px-0.3,py-0.3,r*0.6,r*0.32,0,0,6.3);ctx.fill();}}
  }
  /* ragged grass edge: tufts leaning over the road where it meets the meadow */
  if(win)return;
  ctx.strokeStyle=A.tuft;ctx.lineWidth=1.1;ctx.beginPath();
  for(const q of list){const [x,y,sx,sy]=q;for(const a of arms){if(rd(x+a[0],y+a[1]))continue;const nx=x+a[0],ny=y+a[1];if(!inMap(nx,ny)||occ[ny*N+nx]||!grassy(ter[ny*N+nx]))continue;
    for(let k=0;k<4;k++){const t2=(h2(x,y,900+k+a[0]*5+a[1]*9)-0.5)*0.8;const e=g(sx,sy,a[0]?a[0]*0.36:t2,a[1]?a[1]*0.36:t2);const hh=3+h2(x,y,910+k)*2.5;ctx.moveTo(e[0]-1.8,e[1]);ctx.lineTo(e[0]-1,e[1]-hh*0.8);ctx.moveTo(e[0],e[1]);ctx.lineTo(e[0]+0.4,e[1]-hh);ctx.moveTo(e[0]+1.8,e[1]);ctx.lineTo(e[0]+2.6,e[1]-hh*0.75);}}}
  ctx.stroke();
};
function __thPos(){const t=B.find(b=>b.t==='th');return t?[t.fx+t.w/2,t.fy+t.h/2]:null;}
/* buildings: contact shadow, damp grime at the foot of the walls, moss/lichen on the footing */
let __hallDepth=0;
hall=function(c,wh,rh,alongX,o,win){
  if(!ARTV||win||!window.__GRIME)return _hall0(c,wh,rh,alongX,o,win);
  if(__hallDepth===0){poly(P([c.L[0]-6,c.L[1]+1],[c.Bt[0],c.Bt[1]+5],[c.R[0]+6,c.R[1]+1],[c.T[0],c.T[1]-3]),'rgba(36,44,28,0.16)');}
  __hallDepth++;let r;try{r=_hall0(c,wh,rh,alongX,o,win);}finally{__hallDepth--;}
  if(__hallDepth)return r;
  const faces=[[c.L,c.Bt],[c.Bt,c.R]];
  for(const f of faces){const a=f[0],b=f[1];const gr=ctx.createLinearGradient(0,Math.max(a[1],b[1]),0,Math.max(a[1],b[1])-wh*0.6);
    const s=ARTV===2?0.34:ARTV===3?0.26:0.2;gr.addColorStop(0,'rgba(34,26,18,'+s+')');gr.addColorStop(1,'rgba(34,26,18,0)');
    ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(b[0],b[1]-wh*0.6);ctx.lineTo(a[0],a[1]-wh*0.6);ctx.closePath();ctx.fill();
    if(f===faces[0]){ctx.strokeStyle='rgba(255,236,200,0.18)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a[0],a[1]-wh+4);ctx.lineTo(b[0],b[1]-wh+4);ctx.stroke();}
    if(ARTV>=2){ctx.strokeStyle=ARTV===3?'rgba(200,200,190,0.16)':'rgba(30,22,14,0.16)';ctx.lineWidth=0.9;ctx.beginPath();const sd=(a[0]*3+a[1])|0;
      for(let k=0;k<9;k++){const u=h2(sd,k,950),p=lerp(a,b,u),len=wh*(0.25+0.5*h2(sd,k,951));ctx.moveTo(p[0],p[1]-wh+4);ctx.lineTo(p[0],p[1]-wh+4+len);}ctx.stroke();}
    ctx.fillStyle=ARTV===3?'rgba(196,200,120,0.6)':'rgba(96,124,66,0.6)';const sd=(a[0]*5+a[1]*3)|0;for(let k=0;k<(ARTV===2?7:4);k++){const p=lerp(a,b,h2(sd,k,960));ctx.beginPath();ctx.ellipse(p[0],p[1]-1.5,1.8+h2(sd,k,961)*1.6,0.9,0,0,6.3);ctx.fill();}
  }
  return r;
};
window.__setArt=v=>{ARTV=v;TF.fill(-1);TKEY.fill(-1);};

/* door paths: same trodden earth as the roads, thinner, and they stop at the road's edge instead of running over it */
const _doorPaths0=doorPaths;
doorPaths=function(win){if(!ARTV)return _doorPaths0(win);
  const A=win?AV.w:AV[ARTV],segs=[];
  for(const b of B){if(DEF[b.t].road===false||FIELDS.has(b.t)||DEF[b.t].cat==='Decor'||underCons(b))continue;
    const st=sideTiles(b,doorSide(b)),mid=doorTile(b);if(!mid||!inMap(mid[0],mid[1]))continue;
    const fx0=Math.min(Math.max(mid[0],b.fx),b.fx+b.w-1),fy0=Math.min(Math.max(mid[1],b.fy),b.fy+b.h-1),door=[mid[0]*0.42+fx0*0.58,mid[1]*0.42+fy0*0.58],ei=elev[mid[1]*N+mid[0]]||2;
    const mi=mid[1]*N+mid[0];
    if(roads[mi]){/* the road is right at the door: a short apron up to its edge */const r=[mid[0],mid[1]],d=Math.hypot(door[0]-r[0],door[1]-r[1]),k=Math.min(1,0.34/d);segs.push([door,[r[0]+(door[0]-r[0])*k,r[1]+(door[1]-r[1])*k],ei]);continue;}
    if(occ[mi])continue;
    /* find the nearest road tile beside the front tile or along the building */
    let best=null;for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){const x=mid[0]+d[0],y=mid[1]+d[1];if(inMap(x,y)&&roads[y*N+x]){best=[x,y];break;}}
    if(!best){for(const p of st.concat(edgeTiles(b))){if(inMap(p[0],p[1])&&roads[p[1]*N+p[0]]){best=p;break;}}}
    if(!best){segs.push([door,[mid[0],mid[1]],ei]);continue;}
    const r=[best[0],best[1]];segs.push([door,[mid[0],mid[1]],ei]);
    const d=Math.hypot(mid[0]-r[0],mid[1]-r[1]),k=d>0?Math.min(1,0.34/d):0;segs.push([[mid[0],mid[1]],[r[0]+(mid[0]-r[0])*k,r[1]+(mid[1]-r[1])*k],ei]);}
  if(!segs.length)return;
  const line=(w,col)=>{ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();for(const s of segs){const a=iso(s[0][0],s[0][1]),c=iso(s[1][0],s[1][1]);ctx.moveTo(a[0],a[1]-s[2]);ctx.lineTo(c[0],c[1]-s[2]);}ctx.stroke();};
  line(9,A.road[0]);line(6.2,A.road[1]);line(4.4,A.road[2]);line(1.8,A.road[3]);
  ctx.lineCap='butt';ctx.lineJoin='miter';
  /* a few stones on the path */
  if(zoom>0.9)for(const s of segs){const a=iso(s[0][0],s[0][1]),c=iso(s[1][0],s[1][1]);for(let k=0;k<2;k++){const u=h2(a[0]|0,c[0]|0,970+k);if(u<0.4)continue;const p=[a[0]+(c[0]-a[0])*u,a[1]+(c[1]-a[1])*u-s[2]];ctx.fillStyle=win?'#A9A69E':'#8E867A';ctx.beginPath();ctx.ellipse(p[0]+(k?2:-2),p[1],1.3,0.8,0,0,6.3);ctx.fill();}}
};
