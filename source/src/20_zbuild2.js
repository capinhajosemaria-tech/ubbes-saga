/* =================== workshops with their own silhouettes (round huts, open sheds, raised stores, forges) ===================
   Returns true when it drew the building, so the old generic box is skipped. */
function sideFaces(c,ax){return ax?{fa:c.L,fb:c.Bt,ea:c.Bt,eb:c.R}:{fa:c.Bt,fb:c.R,ea:c.L,eb:c.Bt};}
function chopBlock(x,y){ctx.fillStyle='#6E543D';ctx.fillRect(x-4,y-5,8,5);ctx.fillStyle='#D2B98F';ctx.beginPath();ctx.ellipse(x,y-5,4,2,0,0,6.3);ctx.fill();ctx.strokeStyle='#5A4636';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(x,y-5);ctx.lineTo(x+6,y-13);ctx.stroke();poly([x-2,y-5,x+2,y-7,x+3,y-3,x-1,y-2],'#B7BCBF');}
function boatC(x,y,s){s=s||1;poly([x-14*s,y-2*s,x+14*s,y+4*s,x+18*s,y-3*s,x+10*s,y+1*s,x-10*s,y-5*s,x-18*s,y-9*s],'#6E543D');poly([x-14*s,y-2*s,x+14*s,y+4*s,x+12*s,y+7*s,x-12*s,y+1*s],'#4E3C2E');ctx.strokeStyle='#8A6E52';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-12*s,y-4*s);ctx.lineTo(x+12*s,y+2*s);ctx.stroke();}
function dryRack(a,e,h,win){ctx.strokeStyle='#4E3C2E';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(a[0],a[1]-h);ctx.moveTo(e[0],e[1]);ctx.lineTo(e[0],e[1]-h);ctx.stroke();ctx.strokeStyle='#6E543D';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(a[0],a[1]-h+2);ctx.lineTo(e[0],e[1]-h+2);ctx.stroke();
  if(!win){ctx.fillStyle='#B7BCBF';for(let k=1;k<6;k++){const p=lerp([a[0],a[1]-h+2],[e[0],e[1]-h+2],k/6);ctx.beginPath();ctx.moveTo(p[0]-1.6,p[1]);ctx.lineTo(p[0]+1.6,p[1]);ctx.lineTo(p[0],p[1]+9);ctx.closePath();ctx.fill();}}}
