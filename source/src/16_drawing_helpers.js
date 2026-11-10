/* =================== drawing helpers =================== */
function poly(p,fill){ctx.beginPath();ctx.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)ctx.lineTo(p[i],p[i+1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();}
function P(...pts){const a=[];pts.forEach(q=>{a.push(q[0],q[1]);});return a;}
function drawSprite(s,wx,wy,k,alpha,flip){if(!s.ready)return;if(alpha<1)ctx.globalAlpha=alpha;
  if(flip){ctx.save();ctx.translate(wx,wy);ctx.scale(-1,1);ctx.drawImage(s.cv,-s.ax*k,-s.ay*k,s.w*k,s.h*k);ctx.restore();}
  else ctx.drawImage(s.cv,wx-s.ax*k,wy-s.ay*k,s.w*k,s.h*k);if(alpha<1)ctx.globalAlpha=1;}
function hex(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];}
function sh(c,f){return 'rgb('+Math.min(255,c[0]*f|0)+','+Math.min(255,c[1]*f|0)+','+Math.min(255,c[2]*f|0)+')';}
const C={s:{sea:hex('#6F8F9B'),river:hex('#7FA1AC'),beach:hex('#D8CCAE'),grass:hex('#93A97E'),forest:hex('#86A070'),foot:hex('#A39D93'),iron:hex('#8E877D'),mount:hex('#A7A298'),soil:hex('#7C6E58'),rock:hex('#857C71'),sand:hex('#B8AC8E')},
         w:{sea:hex('#53717D'),river:hex('#CFE0E5'),beach:hex('#D9DDDA'),grass:hex('#E6EBEC'),forest:hex('#DCE3E3'),foot:hex('#C9CCC8'),iron:hex('#B9BBB6'),mount:hex('#D9DCDA'),soil:hex('#8A7E6C'),rock:hex('#8E877D'),sand:hex('#B9BCB8')}};
function tileColor(tt,PL){switch(tt){case T.SEA:return PL.sea;case T.RIVER:return PL.river;case T.BEACH:return PL.beach;case T.FOREST:return PL.forest;case T.FOOT:return PL.foot;case T.IRON:return PL.iron;case T.MOUNT:return PL.mount;default:return PL.grass;}}
function faceColor(tt,PL){if(tt===T.MOUNT||tt===T.FOOT||tt===T.IRON)return PL.rock;if(tt===T.BEACH)return PL.sand;return PL.soil;}

