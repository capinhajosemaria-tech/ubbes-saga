/* =================== Water Mill: a timber mill on the bank, its wheel turning in the river =================== */
/* MILLV: 1 = undershot wheel beside a turf-roofed mill house; 2 = overshot wheel fed by a wooden chute, shingle roof */
let MILLV=1;
/* colour palettes for look A: 0 = first draft (brown logs, green turf) */
let MILLP=1;
const MILL_PAL=[{wall:'#7E6248',wallD:'#5F4936',roof:'#7F9568',roofD:'#6B8058',rt:'turf'},
  {wall:'#8A8478',wallD:'#6B665C',roof:'#5A4A3C',roofD:'#47392E',rt:'shingle'},   /* 1: weathered grey timber, dark shingles */
  {wall:'#8E3B2F',wallD:'#6E2C23',roof:'#7F9568',roofD:'#6B8058',rt:'turf'},      /* 2: red-painted walls, turf roof */
  {wall:'#A88A69',wallD:'#86694E',roof:'#B39E66',roofD:'#97834F',rt:'thatch'}];   /* 3: pale timber, golden thatch */
/* which side of the footprint the river lies on: '-y' (T–R edge), '+x' (R–Bt), '+y' (Bt–L), '-x' (L–T) */
function millSide(b){const cnt={'-y':0,'+x':0,'+y':0,'-x':0},isR=(x,y)=>inMap(x,y)&&ter[y*N+x]===T.RIVER;
  for(let x=b.fx-1;x<=b.fx+b.w;x++){if(isR(x,b.fy-1))cnt['-y']+=2;if(isR(x,b.fy))cnt['-y']++;if(isR(x,b.fy+b.h))cnt['+y']+=2;if(isR(x,b.fy+b.h-1))cnt['+y']++;}
  for(let y=b.fy-1;y<=b.fy+b.h;y++){if(isR(b.fx-1,y))cnt['-x']+=2;if(isR(b.fx,y))cnt['-x']++;if(isR(b.fx+b.w,y))cnt['+x']+=2;if(isR(b.fx+b.w-1,y))cnt['+x']++;}
  let best='-y';for(const k in cnt)if(cnt[k]>cnt[best])best=k;return best;}
/* a vertical wheel in the plane of screen vector u (one tile along the river side), centred on ground point c, raised by lift px */
function millWheel(cx,cy,u,R,lift,win,ang){const ul=Math.hypot(u[0],u[1]),ux=u[0]/ul,uy=u[1]/ul,
    at=(a,r)=>[cx+ux*Math.cos(a)*r*1.0,cy+uy*Math.cos(a)*r-lift-Math.sin(a)*r];
  const wood=win?'#7A6852':'#5E4430',lite=win?'#A08C74':'#8C6A48',n=10;
  /* back rim and the shadow of the wheel on the water */
  ctx.fillStyle='rgba(30,40,46,0.22)';ctx.beginPath();ctx.ellipse(cx,cy+2,R*0.95,R*0.28,Math.atan2(uy,ux),0,6.3);ctx.fill();
  ctx.lineWidth=2.2;ctx.strokeStyle=wood;ctx.beginPath();for(let k=0;k<=36;k++){const p=at(k/36*6.283,R);if(k)ctx.lineTo(p[0]+1.6,p[1]-0.9);else ctx.moveTo(p[0]+1.6,p[1]-0.9);}ctx.stroke();
  /* paddles between the two rims */
  ctx.lineWidth=1.6;ctx.strokeStyle=lite;ctx.beginPath();for(let k=0;k<n;k++){const a=ang+k/n*6.283,p=at(a,R),q=at(a,R*0.72);ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+1.6,p[1]-0.9);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
  /* spokes and hub */
  ctx.lineWidth=1.1;ctx.strokeStyle=wood;ctx.beginPath();for(let k=0;k<n/2;k++){const a=ang+k/(n/2)*6.283,p=at(a,R*0.95),q=at(a+3.1416,R*0.95);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
  ctx.lineWidth=2.4;ctx.strokeStyle=lite;ctx.beginPath();for(let k=0;k<=36;k++){const p=at(k/36*6.283,R);if(k)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1]);}ctx.stroke();
  const h=at(0,0);ctx.fillStyle=wood;ctx.beginPath();ctx.arc(h[0],h[1],2.4,0,6.3);ctx.fill();ctx.fillStyle='#3E3A36';ctx.beginPath();ctx.arc(h[0]+1.2,h[1]-0.6,1.2,0,6.3);ctx.fill();
  return at;}
