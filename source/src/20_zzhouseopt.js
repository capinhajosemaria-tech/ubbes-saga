/* =================== house style options (prototype, not released) ===================
   window.__setHouse(n): 0 = released house, 1 turf cottage, 2 stave house, 3 log house (laft), 4 timber-and-daub longhouse.
   Local frame: a = along the ridge (+ = front gable, tiles), c = across (+ = front long wall, tiles), h = height (px). */
let HOUSE_OPT=0;
window.__setHouse=n=>{HOUSE_OPT=n|0;};
const _drawHouseOld=drawHouse;
drawHouse=function(b,win){if(!HOUSE_OPT)return _drawHouseOld(b,win);drawHouseOpt(b,win,HOUSE_OPT);};
/* option 1 roofs: 11 straw thatch, 12 blue slate, 13 black tarred shingles, 14 brick-red boards */
/* colour schemes on house 1 (opt 21..28): roof, walls, frame, door, shutters, shield */
const HO_SCH={21:{n:'Pine and straw',r:11,wall:'#B08A5C',wallD:'#93714A',frame:'#6E4E32',door:'#9A3E2E',shut:'#9A3E2E',sh:['#9A3E2E','#E0D4B8']},
  22:{n:'Tar and slate',r:12,wall:'#4A3A2E',wallD:'#3A2D23',frame:'#2A201A',door:'#C9A042',shut:'#C9A042',sh:['#C9A042','#2E3A44']},
  23:{n:'Falu red',r:13,wall:'#8E3B2C',wallD:'#742F23',frame:'#E2D8C2',door:'#3E3028',shut:'#E2D8C2',sh:['#E2D8C2','#2F2C2A']},
  24:{n:'Silver grey',r:11,wall:'#9A948A',wallD:'#7E786F',frame:'#5A544C',door:'#3E6A8A',shut:'#3E6A8A',sh:['#3E6A8A','#D8CFB8']},
  25:{n:'Oak and red boards',r:14,wall:'#7E5A3C',wallD:'#664830',frame:'#4A3424',door:'#4E6A44',shut:'#4E6A44',sh:['#4E6A44','#C9A64A']},
  26:{n:'Birch and black',r:13,wall:'#C9BFA8',wallD:'#ADA38D',frame:'#3A322C',door:'#7A3A2C',shut:'#2F2C2A',sh:['#7A3A2C','#2F2C2A']},
  27:{n:'Ochre and slate',r:12,wall:'#B8893E',wallD:'#9A7032',frame:'#4A3828',door:'#2E4A5E',shut:'#2E4A5E',sh:['#2E4A5E','#B8893E']},
  28:{n:'Black and red',r:14,wall:'#2E2824',wallD:'#231E1B',frame:'#9A4434',door:'#9A4434',shut:'#9A4434',sh:['#9A4434','#D8CFB8']}};
const HO_ROOFS={11:{rt:'thatch',roof:'#C2A25C',roofD:'#9E8042',roofE:'#7A6234',th:4.5},12:{rt:'slab',roof:'#5E7488',roofD:'#4A5D6E',roofE:'#38464F',th:2,blue:1},
  13:{rt:'scale',roof:'#2F2C2A',roofD:'#211F1D',roofE:'#171514',th:1.8},14:{rt:'boards',roof:'#9A4434',roofD:'#7A3428',roofE:'#55251C',th:1.6}};

function hoFrame(b){const alongX=b.rot%2===0,cx=b.fx+b.w/2-0.5,cy=b.fy+b.h/2-0.5;
  const f=(a,c,h)=>{const p=alongX?iso(cx+a,cy+c):iso(cx+c,cy+a);return [p[0],p[1]-(h||0)];};f.alongX=alongX;f.dir=alongX?1:-1;return f;}
function hoQ(pts,col){poly(P(...pts),col);}
function hoLine(a,b,col,w){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
/* a rectangle on the long wall (s = a) or the gable (s = c) */
function hoRect(f,g,face,s1,s2,h1,h2,col){if(face==='L')hoQ([f(s1,g.hw,h1),f(s2,g.hw,h1),f(s2,g.hw,h2),f(s1,g.hw,h2)],col);else hoQ([f(g.hl,s1,h1),f(g.hl,s2,h1),f(g.hl,s2,h2),f(g.hl,s1,h2)],col);}
function hoPt(f,g,face,s,h){return face==='L'?f(s,g.hw,h):f(g.hl,s,h);}

/* ---------- the shared parts kit ---------- */
function hoFooting(f,g,win){const fh=g.fh,st=win?'#C4C6C2':'#8F8C84',stD=win?'#A9ABA7':'#77746D';
  hoQ([f(-g.hl,g.hw,0),f(g.hl,g.hw,0),f(g.hl,g.hw,fh),f(-g.hl,g.hw,fh)],st);
  hoQ([f(g.hl,-g.hw,0),f(g.hl,g.hw,0),f(g.hl,g.hw,fh),f(g.hl,-g.hw,fh)],stD);
  /* single stones */
  const sd=g.sd;ctx.strokeStyle='rgba(50,48,44,0.55)';ctx.lineWidth=0.5;ctx.beginPath();
  const row=(face,len,n)=>{for(let r=0;r<2;r++){const h=fh*(r+1)/2;const p0=hoPt(f,g,face,-len,h),p1=hoPt(f,g,face,len,h);ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p1[0],p1[1]);
    for(let k=0;k<n;k++){const s=-len+2*len*((k+(r?0.5:0)+0.2*h2(sd,k+r*20,5))/n);if(s>len)continue;const q0=hoPt(f,g,face,s,h-fh/2),q1=hoPt(f,g,face,s,h);ctx.moveTo(q0[0],q0[1]);ctx.lineTo(q1[0],q1[1]);}}};
  row('L',g.hl,Math.round(g.hl*16));row('G',g.hw,Math.round(g.hw*16));ctx.stroke();
  if(!win){ctx.fillStyle='rgba(96,120,70,0.45)';for(let k=0;k<6;k++){const p=hoPt(f,g,k%2?'L':'G',(h2(sd,k,8)-0.5)*1.6*(k%2?g.hl:g.hw),0.5);ctx.beginPath();ctx.ellipse(p[0],p[1],2.4,1,0,0,6.3);ctx.fill();}}}
/* walls: planks (vertical), staves (wide vertical, tarred), logs (horizontal, round), daub (limewash in a timber frame) */
function hoWalls(f,g,win){const {hl,hw,fh,wh,rh}=g,W=g.wall,WD=g.wallD;
  hoQ([f(-hl,hw,fh),f(hl,hw,fh),f(hl,hw,wh),f(-hl,hw,wh)],W);
  hoQ([f(hl,-hw,fh),f(hl,hw,fh),f(hl,hw,wh),f(hl,0,wh+rh),f(hl,-hw,wh)],WD);
  const det=zoom>1.2;
  if(g.wt==='logs'){/* round logs: light top, dark under-shadow; corners show crossed log ends */
    const n=Math.max(4,Math.round((wh-fh)/3.2));for(let k=0;k<n;k++){const h1=fh+(wh-fh)*k/n,h2_=fh+(wh-fh)*(k+1)/n;
      for(const face of ['L','G']){const len=face==='L'?hl:hw;hoLine(hoPt(f,g,face,-len,h2_-0.4),hoPt(f,g,face,len,h2_-0.4),'rgba(255,236,200,0.18)',0.8);hoLine(hoPt(f,g,face,-len,h1+0.3),hoPt(f,g,face,len,h1+0.3),'rgba(30,20,12,0.45)',0.7);}}
    /* gable top: horizontal boards */
    for(let h=wh+3;h<wh+rh-2;h+=3){const w=hw*(1-(h-wh)/rh);hoLine(f(hl,-w,h),f(hl,w,h),'rgba(40,28,18,0.35)',0.5);}
    /* no log-end circles at the corners (José) */}
  else if(g.wt==='daub'){/* limewashed panels between dark timbers, braces */
    const T='#4A3726';const posts=(face,len,n)=>{for(let k=0;k<=n;k++){const s=-len+2*len*k/n;hoRect(f,g,face,s-0.025,s+0.025,fh,wh,T);}
      hoRect(f,g,face,-len,len,fh,fh+1.4,T);hoRect(f,g,face,-len,len,wh-1.6,wh,T);hoRect(f,g,face,-len,len,(fh+wh)/2-0.6,(fh+wh)/2+0.6,T);
      for(let k=0;k<n;k+=2){const s1=-len+2*len*k/n,s2=-len+2*len*(k+1)/n;hoLine(hoPt(f,g,face,s1,fh+1),hoPt(f,g,face,s2,(fh+wh)/2),T,1.2);}};
    posts('L',hl,Math.max(4,Math.round(hl*5)));posts('G',hw,4);
    hoLine(f(hl,-hw,wh),f(hl,0,wh+rh),T,1.2);hoLine(f(hl,hw,wh),f(hl,0,wh+rh),T,1.2);hoLine(f(hl,0,wh),f(hl,0,wh+rh),T,1.2);
    if(det&&!win){ctx.fillStyle='rgba(120,100,70,0.18)';for(let k=0;k<10;k++){const p=hoPt(f,g,k%2?'L':'G',(h2(g.sd,k,31)-0.5)*1.8*(k%2?hl:hw),fh+2+h2(g.sd,k,32)*3);ctx.fillRect(p[0]-1,p[1]-3,2,3);}}}
  else{/* vertical boards; staves are wider and darker every other board */
    const bw=g.wt==='staves'?0.11:0.075;
    for(const face of ['L','G']){const len=face==='L'?hl:hw,n=Math.max(4,Math.round(2*len/bw));
      for(let k=0;k<n;k++){const s1=-len+2*len*k/n,s2=-len+2*len*(k+1)/n;if(k%2===0){const top=face==='G'?Math.min(wh+rh*(1-Math.abs((s1+s2)/2)/hw),wh+rh):wh;
          if(face==='G')hoQ([hoPt(f,g,face,s1,fh),hoPt(f,g,face,s2,fh),hoPt(f,g,face,s2,wh+rh*(1-Math.abs(s2)/hw)),hoPt(f,g,face,s1,wh+rh*(1-Math.abs(s1)/hw))],'rgba(30,20,12,0.08)');
          else hoQ([hoPt(f,g,face,s1,fh),hoPt(f,g,face,s2,fh),hoPt(f,g,face,s2,top),hoPt(f,g,face,s1,top)],'rgba(30,20,12,0.08)');}
        const top=face==='G'?wh+rh*(1-Math.abs(s2)/hw):wh;if(k<n-1)hoLine(hoPt(f,g,face,s2,fh),hoPt(f,g,face,s2,top),'rgba(40,26,16,0.42)',0.5);}}
    if(g.wt==='staves'){hoRect(f,g,'L',-hl,hl,fh,fh+2,shade(WD,0.8));hoRect(f,g,'G',-hw,hw,fh,fh+2,shade(WD,0.7));}
    if(det){ctx.strokeStyle='rgba(30,20,12,0.18)';ctx.lineWidth=0.4;ctx.beginPath();for(let k=0;k<16;k++){const face=k%2?'L':'G',len=face==='L'?hl:hw,s=(h2(g.sd,k,41)-0.5)*1.9*len,h=fh+3+h2(g.sd,k,42)*(wh-fh-6),p=hoPt(f,g,face,s,h);ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0],p[1]-2.5);}ctx.stroke();}}
  /* frame: corner posts and the gable cross-beam (thin) */
  if(g.frame){const T=g.frameCol||'#5A4230';for(const q of [[hl,hw],[-hl,hw],[hl,-hw]]){const face=q[0]===hl&&q[1]!==hw?'G':'L';
      if(q[0]===hl&&q[1]===hw){hoRect(f,g,'L',hl-0.05,hl,fh,wh,T);hoRect(f,g,'G',hw-0.05,hw,fh,wh,shade(T,0.85));}
      else if(face==='L')hoRect(f,g,'L',q[0],q[0]+0.05,fh,wh,T);else hoRect(f,g,'G',q[1],q[1]+0.05,fh,wh,shade(T,0.85));}
    hoRect(f,g,'G',-hw,hw,wh-1.2,wh+0.6,shade(T,0.85));hoRect(f,g,'L',-hl,hl,wh-1.2,wh,T);
    if(g.midPost){hoRect(f,g,'L',-0.03,0.03,fh,wh,T);}}}
/* the roof: back slope, gable-end edges, front slope, surface (turf, thatch, shingle, slab), barge boards, ridge */
function hoRoof(f,g,win){const {hl,hw,wh,rh,ov}=g,top=wh+rh,eH=wh-ov/hw*rh,ce=hw+ov,a0=-hl-ov,a1=hl+ov,th0=g.rt==='thatch',t=th0?Math.min(g.th,1.2):g.th;/* thatch: no dark band at the eave (José) */
  const R=win?'#EEF1F0':g.roof,RD=win?'#D3DAD9':g.roofD,E=win?'#C9CED0':th0?g.roofD:g.roofE;
  return {back:()=>{hoQ([f(a0,0,top),f(a1,0,top),f(a1,-ce,eH),f(a0,-ce,eH)],RD);},
    end:()=>{/* overhang of the back slope over the gable, with its thickness */hoQ([f(hl,0,top),f(a1,0,top),f(a1,-ce,eH),f(hl,-ce,eH)],RD);
      hoQ([f(a1,0,top),f(a1,-ce,eH),f(a1,-ce,eH-t),f(a1,0,top-t)],E);
      hoQ([f(hl,-hw,wh),f(hl,0,top),f(hl,0,top-2.5),f(hl,-hw,wh-2.5)],'rgba(25,18,12,0.35)');hoQ([f(hl,hw,wh),f(hl,0,top),f(hl,0,top-2.5),f(hl,hw,wh-2.5)],'rgba(25,18,12,0.3)');},
    front:()=>{hoQ([f(a1,0,top),f(a1,ce,eH),f(a1,ce,eH-t),f(a1,0,top-t)],E);
      hoQ([f(a0,ce,eH),f(a1,ce,eH),f(a1,ce,eH-t),f(a0,ce,eH-t)],shade(E,0.9));
      hoQ([f(a0,0,top),f(a1,0,top),f(a1,ce,eH),f(a0,ce,eH)],R);
      const at=(u,v)=>f(a0+(a1-a0)*u,ce*(1-v),eH+(top-eH)*v);hoRoofSurface(at,g,win);
      /* lit eave */hoLine(at(0,0),at(1,0),win?'rgba(255,255,255,0.7)':'rgba(255,246,214,0.35)',0.8);},
    ridge:()=>{hoLine(f(a0,0,top+0.5),f(a1,0,top+0.5),win?'#DCE1E2':shade(RD,0.7),g.rt==='turf'?2.2:1.6);}};}
function hoRoofSurface(at,g,win){const det=zoom>1.2,sd=g.sd;
  if(win){ctx.strokeStyle='rgba(170,182,186,0.6)';ctx.lineWidth=0.6;ctx.beginPath();for(let k=1;k<5;k++){const a=at(0,k/5),b2=at(1,k/5);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}ctx.stroke();return;}
  if(g.rt==='turf'){/* living grass: soft patches, blades, a fringe over the eave, birch bark under it */
    for(let k=0;k<14;k++){const p=at(h2(sd,k,51),0.08+0.85*h2(sd,k,52));ctx.fillStyle=k%3?'rgba(70,96,52,0.35)':'rgba(170,186,110,0.4)';ctx.beginPath();ctx.ellipse(p[0],p[1],5+3*h2(sd,k,53),2.2,0,0,6.3);ctx.fill();}
    if(det){ctx.strokeStyle='rgba(60,84,44,0.55)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=0;k<120;k++){const p=at(h2(sd,k,54),0.04+0.94*h2(sd,k,55));ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+(h2(sd,k,56)-0.5)*1.4,p[1]-1.8);}ctx.stroke();
      ctx.fillStyle='#E8D98A';for(let k=0;k<5;k++){const p=at(h2(sd,k,57),0.2+0.6*h2(sd,k,58));ctx.fillRect(p[0],p[1],1,1);}}
    ctx.strokeStyle='#6E8A4E';ctx.lineWidth=0.6;ctx.beginPath();for(let k=0;k<60;k++){const u=k/59,p=at(u,0);ctx.moveTo(p[0],p[1]+1);ctx.lineTo(p[0]+(h2(sd,k,59)-0.5)*1.5,p[1]+3.2+h2(sd,k,60)*1.2);}ctx.stroke();
    hoLine(at(0,0),at(1,0),'#D9CDB0',0.6);}
  else if(g.rt==='thatch'){ctx.strokeStyle='rgba(110,82,36,0.42)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=0;k<70;k++){const u=(k+0.5)/70,a=at(u,0),b2=at(u+0.004,0.97);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}ctx.stroke();
    for(const v of [0.3,0.62]){hoLine(at(0,v),at(1,v),'rgba(90,64,28,0.35)',0.8);}
    hoLine(at(0,0),at(1,0),'rgba(80,56,24,0.7)',1.4);
    /* thick ridge cap */const r1=at(0,0.93),r2=at(1,0.93),r3=at(1,1),r4=at(0,1);hoQ([r1,r2,r3,r4],shade(g.roofD,0.85));}
  else if(g.rt==='shingle'){const rows=Math.round(9*g.rh/16);ctx.strokeStyle='rgba(20,16,12,0.45)';ctx.lineWidth=0.5;ctx.beginPath();
    for(let r=1;r<=rows;r++){const v=r/(rows+1),a=at(0,v),b2=at(1,v);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);
      if(det)for(let k=0;k<26;k++){const u=(k+(r%2?0.5:0))/26;if(u>=1)continue;const p=at(u,v),q=at(u,v-1/(rows+1));ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}}ctx.stroke();
    if(det){/* rounded shingle tips */ctx.fillStyle='rgba(255,240,210,0.07)';for(let r=0;r<rows;r+=2){const v=(r+0.5)/(rows+1);const a=at(0,v),b2=at(1,v),a2=at(1,v+0.04),b3=at(0,v+0.04);hoQ([a,b2,a2,b3],'rgba(255,240,210,0.06)');}}}
  else if(g.rt==='scale'){/* tarred wooden shingles with rounded ends (dragon scales), a soft sheen */const rows=Math.round(10*g.rh/16);
    for(let r=0;r<rows;r++){const v=(r+0.5)/rows,n=det?22:12;for(let k=0;k<n;k++){const u=(k+(r%2?0.5:0)+0.5)/n;if(u>1)continue;const p=at(u,v-0.5/rows);
        ctx.fillStyle=((k*7+r*3+sd)%5===0)?'rgba(90,80,70,0.35)':'rgba(255,240,220,0.06)';ctx.beginPath();ctx.ellipse(p[0],p[1]+0.6,det?2.2:3.4,1.3,0,0,3.14);ctx.fill();
        if(det){ctx.strokeStyle='rgba(0,0,0,0.5)';ctx.lineWidth=0.45;ctx.beginPath();ctx.ellipse(p[0],p[1]+0.6,2.2,1.3,0,0,3.14);ctx.stroke();}}}
    hoLine(at(0,0.985),at(1,0.985),'rgba(160,150,140,0.25)',0.6);}
  else if(g.rt==='boards'){/* painted boards running down the slope, battens over the joints, a weathered sheen */const n=det?30:16;
    for(let k=0;k<n;k++){const u=k/n;if(k%2===0){hoQ([at(u,0),at(u+1/n,0),at(u+1/n,1),at(u,1)],'rgba(255,220,190,0.05)');}
      hoLine(at(u,0.01),at(u,0.99),'rgba(60,20,14,0.55)',det?0.9:0.7);if(det)hoLine([at(u,0.01)[0]+0.6,at(u,0.01)[1]],[at(u,0.99)[0]+0.6,at(u,0.99)[1]],'rgba(255,200,170,0.18)',0.4);}
    if(det){ctx.fillStyle='rgba(40,14,10,0.25)';for(let k=0;k<20;k++){const p=at(h2(sd,k,71),h2(sd,k,72));ctx.fillRect(p[0],p[1],0.6,2.5);}}
    for(const v of [0.25,0.75])hoLine(at(0,v),at(1,v),'rgba(40,14,10,0.3)',0.5);}
  else if(g.rt==='slab'){/* stone slabs, irregular */ctx.strokeStyle='rgba(30,30,30,0.45)';ctx.lineWidth=0.5;ctx.beginPath();const rows=6;
    for(let r=1;r<=rows;r++){const v=r/(rows+1),a=at(0,v),b2=at(1,v);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);let u=h2(sd,r,61)*0.1;while(u<1){const p=at(u,v),q=at(u,v-1/(rows+1));ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);u+=0.07+0.08*h2(sd,r*30+(u*100|0),62);}}ctx.stroke();
    if(g.blue){for(let r=0;r<6;r++){let u=h2(sd,r,65)*0.1;while(u<1){const w=0.07+0.08*h2(sd,r*40+(u*100|0),66);const tone=h2(sd,r*50+(u*100|0),67);if(tone>0.55){hoQ([at(u,r/7+0.01),at(Math.min(1,u+w),r/7+0.01),at(Math.min(1,u+w),(r+1)/7),at(u,(r+1)/7)],tone>0.8?'rgba(200,215,230,0.12)':'rgba(20,30,40,0.14)');}u+=w;}}}
    for(let k=0;k<(g.blue?0:10);k++){const p=at(h2(sd,k,63),h2(sd,k,64));ctx.fillStyle='rgba(120,140,90,0.35)';ctx.beginPath();ctx.ellipse(p[0],p[1],2,1,0,0,6.3);ctx.fill();}}}
/* crossed barge boards at the front gable (vindskier): thin, natural wood, ends past the ridge */
function hoBarge(f,g,col,ext,carve){const {hl,hw,wh,rh,ov}=g,a1=hl+ov+0.01,top=wh+rh,eH=wh-ov/hw*rh,ce=hw+ov;
  for(const s of [1,-1]){const e=f(a1,s*ce,eH),r=f(a1,0,top),dx=r[0]-e[0],dy=r[1]-e[1],k=ext;const x=[r[0]+dx*k,r[1]+dy*k];
    ctx.lineCap='round';hoLine(e,x,shade(col,0.7),2.4);hoLine(e,x,col,1.5);hoLine([e[0],e[1]-0.6],[x[0],x[1]-0.6],'rgba(255,240,210,0.35)',0.5);
    if(carve){ctx.strokeStyle=col;ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(x[0],x[1]);ctx.quadraticCurveTo(x[0]+dx*0.12+s*3,x[1]+dy*0.12-3,x[0]+s*1,x[1]-5);ctx.stroke();}
    ctx.lineCap='butt';}}
function hoDoor(f,g,face,s,w,hd,o){o=o||{};w*=g.k||1;hd=Math.min(hd*(g.v||1),g.wh-g.fh-1.5);const fh=g.fh,P1=hoPt(f,g,face,s-w/2,fh),P2=hoPt(f,g,face,s+w/2,fh);
  /* frame */hoRect(f,g,face,s-w/2-0.03,s+w/2+0.03,fh,fh+hd+1.6,o.frame||'#4A3624');
  if(o.arch){const t=hoPt(f,g,face,s,fh+hd+5);hoQ([hoPt(f,g,face,s-w/2-0.03,fh+hd+1.6),hoPt(f,g,face,s+w/2+0.03,fh+hd+1.6),t],o.frame||'#4A3624');}
  hoRect(f,g,face,s-w/2,s+w/2,fh,fh+hd,o.col||'#6B4E34');
  ctx.strokeStyle='rgba(30,20,12,0.5)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=1;k<4;k++){const a=hoPt(f,g,face,s-w/2+w*k/4,fh),b2=hoPt(f,g,face,s-w/2+w*k/4,fh+hd);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}ctx.stroke();
  /* iron straps and ring */for(const hh of [0.28,0.72]){hoLine(hoPt(f,g,face,s-w/2,fh+hd*hh),hoPt(f,g,face,s+w*0.15,fh+hd*hh),'#2E2A26',0.8);}
  const r=hoPt(f,g,face,s+w*0.3,fh+hd*0.5);ctx.strokeStyle='#C9A64A';ctx.lineWidth=0.6;ctx.beginPath();ctx.arc(r[0],r[1],0.9,0,6.3);ctx.stroke();
  if(o.portal){/* carved portal: interlaced gold-ochre bands around the frame */ctx.strokeStyle=o.portal;ctx.lineWidth=0.8;for(const side of [-1,1]){const b0=hoPt(f,g,face,s+side*(w/2+0.06),fh),b1=hoPt(f,g,face,s+side*(w/2+0.06),fh+hd+2);
      ctx.beginPath();ctx.moveTo(b0[0],b0[1]);for(let k=1;k<=6;k++){const p=lerp(b0,b1,k/6);ctx.quadraticCurveTo(p[0]+side*2.2*(k%2?1:-1),p[1]+2,p[0],p[1]);}ctx.stroke();}
    const t1=hoPt(f,g,face,s-w/2-0.06,fh+hd+2),t2=hoPt(f,g,face,s+w/2+0.06,fh+hd+2),tc=hoPt(f,g,face,s,fh+hd+(o.arch?7.5:5));ctx.beginPath();ctx.moveTo(t1[0],t1[1]);ctx.quadraticCurveTo(tc[0],tc[1]-3,t2[0],t2[1]);ctx.stroke();}
  /* stone steps in front */if(face==='G'){for(let k=0;k<(o.steps||2);k++){const a=g.hl+0.03+k*0.1,hh=(o.steps||2)-k;hoQ([f(a,s-w*0.75,hh*1.2),f(a,s+w*0.75,hh*1.2),f(a+0.11,s+w*0.75,hh*1.2),f(a+0.11,s-w*0.75,hh*1.2)],k%2?'#9A968C':'#A9A59A');hoQ([f(a+0.11,s-w*0.75,hh*1.2),f(a+0.11,s+w*0.75,hh*1.2),f(a+0.11,s+w*0.75,0),f(a+0.11,s-w*0.75,0)],'#7E7A72');}}
  else{const a=s,cc=g.hw;hoQ([f(a-w*0.75,cc+0.03,1.5),f(a+w*0.75,cc+0.03,1.5),f(a+w*0.75,cc+0.15,1.5),f(a-w*0.75,cc+0.15,1.5)],'#A9A59A');hoQ([f(a-w*0.75,cc+0.15,1.5),f(a+w*0.75,cc+0.15,1.5),f(a+w*0.75,cc+0.15,0),f(a-w*0.75,cc+0.15,0)],'#7E7A72');}}
function hoWindow(f,g,face,s,w,h1,h2_,o){o=o||{};const v=g.v||1;w*=g.k||1;h1=g.fh+(h1-g.fh)*v;h2_=g.fh+(h2_-g.fh)*v;hoRect(f,g,face,s-w/2-0.02,s+w/2+0.02,h1-0.8,h2_+0.8,'#3E2E20');hoRect(f,g,face,s-w/2,s+w/2,h1,h2_,o.lit===false?'#2A2622':'#E2B25A');
  ctx.strokeStyle='rgba(70,46,22,0.85)';ctx.lineWidth=0.45;ctx.beginPath();for(let k=-3;k<=3;k++){const a=hoPt(f,g,face,s-w/2+w*Math.max(0,k)/3*0.5,h1+(h2_-h1)*Math.max(0,-k)/3),b2=hoPt(f,g,face,s+w/2-w*Math.max(0,-k)/3*0.5,h2_-(h2_-h1)*Math.max(0,k)/3);
    const c1=hoPt(f,g,face,s-w/2+w*(k+3)/6,h1),c2=hoPt(f,g,face,s-w/2+w*(k+3)/6+w*0.5,h2_);ctx.moveTo(c1[0],c1[1]);ctx.lineTo(c2[0],c2[1]);const d1=hoPt(f,g,face,s+w/2-w*(k+3)/6,h1),d2=hoPt(f,g,face,s+w/2-w*(k+3)/6-w*0.5,h2_);ctx.moveTo(d1[0],d1[1]);ctx.lineTo(d2[0],d2[1]);}ctx.stroke();
  /* re-frame to clip the lattice ends */const fr='#3E2E20';hoRect(f,g,face,s-w/2-0.05,s-w/2,h1-0.8,h2_+0.8,fr);hoRect(f,g,face,s+w/2,s+w/2+0.05,h1-0.8,h2_+0.8,fr);
  if(o.shutters){hoRect(f,g,face,s-w/2-0.11,s-w/2-0.05,h1-0.5,h2_+0.5,o.shutters);hoRect(f,g,face,s+w/2+0.05,s+w/2+0.11,h1-0.5,h2_+0.5,o.shutters);}
  ctx.fillStyle='rgba(255,200,110,0.18)';const m=hoPt(f,g,face,s,(h1+h2_)/2);ctx.beginPath();ctx.ellipse(m[0],m[1],6,4,0,0,6.3);ctx.fill();}
function hoShield(p,a,b,r){r=r||3.4;ctx.fillStyle=a;ctx.beginPath();ctx.arc(p[0],p[1],r,0,6.3);ctx.fill();ctx.fillStyle=b;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.arc(p[0],p[1],r,0,1.57);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.arc(p[0],p[1],r,3.14,4.71);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#3A3330';ctx.lineWidth=0.6;ctx.beginPath();ctx.arc(p[0],p[1],r,0,6.3);ctx.stroke();ctx.fillStyle='#B8B2A6';ctx.beginPath();ctx.arc(p[0],p[1],r*0.28,0,6.3);ctx.fill();}
function hoChop(p){if(!propOK(p[0],p[1]))return;ctx.fillStyle='#8A6A4A';ctx.fillRect(p[0]-2.6,p[1]-5,5.2,5);ctx.fillStyle='#C9A779';ctx.beginPath();ctx.ellipse(p[0],p[1]-5,2.6,1.3,0,0,6.3);ctx.fill();hoLine([p[0],p[1]-5],[p[0]+3,p[1]-11],'#6E543D',0.8);ctx.fillStyle='#8E949A';ctx.beginPath();ctx.moveTo(p[0]-0.5,p[1]-5.5);ctx.lineTo(p[0]+1.6,p[1]-4.4);ctx.lineTo(p[0]+0.8,p[1]-7);ctx.fill();}
function hoLogEnds(f,a1,a2,c,h1,h2_,win){const rr=1.55;for(let h=h1+rr;h<h2_;h+=rr*1.8)for(let a=a1+0.03;a<a2;a+=0.055){const p=f(a+(((h/rr)|0)%2?0.027:0),c,h);ctx.fillStyle=win?'#DCD6CA':'#C59A64';ctx.beginPath();ctx.ellipse(p[0],p[1],rr,rr*0.9,0,0,6.3);ctx.fill();ctx.strokeStyle='rgba(90,60,34,0.7)';ctx.lineWidth=0.4;ctx.stroke();}}
function hoSmoke(p){if(typeof t!=='number')return;for(let k=0;k<3;k++){const q=((t*0.25+k/3)%1);ctx.fillStyle='rgba(225,225,220,'+(0.35*(1-q)).toFixed(2)+')';ctx.beginPath();ctx.arc(p[0]+q*6+Math.sin(t+k)*1.5,p[1]-q*16,1.6+q*3,0,6.3);ctx.fill();}}
function hoLouvre(f,g,a,col){const top=g.wh+g.rh,w=0.09;hoQ([f(a-w,0.06,top-1),f(a+w,0.06,top-1),f(a+w,0.06,top+4),f(a-w,0.06,top+4)],col);hoQ([f(a+w,-0.06,top-1),f(a+w,0.06,top-1),f(a+w,0.06,top+4),f(a+w,-0.06,top+4)],shade(col,0.8));
  hoQ([f(a-w-0.03,0,top+7),f(a+w+0.03,0,top+7),f(a+w+0.03,0.11,top+3.5),f(a-w-0.03,0.11,top+3.5)],shade(col,0.7));hoLine(f(a-w-0.03,0,top+7),f(a+w+0.03,0,top+7),shade(col,0.5),0.8);hoSmoke(f(a,0,top+8));}

/* ---------- the four options ---------- */
function drawHouseOpt(b,win,opt){const L=Math.min(5,b.lvl||1),f=hoFrame(b),sd=(b.id||0)*7+3;
  const K=1.45,V=1.35,sc=g=>{for(const k of ['hl','hw'])g[k]*=K;for(const k of ['fh','wh','rh'])g[k]*=V;g.k=K;g.v=V;return g;};
  const shadowBox=(g)=>{hoQ([f(-g.hl-g.ov+0.15,-g.hw-g.ov+0.15,0),f(g.hl+g.ov+0.15,-g.hw-g.ov+0.15,0),f(g.hl+g.ov+0.15,g.hw+g.ov+0.2,0),f(-g.hl-g.ov+0.15,g.hw+g.ov+0.2,0)],'rgba(38,48,53,0.16)');};
  if(opt===1||HO_ROOFS[opt]||HO_SCH[opt]){const SCx=HO_SCH[opt],RP=SCx?HO_ROOFS[SCx.r]:HO_ROOFS[opt];/* TURF COTTAGE — the reference: turf roof, open timber frame, stone footing, lean-to woodshed */
    const g=sc({sd,hl:[0.42,0.5,0.52,0.58,0.62][L-1],hw:[0.4,0.44,0.46,0.5,0.52][L-1],fh:3.2,wh:[10,11,12,13,14][L-1],rh:[13,14,15,17,18][L-1],ov:0.07,th:3.5,
      wt:'planks',wall:'#8E6A48',wallD:'#74563A',roof:'#7E9656',roofD:'#62773F',roofE:'#5A4A36',rt:'turf',frame:true,frameCol:'#5C3F2A',midPost:L>=2});if(RP)Object.assign(g,RP);if(SCx){g.wall=SCx.wall;g.wallD=SCx.wallD;g.frameCol=SCx.frame;}const DC=SCx?SCx.door:null,SH=SCx?SCx.shut:null,SHD=SCx?SCx.sh:['#3E6A8A','#A34A3A'];
    shadowBox(g);
    /* lean-to woodshed behind, along the ridge (level 3+) */
    if(L>=3){const s={sd,hl:0.22*K,hw:g.hw,fh:0,wh:g.wh-3,rh:g.rh-4,ov:0.06,th:g.th,roof:g.roof,roofD:g.roofD,roofE:g.roofE,rt:g.rt};const off=-g.hl-s.hl+0.02;const fs=(a,c,h)=>f(a+off,c,h);
      const rs=hoRoof(fs,s,win);rs.back();
      hoQ([fs(-s.hl,s.hw,0),fs(s.hl,s.hw,0),fs(s.hl,s.hw,s.wh),fs(-s.hl,s.hw,s.wh)],'#3B2C20');
      hoLogEnds(fs,-s.hl,s.hl,s.hw,0,s.wh*0.62,win);hoQ([fs(-s.hl,s.hw,0),fs(s.hl,s.hw,0),fs(s.hl,s.hw,2.6),fs(-s.hl,s.hw,2.6)],'#8F8C84');
      for(const a of [-s.hl,0,s.hl-0.04])hoQ([fs(a,s.hw,0),fs(a+0.045,s.hw,0),fs(a+0.045,s.hw,s.wh),fs(a,s.hw,s.wh)],'#5C3F2A');
      rs.front();}
    const r=hoRoof(f,g,win);r.back();hoFooting(f,g,win);hoWalls(f,g,win);r.end();
    hoDoor(f,g,'G',0,0.17,Math.min(10.5,g.wh-2),{steps:L>=2?2:1,col:DC||undefined});
    if(L>=2)hoWindow(f,g,'G',-g.hw*0.55,0.1,g.fh+3.5,g.fh+7.5,{shutters:SH});
    if(L>=4)hoWindow(f,g,'L',g.hl*0.35,0.1,g.fh+3.5,g.fh+7.5,{shutters:SH});
    if(L>=3)hoShield(f(g.hl,0,g.wh+g.rh*0.3),SHD[0],SHD[1],3.2);
    r.front();r.ridge();hoBarge(f,g,'#6E4E34',0.32,L>=5);
    if(L>=2){const p=f(g.hl+0.32,g.hw+0.2,0);hoChop(p);}
    if(L>=5){const p=f(-g.hl*0.4,g.hw+0.04,0);ctx.fillStyle='#8A6E52';ctx.fillRect(p[0]-4,p[1]-3,8,3);}
    return;}
  if(opt===2){/* STAVE HOUSE — tall tarred staves, steep shingle roof, carved portal, dragon ends, smoke louvre */
    const g=sc({sd,hl:[0.4,0.46,0.5,0.54,0.58][L-1],hw:[0.34,0.36,0.38,0.4,0.42][L-1],fh:3,wh:[11,12,13,14,15][L-1],rh:[17,19,21,23,25][L-1],ov:0.06,th:1.8,
      wt:'staves',wall:'#5E4636',wallD:'#4B3729',roof:'#4F4A44',roofD:'#3D3934',roofE:'#2E2A26',rt:'shingle',frame:false});
    shadowBox(g);const r=hoRoof(f,g,win);r.back();hoFooting(f,g,win);hoWalls(f,g,win);r.end();
    if(L>=4){/* open gallery (svalgang) along the long wall: posts and a low rail */for(let k=0;k<=5;k++){const a=-g.hl+2*g.hl*k/5;hoQ([f(a,g.hw+0.1,g.fh),f(a+0.03,g.hw+0.1,g.fh),f(a+0.03,g.hw+0.1,g.wh-1),f(a,g.hw+0.1,g.wh-1)],'#3E2E22');}
      hoQ([f(-g.hl,g.hw+0.1,g.fh+3.5),f(g.hl,g.hw+0.1,g.fh+3.5),f(g.hl,g.hw+0.1,g.fh+4.5),f(-g.hl,g.hw+0.1,g.fh+4.5)],'#3E2E22');}
    hoDoor(f,g,'G',0,0.16,Math.min(11,g.wh-1.5),{arch:true,portal:L>=2?'#C9A64A':null,col:'#7A5636',steps:2});
    if(L>=3)hoWindow(f,g,'L',-g.hl*0.4,0.08,g.fh+5,g.fh+8.5,{shutters:'#7A3A2C'});
    r.front();r.ridge();hoBarge(f,g,'#2E2620',0.12,false);
    if(L>=3){const p=f(g.hl+g.ov,0,g.wh+g.rh+1);dragonHead(p,f.dir,'#C9A64A',0.55);}
    if(L>=5){const p=f(-g.hl-g.ov,0,g.wh+g.rh+1);dragonHead(p,-f.dir,'#C9A64A',0.5);}
    hoLouvre(f,g,-g.hl*0.25,'#4A3A2C');
    if(L>=2){const p=f(g.hl+0.3,-g.hw-0.05,0);barrelC(p[0],p[1]);}
    return;}
  if(opt===3){/* LOG HOUSE (laft) — round logs with crossed corners, low turf roof, porch over the door from level 4 */
    const g=sc({sd,hl:[0.36,0.42,0.46,0.5,0.54][L-1],hw:[0.36,0.4,0.42,0.44,0.46][L-1],fh:3,wh:[10,11,12,13,14][L-1],rh:[10,11,12,13,14][L-1],ov:0.08,th:3.5,
      wt:'logs',wall:'#8A6440',wallD:'#6E4E32',roof:'#7E9656',roofD:'#62773F',roofE:'#4E3E2C',rt:L>=4?'slab':'turf',frame:false});
    if(L>=4){g.roof='#7C8086';g.roofD='#63676C';g.roofE='#4A4C50';}
    shadowBox(g);const r=hoRoof(f,g,win);r.back();hoFooting(f,g,win);hoWalls(f,g,win);r.end();
    hoDoor(f,g,'G',-g.hw*0.2,0.15,Math.min(9.5,g.wh-2),{col:'#5A4430',steps:L>=3?2:1});
    if(L>=2)hoWindow(f,g,'G',g.hw*0.5,0.09,g.fh+4,g.fh+7.5,{shutters:'#4E6A50'});
    if(L>=3)hoWindow(f,g,'L',g.hl*0.2,0.09,g.fh+4,g.fh+7.5,{shutters:'#4E6A50'});
    r.front();r.ridge();hoBarge(f,g,'#7A5A3C',0.18,false);
    if(L>=4){/* porch (bislag): small gabled roof on two posts over the door */const pc=-g.hw*0.2,pg={sd,hl:0.13*K,hw:0.13*K,fh:0,wh:g.wh-3,rh:7,ov:0.03*K,th:2,roof:g.roof,roofD:g.roofD,roofE:g.roofE,rt:'shingle'};
      const fp2=(a,c,h)=>f(a+g.hl+0.13,c+pc,h);for(const c of [-0.12,0.1])hoQ([fp2(0.1,c,0),fp2(0.1,c+0.03,0),fp2(0.1,c+0.03,pg.wh),fp2(0.1,c,pg.wh)],'#5A4430');
      const sw=g.hw;const fr=(a,c,h)=>{const p=f(c+g.hl+0.13,a+pc,h);return p;};
      /* porch roof ridge runs out from the gable, so swap axes */const pg2=Object.assign({},pg);const fpr=(a,c,h)=>f(g.hl+0.13+a,pc+c,h);const rr=hoRoof(fpr,pg2,win);rr.back();rr.end();rr.front();rr.ridge();}
    if(L>=3){const p=f(-g.hl*0.3,g.hw+0.18,0);hoChop(p);}
    if(L>=5){hoShield(f(g.hl,0,g.wh+g.rh*0.4),'#C9A64A','#3E3530',3);const p=f(g.hl*0.6,g.hw+0.06,0);barrelC(p[0],p[1]);}
    return;}
  if(opt===4){/* TIMBER-AND-DAUB LONGHOUSE — long and low, limewash between timbers, deep thatch, door on the long side, smoke hole */
    const g=sc({sd,hl:[0.5,0.58,0.64,0.7,0.74][L-1],hw:[0.34,0.38,0.4,0.42,0.44][L-1],fh:2.5,wh:[10,10.5,11,12,12.5][L-1],rh:[12,13,14,15,16][L-1],ov:0.08,th:3.5,
      wt:'daub',wall:'#DCD2BC',wallD:'#C2B8A0',roof:'#B89A5A',roofD:'#9A7E44',roofE:'#7A6234',rt:'thatch',frame:false});
    shadowBox(g);const r=hoRoof(f,g,win);r.back();hoFooting(f,g,win);hoWalls(f,g,win);r.end();
    hoDoor(f,g,'L',g.hl*0.15,0.15,Math.min(7.5,g.wh-1.5),{col:'#6B4E34',frame:'#3E2C1E'});
    if(L>=2)hoWindow(f,g,'L',-g.hl*0.45,0.08,g.fh+2.5,g.fh+5.5,{shutters:'#3E5A6E'});
    if(L>=3)hoWindow(f,g,'G',0,0.08,g.fh+2.5,g.fh+5.5,{shutters:'#3E5A6E'});
    if(L>=4)hoWindow(f,g,'L',g.hl*0.6,0.08,g.fh+2.5,g.fh+5.5,{shutters:'#3E5A6E'});
    r.front();r.ridge();
    /* smoke hole near the ridge */const sh=f(-g.hl*0.2,0.06,g.wh+g.rh-2);hoQ([[sh[0]-3,sh[1]],[sh[0]+3,sh[1]+1.5],[sh[0]+3,sh[1]-1],[sh[0]-3,sh[1]-2.5]],'#3A2C1E');hoSmoke([sh[0],sh[1]-2]);
    hoBarge(f,g,'#5C4230',0.2,L>=4);
    if(L>=3){const p=f(g.hl*0.15,g.hw+0.32,0);barrelC(p[0]+8,p[1]);}
    if(L>=5){hoShield(f(g.hl,0,g.wh+g.rh*0.38),'#A34A3A','#D7CDB4',3);}
    return;}
  _drawHouseOld(b,win);}

/* =================== Jarl's House options (prototype) — window.__setJarl(n) ===================
   Same bowed hip-roof longhouse, taller, on an imposing cut-stone plinth with a stair, carved double door,
   windows on the long side, detailed roof textures and carved Norse dragon finials; no banner. */
let JARL_OPT=0,HO_NOTEX=false;
window.__setJarl=n=>{JARL_OPT=n|0;};
const _roofTex0=roofTex;roofTex=function(at,rt,win,seed){if(HO_NOTEX&&!win)return;return _roofTex0(at,rt,win,seed);};
const _drawShaped0=drawShaped;drawShaped=function(b,win,c0,ax){if(JARL_OPT&&b.t==='jarl'){drawJarlOpt(b,win,JARL_OPT);return true;}return _drawShaped0(b,win,c0,ax);};
/* carved Norse dragon head on a curled neck; dir +1/-1 = facing right/left on screen */
function hoDragon(p,dir,s,col,acc){ctx.save();ctx.translate(p[0],p[1]);ctx.scale(dir*s,s);
  const path=()=>{ctx.beginPath();ctx.moveTo(-2.4,0);ctx.quadraticCurveTo(-4.5,-9,-0.5,-16);ctx.lineTo(-2,-19.5);ctx.lineTo(1,-18.2);ctx.lineTo(1,-22.5);ctx.lineTo(3.4,-19.6);ctx.lineTo(4.2,-22);ctx.lineTo(5.4,-19.8);
    ctx.quadraticCurveTo(9,-21,12.6,-19.2);ctx.lineTo(13.6,-17.6);ctx.lineTo(9.6,-16.8);ctx.lineTo(12.8,-14.4);ctx.lineTo(7.4,-13.6);ctx.quadraticCurveTo(4.4,-12.4,4.2,-9);ctx.quadraticCurveTo(3.2,-4,3.2,0);ctx.closePath();};
  path();ctx.fillStyle=col;ctx.fill();ctx.strokeStyle='rgba(20,14,10,0.75)';ctx.lineWidth=0.5/s;ctx.stroke();
  /* carving: neck scales, jaw line, mane curl, eye, tongue */
  ctx.strokeStyle=acc;ctx.lineWidth=0.45;ctx.beginPath();for(let k=0;k<4;k++){const y=-2.5-k*3.2;ctx.moveTo(-1.6-k*0.5,y);ctx.quadraticCurveTo(0.5,y-1.6,2.6-k*0.1,y-0.2);}
  ctx.moveTo(5.5,-16.2);ctx.quadraticCurveTo(8,-17,9.6,-16.8);ctx.moveTo(6,-14.6);ctx.lineTo(11.5,-14.7);
  ctx.moveTo(0.5,-14);ctx.arc(-0.3,-13.2,1.3,-0.6,4.2);ctx.stroke();
  ctx.fillStyle=acc;ctx.beginPath();ctx.ellipse(6.6,-18.3,1.1,0.8,0,0,6.3);ctx.fill();ctx.fillStyle='#1E1612';ctx.beginPath();ctx.arc(6.9,-18.3,0.45,0,6.3);ctx.fill();
  ctx.strokeStyle='#A33A2C';ctx.lineWidth=0.6;ctx.beginPath();ctx.moveTo(10,-15.6);ctx.quadraticCurveTo(13.5,-15.8,14.6,-14.2);ctx.quadraticCurveTo(15,-13,14,-13.2);ctx.stroke();
  ctx.fillStyle='rgba(255,240,200,0.18)';ctx.beginPath();ctx.moveTo(-1.8,-1);ctx.quadraticCurveTo(-3.6,-9,-0.4,-15.4);ctx.lineTo(0.4,-14.6);ctx.quadraticCurveTo(-2.2,-9,-0.6,-1);ctx.fill();
  ctx.restore();}
function hoPlinth(f,hl,hw,ph,win,sd){const S1=win?'#C9CBC7':'#9C978D',S2=win?'#B2B4B0':'#827D74';
  hoQ([f(-hl,hw,0),f(hl,hw,0),f(hl,hw,ph),f(-hl,hw,ph)],S1);hoQ([f(hl,-hw,0),f(hl,hw,0),f(hl,hw,ph),f(hl,-hw,ph)],S2);
  /* cut blocks, staggered, each a slightly different tone */const rows=Math.max(2,Math.round(ph/3.4));
  for(const face of ['L','G']){const len=face==='L'?hl:hw,pt=(s,h)=>face==='L'?f(s,hw,h):f(hl,s,h);
    for(let r=0;r<rows;r++){const h1=ph*r/rows,h2b=ph*(r+1)/rows,n=Math.round(len*7);for(let k=-1;k<n;k++){const s1=Math.max(-len,-len+2*len*(k+(r%2?0.5:0))/n),s2=Math.min(len,-len+2*len*(k+1+(r%2?0.5:0))/n);if(s2<=s1)continue;
        const tone=h2(sd,r*40+k+(face==='L'?0:300),81);if(tone>0.6)hoQ([pt(s1,h1),pt(s2,h1),pt(s2,h2b),pt(s1,h2b)],tone>0.85?'rgba(255,250,235,0.10)':'rgba(30,26,20,0.10)');
        ctx.strokeStyle='rgba(40,36,30,0.55)';ctx.lineWidth=0.5;ctx.beginPath();const a=pt(s1,h1),b2=pt(s1,h2b);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);ctx.stroke();}
      hoLine(pt(-len,h1),pt(len,h1),'rgba(40,36,30,0.55)',0.5);}}
  /* cap slab with a lit edge, moss at the foot */hoQ([f(-hl,hw,ph),f(hl,hw,ph),f(hl,hw,ph-1.2),f(-hl,hw,ph-1.2)],win?'#E2E4E0':'#B4AFA4');hoQ([f(hl,-hw,ph),f(hl,hw,ph),f(hl,hw,ph-1.2),f(hl,-hw,ph-1.2)],win?'#D0D2CE':'#A19C92');
  hoLine(f(-hl,hw,ph),f(hl,hw,ph),'rgba(255,250,230,0.4)',0.6);hoLine(f(hl,-hw,ph),f(hl,hw,ph),'rgba(255,250,230,0.3)',0.6);
  if(!win){ctx.fillStyle='rgba(92,118,66,0.5)';for(let k=0;k<10;k++){const p=k%2?f((h2(sd,k,82)-0.5)*2*hl,hw,0.6):f(hl,(h2(sd,k,82)-0.5)*2*hw,0.6);ctx.beginPath();ctx.ellipse(p[0],p[1],2.6,1.1,0,0,6.3);ctx.fill();}}}
function hoStair(f,a0,c0,w,ph,n,win){for(let k=0;k<n;k++){const h=ph*(n-k)/n,a=a0+k*0.11;hoQ([f(a,c0-w,h),f(a,c0+w,h),f(a+0.11,c0+w,h),f(a+0.11,c0-w,h)],win?'#E4E6E2':(k%2?'#ABA69B':'#B6B1A6'));
    hoQ([f(a+0.11,c0-w,h),f(a+0.11,c0+w,h),f(a+0.11,c0+w,0),f(a+0.11,c0-w,0)],win?'#BFC1BD':'#8A857C');hoQ([f(a,c0+w,h),f(a+0.11,c0+w,h),f(a+0.11,c0+w,0),f(a,c0+w,0)],win?'#CFD1CD':'#9A958B');}}
const JARL_SET={1:{n:'Turf',rt:'turf',roof:'#7E9656',roofD:'#62773F',dc:'#4A3426',da:'#B04434',wall:'#5E4636',wallD:'#4B3729'},
  2:{n:'Black shingles',rt:'scale',roof:'#2F2C2A',roofD:'#211F1D',dc:'#3A2A1E',da:'#C9A042',wall:'#6A4E38',wallD:'#553E2C'},
  3:{n:'Straw thatch',rt:'thatch',roof:'#C2A25C',roofD:'#9E8042',dc:'#5A4230',da:'#9A7A50',wall:'#5E4636',wallD:'#4B3729'},
  4:{n:'Blue slate',rt:'slab',blue:1,roof:'#5E7488',roofD:'#4A5D6E',dc:'#2E2620',da:'#C9A042',wall:'#8E3B2C',wallD:'#742F23'}};
function drawJarlOpt(b,win,opt){const J=JARL_SET[opt]||JARL_SET[1],f0=hoFrame(b),ax=f0.alongX,sd=(b.id||0)*13+5;
  const hl=1.22,hw=0.8,pad=0.13,ph=7.5,wh=24,rh=26,fP=(a,c,h)=>f0(a,c,(h||0)+ph);
  hoQ([f0(-hl-pad+0.2,-hw-pad+0.2,0),f0(hl+pad+0.25,-hw-pad+0.2,0),f0(hl+pad+0.25,hw+pad+0.3,0),f0(-hl-pad+0.2,hw+pad+0.3,0)],'rgba(38,48,53,0.18)');
  hoPlinth(f0,hl+pad,hw+pad,ph,win,sd);hoStair(f0,hl+pad,0,0.3,ph,3,win);
  const g={sd,hl,hw,fh:1.6,wh,rh:0,wt:'staves',wall:J.wall,wallD:J.wallD,frame:true,frameCol:'#3A2A1E',k:1,v:1};
  hoWalls(fP,g,win);
  /* windows along the long side, shields between them, high under the eaves */
  for(const a of [-0.85,-0.32,0.32,0.85])hoWindow(fP,g,'L',a,0.16,9,14.5,{shutters:'#7A2E22'});
  [-1.12,-0.575,0,0.575,1.12].forEach((a,i)=>hoShield(fP(a,hw,12),i%2?'#D7CDB4':'#A34A3A',i%2?'#A34A3A':'#D7CDB4',3.6));
  hoDoor(fP,g,'G',0,0.4,18,{arch:true,portal:'#C9A64A',col:'#6E4A30',frame:'#2E2018',steps:1});
  {const d1=fP(hl,0,g.fh),d2=fP(hl,0,g.fh+17);hoLine(d1,d2,'#2E2018',0.9);}
  /* torches beside the door */for(const s of [-0.36,0.36]){const p=fP(hl+0.02,s,13);hoLine([p[0],p[1]],[p[0],p[1]-5],'#3A2A1E',1.1);ctx.fillStyle='rgba(255,190,100,0.25)';ctx.beginPath();ctx.ellipse(p[0],p[1]-7,5,4,0,0,6.3);ctx.fill();ctx.fillStyle='#F0A040';ctx.beginPath();ctx.moveTo(p[0]-1.6,p[1]-5);ctx.quadraticCurveTo(p[0],p[1]-10-(typeof t==='number'?Math.sin(t*7)*1.2:0),p[0]+1.6,p[1]-5);ctx.fill();}
  /* the roof: same bowed hip shape as before, raised onto the plinth, with the new surface */
  const cR=ax?{T:fP(-hl,-hw),R:fP(hl,-hw),Bt:fP(hl,hw),L:fP(-hl,hw)}:{T:fP(-hl,-hw),R:fP(-hl,hw),Bt:fP(hl,hw),L:fP(hl,-hw)};
  HO_NOTEX=true;const r=hipRoof(cR,wh,rh,ax,{hp:0.16,sag:10,bow:3,rt:J.rt==='turf'?'turf':'shingle',roof:J.roof,roofD:J.roofD,ov:4,seed:b.id},win);HO_NOTEX=false;
  if(!win){const gr={sd,rt:J.rt,rh:J.rt==='scale'?20:rh,roofD:J.roofD,blue:J.blue};hoRoofSurface(r.at,gr,win);
    /* hip end: courses parallel to the eave */const E=hipEdges(cR,ax),e0=up(E.fe[0],wh-1),e1=up(E.fe[1],wh-1);ctx.strokeStyle=J.rt==='turf'?'rgba(60,84,44,0.4)':'rgba(20,16,12,0.35)';ctx.lineWidth=0.5;ctx.beginPath();
    for(let k=1;k<8;k++){const v=k/8,a=lerp(e0,r.rf,v),b2=lerp(e1,r.rf,v);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}ctx.stroke();}
  hoRidgeDragons(r,ax,1.25,J.dc,J.da);}
/* the ridge beam itself rises at each end into a carved dragon: one tapered piece of wood, head at the top */
function hoDragonBeam(r,end,dir,s,col,acc){const p=end?r.rf:r.rb,q=r.ridge(end?0.9:0.1);let ux=p[0]-q[0],uy=p[1]-q[1];const L=Math.hypot(ux,uy)||1;ux/=L;uy/=L;
  const P0=[p[0]-ux*10*s,p[1]-uy*10*s],P1=[p[0]+ux*4*s,p[1]+uy*4*s-1*s],P2=[p[0]+dir*8*s,p[1]-11*s],P3=[p[0]+dir*4.6*s,p[1]-19*s];
  const bz=t=>{const a=1-t;return [a*a*a*P0[0]+3*a*a*t*P1[0]+3*a*t*t*P2[0]+t*t*t*P3[0],a*a*a*P0[1]+3*a*a*t*P1[1]+3*a*t*t*P2[1]+t*t*t*P3[1]];};
  const n=16,L1=[],R1=[];for(let k=0;k<=n;k++){const t=k/n,a=bz(Math.max(0,t-0.02)),b2=bz(Math.min(1,t+0.02));let nx=-(b2[1]-a[1]),ny=b2[0]-a[0];const ln=Math.hypot(nx,ny)||1;nx/=ln;ny/=ln;const w=(1.7-0.6*t)*s,c=bz(t);L1.push([c[0]+nx*w,c[1]+ny*w]);R1.push([c[0]-nx*w,c[1]-ny*w]);}
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(L1[0][0],L1[0][1]);for(const q2 of L1)ctx.lineTo(q2[0],q2[1]);for(let k=n;k>=0;k--)ctx.lineTo(R1[k][0],R1[k][1]);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(15,10,6,0.6)';ctx.lineWidth=0.45;ctx.stroke();
  /* carved groove along the beam */ctx.strokeStyle=acc;ctx.lineWidth=0.4;ctx.beginPath();for(let k=2;k<=n;k++){const c=bz(k/n);k===2?ctx.moveTo(c[0],c[1]):ctx.lineTo(c[0],c[1]);}ctx.stroke();
  /* head: long narrow snout, open jaw, swept-back crest; flat carved silhouette */
  ctx.save();ctx.translate(P3[0],P3[1]);ctx.scale(dir*s*1.35,s*1.35);
  ctx.beginPath();ctx.moveTo(-1.1,0.6);ctx.lineTo(-1.6,-1.6);ctx.quadraticCurveTo(0.5,-3.6,3,-3.4);ctx.lineTo(8.6,-2.6);ctx.quadraticCurveTo(9.8,-2.4,9.6,-1.4);ctx.lineTo(6.2,-0.9);ctx.lineTo(8.8,0.6);ctx.quadraticCurveTo(9.2,1.3,8.2,1.3);ctx.lineTo(3.4,1.1);ctx.quadraticCurveTo(1.2,1.6,1.1,2.6);ctx.closePath();
  ctx.fillStyle=col;ctx.fill();ctx.strokeStyle='rgba(15,10,6,0.6)';ctx.lineWidth=0.45/s;ctx.stroke();
  /* crest: two thin backward tendrils, the second curling */ctx.strokeStyle=col;ctx.lineWidth=0.9;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,-2.8);ctx.quadraticCurveTo(-2.5,-4.6,-4.6,-3.6);ctx.moveTo(1,-3.2);ctx.quadraticCurveTo(-1,-6.4,-3.4,-6);ctx.quadraticCurveTo(-4.6,-5.6,-3.8,-4.8);ctx.stroke();ctx.lineCap='butt';
  /* carving: eye slit, jaw line, a spiral on the cheek, in the accent */ctx.strokeStyle=acc;ctx.lineWidth=0.35;ctx.beginPath();ctx.moveTo(3.6,-2.2);ctx.lineTo(5.2,-2.4);ctx.moveTo(3.2,0.2);ctx.lineTo(6.4,-0.6);ctx.moveTo(2.3,-0.6);ctx.arc(1.5,-0.6,0.8,0,5.2);ctx.stroke();
  ctx.restore();}
/* ridge beam + both dragon necks as ONE ribbon of wood (one fill, one outline), heads joined under it */
function hoHead(P3,dir,s,col,acc){ctx.save();ctx.translate(P3[0],P3[1]);ctx.scale(dir*s,s);
  ctx.beginPath();ctx.moveTo(-1.1,0.6);ctx.lineTo(-1.6,-1.6);ctx.quadraticCurveTo(0.5,-3.6,3,-3.4);ctx.lineTo(8.6,-2.6);ctx.quadraticCurveTo(9.8,-2.4,9.6,-1.4);ctx.lineTo(6.2,-0.9);ctx.lineTo(8.8,0.6);ctx.quadraticCurveTo(9.2,1.3,8.2,1.3);ctx.lineTo(3.4,1.1);ctx.quadraticCurveTo(1.2,1.6,1.1,2.6);ctx.closePath();
  ctx.fillStyle=col;ctx.fill();ctx.strokeStyle='rgba(15,10,6,0.6)';ctx.lineWidth=0.45/s;ctx.stroke();
  ctx.strokeStyle=col;ctx.lineWidth=0.9;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,-2.8);ctx.quadraticCurveTo(-2.5,-4.6,-4.6,-3.6);ctx.moveTo(1,-3.2);ctx.quadraticCurveTo(-1,-6.4,-3.4,-6);ctx.quadraticCurveTo(-4.6,-5.6,-3.8,-4.8);ctx.stroke();ctx.lineCap='butt';
  ctx.strokeStyle=acc;ctx.lineWidth=0.35;ctx.beginPath();ctx.moveTo(3.6,-2.2);ctx.lineTo(5.2,-2.4);ctx.moveTo(3.2,0.2);ctx.lineTo(6.4,-0.6);ctx.moveTo(2.3,-0.6);ctx.arc(1.5,-0.6,0.8,0,5.2);ctx.stroke();ctx.restore();}
function hoRidgeDragons(r,ax,s,col,acc){const dirF=ax?1:-1,dirB=-dirF;
  const neck=(p,q,dir)=>{let ux=p[0]-q[0],uy=p[1]-q[1];const L=Math.hypot(ux,uy)||1;ux/=L;uy/=L;const P0=p,P1=[p[0]+ux*6*s,p[1]+uy*6*s],P2=[p[0]+dir*8*s,p[1]-11*s],P3=[p[0]+dir*4.6*s,p[1]-19*s];
    const pts=[];for(let k=1;k<=14;k++){const t=k/14,a=1-t;pts.push([a*a*a*P0[0]+3*a*a*t*P1[0]+3*a*t*t*P2[0]+t*t*t*P3[0],a*a*a*P0[1]+3*a*a*t*P1[1]+3*a*t*t*P2[1]+t*t*t*P3[1]]);}return {pts,P3};};
  const F=neck(r.rf,r.ridge(0.96),dirF),Bk=neck(r.rb,r.ridge(0.04),dirB);
  const ridge=[];for(let k=0;k<=24;k++)ridge.push(r.ridge(k/24));
  const C=[...Bk.pts.slice().reverse(),...ridge,...F.pts],nb=Bk.pts.length,nr=ridge.length,N0=C.length;
  const W=i=>{const base=1.35;if(i<nb)return base-0.4*(nb-i)/nb;if(i>=nb+nr)return base-0.4*(i-nb-nr+1)/F.pts.length;return base;};
  const Lp=[],Rp=[];for(let i=0;i<N0;i++){const a=C[Math.max(0,i-1)],b2=C[Math.min(N0-1,i+1)];let nx=-(b2[1]-a[1]),ny=b2[0]-a[0];const ln=Math.hypot(nx,ny)||1;nx/=ln;ny/=ln;const w=W(i)*s;Lp.push([C[i][0]+nx*w,C[i][1]+ny*w]);Rp.push([C[i][0]-nx*w,C[i][1]-ny*w]);}
  hoHead(Bk.P3,dirB,s*1.35,col,acc);hoHead(F.P3,dirF,s*1.35,col,acc);
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(Lp[0][0],Lp[0][1]);for(const q of Lp)ctx.lineTo(q[0],q[1]);for(let i=N0-1;i>=0;i--)ctx.lineTo(Rp[i][0],Rp[i][1]);ctx.closePath();ctx.fill();
  /* outline the two long sides only, stopping short of the heads so the joint has no seam */
  ctx.strokeStyle='rgba(15,10,6,0.6)';ctx.lineWidth=0.45;for(const side of [Lp,Rp]){ctx.beginPath();for(let i=2;i<N0-2;i++){const q=side[i];i===2?ctx.moveTo(q[0],q[1]):ctx.lineTo(q[0],q[1]);}ctx.stroke();}
  /* top highlight and one carved groove running the whole length */
  ctx.strokeStyle='rgba(255,236,200,0.22)';ctx.lineWidth=0.5;ctx.beginPath();for(let i=1;i<N0-1;i++){const q=lerp(C[i],Lp[i],0.6);i===1?ctx.moveTo(q[0],q[1]):ctx.lineTo(q[0],q[1]);}ctx.stroke();
  ctx.strokeStyle=acc;ctx.lineWidth=0.4;ctx.beginPath();for(let i=1;i<N0-1;i++){const q=C[i];i===1?ctx.moveTo(q[0],q[1]):ctx.lineTo(q[0],q[1]);}ctx.stroke();}

/* =================== Town Hall options (prototype) — window.__setTH(n) ===================
   1 Slate hall · 2 Red-board hall · 3 Valhalla: a roof of shields · 4 Ship hall: the roof is an upturned longship */
let TH_OPT=0;window.__setTH=n=>{TH_OPT=n|0;};
const _drawTownHall0=drawTownHall;drawTownHall=function(b,win){if(!TH_OPT)return _drawTownHall0(b,win);drawTHOpt(b,win,TH_OPT);};
const _roofSurf0=hoRoofSurface;hoRoofSurface=function(at,g,win){const det=zoom>1.2,sd=g.sd||1;
  if(!win&&g.rt==='clinker'){/* overlapping strakes running the length, rivet rows, tarred sheen */const rows=Math.round(g.rh/3.2);
    for(let r=1;r<rows;r++){const v=r/rows;hoLine(at(0,v),at(1,v),'rgba(10,6,4,0.55)',0.8);hoLine([at(0,v)[0],at(0,v)[1]-0.8],[at(1,v)[0],at(1,v)[1]-0.8],'rgba(255,230,190,0.13)',0.5);
      if(det){ctx.fillStyle='rgba(200,190,170,0.45)';for(let k=1;k<36;k++){const p=at(k/36,v+0.25/rows);ctx.fillRect(p[0],p[1],0.7,0.7);}}}
    return;}
  if(!win&&g.rt==='shields'){/* Valhalla: rows of round shields overlapping like scales, painted, iron bosses; lower rows drawn last */
    const rows=Math.round(g.rh/4.2),cols=['#A34A3A','#D7CDB4','#C9A042','#3E6A8A','#4E6A44','#7A2E22'];
    for(let r=rows-1;r>=0;r--){const v=(r+0.5)/rows,n=26;for(let k=0;k<n;k++){const u=(k+(r%2?0.5:0)+0.5)/n;if(u>1)continue;const p=at(u,v),ci=(k*3+r*5+sd)%cols.length,R=det?3.1:3.4;
        ctx.fillStyle=cols[ci];ctx.beginPath();ctx.ellipse(p[0],p[1],R,R*0.82,0,0,6.3);ctx.fill();
        if(det){ctx.fillStyle=cols[(ci+3)%cols.length];ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.ellipse(p[0],p[1],R,R*0.82,0,0,1.57);ctx.closePath();ctx.fill();}
        ctx.strokeStyle='rgba(30,20,14,0.7)';ctx.lineWidth=0.5;ctx.beginPath();ctx.ellipse(p[0],p[1],R,R*0.82,0,0,6.3);ctx.stroke();ctx.fillStyle='#8E949A';ctx.beginPath();ctx.arc(p[0],p[1],0.8,0,6.3);ctx.fill();}}
    return;}
  return _roofSurf0(at,g,win);};
function hoAntlers(p,s,col){ctx.strokeStyle=col;ctx.lineCap='round';for(const d of [-1,1]){ctx.lineWidth=1.3*s;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.quadraticCurveTo(p[0]+d*6*s,p[1]-2*s,p[0]+d*9*s,p[1]-10*s);ctx.stroke();ctx.lineWidth=0.9*s;ctx.beginPath();
    for(const k of [0.35,0.6,0.85]){const x=p[0]+d*(3+6*k)*s,y=p[1]-(1+8*k*k)*s;ctx.moveTo(x,y);ctx.lineTo(x+d*1.5*s,y-4*s);}ctx.stroke();}ctx.lineCap='butt';}
function hoBrazier(p){ctx.fillStyle='#2E2A26';ctx.fillRect(p[0]-0.6,p[1]-9,1.2,9);ctx.beginPath();ctx.moveTo(p[0]-4,p[1]-11);ctx.lineTo(p[0]+4,p[1]-11);ctx.lineTo(p[0]+2.5,p[1]-8);ctx.lineTo(p[0]-2.5,p[1]-8);ctx.fill();
  ctx.fillStyle='rgba(255,190,100,0.28)';ctx.beginPath();ctx.ellipse(p[0],p[1]-14,8,6,0,0,6.3);ctx.fill();const fl=typeof t==='number'?Math.sin(t*8+p[0])*1.5:0;ctx.fillStyle='#E8742A';ctx.beginPath();ctx.moveTo(p[0]-3.5,p[1]-11);ctx.quadraticCurveTo(p[0],p[1]-22-fl,p[0]+3.5,p[1]-11);ctx.fill();ctx.fillStyle='#F7C25A';ctx.beginPath();ctx.moveTo(p[0]-1.8,p[1]-11);ctx.quadraticCurveTo(p[0],p[1]-17-fl,p[0]+1.8,p[1]-11);ctx.fill();}
const TH_SET={1:{n:'Slate hall',rt:'slab',blue:1,roof:'#5E7488',roofD:'#4A5D6E',wall:'#5E4636',wallD:'#4B3729',dc:'#2E2620',da:'#C9A042',st:['#6A6660','#56534E','#7E7A73'],sh:true,hp:0.16,sag:14,bow:6,ds:1.7},
  2:{n:'Red-board hall',rt:'boards',roof:'#9A4434',roofD:'#7A3428',wall:'#3E3028',wallD:'#30251F',dc:'#2A1F18',da:'#E0B54E',st:['#5E5A55','#4C4945','#726E68'],sh:true,hp:0.16,sag:14,bow:6,ds:1.7},
  3:{n:'Valhalla: roof of shields',rt:'shields',roof:'#3A2E26',roofD:'#2C221C',wall:'#6E5038',wallD:'#58402C',dc:'#C9A042',da:'#5A3A12',st:['#625E58','#504C47','#77736C'],sh:false,hp:0.14,sag:16,bow:6,ds:1.9},
  4:{n:'Ship hall: upturned longship',rt:'clinker',roof:'#3E2E24',roofD:'#2E221A',wall:'#4E3A2C',wallD:'#3E2E22',dc:'#3A2A1E',da:'#C9A042',st:['#5A5650','#48453F','#6E6A63'],sh:true,hp:0.05,sag:30,bow:9,ds:2.3}};
function hoPlinthDark(f,hl,hw,ph,win,sd,st){/* big dark blocks, heavier cap */const S1=win?'#BFC1BD':st[0],S2=win?'#A7A9A5':st[1];
  hoQ([f(-hl,hw,0),f(hl,hw,0),f(hl,hw,ph),f(-hl,hw,ph)],S1);hoQ([f(hl,-hw,0),f(hl,hw,0),f(hl,hw,ph),f(hl,-hw,ph)],S2);const rows=Math.max(2,Math.round(ph/4.2));
  for(const face of ['L','G']){const len=face==='L'?hl:hw,pt=(s,h)=>face==='L'?f(s,hw,h):f(hl,s,h);
    for(let r=0;r<rows;r++){const h1=ph*r/rows,h2b=ph*(r+1)/rows,n=Math.round(len*5);for(let k=-1;k<n;k++){const s1=Math.max(-len,-len+2*len*(k+(r%2?0.5:0))/n),s2=Math.min(len,-len+2*len*(k+1+(r%2?0.5:0))/n);if(s2<=s1)continue;
        const tone=h2(sd,r*40+k+(face==='L'?0:300),83);hoQ([pt(s1,h1),pt(s2,h1),pt(s2,h2b),pt(s1,h2b)],tone>0.66?'rgba(255,250,235,0.08)':tone<0.3?'rgba(10,8,6,0.14)':'rgba(0,0,0,0)');
        hoLine(pt(s1,h1+0.3),pt(s1,h2b-0.3),'rgba(20,18,16,0.6)',0.55);hoLine(pt(s1+0.02,h2b-0.6),pt(s2-0.02,h2b-0.6),'rgba(255,250,235,0.12)',0.4);}
      hoLine(pt(-len,h1),pt(len,h1),'rgba(20,18,16,0.6)',0.55);}}
  const cap=win?'#E2E4E0':st[2];hoQ([f(-hl-0.03,hw+0.03,ph+1.6),f(hl+0.03,hw+0.03,ph+1.6),f(hl+0.03,hw+0.03,ph),f(-hl-0.03,hw+0.03,ph)],cap);hoQ([f(hl+0.03,-hw-0.03,ph+1.6),f(hl+0.03,hw+0.03,ph+1.6),f(hl+0.03,hw+0.03,ph),f(hl+0.03,-hw-0.03,ph)],shade(cap,0.85));
  hoLine(f(-hl-0.03,hw+0.03,ph+1.6),f(hl+0.03,hw+0.03,ph+1.6),'rgba(255,250,230,0.35)',0.6);
  if(!win){ctx.fillStyle='rgba(84,110,60,0.55)';for(let k=0;k<14;k++){const p=k%2?f((h2(sd,k,84)-0.5)*2*hl,hw,0.6):f(hl,(h2(sd,k,84)-0.5)*2*hw,0.6);ctx.beginPath();ctx.ellipse(p[0],p[1],3,1.2,0,0,6.3);ctx.fill();}}}
function drawTHOpt(b,win,opt){const J=TH_SET[opt]||TH_SET[1],L=thLevel(),hb=thHallRect(b),f0=hoFrame({fx:hb.fx,fy:hb.fy,w:hb.w,h:hb.h,rot:b.rot}),ax=f0.alongX,sd=77+opt;
  const lv=a=>a[L-1],hl=lv([1.42,1.5,1.58,1.66,1.74]),hw=lv([0.82,0.86,0.9,0.94,0.98]),wh=lv([26,28,30,32,34]),rh=lv([34,37,40,43,46]),vl=0.5,pad=0.14;
  const ph=L>=4?13:9,off=vl/2,fPl=(a,c,h)=>f0(a,c+off,h),fP=(a,c,h)=>f0(a,c,(h||0)+ph);
  hoQ([fPl(-hl-pad-0.12+0.25,-hw-off-pad-0.12+0.25,0),fPl(hl+pad+0.4,-hw-off-pad+0.25,0),fPl(hl+pad+0.4,hw+off+pad+0.45,0),fPl(-hl-pad+0.25,hw+off+pad+0.45,0)],'rgba(30,38,42,0.2)');
  if(L>=4){hoPlinthDark(fPl,hl+pad+0.14,hw+off+pad+0.14,ph*0.42,win,sd+1,J.st);const fUp=(a,c,h)=>fPl(a,c,(h||0)+ph*0.42);hoPlinthDark(fUp,hl+pad,hw+off+pad,ph*0.58,win,sd,J.st);}
  else hoPlinthDark(fPl,hl+pad,hw+off+pad,ph,win,sd,J.st);
  /* stair toward the plaza, in front of the vestibule */const fS=(a,c,h)=>f0(c,a,h);hoStair(fS,hw+vl+pad+(L>=4?0.14:0),0,0.36,ph,L>=4?4:3,win);
  
  /* back annex from level 2 (a low lean-to behind, peeks over the roof line) */
  const g={sd,hl,hw,fh:1.6,wh,rh:0,wt:'staves',wall:J.wall,wallD:J.wallD,frame:true,frameCol:'#2E2018',k:1,v:1};
  hoWalls(fP,g,win);
  /* windows and shields along the front, clear of the vestibule */
  /* shield, window, shield on each side of the vestibule */const k=hl/1.74,SC=[['#A34A3A','#D7CDB4'],['#C9A042','#2E3A44']];
  [-0.96,0.96].forEach(a=>hoWindow(fP,g,'L',a*k,0.17,10,16,{shutters:'#7A2E22'}));[-1.4,-0.56,0.56,1.4].forEach((a,i)=>hoShield(fP(a*k,hw,13),SC[i%2][0],SC[i%2][1],4.2));
  for(const cc of [-0.5,0.5])hoWindow(fP,g,'G',cc*hw,0.14,10,16,{shutters:'#7A2E22'});hoShield(fP(hl,0,13),'#A34A3A','#D7CDB4',4.2);
  /* no shields on the walls: windows only */
  /* main roof */
  const cR=ax?{T:fP(-hl,-hw),R:fP(hl,-hw),Bt:fP(hl,hw),L:fP(-hl,hw)}:{T:fP(-hl,-hw),R:fP(-hl,hw),Bt:fP(hl,hw),L:fP(hl,-hw)};
  HO_NOTEX=true;const r=hipRoof(cR,wh,rh,ax,{hp:J.hp,sag:J.sag,bow:J.bow,rt:'shingle',roof:J.roof,roofD:J.roofD,ov:5,seed:sd},win);HO_NOTEX=false;
  if(!win){hoRoofSurface(r.at,{sd,rt:J.rt,rh:J.rt==='slab'||J.rt==='boards'?rh*0.6:rh,roofD:J.roofD,blue:J.blue},win);
    const E=hipEdges(cR,ax),e0=up(E.fe[0],wh-1),e1=up(E.fe[1],wh-1);ctx.strokeStyle='rgba(15,12,10,0.35)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=1;k<10;k++){const v=k/10,a=lerp(e0,r.rf,v),b2=lerp(e1,r.rf,v);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}ctx.stroke();
    if(L>=4){/* gilded eave trim */ctx.strokeStyle='rgba(201,160,66,0.8)';ctx.lineWidth=0.7;ctx.beginPath();for(let k=0;k<=20;k++){const p=r.at(k/20,0.01);k?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();}}
  if(L>=3)hoRidgePiece(r,ax,J.ds,J.dc,J.da,0,0.34,true,false);
  /* raised lantern from level 3: walls stand ON the roof (bottom follows the slope), lead flashing and a shadow where they meet, its own small roof */
  if(L>=3){const u0=0.34,u1=0.66,v0=0.55,bh=L>=5?13:11,rise=11,K=12,lift=(p,h)=>[p[0],p[1]-h],Ep=u=>r.at(u,v0),Rr=u=>r.ridge(u),us=[...Array(K+1)].map((_,k)=>u0+(u1-u0)*k/K);
    /* soft shadow on the roof just below the lantern */poly([].concat(...us.map(u=>r.at(u,v0-0.1)),...us.slice().reverse().map(u=>Ep(u))),'rgba(10,8,6,0.22)');
    poly([].concat(...us.map(u=>Ep(u)),...us.slice().reverse().map(u=>lift(Ep(u),bh))),win?'#C9CCC8':J.wall);
    poly([].concat(Ep(u1),lift(Ep(u1),bh),lift(Rr(u1),bh),Rr(u1)),win?'#BFC3BF':J.wallD);
    if(!win){ctx.strokeStyle='rgba(20,14,10,0.5)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=1;k<K;k++){const p=Ep(us[k]);ctx.moveTo(p[0],p[1]-1);ctx.lineTo(p[0],p[1]-bh+1);}ctx.stroke();
      for(let k=2;k<K-1;k+=3){const a=us[k],b2=us[k+1],p1=Ep(a),p2=Ep(b2);hoQ([lift(p1,3),lift(p2,3),lift(p2,bh-3),lift(p1,bh-3)],'#E2B25A');hoQ([lift(p1,3),lift(p2,3),lift(p2,bh-3),lift(p1,bh-3)].map(q=>q),'rgba(0,0,0,0)');
        ctx.strokeStyle='rgba(70,46,22,0.8)';ctx.lineWidth=0.4;ctx.beginPath();const m1=lerp(p1,p2,0.5);ctx.moveTo(m1[0],m1[1]-3);ctx.lineTo(m1[0],m1[1]-bh+3);ctx.stroke();}}
    /* lead flashing along the foot of the lantern */ctx.strokeStyle=win?'#E8ECEC':'#8A8F94';ctx.lineWidth=1.3;ctx.beginPath();for(let k=0;k<=K;k++){const p=Ep(us[k]);k?ctx.lineTo(p[0],p[1]+0.4):ctx.moveTo(p[0],p[1]+0.4);}const pe=Rr(u1);ctx.lineTo(pe[0],pe[1]+0.4);ctx.stroke();
    const ue0=u0-0.02,ue1=u1+0.02,Eu=u=>lift(r.at(u,v0-0.04),bh),Ru=u=>lift(Rr(u),bh+rise),ru=[...Array(K+1)].map((_,k)=>ue0+0.06+(ue1-ue0-0.12)*k/K);
    poly([].concat(Eu(ue1),lift(Rr(ue1),bh),Ru(ru[K])),win?'#DCE2E1':J.roofD);
    poly([].concat(...[...Array(K+1)].map((_,k)=>Eu(ue0+(ue1-ue0)*k/K)),...ru.slice().reverse().map(u=>Ru(u))),win?'#EEF1F0':J.roof);
    if(!win)hoRoofSurface((a,v)=>lerp(Eu(ue0+(ue1-ue0)*a),Ru(ru[0]+(ru[K]-ru[0])*a),v),{sd:sd+3,rt:J.rt==='shields'?'scale':J.rt,rh:J.rt==='shields'?14:rise+6,roofD:J.roofD,blue:J.blue},win);
    hoLine(Ru(ru[0]),Ru(ru[K]),J.dc,1.8);}
  if(L>=3)hoRidgePiece(r,ax,J.ds,J.dc,J.da,0.66,1,false,true);else hoRidgeDragons(r,ax,J.ds,J.dc,J.da);
  /* vestibule (antechamber) in front of the door: its own gable faces the plaza, Urnes portal, antlers on the apex */
  const vw=0.36,gv={sd:sd+9,hl:vl/2,hw:vw,fh:1.6,wh:wh*0.74,rh:20,ov:0.06,th:J.rt==='slab'?2:1.8,wt:'staves',wall:J.wall,wallD:J.wallD,roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt==='shields'||J.rt==='clinker'?'scale':J.rt,blue:J.blue,frame:true,frameCol:'#2E2018',k:1,v:1};
  const fv=(a2,c2,h)=>fP(c2,hw+vl/2+a2-0.02,h);const rv=hoRoof(fv,gv,win);rv.back();hoWalls(fv,gv,win);rv.end();
  hoDoor(fv,gv,'G',0,0.34,gv.wh-5,{arch:true,portal:'#C9A64A',col:'#5E3E26',frame:'#24180F',steps:0});
  {/* Urnes interlace: extra gold ribbons over the door frame */const fh=gv.fh,hd=gv.wh-5,pt=(s,h)=>fv(gv.hl,s,h);ctx.strokeStyle='#D9B356';ctx.lineWidth=0.7;ctx.beginPath();for(let k=0;k<5;k++){const s=-0.2+0.1*k,p=pt(s,fh+hd+3),q=pt(s+0.1,fh+hd+3);ctx.moveTo(p[0],p[1]);ctx.bezierCurveTo(p[0]+2,p[1]-5,q[0]-2,q[1]+3,q[0],q[1]);}ctx.stroke();
    ctx.beginPath();for(const s of [-0.21,0.21]){const a=pt(s,fh),b2=pt(s,fh+hd);ctx.moveTo(a[0],a[1]);for(let k=1;k<=8;k++){const p=lerp(a,b2,k/8);ctx.bezierCurveTo(p[0]+3,p[1]+3,p[0]-3,p[1]+1,p[0],p[1]);}}ctx.stroke();}
  for(const s2 of [-0.27,0.27]){/* small wall torch: iron bracket, wrapped head, little flame */const p=fv(gv.hl+0.02,s2,gv.wh-8),fl=typeof t==='number'?Math.sin(t*9+s2*10)*0.8:0;
    ctx.fillStyle='rgba(255,190,100,0.22)';ctx.beginPath();ctx.ellipse(p[0],p[1]-5,4,3,0,0,6.3);ctx.fill();hoLine([p[0],p[1]+1.5],[p[0],p[1]-2.5],'#4A3424',0.9);hoLine([p[0]-0.9,p[1]],[p[0]+0.9,p[1]],'#2A2622',0.6);
    ctx.fillStyle='#6E5440';ctx.fillRect(p[0]-0.7,p[1]-3.5,1.4,1.2);ctx.fillStyle='#E8742A';ctx.beginPath();ctx.moveTo(p[0]-1.1,p[1]-3.4);ctx.quadraticCurveTo(p[0],p[1]-7.5-fl,p[0]+1.1,p[1]-3.4);ctx.fill();ctx.fillStyle='#F7C25A';ctx.beginPath();ctx.moveTo(p[0]-0.5,p[1]-3.4);ctx.quadraticCurveTo(p[0],p[1]-5.6-fl,p[0]+0.5,p[1]-3.4);ctx.fill();}
  hoWindow(fv,gv,'L',0,0.12,8,13,{shutters:'#7A2E22'});
  rv.front();rv.ridge();hoBarge(fv,gv,J.dc,0.25,true);hoAntlers(fv(gv.hl+gv.ov,0,gv.wh+gv.rh+1),1.15,'#E6DCC4');
  if(L>=2&&opt!==3)hoShield(fv(gv.hl,0,gv.wh+gv.rh*0.38),'#C9A042','#2E3A44',3.6);}
/* ridge beam piece between ua and ub (0..1 along the ridge); a dragon neck+head at the back end (hb) and/or front end (hf) */
function hoRidgePiece(r,ax,s,col,acc,ua,ub,hb,hf){const dirF=ax?1:-1,dirB=-dirF;
  const neck=(p,q,dir)=>{let ux=p[0]-q[0],uy=p[1]-q[1];const L=Math.hypot(ux,uy)||1;ux/=L;uy/=L;const P0=p,P1=[p[0]+ux*6*s,p[1]+uy*6*s],P2=[p[0]+dir*8*s,p[1]-11*s],P3=[p[0]+dir*4.6*s,p[1]-19*s];
    const pts=[];for(let k=1;k<=14;k++){const t=k/14,a=1-t;pts.push([a*a*a*P0[0]+3*a*a*t*P1[0]+3*a*t*t*P2[0]+t*t*t*P3[0],a*a*a*P0[1]+3*a*a*t*P1[1]+3*a*t*t*P2[1]+t*t*t*P3[1]]);}return {pts,P3};};
  const F=hf?neck(r.rf,r.ridge(0.96),dirF):null,Bk=hb?neck(r.rb,r.ridge(0.04),dirB):null;
  const n=Math.max(4,Math.round(24*(ub-ua))),ridge=[];for(let k=0;k<=n;k++)ridge.push(r.ridge(ua+(ub-ua)*k/n));
  const bp=Bk?Bk.pts.slice().reverse():[],fpp=F?F.pts:[],C=[...bp,...ridge,...fpp],nb=bp.length,nr=ridge.length,N0=C.length;
  const W=i=>{const base=1.35;if(i<nb)return base-0.4*(nb-i)/nb;if(i>=nb+nr)return base-0.4*(i-nb-nr+1)/fpp.length;return base;};
  const Lp=[],Rp=[];for(let i=0;i<N0;i++){const a=C[Math.max(0,i-1)],b2=C[Math.min(N0-1,i+1)];let nx=-(b2[1]-a[1]),ny=b2[0]-a[0];const ln=Math.hypot(nx,ny)||1;nx/=ln;ny/=ln;const w=W(i)*s;Lp.push([C[i][0]+nx*w,C[i][1]+ny*w]);Rp.push([C[i][0]-nx*w,C[i][1]-ny*w]);}
  if(Bk)hoHead(Bk.P3,dirB,s*1.35,col,acc);if(F)hoHead(F.P3,dirF,s*1.35,col,acc);
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(Lp[0][0],Lp[0][1]);for(const q of Lp)ctx.lineTo(q[0],q[1]);for(let i=N0-1;i>=0;i--)ctx.lineTo(Rp[i][0],Rp[i][1]);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(15,10,6,0.6)';ctx.lineWidth=0.45;const i0=Bk?2:0,i1=F?N0-2:N0;for(const side of [Lp,Rp]){ctx.beginPath();for(let i=i0;i<i1;i++){const q=side[i];i===i0?ctx.moveTo(q[0],q[1]):ctx.lineTo(q[0],q[1]);}ctx.stroke();}
  /* a cut end where the beam meets the lantern wall */if(!Bk){hoLine(Lp[0],Rp[0],'rgba(15,10,6,0.7)',0.6);}if(!F){hoLine(Lp[N0-1],Rp[N0-1],'rgba(255,230,190,0.35)',0.6);}
  ctx.strokeStyle='rgba(255,236,200,0.22)';ctx.lineWidth=0.5;ctx.beginPath();for(let i=1;i<N0-1;i++){const q=lerp(C[i],Lp[i],0.6);i===1?ctx.moveTo(q[0],q[1]):ctx.lineTo(q[0],q[1]);}ctx.stroke();
  ctx.strokeStyle=acc;ctx.lineWidth=0.4;ctx.beginPath();for(let i=1;i<N0-1;i++){const q=C[i];i===1?ctx.moveTo(q[0],q[1]):ctx.lineTo(q[0],q[1]);}ctx.stroke();}
/* small iron lantern on a post with a cross-arm: frame, glass glow, a cap */
function hoLampPost(p,h){const top=[p[0],p[1]-h];ctx.fillStyle='#2A2622';ctx.fillRect(p[0]-0.8,p[1]-h,1.6,h);ctx.fillRect(p[0]-1.6,p[1]-1.2,3.2,1.2);hoLine([p[0],p[1]-h+1],[p[0]+4,p[1]-h+1],'#2A2622',0.9);
  const lx=p[0]+4,ly=p[1]-h+2;ctx.fillStyle='rgba(255,196,110,0.22)';ctx.beginPath();ctx.ellipse(lx,ly+3,7,5,0,0,6.3);ctx.fill();
  ctx.fillStyle='#F2C060';ctx.fillRect(lx-1.6,ly+1,3.2,4);ctx.strokeStyle='#2A2622';ctx.lineWidth=0.5;ctx.strokeRect(lx-1.6,ly+1,3.2,4);hoLine([lx,ly+1],[lx,ly+5],'#2A2622',0.4);
  ctx.fillStyle='#2A2622';ctx.beginPath();ctx.moveTo(lx-2.2,ly+1);ctx.lineTo(lx+2.2,ly+1);ctx.lineTo(lx,ly-1);ctx.fill();ctx.fillRect(lx-1.8,ly+5,3.6,0.8);}
/* plaza: only the feast hearth (raised stone ring on its own flagstone circle, log benches) and lights */
const _drawPlaza0=drawPlaza;drawPlaza=function(b,win){if(!TH_OPT)return _drawPlaza0(b,win);
  const L=thLevel(),mr=TH_MX[(b.rot|0)&3],at=(x,y)=>iso(b.fx+(mr[0]?6-x:x)-0.5,b.fy+(mr[1]?6-y:y)-0.5),fire=at(5.12,5.12),feast=feastOn(),F=fire;ctx.save();
  /* flagstone circle, lighter than the plaza, with a kerb */ctx.fillStyle=win?'#E0E3E0':'#B9B2A4';ctx.beginPath();ctx.ellipse(F[0],F[1],27,13.5,0,0,6.3);ctx.fill();
  for(let ring=0;ring<2;ring++){const R=ring?23:16,n=ring?18:12;for(let k=0;k<n;k++){const a=(k+ring*0.5)/n*6.283;ctx.fillStyle=(k+ring)%3===0?(win?'#CDD0CD':'#A79F90'):(win?'#D6D9D6':'#C3BCAE');ctx.beginPath();ctx.ellipse(F[0]+Math.cos(a)*R,F[1]+Math.sin(a)*R*0.5,ring?5:4.4,ring?2.4:2.1,0,0,6.3);ctx.fill();}}
  ctx.strokeStyle=win?'#B9BCB9':'#7E776B';ctx.lineWidth=1.1;ctx.beginPath();ctx.ellipse(F[0],F[1],27,13.5,0,0,6.3);ctx.stroke();
  /* log benches */const bench=(a)=>{const x=F[0]+Math.cos(a)*21,y=F[1]+Math.sin(a)*10.5;ctx.save();ctx.translate(x,y);ctx.rotate(a+1.57);ctx.scale(1,0.5);ctx.fillStyle='#7A5A3C';ctx.fillRect(-7,-2,14,4);ctx.fillStyle='#C9A779';ctx.beginPath();ctx.ellipse(-7,0,1.3,2,0,0,6.3);ctx.ellipse(7,0,1.3,2,0,0,6.3);ctx.fill();ctx.restore();};
  [3.6,4.6,5.6,0.6,1.6].forEach(bench);
  /* raised hearth: two courses of stones, ember bed, crossed logs */for(let c2=0;c2<2;c2++){for(let k=0;k<12;k++){const a=k/12*6.283;ctx.fillStyle=k%2?(win?'#B5B8B5':'#7C766C'):(win?'#C3C6C3':'#8E877B');ctx.beginPath();ctx.ellipse(F[0]+Math.cos(a)*10,F[1]+Math.sin(a)*5-c2*2.4,3,2,0,0,6.3);ctx.fill();}}
  ctx.fillStyle='#2A1E16';ctx.beginPath();ctx.ellipse(F[0],F[1]-3,9,4.4,0,0,6.3);ctx.fill();ctx.fillStyle='rgba(230,110,40,0.75)';ctx.beginPath();ctx.ellipse(F[0],F[1]-3,6.5,3,0,0,6.3);ctx.fill();
  hoLine([F[0]-6,F[1]-1],[F[0]+5,F[1]-6],'#4A3020',2);hoLine([F[0]+6,F[1]-1],[F[0]-5,F[1]-6],'#5A3A26',2);
  const big=feast?1.8:1.15,tt=typeof t==='number'?t:0;ctx.fillStyle='rgba(255,180,90,'+(feast?0.3:0.2)+')';ctx.beginPath();ctx.ellipse(F[0],F[1]-4,30*big,15*big,0,0,6.3);ctx.fill();
  for(const [dx,hh,col] of [[-3,14,'#D9561E'],[3,12,'#E8742A'],[0,18,'#E8742A'],[0,10,'#F7C25A']]){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(F[0]+dx-4*big,F[1]-3);ctx.quadraticCurveTo(F[0]+dx+Math.sin(tt*6+dx)*1.5,F[1]-3-(hh+Math.sin(tt*9+dx)*2.5)*big,F[0]+dx+4*big,F[1]-3);ctx.fill();}
  for(let k=0;k<5;k++){const q=((tt*0.7+k/5)%1);ctx.fillStyle='rgba(255,210,120,'+(1-q).toFixed(2)+')';ctx.fillRect(F[0]+Math.sin(k*7+tt)*6*q,F[1]-12-q*26*big,1,1);}
  if(feast){ctx.strokeStyle='#3A2A1E';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(F[0]-16,F[1]-2);ctx.lineTo(F[0]-16,F[1]-20);ctx.moveTo(F[0]+16,F[1]-2);ctx.lineTo(F[0]+16,F[1]-20);ctx.moveTo(F[0]-19,F[1]-18);ctx.lineTo(F[0]+19,F[1]-18);ctx.stroke();
    ctx.fillStyle='#B0705A';ctx.beginPath();ctx.ellipse(F[0],F[1]-18,10,5.5,0,0,6.3);ctx.fill();const cols=['#5E7F8C','#8E5A4E','#7C8A6A','#4B6A76','#A34A3A','#6E5248','#C9A64A','#5E7F8C'];for(let k=0;k<8;k++){const a=tt*0.6+k/8*6.283;dancer(F[0]+Math.cos(a)*36-4,F[1]+Math.sin(a)*18-14,tt*2+k,cols[k]);}}
  /* lights: lantern posts at the plaza corners and beside the hearth (level 2+: more) */
  
  ctx.restore();};

/* =================== Hof options (prototype) — window.__setHof(n) ===================
   Stave-church temple: hall on a plinth, covered gallery, a tower that stands ON the roof (its walls follow the roof slopes, flashing at the foot),
   stacked pyramid skirts, spire, ridge-beam dragons that stop at the tower, carved portal, geometric sacred pole and stone altar beside the door. */
let HOF_OPT=0;window.__setHof=n=>{HOF_OPT=n|0;};
const _drawExtra2_0=drawExtra2;drawExtra2=function(b,win,c0,ax){if(HOF_OPT&&b.t==='hof'){drawHofOpt(b,win,HOF_OPT);return true;}return _drawExtra2_0(b,win,c0,ax);};
const HOF_SET={1:{n:'Black stave',rt:'scale',roof:'#2F2C2A',roofD:'#211F1D',dc:'#2A1F18',da:'#C9A042',wall:'#4E3A2C',wallD:'#3E2E22'},
  2:{n:'Silver shingles',rt:'scale',roof:'#8C877F',roofD:'#706B64',dc:'#7A2E22',da:'#E0B54E',wall:'#5E4636',wallD:'#4B3729'},
  3:{n:'Uppsala gold',rt:'scale',roof:'#2F2C2A',roofD:'#211F1D',dc:'#C9A042',da:'#5A3A12',wall:'#3E3028',wallD:'#30251F',chain:true},
  4:{n:'Turf and stave',rt:'scale',roof:'#2F2C2A',roofD:'#211F1D',dc:'#2A1F18',da:'#C9A042',wall:'#4E3A2C',wallD:'#3E2E22',turfGal:true}};
/* pyramid skirt around a square of half-size s at height e, apex at height ap (centre a0,c0); returns plane mapper for texture */
function hoPyramid(f,a0,c0,s,e,ap,col,colD,rt,win,sd){const A=f(a0,c0,ap),q=(da,dc)=>f(a0+da*s,c0+dc*s,e);
  hoQ([q(-1,-1),q(1,-1),A],colD);hoQ([q(-1,-1),q(-1,1),A],colD);
  hoQ([q(1,-1),q(1,1),A],win?'#D3DAD9':colD);hoQ([q(-1,1),q(1,1),A],win?'#EEF1F0':col);
  if(!win){hoRoofSurface((u,v)=>lerp(lerp(q(-1,1),q(1,1),u),A,v),{sd,rt,rh:Math.max(8,(ap-e)*0.8),roofD:colD},win);
    ctx.strokeStyle='rgba(15,12,10,0.4)';ctx.lineWidth=0.45;ctx.beginPath();for(let k=1;k<6;k++){const v=k/6,a=lerp(q(1,-1),A,v),b2=lerp(q(1,1),A,v);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}ctx.stroke();}
  hoLine(q(1,1),A,'rgba(10,8,6,0.6)',0.7);hoLine(q(-1,1),q(1,1),'rgba(255,240,210,0.2)',0.6);return {A,q};}
function hoBox(f,a0,c0,s,h1,h2b,W,WD,win){hoQ([f(a0-s,c0+s,h1),f(a0+s,c0+s,h1),f(a0+s,c0+s,h2b),f(a0-s,c0+s,h2b)],win?'#C9CCC8':W);hoQ([f(a0+s,c0-s,h1),f(a0+s,c0+s,h1),f(a0+s,c0+s,h2b),f(a0+s,c0-s,h2b)],win?'#B5B9B6':WD);
  ctx.strokeStyle='rgba(20,14,10,0.45)';ctx.lineWidth=0.45;ctx.beginPath();for(let k=1;k<6;k++){const p=f(a0-s+2*s*k/6,c0+s,h1),p2=f(a0-s+2*s*k/6,c0+s,h2b),q=f(a0+s,c0-s+2*s*k/6,h1),q2=f(a0+s,c0-s+2*s*k/6,h2b);ctx.moveTo(p[0],p[1]);ctx.lineTo(p2[0],p2[1]);ctx.moveTo(q[0],q[1]);ctx.lineTo(q2[0],q2[1]);}ctx.stroke();}
function hoChain(pts,col){/* golden chain hanging in swags between points */ctx.strokeStyle=col;ctx.lineWidth=0.7;for(let i=0;i<pts.length-1;i++){const a=pts[i],b2=pts[i+1],m=[(a[0]+b2[0])/2,(a[1]+b2[1])/2+4];ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.quadraticCurveTo(m[0],m[1]+2,b2[0],b2[1]);ctx.stroke();
  for(let k=1;k<6;k++){const tt=k/6,x=(1-tt)*(1-tt)*a[0]+2*(1-tt)*tt*m[0]+tt*tt*b2[0],y=(1-tt)*(1-tt)*a[1]+2*(1-tt)*tt*(m[1]+2)+tt*tt*b2[1];ctx.fillStyle=col;ctx.fillRect(x-0.5,y-0.5,1,1);}}}
/* geometric sacred pole: stepped stone base, square shaft in two shades, carved painted bands (chevrons, diamonds, triangles), stepped capital, one-eyed mask and a gold valknut */
function hoSacredPole(f,a,c,win){const H=42,w=0.06,col='#6E5038',colD='#56402C',P=(da,dc,h)=>f(a+da,c+dc,h);
  for(let k=0;k<2;k++){const s=0.16-k*0.05,h1=k*2.2,h2b=h1+2.2;hoBox(f,a,c,s,h1,h2b,win?'#D0D2CE':'#9C978D',win?'#B9BBB7':'#827D74',win);hoQ([P(-s,s,h2b),P(s,s,h2b),P(s,-s,h2b),P(-s,-s,h2b)],win?'#E4E6E2':'#B4AFA4');}
  const h0=4.4;hoQ([P(-w,w,h0),P(w,w,h0),P(w,w,H),P(-w,w,H)],col);hoQ([P(w,-w,h0),P(w,w,h0),P(w,w,H),P(w,-w,H)],colD);
  /* bands on both faces */const band=(h1,h2b,kind,c1)=>{for(const face of [0,1]){const pt=(s,h)=>face?P(w,s,h):P(s,w,h),shd=face?0.8:1;
      hoQ([pt(-w,h1),pt(w,h1),pt(w,h1+0.6),pt(-w,h1+0.6)],'rgba(20,14,10,0.6)');
      if(kind==='chev'){for(let k=0;k<3;k++){const y=h1+1+k*((h2b-h1-1)/3);ctx.strokeStyle=shade(c1,shd);ctx.lineWidth=0.8;ctx.beginPath();const p1=pt(-w,y),p2=pt(0,y+1.6),p3=pt(w,y);ctx.moveTo(p1[0],p1[1]);ctx.lineTo(p2[0],p2[1]);ctx.lineTo(p3[0],p3[1]);ctx.stroke();}}
      else if(kind==='dia'){const m=(h1+h2b)/2,d=(h2b-h1)/2-0.6;hoQ([pt(0,m-d),pt(w,m),pt(0,m+d),pt(-w,m)],shade(c1,shd));hoQ([pt(0,m-d*0.45),pt(w*0.45,m),pt(0,m+d*0.45),pt(-w*0.45,m)],'#2A1F18');}
      else{hoQ([pt(-w,h1+0.8),pt(w,h1+0.8),pt(0,h2b-0.4)],shade(c1,shd));hoQ([pt(-w,h2b-0.4),pt(0,h1+0.8),pt(-w,h1+0.8)].map(q=>q),'rgba(0,0,0,0)');}}};
  band(7,12,'chev','#A34A3A');band(12,18,'dia','#C9A042');band(18,23,'tri','#2E2A26');band(23,28,'chev','#C9A042');band(28,33,'dia','#A34A3A');
  /* stepped capital */hoBox(f,a,c,w+0.025,H,H+1.5,'#5A4230','#46341F',win);hoBox(f,a,c,w+0.045,H+1.5,H+2.8,'#6E5038','#56402C',win);
  /* one-eyed mask on the front face, just under the capital */const m=(s,h)=>P(s,w+0.001,h);hoQ([m(-w,H-1),m(w,H-1),m(w*0.6,H-7),m(0,H-8.5),m(-w*0.6,H-7)],'#8A6A4A');
  hoQ([m(-w*0.9,H-2),m(-w*0.1,H-2.6),m(-w*0.2,H-3.4),m(-w*0.9,H-3)],'#2A1F18');hoQ([m(w*0.1,H-2.6),m(w*0.9,H-2),m(w*0.9,H-3),m(w*0.2,H-3.4)],'#2A1F18');
  {const e=m(-w*0.45,H-4.2);ctx.fillStyle='#E0D4B0';ctx.beginPath();ctx.arc(e[0],e[1],0.7,0,6.3);ctx.fill();const e2=m(w*0.45,H-4.2);hoLine([e2[0]-0.8,e2[1]],[e2[0]+0.8,e2[1]],'#2A1F18',0.6);}
  /* gold valknut on top */const tp=P(0,0,H+3);ctx.strokeStyle='#D9B356';ctx.lineWidth=0.8;for(let k=0;k<3;k++){const ox=(k-1)*2.4,oy=k===1?-2.4:0;ctx.beginPath();ctx.moveTo(tp[0]+ox,tp[1]-7+oy);ctx.lineTo(tp[0]+ox+3,tp[1]-2+oy);ctx.lineTo(tp[0]+ox-3,tp[1]-2+oy);ctx.closePath();ctx.stroke();}}
function hoAltar(f,a,c,win){/* hörgr: stacked stones, flat slab, a bronze bowl */hoBox(f,a,c,0.15,0,3.2,win?'#C9CBC7':'#8E8980',win?'#B2B4B0':'#76726A',win);hoBox(f,a,c,0.12,3.2,5.6,win?'#D0D2CE':'#9C978D',win?'#B9BBB7':'#827D74',win);
  const P=(da,dc,h)=>f(a+da,c+dc,h);hoQ([P(-0.17,0.17,6.6),P(0.17,0.17,6.6),P(0.17,-0.17,6.6),P(-0.17,-0.17,6.6)],win?'#E8EAE6':'#B4AFA4');hoQ([P(-0.17,0.17,5.6),P(0.17,0.17,5.6),P(0.17,0.17,6.6),P(-0.17,0.17,6.6)],win?'#D6D8D4':'#A19C92');hoQ([P(0.17,-0.17,5.6),P(0.17,0.17,5.6),P(0.17,0.17,6.6),P(0.17,-0.17,6.6)],win?'#C6C8C4':'#8E897F');
  const bw=P(0,0,6.6);ctx.fillStyle='#8A6A3A';ctx.beginPath();ctx.ellipse(bw[0],bw[1]-1,3,1.4,0,0,3.14);ctx.fill();ctx.fillStyle='#B88A4A';ctx.beginPath();ctx.ellipse(bw[0],bw[1]-1,3,1.2,0,3.14,6.28);ctx.fill();ctx.fillStyle='#6A1E18';ctx.beginPath();ctx.ellipse(bw[0],bw[1]-1,2.2,0.8,0,0,6.3);ctx.fill();}
function drawHofOpt(b,win,opt){const J=HOF_SET[opt]||HOF_SET[1],f0=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.w>=b.h?0:1}),ax=f0.alongX,sd=(b.id||0)*17+opt;
  const hl=1.32,hw=0.6,gw=0.2,pad=0.1,ph=5,wh=19,rh=22,ov=0.06,fP=(a,c,h)=>f0(a,c,(h||0)+ph);
  hoQ([f0(-hl-gw-pad+0.2,-hw-gw-pad+0.2,0),f0(hl+gw+pad+0.3,-hw-gw-pad+0.2,0),f0(hl+gw+pad+0.3,hw+gw+pad+0.3,0),f0(-hl-gw-pad+0.2,hw+gw+pad+0.3,0)],'rgba(30,38,42,0.2)');
  {/* plinth flush with the back gallery (no empty ledge on that side), a margin in front */const fPl=(a2,c2,h)=>f0(a2,c2+pad/2,h);hoPlinth(fPl,hl+gw+pad,hw+gw+pad/2,ph,win,sd);}hoStair(f0,hl+gw+pad,0,0.26,ph,2,win);
  /* back gallery (behind the hall): drawn first, only its ends and roof edge show past the hall */
  {const gt0=wh*0.62,gl0=6.5,gR=J.turfGal?'#62773F':J.roofD,cB=-hw-gw;
    hoQ([fP(-hl-gw,cB,0),fP(hl+gw,cB,0),fP(hl+gw,cB,3),fP(-hl-gw,cB,3)],shade(J.wall,0.7));
    for(let k=0;k<=7;k++){const a2=-hl-gw+(2*hl+2*gw)*k/7;hoQ([fP(a2,cB,0),fP(a2+0.035,cB,0),fP(a2+0.035,cB,gl0+1),fP(a2,cB,gl0+1)],'#2A1F18');}
    hoQ([fP(-hl-gw,-hw,gt0),fP(hl+gw,-hw,gt0),fP(hl+gw,cB-0.05,gl0+1),fP(-hl-gw,cB-0.05,gl0+1)],win?'#DCE2E1':gR);
    /* its end at the front gable: rail, corner post, roof edge */hoQ([fP(hl+gw,cB,0),fP(hl+gw,-hw,0),fP(hl+gw,-hw,3),fP(hl+gw,cB,3)],shade(J.wall,0.8));
    hoQ([fP(hl+gw,cB-0.05,gl0+1),fP(hl+gw,-hw,gt0),fP(hl+gw,-hw,gt0-1.6),fP(hl+gw,cB-0.05,gl0-0.6)],shade(J.roofD,0.6));}
  /* hall */const g={sd,hl,hw,fh:1.4,wh,rh,ov,th:1.8,wt:'staves',wall:J.wall,wallD:J.wallD,roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,frame:true,frameCol:'#2A1F18',k:1,v:1};
  const R=hoRoof(fP,g,win);R.back();hoWalls(fP,g,win);R.end();
  hoDoor(fP,g,'G',0,0.26,13,{arch:true,portal:'#C9A64A',col:'#5E3E26',frame:'#24180F',steps:0});
  /* covered gallery (svalgang) along the long side and the front gable: lean-to roof on posts, arched openings */
  const gt=wh*0.62,gl=6.5,galRoof=J.turfGal?'#7E9656':J.roof,galRoofD=J.turfGal?'#62773F':J.roofD;
  const arches=(face)=>{const len=face==='L'?hl+gw:hw+gw,n=face==='L'?7:4,pt=(s,h)=>face==='L'?fP(s,hw+gw,h):fP(hl+gw,s,h);
    if(face==='G'){hoQ([pt(-len,0),pt(-0.32,0),pt(-0.32,3),pt(-len,3)],shade(J.wall,0.85));hoQ([pt(0.32,0),pt(len,0),pt(len,3),pt(0.32,3)],shade(J.wall,0.85));}else hoQ([pt(-len,0),pt(len,0),pt(len,3),pt(-len,3)],shade(J.wall,0.85));/* low rail wall, open at the portal */
    for(let k=0;k<n;k++){const s1=-len+2*len*k/n,s2=-len+2*len*(k+1)/n,m=(s1+s2)/2,wide=face==='G'&&k===Math.floor(n/2)-0?1:0;
      if(face==='G'&&(k===1||k===2)){continue;}
      const a1=pt(s1+0.03,3),a2=pt(s2-0.03,3),t1=pt(s1+0.03,gl-1),t2=pt(s2-0.03,gl-1),tc=pt(m,gl+0.6);ctx.fillStyle='rgba(20,14,10,0.0)';
      hoQ([pt(s1,3),pt(s1+0.035,3),pt(s1+0.035,gl+1),pt(s1,gl+1)],'#2A1F18');}
    hoQ([pt(len-0.035,0),pt(len,0),pt(len,gl+1),pt(len-0.035,gl+1)],'#2A1F18');
    /* carved arch band */ctx.strokeStyle='#2A1F18';ctx.lineWidth=0.8;ctx.beginPath();for(let k=0;k<n;k++){if(face==='G'&&(k===1||k===2))continue;const s1=-len+2*len*k/n,s2=-len+2*len*(k+1)/n,p1=pt(s1+0.03,gl-0.6),p2=pt(s2,gl-0.6),pc=pt((s1+s2)/2,gl+1.4);ctx.moveTo(p1[0],p1[1]);ctx.quadraticCurveTo(pc[0],pc[1]-1.5,p2[0],p2[1]);}ctx.stroke();};
  arches('L');
  /* gallery roofs: long side, then the front one (open in the middle for the portal) */
  hoQ([fP(-hl-gw,hw,gt),fP(hl+gw,hw,gt),fP(hl+gw,hw+gw+0.05,gl+1),fP(-hl-gw,hw+gw+0.05,gl+1)],win?'#EEF1F0':galRoof);
  if(!win)hoRoofSurface((u,v)=>lerp(fP(-hl-gw+(2*hl+2*gw)*u,hw+gw+0.05,gl+1),fP(-hl-gw+(2*hl+2*gw)*u,hw,gt),v),{sd:sd+1,rt:J.turfGal?'turf':J.rt,rh:9,roofD:galRoofD},win);
  hoLine(fP(-hl-gw,hw+gw+0.05,gl+1),fP(hl+gw,hw+gw+0.05,gl+1),'rgba(10,8,6,0.5)',0.7);
  hoQ([fP(hl+gw,hw,gt),fP(hl+gw,hw+gw+0.05,gl+1),fP(hl+gw,hw+gw+0.05,gl-0.6),fP(hl+gw,hw,gt-1.6)],shade(J.roofD,0.6));hoQ([fP(hl+gw,hw,0),fP(hl+gw,hw+gw,0),fP(hl+gw,hw+gw,3),fP(hl+gw,hw,3)],shade(J.wall,0.8));
  hoDoor(fP,g,'G',0,0.26,13,{arch:true,portal:'#C9A64A',col:'#5E3E26',frame:'#24180F',steps:0});
  if(J.chain){hoChain([fP(-hl-gw,hw+gw+0.05,gl+0.5),fP(-0.6,hw+gw+0.05,gl+0.5),fP(0.2,hw+gw+0.05,gl+0.5),fP(hl+gw,hw+gw+0.05,gl+0.5)],'#D9B356');}
  /* main roof front */R.front();
  /* tower standing on the ridge: walls follow the roof slopes; flashing at the foot */
  const top=wh+rh,ce=hw+ov,eH=wh-ov/hw*rh,onRoof=c=>top-(top-eH)*Math.abs(c)/ce,ts=0.34,hb=onRoof(ts),T1=top+13;
  const ridgeObj={ridge:u=>fP(-hl-ov+(2*hl+2*ov)*u,0,top+0.5),rf:fP(hl+ov,0,top+0.5),rb:fP(-hl-ov,0,top+0.5)},uA=(-ts+hl+ov)/(2*hl+2*ov),uB=(ts+hl+ov)/(2*hl+2*ov);
  hoRidgePiece(ridgeObj,ax,1.3,J.dc,J.da,0,uA,true,false);
  /* shadow on the roof below the tower */hoQ([fP(-ts,ts+0.06,onRoof(ts+0.06)),fP(ts+0.06,ts+0.06,onRoof(ts+0.06)),fP(ts+0.06,ts,hb),fP(-ts,ts,hb)],'rgba(10,8,6,0.25)');
  hoQ([fP(-ts,ts,hb),fP(ts,ts,hb),fP(ts,ts,T1),fP(-ts,ts,T1)],win?'#C9CCC8':J.wall);
  hoQ([fP(ts,-ts,hb),fP(ts,0,top),fP(ts,ts,hb),fP(ts,ts,T1),fP(ts,-ts,T1)],win?'#B5B9B6':J.wallD);
  ctx.strokeStyle='rgba(20,14,10,0.45)';ctx.lineWidth=0.45;ctx.beginPath();for(let k=1;k<6;k++){const s=-ts+2*ts*k/6,p=fP(s,ts,hb),p2=fP(s,ts,T1),q=fP(ts,s,onRoof(s)),q2=fP(ts,s,T1);ctx.moveTo(p[0],p[1]);ctx.lineTo(p2[0],p2[1]);ctx.moveTo(q[0],q[1]);ctx.lineTo(q2[0],q2[1]);}ctx.stroke();
  /* louvred openings */for(const s of [-0.15,0.15]){hoQ([fP(s-0.06,ts,T1-8),fP(s+0.06,ts,T1-8),fP(s+0.06,ts,T1-2.5),fP(s-0.06,ts,T1-2.5)],'#1E1612');}hoQ([fP(ts,-0.06,T1-8),fP(ts,0.06,T1-8),fP(ts,0.06,T1-2.5),fP(ts,-0.06,T1-2.5)],'#1E1612');
  ctx.strokeStyle=win?'#E8ECEC':'#8A8F94';ctx.lineWidth=1.2;ctx.beginPath();{const a=fP(-ts,ts,hb+0.3),b2=fP(ts,ts,hb+0.3),c2=fP(ts,0,top+0.3),d=fP(ts,-ts,hb+0.3);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);ctx.lineTo(c2[0],c2[1]);ctx.lineTo(d[0],d[1]);}ctx.stroke();
  hoRidgePiece(ridgeObj,ax,1.3,J.dc,J.da,uB,1,false,true);
  /* skirt 1, tier 2, skirt 2, spire */const sk1=ts+0.12,ap1=T1+11,P1=hoPyramid(fP,0,0,sk1,T1-2,ap1,J.roof,J.roofD,J.rt,win,sd+7);
  const ts2=0.22,b2h=T1-2+(ap1-T1+2)*(1-ts2/sk1);hoBox(fP,0,0,ts2,b2h,b2h+9,J.wall,J.wallD,win);hoLine(fP(-ts2,ts2,b2h+0.3),fP(ts2,ts2,b2h+0.3),win?'#E8ECEC':'#8A8F94',1);hoLine(fP(ts2,ts2,b2h+0.3),fP(ts2,-ts2,b2h+0.3),win?'#E8ECEC':'#8A8F94',1);
  for(const s of [-0.08,0.08])hoQ([fP(s-0.035,ts2,b2h+2.5),fP(s+0.035,ts2,b2h+2.5),fP(s+0.035,ts2,b2h+7),fP(s-0.035,ts2,b2h+7)],'#1E1612');
  const sk2=ts2+0.09,ap2=b2h+9+30;const P2=hoPyramid(fP,0,0,sk2,b2h+8,ap2,J.roof,J.roofD,J.rt,win,sd+9);
  if(J.chain){hoChain([P1.q(-1,1),P1.q(1,1),P1.q(1,-1)],'#D9B356');hoLine(P2.A,[P2.A[0],P2.A[1]-3],'#D9B356',1.2);}
  /* small dragon heads at the visible skirt corners */for(const q of [[1,1,ax?1:-1],[-1,1,ax?-1:1],[1,-1,ax?1:-1]]){const p=P1.q(q[0],q[1]);hoLine(p,[p[0]+q[2]*2,p[1]-3],J.dc,1.4);hoHead([p[0]+q[2]*2,p[1]-3],q[2],0.75,J.dc,J.da);}
  /* weathervane */{const p=P2.A;hoLine(p,[p[0],p[1]-7],'#2A2622',0.7);ctx.fillStyle='#C9A042';ctx.beginPath();ctx.moveTo(p[0],p[1]-7);ctx.lineTo(p[0]+5,p[1]-6);ctx.quadraticCurveTo(p[0]+3,p[1]-4.5,p[0]+4.5,p[1]-3);ctx.lineTo(p[0],p[1]-4);ctx.fill();}
  /* sacred pole and altar beside the door, never in front of it */
  hoSacredPole(f0,hl+gw+pad+0.32,-hw-gw+0.05,win);hoAltar(f0,hl+gw+pad+0.28,-hw-gw-0.42,win);}
/* every roof texture is clipped to its own surface (turf may hang just past the eave) */
const _roofSurfClip=hoRoofSurface;hoRoofSurface=function(at,g,win){const v0=g.rt==='turf'?-0.08:0;ctx.save();ctx.beginPath();
  const pts=[];for(let k=0;k<=12;k++)pts.push(at(k/12,v0));for(let k=12;k>=0;k--)pts.push(at(k/12,1));ctx.moveTo(pts[0][0],pts[0][1]);for(const q of pts)ctx.lineTo(q[0],q[1]);ctx.closePath();ctx.clip();
  try{_roofSurfClip(at,g,win);}finally{ctx.restore();}};

/* =================== Granary options (prototype) — window.__setGran(n) =================== */
let GRAN_OPT=0;window.__setGran=n=>{GRAN_OPT=n|0;};
{const _ds1=drawShaped;drawShaped=function(b,win,c0,ax){if(GRAN_OPT&&b.t==='gran'){drawGranOpt(b,win,GRAN_OPT);return true;}return _ds1(b,win,c0,ax);};}
const GRAN_SET={1:{n:'Log stabbur, thatch',wt:'logs',wall:'#8A6440',wallD:'#6E4E32',rt:'thatch',roof:'#C2A25C',roofD:'#9E8042'},
  2:{n:'Tarred planks, black shingles',wt:'planks',wall:'#5E4636',wallD:'#4B3729',rt:'scale',roof:'#2F2C2A',roofD:'#211F1D'},
  3:{n:'Falu red, red boards',wt:'planks',wall:'#8E3B2C',wallD:'#742F23',rt:'boards',roof:'#5A2E24',roofD:'#46241C',trim:'#E2D8C2'},
  4:{n:'Stabbur + hay barrack',wt:'logs',wall:'#8A6440',wallD:'#6E4E32',rt:'scale',roof:'#2F2C2A',roofD:'#211F1D',barrack:true}};
function hoSack(p,c){ctx.fillStyle=c||'#CDBB8E';ctx.beginPath();ctx.ellipse(p[0],p[1]-2.6,2.6,3,0,0,6.3);ctx.fill();ctx.fillStyle='rgba(60,40,20,0.25)';ctx.beginPath();ctx.ellipse(p[0]+0.8,p[1]-2.2,1.6,2.6,0,0,6.3);ctx.fill();hoLine([p[0]-1,p[1]-5.4],[p[0]+1,p[1]-5.4],'#6E5440',0.7);}
function hoBasket(p){ctx.fillStyle='#A6844E';ctx.beginPath();ctx.moveTo(p[0]-3,p[1]-4);ctx.lineTo(p[0]+3,p[1]-4);ctx.lineTo(p[0]+2.4,p[1]);ctx.lineTo(p[0]-2.4,p[1]);ctx.fill();ctx.strokeStyle='rgba(70,46,22,0.6)';ctx.lineWidth=0.4;ctx.beginPath();for(let k=1;k<3;k++){ctx.moveTo(p[0]-3+k*0.2,p[1]-4+k*1.3);ctx.lineTo(p[0]+3-k*0.2,p[1]-4+k*1.3);}ctx.stroke();ctx.fillStyle='#D9B356';ctx.beginPath();ctx.ellipse(p[0],p[1]-4,3,1,0,0,6.3);ctx.fill();}
function hoSheaf(p){ctx.fillStyle='#D2B062';ctx.beginPath();ctx.moveTo(p[0]-1.6,p[1]);ctx.lineTo(p[0]+1.6,p[1]);ctx.lineTo(p[0]+0.6,p[1]+4);ctx.lineTo(p[0]-0.6,p[1]+4);ctx.fill();hoLine([p[0]-0.9,p[1]+1.6],[p[0]+0.9,p[1]+1.6],'#8A6A3A',0.5);ctx.fillStyle='#E2C478';ctx.beginPath();ctx.ellipse(p[0],p[1]+4.6,1.4,1.2,0,0,6.3);ctx.fill();}
/* stabbur: posts with rat stones, lower storey, wider upper storey, gable roof, door + notched log ladder */
function hoStabbur(f0,ao,co,k,J,win,sd,L,full){const f=(a,c,h)=>f0(a*k+ao,c*k+co,h*k);const st=9,lw=11,uw=10,hl=0.62,hw=0.5,hl1=0.5,hw1=0.4;
  hoQ([f(-hl,-hw,0),f(hl+0.15,-hw,0),f(hl+0.15,hw+0.2,0),f(-hl,hw+0.2,0)],'rgba(30,38,42,0.16)');
  /* posts and rat stones */for(const q of [[hl1-0.04,hw1-0.04],[-hl1+0.04,hw1-0.04],[hl1-0.04,-hw1+0.04]]){const p0=f(q[0],q[1],0),p1=f(q[0],q[1],st-1.3);ctx.fillStyle='#8E8A84';ctx.beginPath();ctx.ellipse(p0[0],p0[1],2.4*k,1.2*k,0,0,6.3);ctx.fill();
    hoLine(p0,p1,'#5A4230',2.4*k);hoLine([p0[0]+0.6*k,p0[1]],[p1[0]+0.6*k,p1[1]],'rgba(255,230,190,0.18)',0.5);ctx.fillStyle='#9C978D';ctx.beginPath();ctx.ellipse(p1[0],p1[1],3.4*k,1.6*k,0,0,6.3);ctx.fill();ctx.fillStyle='#B4AFA4';ctx.beginPath();ctx.ellipse(p1[0],p1[1]-0.8*k,3.4*k,1.5*k,0,0,6.3);ctx.fill();}
  /* sill beams */const fL=(a,c,h)=>f(a,c,h+st);hoQ([fL(-hl1,hw1,0),fL(hl1,hw1,0),fL(hl1,hw1,1.6),fL(-hl1,hw1,1.6)],'#4A3424');hoQ([fL(hl1,-hw1,0),fL(hl1,hw1,0),fL(hl1,hw1,1.6),fL(hl1,-hw1,1.6)],'#3A2A1C');
  const g1={sd,hl:hl1,hw:hw1,fh:1.6,wh:lw,rh:0,wt:J.wt,wall:J.wall,wallD:J.wallD,frame:J.wt!=='logs',frameCol:'#3A2A1C',k:k,v:k};hoWalls(fL,g1,win);
  hoDoor(fL,g1,'G',0,0.16,8.5,{col:'#5A4430',frame:'#2E2018',steps:0});
  /* upper storey: wider, joist ends under it */const fU=(a,c,h)=>f(a,c,h+st+lw);for(let i=0;i<7;i++){const a=-hl+0.06+(2*hl-0.12)*i/6;hoQ([fU(a,hw,-1.2),fU(a+0.05,hw,-1.2),fU(a+0.05,hw,0),fU(a,hw,0)],'#3A2A1C');}
  for(let i=0;i<5;i++){const c=-hw+0.06+(2*hw-0.12)*i/4;hoQ([fU(hl,c,-1.2),fU(hl,c+0.05,-1.2),fU(hl,c+0.05,0),fU(hl,c,0)],'#2E2018');}
  const g2={sd:sd+1,hl,hw,fh:0,wh:uw,rh:13,ov:0.07,th:J.rt==='thatch'?4:1.8,wt:J.wt==='logs'?'planks':J.wt,wall:J.wt==='logs'?shade(J.wall,1.05):J.wall,wallD:J.wt==='logs'?shade(J.wallD,1.05):J.wallD,roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,frame:true,frameCol:J.trim||'#3A2A1C',k:k,v:k};
  const r=hoRoof(fU,g2,win);r.back();hoWalls(fU,g2,win);r.end();
  if(J.trim){hoRect(fU,g2,'L',-hl,hl,uw-1.2,uw,J.trim);hoRect(fU,g2,'G',-hw,hw,uw-1.2,uw,shade(J.trim,0.85));}
  /* small vent hatch in the upper gable */hoRect(fU,g2,'G',-0.07,0.07,uw+2,uw+6,'#2A1F18');
  r.front();r.ridge();hoBarge(fU,g2,'#5A4230',0.3,L>=5);
  if(full&&L>=5){for(let i=0;i<5;i++)hoSheaf(fU(-hl+0.15+i*0.25,hw+0.08,-3));}
  if(full){/* a real ladder: two rails and rungs, leaning from the ground to the door sill */const r1=[f(hl1+0.4,-0.07,0),f(hl1+0.02,-0.07,st+1.6)],r2=[f(hl1+0.4,0.09,0),f(hl1+0.02,0.09,st+1.6)];
    for(let i=1;i<7;i++){const t2=i/7,p=lerp(r1[0],r1[1],t2),q=lerp(r2[0],r2[1],t2);hoLine(p,q,'#6E5038',1.1*k);hoLine([p[0],p[1]-0.5],[q[0],q[1]-0.5],'rgba(255,230,190,0.2)',0.4);}
    for(const r of [r1,r2]){hoLine(r[0],[r[1][0],r[1][1]-2*k],'#5A4230',1.5*k);hoLine([r[0][0]+0.6*k,r[0][1]],[r[1][0]+0.6*k,r[1][1]-2*k],'rgba(255,230,190,0.18)',0.4);}}}
function drawGranOpt(b,win,opt){const J=GRAN_SET[opt]||GRAN_SET[1],L=Math.min(5,b.lvl||1),f0=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.w>=b.h?0:1}),sd=(b.id||0)*19+opt;
  /* back: a smaller second stabbur from level 3, or the hay barrack */
  if(J.barrack){const ao=-0.82,s=0.34,hh=L>=3?26:20,P=(a,c,h)=>f0(ao+a,c,h);hoQ([P(-s,-s,0),P(s+0.1,-s,0),P(s+0.1,s+0.12,0),P(-s,s+0.12,0)],'rgba(30,38,42,0.14)');
    /* hay mound */ctx.fillStyle=win?'#E4E2D6':'#C9A85A';const m=P(0,0,0);ctx.beginPath();ctx.ellipse(m[0],m[1]-5,22,9,0,3.14,6.28);ctx.lineTo(m[0]+22,m[1]-2);ctx.ellipse(m[0],m[1]-2,22,6,0,0,3.14);ctx.fill();
    ctx.fillStyle='rgba(120,90,30,0.35)';for(let i=0;i<14;i++){const p=[m[0]+(h2(sd,i,1)-0.5)*36,m[1]-4-h2(sd,i,2)*8];ctx.fillRect(p[0],p[1],2,0.6);}
    if(L>=3){ctx.fillStyle=win?'#E4E2D6':'#D2B062';ctx.beginPath();ctx.ellipse(m[0],m[1]-12,18,8,0,3.14,6.28);ctx.lineTo(m[0]+18,m[1]-6);ctx.lineTo(m[0]-18,m[1]-6);ctx.fill();}
    for(const q of [[-s,s],[s,s],[s,-s],[-s,-s]]){const p0=P(q[0],q[1],0),p1=P(q[0],q[1],hh+10);hoLine(p0,p1,'#5A4230',1.8);for(let i=1;i<6;i++){const p=lerp(p0,p1,i/6);hoLine([p[0]-1,p[1]],[p[0]+1,p[1]],'#3A2A1C',0.5);}}
    hoPyramid(P,0,0,s+0.08,hh,hh+12,J.roof,J.roofD,J.rt,win,sd+3);}
  else if(L>=3)hoStabbur(f0,-0.88,-0.28,0.7,J,win,sd+5,L,false);
  hoStabbur(f0,0.32,0,1,J,win,sd,L,true);
  /* no props scattered on the ground */}
/* test switch: hide the sea-mist at the map edge (gallery screenshots) */
{const _ef=drawEdgeFog;drawEdgeFog=function(win,vis){if(window.__NOFOG)return;return _ef(win,vis);};}

/* =================== Warehouse options (prototype) — window.__setWare(n) =================== */
let WARE_OPT=0;window.__setWare=n=>{WARE_OPT=n|0;};
{const _ds2=drawShaped;drawShaped=function(b,win,c0,ax){if(WARE_OPT&&b.t==='ware'){drawWareOpt(b,win,WARE_OPT);return true;}return _ds2(b,win,c0,ax);};}
const WARE_SET={1:{rt:'thatch',roof:'#C2A25C',roofD:'#9E8042',wall:'#A08060',wallD:'#836548'},2:{rt:'slab',blue:1,roof:'#5E7488',roofD:'#4A5D6E',wall:'#4E3A2C',wallD:'#3E2E22'},
  3:{rt:'boards',roof:'#9A4434',roofD:'#7A3428',wall:'#8E887E',wallD:'#736E65'},4:{rt:'scale',roof:'#2F2C2A',roofD:'#211F1D',wall:'#7E5A3C',wallD:'#664830'}};
function hoGate(f,g,a,w,hd){/* wide double gate on the long wall: frame, two leaves with planks, iron straps and rings, a stone ramp */const fh=g.fh,pt=(s,h)=>f(s,g.hw,h);
  hoQ([pt(a-w/2-0.035,fh),pt(a+w/2+0.035,fh),pt(a+w/2+0.035,fh+hd+1.6),pt(a-w/2-0.035,fh+hd+1.6)],'#2E2018');hoQ([pt(a-w/2,fh),pt(a+w/2,fh),pt(a+w/2,fh+hd),pt(a-w/2,fh+hd)],'#9A7650');for(const sg of [-1,1]){const x0=a+sg*0.01,x1=a+sg*(w/2-0.01);hoLine(pt(x0,fh+0.6),pt(x1,fh+hd-0.6),'#4A3424',1.1);hoLine(pt(x0,fh+hd*0.5),pt(x1,fh+hd*0.5),'#4A3424',0.9);}
  ctx.strokeStyle='rgba(30,20,12,0.5)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=1;k<8;k++){const p=pt(a-w/2+w*k/8,fh),q=pt(a-w/2+w*k/8,fh+hd);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();hoLine(pt(a,fh),pt(a,fh+hd),'#2E2018',0.9);
  for(const hh of [0.25,0.75]){hoLine(pt(a-w/2,fh+hd*hh),pt(a-0.03,fh+hd*hh),'#2A2622',0.9);hoLine(pt(a+0.03,fh+hd*hh),pt(a+w/2,fh+hd*hh),'#2A2622',0.9);}
  for(const s of [-0.05,0.05]){const r=pt(a+s,fh+hd*0.5);ctx.strokeStyle='#8E949A';ctx.lineWidth=0.6;ctx.beginPath();ctx.arc(r[0],r[1],1,0,6.3);ctx.stroke();}
  const c=g.hw;hoQ([f(a-w/2-0.05,c,fh),f(a+w/2+0.05,c,fh),f(a+w/2+0.05,c+0.2,0),f(a-w/2-0.05,c+0.2,0)],'#A39D92');hoQ([f(a+w/2+0.05,c,fh),f(a+w/2+0.05,c+0.2,0),f(a+w/2+0.05,c,0)],'#857F76');
  ctx.strokeStyle='rgba(60,56,50,0.4)';ctx.lineWidth=0.4;ctx.beginPath();for(let k=1;k<4;k++){const p=f(a-w/2-0.05,c+0.07*k,fh*(1-k/4)),q=f(a+w/2+0.05,c+0.07*k,fh*(1-k/4));ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();}
function hoCrate(f,a,c,h,s){const P=(da,dc,dh)=>f(a+da*s,c+dc*s,h+dh*s*16);hoQ([P(-1,1,0),P(1,1,0),P(1,1,1),P(-1,1,1)],'#A88A62');hoQ([P(1,-1,0),P(1,1,0),P(1,1,1),P(1,-1,1)],'#8A6E4C');hoQ([P(-1,1,1),P(1,1,1),P(1,-1,1),P(-1,-1,1)],'#C2A57A');
  hoLine(P(-1,1,0),P(1,1,1),'rgba(60,40,20,0.5)',0.5);hoLine(P(1,-1,0),P(1,1,1),'rgba(60,40,20,0.5)',0.5);}
function drawWareOpt(b,win,opt){const J=WARE_SET[opt]||WARE_SET[1],L=Math.min(5,b.lvl||1),f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.w>=b.h?0:1}),sd=(b.id||0)*23+opt;
  const hl=[0.95,1.0,1.05,1.12,1.25][L-1],hw=0.58,ao=L>=3?-0.18:0,fA=(a,c,h)=>f(a+ao,c,h);
  const g={sd,hl,hw,fh:3.2,wh:18,rh:13,ov:0.07,th:J.rt==='thatch'?4.5:1.8,wt:'planks',wall:J.wall,wallD:J.wallD,roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,blue:J.blue,frame:true,frameCol:'#3A2A1C',midPost:true,k:1,v:1};
  hoQ([fA(-hl-0.07+0.15,-hw-0.07+0.15,0),fA(hl+0.07+0.2,-hw-0.07+0.15,0),fA(hl+0.07+0.2,hw+0.07+0.3,0),fA(-hl-0.07+0.15,hw+0.07+0.3,0)],'rgba(30,38,42,0.16)');
  const r=hoRoof(fA,g,win);r.back();hoFooting(fA,g,win);hoWalls(fA,g,win);r.end();
  const gates=L>=5?[-0.5,0.5]:[0];for(const a of gates)hoGate(fA,g,a,0.42,12.5);
  hoWindow(fA,g,'G',0,0.1,g.fh+5,g.fh+8.5,{shutters:'#4E3A2C'});
  /* covered loading lean-to on the front gable from level 3: posts, sloping roof, crates stacked neatly under it */
  if(L>=3){const lw=0.34,lh=10,fl=(a,c,h)=>fA(hl+a,c,h);hoQ([fl(0,-hw,0),fl(lw,-hw,0),fl(lw,hw,0),fl(0,hw,0)],'rgba(80,70,56,0.25)');
    hoCrate(fA,hl+0.13,0.25,0,0.08);hoCrate(fA,hl+0.13,0.05,0,0.08);hoCrate(fA,hl+0.13,0.15,2.6,0.07);
    for(const c of [-hw+0.03,hw-0.03])hoQ([fl(lw-0.035,c,0),fl(lw,c,0),fl(lw,c,lh),fl(lw-0.035,c,lh)],'#3A2A1C');
    hoQ([fl(0,-hw-0.04,lh+5),fl(0,hw+0.04,lh+5),fl(lw+0.05,hw+0.04,lh-0.5),fl(lw+0.05,-hw-0.04,lh-0.5)],win?'#EEF1F0':J.roof);
    if(!win)hoRoofSurface((u,v)=>lerp(fl(lw+0.05,hw+0.04-(2*hw+0.08)*u,lh-0.5),fl(0,hw+0.04-(2*hw+0.08)*u,lh+5),v),{sd:sd+2,rt:J.rt,rh:8,roofD:J.roofD,blue:J.blue},win);
    hoQ([fl(lw+0.05,hw+0.04,lh-0.5),fl(0,hw+0.04,lh+5),fl(0,hw+0.04,lh+3.6),fl(lw+0.05,hw+0.04,lh-1.9)],shade(J.roofD,0.6));}
  r.front();r.ridge();hoBarge(fA,g,'#5A4230',0.25,false);
  /* no hoist (José: removed) */}
/* crossed barge boards at BOTH gables: the back pair shows its crossing tips above the ridge */
{const _hb=hoBarge;hoBarge=function(f,g,col,ext,carve){_hb(f,g,col,ext,carve);const {hl,hw,wh,rh,ov}=g,a0=-hl-ov-0.01,top=wh+rh,eH=wh-ov/hw*rh,ce=hw+ov;
  for(const s2 of [1,-1]){const e=f(a0,s2*ce,eH),r=f(a0,0,top),dx=r[0]-e[0],dy=r[1]-e[1],x=[r[0]+dx*ext,r[1]+dy*ext],st=s2>0?e:[r[0]-dx*0.08,r[1]-dy*0.08];/* the board on the visible slope runs its whole length */ctx.lineCap='round';
    hoLine(st,x,shade(col,0.7),2.4);hoLine(st,x,col,1.5);hoLine([st[0],st[1]-0.6],[x[0],x[1]-0.6],'rgba(255,240,210,0.3)',0.5);ctx.lineCap='butt';
    if(carve){ctx.strokeStyle=col;ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(x[0],x[1]);ctx.quadraticCurveTo(x[0]+dx*0.12+s2*3,x[1]+dy*0.12-3,x[0]+s2*1,x[1]-5);ctx.stroke();}}};}

/* =================== Woodcutter's Lodge options (prototype) — window.__setWood(n) =================== */
let WOOD_OPT=0;window.__setWood=n=>{WOOD_OPT=n|0;};
{const _ds3=drawShaped;drawShaped=function(b,win,c0,ax){if(WOOD_OPT&&b.t==='wood'){drawWoodOpt(b,win,WOOD_OPT);return true;}return _ds3(b,win,c0,ax);};}
const WOOD_SET={1:{rt:'thatch',roof:'#C2A25C',roofD:'#9E8042'},2:{rt:'scale',roof:'#2F2C2A',roofD:'#211F1D'},3:{rt:'slab',blue:1,roof:'#5E7488',roofD:'#4A5D6E'},4:{rt:'boards',roof:'#9A4434',roofD:'#7A3428'}};
/* one round log lying along a (a1→a2) at (c,h): bark body, cut end with rings facing +a */
function hoLog(f,a1,a2,c,h,r,win){{const e0=f(a1,c,h);ctx.fillStyle=win?'#C9C3B8':'#6E5038';ctx.beginPath();ctx.ellipse(e0[0],e0[1],r*0.85,r,0,0,6.3);ctx.fill();}const t1=f(a1,c,h+r),t2=f(a2,c,h+r),b1=f(a1,c,h-r),b2=f(a2,c,h-r);hoQ([t1,t2,b2,b1],win?'#C9C3B8':'#6E5038');hoLine(t1,t2,win?'#F0F2F0':'rgba(255,230,190,0.25)',0.5);hoLine(b1,b2,'rgba(20,12,6,0.5)',0.5);
  const e=f(a2,c,h);ctx.fillStyle=win?'#E0DCD2':'#D2AC74';ctx.beginPath();ctx.ellipse(e[0],e[1],r*0.85,r,0,0,6.3);ctx.fill();ctx.strokeStyle='rgba(90,58,30,0.75)';ctx.lineWidth=0.4;ctx.stroke();
  ctx.beginPath();ctx.ellipse(e[0],e[1],r*0.45,r*0.55,0,0,6.3);ctx.stroke();ctx.fillStyle='rgba(90,58,30,0.6)';ctx.fillRect(e[0]-0.25,e[1]-0.25,0.5,0.5);}
/* a pile of logs: rows get shorter going up, each row nests in the gaps of the one below; drawn back to front, bottom to top */
function hoLogPile(f,a1,a2,c0,rows,r,win){const sp=0.098;for(let k=0;k<rows.length;k++){const n=rows[k],h=r+k*r*1.72;for(let i=0;i<n;i++){const c=c0+(i-(n-1)/2)*sp;hoLog(f,a1+k*0.02,a2-k*0.01,c,h,r,win);}}}
function hoSawhorse(f,a,c,win){for(const da of [-0.12,0.12]){const p=f(a+da,c-0.06,0),q=f(a+da,c+0.06,0),m=f(a+da,c,6);hoLine(p,m,'#5A4230',0.9);hoLine(q,m,'#5A4230',0.9);}hoLog(f,a-0.25,a+0.22,c,7.4,1.6,win);
  /* bow saw resting on it */const s1=f(a-0.05,c+0.04,9.6),s2=f(a+0.15,c+0.04,9.6);hoLine(s1,s2,'#8E949A',0.5);ctx.strokeStyle='#6E5038';ctx.lineWidth=0.7;ctx.beginPath();ctx.moveTo(s1[0],s1[1]);ctx.quadraticCurveTo((s1[0]+s2[0])/2,(s1[1]+s2[1])/2-5,s2[0],s2[1]);ctx.stroke();}
function hoSled(f,a,c,win){for(const dc of [-0.08,0.08]){const p=f(a-0.3,c+dc,0.8),q=f(a+0.28,c+dc,0.8),tip=f(a+0.34,c+dc,3);hoLine(p,q,'#4A3424',1.1);hoLine(q,tip,'#4A3424',1.1);}
  hoLog(f,a-0.28,a+0.22,c-0.05,3.2,1.6,win);hoLog(f,a-0.26,a+0.24,c+0.05,3.2,1.6,win);hoLog(f,a-0.25,a+0.2,c,5.9,1.6,win);}
function drawWoodOpt(b,win,opt){const J=WOOD_SET[opt]||WOOD_SET[1],L=Math.min(5,b.lvl||1),f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*29+opt;
  /* log hut at the back */const fh=(a,c,h)=>f(a-0.42,c-0.38,h);const g={sd,hl:0.42,hw:0.36,fh:2.6,wh:11,rh:11,ov:0.06,th:J.rt==='thatch'?4:1.6,wt:'logs',wall:'#8A6440',wallD:'#6E4E32',roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,blue:J.blue,k:1,v:1};
  hoQ([fh(-0.45,-0.4,0),fh(0.6,-0.4,0),fh(0.6,0.5,0),fh(-0.45,0.5,0)],'rgba(30,38,42,0.15)');
  const r=hoRoof(fh,g,win);r.back();hoFooting(fh,g,win);hoWalls(fh,g,win);r.end();hoDoor(fh,g,'G',0.05,0.15,8,{col:'#5A4430',steps:1});hoWindow(fh,g,'L',0.12,0.09,g.fh+4,g.fh+7,{shutters:'#4E3A2C'});r.front();r.ridge();hoBarge(fh,g,'#5A4230',0.25,false);
  /* open woodshed (front right): posts, lean-to roof, split firewood stacked square */
  const sh=(a,c,h)=>f(a+0.45,c-0.42,h),sl=0.4,sw=0.3,sH=10;hoQ([sh(-sl,-sw,0),sh(sl,-sw,0),sh(sl,sw,0),sh(-sl,sw,0)],'rgba(70,58,44,0.3)');
  hoQ([sh(-sl,-sw,0),sh(sl,-sw,0),sh(sl,-sw,sH+3),sh(-sl,-sw,sH+3)],'#3A2A1C');
  {/* the shed is full: a block of split firewood (top, side, and the split ends on the open front) */const hh=L>=3?8.5:6.5,c1=-sw+0.06,c2=sw-0.04,a1=-sl+0.05,a2=sl-0.05;
    hoQ([sh(a1,c1,hh),sh(a2,c1,hh),sh(a2,c2,hh),sh(a1,c2,hh)],win?'#E2DED4':'#9A7650');hoQ([sh(a2,c1,0),sh(a2,c2,0),sh(a2,c2,hh),sh(a2,c1,hh)],win?'#CFCAC0':'#7E5E3E');
    hoQ([sh(a1,c2,0),sh(a2,c2,0),sh(a2,c2,hh),sh(a1,c2,hh)],win?'#D8D2C6':'#8A6A48');
    const rows=Math.round(hh/2.2);for(let rr=0;rr<rows;rr++)for(let i=0;i<9;i++){const a=a1+0.04+i*((a2-a1-0.06)/8)+(rr%2?0.02:0),h=1.1+rr*2.2;const e=sh(a,c2+0.005,h);ctx.fillStyle=win?'#DCD6CA':((i+rr)%3?'#C59A64':'#B8895A');ctx.beginPath();ctx.moveTo(e[0]-1.4,e[1]+1.1);ctx.lineTo(e[0]+1.4,e[1]+0.3);ctx.lineTo(e[0]+0.6,e[1]-1.3);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(90,60,34,0.6)';ctx.lineWidth=0.35;ctx.stroke();}
    for(let rr=1;rr<rows;rr++){hoLine(sh(a2,c1,rr*2.2),sh(a2,c2,rr*2.2),'rgba(40,26,14,0.35)',0.4);}}
  for(const q of [[-sl,sw],[sl,sw],[sl,-sw]])hoQ([sh(q[0]-0.03,q[1],0),sh(q[0]+0.03,q[1],0),sh(q[0]+0.03,q[1],sH),sh(q[0]-0.03,q[1],sH)],'#4A3424');
  hoQ([sh(-sl-0.05,-sw-0.05,sH+4),sh(sl+0.05,-sw-0.05,sH+4),sh(sl+0.05,sw+0.07,sH-1),sh(-sl-0.05,sw+0.07,sH-1)],win?'#EEF1F0':J.roof);
  if(!win)hoRoofSurface((u,v)=>lerp(sh(-sl-0.05+(2*sl+0.1)*u,sw+0.07,sH-1),sh(-sl-0.05+(2*sl+0.1)*u,-sw-0.05,sH+4),v),{sd:sd+3,rt:J.rt,rh:8,roofD:J.roofD,blue:J.blue},win);
  hoQ([sh(sl+0.05,-sw-0.05,sH+4),sh(sl+0.05,sw+0.07,sH-1),sh(sl+0.05,sw+0.07,sH-2.4),sh(sl+0.05,-sw-0.05,sH+2.6)],shade(J.roofD,0.6));
  /* round logs in a proper pile along the front edge (more rows with level) */
  const rows=[[3,2,1],[3,2,1],[4,3,2,1],[4,3,2,1],[5,4,3,2,1]][L-1];hoLogPile(f,-0.75,0.05,0.62,rows,1.7,win);
  /* sawhorse and chopping block in front; a log sled from level 3 */
  hoSawhorse(f,0.55,0.45,win);hoChop(f(0.78,0.2,0));if(L>=3)hoSled(f,0.5,0.8,win);}
/* no pennants on any building (José, 2026-11-12) */
pennant=function(){};
/* scale shingles keep the same size and density on every roof, whatever its size: rows and columns follow the slope's real length */
{const _rs=hoRoofSurface;hoRoofSurface=function(at,g,win){if(win||g.rt!=='scale')return _rs(at,g,win);const det=zoom>1.2,sd=g.sd||1,d=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1]);
  const lenV=d(at(0.5,0),at(0.5,1)),lenU=d(at(0,0.5),at(1,0.5)),rows=Math.max(Math.round(10*(g.rh||16)/16),Math.round(lenV/2.6)),n=Math.max(det?22:12,Math.round(lenU/(det?4.2:6.4)));/* original look; only fill in where it would leave gaps */ctx.save();ctx.beginPath();const pts=[at(0,0),at(1,0),at(1,1),at(0,1)];ctx.moveTo(pts[0][0],pts[0][1]);for(const q of pts)ctx.lineTo(q[0],q[1]);ctx.closePath();ctx.clip();
  for(let r=0;r<rows;r++){const v=(r+0.5)/rows;for(let k=-1;k<=n;k++){const u=(k+(r%2?0.5:0)+0.5)/n;const p=at(u,v-0.5/rows);ctx.fillStyle=((k*7+r*3+sd)%5===0)?'rgba(90,80,70,0.35)':'rgba(255,240,220,0.06)';ctx.beginPath();ctx.ellipse(p[0],p[1]+0.6,det?2.2:3.4,1.3,0,0,3.14);ctx.fill();
      if(det){ctx.strokeStyle='rgba(0,0,0,0.5)';ctx.lineWidth=0.45;ctx.beginPath();ctx.ellipse(p[0],p[1]+0.6,2.2,1.3,0,0,3.14);ctx.stroke();}}}
  ctx.restore();hoLine(at(0,0.985),at(1,0.985),'rgba(160,150,140,0.25)',0.6);};}

/* =================== Carpenter options (prototype) — window.__setCarp(n) =================== */
let CARP_OPT=0;window.__setCarp=n=>{CARP_OPT=n|0;};
{const _ds4=drawShaped;drawShaped=function(b,win,c0,ax){if(CARP_OPT&&b.t==='carp'){drawCarpOpt(b,win,CARP_OPT);return true;}return _ds4(b,win,c0,ax);};}
/* stack of sawn boards drying: layers of boards with thin stickers between, boards run along a */
function hoPlankStack(f,a,c,len,wid,layers,win){const bh=1.1,sh=0.6;for(let k=0;k<layers;k++){const h=k*(bh+sh);
    for(const s of [-0.38,0,0.38]){const aa=a+s*len;hoQ([f(aa-0.02,c-wid,h),f(aa+0.02,c-wid,h),f(aa+0.02,c+wid,h),f(aa-0.02,c+wid,h)],'#5A4230');}
    const h1=h+sh,h2b=h1+bh;hoQ([f(a-len/2,c+wid,h1),f(a+len/2,c+wid,h1),f(a+len/2,c+wid,h2b),f(a-len/2,c+wid,h2b)],win?'#D8D2C6':'#C9A776');
    hoQ([f(a+len/2,c-wid,h1),f(a+len/2,c+wid,h1),f(a+len/2,c+wid,h2b),f(a+len/2,c-wid,h2b)],win?'#C6C0B4':'#B08C5C');
    hoQ([f(a-len/2,c-wid,h2b),f(a+len/2,c-wid,h2b),f(a+len/2,c+wid,h2b),f(a-len/2,c+wid,h2b)],win?'#EEF1F0':'#DDBE8A');
    ctx.strokeStyle='rgba(90,60,30,0.45)';ctx.lineWidth=0.35;ctx.beginPath();for(let i=1;i<5;i++){const cc=c-wid+2*wid*i/5,p=f(a-len/2,cc,h2b),q=f(a+len/2,cc,h2b),e1=f(a+len/2,cc,h1),e2=f(a+len/2,cc,h2b);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.moveTo(e1[0],e1[1]);ctx.lineTo(e2[0],e2[1]);}ctx.stroke();}}
/* saw pit: a dark pit in the ground, a log on two trestles across it, a two-man pit saw standing in the cut */
function hoSawPit(f,a,c,win){const pl=0.34,pw=0.12;hoQ([f(a-pl,c-pw,0),f(a+pl,c-pw,0),f(a+pl,c+pw,0),f(a-pl,c+pw,0)],'#2A1F16');hoQ([f(a-pl,c+pw,0),f(a+pl,c+pw,0),f(a+pl,c+pw,-2),f(a-pl,c+pw,-2)],'#1A130E');
  for(const q of [[-pl,-pw],[pl,-pw],[pl,pw],[-pl,pw]]){const p=f(a+q[0],c+q[1],0);ctx.fillStyle='#6E5038';ctx.fillRect(p[0]-1.2,p[1]-0.6,2.4,1.2);}
  for(const da of [-0.22,0.22]){for(const dc of [-0.09,0.09]){hoLine(f(a+da,c+dc*1.6,0),f(a+da,c,5),'#4A3424',0.9);}}hoLog(f,a-0.4,a+0.36,c,6.2,1.9,win);
  /* half-sawn: a plank already cut off lying on top, the saw blade standing in the kerf with its two handles */
  const s0=f(a+0.1,c,13),s1=f(a+0.1,c,-1);hoLine(s0,s1,'#9AA0A6',0.7);hoLine([s0[0]-2,s0[1]],[s0[0]+2,s0[1]],'#5A4230',1);hoLine([s1[0]-2,s1[1]],[s1[0]+2,s1[1]],'#5A4230',1);
  hoQ([f(a-0.36,c-0.03,8.3),f(a+0.08,c-0.03,8.3),f(a+0.08,c+0.03,8.3),f(a-0.36,c+0.03,8.3)],win?'#EEF1F0':'#DDBE8A');}
function drawCarpOpt(b,win,opt){const J=WOOD_SET[opt]||WOOD_SET[1],L=Math.min(5,b.lvl||1),f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*31+opt;
  /* workshop at the back (bigger at L5, two doors) */const big=L>=5,fw=(a,c,h)=>f(a-0.36,c-0.4,h);
  const g={sd,hl:big?0.6:0.48,hw:0.38,fh:2.6,wh:12,rh:12,ov:0.06,th:J.rt==='thatch'?4:1.6,wt:'planks',wall:'#9A7A56',wallD:'#7E6244',roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,blue:J.blue,frame:true,frameCol:'#4A3424',k:1,v:1};
  hoQ([fw(-g.hl,-g.hw,0),fw(g.hl+0.15,-g.hw,0),fw(g.hl+0.15,g.hw+0.2,0),fw(-g.hl,g.hw+0.2,0)],'rgba(30,38,42,0.15)');
  const r=hoRoof(fw,g,win);r.back();hoFooting(fw,g,win);hoWalls(fw,g,win);r.end();hoDoor(fw,g,'G',0,0.17,8.5,{col:'#6E5038',steps:1});
  if(big)hoGate(fw,g,-0.1,0.3,8.5);else hoWindow(fw,g,'L',0,0.1,g.fh+4,g.fh+7.5,{shutters:'#4E3A2C'});
  r.front();r.ridge();hoBarge(fw,g,'#5A4230',0.25,false);
  /* open drying shed: lean-to that rises toward the viewer, board stacks inside; the saw pit works in the open beside it */
  const sh=(a,c,h)=>f(a+0.42,c+0.18,h),sl=0.5,sw=0.32,hB=9,hF=13;hoQ([sh(-sl,-sw,0),sh(sl,-sw,0),sh(sl,sw,0),sh(-sl,sw,0)],'rgba(80,66,48,0.3)');
  hoQ([sh(-sl,-sw,0),sh(sl,-sw,0),sh(sl,-sw,hB),sh(-sl,-sw,hB)],'#3A2A1C');
  hoPlankStack(sh,-0.18,-0.05,0.55,0.12,L>=3?6:4,win);if(L>=3)hoPlankStack(sh,0.25,0.05,0.4,0.1,L>=5?6:4,win);
  for(const q of [[-sl,sw,hF],[sl,sw,hF],[sl,-sw,hB]])hoQ([sh(q[0]-0.03,q[1],0),sh(q[0]+0.03,q[1],0),sh(q[0]+0.03,q[1],q[2]),sh(q[0]-0.03,q[1],q[2])],'#4A3424');
  hoLine(sh(-sl,sw,hF),sh(sl,sw,hF),'#4A3424',1.4);
  hoQ([sh(-sl-0.05,-sw-0.05,hB+0.5),sh(sl+0.05,-sw-0.05,hB+0.5),sh(sl+0.05,sw+0.05,hF+1),sh(-sl-0.05,sw+0.05,hF+1)],win?'#EEF1F0':J.roof);
  if(!win)hoRoofSurface((u,v)=>lerp(sh(-sl-0.05+(2*sl+0.1)*u,-sw-0.05,hB+0.5),sh(-sl-0.05+(2*sl+0.1)*u,sw+0.05,hF+1),v),{sd:sd+4,rt:J.rt,rh:8,roofD:J.roofD,blue:J.blue},win);
  hoQ([sh(sl+0.05,-sw-0.05,hB+0.5),sh(sl+0.05,sw+0.05,hF+1),sh(sl+0.05,sw+0.05,hF-0.6),sh(sl+0.05,-sw-0.05,hB-1.1)],shade(J.roofD,0.6));
  hoSawPit(f,-0.45,0.68,win);if(L>=3)hoSawhorse(f,0.75,-0.75,win);}

/* =================== Smithy options (prototype) — window.__setSmith(n) =================== */
let SMITH_OPT=0;window.__setSmith=n=>{SMITH_OPT=n|0;};
{const _ds5=drawShaped;drawShaped=function(b,win,c0,ax){if(SMITH_OPT&&b.t==='smith'){drawSmithOpt(b,win,SMITH_OPT);return true;}return _ds5(b,win,c0,ax);};}
function hoStoneBox(f,a,c,sa,sc,h1,h2b,win,sd){const S1=win?'#C9CBC7':'#8E8980',S2=win?'#B2B4B0':'#76726A';hoQ([f(a-sa,c+sc,h1),f(a+sa,c+sc,h1),f(a+sa,c+sc,h2b),f(a-sa,c+sc,h2b)],S1);hoQ([f(a+sa,c-sc,h1),f(a+sa,c+sc,h1),f(a+sa,c+sc,h2b),f(a+sa,c-sc,h2b)],S2);
  ctx.strokeStyle='rgba(40,36,30,0.5)';ctx.lineWidth=0.45;ctx.beginPath();const rows=Math.max(1,Math.round((h2b-h1)/2.6));for(let r=0;r<=rows;r++){const h=h1+(h2b-h1)*r/rows,p=f(a-sa,c+sc,h),q=f(a+sa,c+sc,h),q2=f(a+sa,c-sc,h);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.lineTo(q2[0],q2[1]);
    if(r<rows){for(let k=0;k<3;k++){const s=-sa+2*sa*((k+(r%2?0.5:0.25))/3),m=f(a+s,c+sc,h),m2=f(a+s,c+sc,h+(h2b-h1)/rows);ctx.moveTo(m[0],m[1]);ctx.lineTo(m2[0],m2[1]);}const s2=-sc+sc*(r%2?0.7:1.3),n1=f(a+sa,c+s2,h),n2=f(a+sa,c+s2,h+(h2b-h1)/rows);ctx.moveTo(n1[0],n1[1]);ctx.lineTo(n2[0],n2[1]);}}ctx.stroke();}
function hoAnvil(f,a,c,win){/* anvil on an oak block */const P=(da,dc,h)=>f(a+da,c+dc,h);hoQ([P(-0.07,0.07,0),P(0.07,0.07,0),P(0.07,0.07,5),P(-0.07,0.07,5)],'#7A5A3C');hoQ([P(0.07,-0.07,0),P(0.07,0.07,0),P(0.07,0.07,5),P(0.07,-0.07,5)],'#5E4430');
  hoQ([P(-0.06,0.05,5),P(0.06,0.05,5),P(0.03,0.03,7),P(-0.03,0.03,7)],'#3A3836');hoQ([P(-0.12,0.05,7),P(0.12,0.05,7),P(0.12,0.05,9),P(-0.12,0.05,9)],'#4A4846');hoQ([P(0.12,-0.04,7),P(0.12,0.05,7),P(0.12,0.05,9),P(0.12,-0.04,9)],'#3A3836');
  hoQ([P(-0.12,-0.04,9),P(0.12,-0.04,9),P(0.12,0.05,9),P(-0.12,0.05,9)],'#6A6A6A');{const tip=P(0.2,0.005,8.6);hoQ([P(0.12,-0.03,9),P(0.12,0.04,9),tip],'#5A5A5A');}hoLine(P(-0.1,-0.03,9.05),P(0.1,-0.03,9.05),'rgba(255,255,255,0.35)',0.4);
  /* hammer resting on it */hoLine(P(-0.02,0.0,9.4),P(0.08,0.06,9.4),'#6E5038',0.7);ctx.fillStyle='#2E2C2A';const hh=P(-0.03,-0.005,9.6);ctx.fillRect(hh[0]-1,hh[1]-1,2,1.6);}
function drawSmithOpt(b,win,opt){const J=WOOD_SET[opt]||WOOD_SET[1],L=Math.min(5,b.lvl||1),f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*37+opt;
  /* workshop: stone lower walls, timber above */const big=L>=5,fw=(a,c,h)=>f(a-0.38,c-0.42,h);
  const g={sd,hl:big?0.56:0.46,hw:0.36,fh:2.6,wh:12,rh:12,ov:0.06,th:J.rt==='thatch'?4:1.6,wt:'planks',wall:'#6E5440',wallD:'#58422F',roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,blue:J.blue,frame:true,frameCol:'#3A2A1C',k:1,v:1};
  hoQ([fw(-g.hl,-g.hw,0),fw(g.hl+0.15,-g.hw,0),fw(g.hl+0.15,g.hw+0.2,0),fw(-g.hl,g.hw+0.2,0)],'rgba(30,38,42,0.15)');
  const r=hoRoof(fw,g,win);r.back();hoFooting(fw,g,win);hoWalls(fw,g,win);hoStoneBox(fw,0,0,g.hl,g.hw,g.fh,g.fh+5,win,sd);r.end();hoDoor(fw,g,'G',0,0.16,8.5,{col:'#4A3424',steps:1});hoWindow(fw,g,'L',-0.1,0.1,g.fh+6,g.fh+9,{shutters:'#3A2A1C'});
  r.front();r.ridge();hoBarge(fw,g,'#4A3424',0.25,false);
  /* open forge shed in front: lean-to rising toward the viewer */const sh=(a,c,h)=>f(a+0.42,c+0.2,h),sl=0.5,sw=0.34,hB=10,hF=14,roofAt=c=>hB+(hF-hB)*(c+sw+0.05)/(2*sw+0.1);
  hoQ([sh(-sl,-sw,0),sh(sl,-sw,0),sh(sl,sw,0),sh(-sl,sw,0)],'rgba(70,60,50,0.35)');hoQ([sh(-sl,-sw,0),sh(sl,-sw,0),sh(sl,-sw,hB),sh(-sl,-sw,hB)],'#3A2A1C');
  /* tools hanging on the back wall */for(let i=0;i<5;i++){const a=-0.05+i*0.08,p=sh(a,-sw+0.01,hB-2.5);hoLine(p,[p[0],p[1]+3.5+(i%2)],'#2E2C2A',0.6);ctx.fillStyle='#4A4846';ctx.fillRect(p[0]-0.8,p[1]+3.5+(i%2),1.6,1.2);}
  /* stone forge with its chimney: hearth box, glowing fire, bellows beside it */const fa=-0.25,fc=0.1;hoStoneBox(sh,fa,fc,0.15,0.15,0,6,win,sd+2);hoQ([sh(fa-0.15,fc-0.15,6),sh(fa+0.15,fc-0.15,6),sh(fa+0.15,fc+0.15,6),sh(fa-0.15,fc+0.15,6)],win?'#D8DAD6':'#9C978D');
  {const m=sh(fa,fc,6);ctx.fillStyle='#2A1E16';ctx.beginPath();ctx.ellipse(m[0],m[1],4.6,2.3,0,0,6.3);ctx.fill();ctx.fillStyle='rgba(255,120,40,0.85)';ctx.beginPath();ctx.ellipse(m[0],m[1],3.4,1.6,0,0,6.3);ctx.fill();ctx.fillStyle='rgba(255,210,120,0.9)';ctx.beginPath();ctx.ellipse(m[0],m[1],1.6,0.8,0,0,6.3);ctx.fill();
    ctx.fillStyle='rgba(255,160,70,0.18)';ctx.beginPath();ctx.ellipse(m[0],m[1]+2,16,9,0,0,6.3);ctx.fill();}
  {const bl=sh(fa+0.25,fc-0.05,3.5);ctx.fillStyle='#6E4A30';ctx.beginPath();ctx.moveTo(bl[0]-4,bl[1]);ctx.lineTo(bl[0]+3,bl[1]-2);ctx.lineTo(bl[0]+3,bl[1]+2);ctx.closePath();ctx.fill();hoLine([bl[0]+3,bl[1]-2],[bl[0]+6,bl[1]-4],'#4A3424',0.8);ctx.strokeStyle='rgba(30,20,10,0.6)';ctx.lineWidth=0.4;ctx.beginPath();ctx.moveTo(bl[0]-2,bl[1]-0.6);ctx.lineTo(bl[0]+2,bl[1]-1.6);ctx.moveTo(bl[0]-2,bl[1]+0.6);ctx.lineTo(bl[0]+2,bl[1]+1.4);ctx.stroke();}
  const cs=0.08,cTop=hF+9,cr=roofAt(fc+cs);hoStoneBox(sh,fa,fc,cs,cs,6,cr,win,sd+3);
  /* anvil under the shed, a water bucket, iron bars and charcoal from L3 */hoAnvil(sh,0.17,0.2,win);
  {const p=sh(0.4,0.22,0);ctx.fillStyle='#6E5038';ctx.fillRect(p[0]-2.4,p[1]-4,4.8,4);ctx.fillStyle='#4E6A7A';ctx.beginPath();ctx.ellipse(p[0],p[1]-4,2.4,1,0,0,6.3);ctx.fill();hoLine([p[0]-2.4,p[1]-2],[p[0]+2.4,p[1]-2],'#2E2C2A',0.5);}
  if(L>=3){for(let k=0;k<3;k++)for(let i=0;i<4-k;i++){const p=sh(-0.42+i*0.035+k*0.017,0.22,1+k*1.2);hoQ([[p[0]-3,p[1]],[p[0]+3,p[1]+1.5],[p[0]+3,p[1]+0.5],[p[0]-3,p[1]-1]],k%2?'#5A5856':'#6E6C6A');}
    /* charcoal pile removed (José) */}
  /* posts and the roof */for(const q of [[-sl,sw,hF],[sl,sw,hF],[sl,-sw,hB]])hoQ([sh(q[0]-0.03,q[1],0),sh(q[0]+0.03,q[1],0),sh(q[0]+0.03,q[1],q[2]),sh(q[0]-0.03,q[1],q[2])],'#3A2A1C');hoLine(sh(-sl,sw,hF),sh(sl,sw,hF),'#3A2A1C',1.4);
  hoQ([sh(-sl-0.05,-sw-0.05,hB+0.5),sh(sl+0.05,-sw-0.05,hB+0.5),sh(sl+0.05,sw+0.05,hF+1),sh(-sl-0.05,sw+0.05,hF+1)],win?'#EEF1F0':J.roof);
  if(!win)hoRoofSurface((u,v)=>lerp(sh(-sl-0.05+(2*sl+0.1)*u,-sw-0.05,hB+0.5),sh(-sl-0.05+(2*sl+0.1)*u,sw+0.05,hF+1),v),{sd:sd+4,rt:J.rt,rh:8,roofD:J.roofD,blue:J.blue},win);
  hoQ([sh(sl+0.05,-sw-0.05,hB+0.5),sh(sl+0.05,sw+0.05,hF+1),sh(sl+0.05,sw+0.05,hF-0.6),sh(sl+0.05,-sw-0.05,hB-1.1)],shade(J.roofD,0.6));
  /* chimney goes through the roof: its walls start at the roof surface, lead flashing at the joint, a cap and smoke */
  {const R=c=>roofAt(c)+0.5,P=(da,dc,h)=>sh(fa+da,fc+dc,h);hoQ([P(-cs,cs,R(fc+cs)),P(cs,cs,R(fc+cs)),P(cs,cs,cTop),P(-cs,cs,cTop)],win?'#C9CBC7':'#8E8980');hoQ([P(cs,-cs,R(fc-cs)),P(cs,cs,R(fc+cs)),P(cs,cs,cTop),P(cs,-cs,cTop)],win?'#B2B4B0':'#76726A');
    ctx.strokeStyle='rgba(40,36,30,0.5)';ctx.lineWidth=0.45;ctx.beginPath();for(let h=R(fc+cs)+2.4;h<cTop;h+=2.4){const p=P(-cs,cs,h),q=P(cs,cs,h),q2=P(cs,-cs,Math.max(h,R(fc-cs)));ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.lineTo(q2[0],q2[1]);}ctx.stroke();
    ctx.strokeStyle=win?'#E8ECEC':'#8A8F94';ctx.lineWidth=1.2;ctx.beginPath();{const a=P(-cs-0.01,cs+0.01,R(fc+cs)+0.3),b2=P(cs+0.01,cs+0.01,R(fc+cs)+0.3),c2=P(cs+0.01,-cs,R(fc-cs)+0.3);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);ctx.lineTo(c2[0],c2[1]);}ctx.stroke();
    hoQ([P(-cs-0.02,cs+0.02,cTop),P(cs+0.02,cs+0.02,cTop),P(cs+0.02,cs+0.02,cTop+1.4),P(-cs-0.02,cs+0.02,cTop+1.4)],'#6E6A64');hoQ([P(cs+0.02,-cs-0.02,cTop),P(cs+0.02,cs+0.02,cTop),P(cs+0.02,cs+0.02,cTop+1.4),P(cs+0.02,-cs-0.02,cTop+1.4)],'#5A5752');
    hoQ([P(-cs-0.02,-cs-0.02,cTop+1.4),P(cs+0.02,-cs-0.02,cTop+1.4),P(cs+0.02,cs+0.02,cTop+1.4),P(-cs-0.02,cs+0.02,cTop+1.4)],'#2A2622');hoSmoke(P(0,0,cTop+2));}}

/* =================== Market options (prototype) — window.__setMarket(n) ===================
   1 Dyed-cloth stalls round a covered well · 2 Viking tent fair · 3 Covered market hall · 4 The market tree */
let MK_OPT=0;window.__setMarket=n=>{MK_OPT=n|0;};
{const _mk=drawMarketV;drawMarketV=function(b,c0,win){if(MK_OPT){drawMarketOpt(b,win,MK_OPT);return true;}return _mk(b,c0,win);};}
function hoPaving(f,hs,win,sd,round){const base=win?'#E4E6E2':'#B9B1A2',kerb=win?'#C9CBC7':'#8E877B';
  if(round){const C=f(0,0,0);ctx.fillStyle=kerb;ctx.beginPath();ctx.ellipse(C[0],C[1],hs*36+3,hs*18+1.5,0,0,6.3);ctx.fill();ctx.fillStyle=base;ctx.beginPath();ctx.ellipse(C[0],C[1],hs*36,hs*18,0,0,6.3);ctx.fill();
    ctx.strokeStyle='rgba(80,72,60,0.35)';ctx.lineWidth=0.5;for(let r=1;r<5;r++){ctx.beginPath();ctx.ellipse(C[0],C[1],hs*36*r/5,hs*18*r/5,0,0,6.3);ctx.stroke();}ctx.beginPath();for(let k=0;k<24;k++){const a=k/24*6.283;ctx.moveTo(C[0]+Math.cos(a)*hs*7,C[1]+Math.sin(a)*hs*3.5);ctx.lineTo(C[0]+Math.cos(a)*hs*36,C[1]+Math.sin(a)*hs*18);}ctx.stroke();return;}
  hoQ([f(-hs-0.06,-hs-0.06,0),f(hs+0.06,-hs-0.06,0),f(hs+0.06,hs+0.06,0),f(-hs-0.06,hs+0.06,0)],kerb);hoQ([f(-hs,-hs,0),f(hs,-hs,0),f(hs,hs,0),f(-hs,hs,0)],base);
  ctx.strokeStyle='rgba(80,72,60,0.35)';ctx.lineWidth=0.5;ctx.beginPath();const n=Math.round(hs*6);for(let i=1;i<2*n;i++){const v=-hs+hs*i/n,p=f(-hs,v,0),q=f(hs,v,0);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);for(let k=0;k<2*n;k++){const u=-hs+hs*(k+(i%2?0.5:0))/n;if(u>hs)continue;const a=f(u,v,0),b2=f(u,v-hs/n,0);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}}ctx.stroke();
  for(let k=0;k<26;k++){const p=f((h2(sd,k,91)-0.5)*2*hs,(h2(sd,k,92)-0.5)*2*hs,0);ctx.fillStyle=k%2?'rgba(255,250,235,0.12)':'rgba(40,34,26,0.1)';ctx.beginPath();ctx.ellipse(p[0],p[1],4,2,0,0,6.3);ctx.fill();}}
/* goods on a counter top: kind = fish, pots, furs, apples, cloth, amber */
function hoGoods(f,a,c,len,h,kind,win){const n=Math.round(len/0.07);for(let i=0;i<n;i++){const p=f(a-len/2+0.035+i*(len/n),c,h);
  if(kind==='fish'){ctx.fillStyle=i%2?'#AEB8BE':'#8E9AA2';ctx.beginPath();ctx.ellipse(p[0],p[1]-0.8,2.4,0.9,0.4,0,6.3);ctx.fill();}
  else if(kind==='pots'){ctx.fillStyle=i%2?'#9A5A3A':'#B0704A';ctx.beginPath();ctx.ellipse(p[0],p[1]-1.8,1.6,1.9,0,0,6.3);ctx.fill();ctx.fillStyle='#5A3020';ctx.fillRect(p[0]-0.7,p[1]-3.8,1.4,0.6);}
  else if(kind==='furs'){ctx.fillStyle=['#8A6A4A','#C9B49A','#5A4636'][i%3];ctx.fillRect(p[0]-2.2,p[1]-1.8,4.4,1.8);ctx.fillStyle='rgba(255,255,255,0.12)';ctx.fillRect(p[0]-2.2,p[1]-1.8,4.4,0.5);}
  else if(kind==='apples'){for(let k=0;k<3;k++){ctx.fillStyle=k%2?'#B8423A':'#C9A042';ctx.beginPath();ctx.arc(p[0]-1+k,p[1]-1-(k%2),0.9,0,6.3);ctx.fill();}}
  else if(kind==='cloth'){ctx.fillStyle=['#A34A3A','#3E6A8A','#C9A042','#4E6A44'][i%4];ctx.beginPath();ctx.ellipse(p[0],p[1]-1.2,2.2,1.2,0,0,6.3);ctx.fill();ctx.fillStyle='rgba(0,0,0,0.18)';ctx.beginPath();ctx.ellipse(p[0]+1.6,p[1]-1.2,0.7,1.2,0,0,6.3);ctx.fill();}
  else{ctx.fillStyle=i%2?'#D9902E':'#E8B04A';ctx.beginPath();ctx.arc(p[0],p[1]-0.8,0.9,0,6.3);ctx.fill();}}}
/* a market stall: four posts, counter at the front with goods, cloth awning (striped) or a small roof, sloping down to the front */
function hoStall(f,a,c,o,win){const sl=o.sl||0.32,sw=o.sw||0.22,hB=12,hF=10,P=(da,dc,h)=>f(a+da,c+dc,h);
  hoQ([P(-sl,-sw,0),P(sl,-sw,0),P(sl,sw,0),P(-sl,sw,0)],'rgba(60,50,38,0.22)');
  hoQ([P(-sl+0.03,sw-0.12,0),P(sl-0.03,sw-0.12,0),P(sl-0.03,sw-0.12,5),P(-sl+0.03,sw-0.12,5)],'#7A5A3C');hoQ([P(sl-0.03,sw-0.22,0),P(sl-0.03,sw-0.12,0),P(sl-0.03,sw-0.12,5),P(sl-0.03,sw-0.22,5)],'#5E4430');
  hoQ([P(-sl+0.03,sw-0.22,5),P(sl-0.03,sw-0.22,5),P(sl-0.03,sw-0.1,5),P(-sl+0.03,sw-0.1,5)],'#A88A62');hoGoods(f,a,c+sw-0.16,2*sl-0.12,5,o.kind,win);
  for(const q of [[-sl,sw,hF],[sl,sw,hF],[sl,-sw,hB]])hoQ([P(q[0]-0.02,q[1],0),P(q[0]+0.02,q[1],0),P(q[0]+0.02,q[1],q[2]),P(q[0]-0.02,q[1],q[2])],'#4A3424');
  const A=[P(-sl-0.04,-sw-0.04,hB+0.5),P(sl+0.04,-sw-0.04,hB+0.5),P(sl+0.04,sw+0.06,hF),P(-sl-0.04,sw+0.06,hF)];
  if(o.cloth&&!win){const cols=o.cloth,n=6;for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n;hoQ([lerp(A[0],A[1],u0),lerp(A[0],A[1],u1),lerp(A[3],A[2],u1),lerp(A[3],A[2],u0)],cols[i%cols.length]);}
    /* scalloped valance along the front edge */ctx.fillStyle=cols[0];for(let i=0;i<n*2;i++){const p=lerp(A[3],A[2],(i+0.5)/(n*2));ctx.beginPath();ctx.arc(p[0],p[1],1.3,0,3.14);ctx.fill();}hoLine(A[3],A[2],'rgba(0,0,0,0.25)',0.5);}
  else{hoQ(A,win?'#EEF1F0':o.roof||'#2F2C2A');if(!win)hoRoofSurface((u,v)=>lerp(lerp(A[3],A[2],u),lerp(A[0],A[1],u),v),{sd:o.sd||1,rt:o.rt||'scale',rh:6,roofD:o.roofD||'#211F1D'},win);}}
/* Viking A-frame tent: striped wool, ridge pole, carved crossed boards with small dragon heads at both ends, open front */
function hoTent(f,a,c,o,win){const tl=o.tl||0.36,tw=o.tw||0.26,th=13,P=(da,dc,h)=>f(a+da,c+dc,h);
  hoQ([P(-tl,-tw,0),P(tl,-tw,0),P(tl,tw,0),P(-tl,tw,0)],'rgba(60,50,38,0.22)');
  hoQ([P(-tl,-tw,0),P(tl,-tw,0),P(tl,0,th),P(-tl,0,th)],win?'#D3DAD9':shade(o.cols[0],0.75));
  /* open front gable: dark inside, goods at the door */hoQ([P(tl,-tw,0),P(tl,tw,0),P(tl,0,th)],'#2A2018');hoGoods((da,dc,h)=>P(tl+0.06,dc-0.0,h),0,0,0.3,0.8,o.kind,win);
  const n=7;for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n,x0=-tl+2*tl*u0,x1=-tl+2*tl*u1;hoQ([P(x0,tw,0),P(x1,tw,0),P(x1,0,th),P(x0,0,th)],win?'#EEF1F0':o.cols[i%o.cols.length]);}
  hoLine(P(-tl,tw,0.3),P(tl,tw,0.3),'rgba(0,0,0,0.3)',0.6);hoLine(P(-tl-0.05,0,th+0.4),P(tl+0.05,0,th+0.4),'#4A3424',1.1);
  for(const end of [tl,-tl]){const dir=(end>0)===f(1,0,0)[0]>f(0,0,0)[0]?1:-1;for(const s of [1,-1]){const e=P(end,s*tw,0),r=P(end,0,th),x=[r[0]+(r[0]-e[0])*0.3,r[1]+(r[1]-e[1])*0.3];hoLine(e,x,'#5A4230',1.3);}
    const r=P(end,0,th);hoHead([r[0],r[1]-4],end>0?(f(1,0,0)[0]>f(0,0,0)[0]?1:-1):(f(1,0,0)[0]>f(0,0,0)[0]?-1:1),0.6,'#5A4230','#C9A042');}
  /* guy ropes and pegs */for(const s of [-1,1]){const p=P(-tl*0.6,s*tw*1.6,0),q=P(-tl*0.6,s*tw*0.4,th*0.6);if(s>0){hoLine(p,q,'rgba(200,180,140,0.7)',0.4);ctx.fillStyle='#4A3424';ctx.fillRect(p[0]-0.6,p[1]-1.5,1.2,1.5);}}}
function hoWell(f,a,c,win,roof){const P=(da,dc,h)=>f(a+da,c+dc,h),C=P(0,0,0);for(let k=0;k<3;k++){ctx.fillStyle=k%2?'#8E8980':'#A39D92';ctx.beginPath();ctx.ellipse(C[0],C[1]-k*2.2,8,4,0,0,6.3);ctx.fill();}
  ctx.strokeStyle='rgba(40,36,30,0.5)';ctx.lineWidth=0.4;for(let k=0;k<3;k++){ctx.beginPath();ctx.ellipse(C[0],C[1]-k*2.2,8,4,0,0,3.14);ctx.stroke();}ctx.fillStyle='#B4AFA4';ctx.beginPath();ctx.ellipse(C[0],C[1]-6.6,8,4,0,0,6.3);ctx.fill();ctx.fillStyle='#1E2A30';ctx.beginPath();ctx.ellipse(C[0],C[1]-6.6,5.6,2.7,0,0,6.3);ctx.fill();
  if(roof){const h=17;for(const s of [-1,1]){hoLine(P(s*0.2,0,6.6),P(s*0.2,0,h),'#4A3424',1.4);}hoLine(P(-0.2,0,11),P(0.2,0,11),'#5A4230',1.6);const rp=P(0.05,0,11);hoLine(rp,[rp[0],rp[1]+7],'#C9B38A',0.5);ctx.fillStyle='#6E5038';ctx.fillRect(rp[0]-1.4,rp[1]+7,2.8,2.2);
    const crank=P(0.24,0,11);hoLine(crank,[crank[0]+2,crank[1]+2],'#2A2622',0.8);
    const g={sd:5,hl:0.24,hw:0.15,fh:0,wh:h,rh:6,ov:0.03,th:1.4,roof:roof.roof,roofD:roof.roofD,roofE:shade(roof.roofD,0.7),rt:roof.rt};const fr=(a2,c2,hh)=>f(a+a2,c+c2,hh),rr=hoRoof(fr,g,win);rr.back();rr.end();rr.front();rr.ridge();hoBarge(fr,g,'#4A3424',0.25,false);}}
function hoTree(f,a,c,win,sd){const P=(da,dc,h)=>f(a+da,c+dc,h),b0=P(0,0,0);ctx.fillStyle='#5A4230';ctx.beginPath();ctx.moveTo(b0[0]-4,b0[1]);ctx.quadraticCurveTo(b0[0]-2,b0[1]-14,b0[0]-1.6,b0[1]-30);ctx.lineTo(b0[0]+1.6,b0[1]-30);ctx.quadraticCurveTo(b0[0]+2,b0[1]-14,b0[0]+4,b0[1]);ctx.fill();
  hoLine([b0[0]-1,b0[1]-24],[b0[0]-9,b0[1]-34],'#5A4230',1.6);hoLine([b0[0]+1,b0[1]-22],[b0[0]+10,b0[1]-32],'#5A4230',1.6);
  const cols=win?['#E8ECEC','#D6DCDC','#C4CCCC']:['#4E6A3A','#5E7E44','#3E5A2E','#6E8E4E'];for(let k=0;k<26;k++){const ang=h2(sd,k,1)*6.283,rr=h2(sd,k,2),x=b0[0]+Math.cos(ang)*rr*26,y=b0[1]-42+Math.sin(ang)*rr*14-(k%3)*2;ctx.fillStyle=cols[k%cols.length];ctx.beginPath();ctx.ellipse(x,y,9-rr*3,6-rr*2,0,0,6.3);ctx.fill();}
  ctx.fillStyle='rgba(255,250,200,0.12)';for(let k=0;k<8;k++){const x=b0[0]-14+h2(sd,k,3)*20,y=b0[1]-52+h2(sd,k,4)*10;ctx.beginPath();ctx.ellipse(x,y,4,2.5,0,0,6.3);ctx.fill();}}
function drawMarketOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*41+opt,hs=1.75;
  if(opt===1){/* dyed-cloth stalls (madder red, woad blue, weld yellow) round a covered well */hoPaving(f,hs,win,sd);
    const S=[[-1.05,-1.05,'furs',['#A34A3A','#E6DCC4']],[0.15,-1.15,'cloth',['#3E6A8A','#E6DCC4']],[-1.15,0.15,'pots',['#C9A042','#7A5A2C']],[1.1,-0.2,'fish',['#3E6A8A','#C9A042']],[-0.2,1.1,'apples',['#A34A3A','#C9A042']],[1.05,1.05,'amber',['#4E6A44','#E6DCC4']]];
    S.sort((p,q)=>(p[0]+p[1])-(q[0]+q[1]));let well=false;for(const s of S){if(!well&&s[0]+s[1]>0){hoWell(f,0,0,win,{rt:'scale',roof:'#2F2C2A',roofD:'#211F1D'});well=true;}hoStall(f,s[0],s[1],{kind:s[2],cloth:s[3]},win);}if(!well)hoWell(f,0,0,win,{rt:'scale',roof:'#2F2C2A',roofD:'#211F1D'});return;}
  if(opt===2){/* Viking tent fair on trodden ground, a merchant's scale in the middle */const C=f(0,0,0);ctx.fillStyle=win?'#E4E6E2':'#A8987C';ctx.beginPath();ctx.ellipse(C[0],C[1],hs*38,hs*19,0,0,6.3);ctx.fill();ctx.fillStyle='rgba(60,46,30,0.18)';for(let k=0;k<30;k++){const p=f((h2(sd,k,5)-0.5)*3,(h2(sd,k,6)-0.5)*3,0);ctx.beginPath();ctx.ellipse(p[0],p[1],3,1.4,0,0,6.3);ctx.fill();}
    const T=[[-1.0,-1.0,'furs',['#A34A3A','#E6DCC4']],[0.4,-1.1,'cloth',['#C9A042','#6E4A2C']],[-1.1,0.4,'amber',['#3E6A8A','#E6DCC4']],[1.05,0.35,'fish',['#7A2E22','#D2B48A']],[0.35,1.05,'pots',['#4E6A44','#E6DCC4']]];
    T.sort((p,q)=>(p[0]+p[1])-(q[0]+q[1]));let sc=false;for(const s of T){if(!sc&&s[0]+s[1]>0){/* balance scale on a post */const p=f(0,0,0);hoLine(p,[p[0],p[1]-16],'#4A3424',1.4);hoLine([p[0]-7,p[1]-15],[p[0]+7,p[1]-15],'#6E5038',0.9);for(const d of [-7,7]){hoLine([p[0]+d,p[1]-15],[p[0]+d,p[1]-10],'rgba(80,60,40,0.8)',0.4);ctx.fillStyle='#B88A4A';ctx.beginPath();ctx.ellipse(p[0]+d,p[1]-10,2.4,0.9,0,0,6.3);ctx.fill();}sc=true;}hoTent(f,s[0],s[1],{kind:s[2],cols:s[3]},win);}return;}
  if(opt===3){/* covered market hall: high open timber hall, black shingles, tables along both open sides, a central aisle */hoPaving(f,hs,win,sd);
    const hl=1.45,hw=0.85,wh=16,rh=14,P=(a,c,h)=>f(a,c,h);
    /* back tables first */for(const a of [-1.0,-0.33,0.33,1.0]){hoQ([P(a-0.25,-hw+0.2,5),P(a+0.25,-hw+0.2,5),P(a+0.25,-hw+0.38,5),P(a-0.25,-hw+0.38,5)],'#A88A62');}
    for(let k=0;k<=6;k++){const a=-hl+2*hl*k/6;hoQ([P(a-0.035,-hw,0),P(a+0.035,-hw,0),P(a+0.035,-hw,wh),P(a-0.035,-hw,wh)],'#3A2A1C');}
    const kinds=['fish','furs','pots','cloth'];for(let i=0;i<4;i++){const a=-1.0+i*0.667;hoQ([P(a-0.25,hw-0.38,0),P(a+0.25,hw-0.38,0),P(a+0.25,hw-0.38,5),P(a-0.25,hw-0.38,5)],'#7A5A3C');hoQ([P(a-0.25,hw-0.38,5),P(a+0.25,hw-0.38,5),P(a+0.25,hw-0.2,5),P(a-0.25,hw-0.2,5)],'#A88A62');hoGoods(f,a,hw-0.29,0.44,5,kinds[i],win);}
    for(let k=0;k<=6;k++){const a=-hl+2*hl*k/6;hoQ([P(a-0.035,hw,0),P(a+0.035,hw,0),P(a+0.035,hw,wh),P(a-0.035,hw,wh)],'#4A3424');}for(const cc of [-hw*0.5,0,hw*0.5])hoQ([P(hl,cc-0.035,0),P(hl,cc+0.035,0),P(hl,cc+0.035,wh),P(hl,cc-0.035,wh)],'#3A2A1C');
    hoLine(P(-hl,hw,wh),P(hl,hw,wh),'#3A2A1C',1.8);hoLine(P(hl,-hw,wh),P(hl,hw,wh),'#2E2018',1.8);
    const g={sd,hl,hw,fh:0,wh,rh,ov:0.08,th:1.8,roof:'#2F2C2A',roofD:'#211F1D',roofE:'#171514',rt:'scale'};const r=hoRoof(P,g,win);r.back();r.end();
    /* gable: open truss with a carved sun disc */hoLine(P(hl,-hw,wh),P(hl,0,wh+rh),'#3A2A1C',1.2);hoLine(P(hl,hw,wh),P(hl,0,wh+rh),'#3A2A1C',1.2);hoLine(P(hl,0,wh),P(hl,0,wh+rh),'#3A2A1C',1);{const m=P(hl,0,wh+rh*0.4);ctx.strokeStyle='#C9A042';ctx.lineWidth=0.8;ctx.beginPath();ctx.arc(m[0],m[1],3,0,6.3);ctx.stroke();for(let k=0;k<8;k++){const an=k/8*6.283;ctx.moveTo(m[0]+Math.cos(an)*3.6,m[1]+Math.sin(an)*3.6);ctx.lineTo(m[0]+Math.cos(an)*5,m[1]+Math.sin(an)*5);}ctx.stroke();}
    r.front();r.ridge();hoBarge(P,g,'#3A2A1C',0.3,true);return;}
  if(opt===4){/* the market tree: a great linden in a round square, ring bench, stalls in a ring under it */hoPaving(f,hs,win,sd,true);
    const R=[[-1.1,-0.5,'furs','#2F2C2A'],[-0.5,-1.1,'cloth','#7A3428'],[0.75,-0.95,'pots','#2F2C2A'],[-0.95,0.75,'amber','#7A3428'],[1.0,0.55,'fish','#2F2C2A'],[0.55,1.0,'apples','#7A3428']];
    R.sort((p,q)=>(p[0]+p[1])-(q[0]+q[1]));let tr=false;for(const s of R){if(!tr&&s[0]+s[1]>0){const C=f(0,0,0);ctx.fillStyle='#7A5A3C';ctx.beginPath();ctx.ellipse(C[0],C[1],14,7,0,0,6.3);ctx.fill();ctx.fillStyle='#A88A62';ctx.beginPath();ctx.ellipse(C[0],C[1]-3,14,7,0,0,6.3);ctx.fill();ctx.fillStyle='#8A6A48';ctx.beginPath();ctx.ellipse(C[0],C[1]-3,10,5,0,0,6.3);ctx.fill();hoTree(f,0,0,win,sd);tr=true;}
      hoStall(f,s[0],s[1],{kind:s[2],roof:s[3],roofD:shade(s[3],0.75),rt:s[3]==='#7A3428'?'boards':'scale',sd:sd+s[0]*10|0,sl:0.26,sw:0.2},win);}return;}}
/* Market option 5: a realistic take on option 1 — sturdy timber booths along the back edges facing the square, plank walls,
   muted natural-dyed wool or shingle roofs, goods and barrels at the booths, irregular flagstones, a framed well */
function hoBooth(f,a0,c0,face,o,win){const fl=face.endsWith('-'),fc=face[0];const fs=fc==='c'?(fl?(la,lc,h)=>f(a0-la,c0-lc,h):(la,lc,h)=>f(a0+la,c0+lc,h)):(fl?(la,lc,h)=>f(a0-lc,c0-la,h):(la,lc,h)=>f(a0+lc,c0+la,h));const sl=0.34,sw=0.24,hB=13,hF=11,P=fs,bw=fl?6:hB;
  hoQ([P(-sl,-sw,0),P(sl,-sw,0),P(sl,sw,0),P(-sl,sw,0)],'rgba(60,50,38,0.25)');
  /* plank back wall and a half side wall */hoQ([P(-sl,-sw,0),P(sl,-sw,0),P(sl,-sw,bw),P(-sl,-sw,bw)],'#6E5440');ctx.strokeStyle='rgba(30,20,12,0.4)';ctx.lineWidth=0.45;ctx.beginPath();for(let k=1;k<8;k++){const p=P(-sl+2*sl*k/8,-sw,0),q=P(-sl+2*sl*k/8,-sw,bw);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
  hoQ([P(sl,-sw,0),P(sl,sw-0.1,0),P(sl,sw-0.1,6),P(sl,-sw,bw-1)],'#58422F');for(const q of [[-sl,-sw],[sl,-sw]])hoQ([P(q[0]-0.025,q[1],0),P(q[0]+0.025,q[1],0),P(q[0]+0.025,q[1],hB),P(q[0]-0.025,q[1],hB)],'#4A3424');
  /* goods hanging on the back wall */if(o.hang&&!fl){for(let i=0;i<4;i++){const p=P(-0.22+i*0.14,-sw+0.01,hB-3);hoLine(p,[p[0],p[1]+2],'#2A2622',0.4);ctx.fillStyle=o.hang[i%o.hang.length];ctx.fillRect(p[0]-1.4,p[1]+2,2.8,3.4);}}
  /* barrels/baskets inside, by the side wall */hoBasket(P(sl-0.1,-0.02,0));
  /* counter */hoQ([P(-sl+0.03,sw-0.12,0),P(sl-0.03,sw-0.12,0),P(sl-0.03,sw-0.12,5.5),P(-sl+0.03,sw-0.12,5.5)],'#7A5A3C');ctx.strokeStyle='rgba(30,20,12,0.35)';ctx.lineWidth=0.4;ctx.beginPath();for(const hh of [1.8,3.6]){const p=P(-sl+0.03,sw-0.12,hh),q=P(sl-0.03,sw-0.12,hh);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
  hoQ([P(-sl+0.01,sw-0.24,5.5),P(sl-0.01,sw-0.24,5.5),P(sl-0.01,sw-0.08,5.5),P(-sl+0.01,sw-0.08,5.5)],'#A88A62');hoGoods(P,0,sw-0.16,2*sl-0.12,5.5,o.kind,win);
  for(const q of [[-sl,sw,hF],[sl,sw,hF]])hoQ([P(q[0]-0.025,q[1],0),P(q[0]+0.025,q[1],0),P(q[0]+0.025,q[1],q[2]),P(q[0]-0.025,q[1],q[2])],'#4A3424');
  const A=[P(-sl-0.05,-sw-0.05,hB+0.5),P(sl+0.05,-sw-0.05,hB+0.5),P(sl+0.05,sw+0.07,hF),P(-sl-0.05,sw+0.07,hF)];
  if(o.cloth){/* awning frame under the cloth: middle pole and guy ropes to pegs (drawn first so the cloth hides any part behind it) */const mp=P(0,sw+0.07,0),mt=P(0,sw+0.07,hF);hoLine(mp,mt,'#4A3424',1);
    for(const q of [A[3],A[2]]){const pg=[q[0]+(q[0]-P(0,0,hF)[0])*0.15,q[1]+9];hoLine(q,pg,'rgba(200,180,140,0.75)',0.4);ctx.fillStyle='#4A3424';ctx.fillRect(pg[0]-0.6,pg[1]-1.4,1.2,1.4);}}
  if(o.cloth&&!win){/* muted wool awning: a main colour with one narrow stripe, slight sag, hem */hoQ(A,o.cloth[0]);const s1=lerp(lerp(A[0],A[3],0.62),lerp(A[1],A[2],0.62),0),s2=lerp(A[1],A[2],0.62);hoQ([lerp(A[0],A[3],0.6),lerp(A[1],A[2],0.6),lerp(A[1],A[2],0.72),lerp(A[0],A[3],0.72)],o.cloth[1]);
    ctx.strokeStyle='rgba(0,0,0,0.12)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=1;k<5;k++){const p=lerp(A[0],A[1],k/5),q=lerp(A[3],A[2],k/5);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();hoLine(A[3],A[2],shade(o.cloth[0],0.7),1);}
  if(o.cloth){hoLine(A[0],A[1],'#4A3424',0.9);hoLine(A[3],A[2],'#4A3424',0.9);}
  else{hoQ(A,win?'#EEF1F0':o.roof);if(!win)hoRoofSurface((u,v)=>lerp(lerp(A[3],A[2],u),lerp(A[0],A[1],u),v),{sd:o.sd||3,rt:o.rt,rh:6,roofD:shade(o.roof,0.75)},win);hoLine(A[3],A[2],'rgba(10,8,6,0.5)',0.7);}
  hoQ([A[1],A[2],[A[2][0],A[2][1]+1.4],[A[1][0],A[1][1]+1.4]],'#3A2A1C');}
function hoFlagstones(f,hs,win,sd){const FL=window.__FLOOR|0;if(FL===2)return hoFloorSlabs(f,hs,win,sd);if(FL===3)return hoFloorPlanks(f,hs,win,sd);if(FL===4||window.__FLAG)return hoFlag0(f,hs,win,sd);if(!window.__FANS)return hoSetts(f,hs,win,sd);
  hoQ([f(-hs-0.07,-hs-0.07,0),f(hs+0.07,-hs-0.07,0),f(hs+0.07,hs+0.07,0),f(-hs-0.07,hs+0.07,0)],win?'#BFC1BD':'#5E5850');hoQ([f(-hs,-hs,0),f(hs,-hs,0),f(hs,hs,0),f(-hs,hs,0)],win?'#D8DAD6':'#4E4A44');
  /* kerb of long dressed stones */for(let k=0;k<18;k++){const u=-hs+2*hs*(k+0.5)/18;for(const q of [[u,hs+0.035],[hs+0.035,u]]){const p=f(q[0],q[1],0);ctx.fillStyle=k%2?'#7E776C':'#8E877B';ctx.beginPath();ctx.ellipse(p[0],p[1],3.4,1.6,0,0,6.3);ctx.fill();}}
  /* cobbles laid in fans (arcs), each a small rounded stone in a slightly different tone */const fan=0.42;ctx.save();ctx.beginPath();{const q=[f(-hs,-hs,0),f(hs,-hs,0),f(hs,hs,0),f(-hs,hs,0)];ctx.moveTo(q[0][0],q[0][1]);for(const z of q)ctx.lineTo(z[0],z[1]);ctx.closePath();}ctx.clip();
  for(let i=-1;i<=Math.ceil(2*hs/fan)+1;i++)for(let j=-1;j<=Math.ceil(4*hs/fan)+2;j++){const ca=-hs+i*fan+(j%2?fan/2:0),cc=-hs+j*fan*0.5;for(let r=1;r<=4;r++){const R=fan*0.62*r/4,n=3+r*3;for(let k=0;k<=n;k++){const an=Math.PI*(0.15+0.7*k/n),a=ca+Math.cos(an)*R,c=cc+Math.sin(an)*R*0.9-fan*0.1;const p=f(a,c,0),t2=h2(sd,i*977+j*131+r*17+k,7);ctx.fillStyle=win?(t2>0.5?'#E6E8E4':'#D2D4D0'):(t2>0.75?'#837B70':t2>0.4?'#6E675D':t2>0.15?'#5E5850':'#77705F');ctx.beginPath();ctx.ellipse(p[0],p[1],1.9,1.05,0,0,6.3);ctx.fill();}}}
  ctx.restore();ctx.fillStyle='rgba(90,110,60,0.3)';for(let k=0;k<16;k++){const p=f((h2(sd,k,4)-0.5)*2*hs,(h2(sd,k,5)-0.5)*2*hs,0);ctx.fillRect(p[0]-1.2,p[1]-0.3,2.4,0.6);}}
function hoFlag0(f,hs,win,sd){const base=win?'#E4E6E2':'#B4AC9C';hoQ([f(-hs-0.06,-hs-0.06,0),f(hs+0.06,-hs-0.06,0),f(hs+0.06,hs+0.06,0),f(-hs-0.06,hs+0.06,0)],win?'#C9CBC7':'#857E72');hoQ([f(-hs,-hs,0),f(hs,-hs,0),f(hs,hs,0),f(-hs,hs,0)],base);
  const n=14;for(let i=0;i<n;i++)for(let k=0;k<n;k++){const ja=(h2(sd,i*31+k,1)-0.5)*0.06,jc=(h2(sd,i*31+k,2)-0.5)*0.06,a=-hs+2*hs*(i+0.5)/n+ja,c=-hs+2*hs*(k+0.5)/n+jc,s=hs/n*0.86;
    const tone=h2(sd,i*17+k,3),col=win?'#DDE0DC':tone>0.66?'#C2BAA9':tone<0.33?'#A69E8E':'#B8B09F';hoQ([f(a-s*(0.9+0.1*tone),c-s,0),f(a+s,c-s*(0.85+0.15*tone),0),f(a+s*(0.9+0.1*(1-tone)),c+s,0),f(a-s,c+s*0.92,0)],col);}
  ctx.fillStyle='rgba(90,110,60,0.35)';for(let k=0;k<20;k++){const p=f((h2(sd,k,4)-0.5)*2*hs,(h2(sd,k,5)-0.5)*2*hs,0);ctx.fillRect(p[0]-1.5,p[1]-0.4,3,0.8);}}
{const _mo=drawMarketOpt;drawMarketOpt=function(b,win,opt){if(opt!==5)return _mo(b,win,opt);const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*43+5,hs=1.75;hoFlagstones(f,hs,win,sd);
  /* back row facing the square, then the left row; front stays open toward the viewer */
  hoBooth(f,-1.38,-1.0,'a',{kind:'pots',cloth:['#8E5A44','#CDBFA2']},win);
  hoBooth(f,-0.25,-1.38,'c',{kind:'furs',roof:'#2F2C2A',rt:'scale',hang:['#8A6A4A','#C9B49A','#5A4636']},win);
  hoBooth(f,1.0,-1.38,'c',{kind:'cloth',cloth:['#CDBFA2','#4E6478'],hang:['#8E4A3A','#4E6478','#B89A5A']},win);
  hoBooth(f,-1.38,0.35,'a',{kind:'fish',roof:'#7A3428',rt:'boards'},win);
  hoWell2(f,0,0,win);
  hoBooth(f,1.38,0.0,'a-',{kind:'amber',roof:'#7A3428',rt:'boards'},win);
  hoBooth(f,0.0,1.38,'c-',{kind:'apples',cloth:['#6E7A4E','#CDBFA2']},win);
  hoBooth(f,1.25,1.38,'c-',{kind:'pots',roof:'#2F2C2A',rt:'scale'},win);};}

function hoWell2(f,a,c,win){const P=(da,dc,h)=>f(a+da,c+dc,h),C=P(0,0,0),R=9,Ry=4.5,H=7;
  ctx.fillStyle='rgba(30,26,20,0.25)';ctx.beginPath();ctx.ellipse(C[0]+2,C[1]+1,R+2,Ry+1,0,0,6.3);ctx.fill();
  /* round stone shaft: body, staggered blocks on the front half */ctx.fillStyle=win?'#C9CBC7':'#7E776C';ctx.beginPath();ctx.ellipse(C[0],C[1],R,Ry,0,0,3.14);ctx.lineTo(C[0]-R,C[1]-H);ctx.ellipse(C[0],C[1]-H,R,Ry,0,3.14,0,true);ctx.closePath();ctx.fill();
  for(let r=0;r<3;r++){const y=C[1]-r*H/3;for(let k=0;k<7;k++){const t0=(k+(r%2?0.5:0))/7*Math.PI,t1=t0+Math.PI/7;if(t0>Math.PI)continue;const x0=C[0]+Math.cos(t0)*R,y0=y+Math.sin(t0)*Ry,x1=C[0]+Math.cos(Math.min(t1,Math.PI))*R,y1=y+Math.sin(Math.min(t1,Math.PI))*Ry;const tn=h2(a*99|0,r*13+k,9);ctx.fillStyle=tn>0.6?'#8E877B':tn>0.3?'#857E72':'#726B60';ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.lineTo(x1,y1-H/3+0.5);ctx.lineTo(x0,y0-H/3+0.5);ctx.closePath();ctx.fill();}}
  /* coping ring and dark water */ctx.fillStyle=win?'#E2E4E0':'#A39D92';ctx.beginPath();ctx.ellipse(C[0],C[1]-H,R+0.8,Ry+0.5,0,0,6.3);ctx.fill();ctx.fillStyle='#1A2428';ctx.beginPath();ctx.ellipse(C[0],C[1]-H,R-2.4,Ry-1.3,0,0,6.3);ctx.fill();ctx.fillStyle='rgba(140,170,180,0.25)';ctx.beginPath();ctx.ellipse(C[0]-1.5,C[1]-H-0.5,2.5,0.8,0,0,6.3);ctx.fill();
  /* two posts, windlass roller with crank, rope and bucket */const hp=20;for(const s of [-1,1]){const b0=P(s*0.15,0,H),t0=P(s*0.15,0,hp);hoQ([[b0[0]-0.9,b0[1]],[b0[0]+0.9,b0[1]],[t0[0]+0.9,t0[1]],[t0[0]-0.9,t0[1]]],s<0?'#5A4230':'#4A3424');}
  const r0=P(-0.15,0,hp-5),r1=P(0.15,0,hp-5);hoLine(r0,r1,'#6E5038',2.4);for(let k=1;k<5;k++){const p=lerp(r0,r1,k/5);hoLine([p[0]-0.6,p[1]-1],[p[0]+0.6,p[1]+1],'rgba(200,180,140,0.7)',0.4);}
  const ck=P(0.2,0,hp-5);hoLine(r1,ck,'#2A2622',0.8);hoLine(ck,[ck[0],ck[1]+3],'#2A2622',0.8);hoLine([ck[0],ck[1]+3],[ck[0]+1.6,ck[1]+3],'#5A4230',1);
  const rp=lerp(r0,r1,0.45);hoLine(rp,[rp[0],rp[1]+6],'#C9B38A',0.5);ctx.fillStyle='#6E5038';ctx.beginPath();ctx.moveTo(rp[0]-1.8,rp[1]+6);ctx.lineTo(rp[0]+1.8,rp[1]+6);ctx.lineTo(rp[0]+1.4,rp[1]+9);ctx.lineTo(rp[0]-1.4,rp[1]+9);ctx.fill();hoLine([rp[0]-1.8,rp[1]+7.2],[rp[0]+1.8,rp[1]+7.2],'#2A2622',0.4);
  /* little shingled gable roof on the posts */const g={sd:7,hl:0.24,hw:0.16,fh:0,wh:hp,rh:6,ov:0.03,th:1.4,roof:'#2F2C2A',roofD:'#211F1D',roofE:'#171514',rt:'scale'};const fr=(a2,c2,hh)=>f(a+a2,c+c2,hh),rr=hoRoof(fr,g,win);rr.back();rr.end();rr.front();rr.ridge();
  /* thin crossed boards on both gables */for(const ae of [g.hl+g.ov+0.01,-g.hl-g.ov-0.01])for(const sg of [1,-1]){const e=fr(ae,sg*(g.hw+g.ov),g.wh-g.ov/g.hw*g.rh),r2=fr(ae,0,g.wh+g.rh),x=[r2[0]+(r2[0]-e[0])*0.25,r2[1]+(r2[1]-e[1])*0.25];hoLine(ae>0||sg>0?e:r2,x,'#4A3424',0.8);}
  /* stone trough beside it */const tq=(da,dc,h)=>P(0.3+da,0.12+dc,h);hoQ([tq(-0.12,0.06,0),tq(0.12,0.06,0),tq(0.12,0.06,3),tq(-0.12,0.06,3)],'#857E72');hoQ([tq(0.12,-0.06,0),tq(0.12,0.06,0),tq(0.12,0.06,3),tq(0.12,-0.06,3)],'#726B60');hoQ([tq(-0.1,-0.04,3),tq(0.1,-0.04,3),tq(0.1,0.04,3),tq(-0.1,0.04,3)],'#3E5560');}

function hoSetts(f,hs,win,sd){hoQ([f(-hs-0.07,-hs-0.07,0),f(hs+0.07,-hs-0.07,0),f(hs+0.07,hs+0.07,0),f(-hs-0.07,hs+0.07,0)],win?'#BFC1BD':'#5A544C');hoQ([f(-hs,-hs,0),f(hs,-hs,0),f(hs,hs,0),f(-hs,hs,0)],win?'#C9CBC7':'#3E3A35');
  /* dark granite setts in running bond: rows across, each stone a slightly different length and tone, a soft highlight on its top edge */
  const rows=Math.round(2*hs/0.085);for(let r=0;r<rows;r++){const c1=-hs+2*hs*r/rows+0.006,c2=-hs+2*hs*(r+1)/rows-0.006;let a=-hs+(r%2?0.06:0);
    while(a<hs){const len=0.1+0.05*h2(sd,r*131+(a*100|0),11),a2=Math.min(hs,a+len),aa=Math.max(-hs,a)+0.006;if(a2-aa>0.02){const t2=h2(sd,r*97+(a*100|0),12),col=win?(t2>0.5?'#E2E4E0':'#D4D6D2'):(t2>0.8?'#7A736A':t2>0.55?'#6A645B':t2>0.25?'#5C574F':'#655E52');
      hoQ([f(aa,c1,0),f(a2-0.006,c1,0),f(a2-0.006,c2,0),f(aa,c2,0)],col);hoLine(f(aa,c2,0),f(a2-0.006,c2,0),'rgba(255,250,235,0.10)',0.5);}a=a2;}}
  /* worn path from the corners to the well, a little moss in the joints near the edges */ctx.fillStyle='rgba(150,140,120,0.10)';const C=f(0,0,0);ctx.beginPath();ctx.ellipse(C[0],C[1],26,13,0,0,6.3);ctx.fill();
  ctx.fillStyle='rgba(90,110,60,0.35)';for(let k=0;k<22;k++){const e=h2(sd,k,13)>0.5?1:-1,p=f(e*(hs-0.05-h2(sd,k,14)*0.15),(h2(sd,k,15)-0.5)*2*hs,0);ctx.fillRect(p[0]-1.2,p[1]-0.3,2.4,0.6);}
  for(let k=0;k<20;k++){const u=-hs+2*hs*(k+0.5)/20;for(const q of [[u,hs+0.035],[hs+0.035,u]]){const p=f(q[0],q[1],0);ctx.fillStyle=k%2?'#7E776C':'#8E877B';ctx.beginPath();ctx.ellipse(p[0],p[1],3,1.4,0,0,6.3);ctx.fill();}}}

/* floor option 2: big irregular granite slabs on a jittered grid (shared corners), dark joints with moss */
function hoFloorSlabs(f,hs,win,sd){hoQ([f(-hs-0.07,-hs-0.07,0),f(hs+0.07,-hs-0.07,0),f(hs+0.07,hs+0.07,0),f(-hs-0.07,hs+0.07,0)],win?'#BFC1BD':'#5A544C');hoQ([f(-hs,-hs,0),f(hs,-hs,0),f(hs,hs,0),f(-hs,hs,0)],win?'#C9CBC7':'#3A3631');
  const n=11,st=2*hs/n,V=(i,k)=>{const e=i===0||i===n,g=k===0||k===n;return [-hs+i*st+(e?0:(h2(sd,i*53+k,21)-0.5)*st*0.5),-hs+k*st+(g?0:(h2(sd,i*53+k,22)-0.5)*st*0.5)];};
  for(let i=0;i<n;i++)for(let k=0;k<n;k++){const q=[V(i,k),V(i+1,k),V(i+1,k+1),V(i,k+1)],cx=(q[0][0]+q[2][0])/2,cy=(q[0][1]+q[2][1])/2,ins=0.012,pts=q.map(v=>{const dx=cx-v[0],dy=cy-v[1],d=Math.hypot(dx,dy)||1;return f(v[0]+dx/d*ins,v[1]+dy/d*ins,0);});
    const t=h2(sd,i*71+k,23),col=win?(t>0.5?'#E2E4E0':'#D6D8D4'):(t>0.8?'#8A8378':t>0.55?'#7A746A':t>0.25?'#6E685E':'#757060');hoQ(pts,col);hoLine(pts[3],pts[2],'rgba(255,250,235,0.10)',0.5);
    if(!win&&zoom>1.2){ctx.fillStyle='rgba(30,26,20,0.18)';const c=f(cx,cy,0);for(let m=0;m<3;m++)ctx.fillRect(c[0]+(h2(sd,i*7+k*13+m,24)-0.5)*8,c[1]+(h2(sd,i*11+k*5+m,25)-0.5)*4,0.8,0.5);}}
  ctx.fillStyle='rgba(90,110,60,0.4)';for(let k=0;k<30;k++){const i=1+(h2(sd,k,26)*(n-1)|0),j=1+(h2(sd,k,27)*(n-1)|0),v=V(i,j),p=f(v[0],v[1],0);ctx.fillRect(p[0]-1.4,p[1]-0.35,2.8,0.7);}
  for(let k=0;k<20;k++){const u=-hs+2*hs*(k+0.5)/20;for(const q of [[u,hs+0.035],[hs+0.035,u]]){const p=f(q[0],q[1],0);ctx.fillStyle=k%2?'#7E776C':'#8E877B';ctx.beginPath();ctx.ellipse(p[0],p[1],3,1.4,0,0,6.3);ctx.fill();}}}
/* floor option 3: trodden earth with timber plank walks (Hedeby style): a ring in front of the booths and a cross to the well */
function hoFloorPlanks(f,hs,win,sd){hoQ([f(-hs-0.05,-hs-0.05,0),f(hs+0.05,-hs-0.05,0),f(hs+0.05,hs+0.05,0),f(-hs-0.05,hs+0.05,0)],win?'#D0CEC8':'#6A5844');hoQ([f(-hs,-hs,0),f(hs,-hs,0),f(hs,hs,0),f(-hs,hs,0)],win?'#DAD8D2':'#8C7A60');
  if(!win){for(let k=0;k<70;k++){const p=f((h2(sd,k,31)-0.5)*2*hs,(h2(sd,k,32)-0.5)*2*hs,0),t=h2(sd,k,33);ctx.fillStyle=t>0.6?'rgba(160,140,110,0.35)':t>0.3?'rgba(60,46,32,0.3)':'rgba(110,120,70,0.35)';ctx.fillRect(p[0]-1,p[1]-0.4,t>0.3?2:3,0.8);}
    const C=f(0,0,0);ctx.fillStyle='rgba(50,38,26,0.10)';ctx.beginPath();ctx.ellipse(C[0],C[1],22,11,0,0,6.3);ctx.fill();}
  const w=0.1,pk=0.06;
  /* a walk along axis 'a' (planks laid across it) from a0 to a1 at c */const walkA=(a0,a1,c)=>{for(let a=a0;a<a1-0.01;a+=pk){const t=h2(sd,(a*100|0)+(c*1000|0),34),col=win?(t>0.5?'#EEF0EC':'#E2E4E0'):(t>0.7?'#A08460':t>0.35?'#937656':'#86694A');hoQ([f(a+0.004,c-w,0),f(a+pk-0.008,c-w,0),f(a+pk-0.008,c+w,0),f(a+0.004,c+w,0)],col);}
      hoLine(f(a0,c+w,0),f(a1,c+w,0),'rgba(30,20,12,0.45)',0.6);hoLine(f(a0,c-w,0),f(a1,c-w,0),'rgba(30,20,12,0.3)',0.5);};
  const walkC=(c0,c1,a)=>{for(let c=c0;c<c1-0.01;c+=pk){const t=h2(sd,(c*100|0)+(a*1000|0),35),col=win?(t>0.5?'#EEF0EC':'#E2E4E0'):(t>0.7?'#A08460':t>0.35?'#937656':'#86694A');hoQ([f(a-w,c+0.004,0),f(a+w,c+0.004,0),f(a+w,c+pk-0.004,0),f(a-w,c+pk-0.008,0)],col);}
      hoLine(f(a+w,c0,0),f(a+w,c1,0),'rgba(30,20,12,0.45)',0.6);hoLine(f(a-w,c0,0),f(a-w,c1,0),'rgba(30,20,12,0.3)',0.5);};
  const r=0.82;walkA(-r-w,r+w,-r);walkC(-r+w,r-w,-r);walkC(-r+w,r-w,r);walkA(-r-w,r+w,r);
  walkA(r+w,hs,0);walkC(r+w,hs,0);walkA(-r+w,-0.32,0);walkA(0.32,r-w,0);walkC(-r+w,-0.25,0);walkC(0.25,r-w,0);}

/* =================== Iron Mine options (prototype) — window.__setMine(n) ===================
   1 Hillside adit: a rock knoll with a timbered portal, rails and an ore cart · 2 Sloping shaft: a timber-lined ramp cut down into the grass under a shingled hood */
let MINE_OPT=0;window.__setMine=n=>{MINE_OPT=n|0;};
{const _dsM=drawShaped;drawShaped=function(b,win,c0,ax){if(MINE_OPT&&b.t==='mine'){drawMineOpt(b,win,MINE_OPT);return true;}return _dsM(b,win,c0,ax);};}
function hoOre(p,n,sd,s){s=s||1;for(let k=0;k<n;k++){const dx=(h2(sd,k,41)-0.5)*7*s,dy=(h2(sd,k,42)-0.5)*3*s-k*0.25*s,t2=h2(sd,k,43);ctx.fillStyle=t2>0.6?'#9A5A3A':t2>0.3?'#7E4A32':'#5E4A40';ctx.beginPath();ctx.ellipse(p[0]+dx,p[1]+dy,1.6*s,1.1*s,0,0,6.3);ctx.fill();}
  ctx.fillStyle='rgba(255,220,180,0.25)';ctx.fillRect(p[0]-1,p[1]-1.5*s,1,0.5);}
function hoSpoil(p,r,sd,win){/* heap of grey spoil with a few rusty lumps */ctx.fillStyle='rgba(30,26,20,0.22)';ctx.beginPath();ctx.ellipse(p[0]+1.5,p[1]+0.5,r+1.5,r*0.5+0.8,0,0,6.3);ctx.fill();
  ctx.fillStyle=win?'#C9CBC7':'#77716A';ctx.beginPath();ctx.ellipse(p[0],p[1],r,r*0.5,0,0,3.14);ctx.lineTo(p[0]-r,p[1]);ctx.quadraticCurveTo(p[0]-r*0.3,p[1]-r*0.75,p[0],p[1]-r*0.8);ctx.quadraticCurveTo(p[0]+r*0.3,p[1]-r*0.75,p[0]+r,p[1]);ctx.fill();
  ctx.fillStyle=win?'#B2B4B0':'#625D57';ctx.beginPath();ctx.moveTo(p[0],p[1]-r*0.8);ctx.quadraticCurveTo(p[0]+r*0.3,p[1]-r*0.75,p[0]+r,p[1]);ctx.ellipse(p[0],p[1],r,r*0.5,0,0,1.2);ctx.closePath();ctx.fill();
  for(let k=0;k<Math.round(r*1.2);k++){const a=h2(sd,k,44)*3.14,rr=h2(sd,k,45)*0.9,x=p[0]+Math.cos(a)*r*rr*0.9,y=p[1]-Math.sin(a)*r*0.6*rr;ctx.fillStyle=h2(sd,k,46)>0.75?'#8A5236':h2(sd,k,46)>0.4?'#8A847C':'#56514B';ctx.fillRect(x-0.8,y-0.5,1.6,1);}}
function hoCart(f,a,c,along,win,sd){/* ore cart on wooden rails: plank box, iron bands, small wheels, heaped ore */const P=(da,dc,h)=>along==='c'?f(a+da,c+dc,h):f(a+dc,c+da,h),sa=0.07,sc=0.11;
  for(const s of [-1,1])for(const t of [-0.07,0.07]){const w=along==='c'?f(a+s*(sa+0.005),c+t,1.6):f(a+t,c+s*(sa+0.005),1.6);ctx.fillStyle='#2A2622';ctx.beginPath();ctx.ellipse(w[0],w[1],1.7,1.7,0,0,6.3);ctx.fill();}
  const fA=along==='c'?(h1,h2b)=>[P(-sa,sc,h1),P(sa,sc,h1),P(sa,sc,h2b),P(-sa,sc,h2b)]:(h1,h2b)=>[P(-sc,sa,h1),P(sc,sa,h1),P(sc,sa,h2b),P(-sc,sa,h2b)];
  const fB=along==='c'?(h1,h2b)=>[P(sa,-sc,h1),P(sa,sc,h1),P(sa,sc,h2b),P(sa,-sc,h2b)]:(h1,h2b)=>[P(sc,-sa,h1),P(sc,sa,h1),P(sc,sa,h2b),P(sc,-sa,h2b)];
  hoQ(fA(2,7.5),'#7A5A3C');hoQ(fB(2,7.5),'#5E4430');for(const hh of [3,6.4]){const q=fA(hh,hh+0.6);hoQ(q,'#3A3634');const q2=fB(hh,hh+0.6);hoQ(q2,'#2E2A28');}
  const top=P(0,0,7.5);ctx.fillStyle='#2E2620';ctx.beginPath();ctx.ellipse(top[0],top[1],6,3,0,0,6.3);ctx.fill();hoOre([top[0],top[1]-0.5],9,sd,0.9);}
function hoRails(f,a,c0,c1,win){/* two wooden rails on sleepers, along c */for(let c=c0+0.03;c<c1;c+=0.075)hoQ([f(a-0.085,c-0.015,0.3),f(a+0.085,c-0.015,0.3),f(a+0.085,c+0.015,0.3),f(a-0.085,c+0.015,0.3)],win?'#D8DAD6':'#5E4632');
  for(const s of [-0.05,0.05]){hoLine(f(a+s,c0,0.9),f(a+s,c1,0.9),win?'#B8BAB6':'#7A5E44',1.1);}}
function hoPortal(Q,pa,pw,ph,win,L){/* timbered adit mouth on a face: Q(s,h) gives a point on that face */const blk=Q(0,0);
  hoQ([Q(pa-pw,0),Q(pa+pw,0),Q(pa+pw,ph),Q(pa-pw,ph)],'#0E0C0A');hoQ([Q(pa-pw*0.7,0),Q(pa+pw*0.7,0),Q(pa+pw*0.7,ph*0.72),Q(pa-pw*0.7,ph*0.72)],'#1E1A16');
  /* inner frame further in, a glint of lamp light from L5 */hoLine(Q(pa-pw*0.7,0),Q(pa-pw*0.7,ph*0.72),'#3A2A1C',0.9);hoLine(Q(pa+pw*0.7,0),Q(pa+pw*0.7,ph*0.72),'#3A2A1C',0.9);hoLine(Q(pa-pw*0.7,ph*0.72),Q(pa+pw*0.7,ph*0.72),'#3A2A1C',1);
  if(L>=5){const g=Q(pa,ph*0.35);ctx.fillStyle='rgba(255,170,80,0.35)';ctx.beginPath();ctx.ellipse(g[0],g[1],3,2,0,0,6.3);ctx.fill();}
  for(const s of [-1,1])hoQ([Q(pa+s*pw-0.025,0),Q(pa+s*pw+0.025,0),Q(pa+s*pw+0.025,ph),Q(pa+s*pw-0.025,ph)],s<0?'#6E5038':'#5A4230');
  hoQ([Q(pa-pw-0.06,ph),Q(pa+pw+0.06,ph),Q(pa+pw+0.06,ph+2.4),Q(pa-pw-0.06,ph+2.4)],'#7A5A3C');hoLine(Q(pa-pw-0.06,ph+2.4),Q(pa+pw+0.06,ph+2.4),'rgba(255,240,210,0.25)',0.5);
  ctx.strokeStyle='rgba(30,20,12,0.5)';ctx.lineWidth=0.4;ctx.beginPath();for(const s of [-1,1]){const p=Q(pa+s*pw,ph+0.3),q=Q(pa+s*pw,ph+2.1);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();}
function drawMineOpt(b,win,opt){const L=Math.min(5,b.lvl||1),f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*29+opt*7;
  if(opt===1){/* ---- hillside adit: an irregular rock knoll built in layers, grass on top, a timbered portal cut into its front ---- */
    const ca=-0.12,cc=-0.42,RA=0.86,RC=0.56,N=6,LH=3.4,M=22,lay=[];
    for(let k=0;k<=N;k++){const sh=1-0.78*Math.pow(k/N,1.3),pts=[];for(let m=0;m<M;m++){const th=m/M*6.283,nz=1+(h2(sd,k*31+m,61)-0.5)*0.22+(h2(sd,m,62)-0.5)*0.12;pts.push([ca+Math.cos(th)*RA*sh*nz,cc+Math.sin(th)*RC*sh*nz]);}lay.push(pts);}
    hoQ(lay[0].map(q=>f(q[0]+0.03,q[1]+0.03,0)),'rgba(30,26,20,0.22)');
    for(let k=0;k<N;k++){const A0=lay[k],A1=lay[k+1],h0=k*LH,h1=(k+1)*LH,quads=[];
      for(let m=0;m<M;m++){const n=(m+1)%M,nx=(A0[m][1]-A0[n][1]),nc=(A0[n][0]-A0[m][0]);/* outward normal (a,c) */const face=nx+nc;if(face<-0.02)continue;quads.push({d:(A0[m][0]+A0[n][0]+A0[m][1]+A0[n][1]),m,n,face:nc>nx?1:0,t:h2(sd,k*17+m,63)});}
      quads.sort((x,y)=>x.d-y.d);for(const q of quads){const col=win?(q.face?'#CFD1CD':'#C4C6C2'):q.face?(q.t>0.5?'#857E73':'#7A746A'):(q.t>0.5?'#6E685E':'#655F56');
        hoQ([f(A0[q.m][0],A0[q.m][1],h0),f(A0[q.n][0],A0[q.n][1],h0),f(A1[q.n][0],A1[q.n][1],h1),f(A1[q.m][0],A1[q.m][1],h1)],col);
}
      /* cap: grass on the upper layers, rock with a grass rim lower down */const cap=A1.map(q=>f(q[0],q[1],h1));hoQ(cap,win?'#DCDEDA':k>=N-3?'#8E9150':'#8A8478');
      if(!win&&k<N-3){const in2=A1.map(q=>f(ca+(q[0]-ca)*0.86,cc+(q[1]-cc)*0.86,h1));hoQ(in2,'#8E9150');}}
    if(!win){ctx.fillStyle='rgba(70,90,40,0.55)';for(let k=0;k<26;k++){const th=h2(sd,k,64)*6.283,r=h2(sd,k,65)*0.85,lv=2+(h2(sd,k,66)*(N-2)|0),sh=1-0.78*Math.pow(lv/N,1.3),p2=f(ca+Math.cos(th)*RA*sh*r,cc+Math.sin(th)*RC*sh*r,lv*LH);ctx.fillRect(p2[0]-0.4,p2[1]-2.6,0.8,2.6);}}
    /* the cut: a flat rock face around the mouth, timber cribbing on both sides, the portal */
    const pa=-0.2,pw=0.12,ph=12,cp=0.06,F=(s,h)=>f(s,cp,h);
    hoQ([F(pa-0.3,0),F(pa+0.3,0),F(pa+0.26,16),F(pa+0.1,19),F(pa-0.14,18.5),F(pa-0.3,15)],win?'#BFC1BD':'#5E5850');
    if(!win){ctx.strokeStyle='rgba(30,26,20,0.4)';ctx.lineWidth=0.5;ctx.beginPath();for(const [x,y,x2,y2] of [[-0.27,4,-0.2,9],[0.2,13,0.26,6],[-0.05,15,0.08,17]]){const p2=F(pa+x,y),q2=F(pa+x2,y2);ctx.moveTo(p2[0],p2[1]);ctx.lineTo(q2[0],q2[1]);}ctx.stroke();}
    for(const sg of [-1,1]){for(let r=0;r<4;r++){const h=r*2.6+1.3,a=pa+sg*(pw+0.04),p2=f(a,cp+0.0,h),q2=f(a+sg*0.03,cp+0.2-r*0.035,h);hoLine(p2,q2,r%2?'#6E5038':'#5A4230',2.2);}}
    hoPortal((s,h)=>f(s,cp+0.01,h),pa,pw,ph,win,L);
    /* boulders at the foot of the knoll */for(let k=0;k<6;k++){const th=0.2+k*0.42,p2=f(ca+Math.cos(th)*RA*1.02,cc+Math.sin(th)*RC*1.05,0);if(Math.abs(ca+Math.cos(th)*RA-pa)<0.25&&Math.sin(th)>0.6)continue;ctx.fillStyle=k%2?'#6E685E':'#7E776C';ctx.beginPath();ctx.ellipse(p2[0],p2[1]-1.2,2.8,1.7,0,0,6.3);ctx.fill();}
    /* spoil heap left, rails and cart, ore pile */hoSpoil(f(-0.72,0.45,0),L>=5?11:8,sd+6,win);if(L>=5)hoSpoil(f(-0.5,0.85,0),6,sd+7,win);
    hoRails(f,pa,cp+0.02,0.97,win);hoCart(f,pa,0.55,'c',win,sd);
    /* tool lean-to on the right from L3: back wall, posts, black shingles, tools hanging */
    if(L>=3){const a0=0.32,a1=0.78,c0=0.06,c1=0.36,hB=11,hF=8;hoQ([f(a0,c0,0),f(a1,c0,0),f(a1,c1,0),f(a0,c1,0)],'rgba(40,34,28,0.3)');hoQ([f(a0,c0,0),f(a1,c0,0),f(a1,c0,hB),f(a0,c0,hB)],'#4A3828');
      ctx.strokeStyle='rgba(20,14,8,0.45)';ctx.lineWidth=0.4;ctx.beginPath();for(let a=a0+0.06;a<a1;a+=0.06){const p2=f(a,c0,0),q2=f(a,c0,hB);ctx.moveTo(p2[0],p2[1]);ctx.lineTo(q2[0],q2[1]);}ctx.stroke();
      for(let i=0;i<4;i++){const p2=f(a0+0.1+i*0.1,c0+0.01,hB-2);hoLine(p2,[p2[0],p2[1]+6],'#6E5038',0.7);ctx.fillStyle='#3A3836';ctx.fillRect(p2[0]-1.5,p2[1]+(i%2?5:0),3,1.1);}
      for(const q of [[a0,c1,hF],[a1,c1,hF],[a1,c0,hB]])hoQ([f(q[0]-0.02,q[1],0),f(q[0]+0.02,q[1],0),f(q[0]+0.02,q[1],q[2]),f(q[0]-0.02,q[1],q[2])],'#4A3424');
      const R=[f(a0-0.04,c0-0.03,hB+0.5),f(a1+0.04,c0-0.03,hB+0.5),f(a1+0.04,c1+0.05,hF),f(a0-0.04,c1+0.05,hF)];hoQ(R,win?'#EEF1F0':'#2F2C2A');if(!win)hoRoofSurface((u,v)=>lerp(lerp(R[3],R[2],u),lerp(R[0],R[1],u),v),{sd:sd+3,rt:'scale',rh:12,roofD:'#211F1D'},win);hoLine(R[3],R[2],'rgba(10,8,6,0.5)',0.7);
      hoQ([R[1],R[2],[R[2][0],R[2][1]+1.3],[R[1][0],R[1][1]+1.3]],'#1E1C1A');}
    hoOre(f(0.3,0.62,0),L>=3?16:10,sd+5,1.1);
    {const p2=f(pa+pw+0.1,cp+0.08,0);hoLine(p2,[p2[0]+3,p2[1]-11],'#6E5038',0.8);hoLine([p2[0]+1.5,p2[1]-11.5],[p2[0]+5,p2[1]-9.5],'#3A3836',1.1);}
    if(L>=5)hoLamp(f(pa-pw-0.07,cp+0.04,0));
    return;}
  /* ---- sloping shaft cut into the grass ---- */const w=0.16,a0=0.55,a1=-0.5,D=-24,P=(a,c,h)=>f(a,c,h);
  hoSpoil(P(-0.55,-0.68,0),L>=5?12:9,sd+6,win);if(L>=3)hoOre(P(0.2,-0.7,0),12,sd+8,1.1);
  /* dug-earth rim, then the cut itself (clipped to its mouth) */hoQ([P(a1-0.08,-w-0.08,0),P(a0+0.06,-w-0.08,0),P(a0+0.06,w+0.08,0),P(a1-0.08,w+0.08,0)],win?'#C4C6C2':'#6A5640');
  ctx.save();{const m=[P(a1,-w,0),P(a0,-w,0),P(a0,w,0),P(a1,w,0)];ctx.beginPath();ctx.moveTo(m[0][0],m[0][1]);for(const z of m)ctx.lineTo(z[0],z[1]);ctx.closePath();ctx.clip();}
  hoQ([P(a1,-w,0),P(a0,-w,0),P(a0,w,0),P(a1,w,0)],'#1E1812');
  /* far wall lined with planks */hoQ([P(a0,-w,0),P(a1,-w,0),P(a1,-w,D),P(a0,-w,0)],win?'#BFC1BD':'#5A4634');if(!win){const g0=P(a0,-w,0),g1=P(a1,-w,D),g2=P(a1,-w,0),gr=ctx.createLinearGradient(g0[0],g0[1],g1[0],g1[1]);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,0.55)');poly([g0[0],g0[1],g2[0],g2[1],g1[0],g1[1]],gr);}ctx.strokeStyle='rgba(25,18,12,0.55)';ctx.lineWidth=0.5;ctx.beginPath();for(let h=-2.5;h>D;h-=2.5){const u=h/D,p=P(a0-(a0-a1)*u,-w,h),q=P(a1,-w,h);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
  for(let a=a1+0.2;a<a0-0.1;a+=0.25){const u=(a0-a)/(a0-a1);hoLine(P(a,-w+0.01,0),P(a,-w+0.01,D*u),'#3A2A1C',1);}
  /* floor ramp with rails, the end face with the portal */for(let k=0;k<8;k++){const u0=k/8,u1=(k+1)/8,A0=a0-(a0-a1)*u0,A1=a0-(a0-a1)*u1,v=Math.round(74-50*u1);hoQ([P(A0,-w,D*u0),P(A1,-w,D*u1),P(A1,w,D*u1),P(A0,w,D*u0)],win?'#CFD1CD':`rgb(${v},${Math.round(v*0.8)},${Math.round(v*0.6)})`);}
  for(let k=0;k<12;k++){const u=k/12,a=a0-(a0-a1)*u,h=D*u;hoQ([P(a+0.012,-0.085,h),P(a-0.012,-0.085,h),P(a-0.012,0.085,h),P(a+0.012,0.085,h)],win?'#D8DAD6':'#5E4632');}
  for(const s of [-0.05,0.05])hoLine(P(a0,s,0.6),P(a1,s,D+0.6),win?'#B8BAB6':'#7A5E44',1);
  {const Q=(s,h)=>P(a1,s,h);hoQ([Q(-w,D),Q(w,D),Q(w,0),Q(-w,0)],win?'#B2B4B0':'#3A2C20');ctx.save();ctx.translate(0,0);hoPortal((s,h)=>P(a1+0.005,s,D+h),0,0.1,11,win,L);ctx.restore();}
  ctx.restore();
  /* log kerbs on the edges of the cut */for(const c of [-w-0.02,w+0.02])hoLine(P(a1-0.02,c,0.8),P(a0,c,0.8),'#6E5038',2.2);hoLine(P(a1-0.03,-w-0.03,0.8),P(a1-0.03,w+0.03,0.8),'#5A4230',2.4);
  /* rails continue on the surface; cart on top (L1) or part-way down on a rope from the windlass (L3+) */hoRails(f,0,a0,0.98,win);
  /* shingled hood over the deep end on four posts */{const hl=L>=5?0.3:0.22,hc=a1+hl-0.06,hw=w+0.07,wh=13,fr=(a,c,h)=>f(hc+a,c,h);
    for(const q of [[-hl,-hw],[hl,-hw],[-hl,hw],[hl,hw]]){const p0=fr(q[0],q[1],0),p1=fr(q[0],q[1],wh);hoQ([[p0[0]-0.8,p0[1]],[p0[0]+0.8,p0[1]],[p1[0]+0.8,p1[1]],[p1[0]-0.8,p1[1]]],q[1]>0?'#5A4230':'#4A3424');}
    hoLine(fr(-hl,hw,wh),fr(hl,hw,wh),'#4A3424',1.2);hoLine(fr(hl,-hw,wh),fr(hl,hw,wh),'#4A3424',1.2);
    const g={sd:sd+2,hl,hw,wh,rh:7,ov:0.04,th:1.4,roof:'#2F2C2A',roofD:'#211F1D',roofE:'#171514',rt:'scale'};const rr=hoRoof(fr,g,win);rr.back();rr.end();rr.front();rr.ridge();
    for(const ae of [hl+g.ov+0.01,-hl-g.ov-0.01])for(const sg of [1,-1]){const e=fr(ae,sg*(hw+g.ov),wh-g.ov/hw*g.rh),r2=fr(ae,0,wh+g.rh),x=[r2[0]+(r2[0]-e[0])*0.25,r2[1]+(r2[1]-e[1])*0.25];hoLine(ae>0||sg>0?e:r2,x,'#4A3424',0.8);}
    if(L>=5)hoLamp(fr(hl,hw,wh-1));}
  if(L>=3){/* windlass across the top of the ramp, rope down to a cart on the slope */const wa=a0+0.06;for(const s of [-1,1]){const p0=P(wa,s*(w+0.06),0),p1=P(wa,s*(w+0.06),9);hoQ([[p0[0]-0.9,p0[1]],[p0[0]+0.9,p0[1]],[p1[0]+0.9,p1[1]],[p1[0]-0.9,p1[1]]],s>0?'#5A4230':'#4A3424');}
    const r0=P(wa,-w-0.06,7.5),r1=P(wa,w+0.06,7.5);hoLine(r0,r1,'#6E5038',2.6);{const ck=P(wa,w+0.12,7.5);hoLine(r1,ck,'#2A2622',0.8);hoLine(ck,[ck[0],ck[1]+3],'#2A2622',0.8);}
    const ca=0.12,cu=(a0-ca)/(a0-a1);hoLine(P(wa,0,7.5),P(ca+0.1,0,D*cu+6),'#C9B38A',0.5);hoCartSlope(f,ca,D*cu,win,sd);hoOre(P(0.4,0.6,0),10,sd+5,1.1);}
  else{hoCart(f,0,0.82,'a',win,sd);hoOre(P(0.42,0.55,0),8,sd+5,1.1);}
  {const p=P(-0.15,w+0.22,0);hoLine(p,[p[0]+3,p[1]-11],'#6E5038',0.8);hoLine([p[0]+1.5,p[1]-11.5],[p[0]+5,p[1]-9.5],'#3A3836',1.1);}}
function hoCartSlope(f,a,h,win,sd){const P=(da,dc,dh)=>f(a+da,dc,h+dh);hoQ([P(-0.11,0.07,1.5),P(0.11,0.07,3.5),P(0.11,0.07,8.5),P(-0.11,0.07,6.5)],'#7A5A3C');hoQ([P(0.11,-0.07,3.5),P(0.11,0.07,3.5),P(0.11,0.07,8.5),P(0.11,-0.07,8.5)],'#5E4430');
  const top=P(0,0,7.5);ctx.fillStyle='#2E2620';ctx.beginPath();ctx.ellipse(top[0],top[1],5,2.5,0,0,6.3);ctx.fill();hoOre([top[0],top[1]-0.5],7,sd,0.9);}
function hoLamp(p){hoLine(p,[p[0],p[1]-12],'#3A2A1C',0.9);ctx.fillStyle='#2A2622';ctx.fillRect(p[0]-1.4,p[1]-12,2.8,3.4);ctx.fillStyle='rgba(255,190,90,0.95)';ctx.fillRect(p[0]-0.8,p[1]-11.4,1.6,2.2);ctx.fillStyle='rgba(255,170,80,0.18)';ctx.beginPath();ctx.ellipse(p[0],p[1]-10,7,5,0,0,6.3);ctx.fill();}

/* shadows that follow the real shape: a building can return volumes {pts: ground points (screen), h: height in tile units};
   the cast shadow is the union of each volume swept along the sun. null = keep the old box shadow. */
function shShape(b){if(b.t==='mine'&&MINE_OPT===1){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),L=Math.min(5,b.lvl||1),ring=(ca,cc,ra,rc,n)=>{const r=[];for(let m=0;m<n;m++){const t2=m/n*6.283;r.push(f(ca+Math.cos(t2)*ra,cc+Math.sin(t2)*rc,0));}return r;},V=[];
    V.push({pts:ring(-0.12,-0.42,0.82,0.53,16),h:0.35},{pts:ring(-0.12,-0.42,0.5,0.32,14),h:0.75});
    V.push({pts:ring(-0.2,0.55,0.08,0.12,8),h:0.25});V.push({pts:ring(-0.72,0.45,0.18,0.18,8),h:0.25});
    if(L>=3)V.push({pts:[f(0.32,0.06,0),f(0.78,0.06,0),f(0.78,0.36,0),f(0.32,0.36,0)],h:0.42});return V;}
  return null;}

/* =================== Berry Gatherer options (prototype) — window.__setBerry(n) ===================
   A round hut only, no props outside: 1 wattle walls · 2 dark split-stave walls. Same thatched cone. */
let BERRY_OPT=0;window.__setBerry=n=>{BERRY_OPT=n|0;};
{const _dsB=drawShaped;drawShaped=function(b,win,c0,ax){if(BERRY_OPT&&b.t==='berry'){drawBerryOpt(b,win,BERRY_OPT);return true;}return _dsB(b,win,c0,ax);};}
function berryDims(b){const L=Math.min(5,b.lvl||1);return {L,R:0.4+0.03*(L-1),wh:15+0.8*(L-1),ca:-0.06,cc:-0.06};}
function drawBerryOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*23+opt,{L,R,wh,ca,cc}=berryDims(b),n=48,det=zoom>1.2&&!win;
  const pt=(th,r,h)=>f(ca+Math.cos(th)*r,cc+Math.sin(th)*r,h),vis=th=>Math.cos(th)+Math.sin(th)>-0.05,TH=k=>k/n*6.2832;
  /* stone footing ring of single stones */const fh=2;for(let k=0;k<n;k++){const t0=TH(k),t1=TH(k+1);if(!vis((t0+t1)/2))continue;const tn=h2(sd,k,71);hoQ([pt(t0,R+0.02,0),pt(t1,R+0.02,0),pt(t1,R+0.02,fh),pt(t0,R+0.02,fh)],win?'#C4C6C2':tn>0.6?'#8F8C84':tn>0.3?'#857F76':'#7A756D');}
  if(!win){ctx.strokeStyle='rgba(40,36,30,0.45)';ctx.lineWidth=0.45;ctx.beginPath();for(let k=0;k<n;k+=2){const t0=TH(k+(k%4?0.5:0));if(!vis(t0))continue;const p=pt(t0,R+0.02,0),q=pt(t0,R+0.02,fh);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
    ctx.fillStyle='rgba(90,110,60,0.45)';for(let k=0;k<6;k++){const p=pt(TH(h2(sd,k,72)*n)*0+0.3+k*0.35,R+0.025,0.4);ctx.fillRect(p[0]-1.2,p[1]-0.4,2.4,0.7);}}
  /* walls: cylinder strips facing the viewer, lit from the left */const W1=opt===1?[176,142,96]:[78,60,46];
  for(let k=0;k<n;k++){const t0=TH(k),t1=TH(k+1),tm=(t0+t1)/2;if(!vis(tm))continue;const lit=0.78+0.22*Math.cos(tm-2.2);const col=win?'#D8D2C6':`rgb(${W1.map(v=>Math.round(v*lit)).join(',')})`;hoQ([pt(t0,R,fh),pt(t1,R,fh),pt(t1,R,wh),pt(t0,R,wh)],col);}
  if(opt===1){/* wattle: upright stakes, rods woven in and out between them */ctx.lineWidth=0.5;for(let k=0;k<n;k+=3){const t0=TH(k);if(!vis(t0))continue;hoLine(pt(t0,R+0.004,fh),pt(t0,R+0.004,wh),'rgba(60,40,24,0.55)',0.6);}
    if(det||zoom>0.9){for(let h=fh+1.1;h<wh-0.5;h+=1.3){const row=Math.round(h*10);ctx.strokeStyle=row%2?'rgba(90,62,36,0.5)':'rgba(240,220,180,0.28)';ctx.beginPath();for(let k=0;k<n;k+=3){const t0=TH(k+(row%2?1.5:0)),t1=TH(k+(row%2?1.5:0)+1.5);if(!vis(t0)||!vis(t1))continue;const p=pt(t0,R+0.005,h),q=pt(t1,R+0.005,h+0.35);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();}}}
  else{/* split staves with dark seams, a rail near the top */ctx.strokeStyle='rgba(20,14,10,0.6)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=0;k<n;k++){const t0=TH(k);if(!vis(t0))continue;const p=pt(t0,R+0.003,fh),q=pt(t0,R+0.003,wh);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
    ctx.strokeStyle='#3A2A1C';ctx.lineWidth=1;ctx.beginPath();let first=true;for(let k=0;k<=n;k++){const t0=TH(k);if(!vis(t0)){first=true;continue;}const p=pt(t0,R+0.006,wh-2.2);if(first){ctx.moveTo(p[0],p[1]);first=false;}else ctx.lineTo(p[0],p[1]);}ctx.stroke();
    if(det){ctx.fillStyle='rgba(255,240,210,0.07)';for(let k=0;k<n;k+=2){const t0=TH(k+0.5);if(!vis(t0))continue;const p=pt(t0,R+0.004,fh+1);ctx.fillRect(p[0]-0.4,p[1]-(wh-fh-2),0.8,wh-fh-3);}}}
  /* door facing the viewer: frame posts, arched lintel, planks, iron straps, ring, a flat stone step */
  {const td=Math.PI/4-0.15,dw=0.11,dh=7.5+0.3*(L-1),Dp=(s,h)=>{const th=td+s/R;return pt(th,R+0.012,h);};
    const st=pt(td,R+0.11,0);ctx.fillStyle=win?'#E2E4E0':'#8E877B';ctx.beginPath();ctx.ellipse(st[0],st[1],5.2,2.2,0,0,6.3);ctx.fill();ctx.fillStyle='rgba(255,250,235,0.18)';ctx.beginPath();ctx.ellipse(st[0]-0.8,st[1]-0.5,3,1,0,0,6.3);ctx.fill();
    const D=[];for(let i=0;i<=8;i++){const s=-dw+2*dw*i/8;D.push(Dp(s,fh));}for(let i=8;i>=0;i--){const s=-dw+2*dw*i/8,u=s/dw;D.push(Dp(s,fh+dh+1.6*Math.sqrt(Math.max(0,1-u*u))));}
    hoQ(D,'#5A3E2A');ctx.strokeStyle='rgba(20,12,6,0.5)';ctx.lineWidth=0.45;ctx.beginPath();for(let i=1;i<4;i++){const s=-dw+2*dw*i/4,u=s/dw,p=Dp(s,fh),q=Dp(s,fh+dh+1.6*Math.sqrt(1-u*u));ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
    for(const hh of [fh+2,fh+dh-1.5]){ctx.strokeStyle='#2A2622';ctx.lineWidth=0.7;ctx.beginPath();for(let i=0;i<=6;i++){const s=-dw+0.01+(2*dw-0.05)*i/6,p=Dp(s,hh);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();}
    {const r=Dp(dw*0.55,fh+dh*0.5);ctx.strokeStyle='#2A2622';ctx.lineWidth=0.6;ctx.beginPath();ctx.arc(r[0],r[1]+0.8,0.9,0,6.3);ctx.stroke();}
    const fc=L>=5?'#7A5A3C':'#4A3424';for(const s of [-dw-0.018,dw+0.018]){const p=Dp(s,fh),q=Dp(s,fh+dh);hoLine(p,q,fc,1.3);}
    ctx.strokeStyle=fc;ctx.lineWidth=1.3;ctx.beginPath();for(let i=0;i<=10;i++){const s=-dw-0.018+(2*dw+0.036)*i/10,u=s/(dw+0.018),p=Dp(s,fh+dh+0.2+1.9*Math.sqrt(Math.max(0,1-u*u)));i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();
    if(L>=5){/* carved gold interlace on the arch */ctx.strokeStyle='rgba(214,170,80,0.85)';ctx.lineWidth=0.5;ctx.beginPath();for(let i=0;i<=10;i++){const s=-dw+2*dw*i/10,u=s/dw,p=Dp(s,fh+dh+0.9+1.9*Math.sqrt(Math.max(0,1-u*u))+(i%2?0.5:-0.3));i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();}}
  /* small lattice window that glows (L3+), shutters in red */if(L>=3){const tw=Math.PI/4+0.75,ww=0.05,Wp=(s,h)=>pt(tw+s/R,R+0.012,h),h1=fh+3.6,h2b=fh+6.4;hoQ([Wp(-ww,h1),Wp(ww,h1),Wp(ww,h2b),Wp(-ww,h2b)],win?'#3A3020':'#E8B860');
    ctx.strokeStyle='#3A2A1C';ctx.lineWidth=0.4;ctx.beginPath();{const a=Wp(0,h1),c2=Wp(0,h2b),m1=Wp(-ww,(h1+h2b)/2),m2=Wp(ww,(h1+h2b)/2);ctx.moveTo(a[0],a[1]);ctx.lineTo(c2[0],c2[1]);ctx.moveTo(m1[0],m1[1]);ctx.lineTo(m2[0],m2[1]);}ctx.stroke();
    for(const s of [-1,1])hoQ([Wp(s*ww,h1-0.2),Wp(s*(ww+0.045),h1-0.2),Wp(s*(ww+0.045),h2b+0.2),Wp(s*ww,h2b+0.2)],'#8E3B2F');hoLine(Wp(-ww-0.05,h1-0.4),Wp(ww+0.05,h1-0.4),'#4A3424',0.8);}
  /* thatched cone with a slight bell: eave ring, a middle ring pulled in, apex; facets lit from the left */
  const Rr=R+0.08,he=wh+1.5,Rm=R*0.5,hm=wh+17+0.6*L,ht=wh+30+1.2*L,thick=2.6,TC=win?[238,241,240]:[196,160,92];
  {const all=[];for(let k=0;k<n;k++){all.push(pt(TH(k),Rr,he));all.push(pt(TH(k),Rr,he-thick));}all.push(pt(0,0,ht));const hull=shHull(all);ctx.fillStyle=`rgb(${TC.map(v=>Math.round(v*0.7)).join(',')})`;ctx.beginPath();ctx.moveTo(hull[0][0],hull[0][1]);for(const p of hull)ctx.lineTo(p[0],p[1]);ctx.closePath();ctx.fill();}
  /* eave edge: the thick cut edge of the thatch, ragged at the bottom */for(let k=0;k<n;k++){const t0=TH(k),t1=TH(k+1),tm=(t0+t1)/2;if(!vis(tm))continue;const lit=0.62+0.18*Math.cos(tm-2.2),rag=h2(sd,k,73)*0.8;hoQ([pt(t0,Rr,he),pt(t1,Rr,he),pt(t1,Rr,he-thick-rag),pt(t0,Rr,he-thick-(h2(sd,k-1,73)*0.8))],`rgb(${TC.map(v=>Math.round(v*lit)).join(',')})`);}
  const apex=pt(0,0,ht);for(let k=0;k<n;k++){const t0=TH(k),t1=TH(k+1),tm=(t0+t1)/2;if(Math.cos(tm)+Math.sin(tm)<-0.9)continue;const lit=0.8+0.25*Math.cos(tm-2.2);
    hoQ([pt(t0,Rr,he),pt(t1,Rr,he),pt(t1,Rm,hm),pt(t0,Rm,hm)],`rgb(${TC.map(v=>Math.min(255,Math.round(v*lit))).join(',')})`);hoQ([pt(t0,Rm,hm),pt(t1,Rm,hm),apex],`rgb(${TC.map(v=>Math.min(255,Math.round(v*lit*1.04))).join(',')})`);}
  if(!win){/* courses: two ragged steps where one layer of straw laps over the next */for(const [rr,hh] of [[Rr-0.11,he+3.2],[Rm+0.08,hm-1.6]]){ctx.strokeStyle=`rgba(110,80,40,0.55)`;ctx.lineWidth=0.6;ctx.beginPath();let first=true;for(let k=0;k<=n;k++){const t0=TH(k);if(Math.cos(t0)+Math.sin(t0)<-0.2){first=true;continue;}const p=pt(t0,rr,hh+(h2(sd,k,74)-0.5)*0.6);if(first){ctx.moveTo(p[0],p[1]);first=false;}else ctx.lineTo(p[0],p[1]);}ctx.stroke();}
    /* straw strands, fine, toward the apex */if(det){ctx.lineWidth=0.4;for(let k=0;k<n*2;k++){const t0=TH(k/2+h2(sd,k,75)*0.4);if(Math.cos(t0)+Math.sin(t0)<-0.3)continue;const u=0.15+h2(sd,k,76)*0.5,p=lerp(pt(t0,Rr,he),pt(t0,Rm,hm),u*0.9),q=lerp(pt(t0,Rr,he),pt(t0,Rm,hm),Math.min(1,u*0.9+0.22));ctx.strokeStyle=h2(sd,k,77)>0.5?'rgba(240,215,150,0.45)':'rgba(120,88,44,0.4)';ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();}}
    /* hazel rods pinning the eave course */ctx.strokeStyle='rgba(90,64,36,0.75)';ctx.lineWidth=0.6;ctx.beginPath();let first=true;for(let k=0;k<=n;k++){const t0=TH(k);if(!vis(t0)){first=true;continue;}const p=pt(t0,Rr-0.03,he+1.1);if(first){ctx.moveTo(p[0],p[1]);first=false;}else ctx.lineTo(p[0],p[1]);}ctx.stroke();}
  /* crown: a tied bundle of straw at the top with a rope band (no cap, no smoke hole) */
  {const c0=pt(0,0,ht-1.5);ctx.fillStyle=win?'#E8ECEC':'#B8924E';ctx.beginPath();ctx.moveTo(c0[0]-2.6,c0[1]+1);ctx.quadraticCurveTo(c0[0]-1.4,c0[1]-3,c0[0]-0.6,c0[1]-6);ctx.lineTo(c0[0]+0.6,c0[1]-6);ctx.quadraticCurveTo(c0[0]+1.4,c0[1]-3,c0[0]+2.6,c0[1]+1);ctx.closePath();ctx.fill();
    ctx.fillStyle=win?'#DDE2E2':'#D2AE68';ctx.beginPath();ctx.moveTo(c0[0]-0.6,c0[1]-6);ctx.lineTo(c0[0]-1.8,c0[1]-8.2);ctx.lineTo(c0[0],c0[1]-7);ctx.lineTo(c0[0]+1.8,c0[1]-8.2);ctx.lineTo(c0[0]+0.6,c0[1]-6);ctx.closePath();ctx.fill();
    hoLine([c0[0]-1.5,c0[1]-2.6],[c0[0]+1.5,c0[1]-2.6],'#6E5038',0.9);hoLine([c0[0]-1.1,c0[1]-4],[c0[0]+1.1,c0[1]-4],'#6E5038',0.7);}
  if(L>=5&&!win){/* rope net over the thatch with stone weights at the eave (Norse way of holding the straw down) */ctx.strokeStyle='rgba(80,60,36,0.6)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=0;k<n;k+=6){const t0=TH(k);if(Math.cos(t0)+Math.sin(t0)<-0.3)continue;const p=pt(t0,Rr-0.02,he+0.3),q=pt(t0,Rm,hm),r=pt(0,0,ht-2);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.lineTo(r[0],r[1]);}ctx.stroke();
    for(let k=0;k<n;k+=6){const t0=TH(k);if(!vis(t0))continue;const p=pt(t0,Rr+0.01,he-thick-1.5);ctx.fillStyle='#7E776C';ctx.beginPath();ctx.ellipse(p[0],p[1],1.5,1.2,0,0,6.3);ctx.fill();hoLine([p[0],p[1]-1.2],[p[0],p[1]-3.2],'rgba(80,60,36,0.7)',0.5);}}}
{const _shB=shShape;shShape=function(b){if(b.t==='berry'&&BERRY_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),{L,R,wh,ca,cc}=berryDims(b),ring=(r,n)=>{const o=[];for(let m=0;m<n;m++){const t2=m/n*6.283;o.push(f(ca+Math.cos(t2)*r,cc+Math.sin(t2)*r,0));}return o;};
  return [{pts:ring(R+0.08,18),h:(wh+2)/26},{pts:ring(R*0.5,14),h:(wh+17)/26},{pts:ring(0.05,6),h:(wh+30+1.2*L)/26}];}return _shB(b);};}

/* =================== Fisher's Hut options (prototype) — window.__setFish(n) ===================
   1: plank hut raised on stilts with a short plank jetty to its door, a stockfish rack, a real-size færing on log rollers */
let FISH_OPT=0;window.__setFish=n=>{FISH_OPT=n|0;};
{const _dsF=drawShaped;drawShaped=function(b,win,c0,ax){if(FISH_OPT&&b.t==='fish'){drawFishOpt(b,win,FISH_OPT);return true;}return _dsF(b,win,c0,ax);};}
function fishDims(b){const L=Math.min(5,b.lvl||1);return {L,hl:L>=5?0.44:0.38,hw:0.27,ha:-0.42,hc:-0.12,ST:6};}
function hoStilts(f,a0,a1,c0,c1,h,win){/* posts under a raised floor, cross braces on the visible sides, a sill beam on top */const col=win?'#B8B2A6':'#4A3A2C',colL='#5E4A38';
  const xs=[];for(let k=0;k<=3;k++)xs.push(a0+(a1-a0)*k/3);
  for(const a of xs)hoQ([f(a-0.018,c1,0),f(a+0.018,c1,0),f(a+0.018,c1,h),f(a-0.018,c1,h)],colL);for(const c of [c0,(c0+c1)/2])hoQ([f(a1,c-0.018,0),f(a1,c+0.018,0),f(a1,c+0.018,h),f(a1,c-0.018,h)],col);
  for(let k=0;k<3;k++){hoLine(f(xs[k],c1,0.6),f(xs[k+1],c1,h-0.6),col,0.6);}hoLine(f(a1,c0,0.6),f(a1,c1,h-0.6),col,0.6);
  hoQ([f(a0,c1,h-1.2),f(a1,c1,h-1.2),f(a1,c1,h),f(a0,c1,h)],'#6E5038');hoQ([f(a1,c0,h-1.2),f(a1,c1,h-1.2),f(a1,c1,h),f(a1,c0,h)],'#5A4230');}
function hoFaering(f,a,c,bl,bw,win,sd){/* clinker-built Norse rowing boat: pointed both ends, rising sheer, curved stem posts, three strakes, two thwarts, oars inside */
  const n=16,P=(u,s,h)=>f(a+u*bl,c+s*bw,h),W=u=>Math.pow(Math.max(0,1-u*u),0.62),G=u=>5.2+2.6*u*u,K=u=>1.1+1.6*u*u;
  /* far gunwale and inside */const inner=[],far=[],near=[];for(let i=0;i<=n;i++){const u=-1+2*i/n;far.push(P(u,-W(u),G(u)));near.push(P(u,W(u),G(u)));}
  hoQ(far.concat(near.slice().reverse()),win?'#9A9690':'#3A2C20');
  {const fl=[];for(let i=0;i<=n;i++){const u=-0.85+1.7*i/n;fl.push(P(u,-W(u)*0.45,K(u)+0.9));}for(let i=n;i>=0;i--){const u=-0.85+1.7*i/n;fl.push(P(u,W(u)*0.45,K(u)+0.9));}hoQ(fl,win?'#B8B2A6':'#5A4430');}
  /* inner face of the far side planks */{const q=[];for(let i=0;i<=n;i++){const u=-1+2*i/n;q.push(P(u,-W(u),G(u)));}for(let i=n;i>=0;i--){const u=-0.85+1.7*i/n*1;const uu=-1+2*i/n;q.push(P(uu*0.9,-W(uu)*0.5,K(uu)+1));}hoQ(q,win?'#C4BEB2':'#6E5440');}
  /* thwarts and oars */for(const u of [-0.25,0.3])hoQ([P(u-0.05,-W(u)*0.95,G(u)-0.8),P(u+0.05,-W(u)*0.95,G(u)-0.8),P(u+0.05,W(u)*0.95,G(u)-0.8),P(u-0.05,W(u)*0.95,G(u)-0.8)],'#8A6A4A');
  hoLine(P(-0.7,-0.15,G(0)-1.5),P(0.75,0.05,G(0)-1.2),'#A88A62',0.9);hoLine(P(-0.65,0.1,G(0)-1.6),P(0.8,0.25,G(0)-1.3),'#A88A62',0.9);
  /* near side: strakes from the keel up to the gunwale, each overlapping the one below */const strk=[[0,0.36,'#6E5038'],[0.36,0.7,'#7A5A3C'],[0.7,1,'#86664A']];
  for(const [s0,s1,col] of strk){const q=[];for(let i=0;i<=n;i++){const u=-1+2*i/n,w=W(u),hk=K(u),hg=G(u);q.push(P(u,w*(0.35+0.65*s0),hk+(hg-hk)*s0));}for(let i=n;i>=0;i--){const u=-1+2*i/n,w=W(u),hk=K(u),hg=G(u);q.push(P(u,w*(0.35+0.65*s1),hk+(hg-hk)*s1));}hoQ(q,win?'#D2CCC0':col);
    ctx.strokeStyle='rgba(30,20,12,0.55)';ctx.lineWidth=0.5;ctx.beginPath();for(let i=0;i<=n;i++){const u=-1+2*i/n,w=W(u),hk=K(u),hg=G(u),p=P(u,w*(0.35+0.65*s1),hk+(hg-hk)*s1);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();}
  if(zoom>1.2&&!win){ctx.fillStyle='rgba(30,26,22,0.6)';for(let i=2;i<n-1;i+=2){const u=-1+2*i/n,p=P(u,W(u)*0.83,K(u)+(G(u)-K(u))*0.7);ctx.fillRect(p[0]-0.35,p[1]-0.35,0.7,0.7);}}
  /* gunwale rail */ctx.strokeStyle='#4A3424';ctx.lineWidth=1;ctx.beginPath();near.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
  /* stem and stern posts curling up */for(const e of [-1,1]){const b0=P(e*0.98,0,G(1)-0.5),b1=P(e*1.08,0,G(1)+2.6),b2=P(e*1.06,0,G(1)+4.6);ctx.strokeStyle='#5A4230';ctx.lineWidth=1.6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(b0[0],b0[1]);ctx.quadraticCurveTo(b1[0],b1[1],b2[0],b2[1]);ctx.stroke();}}
function hoStockfish(f,a0,a1,c,hr,pairs,win){/* drying rack: posts, a rail, split cod hung in pairs over it */const P=(a,h)=>f(a,c,h);
  for(const a of [a0,(a0+a1)/2,a1]){const p=P(a,0),q=P(a,hr+1.5);hoQ([[p[0]-0.7,p[1]],[p[0]+0.7,p[1]],[q[0]+0.7,q[1]],[q[0]-0.7,q[1]]],'#5A4230');}
  for(const a of [a0,a1]){hoLine(P(a,hr+1.5),f(a,c-0.12,0),'#4A3424',0.7);}
  hoLine(P(a0-0.03,hr),P(a1+0.03,hr),'#6E5038',1.3);
  for(let i=0;i<pairs;i++){const a=a0+0.05+(a1-a0-0.1)*i/Math.max(1,pairs-1),top=P(a,hr);for(const s of [-1,1]){const x=top[0]+s*1.3,y=top[1]+0.6;ctx.fillStyle=win?'#E8E4DA':(i%3?'#C9B898':'#B8A684');ctx.beginPath();ctx.moveTo(x-0.5,y);ctx.lineTo(x+0.5,y);ctx.quadraticCurveTo(x+1.5*s+0.3,y+3,x+0.9,y+6.2);ctx.lineTo(x-0.9,y+6.2);ctx.quadraticCurveTo(x-1.2,y+3,x-0.5,y);ctx.fill();
      ctx.fillStyle='rgba(90,70,50,0.45)';ctx.fillRect(x-0.25,y+1,0.5,4.6);}hoLine([top[0]-1.3,top[1]+0.4],[top[0]+1.3,top[1]+0.4],'rgba(200,180,140,0.8)',0.4);}}
function drawFishOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*19+opt,{L,hl,hw,ha,hc,ST}=fishDims(b),J=WOOD_SET[2];
  /* stockfish rack behind, on the right */hoStockfish(f,0.12,0.88,-0.3,12,L>=3?7:5,win);if(L>=3)hoStockfish(f,0.3,0.88,-0.08,10,4,win);
  /* the hut, raised on stilts */const fw=(a,c,h)=>f(a+ha,c+hc,h);
  const g={sd,hl,hw,fh:ST,wh:ST+13,rh:10,ov:0.05,th:1.6,wt:'planks',wall:'#8A7C6A',wallD:'#6E6252',roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:'scale',frame:true,frameCol:'#3A2E24',k:1,v:1};
  const r=hoRoof(fw,g,win);r.back();hoStilts(fw,-hl,hl,-hw,hw,ST,win);hoWalls(fw,g,win);r.end();
  hoDoor(fw,g,'G',0,0.15,8,{col:'#4A3424'});if(L>=3)hoWindow(fw,g,'L',-0.12,0.09,ST+3.5,ST+6.8,{shutters:'#2E4A5E'});
  r.front();r.ridge();hoBarge(fw,g,'#4A3424',0.25,L>=5);
  /* plank jetty from the door, on piles */{const j0=ha+hl,j1=0.98,jc=hc,jw=0.11;for(let a=j0+0.12;a<=j1;a+=0.2){for(const s of [-1,1]){const p=f(a,jc+s*jw,0),q=f(a,jc+s*jw,ST);if(s>0)hoQ([[p[0]-0.8,p[1]],[p[0]+0.8,p[1]],[q[0]+0.8,q[1]],[q[0]-0.8,q[1]]],'#4A3A2C');}}
    for(let a=j0;a<j1;a+=0.045){const t2=h2(sd,a*100|0,81);hoQ([f(a+0.003,jc-jw,ST),f(a+0.04,jc-jw,ST),f(a+0.04,jc+jw,ST),f(a+0.003,jc+jw,ST)],win?'#E4E6E2':t2>0.5?'#9A8268':'#8A735A');}
    hoQ([f(j0,jc+jw,ST-1.2),f(j1,jc+jw,ST-1.2),f(j1,jc+jw,ST),f(j0,jc+jw,ST)],'#5E4A38');hoQ([f(j1,jc-jw,ST-1.2),f(j1,jc+jw,ST-1.2),f(j1,jc+jw,ST),f(j1,jc-jw,ST)],'#4A3A2C');
    /* mooring post at the end, a net drying over the rail from L5, a lantern from L5 */{const p=f(j1-0.02,jc+jw,ST),q=f(j1-0.02,jc+jw,ST+5);hoQ([[p[0]-0.9,p[1]],[p[0]+0.9,p[1]],[q[0]+0.9,q[1]],[q[0]-0.9,q[1]]],'#5A4230');}
    if(L>=5){ctx.strokeStyle='rgba(60,50,40,0.55)';ctx.lineWidth=0.4;ctx.beginPath();for(let k=0;k<7;k++){const p=f(j0+0.15+k*0.04,jc+jw,ST),q=f(j0+0.15+k*0.04,jc+jw,ST-4.5);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}for(let h=1;h<4.5;h+=1.1){const p=f(j0+0.15,jc+jw,ST-h),q=f(j0+0.39,jc+jw,ST-h);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();hoLamp(f(j1-0.02,jc-jw,ST));}}
  /* færing pulled up on two log rollers in front: length about the hut's, width a quarter of that */
  const ba=0.1,bc=0.36,bl=0.4,bw=0.105;for(const u of [-0.5,0.5]){const p=f(ba+u*bl,bc-0.16,0.9),q=f(ba+u*bl,bc+0.16,0.9);hoLine(p,q,'#6E5038',2.2);}
  hoFaering(f,ba,bc,bl,bw,win,sd);}
{const _shF=shShape;shShape=function(b){if(b.t==='fish'&&FISH_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),{hl,hw,ha,hc,ST}=fishDims(b),box=(a0,a1,c0,c1)=>[f(a0,c0,0),f(a1,c0,0),f(a1,c1,0),f(a0,c1,0)];
  return [{pts:box(ha-hl,ha+hl,hc-hw,hc+hw),h:(ST+17)/26},{pts:box(ha-hl*0.6,ha+hl*0.6,hc-0.05,hc+0.05),h:(ST+23)/26},{pts:box(0.12,0.88,-0.32,-0.28),h:0.45},{pts:box(-0.28,0.52,0.22,0.38),h:0.22}];}return _shF(b);};}

/* =================== Preserver options (prototype) — window.__setPres(n) ===================
   3: jam workshop — plank house with an open porch in front: shelves of sealed clay crocks, a copper kettle on a stone hearth, a work table */
let PRES_OPT=0;window.__setPres=n=>{PRES_OPT=n|0;};
{const _dsP=drawShaped;drawShaped=function(b,win,c0,ax){if(PRES_OPT&&b.t==='pres'){drawPresOpt(b,win,PRES_OPT);return true;}return _dsP(b,win,c0,ax);};}
function presDims(b){const L=Math.min(5,b.lvl||1);return {L,hl:L>=5?0.66:0.56,hw:0.3,ha:-0.08,hc:-0.4,pd:0.5};}
function hoCrock(p,s,cap,win){/* clay crock with a cloth cover tied with string */s=s||1;const w=2.1*s,h=3.6*s;ctx.fillStyle=win?'#D8D2C6':'#9A6A40';ctx.beginPath();ctx.moveTo(p[0]-w*0.8,p[1]);ctx.quadraticCurveTo(p[0]-w*1.15,p[1]-h*0.55,p[0]-w*0.75,p[1]-h);ctx.lineTo(p[0]+w*0.75,p[1]-h);ctx.quadraticCurveTo(p[0]+w*1.15,p[1]-h*0.55,p[0]+w*0.8,p[1]);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(255,230,190,0.22)';ctx.fillRect(p[0]-w*0.6,p[1]-h*0.85,w*0.35,h*0.6);ctx.fillStyle=cap||'#C9B49A';ctx.beginPath();ctx.ellipse(p[0],p[1]-h,w*0.85,w*0.38,0,0,6.3);ctx.fill();ctx.fillRect(p[0]-w*0.85,p[1]-h,w*1.7,0.9*s);hoLine([p[0]-w*0.8,p[1]-h+1*s],[p[0]+w*0.8,p[1]-h+1*s],'#6E5038',0.4);}
function drawPresOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*17+opt,{L,hl,hw,ha,hc,pd}=presDims(b),J=WOOD_SET[4];
  const fw=(a,c,h)=>f(a+ha,c+hc,h),g={sd,hl,hw,fh:2.2,wh:13,rh:11,ov:0.06,th:1.6,wt:'planks',wall:'#8A6A48',wallD:'#6E5438',roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,frame:true,frameCol:'#3A2A1C',k:1,v:1};
  const r=hoRoof(fw,g,win);r.back();hoFooting(fw,g,win);hoWalls(fw,g,win);r.end();
  hoDoor(fw,g,'L',-hl+0.16,0.15,8.5,{col:'#4A3424'});hoWindow(fw,g,'G',0,0.09,g.fh+5,g.fh+8,{shutters:'#7A3A2C'});
  r.front();r.ridge();hoBarge(fw,g,'#4A3424',0.25,L>=5);
  /* porch floor of planks */const pc0=hw,pc1=hw+pd;for(let a=-hl;a<hl;a+=0.06){hoQ([fw(a+0.003,pc0,0.6),fw(a+0.057,pc0,0.6),fw(a+0.057,pc1,0.6),fw(a+0.003,pc1,0.6)],win?'#E4E6E2':h2(sd,a*100|0,92)>0.5?'#8A7258':'#7E674E');}
  hoQ([fw(-hl,pc1,0),fw(hl,pc1,0),fw(hl,pc1,0.6),fw(-hl,pc1,0.6)],'#5E4A38');hoQ([fw(hl,pc0,0),fw(hl,pc1,0),fw(hl,pc1,0.6),fw(hl,pc0,0.6)],'#4A3A2C');
  /* stone hearth with a copper kettle of jam, a little steam (not smoke) */const ka=-hl+0.2,kc=hw+0.3;{const P=(da,dc,h)=>fw(ka+da,kc+dc,h);hoStoneBox((a,c,h)=>fw(a,c,h),ka,kc,0.11,0.1,0.6,4.2,win,sd);hoQ([P(-0.11,-0.1,4.2),P(0.11,-0.1,4.2),P(0.11,0.1,4.2),P(-0.11,0.1,4.2)],win?'#D8DAD6':'#9C978D');
    const m=P(0,0,4.2);ctx.fillStyle='rgba(255,140,60,0.75)';ctx.beginPath();ctx.ellipse(m[0],m[1]+0.5,3.6,1.6,0,0,6.3);ctx.fill();
    const k0=P(0,0,5);ctx.fillStyle='#8A4A28';ctx.beginPath();ctx.ellipse(k0[0],k0[1],4.4,2.1,0,0,3.14);ctx.lineTo(k0[0]-4.4,k0[1]-3.6);ctx.ellipse(k0[0],k0[1]-3.6,4.4,2.1,0,3.14,0,true);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(255,200,150,0.3)';ctx.fillRect(k0[0]-3.4,k0[1]-3.2,1.2,3.4);
    ctx.fillStyle='#B8703A';ctx.beginPath();ctx.ellipse(k0[0],k0[1]-3.6,4.4,2.1,0,0,6.3);ctx.fill();ctx.fillStyle='#5A1E2A';ctx.beginPath();ctx.ellipse(k0[0],k0[1]-3.6,3.5,1.6,0,0,6.3);ctx.fill();ctx.fillStyle='rgba(200,80,100,0.5)';ctx.beginPath();ctx.ellipse(k0[0]-0.8,k0[1]-3.9,1.2,0.5,0,0,6.3);ctx.fill();
    hoLine([k0[0]+1,k0[1]-4],[k0[0]+4.5,k0[1]-9],'#6E5038',0.7);
    if(typeof t==='number'&&!win){for(let k=0;k<2;k++){const q=((t*0.3+k/2)%1);ctx.fillStyle=`rgba(240,240,235,${0.35*(1-q)})`;ctx.beginPath();ctx.ellipse(k0[0]+Math.sin(q*6+k)*1.5,k0[1]-6-q*10,1.6+q*2.5,1.1+q*1.5,0,0,6.3);ctx.fill();}}}
  /* work table with a crock being filled, a ladle */{const ta=L>=5?0.15:0.05,tc=hw+0.14,P=(da,dc,h)=>fw(ta+da,tc+dc,h);for(const q of [[-0.15,-0.07],[0.15,-0.07],[-0.15,0.07],[0.15,0.07]]){const p=P(q[0],q[1],0.6),u=P(q[0],q[1],5);hoQ([[p[0]-0.6,p[1]],[p[0]+0.6,p[1]],[u[0]+0.6,u[1]],[u[0]-0.6,u[1]]],q[1]>0?'#5A4230':'#4A3424');}
    hoQ([P(-0.17,-0.09,5),P(0.17,-0.09,5),P(0.17,0.09,5),P(-0.17,0.09,5)],'#A88A62');hoQ([P(-0.17,0.09,4.2),P(0.17,0.09,4.2),P(0.17,0.09,5),P(-0.17,0.09,5)],'#7A5A3C');hoQ([P(0.17,-0.09,4.2),P(0.17,0.09,4.2),P(0.17,0.09,5),P(0.17,-0.09,5)],'#5E4430');
    hoCrock(P(-0.07,0,5),0.8,'#5A1E2A',win);hoCrock(P(0.05,-0.02,5),0.7,'#C9B49A',win);hoCrock(P(0.11,0.03,5),0.7,'#8E3B3B',win);}
  if(L>=5){/* second kettle */const P=(da,dc,h)=>fw(hl-0.18+da,hw+0.3+dc,h);hoStoneBox((a,c,h)=>fw(a,c,h),hl-0.18,hw+0.3,0.09,0.09,0.6,3.6,win,sd+1);const k0=P(0,0,4.2);ctx.fillStyle='#8A4A28';ctx.beginPath();ctx.ellipse(k0[0],k0[1]-1.5,3.4,1.6,0,0,6.3);ctx.fill();ctx.fillStyle='#5A1E2A';ctx.beginPath();ctx.ellipse(k0[0],k0[1]-2,2.6,1.2,0,0,6.3);ctx.fill();}
  /* freestanding shelf rack at the front of the porch, facing the viewer, full of sealed crocks */
  {const caps=['#C9B49A','#8E3B3B','#B8A27E','#6E3A5A'],s0=-hl+0.42,s1=L>=3?hl-0.08:0.25,rc=pc1-0.1;
    hoQ([fw(s0,rc-0.05,0.6),fw(s1,rc-0.05,0.6),fw(s1,rc-0.05,8.6),fw(s0,rc-0.05,8.6)],'#5E4632');
    ctx.strokeStyle='rgba(20,14,8,0.4)';ctx.lineWidth=0.4;ctx.beginPath();for(let a2=s0+0.06;a2<s1;a2+=0.06){const p=fw(a2,rc-0.05,0.6),q=fw(a2,rc-0.05,8.6);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
    for(const hs of [1.0,4.0,7.0]){hoQ([fw(s0,rc-0.05,hs),fw(s1,rc-0.05,hs),fw(s1,rc+0.03,hs),fw(s0,rc+0.03,hs)],'#A88A62');hoQ([fw(s0,rc+0.03,hs-0.8),fw(s1,rc+0.03,hs-0.8),fw(s1,rc+0.03,hs),fw(s0,rc+0.03,hs)],'#6E5038');
      const n=Math.max(3,Math.round((s1-s0)/0.09));for(let i=0;i<n;i++){const a2=s0+0.04+i*(s1-s0-0.08)/(n-1);hoCrock(fw(a2,rc-0.01,hs),0.78+0.1*h2(sd,i+hs*10,91),caps[(i+(hs|0))%4],win);}}
    for(const a2 of [s0,s1])hoQ([fw(a2-0.014,rc+0.03,0.6),fw(a2+0.014,rc+0.03,0.6),fw(a2+0.014,rc+0.03,8.6),fw(a2-0.014,rc+0.03,8.6)],'#4A3424');
    hoQ([fw(s1,rc-0.05,0.6),fw(s1,rc+0.03,0.6),fw(s1,rc+0.03,8.6),fw(s1,rc-0.05,8.6)],'#4A3828');}
  /* porch posts and the lean-to roof rising toward the viewer so the shelves show */const hB=11,hF=15.5;
  for(const a of [-hl,0,hl]){const p=fw(a,pc1,0.6),u=fw(a,pc1,hF);hoQ([[p[0]-0.9,p[1]],[p[0]+0.9,p[1]],[u[0]+0.9,u[1]],[u[0]-0.9,u[1]]],'#4A3424');}hoLine(fw(-hl,pc1,hF),fw(hl,pc1,hF),'#3A2A1C',1.4);
  if(false){/* bundles of herbs hanging under the front beam */for(let i=0;i<6;i++){const p=fw(-hl+0.15+i*(2*hl-0.3)/5,pc1,hF-0.5);hoLine(p,[p[0],p[1]+2.5],'#6E5038',0.4);ctx.fillStyle=i%2?'#6E7A44':'#8A7A4A';ctx.beginPath();ctx.moveTo(p[0]-1.2,p[1]+2.5);ctx.lineTo(p[0]+1.2,p[1]+2.5);ctx.lineTo(p[0],p[1]+6.5);ctx.closePath();ctx.fill();}}
  const R=[fw(-hl-0.05,pc0-0.02,hB),fw(hl+0.05,pc0-0.02,hB),fw(hl+0.05,pc1+0.06,hF+0.8),fw(-hl-0.05,pc1+0.06,hF+0.8)];hoQ(R,win?'#EEF1F0':J.roof);
  if(!win)hoRoofSurface((u,v)=>lerp(lerp(R[3],R[2],u),lerp(R[0],R[1],u),v),{sd:sd+4,rt:J.rt,rh:9,roofD:J.roofD},win);hoQ([R[1],R[2],[R[2][0],R[2][1]+1.3],[R[1][0],R[1][1]+1.3]],shade(J.roofD,0.6));hoLine(R[3],R[2],'rgba(10,8,6,0.5)',0.7);
}
{const _shP=shShape;shShape=function(b){if(b.t==='pres'&&PRES_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),{hl,hw,ha,hc,pd}=presDims(b),box=(a0,a1,c0,c1)=>[f(a0+ha,c0+hc,0),f(a1+ha,c0+hc,0),f(a1+ha,c1+hc,0),f(a0+ha,c1+hc,0)];
  return [{pts:box(-hl,hl,-hw,hw),h:0.55},{pts:box(-hl*0.8,hl*0.8,-0.05,0.05),h:0.95},{pts:box(-hl,hl,hw,hw+pd),h:0.55}];}return _shP(b);};}

/* =================== Smokehouse options (prototype) — window.__setSmoke(n) ===================
   Both: an open drying shed beside it with fish and hams hung to dry before the smoke.
   1 Tall log smoke-tower with a steep pyramid roof and a slatted lantern · 2 A-frame smokehouse, roof down to the ground, smoke from ridge louvres */
let SMOKE_OPT=0;window.__setSmoke=n=>{SMOKE_OPT=n|0;};
{const _dsS=drawShaped;drawShaped=function(b,win,c0,ax){if(SMOKE_OPT&&b.t==='smoke'){drawSmokeOpt(b,win,SMOKE_OPT);return true;}return _dsS(b,win,c0,ax);};}
function hoHam(p,win){ctx.fillStyle=win?'#D8D0C4':'#7A3A26';ctx.beginPath();ctx.moveTo(p[0]-0.5,p[1]+0.8);ctx.quadraticCurveTo(p[0]-2.8,p[1]+3.5,p[0]-1.8,p[1]+6.5);ctx.quadraticCurveTo(p[0],p[1]+8,p[0]+1.8,p[1]+6.5);ctx.quadraticCurveTo(p[0]+2.8,p[1]+3.5,p[0]+0.5,p[1]+0.8);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(255,210,170,0.25)';ctx.beginPath();ctx.ellipse(p[0]-0.9,p[1]+4.5,0.7,1.6,0,0,6.3);ctx.fill();ctx.fillStyle='#E8DCC4';ctx.fillRect(p[0]-0.45,p[1]-0.4,0.9,1.4);hoLine([p[0],p[1]-1.6],[p[0],p[1]-0.3],'rgba(200,180,140,0.9)',0.4);}
function hoSmokedFish(p,s,win){const x=p[0]+s*1.3,y=p[1]+0.6;ctx.fillStyle=win?'#E8E0D0':'#B07A3A';ctx.beginPath();ctx.moveTo(x-0.5,y);ctx.lineTo(x+0.5,y);ctx.quadraticCurveTo(x+1.4*s+0.3,y+3,x+0.9,y+6);ctx.lineTo(x-0.9,y+6);ctx.quadraticCurveTo(x-1.1,y+3,x-0.5,y);ctx.fill();ctx.fillStyle='rgba(60,30,10,0.35)';ctx.fillRect(x-0.25,y+1,0.5,4.4);}
function hoDryShed(f,a0,a1,c0,c1,L,win,sd){/* open drying shed: four posts, a lean-to rising toward the viewer, rails near the open front with fish (and hams from L3) */const hB=9,hF=13.5,J=WOOD_SET[2];
  hoQ([f(a0,c0,0),f(a1,c0,0),f(a1,c1,0),f(a0,c1,0)],'rgba(70,58,44,0.3)');
  for(const q of [[a1,c0,hB]])hoQ([f(q[0]-0.02,q[1],0),f(q[0]+0.02,q[1],0),f(q[0]+0.02,q[1],q[2]),f(q[0]-0.02,q[1],q[2])],'#3A2A1C');
  /* a small smouldering-free hearth of nothing: the drying is in the open air; racks */
  const rails=L>=3?[[c1-0.1,hF-2.5,'fish'],[c1-0.3,hF-3.2,'ham']]:[[c1-0.12,hF-2.5,'fish']];
  for(const [rc,rh,kind] of rails.slice().reverse()){hoLine(f(a0+0.02,rc,rh),f(a1-0.02,rc,rh),'#6E5038',1.2);const n=Math.round((a1-a0)/(kind==='fish'?0.075:0.12));for(let i=0;i<n;i++){const a=a0+0.06+(a1-a0-0.12)*i/Math.max(1,n-1),p=f(a,rc,rh);if(kind==='fish'){hoSmokedFish(p,-1,win);hoSmokedFish(p,1,win);hoLine([p[0]-1.3,p[1]+0.4],[p[0]+1.3,p[1]+0.4],'rgba(200,180,140,0.8)',0.4);}else hoHam(p,win);}}
  for(const q of [[a0,c1,hF],[a1,c1,hF],[a0,c0,hB]])hoQ([f(q[0]-0.02,q[1],0),f(q[0]+0.02,q[1],0),f(q[0]+0.02,q[1],q[2]),f(q[0]-0.02,q[1],q[2])],'#4A3424');
  hoLine(f(a0,c1,hF),f(a1,c1,hF),'#3A2A1C',1.3);
  const R=[f(a0-0.04,c0-0.04,hB+0.5),f(a1+0.04,c0-0.04,hB+0.5),f(a1+0.04,c1+0.05,hF+0.8),f(a0-0.04,c1+0.05,hF+0.8)];hoQ(R,win?'#EEF1F0':J.roof);if(!win)hoRoofSurface((u,v)=>lerp(lerp(R[3],R[2],u),lerp(R[0],R[1],u),v),{sd:sd+4,rt:'scale',rh:12,roofD:J.roofD},win);
  hoQ([R[1],R[2],[R[2][0],R[2][1]+1.3],[R[1][0],R[1][1]+1.3]],'#1E1C1A');hoLine(R[3],R[2],'rgba(10,8,6,0.5)',0.7);}
function smokeDims(b,opt){const L=Math.min(5,b.lvl||1);return opt===1?{L,ha:-0.42,hc:-0.22,s:0.32,wh:24+(L>=5?4:0)}:{L,ha:0.42,hc:-0.12,hl:0.44,hw:0.36,rh:30+(L>=5?3:0)};}
function drawSmokeOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*13+opt,D=smokeDims(b,opt),L=D.L,J=WOOD_SET[2];
  if(opt===1){/* tall log tower */const fw=(a,c,h)=>f(a+D.ha,c+D.hc,h),s=D.s,wh=D.wh,g={sd,hl:s,hw:s,fh:2.4,wh,rh:0,ov:0.06,wt:'logs',wall:'#6E5038',wallD:'#56402C',frame:false,k:1,v:1};
    hoQ([fw(-s,-s,0),fw(s+0.25,-s,0),fw(s+0.25,s+0.25,0),fw(-s,s+0.25,0)],'rgba(30,26,20,0.12)');hoFooting(fw,g,win);hoWalls(fw,g,win);
    /* soot above the vents, slatted smoke vents high on both faces */for(const face of ['L','G']){const P=(x,h)=>face==='L'?fw(x,s+0.004,h):fw(s+0.004,x,h);hoQ([P(-0.09,wh-6),P(0.09,wh-6),P(0.09,wh-2.5),P(-0.09,wh-2.5)],'#1E1A16');for(let h=wh-5.6;h<wh-2.6;h+=0.9)hoLine(P(-0.09,h),P(0.09,h+0.4),'#5A4230',0.6);if(!win){ctx.fillStyle='rgba(30,26,22,0.25)';const p=P(0,wh-2.5);ctx.beginPath();ctx.ellipse(p[0],p[1]-1,3,2,0,0,6.3);ctx.fill();}}
    /* door ajar: the leaf swung in, dark inside with fish hanging in the smoke and a faint glow */{const P=(x,h)=>fw(x,s+0.004,h),dw=0.11,dh=10;hoQ([P(-dw,2.4),P(dw,2.4),P(dw,2.4+dh),P(-dw,2.4+dh)],'#16110D');ctx.fillStyle='rgba(255,140,60,0.25)';{const p=P(0,3.5);ctx.beginPath();ctx.ellipse(p[0],p[1],3.5,1.5,0,0,6.3);ctx.fill();}
      for(let i=0;i<3;i++){const p=P(-dw+0.05+i*0.06,2.4+dh-1.5);hoSmokedFish(p,i%2?1:-1,win);}hoQ([P(-dw,2.4),P(-dw+0.07,2.4),P(-dw+0.07,2.4+dh),P(-dw,2.4+dh)],'#4A3424');
      for(const x of [-dw-0.02,dw+0.02])hoLine(P(x,2.4),P(x,2.4+dh+0.4),'#3A2A1C',1.2);hoLine(P(-dw-0.03,2.4+dh+0.6),P(dw+0.03,2.4+dh+0.6),'#3A2A1C',1.4);
      const st=fw(0,s+0.1,0);ctx.fillStyle=win?'#E2E4E0':'#8E877B';ctx.beginPath();ctx.ellipse(st[0],st[1],4,1.8,0,0,6.3);ctx.fill();}
    /* steep pyramid roof of black scales, slatted lantern, little pyramid cap, smoke */const so=s+0.07,ap=wh+16,pr=hoPyramid(fw,0,0,so,wh-0.5,ap,J.roof,J.roofD,'scale',win,sd);
    const ls=0.085,lb=ap-6;hoBox(fw,0,0,ls,lb,lb+6.5,'#3A2A1C','#2E2016',win);for(const face of [0,1]){for(let h=lb+1;h<lb+6;h+=1.1){const p=face?fw(ls+0.003,-ls,h):fw(-ls,ls+0.003,h),q=face?fw(ls+0.003,ls,h+0.5):fw(ls,ls+0.003,h+0.5);hoLine(p,q,'#7A5A3C',0.6);}}
    hoPyramid(fw,0,0,ls+0.04,lb+6.5,lb+12,J.roof,J.roofD,'scale',win,sd+1);if(L>=5){const tp=fw(0,0,lb+12);hoLine(tp,[tp[0],tp[1]-4],'#4A3424',1);ctx.fillStyle='#C9A24A';ctx.beginPath();ctx.arc(tp[0],tp[1]-4.5,1,0,6.3);ctx.fill();}
    if(typeof t==='number'){for(let k=0;k<4;k++){const q=((t*0.22+k/4)%1),p=fw(0,0,lb+4);ctx.fillStyle=`rgba(225,222,215,${0.45*(1-q)})`;ctx.beginPath();ctx.ellipse(p[0]+q*10+Math.sin(q*5+k)*2,p[1]-q*22,2+q*5,1.5+q*3,0,0,6.3);ctx.fill();}}
    hoDryShed(f,0.06,0.92,-0.62,0.12,L,win,sd);return;}
  /* A-frame: the roof comes down to a low stone footing; plank gable with a door and a slatted vent; smoke from ridge louvres */
  hoDryShed(f,-0.92,-0.08,-0.62,0.12,L,win,sd);
  const fw=(a,c,h)=>f(a+D.ha,c+D.hc,h),g={sd,hl:D.hl,hw:D.hw,fh:2.2,wh:3.2,rh:D.rh,ov:0.05,th:1.8,wt:'planks',wall:'#6E5440',wallD:'#5A4434',roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:'scale',frame:true,frameCol:'#3A2A1C',k:1,v:1};
  hoQ([fw(-g.hl,-g.hw,0),fw(g.hl+0.2,-g.hw,0),fw(g.hl+0.2,g.hw+0.15,0),fw(-g.hl,g.hw+0.15,0)],'rgba(30,26,20,0.12)');
  const r=hoRoof(fw,g,win);r.back();hoFooting(fw,g,win);hoWalls(fw,g,win);r.end();
  /* gable: vertical planks already; a tall door and a slatted vent near the apex, soot stain */{const P=(c,h)=>fw(g.hl+0.004,c,h),dw=0.1,dh=12;hoQ([P(-dw,g.fh),P(dw,g.fh),P(dw,g.fh+dh),P(0,g.fh+dh+3),P(-dw,g.fh+dh)],'#4A3424');ctx.strokeStyle='rgba(20,12,6,0.5)';ctx.lineWidth=0.45;ctx.beginPath();for(const c of [-0.05,0,0.05]){const p=P(c,g.fh),q=P(c,g.fh+dh+(c?1.5:3));ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
    for(const hh of [g.fh+2.5,g.fh+dh-2])hoLine(P(-dw+0.01,hh),P(dw-0.01,hh),'#2A2622',0.8);{const rr=P(dw*0.6,g.fh+dh*0.5);ctx.strokeStyle='#2A2622';ctx.lineWidth=0.6;ctx.beginPath();ctx.arc(rr[0],rr[1]+0.8,0.9,0,6.3);ctx.stroke();}
    for(const c of [-dw-0.02,dw+0.02])hoLine(P(c,g.fh),P(c,g.fh+dh+0.3),'#3A2A1C',1.2);hoLine(P(-dw-0.02,g.fh+dh+0.3),P(0,g.fh+dh+3.4),'#3A2A1C',1.2);hoLine(P(dw+0.02,g.fh+dh+0.3),P(0,g.fh+dh+3.4),'#3A2A1C',1.2);
    const vh=g.wh+g.rh-9;hoQ([P(-0.06,vh),P(0.06,vh),P(0.06,vh+4),P(-0.06,vh+4)],'#1E1A16');for(let h=vh+0.6;h<vh+4;h+=1)hoLine(P(-0.06,h),P(0.06,h+0.4),'#7A5A3C',0.6);if(!win){ctx.fillStyle='rgba(30,26,22,0.3)';const p=P(0,vh+4);ctx.beginPath();ctx.ellipse(p[0],p[1]-1.5,3,2.6,0,0,6.3);ctx.fill();}
    const st=fw(g.hl+0.1,0,0);ctx.fillStyle=win?'#E2E4E0':'#8E877B';ctx.beginPath();ctx.ellipse(st[0],st[1],4.4,1.9,0,0,6.3);ctx.fill();}
  r.front();r.ridge();hoBarge(fw,g,'#4A3424',0.22,L>=5);
  /* two slatted ridge louvres letting the smoke out */for(const a of (L>=3?[-0.2,0.12]:[-0.05]))hoLouvre(fw,g,a,'#3A2A1C');
}
{const _shS=shShape;shShape=function(b){if(b.t==='smoke'&&SMOKE_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),D=smokeDims(b,SMOKE_OPT),box=(a0,a1,c0,c1)=>[f(a0,c0,0),f(a1,c0,0),f(a1,c1,0),f(a0,c1,0)],V=[];
  if(SMOKE_OPT===1){V.push({pts:box(D.ha-D.s,D.ha+D.s,D.hc-D.s,D.hc+D.s),h:D.wh/26},{pts:box(D.ha-0.08,D.ha+0.08,D.hc-0.08,D.hc+0.08),h:(D.wh+28)/26});V.push({pts:box(0.06,0.92,-0.62,0.12),h:0.42});}
  else{V.push({pts:box(D.ha-D.hl,D.ha+D.hl,D.hc-D.hw,D.hc+D.hw),h:0.15},{pts:box(D.ha-D.hl,D.ha+D.hl,D.hc-0.04,D.hc+0.04),h:(D.rh+3)/26});V.push({pts:box(-0.92,-0.08,-0.62,0.12),h:0.42});}return V;}return _shS(b);};}

/* =================== Pig Pen options (prototype) — window.__setPig(n) ===================
   1: woven wattle fence, dark bristly Norse pigs, a low plank sty with black scales, a natural mud wallow; nothing else */
let PIG_OPT=0;window.__setPig=n=>{PIG_OPT=n|0;};
{const _dsG=drawShaped;drawShaped=function(b,win,c0,ax){if(PIG_OPT&&b.t==='pigpen'){drawPigOpt(b,win,PIG_OPT);return true;}return _dsG(b,win,c0,ax);};}
function hoPig(p,d,coat,bob,win,sd){const x=p[0],y=p[1]-bob;ctx.fillStyle='rgba(30,24,18,0.25)';ctx.beginPath();ctx.ellipse(p[0],p[1]+0.6,6.5,2.2,0,0,6.3);ctx.fill();
  const dk=shade(coat,0.7);for(const lx of [-3.6,-1.6,2.2,4]){ctx.fillStyle=lx*d>0?dk:shade(coat,0.55);ctx.fillRect(x+lx*d-0.6,y-2.6,1.2,2.8);}
  /* body, darker belly, bristly ridge along the back */ctx.fillStyle=coat;ctx.beginPath();ctx.ellipse(x,y-4.6,6,3.1,0,0,6.3);ctx.fill();ctx.fillStyle=dk;ctx.beginPath();ctx.ellipse(x,y-3.4,5.2,1.6,0,0,3.14);ctx.fill();
  ctx.fillStyle=shade(coat,1.25);ctx.beginPath();ctx.ellipse(x-d*0.5,y-6.2,3.5,0.9,0,0,6.3);ctx.fill();
  ctx.strokeStyle=shade(coat,0.45);ctx.lineWidth=0.5;ctx.beginPath();for(let k=0;k<7;k++){const xx=x-d*4+d*k*1.3,yy=y-7.5+Math.abs(k-3)*0.25;ctx.moveTo(xx,yy+0.6);ctx.lineTo(xx+d*0.4,yy-0.7);}ctx.stroke();
  /* head with a long snout, pointed ear, eye; curled tail */const hx=x+d*6.2,hy=y-5;ctx.fillStyle=coat;ctx.beginPath();ctx.ellipse(hx,hy,2.6,2.2,0,0,6.3);ctx.fill();ctx.beginPath();ctx.moveTo(hx+d*1.5,hy-1.2);ctx.lineTo(hx+d*4.4,hy+0.2);ctx.lineTo(hx+d*4.4,hy+1.6);ctx.lineTo(hx+d*1.2,hy+1.8);ctx.closePath();ctx.fill();
  ctx.fillStyle=win?'#C9A898':'#9A6A5A';ctx.fillRect(hx+d*4.1-(d>0?0:0.8),hy+0.1,0.8,1.6);ctx.fillStyle=shade(coat,0.55);ctx.beginPath();ctx.moveTo(hx-d*0.6,hy-1.4);ctx.lineTo(hx+d*0.2,hy-4);ctx.lineTo(hx+d*1.2,hy-1.6);ctx.closePath();ctx.fill();
  ctx.fillStyle='#120E0A';ctx.fillRect(hx+d*1.2-0.4,hy-0.8,0.8,0.7);ctx.strokeStyle=dk;ctx.lineWidth=0.6;ctx.beginPath();ctx.arc(x-d*6.3,y-5.6,0.9,0,5);ctx.stroke();}
function hoWattle(f,p0,p1,h,win,sd,gate){/* a run of woven wattle fence between two ground points (frame coords) */const A=f(p0[0],p0[1],0),B=f(p1[0],p1[1],0),At=f(p0[0],p0[1],h),Bt=f(p1[0],p1[1],h);
  hoQ([p0.concat(0),p1.concat(0),p1.concat(h),p0.concat(h)].map(q=>f(q[0],q[1],q[2])),win?'#C9C3B8':'#6E5236');
  const len=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]),n=Math.max(2,Math.round(len/0.22));
  /* rods woven in and out of the stakes: each rod shows as a bulge between two stakes, alternating row by row */
  for(let r=0;r<Math.round(h/1.15);r++){const hh=0.6+r*1.15;for(let k=0;k<n;k++){if((k+r)%2)continue;const u0=k/n,u1=(k+1)/n,p=lerp(f(p0[0],p0[1],hh),f(p1[0],p1[1],hh),u0),q=lerp(f(p0[0],p0[1],hh),f(p1[0],p1[1],hh),u1),m=[(p[0]+q[0])/2,(p[1]+q[1])/2+0.5];
    ctx.strokeStyle=win?'rgba(255,255,255,0.5)':'rgba(220,190,140,0.75)';ctx.lineWidth=0.9;ctx.beginPath();ctx.moveTo(p[0],p[1]-0.3);ctx.quadraticCurveTo(m[0],m[1]-1.1,q[0],q[1]-0.3);ctx.stroke();
    ctx.strokeStyle='rgba(50,32,18,0.6)';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(p[0],p[1]+0.4);ctx.quadraticCurveTo(m[0],m[1]-0.3,q[0],q[1]+0.4);ctx.stroke();}}
  for(let k=0;k<=n;k++){const u=k/n,p=lerp(A,B,u),q=lerp(At,Bt,u);hoLine(p,[q[0],q[1]-1.6],'#4A3424',1);}
  hoLine(At,Bt,'rgba(70,50,30,0.8)',0.8);}
function drawPigOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*11+opt,L=Math.min(5,b.lvl||1),E=1.42,FH=7,J=WOOD_SET[2];
  /* back fence runs first */hoWattle(f,[-E,-E],[E,-E],FH,win,sd);hoWattle(f,[-E,-E],[-E,E],FH,win,sd+1);
  /* mud wallow: an irregular puddle, wet sheen */if(!win){const C=[0.35,0.3],pts=[];for(let k=0;k<16;k++){const th=k/16*6.283,r=0.55*(1+(h2(sd,k,95)-0.5)*0.35);pts.push(f(C[0]+Math.cos(th)*r,C[1]+Math.sin(th)*r*0.8,0));}hoQ(pts,'rgba(78,58,38,0.75)');
    const in2=[];for(let k=0;k<16;k++){const th=k/16*6.283,r=0.36*(1+(h2(sd,k,96)-0.5)*0.3);in2.push(f(C[0]+Math.cos(th)*r,C[1]+Math.sin(th)*r*0.8,0));}hoQ(in2,'rgba(60,44,30,0.85)');
    const m=f(C[0]-0.1,C[1]-0.1,0);ctx.fillStyle='rgba(200,210,215,0.25)';ctx.beginPath();ctx.ellipse(m[0],m[1],7,2,0,0,6.3);ctx.fill();}
  /* the sty: low plank hut, black scales, an open doorway with straw */const hl=L>=5?0.55:0.45,hw=0.34,fw=(a,c,h)=>f(a-0.85,c-0.95,h),g={sd,hl,hw,fh:1.6,wh:8+(L>=3?1:0),rh:8,ov:0.05,th:1.6,wt:'planks',wall:'#7A6450',wallD:'#62503F',roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:'scale',frame:true,frameCol:'#3A2A1C',k:1,v:1};
  const r=hoRoof(fw,g,win);r.back();hoFooting(fw,g,win);hoWalls(fw,g,win);r.end();
  {const P=(s,h)=>fw(s,hw+0.004,h),dw=0.12;hoQ([P(-dw,g.fh),P(dw,g.fh),P(dw,g.fh+5.5),P(-dw,g.fh+5.5)],'#1A140F');hoQ([P(-dw,g.fh),P(dw,g.fh),P(dw,g.fh+1.6),P(-dw,g.fh+1.6)],'#B8984E');for(const s of [-dw-0.015,dw+0.015])hoLine(P(s,g.fh),P(s,g.fh+5.8),'#3A2A1C',1.1);hoLine(P(-dw-0.02,g.fh+5.8),P(dw+0.02,g.fh+5.8),'#3A2A1C',1.2);}
  if(L>=3){const P=(s,h)=>fw(hl+0.004,s,h);hoQ([P(-0.05,g.fh+3.5),P(0.05,g.fh+3.5),P(0.05,g.fh+5.5),P(-0.05,g.fh+5.5)],'#2A2018');}
  r.front();r.ridge();hoBarge(fw,g,'#4A3424',0.22,L>=5);
  /* pigs: dark, bristly, sorted back to front */const tot=(typeof S!=='undefined'&&S.herd)?S.herd.pigs:6,pens=Math.max(1,B.filter(q=>q.t===b.t).length),n=Math.max(3,Math.min(10,Math.ceil(tot/pens)||0)),tt=typeof t==='number'?t:0,coats=['#5A3A28','#3A2E28','#7A4A2E','#4A3426'],P=[];
  for(let k=0;k<n;k++){const a=-1.15+h2(b.id||0,k,61)*2.4+Math.sin(tt*0.25+k*1.7)*0.12,c=-0.35+h2(b.id||0,k,62)*1.55+Math.cos(tt*0.2+k)*0.08;P.push({a,c,k});}
  P.sort((x,y)=>(x.a+x.c)-(y.a+y.c));for(const q of P){const p=f(q.a,q.c,0),d=Math.sin(tt*0.25+q.k*1.7+1.3)>0?1:-1;hoPig(p,d,coats[q.k%4],Math.abs(Math.sin(tt*2+q.k))*0.5,win,sd);}
  /* front fence runs, with a plank gate */hoWattle(f,[E,-E],[E,E],FH,win,sd+2);
  hoWattle(f,[-E,E],[0.15,E],FH,win,sd+3);hoWattle(f,[0.75,E],[E,E],FH,win,sd+4);
  {const G=(a,h)=>f(a,E,h);hoQ([G(0.17,0.5),G(0.73,0.5),G(0.73,FH-0.5),G(0.17,FH-0.5)],win?'#D8D2C6':'#8A6E4E');ctx.strokeStyle='rgba(30,20,12,0.5)';ctx.lineWidth=0.45;ctx.beginPath();for(let a=0.25;a<0.73;a+=0.08){const p=G(a,0.5),q=G(a,FH-0.5);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
    hoLine(G(0.18,1.5),G(0.72,FH-1.2),'#5A4230',1.2);for(const a of [0.15,0.75]){const p=G(a,0),q=G(a,FH+1.5);hoLine(p,q,'#3A2A1C',1.6);}}}
{const _shG=shShape;shShape=function(b){if(b.t==='pigpen'&&PIG_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),L=Math.min(5,b.lvl||1),hl=L>=5?0.55:0.45,box=(a0,a1,c0,c1)=>[f(a0,c0,0),f(a1,c0,0),f(a1,c1,0),f(a0,c1,0)];
  return [{pts:box(-0.85-hl,-0.85+hl,-0.95-0.34,-0.95+0.34),h:0.4},{pts:box(-0.85-hl,-0.85+hl,-1,-0.9),h:0.68}];}return _shG(b);};}

/* =================== Sheep Pen options (prototype) — window.__setSheep(n) ===================
   Norse short-tailed sheep in mixed colours, some horned.
   1 Wattle fence + plank fold (like the Pig Pen) · 2 Dry-stone wall + stone fold with a turf roof
   3 Skigard (slanted split-rail) fence + open log fold with hay · 4 Round dry-stone fold + a small turf shieling */
let SHEEP_OPT=0;window.__setSheep=n=>{SHEEP_OPT=n|0;};
{const _dsSh=drawShaped;drawShaped=function(b,win,c0,ax){if(SHEEP_OPT&&b.t==='sheeppen'){drawSheepOpt(b,win,SHEEP_OPT);return true;}return _dsSh(b,win,c0,ax);};}
function hoSheep(p,d,wool,face,horn,bob,win){const x=p[0],y=p[1]-bob;ctx.fillStyle='rgba(30,24,18,0.22)';ctx.beginPath();ctx.ellipse(x,y+0.5,5.6,2,0,0,6.3);ctx.fill();
  for(const lx of [-3,-1.4,1.8,3.2]){ctx.fillStyle=face;ctx.fillRect(x+lx*d-0.45,y-2.8,0.9,3);}
  const W=win?'#F2F2EE':wool;ctx.fillStyle=W;for(const [dx,dy,r] of [[-2.6,-4.6,2.4],[0,-5.2,2.7],[2.4,-4.8,2.4],[-1.2,-3.6,2.3],[1.4,-3.7,2.3],[-3.4,-3.9,1.8]]){ctx.beginPath();ctx.arc(x+dx*d,y+dy,r,0,6.3);ctx.fill();}
  ctx.fillStyle=shade(W,1.12);ctx.beginPath();ctx.arc(x+0.2*d,y-6.2,1.5,0,6.3);ctx.fill();ctx.fillStyle=shade(W,0.82);ctx.beginPath();ctx.ellipse(x,y-2.7,3.8,1,0,0,3.14);ctx.fill();
  /* head, ears, horns */const hx=x+d*5,hy=y-5.4;ctx.fillStyle=face;ctx.beginPath();ctx.ellipse(hx,hy,1.7,1.3,d*0.3,0,6.3);ctx.fill();ctx.beginPath();ctx.ellipse(hx+d*1.5,hy+0.6,1.1,0.9,0,0,6.3);ctx.fill();
  ctx.beginPath();ctx.ellipse(hx-d*1.2,hy-0.5,1,0.45,-d*0.5,0,6.3);ctx.fill();ctx.fillStyle='#0E0A08';ctx.fillRect(hx+d*0.6-0.3,hy-0.6,0.6,0.6);
  if(horn){ctx.strokeStyle=win?'#B8AE9A':'#A89A78';ctx.lineWidth=0.9;ctx.beginPath();ctx.arc(hx-d*0.6,hy-0.2,1.5,d>0?3.6:-0.5,d>0?8.5:4.4);ctx.stroke();}
  ctx.fillStyle=shade(W,0.9);ctx.beginPath();ctx.arc(x-d*5,y-4.6,0.9,0,6.3);ctx.fill();}
function hoStoneWall(f,p0,p1,h,win,sd){/* dry-stone wall: the face toward the viewer and the top, stones in courses, cap stones on edge */const t=0.07,dir=[p1[0]-p0[0],p1[1]-p0[1]],L=Math.hypot(dir[0],dir[1]),nrm=[-dir[1]/L,dir[0]/L],o=(nrm[0]+nrm[1]>=0)?1:-1,N=[nrm[0]*t*o,nrm[1]*t*o];
  const F=(u,hh)=>{const a=p0[0]+dir[0]*u+N[0],c=p0[1]+dir[1]*u+N[1];return f(a,c,hh);},T=(u,hh)=>{const a=p0[0]+dir[0]*u-N[0],c=p0[1]+dir[1]*u-N[1];return f(a,c,hh);};
  hoQ([T(0,h),T(1,h),F(1,h),F(0,h)],win?'#E8EAE6':'#9A948A');hoQ([F(0,0),F(1,0),F(1,h),F(0,h)],win?'#C9CBC7':'#7E786E');
  const rows=Math.max(2,Math.round(h/1.6)),n=Math.max(3,Math.round(L/0.11));for(let r=0;r<rows;r++){const h0=h*r/rows,h1=h*(r+1)/rows;for(let k=0;k<n;k++){const u0=(k+(r%2?0.5:0)+h2(sd,r*31+k,97)*0.2)/n,u1=Math.min(1,u0+1/n-0.012);if(u0>=1)continue;const tn=h2(sd,r*17+k,98);hoQ([F(u0,h0+0.15),F(u1,h0+0.15),F(u1,h1-0.15),F(u0,h1-0.15)],win?(tn>0.5?'#D4D6D2':'#C4C6C2'):tn>0.66?'#8E877B':tn>0.33?'#857E72':'#746E64');}}
  for(let k=0;k<n*1.4;k++){const u=(k+0.5)/(n*1.4),p=lerp(T(u,h),F(u,h),0.5);ctx.fillStyle=win?'#F2F4F0':(k%2?'#8A847A':'#9C968B');ctx.fillRect(p[0]-1,p[1]-2,2,2);}
  if(!win){ctx.fillStyle='rgba(90,110,60,0.45)';for(let k=0;k<Math.round(L*4);k++){const p=F(h2(sd,k,99),0.3);ctx.fillRect(p[0]-1.2,p[1]-0.4,2.4,0.7);}}}
function hoSkigard(f,p0,p1,h,win,sd){/* Norwegian skigard: pairs of upright stakes, split poles laid slanting between them */const n=Math.max(2,Math.round(Math.hypot(p1[0]-p0[0],p1[1]-p0[1])/0.42));const P=(u,hh)=>f(p0[0]+(p1[0]-p0[0])*u,p0[1]+(p1[1]-p0[1])*u,hh);
  for(let k=0;k<n;k++){for(let j=0;j<5;j++){const u0=(k+j*0.2)/n,u1=Math.min(1,u0+1.1/n);hoLine(P(u0,0.4),P(u1,h),'#3A2A1C',2.2);hoLine(P(u0,0.4),P(u1,h),j%2?'#9A7A54':'#B08C62',1.4);}}
  for(let k=0;k<=n;k++){const u=k/n,a=P(u,0),b2=P(u,h+1.6);hoLine([a[0]-0.9,a[1]],[b2[0]-0.9,b2[1]],'#4A3424',1);hoLine([a[0]+0.9,a[1]],[b2[0]+0.9,b2[1]],'#5A4230',1);hoLine([b2[0]-1.2,b2[1]+1.2],[b2[0]+1.2,b2[1]+1.2],'#6E5038',0.6);}}
function drawSheepOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*7+opt,L=Math.min(5,b.lvl||1),E=1.42,J=WOOD_SET[2];
  const run=(p0,p1,k)=>{if(opt===1)hoWattle(f,p0,p1,7,win,sd+k);else if(opt===2)hoStoneWall(f,p0,p1,5,win,sd+k);else if(opt===3)hoSkigard(f,p0,p1,6.5,win,sd+k);};
  const RR=1.3,ring=(front)=>{const n=20;for(let k=0;k<n;k++){const t0=k/n*6.283,t1=(k+1)/n*6.283,tm=(t0+t1)/2,fr=Math.cos(tm)+Math.sin(tm)>0;if(fr!==front)continue;if(front&&Math.abs(tm-Math.PI/4)<0.2)continue;hoStoneWall(f,[Math.cos(t0)*RR,Math.sin(t0)*RR],[Math.cos(t1)*RR,Math.sin(t1)*RR],5,win,sd+k);}};
  if(opt===4)ring(false);else{run([-E,-E],[E,-E],0);run([-E,-E],[-E,E],1);}
  /* the fold */const fw=(a,c,h)=>f(a+(opt===4?-0.55:-0.85),c+(opt===4?-0.55:-0.95),h),hl=opt===4?0.32:(L>=5?0.55:0.45),hw=opt===4?0.26:0.34;
  if(opt===1||opt===3){const g={sd,hl,hw,fh:1.6,wh:8+(L>=3?1:0),rh:8,ov:0.05,th:1.6,wt:opt===3?'logs':'planks',wall:opt===3?'#7A5A3C':'#7A6450',wallD:opt===3?'#62482F':'#62503F',roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:'scale',frame:opt===1,frameCol:'#3A2A1C',k:1,v:1};
    const r=hoRoof(fw,g,win);r.back();hoFooting(fw,g,win);hoWalls(fw,g,win);r.end();
    const P=(s,h)=>fw(s,hw+0.004,h),dw=opt===3?0.28:0.12;hoQ([P(-dw,g.fh),P(dw,g.fh),P(dw,g.fh+5.8),P(-dw,g.fh+5.8)],'#1A140F');
    if(opt===3){/* open front full of hay */hoQ([P(-dw,g.fh),P(dw,g.fh),P(dw,g.fh+3.2),P(-dw+0.05,g.fh+3.8),P(-dw,g.fh+2.4)],'#C8A85A');ctx.strokeStyle='rgba(120,90,40,0.6)';ctx.lineWidth=0.4;ctx.beginPath();for(let k=0;k<10;k++){const p=P(-dw+0.05*k+0.02,g.fh+1+h2(sd,k,93)*2);ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+1.5,p[1]-1);}ctx.stroke();}
    else hoQ([P(-dw,g.fh),P(dw,g.fh),P(dw,g.fh+1.4),P(-dw,g.fh+1.4)],'#B8984E');
    for(const s of [-dw-0.015,dw+0.015])hoLine(P(s,g.fh),P(s,g.fh+6.1),'#3A2A1C',1.1);hoLine(P(-dw-0.02,g.fh+6.1),P(dw+0.02,g.fh+6.1),'#3A2A1C',1.2);
    r.front();r.ridge();hoBarge(fw,g,'#4A3424',0.22,L>=5);}
  else{/* stone fold with a turf roof (2) or a small turf shieling (4) */const g={sd,hl,hw,fh:0.6,wh:opt===4?7:8+(L>=3?1:0),rh:opt===4?6:7,ov:0.06,th:4,wt:'planks',wall:'#857E72',wallD:'#6E685E',roof:'#6E7A44',roofD:'#56603A',roofE:'#3E4628',rt:'turf',frame:false,k:1,v:1};
    const r=hoRoof(fw,g,win);r.back();hoWalls(fw,g,win);hoStoneBox(fw,0,0,hl,hw,0.6,g.wh,win,sd);
    {const P=(c,h)=>fw(hl+0.004,c,h);hoQ([P(-0.05,g.wh),P(0.05,g.wh),P(0,g.wh+g.rh)].map(q=>q),'#5E5850');hoQ([P(-hw,g.wh),P(hw,g.wh),P(0,g.wh+g.rh)],win?'#C9CBC7':'#7A746A');}
    r.end();const P=(s,h)=>fw(s,hw+0.004,h),dw=0.1;hoQ([P(-dw,0.6),P(dw,0.6),P(dw,5.6),P(-dw,5.6)],'#1A140F');hoQ([P(-dw-0.03,5.6),P(dw+0.03,5.6),P(dw+0.03,6.6),P(-dw-0.03,6.6)],'#6E685E');
    if(opt===4){hoQ([P(dw,0.6),P(dw+0.08,0.6),P(dw+0.08,5.6),P(dw,5.6)],'#5A4230');}
    r.front();r.ridge();if(!win){const tp=fw(0,0,g.wh+g.rh+1);ctx.fillStyle='rgba(110,130,60,0.7)';for(let k=0;k<6;k++)ctx.fillRect(tp[0]-6+k*2.2,tp[1]-1-(k%2),0.7,2.4);}}
  /* sheep, sorted back to front */const tot=(typeof S!=='undefined'&&S.herd)?S.herd.sheep:7,pens=Math.max(1,B.filter(q=>q.t===b.t).length),n=Math.max(4,Math.min(12,Math.ceil(tot/pens)||0)),tt=typeof t==='number'?t:0;
  const wools=['#ECE6D8','#ECE6D8','#D8D0C0','#8A7E70','#5E5248','#2E2A26','#B89A7A'],faces=['#2E2A26','#3A322C','#6E5E50','#ECE6D8'],Q=[];
  for(let k=0;k<n;k++){let a=-1.1+h2(b.id||0,k,63)*2.3+Math.sin(tt*0.2+k*1.3)*0.1,c=-0.3+h2(b.id||0,k,64)*1.5+Math.cos(tt*0.17+k)*0.07;if(opt===4){const r=Math.hypot(a,c);if(r>1.05){a*=1.05/r;c*=1.05/r;}}Q.push({a,c,k});}
  Q.sort((x,y)=>(x.a+x.c)-(y.a+y.c));for(const q of Q){const p=f(q.a,q.c,0),d=Math.sin(tt*0.2+q.k*1.3+1.1)>0?1:-1,w=wools[q.k%wools.length];hoSheep(p,d,w,w==='#2E2A26'||w==='#5E5248'?'#2A2420':faces[q.k%faces.length],q.k%3===0,Math.abs(Math.sin(tt*1.6+q.k))*0.4,win);}
  /* front runs with a gate */if(opt===4){ring(true);const g0=[Math.cos(Math.PI/4-0.18)*RR,Math.sin(Math.PI/4-0.18)*RR],g1=[Math.cos(Math.PI/4+0.18)*RR,Math.sin(Math.PI/4+0.18)*RR];for(const q of [g0,g1]){const p=f(q[0],q[1],0),u=f(q[0],q[1],7);hoLine(p,u,'#3A2A1C',1.6);}hoLine(f(g0[0],g0[1],2),f(g1[0],g1[1],2),'#8A6E4E',1);hoLine(f(g0[0],g0[1],4.5),f(g1[0],g1[1],4.5),'#8A6E4E',1);return;}
  run([E,-E],[E,E],2);run([-E,E],[0.15,E],3);run([0.75,E],[E,E],4);
  {const G=(a,h)=>f(a,E,h),gh=opt===2?5:6.5;hoQ([G(0.17,0.5),G(0.73,0.5),G(0.73,gh-0.5),G(0.17,gh-0.5)],win?'#D8D2C6':'#8A6E4E');ctx.strokeStyle='rgba(30,20,12,0.5)';ctx.lineWidth=0.45;ctx.beginPath();for(let a=0.25;a<0.73;a+=0.08){const p=G(a,0.5),q=G(a,gh-0.5);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
    hoLine(G(0.18,1.3),G(0.72,gh-1),'#5A4230',1.2);for(const a of [0.15,0.75]){const p=G(a,0),q=G(a,gh+1.5);hoLine(p,q,'#3A2A1C',1.6);}}}
{const _shSh=shShape;shShape=function(b){if(b.t==='sheeppen'&&SHEEP_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),o4=SHEEP_OPT===4,ca=o4?-0.55:-0.85,cc=o4?-0.55:-0.95,hl=o4?0.32:0.5,hw=o4?0.26:0.34,box=(a0,a1,c0,c1)=>[f(a0,c0,0),f(a1,c0,0),f(a1,c1,0),f(a0,c1,0)];
  return [{pts:box(ca-hl,ca+hl,cc-hw,cc+hw),h:0.38},{pts:box(ca-hl,ca+hl,cc-0.05,cc+0.05),h:0.62}];}return _shSh(b);};}

/* ground under a building that follows its real shape; return true to replace the square yard patch */
function groundShape(b,win){if(b.t==='sheeppen'&&SHEEP_OPT===4){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*5,ring=(r,n,j)=>{const o=[];for(let k=0;k<n;k++){const t2=k/n*6.283,rr=r*(1+(h2(sd,k,j)-0.5)*0.05);o.push(f(Math.cos(t2)*rr,Math.sin(t2)*rr,0));}return o;};
    hoQ(ring(1.42,28,1),win?'rgba(225,228,224,0.55)':'rgba(150,134,100,0.3)');hoQ(ring(1.27,28,2),win?'rgba(210,213,208,0.8)':'rgba(150,134,100,0.6)');
    if(!win){ctx.fillStyle='rgba(110,90,60,0.25)';for(let k=0;k<30;k++){const th=h2(sd,k,3)*6.283,r=h2(sd,k,4)*1.15,p=f(Math.cos(th)*r,Math.sin(th)*r,0);ctx.beginPath();ctx.ellipse(p[0],p[1],2.4,1,0,0,6.3);ctx.fill();}
      /* a worn path out of the gate */const g=f(Math.cos(Math.PI/4)*1.3,Math.sin(Math.PI/4)*1.3,0),g2=f(1.42,1.42,0);ctx.strokeStyle='rgba(150,134,100,0.45)';ctx.lineWidth=9;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(g[0],g[1]);ctx.lineTo(g2[0],g2[1]);ctx.stroke();ctx.lineCap='butt';}
    return true;}
  return false;}

/* =================== Training Ground options (prototype) — window.__setTrain(n) ===================
   Round ring, sand floor following the circle. 1 Wattle ring · 2 Hazel staves and ropes (vébönd), holmgang cloak in the middle
   3 Low pointed palisade with a gate · 4 Standing stones on an earth bank with log benches */
let TRAIN_OPT=0;window.__setTrain=n=>{TRAIN_OPT=n|0;};
{const _dsT=drawShaped;drawShaped=function(b,win,c0,ax){if(TRAIN_OPT&&b.t==='train'){drawTrainOpt(b,win,TRAIN_OPT);return true;}return _dsT(b,win,c0,ax);};}
function hoRingRuns(R,n,front,gap,cb){for(let k=0;k<n;k++){const t0=k/n*6.283,t1=(k+1)/n*6.283,tm=(t0+t1)/2,fr=Math.cos(tm)+Math.sin(tm)>0;if(fr!==front)continue;if(gap&&Math.abs(tm-Math.PI/4)<gap)continue;cb([Math.cos(t0)*R,Math.sin(t0)*R],[Math.cos(t1)*R,Math.sin(t1)*R],k,tm);}}
function hoDummy(f,a,c,win,col){const p=f(a,c,0),q=f(a,c,14);hoLine(p,q,'#5A4230',1.4);hoLine([q[0]-5,q[1]+4],[q[0]+5,q[1]+4],'#5A4230',1.2);
  ctx.fillStyle=win?'#E8E2D2':'#C8A85A';ctx.beginPath();ctx.ellipse(q[0],q[1]+7.5,3.2,4.6,0,0,6.3);ctx.fill();ctx.strokeStyle='rgba(120,90,40,0.6)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=0;k<4;k++){ctx.moveTo(q[0]-2.6,q[1]+5+k*1.6);ctx.lineTo(q[0]+2.6,q[1]+5.4+k*1.6);}ctx.stroke();
  ctx.fillStyle=win?'#DDD6C4':'#B89A5A';ctx.beginPath();ctx.arc(q[0],q[1]+1,2.2,0,6.3);ctx.fill();hoLine([q[0]-2,q[1]+2.6],[q[0]+2,q[1]+2.6],'#6E5038',0.5);
  hoShieldRound([q[0]-5.5,q[1]+7],3,col||['#8E3B2F','#E2D8C0']);}
function hoShieldRound(p,r,c){ctx.fillStyle=c[0];ctx.beginPath();ctx.arc(p[0],p[1],r,0,6.3);ctx.fill();ctx.fillStyle=c[1];ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.arc(p[0],p[1],r,0,1.57);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.arc(p[0],p[1],r,3.14,4.71);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#3A2A1C';ctx.lineWidth=0.6;ctx.beginPath();ctx.arc(p[0],p[1],r,0,6.3);ctx.stroke();ctx.fillStyle='#8A8A86';ctx.beginPath();ctx.arc(p[0],p[1],r*0.28,0,6.3);ctx.fill();}
function hoWeaponRack(f,a0,a1,c,win){const P=(a,h)=>f(a,c,h);for(const a of [a0,a1]){hoLine(P(a,0),P(a,10),'#4A3424',1.3);}hoLine(P(a0,9),P(a1,9),'#6E5038',1.1);hoLine(P(a0,4),P(a1,4),'#6E5038',1);
  for(let i=0;i<5;i++){const a=a0+0.05+(a1-a0-0.1)*i/4,p=P(a,0.5),q=P(a+0.04,16);hoLine(p,q,'#8A6A4A',0.8);ctx.fillStyle='#9A9C9E';ctx.beginPath();ctx.moveTo(q[0]-0.9,q[1]+1);ctx.lineTo(q[0],q[1]-2.6);ctx.lineTo(q[0]+0.9,q[1]+1);ctx.closePath();ctx.fill();}
  const cols=[['#8E3B2F','#E2D8C0'],['#2E4A5E','#C9A24A'],['#E2D8C0','#2F2C2A']];for(let i=0;i<3;i++){const p=P(a0+0.1+(a1-a0-0.2)*i/2,6.5);hoShieldRound(p,2.8,cols[i]);}}
function hoPalisadeStake(p,h,col,win){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(p[0]-1.6,p[1]);ctx.lineTo(p[0]+1.6,p[1]);ctx.lineTo(p[0]+1.6,p[1]-h);ctx.lineTo(p[0],p[1]-h-2.6);ctx.lineTo(p[0]-1.6,p[1]-h);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(255,240,210,0.15)';ctx.fillRect(p[0]-1.6,p[1]-h,0.8,h);ctx.strokeStyle='rgba(20,14,8,0.5)';ctx.lineWidth=0.4;ctx.beginPath();ctx.moveTo(p[0]+1.6,p[1]);ctx.lineTo(p[0]+1.6,p[1]-h);ctx.stroke();}
function drawTrainOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*3+opt,L=Math.min(5,b.lvl||1),R=1.3,N=26;
  const ringPart=front=>{
    if(opt===1)hoRingRuns(R,N,front,0.2,(p0,p1,k)=>hoWattle(f,p0,p1,6.5,win,sd+k));
    else if(opt===2){hoRingRuns(R,16,front,0.22,(p0,p1,k)=>{const a=f(p0[0],p0[1],0),at=f(p0[0],p0[1],11);hoLine(a,at,'#7A6A4A',1.1);ctx.fillStyle='#5E7A3E';ctx.beginPath();ctx.ellipse(at[0],at[1]-0.5,1.3,0.8,0,0,6.3);ctx.fill();
      const q=f(p1[0],p1[1],0),m1=lerp(f(p0[0],p0[1],9),f(p1[0],p1[1],9),0.5);ctx.strokeStyle='rgba(200,180,140,0.9)';ctx.lineWidth=0.6;ctx.beginPath();const s0=f(p0[0],p0[1],9),s1=f(p1[0],p1[1],9);ctx.moveTo(s0[0],s0[1]);ctx.quadraticCurveTo(m1[0],m1[1]+2,s1[0],s1[1]);ctx.stroke();});}
    else if(opt===3){const H=front?7:9;hoRingRuns(R,40,front,0.16,(p0,p1,k)=>{const pts=[];for(let j=0;j<3;j++){pts.push(lerp(f(p0[0],p0[1],0),f(p1[0],p1[1],0),j/3));}for(const p of pts)hoPalisadeStake(p,H+(h2(sd,k*3,7)-0.5)*1.4,win?'#C9C3B8':(k%2?'#7A5A3C':'#6E5038'),win);});
      if(!front)return;hoRingRuns(R,40,true,0.16,(p0,p1)=>{const a=f(p0[0],p0[1],3),c2=f(p1[0],p1[1],3);hoLine(a,c2,'#4A3424',1);});}
    else{/* earth bank with turf, standing stones on it, log benches inside the back half */const bank=(p0,p1,k)=>{const o=1.18,A=[p0[0]*o,p0[1]*o],Bq=[p1[0]*o,p1[1]*o];hoQ([f(p0[0],p0[1],0),f(p1[0],p1[1],0),f(Bq[0],Bq[1],2.5),f(A[0],A[1],2.5)],win?'#E8EAE6':'#7E8A4E');};
      hoRingRuns(R,N,front,0.2,bank);hoRingRuns(R*1.09,13,front,0.25,(p0,p1,k)=>{const p=f(p0[0],p0[1],2.5),h=9+h2(sd,k,8)*6;ctx.fillStyle=win?'#D4D6D2':(k%2?'#8E877B':'#7E776C');ctx.beginPath();ctx.moveTo(p[0]-2.4,p[1]);ctx.lineTo(p[0]-2,p[1]-h);ctx.quadraticCurveTo(p[0],p[1]-h-2.4,p[0]+2,p[1]-h+0.6);ctx.lineTo(p[0]+2.4,p[1]);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(30,26,20,0.25)';ctx.fillRect(p[0]+0.6,p[1]-h+1,1.8,h-1);
        if(!win){ctx.fillStyle='rgba(110,130,70,0.55)';ctx.fillRect(p[0]-2.2,p[1]-2,1.6,1.4);}});
      if(!front){for(const [a,c] of [[-0.75,-0.55],[-0.2,-0.95],[0.45,-0.85]]){const P=(da,h)=>f(a+da,c,h);hoLine(P(-0.22,2.6),P(0.22,2.6),'#5A4230',3.2);hoLine(P(-0.22,3.3),P(0.22,3.3),'#8A6A4A',1);}}}};
  ringPart(false);
  /* inside: dummies, rack, the holmgang cloak (2) */
  if(opt===2){const C=(a,c)=>f(a,c,0.3),s=0.32;hoQ([C(-s,-s),C(s,-s),C(s,s),C(-s,s)],win?'#E2DCD0':'#7A3A2C');hoQ([C(-s+0.04,-s+0.04),C(s-0.04,-s+0.04),C(s-0.04,s-0.04),C(-s+0.04,s-0.04)],win?'#E8E2D6':'#8E4A38');for(const q of [[-s,-s],[s,-s],[s,s],[-s,s]]){const p=C(q[0],q[1]);ctx.fillStyle='#4A3424';ctx.fillRect(p[0]-0.6,p[1]-2.2,1.2,2.4);}}
  hoWeaponRack(f,-0.75,-0.15,-0.75,win);
  hoDummy(f,0.55,-0.3,win,['#2E4A5E','#C9A24A']);if(L>=3)hoDummy(f,-0.65,0.35,win);if(L>=5)hoDummy(f,0.2,0.65,win,['#E2D8C0','#2F2C2A']);
  if(opt!==2){/* a chopping-block target: round log with an axe in it */const p=f(0.1,0.15,0);ctx.fillStyle='#7A5A3C';ctx.fillRect(p[0]-2.6,p[1]-4,5.2,4);ctx.fillStyle='#C9A87A';ctx.beginPath();ctx.ellipse(p[0],p[1]-4,2.6,1.2,0,0,6.3);ctx.fill();hoLine([p[0],p[1]-4.4],[p[0]+2.5,p[1]-9],'#6E5038',0.8);ctx.fillStyle='#8A8C8E';ctx.fillRect(p[0]-1,p[1]-5.6,2.4,1.4);}
  ringPart(true);
  /* gate posts facing the viewer */{const g0=[Math.cos(Math.PI/4-0.2)*R,Math.sin(Math.PI/4-0.2)*R],g1=[Math.cos(Math.PI/4+0.2)*R,Math.sin(Math.PI/4+0.2)*R],H=opt===3?12:opt===4?0:9;if(H){for(const q of [g0,g1]){const p=f(q[0],q[1],0),u=f(q[0],q[1],H);hoQ([[p[0]-1.2,p[1]],[p[0]+1.2,p[1]],[u[0]+1.2,u[1]],[u[0]-1.2,u[1]]],'#4A3424');}if(opt===3)hoLine(f(g0[0],g0[1],H),f(g1[0],g1[1],H),'#5A4230',2);}}}
{const _shT=shShape;shShape=function(b){if(b.t==='train'&&TRAIN_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),ring=(r,n)=>{const o=[];for(let m=0;m<n;m++){const t2=m/n*6.283;o.push(f(Math.cos(t2)*r,Math.sin(t2)*r,0));}return o;};
  const V=[];const h=TRAIN_OPT===3?0.36:TRAIN_OPT===4?0.45:0.26;/* thin ring: approximate with small boxes around the circle */for(let m=0;m<24;m++){const t2=m/24*6.283,t3=(m+1)/24*6.283,R=1.3,a=[Math.cos(t2)*R,Math.sin(t2)*R],c=[Math.cos(t3)*R,Math.sin(t3)*R];V.push({pts:[f(a[0]*0.97,a[1]*0.97,0),f(c[0]*0.97,c[1]*0.97,0),f(c[0]*1.03,c[1]*1.03,0),f(a[0]*1.03,a[1]*1.03,0)],h});}return V;}return _shT(b);};}
{const _gsT=groundShape;groundShape=function(b,win){if(b.t==='train'&&TRAIN_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*5,ring=(r,n,j)=>{const o=[];for(let k=0;k<n;k++){const t2=k/n*6.283,rr=r*(1+(h2(sd,k,j)-0.5)*0.04);o.push(f(Math.cos(t2)*rr,Math.sin(t2)*rr,0));}return o;};
    hoQ(ring(1.44,30,1),win?'rgba(225,228,224,0.5)':'rgba(170,150,110,0.3)');hoQ(ring(1.26,30,2),win?'rgba(232,230,222,0.85)':'rgba(206,184,136,0.78)');
    if(!win){ctx.fillStyle='rgba(150,124,84,0.3)';for(let k=0;k<40;k++){const th=h2(sd,k,3)*6.283,r=h2(sd,k,4)*1.15,p=f(Math.cos(th)*r,Math.sin(th)*r,0);ctx.beginPath();ctx.ellipse(p[0],p[1],1.6+h2(sd,k,5)*2,0.7,0,0,6.3);ctx.fill();}
      const g=f(Math.cos(Math.PI/4)*1.3,Math.sin(Math.PI/4)*1.3,0),g2=f(1.45,1.45,0);ctx.strokeStyle='rgba(170,150,110,0.45)';ctx.lineWidth=9;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(g[0],g[1]);ctx.lineTo(g2[0],g2[1]);ctx.stroke();ctx.lineCap='butt';}
    return true;}return _gsT(b,win);};}

/* =================== Altar options (prototype) — window.__setAltar(n) ===================
   An open-air place of offering (2×2, no levels). 1 Hörgr cairn in a kerb ring · 2 Five god-posts behind a stone altar
   3 Small vé shrine with an idol, hazel staves and ropes · 4 Blót ring of standing stones, boulder altar, cauldron over the fire */
let ALTAR_OPT=0;window.__setAltar=n=>{ALTAR_OPT=n|0;};
{const _dsA=drawShaped;drawShaped=function(b,win,c0,ax){if(ALTAR_OPT&&b.t==='altar'){drawAltarOpt(b,win,ALTAR_OPT);return true;}return _dsA(b,win,c0,ax);};}
const alFront=(a,c)=>a+c;
function alStone(p,w,h,sd,k,win){/* a rough standing stone: lit left face, shaded right, a little moss */const lean=(h2(sd,k,11)-0.5)*1.6;ctx.fillStyle=win?'#D4D6D2':(h2(sd,k,12)>0.5?'#8E877B':'#7E776C');
  ctx.beginPath();ctx.moveTo(p[0]-w,p[1]);ctx.lineTo(p[0]-w*0.8+lean,p[1]-h);ctx.quadraticCurveTo(p[0]+lean,p[1]-h-w*0.9,p[0]+w*0.85+lean,p[1]-h+w*0.3);ctx.lineTo(p[0]+w,p[1]);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(30,26,20,0.28)';ctx.beginPath();ctx.moveTo(p[0]+w*0.25,p[1]);ctx.lineTo(p[0]+w*0.3+lean,p[1]-h+w*0.2);ctx.lineTo(p[0]+w*0.85+lean,p[1]-h+w*0.3);ctx.lineTo(p[0]+w,p[1]);ctx.closePath();ctx.fill();
  if(!win){ctx.fillStyle='rgba(110,130,70,0.55)';ctx.beginPath();ctx.ellipse(p[0]-w*0.4,p[1]-1,w*0.5,1,0,0,6.3);ctx.fill();}
  ctx.fillStyle='rgba(30,24,18,0.22)';ctx.beginPath();ctx.ellipse(p[0],p[1]+0.3,w*1.2,1,0,0,6.3);ctx.fill();}
function alCobble(p,rx,ry,col,win){ctx.fillStyle=col;ctx.beginPath();ctx.ellipse(p[0],p[1],rx,ry,0,0,6.3);ctx.fill();if(!win){ctx.fillStyle='rgba(255,250,235,0.18)';ctx.beginPath();ctx.ellipse(p[0]-rx*0.3,p[1]-ry*0.35,rx*0.5,ry*0.4,0,0,6.3);ctx.fill();}
  ctx.strokeStyle='rgba(40,36,30,0.45)';ctx.lineWidth=0.4;ctx.beginPath();ctx.ellipse(p[0],p[1],rx,ry,0,0,6.3);ctx.stroke();}
function alBowl(p,win){ctx.fillStyle=win?'#E0D8C8':'#8A5E2E';ctx.beginPath();ctx.ellipse(p[0],p[1]-1.2,3,1.1,0,0,3.14);ctx.lineTo(p[0]-3,p[1]-1.2);ctx.fill();ctx.fillStyle=win?'#E8E2D4':'#B8863E';ctx.beginPath();ctx.ellipse(p[0],p[1]-1.2,3,1,0,0,6.3);ctx.fill();
  ctx.fillStyle=win?'#C8C0B0':'#6A2A1E';ctx.beginPath();ctx.ellipse(p[0],p[1]-1.1,2.3,0.65,0,0,6.3);ctx.fill();}
function alFire(p,s,win){/* small fire: embers, crossed sticks, layered flames */ctx.fillStyle='rgba(255,170,70,0.18)';ctx.beginPath();ctx.ellipse(p[0],p[1],9*s,4.5*s,0,0,6.3);ctx.fill();
  for(let k=0;k<6;k++){const a=k/6*6.283;alCobble([p[0]+Math.cos(a)*4*s,p[1]+Math.sin(a)*2*s],1.3*s,0.8*s,'#77726A',win);}
  ctx.fillStyle='#2A1A10';ctx.beginPath();ctx.ellipse(p[0],p[1],3*s,1.4*s,0,0,6.3);ctx.fill();hoLine([p[0]-3*s,p[1]+0.6],[p[0]+2.6*s,p[1]-1.4*s],'#4A3020',1.1*s);hoLine([p[0]+3*s,p[1]+0.6],[p[0]-2.6*s,p[1]-1.4*s],'#5A3A24',1.1*s);
  if(win)return;const tt=typeof t==='number'?t:0;for(const [c,w,hh,ph] of [['#C2401E',2.6,7,0],['#E8862A',1.8,5.4,1.7],['#F8D25A',1,3.4,3.1]]){const fl=Math.sin(tt*8+ph)*0.7;ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(p[0]-w*s,p[1]-0.6);ctx.quadraticCurveTo(p[0]-w*s*0.7,p[1]-hh*s*0.6,p[0]+fl,p[1]-hh*s);ctx.quadraticCurveTo(p[0]+w*s*0.7,p[1]-hh*s*0.6,p[0]+w*s,p[1]-0.6);ctx.closePath();ctx.fill();}
  for(let k=0;k<3;k++){const q=(tt*0.6+k/3)%1;ctx.fillStyle='rgba(255,200,90,'+(0.8*(1-q)).toFixed(2)+')';ctx.fillRect(p[0]+Math.sin(tt*3+k*2)*2*s,p[1]-6*s-q*10*s,0.7,0.7);}}
function alSlabAltar(f,a,c,s1,s2,h,win,sd,clean){/* a raised altar of stacked stones with a thick flat top slab */const S=win?['#C9CBC7','#B2B4B0','#E8EAE6']:['#8E8980','#76726A','#ABA69B'];
  hoQ([f(a-s1,c+s2,0),f(a+s1,c+s2,0),f(a+s1,c+s2,h),f(a-s1,c+s2,h)],S[0]);hoQ([f(a+s1,c-s2,0),f(a+s1,c+s2,0),f(a+s1,c+s2,h),f(a+s1,c-s2,h)],S[1]);
  ctx.strokeStyle='rgba(40,36,30,0.5)';ctx.lineWidth=0.5;ctx.beginPath();for(let r=1;r<3;r++){const hh=h*r/3,p0=f(a-s1,c+s2,hh),p1=f(a+s1,c+s2,hh),p2=f(a+s1,c-s2,hh);ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p1[0],p1[1]);ctx.lineTo(p2[0],p2[1]);}
  for(let r=0;r<3;r++)for(let k=0;k<4;k++){const u=(k+(r%2?0.5:0.2)+h2(sd,r*7+k,41)*0.2)/4;if(u>0.95)continue;const p=f(a-s1+2*s1*u,c+s2,h*r/3),q=f(a-s1+2*s1*u,c+s2,h*(r+1)/3);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);const u2=f(a+s1,c-s2+2*s2*u,h*r/3),q2=f(a+s1,c-s2+2*s2*u,h*(r+1)/3);ctx.moveTo(u2[0],u2[1]);ctx.lineTo(q2[0],q2[1]);}ctx.stroke();
  const e=0.05,T=2.2;hoQ([f(a-s1-e,c+s2+e,h),f(a+s1+e,c+s2+e,h),f(a+s1+e,c+s2+e,h+T),f(a-s1-e,c+s2+e,h+T)],shade(S[0],1.08));hoQ([f(a+s1+e,c-s2-e,h),f(a+s1+e,c+s2+e,h),f(a+s1+e,c+s2+e,h+T),f(a+s1+e,c-s2-e,h+T)],shade(S[1],1.05));
  hoQ([f(a-s1-e,c-s2-e,h+T),f(a+s1+e,c-s2-e,h+T),f(a+s1+e,c+s2+e,h+T),f(a-s1-e,c+s2+e,h+T)],S[2]);
  if(!win){ctx.fillStyle='rgba(110,130,70,0.5)';const m=f(a-s1*0.6,c+s2,1);ctx.beginPath();ctx.ellipse(m[0],m[1],2.4,0.9,0,0,6.3);ctx.fill();const st=f(a+s1*0.2,c+s2*0.3,h+T);ctx.fillStyle=clean?'rgba(0,0,0,0)':'rgba(110,30,20,0.35)';ctx.beginPath();ctx.ellipse(st[0]+3,st[1]+0.5,2.4,0.8,0.2,0,6.3);ctx.fill();}
  return f(a,c,h+T);}
/* god-posts: square post, painted bands, a carved top for each god */
const AL_GODS=[{g:'Loki',b:['#3E5A3A','#1E1C1A']},{g:'Njord',b:['#2E4A5E','#E2D8C0']},{g:'Odin',b:['#A34A3A','#C9A042']},{g:'Thor',b:['#A34A3A','#5A5C5E']},{g:'Freyja',b:['#C9A042','#4E6A44']}];
function alGodPost(f,a,c,H,god,win,sd){const w=0.055,P=(da,dc,h)=>f(a+da,c+dc,h),col=win?'#D8D2C4':'#6E5038',colD=win?'#C4BEB0':'#56402C';
  hoBox(f,a,c,0.11,0,2.2,win?'#D0D2CE':'#9C978D',win?'#B9BBB7':'#827D74',win);hoQ([P(-0.11,-0.11,2.2),P(0.11,-0.11,2.2),P(0.11,0.11,2.2),P(-0.11,0.11,2.2)],win?'#E4E6E2':'#B4AFA4');
  hoQ([P(-w,w,2.2),P(w,w,2.2),P(w,w,H),P(-w,w,H)],col);hoQ([P(w,-w,2.2),P(w,w,2.2),P(w,w,H),P(w,-w,H)],colD);
  if(!win){const B=god.b;for(let k=0;k<4;k++){const h1=H*0.35+k*H*0.12,h2b=h1+H*0.06;for(const face of [0,1]){const pt=(s,h)=>face?P(w,s,h):P(s,w,h),sh=face?0.8:1;hoQ([pt(-w,h1),pt(w,h1),pt(w,h2b),pt(-w,h2b)],shade(B[k%2],sh));
      if(k%2===0){ctx.strokeStyle=shade(B[1],sh);ctx.lineWidth=0.6;ctx.beginPath();const p1=pt(-w,h1+0.4),p2=pt(0,h2b-0.3),p3=pt(w,h1+0.4);ctx.moveTo(p1[0],p1[1]);ctx.lineTo(p2[0],p2[1]);ctx.lineTo(p3[0],p3[1]);ctx.stroke();}}}
    /* a carved face on the front, just under the top */const m=(s,h)=>P(s,w+0.001,h);hoQ([m(-w,H-1),m(w,H-1),m(w*0.6,H-6),m(0,H-7),m(-w*0.6,H-6)],'#8A6A4A');
    const eye=(s,open)=>{const e=m(s,H-3);if(open){ctx.fillStyle='#E0D4B0';ctx.beginPath();ctx.arc(e[0],e[1],0.6,0,6.3);ctx.fill();}else hoLine([e[0]-0.7,e[1]],[e[0]+0.7,e[1]],'#2A1F18',0.6);};eye(-w*0.45,true);eye(w*0.45,god.g!=='Odin');
    if(god.g==='Thor'){const b=m(0,H-6.4);hoQ([[b[0]-1.4,b[1]-0.4],[b[0]+1.4,b[1]-0.4],[b[0]+0.6,b[1]+2.6],[b[0]-0.6,b[1]+2.6]],'#B8622E');}}
  hoBox(f,a,c,w+0.02,H,H+1.4,win?'#C8C2B4':'#5A4230',win?'#B4AEA0':'#46341F',win);
  const tp=P(0,0,H+1.6);if(win)return;const G='#D9B356';
  if(god.g==='Odin'){ctx.strokeStyle=G;ctx.lineWidth=0.8;for(let k=0;k<3;k++){const ox=(k-1)*2.2,oy=k===1?-2.2:0;ctx.beginPath();ctx.moveTo(tp[0]+ox,tp[1]-6.4+oy);ctx.lineTo(tp[0]+ox+2.8,tp[1]-1.8+oy);ctx.lineTo(tp[0]+ox-2.8,tp[1]-1.8+oy);ctx.closePath();ctx.stroke();}}
  else if(god.g==='Thor'){/* Mjölnir */ctx.fillStyle='#5E6064';ctx.fillRect(tp[0]-0.6,tp[1]-4,1.2,4);ctx.beginPath();ctx.moveTo(tp[0]-3.4,tp[1]-4);ctx.lineTo(tp[0]+3.4,tp[1]-4);ctx.lineTo(tp[0]+2.4,tp[1]-8.4);ctx.lineTo(tp[0]-2.4,tp[1]-8.4);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(255,255,255,0.2)';ctx.fillRect(tp[0]-2.3,tp[1]-8.2,1.4,4);}
  else if(god.g==='Freyja'){/* Brísingamen: a gold ring with a spiral */ctx.strokeStyle=G;ctx.lineWidth=1;ctx.beginPath();ctx.arc(tp[0],tp[1]-4.2,3,0,6.3);ctx.stroke();ctx.lineWidth=0.6;ctx.beginPath();for(let k=0;k<=20;k++){const an=k*0.5,r=k*0.1;const x=tp[0]+Math.cos(an)*r,y=tp[1]-4.2+Math.sin(an)*r;k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}
  else if(god.g==='Njord'){/* a little ship with a curled prow */ctx.fillStyle='#4A3424';ctx.beginPath();ctx.moveTo(tp[0]-4.4,tp[1]-4.6);ctx.quadraticCurveTo(tp[0],tp[1]-0.6,tp[0]+4.4,tp[1]-4.6);ctx.lineTo(tp[0]+3,tp[1]-3.4);ctx.lineTo(tp[0]-3,tp[1]-3.4);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#4A3424';ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(tp[0]+4.2,tp[1]-4.4);ctx.quadraticCurveTo(tp[0]+5.4,tp[1]-7.6,tp[0]+3.8,tp[1]-7.4);ctx.moveTo(tp[0]-4.2,tp[1]-4.4);ctx.quadraticCurveTo(tp[0]-5.4,tp[1]-7.6,tp[0]-3.8,tp[1]-7.4);ctx.stroke();hoLine([tp[0]-2.6,tp[1]-3.2],[tp[0]+2.6,tp[1]-3.2],'#E2D8C0',0.5);}
  else{/* Loki: a serpent in an S */ctx.strokeStyle='#4E6A44';ctx.lineWidth=1.1;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(tp[0]-1,tp[1]-0.6);ctx.bezierCurveTo(tp[0]+3.4,tp[1]-1.6,tp[0]+3,tp[1]-4.4,tp[0],tp[1]-4.4);ctx.bezierCurveTo(tp[0]-3,tp[1]-4.4,tp[0]-3.2,tp[1]-7.6,tp[0]+1.2,tp[1]-8);ctx.stroke();ctx.lineCap='butt';ctx.fillStyle='#4E6A44';ctx.beginPath();ctx.ellipse(tp[0]+1.6,tp[1]-8,1.1,0.8,0,0,6.3);ctx.fill();}}
function alCairn(f,a,c,win,sd){/* hörgr: a round heap of stones in three tiers, a flat capstone with the bowl */const tiers=[[0.5,0,6],[0.38,6,11.5],[0.26,11.5,16.5]];let top;
  for(const [r,h0,h1] of tiers){const ring=(hh,rr)=>{const o=[];for(let k=0;k<20;k++){const t2=k/20*6.283;o.push(f(a+Math.cos(t2)*rr,c+Math.sin(t2)*rr,hh));}return o;};
    /* dark body (front half sweep) so gaps read as shadow */{const lo=ring(h0,r),hi=ring(h1,r*0.9);const pts=[];for(let k=0;k<=10;k++)pts.push(lo[(k+18)%20]);for(let k=10;k>=0;k--)pts.push(hi[(k+18)%20]);hoQ(pts,win?'#B8BAB6':'#5E5A52');hoQ(hi,win?'#C9CBC7':'#6E6A62');}
    const st=[];const n=Math.round(r*34);for(let row=0;row<3;row++)for(let k=0;k<n;k++){const t2=(k+(row%2?0.5:0)+h2(sd,k+row*50+h0,21)*0.3)/n*6.283;if(Math.cos(t2)+Math.sin(t2)<-0.5)continue;const rr=r*(1-row*0.05),hh=h0+(h1-h0)*(0.2+row*0.3);st.push({d:Math.cos(t2)+Math.sin(t2),p:f(a+Math.cos(t2)*rr,c+Math.sin(t2)*rr,hh),k:k+row*50});}
    st.sort((x,y)=>x.d-y.d);for(const s of st){const tn=h2(sd,s.k+h0*3,22);alCobble(s.p,2.2+tn*0.9,1.5+tn*0.4,win?(tn>0.5?'#D4D6D2':'#C4C6C2'):tn>0.66?'#9A948A':tn>0.33?'#8A847A':'#7A746A',win);}
    top=f(a,c,h1);}
  /* capstone */const cs=(hh,rr)=>{const o=[];for(let k=0;k<14;k++){const t2=k/14*6.283;o.push(f(a+Math.cos(t2)*rr*(1+(h2(sd,k,23)-0.5)*0.15),c+Math.sin(t2)*rr*0.85,hh));}return o;};
  {const lo=cs(16.5,0.28),hi=cs(18.6,0.28),pts=[];for(let k=0;k<=7;k++)pts.push(lo[(k+12)%14]);for(let k=7;k>=0;k--)pts.push(hi[(k+12)%14]);hoQ(pts,win?'#C4C6C2':'#837D72');hoQ(hi,win?'#E8EAE6':'#ABA69B');}
  if(!win){ctx.fillStyle='rgba(110,130,70,0.5)';for(let k=0;k<5;k++){const t2=0.3+k*0.35,p=f(a+Math.cos(t2)*0.5,c+Math.sin(t2)*0.5,0.8);ctx.beginPath();ctx.ellipse(p[0],p[1],2,0.8,0,0,6.3);ctx.fill();}}
  return f(a,c,18.6);}
function alVebond(f,R,front,win,gap){hoRingRuns(R,14,front,gap,(p0,p1)=>{const s=f(p0[0],p0[1],0),st=f(p0[0],p0[1],10);hoLine(s,st,win?'#B8B0A0':'#7A6A4A',1);if(!win){ctx.fillStyle='#5E7A3E';ctx.beginPath();ctx.ellipse(st[0],st[1]-0.4,1.2,0.75,0,0,6.3);ctx.fill();}
  const s0=f(p0[0],p0[1],8),s1=f(p1[0],p1[1],8),m=lerp(s0,s1,0.5);ctx.strokeStyle=win?'rgba(200,196,186,0.9)':'rgba(200,180,140,0.9)';ctx.lineWidth=0.55;ctx.beginPath();ctx.moveTo(s0[0],s0[1]);ctx.quadraticCurveTo(m[0],m[1]+1.8,s1[0],s1[1]);ctx.stroke();});}
function alShrine(f,win,sd){/* a small vé house at the back: ridge runs toward the viewer (along c), the front gable (+c) is open, an idol inside; dark staves, black scale shingles, crossed barge boards */
  const a0=-0.42,a1=0.42,c0=-0.75,c1=-0.25,fh=2.2,wh=15,rh=28,am=0,J=WOOD_SET[2],SW=win?'#D8D2C4':'#3E3028',SWD=win?'#C4BEB0':'#2E241E',FR=win?'#C8C2B4':'#2A201A';
  /* footing */hoQ([f(a0,c1,0),f(a1,c1,0),f(a1,c1,fh),f(a0,c1,fh)],win?'#C4C6C2':'#8F8C84');hoQ([f(a1,c0,0),f(a1,c1,0),f(a1,c1,fh),f(a1,c0,fh)],win?'#A9ABA7':'#77746D');hoQ([f(a0,c0,fh),f(a1,c0,fh),f(a1,c1,fh),f(a0,c1,fh)],win?'#D8D2C4':'#6E5A44');
  /* inside seen through the open gable: dark back gable wall and the left wall */hoQ([f(a0,c0,fh),f(a1,c0,fh),f(a1,c0,wh),f(am,c0,rh),f(a0,c0,wh)],win?'#BEB8AA':'#1E160E');hoQ([f(a0,c0,fh),f(a0,c1,fh),f(a0,c1,wh),f(a0,c0,wh)],win?'#B4AEA0':'#2A2016');
  {const p=f(0,c1-0.12,fh);ctx.fillStyle=win?'#E8E2D4':'#A0805A';ctx.beginPath();ctx.moveTo(p[0]-2.6,p[1]);ctx.lineTo(p[0]-2.2,p[1]-8);ctx.quadraticCurveTo(p[0]-2.6,p[1]-12,p[0],p[1]-12.5);ctx.quadraticCurveTo(p[0]+2.6,p[1]-12,p[0]+2.2,p[1]-8);ctx.lineTo(p[0]+2.6,p[1]);ctx.closePath();ctx.fill();
    if(!win){ctx.fillStyle='rgba(40,28,18,0.35)';ctx.fillRect(p[0]+0.8,p[1]-12,1.6,12);ctx.fillStyle='#3A2A1C';ctx.fillRect(p[0]-1.5,p[1]-10.4,1,0.6);ctx.fillRect(p[0]+0.5,p[1]-10.4,1,0.6);hoLine([p[0]-1.8,p[1]-5],[p[0]+1.8,p[1]-5],'#5A4230',0.6);hoLine([p[0],p[1]-8.6],[p[0],p[1]-7.2],'#5A4230',0.5);ctx.fillStyle='#C9A042';ctx.beginPath();ctx.arc(p[0],p[1]-3.2,0.9,0,6.3);ctx.fill();
      for(const s of [-0.26,0.26]){const q=f(s,c1-0.1,fh);ctx.fillStyle='rgba(255,190,90,0.3)';ctx.beginPath();ctx.arc(q[0],q[1]-2,4.5,0,6.3);ctx.fill();ctx.fillStyle='#F8D25A';ctx.beginPath();ctx.ellipse(q[0],q[1]-2.4,0.7,1.3,0,0,6.3);ctx.fill();ctx.fillStyle='#5A5C5E';ctx.fillRect(q[0]-0.9,q[1]-1.1,1.8,1.1);}}}
  /* long wall toward the viewer (+a) with staves */hoQ([f(a1,c0,fh),f(a1,c1,fh),f(a1,c1,wh),f(a1,c0,wh)],SWD);
  if(!win){ctx.strokeStyle='rgba(10,8,6,0.55)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=1;k<8;k++){const cc=c0+(c1-c0)*k/8,p=f(a1,cc,fh),q=f(a1,cc,wh);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();}
  /* open front gable: posts, carved lintel, the plank gable triangle above */for(const a of [a0,a1])hoQ([f(a-0.035,c1,fh),f(a+0.035,c1,fh),f(a+0.035,c1,wh),f(a-0.035,c1,wh)],FR);
  hoQ([f(a0,c1,wh-2.2),f(a1,c1,wh-2.2),f(a1,c1,wh),f(a0,c1,wh)],FR);hoQ([f(a0,c1,wh),f(a1,c1,wh),f(am,c1,rh)],SW);
  if(!win){ctx.strokeStyle='#C9A042';ctx.lineWidth=0.5;ctx.beginPath();for(let k=0;k<7;k++){const p=f(a0+(a1-a0)*(k+0.5)/7,c1,wh-1.1);ctx.moveTo(p[0]-1.3,p[1]);ctx.quadraticCurveTo(p[0],p[1]-1.2,p[0]+1.3,p[1]);}ctx.stroke();
    ctx.strokeStyle='rgba(10,8,6,0.5)';ctx.beginPath();for(let k=1;k<6;k++){const a=a0+(a1-a0)*k/6,ht=wh+(rh-wh)*(1-Math.abs(a-am)/(a1-am));const p=f(a,c1,wh),q=f(a,c1,ht);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
    hoShieldRound(f(am,c1,wh+4.5),2.4,['#A34A3A','#C9A042']);}
  /* roof slope toward the viewer (+a) */const e=0.07,R=[f(am,c0-e,rh),f(am,c1+e,rh),f(a1+e+0.03,c1+e,wh-1.2),f(a1+e+0.03,c0-e,wh-1.2)];hoQ(R,win?'#EEF1F0':J.roof);
  if(!win)hoRoofSurface((u,v)=>lerp(lerp(R[3],R[2],u),lerp(R[0],R[1],u),v),{sd:sd+4,rt:'scale',rh:12,roofD:J.roofD},win);hoQ([R[3],R[2],[R[2][0],R[2][1]+1.2],[R[3][0],R[3][1]+1.2]],'#1E1C1A');
  /* left slope edge seen at the gable */hoQ([f(am,c1+e,rh),f(a0-e-0.03,c1+e,wh-1.2),f(a0-e-0.03,c1+e,wh-2.6),f(am,c1+e,rh-1.6)],win?'#E2E4E2':'#211F1D');
  /* crossed barge boards, natural wood, ends past the ridge */{const g1=f(a1+e,c1+e,wh-1.2),g0=f(a0-e,c1+e,wh-1.2),ap=f(am,c1+e,rh),ext=(p,q,k)=>[q[0]+(q[0]-p[0])*k,q[1]+(q[1]-p[1])*k],bc=win?'#B8B0A0':'#8A6A4A';hoLine(g1,ext(g1,ap,0.25),bc,1.3);hoLine(g0,ext(g0,ap,0.25),bc,1.3);}}
function alCobbleDisc(f,R,win,sd){/* dark cobbles laid in rings, flush with the ground, a kerb of dressed stones round the edge */const circ=(r,n)=>{const o=[];for(let k=0;k<n;k++){const t2=k/n*6.283;o.push(f(Math.cos(t2)*r,Math.sin(t2)*r,0));}return o;};
  hoQ(circ(R+0.06,40),win?'#BFC1BD':'#56504A');hoQ(circ(R,40),win?'#C9CBC7':'#3A3632');
  if(zoom>0.9){const step=0.075;for(let r0=0.05;r0<R-0.02;r0+=step){const r1=Math.min(R-0.01,r0+step),rm=(r0+r1)/2,n=Math.max(5,Math.round(6.283*rm/0.085)),off=h2(sd,r0*100|0,13);
    for(let k=0;k<n;k++){const t0=(k+off+0.06)/n*6.283,t1=(k+off+0.94)/n*6.283,tn=h2(sd,(r0*1000|0)+k,14),col=win?(tn>0.5?'#E2E4E0':'#D4D6D2'):(tn>0.8?'#6E685F':tn>0.55?'#605A52':tn>0.25?'#534E47':'#5A544B');
      const q=(r,t2)=>f(Math.cos(t2)*r,Math.sin(t2)*r,0);hoQ([q(r0+0.008,t0),q(r1-0.008,t0),q(r1-0.008,t1),q(r0+0.008,t1)],col);if(!win)hoLine(q(r1-0.01,t0),q(r1-0.01,t1),'rgba(255,250,235,0.09)',0.5);}}}
  const n=28;for(let k=0;k<n;k++){const t0=(k+0.05)/n*6.283,t1=(k+0.95)/n*6.283,q=(r,t2)=>f(Math.cos(t2)*r,Math.sin(t2)*r,0);hoQ([q(R,t0),q(R+0.06,t0),q(R+0.06,t1),q(R,t1)],win?(k%2?'#D4D6D2':'#C4C6C2'):(k%2?'#7E776C':'#8E877B'));}
  if(!win){ctx.fillStyle='rgba(96,120,70,0.4)';for(let k=0;k<7;k++){const t2=h2(sd,k,15)*6.283,p=f(Math.cos(t2)*(R+0.03),Math.sin(t2)*(R+0.03),0);ctx.beginPath();ctx.ellipse(p[0],p[1],2.2,0.8,0,0,6.3);ctx.fill();}}}
function alTorch(p,win){/* small torch on a stake: wrapped head, a little flame and glow */hoLine(p,[p[0],p[1]-11],win?'#C8C2B4':'#4A3424',1.1);ctx.fillStyle=win?'#B8B0A0':'#5A4A3A';ctx.fillRect(p[0]-1.1,p[1]-13,2.2,2.4);if(win)return;
  const tt=typeof t==='number'?t:0,fl=Math.sin(tt*9+p[0])*0.6;ctx.fillStyle='rgba(255,180,80,0.22)';ctx.beginPath();ctx.arc(p[0],p[1]-14,6,0,6.3);ctx.fill();
  ctx.fillStyle='#E8862A';ctx.beginPath();ctx.moveTo(p[0]-1.3,p[1]-13);ctx.quadraticCurveTo(p[0]-1,p[1]-16,p[0]+fl,p[1]-18);ctx.quadraticCurveTo(p[0]+1,p[1]-16,p[0]+1.3,p[1]-13);ctx.fill();ctx.fillStyle='#F8D25A';ctx.beginPath();ctx.ellipse(p[0],p[1]-14.4,0.6,1.3,0,0,6.3);ctx.fill();
  ctx.fillStyle='rgba(255,170,70,0.12)';ctx.beginPath();ctx.ellipse(p[0],p[1],7,3.2,0,0,6.3);ctx.fill();}
function drawAltarOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*7+opt;
  if(opt===1){/* kerb ring of low stones round the cairn, a fire on a hearthstone in front */const R=0.86,N=16,ks=[];for(let k=0;k<N;k++){const t2=(k+0.5)/N*6.283;if(Math.abs(t2-Math.PI/4)<0.22)continue;ks.push({d:Math.cos(t2)+Math.sin(t2),p:f(Math.cos(t2)*R,Math.sin(t2)*R,0),k});}
    ks.sort((x,y)=>x.d-y.d);const back=ks.filter(s=>s.d<0),frontK=ks.filter(s=>s.d>=0);for(const s of back)alStone(s.p,2.6,3.6+h2(sd,s.k,9)*2,sd,s.k,win);
    const bowl=alCairn(f,-0.12,-0.12,win,sd);alBowl(bowl,win);if(!win)hoSmoke([bowl[0],bowl[1]-2]);
    alFire(f(0.45,0.38,0),0.9,win);for(const s of frontK)alStone(s.p,2.6,3.6+h2(sd,s.k,9)*2,sd,s.k,win);}
  else if(opt===2){/* round dark cobbled floor at ground level, five god-posts round its edge (Odin at the back), the altar in the middle, a few small torches */alCobbleDisc(f,0.9,win,sd);
    const R=0.7,items=[];const G=[[9,'Freyja',32],[81,'Loki',31],[153,'Njord',34],[225,'Odin',42],[297,'Thor',35]];for(const [deg,g,H] of G){const an=deg*Math.PI/180,a=Math.cos(an)*R,c=Math.sin(an)*R;items.push({d:a+c,draw:()=>alGodPost(f,a,c,H,AL_GODS.find(x=>x.g===g),win,sd)});}
    for(const deg of [189,261,27,63]){const an=deg*Math.PI/180,a=Math.cos(an)*0.9,c=Math.sin(an)*0.9;items.push({d:a+c,draw:()=>alTorch(f(a,c,0),win)});}
    items.push({d:0,draw:()=>alSlabAltar(f,0,0,0.24,0.24,5,win,sd,true)});
    items.sort((x,y)=>x.d-y.d);for(const it of items)it.draw();}
  else if(opt===3){/* vé: hazel-stave ring with ropes, the shrine at the back, an altar and fire in front of it */alVebond(f,0.92,false,win,0);alShrine(f,win,sd);
    const top=alSlabAltar(f,-0.42,0.3,0.16,0.12,4,win,sd);alBowl(top,win);alFire(f(0.4,0.15,0),0.75,win);alVebond(f,0.92,true,win,0.24);
    for(const an of [Math.PI/4-0.24,Math.PI/4+0.24]){const p=f(Math.cos(an)*0.92,Math.sin(an)*0.92,0),u=f(Math.cos(an)*0.92,Math.sin(an)*0.92,12);hoQ([[p[0]-1,p[1]],[p[0]+1,p[1]],[u[0]+1,u[1]],[u[0]-1,u[1]]],win?'#C8C2B4':'#4A3424');}}
  else{/* blót ring: tall standing stones, boulder altar, an iron cauldron on a tripod over the fire, antlers on a pole */const R=0.86,N=9,ks=[];for(let k=0;k<N;k++){const t2=Math.PI/4+0.45+k/(N-1)*(6.283-0.9);ks.push({d:Math.cos(t2)+Math.sin(t2),p:f(Math.cos(t2)*R,Math.sin(t2)*R,0),k});}
    ks.sort((x,y)=>x.d-y.d);const tall=s=>14+h2(sd,s.k,9)*9;for(const s of ks.filter(s=>s.d<0))alStone(s.p,3.4,tall(s),sd,s.k,win);
    {/* antler pole at the back */const p=f(-0.5,-0.42,0),q=f(-0.5,-0.42,22);hoLine(p,q,win?'#C8C2B4':'#5A4230',1.6);hoAntlers([q[0],q[1]+1],1.25,win?'#E8E2D4':'#D8CCB0');}
    {/* boulder altar: a big flat-topped rock */const p=f(-0.12,-0.12,0);ctx.fillStyle=win?'#C4C6C2':'#7E776C';ctx.beginPath();ctx.moveTo(p[0]-14,p[1]+1);ctx.quadraticCurveTo(p[0]-15,p[1]-6,p[0]-10,p[1]-8);ctx.lineTo(p[0]+9,p[1]-9);ctx.quadraticCurveTo(p[0]+15,p[1]-6,p[0]+14,p[1]+1);ctx.quadraticCurveTo(p[0],p[1]+5,p[0]-14,p[1]+1);ctx.fill();
      ctx.fillStyle=win?'#E8EAE6':'#A39D92';ctx.beginPath();ctx.ellipse(p[0]-0.5,p[1]-8.4,10.5,3.4,-0.04,0,6.3);ctx.fill();ctx.fillStyle='rgba(30,26,20,0.25)';ctx.beginPath();ctx.moveTo(p[0]+4,p[1]+3.5);ctx.quadraticCurveTo(p[0]+13,p[1]+1,p[0]+14,p[1]+1);ctx.quadraticCurveTo(p[0]+15,p[1]-6,p[0]+9,p[1]-9);ctx.quadraticCurveTo(p[0]+8,p[1]-2,p[0]+4,p[1]+3.5);ctx.fill();
      if(!win){ctx.fillStyle='rgba(110,130,70,0.55)';ctx.beginPath();ctx.ellipse(p[0]-9,p[1]-1,3,1.2,0,0,6.3);ctx.fill();ctx.fillStyle='rgba(110,30,20,0.4)';ctx.beginPath();ctx.ellipse(p[0]+2,p[1]-8.2,3,1,0.1,0,6.3);ctx.fill();}alBowl([p[0]-3.5,p[1]-8.2],win);}
    {/* cauldron on a tripod over the fire */const fp=f(0.36,0.2,0);alFire(fp,0.8,win);const top=[fp[0],fp[1]-15];ctx.strokeStyle=win?'#B8B0A0':'#3A2A1C';ctx.lineWidth=1;ctx.beginPath();for(const dx of [-7,6,1]){ctx.moveTo(fp[0]+dx,fp[1]+(dx===1?3:-1));ctx.lineTo(top[0],top[1]);}ctx.stroke();
      hoLine(top,[fp[0],fp[1]-9],'#2A2624',0.5);const cp=[fp[0],fp[1]-6];ctx.fillStyle=win?'#C8C8C4':'#2E2C2A';ctx.beginPath();ctx.moveTo(cp[0]-4,cp[1]-3);ctx.quadraticCurveTo(cp[0]-4.4,cp[1]+2.4,cp[0],cp[1]+2.6);ctx.quadraticCurveTo(cp[0]+4.4,cp[1]+2.4,cp[0]+4,cp[1]-3);ctx.closePath();ctx.fill();
      ctx.fillStyle=win?'#DADAD6':'#4A4644';ctx.beginPath();ctx.ellipse(cp[0],cp[1]-3,4,1.2,0,0,6.3);ctx.fill();ctx.fillStyle=win?'#C8C0B0':'#7A3A26';ctx.beginPath();ctx.ellipse(cp[0],cp[1]-2.9,3.2,0.8,0,0,6.3);ctx.fill();ctx.strokeStyle='#2A2624';ctx.lineWidth=0.5;ctx.beginPath();ctx.arc(cp[0],cp[1]-4,3.6,3.3,6.1);ctx.stroke();if(!win)hoSmoke([cp[0],cp[1]-5]);}
    for(const s of ks.filter(s=>s.d>=0))alStone(s.p,3.4,tall(s)*0.85,sd,s.k,win);}}
{const _shA=shShape;shShape=function(b){if(b.t==='altar'&&ALTAR_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),box=(a,c,s,h)=>({pts:[f(a-s,c-s,0),f(a+s,c-s,0),f(a+s,c+s,0),f(a-s,c+s,0)],h}),V=[];const o=ALTAR_OPT;
  const ringBoxes=(R,n,s,h)=>{for(let k=0;k<n;k++){const t2=o===4?Math.PI/4+0.45+k/(n-1)*(6.283-0.9):(k+0.5)/n*6.283;V.push(box(Math.cos(t2)*R,Math.sin(t2)*R,s,h));}};
  if(o===1){ringBoxes(0.86,16,0.06,0.15);V.push(box(-0.12,-0.12,0.42,0.38));}
  else if(o===2){for(const an of [9,81,153,225,297]){const r=an*Math.PI/180;V.push(box(Math.cos(r)*0.7,Math.sin(r)*0.7,0.06,1.15));}V.push(box(0,0,0.26,0.22));}
  else if(o===3){V.push({pts:[f(-0.42,-0.75,0),f(0.42,-0.75,0),f(0.42,-0.25,0),f(-0.42,-0.25,0)],h:0.7});V.push(box(-0.42,0.3,0.16,0.18));}
  else{ringBoxes(0.86,9,0.09,0.55);V.push(box(-0.12,-0.12,0.32,0.28));}return V;}return _shA(b);};}
{const _gsA=groundShape;groundShape=function(b,win){if(b.t==='altar'&&ALTAR_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*5,ring=(r,n,j)=>{const o=[];for(let k=0;k<n;k++){const t2=k/n*6.283,rr=r*(1+(h2(sd,k,j)-0.5)*0.05);o.push(f(Math.cos(t2)*rr,Math.sin(t2)*rr,0));}return o;};
    hoQ(ring(1.0,28,1),win?'rgba(225,228,224,0.5)':'rgba(120,110,80,0.28)');hoQ(ring(0.9,28,2),win?'rgba(232,230,222,0.85)':'rgba(150,132,96,0.6)');
    if(!win){const g=f(0.62,0.62,0),g2=f(1.0,1.0,0);ctx.strokeStyle='rgba(150,132,96,0.5)';ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(g[0],g[1]);ctx.lineTo(g2[0],g2[1]);ctx.stroke();ctx.lineCap='butt';}
    return true;}return _gsA(b,win);};}

/* =================== Funeral Pyre options (prototype) — window.__setPyre(n) ===================
   2×2, no levels; the fire burns low with smoke (the old pyre glows at night too).
   1 Stone ship setting with a log crib · 2 Log crib on a round stone hearth · 3 Burial mound with a cremation pit and woodpile · 4 Pyre boat on rollers */
let PYRE_OPT=0;window.__setPyre=n=>{PYRE_OPT=n|0;};
/* the pyre only burns while someone is being cremated: S.pyreT is set at each cremation, the fire lasts a day and a half (window.__PYREFIRE forces it for screenshots) */
const PYRE_BURN=DAY*1.5;function pyreBurning(){return !!window.__PYREFIRE||(typeof S==='object'&&S&&S.pyreT!=null&&S.gameT-S.pyreT>=0&&S.gameT-S.pyreT<PYRE_BURN);}
function pyreLight(){if(typeof S==='object'&&S)S.pyreT=S.gameT;}
{const _dsY=drawShaped;drawShaped=function(b,win,c0,ax){if(PYRE_OPT&&b.t==='pyre'){drawPyreOpt(b,win,PYRE_OPT);return true;}return _dsY(b,win,c0,ax);};}
function pyFlames(p,w,h,win,seed){if(win)return;const tt=(typeof t==='number'?t:0)+(seed||0);ctx.fillStyle='rgba(255,160,60,0.16)';ctx.beginPath();ctx.ellipse(p[0],p[1]-h*0.3,w*2.2,h*0.9,0,0,6.3);ctx.fill();
  for(const [c,ww,hh,ph] of [['#B83A1C',1,1,0],['#E07A28',0.72,0.78,1.7],['#F6C452',0.42,0.5,3.1]]){for(let j=-1;j<=1;j++){const x=p[0]+j*w*0.45,fl=Math.sin(tt*7+ph+j*2)*w*0.12,H=h*hh*(j?0.7:1)*(1+Math.sin(tt*5+j+ph)*0.08),W=w*ww*0.55;
    ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x-W,p[1]);ctx.quadraticCurveTo(x-W*0.8,p[1]-H*0.55,x+fl,p[1]-H);ctx.quadraticCurveTo(x+W*0.8,p[1]-H*0.55,x+W,p[1]);ctx.closePath();ctx.fill();}}
  for(let k=0;k<5;k++){const q=(((tt*0.5+k/5)%1)+1)%1;ctx.fillStyle='rgba(255,200,90,'+(0.85*(1-q)).toFixed(2)+')';ctx.fillRect(p[0]+Math.sin(tt*2.6+k*2.1)*w*0.6,p[1]-h*0.8-q*h*1.3,0.8,0.8);}
  for(let k=0;k<4;k++){const q=(((tt*0.18+k/4)%1)+1)%1;ctx.fillStyle='rgba(120,116,110,'+(0.32*(1-q)).toFixed(2)+')';ctx.beginPath();ctx.arc(p[0]+q*10+Math.sin(tt+k)*2,p[1]-h-q*26,2.4+q*5,0,6.3);ctx.fill();}}
function pyCrib(f,a,c,s,layers,r,win,burn){/* square crib of logs, layers crossing, the top layer charred with embers */const fs=(x,y,h)=>f(y,x,h);let h=r;
  for(let k=0;k<layers;k++){const along=k%2===0;for(const o of [-s,0,s]){if(along)hoLog(f,a-s-0.06,a+s+0.06,c+o,h,r,win);else hoLog(fs,c-s-0.06,c+s+0.06,a+o,h,r,win);}h+=r*1.75;}
  if(!win&&burn){const top=[f(a-s,c-s,h-r),f(a+s,c-s,h-r),f(a+s,c+s,h-r),f(a-s,c+s,h-r)];hoQ(top,'rgba(30,18,10,0.75)');for(let k=0;k<10;k++){const p=f(a+(h2(k,3,7)-0.5)*s*1.6,c+(h2(k,5,7)-0.5)*s*1.6,h-r);ctx.fillStyle=k%2?'#E8602A':'#F6A640';ctx.fillRect(p[0]-0.6,p[1]-0.4,1.2,0.8);}}
  return f(a,c,h-r);}
function pyStoneRingFlat(f,a,c,R,n,win,sd){for(let k=0;k<n;k++){const t2=k/n*6.283,p=f(a+Math.cos(t2)*R,c+Math.sin(t2)*R,0),tn=h2(sd,k,31);alCobble([p[0],p[1]-0.8],2.4+tn,1.5+tn*0.4,win?'#D4D6D2':tn>0.5?'#8E877B':'#7A746A',win);}}
function drawPyreOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*9+opt;
  if(opt===1){/* skibssætning: standing stones in a ship outline, taller at stem and stern, the pyre in the middle */const bl=0.92,bw=0.42,W=u=>bw*Math.pow(Math.max(0,1-u*u),0.62),N=11,st=[];
    for(const side of [-1,1])for(let i=0;i<=N;i++){const u=-1+2*i/N;if(side===1&&(i===0||i===N))continue;st.push({a:u*bl,c:side*W(u),h:(Math.abs(u)>0.95?16:6+Math.abs(u)*5)+h2(sd,i+side*20,9)*2,k:i+side*30});}
    st.forEach(s=>s.d=s.a+s.c);st.sort((x,y)=>x.d-y.d);const back=st.filter(s=>s.c<0||s.d<0.0&&s.c===0),frontS=st.filter(s=>!back.includes(s));
    for(const s of back)alStone(f(s.a,s.c,0),2.3,s.h,sd,s.k,win);const burn=pyreBurning(),top=pyCrib(f,0,0,0.17,5,1.5,win,burn);if(burn)pyFlames(top,6,13,win,sd);for(const s of frontS)alStone(f(s.a,s.c,0),2.3,s.h,sd,s.k,win);}
  else if(opt===2){/* low round hearth of dressed stone, ash on top, the crib on it */const R=0.62,hh=4,circ=(r,h2_,n)=>{const o=[];for(let k=0;k<n;k++){const t2=k/n*6.283;o.push(f(Math.cos(t2)*r,Math.sin(t2)*r,h2_));}return o;};
    {const lo=circ(R,0,32),hi=circ(R,hh,32),pts=[];for(let k=0;k<=16;k++)pts.push(lo[(k+28)%32]);for(let k=16;k>=0;k--)pts.push(hi[(k+28)%32]);hoQ(pts,win?'#C4C6C2':'#837D72');
      ctx.strokeStyle='rgba(40,36,30,0.5)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=0;k<16;k++){const t2=(k+0.5)/16*6.283;if(Math.cos(t2)+Math.sin(t2)<-0.3)continue;const p=f(Math.cos(t2)*R,Math.sin(t2)*R,0),q=f(Math.cos(t2)*R,Math.sin(t2)*R,hh);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
      hoQ(hi,win?'#E8EAE6':'#9C968B');hoQ(circ(R-0.07,hh,32),win?'#D8DAD6':'#5A5550');if(!win){ctx.fillStyle='rgba(110,130,70,0.5)';const m=f(R*0.7,R*0.7,1);ctx.beginPath();ctx.ellipse(m[0],m[1],2.6,1,0,0,6.3);ctx.fill();}}
    const fh=(a,c,h)=>f(a,c,h+hh);const top=pyCrib(fh,0,0,0.24,6,1.6,win,true);pyFlames(top,8,15,win,sd);}
  else if(opt===3){/* a low turf barrow at the back with a runestone, a cremation pit in front, firewood stacked beside */
    {const m=(r,h,n)=>{const o=[];for(let k=0;k<n;k++){const t2=k/n*6.283;o.push(f(-0.35+Math.cos(t2)*r*1.15,-0.4+Math.sin(t2)*r*0.95,h));}return o;};for(let j=0;j<6;j++){const r=0.55*(1-j/6),h=j*2.4;hoQ(m(r,h,30),win?shade('#E2E6E0',1-j*0.02):shade('#6E8A48',0.86+j*0.04));}
      if(!win){ctx.strokeStyle='rgba(60,80,40,0.5)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=0;k<26;k++){const t2=h2(sd,k,41)*6.283,r=h2(sd,k,42)*0.5,p=f(-0.35+Math.cos(t2)*r,-0.4+Math.sin(t2)*r*0.8,(1-r/0.55)*12);ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+0.6,p[1]-1.8);}ctx.stroke();}}
    {/* runestone on the mound's front foot */const p=f(0.05,-0.75,0);ctx.fillStyle=win?'#D4D6D2':'#8E877B';ctx.beginPath();ctx.moveTo(p[0]-3.6,p[1]);ctx.lineTo(p[0]-3,p[1]-15);ctx.quadraticCurveTo(p[0],p[1]-19,p[0]+3.2,p[1]-14);ctx.lineTo(p[0]+3.6,p[1]);ctx.closePath();ctx.fill();
      if(!win){ctx.strokeStyle='#A34A3A';ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(p[0]-2,p[1]-1);ctx.quadraticCurveTo(p[0]-2.6,p[1]-12,p[0],p[1]-14.5);ctx.quadraticCurveTo(p[0]+2.6,p[1]-12,p[0]+2,p[1]-1);ctx.stroke();ctx.strokeStyle='rgba(40,30,22,0.6)';ctx.lineWidth=0.4;ctx.beginPath();for(let k=0;k<5;k++){ctx.moveTo(p[0]-0.8,p[1]-3-k*2.2);ctx.lineTo(p[0]+0.8,p[1]-3.6-k*2.2);}ctx.stroke();}}
    {/* woodpile beside the pit */const fs=(x,y,h)=>f(y,x,h);hoLogPile(fs,0.12,0.62,-0.72,[4,3,2],1.5,win);}
    {/* the pit: a ring of stones, charred ground, a low crib burning */const pa=0.25,pc=0.3;const sh=(r,n)=>{const o=[];for(let k=0;k<n;k++){const t2=k/n*6.283;o.push(f(pa+Math.cos(t2)*r,pc+Math.sin(t2)*r,0));}return o;};hoQ(sh(0.42,24),win?'#D8DAD6':'#3A322C');hoQ(sh(0.3,24),win?'#CCCCC8':'#241A14');
      const top=pyCrib(f,pa,pc,0.15,3,1.4,win,true);pyFlames(top,6,11,win,sd);pyStoneRingFlat(f,pa,pc,0.44,16,win,sd);}}
  else{/* pyre boat: a færing filled with split wood, on two log rollers, flames from the hull */const fs=(x,y,h)=>f(y,x,h);for(const u of [-0.45,0.45])hoLog(fs,-0.38,0.38,u,1.6,1.6,win);
    const ff=(a,c,h)=>f(a,c,h+2.4);hoFaering(ff,0,0,0.9,0.26,win,sd);
    for(let i=0;i<9;i++){const u=-0.55+i*0.135,w=0.17*Math.pow(Math.max(0,1-(u/0.9)**2),0.62)/0.26*0.26;hoLog(fs,-w,w,u,10+Math.sin(i)*0.6,1.3,win);}
    for(let i=0;i<7;i++){const u=-0.45+i*0.15;hoLog(fs,-0.1,0.1,u,12.4,1.2,win);}
    pyFlames(f(0,0,13),9,16,win,sd);pyFlames(f(0.45,0.02,12),5,10,win,sd+2);pyFlames(f(-0.45,-0.02,12),5,9,win,sd+4);}}
{const _shY=shShape;shShape=function(b){if(b.t==='pyre'&&PYRE_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),box=(a,c,sa,sc,h)=>({pts:[f(a-sa,c-sc,0),f(a+sa,c-sc,0),f(a+sa,c+sc,0),f(a-sa,c+sc,0)],h}),o=PYRE_OPT;
  if(o===1)return [box(0,0,0.92,0.4,0.25),box(0,0,0.22,0.22,0.3)];if(o===2)return [box(0,0,0.55,0.55,0.13),box(0,0,0.3,0.3,0.45)];if(o===3)return [box(-0.35,-0.4,0.55,0.45,0.35),box(0.05,-0.75,0.08,0.08,0.5),box(-0.72,0.37,0.2,0.25,0.2),box(0.25,0.3,0.2,0.2,0.2)];
  return [box(0,0,0.9,0.28,0.4)];}return _shY(b);};}
{const _gsY=groundShape;groundShape=function(b,win){if(b.t==='pyre'&&PYRE_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*5,o=PYRE_OPT,el=(ra,rc,n,j)=>{const q=[];for(let k=0;k<n;k++){const t2=k/n*6.283,rr=1+(h2(sd,k,j)-0.5)*0.06;q.push(f(Math.cos(t2)*ra*rr,Math.sin(t2)*rc*rr,0));}return q;};
    const [ra,rc]=o===1||o===4?[1.08,0.7]:[1,1];hoQ(el(ra,rc,30,1),win?'rgba(225,228,224,0.5)':'rgba(110,104,92,0.28)');hoQ(el(ra*0.88,rc*0.86,30,2),win?'rgba(232,230,222,0.85)':'rgba(128,120,104,0.55)');
    if(!win){ctx.fillStyle='rgba(60,54,48,0.25)';for(let k=0;k<30;k++){const th=h2(sd,k,3)*6.283,r=h2(sd,k,4)*0.8,p=f(Math.cos(th)*r*ra,Math.sin(th)*r*rc,0);ctx.beginPath();ctx.ellipse(p[0],p[1],1.2+h2(sd,k,5)*1.6,0.6,0,0,6.3);ctx.fill();}}
    return true;}return _gsY(b,win);};}

/* =================== Field options (prototype) — window.__setField(n) ===================
   Grain (barley), Flax and Fodder fields, 3×3. Crops are drawn as upright plants in rows, back to front, and follow the summer
   (window.__SP forces the summer progress 0..1 for screenshots). 1 Wattle fence · 2 Skigard + drying rack (hesje) · 3 Cleared-stone banks + cairn · 4 Open strips with balks and stooks */
let FIELD_OPT=0;window.__setField=n=>{FIELD_OPT=n|0;};
{const _sp=summerProgress;summerProgress=function(){return window.__SP!=null?window.__SP:_sp();};}
{const _dsF=drawShaped;drawShaped=function(b,win,c0,ax){if(FIELD_OPT&&FIELDS.has(b.t)){drawFieldOpt(b,win,FIELD_OPT);return true;}return _dsF(b,win,c0,ax);};}
{const _gsF=groundShape;groundShape=function(b,win){if(FIELD_OPT&&FIELDS.has(b.t))return true;return _gsF(b,win);};}
/* one row of plants along a, at cross position c, from a0 to a1 */
function fdRow(f,t,a0,a1,c,p,win,sd,k,dense){const n=Math.max(3,Math.round((a1-a0)*(dense||17)));const pts=[];for(let i=0;i<n;i++){const a=a0+(i+0.5)/n*(a1-a0)+(h2(sd,k*97+i,61)-0.5)*0.04,cc=c+(h2(sd,k*97+i,62)-0.5)*0.035;pts.push({p:f(a,cc,0),j:h2(sd,k*97+i,63)});}
  if(win){ctx.strokeStyle='rgba(150,140,120,0.55)';ctx.lineWidth=0.6;ctx.beginPath();for(const q of pts){ctx.moveTo(q.p[0],q.p[1]);ctx.lineTo(q.p[0]+0.3,q.p[1]-1.6);}ctx.stroke();return;}
  if(t==='grain'){const g=Math.min(1,0.2+p*1.3),H=8.5*g,col=p>0.8?'#D8B862':p>0.62?'#C3B260':'#7FA05A',colD=p>0.8?'#B8963E':p>0.62?'#9FA04E':'#668A46';
    ctx.strokeStyle=colD;ctx.lineWidth=0.7;ctx.beginPath();for(const q of pts){for(const dx of [-0.9,0.9]){ctx.moveTo(q.p[0]+dx*0.5,q.p[1]);ctx.lineTo(q.p[0]+dx+q.j*0.4,q.p[1]-H*(0.82+q.j*0.15));}}ctx.stroke();
    ctx.strokeStyle=col;ctx.lineWidth=0.75;ctx.beginPath();for(const q of pts){ctx.moveTo(q.p[0],q.p[1]);ctx.lineTo(q.p[0]+0.2,q.p[1]-H);}ctx.stroke();
    if(p>0.35){/* ears: nod over when ripe, with awns */const nod=p>0.75?1:0.3;ctx.strokeStyle=p>0.8?'#E6CC7A':p>0.62?'#CDBE6A':'#8FB064';ctx.lineWidth=1.3;ctx.beginPath();for(const q of pts)for(const dx of [-0.9,0,0.9]){const x=q.p[0]+dx+(dx?q.j*0.4:0.2),y=q.p[1]-H*(dx?0.82+q.j*0.15:1);ctx.moveTo(x,y);ctx.quadraticCurveTo(x+1.2*nod,y-1.2,x+1.8*nod,y-2.4+nod*1.6);}ctx.stroke();
      ctx.strokeStyle='rgba(245,225,160,0.55)';ctx.lineWidth=0.35;ctx.beginPath();for(const q of pts){const x=q.p[0]+0.2,y=q.p[1]-H;ctx.moveTo(x+1.2*nod,y-1.6);ctx.lineTo(x-0.4+2.6*nod,y-4.4+nod*1.4);}ctx.stroke();}}
  else if(t==='flax'){const g=Math.min(1,0.2+p*1.3),H=10*g,col=p>0.8?'#B8A868':'#7E9A62';ctx.strokeStyle=col;ctx.lineWidth=0.55;ctx.beginPath();for(const q of pts)for(const dx of [-0.8,0,0.8]){ctx.moveTo(q.p[0]+dx*0.3,q.p[1]);ctx.lineTo(q.p[0]+dx+q.j*0.3,q.p[1]-H*(dx?0.9:1));}ctx.stroke();
    if(p>0.3&&p<0.78){ctx.fillStyle='#8EA6DA';for(const q of pts)for(const dx of [-0.8,0.8]){ctx.beginPath();ctx.arc(q.p[0]+dx+q.j*0.3,q.p[1]-H*0.9-0.4,0.95,0,6.3);ctx.fill();}ctx.fillStyle='#B8C8EE';for(const q of pts){ctx.beginPath();ctx.arc(q.p[0],q.p[1]-H-0.4,0.8,0,6.3);ctx.fill();}}
    else if(p>=0.78){ctx.fillStyle='#A08848';for(const q of pts)for(const dx of [-0.8,0,0.8]){ctx.beginPath();ctx.arc(q.p[0]+dx+(dx?q.j*0.3:0),q.p[1]-H*(dx?0.9:1)-0.4,0.75,0,6.3);ctx.fill();}}}
  else{/* fodder: grass tufts, oat panicles, a few meadow flowers */const g=Math.min(1,0.25+p*1.4),H=6*g;ctx.strokeStyle=p>0.7?'#A8AA66':'#7E9E58';ctx.lineWidth=0.6;ctx.beginPath();for(const q of pts)for(const dx of [-1.4,-0.6,0.3,1.2]){ctx.moveTo(q.p[0]+dx*0.4,q.p[1]);ctx.quadraticCurveTo(q.p[0]+dx*0.6,q.p[1]-H*0.6,q.p[0]+dx*1.2,q.p[1]-H*(0.7+q.j*0.3));}ctx.stroke();
    if(p>0.4){ctx.strokeStyle=p>0.7?'#D2C27C':'#A6B672';ctx.lineWidth=0.45;ctx.beginPath();for(const q of pts){const x=q.p[0]+0.3,y=q.p[1]-H*1.25;ctx.moveTo(q.p[0],q.p[1]);ctx.lineTo(x,y);for(const s of [-1,1]){ctx.moveTo(x,y+1);ctx.lineTo(x+s*1.2,y+2.6);}}ctx.stroke();}
    if(p>0.25&&p<0.8){for(const q of pts)if(q.j>0.8){ctx.fillStyle=q.j>0.93?'#E8E0F0':q.j>0.86?'#E8C84A':'#C86A8A';ctx.beginPath();ctx.arc(q.p[0]-1,q.p[1]-H*0.8,0.8,0,6.3);ctx.fill();}}}}
function fdSoil(f,E,win,sd,t,rows,irregular){/* the tilled ground with raised ridges along a */const ed=(u)=>irregular?(h2(sd,Math.round(u*13),71)-0.5)*0.12:0;const pts=[];const N=12;
  for(let i=0;i<=N;i++)pts.push(f(-E+2*E*i/N,-E+ed(i/N),0));for(let i=0;i<=N;i++)pts.push(f(E+ed(i/N+3),-E+2*E*i/N,0));for(let i=N;i>=0;i--)pts.push(f(-E+2*E*i/N,E+ed(i/N+5),0));for(let i=N;i>=0;i--)pts.push(f(-E+ed(i/N+7),-E+2*E*i/N,0));
  hoQ(pts,win?'#DDE1DE':t==='fodder'?'#8E9C62':'#7E6A4E');if(win||t==='fodder')return;
  for(let k=0;k<rows.length;k++){const c=rows[k],w=0.055;hoQ([f(-E+0.04,c-w,0),f(E-0.04,c-w,0),f(E-0.04,c+w,0),f(-E+0.04,c+w,0)],'#94805E');hoLine(f(-E+0.04,c+w,0),f(E-0.04,c+w,0),'rgba(50,36,22,0.45)',0.5);}}
function fdStook(f,a,c,win,col){/* a stook: sheaves leaning together, tied */const p=f(a,c,0);ctx.fillStyle=win?'#E4E4DE':col||'#C8A456';ctx.beginPath();ctx.moveTo(p[0]-4.2,p[1]);ctx.lineTo(p[0]-1.2,p[1]-10);ctx.lineTo(p[0]+1.2,p[1]-10);ctx.lineTo(p[0]+4.2,p[1]);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(60,40,10,0.25)';ctx.beginPath();ctx.moveTo(p[0],p[1]-10);ctx.lineTo(p[0]+1.2,p[1]-10);ctx.lineTo(p[0]+4.2,p[1]);ctx.lineTo(p[0]+0.6,p[1]);ctx.closePath();ctx.fill();if(win)return;
  ctx.strokeStyle='rgba(90,64,24,0.6)';ctx.lineWidth=0.4;ctx.beginPath();for(let k=-3;k<=3;k++){ctx.moveTo(p[0]+k*1.1,p[1]);ctx.lineTo(p[0]+k*0.25,p[1]-9.6);}ctx.stroke();hoLine([p[0]-2,p[1]-6.5],[p[0]+2,p[1]-6.5],'#8A6A2A',0.7);
  ctx.fillStyle='#E0C072';ctx.beginPath();ctx.ellipse(p[0],p[1]-10.6,2.2,1.4,0,0,6.3);ctx.fill();}
function fdHesje(f,a0,a1,c,win,t,p,sd){/* hesje: posts with rails, the crop hung over them to dry */const n=Math.max(2,Math.round((a1-a0)/0.45)),H=11;const P=(a,h)=>f(a,c,h);
  for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;hoLine(P(a,0),P(a,H+1.5),win?'#B8B0A0':'#5A4230',1.1);}
  for(const h of [4,7.5,H]){hoLine(P(a0,h),P(a1,h),win?'#C8C2B4':'#7A5A3A',0.5);}
  if(p<0.7&&!win)return;const col=t==='flax'?'#B8A46A':t==='fodder'?'#A8A660':'#D0AE58',colD=t==='flax'?'#9A8650':t==='fodder'?'#8A8A48':'#B0903E';
  for(const h of [7.5,H]){const pts=[];const N=16;for(let i=0;i<=N;i++)pts.push(P(a0+0.03+(a1-a0-0.06)*i/N,h+0.8));for(let i=N;i>=0;i--){const q=P(a0+0.03+(a1-a0-0.06)*i/N,h-3.6-Math.sin(i*1.7+sd)*0.6);pts.push(q);}hoQ(pts,win?'#E8E8E2':col);
    if(!win){ctx.strokeStyle=colD;ctx.lineWidth=0.4;ctx.beginPath();for(let i=0;i<N*2;i++){const q=P(a0+0.05+(a1-a0-0.1)*i/(N*2),h);ctx.moveTo(q[0],q[1]+0.6);ctx.lineTo(q[0]+0.2,q[1]-3.4);}ctx.stroke();}}}
function fdCairn(f,a,c,win,sd){const st=[];for(let k=0;k<14;k++){const r=h2(sd,k,81)*0.16,th=h2(sd,k,82)*6.283,h=(1-r/0.16)*5*(h2(sd,k,83)*0.5+0.5);st.push({d:Math.cos(th)*r+Math.sin(th)*r,h,p:f(a+Math.cos(th)*r,c+Math.sin(th)*r,h),k});}
  st.sort((x,y)=>x.h-y.h||x.d-y.d);for(const s of st){const tn=h2(sd,s.k,84);alCobble(s.p,2+tn,1.4+tn*0.5,win?'#D4D6D2':tn>0.5?'#8E877B':'#7A746A',win);}}
function drawFieldOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*13+opt,t=b.t,p=summerProgress(),E=1.42;
  const reaped=p>=0.92; /* end of summer: grain and flax stand in stooks, fodder in haycocks */
  const fence=(back)=>{const runs=back?[[[-E,-E],[E,-E]],[[-E,-E],[-E,E]]]:[[[E,-E],[E,E]],[[-E,E],[-0.25,E]],[[0.35,E],[E,E]]];
    runs.forEach((r,i)=>{if(opt===1)hoWattle(f,r[0],r[1],6,win,sd+i+(back?0:5));else if(opt===2)hoSkigard(f,r[0],r[1],6.5,win,sd+i+(back?0:5));else if(opt===3)hoStoneWall(f,r[0],r[1],3.5,win,sd+i+(back?0:5));});
    if(!back&&opt!==3){for(const a of [-0.25,0.35]){hoLine(f(a,E,0),f(a,E,9),win?'#B8B0A0':'#3A2A1C',1.5);}}};
  const inner=opt===4?E:E-0.12,rowStep=t==='fodder'?0.16:0.2,rows=[];for(let c=-inner+0.12;c<inner-0.05;c+=rowStep)rows.push(c);
  fdSoil(f,inner,win,sd,t,rows,opt===3);
  if(opt===4&&!win){/* grass balks between three strips */for(const c of [-0.48,0.48]){hoQ([f(-E,c-0.07,0),f(E,c-0.07,0),f(E,c+0.07,0),f(-E,c+0.07,0)],'#8EA060');}}
  if(opt!==4)fence(true);
  if(opt===3)fdCairn(f,-E+0.2,-E+0.2,win,sd);
  const hesC=-inner+0.14,useHesje=opt===2;
  for(let k=0;k<rows.length;k++){const c=rows[k];if(opt===4&&(Math.abs(c+0.48)<0.1||Math.abs(c-0.48)<0.1))continue;
    if(useHesje&&(k===0||(reaped&&k%4===0))){fdHesje(f,-inner+0.15,inner-0.15,c,win,t,p,sd+k);continue;}
    if(reaped&&(t!=='fodder'||opt===1)){/* stubble and stooks */if(!win){ctx.strokeStyle=t==='fodder'?'#9AA462':t==='flax'?'#A89A64':'#B8A060';ctx.lineWidth=0.5;ctx.beginPath();for(let i=0;i<24;i++){const q=f(-inner+0.1+i*(2*inner-0.2)/24,c,0);ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0],q[1]-1.4);}ctx.stroke();}
      continue;}
    if(reaped&&t==='fodder'){if(k%3===1)for(let i=0;i<4;i++){const q=f(-inner+0.4+i*(2*inner-0.8)/3,c,0);ctx.fillStyle=win?'#E8E8E2':'#A8A660';ctx.beginPath();ctx.ellipse(q[0],q[1]-3,5,4.2,0,3.14,6.3);ctx.lineTo(q[0]-5,q[1]-3);ctx.fill();ctx.beginPath();ctx.ellipse(q[0],q[1]-3,5,1.6,0,0,3.14);ctx.fill();if(!win){ctx.fillStyle='rgba(60,60,20,0.2)';ctx.beginPath();ctx.ellipse(q[0]+2,q[1]-3,3,4,0,3.14,6.3);ctx.fill();}}continue;}
    fdRow(f,t,-inner+0.06,inner-0.06,c,opt===4?p*(Math.abs(c)<0.48?1:c<0?0.92:1.05):p,win,sd,k);}
  if(opt===4){/* boundary stone at the front corner */alStone(f(E-0.05,E-0.05,0),2.2,7,sd,3,win);}
  if(opt!==4)fence(false);}
{const _shF=shShape;shShape=function(b){if(FIELD_OPT&&FIELDS.has(b.t))return [];return _shF(b);};}

/* =================== Water Mill options (prototype) — window.__setMill(n) ===================
   2×2 on the bank; millSide(b) tells which edge the river runs along. A frame F is built so the river lies at c = s (s = ±1):
   the mill house stands on the land half, the wheel turns in the river beside its long wall (drawn before the house when the river is behind it).
   1 Log mill, undershot wheel · 2 Plank mill, overshot wheel fed by a flume on trestles · 3 Norse horizontal mill (kvern) on stilts over the stream · 4 Stone mill, big undershot wheel */
let MILL_OPT=0;window.__setMill=n=>{MILL_OPT=n|0;};
{const _dsM=drawShaped;drawShaped=function(b,win,c0,ax){if(MILL_OPT&&b.t==='mill'){drawMillOpt(b,win,MILL_OPT);return true;}return _dsM(b,win,c0,ax);};}
function mlSide(b){/* toward the river water: centroid of river tiles in and around the footprint, relative to its centre */const isR=(x,y)=>inMap(x,y)&&ter[y*N+x]===T.RIVER,cx=b.fx+b.w/2-0.5,cy=b.fy+b.h/2-0.5;let sx=0,sy=0,n=0;
  for(let y=b.fy-1;y<=b.fy+b.h;y++)for(let x=b.fx-1;x<=b.fx+b.w;x++)if(isR(x,y)){const wgt=(x>=b.fx&&x<b.fx+b.w&&y>=b.fy&&y<b.fy+b.h)?2:1;sx+=(x-cx)*wgt;sy+=(y-cy)*wgt;n+=wgt;}
  if(!n)return millSide(b);return Math.abs(sx)>Math.abs(sy)?(sx>0?'+x':'-x'):(sy>0?'+y':'-y');}
function mlFrame(b){const f0=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:0}),side=mlSide(b),s=side[0]==='+'?1:-1,F=side[1]==='y'?f0:(a,c,h)=>f0(c,a,h);return {F,s,side};}
function mlWheel(F,a0,cw,hub,R,win,ang,s,noFoam){/* vertical wheel in the (a,h) plane at c = cw: two rims, paddles between them, spokes, hub; the lower part runs in the water */
  const P=(th,r,c)=>F(a0+Math.cos(th)*r/36,c,hub+Math.sin(th)*r),cB=cw-0.05,cF=cw+0.05,wood=win?'#8A7A64':'#4E3828',lite=win?'#A8987E':'#7A5A3C',n=12;
  const ring=(c,r,col,w)=>{ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();for(let k=0;k<=40;k++){const p=P(k/40*6.283,r,c);k?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();};
  ring(cB,R,wood,1.4);ring(cB,R*0.74,wood,0.9);
  for(let k=0;k<n;k++){const th=ang+k/n*6.283,p1=P(th,R,cB),p2=P(th,R,cF),q1=P(th,R*0.74,cB),q2=P(th,R*0.74,cF);hoQ([p1,p2,q2,q1],k%2?lite:shade(lite,0.85));}
  ctx.strokeStyle=wood;ctx.lineWidth=0.9;ctx.beginPath();for(let k=0;k<6;k++){const th=ang+k/6*6.283,p=P(th,R*0.74,cF),q=P(th+Math.PI,R*0.74,cF);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
  ring(cF,R*0.74,lite,1);ring(cF,R,lite,1.6);const h=P(0,0,cF);ctx.fillStyle=wood;ctx.beginPath();ctx.arc(h[0],h[1],2.2,0,6.3);ctx.fill();ctx.fillStyle='#2E2C2A';ctx.beginPath();ctx.arc(h[0],h[1],1,0,6.3);ctx.fill();
  if(!win&&!noFoam){/* water at the wheel's foot: a band of river colour over the lowest paddles, foam */const wl=0;const pts=[F(a0-R/36-0.08,cB-0.06,wl),F(a0+R/36+0.08,cB-0.06,wl),F(a0+R/36+0.08,cF+0.08,wl),F(a0-R/36-0.08,cF+0.08,wl)];
    ctx.save();ctx.beginPath();ctx.rect(-1e5,P(0,0,cF)[1]-1e3,2e5,1e3);ctx.restore();
    const tt=typeof t==='number'?t:0;ctx.fillStyle='rgba(240,246,248,0.75)';for(let k=0;k<7;k++){const ph=(tt*1.7+k*0.29)%1,p=F(a0+(k-3)*0.07+ph*0.08,cF+0.04,0);ctx.globalAlpha=0.8*(1-ph);ctx.beginPath();ctx.ellipse(p[0],p[1],2.2+ph*2,0.9+ph*0.6,0,0,6.3);ctx.fill();}ctx.globalAlpha=1;}
  return P;}
function mlSacks(p,win,n){if(win)return;const o=[[0,0],[4.5,1.4],[2.2,-2.2],[-3.6,1.6]];for(let i=0;i<(n||3);i++){const q=[p[0]+o[i][0],p[1]+o[i][1]];ctx.fillStyle='#E4D9C0';ctx.beginPath();ctx.ellipse(q[0],q[1]-3,2.6,3.4,0,0,6.3);ctx.fill();ctx.fillStyle='rgba(120,100,60,0.25)';ctx.beginPath();ctx.ellipse(q[0]+1,q[1]-2.6,1.4,3,0,0,6.3);ctx.fill();ctx.fillStyle='#B8A57A';ctx.fillRect(q[0]-1.2,q[1]-7,2.4,1.1);}}
function mlStone(p,win){/* a spare millstone leaning on the wall */ctx.fillStyle=win?'#C2C5C3':'#9C9790';ctx.beginPath();ctx.ellipse(p[0],p[1]-5,2.4,5.4,0,0,6.3);ctx.fill();ctx.fillStyle=win?'#B0B3B1':'#7E7A74';ctx.beginPath();ctx.ellipse(p[0]-0.8,p[1]-5,2,5.2,0,1.57,4.71);ctx.fill();ctx.fillStyle='#5E5A54';ctx.beginPath();ctx.ellipse(p[0],p[1]-5,0.7,1.5,0,0,6.3);ctx.fill();}
function drawMillOpt(b,win,opt){const {F,s}=mlFrame(b),L=Math.min(5,b.lvl||1),sd=(b.id||0)*41+opt,tt=win?0:(typeof t==='number'?t:0),J=WOOD_SET[opt===2?4:opt===4?3:2];
  const hc=-s*0.5,H=(a,c,h)=>F(a,c+hc,h),back=s<0;
  const g={sd,hl:L>=5?0.68:0.6,hw:0.36,fh:2.4,wh:13,rh:12,ov:0.06,th:1.6,wt:opt===1?'logs':'planks',wall:opt===1?'#7E6248':opt===2?'#8E6F52':'#7E7A72',wallD:opt===1?'#5F4936':opt===2?'#6E543D':'#625E57',
    roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,blue:J.blue,frame:opt!==1,frameCol:'#3A2A1C',k:1,v:1};
  if(opt===4){g.wh=17;g.rh=13;g.wall='#8A7A64';g.wallD='#6E604E';}
  const cw=s*0.14,wallC=hc+s*g.hw;
  const house=()=>{const r=hoRoof(H,g,win);r.back();hoFooting(H,g,win);hoWalls(H,g,win);if(opt===4)hoStoneBox(H,0,0,g.hl,g.hw,g.fh,g.fh+8,win,sd);r.end();
    hoDoor(H,g,'G',0,0.17,8.5,{col:'#4A3424',steps:1});if(L>=3)hoWindow(H,g,'L',-0.25,0.1,g.fh+5.5,g.fh+8.6,{shutters:'#7A2E24'});r.front();r.ridge();hoBarge(H,g,'#4A3424',0.25,L>=5);
    if(opt!==4){const dp=H(g.hl+0.12,0.22,0);mlSacks(dp,win,L>=3?4:3);mlStone(H(g.hl+0.06,-0.24,0),win);}};
  const wheelRun=()=>{const ang=tt*(opt===2?0.9:1.3)*-s;
    if(opt===3){/* kvern: a little hut on stilts over the stream, a chute from upstream drives a horizontal wheel under the floor */const kc=s*0.22,K=(a,c,h)=>F(a,c+kc,h),ST=7,gk={sd,hl:0.34,hw:0.3,fh:ST,wh:ST+11,rh:10,ov:0.05,th:1.6,wt:'planks',wall:'#8A7C6A',wallD:'#6E6252',roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:'scale',frame:true,frameCol:'#3A2E24',k:1,v:1};
      /* horizontal wheel under the floor */const hub=F(0,kc,2.2);ctx.fillStyle='rgba(30,40,46,0.35)';ctx.beginPath();ctx.ellipse(hub[0],hub[1]+1,13,5,0,0,6.3);ctx.fill();
      for(let k=0;k<10;k++){const th=tt*2.2+k/10*6.283,p=F(Math.cos(th)*0.3,kc+Math.sin(th)*0.3,2.2),q=F(Math.cos(th)*0.1,kc+Math.sin(th)*0.1,2.2);hoLine(q,p,win?'#A8987E':'#7A5A3C',1.6);}
      hoLine(hub,[hub[0],hub[1]-ST+1],win?'#8A7A64':'#4E3828',1.6);if(!win){const tt2=tt;ctx.fillStyle='rgba(240,246,248,0.7)';for(let k=0;k<6;k++){const ph=(tt2*1.5+k/6)%1,p=F(-0.3+ph*0.6,kc+0.3,0.5);ctx.globalAlpha=0.8*(1-ph);ctx.beginPath();ctx.ellipse(p[0],p[1],2+ph*2,0.8,0,0,6.3);ctx.fill();}ctx.globalAlpha=1;}
      /* chute from upstream (−a), on two trestles */const c0=F(-1.05,kc,6),c1=F(-0.2,kc,3.6);for(const u of [0.25,0.7]){const p=lerp(F(-1.05,kc,0),F(-0.2,kc,0),u),q=lerp(c0,c1,u);hoLine(p,q,win?'#B8B0A0':'#4A3A2C',1.2);}
      hoQ([c0,c1,[c1[0],c1[1]+2.6],[c0[0],c0[1]+2.6]],win?'#B4AEA0':'#6E5038');hoQ([[c0[0],c0[1]-1.6],[c1[0],c1[1]-1.6],c1,c0],win?'#C8C2B4':'#8A6A48');if(!win){ctx.strokeStyle='rgba(170,210,226,0.9)';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(c0[0],c0[1]-0.8);ctx.lineTo(c1[0],c1[1]-0.8);ctx.quadraticCurveTo(c1[0]+3,c1[1]+1,hub[0]-6,hub[1]);ctx.stroke();}
      const r=hoRoof(K,gk,win);r.back();hoStilts(K,-gk.hl,gk.hl,-gk.hw,gk.hw,ST,win);hoWalls(K,gk,win);r.end();hoDoor(K,gk,'G',0,0.15,7.5,{col:'#4A3424'});r.front();r.ridge();hoBarge(K,gk,'#4A3424',0.25,L>=5);
      /* plank bridge from the bank to the door */const j0=gk.hl,jc=kc;hoQ([F(j0,jc-0.09,ST),F(0.95,jc-0.09,ST*0.2),F(0.95,jc+0.09,ST*0.2),F(j0,jc+0.09,ST)],win?'#D0C8B8':'#8A6A48');
      mlSacks(F(0.75,-s*0.55,0),win,L>=3?4:3);mlStone(F(0.45,-s*0.75,0),win);return;}
    const R=opt===2?20:opt===4?21:17,hub=opt===2?R+3:R*0.5;const P=mlWheel(F,0,cw,hub,R,win,ang,s,opt===4);
    /* axle into the mill wall */const h0=P(0,0,cw),h1=F(0,wallC,hub);hoLine(h0,h1,win?'#8A7A64':'#3E2C1E',2);
    if(opt===2){/* flume on trestles from upstream to the top of the wheel */const top=hub+R+3,a1=-R/36*0.2,f0=F(-1.05,cw,top+3),f1=F(a1,cw,top);
      for(const u of [0.2,0.6]){const pa=-1.05+(a1+1.05)*u;hoLine(F(pa,cw,0),F(pa,cw,top+3-3*u),win?'#B8B0A0':'#4A3A2C',1.2);hoLine(F(pa,cw-0.06,0),F(pa,cw-0.06,top+3-3*u),win?'#B8B0A0':'#3A2A1C',1);}
      hoQ([f0,f1,[f1[0],f1[1]+3],[f0[0],f0[1]+3]],win?'#B4AEA0':'#6E5038');hoQ([[f0[0],f0[1]-2],[f1[0],f1[1]-2],f1,f0],win?'#C8C2B4':'#8A6A48');
      if(!win){ctx.strokeStyle='rgba(170,210,226,0.9)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(f0[0],f0[1]-1);ctx.lineTo(f1[0],f1[1]-1);const tp=P(Math.PI/2+0.25,R,cw);ctx.quadraticCurveTo(f1[0]+3,f1[1]+1,tp[0]+1,tp[1]+3);ctx.stroke();}}
    if(opt===4&&!win){/* stone wheel-pit wall along the bank behind the wheel */}};
  if(opt===4){/* wheel-pit: dressed stone walls either side of the wheel, at the bank */const pc=cw-s*0.12;hoStoneWall(F,[-0.75,pc],[0.75,pc],4,win,sd);}
  if(opt===3){wheelRun();return;}
  if(back){wheelRun();house();}else{house();wheelRun();}}
{const _shM=shShape;shShape=function(b){if(b.t==='mill'&&MILL_OPT){const {F,s}=mlFrame(b),hc=-s*0.5,box=(a,c,sa,sc,h)=>({pts:[F(a-sa,c-sc,0),F(a+sa,c-sc,0),F(a+sa,c+sc,0),F(a-sa,c+sc,0)],h});
  if(MILL_OPT===3)return [box(0,s*0.22,0.36,0.32,1),box(0.6,-s*0.55,0.15,0.15,0.2)];return [box(0,hc,0.62,0.38,0.85),box(0,s*0.14,0.55,0.06,1.2)];}return _shM(b);};}

/* =================== Bakery options (prototype) — window.__setBake(n) ===================
   2×2, flat bread from a clay oven. 1 Plank bakehouse + clay dome oven in the yard · 2 Stone bakehouse with the oven built out of its long wall
   3 Plank bakehouse + open shed with a griddle hearth for flatbread · 4 Plank bakehouse + two clay ovens under a shingle canopy */
let BAKE_OPT=0;window.__setBake=n=>{BAKE_OPT=n|0;};
{const _dsB=drawShaped;drawShaped=function(b,win,c0,ax){if(BAKE_OPT&&b.t==='bakery'){drawBakeOpt(b,win,BAKE_OPT);return true;}return _dsB(b,win,c0,ax);};}
function bkOven(f,a,c,r,win,sd,lit,faceC){/* beehive clay oven on a stone plinth, arched mouth toward the viewer (+a), glow inside, a vent at the top */const ph=4;hoStoneBox(f,a,c,r+0.05,r+0.05,0,ph,win,sd);hoQ([f(a-r-0.05,c-r-0.05,ph),f(a+r+0.05,c-r-0.05,ph),f(a+r+0.05,c+r+0.05,ph),f(a-r-0.05,c+r+0.05,ph)],win?'#E2E4E0':'#A39D92');
  const base=f(a,c,ph),rx=r*36*1.05,ry=r*18*1.05,H=r*72,cl=win?'#E8E2D8':'#B8805A',clD=win?'#D4CEC4':'#96643F',clL=win?'#F2EEE6':'#CC9A72';
  ctx.fillStyle=cl;ctx.beginPath();ctx.ellipse(base[0],base[1],rx,ry,0,0,3.1416);ctx.bezierCurveTo(base[0]-rx,base[1]-H*0.9,base[0]+rx,base[1]-H*0.9,base[0]+rx,base[1]);ctx.fill();
  ctx.fillStyle=clD;ctx.beginPath();ctx.moveTo(base[0]+rx*0.15,base[1]+ry);ctx.ellipse(base[0],base[1],rx,ry,0,1.4,0,true);ctx.bezierCurveTo(base[0]+rx,base[1]-H*0.5,base[0]+rx*0.5,base[1]-H*0.72,base[0]+rx*0.1,base[1]-H*0.68);ctx.quadraticCurveTo(base[0]+rx*0.4,base[1]-H*0.2,base[0]+rx*0.15,base[1]+ry);ctx.fill();
  if(!win){ctx.fillStyle=clL;ctx.beginPath();ctx.ellipse(base[0]-rx*0.4,base[1]-H*0.45,rx*0.25,H*0.16,-0.5,0,6.3);ctx.fill();ctx.strokeStyle='rgba(90,56,30,0.35)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=1;k<4;k++){const yy=base[1]-H*k*0.17;ctx.moveTo(base[0]-rx*(1-k*0.12),yy+ry*0.4);ctx.quadraticCurveTo(base[0],yy+ry*1.05,base[0]+rx*(1-k*0.12),yy+ry*0.4);}ctx.stroke();}
  /* mouth: on the +a face, or the +c face when faceC (the arch leans with that face) */const m=faceC?f(a,c+r*0.95,ph):f(a+r*0.95,c,ph),mw=r*16,mh=r*30,sx=faceC?-1:1;
  const arch=(e)=>{ctx.beginPath();ctx.moveTo(m[0]-sx*(mw+e),m[1]-0.5+(e?0.5:0));ctx.lineTo(m[0]-sx*(mw+e),m[1]-mh*0.55-e*0.1);ctx.quadraticCurveTo(m[0],m[1]-mh*1.25-e,m[0]+sx*(mw+e),m[1]-mh*0.55+mw*0.3);ctx.lineTo(m[0]+sx*(mw+e),m[1]+mw*0.5-0.5+(e?0.5:0));};
  ctx.fillStyle=win?'#C8C2B8':'#2A1A10';arch(0);ctx.closePath();ctx.fill();
  if(!win&&lit){ctx.fillStyle='rgba(255,140,50,0.85)';ctx.beginPath();ctx.ellipse(m[0],m[1]-mh*0.2,mw*0.6,mh*0.22,0.45*sx,0,6.3);ctx.fill();ctx.fillStyle='rgba(255,170,80,0.16)';ctx.beginPath();ctx.ellipse(m[0]+3*sx,m[1]+2,12,6,0,0,6.3);ctx.fill();}
  ctx.strokeStyle=win?'#B8B0A4':'#7A4E30';ctx.lineWidth=0.8;arch(0.6);ctx.stroke();
  const v=[base[0]+rx*0.05,base[1]-H*0.72];ctx.fillStyle=win?'#CCC6BC':'#3A2618';ctx.beginPath();ctx.ellipse(v[0],v[1],2,0.9,0,0,6.3);ctx.fill();if(!win&&lit)hoSmoke([v[0],v[1]-1]);}
function bkPeel(p,win){/* a long wooden peel leaning on something */hoLine([p[0],p[1]],[p[0]+3,p[1]-16],win?'#C8C2B4':'#8A6A48',0.9);ctx.fillStyle=win?'#D0C8B8':'#A07E58';ctx.beginPath();ctx.ellipse(p[0]+0.3,p[1]-1.6,2.2,3.2,0.2,0,6.3);ctx.fill();}
function bkLeanTo(f,a0,a1,c0,c1,hB,hF,win,J,sd,posts){/* lean-to rising toward the viewer (+c): posts at the front and the back corner, roof with texture */
  for(const q of posts||[[a0,c1,hF],[a1,c1,hF],[a1,c0,hB]])hoQ([f(q[0]-0.025,q[1],0),f(q[0]+0.025,q[1],0),f(q[0]+0.025,q[1],q[2]),f(q[0]-0.025,q[1],q[2])],win?'#C8C2B4':'#3A2A1C');hoLine(f(a0,c1,hF),f(a1,c1,hF),win?'#C8C2B4':'#3A2A1C',1.2);
  const e=0.05,R=[f(a0-e,c0-e,hB+0.5),f(a1+e,c0-e,hB+0.5),f(a1+e,c1+e,hF+1),f(a0-e,c1+e,hF+1)];hoQ(R,win?'#EEF1F0':J.roof);
  if(!win)hoRoofSurface((u,v)=>lerp(lerp(R[0],R[1],u),lerp(R[3],R[2],u),v),{sd:sd+4,rt:J.rt,rh:8,roofD:J.roofD,blue:J.blue},win);hoQ([R[1],R[2],[R[2][0],R[2][1]+1.6],[R[1][0],R[1][1]+1.6]],shade(J.roofD,0.6));}
function bkFlatbread(p,r,win){ctx.fillStyle=win?'#E8E2D4':'#D8B878';ctx.beginPath();ctx.ellipse(p[0],p[1],r,r*0.45,0,0,6.3);ctx.fill();if(!win){ctx.fillStyle='rgba(140,90,40,0.5)';for(let k=0;k<4;k++){ctx.beginPath();ctx.arc(p[0]+Math.cos(k*1.7)*r*0.5,p[1]+Math.sin(k*1.7)*r*0.2,0.5,0,6.3);ctx.fill();}}}
function bkChimney(f,g,ca,win,sd){/* small stone chimney astride the ridge: its walls start on the roof surface, lead flashing at the joint, a cap slab, smoke */
  const cs=0.075,top=g.wh+g.rh,roofH=c=>top-Math.abs(c)/g.hw*g.rh+0.6,cT=top+7,S1=win?'#C9CBC7':'#8E8980',S2=win?'#B2B4B0':'#76726A',P=(a,c,h)=>f(ca+a,c,h);
  hoQ([P(-cs,cs,roofH(cs)),P(cs,cs,roofH(cs)),P(cs,cs,cT),P(-cs,cs,cT)],S1);
  hoQ([P(cs,-cs,roofH(-cs)),P(cs,0,roofH(0)),P(cs,cs,roofH(cs)),P(cs,cs,cT),P(cs,-cs,cT)],S2);
  if(!win){ctx.strokeStyle='rgba(40,36,30,0.5)';ctx.lineWidth=0.45;ctx.beginPath();for(let h=cT-2;h>roofH(cs)+0.5;h-=2.2){const p=P(-cs,cs,h),q=P(cs,cs,h),r=P(cs,-cs,h);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);if(h>roofH(0))ctx.lineTo(r[0],r[1]);}
    for(let k=0;k*2.2<cT-roofH(cs);k++){const h1=cT-k*2.2,h0=h1-2.2;const u=k%2?0.3:-0.2,p=P(u*cs,cs,h1),q=P(u*cs,cs,Math.max(h0,roofH(cs)));ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
    hoLine(P(-cs-0.01,cs+0.01,roofH(cs)+0.2),P(cs+0.01,cs+0.01,roofH(cs)+0.2),'#5E646A',1);}
  const e=0.02;hoQ([P(-cs-e,cs+e,cT),P(cs+e,cs+e,cT),P(cs+e,cs+e,cT+1.4),P(-cs-e,cs+e,cT+1.4)],win?'#D4D6D2':'#9C978D');hoQ([P(cs+e,-cs-e,cT),P(cs+e,cs+e,cT),P(cs+e,cs+e,cT+1.4),P(cs+e,-cs-e,cT+1.4)],win?'#C0C2BE':'#827D74');
  hoQ([P(-cs-e,-cs-e,cT+1.4),P(cs+e,-cs-e,cT+1.4),P(cs+e,cs+e,cT+1.4),P(-cs-e,cs+e,cT+1.4)],win?'#E8EAE6':'#ABA69B');{const m=P(0,0,cT+1.4);ctx.fillStyle='#2A2624';ctx.beginPath();ctx.ellipse(m[0],m[1],2,1,0,0,6.3);ctx.fill();if(!win)hoSmoke([m[0],m[1]-1]);}}
function drawBakeOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),L=Math.min(5,b.lvl||1),sd=(b.id||0)*43+opt,lit=!win&&(b.workers>0||b.gallery||true),J=WOOD_SET[opt===2?3:2];
  const big=L>=5,fw=(a,c,h)=>f(a-0.38,c-0.42,h);
  const g={sd,hl:big?0.56:0.46,hw:0.36,fh:2.4,wh:12,rh:12,ov:0.06,th:1.6,wt:'planks',wall:opt===2?'#8A7A64':'#9A7A52',wallD:opt===2?'#6E604E':'#7A5E3E',roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,blue:J.blue,frame:true,frameCol:'#3A2A1C',k:1,v:1};
  const house=(extra)=>{const r=hoRoof(fw,g,win);r.back();hoFooting(fw,g,win);hoWalls(fw,g,win);if(opt===2)hoStoneBox(fw,0,0,g.hl,g.hw,g.fh,g.wh,win,sd);r.end();
    hoDoor(fw,g,'G',0,0.16,8.5,{col:'#4A3424',steps:1});if(L>=3)hoWindow(fw,g,'L',-0.18,0.1,g.fh+5,g.fh+8,{shutters:'#7A2E24'});if(extra)extra();r.front();r.ridge();hoBarge(fw,g,'#4A3424',0.25,L>=5);};
  if(opt===1){house();hoLogPile(f,0.35,0.85,-0.75,[3,2],1.4,win);bkOven(f,0.42,0.3,0.26,win,sd,lit);bkPeel(f(0.1,0.62,0),win);if(L>=3){const p=f(0.82,-0.2,0);/* bread on a little bench */hoBox(f,0.8,-0.25,0.09,0,4,win?'#D0C8B8':'#8A6A48',win?'#B8B0A0':'#6E5038',win);bkFlatbread(f(0.8,-0.25,4.3),2.6,win);}}
  else if(opt===2){/* stone bakehouse, the oven inside: a small stone chimney through the ridge (José) */house();bkChimney(fw,g,0.06,win,sd);}
  else if(opt===3){house();/* open shed in front with a long hearth and a griddle, flatbread on a rack */const sh=(a,c,h)=>f(a+0.42,c+0.2,h),sl=0.5,sw=0.34,hB=12,hF=20;
    hoQ([sh(-sl,-sw,0),sh(sl,-sw,0),sh(sl,sw,0),sh(-sl,sw,0)],'rgba(70,60,50,0.35)');hoQ([sh(-sl,-sw,0),sh(sl,-sw,0),sh(sl,-sw,hB),sh(-sl,-sw,hB)],win?'#C8C2B4':'#4A3424');
    if(!win)for(let k=0;k<5;k++){const p=sh(-0.35+k*0.17,-sw+0.01,7);ctx.fillStyle='#D8B878';ctx.beginPath();ctx.ellipse(p[0],p[1],2.6,2.6,0,0,6.3);ctx.fill();ctx.strokeStyle='rgba(140,90,40,0.5)';ctx.lineWidth=0.4;ctx.stroke();}
    hoStoneBox(sh,-0.15,0.14,0.26,0.14,0,5,win,sd);hoQ([sh(-0.41,0,5),sh(0.11,0,5),sh(0.11,0.28,5),sh(-0.41,0.28,5)],win?'#D8DAD6':'#9C978D');
    {const m=sh(-0.15,0.14,5.2);ctx.fillStyle='rgba(255,140,50,0.5)';ctx.beginPath();ctx.ellipse(m[0],m[1]+1,9,3,0,0,6.3);ctx.fill();ctx.fillStyle=win?'#B8B8B4':'#2E2C2A';ctx.beginPath();ctx.ellipse(m[0],m[1]-0.6,6.2,3,0,0,6.3);ctx.fill();bkFlatbread([m[0]-1,m[1]-1],3.6,win);if(!win)hoSmoke([m[0],m[1]-3]);}
    hoBox(sh,0.3,0.12,0.12,0,5,win?'#D0C8B8':'#8A6A48',win?'#B8B0A0':'#6E5038',win);bkFlatbread(sh(0.3,0.12,5.4),2.6,win);bkFlatbread(sh(0.26,0.08,6),2.4,win);
    bkLeanTo(sh,-sl,sl,-sw,sw,hB,hF,win,J,sd);}
  else{house();/* two clay ovens under a canopy on posts */const cf=(a,c,h)=>f(a+0.45,c+0.15,h);bkOven(cf,0.05,-0.18,0.2,win,sd,lit);bkOven(cf,0.05,0.25,0.2,win,sd+1,lit);
    bkLeanTo(cf,-0.35,0.45,-0.45,0.5,16,22,win,J,sd,[[-0.35,0.5,22],[0.45,0.5,22],[0.45,-0.45,16]]);hoLogPile(f,-0.9,-0.4,0.75,[3,2],1.4,win);}}
{const _shB=shShape;shShape=function(b){if(b.t==='bakery'&&BAKE_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),box=(a,c,sa,sc,h)=>({pts:[f(a-sa,c-sc,0),f(a+sa,c-sc,0),f(a+sa,c+sc,0),f(a-sa,c+sc,0)],h});
  const V=[box(-0.38,-0.42,0.5,0.4,0.75)];if(BAKE_OPT===1)V.push(box(0.42,0.3,0.3,0.3,0.4));else if(BAKE_OPT===3)V.push(box(0.42,0.2,0.5,0.34,0.45));else if(BAKE_OPT===4)V.push(box(0.5,0.17,0.4,0.48,0.5));return V;}return _shB(b);};}

/* =================== Brewery options (prototype) — window.__setBrew(n) ===================
   2×2, ale from grain and mead from honey. 1 Plank brewhouse + porch with a copper kettle and mash vat · 2 Stone brewhouse with a chimney + barrel lean-to
   3 Log brewhouse with a steam louvre + open shed of tall vats · 4 Brewhouse + round stone malt kiln */
let BREW_OPT=0;window.__setBrew=n=>{BREW_OPT=n|0;};
{const _dsW=drawShaped;drawShaped=function(b,win,c0,ax){if(BREW_OPT&&b.t==='brewery'){drawBrewOpt(b,win,BREW_OPT);return true;}return _dsW(b,win,c0,ax);};}
function brSteam(p,win,k){if(win)return;const tt=(typeof t==='number'?t:0)+(k||0);for(let i=0;i<4;i++){const q=(((tt*0.35+i/4)%1)+1)%1;ctx.fillStyle='rgba(245,245,240,'+(0.45*(1-q)).toFixed(2)+')';ctx.beginPath();ctx.arc(p[0]+Math.sin(tt*1.3+i)*2+q*4,p[1]-q*16,1.8+q*3.6,0,6.3);ctx.fill();}}
function brBarrel(p,s,win,col){/* upright staved barrel: bulging body, iron hoops, lid */const w=3.2*s,h=7.5*s,C=win?'#D0C8B8':col||'#8A5E36',CD=win?'#B8B0A0':shade(col||'#8A5E36',0.75);
  ctx.fillStyle=C;ctx.beginPath();ctx.moveTo(p[0]-w*0.88,p[1]);ctx.quadraticCurveTo(p[0]-w*1.12,p[1]-h/2,p[0]-w*0.88,p[1]-h);ctx.lineTo(p[0]+w*0.88,p[1]-h);ctx.quadraticCurveTo(p[0]+w*1.12,p[1]-h/2,p[0]+w*0.88,p[1]);ctx.closePath();ctx.fill();
  ctx.fillStyle=CD;ctx.beginPath();ctx.moveTo(p[0]+w*0.2,p[1]);ctx.lineTo(p[0]+w*0.2,p[1]-h);ctx.lineTo(p[0]+w*0.88,p[1]-h);ctx.quadraticCurveTo(p[0]+w*1.12,p[1]-h/2,p[0]+w*0.88,p[1]);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.ellipse(p[0],p[1],w*0.88,w*0.4,0,0,3.14);ctx.fill();
  if(!win){ctx.strokeStyle='#2E2C2A';ctx.lineWidth=0.6;for(const u of [0.16,0.84]){ctx.beginPath();ctx.ellipse(p[0],p[1]-h*u,w*1.02,w*0.4,0,0,3.14);ctx.stroke();}ctx.strokeStyle='rgba(40,24,12,0.35)';ctx.lineWidth=0.35;ctx.beginPath();for(const u of [-0.5,0,0.5]){ctx.moveTo(p[0]+u*w,p[1]+w*0.3);ctx.lineTo(p[0]+u*w,p[1]-h+w*0.3);}ctx.stroke();}
  ctx.fillStyle=win?'#E2DCD0':shade(col||'#8A5E36',1.12);ctx.beginPath();ctx.ellipse(p[0],p[1]-h,w*0.88,w*0.4,0,0,6.3);ctx.fill();}
function brVat(p,s,win,steam){/* tall open vat with hoops, dark liquid, steam */const w=6*s,h=12*s;brBarrel(p,s*1.9,win,'#7A5232');const top=[p[0],p[1]-h*1.2];ctx.fillStyle=win?'#C8C0B0':'#3A2412';ctx.beginPath();ctx.ellipse(top[0],top[1],w*0.85,w*0.36,0,0,6.3);ctx.fill();if(!win){ctx.fillStyle='rgba(200,150,60,0.4)';ctx.beginPath();ctx.ellipse(top[0]-1,top[1]-0.2,w*0.5,w*0.18,0,0,6.3);ctx.fill();}if(steam)brSteam([top[0],top[1]-1],win,p[0]);}
function brKettle(f,a,c,win,sd){/* copper kettle on a stone hearth, fire under it, steam */hoStoneBox(f,a,c,0.13,0.12,0,4.5,win,sd);hoQ([f(a-0.13,c-0.12,4.5),f(a+0.13,c-0.12,4.5),f(a+0.13,c+0.12,4.5),f(a-0.13,c+0.12,4.5)],win?'#D8DAD6':'#9C978D');
  const m=f(a,c,4.5);if(!win){ctx.fillStyle='rgba(255,140,60,0.75)';ctx.beginPath();ctx.ellipse(m[0],m[1]+0.5,4.2,1.8,0,0,6.3);ctx.fill();}
  const k0=f(a,c,5.4);ctx.fillStyle=win?'#D4CCC0':'#9A5630';ctx.beginPath();ctx.ellipse(k0[0],k0[1],5.6,2.6,0,0,3.14);ctx.lineTo(k0[0]-5.6,k0[1]-5);ctx.ellipse(k0[0],k0[1]-5,5.6,2.6,0,3.14,0,true);ctx.closePath();ctx.fill();
  if(!win){ctx.fillStyle='rgba(255,210,160,0.35)';ctx.fillRect(k0[0]-4.4,k0[1]-4.6,1.4,4.6);}ctx.fillStyle=win?'#E2DCD0':'#C27A44';ctx.beginPath();ctx.ellipse(k0[0],k0[1]-5,5.6,2.6,0,0,6.3);ctx.fill();ctx.fillStyle=win?'#C8C0B0':'#5A3418';ctx.beginPath();ctx.ellipse(k0[0],k0[1]-5,4.6,2,0,0,6.3);ctx.fill();brSteam([k0[0],k0[1]-6],win,a*10);}
function brKiln(f,a,c,win,sd,J){/* round stone malt kiln, conical scale-shingle roof, smoke from the top */const R=0.22,H=13,ring=(r,h,n)=>{const o=[];for(let k=0;k<n;k++){const t2=k/n*6.283;o.push(f(a+Math.cos(t2)*r,c+Math.sin(t2)*r,h));}return o;};
  {const lo=ring(R,0,24),hi=ring(R,H,24),pts=[];for(let k=0;k<=12;k++)pts.push(lo[(k+21)%24]);for(let k=12;k>=0;k--)pts.push(hi[(k+21)%24]);hoQ(pts,win?'#C9CBC7':'#8E8980');
    if(!win){ctx.strokeStyle='rgba(40,36,30,0.45)';ctx.lineWidth=0.45;ctx.beginPath();for(let h=2.2;h<H;h+=2.2){const r=ring(R,h,24);for(let k=0;k<=12;k++){const p=r[(k+21)%24];k?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}}ctx.stroke();
      ctx.fillStyle='rgba(30,26,22,0.25)';const rp=[];for(let k=0;k<=6;k++)rp.push(lo[(k+3)%24]);for(let k=6;k>=0;k--)rp.push(hi[(k+3)%24]);hoQ(rp,'rgba(30,26,22,0.22)');}
    /* stoke hole facing the viewer */const sp=f(a+R*0.71,c+R*0.71,0);ctx.fillStyle='#2A1A10';ctx.beginPath();ctx.moveTo(sp[0]-2.4,sp[1]);ctx.lineTo(sp[0]-2.4,sp[1]-3.4);ctx.quadraticCurveTo(sp[0],sp[1]-6,sp[0]+2.4,sp[1]-3.4);ctx.lineTo(sp[0]+2.4,sp[1]);ctx.fill();if(!win){ctx.fillStyle='rgba(255,130,50,0.7)';ctx.beginPath();ctx.ellipse(sp[0],sp[1]-1,1.6,0.9,0,0,6.3);ctx.fill();}}
  /* cone roof */const ap=f(a,c,H+12),eave=ring(R+0.07,H-1,24);const front=[];for(let k=0;k<=12;k++)front.push(eave[(k+21)%24]);hoQ(front.concat([ap]),win?'#EEF1F0':J.roof);
  if(!win){ctx.strokeStyle='rgba(10,8,6,0.45)';ctx.lineWidth=0.5;ctx.beginPath();for(let r=1;r<5;r++){const u=r/5;for(let k=0;k<=12;k++){const e=eave[(k+21)%24],p=lerp(e,ap,u);k?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}}for(let k=0;k<=12;k+=2){const e=eave[(k+21)%24];ctx.moveTo(e[0],e[1]);ctx.lineTo(ap[0],ap[1]);}ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.08)';const hl=[];for(let k=0;k<=5;k++)hl.push(eave[(k+21)%24]);hoQ(hl.concat([ap]),'rgba(255,255,255,0.08)');}
  hoLine([ap[0],ap[1]],[ap[0],ap[1]-3],win?'#B8B0A0':'#3A2A1C',1.2);if(!win)hoSmoke([ap[0],ap[1]-3]);}
function drawBrewOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),L=Math.min(5,b.lvl||1),sd=(b.id||0)*47+opt,J=WOOD_SET[opt===1?4:opt===2?3:2],fw=(a,c,h)=>f(a-0.38,c-0.42,h);
  const g={sd,hl:L>=5?0.56:0.46,hw:0.36,fh:2.4,wh:12,rh:12,ov:0.06,th:1.6,wt:opt===3?'logs':'planks',wall:opt===1?'#9A7A52':opt===2?'#8A7A64':'#7E6248',wallD:opt===1?'#7A5E3E':opt===2?'#6E604E':'#5F4936',
    roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,blue:J.blue,frame:opt!==3,frameCol:'#3A2A1C',k:1,v:1};
  const house=()=>{const r=hoRoof(fw,g,win);r.back();hoFooting(fw,g,win);hoWalls(fw,g,win);if(opt===2)hoStoneBox(fw,0,0,g.hl,g.hw,g.fh,g.wh,win,sd);r.end();
    hoDoor(fw,g,'G',0,0.16,8.5,{col:'#4A3424',steps:1});if(L>=3)hoWindow(fw,g,'L',-0.18,0.1,g.fh+5,g.fh+8,{shutters:'#2E4A5E'});r.front();r.ridge();hoBarge(fw,g,'#4A3424',0.25,L>=5);};
  if(opt===1){house();const sh=(a,c,h)=>f(a+0.42,c+0.2,h),sl=0.5,sw=0.34;hoQ([sh(-sl,-sw,0),sh(sl,-sw,0),sh(sl,sw,0),sh(-sl,sw,0)],'rgba(70,60,50,0.3)');
    brKettle(sh,-0.2,0.1,win,sd);brVat(sh(0.22,0.0,0),0.8,win,false);brBarrel(sh(0.36,0.26,0),1,win);brBarrel(sh(0.22,0.3,0),1,win);
    bkLeanTo(sh,-sl,sl,-sw,sw,12,20,win,J,sd);}
  else if(opt===2){house();bkChimney(fw,g,0.06,win,sd);/* barrel rack under a small lean-to on the front side */const rk=(a,c,h)=>f(a+0.5,c+0.45,h);
    for(let i=0;i<3;i++)brBarrel(rk(-0.25+i*0.22,-0.12,0),1.05,win);for(let i=0;i<3;i++)brBarrel(rk(-0.3+i*0.22,0.15,0),1.05,win);
    bkLeanTo(rk,-0.42,0.38,-0.3,0.3,11,17,win,J,sd);}
  else if(opt===3){house();/* steam louvre on the ridge */{const top=g.wh+g.rh,P=(a,c,h)=>fw(a,c,h),la=0.05,lw=0.1,lc=0.08;hoQ([P(la-lw,lc,top-2),P(la+lw,lc,top-2),P(la+lw,lc,top+4),P(la-lw,lc,top+4)],win?'#C8C2B4':'#4A3424');
      if(!win){ctx.strokeStyle='#2A1F18';ctx.lineWidth=0.6;ctx.beginPath();for(let h=top-1;h<top+4;h+=1.4){const p=P(la-lw,lc,h),q=P(la+lw,lc,h-0.6);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();}
      hoQ([P(la-lw-0.03,-lc-0.04,top+5),P(la+lw+0.03,-lc-0.04,top+5),P(la+lw+0.03,lc+0.04,top+3.6),P(la-lw-0.03,lc+0.04,top+3.6)],win?'#EEF1F0':J.roof);brSteam(P(la,0,top+6),win,1);}
    const sh=(a,c,h)=>f(a+0.42,c+0.2,h),sl=0.5,sw=0.34;hoQ([sh(-sl,-sw,0),sh(sl,-sw,0),sh(sl,sw,0),sh(-sl,sw,0)],'rgba(70,60,50,0.3)');
    brVat(sh(-0.25,-0.02,0),0.85,win,true);brVat(sh(0.12,-0.04,0),0.85,win,true);brBarrel(sh(0.36,0.24,0),1,win);brBarrel(sh(-0.36,0.26,0),1,win);
    bkLeanTo(sh,-sl,sl,-sw,sw,12,20,win,J,sd);}
  else if(opt===5){/* big A-frame brewhouse: the roof comes down to a low stone footing, plank gable with a tall door and a vent, steam from ridge louvres; two barrels against the gable (José) */
    const R=WOOD_SET[4],hl=L>=5?0.84:0.78,fwa=(a,c,h)=>f(a-0.08,c,h),ga={sd,hl,hw:0.72,fh:2.4,wh:3.4,rh:L>=5?42:38,ov:0.05,th:1.8,wt:'planks',wall:'#7A5E46',wallD:'#5E4834',roof:R.roof,roofD:R.roofD,roofE:shade(R.roofD,0.7),rt:R.rt,frame:true,frameCol:'#3A2A1C',k:1,v:1};
    const r=hoRoof(fwa,ga,win);r.back();hoFooting(fwa,ga,win);hoWalls(fwa,ga,win);r.end();
    {const P=(c,h)=>fwa(ga.hl+0.004,c,h),dw=0.13,dh=15;hoQ([P(-dw,ga.fh),P(dw,ga.fh),P(dw,ga.fh+dh),P(0,ga.fh+dh+4),P(-dw,ga.fh+dh)],'#4A3424');ctx.strokeStyle='rgba(20,12,6,0.5)';ctx.lineWidth=0.45;ctx.beginPath();for(const c of [-0.065,0,0.065]){const p=P(c,ga.fh),q=P(c,ga.fh+dh+(c?2:4));ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
      for(const hh of [ga.fh+3,ga.fh+dh-2.5])hoLine(P(-dw+0.01,hh),P(dw-0.01,hh),'#2A2622',0.8);{const rr=P(dw*0.55,ga.fh+dh*0.5);ctx.strokeStyle='#2A2622';ctx.lineWidth=0.6;ctx.beginPath();ctx.arc(rr[0],rr[1]+0.8,1,0,6.3);ctx.stroke();}
      for(const c of [-dw-0.02,dw+0.02])hoLine(P(c,ga.fh),P(c,ga.fh+dh+0.3),'#3A2A1C',1.3);hoLine(P(-dw-0.02,ga.fh+dh+0.3),P(0,ga.fh+dh+4.4),'#3A2A1C',1.3);hoLine(P(dw+0.02,ga.fh+dh+0.3),P(0,ga.fh+dh+4.4),'#3A2A1C',1.3);
      const vh=ga.wh+ga.rh-11;hoQ([P(-0.07,vh),P(0.07,vh),P(0.07,vh+5),P(-0.07,vh+5)],'#1E1A16');for(let h=vh+0.6;h<vh+5;h+=1)hoLine(P(-0.07,h),P(0.07,h+0.4),'#7A5A3C',0.6);
      const st=fwa(ga.hl+0.1,0,0);ctx.fillStyle=win?'#E2E4E0':'#8E877B';ctx.beginPath();ctx.ellipse(st[0],st[1],5,2.1,0,0,6.3);ctx.fill();
      /* two barrels standing against the gable, either side of the door */brBarrel(fwa(ga.hl+0.09,-0.36,0),1.15,win);brBarrel(fwa(ga.hl+0.09,0.36,0),1.15,win);}
    r.front();r.ridge();hoBarge(fwa,ga,'#4A3424',0.22,L>=5);bkChimney(fwa,ga,-0.12,win,sd);}
  else{house();brKiln(f,0.48,0.42,win,sd,J);for(let i=0;i<3;i++)brBarrel(f(0.82-i*0.0,-0.25+i*0.18,0),1,win);brBarrel(f(-0.1,0.8,0),1,win);brBarrel(f(0.08,0.86,0),1,win);}}
{const _shW=shShape;shShape=function(b){if(b.t==='brewery'&&BREW_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),box=(a,c,sa,sc,h)=>({pts:[f(a-sa,c-sc,0),f(a+sa,c-sc,0),f(a+sa,c+sc,0),f(a-sa,c+sc,0)],h});
  if(BREW_OPT===5)return [box(-0.08,0,0.82,0.75,0.15),box(-0.08,0,0.82,0.05,1.6)];const V=[box(-0.38,-0.42,0.5,0.4,0.75)];if(BREW_OPT===1||BREW_OPT===3)V.push(box(0.42,0.2,0.5,0.34,0.5));else if(BREW_OPT===2)V.push(box(0.5,0.45,0.4,0.3,0.45));else V.push(box(0.48,0.42,0.24,0.24,0.8));return V;}return _shW(b);};}

/* =================== Weaver options (prototype) — window.__setWeave(n) ===================
   2×2, wool → sailcloth, flax → rope. 1 Plank weaving house + porch with a warp-weighted loom · 2 House + rope walk with a twisting wheel
   3 House + a striped sail stretched on a drying frame · 4 Sunken weaving hut (roof to the ground) with an open gable showing the loom */
let WEAVE_OPT=0;window.__setWeave=n=>{WEAVE_OPT=n|0;};
{const _dsV=drawShaped;drawShaped=function(b,win,c0,ax){if(WEAVE_OPT&&b.t==='weaver'){drawWeaveOpt(b,win,WEAVE_OPT);return true;}return _dsV(b,win,c0,ax);};}
function wvLoom(f,a0,a1,c,H,win,sd){/* warp-weighted loom in the (a,h) plane at c: two uprights leaning back, a cloth beam on top, warp threads, a heddle rod, a row of loom weights, woven cloth with bands at the top */
  const lean=-0.06,P=(a,h)=>f(a,c+lean*h/H,h),wood=win?'#B8B0A0':'#6E5038';
  hoLine(P(a0,0),P(a0,H+2),wood,1.4);hoLine(P(a1,0),P(a1,H+2),wood,1.4);hoLine(P(a0-0.04,H),P(a1+0.04,H),wood,1.8);
  /* cloth already woven, rolled down from the beam */const ch=H*0.32;hoQ([P(a0+0.03,H-0.5),P(a1-0.03,H-0.5),P(a1-0.03,H-ch),P(a0+0.03,H-ch)],win?'#E8E4DC':'#D8CDB4');
  if(!win){for(const [u,col] of [[0.25,'#A34A3A'],[0.55,'#2E4A5E'],[0.8,'#A34A3A']])hoQ([P(a0+0.03,H-ch*u),P(a1-0.03,H-ch*u),P(a1-0.03,H-ch*u-1.2),P(a0+0.03,H-ch*u-1.2)],col);
    ctx.strokeStyle='rgba(240,232,214,0.7)';ctx.lineWidth=0.3;ctx.beginPath();const n=Math.round((a1-a0)*80);for(let i=0;i<=n;i++){const a=a0+0.03+(a1-a0-0.06)*i/n,p=P(a,H-ch),q=P(a+(i%2?0.004:-0.004),3.4);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
    hoLine(P(a0-0.02,H*0.45),P(a1+0.02,H*0.45),wood,0.9);/* weights */for(let i=0;i<Math.round((a1-a0)*28);i++){const a=a0+0.05+(a1-a0-0.1)*i/Math.max(1,Math.round((a1-a0)*28)-1),p=P(a,2.6+(i%2)*1.2);ctx.fillStyle='#8E877B';ctx.beginPath();ctx.arc(p[0],p[1],1.1,0,6.3);ctx.fill();ctx.fillStyle='#4E4A44';ctx.beginPath();ctx.arc(p[0],p[1],0.35,0,6.3);ctx.fill();}}}
function wvBasket(p,win,col){ctx.fillStyle=win?'#D0C8B8':'#9A7A4A';ctx.beginPath();ctx.moveTo(p[0]-3.4,p[1]-4);ctx.lineTo(p[0]-2.8,p[1]);ctx.lineTo(p[0]+2.8,p[1]);ctx.lineTo(p[0]+3.4,p[1]-4);ctx.closePath();ctx.fill();if(!win){ctx.strokeStyle='rgba(60,40,20,0.5)';ctx.lineWidth=0.4;ctx.beginPath();for(let k=1;k<4;k++){ctx.moveTo(p[0]-3.3+k*0.15,p[1]-k);ctx.lineTo(p[0]+3.3-k*0.15,p[1]-k);}ctx.stroke();}
  ctx.fillStyle=win?'#EEEAE2':col||'#E8E2D4';ctx.beginPath();ctx.ellipse(p[0],p[1]-4.4,3.4,1.6,0,0,6.3);ctx.fill();ctx.beginPath();ctx.arc(p[0]-1,p[1]-5.2,1.4,0,6.3);ctx.arc(p[0]+1.2,p[1]-5,1.3,0,6.3);ctx.fill();}
function wvCoil(p,win){ctx.strokeStyle=win?'#C8C0B0':'#B89A62';ctx.lineWidth=1;for(let k=0;k<3;k++){ctx.beginPath();ctx.ellipse(p[0],p[1]-1-k*1.1,4-k*0.4,1.8-k*0.15,0,0,6.3);ctx.stroke();}}
function drawWeaveOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),L=Math.min(5,b.lvl||1),sd=(b.id||0)*53+opt,J=WOOD_SET[opt===1?1:opt===3?4:2],fw=(a,c,h)=>f(a-0.38,c-0.42,h);
  const g={sd,hl:L>=5?0.56:0.46,hw:0.36,fh:2.4,wh:12,rh:12,ov:0.06,th:J.rt==='thatch'?4:1.6,wt:'planks',wall:'#9A7A52',wallD:'#7A5E3E',roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,blue:J.blue,frame:true,frameCol:'#3A2A1C',k:1,v:1};
  const house=()=>{const r=hoRoof(fw,g,win);r.back();hoFooting(fw,g,win);hoWalls(fw,g,win);r.end();hoDoor(fw,g,'G',0,0.16,8.5,{col:'#4A3424',steps:1});if(L>=3)hoWindow(fw,g,'L',-0.18,0.1,g.fh+5,g.fh+8,{shutters:'#A34A3A'});r.front();r.ridge();hoBarge(fw,g,'#4A3424',0.25,L>=5);};
  if(opt===1){house();const sh=(a,c,h)=>f(a+0.42,c+0.2,h),sl=0.5,sw=0.34;hoQ([sh(-sl,-sw,0),sh(sl,-sw,0),sh(sl,sw,0),sh(-sl,sw,0)],'rgba(70,60,50,0.3)');
    wvLoom(sh,-0.36,0.2,0.0,17,win,sd);wvBasket(sh(0.34,0.16,0),win);wvBasket(sh(0.36,-0.12,0),win,'#8A7E70');bkLeanTo(sh,-sl,sl,-sw,sw,14,22,win,J,sd);}
  else if(opt===2){house();/* rope walk along the front edge: posts with pegs, ropes being laid, a twisting wheel at one end, coils */const rc=0.62,a0=-0.9,a1=0.85;
    for(let i=0;i<5;i++){const a=a0+0.25+i*(a1-a0-0.3)/4;hoLine(f(a,rc,0),f(a,rc,8),win?'#B8B0A0':'#5A4230',1.1);hoLine(f(a,rc-0.05,7),f(a,rc+0.05,7),win?'#B8B0A0':'#5A4230',1);}
    for(const [dc,col] of [[-0.03,'#C8AA6E'],[0.03,'#B89A5E']]){ctx.strokeStyle=win?'#D0C8B8':col;ctx.lineWidth=1;ctx.beginPath();const p0=f(a0+0.15,rc+dc,7.5),p1=f(a1,rc+dc,6.5);ctx.moveTo(p0[0],p0[1]);ctx.quadraticCurveTo((p0[0]+p1[0])/2,(p0[1]+p1[1])/2+3,p1[0],p1[1]);ctx.stroke();}
    {/* twisting wheel on a frame at the near end */const w=f(a1+0.02,rc,8);hoLine(f(a1+0.02,rc,0),w,win?'#B8B0A0':'#4A3424',1.6);ctx.strokeStyle=win?'#B8B0A0':'#6E5038';ctx.lineWidth=1.1;ctx.beginPath();ctx.ellipse(w[0],w[1],3.6,4.6,0.5,0,6.3);ctx.stroke();ctx.beginPath();for(let k=0;k<4;k++){const an=(typeof t==='number'&&!win?t*2:0)+k*1.57;ctx.moveTo(w[0],w[1]);ctx.lineTo(w[0]+Math.cos(an)*3.4,w[1]+Math.sin(an)*4.4);}ctx.stroke();}
    wvCoil(f(0.6,0.18,0),win);wvCoil(f(0.75,0.3,0),win);wvBasket(f(0.35,-0.05,0),win);}
  else if(opt===3){house();/* sail stretched on a frame to dry: two tall posts, a yard on top, the striped sail laced to it, ropes to pegs */const sc=0.3,a0=0.05,a1=0.85,H=22,P=(a,h)=>f(a,sc,h);
    hoLine(P(a0,0),P(a0,H+2),win?'#B8B0A0':'#4A3424',1.4);hoLine(P(a1,0),P(a1,H+2),win?'#B8B0A0':'#4A3424',1.4);hoLine(P(a0-0.05,H),P(a1+0.05,H),win?'#B8B0A0':'#5A4230',1.6);
    const n=6;for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n,q=(u,h)=>{const a=a0+0.03+(a1-a0-0.06)*u,bil=Math.sin(u*Math.PI)*0.06*(1-Math.abs(h-H*0.55)/(H*0.6));return f(a,sc+bil,h);};
      const pts=[];for(let k=0;k<=4;k++)pts.push(q(u0,H-0.5-k*(H-6)/4));for(let k=4;k>=0;k--)pts.push(q(u1,H-0.5-k*(H-6)/4));hoQ(pts,win?'#EEEAE2':(i%2?'#A33A2E':'#E8DFC8'));}
    if(!win){ctx.strokeStyle='rgba(60,40,20,0.35)';ctx.lineWidth=0.4;ctx.beginPath();for(let k=1;k<6;k++){const p=P(a0+0.03,H-0.5-k*(H-6)/6),q=P(a1-0.03,H-0.5-k*(H-6)/6);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();}
    for(const a of [a0,a1]){hoLine(P(a,H+1),f(a+(a===a0?-0.2:0.15),sc+0.25,0),'rgba(200,180,140,0.8)',0.5);}
    wvBasket(f(-0.2,0.7,0),win);wvBasket(f(0.0,0.82,0),win,'#8A7E70');}
  else{/* sunken weaving hut: low plank walls, roof almost to the ground, the front gable open on the loom */const fwa=(a,c,h)=>f(a-0.05,c-0.05,h),R=WOOD_SET[1],ga={sd,hl:L>=5?0.8:0.72,hw:0.66,fh:1.4,wh:4,rh:30,ov:0.05,th:4,wt:'planks',wall:'#7E6248',wallD:'#5F4936',roof:R.roof,roofD:R.roofD,roofE:shade(R.roofD,0.7),rt:R.rt,frame:true,frameCol:'#3A2A1C',k:1,v:1};
    const r=hoRoof(fwa,ga,win);r.back();hoFooting(fwa,ga,win);hoWalls(fwa,ga,win);r.end();
    {/* open gable: dark inside, the loom standing just inside, a lintel */const P=(c,h)=>fwa(ga.hl+0.004,c,h),ow=0.32,oh=18;hoQ([P(-ow,ga.fh),P(ow,ga.fh),P(ow,ga.fh+oh*0.55),P(0,ga.fh+oh),P(-ow,ga.fh+oh*0.55)],win?'#C8C2B8':'#22180F');
      const lf=(a,c,h)=>fwa(a,c,h);if(!win){const sw=(c,h)=>lf(ga.hl-0.12,c,h);hoLine(sw(-0.24,ga.fh),sw(-0.24,ga.fh+13),'#6E5038',1.2);hoLine(sw(0.24,ga.fh),sw(0.24,ga.fh+13),'#6E5038',1.2);hoLine(sw(-0.27,ga.fh+12),sw(0.27,ga.fh+12),'#6E5038',1.4);
        hoQ([sw(-0.22,ga.fh+11.5),sw(0.22,ga.fh+11.5),sw(0.22,ga.fh+8),sw(-0.22,ga.fh+8)],'#D8CDB4');hoQ([sw(-0.22,ga.fh+10),sw(0.22,ga.fh+10),sw(0.22,ga.fh+9.2),sw(-0.22,ga.fh+9.2)],'#A34A3A');
        ctx.strokeStyle='rgba(240,232,214,0.6)';ctx.lineWidth=0.3;ctx.beginPath();for(let i=0;i<=16;i++){const c=-0.21+0.42*i/16,p=sw(c,ga.fh+8),q=sw(c,ga.fh+2);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();for(let i=0;i<10;i++){const p=sw(-0.2+0.4*i/9,ga.fh+1.6+(i%2)*0.9);ctx.fillStyle='#8E877B';ctx.beginPath();ctx.arc(p[0],p[1],0.9,0,6.3);ctx.fill();}}
      for(const c of [-ow-0.02,ow+0.02])hoLine(P(c,ga.fh),P(c,ga.fh+oh*0.55),'#3A2A1C',1.3);hoLine(P(-ow-0.02,ga.fh+oh*0.55),P(0,ga.fh+oh+0.5),'#3A2A1C',1.3);hoLine(P(ow+0.02,ga.fh+oh*0.55),P(0,ga.fh+oh+0.5),'#3A2A1C',1.3);}
    r.front();r.ridge();hoBarge(fwa,ga,'#4A3424',0.22,L>=5);wvBasket(fwa(ga.hl+0.14,0.42,0),win);}}
{const _shV=shShape;shShape=function(b){if(b.t==='weaver'&&WEAVE_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),box=(a,c,sa,sc,h)=>({pts:[f(a-sa,c-sc,0),f(a+sa,c-sc,0),f(a+sa,c+sc,0),f(a-sa,c+sc,0)],h});
  if(WEAVE_OPT===4)return [box(-0.05,-0.05,0.75,0.68,0.15),box(-0.05,-0.05,0.75,0.05,1.3)];const V=[box(-0.38,-0.42,0.5,0.4,0.75)];if(WEAVE_OPT===1)V.push(box(0.42,0.2,0.5,0.34,0.6));else if(WEAVE_OPT===3)V.push(box(0.45,0.3,0.42,0.04,0.85));else V.push(box(0,0.62,0.85,0.04,0.3));return V;}return _shV(b);};}

/* =================== Tailor options (prototype) — window.__setTailor(n) ===================
   2×2, wool + hide → warm clothing (cloaks, fur-lined boots). 1 Thatched house + clothes line with cloaks and a stretched hide · 2 Black-scale house with a shop counter (shutter let down) and a cloak stand
   3 Red-board house + open lean-to with a cutting table, cloth bolts and pelts on the back wall · 4 Slate house + round hide-stretching frames and a tub */
let TAIL_OPT=0;window.__setTailor=n=>{TAIL_OPT=n|0;};
{const _dsT=drawShaped;drawShaped=function(b,win,c0,ax){if(TAIL_OPT&&b.t==='tailor'){drawTailorOpt(b,win,TAIL_OPT);return true;}return _dsT(b,win,c0,ax);};}
function tlCloak(p,col,win,w){/* a cloak hanging from a line: shoulders, folds, a hem */w=w||4;ctx.fillStyle=win?'#E8E4DC':col;ctx.beginPath();ctx.moveTo(p[0]-w*0.5,p[1]);ctx.lineTo(p[0]+w*0.5,p[1]);ctx.quadraticCurveTo(p[0]+w*0.9,p[1]+w*1.2,p[0]+w*0.85,p[1]+w*2.3);ctx.lineTo(p[0]-w*0.85,p[1]+w*2.3);ctx.quadraticCurveTo(p[0]-w*0.9,p[1]+w*1.2,p[0]-w*0.5,p[1]);ctx.fill();
  if(!win){ctx.strokeStyle='rgba(0,0,0,0.22)';ctx.lineWidth=0.5;ctx.beginPath();for(const u of [-0.35,0,0.35]){ctx.moveTo(p[0]+u*w*0.6,p[1]+1);ctx.lineTo(p[0]+u*w*1.4,p[1]+w*2.25);}ctx.stroke();ctx.fillStyle='rgba(255,255,255,0.12)';ctx.fillRect(p[0]-w*0.85,p[1]+w*2.05,w*1.7,w*0.25);ctx.fillStyle='#C9A042';ctx.beginPath();ctx.arc(p[0],p[1]+0.8,0.6,0,6.3);ctx.fill();}}
function tlPelt(p,s,win,col){/* a hide with legs spread, fur texture */ctx.fillStyle=win?'#E2DCD0':col||'#8A6440';ctx.beginPath();const P=(x,y)=>[p[0]+x*s,p[1]+y*s];const pts=[P(0,-5),P(1.6,-4.6),P(3.8,-6),P(3,-3),P(2.4,0),P(3.8,3.6),P(1.6,3),P(0,5),P(-1.6,3),P(-3.8,3.6),P(-2.4,0),P(-3,-3),P(-3.8,-6),P(-1.6,-4.6)];
  ctx.moveTo(pts[0][0],pts[0][1]);for(const q of pts.slice(1))ctx.lineTo(q[0],q[1]);ctx.closePath();ctx.fill();if(!win){ctx.fillStyle='rgba(255,240,210,0.18)';ctx.beginPath();ctx.ellipse(p[0]-0.6*s,p[1]-0.5*s,1.4*s,3*s,0,0,6.3);ctx.fill();ctx.strokeStyle='rgba(40,24,12,0.35)';ctx.lineWidth=0.35;ctx.beginPath();for(let k=0;k<8;k++){const x=p[0]+(k-4)*0.7*s,y=p[1]+((k*37)%7-3)*s*0.6;ctx.moveTo(x,y);ctx.lineTo(x+0.5,y+1.2);}ctx.stroke();}}
function tlFrame(f,a,c,R,win,col){/* round hide-stretching frame of bent wood on two legs, the hide laced in it */const P=(th,r)=>f(a+Math.cos(th)*r/36,c,10+Math.sin(th)*r);
  hoLine(f(a-0.12,c,0),P(-2.3,R),win?'#B8B0A0':'#5A4230',1);hoLine(f(a+0.12,c,0),P(-0.8,R),win?'#B8B0A0':'#5A4230',1);const m=P(0,0);tlPelt(m,R/6.5,win,col);
  ctx.strokeStyle=win?'#B8B0A0':'#6E5038';ctx.lineWidth=1.4;ctx.beginPath();for(let k=0;k<=30;k++){const q=P(k/30*6.283,R);k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();
  if(!win){ctx.strokeStyle='rgba(220,200,160,0.6)';ctx.lineWidth=0.3;ctx.beginPath();for(let k=0;k<12;k++){const th=k/12*6.283,q=P(th,R),r=P(th,R*0.62);ctx.moveTo(q[0],q[1]);ctx.lineTo(r[0],r[1]);}ctx.stroke();}}
function tlBolt(p,col,win){ctx.fillStyle=win?'#E8E4DC':col;ctx.fillRect(p[0]-3.2,p[1]-2.2,6.4,2.2);ctx.beginPath();ctx.ellipse(p[0]+3.2,p[1]-1.1,0.7,1.1,0,0,6.3);ctx.fillStyle=win?'#D8D2C4':shade(col,0.8);ctx.fill();}
function drawTailorOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),L=Math.min(5,b.lvl||1),sd=(b.id||0)*59+opt,J=WOOD_SET[opt===1?1:opt===2?2:opt===3?4:3],fw=(a,c,h)=>f(a-0.38,c-0.42,h);
  const g={sd,hl:L>=5?0.56:0.46,hw:0.36,fh:2.4,wh:12,rh:12,ov:0.06,th:J.rt==='thatch'?4:1.6,wt:'planks',wall:opt===4?'#8A7A64':'#9A7A52',wallD:opt===4?'#6E604E':'#7A5E3E',roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,blue:J.blue,frame:true,frameCol:'#3A2A1C',k:1,v:1};
  const CL=['#A33A2E','#2E4A5E','#6E5A3A','#4E6A44'];
  const house=(extra)=>{const r=hoRoof(fw,g,win);r.back();hoFooting(fw,g,win);hoWalls(fw,g,win);if(opt===4)hoStoneBox(fw,0,0,g.hl,g.hw,g.fh,g.fh+6,win,sd);r.end();hoDoor(fw,g,'G',0,0.16,8.5,{col:'#4A3424',steps:1});if(L>=3&&opt!==2)hoWindow(fw,g,'L',-0.18,0.1,g.fh+5,g.fh+8,{shutters:'#2E4A5E'});if(extra)extra();r.front();r.ridge();hoBarge(fw,g,'#4A3424',0.25,L>=5);};
  if(opt===1){house();/* clothes line on two posts with cloaks; a stretched hide on a square frame */const lc=0.5,a0=-0.1,a1=0.85,H=14;hoLine(f(a0,lc,0),f(a0,lc,H+1),win?'#B8B0A0':'#4A3424',1.2);hoLine(f(a1,lc,0),f(a1,lc,H+1),win?'#B8B0A0':'#4A3424',1.2);
    const p0=f(a0,lc,H),p1=f(a1,lc,H);ctx.strokeStyle=win?'#C8C0B0':'rgba(200,180,140,0.9)';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.quadraticCurveTo((p0[0]+p1[0])/2,(p0[1]+p1[1])/2+2,p1[0],p1[1]);ctx.stroke();
    for(let i=0;i<4;i++){const u=(i+0.6)/4.4,p=[lerp(p0,p1,u)[0],lerp(p0,p1,u)[1]+Math.sin(u*Math.PI)*2];tlCloak(p,CL[i],win,3.6);}
    {/* square stretching frame with a hide */const fa=0.75,fc=-0.25,P=(da,h)=>f(fa+da,fc,h);for(const da of [-0.18,0.18])hoLine(P(da,0),P(da,15),win?'#B8B0A0':'#5A4230',1.1);hoLine(P(-0.2,14),P(0.2,14),win?'#B8B0A0':'#5A4230',1);hoLine(P(-0.2,3),P(0.2,3),win?'#B8B0A0':'#5A4230',1);tlPelt(P(0,8.5),1,win);}}
  else if(opt===2){house(()=>{/* shop counter: the shutter let down on the long wall, folded cloth and boots on it, a dark opening */const P=(a,h)=>fw(a,g.hw+0.004,h),a0=-0.32,a1=0.08;hoQ([P(a0,g.fh+4),P(a1,g.fh+4),P(a1,g.fh+9),P(a0,g.fh+9)],win?'#C8C2B8':'#22180F');
      const S=(a,c,h)=>fw(a,g.hw+c,h);hoQ([S(a0-0.02,0,g.fh+4),S(a1+0.02,0,g.fh+4),S(a1+0.02,0.12,g.fh+4.4),S(a0-0.02,0.12,g.fh+4.4)],win?'#D8D2C4':'#8A6A48');hoQ([S(a0-0.02,0.12,g.fh+4.4),S(a1+0.02,0.12,g.fh+4.4),S(a1+0.02,0.12,g.fh+3.4),S(a0-0.02,0.12,g.fh+3.4)],win?'#C8C2B4':'#6E5038');
      for(let i=0;i<3;i++){const p=S(a0+0.06+i*0.12,0.06,g.fh+4.4);tlBolt(p,CL[i],win);}if(!win){const p=S(a1-0.02,0.06,g.fh+4.4);ctx.fillStyle='#5A3E28';ctx.fillRect(p[0]-1,p[1]-3.4,1.6,3.4);ctx.fillRect(p[0]-1,p[1]-1,3,1);}
      hoQ([S(a0-0.03,0,g.fh+9.5),S(a1+0.03,0,g.fh+9.5),S(a1+0.03,0.1,g.fh+11),S(a0-0.03,0.1,g.fh+11)],win?'#EEF1F0':'#3A2A1C');});
    {/* cloak on a stand by the door */const p=f(0.4,0.0,0);hoLine(p,[p[0],p[1]-15],win?'#B8B0A0':'#4A3424',1.1);hoLine([p[0]-3,p[1]-14],[p[0]+3,p[1]-14],win?'#B8B0A0':'#4A3424',1);tlCloak([p[0],p[1]-14],CL[0],win,4.4);}}
  else if(opt===3){house();const sh=(a,c,h)=>f(a+0.42,c+0.2,h),sl=0.5,sw=0.34;hoQ([sh(-sl,-sw,0),sh(sl,-sw,0),sh(sl,sw,0),sh(-sl,sw,0)],'rgba(70,60,50,0.3)');
    hoQ([sh(-sl,-sw,0),sh(sl,-sw,0),sh(sl,-sw,12),sh(-sl,-sw,12)],win?'#C8C2B4':'#4A3424');for(let i=0;i<4;i++)tlPelt(sh(-0.36+i*0.24,-sw+0.01,7.5),0.9,win,i%2?'#8A6440':'#6E5038');
    hoBox(sh,-0.05,0.08,0.24,0,5.5,win?'#D0C8B8':'#8A6A48',win?'#B8B0A0':'#6E5038',win);hoQ([sh(-0.29,-0.16,5.5),sh(0.19,-0.16,5.5),sh(0.19,0.32,5.5),sh(-0.29,0.32,5.5)],win?'#E0D8C8':'#9A7A52');
    if(!win){tlBolt(sh(-0.18,0.02,5.6),CL[0],win);tlBolt(sh(0.05,0.18,5.6),CL[1],win);const s0=sh(-0.05,0.2,5.6);ctx.strokeStyle='#5E646A';ctx.lineWidth=0.7;ctx.beginPath();ctx.moveTo(s0[0]-2,s0[1]);ctx.lineTo(s0[0]+2,s0[1]-1.4);ctx.moveTo(s0[0]-2,s0[1]-1.4);ctx.lineTo(s0[0]+2,s0[1]);ctx.stroke();}
    bkLeanTo(sh,-sl,sl,-sw,sw,14,22,win,J,sd);}
  else{house();tlFrame(f,0.35,0.35,8,win,'#8A6440');tlFrame(f,0.75,0.05,7,win,'#6E5038');}}
{const _shT=shShape;shShape=function(b){if(b.t==='tailor'&&TAIL_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),box=(a,c,sa,sc,h)=>({pts:[f(a-sa,c-sc,0),f(a+sa,c-sc,0),f(a+sa,c+sc,0),f(a-sa,c+sc,0)],h});
  const V=[box(-0.38,-0.42,0.5,0.4,0.75)];if(TAIL_OPT===3)V.push(box(0.42,0.2,0.5,0.34,0.6));else if(TAIL_OPT===4){V.push(box(0.35,0.35,0.2,0.03,0.6),box(0.75,0.05,0.18,0.03,0.55));}else if(TAIL_OPT===1)V.push(box(0.37,0.5,0.47,0.03,0.55));return V;}return _shT(b);};}

/* =================== Tavern options (prototype) — window.__setTavern(n) ===================
   3×2, no levels; folk drink ale and mead here in the evenings. 1 Black-scale mead hall, open lit door, benches against the wall, horn sign, two torches
   2 Red-board hall with a covered porch along the front: long table, benches, tankards · 3 Thatched hall + yard with a fire pit and log benches · 4 Stone-footed hall, slate roof, two barrels at the gable, sign */
let TAV_OPT=0;window.__setTavern=n=>{TAV_OPT=n|0;};
{const _dsK=drawShaped;drawShaped=function(b,win,c0,ax){if(TAV_OPT&&b.t==='tavern'){drawTavernOpt(b,win,TAV_OPT);return true;}return _dsK(b,win,c0,ax);};}
function tvDoorLit(f,g,s,win){/* open door on the long wall: warm light inside, the leaf swung in, a pool of light on the ground */const w=0.18,hd=9,fh=g.fh;hoRect(f,g,'L',s-w/2-0.03,s+w/2+0.03,fh,fh+hd+1.6,'#3A2A1C');hoRect(f,g,'L',s-w/2,s+w/2,fh,fh+hd,win?'#C8C2B8':'#E8A048');
  if(!win){hoRect(f,g,'L',s-w/2,s-w/2+0.05,fh,fh+hd,'#5A4230');const p=f(s,g.hw+0.18,0);ctx.fillStyle='rgba(255,190,100,0.28)';ctx.beginPath();ctx.ellipse(p[0],p[1],13,5.5,0,0,6.3);ctx.fill();ctx.fillStyle='rgba(255,220,150,0.35)';const q=f(s,g.hw+0.004,fh+hd*0.5);ctx.beginPath();ctx.ellipse(q[0],q[1],3,5,0,0,6.3);ctx.fill();}
  const st=f(s,g.hw+0.1,0);ctx.fillStyle=win?'#E2E4E0':'#8E877B';ctx.beginPath();ctx.ellipse(st[0],st[1],4.6,1.9,0,0,6.3);ctx.fill();}
function tvBench(f,a0,a1,c,win){/* plank bench along a: two legs, a seat */const h=2.6,w=0.045,col=win?'#D0C8B8':'#8A6A48',colD=win?'#B8B0A0':'#5E4630';for(const a of [a0+0.05,a1-0.05])hoLine(f(a,c+w*0.5,0),f(a,c+w*0.5,h),colD,1);hoQ([f(a0,c-w,h),f(a1,c-w,h),f(a1,c+w,h),f(a0,c+w,h)],col);hoQ([f(a0,c+w,h),f(a1,c+w,h),f(a1,c+w,h-0.7),f(a0,c+w,h-0.7)],colD);}
function tvTable(f,a0,a1,c,win,mugs){const h=4.6,w=0.1,col=win?'#D8D0C0':'#9A7A52',colD=win?'#C0B8A8':'#6E5038';for(const a of [a0+0.06,a1-0.06])hoLine(f(a,c+w*0.6,0),f(a,c+w*0.6,h),colD,1.2);hoQ([f(a0,c-w,h),f(a1,c-w,h),f(a1,c+w,h),f(a0,c+w,h)],col);hoQ([f(a0,c+w,h),f(a1,c+w,h),f(a1,c+w,h-0.8),f(a0,c+w,h-0.8)],colD);
  if(mugs&&!win)for(let i=0;i<mugs;i++){const p=f(a0+0.1+(a1-a0-0.2)*i/Math.max(1,mugs-1),c+(i%2?0.04:-0.03),h);ctx.fillStyle='#6E5038';ctx.fillRect(p[0]-0.9,p[1]-2.2,1.8,2.2);ctx.fillStyle='#E8D8A8';ctx.beginPath();ctx.ellipse(p[0],p[1]-2.2,0.9,0.4,0,0,6.3);ctx.fill();}}
function tvSign(p,win){/* post with an arm, a hanging board with a carved drinking horn */const s=[p[0],p[1]];hoLine(s,[s[0],s[1]-22],win?'#B8B0A0':'#4E3C2E',1.4);hoLine([s[0],s[1]-22],[s[0]-8,s[1]-22],win?'#B8B0A0':'#4E3C2E',1.2);
  hoLine([s[0]-2.5,s[1]-22],[s[0]-2.5,s[1]-19.5],'#3A2A1C',0.5);hoLine([s[0]-7,s[1]-22],[s[0]-7,s[1]-19.5],'#3A2A1C',0.5);const bx=s[0]-9;hoQ([[bx,s[1]-19.5],[bx+8,s[1]-19.5],[bx+8,s[1]-13.5],[bx,s[1]-13.5]],win?'#D0C8B8':'#8C6A48');
  if(!win){ctx.strokeStyle='#C9A64A';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(bx+1.6,s[1]-18);ctx.quadraticCurveTo(bx+4.5,s[1]-13.5,bx+6.8,s[1]-18.4);ctx.stroke();}}
function drawTavernOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*61+opt,J=WOOD_SET[opt===1?2:opt===2?4:opt===3?1:3];
  const hc=opt===3?-0.35:-0.3,ha=opt===3?-0.35:0,fw=(a,c,h)=>f(a+ha,c+hc,h);
  const g={sd,hl:opt===3?1.0:1.2,hw:0.56,fh:opt===4?3.4:2.4,wh:13,rh:15,ov:0.07,th:J.rt==='thatch'?4.5:1.7,wt:opt===3?'logs':'planks',wall:opt===1?'#4E3C2E':opt===2?'#8A6A48':opt===3?'#7E6248':'#8A7A64',wallD:opt===1?'#3A2C22':opt===2?'#6E5038':opt===3?'#5F4936':'#6E604E',
    roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,blue:J.blue,frame:opt!==3,frameCol:'#2A1F18',k:1,v:1};
  const house=(extra)=>{const r=hoRoof(fw,g,win);r.back();hoFooting(fw,g,win);hoWalls(fw,g,win);if(opt===4)hoStoneBox(fw,0,0,g.hl,g.hw,1.2,g.fh+4,win,sd);r.end();
    tvDoorLit(fw,g,0.05,win);for(const s of [-0.65,0.7])hoWindow(fw,g,'L',s,0.11,g.fh+4.5,g.fh+7.8,{shutters:opt===2?'#2E4A5E':'#7A2E24'});hoWindow(fw,g,'G',0,0.1,g.fh+5,g.fh+8.2,{});if(extra)extra();r.front();r.ridge();hoBarge(fw,g,'#4A3424',0.25,true);};
  const fc=hc+g.hw;/* front wall line in plot coords */
  if(opt===1){house();tvBench(fw,-1.0,-0.25,g.hw+0.1,win);tvBench(fw,0.35,1.05,g.hw+0.1,win);alTorch(fw(-0.2,g.hw+0.3,0),win);alTorch(fw(0.3,g.hw+0.3,0),win);tvSign(fw(g.hl+0.2,g.hw+0.25,0),win);}
  else if(opt===2){house(()=>{});/* covered porch along the front wall */const P=(a,c,h)=>fw(a,c,h),c0=g.hw,c1=g.hw+0.42,hB=11,hF=10;tvTable(P,-0.9,-0.15,g.hw+0.22,win,4);tvBench(P,-0.9,-0.15,g.hw+0.36,win);tvTable(P,0.3,1.0,g.hw+0.22,win,3);tvBench(P,0.3,1.0,g.hw+0.36,win);
    for(const a of [-g.hl,-0.45,0.45,g.hl])hoQ([P(a-0.025,c1,0),P(a+0.025,c1,0),P(a+0.025,c1,hF),P(a-0.025,c1,hF)],win?'#C8C2B4':'#3A2A1C');hoLine(P(-g.hl,c1,hF),P(g.hl,c1,hF),win?'#C8C2B4':'#3A2A1C',1.2);
    const e=0.05,R=[P(-g.hl-e,c0,hB+0.6),P(g.hl+e,c0,hB+0.6),P(g.hl+e,c1+e,hF+0.6),P(-g.hl-e,c1+e,hF+0.6)];hoQ(R,win?'#EEF1F0':J.roof);if(!win)hoRoofSurface((u,v)=>lerp(lerp(R[0],R[1],u),lerp(R[3],R[2],u),v),{sd:sd+4,rt:J.rt,rh:6,roofD:J.roofD},win);hoQ([R[1],R[2],[R[2][0],R[2][1]+1.4],[R[1][0],R[1][1]+1.4]],shade(J.roofD,0.6));
    brBarrel(fw(g.hl+0.1,-0.3,0),1.1,win);brBarrel(fw(g.hl+0.1,-0.12,0),1.1,win);tvSign(fw(g.hl+0.2,g.hw+0.55,0),win);}
  else if(opt===3){house();/* yard with a fire pit and log benches */const yc=(a,c,h)=>f(a+0.85,c+0.25,h);{const p=yc(0,0,0);ctx.fillStyle=win?'rgba(220,220,214,0.6)':'rgba(140,120,90,0.45)';ctx.beginPath();ctx.ellipse(p[0],p[1],30,15,0,0,6.3);ctx.fill();}
    const fs=(x,y,h)=>yc(y,x,h);hoLog(yc,-0.3,0.2,-0.38,1.6,1.6,win);hoLog(fs,-0.3,0.2,-0.42,1.6,1.6,win);alFire(yc(0,0,0),1,win);hoLog(fs,-0.25,0.25,0.42,1.6,1.6,win);hoLog(yc,-0.25,0.25,0.38,1.6,1.6,win);brBarrel(yc(0.5,-0.3,0),1,win);tvSign(fw(g.hl+0.2,g.hw+0.25,0),win);}
  else{house();brBarrel(fw(g.hl+0.1,-0.3,0),1.1,win);brBarrel(fw(g.hl+0.1,-0.12,0),1.1,win);tvBench(fw,-1.0,-0.25,g.hw+0.12,win);tvBench(fw,0.35,1.05,g.hw+0.12,win);tvSign(fw(g.hl+0.2,g.hw+0.25,0),win);}}
{const _shK=shShape;shShape=function(b){if(b.t==='tavern'&&TAV_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),box=(a,c,sa,sc,h)=>({pts:[f(a-sa,c-sc,0),f(a+sa,c-sc,0),f(a+sa,c+sc,0),f(a-sa,c+sc,0)],h});
  const o=TAV_OPT,ha=o===3?-0.35:0,hc=o===3?-0.35:-0.3,hl=o===3?1.0:1.2;const V=[box(ha,hc,hl+0.07,0.62,0.6),box(ha,hc,hl+0.07,0.06,1.1)];if(o===2)V.push(box(0,-0.3+0.56+0.21,1.2,0.21,0.4));return V;}return _shK(b);};}

/* =================== Watchtower options (prototype) — window.__setTower(n) ===================
   José (2026-11-12): slim, on ONE tile, standing in the palisade line; wall tiles beside it join it. The prototype draws a 1×1 tower when
   DEF.tower is 1×1 (the screenshot script sets that and marks the tower's tile in walls with 3; see BACKLOG for the game change).
   1 Open post tower: four posts with X-braces, a pointed-log parapet, black-scale pyramid · 2 Log shaft + overhanging plank gallery, red-board pyramid
   3 Stone foot + timber shaft + gallery, slate pyramid · 4 Palisade tower: a tall ring of the same pointed logs as the wall, a platform roof on posts */
let TOWER_OPT=0;window.__setTower=n=>{TOWER_OPT=n|0;};
{const _dsQ=drawShaped;drawShaped=function(b,win,c0,ax){if(TOWER_OPT&&b.t==='tower'){drawTowerOpt(b,win,TOWER_OPT);return true;}return _dsQ(b,win,c0,ax);};}
{const _dwt=drawWallTile;drawWallTile=function(i,win){if(walls[i]===3)return;return _dwt(i,win);};}
function twLog(p,h,w,win){/* one palisade log: split face, shaded side, sharpened top (as drawWallTile) */w=w||2.3;const LT=win?'#9A8A78':'#8E6E4E',DK=win?'#6E6052':'#5A4230',TIP=win?'#B5A894':'#A88660';const px=p[0],py=p[1];
  poly([px-w,py+0.6,px+w,py+0.6,px+w,py-h,px,py-h-3.6,px-w,py-h],LT);poly([px+w*0.15,py+0.6,px+w,py+0.6,px+w,py-h,px+w*0.15,py-h-3.1],DK);poly([px-w,py-h,px,py-h-3.6,px+w,py-h,px,py-h+1.2],TIP);
  ctx.strokeStyle='rgba(34,24,16,0.55)';ctx.lineWidth=0.6;ctx.beginPath();ctx.moveTo(px-w,py+0.6);ctx.lineTo(px-w,py-h);ctx.stroke();}
function twStubs(b,f0,front,win,s){/* palisade from the tower's base out to each side where a wall tile joins */const x=b.fx,y=b.fy;
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){if(!inMap(x+dx,y+dy)||!walls[(y+dy)*N+x+dx])continue;if((dx+dy>0)!==front)continue;
    const a0=f0(dx*s,dy*s,0),a1=f0(dx*0.5,dy*0.5,0);ctx.strokeStyle=win?'rgba(236,240,238,0.9)':'#6B5A40';ctx.lineWidth=6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a0[0],a0[1]+1.5);ctx.lineTo(a1[0],a1[1]+1.5);ctx.stroke();ctx.lineCap='butt';
    const n=3,pts=[];for(let k=0;k<=n;k++)pts.push(lerp(a0,a1,k/n));pts.sort((p,q)=>p[1]-q[1]);for(const p of pts)twLog(p,20+((p[0]*7|0)%3),2.3,win);}}
function drawTowerOpt(b,win,opt){const one=b.w===1,f0=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:0}),sd=(b.id||0)*67+opt,S=one?1:1.6,f=(a,c,h)=>f0(a*S,c*S,h);
  const s=0.2,J=opt===2?WOOD_SET[4]:WOOD_SET[2];/* option 3 chosen with the black scale roof (José) */if(one)twStubs(b,f0,false,win,s*S);
  if(opt===1){/* open post tower */const H=40,P=(a,c,h)=>f(a,c,h),col=win?'#C8C2B4':'#4A3424',colL=win?'#D8D2C4':'#6E5038';hoQ([P(-s,-s,0),P(s+0.1,-s,0),P(s+0.1,s+0.1,0),P(-s,s+0.1,0)],'rgba(30,26,20,0.15)');
    for(const [a,c] of [[-s,-s],[s,-s],[-s,s],[s,s]]){const t2=(a,c,h)=>P(a*(1-h/H*0.15),c*(1-h/H*0.15),h);hoQ([t2(a-0.02,c,0),t2(a+0.02,c,0),t2(a+0.02,c,H),t2(a-0.02,c,H)],a>0&&c>0?colL:col);}
    for(const face of [0,1])for(let k=0;k<3;k++){const h0=4+k*12,h1=h0+12,sh=h=>1-h/H*0.15,Q=(u,h)=>face?P(s*sh(h),u*s*sh(h),h):P(u*s*sh(h),s*sh(h),h);hoLine(Q(-1,h0),Q(1,h1),col,0.9);hoLine(Q(1,h0),Q(-1,h1),col,0.9);hoLine(Q(-1,h1),Q(1,h1),col,1);}
    /* ladder on the +a face */for(const u of [-0.25,0.25])hoLine(P(s+0.06,u*s,0),P(s*0.86+0.04,u*s,H),win?'#B8B0A0':'#7A5A3C',0.7);for(let h=3;h<H;h+=3.4){hoLine(P(s+0.06-h/H*0.03,-0.25*s,h),P(s+0.06-h/H*0.03,0.25*s,h),win?'#B8B0A0':'#7A5A3C',0.5);}
    /* platform with a pointed-log parapet */const ps=0.27,pf=(a,c,h)=>P(a,c,h);hoQ([pf(-ps,-ps,H),pf(ps,-ps,H),pf(ps,ps,H),pf(-ps,ps,H)],win?'#D8D2C4':'#7A5A3C');hoQ([pf(-ps,ps,H),pf(ps,ps,H),pf(ps,ps,H-2),pf(-ps,ps,H-2)],win?'#C8C2B4':'#5A4230');hoQ([pf(ps,-ps,H),pf(ps,ps,H),pf(ps,ps,H-2),pf(ps,-ps,H-2)],win?'#B8B0A0':'#4A3424');
    const pp=[];for(let k=0;k<=5;k++){pp.push(pf(-ps+2*ps*k/5,ps,H));pp.push(pf(ps,-ps+2*ps*k/5,H));}pp.sort((p,q)=>p[1]-q[1]);for(const p of pp)twLog(p,7,1.6,win);
    for(const [a,c] of [[-ps+0.03,ps-0.03],[ps-0.03,ps-0.03],[ps-0.03,-ps+0.03]])hoLine(pf(a,c,H+5),pf(a,c,H+13),col,1);hoPyramid(f,0,0,ps+0.06,H+13,H+28,J.roof,J.roofD,'scale',win,sd);}
  else if(opt===2||opt===3){const H=38,shaft={sd,hl:s,hw:s,fh:opt===3?1.2:2,wh:H,rh:0,ov:0,wt:'logs',wall:'#7E6248',wallD:'#5F4936',frame:false,k:1,v:1};
    hoQ([f(-s,-s,0),f(s+0.12,-s,0),f(s+0.12,s+0.12,0),f(-s,s+0.12,0)],'rgba(30,26,20,0.15)');hoFooting(f,shaft,win);hoWalls(f,shaft,win);if(opt===3)hoStoneBox(f,0,0,s+0.02,s+0.02,0,14,win,sd);
    hoDoor(f,shaft,'G',0,0.12,8,{col:'#4A3424'});
    /* overhanging plank gallery with arrow slits */const gs=0.29,g0=H,g1=H+11,G=(a,c,h)=>f(a,c,h);for(const k of [-1,1]){hoLine(G(s,k*0.12,H-6),G(gs,k*0.12,g0),win?'#B8B0A0':'#3A2A1C',1);hoLine(G(k*0.12,s,H-6),G(k*0.12,gs,g0),win?'#B8B0A0':'#3A2A1C',1);}
    hoQ([G(-gs,gs,g0),G(gs,gs,g0),G(gs,gs,g1),G(-gs,gs,g1)],win?'#D8D2C4':'#8A6A48');hoQ([G(gs,-gs,g0),G(gs,gs,g0),G(gs,gs,g1),G(gs,-gs,g1)],win?'#C8C2B4':'#6E5038');
    if(!win){ctx.strokeStyle='rgba(30,20,12,0.45)';ctx.lineWidth=0.4;ctx.beginPath();for(let k=1;k<8;k++){const u=-gs+2*gs*k/8,p=G(u,gs,g0),q=G(u,gs,g1),r=G(gs,u,g0),t3=G(gs,u,g1);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.moveTo(r[0],r[1]);ctx.lineTo(t3[0],t3[1]);}ctx.stroke();
      for(const u of [-0.14,0.14]){hoQ([G(u-0.015,gs+0.002,g0+3),G(u+0.015,gs+0.002,g0+3),G(u+0.015,gs+0.002,g0+8),G(u-0.015,gs+0.002,g0+8)],'#1E1610');hoQ([G(gs+0.002,u-0.015,g0+3),G(gs+0.002,u+0.015,g0+3),G(gs+0.002,u+0.015,g0+8),G(gs+0.002,u-0.015,g0+8)],'#1E1610');}}
    hoLine(G(-gs,gs,g0),G(gs,gs,g0),win?'#B8B0A0':'#3A2A1C',1.1);hoPyramid(f,0,0,gs+0.06,g1-0.5,g1+17,J.roof,J.roofD,J.rt,win,sd);}
  else{/* palisade tower: a square of tall pointed logs, a platform roof on corner posts above */const H=44,ts=0.22,pts=[];hoQ([f(-ts,-ts,0),f(ts+0.1,-ts,0),f(ts+0.1,ts+0.1,0),f(-ts,ts+0.1,0)],'rgba(30,26,20,0.18)');
    for(let k=0;k<=4;k++){pts.push({p:f(-ts+2*ts*k/4,ts,0),k});pts.push({p:f(ts,-ts+2*ts*k/4,0),k:k+10});}pts.sort((p,q)=>p.p[1]-q.p[1]);for(const q of pts)twLog(q.p,H-(q.k%3),2.9,win);
    {/* a dark doorway at the foot on the +a face, a band of iron */const P=(c,h)=>f(ts+0.004,c,h);hoQ([P(-0.07,0),P(0.07,0),P(0.07,9),P(-0.07,9)],'#1E1610');for(const h of [12,30])hoLine(f(-ts,ts+0.01,h),f(ts,ts+0.01,h),'#4A4846',0.9),hoLine(f(ts+0.01,-ts,h),f(ts+0.01,ts,h),'#3A3836',0.9);}
    for(const [a,c] of [[-ts+0.03,ts],[ts,ts],[ts,-ts+0.03]])hoLine(f(a,c,H),f(a,c,H+10),win?'#C8C2B4':'#3A2A1C',1.1);hoPyramid(f,0,0,ts+0.08,H+10,H+24,J.roof,J.roofD,'scale',win,sd);}
  if(one)twStubs(b,f0,true,win,s*S);}
{const _shQ=shShape;shShape=function(b){if(b.t==='tower'&&TOWER_OPT){const f0=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:0}),S=b.w===1?1:1.6,s=0.3*S;return [{pts:[f0(-s,-s,0),f0(s,-s,0),f0(s,s,0),f0(-s,s,0)],h:2.2}];}return _shQ(b);};}

/* =================== Arsenal options (prototype) — window.__setArsenal(n) ===================
   3×2, stores weapons. 1 Black-scale weapon hall with an open bay: spear racks, shields on the back wall · 2 Stone strong-house, iron-bound double door, shields under the eaves, slate
   3 Red-board hall with a front lean-to: spear rack and a shield wall · 4 Raised armoury on posts (stabbur-like) with a ladder and a gallery of shields */
let ARS_OPT=0;window.__setArsenal=n=>{ARS_OPT=n|0;};
{const _dsA2=drawShaped;drawShaped=function(b,win,c0,ax){if(ARS_OPT&&b.t==='arsenal'){drawArsenalOpt(b,win,ARS_OPT);return true;}return _dsA2(b,win,c0,ax);};}
const AR_SH=[['#A34A3A','#E8DFC8'],['#2E4A5E','#C9A042'],['#E8DFC8','#3A3634'],['#4E6A44','#E8DFC8'],['#C9A042','#A34A3A']];
function arShield(p,r,i,win){if(win){ctx.fillStyle='#E2DCD0';ctx.beginPath();ctx.arc(p[0],p[1],r,0,6.3);ctx.fill();return;}hoShieldRound(p,r,AR_SH[i%AR_SH.length]);ctx.strokeStyle='#3A2A1C';ctx.lineWidth=0.5;ctx.beginPath();ctx.arc(p[0],p[1],r,0,6.3);ctx.stroke();ctx.fillStyle='#8A8E92';ctx.beginPath();ctx.arc(p[0],p[1],r*0.28,0,6.3);ctx.fill();}
function arSpears(f,a0,a1,c,H,win){/* a rack: two rails, spears standing in it with iron heads */const wood=win?'#B8B0A0':'#5A4230';hoLine(f(a0,c,0),f(a0,c,H*0.7),wood,1);hoLine(f(a1,c,0),f(a1,c,H*0.7),wood,1);hoLine(f(a0,c,H*0.3),f(a1,c,H*0.3),wood,0.9);hoLine(f(a0,c,H*0.68),f(a1,c,H*0.68),wood,0.9);
  const n=Math.max(3,Math.round((a1-a0)*22));for(let i=0;i<n;i++){const a=a0+0.03+(a1-a0-0.06)*i/(n-1),p=f(a,c+0.02,0.5),q=f(a,c-0.01,H);hoLine(p,q,win?'#C8C0B0':'#8A6A48',0.6);ctx.fillStyle=win?'#D8D8D4':'#A8ACB0';ctx.beginPath();ctx.moveTo(q[0],q[1]-3.4);ctx.lineTo(q[0]+0.9,q[1]);ctx.lineTo(q[0]-0.9,q[1]);ctx.closePath();ctx.fill();}}
function arAxe(p,win){hoLine([p[0],p[1]],[p[0]+1.2,p[1]-8],win?'#C8C0B0':'#6E5038',0.7);ctx.fillStyle=win?'#D8D8D4':'#9A9EA2';ctx.beginPath();ctx.moveTo(p[0]+1,p[1]-7.6);ctx.lineTo(p[0]+3.6,p[1]-9);ctx.lineTo(p[0]+3.6,p[1]-5.8);ctx.closePath();ctx.fill();}
function drawArsenalOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),L=Math.min(5,b.lvl||1),sd=(b.id||0)*71+opt,J=WOOD_SET[opt===2?3:opt===3?4:2];
  const hc=opt===3?-0.35:-0.25,fw=(a,c,h)=>f(a,c+hc,h),ST=opt===4?7:0;const ff=(a,c,h)=>fw(a,c,h+ST);
  const g={sd,hl:L>=5?1.25:1.1,hw:opt===4?0.42:0.5,fh:opt===4?0.2:2.4,wh:opt===4?13:13,rh:14,ov:0.07,th:1.7,wt:opt===4?'logs':'planks',wall:opt===1?'#4E3C2E':opt===2?'#8A7A64':opt===3?'#8A6A48':'#7E6248',wallD:opt===1?'#3A2C22':opt===2?'#6E604E':opt===3?'#6E5038':'#5F4936',
    roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,blue:J.blue,frame:opt!==4,frameCol:'#2A1F18',k:1,v:1};
  const r=hoRoof(ff,g,win);r.back();if(opt===4)hoStilts(fw,-g.hl,g.hl,-g.hw,g.hw,ST,win);else hoFooting(ff,g,win);hoWalls(ff,g,win);if(opt===2)hoStoneBox(ff,0,0,g.hl,g.hw,g.fh,g.wh,win,sd);r.end();
  if(opt===1){/* open bay on the long wall: dark inside, spear racks, shields on the back wall */const P=(a,h)=>ff(a,g.hw+0.004,h),a0=-0.75,a1=0.55;hoQ([P(a0,g.fh),P(a1,g.fh),P(a1,g.wh-2),P(a0,g.wh-2)],win?'#C8C2B8':'#1E160F');
    if(!win){for(let i=0;i<5;i++)arShield(P(a0+0.14+i*0.25,g.fh+7.2),2.8,i,win);arSpears((a,c,h)=>ff(a,g.hw-0.06,h),a0+0.06,a1-0.06,0,9,win);}
    for(const a of [a0,a1,(a0+a1)/2])hoQ([P(a-0.02,g.fh),P(a+0.02,g.fh),P(a+0.02,g.wh),P(a-0.02,g.wh)],'#2A1F18');hoDoor(ff,g,'G',0,0.16,8.5,{col:'#3A2A1C',steps:1});}
  else if(opt===2){/* iron-bound double door on the long wall, small barred windows */const P=(a,h)=>ff(a,g.hw+0.004,h);hoQ([P(-0.17,g.fh),P(0.17,g.fh),P(0.17,g.fh+9),P(0,g.fh+11),P(-0.17,g.fh+9)],'#4A3424');
    if(!win){for(const h of [g.fh+2,g.fh+5.5,g.fh+8.6])hoLine(P(-0.16,h),P(0.16,h),'#2E2C2A',0.9);hoLine(P(0,g.fh),P(0,g.fh+10.6),'#2A1F18',0.6);for(const u of [-0.05,0.05]){ctx.strokeStyle='#2E2C2A';ctx.lineWidth=0.6;const q=P(u,g.fh+5);ctx.beginPath();ctx.arc(q[0],q[1]+0.8,0.9,0,6.3);ctx.stroke();}}
    hoQ([ff(-0.2,g.hw+0.01,0),ff(0.2,g.hw+0.01,0),ff(0.2,g.hw+0.16,0),ff(-0.2,g.hw+0.16,0)],win?'#E2E4E0':'#9C978D');
    for(const a of [-0.75,0.7]){hoQ([P(a-0.05,g.fh+6),P(a+0.05,g.fh+6),P(a+0.05,g.fh+9),P(a-0.05,g.fh+9)],'#1E160F');for(const u of [-0.02,0.02])hoLine(P(a+u,g.fh+6),P(a+u,g.fh+9),'#5E646A',0.6);}}
  else if(opt===3){hoDoor(ff,g,'G',0,0.16,8.5,{col:'#4A3424',steps:1});hoWindow(ff,g,'L',-0.7,0.1,g.fh+5,g.fh+8,{shutters:'#A34A3A'});}
  else{hoDoor(ff,g,'G',0,0.15,8,{col:'#4A3424'});/* ladder to the door */for(const u of [-0.06,0.06])hoLine(fw(g.hl+0.32,u,0),fw(g.hl+0.02,u,ST+0.4),win?'#B8B0A0':'#6E5038',0.8);for(let k=1;k<5;k++){const t2=k/5;hoLine(fw(g.hl+0.32-0.3*t2,-0.06,ST*t2),fw(g.hl+0.32-0.3*t2,0.06,ST*t2),win?'#B8B0A0':'#6E5038',0.6);}}
  r.front();r.ridge();hoBarge(ff,g,'#4A3424',0.25,L>=5);
  if(opt===2||opt===4){/* shields hung along the eave line on the long wall */const n=opt===2?6:7,P=(a,h)=>ff(a,g.hw+0.04,h);for(let i=0;i<n;i++){const a=-g.hl+0.18+(2*g.hl-0.36)*i/(n-1);arShield(P(a,g.wh-3.5),2.9,i,win);}}
  if(opt===3){/* front lean-to: shield wall and a spear rack */const sh=(a,c,h)=>f(a,c+0.55,h),sl=1.1,sw=0.28;hoQ([sh(-sl,-sw,0),sh(sl,-sw,0),sh(sl,sw,0),sh(-sl,sw,0)],'rgba(70,60,50,0.3)');
    for(let i=0;i<7;i++)arShield(sh(-0.95+i*0.27,-sw+0.02,8.5),3,i,win);arSpears((a,c,h)=>sh(a,c,h),-0.9,0.2,0.0,13,win);arAxe(sh(0.5,0.05,0),win);arAxe(sh(0.62,0.08,0),win);bkLeanTo(sh,-sl,sl,-sw,sw,13,18,win,J,sd);}}
{const _shA2=shShape;shShape=function(b){if(b.t==='arsenal'&&ARS_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),box=(a,c,sa,sc,h)=>({pts:[f(a-sa,c-sc,0),f(a+sa,c-sc,0),f(a+sa,c+sc,0),f(a-sa,c+sc,0)],h});
  const o=ARS_OPT,hc=o===3?-0.35:-0.25;const V=[box(0,hc,1.2,0.56,0.75),box(0,hc,1.2,0.06,1.25)];if(o===3)V.push(box(0,0.55,1.1,0.28,0.55));return V;}return _shA2(b);};}

/* =================== Harbour (improved) and Shipyard options (prototype) ===================
   Harbour (window.__setHarb(1)): same shape as today (shore platform + long pier); the boathouse redrawn with the style kit (plank walls on a frame,
   black scales, crossed barge boards, door, window); no crane, nets or loose props; only TWO berths, one each side of the pier (José).
   Shipyard (window.__setYard(n)): a big hall on the land side, a ship on the stocks in the open yard, a small pier with ONE berth (José).
   1 Log ship-hall, black scales · 2 Big A-frame hall, red boards · 3 Stone + timber hall, slate · 4 Plank hall with an open side bay, black scales */
let HARB_OPT=0,YARD_OPT=0;window.__setHarb=n=>{HARB_OPT=n|0;};window.__setYard=n=>{YARD_OPT=n|0;};
{const _dsH=drawShaped;drawShaped=function(b,win,c0,ax){if(HARB_OPT&&b.t==='harbour'){drawHarbourOpt(b,win);return true;}if(YARD_OPT&&b.t==='shipyard'){drawYardOpt(b,win,YARD_OPT);return true;}return _dsH(b,win,c0,ax);};}
function hb2Berths(b){/* the two inner berths at the middle of the pier, one each side */const all=harbourBerths(b).filter((o,i,arr)=>true);const F=hbFrame(b),mid=1.7+(F.L-1.7)/2;const pick=side=>{let best=null,bd=1e9;for(const o of all){if(o.side!==side)continue;const d=Math.abs(o.q[0]+o.q[1]-(F.w(mid,side?F.W+0.05:-0.05)[0]+F.w(mid,side?F.W+0.05:-0.05)[1]))+Math.abs(Math.hypot(o.q[0]-F.w(mid,0)[0],o.q[1]-F.w(mid,0)[1])-(side?F.W:0)*0);if(d<bd){bd=d;best=o;}}return best;};
  return [pick(0),pick(1)].filter(Boolean);}
function drawHarbourOpt(b,win){const F=hbFrame(b),Lp=F.L,W=F.W,hP=F.hL+4,hD=4,pa=1.7,ps0=W/2-0.36,ps1=W/2+0.36;const depth=(a,s)=>{const q=F.w(a,s);return q[0]+q[1];};const items=[];
  const sea=(a,s)=>{const q=F.w(a,s);return tAt(Math.round(q[0]),Math.round(q[1]))===T.SEA;};
  const home=S.ships.filter(s=>!s.away),berths=hb2Berths(b),back=depth(2,-1)<depth(2,W+1)?0:1;
  const ships=PROP_B===b?home.slice(0,2).map((s,i)=>{const sp=berths.find(o=>o.side===(i===0?(1-back):back))||berths[i];if(!sp)return null;const p=iso(sp.q[0],sp.q[1]);return {side:sp.side,f:()=>{const bob=Math.sin(t*1.2+i)*1.0;drawShip(p[0],p[1]+3+bob,0.34,sp.flip,s.type);SHIP_HITS.push([p[0],p[1]]);}};}).filter(Boolean):[];
  ships.filter(o=>o.side===back).forEach(o=>o.f());
  if(!win){const c=hbRect(F,pa,Lp-0.05,ps0,ps1);poly(P([c.T[0]+3,c.T[1]+3],[c.R[0]+3,c.R[1]+3],[c.Bt[0]+3,c.Bt[1]+3],[c.L[0]+3,c.L[1]+3]),'rgba(20,34,44,0.25)');}
  for(let a=0.3;a<pa;a+=0.55)for(const s of [0.12,W-0.12])if(sea(a,s)){const p=F.S(a,s,0);hbPile(p[0],p[1]+2,2,hP,win);}
  for(let a=pa+0.15;a<Lp;a+=0.6)for(const s of [ps0+0.04,ps1-0.04]){const p=F.S(a,s,0);hbPile(p[0],p[1]+2,2,hD,win);}
  hbDeck(F,0.04,pa+0.02,0.04,W-0.04,hP,win,'#9C7E5E',0.16);hbDeck(F,pa,Lp-0.05,ps0,ps1,hD,win,'#A88A69',0.14);
  if(hP>hD+1){const a=F.S(pa,ps0,hP),b2=F.S(pa,ps1,hP),c2=F.S(pa+0.35,ps1,hD),d=F.S(pa+0.35,ps0,hD);poly(P(a,b2,c2,d),win?'#E2E3DF':'#97795A');}
  for(let a=pa+0.6;a<Lp-0.2;a+=1.2)for(const s of [ps0+0.05,ps1-0.05]){const p=F.S(a,s,0);items.push({d:depth(a,s),f:()=>hbPile(p[0],p[1],0,hD+6,win)});}
  {const a=Lp-0.22,s=ps1-0.06,p=F.S(a,s,hD);items.push({d:depth(a,s),f:()=>{hoLine(p,[p[0],p[1]-20],win?'#5E564C':'#3E2E22',1.4);hoLine([p[0],p[1]-19],[p[0]+(F.ax==='x'?-4:4),p[1]-19],win?'#5E564C':'#3E2E22',1);
    const lx=p[0]+(F.ax==='x'?-4:4),ly=p[1]-17;ctx.fillStyle='#3E3A36';ctx.fillRect(lx-2,ly-1,4,5);ctx.fillStyle=win?'#FFD27A':'#E8B860';ctx.fillRect(lx-1.2,ly+0.2,2.4,2.8);if(!win){ctx.fillStyle='rgba(255,200,110,0.2)';ctx.beginPath();ctx.arc(lx,ly+1.5,6,0,6.3);ctx.fill();}}});}
  /* boathouse in the style kit, on the platform */{const Q=F.w(0.68,W*0.3),q0=iso(Q[0],Q[1]),fx=(x,y,h)=>{const p=iso(Q[0]+x,Q[1]+y);return [p[0],p[1]-(h||0)-hP];},fh=F.ax==='x'?fx:(a,c,h)=>fx(c,a,h);
    const J=WOOD_SET[2],g={sd:(b.id||0)*3,hl:0.5,hw:0.4,fh:1,wh:11,rh:11,ov:0.06,th:1.6,wt:'planks',wall:'#6E5442',wallD:'#54402F',roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,frame:true,frameCol:'#2A1F18',k:1,v:1};
    items.push({d:depth(0.68,W*0.3)+0.3,f:()=>{const r=hoRoof(fh,g,win);r.back();hoWalls(fh,g,win);r.end();hoDoor(fh,g,'G',0,0.16,7.5,{col:'#4A3424'});hoWindow(fh,g,'L',-0.15,0.09,4.5,7.5,{shutters:'#2E4A5E'});r.front();r.ridge();hoBarge(fh,g,'#4A3424',0.25,true);}});}
  /* a few goods only: two barrels and a crate by the boathouse */for(const [a,s,k] of [[1.4,W*0.82,'barrel'],[1.25,W*0.9,'barrel'],[1.45,W*0.66,'crate']]){const p=F.S(a,s,hP);items.push({d:depth(a,s),f:()=>{if(k==='crate')hbCrate(p[0],p[1]+2,win);else brBarrel([p[0],p[1]+2],1,win);}});}
  items.sort((x,y)=>x.d-y.d).forEach(o=>o.f());ships.filter(o=>o.side!==back).forEach(o=>o.f());}
function ydFrame(b){/* the sea side of the shipyard plot: F has +a,+c toward the viewer; the sea lies at c = s·C */const f0=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:0}),isS=(x,y)=>inMap(x,y)&&ter[y*N+x]===T.SEA,cx=b.fx+b.w/2-0.5,cy=b.fy+b.h/2-0.5;
  let sx=0,sy=0,n=0;for(let y=b.fy-1;y<=b.fy+b.h;y++)for(let x=b.fx-1;x<=b.fx+b.w;x++)if(isS(x,y)){sx+=x-cx;sy+=y-cy;n++;}const alongY=Math.abs(sy)>=Math.abs(sx);
  const s=(alongY?sy:sx)>=0?1:-1,F=alongY?f0:(a,c,h)=>f0(c,a,h),A=(alongY?b.w:b.h)/2,C=(alongY?b.h:b.w)/2;return {F,s,A,C,flip:alongY};}
function drawYardOpt(b,win,opt){const {F,s,A,C,flip}=ydFrame(b),sd=(b.id||0)*73+opt,J=WOOD_SET[opt===2?4:opt===3?3:2],tt=typeof t==='number'?t:0;
  const big=opt===2,qd=0.42,hwv=big?0.62:0.55,hc=opt===3?s*(C-qd-hwv):-s*(C-0.55),H=(a,c,h)=>F(a,c+hc,h);/* option 3: the hall stands against the quay */
  const g={sd,hl:A-0.25,hw:opt===3?hwv:big?0.62:0.48,fh:big?2.2:2.4,wh:big?3.4:15,rh:big?40:18,ov:0.07,th:1.7,wt:opt===1?'logs':'planks',wall:opt===1?'#7E6248':opt===3?'#8A7A64':'#6E5442',wallD:opt===1?'#5F4936':opt===3?'#6E604E':'#54402F',
    roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,blue:J.blue,frame:opt!==1,frameCol:'#2A1F18',k:1,v:1};
  const hall=()=>{const r=hoRoof(H,g,win);r.back();hoFooting(H,g,win);hoWalls(H,g,win);if(opt===3)hoStoneBox(H,0,0,g.hl,g.hw,g.fh,g.fh+7,win,sd);r.end();
    if(!big){/* wide double gate on the long wall facing the yard (if that wall is the visible one), otherwise a door on the gable */if(s>0){const P=(a,h)=>H(a,g.hw+0.004,h);hoQ([P(-0.3,g.fh),P(0.3,g.fh),P(0.3,g.fh+10),P(-0.3,g.fh+10)],'#4A3424');if(!win){ctx.strokeStyle='rgba(20,12,6,0.5)';ctx.lineWidth=0.45;ctx.beginPath();for(let k=1;k<8;k++){const p=P(-0.3+0.6*k/8,g.fh),q=P(-0.3+0.6*k/8,g.fh+10);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();hoLine(P(0,g.fh),P(0,g.fh+10),'#2A1F18',0.8);for(const h of [g.fh+2.5,g.fh+7.5])hoLine(P(-0.29,h),P(0.29,h),'#2E2C2A',0.8);}}
      hoDoor(H,g,'G',0,0.16,8.5,{col:'#4A3424',steps:1});for(const a of [-g.hl+0.35,g.hl-0.35])hoWindow(H,g,'L',a,0.1,g.fh+6,g.fh+9.4,{shutters:'#2E4A5E'});}
    else{/* A-frame: tall pointed door on the gable */const P=(c,h)=>H(g.hl+0.004,c,h),dw=0.16,dh=16;hoQ([P(-dw,g.fh),P(dw,g.fh),P(dw,g.fh+dh),P(0,g.fh+dh+5),P(-dw,g.fh+dh)],'#4A3424');for(const c of [-dw-0.02,dw+0.02])hoLine(P(c,g.fh),P(c,g.fh+dh+0.3),'#3A2A1C',1.3);hoLine(P(-dw-0.02,g.fh+dh+0.3),P(0,g.fh+dh+5.4),'#3A2A1C',1.3);hoLine(P(dw+0.02,g.fh+dh+0.3),P(0,g.fh+dh+5.4),'#3A2A1C',1.3);}
    if(opt===4&&s>0){/* open bay at the end of the long wall: planks stacked inside */const P=(a,h)=>H(a,g.hw+0.004,h),a0=g.hl-0.95,a1=g.hl-0.45;hoQ([P(a0,g.fh),P(a1,g.fh),P(a1,g.wh-2),P(a0,g.wh-2)],win?'#C8C2B8':'#1E160F');if(!win)for(let k=0;k<5;k++)hoQ([P(a0+0.04,g.fh+k*1.6),P(a1-0.04,g.fh+k*1.6),P(a1-0.04,g.fh+k*1.6+1.1),P(a0+0.04,g.fh+k*1.6+1.1)],k%2?'#C8A878':'#B8966A');}
    r.front();r.ridge();hoBarge(H,g,'#4A3424',0.25,true);};
  /* José (option 3): a narrow timber quay along the whole water side, joined to the hall, and a pier like the Harbour's, shorter; the ship on the stocks lies in the yard, along the shore */
  const qc0=s>0?C-qd:-C,qc1=s>0?C:-C+qd,hq=3.5,DK=win?'#E2E3DF':'#9C7E5E',DP=win?'#E2E3DF':'#A88A69';
  const deck=(a0,a1,c0,c1,h,top,acrossA)=>{/* timber deck in F: piles, the two visible edge faces, planks */for(let a=a0+0.12;a<a1;a+=0.5)for(const c of [c0+0.04,c1-0.04]){const p=F(a,c,0);hbPile(p[0],p[1]+2,2,h,win);}
    hoQ([F(a0,c1,0),F(a1,c1,0),F(a1,c1,h),F(a0,c1,h)],win?'#8E8478':'#5C4634');hoQ([F(a1,c0,0),F(a1,c1,0),F(a1,c1,h),F(a1,c0,h)],win?'#7A7166':'#4A382A');hoQ([F(a0,c0,h),F(a1,c0,h),F(a1,c1,h),F(a0,c1,h)],top);
    if(!win){ctx.strokeStyle='rgba(50,36,26,0.38)';ctx.lineWidth=0.55;ctx.beginPath();if(acrossA){for(let a=a0+0.14;a<a1-0.02;a+=0.14){const p=F(a,c0,h),q=F(a,c1,h);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}}else{for(let c=c0+0.14;c<c1-0.02;c+=0.14){const p=F(a0,c,h),q=F(a1,c,h);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}}ctx.stroke();}};
  const quay=()=>{deck(-A,A,qc0,qc1,hq,DK,true);/* a short ramp from the hall's yard down onto the quay is not needed: the yard is level with it */};
  const pa=A*0.45,pw=0.36,pL=2.0,pc0=s>0?C:-C-pL,pc1=s>0?C+pL:-C;
  const pier=()=>{deck(pa-pw,pa+pw,pc0,pc1,hq,DP,false);for(const k of [0.35,0.75])for(const o of [-pw+0.05,pw-0.05]){const c=s>0?pc0+(pc1-pc0)*k:pc1-(pc1-pc0)*k,p=F(pa+o,c,0);hbPile(p[0],p[1],0,hq+6,win);}
    {const c=s>0?pc1-0.15:pc0+0.15,p=F(pa+pw-0.06,c,hq);hoLine(p,[p[0],p[1]-18],win?'#5E564C':'#3E2E22',1.4);hoLine([p[0],p[1]-17],[p[0]-4,p[1]-17],win?'#5E564C':'#3E2E22',1);const lx=p[0]-4,ly=p[1]-15;ctx.fillStyle='#3E3A36';ctx.fillRect(lx-2,ly-1,4,5);ctx.fillStyle=win?'#FFD27A':'#E8B860';ctx.fillRect(lx-1.2,ly+0.2,2.4,2.8);}};
  const yard=()=>{/* the ship on its stocks in the yard, lying along the shore */const yc=(hc+s*g.hw+(s>0?qc0:qc1))/2,pr=b.proj?b.proj.done/SHIPS[b.proj.type].work:0.55;
    if(!win)for(const o of [-0.5,-0.15,0.2,0.55]){const p=F(-A*0.3+o,yc,0);hoQ([[p[0]-2,p[1]],[p[0]+2,p[1]],[p[0]+1.4,p[1]-4],[p[0]-1.4,p[1]-4]],'#4A3424');}
    const m=F(-A*0.3,yc,5);drawShip(m[0],m[1],0.28,!flip,b.proj?b.proj.type:'karvi',pr);};
  const moored=()=>{const home=S.ships.filter(x=>!x.away);if(!home.length&&!b.gallery)return;const p=F(pa+pw+0.5,(pc0+pc1)/2,0);drawShip(p[0],p[1]+3+Math.sin(tt*1.2)*1,0.32,!flip,'karvi');};
  /* the ship is built inside the hall and slid out through the gate onto the quay */
  if(s>0){hall();quay();pier();moored();}else{moored();pier();quay();hall();}}
{const _shY2=shShape;shShape=function(b){if(b.t==='shipyard'&&YARD_OPT){const {F,s,A,C}=ydFrame(b),hc=YARD_OPT===3?s*(C-0.97):-s*(C-0.55),box=(a,c,sa,sc,h)=>({pts:[F(a-sa,c-sc,0),F(a+sa,c-sc,0),F(a+sa,c+sc,0),F(a-sa,c+sc,0)],h});return [box(0,hc,A-0.2,0.55,YARD_OPT===2?0.2:0.9),box(0,hc,A-0.2,0.06,YARD_OPT===2?1.6:1.4)];}return _shY2(b);};}

/* =================== Thrall Pen options (prototype) — window.__setThrall(n) ===================
   3×2, houses thralls (8, +4 per level); they may try to flee, so the yard is fenced. Humble, undecorated buildings.
   1 Low thatched longhouse + woven wattle fence with a plank gate · 2 Low log house, black scales + a fence of sharpened stakes, barred gate
   3 Wattle-and-daub longhouse with thatch, open yard with a water trough · 4 Two small sunken huts (roofs to the ground) inside a wattle fence */
let THR_OPT=0;window.__setThrall=n=>{THR_OPT=n|0;};
{const _dsR=drawShaped;drawShaped=function(b,win,c0,ax){if(THR_OPT&&b.t==='thrall'){drawThrallOpt(b,win,THR_OPT);return true;}return _dsR(b,win,c0,ax);};}
function thStakes(f,p0,p1,h,win){/* low fence of sharpened stakes with a rail */const n=Math.max(2,Math.round(Math.hypot(p1[0]-p0[0],p1[1]-p0[1])/0.11)),pts=[];for(let k=0;k<=n;k++){const u=k/n;pts.push(f(p0[0]+(p1[0]-p0[0])*u,p0[1]+(p1[1]-p0[1])*u,0));}
  pts.sort((p,q)=>p[1]-q[1]);for(const p of pts)twLog(p,h,1.25,win);hoLine(f(p0[0],p0[1],h*0.55),f(p1[0],p1[1],h*0.55),win?'#B8B0A0':'#4A3424',0.8);}
function thGate(f,a0,a1,c,h,win,bar){const G=(a,hh)=>f(a,c,hh);hoQ([G(a0+0.02,0.5),G(a1-0.02,0.5),G(a1-0.02,h-0.5),G(a0+0.02,h-0.5)],win?'#D8D2C6':'#7A5E42');if(!win){ctx.strokeStyle='rgba(30,20,12,0.5)';ctx.lineWidth=0.45;ctx.beginPath();for(let a=a0+0.08;a<a1-0.04;a+=0.07){const p=G(a,0.5),q=G(a,h-0.5);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();}
  hoLine(G(a0+0.03,1.5),G(a1-0.03,h-1.2),'#5A4230',1.1);for(const a of [a0,a1])hoLine(G(a,0),G(a,h+1.5),'#3A2A1C',1.6);if(bar)hoLine(G(a0-0.05,h*0.55),G(a1+0.05,h*0.55),'#2E2C2A',1.4);}
function drawThrallOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),L=Math.min(5,b.lvl||1),sd=(b.id||0)*79+opt,Ea=1.42,Ec=0.92;
  const hl=L>=5?1.05:L>=3?0.95:0.85,hc=-0.3,fw=(a,c,h)=>f(a-0.1,c+hc,h);
  const fenceRuns=(back)=>back?[[[-Ea,-Ec],[Ea,-Ec]],[[-Ea,-Ec],[-Ea,Ec]]]:[[[Ea,-Ec],[Ea,Ec]],[[-Ea,Ec],[0.55,Ec]],[[1.05,Ec],[Ea,Ec]]];
  const fence=(back)=>{if(opt===3)return;fenceRuns(back).forEach((r,i)=>{if(opt===2||opt===4)thStakes(f,r[0],r[1],10,win);else hoWattle(f,r[0],r[1],7,win,sd+i+(back?0:5));});if(!back)thGate(f,0.55,1.05,Ec,opt===2||opt===4?10:7.5,win,opt===2||opt===4);};
  const J=opt===2?WOOD_SET[2]:WOOD_SET[1];
  const g={sd,hl,hw:0.42,fh:1.6,wh:opt===3?10:9,rh:opt===2?11:14,ov:0.08,th:J.rt==='thatch'?4.5:1.6,wt:opt===2?'logs':'planks',wall:opt===3?'#B49C78':opt===2?'#6E5440':'#7A6650',wallD:opt===3?'#94805E':opt===2?'#56402F':'#5E4E3C',
    roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,frame:opt===3,frameCol:'#4A3424',k:1,v:1};
  fence(true);
  if(opt===4){/* two small sunken huts */for(const [a,c] of [[-0.58,-0.25],[0.42,-0.25]]){/* turned 90°: ridge across the plot, the door gables face the gate (José) */const fh=(x,y,h)=>f(y+a,x+c,h),gh={sd:sd+a*10|0,hl:0.5,hw:0.34,fh:0.8,wh:2.4,rh:15,ov:0.05,th:0.8,wt:'planks',wall:'#6E5A44',wallD:'#56442F',roof:J.roof,roofD:J.roofD,roofE:J.roofD,/* no dark band at the eave (José) */rt:J.rt,frame:false,k:1,v:1};
      const r=hoRoof(fh,gh,win);r.back();hoWalls(fh,gh,win);r.end();{const P=(cc,h)=>fh(gh.hl+0.004,cc,h);hoQ([P(-0.07,0.8),P(0.07,0.8),P(0.07,8),P(0,10),P(-0.07,8)],'#2A1F16');}r.front();r.ridge();}}
  else{const r=hoRoof(fw,g,win);r.back();hoFooting(fw,g,win);hoWalls(fw,g,win);
    if(opt===3&&!win){/* daub: wattle showing where the clay has fallen away */ctx.strokeStyle='rgba(90,70,40,0.45)';ctx.lineWidth=0.5;for(const [a,h] of [[-0.5,4],[0.4,6]]){const p=fw(a,g.hw+0.004,h);ctx.beginPath();for(let k=0;k<4;k++){ctx.moveTo(p[0]-3,p[1]+k*1.2);ctx.quadraticCurveTo(p[0],p[1]+k*1.2+(k%2?0.8:-0.8),p[0]+3,p[1]+k*1.2);}ctx.stroke();}}
    r.end();hoDoor(fw,g,'L',0.15,0.16,7,{col:'#5A4230'});if(L>=3)hoWindow(fw,g,'L',-0.45,0.07,g.fh+4,g.fh+6,{lit:true});r.front();r.ridge();if(opt===3)hoBarge(fw,g,'#5A4230',0.18,false);
    if(opt!==2){/* smoke hole on the ridge */const top=g.wh+g.rh,p=fw(-0.2,0,top+0.5);ctx.fillStyle='#2A1F16';ctx.beginPath();ctx.ellipse(p[0],p[1],2.4,1.1,0,0,6.3);ctx.fill();if(!win)hoSmoke([p[0],p[1]-1]);}}
  if(opt===3){/* water trough hollowed from a log */const p=f(0.9,0.55,0);hoLog(f,0.7,1.15,0.55,1.8,1.8,win);if(!win){const a=f(0.74,0.55,3.4),e=f(1.11,0.55,3.4);ctx.strokeStyle='#4E6A7A';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(e[0],e[1]);ctx.stroke();}}
  fence(false);}
{const _shR=shShape;shShape=function(b){if(b.t==='thrall'&&THR_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),box=(a,c,sa,sc,h)=>({pts:[f(a-sa,c-sc,0),f(a+sa,c-sc,0),f(a+sa,c+sc,0),f(a-sa,c+sc,0)],h});
  if(THR_OPT===4)return [box(-0.58,-0.25,0.36,0.52,0.3),box(0.42,-0.25,0.36,0.52,0.3)];return [box(-0.1,-0.3,1.0,0.5,0.55)];}return _shR(b);};}

/* =================== Ragnar's Ship-Tomb options (prototype) — window.__setTomb(n), window.__TOMBSTAGE = 0 waiting / 1 half built / 2 finished ===================
   4×4 wonder. While it is built: a ship lies in a dug trench with a gabled timber burial chamber on its deck, spoil heaps and a ramp; the mound rises over it.
   Finished: 1 great mound inside a ship-setting of standing stones, a carved runestone · 2 mound with a ring of kerbstones, a dragon post and two bauta stones
   3 low mound inside a huge stone ship of tall stones (Ale's Stones) · 4 mound with Ragnar's carved prow breaking out at the front, shields along its flank, two braziers */
let TOMB_OPT=0;window.__setTomb=n=>{TOMB_OPT=n|0;};
{const _dsT2=drawShaped;drawShaped=function(b,win,c0,ax){if(TOMB_OPT&&b.t==='tomb'){drawTombOpt(b,win,TOMB_OPT);return true;}return _dsT2(b,win,c0,ax);};}
{const _gsT=groundShape;groundShape=function(b,win){if(TOMB_OPT&&b.t==='tomb')return true;return _gsT(b,win);};}
function tmMound(f,ra,rc,H,frac,win,sd,col){/* a grass barrow built from rings; frac (0..1) = how far it has risen; lit from the left */const n=48,steps=26,top=H*frac;if(frac<=0.02)return;
  const ring=(k)=>{const u=k/steps,r=Math.sqrt(Math.max(0,1-u*u)),h=top*u,pts=[];for(let i=0;i<n;i++){const t2=i/n*6.283,j=1+(h2(sd,i,k)-0.5)*0.03;pts.push(f(Math.cos(t2)*ra*r*j,Math.sin(t2)*rc*r*j,h));}return pts;};
  const G=win?['#E8ECEA','#DDE2E0']:col||['#7E9A54','#6E8A48'];
  /* each band in segments, shaded by which way the slope faces (light from the upper left) */
  for(let k=0;k<steps;k++){const lo=ring(k),hi=ring(k+1),u=(k+0.5)/steps,slope=Math.max(0.15,1-u*u);
    for(let i=0;i<n;i++){const tm=(i+0.5)/n*6.283;if(Math.cos(tm)+Math.sin(tm)<-0.9&&k<steps-1)continue;const face=-(Math.cos(tm)-Math.sin(tm))/1.414,toward=(Math.cos(tm)+Math.sin(tm))/1.414;
      const lit=0.9+0.22*face*slope+0.08*u-0.06*Math.max(0,toward)*slope;const col=shade(G[0],lit),q=[lo[i],lo[(i+1)%n],hi[(i+1)%n],hi[i]];hoQ(q,col);ctx.strokeStyle=col;ctx.lineWidth=0.7;ctx.stroke();}}
  /* a darker foot where the turf meets the ground */{const b0=ring(0);ctx.strokeStyle=win?'rgba(150,150,140,0.5)':'rgba(40,52,24,0.45)';ctx.lineWidth=1.2;ctx.beginPath();for(let i=0;i<=n/2;i++){const p=b0[(i+n*7/8|0)%n];i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();}
  hoQ(ring(steps),shade(G[0],1.0));
  if(!win){/* light on the left flank, shade on the right */const L=ring(Math.round(steps*0.5));ctx.fillStyle='rgba(255,250,220,0.10)';ctx.beginPath();const c0=f(-ra*0.35,0,top*0.6);ctx.ellipse(c0[0],c0[1],ra*12,rc*9,0,0,6.3);ctx.fill();
    ctx.strokeStyle='rgba(60,80,36,0.55)';ctx.lineWidth=0.5;ctx.beginPath();for(let i=0;i<140;i++){const t2=h2(sd,i,51)*6.283,u=h2(sd,i,52),r=Math.sqrt(1-u*u),p=f(Math.cos(t2)*ra*r,Math.sin(t2)*rc*r,top*u);if(Math.cos(t2)+Math.sin(t2)<-0.6&&u<0.5)continue;ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+0.5,p[1]-1.8);}ctx.stroke();
    for(let i=0;i<26;i++){const t2=h2(sd,i,53)*6.283,u=h2(sd,i,54)*0.9,r=Math.sqrt(1-u*u),p=f(Math.cos(t2)*ra*r,Math.sin(t2)*rc*r,top*u);if(Math.cos(t2)+Math.sin(t2)<-0.4)continue;ctx.fillStyle=i%3===0?'#E8E0F0':i%3===1?'#E8C84A':'#B86A8A';ctx.beginPath();ctx.arc(p[0],p[1]-0.6,0.7,0,6.3);ctx.fill();}}}
function tmShip(f,L,W,win,pr,sd){/* clinker longship along a: far gunwale and inside, ribs, strakes on the near side, curled stem and stern with a dragon head at the bow (+a) */
  const n=24,wid=u=>W*Math.pow(Math.max(0,1-u*u),0.7),sheer=u=>8+5*Math.pow(Math.abs(u),3),keel=u=>1.5+1.5*u*u,P=(u,side,h)=>f(u*L,side*wid(u),h);
  const wood=win?'#C8C0B0':'#6E543D',woodL=win?'#D8D0C0':'#8A6A48',woodD=win?'#B0A898':'#4E3A28';
  /* inside (far side planking and floor) */{const pts=[];for(let i=0;i<=n;i++){const u=-1+2*i/n;pts.push(P(u,-1,sheer(u)));}for(let i=n;i>=0;i--){const u=-1+2*i/n;pts.push(P(u,0,keel(u)+2));}hoQ(pts,woodD);}
  if(!win){/* ribs */ctx.strokeStyle=shade(woodD,0.75);ctx.lineWidth=0.8;ctx.beginPath();for(let i=2;i<n-1;i+=2){const u=-1+2*i/n,p=P(u,-1,sheer(u)),q=P(u,0,keel(u)+2),r=P(u,1,sheer(u)-1);ctx.moveTo(p[0],p[1]);ctx.quadraticCurveTo(q[0],q[1]+1,r[0],r[1]);}ctx.stroke();}
  if(pr<0.35){/* only keel, ribs and the first strakes so far */hoLine(P(-1,0,keel(-1)),P(1,0,keel(1)),woodD,1.6);for(let i=1;i<n;i+=2){const u=-1+2*i/n;hoLine(P(u,1,sheer(u)*0.9),P(u,0,keel(u)),wood,0.9);}return;}
  /* near side: strakes as stacked bands from keel to sheer */const S=5;for(let k=0;k<S;k++){const pts=[],v0=k/S,v1=(k+1)/S;for(let i=0;i<=n;i++){const u=-1+2*i/n;pts.push(P(u,Math.sqrt(v1),keel(u)+(sheer(u)-keel(u))*v1));}for(let i=n;i>=0;i--){const u=-1+2*i/n;pts.push(P(u,Math.sqrt(v0),keel(u)+(sheer(u)-keel(u))*v0));}
    hoQ(pts,k%2?wood:woodL);}
  if(!win){ctx.fillStyle='rgba(30,22,14,0.8)';for(let k=1;k<S;k++)for(let i=1;i<n;i+=1){const u=-1+2*i/n,p=P(u,Math.sqrt(k/S),keel(u)+(sheer(u)-keel(u))*k/S);ctx.fillRect(p[0]-0.3,p[1]-0.3,0.6,0.6);}}
  hoLine(P(-1,1,sheer(-1)),P(1,1,sheer(1)),woodD,0.9);{const pts=[];for(let i=0;i<=n;i++){const u=-1+2*i/n;pts.push(P(u,1,sheer(u)));}ctx.strokeStyle=woodL;ctx.lineWidth=1.2;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();}
  /* stem and stern posts curling up; dragon head at the bow */for(const e of [-1,1]){const b0=P(e,0,sheer(e)),b1=f(e*(L+0.12),0,sheer(e)+10),b2=f(e*(L+0.02),0,sheer(e)+17);ctx.strokeStyle=woodD;ctx.lineWidth=2.4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(b0[0],b0[1]);ctx.quadraticCurveTo(b1[0],b1[1],b2[0],b2[1]);ctx.stroke();ctx.lineCap='butt';
    if(e>0){/* dragon head */ctx.fillStyle=woodD;ctx.beginPath();ctx.moveTo(b2[0]-1,b2[1]+1);ctx.lineTo(b2[0]+5,b2[1]-1);ctx.lineTo(b2[0]+6.5,b2[1]+1.4);ctx.lineTo(b2[0]+2,b2[1]+2);ctx.lineTo(b2[0]+5,b2[1]+3.4);ctx.lineTo(b2[0],b2[1]+3);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(b2[0]-1,b2[1]);ctx.lineTo(b2[0]-2.5,b2[1]-4);ctx.lineTo(b2[0]+1.5,b2[1]-1);ctx.fill();if(!win){ctx.fillStyle='#C9A042';ctx.fillRect(b2[0]+2.4,b2[1]-0.2,0.9,0.9);ctx.strokeStyle='#C9A042';ctx.lineWidth=0.4;ctx.beginPath();ctx.moveTo(b0[0],b0[1]-1);ctx.quadraticCurveTo(b1[0],b1[1]-1,b2[0],b2[1]+1);ctx.stroke();}}
    else{ctx.strokeStyle=woodD;ctx.lineWidth=1.6;ctx.beginPath();const c=[b2[0]-2,b2[1]-2];ctx.arc(c[0],c[1],2.2,0.3,4.2);ctx.stroke();}}
  /* round shields along the near gunwale */if(pr>0.7&&!win)for(let i=0;i<9;i++){const u=-0.72+i*0.18,p=P(u,1,sheer(u)-1.2);arShield(p,1.9,i,win);}}
function tmChamber(f,a,win,sd){/* the gabled timber burial chamber on deck, black boards, a door board */const J=WOOD_SET[2],g={sd,hl:0.32,hw:0.24,fh:5,wh:11,rh:9,ov:0.03,th:1,wt:'planks',wall:'#4A3A2C',wallD:'#38291E',roof:J.roof,roofD:J.roofD,roofE:J.roofD,rt:'boards',frame:false,k:1,v:1};
  const fc=(x,y,h)=>f(x+a,y,h),r=hoRoof(fc,g,win);r.back();hoWalls(fc,g,win);r.end();hoRect(fc,g,'G',-0.06,0.06,g.fh,g.fh+5,'#2A1F16');r.front();r.ridge();hoBarge(fc,g,'#3A2A1C',0.25,true);}
function tmRunestone(p,win,H,sd){/* tall runestone: rounded top, a red serpent band with runes, lichen */const w=6,hh=H||26;ctx.fillStyle=win?'#D4D6D2':'#8E877B';ctx.beginPath();ctx.moveTo(p[0]-w,p[1]);ctx.lineTo(p[0]-w*0.9,p[1]-hh*0.8);ctx.quadraticCurveTo(p[0]-w*0.5,p[1]-hh*1.05,p[0]+w*0.2,p[1]-hh);ctx.quadraticCurveTo(p[0]+w,p[1]-hh*0.85,p[0]+w*0.9,p[1]-hh*0.5);ctx.lineTo(p[0]+w,p[1]);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(30,26,20,0.25)';ctx.beginPath();ctx.moveTo(p[0]+w*0.35,p[1]);ctx.lineTo(p[0]+w*0.4,p[1]-hh*0.95);ctx.quadraticCurveTo(p[0]+w,p[1]-hh*0.85,p[0]+w*0.9,p[1]-hh*0.5);ctx.lineTo(p[0]+w,p[1]);ctx.closePath();ctx.fill();if(win)return;
  ctx.strokeStyle='#A33A2E';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(p[0]-w*0.55,p[1]-1);ctx.bezierCurveTo(p[0]-w*0.75,p[1]-hh*0.6,p[0]-w*0.3,p[1]-hh*0.95,p[0]+w*0.1,p[1]-hh*0.88);ctx.bezierCurveTo(p[0]+w*0.5,p[1]-hh*0.8,p[0]+w*0.55,p[1]-hh*0.4,p[0]+w*0.35,p[1]-1);ctx.stroke();
  ctx.fillStyle='#A33A2E';ctx.beginPath();ctx.ellipse(p[0]+w*0.35,p[1]-1.5,1.4,1,0,0,6.3);ctx.fill();ctx.strokeStyle='rgba(40,30,22,0.65)';ctx.lineWidth=0.45;ctx.beginPath();for(let k=0;k<7;k++){const y=p[1]-4-k*hh*0.1;ctx.moveTo(p[0]-w*0.2,y);ctx.lineTo(p[0]-w*0.05,y-1.2);ctx.moveTo(p[0]+w*0.02,y);ctx.lineTo(p[0]+w*0.02,y-1.4);}ctx.stroke();
  ctx.strokeStyle='#C9A042';ctx.lineWidth=0.6;ctx.beginPath();ctx.moveTo(p[0]-2,p[1]-hh*0.45);ctx.lineTo(p[0]+1.5,p[1]-hh*0.45);ctx.moveTo(p[0]-0.2,p[1]-hh*0.55);ctx.lineTo(p[0]-0.2,p[1]-hh*0.35);ctx.stroke();
  ctx.fillStyle='rgba(150,170,90,0.6)';ctx.beginPath();ctx.ellipse(p[0]-w*0.5,p[1]-hh*0.25,1.6,1,0.4,0,6.3);ctx.fill();ctx.fillStyle='rgba(210,200,120,0.55)';ctx.beginPath();ctx.ellipse(p[0]+w*0.4,p[1]-hh*0.7,1.2,0.8,0,0,6.3);ctx.fill();}
function tmStones(f,L,W,tall,win,sd,front){/* ship-setting of standing stones round an ellipse-ish ship outline; back or front half */const N=14,st=[];for(const side of [-1,1])for(let i=0;i<=N;i++){const u=-1+2*i/N;if(side===1&&(i===0||i===N))continue;const w=W*Math.pow(Math.max(0,1-u*u),0.62);st.push({a:u*L,c:side*w,end:i===0||i===N,k:i+(side>0?40:0)});}
  st.forEach(s=>s.d=s.a+s.c);st.sort((x,y)=>x.d-y.d);for(const s of st){if((s.d>=0)!==front)continue;const h=(s.end?tall*1.6:tall*(0.8+0.25*Math.abs(s.a/L)))+h2(sd,s.k,9)*3;alStone(f(s.a,s.c,0),tall>12?3.6:2.6,h,sd,s.k,win);}}
function tmBrazier(p,win){hoLine([p[0]-2,p[1]],[p[0],p[1]-9],'#2E2C2A',0.8);hoLine([p[0]+2,p[1]],[p[0],p[1]-9],'#2E2C2A',0.8);hoLine([p[0],p[1]+1],[p[0],p[1]-9],'#2E2C2A',0.8);ctx.fillStyle='#2E2C2A';ctx.beginPath();ctx.ellipse(p[0],p[1]-10,3.2,1.4,0,0,3.14);ctx.fill();if(!win)pyFlames([p[0],p[1]-10],3.4,7,win,p[0]);}
function drawTombOpt(b,win,opt){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*83+opt;
  const st=window.__TOMBSTAGE!=null?window.__TOMBSTAGE:(S.tombDone?2:b.proj?1:0),pr=st===2?1:st===1?(b.proj&&b.proj.done?Math.min(0.95,b.proj.done/TOMB_WORK):0.55):0;
  const ra=opt===3?1.25:1.55,rc=opt===3?0.8:1.0,H=opt===3?16:opt===4?36:42;
  /* ground: trodden earth while building, grass ring when done */{const ring=(r1,r2,n)=>{const o=[];for(let i=0;i<n;i++){const t2=i/n*6.283,j=1+(h2(sd,i,77)-0.5)*0.06;o.push(f(Math.cos(t2)*r1*j,Math.sin(t2)*r2*j,0));}return o;};
    hoQ(ring(1.95,1.4,40),win?'rgba(225,228,224,0.5)':st===2?'rgba(110,130,80,0.25)':'rgba(130,112,84,0.45)');if(st<2)hoQ(ring(1.75,1.2,40),win?'rgba(232,230,222,0.8)':'rgba(120,100,72,0.5)');}
  if(st===0){/* waiting: the ship's outline staked out with a rope, the first stones, a pile of timber */const pts=[];for(let i=0;i<=24;i++){const u=-1+2*i/24;pts.push([u*1.35,0.55*Math.pow(Math.max(0,1-u*u),0.62)]);}
    const stake=(a,c)=>{const p=f(a,c,0);hoLine(p,[p[0],p[1]-6],win?'#B8B0A0':'#5A4230',1);};for(const s of [-1,1])for(let i=0;i<=24;i+=3)stake(pts[i][0],s*pts[i][1]);
    if(!win){ctx.strokeStyle='rgba(220,200,150,0.9)';ctx.lineWidth=0.5;for(const s of [-1,1]){ctx.beginPath();pts.forEach((q,i)=>{const p=f(q[0],s*q[1],5);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});ctx.stroke();}}
    hoLogPile(f,0.9,1.7,1.45,[4,3,2],1.6,win);if(opt===1||opt===3)tmStones(f,1.65,0.95,opt===3?16:9,win,sd,false);return;}
  /* building or finished */
  const shipL=1.25,shipW=0.42;
  if(st===1){/* trench, spoil heaps behind, the ship in the trench with its chamber, a ramp, the mound rising over the back */
    {const pts=[];for(let i=0;i<32;i++){const t2=i/32*6.283;pts.push(f(Math.cos(t2)*(shipL+0.18),Math.sin(t2)*(shipW+0.14),0));}hoQ(pts,win?'#D8D8D2':'#5A4632');}
    for(const [a,c,r] of [[-1.2,-1.05,0.36],[0.2,-1.15,0.42],[1.3,-0.85,0.3]]){const pts=[];for(let i=0;i<20;i++){const t2=i/20*6.283;pts.push(f(a+Math.cos(t2)*r,c+Math.sin(t2)*r*0.7,0));}hoQ(pts,win?'#E2E2DC':'#7A6448');const tp=f(a,c,r*14);ctx.fillStyle=win?'#EAEAE4':'#8C7454';ctx.beginPath();const b0=f(a-r,c,0),b1=f(a+r,c,0);ctx.moveTo(b0[0],b0[1]);ctx.quadraticCurveTo(tp[0],tp[1]-4,b1[0],b1[1]);ctx.fill();}
    if(opt===1||opt===3)tmStones(f,1.75,1.05,opt===3?16:9,win,sd,false);
    tmShip(f,shipL,shipW,win,Math.max(0.4,pr),sd);if(pr>0.45)tmChamber(f,-0.1,win,sd);
    /* the mound creeping over the ship from behind: a partial barrow */if(pr>0.6){const fb=(a,c,h)=>f(a,c-0.55,h);tmMound(fb,ra*0.9,rc*0.55,H*0.6,(pr-0.6)*2.2,win,sd);}
    if(opt===1||opt===3)tmStones(f,1.75,1.05,opt===3?16:9,win,sd,true);return;}
  /* finished */
  if(opt===1){tmStones(f,1.85,1.2,10,win,sd,false);tmMound(f,ra,rc,H,1,win,sd);tmStones(f,1.85,1.2,10,win,sd,true);tmRunestone(f(1.75,0.85,0),win,28,sd);}
  else if(opt===2){/* kerbstones round the foot, a carved dragon post at the front, two bauta stones */const N=30;const ks=[];for(let i=0;i<N;i++){const t2=i/N*6.283;ks.push({d:Math.cos(t2)*ra+Math.sin(t2)*rc,p:f(Math.cos(t2)*(ra+0.06),Math.sin(t2)*(rc+0.06),0),k:i});}
    ks.sort((x,y)=>x.d-y.d);for(const s of ks.filter(s=>s.d<0))alCobble([s.p[0],s.p[1]-1.4],3,2,win?'#D4D6D2':h2(sd,s.k,4)>0.5?'#8E877B':'#7A746A',win);tmMound(f,ra,rc,H,1,win,sd);for(const s of ks.filter(s=>s.d>=0))alCobble([s.p[0],s.p[1]-1.4],3,2,win?'#D4D6D2':h2(sd,s.k,4)>0.5?'#8E877B':'#7A746A',win);
    alStone(f(-1.6,1.2,0),3.4,22,sd,1,win);alStone(f(1.25,-1.45,0),3.4,20,sd,2,win);
    {const p=f(1.75,0.95,0),q=[p[0],p[1]-34];hoLine(p,q,win?'#B8B0A0':'#4A3424',2.2);if(!win){for(let k=0;k<4;k++)hoLine([p[0]-1.1,p[1]-8-k*6],[p[0]+1.1,p[1]-10-k*6],'#C9A042',0.6);ctx.fillStyle='#4A3424';ctx.beginPath();ctx.moveTo(q[0]-1,q[1]+2);ctx.quadraticCurveTo(q[0]-1,q[1]-5,q[0]+4,q[1]-7);ctx.lineTo(q[0]+8,q[1]-5.5);ctx.lineTo(q[0]+4.5,q[1]-4.5);ctx.lineTo(q[0]+7,q[1]-3);ctx.lineTo(q[0]+2,q[1]-3);ctx.quadraticCurveTo(q[0]+1,q[1],q[0]+1,q[1]+2);ctx.closePath();ctx.fill();ctx.fillStyle='#C9A042';ctx.fillRect(q[0]+4,q[1]-6,0.9,0.9);}}}
  else if(opt===3){tmStones(f,1.9,1.15,17,win,sd,false);tmMound(f,ra,rc,H,1,win,sd);tmStones(f,1.9,1.15,17,win,sd,true);}
  else{/* the prow breaks out of the mound at the front; shields along its flank; two braziers */tmMound(f,ra,rc,H,1,win,sd);
    {const P=(a,c,h)=>f(a,c,h),b0=P(ra*0.92,0.05,6),b1=P(ra+0.35,0.05,22),b2=P(ra+0.2,0.05,32);ctx.strokeStyle=win?'#B8B0A0':'#4E3A28';ctx.lineWidth=4.4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(b0[0],b0[1]);ctx.quadraticCurveTo(b1[0],b1[1],b2[0],b2[1]);ctx.stroke();ctx.lineCap='butt';
      if(!win){ctx.strokeStyle='#C9A042';ctx.lineWidth=0.6;ctx.beginPath();ctx.moveTo(b0[0]-1,b0[1]);ctx.quadraticCurveTo(b1[0]-1,b1[1],b2[0]-1,b2[1]+1);ctx.stroke();ctx.fillStyle='#4E3A28';ctx.beginPath();ctx.moveTo(b2[0]-2,b2[1]+1);ctx.lineTo(b2[0]+7,b2[1]-2);ctx.lineTo(b2[0]+9,b2[1]+1.6);ctx.lineTo(b2[0]+3,b2[1]+2.4);ctx.lineTo(b2[0]+7,b2[1]+4.6);ctx.lineTo(b2[0],b2[1]+4);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(b2[0]-1.5,b2[1]);ctx.lineTo(b2[0]-3.5,b2[1]-6);ctx.lineTo(b2[0]+2,b2[1]-1.5);ctx.fill();ctx.fillStyle='#E8C84A';ctx.fillRect(b2[0]+3.4,b2[1]-0.6,1,1);}
      /* the strakes showing where the turf parts */const sp=[P(ra*0.8,-0.22,4),P(ra*0.98,0.05,8),P(ra*0.8,0.32,4)];hoQ(sp,win?'#C8C0B0':'#6E543D');}
    if(!win)for(let i=0;i<8;i++){const t2=Math.PI*0.15+i*0.14,p=f(Math.cos(t2)*ra*0.92,Math.sin(t2)*rc*0.92,H*0.12);arShield(p,2.6,i,win);}
    tmBrazier(f(1.95,0.6,0),win);tmBrazier(f(1.3,1.35,0),win);}}
{const _shT2=shShape;shShape=function(b){if(b.t==='tomb'&&TOMB_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),st=window.__TOMBSTAGE!=null?window.__TOMBSTAGE:(S.tombDone?2:b.proj?1:0);const n=24,ell=(ra,rc)=>{const o=[];for(let i=0;i<n;i++){const t2=i/n*6.283;o.push(f(Math.cos(t2)*ra,Math.sin(t2)*rc,0));}return o;};
  if(st===2){const H=TOMB_OPT===3?12:TOMB_OPT===4?26:30;return [{pts:ell(TOMB_OPT===3?1.25:1.55,TOMB_OPT===3?0.8:1.0),h:H/40},{pts:ell(0.9,0.55),h:H/30}];}if(st===1)return [{pts:ell(1.3,0.45),h:0.35}];return [];}return _shT2(b);};}

/* ---- Ship-Tomb, second round (José: no mound; four different ideas). window.__setTomb(5..8) ----
   5 Ship on a stepped stone plinth · 6 Upturned-hull mausoleum (the roof is Ragnar's ship turned over) · 7 Open stone-lined ship grave with bauta stones and a runestone
   8 Ship on trestles inside a ring of carved warrior posts with shields and a dragon gate */
function tmPlinth(f,L,W,tiers,th,win,sd,frac){/* ship-shaped stepped plinth of dressed stone; frac = how many tiers are done */const n=32,wid=(u,k)=>(W+0.12*(tiers-k))*Math.pow(Math.max(0,1-u*u),0.55),len=k=>L+0.18*(tiers-k);let h=0;const done=Math.max(1,Math.round(tiers*frac));
  for(let k=0;k<done;k++){const P=(u,side,hh)=>f(u*len(k),side*wid(u,k),hh),h1=h+th;
    /* visible faces: the near side (+c) and the bow end */const near=[],top=[];for(let i=0;i<=n;i++){const u=-1+2*i/n;near.push(P(u,1,h));}for(let i=n;i>=0;i--){const u=-1+2*i/n;near.push(P(u,1,h1));}hoQ(near,win?'#C9CBC7':'#8E8980');
    {const fr=[];for(let i=n/2;i<=n;i++){const u=-1+2*i/n;fr.push(P(u,-1,h));}for(let i=n;i>=n/2;i--){const u=-1+2*i/n;fr.push(P(u,-1,h1));}hoQ(fr,win?'#B2B4B0':'#76726A');}
    for(let i=0;i<=n;i++){const u=-1+2*i/n;top.push(P(u,1,h1));}for(let i=n;i>=0;i--){const u=-1+2*i/n;top.push(P(u,-1,h1));}hoQ(top,win?'#E2E4E0':'#A39D92');
    if(!win){ctx.strokeStyle='rgba(40,36,30,0.5)';ctx.lineWidth=0.5;ctx.beginPath();for(let i=1;i<n;i++){if((i+k)%2)continue;const u=-1+2*i/n,p=P(u,1,h),q=P(u,1,h1);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}const m0=P(-1,1,h+th/2);ctx.moveTo(m0[0],m0[1]);for(let i=1;i<=n;i++){const p=P(-1+2*i/n,1,h+th/2);ctx.lineTo(p[0],p[1]);}ctx.stroke();
      ctx.fillStyle='rgba(110,130,70,0.45)';for(let i=0;i<4;i++){const u=-0.8+i*0.5,p=P(u,1,h+0.6);ctx.beginPath();ctx.ellipse(p[0],p[1],2.4,0.8,0,0,6.3);ctx.fill();}}
    h=h1;}
  return h;}
function tmUpturned(f,L,W,h0,H,win,sd,frac){/* the ship turned over as a roof: clinker strakes curving down from the keel to the eaves; stem and stern rise at the ends, a dragon head at the bow */
  const n=28,wid=u=>W*Math.pow(Math.max(0,1-u*u),0.62),prof=u=>Math.pow(Math.max(0,1-u*u),0.35),P=(u,s,h)=>f(u*L,s*wid(u),h),K=u=>h0+H*prof(u);
  const wood=win?'#C8C0B0':'#5E4632',woodL=win?'#D8D0C0':'#7A5A3E',woodD=win?'#B0A898':'#3E2E20',S=6;
  if(frac<0.7){/* only the upturned keel and ribs on the walls */hoLine(P(-1,0,h0+2),P(1,0,h0+2),woodD,1);const pts=[];for(let i=0;i<=n;i++){const u=-1+2*i/n;pts.push(P(u,0,K(u)));}ctx.strokeStyle=woodD;ctx.lineWidth=1.6;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
    ctx.lineWidth=0.9;ctx.strokeStyle=wood;ctx.beginPath();for(let i=1;i<n;i+=2){const u=-1+2*i/n;for(const sd2 of [-1,1]){const a=P(u,0,K(u)),b=P(u,sd2,h0);ctx.moveTo(a[0],a[1]);ctx.quadraticCurveTo(...P(u,sd2*0.9,K(u)*0.9+h0*0.1),b[0],b[1]);}}ctx.stroke();return;}
  /* far slope (only its ridge side shows past the keel) then the near slope in strakes */{const pts=[];for(let i=0;i<=n;i++){const u=-1+2*i/n;pts.push(P(u,0,K(u)));}for(let i=n;i>=0;i--){const u=-1+2*i/n;pts.push(P(u,-1,h0));}hoQ(pts,woodD);}
  for(let k=0;k<S;k++){const s0=k/S,s1=(k+1)/S,ht=s=>h0+(1-s*s),pts=[];for(let i=0;i<=n;i++){const u=-1+2*i/n;pts.push(P(u,s0,h0+(K(u)-h0)*(1-s0*s0)));}for(let i=n;i>=0;i--){const u=-1+2*i/n;pts.push(P(u,s1,h0+(K(u)-h0)*(1-s1*s1)));}hoQ(pts,k%2?wood:woodL);}
  if(!win){ctx.fillStyle='rgba(20,14,8,0.75)';for(let k=1;k<S;k++)for(let i=1;i<n;i++){const u=-1+2*i/n,s=k/S,p=P(u,s,h0+(K(u)-h0)*(1-s*s));ctx.fillRect(p[0]-0.3,p[1]-0.3,0.6,0.6);}
    /* light on the upper strakes */ctx.fillStyle='rgba(255,236,200,0.08)';{const pts=[];for(let i=0;i<=n;i++){const u=-1+2*i/n;pts.push(P(u,0,K(u)));}for(let i=n;i>=0;i--){const u=-1+2*i/n;pts.push(P(u,0.35,h0+(K(u)-h0)*0.88));}hoQ(pts,'rgba(255,236,200,0.10)');}}
  /* keel strip */{ctx.strokeStyle=woodD;ctx.lineWidth=1.8;ctx.beginPath();for(let i=0;i<=n;i++){const u=-1+2*i/n,p=P(u,0,K(u)+0.8);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();}
  /* stem/stern: the keel sweeps up past the ends; a dragon head at the bow, a curled tail at the stern */for(const e of [-1,1]){const b0=P(e*0.97,0,K(e*0.97)),b1=f(e*(L+0.2),0,h0+H*0.6),b2=f(e*(L+0.12),0,h0+H*0.95);ctx.strokeStyle=woodD;ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(b0[0],b0[1]);ctx.lineTo(...f(e*L,0,h0));ctx.quadraticCurveTo(b1[0],b1[1],b2[0],b2[1]);ctx.stroke();ctx.lineCap='butt';
    if(e>0){ctx.fillStyle=woodD;ctx.beginPath();ctx.moveTo(b2[0]-1.4,b2[1]+1.4);ctx.lineTo(b2[0]+6.5,b2[1]-1.4);ctx.lineTo(b2[0]+8.5,b2[1]+1.8);ctx.lineTo(b2[0]+2.6,b2[1]+2.6);ctx.lineTo(b2[0]+6.5,b2[1]+4.6);ctx.lineTo(b2[0],b2[1]+4.2);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(b2[0]-1,b2[1]);ctx.lineTo(b2[0]-3.4,b2[1]-6);ctx.lineTo(b2[0]+2,b2[1]-1.4);ctx.fill();if(!win){ctx.fillStyle='#E8C84A';ctx.fillRect(b2[0]+3.2,b2[1]-0.4,1,1);ctx.strokeStyle='#C9A042';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(b0[0],b0[1]+1);ctx.quadraticCurveTo(b1[0]-1,b1[1],b2[0],b2[1]+2);ctx.stroke();}}
    else{ctx.strokeStyle=woodD;ctx.lineWidth=2;ctx.beginPath();ctx.arc(b2[0]-2.4,b2[1]-1.5,2.6,0.4,4.4);ctx.stroke();}}}
function tmWarriorPost(p,H,win,i){/* carved post: a stylised warrior head on top, bands, a round shield hung on it */hoLine(p,[p[0],p[1]-H],win?'#C8C2B4':'#4E3A28',2.2);if(win)return;for(let k=0;k<3;k++)hoLine([p[0]-1.1,p[1]-H*0.35-k*4],[p[0]+1.1,p[1]-H*0.35-k*4-1.2],'#A34A3A',0.7);
  const hd=[p[0],p[1]-H-2.5];ctx.fillStyle='#6E5038';ctx.beginPath();ctx.ellipse(hd[0],hd[1],2,2.6,0,0,6.3);ctx.fill();ctx.fillStyle='#5E6064';ctx.beginPath();ctx.ellipse(hd[0],hd[1]-1.4,2.2,1.6,0,3.14,6.3);ctx.fill();hoLine([hd[0],hd[1]-1],[hd[0],hd[1]+1.2],'#5E6064',0.6);ctx.fillStyle='#2A1F16';ctx.fillRect(hd[0]-1.2,hd[1]-0.4,0.8,0.5);ctx.fillRect(hd[0]+0.4,hd[1]-0.4,0.8,0.5);
  arShield([p[0],p[1]-H*0.55],3.2,i,win);}
function tmShipFine(f,L,W,win,pr,sd){/* a finer longship: planked floor and thwarts inside, strakes of single planks with rivets and a grain tint, oar ports,
   a mast with the sail furled on its yard, a steering oar at the stern, shields along the gunwale, carved stem and stern with gold */
  const n=32,wid=u=>W*Math.pow(Math.max(0,1-u*u),0.66),sheer=u=>10+7*Math.pow(Math.abs(u),3.2),keel=u=>1.4+1.8*u*u,P=(u,side,h)=>f(u*L,side*wid(u),h);
  const C=win?['#D8D0C0','#C8C0B0','#B8B0A0','#A89F90']:['#8E6C4A','#7A5A3C','#6A4C32','#4E3826'];
  /* inside: far planking */{const pts=[];for(let i=0;i<=n;i++){const u=-1+2*i/n;pts.push(P(u,-1,sheer(u)));}for(let i=n;i>=0;i--){const u=-1+2*i/n;pts.push(P(u,-0.1,keel(u)+2.5));}hoQ(pts,C[3]);}
  if(pr<0.35){hoLine(P(-1,0,keel(-1)),P(1,0,keel(1)),C[3],1.8);for(let i=1;i<n;i+=2){const u=-1+2*i/n;hoLine(P(u,1,sheer(u)*0.9),P(u,0,keel(u)),C[1],1);hoLine(P(u,-1,sheer(u)*0.9),P(u,0,keel(u)),C[2],1);}return;}
  if(!win){/* floor boards and thwarts */{const pts=[];for(let i=2;i<=n-2;i++){const u=-1+2*i/n;pts.push(P(u,-0.55,keel(u)+3));}for(let i=n-2;i>=2;i--){const u=-1+2*i/n;pts.push(P(u,0.55,keel(u)+3));}hoQ(pts,'#7E6044');}
    ctx.strokeStyle='rgba(40,26,14,0.5)';ctx.lineWidth=0.4;ctx.beginPath();for(const s of [-0.3,0,0.3]){for(let i=2;i<=n-2;i++){const u=-1+2*i/n,p=P(u,s,keel(u)+3);i===2?ctx.moveTo(p[0],p[1]):ctx.lineTo(p[0],p[1]);}}ctx.stroke();
    for(let i=4;i<n-3;i+=3){const u=-1+2*i/n;hoLine(P(u,-0.92,sheer(u)-3.4),P(u,0.92,sheer(u)-3.4),'#5E4430',1.4);hoLine(P(u,-0.92,sheer(u)-3.0),P(u,0.92,sheer(u)-3.0),'#8A6A48',0.5);}}
  /* mast with the furled sail on its yard */{const m0=P(0.05,0,keel(0.05)+3),mH=34,m1=f(0.05*L,0,keel(0.05)+3+mH);hoLine(m0,m1,C[3],1.8);hoLine([m0[0]+0.6,m0[1]],[m1[0]+0.6,m1[1]],C[0],0.5);
    const y0=f(0.05*L,-0.55,keel(0)+mH-3),y1=f(0.05*L,0.55,keel(0)+mH-3);/* the yard lies across the ship (José) */hoLine(y0,y1,C[3],1.4);if(!win){ctx.strokeStyle='#C8B48A';ctx.lineWidth=2.6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(y0[0],y0[1]+1.4);ctx.lineTo(y1[0],y1[1]+1.4);ctx.stroke();ctx.strokeStyle='#A33A2E';ctx.lineWidth=0.9;for(let k=1;k<6;k+=2){const q=lerp(y0,y1,k/6);ctx.beginPath();ctx.moveTo(q[0]-1,q[1]+0.3);ctx.lineTo(q[0]+1,q[1]+2.6);ctx.stroke();}ctx.lineCap='butt';
      ctx.strokeStyle='rgba(200,180,140,0.8)';ctx.lineWidth=0.4;ctx.beginPath();for(const e of [-0.85,0.85]){const q=P(e,0,sheer(e));ctx.moveTo(m1[0],m1[1]+1);ctx.lineTo(q[0],q[1]);}ctx.stroke();}}
  /* near side: one band per plank, slightly different tints, rivets, a dark lap line */const S=6;for(let k=0;k<S;k++){const v0=k/S,v1=(k+1)/S,pts=[];for(let i=0;i<=n;i++){const u=-1+2*i/n;pts.push(P(u,Math.sqrt(v1),keel(u)+(sheer(u)-keel(u))*v1));}for(let i=n;i>=0;i--){const u=-1+2*i/n;pts.push(P(u,Math.sqrt(v0),keel(u)+(sheer(u)-keel(u))*v0));}
    hoQ(pts,C[k%3]);if(!win){ctx.strokeStyle='rgba(20,12,6,0.45)';ctx.lineWidth=0.5;ctx.beginPath();for(let i=0;i<=n;i++){const u=-1+2*i/n,p=P(u,Math.sqrt(v0),keel(u)+(sheer(u)-keel(u))*v0);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();
      ctx.strokeStyle='rgba(255,230,190,0.07)';ctx.beginPath();for(let i=0;i<n;i+=2){const u=-1+2*(i+0.5)/n,p=P(u,Math.sqrt((v0+v1)/2),keel(u)+(sheer(u)-keel(u))*(v0+v1)/2);ctx.moveTo(p[0]-2,p[1]);ctx.lineTo(p[0]+2,p[1]-0.4);}ctx.stroke();
      ctx.fillStyle='rgba(30,24,20,0.85)';for(let i=1;i<n;i++){const u=-1+2*i/n,p=P(u,Math.sqrt(v0+0.02),keel(u)+(sheer(u)-keel(u))*(v0+0.02));ctx.fillRect(p[0]-0.35,p[1]-0.35,0.7,0.7);}}}
  /* oar ports in the top strake */if(!win){ctx.fillStyle='#1E140C';for(let i=4;i<n-3;i+=2){const u=-1+2*i/n,p=P(u,0.97,sheer(u)-2.2);ctx.beginPath();ctx.ellipse(p[0],p[1],0.7,0.5,0,0,6.3);ctx.fill();}}
  /* gunwale rail */{ctx.strokeStyle=C[0];ctx.lineWidth=1.3;ctx.beginPath();for(let i=0;i<=n;i++){const u=-1+2*i/n,p=P(u,1,sheer(u));i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();}
  /* steering oar on the stern quarter */{const a=P(-0.86,1.05,sheer(-0.86)+1),b2=P(-0.8,1.25,-2);hoLine(a,b2,C[3],1.6);if(!win){ctx.fillStyle=C[2];ctx.beginPath();ctx.ellipse(b2[0],b2[1]-1.5,1.4,3.6,0.3,0,6.3);ctx.fill();}}
  /* shields along the near gunwale */if(pr>0.7&&!win)for(let i=0;i<11;i++){const u=-0.75+i*0.15,p=P(u,1.02,sheer(u)-1.6);arShield(p,1.9,i,win);}
  /* stem (bow, +a) with a dragon head and gold carving; stern with a curled tail */for(const e of [-1,1]){const b0=P(e,0,sheer(e)),b1=f(e*(L+0.16),0,sheer(e)+11),b2=f(e*(L+0.03),0,sheer(e)+20);ctx.strokeStyle=C[3];ctx.lineWidth=2.8;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(b0[0],b0[1]);ctx.quadraticCurveTo(b1[0],b1[1],b2[0],b2[1]);ctx.stroke();ctx.lineCap='butt';
    if(!win){ctx.strokeStyle='#C9A042';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(b0[0]+0.6,b0[1]-1);ctx.quadraticCurveTo(b1[0]+0.6,b1[1],b2[0]+0.4,b2[1]+1.5);ctx.stroke();}
    if(e>0){ctx.fillStyle=C[3];ctx.beginPath();ctx.moveTo(b2[0]-1.4,b2[1]+1.5);ctx.lineTo(b2[0]+3,b2[1]-1.6);ctx.lineTo(b2[0]+7.4,b2[1]-1);ctx.lineTo(b2[0]+8.6,b2[1]+1.4);ctx.lineTo(b2[0]+4,b2[1]+2.2);ctx.lineTo(b2[0]+7.6,b2[1]+4.2);ctx.lineTo(b2[0]+6.6,b2[1]+5);ctx.lineTo(b2[0]+0.6,b2[1]+4.6);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(b2[0]-0.6,b2[1]);ctx.lineTo(b2[0]-4,b2[1]-5);ctx.lineTo(b2[0]-1.4,b2[1]-3.4);ctx.lineTo(b2[0]-2.6,b2[1]-7);ctx.lineTo(b2[0]+1.6,b2[1]-1.6);ctx.fill();
      if(!win){ctx.fillStyle='#E8C84A';ctx.beginPath();ctx.arc(b2[0]+3.4,b2[1]+0.4,0.8,0,6.3);ctx.fill();ctx.fillStyle='#E8E2D4';ctx.fillRect(b2[0]+5.2,b2[1]+2.4,0.8,0.8);ctx.fillRect(b2[0]+6.6,b2[1]+2.6,0.7,0.7);ctx.strokeStyle='#C9A042';ctx.lineWidth=0.4;ctx.beginPath();ctx.arc(b2[0]+1.2,b2[1]+2.4,1.4,0,6);ctx.stroke();}}
    else{ctx.strokeStyle=C[3];ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(b2[0]-2.6,b2[1]-1.6,2.8,0.4,4.6);ctx.stroke();if(!win){ctx.strokeStyle='#C9A042';ctx.lineWidth=0.4;ctx.beginPath();ctx.arc(b2[0]-2.6,b2[1]-1.6,1.6,0.4,4.6);ctx.stroke();}}}}
/* the plot of a shaped building keeps its grass round the building's own ground (José: no square patch) */
const GRASSY_PLOT=b=>TOMB_OPT&&b.t==='tomb';
{let _occMap=null,_occN=-1;const bAt=id=>{if(_occN!==B.length){_occMap=new Map(B.map(b=>[b.id,b]));_occN=B.length;}return _occMap.get(id);};
  const _dtile=drawTile;drawTile=function(x,y,PL,win){const i=y*N+x,id=occ[i];if(id){const b=bAt(id);if(b&&GRASSY_PLOT(b)){occ[i]=0;try{return _dtile(x,y,PL,win);}finally{occ[i]=id;}}}return _dtile(x,y,PL,win);};}
function drawTomb2(b,win,opt,f,sd,st,pr){const L=1.3,W=0.46;
  const ground=(r1,r2,col)=>{const o=[];for(let i=0;i<40;i++){const t2=i/40*6.283,j=1+(h2(sd,i,77)-0.5)*0.05;o.push(f(Math.cos(t2)*r1*j,Math.sin(t2)*r2*j,0));}hoQ(o,col);};
  if(st===0){ground(1.9,1.35,win?'rgba(225,228,224,0.5)':'rgba(130,112,84,0.4)');const pts=[];for(let i=0;i<=24;i++){const u=-1+2*i/24;pts.push([u*L,W*Math.pow(Math.max(0,1-u*u),0.62)]);}
    for(const s of [-1,1])for(let i=0;i<=24;i+=3){const p=f(pts[i][0],s*pts[i][1],0);hoLine(p,[p[0],p[1]-6],win?'#B8B0A0':'#5A4230',1);}if(!win){ctx.strokeStyle='rgba(220,200,150,0.9)';ctx.lineWidth=0.5;for(const s of [-1,1]){ctx.beginPath();pts.forEach((q,i)=>{const p=f(q[0],s*q[1],5);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});ctx.stroke();}}
    hoLogPile(f,0.9,1.7,1.45,[4,3,2],1.6,win);if(opt===5||opt===7){/* stones waiting */for(let i=0;i<5;i++){const p=f(-1.6+i*0.22,1.35,0);alCobble([p[0],p[1]-2],4,2.6,win?'#D4D6D2':'#8E877B',win);}}return;}
  const fin=st===2;
  if(opt===5){/* flagstone apron, stepped plinth, the ship on top with its chamber, braziers at the bow */const ap=[];for(let i=0;i<40;i++){const t2=i/40*6.283;ap.push(f(Math.cos(t2)*1.85,Math.sin(t2)*1.2,0));}hoQ(ap,win?'#E8E8E2':fin?'#A8A296':'#8A7656');
    if(fin&&!win){ctx.strokeStyle='rgba(60,54,46,0.4)';ctx.lineWidth=0.5;ctx.beginPath();for(let r=0.5;r<1.85;r+=0.32){for(let i=0;i<=40;i++){const t2=i/40*6.283,p=f(Math.cos(t2)*r,Math.sin(t2)*r*0.65,0);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}}ctx.stroke();}
    const top=tmPlinth(f,L+0.12,W+0.12,3,4.5,win,sd,fin?1:Math.max(0.34,pr));const fz=(a,c,h)=>f(a,c,h+top);
    if(fin||pr>0.4){tmShip(fz,L-0.05,W,win,fin?1:pr,sd);if(fin||pr>0.6)tmChamber(fz,-0.1,win,sd);}
    if(fin){tmBrazier(f(1.75,0.55,0),win);tmBrazier(f(1.55,-0.75,0),win);}}
  else if(opt===6){/* low stone walls following the hull, a carved door in the near wall, the upturned ship as roof */const h0=7,n=28,wid=u=>(W+0.08)*Math.pow(Math.max(0,1-u*u),0.62);
    const wall=[];for(let i=0;i<=n;i++){const u=-1+2*i/n;wall.push(f(u*(L-0.02),wid(u),0));}for(let i=n;i>=0;i--){const u=-1+2*i/n;wall.push(f(u*(L-0.02),wid(u),h0));}hoQ(wall,win?'#C9CBC7':'#8E8980');
    if(!win){ctx.strokeStyle='rgba(40,36,30,0.5)';ctx.lineWidth=0.5;ctx.beginPath();for(const hh of [2.4,4.8]){for(let i=0;i<=n;i++){const u=-1+2*i/n,p=f(u*(L-0.02),wid(u),hh);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}}for(let i=1;i<n;i++){const u=-1+2*i/n,r=(i%2)*1.2,p=f(u*(L-0.02),wid(u),r),q=f(u*(L-0.02),wid(u),r+2.4);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();}
    if(fin||pr>0.5){/* door with a gold interlace arch in the near wall */const P=(a,h)=>f(a,wid(a/L)+0.005,h);hoQ([P(-0.1,0),P(0.1,0),P(0.1,h0+3),P(0,h0+6),P(-0.1,h0+3)],'#3A2A1C');if(!win){ctx.strokeStyle='#C9A042';ctx.lineWidth=0.7;ctx.beginPath();const a=P(-0.12,0),b2=P(-0.12,h0+3),c=P(0,h0+6.6),d=P(0.12,h0+3),e=P(0.12,0);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);ctx.lineTo(c[0],c[1]);ctx.lineTo(d[0],d[1]);ctx.lineTo(e[0],e[1]);ctx.stroke();}
      for(const a of [-0.24,0.24]){const p=f(a,wid(a/L)+0.12,0);alTorch(p,win);}}
    tmUpturned(f,L+0.08,W+0.16,h0,30,win,sd,fin?1:pr);}
  else if(opt===7){/* open ship-shaped grave lined with dressed stone, the ship inside, bauta stones at bow and stern, a runestone */const n=32,wid=u=>(W+0.14)*Math.pow(Math.max(0,1-u*u),0.62),D=8,P=(u,s,h)=>f(u*(L+0.15),s*wid(u),h);
    {const rim=[];for(let i=0;i<=n;i++)rim.push(P(-1+2*i/n,1,0));for(let i=n;i>=0;i--)rim.push(P(-1+2*i/n,-1,0));hoQ(rim,win?'#B8BAB6':'#3A3228');}
    /* inner far wall (visible down in the pit) */{const w=[];for(let i=0;i<=n;i++)w.push(P(-1+2*i/n,-1,0));for(let i=n;i>=0;i--)w.push(P(-1+2*i/n,-0.92,-D));hoQ(w,win?'#C9CBC7':'#7E786E');if(!win){ctx.strokeStyle='rgba(30,26,20,0.45)';ctx.lineWidth=0.45;ctx.beginPath();for(const hh of [-2.6,-5.2]){for(let i=0;i<=n;i++){const p=P(-1+2*i/n,-0.97,hh);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}}ctx.stroke();}}
    if(fin||pr>0.35){const fz=(a,c,h)=>f(a,c,h-D+1);tmShip(fz,L-0.05,W,win,fin?1:pr,sd);if(fin||pr>0.6)tmChamber(fz,-0.1,win,sd);}
    /* coping stones round the rim */{const cs=[];for(let i=0;i<n;i++){const u=-1+2*(i+0.5)/n;for(const s of [-1,1])cs.push({d:u+s,p:P(u,s*1.04,0),k:i+(s>0?40:0)});}cs.sort((x,y)=>x.d-y.d);for(const c of cs)alCobble([c.p[0],c.p[1]-1],3.2,1.8,win?'#D4D6D2':h2(sd,c.k,6)>0.5?'#9A948A':'#857F75',win);}
    if(fin||pr>0.7){alStone(f(-1.75,0,0),3.8,30,sd,1,win);alStone(f(1.75,0,0),3.8,30,sd,2,win);}if(fin)tmRunestone(f(1.3,1.05,0),win,24,sd);}
  else{/* ring of carved warrior posts with shields, a dragon gate at the front, the ship on trestles in the middle */const R1=1.8,R2=1.25,N=14,posts=[];for(let i=0;i<N;i++){const t2=i/N*6.283+0.22;if(Math.abs(Math.atan2(Math.sin(t2-Math.PI/4),Math.cos(t2-Math.PI/4)))<0.3)continue;posts.push({d:Math.cos(t2)*R1+Math.sin(t2)*R2,p:f(Math.cos(t2)*R1,Math.sin(t2)*R2,0),i});}
    ground(1.95,1.4,win?'rgba(225,228,224,0.5)':'rgba(130,120,92,0.4)');const done=fin?posts.length:Math.round(posts.length*pr);posts.sort((x,y)=>x.d-y.d);
    posts.filter(p=>p.d<0).forEach((p,k)=>{if(posts.indexOf(p)<done||fin)tmWarriorPost(p.p,20,win,p.i);});
    if(fin||pr>0.3){for(const a of [-0.8,-0.2,0.4,0.95])for(const c of [-0.22,0.22]){const p=f(a,c,0);hoLine(p,[p[0],p[1]-6],win?'#B8B0A0':'#4A3424',1.4);}const fz=(a,c,h)=>f(a,c,h+5);tmShipFine(fz,L+0.12,W+0.04,win,fin?1:pr,sd);}
    posts.filter(p=>p.d>=0).forEach(p=>{if(posts.indexOf(p)<done||fin)tmWarriorPost(p.p,20,win,p.i);});
    if(fin){/* dragon gate: two tall posts, a lintel, dragon heads facing out */const ga=Math.PI/4,g0=f(Math.cos(ga-0.2)*R1,Math.sin(ga-0.2)*R2,0),g1=f(Math.cos(ga+0.2)*R1,Math.sin(ga+0.2)*R2,0);for(const g of [g0,g1])hoLine(g,[g[0],g[1]-30],win?'#B8B0A0':'#3E2E20',2.6);hoLine([g0[0]-3,g0[1]-29],[g1[0]+3,g1[1]-29],win?'#B8B0A0':'#3E2E20',2.2);
      if(!win){for(const [g,dir] of [[g0,-1],[g1,1]]){const q=[g[0]+dir*3,g[1]-29];ctx.fillStyle='#3E2E20';ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.quadraticCurveTo(q[0]+dir*4,q[1]-6,q[0]+dir*8,q[1]-5);ctx.lineTo(q[0]+dir*9.5,q[1]-2.5);ctx.lineTo(q[0]+dir*5,q[1]-2);ctx.lineTo(q[0],q[1]+1.5);ctx.closePath();ctx.fill();ctx.fillStyle='#E8C84A';ctx.fillRect(q[0]+dir*6-0.5,q[1]-4.4,1,1);}
        hoLine([g0[0],g0[1]-27],[g1[0],g1[1]-27],'#C9A042',0.6);}alTorch(f(Math.cos(ga-0.35)*R1*1.05,Math.sin(ga-0.35)*R2*1.05,0),win);alTorch(f(Math.cos(ga+0.35)*R1*1.05,Math.sin(ga+0.35)*R2*1.05,0),win);}}}
{const _dt=drawTombOpt;drawTombOpt=function(b,win,opt){if(opt>=5){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*83+opt,st=window.__TOMBSTAGE!=null?window.__TOMBSTAGE:(S.tombDone?2:b.proj?1:0),pr=st===2?1:st===1?(b.proj&&b.proj.done?Math.min(0.95,b.proj.done/TOMB_WORK):0.55):0;return drawTomb2(b,win,opt,f,sd,st,pr);}return _dt(b,win,opt);};}

/* =================== Trading House options (prototype) — window.__setTrade(n) ===================
   3×2; merchants land in summer, silver for surplus. 1 Plank hall + a striped cloth awning on poles over a counter of goods (furs, amber, silver, a balance)
   2 Stone counting-house, slate, bales and barrels stacked at the gable, a balance-scale sign · 3 Jettied hall: stone below, timber upper storey overhanging, red boards
   4 Black-scale hall + a fenced trade yard with a big weigh-beam and heaps of goods */
let TRADE_OPT=0;window.__setTrade=n=>{TRADE_OPT=n|0;};
{const _dsX=drawShaped;drawShaped=function(b,win,c0,ax){if(TRADE_OPT&&b.t==='trade'){drawTradeOpt(b,win,TRADE_OPT);return true;}return _dsX(b,win,c0,ax);};}
function trBale(p,s,win,col){/* cloth-wrapped bale with rope ties */const w=4*s,h=3.4*s;ctx.fillStyle=win?'#E2DCD0':col||'#C8B48A';ctx.beginPath();ctx.moveTo(p[0]-w,p[1]-0.5);ctx.quadraticCurveTo(p[0]-w-0.6,p[1]-h,p[0]-w+0.6,p[1]-h*1.6);ctx.lineTo(p[0]+w-0.6,p[1]-h*1.6);ctx.quadraticCurveTo(p[0]+w+0.6,p[1]-h,p[0]+w,p[1]-0.5);ctx.closePath();ctx.fill();
  if(!win){ctx.fillStyle='rgba(60,40,20,0.2)';ctx.fillRect(p[0]+w*0.2,p[1]-h*1.6,w*0.8,h*1.6);ctx.strokeStyle='#7A5A3A';ctx.lineWidth=0.6;ctx.beginPath();for(const u of [-0.45,0.45]){ctx.moveTo(p[0]+u*w,p[1]);ctx.lineTo(p[0]+u*w,p[1]-h*1.6);}ctx.moveTo(p[0]-w,p[1]-h*0.8);ctx.lineTo(p[0]+w,p[1]-h*0.8);ctx.stroke();}}
function trFurs(p,win){for(let k=0;k<3;k++){ctx.fillStyle=win?'#E2DCD0':['#6E5038','#8A6A48','#3E3430'][k];ctx.beginPath();ctx.ellipse(p[0]+(k-1)*1.2,p[1]-1-k*1.3,4.4-k*0.6,1.5,0.05,0,6.3);ctx.fill();}}
function trScale(p,win){/* balance: post, beam, two pans */hoLine(p,[p[0],p[1]-9],win?'#B8B0A0':'#5A4A3A',0.9);hoLine([p[0]-4.4,p[1]-9],[p[0]+4.4,p[1]-8.4],win?'#C8C0B0':'#B8863E',0.8);for(const [dx,dy] of [[-4.4,-9],[4.4,-8.4]]){hoLine([p[0]+dx,p[1]+dy],[p[0]+dx,p[1]+dy+3.4],'rgba(200,180,140,0.9)',0.4);ctx.fillStyle=win?'#D8D2C4':'#B8863E';ctx.beginPath();ctx.ellipse(p[0]+dx,p[1]+dy+3.6,1.8,0.6,0,0,6.3);ctx.fill();}}
function trSilver(p,win){if(win)return;for(let k=0;k<3;k++){ctx.fillStyle=k%2?'#C8CCD0':'#AEB4BA';ctx.fillRect(p[0]-2+k*0.6,p[1]-1.2-k*0.9,3.4,0.9);}ctx.fillStyle='#E8A040';for(let k=0;k<5;k++){ctx.beginPath();ctx.arc(p[0]+4+k*0.9,p[1]-0.6-(k%2)*0.6,0.55,0,6.3);ctx.fill();}}
function drawTradeL(b,win,f,sd){/* José: option 1 as ONE continuous L-shaped building — a main range along the back and a wing coming forward at the right end,
   same wall and ridge height; the wing's ridge meets the main ridge, a valley on the inner corner, a hip on the outer corner; the shop door in the wing's front gable;
   the striped awning comes out from under the main eave over a counter, between the wall and the wing */
  const J=WOOD_SET[4],hw=0.42,wh=13,rh=13,ov=0.07,top=wh+rh,eH=wh-ov/hw*rh,fh=2.4,A0=-1.25,A1=1.25,mc=-0.5,wa=A1-hw,cF=0.88,W=win?'#D8D2C4':'#9A7A52',WD=win?'#C4BEB0':'#7A5E3E',FR='#2A1F18';
  const R=win?'#EEF1F0':J.roof,RD=win?'#D3DAD9':J.roofD,E=win?'#C9CED0':shade(J.roofD,0.7),gR={sd,rt:J.rt,rh:13,roofD:J.roofD};
  const seams=(pts0,pts1,n)=>{if(win)return;ctx.strokeStyle='rgba(30,20,12,0.45)';ctx.lineWidth=0.45;ctx.beginPath();for(let k=1;k<n;k++){const p=lerp(pts0[0],pts0[1],k/n),q=lerp(pts1[0],pts1[1],k/n);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();};
  const post=(a,c,h0,h1)=>hoQ([f(a-0.02,c,h0),f(a+0.02,c,h0),f(a+0.02,c,h1),f(a-0.02,c,h1)],FR);
  /* back slopes: main (towards -c) and the hip at the outer corner */hoQ([f(A0-ov,mc,top),f(wa,mc,top),f(A1+ov,mc-hw-ov,eH),f(A0-ov,mc-hw-ov,eH)],RD);
  /* footings */const st=win?'#C4C6C2':'#8F8C84',stD=win?'#A9ABA7':'#77746D';hoQ([f(A0,mc+hw,0),f(wa-hw,mc+hw,0),f(wa-hw,mc+hw,fh),f(A0,mc+hw,fh)],st);hoQ([f(wa-hw,cF,0),f(A1,cF,0),f(A1,cF,fh),f(wa-hw,cF,fh)],st);hoQ([f(A1,mc-hw,0),f(A1,cF,0),f(A1,cF,fh),f(A1,mc-hw,fh)],stD);
  /* walls: main front (left of the wing), wing front gable, the long right wall (main end + wing side in one) */
  hoQ([f(A0,mc+hw,fh),f(wa-hw,mc+hw,fh),f(wa-hw,mc+hw,wh),f(A0,mc+hw,wh)],W);seams([f(A0,mc+hw,fh),f(wa-hw,mc+hw,fh)],[f(A0,mc+hw,wh),f(wa-hw,mc+hw,wh)],26);
  hoQ([f(A1,mc-hw,fh),f(A1,cF,fh),f(A1,cF,wh),f(A1,mc-hw,wh)],WD);seams([f(A1,mc-hw,fh),f(A1,cF,fh)],[f(A1,mc-hw,wh),f(A1,cF,wh)],26);
  hoQ([f(wa-hw,cF,fh),f(A1,cF,fh),f(A1,cF,wh),f(wa,cF,top),f(wa-hw,cF,wh)],W);seams([f(wa-hw,cF,fh),f(A1,cF,fh)],[f(wa-hw,cF,top-0.5),f(A1,cF,top-0.5)],12);
  for(const a of [A0,wa-hw])post(a,mc+hw,fh,wh);for(const c of [mc-hw,cF])post(A1,c,fh,wh);post(wa-hw,cF,fh,wh);hoLine(f(wa-hw,cF,wh),f(A1,cF,wh),FR,1.2);hoLine(f(A0,mc+hw,wh),f(wa-hw,mc+hw,wh),FR,1.2);hoLine(f(A1,mc-hw,wh),f(A1,cF,wh),FR,1.2);
  /* windows and the shop door */for(const a of [-0.95,-0.45])hoWindow((x,y,h)=>f(x,y+mc,h),{hl:1.25,hw,fh,wh,k:1,v:1},'L',a,0.1,fh+5,fh+8.4,{shutters:'#7A2E24'});
  {const gw={hl:A1,hw:cF,fh,wh:wh+4,k:1,v:1},fs=(x,y,h)=>f(y,x,h);/* door in the front gable: use hoDoor on a frame whose 'L' face is the gable */hoDoor((x,y,h)=>f(x+wa,y,h),{hl:hw,hw:cF,fh,wh:wh+4,k:1,v:1},'L',0,0.18,9,{col:'#4A3424',steps:1});
    hoWindow((x,y,h)=>f(A1,x,h),{hl:hw,hw:0,fh,wh,k:1,v:1},'G',0,0.1,fh+5,fh+8.4,{shutters:'#7A2E24'});hoWindow((x,y,h)=>f(x,y,h),{hl:A1,hw:0,fh,wh,k:1,v:1},'G',0.45,0.1,fh+5,fh+8.4,{shutters:'#7A2E24'});}
  /* main front slope, ending at the valley */const mF=(u,v)=>{const aR=lerp([wa-hw-ov,0],[wa,0],v)[0];return f(A0-ov+(aR-(A0-ov))*u,(mc+hw+ov)+(mc-(mc+hw+ov))*v,eH+(top-eH)*v);};
  hoQ([f(A0-ov,mc+hw+ov,eH-1.6),f(wa-hw-ov,mc+hw+ov,eH-1.6),f(wa-hw-ov,mc+hw+ov,eH),f(A0-ov,mc+hw+ov,eH)],E);hoQ([mF(0,0),mF(1,0),mF(1,1),mF(0,1)],R);if(!win)hoRoofSurface(mF,gR,win);
  /* awning */const A0w=-1.18,A1w=wa-hw-0.02,c0=mc+hw,c1=c0+0.5,hB=eH-0.5,hF=7.4,cc=c0+0.34;
  hoQ([f(A0w,c0+0.02,0),f(A1w,c0+0.02,0),f(A1w,c1,0),f(A0w,c1,0)],'rgba(60,50,40,0.25)');
  hoQ([f(A0w+0.1,cc+0.08,0),f(A1w-0.06,cc+0.08,0),f(A1w-0.06,cc+0.08,4.6),f(A0w+0.1,cc+0.08,4.6)],win?'#C8C0B0':'#6E5038');hoQ([f(A0w+0.1,cc-0.08,4.6),f(A1w-0.06,cc-0.08,4.6),f(A1w-0.06,cc+0.08,4.6),f(A0w+0.1,cc+0.08,4.6)],win?'#E0D8C8':'#9A7A52');
  trFurs(f(-0.95,cc,4.6),win);trSilver(f(-0.55,cc,4.6),win);trScale(f(-0.15,cc,4.6),win);trBale(f(0.18,cc,4.6),0.7,win);
  for(const a of [A0w+0.04,(A0w+A1w)/2,A1w-0.04])hoQ([f(a-0.018,c1,0),f(a+0.018,c1,0),f(a+0.018,c1,hF),f(a-0.018,c1,hF)],win?'#C8C2B4':'#3A2A1C');hoLine(f(A0w,c1,hF),f(A1w,c1,hF),win?'#C8C2B4':'#3A2A1C',1.1);
  const n=9;for(let i=0;i<n;i++){const a0=A0w+(A1w-A0w)*i/n,a1=A0w+(A1w-A0w)*(i+1)/n;hoQ([f(a0,c0,hB),f(a1,c0,hB),f(a1,c1+0.02,hF+0.4),f(a0,c1+0.02,hF+0.4)],win?'#EEEAE2':(i%2?'#A33A2E':'#E8DFC8'));}
  if(!win){for(let i=0;i<n;i++){const a=A0w+(A1w-A0w)*(i+0.5)/n,p=f(a,c1+0.02,hF+0.4);ctx.fillStyle=i%2?'#A33A2E':'#E8DFC8';ctx.beginPath();ctx.moveTo(p[0]-2.4,p[1]);ctx.quadraticCurveTo(p[0],p[1]+2.4,p[0]+2.4,p[1]);ctx.fill();}hoLine(f(A0w,c0,hB+0.3),f(A1w,c0,hB+0.3),'rgba(20,14,8,0.5)',1);}
  /* wing roof: inner (-a) slope from the valley, then the outer (+a) slope down to the hip; eave edges; ridges; barge boards on the front gable */
  hoQ([f(wa,mc,top),f(wa,cF+ov,top),f(wa-hw-ov,cF+ov,eH),f(wa-hw-ov,mc+hw+ov,eH)],RD);hoQ([f(wa-hw-ov,mc+hw+ov,eH),f(wa-hw-ov,cF+ov,eH),f(wa-hw-ov,cF+ov,eH-1.6),f(wa-hw-ov,mc+hw+ov,eH-1.6)],shade(E,0.9));
  const wR=(u,v)=>f((A1+ov)+(wa-(A1+ov))*v,(cF+ov)+(((mc-hw-ov)+(mc-(mc-hw-ov))*v)-(cF+ov))*u,eH+(top-eH)*v);
  hoQ([f(A1+ov,mc-hw-ov,eH),f(A1+ov,cF+ov,eH),f(A1+ov,cF+ov,eH-1.6),f(A1+ov,mc-hw-ov,eH-1.6)],E);hoQ([f(wa,cF+ov,top),f(A1+ov,cF+ov,eH),f(wa-hw-ov,cF+ov,eH)],'rgba(0,0,0,0)');
  hoQ([wR(0,0),wR(1,0),wR(1,1),wR(0,1)],R);if(!win)hoRoofSurface(wR,gR,win);
  /* front gable edge of the roof: thickness under both slopes */hoQ([f(wa,cF+ov,top),f(A1+ov,cF+ov,eH),f(A1+ov,cF+ov,eH-1.6),f(wa,cF+ov,top-1.6)],E);
  /* ridges and the hip line, the valley line */hoLine(f(A0-ov,mc,top+0.4),f(wa,mc,top+0.4),win?'#DCE1E2':shade(RD,0.7),1.5);hoLine(f(wa,mc,top+0.4),f(wa,cF+ov,top+0.4),win?'#DCE1E2':shade(RD,0.7),1.5);hoLine(f(wa,mc,top+0.3),f(A1+ov,mc-hw-ov,eH+0.3),win?'#DCE1E2':shade(RD,0.7),1.1);
  if(!win)hoLine(f(wa,mc,top),f(wa-hw-ov,mc+hw+ov,eH),'rgba(20,12,8,0.5)',0.9);
  /* crossed barge boards with carved ends on the wing's front gable */{const g1=f(A1+ov,cF+ov+0.01,eH),g0=f(wa-hw-ov,cF+ov+0.01,eH),ap=f(wa,cF+ov+0.01,top),ext=(p,q,k)=>[q[0]+(q[0]-p[0])*k,q[1]+(q[1]-p[1])*k];hoLine(g1,ext(g1,ap,0.25),'#4A3424',1.4);hoLine(g0,ext(g0,ap,0.25),'#4A3424',1.4);
    if(!win)for(const [p,q] of [[g1,ext(g1,ap,0.25)],[g0,ext(g0,ap,0.25)]]){ctx.strokeStyle='#4A3424';ctx.lineWidth=1.1;ctx.beginPath();ctx.arc(q[0]+(q[0]>ap[0]?1.6:-1.6),q[1]-1,1.8,0,4.5);ctx.stroke();}}}
function drawTradeOpt(b,win,opt){if(opt===5){return drawTradeL(b,win,hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),(b.id||0)*89+5);}const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),sd=(b.id||0)*89+opt,J=WOOD_SET[opt===2?3:opt===4?2:4];
  const hc=opt===1||opt===4?-0.35:-0.2,fw=(a,c,h)=>f(a+(opt===4?-0.4:0),c+hc,h);
  const g={sd,hl:opt===4?0.85:1.15,hw:0.5,fh:2.4,wh:opt===3?20:13,rh:14,ov:0.07,th:1.7,wt:'planks',wall:opt===2?'#8A7A64':opt===3?'#8A6A48':opt===4?'#4E3C2E':'#9A7A52',wallD:opt===2?'#6E604E':opt===3?'#6E5038':opt===4?'#3A2C22':'#7A5E3E',
    roof:J.roof,roofD:J.roofD,roofE:shade(J.roofD,0.7),rt:J.rt,blue:J.blue,frame:true,frameCol:'#2A1F18',k:1,v:1};
  const r=hoRoof(fw,g,win);r.back();hoFooting(fw,g,win);hoWalls(fw,g,win);
  if(opt===2)hoStoneBox(fw,0,0,g.hl,g.hw,g.fh,g.wh,win,sd);
  if(opt===3){hoStoneBox(fw,0,0,g.hl,g.hw,g.fh,g.fh+8,win,sd);/* jetty: the upper storey overhangs on joists */const P=(a,c,h)=>fw(a,c,h),jh=g.fh+8;if(!win)for(let k=0;k<9;k++){const a=-g.hl+0.1+k*(2*g.hl-0.2)/8;hoQ([P(a-0.02,g.hw,jh),P(a+0.02,g.hw,jh),P(a+0.02,g.hw+0.1,jh),P(a-0.02,g.hw+0.1,jh)],'#3A2A1C');}
    hoQ([P(-g.hl,g.hw+0.1,jh),P(g.hl,g.hw+0.1,jh),P(g.hl,g.hw+0.1,g.wh),P(-g.hl,g.hw+0.1,g.wh)],win?'#D8D2C4':'#8A6A48');if(!win){ctx.strokeStyle='rgba(30,20,12,0.45)';ctx.lineWidth=0.45;ctx.beginPath();for(let k=1;k<22;k++){const a=-g.hl+2*g.hl*k/22,p=P(a,g.hw+0.1,jh),q=P(a,g.hw+0.1,g.wh);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();}
    for(const a of [-0.7,0,0.7]){const Q=(x,h)=>P(x,g.hw+0.104,h);hoQ([Q(a-0.07,jh+3),Q(a+0.07,jh+3),Q(a+0.07,jh+7),Q(a-0.07,jh+7)],'#3E2E20');hoQ([Q(a-0.055,jh+3.4),Q(a+0.055,jh+3.4),Q(a+0.055,jh+6.6),Q(a-0.055,jh+6.6)],win?'#E2DCD0':'#E2B25A');}}
  r.end();hoDoor(fw,g,'G',0,0.17,8.5,{col:'#4A3424',steps:1});if(opt!==3)for(const a of [-0.6,0.5])hoWindow(fw,g,'L',a,0.1,g.fh+5,g.fh+8.4,{shutters:opt===2?'#2E4A5E':'#7A2E24'});
  r.front();r.ridge();hoBarge(fw,g,'#4A3424',0.25,true);
  if(opt===1){/* striped cloth awning on poles over a counter in front of the long wall */const A0=-0.85,A1=0.85,c0=g.hw+hc,c1=c0+0.55,hB=14,hF=10;hoBox(f,0,c0+0.25,0.05,0,5,'#8A6A48','#6E5038',win);
    hoQ([f(A0,c0+0.18,0),f(A1,c0+0.18,0),f(A1,c0+0.18,5),f(A0,c0+0.18,5)],win?'#C8C0B0':'#6E5038');hoQ([f(A0,c0+0.1,5),f(A1,c0+0.1,5),f(A1,c0+0.32,5),f(A0,c0+0.32,5)],win?'#E0D8C8':'#9A7A52');
    trFurs(f(-0.55,c0+0.2,5),win);trSilver(f(-0.1,c0+0.22,5),win);trScale(f(0.35,c0+0.22,5),win);trBale(f(0.7,c0+0.2,5),0.8,win);
    for(const a of [A0,A1])hoLine(f(a,c1,0),f(a,c1,hF),win?'#B8B0A0':'#4A3424',1.2);const n=8;for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n,a0=A0+(A1-A0)*u0,a1=A0+(A1-A0)*u1;hoQ([f(a0,c0,hB),f(a1,c0,hB),f(a1,c1,hF),f(a0,c1,hF)],win?'#EEEAE2':(i%2?'#A33A2E':'#E8DFC8'));}
    if(!win){for(let i=0;i<n;i++){const a=A0+(A1-A0)*(i+0.5)/n,p=f(a,c1,hF);ctx.fillStyle=i%2?'#A33A2E':'#E8DFC8';ctx.beginPath();ctx.moveTo(p[0]-2.6,p[1]);ctx.quadraticCurveTo(p[0],p[1]+2.6,p[0]+2.6,p[1]);ctx.fill();}}}
  else if(opt===2){/* bales and barrels stacked at the gable, a balance-scale sign */const P=(a,c)=>fw(g.hl+0.18,c,0);trBale(P(0,-0.38),1,win);trBale(P(0,-0.2),1,win,'#B8A47A');brBarrel(P(0,0.3),1,win);brBarrel(P(0,0.45),1,win);
    {const p=f(1.3,0.6,0);hoLine(p,[p[0],p[1]-20],win?'#B8B0A0':'#4E3C2E',1.4);hoLine([p[0],p[1]-20],[p[0]-7,p[1]-20],win?'#B8B0A0':'#4E3C2E',1.1);const bx=p[0]-10;hoQ([[bx,p[1]-18],[bx+7,p[1]-18],[bx+7,p[1]-12],[bx,p[1]-12]],win?'#D0C8B8':'#8C6A48');if(!win){ctx.strokeStyle='#C9A64A';ctx.lineWidth=0.7;ctx.beginPath();ctx.moveTo(bx+1.5,p[1]-16.5);ctx.lineTo(bx+5.5,p[1]-16.5);ctx.moveTo(bx+3.5,p[1]-17.2);ctx.lineTo(bx+3.5,p[1]-13.4);ctx.stroke();}}}
  else if(opt===3){trBale(fw(g.hl+0.16,-0.3,0),1,win);trBale(fw(g.hl+0.16,0.32,0),1,win,'#B8A47A');}
  else{/* fenced trade yard: weigh-beam, heaps of goods */const ya=0.75,P=(a,c,h)=>f(a,c,h);for(const r2 of [[[0.15,-0.85],[1.42,-0.85]],[[1.42,-0.85],[1.42,0.88]],[[0.15,0.88],[0.75,0.88]],[[1.1,0.88],[1.42,0.88]]])hoSkigard(f,r2[0],r2[1],6,win,sd);
    {/* weigh-beam: an A-frame with a long beam and hanging pans */const a=0.8,c=0,top=P(a,c,20);hoLine(P(a-0.2,c,0),top,win?'#B8B0A0':'#4A3424',1.4);hoLine(P(a+0.2,c,0),top,win?'#B8B0A0':'#4A3424',1.4);const l=P(a,c-0.45,19),rr=P(a,c+0.45,20.6);hoLine(l,rr,win?'#C8C0B0':'#6E5038',1.2);
      for(const q of [l,rr]){hoLine(q,[q[0],q[1]+6],'rgba(200,180,140,0.9)',0.5);ctx.fillStyle=win?'#D8D2C4':'#6E5038';ctx.beginPath();ctx.ellipse(q[0],q[1]+6.4,3,1,0,0,6.3);ctx.fill();}trBale([rr[0],rr[1]+6],0.6,win);}
    trFurs(P(0.45,0.55,0),win);trBale(P(1.15,0.5,0),1,win);trBale(P(1.2,0.3,0),1,win,'#B8A47A');brBarrel(P(0.4,-0.5,0),1,win);brBarrel(P(0.55,-0.6,0),1,win);}}
{const _shX=shShape;shShape=function(b){if(b.t==='trade'&&TRADE_OPT){const f=hoFrame({fx:b.fx,fy:b.fy,w:b.w,h:b.h,rot:b.rot}),box=(a,c,sa,sc,h)=>({pts:[f(a-sa,c-sc,0),f(a+sa,c-sc,0),f(a+sa,c+sc,0),f(a-sa,c+sc,0)],h});
  if(TRADE_OPT===5)return [box(-0.05,-0.52,1.27,0.47,0.6),box(-0.05,-0.52,1.27,0.06,1.0),box(0.82,0.12,0.4,0.69,0.55),box(-0.2,0.13,0.95,0.25,0.35)];
  const o=TRADE_OPT,hc=o===1||o===4?-0.35:-0.2,ha=o===4?-0.4:0,hl=o===4?0.85:1.15;const V=[box(ha,hc,hl+0.07,0.57,o===3?0.8:0.6),box(ha,hc,hl+0.07,0.06,o===3?1.3:1.1)];if(o===1)V.push(box(0,0.45,0.85,0.27,0.4));return V;}return _shX(b);};}