function drawTile(x,y,PL,win){
  const i=y*N+x,tt=ter[i],e=elev[i];const sx=(x-y)*HW,sy=(x+y)*HH,top=sy-e;
  let f=1+(h2(x,y,11)-0.5)*0.06;
  if(tt===T.SEA)f*=1+0.05*Math.sin(t*1.1+x*0.7+y*0.45);
  if(tt===T.RIVER&&!win)f*=1+0.06*Math.sin(t*2.2-y*0.9);
  if(tt===T.MOUNT)f*=1-Math.min(0.1,(mountW(x)-y)*0.012)+(vn(x*0.4,y*0.4,22)-0.5)*0.08;
  const base=tileColor(tt,PL),fc=faceColor(tt,PL);
  const eR=x+1<N?elev[i+1]:-12;if(eR<e)poly([sx+HW,top,sx,top+HH,sx,sy+HH-eR,sx+HW,sy-eR],sh(fc,0.78));
  const eL=y+1<N?elev[i+N]:-12;if(eL<e)poly([sx-HW,top,sx,top+HH,sx,sy+HH-eL,sx-HW,sy-eL],sh(fc,0.94));
  poly([sx,top-HH-0.6,sx+HW+0.8,top,sx,top+HH+0.6,sx-HW-0.8,top],sh(base,f*0.97));
  poly([sx,top-HH-0.6,sx,top+HH+0.6,sx-HW-0.8,top],sh(base,f*1.03));
  if(zoom>0.75&&!win&&tt===T.GRASS&&!occ[i]&&!roads[i]){const r=h2(x,y,12);if(r>0.6){ctx.strokeStyle='rgba(95,122,80,0.7)';ctx.lineWidth=1.2;ctx.beginPath();const ox=(h2(x,y,13)-0.5)*30,oy=(h2(x,y,14)-0.5)*12;ctx.moveTo(sx+ox-2,top+oy);ctx.lineTo(sx+ox,top+oy-5);ctx.lineTo(sx+ox+2,top+oy);ctx.stroke();}
    if(r>0.93){ctx.fillStyle='#EFE9DA';ctx.beginPath();ctx.arc(sx+(h2(x,y,15)-0.5)*26,top+(h2(x,y,16)-0.5)*10,1.8,0,6.3);ctx.fill();}}
  if(tt===T.SEA&&zoom>0.55&&h2(x,y,9)>0.82){ctx.strokeStyle=win?'rgba(170,190,198,0.6)':'rgba(170,196,204,0.8)';ctx.lineWidth=1.6;const o=Math.sin(t*0.8+x+y)*5;ctx.beginPath();ctx.moveTo(sx-10+o,top);ctx.quadraticCurveTo(sx-4+o,top-4,sx+2+o,top);ctx.quadraticCurveTo(sx+8+o,top-4,sx+14+o,top);ctx.stroke();}
  if(tt===T.BEACH){const a=0.35+0.25*Math.sin(t*1.4+x*0.6);ctx.strokeStyle='rgba(243,245,243,'+a.toFixed(2)+')';ctx.lineWidth=2.2;
    if(x+1<N&&ter[i+1]===T.SEA){ctx.beginPath();ctx.moveTo(sx+HW,top);ctx.lineTo(sx,top+HH);ctx.stroke();}
    if(y+1<N&&ter[i+N]===T.SEA){ctx.beginPath();ctx.moveTo(sx,top+HH);ctx.lineTo(sx-HW,top);ctx.stroke();}}
}
function lerp(a,b,k){return [a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k];}
function drawPeak(o,win){
  /* a monolithic rock massif: a few large chiselled faces, snow only on the upper planes */
  const x=o.x,y=o.y,e=elev[y*N+x],sx=(x-y)*HW+(o.ox||0),sy=(x+y)*HH-e+10,s=o.s||1;
  const C=win?{lit:'#D9DCD8',mid:'#C3C7C3',sh:'#A7ACA8',dk:'#8E9490',snow:'#F4F4F0',snowS:'#DCDEDA'}:{lit:'#ABA597',mid:'#958F82',sh:'#7B766B',dk:'#68645B',snow:'#F1F0EA',snowS:'#D6D8D3'};
  const w=HW*2.5*s,h=(84+70*s)*(o.hk||1);
  if(o.v===1){/* flat-topped monolith with sheer cliffs */
    const tw=w*0.62,th=h*0.62;const T1=[sx-tw,sy-th],T2=[sx+tw*0.15,sy-th-tw*0.32],T3=[sx+tw,sy-th+tw*0.05],T4=[sx+tw*0.05,sy-th+tw*0.4];
    const B1=[sx-w*0.85,sy],B4=[sx+w*0.05,sy+w*0.42],B3=[sx+w*0.9,sy+2];
    poly(P(T1,T4,B4,B1),C.lit);poly(P(T4,T3,B3,B4),C.sh);
    ctx.strokeStyle='rgba(40,36,30,0.18)';ctx.lineWidth=1.2;ctx.beginPath();for(let k=1;k<4;k++){const a=lerp(T1,T4,k/4),b=lerp(B1,B4,k/4);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]+(k%2?-6:4));const a2=lerp(T4,T3,k/4),b2=lerp(B4,B3,k/4);ctx.moveTo(a2[0],a2[1]);ctx.lineTo(b2[0],b2[1]);}ctx.stroke();
    poly(P(T1,T2,T3,T4),win?C.snow:C.mid);if(!win){poly(P(T1,T2,lerp(T2,T3,0.5),lerp(T1,T4,0.6)),C.snow);}
    poly(P(T1,T4,lerp(T4,B4,0.18),lerp(T1,B1,0.12)),C.snowS);return;}
  const A=[sx+(o.j||0)*w*0.25,sy-h],M=[sx-w*0.52,sy-h*0.48],Bs=[sx+w*0.5,sy-h*0.58],F=[sx+w*0.12,sy+HH*1.25*s],L=[sx-w,sy],R=[sx+w,sy-3],K=lerp(A,F,0.45);K[0]-=w*0.06;
  poly(P(L,M,F),C.mid);poly(P(M,A,K,F),C.lit);poly(P(A,Bs,F,K),C.sh);poly(P(Bs,R,F),C.dk);
  ctx.strokeStyle='rgba(40,36,30,0.16)';ctx.lineWidth=1.1;ctx.beginPath();const c1=lerp(M,F,0.5),c2=lerp(Bs,F,0.45);ctx.moveTo(M[0],M[1]);ctx.lineTo(c1[0]+6,c1[1]);ctx.moveTo(Bs[0],Bs[1]);ctx.lineTo(c2[0]-4,c2[1]+6);ctx.stroke();
  const k=win?0.5:0.3,a1=lerp(A,M,k),a2=lerp(A,K,k*1.15),a3=lerp(A,Bs,k*1.1);
  poly(P(A,a1,[lerp(a1,a2,0.5)[0],lerp(a1,a2,0.5)[1]+7],a2),C.snow);poly(P(A,a2,[lerp(a2,a3,0.5)[0],lerp(a2,a3,0.5)[1]+5],a3),C.snowS);
  if(!win){poly(P(L,F,[lerp(L,F,0.5)[0],lerp(L,F,0.5)[1]-5],lerp(L,M,0.25)),'#87907A');}
}
function drawRocks(o,win){const x=o.x,y=o.y,e=elev[y*N+x],sx=(x-y)*HW+(h2(x,y,21)-0.5)*20,sy=(x+y)*HH-e;const a=win?'#D9DCD8':'#9A958B',b=win?'#BFC3BF':'#7D786F';
  poly([sx-10,sy+3,sx-5,sy-6,sx+2,sy-4,sx+4,sy+4],a);poly([sx+2,sy-4,sx+4,sy+4,sx-1,sy+5],b);poly([sx+5,sy+5,sx+9,sy-1,sx+14,sy+2,sx+13,sy+6],a);}
