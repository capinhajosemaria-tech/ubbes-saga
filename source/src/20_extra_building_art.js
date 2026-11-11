/* =================== extra building art =================== */
function fenceRing(c,win){const corners=[c.T,c.R,c.Bt,c.L];ctx.strokeStyle='#6E543D';ctx.lineWidth=2;ctx.beginPath();
  for(let e=0;e<4;e++){const a=corners[e],b=corners[(e+1)%4];for(const hgt of [4,8]){ctx.moveTo(a[0],a[1]-hgt);ctx.lineTo(b[0],b[1]-hgt);}for(let k=0;k<=4;k++){const p=lerp(a,b,k/4);ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0],p[1]-10);}}ctx.stroke();}
function animal(x,y,sheep,bob){ctx.fillStyle='rgba(38,48,53,0.18)';ctx.beginPath();ctx.ellipse(x,y+1,6,2,0,0,6.3);ctx.fill();
  if(sheep){ctx.fillStyle='#ECE6D6';[[-3,-4],[0,-6],[3,-4],[0,-3]].forEach(o=>{ctx.beginPath();ctx.arc(x+o[0],y+o[1]-bob,3.2,0,6.3);ctx.fill();});ctx.fillStyle='#3F332A';ctx.beginPath();ctx.arc(x+5.5,y-5-bob,1.8,0,6.3);ctx.fill();}
  else{ctx.fillStyle='#C49A86';ctx.beginPath();ctx.ellipse(x,y-4-bob,6,3.6,0,0,6.3);ctx.fill();ctx.fillStyle='#B0846F';ctx.beginPath();ctx.arc(x+5.5,y-4.5-bob,2.4,0,6.3);ctx.fill();}}
