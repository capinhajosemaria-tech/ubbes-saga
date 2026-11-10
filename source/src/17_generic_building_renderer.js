/* =================== generic building renderer =================== */
function fp(b){const x0=b.fx-0.5,y0=b.fy-0.5,x1=b.fx+b.w-0.5,y1=b.fy+b.h-0.5;return {T:iso(x0,y0),R:iso(x1,y0),Bt:iso(x1,y1),L:iso(x0,y1)};}
function inset(c,k){const cx=(c.T[0]+c.Bt[0])/2,cy=(c.T[1]+c.Bt[1])/2,f=p=>[p[0]+(cx-p[0])*k,p[1]+(cy-p[1])*k];return {T:f(c.T),R:f(c.R),Bt:f(c.Bt),L:f(c.L),cx:cx,cy:cy};}
const up=(p,h)=>[p[0],p[1]-h];
function hall(c,wh,rh,alongX,o,win){
  const roofL=win?'#EEF1F0':o.roof||'#7F9568',roofD=win?'#D3DAD9':o.roofD||'#6B8058',wall=o.wall||'#8E6F52',wallD=o.wallD||'#6E543D';
  poly(P([c.L[0]+5,c.L[1]+3],[c.Bt[0]+5,c.Bt[1]+3],[c.R[0]+5,c.R[1]+3],[c.T[0]+5,c.T[1]+3]),'rgba(38,48,53,0.16)');
  let M1,M2,eaveA,eaveB,gA,gB;
  if(alongX){M1=lerp(c.L,c.T,0.5);M2=lerp(c.Bt,c.R,0.5);}else{M1=lerp(c.T,c.R,0.5);M2=lerp(c.L,c.Bt,0.5);}
  const H=wh+rh;
  if(alongX)poly(P(up(c.T,wh),up(c.R,wh),up(M2,H),up(M1,H)),roofD);else poly(P(up(c.L,wh),up(c.T,wh),up(M1,H),up(M2,H)),roofD);
  poly(P(c.L,c.Bt,up(c.Bt,wh),up(c.L,wh)),wall);
  poly(P(c.Bt,c.R,up(c.R,wh),up(c.Bt,wh)),wallD);
  poly(P(c.L,c.Bt,up(c.Bt,3),up(c.L,3)),'#A39D93');poly(P(c.Bt,c.R,up(c.R,3),up(c.Bt,3)),'#857F76');
  ctx.strokeStyle='rgba(78,60,46,0.35)';ctx.lineWidth=1;ctx.beginPath();
  for(let k=1;k<5;k++){const a=lerp(c.L,c.Bt,k/5);ctx.moveTo(a[0],a[1]-3);ctx.lineTo(a[0],a[1]-wh);const b2=lerp(c.Bt,c.R,k/5);ctx.moveTo(b2[0],b2[1]-3);ctx.lineTo(b2[0],b2[1]-wh);}ctx.stroke();
  if(alongX){poly(P(up(c.Bt,wh),up(c.R,wh),up(M2,H)),wallD);
    poly(P([c.L[0]-2,c.L[1]-wh+3],[c.Bt[0],c.Bt[1]-wh+3],up(M2,H+1),up(M1,H+1)),roofL);
  }else{poly(P(up(c.L,wh),up(c.Bt,wh),up(M2,H)),wall);
    poly(P([c.Bt[0],c.Bt[1]-wh+3],[c.R[0]+2,c.R[1]-wh+3],up(M1,H+1),up(M2,H+1)),roofL);}
  {const side=o.side||DOOR_SIDE||(alongX?'+x':'+y');if(o.door!==false&&(side==='+x'||side==='+y'))doorOnFace(side==='+y'?c.L:c.Bt,side==='+y'?c.Bt:c.R,wh);}
  if(!win){ctx.strokeStyle='rgba(107,128,88,0.9)';ctx.lineWidth=1.4;ctx.beginPath();for(let k=1;k<3;k++){const a=alongX?lerp(up(c.L,wh),up(M1,H),k/3):lerp(up(c.Bt,wh),up(M2,H),k/3),b2=alongX?lerp(up(c.Bt,wh),up(M2,H),k/3):lerp(up(c.R,wh),up(M1,H),k/3);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}ctx.stroke();}
  ctx.strokeStyle='#4E3C2E';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();const m1=up(M1,H),m2=up(M2,H);ctx.moveTo(m1[0],m1[1]);ctx.lineTo(m2[0],m2[1]);ctx.stroke();
  ctx.strokeStyle=o.barge||'#5C4634';ctx.lineWidth=3;ctx.beginPath();
  if(alongX){const a=up(c.Bt,wh),b2=up(c.R,wh);ctx.moveTo(a[0],a[1]);ctx.lineTo(m2[0],m2[1]);ctx.lineTo(b2[0],b2[1]);ctx.moveTo(m2[0],m2[1]);ctx.lineTo(m2[0]+5,m2[1]-9);ctx.moveTo(m2[0],m2[1]);ctx.lineTo(m2[0]-5,m2[1]-9);}
  else{const a=up(c.L,wh),b2=up(c.Bt,wh);ctx.moveTo(a[0],a[1]);ctx.lineTo(m2[0],m2[1]);ctx.lineTo(b2[0],b2[1]);ctx.moveTo(m2[0],m2[1]);ctx.lineTo(m2[0]+5,m2[1]-9);ctx.moveTo(m2[0],m2[1]);ctx.lineTo(m2[0]-5,m2[1]-9);}
  ctx.stroke();ctx.lineCap='butt';
  return {M1:M1,M2:M2,H:H};
}
