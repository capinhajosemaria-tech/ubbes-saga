/* =================== natural objects =================== */
const objs=[],trees=[],bushes=[];
for(let y=0;y<N;y++)for(let x=0;x<N;x++){
  const t=ter[y*N+x];if(Math.min(x,y,N-1-x,N-1-y)<4)continue;
  if(t===T.FOREST){const n=h2(x,y,7)>0.55?2:1;for(let k=0;k<n;k++){const r=h2(x,y,20+k);const kind=r<0.55?'spruce':r<0.85?'pine':'birch';
    const o={x:x,y:y,d:x+y+0.1*k,kind:'tree',sp:kind,ox:(h2(x,y,30+k)-0.5)*24,oy:(h2(x,y,40+k)-0.5)*10,s:0.3+h2(x,y,50+k)*0.1,amt:20,regrow:0};objs.push(o);trees.push(o);}}
  else if(t===T.BERRY){const o={x:x,y:y,d:x+y,kind:'bush',ox:(h2(x,y,31)-0.5)*10,oy:0,s:0.42,amt:15};objs.push(o);bushes.push(o);}
  else if(t===T.MOUNT){if(h2(x,y,8)>0.9&&elev[y*N+x]<60)objs.push({x:x,y:y,d:x+y,kind:'rocks'});}
  else if(t===T.IRON)objs.push({x:x,y:y,d:x+y,kind:'iron'});
}
objs.sort((a,b)=>a.d-b.d);
const TER0=ter.slice();
function clearForest(i,silent){const x=i%N,y=(i/N)|0;let wood=0;for(const t of trees)if(t.x===x&&t.y===y){wood+=t.amt;t.amt=0;t.regrow=-1;t.gone=1;}ter[i]=T.GRASS;if(!silent){if(!S.cleared.includes(i))S.cleared.push(i);}return wood;}
const REGROW=60, TREE_WOOD=25; /* a felled tree grows back in 60 days (≈1.3 years) */
