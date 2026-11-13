/* =================== Harbour: a long timber pier running out to sea, a shore platform and a small boathouse =================== */
/* Local frame: a runs along the pier from the land end (0) to the sea end (L); s runs across it (0..W). */
function hbFrame(b){const ax=b.w>b.h?'x':'y',L=ax==='x'?b.w:b.h,W=ax==='x'?b.h:b.w;
  const row=k=>{let n=0;for(let s=0;s<W;s++){const x=ax==='x'?b.fx+k:b.fx+s,y=ax==='x'?b.fy+s:b.fy+k;if(tAt(x,y)===T.SEA)n++;}return n;};
  const rev=row(0)>row(L-1),x0=b.fx-0.5,y0=b.fy-0.5;
  const w=(a,s)=>{const aa=rev?L-a:a;return ax==='x'?[x0+aa,y0+s]:[x0+s,y0+aa];};
  const S=(a,s,h)=>{const q=w(a,s),p=iso(q[0],q[1]);return [p[0],p[1]-(h||0)];};
  /* tile of the land end, for the platform height */
  const lt=w(0.5,W/2),li=Math.round(lt[1])*N+Math.round(lt[0]),hL=Math.max(0,Math.min(8,(elev[li]||1)-1));
  return {ax:ax,L:L,W:W,rev:rev,w:w,S:S,hL:hL};}
/* screen corners (T,R,Bt,L) of a rectangle given in the local frame */
function hbRect(F,a0,a1,s0,s1){const p=[F.w(a0,s0),F.w(a1,s1)],x0=Math.min(p[0][0],p[1][0]),x1=Math.max(p[0][0],p[1][0]),y0=Math.min(p[0][1],p[1][1]),y1=Math.max(p[0][1],p[1][1]);
  return {T:iso(x0,y0),R:iso(x1,y0),Bt:iso(x1,y1),L:iso(x0,y1)};}
/* the berths: ships lie alongside the pier, one on each side; more ships raft up outside them */
function harbourBerths(b){const F=hbFrame(b),out=[],along=F.L-1.7,n=Math.max(1,Math.floor(along/3.2));
  for(const off of [0,1])for(const side of [0,1])for(let k=0;k<n;k++){const a=1.7+along*(k+0.5)/n,s=side?F.W+0.05+off*1.5:-0.05-off*1.5;
    const q=F.w(a,s),tx=Math.round(q[0]),ty=Math.round(q[1]);if(tAt(tx,ty)!==T.SEA&&off)continue;out.push({p:[tx,ty],q:[q[0],q[1]],flip:F.ax==='y',side:side});}
  return out;}
function hbDeck(F,a0,a1,s0,s1,h,win,top,seam){const c=hbRect(F,a0,a1,s0,s1),u=x=>[x[0],x[1]-h];
  /* front faces (the edge of the boards), then the deck */
  poly(P(c.L,c.Bt,u(c.Bt),u(c.L)),win?'#8E8478':'#5C4634');poly(P(c.Bt,c.R,u(c.R),u(c.Bt)),win?'#7A7166':'#4A382A');
  poly(P(u(c.T),u(c.R),u(c.Bt),u(c.L)),win?'#E2E3DF':top);
  if(win)return;
  ctx.strokeStyle='rgba(50,36,26,0.38)';ctx.lineWidth=0.6;ctx.beginPath();
  for(let a=a0+seam;a<a1-0.02;a+=seam){const p=F.S(a,s0,h),q=F.S(a,s1,h);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
  /* a few boards a shade lighter or darker, so the deck does not look printed */
  let k=0;for(let a=a0;a<a1-0.02;a+=seam,k++){if((k*7)%5>1)continue;const A=Math.min(a1,a+seam);ctx.fillStyle=k%2?'rgba(255,240,210,0.08)':'rgba(40,28,18,0.08)';const p=[F.S(a,s0,h),F.S(A,s0,h),F.S(A,s1,h),F.S(a,s1,h)];poly(P(...p),ctx.fillStyle);}}
function hbPile(x,y,h,top,win){ctx.fillStyle=win?'#6E675E':'#3E2F24';ctx.fillRect(x-1.6,y-top,3.2,top+h);ctx.fillStyle=win?'#8E867B':'#5E4838';ctx.fillRect(x-1.6,y-top,1.4,top+h);
  if(top>0){ctx.fillStyle=win?'#F2F3F1':'#6E5644';ctx.beginPath();ctx.ellipse(x,y-top,1.7,0.8,0,0,6.3);ctx.fill();}}
function hbRope(x,y){ctx.strokeStyle='#B79B6A';ctx.lineWidth=1.1;for(const r of [3.2,2.2,1.2]){ctx.beginPath();ctx.ellipse(x,y,r,r*0.5,0,0,6.3);ctx.stroke();}}
function hbCrate(x,y,win){poly([x-4,y,x,y+2,x,y-4,x-4,y-6],win?'#BDB3A4':'#8E6F52');poly([x,y+2,x+4,y,x+4,y-6,x,y-4],win?'#A39A8C':'#6E543D');poly([x-4,y-6,x,y-8,x+4,y-6,x,y-4],win?'#F0F1EE':'#A88A69');}
function hbFinials(M,H,dir,win){/* crossed gable boards ending in dragon heads, the boathouse's mark */
  const x=M[0],y=M[1]-H;ctx.strokeStyle=win?'#5E564C':'#3E2E22';ctx.lineWidth=1.5;ctx.lineCap='round';ctx.beginPath();
  ctx.moveTo(x-4*dir,y+4);ctx.lineTo(x+3*dir,y-5);ctx.moveTo(x+4*dir,y+4);ctx.lineTo(x-3*dir,y-5);ctx.stroke();
  ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+3*dir,y-5);ctx.quadraticCurveTo(x+6*dir,y-8,x+5*dir,y-4);ctx.moveTo(x-3*dir,y-5);ctx.quadraticCurveTo(x-6*dir,y-8,x-5*dir,y-4);ctx.stroke();ctx.lineCap='butt';
  ctx.fillStyle='#C9A64A';ctx.fillRect(x+5*dir-0.6,y-6.6,1.2,1.2);ctx.fillRect(x-5*dir-0.6,y-6.6,1.2,1.2);}
