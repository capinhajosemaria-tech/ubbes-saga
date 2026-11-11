/* =================== art for the level 4–5 buildings =================== */
function barrelStack(x,y){barrelC(x-6,y);barrelC(x+6,y+3);if(propOK(x,y))barrelC(x,y-9);}
function drawExtra2(b,win,c0,alongX){const L=b.lvl||1;
  switch(b.t){
  case 'brewery':{const c=inset(c0,0.14);let cc=c;{const k=0.28,R2=lerp(c.R,c.T,k),L2=lerp(c.L,c.T,k);cc={T:c.T,R:R2,L:L2,Bt:[R2[0]+L2[0]-c.T[0],R2[1]+L2[1]-c.T[1]],cx:c.cx,cy:c.cy};}
    hall(cc,15,15,alongX,{},win);const fb=c.Bt,fr2=lerp(c.Bt,c.R,0.5);
    /* the brewing vat */const vx=fb[0]-12,vy=fb[1]-2;ctx.fillStyle='rgba(38,48,53,0.18)';ctx.beginPath();ctx.ellipse(vx+3,vy+2,12,5,0,0,6.3);ctx.fill();
    poly([vx-10,vy,vx+10,vy,vx+9,vy-14,vx-9,vy-14],'#8A6E52');poly([vx,vy,vx+10,vy,vx+9,vy-14,vx,vy-14],'#6E543D');
    ctx.strokeStyle='#3E3028';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(vx-10,vy-4);ctx.lineTo(vx+10,vy-4);ctx.moveTo(vx-9.5,vy-10);ctx.lineTo(vx+9.5,vy-10);ctx.stroke();
    ctx.fillStyle='#B5893E';ctx.beginPath();ctx.ellipse(vx,vy-14,9,3.6,0,0,6.3);ctx.fill();
    if(!win){ctx.fillStyle='rgba(235,235,230,0.55)';for(let k=0;k<3;k++){const ph=(t*0.6+k/3)%1;ctx.beginPath();ctx.arc(vx+Math.sin(ph*6+k)*3,vy-18-ph*16,2.5+ph*3,0,6.3);ctx.fill();}}
    barrelStack(fr2[0]+12,fr2[1]);return true;}
  case 'hives':{const c=inset(c0,0.12);
    if(!win){ctx.fillStyle='#C9A0C8';for(let k=0;k<14;k++){const p=lerp(lerp(c.T,c.R,h2(b.id,k,5)),lerp(c.L,c.Bt,h2(b.id,k,5)),h2(b.id,k,6));ctx.beginPath();ctx.arc(p[0],p[1],1.6,0,6.3);ctx.fill();}ctx.fillStyle='#E8D27A';for(let k=0;k<10;k++){const p=lerp(lerp(c.T,c.R,h2(b.id,k,7)),lerp(c.L,c.Bt,h2(b.id,k,7)),h2(b.id,k,8));ctx.beginPath();ctx.arc(p[0],p[1],1.4,0,6.3);ctx.fill();}}
    const bx0=lerp(c.L,c.T,0.5),bx1=lerp(c.Bt,c.R,0.5);poly([bx0[0],bx0[1]-6,bx1[0],bx1[1]-6,bx1[0],bx1[1]-9,bx0[0],bx0[1]-9],'#8A6E52');
    ctx.strokeStyle='#5C4634';ctx.lineWidth=2;ctx.beginPath();for(const f of [0.05,0.5,0.95]){const p=lerp(bx0,bx1,f);ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0],p[1]-6);}ctx.stroke();
    for(let k=0;k<4;k++){const p=lerp(bx0,bx1,0.14+k*0.24),x=p[0],y=p[1]-9;
      ctx.fillStyle='rgba(38,48,53,0.15)';ctx.beginPath();ctx.ellipse(x+2,y+1,8,3,0,0,6.3);ctx.fill();
      ctx.fillStyle=win?'#E6E8E3':'#C9A956';ctx.beginPath();ctx.moveTo(x-7,y);ctx.quadraticCurveTo(x-7,y-14,x,y-15);ctx.quadraticCurveTo(x+7,y-14,x+7,y);ctx.closePath();ctx.fill();
      if(!win){ctx.strokeStyle='rgba(120,92,40,0.6)';ctx.lineWidth=0.8;ctx.beginPath();for(let z=3;z<14;z+=3){const w=7*Math.sqrt(1-((z)/15)**2);ctx.moveTo(x-w,y-z);ctx.lineTo(x+w,y-z);}ctx.stroke();}
      ctx.fillStyle='#3E3028';ctx.beginPath();ctx.ellipse(x,y-2,1.6,1.2,0,0,6.3);ctx.fill();}
    if(!win){ctx.fillStyle='#3E3028';for(let k=0;k<6;k++){const a=t*3+k*1.7,p=lerp(bx0,bx1,0.5);ctx.fillRect(p[0]+Math.cos(a)*18*Math.sin(k),p[1]-22+Math.sin(a*1.3)*6,1.6,1.6);}}
    return true;}
  case 'tailor':{const c=inset(c0,0.16);let cc=c;{const k=0.28,R2=lerp(c.R,c.T,k),L2=lerp(c.L,c.T,k);cc={T:c.T,R:R2,L:L2,Bt:[R2[0]+L2[0]-c.T[0],R2[1]+L2[1]-c.T[1]],cx:c.cx,cy:c.cy};}
    hall(cc,14,14,alongX,{},win);const a=c.L,e=c.Bt;
    ctx.strokeStyle='#4E3C2E';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a[0]+4,a[1]);ctx.lineTo(a[0]+4,a[1]-20);ctx.moveTo(e[0]-4,e[1]);ctx.lineTo(e[0]-4,e[1]-20);ctx.stroke();
    ctx.strokeStyle='#6E543D';ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(a[0]+4,a[1]-19);ctx.quadraticCurveTo((a[0]+e[0])/2,(a[1]+e[1])/2-15,e[0]-4,e[1]-19);ctx.stroke();
    ['#A34A3A','#5E7F8C','#C9A64A','#E9E2D0','#7F9568'].forEach((col,k)=>{const f=0.15+k*0.17,p=lerp([a[0]+4,a[1]-19],[e[0]-4,e[1]-19],f);const sag=Math.sin(f*Math.PI)*4;const sw=Math.sin(t*2+k)*1.2;poly([p[0]-3,p[1]+sag,p[0]+3,p[1]+sag+1.5,p[0]+3+sw,p[1]+sag+11,p[0]-3+sw,p[1]+sag+9.5],win?'#E6E8E3':col);});
    return true;}
  case 'hof':{const c=inset(c0,0.1);
    /* a stave hall with a raised, second roof and gilded dragon gables */
    hall(c,20,18,alongX,{},win);
    /* stave-church tiers rising from the ridge: stacked steep roofs, gilded dragons, a spire */
    {const W0=c.R[0]-c.L[0],cx=(c.L[0]+c.R[0])/2,cy=(c.T[1]+c.Bt[1])/2,RL=win?'#EEF1F0':'#4A433C',RD=win?'#D3DAD9':'#2E2925',WL='#4A3626',WD='#33251A',G='#C9A64A';
      const tier=(by,a,wh,rh,dr)=>{const L=[cx-a,by],R=[cx+a,by],Bt=[cx,by+a/2];
        poly(P(L,Bt,up(Bt,wh),up(L,wh)),WL);poly(P(Bt,R,up(R,wh),up(Bt,wh)),WD);
        ctx.strokeStyle='rgba(20,14,10,0.35)';ctx.lineWidth=0.7;ctx.beginPath();for(let k=1;k<6;k++){const q=lerp(L,Bt,k/6),r=lerp(Bt,R,k/6);ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0],q[1]-wh);ctx.moveTo(r[0],r[1]);ctx.lineTo(r[0],r[1]-wh);}ctx.stroke();
        if(!win&&wh>=8){ctx.fillStyle='#1E1611';for(const u of [0.35,0.65]){const q=lerp(L,Bt,u),r=lerp(Bt,R,u);ctx.fillRect(q[0]-1,q[1]-wh*0.7,2,3);ctx.fillRect(r[0]-1,r[1]-wh*0.7,2,3);}}
        const e=1.25,eb=by-wh,EL=[cx-a*e,eb],ER=[cx+a*e,eb],EB=[cx,eb+a*e/2],ap=[cx,eb-rh];
        poly(P(EL,EB,ap),RL);poly(P(EB,ER,ap),RD);
        if(!win){ctx.strokeStyle='rgba(15,12,10,0.4)';ctx.lineWidth=0.6;ctx.beginPath();for(let k=1;k<5;k++){const v=k/5,a1=lerp(EL,ap,v),b1=lerp(EB,ap,v),c1=lerp(ER,ap,v);ctx.moveTo(a1[0],a1[1]);ctx.lineTo(b1[0],b1[1]);ctx.lineTo(c1[0],c1[1]);}ctx.stroke();}
        ctx.strokeStyle=G;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(EL[0],EL[1]);ctx.lineTo(EB[0],EB[1]);ctx.lineTo(ER[0],ER[1]);ctx.stroke();
        if(dr){dragonHead(EL,-1,G,dr);dragonHead(ER,1,G,dr);}
        return eb-rh;};
      const a1=W0*0.17;let y=cy-26;
      y=tier(y,a1,14,13,0.8)+9;
      y=tier(y,a1*0.7,10,11,0.6)+8;
      const top=tier(y,a1*0.4,7,26,0);
      ctx.strokeStyle=G;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(cx,top);ctx.lineTo(cx,top-9);ctx.stroke();poly([cx,top-9,cx+6,top-7.5,cx+5,top-5,cx,top-5.5],G);/* gilded weathervane */}
    /* posts with offerings and a fire bowl */
    const f=c.Bt;ctx.strokeStyle='#3E3028';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(f[0]-26,f[1]+2);ctx.lineTo(f[0]-26,f[1]-22);ctx.stroke();ctx.fillStyle='#C9A64A';ctx.beginPath();ctx.arc(f[0]-26,f[1]-24,3,0,6.3);ctx.fill();
    ctx.fillStyle='#4E4A45';ctx.beginPath();ctx.ellipse(f[0]+16,f[1]+2,7,3,0,0,6.3);ctx.fill();if(!win){ctx.fillStyle='#F07A30';ctx.beginPath();ctx.moveTo(f[0]+11,f[1]+1);ctx.quadraticCurveTo(f[0]+16,f[1]-12-Math.sin(t*6)*2,f[0]+21,f[1]+1);ctx.fill();}
    return true;}
  case 'tower':{const c=inset(c0,0.2),H=46;
    ctx.fillStyle='rgba(38,48,53,0.16)';ctx.beginPath();ctx.ellipse(c.cx+6,c.cy+3,22,10,0,0,6.3);ctx.fill();
    ctx.strokeStyle='#5C4634';ctx.lineWidth=3;ctx.beginPath();for(const q of [c.T,c.R,c.Bt,c.L]){ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0]+(c.cx-q[0])*0.25,q[1]+(c.cy-q[1])*0.25-H);}ctx.stroke();
    ctx.strokeStyle='#6E543D';ctx.lineWidth=1.4;ctx.beginPath();for(const z of [14,30]){const k=z/H*0.25;const p=[c.L,c.Bt,c.R].map(q=>[q[0]+(c.cx-q[0])*k,q[1]+(c.cy-q[1])*k-z]);ctx.moveTo(p[0][0],p[0][1]);ctx.lineTo(p[1][0],p[1][1]);ctx.lineTo(p[2][0],p[2][1]);
      const lo=[c.L,c.Bt,c.R].map(q=>[q[0]+(c.cx-q[0])*(k-0.08),q[1]+(c.cy-q[1])*(k-0.08)-z+14]);ctx.moveTo(lo[0][0],lo[0][1]);ctx.lineTo(p[1][0],p[1][1]);ctx.moveTo(lo[2][0],lo[2][1]);ctx.lineTo(p[1][0],p[1][1]);}ctx.stroke();
    const pk=k=>({T:[c.T[0]+(c.cx-c.T[0])*k,c.T[1]+(c.cy-c.T[1])*k-H],R:[c.R[0]+(c.cx-c.R[0])*k,c.R[1]+(c.cy-c.R[1])*k-H],Bt:[c.Bt[0]+(c.cx-c.Bt[0])*k,c.Bt[1]+(c.cy-c.Bt[1])*k-H],L:[c.L[0]+(c.cx-c.L[0])*k,c.L[1]+(c.cy-c.L[1])*k-H]});
    const pl=pk(0.1);poly(P(pl.T,pl.R,pl.Bt,pl.L),'#8A6E52');poly(P(pl.L,pl.Bt,up(pl.Bt,-3),up(pl.L,-3)),'#6E543D');poly(P(pl.Bt,pl.R,up(pl.R,-3),up(pl.Bt,-3)),'#5C4634');
    poly(P(pl.L,pl.Bt,up(pl.Bt,7),up(pl.L,7)),'rgba(110,84,61,0.85)');poly(P(pl.Bt,pl.R,up(pl.R,7),up(pl.Bt,7)),'rgba(92,70,52,0.85)');
    ctx.strokeStyle='#4E3C2E';ctx.lineWidth=1.6;ctx.beginPath();for(const q of [pl.L,pl.Bt,pl.R,pl.T]){ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0],q[1]-16);}ctx.stroke();
    const apex=[c.cx,c.cy-H-30];const r=pk(0.0);const rr={T:up(r.T,16),R:up(r.R,16),Bt:up(r.Bt,16),L:up(r.L,16)};
    poly(P(rr.L,rr.Bt,apex),win?'#EEF1F0':'#6E5A44');poly(P(rr.Bt,rr.R,apex),win?'#D3DAD9':'#584735');
    ctx.strokeStyle='#4E3C2E';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(apex[0],apex[1]);ctx.lineTo(apex[0],apex[1]-12);ctx.stroke();poly([apex[0],apex[1]-12,apex[0]+12,apex[1]-9+Math.sin(t*3)*1.5,apex[0],apex[1]-6],'#A34A3A');
    return true;}
  case 'tomb':{const c=inset(c0,0.08),done=S.tombDone,pr=b.proj?Math.min(1,b.proj.done/TOMB_WORK):0;
    /* a ship-setting of standing stones */
    const A=lerp(c.L,c.T,0.5),Bq=lerp(c.Bt,c.R,0.5),ax=alongX?[lerp(c.L,c.T,0.5),lerp(c.Bt,c.R,0.5)]:[lerp(c.T,c.R,0.5),lerp(c.L,c.Bt,0.5)];
    const mid=lerp(ax[0],ax[1],0.5),dx=ax[1][0]-ax[0][0],dy=ax[1][1]-ax[0][1],len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len,W=len*0.24;
    if(done){ctx.fillStyle=win?'#E3E7E5':'#8FA06E';ctx.beginPath();ctx.ellipse(mid[0],mid[1]-4,len*0.45,len*0.2,Math.atan2(dy,dx),0,6.3);ctx.fill();ctx.fillStyle=win?'#EEF1F0':'#A0B07C';ctx.beginPath();ctx.ellipse(mid[0],mid[1]-9,len*0.32,len*0.12,Math.atan2(dy,dx),0,6.3);ctx.fill();}
    else if(b.proj){/* the ship being dragged into place */const hl=len*0.6,h1=[mid[0]-dx/len*hl/2,mid[1]-dy/len*hl/2],h2p=[mid[0]+dx/len*hl/2,mid[1]+dy/len*hl/2];
      poly([h1[0],h1[1]-6,mid[0]+nx*W*0.6,mid[1]+ny*W*0.6,h2p[0],h2p[1]-6,mid[0]-nx*W*0.3,mid[1]-ny*W*0.3-4],'#6E543D');
      ctx.strokeStyle='#4E3C2E';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(h1[0],h1[1]-6);ctx.quadraticCurveTo(h1[0]-6,h1[1]-16,h1[0]-2,h1[1]-22);ctx.moveTo(h2p[0],h2p[1]-6);ctx.quadraticCurveTo(h2p[0]+6,h2p[1]-16,h2p[0]+2,h2p[1]-22);ctx.stroke();
      if(pr>0.3){ctx.fillStyle=win?'#E3E7E5':'rgba(143,160,110,'+(Math.min(1,(pr-0.3)*1.6)*0.9).toFixed(2)+')';ctx.beginPath();ctx.ellipse(mid[0],mid[1]-4,len*0.42*pr,len*0.18*pr,Math.atan2(dy,dx),0,6.3);ctx.fill();}}
    for(let k=0;k<=12;k++){const f=k/12,along=-0.5+f,wd=Math.sin(f*Math.PI)*W;for(const sgn of [-1,1]){if((k===0||k===12)&&sgn>0)continue;const px=mid[0]+dx*along*0.92+nx*wd*sgn,py=mid[1]+dy*along*0.92+ny*wd*sgn;const hh=(k===0||k===12)?14:6+3*h2(b.id,k*2+(sgn>0?1:0),9);
      poly([px-2.6,py,px+2.6,py+1,px+2,py-hh,px-2,py-hh-1],win?'#C9CCC8':'#9A958B');poly([px,py+0.5,px+2.6,py+1,px+2,py-hh,px,py-hh-0.5],win?'#AEB1AD':'#7D786F');}}
    return true;}
  }
  return false;}
