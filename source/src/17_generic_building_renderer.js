/* =================== generic building renderer =================== */
function fp(b){const x0=b.fx-0.5,y0=b.fy-0.5,x1=b.fx+b.w-0.5,y1=b.fy+b.h-0.5;return {T:iso(x0,y0),R:iso(x1,y0),Bt:iso(x1,y1),L:iso(x0,y1)};}
function inset(c,k){const cx=(c.T[0]+c.Bt[0])/2,cy=(c.T[1]+c.Bt[1])/2,f=p=>[p[0]+(cx-p[0])*k,p[1]+(cy-p[1])*k];return {T:f(c.T),R:f(c.R),Bt:f(c.Bt),L:f(c.L),cx:cx,cy:cy};}
const up=(p,h)=>[p[0],p[1]-h];
function hall(c,wh,rh,alongX,o,win){
  {const st=CUR_T&&CUR_T!=='house'&&BSTY[CUR_T];if(st){o=Object.assign({},st,o);}}
  if(o.hip&&!o.nr){const r0=hall(c,wh,rh,alongX,Object.assign({},o,{hip:0,nr:1}),win);const r=hipRoof(c,wh,rh,alongX,Object.assign({},o,{hp:o.hip,sag:o.sag||0,ov:3,seed:(c.T[0]|0)}),win);if(o.chim&&!win){const m=lerp(r.rb,r.rf,0.3);poly([m[0]-4,m[1]+4,m[0]+4,m[1]+4,m[0]+4,m[1]-9,m[0]-4,m[1]-9],'#6C665E');poly([m[0],m[1]+4,m[0]+4,m[1]+4,m[0]+4,m[1]-9,m[0],m[1]-9],'#57524B');}return {M1:r0.M1,M2:r0.M2,H:r0.H,hip:r};}
  const wt=o.wt||'planks';
  const roofL=win?'#EEF1F0':o.roof||'#7F9568',roofD=win?'#D3DAD9':o.roofD||'#6B8058',wall=o.wall||'#8E6F52',wallD=o.wallD||'#6E543D';
  poly(P([c.L[0]+5,c.L[1]+3],[c.Bt[0]+5,c.Bt[1]+3],[c.R[0]+5,c.R[1]+3],[c.T[0]+5,c.T[1]+3]),'rgba(38,48,53,0.16)');
  let M1,M2,eaveA,eaveB,gA,gB;
  if(alongX){M1=lerp(c.L,c.T,0.5);M2=lerp(c.Bt,c.R,0.5);}else{M1=lerp(c.T,c.R,0.5);M2=lerp(c.L,c.Bt,0.5);}
  const H=wh+rh;
  if(o.nr){}else if(alongX)poly(P(up(c.T,wh),up(c.R,wh),up(M2,H),up(M1,H)),roofD);else poly(P(up(c.L,wh),up(c.T,wh),up(M1,H),up(M2,H)),roofD);
  poly(P(c.L,c.Bt,up(c.Bt,wh),up(c.L,wh)),wall);
  poly(P(c.Bt,c.R,up(c.R,wh),up(c.Bt,wh)),wallD);
  /* stone footing with joints */
  poly(P(c.L,c.Bt,up(c.Bt,3),up(c.L,3)),win?'#B7B9B5':'#A39D93');poly(P(c.Bt,c.R,up(c.R,3),up(c.Bt,3)),win?'#9EA09C':'#857F76');
  ctx.strokeStyle='rgba(60,56,50,0.35)';ctx.lineWidth=0.8;ctx.beginPath();for(let k=1;k<7;k++){const a=lerp(c.L,c.Bt,k/7+0.03*((k%2)-0.5));ctx.moveTo(a[0],a[1]);ctx.lineTo(a[0],a[1]-3);const b2=lerp(c.Bt,c.R,k/7);ctx.moveTo(b2[0],b2[1]);ctx.lineTo(b2[0],b2[1]-3);}ctx.stroke();
  if(wt==='planks'){/* vertical planks: thin seams, every other board a touch darker */
  const nb=Math.max(6,Math.round(Math.hypot(c.Bt[0]-c.L[0],c.Bt[1]-c.L[1])/5)),nb2=Math.max(6,Math.round(Math.hypot(c.R[0]-c.Bt[0],c.R[1]-c.Bt[1])/5));
  ctx.fillStyle='rgba(40,28,20,0.07)';for(let k=0;k<nb;k+=2){const a=lerp(c.L,c.Bt,k/nb),b2=lerp(c.L,c.Bt,(k+1)/nb);ctx.beginPath();ctx.moveTo(a[0],a[1]-3);ctx.lineTo(b2[0],b2[1]-3);ctx.lineTo(b2[0],b2[1]-wh);ctx.lineTo(a[0],a[1]-wh);ctx.fill();}
  ctx.strokeStyle='rgba(60,44,32,0.32)';ctx.lineWidth=0.7;ctx.beginPath();
  for(let k=1;k<nb;k++){const a=lerp(c.L,c.Bt,k/nb);ctx.moveTo(a[0],a[1]-3);ctx.lineTo(a[0],a[1]-wh);}for(let k=1;k<nb2;k++){const b2=lerp(c.Bt,c.R,k/nb2);ctx.moveTo(b2[0],b2[1]-3);ctx.lineTo(b2[0],b2[1]-wh);}ctx.stroke();}
  else wallTexture(c,wh,wt,win);
  if(o.chim&&!win){}
  if(zoom>1.45&&!win){/* close-up: wood grain and knots on the walls, single stones in the footing */
    ctx.strokeStyle='rgba(40,28,18,0.16)';ctx.lineWidth=0.5;ctx.beginPath();const sd=(c.T[0]*7+c.T[1])|0;
    for(const f of [[c.L,c.Bt],[c.Bt,c.R]])for(let k=0;k<14;k++){const u=((sd*31+k*53)%97)/97,v=0.25+((sd*17+k*29)%61)/61*0.65,a=lerp(f[0],f[1],u);ctx.moveTo(a[0],a[1]-wh*v);ctx.lineTo(a[0],a[1]-wh*v-3-(k%3));}ctx.stroke();
    ctx.fillStyle='rgba(50,34,22,0.35)';for(const f of [[c.L,c.Bt],[c.Bt,c.R]])for(let k=0;k<3;k++){const a=lerp(f[0],f[1],((sd*13+k*41)%89)/89);ctx.beginPath();ctx.ellipse(a[0],a[1]-wh*(0.35+0.15*k),0.9,1.4,0,0,6.3);ctx.fill();}
    ctx.strokeStyle='rgba(70,64,56,0.45)';ctx.lineWidth=0.6;ctx.beginPath();for(const f of [[c.L,c.Bt],[c.Bt,c.R]])for(let k=0;k<12;k++){const a=lerp(f[0],f[1],(k+0.5)/12);ctx.moveTo(a[0]-1.6,a[1]-1.5+(k%2));ctx.lineTo(a[0]+1.6,a[1]-1.5+(k%2));}ctx.stroke();}
  /* corner posts */
  ctx.strokeStyle='rgba(48,36,26,0.75)';ctx.lineWidth=2;ctx.beginPath();for(const q of [c.L,c.Bt,c.R]){ctx.moveTo(q[0],q[1]-3);ctx.lineTo(q[0],q[1]-wh);}ctx.stroke();
  /* shadow under the eaves */
  poly(P(up(c.L,wh-3.5),up(c.Bt,wh-3.5),up(c.Bt,wh),up(c.L,wh)),'rgba(30,22,16,0.28)');poly(P(up(c.Bt,wh-3.5),up(c.R,wh-3.5),up(c.R,wh),up(c.Bt,wh)),'rgba(30,22,16,0.32)');
  if(o.nr){}else if(alongX){poly(P(up(c.Bt,wh),up(c.R,wh),up(M2,H)),wallD);
    poly(P([c.L[0]-2,c.L[1]-wh+3],[c.Bt[0],c.Bt[1]-wh+3],up(M2,H+1),up(M1,H+1)),roofL);
  }else{poly(P(up(c.L,wh),up(c.Bt,wh),up(M2,H)),wall);
    poly(P([c.Bt[0],c.Bt[1]-wh+3],[c.R[0]+2,c.R[1]-wh+3],up(M1,H+1),up(M2,H+1)),roofL);}
  {const side=o.side||DOOR_SIDE||(alongX?'+x':'+y');if(o.door!==false&&(side==='+x'||side==='+y'))doorOnFace(side==='+y'?c.L:c.Bt,side==='+y'?c.Bt:c.R,wh);}
  if(o.nr)return {M1:M1,M2:M2,H:H};
  {/* roof surface: turf, thatch or shingles */const rt=o.rt||'turf';const ea=alongX?up(c.L,wh):up(c.Bt,wh),eb=alongX?up(c.Bt,wh):up(c.R,wh),ra=alongX?up(M1,H):up(M2,H),rb=alongX?up(M2,H):up(M1,H);
    const at=(u,v)=>lerp(lerp(ea,eb,u),lerp(ra,rb,u),v);
    if(win){ctx.strokeStyle='rgba(180,190,192,0.6)';ctx.lineWidth=1;ctx.beginPath();for(let k=1;k<4;k++){const a=at(0,k/4),b2=at(1,k/4);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}ctx.stroke();}
    else if(rt==='thatch'){ctx.strokeStyle='rgba(120,92,40,0.45)';ctx.lineWidth=0.8;ctx.beginPath();for(let k=0;k<26;k++){const u=(k+0.5)/26,a=at(u,0.02),b2=at(u+0.01,0.96);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}ctx.stroke();
      ctx.strokeStyle='rgba(90,66,30,0.5)';ctx.lineWidth=1.2;ctx.beginPath();for(const v of [0.33,0.66]){const a=at(0,v),b2=at(1,v);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}ctx.stroke();
      const e1=at(0,0),e2=at(1,0);ctx.strokeStyle='rgba(70,50,24,0.55)';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(e1[0],e1[1]+1);ctx.lineTo(e2[0],e2[1]+1);ctx.stroke();}
    else if(rt==='shingle'){ctx.strokeStyle='rgba(30,26,22,0.35)';ctx.lineWidth=0.8;ctx.beginPath();for(let r=1;r<7;r++){const v=r/7,a=at(0,v),b2=at(1,v);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);
        for(let k=0;k<12;k++){const u=(k+(r%2?0.5:0))/12;if(u>=1)continue;const p=at(u,v),q=at(u,v-1/7);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}}ctx.stroke();}
    else{ctx.strokeStyle='rgba(84,108,66,0.75)';ctx.lineWidth=1.3;ctx.beginPath();for(let k=1;k<4;k++){const a=at(0,k/4),b2=at(1,k/4);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}ctx.stroke();
      ctx.fillStyle='rgba(150,170,110,0.55)';for(let k=0;k<9;k++){const p=at(h2(k,wh,61),0.1+0.8*h2(k,rh,62));ctx.beginPath();ctx.ellipse(p[0],p[1],2.2,1.1,0,0,6.3);ctx.fill();}}
    /* lit eave edge */
    const l1=at(0,0),l2=at(1,0);ctx.strokeStyle=win?'rgba(255,255,255,0.7)':'rgba(255,248,220,0.28)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(l1[0],l1[1]-0.5);ctx.lineTo(l2[0],l2[1]-0.5);ctx.stroke();}
  ctx.strokeStyle='#4E3C2E';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();const m1=up(M1,H),m2=up(M2,H);ctx.moveTo(m1[0],m1[1]);ctx.lineTo(m2[0],m2[1]);ctx.stroke();
  ctx.strokeStyle=o.barge||'#5C4634';ctx.lineWidth=3;ctx.beginPath();
  if(alongX){const a=up(c.Bt,wh),b2=up(c.R,wh);ctx.moveTo(a[0],a[1]);ctx.lineTo(m2[0],m2[1]);ctx.lineTo(b2[0],b2[1]);ctx.moveTo(m2[0],m2[1]);ctx.lineTo(m2[0]+5,m2[1]-9);ctx.moveTo(m2[0],m2[1]);ctx.lineTo(m2[0]-5,m2[1]-9);}
  else{const a=up(c.L,wh),b2=up(c.Bt,wh);ctx.moveTo(a[0],a[1]);ctx.lineTo(m2[0],m2[1]);ctx.lineTo(b2[0],b2[1]);ctx.moveTo(m2[0],m2[1]);ctx.lineTo(m2[0]+5,m2[1]-9);ctx.moveTo(m2[0],m2[1]);ctx.lineTo(m2[0]-5,m2[1]-9);}
  ctx.stroke();ctx.lineCap='butt';
  if(o.chim){const m=lerp(up(M1,H),up(M2,H),0.3);poly([m[0]-4,m[1]+4,m[0]+4,m[1]+4,m[0]+4,m[1]-9,m[0]-4,m[1]-9],win?'#9EA09C':'#6C665E');poly([m[0],m[1]+4,m[0]+4,m[1]+4,m[0]+4,m[1]-9,m[0],m[1]-9],win?'#8A8C88':'#57524B');poly([m[0]-5,m[1]-9,m[0]+5,m[1]-9,m[0]+5,m[1]-11,m[0]-5,m[1]-11],'#4E4A45');}
  return {M1:M1,M2:M2,H:H};
}
function wallTexture(c,wh,wt,win){
  if(wt==='logs'){ctx.strokeStyle='rgba(50,36,24,0.45)';ctx.lineWidth=1;ctx.beginPath();for(let z=6;z<wh;z+=3.2){ctx.moveTo(c.L[0],c.L[1]-z);ctx.lineTo(c.Bt[0],c.Bt[1]-z);ctx.lineTo(c.R[0],c.R[1]-z);}ctx.stroke();
    ctx.fillStyle='rgba(210,180,130,0.55)';for(const q of [c.L,c.Bt,c.R])for(let z=6;z<wh;z+=3.2){ctx.beginPath();ctx.ellipse(q[0],q[1]-z+1.4,1.6,1.3,0,0,6.3);ctx.fill();}}
  else if(wt==='stone'){ctx.strokeStyle=win?'rgba(110,112,108,0.5)':'rgba(60,56,50,0.4)';ctx.lineWidth=0.8;ctx.beginPath();let r=0;for(let z=6;z<wh;z+=4,r++){ctx.moveTo(c.L[0],c.L[1]-z);ctx.lineTo(c.Bt[0],c.Bt[1]-z);ctx.lineTo(c.R[0],c.R[1]-z);
      for(let k=0;k<6;k++){const f=(k+(r%2?0.5:0.1))/6;const a=lerp(c.L,c.Bt,f),b2=lerp(c.Bt,c.R,f);ctx.moveTo(a[0],a[1]-z);ctx.lineTo(a[0],a[1]-z-4);ctx.moveTo(b2[0],b2[1]-z);ctx.lineTo(b2[0],b2[1]-z-4);}}ctx.stroke();}
  else if(wt==='frame'){ctx.strokeStyle='#4E3C2E';ctx.lineWidth=1.6;ctx.beginPath();for(const s2 of [[c.L,c.Bt],[c.Bt,c.R]]){for(let k=0;k<=4;k++){const a=lerp(s2[0],s2[1],k/4);ctx.moveTo(a[0],a[1]-3);ctx.lineTo(a[0],a[1]-wh);}
      for(let k=0;k<4;k+=2){const a=lerp(s2[0],s2[1],k/4),b2=lerp(s2[0],s2[1],(k+1)/4);ctx.moveTo(a[0],a[1]-3);ctx.lineTo(b2[0],b2[1]-wh+3);}const m1=lerp(s2[0],s2[1],0),m2=lerp(s2[0],s2[1],1);ctx.moveTo(m1[0],m1[1]-wh*0.5);ctx.lineTo(m2[0],m2[1]-wh*0.5);}ctx.stroke();}
}
/* per-building look: walls, roof cover and colours, so every workshop reads at a glance */
const BSTY={
  wood:{wt:'logs',wall:'#7A5A3E',wallD:'#5E4430',roof:'#6E5A44',roofD:'#584735',rt:'shingle'},
  carp:{wall:'#B08F6A',wallD:'#8E7152',roof:'#C2A45E',roofD:'#A68A48',rt:'thatch'},
  mine:{wt:'stone',wall:'#8E877D',wallD:'#6F6961',roof:'#5E5850',roofD:'#4A4540',rt:'shingle',hip:0.4},
  smith:{wt:'stone',wall:'#7D776E',wallD:'#625D56',roof:'#4A4540',roofD:'#3A3632',rt:'shingle',chim:1},
  fish:{wall:'#8C8478',wallD:'#6E675D',roof:'#7F9568',roofD:'#6B8058',rt:'turf'},
  berry:{wall:'#9A7C5E',wallD:'#7C6248',roof:'#B39E66',roofD:'#97834F',rt:'thatch'},
  pres:{wall:'#8A6A50',wallD:'#6C523D',roof:'#7A4A3A',roofD:'#623A2E',rt:'shingle'},
  ware:{wall:'#6E543D',wallD:'#54402E',roof:'#5E5850',roofD:'#4A4540',rt:'shingle'},
  gran:{wall:'#A08460',wallD:'#80684B',roof:'#C2A45E',roofD:'#A68A48',rt:'thatch'},
  jarl:{wall:'#6E4A36',wallD:'#553826',roof:'#7F9568',roofD:'#6B8058',rt:'turf'},
  smoke:{wt:'logs',wall:'#4E3E32',wallD:'#3C3026',roof:'#5A5048',roofD:'#463E38',rt:'shingle',chim:1},
  bakery:{wt:'stone',wall:'#B5AA96',wallD:'#958B79',roof:'#B39E66',roofD:'#97834F',rt:'thatch',chim:1,hip:0.5},
  weaver:{wt:'frame',wall:'#D8CDB4',wallD:'#B9AE95',roof:'#B39E66',roofD:'#97834F',rt:'thatch',hip:0.25},
  hunter:{wt:'logs',wall:'#6A5240',wallD:'#503D2E',roof:'#7F9568',roofD:'#6B8058',rt:'turf'},
  trade:{wt:'frame',wall:'#C9B48E',wallD:'#A99470',roof:'#7A4A3A',roofD:'#623A2E',rt:'red',hip:0.2,sag:5},
  arsenal:{wt:'stone',wall:'#857F76',wallD:'#6C665E',roof:'#5E5850',roofD:'#4A4540',rt:'shingle',hip:0.14},
  thrall:{wall:'#7A6A58',wallD:'#5E5144',roof:'#8E9C68',roofD:'#78864F',rt:'turf',hip:0.35},
  salt:{wall:'#A8A196',wallD:'#8A8378',roof:'#6F7A80',roofD:'#5A646A',rt:'shingle',hip:0.3},
  brewery:{wall:'#8A6A50',wallD:'#6C523D',roof:'#C2A45E',roofD:'#A68A48',rt:'thatch',chim:1},
  tailor:{wt:'frame',wall:'#D8CDB4',wallD:'#B9AE95',roof:'#8E4E3A',roofD:'#723D2D',rt:'shingle'},
  hof:{wall:'#3E3028',wallD:'#2E241E',roof:'#3A3430',roofD:'#2C2724',rt:'shingle',barge:'#C9A64A'}};