function drawHarbour(b,win){const F=hbFrame(b),Lp=F.L,W=F.W,hP=F.hL+4,hD=4,pa=1.7,ps0=W/2-0.36,ps1=W/2+0.36;
  const depth=(a,s)=>{const q=F.w(a,s);return q[0]+q[1];};const items=[];
  const sea=(a,s)=>{const q=F.w(a,s);return tAt(Math.round(q[0]),Math.round(q[1]))===T.SEA;};
  {const back=depth(2,-1)<depth(2,W+1)?0:1;if(PROP_B===b)hbShips(b).filter(o=>o.side===back).reverse().forEach(o=>o.f());}
  /* shadow of the pier on the water */
  if(!win){const c=hbRect(F,pa,Lp-0.05,ps0,ps1);poly(P([c.T[0]+3,c.T[1]+3],[c.R[0]+3,c.R[1]+3],[c.Bt[0]+3,c.Bt[1]+3],[c.L[0]+3,c.L[1]+3]),'rgba(20,34,44,0.25)');}
  /* piles: under the platform where it stands in the water, and along both sides of the pier */
  for(let a=0.3;a<pa;a+=0.55)for(const s of [0.12,W-0.12])if(sea(a,s)){const p=F.S(a,s,0);hbPile(p[0],p[1]+2,2,hP,win);}
  for(let a=pa+0.15;a<Lp;a+=0.6)for(const s of [ps0+0.04,ps1-0.04]){const p=F.S(a,s,0);hbPile(p[0],p[1]+2,2,hD,win);}
  /* the shore platform, planks laid along the shore, and the pier, planks laid across */
  hbDeck(F,0.04,pa+0.02,0.04,W-0.04,hP,win,'#9C7E5E',0.16);
  /* a short ramp from the platform down to the pier deck */
  hbDeck(F,pa,Lp-0.05,ps0,ps1,hD,win,'#A88A69',0.14);
  if(hP>hD+1){const a=F.S(pa,ps0,hP),b2=F.S(pa,ps1,hP),c2=F.S(pa+0.35,ps1,hD),d=F.S(pa+0.35,ps0,hD);poly(P(a,b2,c2,d),win?'#E2E3DF':'#97795A');}
  /* mooring posts standing above the pier, a lantern post at its head */
  for(let a=pa+0.6;a<Lp-0.2;a+=1.2)for(const s of [ps0+0.05,ps1-0.05]){const p=F.S(a,s,0);items.push({d:depth(a,s),f:()=>hbPile(p[0],p[1],0,hD+6,win)});}
  {const a=Lp-0.22,s=ps1-0.06,p=F.S(a,s,hD);items.push({d:depth(a,s),f:()=>{ctx.strokeStyle=win?'#5E564C':'#3E2E22';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0],p[1]-20);ctx.lineTo(p[0]+(F.ax==='x'?-4:4),p[1]-20);ctx.stroke();
    const lx=p[0]+(F.ax==='x'?-4:4),ly=p[1]-17;ctx.fillStyle='#3E3A36';ctx.fillRect(lx-2,ly-1,4,5);ctx.fillStyle=win?'#FFD27A':'#E8B860';ctx.fillRect(lx-1.2,ly+0.2,2.4,2.8);}});}
  /* the boathouse: a small dark timber hut with a shingle roof and crossed dragon-head gable boards */
  {const a0=0.14,a1=1.22,s0=0.1,s1=W*0.52,c=hbRect(F,a0,a1,s0,s1),u=x=>[x[0],x[1]-hP],cc={T:u(c.T),R:u(c.R),Bt:u(c.Bt),L:u(c.L)},alongX=F.ax==='x';
    items.push({d:depth((a0+a1)/2,(s0+s1)/2)+0.3,f:()=>{const r=hall(cc,12,12,alongX,{wt:'planks',wall:'#6E5442',wallD:'#54402F',roof:'#5A4A3C',roofD:'#47392E',rt:'shingle',side:alongX?'+y':'+x',door:true},win);
      if(r&&r.M1){hbFinials(r.M1,r.H,1,win);hbFinials(r.M2,r.H,1,win);}}});}
  /* crane at the pier root with a net of goods, crates, barrels and a coil of rope */
  {const a=pa+0.15,s=ps1+0.02,p=F.S(a,s,hP);items.push({d:depth(a,s),f:()=>{ctx.strokeStyle=win?'#5E564C':'#4E3C2E';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0],p[1]-30);ctx.lineTo(p[0]+(F.ax==='x'?16:-16),p[1]-25);ctx.stroke();
    const hx=p[0]+(F.ax==='x'?16:-16);ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(hx,p[1]-25);ctx.lineTo(hx,p[1]-13);ctx.moveTo(p[0],p[1]-6);ctx.lineTo(p[0]+(F.ax==='x'?8:-8),p[1]-27);ctx.stroke();
    ctx.fillStyle=win?'#D9D6CF':'#B79B6A';ctx.beginPath();ctx.ellipse(hx,p[1]-10,3.4,3,0,0,6.3);ctx.fill();ctx.strokeStyle='rgba(70,52,36,0.6)';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(hx-3,p[1]-10);ctx.lineTo(hx+3,p[1]-10);ctx.moveTo(hx,p[1]-13);ctx.lineTo(hx,p[1]-7);ctx.stroke();}});}
  for(const [a,s,k] of [[1.35,W*0.72,'crate'],[1.5,W*0.86,'barrel'],[1.15,W*0.86,'barrel'],[0.35,W*0.8,'rope'],[0.75,W*0.72,'crate']]){const p=F.S(a,s,hP);
    items.push({d:depth(a,s),f:()=>{if(k==='crate')hbCrate(p[0],p[1]+2,win);else if(k==='barrel')barrelC(p[0],p[1]+2);else if(!win)hbRope(p[0],p[1]);}});}
  /* nets drying on a rack by the boathouse */
  {const a=0.95,s=W*0.6,p=F.S(a,s,hP),q=F.S(a-0.6,s,hP);items.push({d:depth(a,s),f:()=>{ctx.strokeStyle=win?'#5E564C':'#4E3C2E';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0],p[1]-12);ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0],q[1]-12);ctx.moveTo(p[0],p[1]-12);ctx.lineTo(q[0],q[1]-12);ctx.stroke();
    if(!win){ctx.strokeStyle='rgba(120,110,90,0.75)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=1;k<6;k++){const m=lerp(p,q,k/6);ctx.moveTo(m[0],m[1]-12);ctx.lineTo(m[0]+(k%2?1:-1),m[1]-4);}const m1=lerp(p,q,0.1),m2=lerp(p,q,0.9);ctx.moveTo(m1[0],m1[1]-8);ctx.lineTo(m2[0],m2[1]-8);ctx.stroke();}}});}
  /* ships behind the pier are drawn before it, ships in front after it */
  const back=depth(2,-1)<depth(2,W+1)?0:1,ships=PROP_B===b?hbShips(b):[];
  items.sort((x,y)=>x.d-y.d).forEach(o=>o.f());
  ships.filter(o=>o.side!==back).forEach(o=>o.f());
  return true;}
/* moored ships: knarrs take the inner berths (they load at the pier), warships raft up outside */
function hbShips(b){const home=shipsAt(b).filter(s=>!s.away);if(!home.length)return [];const spots=dockSpots(b);
  const order=home.slice().sort((a,c)=>(c.type==='knarr')-(a.type==='knarr'));
  return order.slice(0,spots.length).map((s,i)=>{const sp=spots[i],p=iso(sp.q[0],sp.q[1]);return {side:sp.side,f:()=>{const bob=Math.sin(t*1.2+i)*1.0;drawShip(p[0],p[1]+3+bob,0.34,sp.flip,s.type);SHIP_HITS.push([p[0],p[1],s.id]);}};});}
function drawShipsAtHarbour(win){}
