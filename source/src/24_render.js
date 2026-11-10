/* =================== render =================== */
function render(){
  SHIP_HITS=[];
  const win=isWinter(),PL=win?C.w:C.s;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle=win?FOG.w:FOG.s;ctx.fillRect(0,0,W,H);
  ctx.setTransform(dpr*zoom,0,0,dpr*zoom,dpr*(W/2-camX*zoom),dpr*(H/2-camY*zoom));
  const vx0=camX-W/2/zoom-TW*2,vx1=camX+W/2/zoom+TW*2,vy0=camY-H/2/zoom-60,vy1=camY+H/2/zoom+160;
  const vis=(sx,sy)=>sx>vx0&&sx<vx1&&sy>vy0&&sy<vy1;
  for(let d=0;d<2*N-1;d++)for(let x=Math.max(0,d-N+1);x<=Math.min(N-1,d);x++){const y=d-x,sx=(x-y)*HW,sy=(x+y)*HH;if(vis(sx,sy))drawTile(x,y,PL,win);}
  for(const b of BS){const pp=iso(b.fx,b.fy);if(vis(pp[0],pp[1])||vis(pp[0],pp[1]+120))drawGround(b,win);}
  drawMoraleGlow();
  /* roads; on the river a road becomes a plank bridge */
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x;if(!roads[i]||ter[i]!==T.RIVER)continue;const sx=(x-y)*HW,sy=(x+y)*HH;if(!vis(sx,sy))continue;
    const rd=(a,b)=>inMap(a,b)&&roads[b*N+a];const alongX=(rd(x+1,y)||rd(x-1,y))&&!(rd(x,y+1)||rd(x,y-1))||(rd(x+1,y)&&rd(x-1,y));
    const g=(u,v,h)=>[sx+(u-v)*HW,sy+(u+v)*HH-h];const H=4;const U=alongX?[-0.52,0.52]:[-0.36,0.36],V=alongX?[-0.36,0.36]:[-0.52,0.52];
    const c=[g(U[0],V[0],H),g(U[1],V[0],H),g(U[1],V[1],H),g(U[0],V[1],H)],d=[g(U[1],V[0],0),g(U[1],V[1],0),g(U[0],V[1],0)];
    poly(P(c[1],c[2],d[1],d[0]),win?'#7D6A58':'#5C4634');poly(P(c[2],c[3],d[2],d[1]),win?'#8C7764':'#6E543D');
    poly(P(...c),win?'#A38E79':'#8F7255');
    ctx.strokeStyle=win?'rgba(90,74,60,0.6)':'rgba(70,52,38,0.55)';ctx.lineWidth=1;ctx.beginPath();
    for(let k=1;k<6;k++){const f=k/6;if(alongX){const a=g(U[0]+(U[1]-U[0])*f,V[0],H),b2=g(U[0]+(U[1]-U[0])*f,V[1],H);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}else{const a=g(U[0],V[0]+(V[1]-V[0])*f,H),b2=g(U[1],V[0]+(V[1]-V[0])*f,H);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}}ctx.stroke();
    /* rails */
    ctx.strokeStyle=win?'#6E5C4C':'#4E3B2C';ctx.lineWidth=1.6;ctx.beginPath();
    for(const vv of (alongX?[V[0],V[1]]:[U[0],U[1]])){const a=alongX?g(U[0],vv,H+7):g(vv,V[0],H+7),b2=alongX?g(U[1],vv,H+7):g(vv,V[1],H+7);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);
      for(const uu of [0,0.5]){const p0=alongX?g(U[0]+uu*(U[1]-U[0])*1.98,vv,H):g(vv,V[0]+uu*(V[1]-V[0])*1.98,H);ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p0[0],p0[1]-7);}}ctx.stroke();}
  drawRoads(win,vis);doorPaths(win);
  if(mode==='road')drawRoadGhost();
  if(mode==='road'||mode==='erase'){ctx.fillStyle='rgba(201,166,74,0.9)';for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x;if(roads[i]&&!conn[i]){const sx=(x-y)*HW,sy=(x+y)*HH-elev[i];if(vis(sx,sy)){ctx.beginPath();ctx.arc(sx,sy,3,0,6.3);ctx.fill();}}}}
  /* locked overlay (soft) + faint grid + owned-land border */
  const gridT=[],lockP=new Path2D();
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const sx=(x-y)*HW,sy=(x+y)*HH;if(!vis(sx,sy))continue;const top=sy-elev[y*N+x];
    if(!isUnl(x,y)){if(ter[y*N+x]!==T.SEA&&ter[y*N+x]!==T.MOUNT){lockP.moveTo(sx,top-HH);lockP.lineTo(sx+HW,top);lockP.lineTo(sx,top+HH);lockP.lineTo(sx-HW,top);lockP.lineTo(sx,top-HH);gridT.push(sx,top);}}
    else{ctx.strokeStyle='rgba(236,222,178,0.75)';ctx.lineWidth=1.4/zoom+0.5;ctx.beginPath();
      if(!isUnl(x+1,y)||x+1>=N){ctx.moveTo(sx+HW,top);ctx.lineTo(sx,top+HH);}
      if(!isUnl(x-1,y)||x-1<0){ctx.moveTo(sx,top-HH);ctx.lineTo(sx-HW,top);}
      if(!isUnl(x,y+1)||y+1>=N){ctx.moveTo(sx,top+HH);ctx.lineTo(sx-HW,top);}
      if(!isUnl(x,y-1)||y-1<0){ctx.moveTo(sx,top-HH);ctx.lineTo(sx+HW,top);}ctx.stroke();}}
  ctx.fillStyle='rgba(38,48,53,0.13)';ctx.fill(lockP,'nonzero');
  if(gridT.length&&zoom>0.5){ctx.strokeStyle=win?'rgba(60,70,76,0.08)':'rgba(255,255,255,'+(0.11*Math.min(1,(zoom-0.5)*3)).toFixed(3)+')';ctx.lineWidth=1/zoom;ctx.beginPath();for(let k=0;k<gridT.length;k+=2){const sx=gridT[k],top=gridT[k+1];ctx.moveTo(sx-HW,top);ctx.lineTo(sx,top-HH);ctx.lineTo(sx+HW,top);}ctx.stroke();}
  /* placement ghost footprint & range */
  let ghost=null;
  if(mode==='place'&&place){const ct=w2t(camX,camY),d=dims(place.t,place.rot),fx=ct[0]-Math.floor((d.w-1)/2),fy=ct[1]-Math.floor((d.h-1)/2);
    const chk=canPlace(place.t,fx,fy,place.rot,place.moving?place.moving.id:0);place.fx=fx;place.fy=fy;place.chk=chk;ghost={t:place.t,fx:fx,fy:fy,w:d.w,h:d.h,rot:place.rot};
    const D=DEF[place.t];
    if(D.need){const r=D.need.r;ctx.fillStyle='rgba(243,245,243,0.12)';for(let y=fy-r;y<fy+d.h+r;y++)for(let x=fx-r;x<fx+d.w+r;x++){if(!inMap(x,y))continue;const sx=(x-y)*HW,sy=(x+y)*HH-elev[y*N+x];poly([sx,sy-HH,sx+HW,sy,sx,sy+HH,sx-HW,sy],'rgba(243,245,243,0.13)');}}
    for(let y=fy;y<fy+d.h;y++)for(let x=fx;x<fx+d.w;x++){if(!inMap(x,y))continue;const sx=(x-y)*HW,sy=(x+y)*HH-elev[y*N+x];poly([sx,sy-HH,sx+HW,sy,sx,sy+HH,sx-HW,sy],chk.ok?'rgba(127,170,96,0.55)':'rgba(163,74,58,0.55)');}
    if(D.cat!=='Decor'&&!FIELDS.has(place.t)){const st=sideTiles({fx:fx,fy:fy,w:d.w,h:d.h},SIDES[place.rot&3]);const m=st[Math.floor((st.length-1)/2)];if(m&&inMap(m[0],m[1])){const sx=(m[0]-m[1])*HW,sy=(m[0]+m[1])*HH-elev[m[1]*N+m[0]];poly([sx,sy-HH*0.55,sx+HW*0.55,sy,sx,sy+HH*0.55,sx-HW*0.55,sy],'rgba(201,166,74,0.95)');ctx.fillStyle='#263035';ctx.font='bold 13px Inter, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('door',sx,sy+0.5);}}}
  /* selection outline */
  if(sel&&sel.b){const c=fp(sel.b),e=elev[sel.b.fy*N+sel.b.fx];ctx.strokeStyle='#F3F5F3';ctx.lineWidth=2.5/zoom+0.8;ctx.beginPath();ctx.moveTo(c.T[0],c.T[1]-e);ctx.lineTo(c.R[0],c.R[1]-e);ctx.lineTo(c.Bt[0],c.Bt[1]-e);ctx.lineTo(c.L[0],c.L[1]-e);ctx.closePath();ctx.stroke();}
  else if(sel&&sel.x!==undefined){const x=sel.x,y=sel.y,sx=(x-y)*HW,sy=(x+y)*HH-elev[y*N+x];ctx.strokeStyle='#F3F5F3';ctx.lineWidth=2.5/zoom+0.8;ctx.beginPath();ctx.moveTo(sx,sy-HH);ctx.lineTo(sx+HW,sy);ctx.lineTo(sx,sy+HH);ctx.lineTo(sx-HW,sy);ctx.closePath();ctx.stroke();}
  /* depth-ordered objects: nature, buildings, walkers, ghost */
  const dyn=[];
  for(const b of BS){if(place&&place.moving===b)continue;dyn.push({d:b.fx+b.w-1+b.fy+b.h-1+0.5,b:b});}
  for(const w of walkers)dyn.push({d:w.x+w.y+0.3,w:w});
  for(let i=0;i<N*N;i++)if(walls[i]){const x=i%N,y=(i/N)|0;if(vis((x-y)*HW,(x+y)*HH))dyn.push({d:x+y+0.45,wl:i});}
  if(ghost)dyn.push({d:ghost.fx+ghost.w-1+ghost.fy+ghost.h-1+0.6,g:ghost});
  dyn.sort((a,b)=>a.d-b.d);
  let di=0;
  const flushDyn=lim=>{while(di<dyn.length&&dyn[di].d<lim){const o=dyn[di++];
    if(o.b){const p=iso(o.b.fx,o.b.fy);if(vis(p[0],p[1]-60)||vis(p[0],p[1]+100))drawBuilding(o.b,win,1,false);}
    else if(o.w)drawWalker(o.w,win);
    else if(o.wl!==undefined)drawWallTile(o.wl,win);
    else if(o.g)drawBuilding(o.g,win,0.7,true);}};
  for(const o of objs){flushDyn(o.d);
    const sx=(o.x-o.y)*HW,sy=(o.x+o.y)*HH;if(!vis(sx,sy))continue;
    if(o.kind==='peak'){drawPeak(o,win);continue;}if(o.kind==='rocks'){drawRocks(o,win);continue;}if(o.kind==='iron'){drawIron(o);continue;}
    const a=isUnl(o.x,o.y)?1:0.72;
    if(o.kind==='tree'){if(!o.gone)drawTree(o,win,a);}
    else if(o.kind==='bush'&&!o.gone)drawSprite(SP.bush[win?1:(o.amt>0.5?0:2)],sx+o.ox,sy-elev[o.y*N+o.x]+o.oy,o.s,a,false);}
  flushDyn(Infinity);
  drawShipsAtHarbour(win);drawAnims(win);drawHover();
  for(const b of B)drawBadge(b);
  for(const p of smoke){ctx.fillStyle='rgba(220,225,224,'+(p.a*0.75).toFixed(3)+')';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.3);ctx.fill();}
  drawEdgeFog(win,vis);
  if(win){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='rgba(243,245,243,0.85)';for(const f of flakes){ctx.beginPath();ctx.arc(f.x*W+Math.sin(f.p)*6,f.y*H,f.s,0,6.3);ctx.fill();}}
}

/* The world fades into sea-mist at its edges, so it never reads as a floating board. */
const FOG={s:"#B9C6C8",w:"#CDD6D8"},FOGB=14;const FOGA=new Float32Array(N*N).fill(-1);
function drawEdgeFog(win,vis){const c=hex(win?FOG.w:FOG.s),cs='rgba('+c[0]+','+c[1]+','+c[2]+',';
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const de=Math.min(x,y,N-1-x,N-1-y);if(de>=FOGB)continue;const sx=(x-y)*HW,sy=(x+y)*HH;if(!vis(sx,sy))continue;
    const i=y*N+x;let a=FOGA[i];if(a<0){const n=(vn(x*0.3,y*0.3,79)-0.5)*0.25;a=Math.max(0,Math.min(1,Math.pow((FOGB-de)/FOGB,1.5)+n*(de/FOGB)));if(ter[i]===T.MOUNT)a=Math.pow(a,2.4)*0.85;FOGA[i]=a;}if(a<0.02)continue;
    const e=elev[y*N+x],top=sy-e;
    poly([sx,top-HH-6,sx+HW+8,top,sx,top+HH+14+Math.max(0,e),sx-HW-8,top],cs+a.toFixed(3)+')');}
}
