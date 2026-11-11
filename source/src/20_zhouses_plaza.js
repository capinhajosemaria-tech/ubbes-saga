/* =================== houses, Town Hall plaza, morale glow =================== */
/* house styles: per level, three variants [wall, wallDark, roof, roofDark, barge] */
const HOUSE_STY=[
  [['#9C8466','#7E6A50','#7F9568','#6B8058','#5C4634'],['#A39072','#85725A','#8E9C68','#78864F','#5C4634'],['#958061','#77664C','#728A60','#5E744E','#4E3C2E']],
  [['#8E6F52','#6E543D','#7F9568','#6B8058','#5C4634'],['#957556','#74583F','#B39E66','#97834F','#5C4634'],['#86684C','#674F39','#6E8A5E','#5B744E','#4E3C2E']],
  [['#6E543D','#54402E','#7A6A58','#62554A','#A34A3A'],['#76593F','#5A4330','#7F9568','#6B8058','#8E3B2F'],['#6A5240','#503D2E','#6E6458','#58504A','#C9A64A']],
  [['#7A5D44','#5C4532','#6E6458','#58504A','#A34A3A'],['#6E543D','#54402E','#7F9568','#6B8058','#C9A64A'],['#82634A','#634A36','#8C7A5E','#73644C','#8E3B2F']],
  [['#6A4E38','#4E3A2A','#5E5850','#4A4540','#C9A64A'],['#74563D','#57412E','#7F9568','#6B8058','#A34A3A'],['#6E543D','#54402E','#7A6A58','#62554A','#C9A64A']]];
const HOUSE_SCH=[
  {n:'Turf and oak',wall:'#8E6F52',wallD:'#6E543D',roof:'#7F9568',roofD:'#6B8058',barge:'#5C4634',rt:'turf'},
  {n:'Straw and pine',wall:'#A08460',wallD:'#80684B',roof:'#C2A45E',roofD:'#A68A48',barge:'#6E543D',rt:'thatch'},
  {n:'Tarred shingle',wall:'#5E4A3A',wallD:'#463729',roof:'#5E5850',roofD:'#4A4540',barge:'#C9A64A',rt:'shingle'},
  {n:'Red ochre',wall:'#9A4E3A',wallD:'#7A3C2D',roof:'#7F9568',roofD:'#6B8058',barge:'#3E3028',rt:'turf'},
  {n:'Whitewashed',wall:'#D8CDB4',wallD:'#B9AE95',roof:'#B39E66',roofD:'#97834F',barge:'#5C4634',rt:'thatch'},
  {n:'Birch and slate',wall:'#B7AE9C',wallD:'#958C7B',roof:'#6F7A80',roofD:'#5A646A',barge:'#A34A3A',rt:'shingle'}];
function houseSch(b){if(b.sch!==undefined&&b.sch!==null)return b.sch;if(S&&S.houseSch!==undefined&&S.houseSch!==null)return S.houseSch;return Math.floor(h2(b.id||0,0,77)*4);}/* from the id only, so moving a house keeps its colours */
function roofPoint(c,wh,H,o,u,v){/* a point on the visible roof plane: u along the ridge, v from eave (0) to ridge (1) */
  const a=o.alongX?lerp(up(c.L,wh),up(c.Bt,wh),u):lerp(up(c.Bt,wh),up(c.R,wh),u),b=o.alongX?lerp(up(o.M1,H),up(o.M2,H),u):lerp(up(o.M2,H),up(o.M1,H),u);return lerp(a,b,v);}