function millFoam(x,y,w,win){if(win)return;ctx.fillStyle='rgba(240,246,248,0.75)';for(let k=0;k<6;k++){const ph=(t*1.7+k*0.37)%1;ctx.globalAlpha=0.75*(1-ph);ctx.beginPath();ctx.ellipse(x+(k-2.5)*w/6+ph*4,y+ph*3,2.4+ph*2.5,1+ph*0.8,0,0,6.3);ctx.fill();}ctx.globalAlpha=1;}
function drawMill(b,win,c0){
  const side=millSide(b),c=inset(c0,0.06),V=window.__MILLV||MILLV;
  /* mill house on the land part, wheel on the river side */
  const K=0.42;let hc,ea,eb,alongX;
  if(side==='-y'){hc={T:lerp(c.T,c.L,K),R:lerp(c.R,c.Bt,K),Bt:c.Bt,L:c.L};ea=hc.T;eb=hc.R;alongX=true;}
  else if(side==='+y'){hc={T:c.T,R:c.R,Bt:lerp(c.Bt,c.R,K),L:lerp(c.L,c.T,K)};ea=hc.L;eb=hc.Bt;alongX=true;}
  else if(side==='-x'){hc={T:lerp(c.T,c.R,K),R:c.R,Bt:c.Bt,L:lerp(c.L,c.Bt,K)};ea=hc.T;eb=hc.L;alongX=false;}
  else {hc={T:c.T,R:lerp(c.R,c.T,K),Bt:lerp(c.Bt,c.L,K),L:c.L};ea=hc.R;eb=hc.Bt;alongX=false;}
  const mid=lerp(ea,eb,0.5),cen=[(c.T[0]+c.Bt[0])/2,(c.T[1]+c.Bt[1])/2],of=V===2?0.95:0.55,out=[mid[0]-(cen[0]-mid[0])*of,mid[1]-(cen[1]-mid[1])*of];
  const u=[(eb[0]-ea[0]),(eb[1]-ea[1])],ul=Math.hypot(u[0],u[1]),un=[u[0]/ul*HW*1.0,u[1]/ul*HW*1.0];
  const back=side==='-y'||side==='-x',R=V===2?19:17,lift=V===2?R+2:R*0.55,ang=(win?0:t*(V===2?0.9:1.3))*(side==='-x'||side==='+y'?-1:1);
  const wheel=()=>{const at=millWheel(out[0],out[1],un,R,lift,win,ang);
    if(V===1){millFoam(out[0],out[1]+1,R*1.6,win);
      /* timber axle into the wall */ctx.strokeStyle=win?'#7A6852':'#4E3828';ctx.lineWidth=2;const h=at(0,0);ctx.beginPath();ctx.moveTo(h[0],h[1]);ctx.lineTo(mid[0],mid[1]-lift);ctx.stroke();}
    else{/* chute on posts bringing water over the top of the wheel */
      const top=at(Math.PI/2,R),cs=[top[0]-un[0]*1.6,top[1]-un[1]*1.6-4],ce=[top[0]+un[0]*0.1,top[1]+un[1]*0.1-3];
      ctx.strokeStyle=win?'#7A6852':'#5E4430';ctx.lineWidth=1.4;ctx.beginPath();for(const k of [0.15,0.6]){const p=lerp(cs,ce,k);ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0],p[1]+R+lift-6);}ctx.stroke();
      poly([cs[0],cs[1],ce[0],ce[1],ce[0],ce[1]+3.2,cs[0],cs[1]+3.2],win?'#9C8A72':'#7C5A3C');poly([cs[0],cs[1]-2.2,ce[0],ce[1]-2.2,ce[0],ce[1],cs[0],cs[1]],win?'#B3A28A':'#9C7650');
      if(!win){ctx.strokeStyle='rgba(170,210,226,0.85)';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(ce[0],ce[1]-1);ctx.quadraticCurveTo(ce[0]+2,ce[1]+3,top[0]+3,top[1]+5);ctx.stroke();}
      millFoam(out[0],out[1]+1,R*1.4,win);}};
  if(back)wheel();
  /* the mill house */
  if(V===2)hall(hc,16,13,alongX,{wt:'planks',wall:'#8E6F52',wallD:'#6E543D',roof:'#6F5A47',roofD:'#5A4838',rt:'shingle',door:true},win);
  else{const PAL=MILL_PAL[window.__MILLP!==undefined?window.__MILLP:MILLP];hall(hc,13,12,alongX,Object.assign({wt:'logs',door:true},PAL),win);}
  /* flour sacks and a millstone leaning by the door side */
  const fr=lerp(hc.Bt,back?hc.L:hc.T,0.25);if(!win){[[0,0],[5,1.5],[2.5,-2.5]].forEach(o=>{ctx.fillStyle='#E4D9C0';ctx.beginPath();ctx.ellipse(fr[0]+o[0],fr[1]+o[1]-3,2.6,3.4,0,0,6.3);ctx.fill();ctx.fillStyle='#C9B98F';ctx.fillRect(fr[0]+o[0]-1.2,fr[1]+o[1]-7,2.4,1.2);});}
  const ms=lerp(hc.Bt,back?hc.R:hc.L,0.2);ctx.fillStyle=win?'#C2C5C3':'#9C9790';ctx.beginPath();ctx.ellipse(ms[0],ms[1]-5,2.2,5.2,0,0,6.3);ctx.fill();ctx.fillStyle='#6E6A64';ctx.beginPath();ctx.ellipse(ms[0],ms[1]-5,0.7,1.4,0,0,6.3);ctx.fill();
  if(!back)wheel();
  return true;}
