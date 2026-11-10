/* =================== noise & terrain =================== */
function h2(x,y,s){let n=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul((s||0)|0,982451653))|0;n=Math.imul(n^(n>>>13),1274126177);n^=n>>>16;return (n>>>0)/4294967295;}
function vn(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);const a=h2(xi,yi,s),b=h2(xi+1,yi,s),c=h2(xi,yi+1,s),d=h2(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
/* Map plan (in base coords; the world adds a margin O): town core on a flat meadow west of the river,
   bay to the south-east, mountain spur to the north. River + bay + spur close three sides for a future wall. */
const coast0=x=>61+2*Math.sin(x*0.2)+1.5*Math.sin(x*0.07+1.3)-22*Math.exp(-(((x-39)/8)**2));
const mount0=x=>3+1.5*Math.sin(x*0.25+2)+Math.sin(x*0.12)+10*Math.exp(-(((x-30)/3.6)**2));
const river0=y=>41+1.5*Math.sin(y*0.15+0.5);
const mountW=x=>mount0(x-OX)+OY;
const ter=new Uint8Array(N*N), elev=new Float32Array(N*N), mdep=new Float32Array(N*N);
/* Massifs: the northern range (with its spur) and an eastern table-mountain. depth>0 = inside the rock. */
function massDepth(x,y){const nz=(vn(x*0.09,y*0.09,71)-0.5)*5;
  let d=mount0(x)-y+nz;                                     /* northern range + spur */
  const ex=(x-90)/10,ey=(y-14)/7;d=Math.max(d,(1-Math.sqrt(ex*ex+ey*ey))*8+nz); /* eastern peak */
  const wx=(x+18)/9,wy=(y-6)/8;d=Math.max(d,(1-Math.sqrt(wx*wx+wy*wy))*7+nz);     /* western knoll */
  return d;}
const ISLES=[[64,84,7,4.5],[86,76,4,3],[24,90,5,3.5],[100,96,6,4],[44,100,3,2.5]];
for(let Y=0;Y<N;Y++)for(let X=0;X<N;X++){
  const x=X-OX,y=Y-OY,c=coast0(x),d=massDepth(x,y);let t;
  if(y>c){t=T.SEA;for(const I of ISLES){const q=((x-I[0])/I[2])**2+((y-I[1])/I[3])**2+(vn(x*0.4,y*0.4,72)-0.5)*0.5;if(q<1)t=q>0.62?T.BEACH:(h2(X,Y,73)>0.45?T.FOREST:T.GRASS);}}
  else if(y>c-1.6)t=T.BEACH;else if(d>1)t=T.MOUNT;else if(d>-1.2)t=T.FOOT;else t=T.GRASS;
  if(t!==T.SEA&&t!==T.MOUNT&&d<-0.5&&y<c-1&&Math.abs(x-river0(y))<0.8)t=T.RIVER;
  if(t===T.FOOT&&h2(X,Y,3)>(Math.abs(x-30)<6||Math.abs(x-86)<10?0.3:0.6))t=T.IRON;
  if(t===T.GRASS){const fn=vn(x*0.15,y*0.15,1);const west=x<13+4*vn(x*0.06,y*0.06,2);const ne=x>52&&y<40;
    const grove=((x-22)**2)/10+((y-34)**2)/32<1;
    if((west||ne)&&fn>0.32)t=T.FOREST;else if(grove&&fn>0.18)t=T.FOREST;else if(fn>0.55&&h2(X,Y,4)>0.9)t=T.FOREST;
    else if(vn(x*0.3,y*0.3,5)>0.76&&x<44)t=T.BERRY;}
  /* a tarn in the western woods */
  if(t!==T.MOUNT&&((x+12)/5.5)**2+((y-40)/4)**2+(vn(x*0.5,y*0.5,74)-0.5)*0.6<1)t=T.SEA;
  if(x>=26&&x<=40&&y>=26&&y<=46&&(t===T.FOREST||t===T.BERRY))t=T.GRASS;
  if((x-28)**2+(y-40)**2<3.2&&t===T.GRASS)t=T.BERRY;
  ter[Y*N+X]=t;mdep[Y*N+X]=d;
}
/* Massifs are one continuous low-poly heightfield: a gentle foot, a short cliff band, then ridged peaks with valleys between (no flat table top). */
const sat=v=>v<0?0:v>1?1:v;const sstep=(a,b,v)=>{const k=sat((v-a)/(b-a));return k*k*(3-2*k);};
function mountH(X,Y,d){const n1=vn(X*0.11,Y*0.11,75),n2=vn(X*0.37,Y*0.37,76);
  const r=1-Math.abs(2*vn(X*0.16,Y*0.16,78)-1);
  return 8+12*sat(d/2.5)+(24+26*n1)*sstep(2.5,6,d)+(18+30*n1)*sstep(5,10,d)*r*r+n2*6;}
function elevOf(t,X,Y){switch(t){case T.SEA:return -8;case T.RIVER:return -3;case T.BEACH:return 0;case T.FOOT:case T.IRON:return 6;case T.MOUNT:return mountH(X,Y,mdep[Y*N+X]);default:return 2;}}
for(let y=0;y<N;y++)for(let x=0;x<N;x++)elev[y*N+x]=elevOf(ter[y*N+x],x,y);
/* corner heights shared by neighbouring tiles (only rock tiles use them) */
const cornerH=new Float32Array((N+1)*(N+1));
for(let cy=0;cy<=N;cy++)for(let cx=0;cx<=N;cx++){let m=1e9,s2=0,k=0;for(const q of [[cx-1,cy-1],[cx,cy-1],[cx-1,cy],[cx,cy]]){const x=Math.min(N-1,Math.max(0,q[0])),y=Math.min(N-1,Math.max(0,q[1]));const e=elev[y*N+x];m=Math.min(m,e);s2+=e;k++;}
  cornerH[cy*(N+1)+cx]=m<20?m:(m*0.6+s2/k*0.4);}
const inMap=(x,y)=>x>=0&&y>=0&&x<N&&y<N;
const tAt=(x,y)=>inMap(x,y)?ter[y*N+x]:-1;
