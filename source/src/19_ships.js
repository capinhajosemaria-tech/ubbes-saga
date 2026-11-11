/* =================== ships =================== */
const SHIP_SIDE=[429.9,313.9,458.7,345.8,497.6,379.8,548.8,411.4,604.8,433.4,655.3,444.2,698.1,448.1,698.1,462,655.3,460,604.8,450,548.8,428,497.6,394,458.7,358,432,322];
const SHIP_DECK=[429.9,313.9,472.7,317.8,523.2,328.6,579.2,350.6,630.4,382.2,669.3,416.2,698.1,448.1,655.3,444.2,604.8,433.4,548.8,411.4,497.6,379.8,458.7,345.8];
const SHIP_IN=[438.8,318.4,470.6,322,519.3,336.3,574.6,359.7,626.5,389.9,667.2,420.4,689.2,443.6,657.4,440,608.7,425.7,553.4,402.3,501.5,372.1,460.8,341.6];
function shipPoly(arr,cx,cy,k,flip,col,ky){const o=[];for(let i=0;i<arr.length;i+=2){o.push(cx+(arr[i]-564)*k*(flip?-1:1),cy+(arr[i+1]-381)*(ky||k));}poly(o,col);}
/* kind: 'karvi' (warship, shields, striped sail), 'knarr' (short and broad, cargo under hides, plain sail), 'snekkja' (long, low and dark, dragon head, many shields); true = knarr */
function drawShip(cx,cy,k,flip,kind,partial){const ty=kind===true?'knarr':(kind||'karvi'),cargo=ty==='knarr',snek=ty==='snekkja';
  const kx=k*(cargo?0.8:snek?1.16:1),ky=k*(cargo?1.14:snek?0.84:1);
  const X=x=>cx+(x-564)*kx*(flip?-1:1),Y=y=>cy+(y-381)*ky;
  ctx.fillStyle='rgba(38,48,53,0.2)';ctx.beginPath();ctx.ellipse(cx,cy+14*k,150*k,40*k,flip?-0.46:0.46,0,6.3);ctx.fill();
  shipPoly(SHIP_SIDE,cx,cy,kx,flip,cargo?'#7A6248':snek?'#4A382C':'#6E543D',ky);
  if(partial!==undefined&&partial<1){ctx.strokeStyle='#8A6E52';ctx.lineWidth=3*k*2;ctx.beginPath();for(let i=0;i<7;i++){const x=440+i*40;ctx.moveTo(X(x),Y(310+i*20));ctx.lineTo(X(x),Y(290+i*20));}ctx.stroke();
    ctx.save();ctx.globalAlpha=Math.max(0.15,partial);shipPoly(SHIP_DECK,cx,cy,kx,flip,'#8A6E52',ky);ctx.restore();return;}
  shipPoly(SHIP_DECK,cx,cy,kx,flip,'#8A6E52',ky);shipPoly(SHIP_IN,cx,cy,kx,flip,'#7A5F46',ky);
  if(!cargo){const sh=snek?[[466,360],[492,382],[520,401],[548.8,417.4],[578,430],[606,440],[636,447]]:[[473.8,366.3],[510,394.5],[548.8,417.4],[590.4,434.7],[634.8,446.7]];sh.forEach((p,i)=>{ctx.fillStyle=snek?(i%2?'#C9A64A':'#2E3438'):(i%2?'#D7CDB4':'#A34A3A');ctx.beginPath();ctx.ellipse(X(p[0]),Y(p[1]),9*k,7*k,0,0,6.3);ctx.fill();});}
  else{[[515,352],[555,372],[598,392]].forEach(p=>{poly([X(p[0])-8*k,Y(p[1])-2*k,X(p[0])+8*k,Y(p[1])-2*k,X(p[0])+6*k,Y(p[1])-14*k,X(p[0])-6*k,Y(p[1])-14*k],'#9C8466');ctx.strokeStyle='rgba(60,44,30,0.6)';ctx.lineWidth=1.2*k*2;ctx.beginPath();ctx.moveTo(X(p[0])-7*k,Y(p[1])-8*k);ctx.lineTo(X(p[0])+7*k,Y(p[1])-8*k);ctx.stroke();});}
  ctx.fillStyle=snek?'#4A382C':'#6E543D';if(cargo){ctx.beginPath();ctx.moveTo(X(694),Y(452));ctx.lineTo(X(708),Y(424));ctx.lineTo(X(716),Y(414));ctx.lineTo(X(712),Y(430));ctx.lineTo(X(706),Y(452));ctx.closePath();ctx.fill();}else{ctx.beginPath();ctx.moveTo(X(694),Y(452));ctx.lineTo(X(712),Y(416));ctx.lineTo(X(726),Y(392));ctx.lineTo(X(744),Y(388));ctx.lineTo(X(732),Y(402));ctx.lineTo(X(720),Y(420));ctx.lineTo(X(708),Y(452));ctx.closePath();ctx.fill();if(snek){ctx.beginPath();ctx.ellipse(X(748),Y(386),9*k,6*k,0,0,6.3);ctx.fill();ctx.beginPath();ctx.moveTo(X(752),Y(390));ctx.lineTo(X(770),Y(396));ctx.lineTo(X(754),Y(384));ctx.fill();ctx.fillStyle='#C9A64A';ctx.beginPath();ctx.arc(X(748),Y(383),2.2*k,0,6.3);ctx.fill();ctx.fillStyle=snek?'#4A382C':'#6E543D';}}
  ctx.beginPath();ctx.moveTo(X(432),Y(316));ctx.lineTo(X(420),Y(282));ctx.lineTo(X(410),Y(270));ctx.lineTo(X(416),Y(288));ctx.lineTo(X(424),Y(318));ctx.closePath();ctx.fill();
  ctx.strokeStyle='#5A4636';ctx.lineWidth=5*k;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,cy-150*k);ctx.stroke();
  ctx.strokeStyle=cargo?'#C8B48C':'#E9E2D0';ctx.lineWidth=9*k;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(X(500),Y(236));ctx.lineTo(X(628),Y(300));ctx.stroke();
  ctx.strokeStyle=cargo?'rgba(0,0,0,0)':snek?'#2E3438':'#A34A3A';ctx.lineWidth=3*k;ctx.setLineDash([10*k,12*k]);ctx.beginPath();ctx.moveTo(X(500),Y(236));ctx.lineTo(X(628),Y(300));ctx.stroke();ctx.setLineDash([]);ctx.lineCap='butt';
  ctx.fillStyle='#C9A64A';ctx.beginPath();ctx.moveTo(cx,cy-152*k);ctx.lineTo(cx+(flip?-1:1)*18*k,cy-147*k);ctx.lineTo(cx,cy-140*k);ctx.fill();
}
function dockSpots(b){if(b.t==='harbour')return harbourBerths(b);const out=[];for(const p of edgeTiles(b)){if(tAt(p[0],p[1])!==T.SEA)continue;const q=[p[0]+(p[0]-(b.fx+b.w/2-0.5))*0.9,p[1]+(p[1]-(b.fy+b.h/2-0.5))*0.9];out.push({p:p,q:q});}return out;}
