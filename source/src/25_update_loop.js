/* =================== update loop =================== */
let dayAcc=0;
function update(dt){
  const gdt=dt*speed;const prevWin=isWinter();S.gameT+=gdt;dayAcc+=gdt;
  let guard=0;while(dayAcc>=DAY&&guard<8){dayAcc-=DAY;dayTick();guard++;}
  if(prevWin!==isWinter()){toast(isWinter()?'Winter has come. Rivers freeze and the berry slopes rest.':'Summer returns. The bushes bear fruit again.',3600);}
  for(const w of walkers){if(speed===0){w.moving=false;continue;}if(w.wait>0){w.wait-=gdt;w.moving=false;continue;}
    const dx=w.tx-w.x,dy=w.ty-w.y,dist=Math.hypot(dx,dy);if(dist<0.05){w.wait=1+Math.random()*3;pickTarget(w);w.moving=false;continue;}
    const st=Math.min(dist,0.7*gdt),nx=w.x+dx/dist*st,ny=w.y+dy/dist*st;if(walkable(Math.round(nx),Math.round(ny))){w.x=nx;w.y=ny;}else pickTarget(w);w.moving=true;w.ph+=gdt;}
  smokeTimer-=dt;if(smokeTimer<=0&&speed>0){smokeTimer=0.3;for(const s of smokeSources())smoke.push({x:s[0]+(Math.random()-0.5)*3,y:s[1],r:2.5,a:0.9,life:0});}
  for(let i=smoke.length-1;i>=0;i--){const p=smoke[i];p.life+=dt;p.y-=14*dt;p.x+=5*dt*Math.sin(p.life*1.3);p.r+=3*dt;p.a=Math.max(0,0.9-p.life/3.2);if(p.a<=0)smoke.splice(i,1);}
  if(isWinter())for(const f of flakes){f.y+=f.v*dt/H;f.p+=dt;if(f.y>1){f.y=0;f.x=Math.random();}}
}
