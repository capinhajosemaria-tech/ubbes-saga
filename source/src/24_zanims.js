/* =================== animations: crews to the ships, ships at sea, palisade =================== */
const ANIMS=[];let SHIP_HITS=[];
function harbourDock(){const hb=B.find(b=>b.t==='harbour');if(!hb)return null;const sp=dockSpots(hb);if(!sp.length)return null;const d=sp[Math.floor(sp.length/2)];
  const cx=hb.fx+hb.w/2-0.5,cy=hb.fy+hb.h/2-0.5;if(d.flip!==undefined){const F=hbFrame(hb),o=F.w(0,0),e=F.w(1,0),ux=e[0]-o[0],uy=e[1]-o[1],la=F.w(0.8,F.W/2);return {hb:hb,land:la,q:d.q,far:[d.q[0]+ux*24,d.q[1]+uy*24],flip:d.flip};}const dx=d.q[0]-cx,dy=d.q[1]-cy,L=Math.hypot(dx,dy)||1;return {hb:hb,land:[cx,cy],q:d.q,far:[d.q[0]+dx/L*24,d.q[1]+dy/L*24],flip:Math.abs(dx)>Math.abs(dy)};}
function animRaidOut(r){const th=B.find(b=>b.t==='th'),d=harbourDock();if(!th||!d)return;const n=Math.min(8,r.crew.length);
  for(let i=0;i<n;i++)ANIMS.push({k:'walk',a:[th.fx+4.6+(i%3)*0.35,th.fy+5.6+((i/3)|0)*0.3],b:[d.land[0]+(i%3)*0.3,d.land[1]+((i/3)|0)*0.3],t0:S.gameT+i*0.8,dur:DAY*0.32,c:pal[i%pal.length]});
  const sh=r.ships.map(shipById).filter(Boolean);sh.forEach((s,i)=>ANIMS.push({k:'sail',a:d.q,b:d.far,t0:S.gameT+DAY*0.36+i*2,dur:DAY*0.55,type:s.type,flip:d.flip}));}
function animRaidIn(r){const th=B.find(b=>b.t==='th'),d=harbourDock();if(!d)return;const sh=r.ships.map(shipById).filter(Boolean);
  sh.forEach((s,i)=>ANIMS.push({k:'sail',a:d.far,b:d.q,t0:S.gameT+i*2,dur:DAY*0.6,type:s.type,flip:d.flip,cargo:true}));
  if(th){const n=Math.min(8,r.crew.length);for(let i=0;i<n;i++)ANIMS.push({k:'walk',a:[d.land[0],d.land[1]],b:[th.fx+4.6+(i%3)*0.35,th.fy+5.6],t0:S.gameT+DAY*0.62+i*0.8,dur:DAY*0.32,c:pal[i%pal.length]});}}
function drawAnims(win){for(let i=ANIMS.length-1;i>=0;i--){const a=ANIMS[i],u=(S.gameT-a.t0)/a.dur;if(u>1.02||u<-50){ANIMS.splice(i,1);continue;}if(u<0)continue;
  if(a.k==='walk'){const x=a.a[0]+(a.b[0]-a.a[0])*u,y=a.a[1]+(a.b[1]-a.a[1])*u;drawWalker({x:x,y:y,c:a.c,ph:S.gameT*0.9+i,moving:true,carry:'spear'},win);}
  else if(a.k==='sail'){const e=u*u*(3-2*u),x=a.a[0]+(a.b[0]-a.a[0])*e,y=a.a[1]+(a.b[1]-a.a[1])*e,p=iso(x,y);const far=Math.min(1,Math.hypot(x-a.a[0],y-a.a[1])/24),out=a.b[0]!==a.a[0]&&Math.hypot(a.b[0]-x,a.b[1]-y)<3&&!a.cargo;
    ctx.globalAlpha=a.cargo?Math.min(1,u*3):Math.max(0,1-Math.max(0,u-0.75)*4);drawShip(p[0],p[1]+8+Math.sin(t*1.3+i)*1.2,0.36,a.flip,a.type);ctx.globalAlpha=1;}}}