function basket(x,y,full){poly([x-5,y-7,x+5,y-7,x+4,y,x-4,y],'#A88A69');ctx.strokeStyle='#8A6E52';ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(x-5,y-4);ctx.lineTo(x+5,y-4);ctx.stroke();if(full){ctx.fillStyle='#9E3B3B';ctx.beginPath();ctx.arc(x-1.5,y-8,1.8,0,6.3);ctx.arc(x+1.8,y-8.5,1.8,0,6.3);ctx.fill();}}
function drawShaped(b,win,c0,ax){
  const t0=b.t,lvl=b.lvl||1;if(b.w===b.h)ax=((b.rot|0)%2)===0;
  switch(t0){
  case 'wood':{/* log hut at the back, open shed with stacked logs in front */
    const hut=subA(c0,ax,0.08,0.55,0.08,0.5);wallsOnly(hut,13,ax,{wt:'logs',wall:'#7A5A3E',wallD:'#5E4430'},win);hipRoof(hut,13,13,ax,{hp:0.2,rt:'shingle',roof:'#6E5A44',roofD:'#584735',ov:2,seed:b.id},win);
    const sh=subA(c0,ax,0.5,0.96,0.12,0.6),done=shedRoof(sh,20,15,{rt:'shingle',roof:'#7A6650',roofD:'#5E4E3E',seed:b.id},win);
    const mid=lerp(sh.L,sh.Bt,0.5);logStack(mid[0]+(ax?-4:10),mid[1]-6,3.2,ax?12:12,3,ax?'x':'y');done();
    const front=subA(c0,ax,0.2,0.9,0.66,0.92);logStack(front.Bt[0]-6,front.Bt[1]-4,3.6,22,3,ax?'x':'y');
    const cb=lerp(front.L,front.T,0.4);chopBlock(cb[0]+4,cb[1]+2);
    return true;}
  case 'carp':{/* open workshop with a planed-plank stack and a saw horse */
    const back=subA(c0,ax,0.08,0.92,0.08,0.4);hall(back,15,12,ax,{wall:'#B08F6A',wallD:'#8E7152',rt:'thatch',roof:'#C2A45E',roofD:'#A68A48',nr:0,door:false},win);
    const sh=subA(c0,ax,0.1,0.9,0.4,0.72),done=shedRoof(sh,17,13,{rt:'thatch',roof:'#C9AC66',roofD:'#A68A48',seed:b.id},win);
    const sx=lerp(sh.L,sh.Bt,0.5);ctx.strokeStyle='#5A4636';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx[0]-8,sx[1]);ctx.lineTo(sx[0]-2,sx[1]-9);ctx.lineTo(sx[0]+4,sx[1]);ctx.moveTo(sx[0]-2,sx[1]-9);ctx.lineTo(sx[0]+14,sx[1]-2);ctx.stroke();done();
    const fb=c0.Bt;for(let k=0;k<4;k++){const y0=fb[1]-4-k*2.6;poly([fb[0]-24,y0-11,fb[0],y0+1,fb[0]+6,y0-2,fb[0]-18,y0-14],k%2?'#D6B88A':'#C4A274');}
    return true;}
  case 'berry':{/* round thatched hut with baskets */
    const c=inset(c0,0.2);roundHut(c.cx-6,c.cy-2,22,13,24,{rt:'thatch',roof:'#C2A45E',roofD:'#A68A48',wall:'#9A7C5E',wallD:'#7C6248'},win);
    const fb=c0.Bt,fr=lerp(c0.Bt,c0.R,0.5);basket(fb[0]-4,fb[1]-6,!win);basket(fb[0]+8,fb[1]-10,!win);basket(fr[0]+4,fr[1]-6,false);
    return true;}
  case 'hunter':{/* round turf hut with hides stretched on frames */
    const c=inset(c0,0.2);roundHut(c.cx-8,c.cy-2,22,12,22,{rt:'turf',wall:'#6A5240',wallD:'#503D2E'},win);
    const fr=lerp(c0.Bt,c0.R,0.45);ctx.strokeStyle='#4E3C2E';ctx.lineWidth=1.6;ctx.strokeRect(fr[0]-2,fr[1]-22,14,16);poly([fr[0],fr[1]-20,fr[0]+10,fr[1]-20,fr[0]+11,fr[1]-8,fr[0]+1,fr[1]-8],'#B48A62');
    const fl=lerp(c0.L,c0.Bt,0.6);ctx.strokeRect(fl[0]-6,fl[1]-24,13,15);poly([fl[0]-4,fl[1]-22,fl[0]+5,fl[1]-22,fl[0]+5,fl[1]-11,fl[0]-4,fl[1]-11],'#9A7458');
    return true;}
  case 'fish':{/* a hut on stilts, drying rack and a boat */
    const hut=subA(c0,ax,0.06,0.5,0.15,0.85);const rh=8;
    ctx.strokeStyle='#4E3C2E';ctx.lineWidth=2.4;ctx.beginPath();for(const q of [hut.L,hut.Bt,hut.R]){ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0],q[1]-rh);}ctx.stroke();
    ctx.save();ctx.translate(0,-rh);hall(hut,12,14,!ax,{wall:'#8C8478',wallD:'#6E675D',rt:'turf',nr:0,door:false},win);ctx.restore();
    const r=subA(c0,ax,0.55,0.95,0.2,0.8);dryRack(r.L,ax?r.Bt:r.R,20,win);
    const fb=lerp(c0.L,c0.Bt,0.5);boatC(fb[0]+6,fb[1]+4,0.8);
    return true;}
  case 'gran':{/* stabbur: a raised storehouse on posts, overhanging upper storey, steep roof */
    const c=subA(c0,ax,0.1,0.58,0.18,0.82),lift=12;
    ctx.strokeStyle='#4E3C2E';ctx.lineWidth=3;ctx.beginPath();for(const q of [c.L,c.Bt,c.R,lerp(c.L,c.Bt,0.5),lerp(c.Bt,c.R,0.5)]){ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0],q[1]-lift);}ctx.stroke();
    for(const q of [c.L,c.Bt,c.R]){poly([q[0]-4,q[1]-lift,q[0]+4,q[1]-lift,q[0]+3,q[1]-lift-3,q[0]-3,q[1]-lift-3],'#857F76');}
    ctx.save();ctx.translate(0,-lift-3);wallsOnly(c,12,ax,{wall:'#A08460',wallD:'#80684B',door:false},win);
    const u=inset(c,-0.1);ctx.translate(0,-11);wallsOnly(u,12,ax,{wall:'#8E7152',wallD:'#6E5740',door:false},win);
    const r=hall(u,12,28,!ax,{wall:'#8E7152',wallD:'#6E5740',rt:'thatch',roof:'#C2A45E',roofD:'#A68A48',door:false},win);ctx.restore();
    gableX(up(r.M2,r.H+lift+14),'#5C4634',0.8);const sk=subA(c0,ax,0.64,0.95,0.3,0.85);for(let k=0;k<5;k++){const p=lerp(sk.T,sk.Bt,0.25+0.12*k),x=p[0]+(k%2)*8,y=p[1]-(k>2?6:0);ctx.fillStyle=k%2?'#C9B48E':'#D8C7A0';ctx.beginPath();ctx.ellipse(x,y-4,6,4.5,0,0,6.3);ctx.fill();ctx.strokeStyle='rgba(110,84,61,0.6)';ctx.lineWidth=0.8;ctx.stroke();}
    const d=ax?lerp(c.Bt,c.R,0.5):lerp(c.L,c.Bt,0.5);ctx.strokeStyle='#6E543D';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(d[0]-12,d[1]+6);ctx.lineTo(d[0]-2,d[1]-lift-2);ctx.moveTo(d[0]-7,d[1]+7);ctx.lineTo(d[0]+3,d[1]-lift-1);ctx.stroke();
    return true;}
  case 'smith':{/* stone forge with a big chimney and an open front where the anvil glows */
    const c=subA(c0,ax,0.08,0.62,0.1,0.6);wallsOnly(c,15,ax,{wt:'stone',wall:'#7D776E',wallD:'#625D56'},win);const r=hipRoof(c,15,14,ax,{hp:0.2,rt:'shingle',roof:'#4A4540',roofD:'#3A3632',ov:2,seed:b.id},win);
    const ch=lerp(r.rb,r.rf,0.3);poly([ch[0]-6,ch[1]+8,ch[0]+6,ch[1]+8,ch[0]+6,ch[1]-14,ch[0]-6,ch[1]-14],win?'#9EA09C':'#6C665E');poly([ch[0],ch[1]+8,ch[0]+6,ch[1]+8,ch[0]+6,ch[1]-14,ch[0],ch[1]-14],win?'#8A8C88':'#57524B');poly([ch[0]-7,ch[1]-14,ch[0]+7,ch[1]-14,ch[0]+7,ch[1]-17,ch[0]-7,ch[1]-17],'#3E3A36');
    const sh=subA(c0,ax,0.45,0.95,0.45,0.92),done=shedRoof(sh,15,12,{rt:'shingle',roof:'#5E5850',roofD:'#4A4540',seed:b.id},win);
    const g=[sh.cx,sh.cy];if(!win){ctx.fillStyle='rgba(255,170,90,0.35)';ctx.beginPath();ctx.ellipse(g[0],g[1]-4,18,9,0,0,6.3);ctx.fill();}
    poly([g[0]-8,g[1]-2,g[0]+6,g[1]-2,g[0]+4,g[1]-6,g[0]+10,g[1]-9,g[0]-6,g[1]-9,g[0]-10,g[1]-6],'#3F3B37');ctx.fillStyle='#4E4A45';ctx.fillRect(g[0]-3,g[1]-2,5,6);
    if(!win){ctx.fillStyle='#F07A30';ctx.beginPath();ctx.arc(g[0]-12,g[1]+2,2.4,0,6.3);ctx.fill();}done();
    return true;}
  case 'ware':{/* long low store, hipped shingle roof, wide loading door, crates */
    const c=subA(c0,ax,0.04,0.96,0.1,0.75);wallsOnly(c,16,ax,{wall:'#6E543D',wallD:'#54402E',door:false},win);
    const s=sideFaces(c,ax),d=lerp(s.fa,s.fb,0.5);poly([d[0]-10,d[1]-1,d[0]+10,d[1]+4,d[0]+10,d[1]-11,d[0]-10,d[1]-16],'#3E3028');ctx.strokeStyle='#8A6E52';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(d[0]-10,d[1]-16);ctx.lineTo(d[0]+10,d[1]-1);ctx.moveTo(d[0]-10,d[1]-1);ctx.lineTo(d[0]+10,d[1]-11);ctx.stroke();
    hipRoof(c,16,16,ax,{hp:0.12,rt:'shingle',roof:'#5E5850',roofD:'#4A4540',ov:3,seed:b.id},win);
    const fb=c0.Bt;[[fb[0]-20,fb[1]-4],[fb[0]-8,fb[1]+1]].forEach(q=>{poly([q[0]-7,q[1]-7,q[0],q[1]-10.5,q[0]+7,q[1]-7,q[0],q[1]-3.5],'#C9A87A');poly([q[0]-7,q[1]-7,q[0],q[1]-3.5,q[0],q[1]+3.5,q[0]-7,q[1]],'#A88A69');poly([q[0],q[1]-3.5,q[0]+7,q[1]-7,q[0]+7,q[1],q[0],q[1]+3.5],'#8A6E52');});barrelC(fb[0]+14,fb[1]-2);
    return true;}
  case 'jarl':{/* a smaller bowed longhouse with dragon heads, the second-finest hall */
    const c=subA(c0,ax,0.05,0.95,0.2,0.8);wallsOnly(c,20,ax,{wall:'#6E4A36',wallD:'#553826'},win);
    const s=sideFaces(c,ax);shieldRow(lerp(s.fa,s.fb,0.1),lerp(s.fa,s.fb,0.9),11,5,['#A34A3A','#D7CDB4']);
    const r=hipRoof(c,20,26,ax,{hp:0.16,sag:10,bow:5,rt:'turf',ov:3,seed:b.id},win);dragonHead(r.rf,ax?1:-1,'#8E3B2F',1.1);dragonHead(r.rb,ax?-1:1,'#8E3B2F',1.1);
    const p=lerp(c0.L,c0.Bt,0.95);bannerPole(p[0]+6,p[1]+4,40,'#A34A3A');
    return true;}
  case 'pres':{/* half-sunk turf store: roof almost to the ground, barrels and hanging sausages */
    const c=subA(c0,ax,0.1,0.9,0.12,0.7);wallsOnly(c,6,ax,{wt:'stone',wall:'#8A8378',wallD:'#6E675D'},win);hipRoof(c,6,22,ax,{hp:0.3,rt:'turf',ov:4,seed:b.id},win);
    const fb=c0.Bt,fr2=lerp(c0.Bt,c0.R,0.5);barrelC(fb[0]-14,fb[1]-2);barrelC(fb[0]-2,fb[1]+2);barrelC(fr2[0]+10,fr2[1]);
    return true;}
  case 'smoke':{/* tall narrow smokehouse with a louvred ridge */
    const c=subA(c0,ax,0.2,0.8,0.18,0.72);wallsOnly(c,20,ax,{wt:'logs',wall:'#4E3E32',wallD:'#3C3026'},win);const r=hipRoof(c,20,20,ax,{hp:0.35,rt:'shingle',roof:'#5A5048',roofD:'#463E38',ov:2,seed:b.id},win);
    const m=lerp(r.rb,r.rf,0.5);poly([m[0]-8,m[1]+3,m[0]+8,m[1]+3,m[0]+6,m[1]-5,m[0]-6,m[1]-5],'#3C3026');poly([m[0]-9,m[1]-5,m[0],m[1]-10,m[0]+9,m[1]-5],'#5A5048');
    if(!win){ctx.fillStyle='rgba(235,235,230,0.5)';for(let k=0;k<3;k++){const ph=(t*0.5+k/3)%1;ctx.beginPath();ctx.arc(m[0]+Math.sin(ph*5+k)*3,m[1]-12-ph*18,2.5+ph*3,0,6.3);ctx.fill();}}
    return true;}
  }
  return false;
}