/* =================== Tavern: a low longhouse with a carved sign, benches, barrels and a warm doorway =================== */
function drawTavern(b,win,c0,alongX){const c=inset(c0,0.08),L=b.lvl||1;
  const on=!win&&b.status!=='Waiting for ale or mead'&&b.workers>0;
  hall(c,13,14,alongX,{wt:'logs',wall:'#7A5E46',wallD:'#5C4634',roof:'#6F5A47',roofD:'#594736',rt:'shingle',door:true,chim:true},win);
  const fr=alongX?lerp(c.L,c.Bt,0.5):lerp(c.Bt,c.R,0.5),side=alongX?lerp(c.L,c.Bt,0.82):lerp(c.Bt,c.R,0.18);
  /* warm light spilling from the door */
  if(on){ctx.fillStyle='rgba(255,190,100,0.28)';ctx.beginPath();ctx.ellipse(fr[0],fr[1]+3,14,6,0,0,6.3);ctx.fill();}
  /* sign: a post with a hanging board and a carved drinking horn */
  const sp=alongX?lerp(c.L,c.Bt,0.2):lerp(c.Bt,c.R,0.8),sx=sp[0]+(alongX?-6:6),sy=sp[1]+4;
  ctx.strokeStyle='#4E3C2E';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx,sy-24);ctx.lineTo(sx+(alongX?-9:9),sy-24);ctx.stroke();
  ctx.lineWidth=0.7;ctx.beginPath();ctx.moveTo(sx+(alongX?-3:3),sy-24);ctx.lineTo(sx+(alongX?-3:3),sy-21);ctx.moveTo(sx+(alongX?-8:8),sy-24);ctx.lineTo(sx+(alongX?-8:8),sy-21);ctx.stroke();
  const bx=sx+(alongX?-11:1);poly([bx,sy-21,bx+10,sy-21,bx+10,sy-14,bx,sy-14],'#8C6A48');ctx.strokeStyle='#C9A64A';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(bx+2,sy-19);ctx.quadraticCurveTo(bx+6,sy-14,bx+8.5,sy-19.5);ctx.stroke();
  /* bench and barrels outside */
  ctx.fillStyle='#6E543D';const bp=side;poly([bp[0]-9,bp[1]+5,bp[0]+3,bp[1]+11,bp[0]+3,bp[1]+9,bp[0]-9,bp[1]+3],'#8A6E52');ctx.fillRect(bp[0]-8,bp[1]+4,1.4,4);ctx.fillRect(bp[0]+1.5,bp[1]+9,1.4,4);
  const br=alongX?lerp(c.Bt,c.R,0.3):lerp(c.L,c.Bt,0.7);barrelC(br[0]+3,br[1]+4);barrelC(br[0]+10,br[1]+7);if(L>=2)barrelC(br[0]+6,br[1]-1);
  /* drinkers on the bench in the evening */
  if(on&&typeof todForce!=='undefined'){ctx.fillStyle='#5E4A3A';for(const k of [0,1]){const p=[bp[0]-6+k*6,bp[1]+5+k*3];ctx.beginPath();ctx.arc(p[0],p[1]-8,2,0,6.3);ctx.fill();ctx.fillRect(p[0]-2,p[1]-6,4,5);}}
  return true;}