function drawIron(o){const x=o.x,y=o.y,e=elev[y*N+x],sx=(x-y)*HW,sy=(x+y)*HH-e;
  poly([sx-14,sy+2,sx-8,sy-7,sx-1,sy-5,sx+1,sy+3],'#4E4A45');poly([sx-8,sy-7,sx-1,sy-5,sx-4,sy-1],'#6A655E');
  poly([sx+4,sy+5,sx+9,sy-3,sx+16,sy+1,sx+14,sy+6],'#4E4A45');poly([sx+9,sy-3,sx+16,sy+1,sx+11,sy+2],'#6A655E');
  ctx.fillStyle='#9A5B3A';ctx.beginPath();ctx.arc(sx-6,sy-2,1.8,0,6.3);ctx.arc(sx+11,sy+2,1.6,0,6.3);ctx.fill();}
function drawStump(sx,sy,win){ctx.fillStyle='rgba(38,48,53,0.15)';ctx.beginPath();ctx.ellipse(sx,sy+2,9,4,0,0,6.3);ctx.fill();
  poly([sx-6,sy,sx+6,sy,sx+6,sy-7,sx-6,sy-7],'#8A6E52');poly([sx,sy,sx+6,sy,sx+6,sy-7,sx,sy-7],'#6E543D');
  ctx.fillStyle=win?'#E6EBEC':'#D2B98F';ctx.beginPath();ctx.ellipse(sx,sy-7,6,3,0,0,6.3);ctx.fill();}
function drawTree(o,win,a){
  const sx=(o.x-o.y)*HW+o.ox,sy=(o.x+o.y)*HH-elev[o.y*N+o.x]+o.oy;
  if(o.amt>0){drawSprite(SP[o.sp][win?1:0],sx,sy,o.s,a,false);return;}
  const p=1-o.regrow/REGROW;
  if(p<0.2){drawStump(sx,sy,win);return;}
  const k=p<0.55?0.35:0.65;drawSprite(SP.spruce[win?1:0],sx,sy,o.s*k,a,false);
}
/* isometric log pile on canvas: logs along +x axis */
function logPileC(px,py,r){const vx=22,vy=11,gx=-0.894*2.1*r,gy=0.447*2.1*r,mx=-0.447,my=0.894;
  for(let j=0;j<3;j++)for(let k=0;k<3-j;k++){const x=px+(k+j*0.5)*gx,y=py+(k+j*0.5)*gy-j*1.75*r,qx=x-vx,qy=y-vy;
    poly([qx-mx*r,qy-my*r,x-mx*r,y-my*r,x+mx*r,y+my*r,qx+mx*r,qy+my*r],'#8A6E52');poly([qx,qy,x,y,x+mx*r,y+my*r,qx+mx*r,qy+my*r],'#6E543D');
    ctx.save();ctx.translate(x,y);ctx.rotate(-0.464);ctx.fillStyle='#D2B98F';ctx.beginPath();ctx.ellipse(0,0,r*0.9,r,0,0,6.3);ctx.fill();ctx.strokeStyle='#8E6F52';ctx.lineWidth=1;ctx.stroke();ctx.restore();}}
function barrelC(x,y){poly([x-5,y,x+5,y,x+5,y-11,x-5,y-11],'#8A6E52');poly([x,y,x+5,y,x+5,y-11,x,y-11],'#6E543D');ctx.fillStyle='#A88A69';ctx.beginPath();ctx.ellipse(x,y-11,5,2.4,0,0,6.3);ctx.fill();ctx.strokeStyle='#4E4A45';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x-5,y-4);ctx.lineTo(x+5,y-4);ctx.moveTo(x-5,y-8);ctx.lineTo(x+5,y-8);ctx.stroke();}
