/* =================== building shapes beyond the plain gable box ===================
   hipRoof: four-sided roof with an optionally sagging (bowed) ridge, the classic Viking longhouse.
   roundHut: round wall with a cone roof.  shedRoof: open lean-to on posts.
   pyramid roofs are hipRoof with hp=0.5.  All take the corner set from fp()/inset(). */
const ROOFC={turf:['#7F9568','#6B8058'],thatch:['#C2A45E','#A68A48'],shingle:['#5E5850','#4A4540'],tar:['#4A4038','#3A322C'],red:['#8E4E3A','#723D2D'],birch:['#B7AE9C','#958C7B']};
function rcol(o,win){const r=ROOFC[o.rt||'turf']||ROOFC.turf;return win?['#EEF1F0','#D3DAD9']:[o.roof||r[0],o.roofD||r[1]];}
/* corner order around the eaves for the two orientations: front long edge, front end edge, back long, back end */
/* long edges run from the back-end corner to the front-end corner, so the slopes never cross into a bow-tie */
function hipEdges(c,alongX){return alongX?{fl:[c.L,c.Bt],fe:[c.Bt,c.R],bl:[c.R,c.T],be:[c.T,c.L]}:{fl:[c.R,c.Bt],fe:[c.L,c.Bt],bl:[c.L,c.T],be:[c.R,c.T]};}
function roofTex(at,rt,win,seed){
  if(win){ctx.strokeStyle='rgba(180,190,192,0.6)';ctx.lineWidth=1;ctx.beginPath();for(let k=1;k<4;k++){const a=at(0,k/4),b2=at(1,k/4);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}ctx.stroke();return;}
  if(rt==='thatch'){ctx.strokeStyle='rgba(120,92,40,0.45)';ctx.lineWidth=0.8;ctx.beginPath();for(let k=0;k<30;k++){const u=(k+0.5)/30,a=at(u,0.02),b2=at(u,0.96);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}ctx.stroke();
    ctx.strokeStyle='rgba(90,66,30,0.5)';ctx.lineWidth=1.2;ctx.beginPath();for(const v of [0.33,0.66]){const a=at(0,v),b2=at(1,v);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}ctx.stroke();
    const e1=at(0,0),e2=at(1,0);ctx.strokeStyle='rgba(70,50,24,0.55)';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(e1[0],e1[1]+1);ctx.lineTo(e2[0],e2[1]+1);ctx.stroke();}
  else if(rt==='shingle'||rt==='tar'||rt==='red'||rt==='birch'){ctx.strokeStyle='rgba(30,26,22,0.33)';ctx.lineWidth=0.8;ctx.beginPath();const R=7,K=14;for(let r=1;r<R;r++){const v=r/R,a=at(0,v),b2=at(1,v);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);
      for(let k=0;k<K;k++){const u=(k+(r%2?0.5:0.1))/K;if(u>=1)continue;const p=at(u,v),q=at(u,v-1/R);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}}ctx.stroke();}
  else{ctx.strokeStyle='rgba(84,108,66,0.7)';ctx.lineWidth=1.2;ctx.beginPath();for(let k=1;k<4;k++){const a=at(0.03,k/4),b2=at(0.97,k/4);ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);}ctx.stroke();
    ctx.fillStyle='rgba(150,170,110,0.55)';for(let k=0;k<12;k++){const p=at(0.08+0.84*h2(k,seed||1,61),0.1+0.8*h2(k,seed||1,62));ctx.beginPath();ctx.ellipse(p[0],p[1],2.2,1.1,0,0,6.3);ctx.fill();}
    ctx.fillStyle='rgba(232,214,120,0.8)';for(let k=0;k<4;k++){const p=at(0.1+0.8*h2(k,seed||1,63),0.2+0.6*h2(k,seed||1,64));ctx.beginPath();ctx.arc(p[0],p[1],0.9,0,6.3);ctx.fill();}}
  const l1=at(0,0),l2=at(1,0);ctx.strokeStyle='rgba(255,248,220,0.3)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(l1[0],l1[1]-0.5);ctx.lineTo(l2[0],l2[1]-0.5);ctx.stroke();
}
/* hip roof. hp: how far the hips come in (0 = gable-like, 0.5 = pyramid). sag: ridge ends lift by this many px (bowed ridge).
   ov: eave overhang in px. Returns ridge ends (screen) so callers can add dragon heads. */