function drawWallTile(i,win){const x=i%N,y=(i/N)|0,e=elev[i]||2,sx=(x-y)*HW,sy=(x+y)*HH-e;const v=walls[i];
  /* a Viking palisade: a closed wall of split pine logs set upright in an earth bank, sharpened at the top */
  const LT=win?'#9A8A78':'#8E6E4E',DK=win?'#6E6052':'#5A4230',TIP=win?'#B5A894':'#A88660',SEAM='rgba(34,24,16,0.55)';
  const dirs=[[1,0,HW*0.5,HH*0.5],[-1,0,-HW*0.5,-HH*0.5],[0,1,-HW*0.5,HH*0.5],[0,-1,HW*0.5,-HH*0.5]];
  const WL=wallLv(),wr=wallWear(i),hb=WL>=2?3:0;
  const log=(px,py,h,w)=>{w=w||2.3;
    poly([px-w,py+0.6,px+w,py+0.6,px+w,py-h,px,py-h-3.6,px-w,py-h],LT);
    poly([px+w*0.15,py+0.6,px+w,py+0.6,px+w,py-h,px+w*0.15,py-h-3.1],DK);
    poly([px-w,py-h,px,py-h-3.6,px+w,py-h,px,py-h+1.2],TIP);
    if(win){ctx.fillStyle='#F2F4F2';ctx.beginPath();ctx.moveTo(px-w*0.8,py-h-0.4);ctx.lineTo(px,py-h-3.4);ctx.lineTo(px+w*0.6,py-h-0.6);ctx.closePath();ctx.fill();}
    ctx.strokeStyle=SEAM;ctx.lineWidth=0.6;ctx.beginPath();ctx.moveTo(px-w,py+0.6);ctx.lineTo(px-w,py-h);ctx.stroke();};
  const bank=(a,b)=>{ctx.strokeStyle=win?'rgba(236,240,238,0.9)':'#6B5A40';ctx.lineWidth=6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]+1.5);ctx.lineTo(b[0],b[1]+1.5);ctx.stroke();
    ctx.strokeStyle=win?'rgba(200,208,206,0.8)':'rgba(84,104,58,0.75)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a[0],a[1]+3.6);ctx.lineTo(b[0],b[1]+3.6);ctx.stroke();ctx.lineCap='butt';};
  if(v===2){/* gate: two heavy posts, a plank walkway over the opening and the doors swung open */
    const n=dirs.filter(d=>inMap(x+d[0],y+d[1])&&walls[(y+d[1])*N+x+d[0]]);const d=n[0]||dirs[0];const a=[sx+d[2]*0.62,sy+d[3]*0.62],b=[sx-d[2]*0.62,sy-d[3]*0.62];
    bank([sx+d[2],sy+d[3]],a);bank(b,[sx-d[2],sy-d[3]]);
    const q=[a,b].sort((p,r)=>p[1]-r[1]);q.forEach(p=>{log(p[0]-2,p[1],30+hb,3.2);log(p[0]+2.6,p[1]+1,28+hb,3.2);});
    poly([a[0],a[1]-27-hb,b[0],b[1]-27-hb,b[0],b[1]-23-hb,a[0],a[1]-23-hb],DK);poly([a[0],a[1]-28-hb,b[0],b[1]-28-hb,b[0],b[1]-27-hb,a[0],a[1]-27-hb],TIP);
    ctx.strokeStyle=SEAM;ctx.lineWidth=0.6;ctx.beginPath();for(let k=1;k<6;k++){const t=k/6;ctx.moveTo(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t-27-hb);ctx.lineTo(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t-23-hb);}ctx.stroke();
    ctx.fillStyle='#A34A3A';const m=[(a[0]+b[0])/2,(a[1]+b[1])/2-23-hb];ctx.beginPath();ctx.moveTo(m[0]-4,m[1]);ctx.lineTo(m[0]+4,m[1]);ctx.lineTo(m[0],m[1]+7);ctx.fill();
    if(WL>=3){ctx.strokeStyle='#5E6468';ctx.lineWidth=1.2;ctx.beginPath();for(const p of q){ctx.moveTo(p[0]-5,p[1]-8);ctx.lineTo(p[0]+6,p[1]-7);ctx.moveTo(p[0]-5,p[1]-20);ctx.lineTo(p[0]+6,p[1]-19);}ctx.stroke();}
    return;}
  const link=dirs.filter(d=>inMap(x+d[0],y+d[1])&&walls[(y+d[1])*N+x+d[0]]);
  for(const d of link)bank([sx,sy],[sx+d[2],sy+d[3]]);
  /* logs packed shoulder to shoulder from the tile centre to each joining edge */
  const pts=[[0,0]];for(const d of link){const L=Math.hypot(d[2],d[3]),n=Math.max(2,Math.round(L/3.9));for(let k=1;k<=n;k++){const t=k/n;pts.push([d[2]*t,d[3]*t]);}}
  if(!link.length)pts.push([-3.8,1.6],[3.8,1.6],[0,3]);
  pts.sort((p,q)=>(p[1]-q[1])||(p[0]-q[0]));
  pts.forEach((p,k)=>{const hs=h2(Math.round(sx+p[0]),Math.round(sy+p[1]),11);if(wr>0&&hs/0xffffffff<wr*0.6)return;
    const h=20+hb+(hs%3)-(wr>0.5&&k%2?6:0);log(sx+p[0],sy+p[1],h);});
  /* binding rail inside the wall, iron bands on the strongest palisade */
  if(WL>=2){ctx.strokeStyle=win?'#857462':'#6E543D';ctx.lineWidth=1.6;ctx.beginPath();for(const d of link){ctx.moveTo(sx,sy-12-hb);ctx.lineTo(sx+d[2],sy+d[3]-12-hb);}ctx.stroke();}
  if(WL>=3){ctx.strokeStyle='#4E5458';ctx.lineWidth=1.3;ctx.beginPath();for(const d of link){for(const hh of [5,15]){ctx.moveTo(sx,sy-hh-hb);ctx.lineTo(sx+d[2],sy+d[3]-hh-hb);}}ctx.stroke();}
  if(zoom>1.45&&!win){/* close-up: bark lines on the logs */ctx.strokeStyle='rgba(40,30,22,0.3)';ctx.lineWidth=0.5;ctx.beginPath();for(const p of pts){ctx.moveTo(sx+p[0]-1,sy+p[1]-3);ctx.lineTo(sx+p[0]-0.8,sy+p[1]-14);}ctx.stroke();}}