function strawman(x,y){ctx.strokeStyle='#5A4636';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-18);ctx.moveTo(x-6,y-13);ctx.lineTo(x+6,y-13);ctx.stroke();ctx.fillStyle='#C9B06A';ctx.beginPath();ctx.ellipse(x,y-10,4,6,0,0,6.3);ctx.fill();ctx.beginPath();ctx.arc(x,y-18,3,0,6.3);ctx.fill();}
function spearRack(x,y){ctx.strokeStyle='#5A4636';ctx.lineWidth=1.6;ctx.beginPath();for(let k=0;k<4;k++){ctx.moveTo(x+k*4,y);ctx.lineTo(x+k*4+2,y-22);}ctx.moveTo(x-2,y-6);ctx.lineTo(x+16,y-6);ctx.stroke();ctx.fillStyle='#B7BCBF';for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(x+k*4+1,y-22);ctx.lineTo(x+k*4+3,y-22);ctx.lineTo(x+k*4+2,y-27);ctx.fill();}}
function pennant(b,e,col){const p=iso(b.fx+b.w/2-0.5,b.fy+b.h/2-0.5),x=p[0]+8,y=p[1]-e-Math.min(56,22+b.w*8);ctx.strokeStyle='#4E3C2E';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-14);ctx.stroke();poly([x,y-14,x+10,y-11,x,y-8],col);}
function drawExtra(b,win,c0,alongX){
  if(drawExtra2(b,win,c0,alongX))return true;
  const c=inset(c0,0.1),fb=c.Bt,fr2=lerp(c.Bt,c.R,0.5),fl=lerp(c.L,c.Bt,0.5);
  switch(b.t){
    case 'hay':{if(win||summerProgress()>0.55){[[0.35,0.4],[0.65,0.6]].forEach((q,i)=>{const p=lerp(lerp(c.T,c.R,q[0]),lerp(c.L,c.Bt,q[0]),q[1]);poly([p[0]-10,p[1],p[0]+10,p[1],p[0]+7,p[1]-9,p[0],p[1]-14,p[0]-7,p[1]-9],win?'#E6E8E3':'#C9B776');poly([p[0],p[1],p[0]+10,p[1],p[0]+7,p[1]-9,p[0],p[1]-14],win?'#D3D6D1':'#B3A062');});}return true;}
    case 'garden':{const p=lerp(c.T,c.Bt,0.5);ctx.strokeStyle='#5A4636';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0],p[1]-22);ctx.moveTo(p[0]-8,p[1]-16);ctx.lineTo(p[0]+8,p[1]-16);ctx.stroke();ctx.fillStyle='#8E5A4E';ctx.fillRect(p[0]-4,p[1]-17,8,8);ctx.fillStyle='#C9B06A';ctx.beginPath();ctx.arc(p[0],p[1]-22,3.4,0,6.3);ctx.fill();ctx.fillStyle='#4E3C2E';ctx.fillRect(p[0]-5,p[1]-26,10,2);return true;}
    case 'grain':{const p0=summerProgress();if(!win&&p0>0.75){[[0.3,0.5],[0.6,0.4],[0.5,0.75]].forEach(q=>{const p=lerp(lerp(c.T,c.R,q[0]),lerp(c.L,c.Bt,q[0]),q[1]);poly([p[0]-4,p[1],p[0]+4,p[1],p[0]+1,p[1]-12,p[0]-1,p[1]-12],'#D6B865');});}return true;}
    case 'flax':return true;
    case 'thrall':{const sh={T:c.T,R:lerp(c.T,c.R,0.5),L:lerp(c.T,c.L,0.7)};sh.Bt=[sh.R[0]+sh.L[0]-c.T[0],sh.R[1]+sh.L[1]-c.T[1]];hall(sh,10,11,alongX,{wall:'#7A6A58',wallD:'#5C4E40'},win);
      const ring=inset(c0,0.04),cs=[ring.T,ring.R,ring.Bt,ring.L];ctx.strokeStyle='#5C4634';ctx.lineWidth=2.4;ctx.beginPath();for(let e=0;e<4;e++){const a=cs[e],q=cs[(e+1)%4];for(let k=0;k<=8;k++){const p=lerp(a,q,k/8);ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0],p[1]-13);}}ctx.stroke();return true;}
    case 'camp':{const ce=[c.cx,c.cy];ctx.fillStyle=win?'#C9CCC8':'#8E877D';for(let k=0;k<8;k++){const a=k/8*6.283;ctx.beginPath();ctx.ellipse(ce[0]+Math.cos(a)*9,ce[1]+Math.sin(a)*4.5,2.6,1.8,0,0,6.3);ctx.fill();}
      ctx.strokeStyle='#6E543D';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(ce[0]-6,ce[1]+2);ctx.lineTo(ce[0]+6,ce[1]-3);ctx.moveTo(ce[0]-6,ce[1]-3);ctx.lineTo(ce[0]+6,ce[1]+2);ctx.stroke();
      ctx.fillStyle='rgba(255,197,107,0.3)';ctx.beginPath();ctx.ellipse(ce[0],ce[1]-2,16,9,0,0,6.3);ctx.fill();ctx.fillStyle='#F0A040';ctx.beginPath();ctx.moveTo(ce[0]-4,ce[1]);ctx.quadraticCurveTo(ce[0],ce[1]-14-Math.sin(t*7)*2,ce[0]+4,ce[1]);ctx.fill();ctx.fillStyle='#F7D27A';ctx.beginPath();ctx.moveTo(ce[0]-2,ce[1]);ctx.quadraticCurveTo(ce[0],ce[1]-8,ce[0]+2,ce[1]);ctx.fill();return true;}
    case 'bench':{const ce=[c.cx,c.cy];[[-6,-2],[6,4]].forEach(o=>{const x=ce[0]+o[0],y=ce[1]+o[1];ctx.fillStyle='#6E543D';ctx.fillRect(x-7,y-5,1.6,6);ctx.fillRect(x+6,y-1,1.6,6);poly([x-9,y-7,x+9,y-1,x+9,y+1,x-9,y-5],'#A88A69');poly([x-9,y-9,x+9,y-3,x+9,y-1,x-9,y-7],'#C9A87A');});return true;}
    case 'wattle':{const a=lerp(c0.L,c0.Bt,0.5),e2=lerp(c0.T,c0.R,0.5);ctx.strokeStyle='#6E543D';ctx.lineWidth=2;ctx.beginPath();for(let k=0;k<=4;k++){const p=lerp(a,e2,k/4);ctx.moveTo(p[0],p[1]+1);ctx.lineTo(p[0],p[1]-11);}ctx.stroke();
      ctx.strokeStyle=win?'#B9AE9C':'#A88A69';ctx.lineWidth=2.2;for(let j=0;j<4;j++){ctx.beginPath();ctx.moveTo(a[0],a[1]-2-j*2.5);ctx.lineTo(e2[0],e2[1]-2-j*2.5);ctx.stroke();}return true;}
    case 'rune':{const ce=[c.cx,c.cy+2];ctx.fillStyle='rgba(38,48,53,0.18)';ctx.beginPath();ctx.ellipse(ce[0],ce[1],7,3,0,0,6.3);ctx.fill();poly([ce[0]-4,ce[1],ce[0]+4,ce[1],ce[0]+4,ce[1]-30,ce[0],ce[1]-35,ce[0]-4,ce[1]-30],'#7A5F46');poly([ce[0],ce[1],ce[0]+4,ce[1],ce[0]+4,ce[1]-30,ce[0],ce[1]-35],'#5C4634');
      ctx.strokeStyle='#A34A3A';ctx.lineWidth=1;ctx.beginPath();for(let k=0;k<5;k++){const y=ce[1]-8-k*4.5;ctx.moveTo(ce[0]-3,y);ctx.lineTo(ce[0]-0.5,y-2.5);ctx.moveTo(ce[0]-2,y-3);ctx.lineTo(ce[0]-2,y+1);}ctx.stroke();return true;}
    case 'herbs':{const cc=inset(c0,0.16);poly(P(cc.T,cc.R,cc.Bt,cc.L),'#6E543D');const ii=inset(c0,0.24);poly(P(ii.T,ii.R,ii.Bt,ii.L),win?'#E1E5E3':'#5C4634');
      if(!win){for(let k=0;k<7;k++){const p=lerp(lerp(ii.T,ii.R,0.2+0.6*h2(b.id,k,3)),lerp(ii.L,ii.Bt,0.2+0.6*h2(b.id,k,3)),0.2+0.6*h2(b.id,k,4));ctx.fillStyle=k%3?'#7F9568':'#A3B27A';ctx.beginPath();ctx.arc(p[0],p[1]-3,3,0,6.3);ctx.fill();if(k%3===0){ctx.fillStyle='#B9A0C9';ctx.beginPath();ctx.arc(p[0],p[1]-5,1.2,0,6.3);ctx.fill();}}}return true;}
    case 'prow':{const ce=[c.cx,c.cy+3];poly([ce[0]-8,ce[1],ce[0]+8,ce[1],ce[0]+8,ce[1]-4,ce[0]-8,ce[1]-4],'#6E543D');ctx.strokeStyle='#7A5F46';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(ce[0]-2,ce[1]-4);ctx.quadraticCurveTo(ce[0]-6,ce[1]-26,ce[0]+4,ce[1]-34);ctx.stroke();ctx.lineCap='butt';
      poly([ce[0]+2,ce[1]-37,ce[0]+12,ce[1]-34,ce[0]+6,ce[1]-30],'#7A5F46');ctx.fillStyle='#A34A3A';ctx.beginPath();ctx.arc(ce[0]+6,ce[1]-34,1.3,0,6.3);ctx.fill();ctx.strokeStyle='#C9A64A';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(ce[0]-5,ce[1]-12);ctx.lineTo(ce[0]-1,ce[1]-14);ctx.moveTo(ce[0]-5,ce[1]-18);ctx.lineTo(ce[0]-1,ce[1]-20);ctx.stroke();return true;}
    case 'nets':{const a=lerp(c0.L,c0.Bt,0.5),e2=lerp(c0.T,c0.R,0.5);ctx.strokeStyle='#5A4636';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(a[0],a[1]-20);ctx.moveTo(e2[0],e2[1]);ctx.lineTo(e2[0],e2[1]-20);ctx.moveTo(a[0],a[1]-19);ctx.lineTo(e2[0],e2[1]-19);ctx.stroke();
      ctx.strokeStyle='rgba(78,60,46,0.75)';ctx.lineWidth=0.7;ctx.beginPath();for(let k=1;k<6;k++){const p=lerp([a[0],a[1]-19],[e2[0],e2[1]-19],k/6);ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0],p[1]+12+Math.sin(k)*2);}for(let j=1;j<4;j++){ctx.moveTo(a[0],a[1]-19+j*4);ctx.lineTo(e2[0],e2[1]-19+j*4);}ctx.stroke();return true;}
    case 'pen':{const sh={T:c.T,R:lerp(c.T,c.R,0.38),L:lerp(c.T,c.L,0.38)};sh.Bt=[sh.R[0]+sh.L[0]-c.T[0],sh.R[1]+sh.L[1]-c.T[1]];hall(sh,10,10,true,{door:true},win);
      const n=Math.min(10,herdTotal());for(let k=0;k<n;k++){const u=0.35+h2(b.id,k,61)*0.55,v=0.25+h2(b.id,k,62)*0.65,mv=Math.sin(t*0.7+k)*0.04;const p=lerp(lerp(c.T,c.R,u+mv),lerp(c.L,c.Bt,u+mv),v);animal(p[0],p[1],k<S.herd.sheep*n/Math.max(1,herdTotal()),Math.abs(Math.sin(t*3+k))*0.8);}
      fenceRing(inset(c0,0.04),win);return true;}
    case 'salt':{const back={T:c.T,R:lerp(c.T,c.R,0.45),L:lerp(c.T,c.L,0.45)};back.Bt=[back.R[0]+back.L[0]-c.T[0],back.R[1]+back.L[1]-c.T[1]];hall(back,11,10,true,{},win);
      for(let k=0;k<3;k++){const p=lerp(lerp(c.L,c.Bt,0.2+k*0.28),lerp(c.R,c.Bt,0.2+k*0.28),0.25);poly([p[0]-10,p[1],p[0],p[1]-5,p[0]+10,p[1],p[0],p[1]+5],'#6C645A');poly([p[0]-8,p[1],p[0],p[1]-4,p[0]+8,p[1],p[0],p[1]+4],k===1?'#F3F2EC':'#9DB4BC');}
      return true;}
    case 'smoke':{hall(c,14,14,alongX,{},win);ctx.strokeStyle='#4E3C2E';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(fb[0]-18,fb[1]-4);ctx.lineTo(fb[0]-18,fb[1]-22);ctx.moveTo(fb[0]+4,fb[1]+6);ctx.lineTo(fb[0]+4,fb[1]-12);ctx.moveTo(fb[0]-18,fb[1]-20);ctx.lineTo(fb[0]+4,fb[1]-10);ctx.stroke();
      for(let k=1;k<5;k++){const p=lerp([fb[0]-18,fb[1]-20],[fb[0]+4,fb[1]-10],k/5);ctx.fillStyle=k%2?'#7A3A2A':'#9A5B3A';ctx.beginPath();ctx.ellipse(p[0],p[1]+5,1.8,4.5,0,0,6.3);ctx.fill();}return true;}
    case 'altar':{const ce=[c.cx,c.cy];ctx.fillStyle=win?'#C9CCC8':'#9A958B';for(let k=0;k<8;k++){const a=k/8*6.283;poly([ce[0]+Math.cos(a)*22-3,ce[1]+Math.sin(a)*11,ce[0]+Math.cos(a)*22,ce[1]+Math.sin(a)*11-9,ce[0]+Math.cos(a)*22+3,ce[1]+Math.sin(a)*11],ctx.fillStyle);}
      poly([ce[0]-3,ce[1],ce[0]+3,ce[1],ce[0]+3,ce[1]-30,ce[0],ce[1]-34,ce[0]-3,ce[1]-30],'#6E543D');ctx.fillStyle='#C9B38A';ctx.fillRect(ce[0]-2,ce[1]-27,4,2);ctx.fillRect(ce[0]-2,ce[1]-22,4,1.5);
      const act=GOD_KEYS.some(k=>(S.blessOn[k]||0)>S.day)||S.blessOn.odinR||S.blessOn.njordV||S.blessOn.lokiR;ctx.fillStyle='#857F76';ctx.beginPath();ctx.ellipse(ce[0]+10,ce[1]+4,6,3,0,0,6.3);ctx.fill();
      if(act){ctx.fillStyle='rgba(255,197,107,0.35)';ctx.beginPath();ctx.ellipse(ce[0]+10,ce[1]+2,14,8,0,0,6.3);ctx.fill();ctx.fillStyle='#F0A040';ctx.beginPath();ctx.moveTo(ce[0]+7,ce[1]+3);ctx.quadraticCurveTo(ce[0]+10,ce[1]-12-Math.sin(t*6)*2,ce[0]+13,ce[1]+3);ctx.fill();}return true;}
    case 'train':{fenceRing(inset(c0,0.04),win);strawman(lerp(c.T,c.Bt,0.35)[0],lerp(c.T,c.Bt,0.35)[1]);strawman(lerp(c.T,c.Bt,0.6)[0]-14,lerp(c.T,c.Bt,0.6)[1]);strawman(lerp(c.T,c.Bt,0.55)[0]+16,lerp(c.T,c.Bt,0.55)[1]);spearRack(fl[0]+4,fl[1]-2);return true;}
    case 'arsenal':{hall(c,18,18,alongX,{wall:'#7A5F46',wallD:'#5C4634'},win);spearRack(fr2[0]+4,fr2[1]);[0.25,0.5,0.75].forEach((k,i)=>{const p=lerp(c.L,c.Bt,k);ctx.fillStyle=i%2?'#D7CDB4':'#A34A3A';ctx.beginPath();ctx.arc(p[0],p[1]-10,4,0,6.3);ctx.fill();});return true;}
    case 'bakery':{const back={T:c.T,R:lerp(c.T,c.R,0.7),L:lerp(c.T,c.L,0.7)};back.Bt=[back.R[0]+back.L[0]-c.T[0],back.R[1]+back.L[1]-c.T[1]];hall(back,13,13,alongX,{},win);
      ctx.fillStyle='#A8826A';ctx.beginPath();ctx.ellipse(fb[0]-4,fb[1]-6,11,9,0,Math.PI,0);ctx.fill();ctx.fillRect(fb[0]-15,fb[1]-6,22,4);ctx.fillStyle='#3C2E24';ctx.beginPath();ctx.ellipse(fb[0]-4,fb[1]-4,4,3,0,Math.PI,0);ctx.fill();ctx.fillStyle='rgba(255,180,90,0.7)';ctx.beginPath();ctx.arc(fb[0]-4,fb[1]-5,1.8,0,6.3);ctx.fill();return true;}
    case 'weaver':{hall(c,14,14,alongX,{},win);const x=fr2[0]+4,y=fr2[1];ctx.strokeStyle='#5A4636';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-20);ctx.moveTo(x+14,y-6);ctx.lineTo(x+14,y-26);ctx.moveTo(x-1,y-19);ctx.lineTo(x+15,y-25);ctx.stroke();poly([x+1,y-6,x+13,y-12,x+13,y-23,x+1,y-17],'#E9E2D0');poly([x+5,y-8,x+9,y-10,x+9,y-21,x+5,y-19],'#A34A3A');return true;}
    case 'hunter':{hall(c,12,13,alongX,{},win);ctx.strokeStyle='#5A4636';ctx.lineWidth=1.5;[[fb[0]-16,fb[1]-2],[fb[0]+2,fb[1]+2]].forEach(q=>{ctx.strokeRect(q[0]-6,q[1]-16,12,14);ctx.fillStyle='#8A6248';ctx.fillRect(q[0]-5,q[1]-15,10,12);});return true;}
    case 'shipyard':{const along=alongX;poly(P(c0.T,c0.R,c0.Bt,c0.L),win?'#D6D9D5':'#B19E7B');
      ctx.strokeStyle='#8A6E52';ctx.lineWidth=3;ctx.beginPath();for(let k=0;k<6;k++){const a=along?lerp(c0.T,c0.L,(k+0.5)/6):lerp(c0.T,c0.R,(k+0.5)/6),e2=along?lerp(c0.R,c0.Bt,(k+0.5)/6):lerp(c0.L,c0.Bt,(k+0.5)/6);ctx.moveTo(a[0],a[1]);ctx.lineTo(e2[0],e2[1]);}ctx.stroke();
      const sh={T:c0.T,R:lerp(c0.T,c0.R,0.3),L:lerp(c0.T,c0.L,0.3)};sh.Bt=[sh.R[0]+sh.L[0]-c0.T[0],sh.R[1]+sh.L[1]-c0.T[1]];hall(inset(sh,0.1),12,12,true,{},win);
      if(b.proj){const pr=b.proj.done/SHIPS[b.proj.type].work;drawShip(c0.cx||(c0.T[0]+c0.Bt[0])/2,(c0.T[1]+c0.Bt[1])/2+4,0.34,!along,b.proj.type==='knarr',pr);}
      return true;}
    case 'harbour':{poly(P(c0.T,c0.R,c0.Bt,c0.L),'#A88A69');ctx.strokeStyle='rgba(78,60,46,0.5)';ctx.lineWidth=1;ctx.beginPath();for(let k=1;k<9;k++){const a=lerp(c0.T,c0.L,k/9),e2=lerp(c0.R,c0.Bt,k/9);ctx.moveTo(a[0],a[1]);ctx.lineTo(e2[0],e2[1]);}ctx.stroke();
      poly(P(c0.L,c0.Bt,[c0.Bt[0],c0.Bt[1]+5],[c0.L[0],c0.L[1]+5]),'#6E543D');poly(P(c0.Bt,c0.R,[c0.R[0],c0.R[1]+5],[c0.Bt[0],c0.Bt[1]+5]),'#5C4634');
      [c0.L,c0.Bt,c0.R,lerp(c0.L,c0.Bt,0.5),lerp(c0.Bt,c0.R,0.5)].forEach(p=>{ctx.fillStyle='#4E3C2E';ctx.fillRect(p[0]-2,p[1]-6,4,10);});
      const cr=lerp(c0.T,c0.Bt,0.4);ctx.strokeStyle='#5A4636';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(cr[0],cr[1]);ctx.lineTo(cr[0],cr[1]-34);ctx.lineTo(cr[0]+20,cr[1]-28);ctx.stroke();ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cr[0]+20,cr[1]-28);ctx.lineTo(cr[0]+20,cr[1]-14);ctx.stroke();ctx.fillStyle='#A88A69';ctx.fillRect(cr[0]+16,cr[1]-14,8,6);
      barrelC(lerp(c0.T,c0.L,0.5)[0]+10,lerp(c0.T,c0.L,0.5)[1]+6);barrelC(lerp(c0.T,c0.R,0.5)[0]-6,lerp(c0.T,c0.R,0.5)[1]+8);
      return true;}
    case 'trade':{hall(c,16,16,alongX,{},win);const a=alongX?lerp(c.Bt,c.R,0.2):lerp(c.L,c.Bt,0.2),e2=alongX?lerp(c.Bt,c.R,0.8):lerp(c.L,c.Bt,0.8);
      for(let k=0;k<6;k++){const p=lerp(a,e2,k/6),q=lerp(a,e2,(k+1)/6);poly([p[0],p[1]-14,q[0],q[1]-14,q[0]+(alongX?-6:6),q[1]-6,p[0]+(alongX?-6:6),p[1]-6],k%2?'#E9E2D0':'#A34A3A');}
      barrelC(fb[0]-12,fb[1]+2);barrelC(fb[0]+2,fb[1]+4);return true;}
  }
  return false;
}
function drawShipsAtHarbour(win){const hb=B.find(b=>b.t==='harbour');const home=S.ships.filter(s=>!s.away);if(!hb||!home.length)return;const spots=dockSpots(hb);if(!spots.length)return;
  home.forEach((s,i)=>{const sp=spots[Math.min(spots.length-1,Math.floor((i+0.5)*spots.length/home.length))];const p=iso(sp.q[0],sp.q[1]);const bob=Math.sin(t*1.2+i)*1.2;
    const flip=Math.abs(sp.p[0]-(hb.fx+hb.w/2-0.5))>Math.abs(sp.p[1]-(hb.fy+hb.h/2-0.5));drawShip(p[0],p[1]+8+bob,0.36,flip,s.type==='knarr');SHIP_HITS.push([p[0],p[1],s.id]);});}

