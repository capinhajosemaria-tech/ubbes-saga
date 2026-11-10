/* =================== particles =================== */
const smoke=[];let smokeTimer=0;
const flakes=[];for(let i=0;i<140;i++)flakes.push({x:Math.random(),y:Math.random(),s:0.6+Math.random()*1.6,v:12+Math.random()*24,p:Math.random()*6});
function smokeSources(){const out=[];for(const b of B){const e=elev[b.fy*N+b.fx]||2;const p=iso(b.fx+b.w/2-0.5,b.fy+b.h/2-0.5);
  if(b.t==='th'){const q=iso(b.fx+1.5,b.fy+1.5);out.push([q[0]-12,q[1]-e-92]);}else if(b.t==='house')out.push([p[0],p[1]-e-40]);else if(b.t==='jarl')out.push([p[0],p[1]-e-46]);
  else if(['smith','pres','smoke','bakery','salt'].includes(b.t)&&b.status==='Working')out.push([p[0]-4,p[1]-e-30]);}return out;}
