/* =================== construction sites: scaffolding and progress =================== */
/* a building being built: trodden earth, a timber floor, posts and rails that rise with progress, rafters near the end, a plank pile */
function drawScaffold(b,win,alpha){const c=b.cons,pr=Math.min(1,c.done/c.days),e=elev[b.fy*N+b.fx]||2;
  if(alpha<1)ctx.globalAlpha=alpha;ctx.save();ctx.translate(0,-e);
  const F=fp(b),H=14+8*Math.min(b.w,b.h),h=H*Math.max(0.15,pr);
  /* trodden earth and the floor */
  poly([F.T[0],F.T[1],F.R[0],F.R[1],F.Bt[0],F.Bt[1],F.L[0],F.L[1]],win?'#C9CFD2':'#8C7356');
  const ins=(p,q,k)=>[p[0]+(q[0]-p[0])*k,p[1]+(q[1]-p[1])*k];
  const C=[F.T,F.R,F.Bt,F.L],mid=[(F.T[0]+F.Bt[0])/2,(F.T[1]+F.Bt[1])/2],I=C.map(p=>ins(p,mid,0.18));
  poly([I[0][0],I[0][1],I[1][0],I[1][1],I[2][0],I[2][1],I[3][0],I[3][1]],win?'#B7A58C':'#B08A5E');
  ctx.strokeStyle=win?'#8F7D66':'#8A6A45';ctx.lineWidth=0.6;
  for(let k=1;k<6;k++){const a=ins(I[0],I[1],k/6),d=ins(I[3],I[2],k/6);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(d[0],d[1]);ctx.stroke();}
  /* posts at the corners and along the edges, rails every few pixels */
  const posts=[];for(let s=0;s<4;s++){const p=I[s],q=I[(s+1)%4],n=Math.max(1,Math.round(Math.hypot(q[0]-p[0],q[1]-p[1])/22));for(let k=0;k<n;k++)posts.push(ins(p,q,k/n));}
  const wood=win?'#7C6650':'#6E5034',lite=win?'#A58E73':'#9C7650';
  /* back posts first (smaller y), then front */
  posts.slice().sort((a,c)=>a[1]-c[1]).forEach(p=>{ctx.fillStyle=wood;ctx.fillRect(p[0]-1,p[1]-h,2,h);ctx.fillStyle=lite;ctx.fillRect(p[0]-1,p[1]-h,0.8,h);});
  ctx.strokeStyle=lite;ctx.lineWidth=1.1;
  for(let y=8;y<=h;y+=9){ctx.beginPath();for(let s=0;s<4;s++){const p=I[s];if(s===0)ctx.moveTo(p[0],p[1]-y);else ctx.lineTo(p[0],p[1]-y);}ctx.closePath();ctx.stroke();}
  /* a ladder on the front corner and diagonal braces */
  ctx.strokeStyle=wood;ctx.lineWidth=0.8;const fr=I[2];
  ctx.beginPath();ctx.moveTo(fr[0]-6,fr[1]+1);ctx.lineTo(fr[0]-3,fr[1]-h*0.9);ctx.moveTo(fr[0]-2,fr[1]+1);ctx.lineTo(fr[0]+1,fr[1]-h*0.9);for(let y=4;y<h*0.9;y+=4){ctx.moveTo(fr[0]-6+3*y/(h*0.9),fr[1]+1-y);ctx.lineTo(fr[0]-2+3*y/(h*0.9),fr[1]+1-y);}ctx.stroke();
  ctx.beginPath();ctx.moveTo(I[3][0],I[3][1]);ctx.lineTo(I[2][0],I[2][1]-h);ctx.moveTo(I[2][0],I[2][1]);ctx.lineTo(I[1][0],I[1][1]-h);ctx.stroke();
  /* rafters once the walls stand */
  if(pr>0.6){const rh=h+H*0.45*(pr-0.6)/0.4,ra=ins(I[0],I[3],0.5),rb=ins(I[1],I[2],0.5);ctx.strokeStyle=wood;ctx.lineWidth=1.3;
    ctx.beginPath();ctx.moveTo(ra[0],ra[1]-rh);ctx.lineTo(rb[0],rb[1]-rh);ctx.stroke();ctx.lineWidth=0.9;
    for(let k=0;k<=4;k++){const r=ins(ra,rb,k/4),a=ins(I[0],I[1],k/4),d=ins(I[3],I[2],k/4);ctx.beginPath();ctx.moveTo(a[0],a[1]-h);ctx.lineTo(r[0],r[1]-rh);ctx.lineTo(d[0],d[1]-h);ctx.stroke();}}
  /* plank pile by the front corner */
  const pl=ins(F.Bt,F.L,0.25);for(let k=0;k<3;k++){poly([pl[0]-9,pl[1]-k*2,pl[0]+3,pl[1]-6-k*2,pl[0]+6,pl[1]-4.5-k*2,pl[0]-6,pl[1]+1.5-k*2],k%2?lite:'#B98E5E');}
  ctx.restore();if(alpha<1)ctx.globalAlpha=1;
  if(!b.thumb)drawConsBar(b,pr);}
/* progress bar over a construction site, an upgrade or the hall being raised */
function drawConsBar(b,pr){if(zoom<0.45)return;const e=elev[b.fy*N+b.fx]||2,p=iso(b.fx+b.w/2-0.5,b.fy+b.h/2-0.5),y=p[1]-e-24-6*Math.min(b.w,b.h),w=26;
  ctx.fillStyle='rgba(38,48,53,0.82)';ctx.fillRect(p[0]-w/2-1.5,y-1.5,w+3,6);ctx.fillStyle='#C9A64A';ctx.fillRect(p[0]-w/2,y,w*pr,3);
  if(!b.cons.builders){ctx.fillStyle='#F3F5F3';ctx.font='bold 7px "Marcellus SC", serif';ctx.textAlign='center';ctx.textBaseline='bottom';ctx.fillText('waiting for builders',p[0],y-2);}}
