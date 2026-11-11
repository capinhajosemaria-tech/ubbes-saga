/* =================== animations: crews to the ships, ships at sea, palisade =================== */
const ANIMS=[];let SHIP_HITS=[];
function harbourDock(){const hb=B.find(b=>b.t==='harbour');if(!hb)return null;const sp=dockSpots(hb);if(!sp.length)return null;const d=sp[Math.floor(sp.length/2)];
  const cx=hb.fx+hb.w/2-0.5,cy=hb.fy+hb.h/2-0.5,dx=d.q[0]-cx,dy=d.q[1]-cy,L=Math.hypot(dx,dy)||1;return {hb:hb,land:[cx,cy],q:d.q,far:[d.q[0]+dx/L*24,d.q[1]+dy/L*24],flip:Math.abs(dx)>Math.abs(dy)};}
function animRaidOut(r){const th=B.find(b=>b.t==='th'),d=harbourDock();if(!th||!d)return;const n=Math.min(8,r.crew.length);
  for(let i=0;i<n;i++)ANIMS.push({k:'walk',a:[th.fx+4.6+(i%3)*0.35,th.fy+5.6+((i/3)|0)*0.3],b:[d.land[0]+(i%3)*0.3,d.land[1]+((i/3)|0)*0.3],t0:S.gameT+i*0.8,dur:DAY*0.32,c:pal[i%pal.length]});
  const sh=r.ships.map(shipById).filter(Boolean);sh.forEach((s,i)=>ANIMS.push({k:'sail',a:d.q,b:d.far,t0:S.gameT+DAY*0.36+i*2,dur:DAY*0.55,type:s.type,flip:d.flip}));}
function animRaidIn(r){const th=B.find(b=>b.t==='th'),d=harbourDock();if(!d)return;const sh=r.ships.map(shipById).filter(Boolean);
  sh.forEach((s,i)=>ANIMS.push({k:'sail',a:d.far,b:d.q,t0:S.gameT+i*2,dur:DAY*0.6,type:s.type,flip:d.flip,cargo:true}));
  if(th){const n=Math.min(8,r.crew.length);for(let i=0;i<n;i++)ANIMS.push({k:'walk',a:[d.land[0],d.land[1]],b:[th.fx+4.6+(i%3)*0.35,th.fy+5.6],t0:S.gameT+DAY*0.62+i*0.8,dur:DAY*0.32,c:pal[i%pal.length]});}}
function drawAnims(win){for(let i=ANIMS.length-1;i>=0;i--){const a=ANIMS[i],u=(S.gameT-a.t0)/a.dur;if(u>1.02||u<-50){ANIMS.splice(i,1);continue;}if(u<0)continue;
  if(a.k==='walk'){const x=a.a[0]+(a.b[0]-a.a[0])*u,y=a.a[1]+(a.b[1]-a.a[1])*u;drawWalker({x:x,y:y,c:a.c,ph:S.gameT*0.9+i,moving:true,carry:'spear'},win);}
  else if(a.k==='sail'){const e=u*u*(3-2*u),x=a.a[0]+(a.b[0]-a.a[0])*e,y=a.a[1]+(a.b[1]-a.a[1])*e,p=iso(x,y);const far=Math.min(1,Math.hypot(x-a.a[0],y-a.a[1])/24),out=a.b[0]!==a.a[0]&&Math.hypot(a.b[0]-x,a.b[1]-y)<3&&!a.cargo;
    ctx.globalAlpha=a.cargo?Math.min(1,u*3):Math.max(0,1-Math.max(0,u-0.75)*4);drawShip(p[0],p[1]+8+Math.sin(t*1.3+i)*1.2,0.36,a.flip,a.type==='knarr');ctx.globalAlpha=1;}}}