function hipRoof(c,wh,rh,alongX,o,win){
  o=o||{};const hp=o.hp===undefined?0.25:o.hp,sag=o.sag||0,ov=o.ov===undefined?3:o.ov,[RL,RD]=rcol(o,win),rt=o.rt||'turf';
  const cc=ov?{T:[c.T[0],c.T[1]-ov*0.5],R:[c.R[0]+ov,c.R[1]],Bt:[c.Bt[0],c.Bt[1]+ov*0.5],L:[c.L[0]-ov,c.L[1]]}:c;
  const E=hipEdges(cc,alongX),H=wh+rh;
  const mA=lerp(E.be[0],E.be[1],0.5),mB=lerp(E.fe[0],E.fe[1],0.5);/* ridge line from back end to front end */
  const Rb0=lerp(mA,mB,hp),Rf0=lerp(mA,mB,1-hp);
  const ridge=u=>{const p=lerp(Rb0,Rf0,u);return [p[0],p[1]-H-sag*Math.pow(2*u-1,2)];};
  const n=10,rp=[];for(let k=0;k<=n;k++)rp.push(ridge(k/n));
  const eu=p=>up(p,wh-1),bow=o.bow||0;
  const fe=u=>{const p=lerp(eu(E.fl[0]),eu(E.fl[1]),u);return [p[0],p[1]+bow*(1-Math.pow(2*u-1,2))];};const fpts=[];for(let k=0;k<=n;k++)fpts.push(fe(k/n));
  /* back long slope and back end (mostly hidden, give depth above the ridge) */
  poly([].concat(eu(E.bl[0]),eu(E.bl[1]),...rp.map(q=>q)),RD);
  poly([].concat(eu(E.be[0]),eu(E.be[1]),rp[0]),RD);
  /* front end hip */
  poly([].concat(eu(E.fe[0]),eu(E.fe[1]),rp[n]),win?'#DCE2E1':RD);
  /* front long slope */
  poly([].concat(...fpts,...rp.slice().reverse()),RL);
  /* texture on the front slope: map (u along, v up) */
  const at=(u,v)=>{const e=fe(u),r=ridge(u);return lerp(e,r,v);};
  roofTex(at,rt,win,o.seed);
  /* texture hint on the hip */
  if(!win&&rt==='turf'){ctx.fillStyle='rgba(84,108,66,0.35)';const a=eu(E.fe[0]),b2=eu(E.fe[1]),t2=rp[n];ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(t2[0],t2[1]);ctx.lineTo(lerp(a,b2,0.35)[0],lerp(a,b2,0.35)[1]);ctx.fill();}
  /* hip and ridge lines */
  ctx.strokeStyle=o.ridge||'rgba(60,46,34,0.85)';ctx.lineWidth=2.4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(rp[0][0],rp[0][1]);for(const q of rp)ctx.lineTo(q[0],q[1]);ctx.stroke();
  ctx.lineWidth=1.4;ctx.strokeStyle='rgba(50,38,28,0.55)';ctx.beginPath();const f0=eu(E.fe[0]),f1=eu(E.fe[1]);ctx.moveTo(f0[0],f0[1]);ctx.lineTo(rp[n][0],rp[n][1]);ctx.lineTo(f1[0],f1[1]);ctx.stroke();ctx.lineCap='butt';
  /* eave shadow line */
  ctx.strokeStyle='rgba(30,22,16,0.35)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(f0[0],f0[1]+1);ctx.moveTo(fpts[0][0],fpts[0][1]+1);for(const q of fpts)ctx.lineTo(q[0],q[1]+1);ctx.lineTo(f1[0],f1[1]+1);ctx.stroke();
  return {rb:rp[0],rf:rp[n],H:H,ridge:ridge,at:at,RL:RL,RD:RD};
}
/* walls only (stone footing, planks/logs/stone, posts, door) using hall() without its roof */
function wallsOnly(c,wh,alongX,o,win){return hall(c,wh,6,alongX,Object.assign({},o,{nr:1}),win);}
/* dragon-head finials at a ridge end, facing outward along dir (+1/-1 in screen x) */
function dragonHead(p,dir,col,s){s=s||1;ctx.strokeStyle=col||'#4E3C2E';ctx.lineWidth=2.6*s;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.quadraticCurveTo(p[0]+dir*6*s,p[1]-4*s,p[0]+dir*7*s,p[1]-12*s);ctx.quadraticCurveTo(p[0]+dir*7.5*s,p[1]-16*s,p[0]+dir*11*s,p[1]-15*s);ctx.stroke();
  ctx.lineWidth=1.4*s;ctx.beginPath();ctx.moveTo(p[0]+dir*7*s,p[1]-13*s);ctx.lineTo(p[0]+dir*3*s,p[1]-17*s);ctx.stroke();ctx.lineCap='butt';}
