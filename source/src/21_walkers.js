/* =================== walkers =================== */
/* shields: ours red with a pale boss; raiders black and yellow, quartered */
const SHIELD_OURS=['#A34A3A','#D7CDB4'],SHIELD_RAID=['#24282C','#D9B44A',1];
const walkers=[];const pal=[['#5E7F8C','#B5733F'],['#8E5A4E','#D9B26A'],['#7C8A6A','#6E4A2E'],['#4B6A76','#9A6A40'],['#6E5248','#C29A55'],['#5E7F8C','#9A6A40'],['#7C8A6A','#D9B26A'],['#8E5A4E','#6E4A2E']];
function walkable(x,y){if(!inMap(x,y))return false;const i=y*N+x,tt=ter[i];if(occ[i])return false;return (tt===T.GRASS||tt===T.BEACH||tt===T.FOOT||roads[i])&&isUnl(x,y);}
function pickTarget(w){for(let k=0;k<30;k++){const tx=Math.round(HOME_X-9+Math.random()*18),ty=Math.round(HOME_Y-9+Math.random()*14);if(walkable(tx,ty)){w.tx=tx;w.ty=ty;return;}}w.tx=w.x;w.ty=w.y;}
function syncWalkers(){const want=Math.min(10,Math.max(3,Math.ceil(S.pop/2)));while(walkers.length<want){const i=walkers.length;const w={x:HOME_X,y:HOME_Y+2,tx:HOME_X,ty:HOME_Y+2,wait:i*0.5,c:pal[i%pal.length],ph:Math.random()*6,carry:i===1?'log':i===3?'basket':null,moving:false};pickTarget(w);walkers.push(w);}while(walkers.length>want)walkers.pop();}
function drawWalker(w,win){
  const p=iso(w.x,w.y),sx=p[0],sy=p[1]-2,k=0.3,mv=w.moving?Math.sin(w.ph*9):0;
  ctx.save();ctx.translate(sx-20*k,sy-80*k);ctx.scale(k,k);
  ctx.fillStyle='rgba(38,48,53,0.16)';ctx.beginPath();ctx.ellipse(20,79,14,4,0,0,6.3);ctx.fill();
  ctx.strokeStyle='#6B5A48';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(17,50);ctx.lineTo(17-4*mv,76);ctx.moveTo(23,50);ctx.lineTo(23+4*mv,76);ctx.stroke();
  poly([12,22,28,22,31,52,9,52],w.c[0]);poly([20,22,28,22,31,52,20,52],'rgba(38,48,53,0.15)');
  ctx.fillStyle='#3F332A';ctx.fillRect(10,40,20,4);
  ctx.strokeStyle=w.c[0];ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(13,26);ctx.lineTo(10+3*mv,44);ctx.moveTo(27,26);ctx.lineTo(30-3*mv,44);ctx.stroke();
  ctx.fillStyle='#E2B99A';ctx.beginPath();ctx.arc(20,13,7,0,6.3);ctx.fill();
  ctx.fillStyle=w.c[1];ctx.beginPath();ctx.moveTo(13,12);ctx.quadraticCurveTo(20,2,27,12);ctx.closePath();ctx.fill();
  if(win){poly([10,22,30,22,31,32,9,32],'#7A6A58');}
  if(w.carry==='spear'){ctx.strokeStyle='#5A4636';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(32,48);ctx.lineTo(36,-8);ctx.stroke();poly([33,-6,39,-6,36,-16],'#B7BCBF');const sh=w.sh||SHIELD_OURS;ctx.fillStyle=sh[0];ctx.beginPath();ctx.arc(6,34,8,0,6.3);ctx.fill();if(sh[2]){ctx.fillStyle=sh[1];ctx.beginPath();ctx.moveTo(6,34);ctx.arc(6,34,8,-1.571,0);ctx.closePath();ctx.moveTo(6,34);ctx.arc(6,34,8,1.571,3.142);ctx.closePath();ctx.fill();ctx.fillStyle='#2A2522';}else ctx.fillStyle=sh[1];ctx.beginPath();ctx.arc(6,34,2.5,0,6.3);ctx.fill();ctx.strokeStyle='#2A2522';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(6,34,8,0,6.3);ctx.stroke();}
  if(w.carry==='log'){poly([2,16,38,8,40,15,4,22],'#8A6E52');ctx.fillStyle='#D2B98F';ctx.beginPath();ctx.arc(39,11.5,4,0,6.3);ctx.fill();}
  if(w.carry==='basket'){poly([28,42,42,42,40,54,30,54],'#A88A69');if(!win){ctx.fillStyle='#9E3B3B';ctx.beginPath();ctx.arc(32,41,2,0,6.3);ctx.arc(36,40,2,0,6.3);ctx.arc(39,41,2,0,6.3);ctx.fill();}}
  ctx.lineCap='butt';ctx.restore();
}