function drawHouse(b,win){
  const L=Math.min(5,b.lvl||1),v=Math.floor(h2(b.id||0,1,77)*3),st=HOUSE_STY[L-1][v],alongX=b.rot%2===0;
  const c0=fp(b),c=inset(c0,L>=4?0.08:L>=2?0.13:0.17);
  const wh=[9,11,13,14,15][L-1],rh=[15,14,16,17,18][L-1];
  if(L>=5){poly(P(c.L,c.Bt,[c.Bt[0],c.Bt[1]+4],[c.L[0],c.L[1]+4]),'#8E877D');poly(P(c.Bt,c.R,[c.R[0],c.R[1]+4],[c.Bt[0],c.Bt[1]+4]),'#77716A');}
  const SC=HOUSE_SCH[houseSch(b)];
  /* one shape for every house (gable); v only varies colours and props */
  const r=hall(c,wh,rh,alongX,{wall:SC.wall,wallD:SC.wallD,roof:SC.roof,roofD:SC.roofD,barge:L>=3?st[4]:SC.barge,rt:SC.rt,hip:0,sag:0},win);
  const o={alongX:alongX,M1:r.M1,M2:r.M2};
  if(false){
    const turf=st[2]==='#7F9568'||st[2]==='#8E9C68'||st[2]==='#728A60'||st[2]==='#6E8A5E';
    if(turf){ctx.fillStyle='rgba(70,92,58,0.55)';for(let k=0;k<7;k++){const p=roofPoint(c,wh-3,r.H,o,0.12+0.76*h2(b.id,k,91),0.15+0.7*h2(b.id,k,92));ctx.fillRect(p[0]-1,p[1]-2,2,3);}if(L<=2&&h2(b.id,3,93)>0.5){ctx.fillStyle='#C9B06A';const p=roofPoint(c,wh-3,r.H,o,0.6,0.45);ctx.beginPath();ctx.arc(p[0],p[1],1.4,0,6.3);ctx.fill();}}
    else{ctx.strokeStyle='rgba(38,30,24,0.28)';ctx.lineWidth=0.8;ctx.beginPath();for(let k=1;k<5;k++){const a=roofPoint(c,wh-3,r.H,o,0.02,k/5),e=roofPoint(c,wh-3,r.H,o,0.98,k/5);ctx.moveTo(a[0],a[1]);ctx.lineTo(e[0],e[1]);}ctx.stroke();}}
  /* gable dragon heads from level 3 */
  if(L>=3&&r.hip){dragonHead(r.hip.rf,alongX?1:-1,st[4],0.75);}
  else if(L>=3){const m=up(r.M2,r.H);ctx.strokeStyle=st[4];ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(m[0]+4,m[1]-8);ctx.quadraticCurveTo(m[0]+9,m[1]-13,m[0]+7,m[1]-16);ctx.moveTo(m[0]-4,m[1]-8);ctx.quadraticCurveTo(m[0]-9,m[1]-13,m[0]-7,m[1]-16);ctx.stroke();}
  /* props */
  const fb=c0.Bt,fl=lerp(c0.L,c0.Bt,0.5),fr=lerp(c0.Bt,c0.R,0.5);
  const side=v===0?fl:fr;
  if(L>=2)barrelC(side[0]+(side===fl?-8:10),side[1]+4);
  if(L>=2){const bx=fb[0]+(v===1?-14:10),by=fb[1]+2;if(propOK(bx,by)){poly([bx-7,by-3,bx+7,by+1,bx+7,by-1,bx-7,by-5],'#A88A69');ctx.fillStyle='#6E543D';ctx.fillRect(bx-6,by-3,1.4,4);ctx.fillRect(bx+5,by,1.4,3);}}
  if(L>=3){const p=lerp(c.L,c.Bt,0.3);ctx.fillStyle=v===1?'#D7CDB4':'#A34A3A';ctx.beginPath();ctx.arc(p[0],p[1]-wh*0.55,3.4,0,6.3);ctx.fill();ctx.fillStyle='#C9C2B2';ctx.beginPath();ctx.arc(p[0],p[1]-wh*0.55,1.1,0,6.3);ctx.fill();}
  if(L>=4){/* lean-to store shed */const s={T:lerp(c0.R,c0.T,0.25),R:c0.R,Bt:lerp(c0.R,c0.Bt,0.45),L:null};s.L=[s.T[0]+s.Bt[0]-s.R[0],s.T[1]+s.Bt[1]-s.R[1]];
    poly(P(s.L,s.Bt,up(s.Bt,7),up(s.L,7)),st[1]);poly(P(s.Bt,s.R,up(s.R,7),up(s.Bt,7)),st[1]);poly(P(up(s.L,7),up(s.Bt,7),up(s.R,7),up(s.T,10)),win?'#E6E9E7':st[3]);}
  if(L>=5){const p=lerp(c0.L,c0.Bt,0.85);ctx.strokeStyle='#4E3C2E';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p[0],p[1]+4);ctx.lineTo(p[0],p[1]-30);ctx.stroke();poly([p[0],p[1]-29,p[0]+13,p[1]-26,p[0],p[1]-21],v===1?'#C9A64A':'#A34A3A');}
}
/* Town Hall: the hall stands in the middle of its 6×6 square, with the village plaza all round it */
/* the hall stands in the middle of its square; rotating the Town Hall turns the roof and moves the fire to another corner */
const TH_MX=[[0,0],[1,0],[1,1],[0,1]];
function thHallRect(b){return {fx:b.fx+1,fy:b.fy+1,w:4,h:4};}
function feastOn(){return S&&S.feast&&S.feast.until>S.gameT;}
function dancer(x,y,ph,col){const k=0.22,j=Math.abs(Math.sin(ph*2))*3;ctx.save();ctx.translate(x,y-j);ctx.scale(k,k);
  poly([12,22,28,22,31,52,9,52],col);ctx.fillStyle='#E2B99A';ctx.beginPath();ctx.arc(20,13,7,0,6.3);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(13,26);ctx.lineTo(4,12+Math.sin(ph*4)*6);ctx.moveTo(27,26);ctx.lineTo(36,12-Math.sin(ph*4)*6);ctx.stroke();ctx.strokeStyle='#6B5A48';ctx.beginPath();ctx.moveTo(17,50);ctx.lineTo(15-Math.sin(ph*4)*4,74);ctx.moveTo(23,50);ctx.lineTo(25+Math.sin(ph*4)*4,74);ctx.stroke();ctx.restore();}
