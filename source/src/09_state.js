/* =================== state =================== */
let S,B=[],nextId=1;
let roads=new Uint8Array(N*N),conn=new Uint8Array(N*N),occ=new Int32Array(N*N);
const TH_POS={fx:HOME_X-2,fy:HOME_Y-5};
const has=t=>B.some(b=>b.t===t&&!(b.cons&&b.cons.k==='build'));
const count=t=>B.filter(b=>b.t===t).length;
const herdTotal=()=>S.herd.pigs+S.herd.sheep;
function dims(t,rot){const D=DEF[t];return rot%2?{w:D.h,h:D.w}:{w:D.w,h:D.h};}
const SIDES=['+y','+x','-y','-x'],SIDE_ARROW=['↙','↘','↗','↖'];let DOOR_SIDE=null;
/* Where each building's door is DRAWN at rot 0: side, and its place along that side (0–1). Rot 1 is the mirror picture (x↔y), so the door
   moves to the other front face. Only the two front faces can be seen, so buildings turn between two pictures (the Town Hall square keeps 4).
   A third value 1 = the picture never turns. Kept in step with the art by tools/ui/doorcheck.py (part of check.py). */
const DOOR_AT={house:['+x',0.5],jarl:['+x',0.42],wood:['+x',0.33],carp:['+x',0.3],smith:['+x',0.29],fish:['+x',0.38],pres:['+y',0.21],gran:['+x',0.36],bakery:['+x',0.29],weaver:['+x',0.29],
  trade:['+y',0.78],hives:['+x',0.25],tailor:['+x',0.29],hof:['+x',0.45],mill:['+x',0.75,1],tower:['+x',0.5,1]};
const SIDE_ARR={'+y':'↙','+x':'↘','-y':'↗','-x':'↖'};
function rotTurns(t){return t!=='shipyard'&&!(DOOR_AT[t]&&DOOR_AT[t][2]);}
/* rot 0/1 = the two pictures (mirror x↔y); rot 2/3 = the same pictures with the entrance on the far (hidden) face, so it can face all 4 sides */
function nextRot(t,r){r=r|0;if(!rotTurns(t))return r&1;return (r+1)&3;}
function doorSide(b){const r=(b.rot|0)&3;if(b.t==='th')return SIDES[r];if(b.t==='shipyard'){const o=slipDir(b);return o?(o.alongY?'+x':'+y'):SIDES[r&1];}
  const D=DOOR_AT[b.t];let s0;if(!D)s0=SIDES[r&1];else if(D[2])return D[0];else s0=!(r&1)?D[0]:D[0]==='+x'?'+y':'+x';
  return (r&2)&&rotTurns(b.t)?(s0==='+x'?'-x':'-y'):s0;}
const doorHidden=b=>b.t!=='th'&&b.t!=='shipyard'&&((b.rot|0)&2)&&rotTurns(b.t);
function doorTile(b){const st=sideTiles(b,doorSide(b));if(!st.length)return null;
  if(b.t==='shipyard'){const o=slipDir(b);if(o){/* the boathouse gable, in the row on dry land */const k=o.s>0?0:st.length-1;return st[k];}}
  const D=DOOR_AT[b.t];const fr=D?(doorHidden(b)?1-D[1]:D[1]):0;const k=D?Math.min(st.length-1,Math.max(0,Math.floor(fr*st.length-1e-6))):Math.floor((st.length-1)/2);return st[k];}
/* the shipyard's boathouse row stands on dry shore and its far row (slipway end) lies in the sea: which way does it face? */
function slipDir(b){const L=(x,y)=>inMap(x,y)&&ter[y*N+x]!==T.SEA,Sx=(x,y)=>inMap(x,y)&&ter[y*N+x]===T.SEA,row=(f,n)=>{for(let k=0;k<n;k++)if(!f(k))return false;return true;};
  const c=[{alongY:true,s:1,land:k=>L(b.fx+k,b.fy),sea:k=>Sx(b.fx+k,b.fy+b.h-1),n:b.w},{alongY:true,s:-1,land:k=>L(b.fx+k,b.fy+b.h-1),sea:k=>Sx(b.fx+k,b.fy),n:b.w},
    {alongY:false,s:1,land:k=>L(b.fx,b.fy+k),sea:k=>Sx(b.fx+b.w-1,b.fy+k),n:b.h},{alongY:false,s:-1,land:k=>L(b.fx+b.w-1,b.fy+k),sea:k=>Sx(b.fx,b.fy+k),n:b.h}];
  for(const o of c)if(row(o.land,o.n)&&row(o.sea,o.n))return {alongY:o.alongY,s:o.s};return null;}
function sideTiles(b,side){const o=[];if(side==='+y')for(let x=b.fx;x<b.fx+b.w;x++)o.push([x,b.fy+b.h]);else if(side==='-y')for(let x=b.fx;x<b.fx+b.w;x++)o.push([x,b.fy-1]);else if(side==='+x')for(let y=b.fy;y<b.fy+b.h;y++)o.push([b.fx+b.w,y]);else for(let y=b.fy;y<b.fy+b.h;y++)o.push([b.fx-1,y]);return o;}
function doorOnFace(a,b,wh){const m=lerp(a,b,0.5),dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,ux=dx/L*5.6,uy=dy/L*5.6,h=Math.min(14,wh-3);poly([m[0]-ux,m[1]-uy,m[0]+ux,m[1]+uy,m[0]+ux,m[1]+uy-h,m[0]-ux,m[1]-uy-h],'#3C2E24');poly([m[0]-ux*0.7,m[1]-uy*0.7+1,m[0]+ux*0.7,m[1]+uy*0.7+1,m[0]+ux*0.7,m[1]+uy*0.7-1,m[0]-ux*0.7,m[1]-uy*0.7-1],'#6E543D');}
function addBuilding(t,fx,fy,rot,silent){const d=dims(t,rot);const b={id:nextId++,t:t,fx:fx,fy:fy,rot:rotTurns(t)?(rot|0)&3:(rot|0)&1,w:d.w,h:d.h,lvl:1,desired:0,workers:0,anvil:100,mode:'tools',proj:null,status:'',made:'',conn:false};if(t==='tower'&&typeof walls!=='undefined'&&inMap(fx,fy))walls[fy*N+fx]=3;B.push(b);if(!silent){rebuildOcc();recomputeConn();}return b;}
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
