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
function hoRoof(f,g,win){const {hl,hw,wh,rh,ov}=g,top=wh+rh,eH=wh-ov/hw*rh,ce=hw+ov,a0=-hl-ov,a1=hl+ov,t=g.th;
  const R=win?'#EEF1F0':g.roof,RD=win?'#D3DAD9':g.roofD,E=win?'#C9CED0':g.roofE;
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
  if(o.cloth&&!win){/* muted wool awning: a main colour with one narrow stripe, slight sag, hem */hoQ(A,o.cloth[0]);const s1=lerp(lerp(A[0],A[3],0.62),lerp(A[1],A[2],0.62),0),s2=lerp(A[1],A[2],0.62);hoQ([lerp(A[0],A[3],0.6),lerp(A[1],A[2],0.6),lerp(A[1],A[2],0.72),lerp(A[0],A[3],0.72)],o.cloth[1]);
    ctx.strokeStyle='rgba(0,0,0,0.12)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=1;k<5;k++){const p=lerp(A[0],A[1],k/5),q=lerp(A[3],A[2],k/5);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();hoLine(A[3],A[2],shade(o.cloth[0],0.7),1);}
  if(o.cloth){/* awning frame: a ridge rod and a front rod on the poles, a middle pole, guy ropes to pegs */hoLine(A[0],A[1],'#4A3424',0.9);hoLine(A[3],A[2],'#4A3424',0.9);const mp=P(0,sw+0.07,0),mt=P(0,sw+0.07,hF);hoLine(mp,mt,'#4A3424',1);
    for(const q of [A[3],A[2]]){const pg=[q[0]+(q[0]-P(0,0,hF)[0])*0.15,q[1]+9];hoLine(q,pg,'rgba(200,180,140,0.75)',0.4);ctx.fillStyle='#4A3424';ctx.fillRect(pg[0]-0.6,pg[1]-1.4,1.2,1.4);}}
  else{hoQ(A,win?'#EEF1F0':o.roof);if(!win)hoRoofSurface((u,v)=>lerp(lerp(A[3],A[2],u),lerp(A[0],A[1],u),v),{sd:o.sd||3,rt:o.rt,rh:6,roofD:shade(o.roof,0.75)},win);hoLine(A[3],A[2],'rgba(10,8,6,0.5)',0.7);}
  hoQ([A[1],A[2],[A[2][0],A[2][1]+1.4],[A[1][0],A[1][1]+1.4]],'#3A2A1C');}
function hoFlagstones(f,hs,win,sd){if(window.__FLAG)return hoFlag0(f,hs,win,sd);
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
  /* little shingled gable roof on the posts */const g={sd:7,hl:0.24,hw:0.16,fh:0,wh:hp,rh:6,ov:0.03,th:1.4,roof:'#2F2C2A',roofD:'#211F1D',roofE:'#171514',rt:'scale'};const fr=(a2,c2,hh)=>f(a+a2,c+c2,hh),rr=hoRoof(fr,g,win);rr.back();rr.end();rr.front();rr.ridge();hoBarge(fr,g,'#4A3424',0.25,false);
  /* stone trough beside it */const tq=(da,dc,h)=>P(0.3+da,0.12+dc,h);hoQ([tq(-0.12,0.06,0),tq(0.12,0.06,0),tq(0.12,0.06,3),tq(-0.12,0.06,3)],'#857E72');hoQ([tq(0.12,-0.06,0),tq(0.12,0.06,0),tq(0.12,0.06,3),tq(0.12,-0.06,3)],'#726B60');hoQ([tq(-0.1,-0.04,3),tq(0.1,-0.04,3),tq(0.1,0.04,3),tq(-0.1,0.04,3)],'#3E5560');}
