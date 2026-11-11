/* =================== noise & terrain =================== */
function h2(x,y,s){let n=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul((s||0)|0,982451653))|0;n=Math.imul(n^(n>>>13),1274126177);n^=n>>>16;return (n>>>0)/4294967295;}
function vn(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);const a=h2(xi,yi,s),b=h2(xi+1,yi,s),c=h2(xi,yi+1,s),d=h2(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
/* Map plan (world tile coords; HOME=(63,60)): "the fjord" (Beta 0.12). Kaldstrand sits at the head of a narrow fjord
   that winds south-east to the open sea; cliffs flank the outer fjord, a range closes the north, a river comes down
   from it and enters the fjord by the village. An iron knoll lies just north-west of the village, a ridge runs
   south-west, islands sit at the fjord mouth and a lake in the western woods. The starting land always holds iron,
   berries, forest and water (see the guarantee below). */
const fbm=(x,y,s)=>vn(x,y,s)*.6+vn(x*2.1,y*2.1,s+1)*.28+vn(x*4.3,y*4.3,s+2)*.12;
function dPoly(x,y,P){let m=1e9;for(let i=0;i<P.length-1;i++){const a=P[i][0],b=P[i][1],c=P[i+1][0],d=P[i+1][1];const vx=c-a,vy=d-b,l=vx*vx+vy*vy;let t=((x-a)*vx+(y-b)*vy)/l;t=t<0?0:t>1?1:t;m=Math.min(m,Math.hypot(a+t*vx-x,b+t*vy-y));}return m;}
const FJORD=[[70,63],[76,67],[82,70],[88,76],[92,84],[100,90],[110,96],[122,104],[140,112]];
const RIVERS=[{p:[[58,30],[60,38],[62,45],[67,49],[71,53],[72,58],[71,62]],w:0.8},{p:[[95,44],[93,52],[90,60],[88,70],[86,74]],w:0.7}];
const LAKES=[[40,52,5,3.5]];
const ISLES=[[100,98,4,2.6],[112,104,3,2],[94,88,2.2,1.6],[118,118,6,4],[86,112,5,3.2]];
function seaDepth(X,Y){const d=dPoly(X,Y,FJORD);const t=Math.min(1,Math.max(0,(X-70)/70));const w=2.6+t*13+(vn(X*.12,Y*.12,11)-.5)*3;
  return Math.max(w-d,(Y-112)+(vn(X*.08,0,12)-.5)*8,(X-118)+(vn(0,Y*.08,13)-.5)*8);}
function massDepth(X,Y){const nz=(fbm(X*.06,Y*.06,21)-.5)*6;const df=dPoly(X,Y,FJORD);let d=-20;
  if(X>78)d=Math.max(d,6-Math.abs(df-11)*.9+nz-(X<88?(88-X)*.5:0));           /* cliffs along the outer fjord */
  d=Math.max(d,(30-Y)*.55+nz+3*Math.sin(X*.13));                              /* northern range */
  d=Math.max(d,(1-Math.hypot((X-46)/9,(Y-43)/7))*16+nz*.6);                    /* iron knoll north-west of the village */
  d=Math.max(d,(1-Math.hypot((X-28-(Y-70)*.6)/6,(Y-70)/16))*11+nz);            /* south-western ridge */
  return d;}
const ter=new Uint8Array(N*N), elev=new Float32Array(N*N), mdep=new Float32Array(N*N);
for(let Y=0;Y<N;Y++)for(let X=0;X<N;X++){const sd=seaDepth(X,Y),d=massDepth(X,Y);let t;
  if(sd>0){t=T.SEA;for(const I of ISLES){const q=((X-I[0])/I[2])**2+((Y-I[1])/I[3])**2+(vn(X*.4,Y*.4,72)-.5)*.5;if(q<1)t=q>.6?T.BEACH:(h2(X,Y,73)>.45?T.FOREST:T.GRASS);}}
  else if(sd>-1.4)t=T.BEACH;else if(d>1)t=T.MOUNT;else if(d>-1.2)t=T.FOOT;else t=T.GRASS;
  ter[Y*N+X]=t;mdep[Y*N+X]=d;}
for(const R of RIVERS)for(let Y=0;Y<N;Y++)for(let X=0;X<N;X++){const t=ter[Y*N+X];if(t===T.SEA||t===T.MOUNT)continue;if(dPoly(X+.5,Y+.5,R.p)<R.w)ter[Y*N+X]=T.RIVER;}
for(const L of LAKES)for(let Y=0;Y<N;Y++)for(let X=0;X<N;X++){const i=Y*N+X;if(ter[i]===T.MOUNT)continue;const q=((X-L[0])/L[2])**2+((Y-L[1])/L[3])**2+(vn(X*.45,Y*.45,74)-.5)*.6;if(q<1)ter[i]=T.SEA;else if(q<1.25&&ter[i]===T.GRASS&&h2(X,Y,81)>.5)ter[i]=T.BEACH;}
for(let Y=0;Y<N;Y++)for(let X=0;X<N;X++){const i=Y*N+X;let t=ter[i];
  if(t===T.FOOT){const near=Math.hypot(X-49,Y-46)<10||Math.hypot(X-84,Y-56)<10;if(h2(X,Y,3)>(near?.45:.8))t=T.IRON;}
  if(t===T.GRASS){const f=fbm(X*.09,Y*.09,31);
    if((X<54&&f>.42)||(Y<44&&f>.4)||(X>74&&Y<62&&f>.44)||(f>.62&&h2(X,Y,4)>.85))t=T.FOREST;
    else if(vn(X*.3,Y*.3,5)>.74&&Math.hypot(X-HOME_X,Y-HOME_Y)<26)t=T.BERRY;}
  ter[i]=t;}
/* keep the village core an open meadow */
for(let Y=HOME_Y-9;Y<=HOME_Y+6;Y++)for(let X=HOME_X-11;X<=HOME_X+9;X++){const i=Y*N+X;if((ter[i]===T.FOREST||ter[i]===T.BERRY)&&((X-HOME_X)/11)**2+((Y-HOME_Y+1.5)/7.5)**2<1)ter[i]=T.GRASS;}
/* guarantee: the starting land (zones 8–12 × 7–11 minus corners) has iron, berries and forest near the village */
function startStamp(cx,cy,r,kind){for(let Y=Math.floor(cy-r-1);Y<=cy+r+1;Y++)for(let X=Math.floor(cx-r-1);X<=cx+r+1;X++){const i=Y*N+X,q=Math.hypot((X-cx)/r,(Y-cy)/(r*.8))+(vn(X*.6,Y*.6,90)-.5)*.35;if(q>=1)continue;const t=ter[i];if(t===T.SEA||t===T.RIVER||t===T.BEACH)continue;
  if(kind==='iron'){ter[i]=h2(X,Y,91)<.55?T.IRON:T.FOOT;mdep[i]=0;}
  else if(kind==='berry'){if(t===T.GRASS&&h2(X,Y,92)<.75)ter[i]=T.BERRY;}
  else if(t===T.GRASS||t===T.BERRY)ter[i]=T.FOREST;}}
{const near=(k,r)=>{let n=0;for(let Y=HOME_Y-r;Y<=HOME_Y+r;Y++)for(let X=HOME_X-r;X<=HOME_X+r;X++)if(ter[Y*N+X]===k&&Math.hypot(X-HOME_X,Y-HOME_Y)<=r)n++;return n;};
  if(near(T.IRON,14)<10)startStamp(54,52,3.3,'iron');
  if(near(T.BERRY,12)<10){startStamp(56,63,2.4,'berry');startStamp(69,52,2.4,'berry');}
  if(near(T.FOREST,12)<40)startStamp(52,56,4.5,'forest');}
/* ocean = sea joined to the map edge (raiders land only there, never on the lake) */
const OCEAN=new Uint8Array(N*N);{const q=[];for(let i=0;i<N;i++)for(const j of [i,(N-1)*N+i,i*N,i*N+N-1])if(ter[j]===T.SEA&&!OCEAN[j]){OCEAN[j]=1;q.push(j);}
  while(q.length){const j=q.pop(),x=j%N,y=(j/N)|0;for(const s of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+s[0],yy=y+s[1];if(xx<0||yy<0||xx>=N||yy>=N)continue;const k=yy*N+xx;if(!OCEAN[k]&&ter[k]===T.SEA){OCEAN[k]=1;q.push(k);}}}}
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
