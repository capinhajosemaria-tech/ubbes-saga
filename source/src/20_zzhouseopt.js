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
    /* log ends at the visible corners */
    const cr=[[hl,hw],[-hl,hw],[hl,-hw]];for(const q of cr)for(let k=0;k<n;k++){const h=fh+(wh-fh)*(k+0.5)/n,p=f(q[0]+(q[0]>0?0.05:-0.05)*0,q[1],h);const o=f(q[0]+0.06*Math.sign(q[0]),q[1]+0.06*Math.sign(q[1]),h);
      ctx.fillStyle=win?'#D9D2C4':'#B08A60';ctx.beginPath();ctx.ellipse(o[0],o[1],1.7,1.5,0,0,6.3);ctx.fill();if(det){ctx.strokeStyle='rgba(70,46,26,0.6)';ctx.lineWidth=0.4;ctx.beginPath();ctx.ellipse(o[0],o[1],0.8,0.7,0,0,6.3);ctx.stroke();}}}
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
  {const sf=hw+vl+pad+(L>=4?0.14:0)+(L>=4?0.44:0.33)+0.08;hoLampPost(f0(-0.5,sf,0),18);if(L>=5){hoBrazier(f0(0.55,sf,0));}else hoLampPost(f0(0.5,sf,0),18);}
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
  for(const s of [-0.3,0.3]){const p=fv(gv.hl+0.02,s,gv.wh-6);ctx.fillStyle='rgba(255,190,100,0.25)';ctx.beginPath();ctx.ellipse(p[0],p[1]-6,5,4,0,0,6.3);ctx.fill();hoLine(p,[p[0],p[1]-4],'#2E2018',1);ctx.fillStyle='#F0A040';ctx.beginPath();ctx.moveTo(p[0]-1.5,p[1]-4);ctx.quadraticCurveTo(p[0],p[1]-9,p[0]+1.5,p[1]-4);ctx.fill();}
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
  const posts=[[0.5,5.6],[5.6,0.5]];if(L>=2)posts.push([3.9,5.7],[5.7,3.9]);for(const q of posts){const p=at(q[0],q[1]);hoLampPost(p,16);}
  ctx.restore();};
