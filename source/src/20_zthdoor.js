/* =================== PROTOTYPE: Town Hall entrance variants (THDV 0 = current porch, 1..6) =================== */
let THDV=0;window.__setTHD=v=>{THDV=v;};
function thEntrance(v,fa,fb,wh,L,win,ax){
  const len=Math.hypot(fb[0]-fa[0],fb[1]-fa[1]),sm=0.5,S=d=>d/len;
  const out=ax?[-HW,HH]:[HW,HH];/* one tile outward from the front wall */
  const F=(s,h,o)=>{o=o||0;return [fa[0]+(fb[0]-fa[0])*s+out[0]*o,fa[1]+(fb[1]-fa[1])*s-h+out[1]*o];};
  const gold=L>=4?'#D4AE52':'#B8923E',goldD='#8E6A28',iron='#26221F',wood='#5E3F28',woodL='#7A5638',woodD='#3E2A1C',frame='#4A3220',red='#9E3B2E',ochre='#C99A3E',teal='#4E7480';
  const shp=(pts,fill)=>poly([].concat(...pts),fill);
  const ln=(pts,col,w)=>{ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();};
  /* arched outline, left foot -> over the top -> right foot */
  const archPts=(hw,h0,ah,o,n)=>{n=n||14;const p=[F(sm-hw,0,o)];for(let k=0;k<=n;k++){const a=Math.PI*k/n;p.push(F(sm-hw*Math.cos(a),h0+ah*Math.sin(a),o));}p.push(F(sm+hw,0,o));return p;};
  const topH=(s,hw,h0,ah)=>{const x=(s-sm)/hw;return h0+ah*Math.sqrt(Math.max(0,1-x*x));};
  /* a big double door: planks, centre seam, hinges, rings, threshold */
  const door=(o,opt)=>{const hw=S(opt.w/2),h0=opt.h0,ah=opt.ah||0;
    /* threshold stone(s) */
    const st=(k,dw)=>{const a=F(sm-hw-S(dw),-1.5*k,o+0.04+0.1*k),b=F(sm+hw+S(dw),-1.5*k,o+0.04+0.1*k);shp([a,b,[b[0],b[1]+2.2],[a[0],a[1]+2.2]],k?'#7D776E':'#9A948A');};
    st(0,3);if(opt.steps)st(1,6);
    /* frame: a wider arch in carved timber */
    const fw=opt.frame||3;if(fw){shp(archPts(hw+S(fw),h0+fw*0.6,ah+fw*0.6,o),frame);}
    shp(archPts(hw,h0,ah,o),opt.col||wood);
    /* plank seams (thin) */
    const np=opt.planks||8;ctx.strokeStyle='rgba(20,12,8,0.45)';ctx.lineWidth=0.55;ctx.beginPath();
    for(let k=1;k<np;k++){const s=sm-hw+2*hw*k/np,h=topH(s,hw,h0,ah);const a=F(s,0.5,o),b=F(s,h-0.5,o);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);}ctx.stroke();
    /* every other plank a touch lighter */
    ctx.fillStyle='rgba(255,220,170,0.07)';for(let k=0;k<np;k+=2){const s0=sm-hw+2*hw*k/np,s1=sm-hw+2*hw*(k+1)/np;const p=[F(s0,0.5,o),F(s1,0.5,o),F(s1,topH(s1,hw,h0,ah)-0.5,o),F(s0,topH(s0,hw,h0,ah)-0.5,o)];shp(p,ctx.fillStyle);}
    ln([F(sm,0,o),F(sm,h0+ah,o)],'rgba(10,6,4,0.8)',1);
    if(opt.diamond){ctx.strokeStyle='rgba(20,12,8,0.5)';ctx.lineWidth=0.6;ctx.beginPath();for(const side of [-1,1])for(let k=0;k<3;k++){const y0=4+k*7,a=F(sm+side*hw*0.05,y0,o),b=F(sm+side*hw*0.95,y0+3.5,o),c2=F(sm+side*hw*0.05,y0+7,o);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(c2[0],c2[1]);}ctx.stroke();}
    /* iron strap hinges with scrolled ends and studs */
    const hs=opt.hinges||2,hwid=opt.heavy?1.8:1.1;
    for(const side of [-1,1])for(let k=0;k<hs;k++){const y=hs===1?h0*0.5:4+k*(h0-6)/(hs-1);const a=F(sm+side*hw*0.97,y,o),b=F(sm+side*hw*0.22,y,o);
      ln([a,b],iron,hwid);ctx.strokeStyle=iron;ctx.lineWidth=hwid*0.7;ctx.beginPath();ctx.arc(b[0]+side*1.6,b[1]-1.2,1.6,0,4.8);ctx.stroke();ctx.beginPath();ctx.arc(b[0]+side*1.6,b[1]+1.2,1.6,1.5,6.3);ctx.stroke();
      if(opt.heavy){ctx.fillStyle='#4A4440';for(let j=1;j<5;j++){const p=lerp(a,b,j/5);ctx.beginPath();ctx.arc(p[0],p[1],0.7,0,6.3);ctx.fill();}}}
    if(opt.studs){ctx.fillStyle='rgba(60,54,50,0.9)';for(let i=0;i<6;i++)for(let j=0;j<4;j++){const s=sm-hw+2*hw*(i+0.5)/6,y=3+j*(h0-4)/4;const p=F(s,y,o);ctx.beginPath();ctx.arc(p[0],p[1],0.5,0,6.3);ctx.fill();}}
    /* ring handles */
    for(const side of [-1,1]){const p=F(sm+side*S(2.6),h0*0.45,o);ctx.strokeStyle=opt.ringGold?gold:'#3A3430';ctx.lineWidth=opt.bigRing?1.1:0.8;ctx.beginPath();ctx.ellipse(p[0],p[1]+1.6,opt.bigRing?2.6:1.8,opt.bigRing?2.8:2,0,0,6.3);ctx.stroke();ctx.fillStyle=opt.ringGold?gold:'#3A3430';ctx.beginPath();ctx.arc(p[0],p[1]-0.6,0.9,0,6.3);ctx.fill();}
    return {hw,h0,ah};};
  /* carved interlace along an arch: two thin gold ribbons weaving */
  const interlace=(hw,h0,ah,o,col,amp)=>{amp=amp||1.4;const n=40;for(const ph of [0,Math.PI]){ctx.strokeStyle=col;ctx.lineWidth=0.7;ctx.beginPath();
      for(let k=0;k<=n;k++){const t2=k/n;/* walk up the left jamb, over the arch, down the right jamb */
        let s,h;const per=h0*2+Math.PI*hw*len;const d=t2*per;
        if(d<h0){s=sm-hw;h=d;}else if(d<h0+Math.PI*hw*len){const a=(d-h0)/(hw*len);s=sm-hw*Math.cos(a);h=h0+ah*Math.sin(a);}else{s=sm+hw;h=h0-(d-h0-Math.PI*hw*len);}
        const w=Math.sin(t2*28+ph)*amp;const p=F(s,h,o);const q=[p[0]-(s<sm?w:-w)*0.6,p[1]-(s===sm-hw||s===sm+hw?0:w)];k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();}};
  const post=(s,h,o,col,w)=>{const a=F(s-S(w/2),0,o),b=F(s+S(w/2),0,o);shp([a,b,[b[0],b[1]-h],[a[0],a[1]-h]],col);
    /* spiral carving */ctx.strokeStyle='rgba(20,12,8,0.5)';ctx.lineWidth=0.5;ctx.beginPath();for(let y=2;y<h-2;y+=2.6){ctx.moveTo(a[0],a[1]-y);ctx.lineTo(b[0],b[1]-y-1.6);}ctx.stroke();};
  const torch=(s,h,o)=>{const p=F(s,h,o);ln([[p[0],p[1]+5],[p[0],p[1]-1]],iron,1.2);ln([[p[0]-2,p[1]-1],[p[0]+2,p[1]-1]],iron,1);ctx.fillStyle='rgba(255,197,107,0.28)';ctx.beginPath();ctx.ellipse(p[0],p[1]-4,6,5,0,0,6.3);ctx.fill();
    if(!win){ctx.fillStyle='#F0A040';ctx.beginPath();ctx.moveTo(p[0]-1.8,p[1]-1);ctx.quadraticCurveTo(p[0],p[1]-9-Math.sin(t*7+p[0])*1.4,p[0]+1.8,p[1]-1);ctx.fill();ctx.fillStyle='#FFE09A';ctx.beginPath();ctx.ellipse(p[0],p[1]-3,0.8,1.6,0,0,6.3);ctx.fill();}};
  const antlers=(p,sz,col)=>{ctx.strokeStyle=col;ctx.lineWidth=1.3;ctx.lineCap='round';ctx.beginPath();for(const sd of [-1,1]){ctx.moveTo(p[0],p[1]);ctx.quadraticCurveTo(p[0]+sd*sz*0.5,p[1]-sz*0.3,p[0]+sd*sz,p[1]-sz*0.9);
      for(let k=1;k<4;k++){const f=k/4,bx=p[0]+sd*sz*(0.25+0.6*f),by=p[1]-sz*(0.15+0.62*f);ctx.moveTo(bx,by);ctx.lineTo(bx+sd*sz*0.08,by-sz*0.32);}}ctx.stroke();ctx.lineCap='butt';};
  const runes=(s0,s1,h,o,col)=>{ctx.strokeStyle=col;ctx.lineWidth=0.6;ctx.beginPath();const n=Math.round((s1-s0)*len/3.2);for(let k=0;k<n;k++){const s=s0+(s1-s0)*(k+0.5)/n,a=F(s,h-1.6,o),b=F(s,h+1.6,o);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);const kk=k%4;if(kk===0){ctx.moveTo(b[0],b[1]);ctx.lineTo(b[0]+1.2,b[1]+1.2);}else if(kk===1){ctx.moveTo(a[0],a[1]+1.5);ctx.lineTo(a[0]+1.3,a[1]+0.3);}else if(kk===2){ctx.moveTo(b[0],b[1]+1);ctx.lineTo(b[0]+1.2,b[1]+2.4);ctx.lineTo(b[0],b[1]+2.4);}}ctx.stroke();};
  const zig=(s0,s1,h,hh,o,c1,c2)=>{const a=F(s0,h,o),b=F(s1,h,o);shp([a,b,[b[0],b[1]-hh],[a[0],a[1]-hh]],c1);ctx.fillStyle=c2;const n=Math.round((s1-s0)*len/4);ctx.beginPath();for(let k=0;k<n;k++){const p=F(s0+(s1-s0)*k/n,h,o),q=F(s0+(s1-s0)*(k+0.5)/n,h+hh,o),r2=F(s0+(s1-s0)*(k+1)/n,h,o);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.lineTo(r2[0],r2[1]);ctx.closePath();}ctx.fill();};
  /* gabled canopy sticking out from the wall over the door */
  const canopy=(hw,hE,hR,o0,o1,roofL,roofD,barge)=>{
    shp([F(sm-hw,hE,o0),F(sm,hR,o0),F(sm,hR,o1),F(sm-hw,hE,o1)],ax?roofD:roofL);
    shp([F(sm+hw,hE,o0),F(sm,hR,o0),F(sm,hR,o1),F(sm+hw,hE,o1)],ax?roofL:roofD);
    shp([F(sm-hw,hE,o1),F(sm,hR,o1),F(sm+hw,hE,o1)],woodD);
    /* gable boards: fine vertical boards and a carved, scalloped bargeboard */
    ctx.strokeStyle='rgba(0,0,0,0.35)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=1;k<8;k++){const s=sm-hw+2*hw*k/8,hh=hE+(hR-hE)*(1-Math.abs(s-sm)/hw);const a=F(s,hE,o1),b=F(s,hh,o1);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);}ctx.stroke();
    for(const sd of [-1,1]){const a=F(sm+sd*(hw+S(2)),hE-1.5,o1),b=F(sm,hR+1.5,o1);ln([a,b],barge,1.6);ctx.fillStyle=barge;for(let k=1;k<6;k++){const p=lerp(a,b,k/6);ctx.beginPath();ctx.arc(p[0],p[1]+1.6,0.9,0,3.2);ctx.fill();}}
    gableX(F(sm,hR,o1),barge,0.8);};
  /* wall: fine board seams and a sill/plate beam across the whole front (shared by every option) */
  {ctx.strokeStyle='rgba(20,12,8,0.28)';ctx.lineWidth=0.5;ctx.beginPath();const nb=Math.round(len/3.4);for(let k=1;k<nb;k++){const a=F(k/nb,3),b=F(k/nb,wh-3);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);}ctx.stroke();
    shp([F(0,3),F(1,3),F(1,5),F(0,5)],'rgba(30,20,12,0.45)');shp([F(0,wh-4),F(1,wh-4),F(1,wh-1.5),F(0,wh-1.5)],'rgba(30,20,12,0.4)');}
  if(v===1){/* Urnes portal: tall arched doors in a deep carved frame, gold interlace, carved jambs */
    const d=door(0,{w:24,h0:18,ah:10,frame:4.5,hinges:3,ringGold:1,bigRing:1,planks:8});
    interlace(d.hw+S(2.3),d.h0+1.5,d.ah+1.8,0,gold,1.3);
    post(sm-d.hw-S(7),wh-5,0,woodD,4);post(sm+d.hw+S(7),wh-5,0,woodD,4);
    const tp=F(sm,d.h0+d.ah+6);ctx.strokeStyle=gold;ctx.lineWidth=0.8;ctx.beginPath();ctx.arc(tp[0],tp[1],2.6,0,6.3);ctx.moveTo(tp[0]-6,tp[1]+1);ctx.quadraticCurveTo(tp[0]-3,tp[1]-5,tp[0],tp[1]-2.6);ctx.moveTo(tp[0]+6,tp[1]+1);ctx.quadraticCurveTo(tp[0]+3,tp[1]-5,tp[0],tp[1]-2.6);ctx.stroke();
    torch(sm-d.hw-S(14),wh*0.62,0);torch(sm+d.hw+S(14),wh*0.62,0);}
  else if(v===2){/* carved porch: open gabled porch on twisted posts, diamond-boarded doors */
    const d=door(0,{w:22,h0:24,ah:0,frame:2.5,hinges:3,diamond:1,planks:8});
    const hw=d.hw+S(9);post(sm-hw+S(2),wh-2,0.85,woodL,3.2);post(sm+hw-S(2),wh-2,0.85,woodL,3.2);
    canopy(hw+S(2),wh-2,wh+16,0,0.95,'#7F9568','#6B8058',gold);
    torch(sm-hw-S(8),wh*0.6,0);torch(sm+hw+S(8),wh*0.6,0);}
  else if(v===3){/* iron-bound gate: heavy studded doors, scrolled straps, stone steps, antlers over the door */
    const d=door(0,{w:26,h0:23,ah:4,frame:3,hinges:3,heavy:1,studs:1,steps:1,bigRing:1,col:'#4E3524',planks:9});
    const tp=F(sm,d.h0+d.ah+5);antlers(tp,11,'#E3D7BC');ctx.fillStyle='#E9E0CA';ctx.beginPath();ctx.ellipse(tp[0],tp[1]+1.5,2.2,2.8,0,0,6.3);ctx.fill();
    torch(sm-d.hw-S(9),wh*0.55,0);torch(sm+d.hw+S(9),wh*0.55,0);}
  else if(v===4){/* dragon pillars: two tall carved posts rising above the eave, a rune lintel, banners */
    const d=door(0,{w:24,h0:20,ah:7,frame:3,hinges:2,ringGold:1,planks:8});
    const ps=[sm-d.hw-S(6),sm+d.hw+S(6)];ps.forEach(s=>post(s,wh+12,0.05,woodD,4.2));
    ps.forEach((s,i)=>dragonHead(F(s,wh+12,0.05),(i?1:-1)*(ax?1:-1),gold,0.75));
    const l0=F(ps[0]-S(3),d.h0+d.ah+4,0.05),l1=F(ps[1]+S(3),d.h0+d.ah+4,0.05);shp([l0,l1,[l1[0],l1[1]-4],[l0[0],l0[1]-4]],'#3A281A');runes(ps[0],ps[1],d.h0+d.ah+6,0.05,'#C8503C');
    ps.forEach((s,i)=>{const p=F(s+(i?1:-1)*S(3),wh+4,0.05),w2=Math.sin(t*2.2+i)*1;shp([p,[p[0]+(i?5:-5),p[1]+1],[p[0]+(i?5:-5)+w2,p[1]+15],[p[0]+w2*0.5,p[1]+12]],i?teal:red);});}
  else if(v===5){/* painted hall: colour bands under the eaves and round the doors, painted knot on the leaves */
    zig(0.02,0.98,wh-9,4,0,red,ochre);
    const d=door(0,{w:24,h0:21,ah:6,frame:4.5,hinges:2,planks:8,col:'#6A4630'});
    shp(archPts(d.hw+S(4.5),d.h0+2.7,d.ah+2.7,0),'rgba(0,0,0,0)');
    ctx.strokeStyle=teal;ctx.lineWidth=1.4;ctx.beginPath();archPts(d.hw+S(3),d.h0+1.6,d.ah+1.8,0).slice(1,-1).forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
    ctx.strokeStyle=ochre;ctx.lineWidth=0.7;ctx.beginPath();archPts(d.hw+S(1.4),d.h0+0.7,d.ah+0.9,0).slice(1,-1).forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
    for(const sd of [-1,1]){const p=F(sm+sd*d.hw*0.5,d.h0*0.68);ctx.strokeStyle=red;ctx.lineWidth=0.9;ctx.beginPath();ctx.ellipse(p[0],p[1],3,3.6,0,0,6.3);ctx.stroke();ctx.strokeStyle=ochre;ctx.beginPath();ctx.moveTo(p[0]-3,p[1]);ctx.quadraticCurveTo(p[0],p[1]-5,p[0]+3,p[1]);ctx.quadraticCurveTo(p[0],p[1]+5,p[0]-3,p[1]);ctx.stroke();}
    torch(sm-d.hw-S(10),wh*0.58,0);torch(sm+d.hw+S(10),wh*0.58,0);}
  else if(v===6){/* entrance hall (forstue): a short vestibule with its own turf roof and gilded antlers on the gable */
    const hw=S(17),o1=1.0,hv=wh-8;
    /* side wall (visible end) and front wall of the vestibule */
    const side=ax?sm+hw:sm+hw;shp([F(side,0,0),F(side,0,o1),F(side,hv,o1),F(side,hv,0)],'#4E3626');
    shp([F(sm-hw,0,o1),F(sm+hw,0,o1),F(sm+hw,hv,o1),F(sm-hw,hv,o1)],'#6A4A32');
    ctx.strokeStyle='rgba(20,12,8,0.3)';ctx.lineWidth=0.5;ctx.beginPath();for(let k=1;k<12;k++){const a=F(sm-hw+2*hw*k/12,2,o1),b=F(sm-hw+2*hw*k/12,hv-2,o1);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);}ctx.stroke();
    const d=door(o1,{w:20,h0:15,ah:7,frame:3,hinges:2,ringGold:1,planks:7});interlace(d.hw+S(1.6),d.h0+1,d.ah+1.2,o1,gold,1);
    canopy(hw+S(3),hv,hv+20,-0.05,o1+0.1,'#7F9568','#6B8058',gold);
    antlers(F(sm,hv+22,o1+0.1),16,gold);
    torch(sm-hw-S(6),wh*0.55,0);}
}