function drawPlaza(b,win){const L=thLevel(),e=elev[b.fy*N+b.fx]||2;
  const mr=TH_MX[(b.rot|0)&3],at=(x,y)=>iso(b.fx+(mr[0]?6-x:x)-0.5,b.fy+(mr[1]?6-y:y)-0.5);
  const fire=at(5.45,5.45),feast=feastOn();
  ctx.save();
  /* paving: flat stones around the fire */
  for(let k=0;k<14;k++){const a=k/14*6.283,rr=30+(k%3)*5;ctx.fillStyle=k%2?(win?'#C9CCC8':'#9A958B'):(win?'#D6D9D5':'#A8A398');ctx.beginPath();ctx.ellipse(fire[0]+Math.cos(a)*rr,fire[1]+Math.sin(a)*rr*0.5,5,2.6,0,0,6.3);ctx.fill();}
  /* benches around the fire */
  const bench=(x,y,ang)=>{ctx.save();ctx.translate(x,y);poly([-11,-2,11,-2,11,2,-11,2].map((v,i)=>i%2?v*0.5+(ang?(i>2?3:-3):0):v),'#8A6E52');ctx.restore();};
  bench(fire[0]-26,fire[1]+4,1);bench(fire[0]+24,fire[1]+6,0);if(L>=2)bench(fire[0]-2,fire[1]+18,0);
  /* fire pit */
  ctx.fillStyle='#857F76';for(let k=0;k<9;k++){const a=k/9*6.283;ctx.beginPath();ctx.ellipse(fire[0]+Math.cos(a)*11,fire[1]+Math.sin(a)*5.5,3,2,0,0,6.3);ctx.fill();}
  ctx.fillStyle='#3C2E24';ctx.beginPath();ctx.ellipse(fire[0],fire[1],8,4,0,0,6.3);ctx.fill();
  const big=feast?1.9:1;ctx.fillStyle='rgba(255,190,100,'+(feast?0.32:0.18)+')';ctx.beginPath();ctx.ellipse(fire[0],fire[1]-2,26*big,13*big,0,0,6.3);ctx.fill();
  ctx.fillStyle='#E8742A';ctx.beginPath();ctx.moveTo(fire[0]-6*big,fire[1]);ctx.quadraticCurveTo(fire[0],fire[1]-(16+Math.sin(t*8)*3)*big,fire[0]+6*big,fire[1]);ctx.fill();
  ctx.fillStyle='#F7C25A';ctx.beginPath();ctx.moveTo(fire[0]-3*big,fire[1]);ctx.quadraticCurveTo(fire[0]+1,fire[1]-(9+Math.sin(t*11)*2)*big,fire[0]+3*big,fire[1]);ctx.fill();
  if(feast){/* pig on a spit */ctx.strokeStyle='#4E3C2E';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(fire[0]-16,fire[1]-2);ctx.lineTo(fire[0]-16,fire[1]-20);ctx.moveTo(fire[0]+16,fire[1]-2);ctx.lineTo(fire[0]+16,fire[1]-20);ctx.moveTo(fire[0]-19,fire[1]-18);ctx.lineTo(fire[0]+19,fire[1]-18);ctx.stroke();
    ctx.save();ctx.translate(fire[0],fire[1]-18);ctx.rotate(Math.sin(t*1.5)*0.15);ctx.fillStyle='#B0705A';ctx.beginPath();ctx.ellipse(0,0,11,6,0,0,6.3);ctx.fill();ctx.fillStyle='#9A5E48';ctx.beginPath();ctx.arc(10,-1,4,0,6.3);ctx.fill();ctx.restore();
    const cols=['#5E7F8C','#8E5A4E','#7C8A6A','#4B6A76','#A34A3A','#6E5248','#C9A64A','#5E7F8C'];
    for(let k=0;k<8;k++){const a=t*0.6+k/8*6.283;dancer(fire[0]+Math.cos(a)*34-4,fire[1]+Math.sin(a)*17-14,t*2+k,cols[k]);}}
  /* level props */
  if(L>=2){[[0.6,5.6],[5.6,0.6]].forEach((q,i)=>{const p=at(q[0],q[1]);ctx.strokeStyle='#4E3C2E';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0],p[1]-44);ctx.stroke();poly([p[0],p[1]-43,p[0]+(i?-15:15),p[1]-39,p[0],p[1]-33],'#A34A3A');poly([p[0]+(i?-4:4),p[1]-40,p[0]+(i?-9:9),p[1]-38,p[0]+(i?-5:5),p[1]-37],'#263035');});
    barrelC(at(5.6,3.2)[0],at(5.6,3.2)[1]);barrelC(at(5.7,3.7)[0]+4,at(5.7,3.7)[1]);}
  if(L>=3){[[THDV?4.7:3.6,5.7],[5.7,3.4]].forEach(q=>{const p=at(q[0],q[1]);ctx.fillStyle='#4E4A45';ctx.fillRect(p[0]-2.5,p[1]-12,5,12);ctx.fillStyle='rgba(255,197,107,0.35)';ctx.beginPath();ctx.ellipse(p[0],p[1]-14,10,6,0,0,6.3);ctx.fill();ctx.fillStyle='#F0A040';ctx.beginPath();ctx.moveTo(p[0]-3,p[1]-12);ctx.quadraticCurveTo(p[0],p[1]-22-Math.sin(t*7)*2,p[0]+3,p[1]-12);ctx.fill();});
    const pp=at(THDV?1.6:4.1,5.8);poly([pp[0]-3,pp[1],pp[0]+3,pp[1],pp[0]+3,pp[1]-24,pp[0],pp[1]-28,pp[0]-3,pp[1]-24],'#6E543D');ctx.fillStyle='#C9B38A';ctx.fillRect(pp[0]-2,pp[1]-20,4,1.5);ctx.fillRect(pp[0]-2,pp[1]-15,4,1.5);}
  if(L>=4){const p=at(5.3,4.6);poly([p[0]-16,p[1]-6,p[0]+16,p[1]+2,p[0]+16,p[1]-2,p[0]-16,p[1]-10],'#8A6E52');ctx.fillStyle='#6E543D';ctx.fillRect(p[0]-14,p[1]-8,2,8);ctx.fillRect(p[0]+13,p[1]-1,2,7);
    ctx.fillStyle='#C9A64A';[[-8,-9],[0,-7],[8,-5]].forEach(q=>{ctx.fillRect(p[0]+q[0]-1.5,p[1]+q[1]-4,3,4);});
    [[4.9,3.5]].forEach(q=>{const s2=at(q[0],q[1]);ctx.fillStyle='#A34A3A';ctx.beginPath();ctx.arc(s2[0],s2[1]-10,5,0,6.3);ctx.fill();ctx.fillStyle='#D7CDB4';ctx.beginPath();ctx.arc(s2[0],s2[1]-10,2,0,6.3);ctx.fill();});}
  if(L>=5){const p=at(THDV?0.9:3.0,5.4);poly([p[0]-8,p[1]+2,p[0]+8,p[1]+2,p[0]+7,p[1]-24,p[0]+2,p[1]-32,p[0]-6,p[1]-26],win?'#C9CCC8':'#8E877D');poly([p[0],p[1]+2,p[0]+8,p[1]+2,p[0]+7,p[1]-24,p[0]+2,p[1]-32],win?'#B5B9B6':'#77716A');ctx.strokeStyle='#A34A3A';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(p[0]-3,p[1]-6);ctx.quadraticCurveTo(p[0]-5,p[1]-18,p[0]+1,p[1]-24);ctx.moveTo(p[0]-2,p[1]-10);ctx.lineTo(p[0]+3,p[1]-12);ctx.stroke();}
  ctx.restore();}
/* morale tints the air around the village: warm gold when spirits are high, cold grey-blue when low */
function drawMoraleGlow(){if(!S||titleOn)return;const th=B.find(b=>b.t==='th');if(!th)return;const m=S.morale;let col=null,a=0;
  if(m>=70){col='232,196,106';a=Math.min(0.2,(m-70)/30*0.22+0.06);}else if(m<40){col=m<20?'150,70,60':'90,110,130';a=Math.min(0.26,(40-m)/40*0.26+0.06);}if(!col)return;
  const p=iso(th.fx+3,th.fy+3),R=HW*22;const g=ctx.createRadialGradient(p[0],p[1],R*0.15,p[0],p[1],R);g.addColorStop(0,'rgba('+col+','+a.toFixed(3)+')');g.addColorStop(1,'rgba('+col+',0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(p[0],p[1],R,R*0.5,0,0,6.3);ctx.fill();}