function drawWallTile(i,win){const x=i%N,y=(i/N)|0,e=elev[i]||2,sx=(x-y)*HW,sy=(x+y)*HH-e;const v=walls[i];
  const col=win?'#8E7A66':'#7A5F46',dk=win?'#6E5E50':'#5C4634';
  const stake=(px,py,h)=>{poly([px-2,py,px+2,py,px+2,py-h,px,py-h-4,px-2,py-h],col);poly([px,py,px+2,py,px+2,py-h,px,py-h-4],dk);};
  const dirs=[[1,0,HW*0.5,HH*0.5],[-1,0,-HW*0.5,-HH*0.5],[0,1,-HW*0.5,HH*0.5],[0,-1,HW*0.5,-HH*0.5]];
  if(v===2){/* gate: two posts and a lintel, the road runs between */
    const n=dirs.filter(d=>inMap(x+d[0],y+d[1])&&walls[(y+d[1])*N+x+d[0]]);const d=n[0]||dirs[0];const a=[sx+d[2]*0.55,sy+d[3]*0.55],b=[sx-d[2]*0.55,sy-d[3]*0.55];
    [a,b].forEach(q=>{poly([q[0]-3,q[1],q[0]+3,q[1],q[0]+3,q[1]-26,q[0]-3,q[1]-26],dk);});ctx.strokeStyle=col;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(a[0],a[1]-24);ctx.lineTo(b[0],b[1]-24);ctx.stroke();
    ctx.fillStyle='#A34A3A';ctx.beginPath();ctx.moveTo((a[0]+b[0])/2-4,(a[1]+b[1])/2-24);ctx.lineTo((a[0]+b[0])/2+4,(a[1]+b[1])/2-24);ctx.lineTo((a[0]+b[0])/2,(a[1]+b[1])/2-16);ctx.fill();return;}
  const link=dirs.filter(d=>inMap(x+d[0],y+d[1])&&walls[(y+d[1])*N+x+d[0]]);
  ctx.strokeStyle=dk;ctx.lineWidth=2;ctx.beginPath();for(const d of link){ctx.moveTo(sx,sy-8);ctx.lineTo(sx+d[2],sy+d[3]-8);}ctx.stroke();
  const pts=[[0,0]];for(const d of link){pts.push([d[2]*0.33,d[3]*0.33],[d[2]*0.7,d[3]*0.7]);}pts.sort((p,q)=>p[1]-q[1]);const WL=wallLv(),wr=wallWear(i),hb=WL>=2?4:0;
  if(WL>=2){ctx.strokeStyle=win?'#9C8A76':'#8A6E52';ctx.lineWidth=3;ctx.beginPath();for(const d of link){ctx.moveTo(sx,sy-6);ctx.lineTo(sx+d[2],sy+d[3]-6);}ctx.stroke();}
  pts.forEach((p,k)=>{if(wr>0&&h2(x*7+k,y,5)<wr*0.7)return;stake(sx+p[0],sy+p[1],13+hb+((p[0]*7+p[1]*3)&3)-(wr>0.5&&k%2?5:0));});
  if(zoom>1.45&&!win){/* close-up: rope lashing and bark on the stakes */ctx.strokeStyle='rgba(196,170,120,0.85)';ctx.lineWidth=1;ctx.beginPath();for(const d of link){const m=[sx+d[2]*0.5,sy+d[3]*0.5];ctx.moveTo(m[0]-3,m[1]-9);ctx.lineTo(m[0]+3,m[1]-10);ctx.moveTo(m[0]-3,m[1]-7);ctx.lineTo(m[0]+3,m[1]-8);}ctx.stroke();
    ctx.strokeStyle='rgba(40,30,22,0.35)';ctx.lineWidth=0.5;ctx.beginPath();for(const p of pts){ctx.moveTo(sx+p[0]-0.8,sy+p[1]-3);ctx.lineTo(sx+p[0]-0.6,sy+p[1]-10);}ctx.stroke();}
  if(WL>=3){ctx.strokeStyle='#5E6468';ctx.lineWidth=1.4;ctx.beginPath();for(const d of link){for(const hh of [5,13]){ctx.moveTo(sx,sy-hh);ctx.lineTo(sx+d[2],sy+d[3]-hh);}}ctx.stroke();}}
