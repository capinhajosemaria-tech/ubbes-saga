/* =================== Market Square: option M1 (chosen 2026-11-11) =================== */
/* MKV 1 = timber booths and a stone well on cobbles (released). 2 = fair tents, 3 = market hall: the other prototypes, kept for comparison (window.__setMk). 0 = the old striped stalls. */
let MKV=1;
window.__setMk=v=>{MKV=v;};
function drawMarketV(b,c,win){
  if(!MKV)return false;
  const W=b.w,Hh=b.h;
  const pt=(u,v,h)=>[c.T[0]+u/W*(c.R[0]-c.T[0])+v/Hh*(c.L[0]-c.T[0]),c.T[1]+u/W*(c.R[1]-c.T[1])+v/Hh*(c.L[1]-c.T[1])-(h||0)];
  const Q=(...a)=>P(...a.map(q=>pt(q[0],q[1],q[2])));
  /* ground: same cobbles as the Town Hall square, worn earth in the middle (MKV 2) */
  cobbles(b,c,win);
  if(MKV===2&&!win){ctx.fillStyle='rgba(140,112,74,0.45)';const m=pt(W/2,Hh/2);ctx.beginPath();ctx.ellipse(m[0],m[1],W*16,Hh*8,0,0,6.3);ctx.fill();}
  const wood='#8A6E52',woodD='#6E543D',woodL='#A88A69',dark='#4E3C2E';
  const box=(u0,v0,u1,v1,h0,h1,top,left,right)=>{poly(Q([u0,v1,h0],[u1,v1,h0],[u1,v1,h1],[u0,v1,h1]),left);poly(Q([u1,v0,h0],[u1,v1,h0],[u1,v1,h1],[u1,v0,h1]),right);poly(Q([u0,v0,h1],[u1,v0,h1],[u1,v1,h1],[u0,v1,h1]),top);};
  const post=(u,v,h,col)=>{const a=pt(u,v),b2=pt(u,v,h);ctx.strokeStyle=col||dark;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);ctx.stroke();};
  const goods=(u0,v0,u1,v1,h,kind)=>{const cols={fish:['#B8C4C8','#8E9EA4'],apple:['#B5483A','#C9A64A'],pot:['#9A6A48','#7A5238'],fur:['#6E5A48','#C9BBA0'],cloth:['#5E7F8C','#A34A3A'],amber:['#D9A23A','#B87A2A']}[kind];
    for(let k=0;k<6;k++){const u=u0+(u1-u0)*((k%3)+0.5)/3,v=v0+(v1-v0)*((k/3|0)+0.5)/2,p=pt(u,v,h);ctx.fillStyle=cols[k%2];ctx.beginPath();
      if(kind==='fish')ctx.ellipse(p[0],p[1]-1,4,1.3,-0.4,0,6.3);else if(kind==='pot'){ctx.ellipse(p[0],p[1]-3,2.6,3.4,0,0,6.3);}else if(kind==='fur'||kind==='cloth')ctx.ellipse(p[0],p[1]-1,5,2,0,0,6.3);else ctx.arc(p[0],p[1]-1.5,1.8,0,6.3);ctx.fill();}};
  const crate=(u,v)=>{box(u,v,u+0.32,v+0.32,0,7,woodL,wood,woodD);const a=pt(u,v+0.32,0),b2=pt(u+0.32,v+0.32,7);ctx.strokeStyle='rgba(60,44,30,0.6)';ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);ctx.stroke();};
  const barrel=(u,v)=>{const p=pt(u,v);barrelC(p[0],p[1]);};
  /* the well in the middle: stone ring, two posts, a crossbar and a bucket */
  const well=(u,v)=>{const p=pt(u,v);ctx.fillStyle=win?'#C9CCC8':'#7D776E';ctx.beginPath();ctx.ellipse(p[0],p[1],13,6.5,0,0,6.3);ctx.fill();
    poly([p[0]-13,p[1],p[0]+13,p[1],p[0]+13,p[1]-7,p[0]-13,p[1]-7],win?'#BFC2BE':'#8E877D');ctx.fillStyle=win?'#D6D9D5':'#A39D93';ctx.beginPath();ctx.ellipse(p[0],p[1]-7,13,6.5,0,0,6.3);ctx.fill();
    ctx.fillStyle='#2E3A40';ctx.beginPath();ctx.ellipse(p[0],p[1]-7,9,4.4,0,0,6.3);ctx.fill();
    ctx.strokeStyle='rgba(60,56,50,0.5)';ctx.lineWidth=0.7;ctx.beginPath();for(let k=0;k<6;k++){const x=p[0]-11+k*4.4;ctx.moveTo(x,p[1]-6);ctx.lineTo(x,p[1]-1);}ctx.stroke();
    ctx.strokeStyle=dark;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(p[0]-11,p[1]-6);ctx.lineTo(p[0]-11,p[1]-26);ctx.moveTo(p[0]+11,p[1]-6);ctx.lineTo(p[0]+11,p[1]-26);ctx.moveTo(p[0]-13,p[1]-24);ctx.lineTo(p[0]+13,p[1]-24);ctx.stroke();
    ctx.strokeStyle='#3A2E24';ctx.lineWidth=0.7;ctx.beginPath();ctx.moveTo(p[0]+2,p[1]-24);ctx.lineTo(p[0]+2,p[1]-15);ctx.stroke();poly([p[0]-1,p[1]-15,p[0]+5,p[1]-15,p[0]+4,p[1]-10,p[0],p[1]-10],woodD);
    poly([p[0]-16,p[1]-25,p[0],p[1]-33,p[0]+16,p[1]-25,p[0],p[1]-29],win?'#E6EAE8':'#7F9568');};
  /* timber booth: counter, four posts, a sloping plank (or turf) roof */
  const booth=(u,v,du,dv,roof,roofD,kind)=>{const u1=u+du,v1=v+dv;
    post(u,v,21);post(u1,v,21);
    box(u+0.05,v1-0.32,u1-0.05,v1-0.05,0,8,woodL,wood,woodD);goods(u+0.1,v1-0.3,u1-0.1,v1-0.08,8,kind);
    post(u,v+dv*0.62,15);post(u1,v+dv*0.62,15);
    const vr=v+dv*0.62;/* roof covers the back, so the counter and goods stay in view */
    poly(Q([u-0.08,v-0.08,22],[u1+0.08,v-0.08,22],[u1+0.08,vr,15],[u-0.08,vr,15]),roof);
    poly(Q([u-0.08,vr,15],[u1+0.08,vr,15],[u1+0.08,vr,13.5],[u-0.08,vr,13.5]),roofD);
    poly(Q([u1+0.08,v-0.08,22],[u1+0.08,vr,15],[u1+0.08,vr,13.5],[u1+0.08,v-0.08,20.5]),roofD);
    ctx.strokeStyle='rgba(40,30,20,0.35)';ctx.lineWidth=0.7;ctx.beginPath();for(let k=1;k<5;k++){const a=pt(u-0.08+(du+0.16)*k/5,v-0.08,22),b2=pt(u-0.08+(du+0.16)*k/5,vr,15);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}ctx.stroke();};
  /* fair tent of undyed wool on an A-frame, a faded stripe at the hem */
  const tent=(u,v,du,dv,cl,clD,band,kind)=>{const u1=u+du,v1=v+dv,vm=v+dv/2,h=20;
    goods(u+0.15,v1-0.25,u1-0.15,v1+0.05,0,kind);
    poly(Q([u,v,0],[u1,v,0],[u1,vm,h],[u,vm,h]),clD);
    poly(Q([u,vm,h],[u1,vm,h],[u1,v1-0.12,7],[u,v1-0.12,7]),cl);
    poly(Q([u,v1-0.12,7],[u1,v1-0.12,7],[u1,v1-0.12,4.5],[u,v1-0.12,4.5]),band);
    poly(Q([u1,v,0],[u1,vm,h],[u1,v1-0.12,7],[u1,v1-0.12,0]),clD);
    poly(Q([u1,vm-0.1,h-3],[u1,vm+0.15,h-4],[u1,v1-0.12,0],[u1,v1-0.3,0]),'rgba(30,24,18,0.55)');
    post(u1,vm,h+5);post(u,vm,h+5);post(u,v1-0.12,7);post(u1,v1-0.12,7);};
  const items=[];
  if(MKV===1){
    items.push(()=>booth(0.25,0.2,1.3,0.9,'#7A6450','#5E4C3C','fish'));
    items.push(()=>booth(2.35,0.2,1.3,0.9,'#7F9568','#6B8058','pot'));
    items.push(()=>booth(0.2,2.7,1.2,0.9,'#7A6450','#5E4C3C','fur'));
    items.push(()=>well(2,2));items.push(()=>crate(3.2,2.9));items.push(()=>crate(3.5,3.2));items.push(()=>barrel(2.9,3.4));
  }else if(MKV===2){
    items.push(()=>tent(0.25,0.2,1.3,1.0,'#D8CDB4','#B9AE95','#A34A3A','cloth'));
    items.push(()=>tent(2.4,0.2,1.3,1.0,'#C9B48E','#A99470','#5E7F8C','amber'));
    items.push(()=>tent(0.2,2.6,1.2,1.0,'#D8CDB4','#B9AE95','#7F9568','apple'));
    items.push(()=>well(2,2));items.push(()=>crate(3.1,2.7));items.push(()=>barrel(3.2,3.4));items.push(()=>barrel(2.6,3.5));
  }else{/* MKV 3: one long open market hall on posts along the back, a trading stone with a balance */
    items.push(()=>{const u=0.2,v=0.2,u1=3.8,v1=1.3,h=18,hr=30,vm=(v+v1)/2;
      for(let k=0;k<=4;k++)post(u+(u1-u)*k/4,v,h);
      box(u+0.1,v1-0.4,u1-0.1,v1-0.12,0,8,woodL,wood,woodD);goods(0.4,v1-0.38,1.4,v1-0.14,8,'fish');goods(1.5,v1-0.38,2.6,v1-0.14,8,'pot');goods(2.7,v1-0.38,3.6,v1-0.14,8,'fur');
      for(let k=0;k<=4;k++)post(u+(u1-u)*k/4,v1,h);
      poly(Q([u-0.1,v-0.15,h],[u1+0.1,v-0.15,h],[u1+0.1,vm,hr],[u-0.1,vm,hr]),'#6B8058');
      poly(Q([u-0.1,vm,hr],[u1+0.1,vm,hr],[u1+0.1,v1+0.2,h-2],[u-0.1,v1+0.2,h-2]),'#7F9568');
      roofTex((a,b2)=>pt(u-0.1+(u1-u+0.2)*a,v1+0.2-(v1+0.2-vm)*b2,h-2+(hr-h+2)*b2),'turf',win,b.id);
      poly(Q([u1+0.1,v-0.15,h],[u1+0.1,vm,hr],[u1+0.1,v1+0.2,h-2]),woodD);
      const e1=pt(u-0.1,vm,hr),e2=pt(u1+0.1,vm,hr);dragonHead(e1,-1,'#C9A64A',0.7);dragonHead(e2,1,'#C9A64A',0.7);});
    items.push(()=>well(1.2,2.6));
    items.push(()=>{const p=pt(2.8,2.6);poly([p[0]-5,p[1],p[0]+5,p[1],p[0]+4,p[1]-22,p[0]-4,p[1]-24],'#8E877D');poly([p[0],p[1],p[0]+5,p[1],p[0]+4,p[1]-22,p[0],p[1]-23.5],'#757067');
      ctx.strokeStyle='#A34A3A';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p[0]-2,p[1]-6);ctx.lineTo(p[0]-2,p[1]-19);ctx.moveTo(p[0]-2,p[1]-12);ctx.lineTo(p[0]+1,p[1]-15);ctx.stroke();});
    items.push(()=>{/* trader's balance on a little table */const p=pt(3.3,3.3);box(3.1,3.1,3.6,3.5,0,7,woodL,wood,woodD);ctx.strokeStyle='#C9A64A';ctx.lineWidth=1;ctx.beginPath();const q=pt(3.35,3.3,7);ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0],q[1]-9);ctx.moveTo(q[0]-6,q[1]-8);ctx.lineTo(q[0]+6,q[1]-8);ctx.stroke();
      ctx.fillStyle='#C9A64A';[-6,6].forEach(o=>{ctx.beginPath();ctx.ellipse(q[0]+o,q[1]-4,2.6,1,0,0,6.3);ctx.fill();});});
    items.push(()=>crate(0.4,3.3));items.push(()=>barrel(0.9,3.6));
  }
  items.forEach(f=>f());
  return true;
}
