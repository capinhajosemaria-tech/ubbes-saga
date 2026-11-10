/* =================== state =================== */
let S,B=[],nextId=1;
let roads=new Uint8Array(N*N),conn=new Uint8Array(N*N),occ=new Int32Array(N*N);
const TH_POS={fx:49,fy:43};
const has=t=>B.some(b=>b.t===t);
const count=t=>B.filter(b=>b.t===t).length;
const herdTotal=()=>S.herd.pigs+S.herd.sheep;
function dims(t,rot){const D=DEF[t];return rot%2?{w:D.h,h:D.w}:{w:D.w,h:D.h};}
const SIDES=['+y','+x','-y','-x'],SIDE_ARROW=['↙','↘','↗','↖'];let DOOR_SIDE=null;
function sideTiles(b,side){const o=[];if(side==='+y')for(let x=b.fx;x<b.fx+b.w;x++)o.push([x,b.fy+b.h]);else if(side==='-y')for(let x=b.fx;x<b.fx+b.w;x++)o.push([x,b.fy-1]);else if(side==='+x')for(let y=b.fy;y<b.fy+b.h;y++)o.push([b.fx+b.w,y]);else for(let y=b.fy;y<b.fy+b.h;y++)o.push([b.fx-1,y]);return o;}
function doorOnFace(a,b,wh){const m=lerp(a,b,0.5),dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,ux=dx/L*5.6,uy=dy/L*5.6,h=Math.min(14,wh-3);poly([m[0]-ux,m[1]-uy,m[0]+ux,m[1]+uy,m[0]+ux,m[1]+uy-h,m[0]-ux,m[1]-uy-h],'#3C2E24');poly([m[0]-ux*0.7,m[1]-uy*0.7+1,m[0]+ux*0.7,m[1]+uy*0.7+1,m[0]+ux*0.7,m[1]+uy*0.7-1,m[0]-ux*0.7,m[1]-uy*0.7-1],'#6E543D');}
function addBuilding(t,fx,fy,rot,silent){const d=dims(t,rot);const b={id:nextId++,t:t,fx:fx,fy:fy,rot:(rot|0)&3,w:d.w,h:d.h,lvl:1,desired:0,workers:0,anvil:100,mode:'tools',proj:null,status:'',made:'',conn:false};B.push(b);if(!silent){rebuildOcc();recomputeConn();}return b;}
function rebuildOcc(){occ.fill(0);for(const b of B)for(let y=b.fy;y<b.fy+b.h;y++)for(let x=b.fx;x<b.fx+b.w;x++)if(inMap(x,y))occ[y*N+x]=b.id;sortBuildings();}
function edgeTiles(b){const out=[];for(let x=b.fx-1;x<=b.fx+b.w;x++)for(let y=b.fy-1;y<=b.fy+b.h;y++){const inside=x>=b.fx&&x<b.fx+b.w&&y>=b.fy&&y<b.fy+b.h;const corner=(x<b.fx||x>=b.fx+b.w)&&(y<b.fy||y>=b.fy+b.h);if(!inside&&!corner&&inMap(x,y))out.push([x,y]);}return out;}
function recomputeConn(){
  conn.fill(0);const th=B.find(b=>b.t==='th');const q=[];
  const seed=(x,y)=>{if(inMap(x,y)&&roads[y*N+x]&&!conn[y*N+x]){conn[y*N+x]=1;q.push(y*N+x);}};
  if(th)edgeTiles(th).forEach(p=>seed(p[0],p[1]));
  while(q.length){const i=q.pop(),x=i%N,y=(i/N)|0;seed(x+1,y);seed(x-1,y);seed(x,y+1);seed(x,y-1);}
  for(const b of B){b.conn=b.t==='th'||edgeTiles(b).some(p=>conn[p[1]*N+p[0]]);}
}
let BS=[];function sortBuildings(){BS=B.slice().sort((a,b)=>(a.fx+a.w+a.fy+a.h)-(b.fx+b.w+b.fy+b.h));}