function drawBuilding(b,win,alpha,ghost){DOOR_SIDE=SIDES[(b.rot|0)&3];PROP_B=ghost||b.thumb?null:b;CUR_T=b.t;try{drawBuilding0(b,win,alpha,ghost);}finally{DOOR_SIDE=null;PROP_B=null;CUR_T=null;}}
function drawBuilding0(b,win,alpha,ghost){
  const D=DEF[b.t],e=D.water?1:(elev[b.fy*N+b.fx]||2);
  if(alpha<1)ctx.globalAlpha=alpha;
  ctx.save();ctx.translate(0,-e);
  if(b.t==='house'){drawHouse(b,win);if(!ghost&&b.lvl>=2)pennant(b,0,b.lvl>=3?'#A34A3A':'#C9A64A');ctx.restore();if(alpha<1)ctx.globalAlpha=1;return;}
  if(b.t==='th'&&(window.__THV!==undefined?window.__THV:THV)){THV=window.__THV!==undefined?window.__THV:THV;if(((b.rot|0)&3)===2){drawPlaza(b,win);drawTownHall(b,win);}else{drawTownHall(b,win);drawPlaza(b,win);}/* fire behind the hall: draw it first */ctx.restore();if(alpha<1)ctx.globalAlpha=1;return;}
  if(b.t==='th'){const hb=thHallRect(b),p=iso(hb.fx+hb.w/2-0.5,hb.fy+hb.h/2-0.5),L=thLevel();
    if(L>=2){const c=fp(hb);[c.L,c.R].forEach((q,i)=>{const x=q[0]+(i?-14:14),y=q[1]+(i?2:2);ctx.strokeStyle='#4E3C2E';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-46);ctx.stroke();poly([x,y-45,x+(i?-16:16),y-41,x,y-35],'#A34A3A');poly([x+(i?-4:4),y-42,x+(i?-10:10),y-40,x+(i?-5:5),y-39],'#263035');});}
    drawSprite(SP.lh[win?1:0],p[0],p[1],[0.6,0.64,0.69,0.72,0.75][L-1],1,false);
    if(L>=3){const c=fp(hb);[lerp(c.L,c.Bt,0.2),lerp(c.Bt,c.R,0.8)].forEach(q=>{ctx.fillStyle='#4E4A45';ctx.fillRect(q[0]-3,q[1]-14,6,14);ctx.fillStyle='rgba(255,197,107,0.35)';ctx.beginPath();ctx.ellipse(q[0],q[1]-16,12,7,0,0,6.3);ctx.fill();ctx.fillStyle='#F0A040';ctx.beginPath();ctx.moveTo(q[0]-4,q[1]-14);ctx.quadraticCurveTo(q[0],q[1]-26-Math.sin(t*7)*2,q[0]+4,q[1]-14);ctx.fill();});
      const top=[p[0]+(b.rot%2?-1:1)*32*0.69,p[1]-176*0.69];ctx.strokeStyle='#4E3C2E';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(top[0],top[1]);ctx.lineTo(top[0],top[1]-12);ctx.stroke();poly([top[0],top[1]-12,top[0]+11,top[1]-9,top[0],top[1]-5],'#C9A64A');}
    drawPlaza(b,win);
    ctx.restore();if(alpha<1)ctx.globalAlpha=1;return;}
  const c0=fp(b),alongX=b.w>=b.h;
  if(!window.__OLDB&&drawShaped(b,win,c0,alongX)){if(!ghost&&b.lvl>=2)pennant(b,0,b.lvl>=3?'#A34A3A':'#C9A64A');ctx.restore();if(alpha<1)ctx.globalAlpha=1;return;}
  if(drawExtra(b,win,c0,alongX)){if(!ghost&&b.lvl>=2)pennant(b,0,b.lvl>=3?'#A34A3A':'#C9A64A');ctx.restore();if(alpha<1)ctx.globalAlpha=1;return;}
  switch(b.t){
    case 'market':{const c=inset(c0,0.04);poly(P(c.T,c.R,c.Bt,c.L),win?'#D8DCDA':'#B5AE9F');
      ctx.strokeStyle=win?'rgba(170,175,172,0.7)':'rgba(140,132,118,0.7)';ctx.lineWidth=1;ctx.beginPath();for(let k=1;k<8;k++){const a=lerp(c.T,c.R,k/8),b2=lerp(c.L,c.Bt,k/8);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);const a2=lerp(c.T,c.L,k/8),b3=lerp(c.R,c.Bt,k/8);ctx.moveTo(a2[0],a2[1]);ctx.lineTo(b3[0],b3[1]);}ctx.stroke();
      const stall=(px,py,col)=>{ctx.strokeStyle='#4E3C2E';ctx.lineWidth=2;ctx.beginPath();[[-12,0],[12,0],[-6,6],[18,6]].forEach(o=>{ctx.moveTo(px+o[0],py+o[1]);ctx.lineTo(px+o[0],py+o[1]-16);});ctx.stroke();
        poly([px-12,py+2-8,px+18,py+8-8,px+18,py+8-11,px-12,py+2-11],'#8A6E52');
        poly([px-15,py-16,px+21,py-10,px+16,py-24,px-10,py-30],col);poly([px-15,py-16,px+21,py-10,px+21,py-13,px-15,py-19],'rgba(38,48,53,0.18)');
        ctx.fillStyle='#E9E2D0';[-6,4,14].forEach(o=>{ctx.beginPath();ctx.moveTo(px+o-3,py-19+o*0.17);ctx.lineTo(px+o+3,py-18+o*0.17);ctx.lineTo(px+o+1,py-27+o*0.17);ctx.lineTo(px+o-5,py-28+o*0.17);ctx.closePath();ctx.fill();});};
      stall(c.T[0],c.T[1]+26,'#A34A3A');stall(c.R[0]-40,c.R[1]+2,'#5E7F8C');stall(c.L[0]+34,c.L[1]-6,'#7F9568');
      const ce=[c.cx,c.cy];ctx.fillStyle=win?'#C9CCC8':'#8E877D';ctx.beginPath();ctx.ellipse(ce[0],ce[1],12,6,0,0,6.3);ctx.fill();ctx.fillStyle='#4E6A76';ctx.beginPath();ctx.ellipse(ce[0],ce[1]-1,8,4,0,0,6.3);ctx.fill();
      poly([ce[0]-2,ce[1]-1,ce[0]+2,ce[1]-1,ce[0]+2,ce[1]-14,ce[0]-2,ce[1]-14],'#5A4636');
      barrelC(c.Bt[0]-14,c.Bt[1]-6);barrelC(c.Bt[0]+2,c.Bt[1]-10);break;}
    case 'pyre':{const c=inset(c0,0.15);ctx.fillStyle=win?'#C9CCC8':'#9A958B';for(let k=0;k<10;k++){const a=k/10*6.283;ctx.beginPath();ctx.ellipse(c.cx+Math.cos(a)*26,c.cy+Math.sin(a)*13,4,2.6,0,0,6.3);ctx.fill();}
      ctx.fillStyle='rgba(60,46,36,0.45)';ctx.beginPath();ctx.ellipse(c.cx,c.cy,18,9,0,0,6.3);ctx.fill();
      for(let j=0;j<4;j++){const yy=c.cy-j*5,s=16-j*3;ctx.strokeStyle=j%2?'#6E543D':'#8A6E52';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();if(j%2){ctx.moveTo(c.cx-s,yy-s*0.5+0);ctx.lineTo(c.cx+s,yy+s*0.5);}else{ctx.moveTo(c.cx-s,yy+s*0.5);ctx.lineTo(c.cx+s,yy-s*0.5);}ctx.stroke();ctx.lineCap='butt';}
      break;}
    case 'water':{const c=inset(c0,0.1);ctx.fillStyle=win?'#C9CCC8':'#9A958B';ctx.beginPath();ctx.ellipse(c.cx,c.cy,11,5.5,0,0,6.3);ctx.fill();ctx.fillStyle='#857F76';ctx.fillRect(c.cx-11,c.cy-6,22,6);ctx.fillStyle=win?'#E9EDEE':'#9A958B';ctx.beginPath();ctx.ellipse(c.cx,c.cy-6,11,5.5,0,0,6.3);ctx.fill();ctx.fillStyle=win?'#CFE0E5':'#3F5A6A';ctx.beginPath();ctx.ellipse(c.cx,c.cy-6,7,3.4,0,0,6.3);ctx.fill();
      ctx.strokeStyle='#4E3C2E';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(c.cx-10,c.cy-4);ctx.lineTo(c.cx-10,c.cy-26);ctx.moveTo(c.cx+10,c.cy-4);ctx.lineTo(c.cx+10,c.cy-26);ctx.moveTo(c.cx-12,c.cy-24);ctx.lineTo(c.cx+12,c.cy-24);ctx.stroke();
      poly([c.cx-15,c.cy-24,c.cx,c.cy-34,c.cx+15,c.cy-24],win?'#EEF1F0':'#7F9568');ctx.strokeStyle='#C9B38A';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(c.cx,c.cy-24);ctx.lineTo(c.cx,c.cy-14);ctx.stroke();poly([c.cx-3,c.cy-14,c.cx+3,c.cy-14,c.cx+2,c.cy-9,c.cx-2,c.cy-9],'#8A6E52');
      barrelC(c.Bt[0]+2,c.Bt[1]-2);break;}
    case 'gran':{const c=inset(c0,0.14);ctx.strokeStyle='#4E3C2E';ctx.lineWidth=3;ctx.beginPath();[c.L,c.Bt,c.R].forEach(p=>{ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0],p[1]-8);});ctx.stroke();
      ctx.save();ctx.translate(0,-8);hall(c,16,16,alongX,{door:true},win);ctx.restore();
      ctx.strokeStyle='#6E543D';ctx.lineWidth=2;ctx.beginPath();const d=alongX?lerp(c.Bt,c.R,0.5):lerp(c.L,c.Bt,0.5);ctx.moveTo(d[0]-10,d[1]+6);ctx.lineTo(d[0],d[1]-8);ctx.moveTo(d[0]-6,d[1]+6);ctx.lineTo(d[0]+4,d[1]-8);ctx.stroke();break;}
    default:{const sizes={jarl:[22,24],ware:[20,20],wood:[15,15],carp:[15,15],mine:[13,14],smith:[14,14],fish:[13,14],berry:[12,13],pres:[15,15]};const s=sizes[b.t]||[15,15];
      const opts={};if(b.t==='jarl'){opts.barge='#8E3B2F';}if(b.t==='mine'){opts.roof='#857C71';opts.roofD='#6C645A';}if(b.t==='berry'){opts.wall='#9A7C5E';}
      const c=inset(c0,b.t==='jarl'||b.t==='ware'?0.08:0.18);
      const back=b.t==='wood'||b.t==='fish'||b.t==='berry'||b.t==='smith'||b.t==='carp'||b.t==='mine'||b.t==='pres';
      let cc=c;if(back){const k=0.3,R2=lerp(c.R,c.T,k),L2=lerp(c.L,c.T,k);cc={T:c.T,R:R2,L:L2,Bt:[R2[0]+L2[0]-c.T[0],R2[1]+L2[1]-c.T[1]],cx:c.cx,cy:c.cy};}
      hall(cc,s[0],s[1],alongX,opts,win);
      const fr=lerp(c.L,c.Bt,0.5),fr2=lerp(c.Bt,c.R,0.5),fb=c.Bt;
      if(b.t==='jarl'){[0.15,0.35,0.55,0.75].forEach((k,i)=>{const p=lerp(c.L,c.Bt,k);ctx.fillStyle=i%2?'#D7CDB4':'#A34A3A';ctx.beginPath();ctx.arc(p[0],p[1]-12,4.5,0,6.3);ctx.fill();ctx.fillStyle='#C9C2B2';ctx.beginPath();ctx.arc(p[0],p[1]-12,1.4,0,6.3);ctx.fill();});
        const p=lerp(c.L,c.Bt,0.95);ctx.strokeStyle='#4E3C2E';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(p[0]+6,p[1]+6);ctx.lineTo(p[0]+6,p[1]-34);ctx.stroke();poly([p[0]+6,p[1]-33,p[0]+24,p[1]-29,p[0]+6,p[1]-23],'#A34A3A');}
      if(b.t==='wood'){logPileC(fb[0]-2,fb[1]-2,4);ctx.fillStyle='#8A6E52';ctx.fillRect(fr2[0]+4,fr2[1]-6,8,6);ctx.fillStyle='#D2B98F';ctx.beginPath();ctx.ellipse(fr2[0]+8,fr2[1]-6,4,2,0,0,6.3);ctx.fill();ctx.strokeStyle='#5A4636';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(fr2[0]+8,fr2[1]-6);ctx.lineTo(fr2[0]+14,fr2[1]-14);ctx.stroke();poly([fr2[0]+6,fr2[1]-6,fr2[0]+10,fr2[1]-8,fr2[0]+11,fr2[1]-4,fr2[0]+7,fr2[1]-3],'#B7BCBF');}
      if(b.t==='carp'){for(let k=0;k<4;k++){const y0=fb[1]-2-k*2.6;poly([fb[0]-22,y0-11,fb[0]+2,y0+1,fb[0]+8,y0-2,fb[0]-16,y0-14],k%2?'#C9A87A':'#B8966A');}
        ctx.strokeStyle='#5A4636';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(fr2[0]+2,fr2[1]);ctx.lineTo(fr2[0]+8,fr2[1]-10);ctx.moveTo(fr2[0]+14,fr2[1]-3);ctx.lineTo(fr2[0]+8,fr2[1]-10);ctx.moveTo(fr2[0]+2,fr2[1]-8);ctx.lineTo(fr2[0]+18,fr2[1]-12);ctx.stroke();}
      if(b.t==='mine'){const m=lerp(c.T,c.R,0.5);poly([m[0]-10,m[1]+4,m[0]+10,m[1]-6,m[0]+10,m[1]-20,m[0],m[1]-26,m[0]-10,m[1]-12],'#3C2E24');
        poly([fb[0]-16,fb[1]-4,fb[0]-4,fb[1]+2,fb[0]+4,fb[1]-2,fb[0]-8,fb[1]-8],'#6E543D');poly([fb[0]-16,fb[1]-4,fb[0]-4,fb[1]+2,fb[0]-4,fb[1]-4,fb[0]-16,fb[1]-10],'#8A6E52');
        poly([fb[0]-14,fb[1]-10,fb[0]-8,fb[1]-15,fb[0]-2,fb[1]-12,fb[0]-6,fb[1]-7],'#4E4A45');ctx.fillStyle='#9A5B3A';ctx.beginPath();ctx.arc(fb[0]-7,fb[1]-11,1.6,0,6.3);ctx.fill();
        poly([fr2[0]+4,fr2[1],fr2[0]+10,fr2[1]-8,fr2[0]+18,fr2[1]-4,fr2[0]+14,fr2[1]+2],'#4E4A45');}
      if(b.t==='smith'){const gx=fb[0]-6,gy=fb[1]-4;ctx.fillStyle='rgba(255,197,107,0.35)';ctx.beginPath();ctx.ellipse(gx,gy-6,20,11,0,0,6.3);ctx.fill();
        poly([gx-10,gy,gx,gy+5,gx+10,gy,gx,gy-5],'#857F76');poly([gx-10,gy,gx,gy+5,gx,gy+11,gx-10,gy+6],'#6C645A');poly([gx,gy+5,gx+10,gy,gx+10,gy+6,gx,gy+11],'#5E574E');
        ctx.fillStyle='#F07A30';ctx.beginPath();ctx.arc(gx-2,gy,2.4,0,6.3);ctx.arc(gx+3,gy+1,2,0,6.3);ctx.fill();
        poly([fr2[0]+6,fr2[1]-2,fr2[0]+20,fr2[1]-2,fr2[0]+18,fr2[1]-7,fr2[0]+24,fr2[1]-10,fr2[0]+8,fr2[1]-10,fr2[0]+4,fr2[1]-7],'#4E4A45');ctx.fillStyle='#3F3B37';ctx.fillRect(fr2[0]+10,fr2[1]-2,6,6);}
      if(b.t==='fish'){ctx.strokeStyle='#4E3C2E';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(fb[0]-22,fb[1]-8);ctx.lineTo(fb[0]-22,fb[1]-26);ctx.moveTo(fb[0]+2,fb[1]+4);ctx.lineTo(fb[0]+2,fb[1]-14);ctx.stroke();ctx.strokeStyle='#6E543D';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(fb[0]-22,fb[1]-24);ctx.lineTo(fb[0]+2,fb[1]-12);ctx.stroke();
        ctx.fillStyle='#B7BCBF';for(let k=1;k<5;k++){const p=lerp([fb[0]-22,fb[1]-24],[fb[0]+2,fb[1]-12],k/5);ctx.beginPath();ctx.moveTo(p[0]-1.5,p[1]);ctx.lineTo(p[0]+1.5,p[1]);ctx.lineTo(p[0],p[1]+9);ctx.closePath();ctx.fill();}
        ctx.strokeStyle='rgba(78,60,46,0.6)';ctx.lineWidth=0.8;ctx.beginPath();for(let k=0;k<5;k++){ctx.moveTo(fr2[0]+2+k*4,fr2[1]-2-k*2);ctx.lineTo(fr2[0]+2+k*4,fr2[1]-14-k*2);}for(let k=0;k<3;k++){ctx.moveTo(fr2[0]+2,fr2[1]-4-k*4);ctx.lineTo(fr2[0]+18,fr2[1]-12-k*4);}ctx.stroke();}
      if(b.t==='berry'){[[fb[0]-12,fb[1]-2],[fb[0]+2,fb[1]-4],[fr2[0]+10,fr2[1]-4]].forEach(q=>{poly([q[0]-6,q[1]-8,q[0]+6,q[1]-8,q[0]+5,q[1],q[0]-5,q[1]],'#A88A69');ctx.strokeStyle='#8A6E52';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(q[0]-6,q[1]-4);ctx.lineTo(q[0]+6,q[1]-4);ctx.stroke();if(!win){ctx.fillStyle='#9E3B3B';ctx.beginPath();ctx.arc(q[0]-2,q[1]-9,2,0,6.3);ctx.arc(q[0]+2,q[1]-10,2,0,6.3);ctx.fill();}});}
      if(b.t==='pres'){barrelC(fb[0]-14,fb[1]-2);barrelC(fb[0]-2,fb[1]+2);barrelC(fr2[0]+10,fr2[1]);ctx.fillStyle='#8E5A4E';[0,7].forEach(o=>{ctx.beginPath();ctx.ellipse(fr2[0]+20+o,fr2[1]-4+o*0.5,3,4,0,0,6.3);ctx.fill();});}
      if(b.t==='ware'){[[fb[0]-18,fb[1]-4],[fb[0]-6,fb[1]+1]].forEach(q=>{poly([q[0]-7,q[1]-7,q[0],q[1]-10.5,q[0]+7,q[1]-7,q[0],q[1]-3.5],'#C9A87A');poly([q[0]-7,q[1]-7,q[0],q[1]-3.5,q[0],q[1]+3.5,q[0]-7,q[1]],'#A88A69');poly([q[0],q[1]-3.5,q[0]+7,q[1]-7,q[0]+7,q[1],q[0],q[1]+3.5],'#8A6E52');});barrelC(fr2[0]+12,fr2[1]);}
    }
  }
  ctx.restore();if(alpha<1)ctx.globalAlpha=1;
}
function drawBadge(b){if(!slotsOf(b))return;if(b.status==='Working'||b.status==='Drawing newcomers'||b.status===''||b.status.indexOf('Resting')===0||b.status.indexOf('Holding')===0||b.status==='Paused')return;
  const e=elev[b.fy*N+b.fx]||2,p=iso(b.fx+b.w/2-0.5,b.fy+b.h/2-0.5);const x=p[0],y=p[1]-e-36;
  ctx.fillStyle=b.status.indexOf('slowly')>=0?'#C9A64A':'#A34A3A';ctx.beginPath();ctx.arc(x,y,7,0,6.3);ctx.fill();ctx.fillStyle='#F3F5F3';ctx.font='bold 10px Inter, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('!',x,y+0.5);}