/* crossed gable boards (X) like a stave church */
function gableX(p,col,s){s=s||1;ctx.strokeStyle=col||'#4E3C2E';ctx.lineWidth=2.4*s;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.quadraticCurveTo(p[0]+8*s,p[1]-6*s,p[0]+7*s,p[1]-15*s);ctx.moveTo(p[0],p[1]);ctx.quadraticCurveTo(p[0]-8*s,p[1]-6*s,p[0]-7*s,p[1]-15*s);ctx.stroke();ctx.lineCap='butt';}
/* round hut: wall cylinder + cone roof (thatch or turf) */
function roundHut(cx,cy,rx,wh,rh,o,win){o=o||{};const ry=rx*0.5,[RL,RD]=rcol(o,win),wall=o.wall||'#8E6F52',wallD=o.wallD||'#6E543D';
  ctx.fillStyle='rgba(38,48,53,0.16)';ctx.beginPath();ctx.ellipse(cx+5,cy+3,rx+4,ry+2,0,0,6.3);ctx.fill();
  const g=ctx.createLinearGradient(cx-rx,0,cx+rx,0);g.addColorStop(0,wall);g.addColorStop(0.55,wall);g.addColorStop(1,wallD);
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(cx-rx,cy-wh);ctx.lineTo(cx-rx,cy);ctx.ellipse(cx,cy,rx,ry,0,Math.PI,0,true);ctx.lineTo(cx+rx,cy-wh);ctx.closePath();ctx.fill();
  /* wattle/plank bands */
  ctx.strokeStyle='rgba(50,36,24,0.35)';ctx.lineWidth=0.8;ctx.beginPath();for(let k=1;k<10;k++){const a=Math.PI*k/10,x=cx-Math.cos(a)*rx,y=cy+Math.sin(a)*ry;ctx.moveTo(x,y);ctx.lineTo(x,y-wh);}ctx.stroke();
  ctx.fillStyle=win?'#B7B9B5':'#A39D93';ctx.beginPath();ctx.moveTo(cx-rx,cy-3);ctx.ellipse(cx,cy-3,rx,ry,0,Math.PI,0,true);ctx.lineTo(cx+rx,cy);ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI,false);ctx.closePath();ctx.fill();
  if(o.door!==false){const dx=cx-rx*0.35,dy=cy+ry*0.94;poly([dx-4,dy+1,dx+3,dy+2,dx+3,dy-wh*0.75,dx-4,dy-wh*0.75-1],'#3E3028');}
  const R=rx*1.18,RY=R*0.5,top=cy-wh-rh;
  const g2=ctx.createLinearGradient(cx-R,0,cx+R,0);g2.addColorStop(0,RL);g2.addColorStop(0.6,RL);g2.addColorStop(1,RD);
  ctx.fillStyle=g2;ctx.beginPath();ctx.moveTo(cx-R,cy-wh+2);ctx.lineTo(cx,top);ctx.lineTo(cx+R,cy-wh+2);ctx.ellipse(cx,cy-wh+2,R,RY,0,0,Math.PI,false);ctx.closePath();ctx.fill();
  if(!win){ctx.strokeStyle=o.rt==='thatch'?'rgba(120,92,40,0.5)':'rgba(84,108,66,0.6)';ctx.lineWidth=0.8;ctx.beginPath();for(let k=0;k<=16;k++){const a=Math.PI*k/16,x=cx-Math.cos(a)*R,y=cy-wh+2+Math.sin(a)*RY;ctx.moveTo(cx,top);ctx.lineTo(x,y);}ctx.stroke();
    ctx.strokeStyle=o.rt==='thatch'?'rgba(90,66,30,0.55)':'rgba(70,92,58,0.6)';ctx.lineWidth=1.2;ctx.beginPath();for(const f of [0.4,0.7]){ctx.moveTo(cx-R*f,cy-wh+2-(1-f)*rh+RY*f*0);ctx.ellipse(cx,top+(cy-wh+2-top)*f,R*f,RY*f,0,Math.PI,0,true);}ctx.stroke();}
  ctx.strokeStyle='rgba(60,44,30,0.6)';ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(cx,cy-wh+2,R,RY,0,0,Math.PI,false);ctx.stroke();
  /* smoke hole cap */
  poly([cx-3,top+3,cx+3,top+3,cx+2,top-2,cx-2,top-2],win?'#C9CCC8':'#4E3C2E');
  return {top:[cx,top]};
}
/* open shed: 4 posts and a single-pitch roof sloping to the front. hb = back height, hf = front height */
function shedRoof(c,hb,hf,o,win){o=o||{};const [RL,RD]=rcol(o,win);
  ctx.strokeStyle='#4E3C2E';ctx.lineWidth=2.4;ctx.beginPath();for(const [q,h] of [[c.T,hb],[c.R,hb],[c.L,hf],[c.Bt,hf]]){ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0],q[1]-h);}ctx.stroke();
  return ()=>{const T=up(c.T,hb+1),R=[c.R[0]+3,c.R[1]-hb-1],Bt=[c.Bt[0],c.Bt[1]-hf+2],L=[c.L[0]-3,c.L[1]-hf];
    poly([R[0],R[1],Bt[0],Bt[1],Bt[0],Bt[1]+3,R[0],R[1]+3],'#5C4634');
    poly(P(T,R,Bt,L),RL);
    const at=(u,v)=>lerp(lerp(L,Bt,u),lerp(T,R,u),v);roofTex(at,o.rt||'shingle',win,o.seed);
    ctx.strokeStyle='rgba(40,30,22,0.6)';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(L[0],L[1]);ctx.lineTo(Bt[0],Bt[1]);ctx.lineTo(R[0],R[1]);ctx.stroke();};
}
/* a stack of proper logs: round, ringed ends at both sides (the far end peeks out too). dir 'x' or 'y' along the iso axes */
function logStack(px,py,r,len,rows,dir){const sx=dir==='y'?-1:1,vx=sx*len*0.894,vy=len*0.447,gx=-sx*0.894*2.1*r,gy=0.447*2.1*r,mx=-sx*0.447,my=0.894,rot=-sx*0.464;
  const cap=(x,y,front)=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.fillStyle=front?'#D8BE92':'#9C8160';ctx.beginPath();ctx.ellipse(0,0,r*0.9,r,0,0,6.3);ctx.fill();ctx.strokeStyle='#7E6248';ctx.lineWidth=1;ctx.stroke();
    if(front){ctx.strokeStyle='rgba(126,98,72,0.6)';ctx.lineWidth=0.6;ctx.beginPath();ctx.ellipse(0,0,r*0.45,r*0.5,0,0,6.3);ctx.stroke();ctx.fillStyle='#8E6F52';ctx.beginPath();ctx.arc(0,0,0.7,0,6.3);ctx.fill();}ctx.restore();};
  for(let j=0;j<rows;j++)for(let k=0;k<rows-j;k++){const x=px+(k+j*0.5)*gx,y=py+(k+j*0.5)*gy-j*1.75*r,qx=x-vx,qy=y-vy;
    cap(qx,qy,false);
    poly([qx-mx*r,qy-my*r,x-mx*r,y-my*r,x+mx*r,y+my*r,qx+mx*r,qy+my*r],'#8A6E52');poly([qx,qy,x,y,x+mx*r,y+my*r,qx+mx*r,qy+my*r],'#6E543D');
    ctx.strokeStyle='rgba(60,44,30,0.35)';ctx.lineWidth=0.7;ctx.beginPath();ctx.moveTo(qx-mx*r*0.5,qy-my*r*0.5);ctx.lineTo(x-mx*r*0.5,y-my*r*0.5);ctx.stroke();
    cap(x,y,true);}}
