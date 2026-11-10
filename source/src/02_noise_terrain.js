/* =================== noise & terrain =================== */
function h2(x,y,s){let n=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul((s||0)|0,982451653))|0;n=Math.imul(n^(n>>>13),1274126177);n^=n>>>16;return (n>>>0)/4294967295;}
function vn(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);const a=h2(xi,yi,s),b=h2(xi+1,yi,s),c=h2(xi,yi+1,s),d=h2(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
/* Map plan (in base coords; the world adds a margin O): town core on a flat meadow west of the river,
   bay to the south-east, mountain spur to the north. River + bay + spur close three sides for a future wall. */
const coast0=x=>61+2*Math.sin(x*0.2)+1.5*Math.sin(x*0.07+1.3)-22*Math.exp(-(((x-39)/8)**2));
const mount0=x=>6.5+1.5*Math.sin(x*0.25+2)+Math.sin(x*0.12)+18.5*Math.exp(-(((x-30)/4.5)**2));
const river0=y=>41+1.5*Math.sin(y*0.15+0.5);
const mountW=x=>mount0(x-OX)+OY;
const ter=new Uint8Array(N*N), elev=new Float32Array(N*N);
for(let Y=0;Y<N;Y++)for(let X=0;X<N;X++){
  const x=X-OX,y=Y-OY,c=coast0(x),m=mount0(x);let t;
  if(y>c)t=T.SEA;else if(y>c-1.6)t=T.BEACH;else if(y<m-1)t=T.MOUNT;else if(y<m+1.2)t=T.FOOT;else t=T.GRASS;
  if(t!==T.SEA&&t!==T.MOUNT&&y>m-1.5&&Math.abs(x-river0(y))<0.8)t=T.RIVER;
  if(t===T.FOOT&&h2(X,Y,3)>(Math.abs(x-30)<6?0.3:0.55))t=T.IRON;
  if(t===T.GRASS){const fn=vn(x*0.15,y*0.15,1);const west=x<13+4*vn(x*0.06,y*0.06,2);const ne=x>52&&y<26;
    const grove=((x-22)**2)/10+((y-34)**2)/32<1;
    if((west||ne)&&fn>0.32)t=T.FOREST;else if(grove&&fn>0.18)t=T.FOREST;else if(fn>0.55&&h2(X,Y,4)>0.9)t=T.FOREST;
    else if(vn(x*0.3,y*0.3,5)>0.76&&x<44)t=T.BERRY;}
  if(x>=26&&x<=40&&y>=26&&y<=46&&(t===T.FOREST||t===T.BERRY))t=T.GRASS;
  if((x-28)**2+(y-40)**2<3.2&&t===T.GRASS)t=T.BERRY;
  ter[Y*N+X]=t;
}
function elevOf(t,X,Y){switch(t){case T.SEA:return -8;case T.RIVER:return -3;case T.BEACH:return 0;case T.FOOT:case T.IRON:return 7;case T.MOUNT:{const d=mountW(X)-Y;return Math.min(80,12+d*7+vn(X*0.3,Y*0.3,6)*10);}default:return 2;}}
for(let y=0;y<N;y++)for(let x=0;x<N;x++)elev[y*N+x]=elevOf(ter[y*N+x],x,y);
const inMap=(x,y)=>x>=0&&y>=0&&x<N&&y<N;
const tAt=(x,y)=>inMap(x,y)?ter[y*N+x]:-1;
