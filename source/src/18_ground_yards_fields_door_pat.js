/* =================== ground: yards, fields, door paths =================== */
const FIELDS=new Set(['fodder','grain','flax']);
function jitterRing(c,pad,seed){const cx=(c.T[0]+c.Bt[0])/2,cy=(c.T[1]+c.Bt[1])/2,out=[];const corners=[c.T,c.R,c.Bt,c.L];
  for(let e=0;e<4;e++){const a=corners[e],b=corners[(e+1)%4];for(let k=0;k<3;k++){const p=lerp(a,b,k/3);const dx=p[0]-cx,dy=p[1]-cy,len=Math.hypot(dx,dy)||1;const j=pad+(h2(seed,e*3+k,77)-0.5)*7;out.push(p[0]+dx/len*j,p[1]+dy/len*j*0.6);}}return out;}
function summerProgress(){const yt=S.gameT%YEAR;return yt<SUMMER?yt/SUMMER:1;}
function drawField(b,c,win){
  const soil=win?'#D9DCD8':'#8A7558',rows=b.t==='fodder'?0:Math.max(b.w,b.h)*2;
  poly(P(c.T,c.R,c.Bt,c.L),win?'#DDE1DE':b.t==='fodder'?'#9AAA72':soil);
  const along=b.w>=b.h,n=along?b.h*3:b.w*3,p=summerProgress();
  if(b.t==='fodder'){if(win)return;ctx.strokeStyle=p<0.6?'#8FA368':'#B9B276';ctx.lineWidth=1.2;ctx.beginPath();
    for(let k=0;k<70;k++){const u=h2(b.id,k,81),v=h2(b.id,k,82);const a=lerp(lerp(c.T,c.R,u),lerp(c.L,c.Bt,u),v);const hgt=3+5*Math.min(1,p*1.6);ctx.moveTo(a[0],a[1]);ctx.lineTo(a[0]-1,a[1]-hgt);ctx.moveTo(a[0]+2,a[1]);ctx.lineTo(a[0]+3,a[1]-hgt*0.8);}ctx.stroke();return;}
  for(let k=0;k<n;k++){const f=(k+0.5)/n;const a=along?lerp(c.T,c.L,f):lerp(c.T,c.R,f),e=along?lerp(c.R,c.Bt,f):lerp(c.L,c.Bt,f);
    ctx.strokeStyle=win?'rgba(170,165,150,0.6)':'rgba(70,55,38,0.55)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(e[0],e[1]);ctx.stroke();
    if(win)continue;
    const g=Math.min(1,0.25+p*1.4);
    if(b.t==='grain'){ctx.strokeStyle=p>0.65?'#D6B865':'#93A86A';ctx.lineWidth=1.4;ctx.beginPath();for(let s=0;s<14;s++){const q=lerp(a,e,(s+0.5)/14);ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0]+1,q[1]-7*g);}ctx.stroke();}
    else if(b.t==='garden'){for(let s=0;s<8;s++){const q=lerp(a,e,(s+0.5)/8);ctx.fillStyle=s%2?'#6E8A4E':'#86A465';ctx.beginPath();ctx.ellipse(q[0],q[1]-2*g,3.2*g+0.6,2.2*g+0.4,0,0,6.3);ctx.fill();}}
    else if(b.t==='flax'){ctx.strokeStyle='#7E9A62';ctx.lineWidth=1.1;ctx.beginPath();for(let s=0;s<14;s++){const q=lerp(a,e,(s+0.5)/14);ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0],q[1]-8*g);}ctx.stroke();
      if(p>0.35&&p<0.8){ctx.fillStyle='#8EA3D6';for(let s=0;s<14;s+=2){const q=lerp(a,e,(s+0.5)/14);ctx.beginPath();ctx.arc(q[0],q[1]-8*g,1.4,0,6.3);ctx.fill();}}}
  }
}
function drawGround(b,win){
  if(typeof groundShape==='function'){const e0=elev[b.fy*N+b.fx]||2;ctx.save();ctx.translate(0,-e0);const done=groundShape(b,win);ctx.restore();if(done)return;}
  const e=elev[b.fy*N+b.fx]||2,c=fp(b);
  ctx.save();ctx.translate(0,-e);
  if(FIELDS.has(b.t)){ctx.fillStyle=win?'rgba(200,205,202,0.5)':'rgba(120,108,80,0.35)';const r=jitterRing(c,3,b.id);poly(r,ctx.fillStyle);drawField(b,inset(c,0.02),win);ctx.restore();return;}
  if(b.t==='harbour'||b.t==='shipyard'||b.t==='mill'){ctx.restore();return;}
  if(b.t==='th'){cobbles(b,c,win);ctx.restore();return;}
  const yard=(b.t==='pigpen'||b.t==='sheeppen')?(win?'rgba(210,213,208,0.8)':'rgba(150,134,100,0.62)'):b.t==='train'?(win?'rgba(216,218,213,0.85)':'rgba(190,176,136,0.75)'):(win?'rgba(214,217,213,0.7)':'rgba(160,150,112,0.42)');
  poly(jitterRing(c,7,b.id),win?'rgba(205,210,206,0.35)':'rgba(140,140,96,0.16)');
  poly(jitterRing(c,1,b.id+7),yard);
  /* worked earth: damp and dusty patches, pebbles and a worn track to the door */
  {const cx=(c.T[0]+c.Bt[0])/2,cy=(c.T[1]+c.Bt[1])/2,sw=Math.abs(c.R[0]-c.L[0])/2,shh=Math.abs(c.Bt[1]-c.T[1])/2,n=Math.min(14,4+b.w*b.h*2);
    for(let k=0;k<n;k++){const u=(h2(b.id,k,400)-0.5)*1.5,v=(h2(b.id,k,401)-0.5)*1.5;if(Math.abs(u)+Math.abs(v)>0.85)continue;const px=cx+u*sw,py=cy+v*shh,r=2+h2(b.id,k,402)*6;
      ctx.fillStyle=win?(k%2?'rgba(255,255,255,0.3)':'rgba(170,176,178,0.25)'):(k%2?'rgba(214,196,150,0.32)':'rgba(110,92,62,0.2)');ctx.beginPath();ctx.ellipse(px,py,r,r*0.5,0,0,6.3);ctx.fill();}
    if(zoom>1.1)for(let k=0;k<n;k++){const u=(h2(b.id,k,410)-0.5)*1.7,v=(h2(b.id,k,411)-0.5)*1.7;if(Math.abs(u)+Math.abs(v)>0.95)continue;const px=cx+u*sw,py=cy+v*shh;
      ctx.fillStyle=win?'#B9BCB8':'#8A8274';ctx.beginPath();ctx.ellipse(px,py+0.4,1.5,0.9,0,0,6.3);ctx.fill();ctx.fillStyle=win?'#E9EAE6':'#B8AE98';ctx.beginPath();ctx.ellipse(px-0.2,py-0.1,1.1,0.55,0,0,6.3);ctx.fill();}}
  if(!win){ctx.strokeStyle='rgba(95,122,80,0.75)';ctx.lineWidth=1.2;ctx.beginPath();const r=jitterRing(c,3,b.id+3);for(let i=0;i<r.length;i+=4){const x=r[i],y=r[i+1];ctx.moveTo(x-2,y);ctx.lineTo(x,y-4);ctx.lineTo(x+2,y);}ctx.stroke();}
  ctx.restore();
}
/* short dirt track from each workplace to the road next to it */
function doorPaths(win){
  ctx.strokeStyle=win?'#CFCABD':'rgba(178,160,122,0.8)';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();
  for(const b of B){if(DEF[b.t].road===false||FIELDS.has(b.t))continue;
    const st=sideTiles(b,doorSide(b));const mid=doorTile(b);
    if(mid&&inMap(mid[0],mid[1])&&!occ[mid[1]*N+mid[0]]&&DEF[b.t].cat!=='Decor'){const fx0=Math.min(Math.max(mid[0],b.fx),b.fx+b.w-1),fy0=Math.min(Math.max(mid[1],b.fy),b.fy+b.h-1);const a=iso((mid[0]*0.35+fx0*0.65),(mid[1]*0.35+fy0*0.65)),r=iso(mid[0],mid[1]),ei=elev[mid[1]*N+mid[0]]||2;ctx.moveTo(a[0],a[1]-ei);ctx.lineTo(r[0],r[1]-ei);}
    for(const p of st.concat(edgeTiles(b))){if(!inMap(p[0],p[1]))continue;const i=p[1]*N+p[0];if(!roads[i])continue;
      const fx=Math.min(Math.max(p[0],b.fx),b.fx+b.w-1),fy=Math.min(Math.max(p[1],b.fy),b.fy+b.h-1);const a=iso((p[0]+fx)/2,(p[1]+fy)/2),r=iso(p[0],p[1]);
      ctx.moveTo(a[0],a[1]-elev[i]);ctx.lineTo(r[0],r[1]-elev[i]);break;}}
  ctx.stroke();ctx.lineCap='butt';
}
/* roads: soft dirt band with darker edges, wheel ruts and a few pebbles */
function drawRoads(win,vis){
  const arms=[[1,0,HW/2,HH/2],[-1,0,-HW/2,-HH/2],[0,1,-HW/2,HH/2],[0,-1,HW/2,-HH/2]];
  const g=(sx,sy,u,v)=>[sx+(u-v)*HW,sy+(u+v)*HH];
  const list=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x;if(!roads[i]||ter[i]===T.RIVER)continue;const sx=(x-y)*HW,sy=(x+y)*HH-elev[i];if(!vis(sx,sy))continue;list.push([x,y,sx,sy]);}
  const addP=(p,c)=>{let ar=0;for(let k=0;k<c.length;k++){const q=c[k],r=c[(k+1)%c.length];ar+=q[0]*r[1]-r[0]*q[1];}if(ar<0)c=c.slice().reverse();p.moveTo(c[0][0],c[0][1]);for(let k=1;k<c.length;k++)p.lineTo(c[k][0],c[k][1]);p.lineTo(c[0][0],c[0][1]);};
  const pass=(w,col,jit)=>{const p=new Path2D();
    for(const q of list){const x=q[0],y=q[1],sx=q[2],sy=q[3];const ww=w+(jit?(h2(x,y,140)-0.5)*jit:0);
      addP(p,[g(sx,sy,-ww,-ww),g(sx,sy,ww,-ww),g(sx,sy,ww,ww),g(sx,sy,-ww,ww)]);
      for(const a of arms){const nx=x+a[0],ny=y+a[1];if(!inMap(nx,ny)||!roads[ny*N+nx])continue;const ww2=w+(jit?(h2(nx,ny,140)-0.5)*jit:0),wm=(ww+ww2)/2;
        const dz=(elev[y*N+x]-elev[ny*N+nx])/2,m=(u,v)=>{const r=g(sx,sy,u,v);r[1]+=dz;return r;};/* meet the neighbour half way in height, so slopes (grass to sand) stay joined */
        let c;if(a[0])c=[g(sx,sy,0,-ww),m(a[0]*0.5,-wm),m(a[0]*0.5,wm),g(sx,sy,0,ww)];else c=[g(sx,sy,-ww,0),m(-wm,a[1]*0.5),m(wm,a[1]*0.5),g(sx,sy,ww,0)];
        addP(p,c);}}
    ctx.fillStyle=col;ctx.fill(p,'nonzero');};
  pass(0.52,win?'rgba(150,150,140,0.12)':'rgba(96,100,58,0.2)',0.22);/* trampled grass shoulder */
  pass(0.4,win?'rgba(170,166,154,0.9)':'rgba(112,92,62,0.92)',0.16);/* dark damp edge */
  pass(0.35,win?'#D6D2C6':'#A88F68',0.14);
  pass(0.25,win?'#DCD8CD':'#B59E77',0.14);
  pass(0.12,win?'#E3DFD5':'#C2AD88',0.1);/* packed, sun-dried crown */
  /* mottled earth: damp hollows and paler dust, so the road is not one flat colour */
  for(const q of list){const x=q[0],y=q[1],sx=q[2],sy=q[3];for(let k=0;k<3;k++){const u=h2(x,y,200+k);const ox=(h2(x,y,203+k)-0.5)*20,oy=(h2(x,y,206+k)-0.5)*9,r=3+u*5;
    ctx.fillStyle=win?(k%2?'rgba(190,186,176,0.35)':'rgba(240,238,232,0.35)'):(k%2?'rgba(120,98,66,0.22)':'rgba(230,214,180,0.25)');ctx.beginPath();ctx.ellipse(sx+ox,sy+oy,r,r*0.5,0,0,6.3);ctx.fill();}
    if(!win&&h2(x,y,210)>0.86){ctx.fillStyle='rgba(92,104,110,0.45)';ctx.beginPath();ctx.ellipse(sx+(h2(x,y,211)-0.5)*10,sy+(h2(x,y,212)-0.5)*4,5,2.2,0,0,6.3);ctx.fill();ctx.fillStyle='rgba(200,214,220,0.35)';ctx.beginPath();ctx.ellipse(sx+(h2(x,y,211)-0.5)*10-1.5,sy+(h2(x,y,212)-0.5)*4-0.6,2.2,0.8,0,0,6.3);ctx.fill();}/* a puddle now and then */
    for(const a of arms){if(inMap(x+a[0],y+a[1])&&roads[(y+a[1])*N+x+a[0]])continue;/* edge stones where the road ends at grass */
      for(let k=0;k<2;k++){if(h2(x,y,230+k+a[0]*5+a[1]*9)<0.55)continue;const t=(h2(x,y,220+k+a[0]*5+a[1]*9)-0.5)*0.7,e=g(sx,sy,a[0]?a[0]*0.4:t,a[1]?a[1]*0.4:t);ctx.fillStyle=win?'#B4B0A6':'#8C857A';ctx.beginPath();ctx.ellipse(e[0],e[1]+0.5,2.2,1.3,0,0,6.3);ctx.fill();ctx.fillStyle=win?'#E6E4DE':'#B5AE9F';ctx.beginPath();ctx.ellipse(e[0]-0.3,e[1]-0.2,1.6,0.8,0,0,6.3);ctx.fill();}}}
  /* worn wheel ruts along straight runs */
  ctx.strokeStyle=win?'rgba(160,154,140,0.6)':'rgba(112,92,64,0.55)';ctx.lineWidth=1.6;ctx.beginPath();
  for(const q of list){const x=q[0],y=q[1],sx=q[2],sy=q[3];for(const a of [[1,0],[0,1]]){const nx=x+a[0],ny=y+a[1];if(!inMap(nx,ny)||!roads[ny*N+nx])continue;
    for(const o of [-0.1,0.1]){const A=a[0]?g(sx,sy,0,o):g(sx,sy,o,0),Bp=a[0]?g(sx,sy,1,o):g(sx,sy,o,1);ctx.moveTo(A[0],A[1]);ctx.lineTo(Bp[0],Bp[1]+elev[y*N+x]-elev[ny*N+nx]);}}}
  ctx.stroke();
  if(zoom>1.45){/* close-up: packed gravel, small stones with a lit top, hoof prints */
    for(const q of list){const x=q[0],y=q[1],sx=q[2],sy=q[3];
      for(let k=0;k<9;k++){const ox=(h2(x,y,150+k)-0.5)*22,oy=(h2(x,y,160+k)-0.5)*10,r=0.8+h2(x,y,170+k)*1.2;ctx.fillStyle=win?'rgba(150,146,136,0.8)':'rgba(120,104,80,0.75)';ctx.beginPath();ctx.ellipse(sx+ox,sy+oy+0.6,r,r*0.6,0,0,6.3);ctx.fill();ctx.fillStyle=win?'#E8E5DD':'#DCCDAE';ctx.beginPath();ctx.ellipse(sx+ox-0.2,sy+oy,r*0.75,r*0.42,0,0,6.3);ctx.fill();}
      if(!win&&h2(x,y,180)>0.6){ctx.strokeStyle='rgba(110,92,66,0.5)';ctx.lineWidth=0.8;for(let k=0;k<2;k++){const ox=(h2(x,y,181+k)-0.5)*14,oy=(h2(x,y,183+k)-0.5)*6;ctx.beginPath();ctx.arc(sx+ox,sy+oy,1.6,0.3,2.8);ctx.stroke();}}}}
  ctx.lineCap='butt';
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x;if(!roads[i]||ter[i]===T.RIVER)continue;const sx=(x-y)*HW,sy=(x+y)*HH-elev[i];if(!vis(sx,sy))continue;
    for(let k=0;k<3;k++){const u=h2(x,y,90+k);if(u<0.5)continue;ctx.fillStyle=win?'#BDB8AA':'#9A8F7C';ctx.beginPath();ctx.ellipse(sx+(h2(x,y,93+k)-0.5)*12,sy+(h2(x,y,96+k)-0.5)*6,1.6,1,0,0,6.3);ctx.fill();}
    if(!win){for(const a of arms){if(inMap(x+a[0],y+a[1])&&roads[(y+a[1])*N+x+a[0]])continue;if(h2(x,y,100+a[0]*3+a[1])<0.5)continue;const ex=sx+a[2]*0.55,ey=sy+a[3]*0.55;ctx.strokeStyle='rgba(95,122,80,0.8)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(ex-2,ey);ctx.lineTo(ex,ey-4);ctx.lineTo(ex+2,ey);ctx.stroke();}}}
}

/* Town Hall plaza: cobblestones over the whole plot, a darker kerb at the edge. Stones are batched by colour (3 fills). */
function cobbles(b,c,win){
  poly(jitterRing(c,6,b.id),win?'rgba(205,210,206,0.4)':'rgba(140,140,96,0.18)');
  poly(P(c.T,c.R,c.Bt,c.L),win?'#D2D5D1':'#9C9483');
  const n=b.w*4,m=b.h*4,cols=win?['#E4E7E3','#DADDD9','#CDD1CD']:['#B9B09C','#ADA490','#A39985'];
  const pt=(u,v)=>[c.T[0]+u*(c.R[0]-c.T[0])+v*(c.L[0]-c.T[0]),c.T[1]+u*(c.R[1]-c.T[1])+v*(c.L[1]-c.T[1])];
  const du=[(c.R[0]-c.T[0])/n,(c.R[1]-c.T[1])/n],dv=[(c.L[0]-c.T[0])/m,(c.L[1]-c.T[1])/m];
  for(let k=0;k<3;k++){ctx.fillStyle=cols[k];ctx.beginPath();
    for(let i=0;i<n;i++)for(let j=0;j<m;j++){if(Math.floor(h2(i+b.id,j,91)*3)!==k)continue;const off=(j%2)*0.5;const p=pt((i+off+0.5)/n,(j+0.5)/m);if((i+off+0.5)/n>1)continue;
      const s=0.36+0.06*h2(i,j,92);ctx.moveTo(p[0]-du[0]*s-dv[0]*s,p[1]-du[1]*s-dv[1]*s);ctx.lineTo(p[0]+du[0]*s-dv[0]*s,p[1]+du[1]*s-dv[1]*s);ctx.lineTo(p[0]+du[0]*s+dv[0]*s,p[1]+du[1]*s+dv[1]*s);ctx.lineTo(p[0]-du[0]*s+dv[0]*s,p[1]-du[1]*s+dv[1]*s);ctx.closePath();}
    ctx.fill();}
  ctx.strokeStyle=win?'rgba(150,152,148,0.7)':'rgba(96,86,70,0.65)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(c.L[0],c.L[1]);ctx.lineTo(c.Bt[0],c.Bt[1]);ctx.lineTo(c.R[0],c.R[1]);ctx.stroke();
}
