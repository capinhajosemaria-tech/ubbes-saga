/* =================== Town Hall: drawn from shapes, grows with its level =================== */
/* sub-rectangle of a footprint in (u along iso x, v along iso y), 0..1 */
function subc(c,u0,u1,v0,v1){const pt=(u,v)=>[c.T[0]+u*(c.R[0]-c.T[0])+v*(c.L[0]-c.T[0]),c.T[1]+u*(c.R[1]-c.T[1])+v*(c.L[1]-c.T[1])];
  const r={T:pt(u0,v0),R:pt(u1,v0),Bt:pt(u1,v1),L:pt(u0,v1)};r.cx=(r.T[0]+r.Bt[0])/2;r.cy=(r.T[1]+r.Bt[1])/2;return r;}
/* rotate the (u,v) frame so the hall can face either way: when !alongX swap u and v */
function subA(c,alongX,a0,a1,b0,b1){return alongX?subc(c,a0,a1,b0,b1):subc(c,b0,b1,a0,a1);}
function shieldRow(a,b2,y,n,cols){for(let k=0;k<n;k++){const p=lerp(a,b2,(k+0.5)/n);ctx.fillStyle=cols[k%cols.length];ctx.beginPath();ctx.ellipse(p[0],p[1]-y,5.6,6.2,0,0,6.3);ctx.fill();ctx.strokeStyle='rgba(40,30,22,0.6)';ctx.lineWidth=0.8;ctx.stroke();ctx.fillStyle='#C9C2B2';ctx.beginPath();ctx.arc(p[0],p[1]-y,1.2,0,6.3);ctx.fill();}}
function bannerPole(x,y,h,col){ctx.strokeStyle='#4E3C2E';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-h);ctx.stroke();const w=Math.sin(t*2.4+x)*1.5;poly([x,y-h+1,x+13,y-h+3+w,x+12,y-h+16+w,x,y-h+13],col);poly([x+3,y-h+6,x+9,y-h+7+w,x+6,y-h+11+w],'#E9E2D0');}
function porchPosts(a,b2,h,col){ctx.strokeStyle=col||'#4E3C2E';ctx.lineWidth=2.6;ctx.beginPath();for(const q of [a,b2]){ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0],q[1]-h);}ctx.stroke();}
let THV=1;/* chosen Town Hall design (1..3); 0 = the old picture */
function drawTownHall(b,win){const L=thLevel(),hb=thHallRect(b),c=fp(hb),ax=((b.rot|0)%2)===0;
  const lv=k=>k[Math.min(L,k.length)-1];
  if(THV===1)thGreatHall(c,ax,L,lv,win);else if(THV===2)thWings(c,ax,L,lv,win);else thStave(c,ax,L,lv,win);
}
/* A: the great hall — long bowed longhouse with hipped turf roof, a raised middle roof from level 3, a porch and dragon heads */
function thGreatHall(c,ax,L,lv,win){
  const wh=lv([30,32,33,35,36]),rh=lv([40,43,46,49,52]);
  const body=subA(c,ax,0.02,0.98,0.16,0.84);
  /* side annex (lean-to) along the back from level 2 */
  if(L>=2){const an=subA(c,ax,0.15,0.6,0.06,0.24);wallsOnly(an,15,ax,{wall:'#6E543D',wallD:'#54402E',door:false},win);hipRoof(an,15,12,ax,{hp:0.15,rt:'turf',ov:2,seed:5},win);}
  wallsOnly(body,wh,ax,{wall:'#7A5638',wallD:'#5C3F28',door:false},win);
  /* carved wall boards: dark posts every few planks */
  const fa=ax?body.L:body.Bt,fb=ax?body.Bt:body.R;
  ctx.strokeStyle='rgba(40,28,18,0.6)';ctx.lineWidth=1.6;ctx.beginPath();for(let k=1;k<7;k++){const p=lerp(fa,fb,k/7);ctx.moveTo(p[0],p[1]-3);ctx.lineTo(p[0],p[1]-wh);}ctx.stroke();
  shieldRow(lerp(fa,fb,0.08),lerp(fa,fb,0.92),wh*0.55,6,L>=3?['#A34A3A','#D7CDB4','#C9A64A']:['#A34A3A','#D7CDB4']);
  const r=hipRoof(body,wh,rh,ax,{hp:0.16,sag:L>=2?16:13,bow:7,rt:L>=4?'shingle':'turf',ov:4,seed:11},win);
  /* raised middle roof: a louvred band standing on the main roof, its own hipped roof on top, drawn on the main roof plane so it grows out of it */
  if(L>=3){const u0=0.3,u1=0.7,v0=0.6,hw=L>=5?13:11,rise=12,lift=(p,h)=>[p[0],p[1]-h];
    const E=u=>r.at(u,v0),Rr=u=>r.ridge(u),K=12,us=[...Array(K+1)].map((_,k)=>u0+(u1-u0)*k/K);
    /* band: front face and the end face toward the viewer */
    poly([].concat(...us.map(u=>E(u)),...us.slice().reverse().map(u=>lift(E(u),hw))),win?'#C9CCC8':'#4E3626');
    poly([].concat(E(u1),lift(E(u1),hw),lift(Rr(u1),hw),Rr(u1)),win?'#BFC3BF':'#3E2A1C');
    if(!win){ctx.strokeStyle='rgba(20,14,10,0.55)';ctx.lineWidth=1.4;ctx.beginPath();for(let k=1;k<K;k++){const p=E(us[k]);ctx.moveTo(p[0],p[1]-2);ctx.lineTo(p[0],p[1]-hw+2);}ctx.stroke();
      ctx.fillStyle='rgba(255,200,120,0.35)';for(let k=2;k<K-1;k+=3){const p=E(us[k]);ctx.fillRect(p[0]-2,p[1]-hw+3,4,hw-6);}}
    const Eu=u=>lift(E(u),hw),Ru=u=>lift(Rr(u),hw+rise),ue0=u0+0.07,ue1=u1-0.07;
    const ru=[...Array(K+1)].map((_,k)=>ue0+(ue1-ue0)*k/K);
    poly([].concat(lift(Rr(u0),hw),Eu(u0),Ru(ue0)),r.RD);/* back/left hip */
    poly([].concat(Eu(u1),lift(Rr(u1),hw),Ru(ue1)),win?'#DCE2E1':r.RD);/* right hip */
    poly([].concat(...us.map(u=>Eu(u)),...ru.slice().reverse().map(u=>Ru(u))),r.RL);
    roofTex((a,b2)=>lerp(Eu(u0+(u1-u0)*a),Ru(ue0+(ue1-ue0)*a),b2),L>=4?'shingle':'turf',win,17);
    ctx.strokeStyle='rgba(60,46,34,0.85)';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(Ru(ue0)[0],Ru(ue0)[1]);for(const u of ru)ctx.lineTo(Ru(u)[0],Ru(u)[1]);ctx.stroke();
    ctx.strokeStyle='rgba(30,22,16,0.4)';ctx.lineWidth=1.2;ctx.beginPath();for(const u of us){const p=Eu(u);u===u0?ctx.moveTo(p[0],p[1]+1):ctx.lineTo(p[0],p[1]+1);}ctx.stroke();
    dragonHead(Ru(ue1),ax?1:-1,L>=4?'#C9A64A':'#4E3C2E',0.8);}
  dragonHead(r.rf,ax?1:-1,L>=4?'#C9A64A':'#4E3C2E',1.6);dragonHead(r.rb,ax?-1:1,L>=4?'#C9A64A':'#4E3C2E',1.6);
  /* porch over the door on the front long side */
  const pc=subA(c,ax,0.4,0.6,0.78,1.0),pd=lerp(fa,fb,0.5);
  poly([pd[0]-6,pd[1]+1,pd[0]+6,pd[1]+4,pd[0]+6,pd[1]-wh*0.8+4,pd[0]-6,pd[1]-wh*0.8],'#2E241E');
  porchPosts(pc.L,ax?pc.Bt:pc.Bt,wh-6);if(!ax)porchPosts(pc.R,pc.Bt,wh-6);
  {const pr=hall(pc,wh-6,20,!ax,{wall:'#7A5638',wallD:'#5C3F28',rt:L>=4?'shingle':'turf',roof:L>=4?'#5E5850':'#7F9568',roofD:L>=4?'#4A4540':'#6B8058',door:false,nr:0,barge:L>=4?'#C9A64A':'#4E3C2E'},win);gableX(up(pr.M2,pr.H),L>=4?'#C9A64A':'#4E3C2E',1);}
  /* torches */
  if(L>=2){for(const q of [lerp(fa,fb,0.3),lerp(fa,fb,0.7)]){ctx.fillStyle='rgba(255,197,107,0.3)';ctx.beginPath();ctx.ellipse(q[0],q[1]-wh*0.8,7,5,0,0,6.3);ctx.fill();if(!win){ctx.fillStyle='#F0A040';ctx.beginPath();ctx.moveTo(q[0]-2,q[1]-wh*0.7);ctx.quadraticCurveTo(q[0],q[1]-wh*0.7-8-Math.sin(t*7+q[0])*1.5,q[0]+2,q[1]-wh*0.7);ctx.fill();}}}
  if(L>=2){const p=ax?c.L:c.R;bannerPole(p[0]+(ax?10:-22),p[1]-4,44+L*3,'#A34A3A');}
  if(L>=4){const p=ax?c.R:c.L;bannerPole(p[0]+(ax?-22:10),p[1]-2,48+L*3,'#5E7F8C');}
}
/* B: hall with a cross wing and a watch tower — asymmetric, reads as a compound */
function thWings(c,ax,L,lv,win){
  const wh=lv([26,27,28,30,31]),rh=lv([34,36,38,41,44]);
  const back=subA(c,ax,0.04,0.96,0.08,0.5);
  const wing=subA(c,ax,0.5,0.9,0.3,0.95);
  const tw=subA(c,ax,0.06,0.3,0.55,0.8);
  /* tower behind-left first when it sits further back than the wing */
  hall(back,wh,rh,ax,{wall:'#7A5638',wallD:'#5C3F28',rt:L>=4?'shingle':'turf',roof:L>=4?'#5E5850':undefined,roofD:L>=4?'#4A4540':undefined,door:false},win);
  {const m=up(lerp(ax?back.Bt:back.L,back.R,0.5),wh+rh);}
  if(L>=2){const th=lv([0,66,74,82,90]);wallsOnly(tw,th,ax,{wt:'logs',wall:'#6E543D',wallD:'#54402E',door:false},win);
    /* lookout gallery */ctx.save();ctx.translate(0,-th);poly(P(tw.L,tw.Bt,tw.R,[tw.R[0]+2,tw.R[1]+3],[tw.Bt[0],tw.Bt[1]+4],[tw.L[0]-2,tw.L[1]+3]),'#4E3C2E');
    hipRoof(tw,5,24,ax,{hp:0.5,rt:'shingle',ov:5,seed:3},win);ctx.restore();
    const tp=up([tw.cx,tw.cy],th+29);ctx.strokeStyle='#4E3C2E';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(tp[0],tp[1]);ctx.lineTo(tp[0],tp[1]-10);ctx.stroke();poly([tp[0],tp[1]-10,tp[0]+10,tp[1]-7,tp[0],tp[1]-4],'#A34A3A');}
  const r=hall(wing,wh+2,rh+4,!ax,{wall:'#8A6446',wallD:'#6A4A32',rt:L>=4?'shingle':'turf',roof:L>=4?'#5E5850':undefined,roofD:L>=4?'#4A4540':undefined,barge:L>=3?'#C9A64A':'#4E3C2E'},win);
  const fa=ax?wing.Bt:wing.L,fb=ax?wing.R:wing.Bt;
  shieldRow(ax?wing.L:wing.Bt,ax?wing.Bt:wing.R,(wh+2)*0.55,3,['#A34A3A','#D7CDB4']);
  if(L>=3)gableX(up(r.M2,r.H),'#C9A64A',1.1);
  if(L>=2){const p=ax?c.L:c.R;bannerPole(p[0]+(ax?10:-22),p[1]-4,44+L*3,'#A34A3A');}
}
/* C: stave hall — a tall central hall with a low gallery roof all round and stacked roof tiers */
function thStave(c,ax,L,lv,win){
  const tiers=lv([1,1,2,2,3]),wh=lv([22,23,22,23,22]);
  const base=subA(c,ax,0.06,0.94,0.14,0.86),core=subA(c,ax,0.18,0.82,0.28,0.72);
  /* gallery (svalgang): low walls + skirt roof */
  wallsOnly(base,16,ax,{wall:'#7A5638',wallD:'#5C3F28',door:false},win);
  hipRoof(base,16,14,ax,{hp:0.12,rt:'tar',ov:3,seed:2},win);
  let y=16+14-4,cc=core,k=0;
  ctx.save();
  for(;k<tiers;k++){ctx.translate(0,-(k===0?y:wh*0.6));
    wallsOnly(cc,wh,ax,{wall:'#6A4A32',wallD:'#503726',door:false},win);
    const last=k===tiers-1,r=hipRoof(cc,wh,last?38:13,ax,{hp:last?0.08:0.1,rt:'tar',ov:3,seed:7+k},win);
    if(last){dragonHead(r.rf,ax?1:-1,'#C9A64A',1.5);dragonHead(r.rb,ax?-1:1,'#C9A64A',1.5);gableX(r.rf,'#4E3C2E',0.9);
      if(L>=4){const m=r.ridge(0.5);ctx.strokeStyle='#3A3430';ctx.lineWidth=2;poly([m[0]-4,m[1]+2,m[0]+4,m[1]+2,m[0]+3,m[1]-10,m[0]-3,m[1]-10],'#3A322C');poly([m[0]-5,m[1]-10,m[0],m[1]-24,m[0]+5,m[1]-10],'#4A4038');ctx.strokeStyle='#C9A64A';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(m[0],m[1]-24);ctx.lineTo(m[0],m[1]-30);ctx.stroke();}}
    else{ctx.translate(0,-13);cc=subA(cc,ax,0.1,0.9,0.12,0.88);}
  }
  ctx.restore();
  const fa=ax?base.L:base.Bt,fb=ax?base.Bt:base.R,pd=lerp(fa,fb,0.5);
  poly([pd[0]-6,pd[1]+1,pd[0]+6,pd[1]+4,pd[0]+6,pd[1]-22,pd[0]-6,pd[1]-25],'#2E241E');
  ctx.strokeStyle='#C9A64A';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(pd[0]-7,pd[1]-15);ctx.quadraticCurveTo(pd[0],pd[1]-22,pd[0]+7,pd[1]-12);ctx.stroke();
  if(L>=2){const p=ax?c.L:c.R;bannerPole(p[0]+(ax?10:-22),p[1]-4,44+L*3,'#A34A3A');}
}
