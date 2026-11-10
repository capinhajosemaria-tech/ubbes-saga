/* =================== canvas & camera =================== */
const cv=document.getElementById('map');let ctx=cv.getContext('2d');
let W=0,H=0,dpr=1;
function resize(){dpr=Math.min(2,window.devicePixelRatio||1);W=window.innerWidth;H=window.innerHeight;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);}
window.addEventListener('resize',resize);resize();
const iso=(x,y)=>[(x-y)*HW,(x+y)*HH];
let zoom=Math.min(1.1,Math.max(0.6,W/520)),camX=iso(HOME_X,HOME_Y)[0],camY=iso(HOME_X,HOME_Y)[1];
const ZMIN=0.3,ZMAX=2.4;
function clampCam(){camX=Math.max(-N*HW,Math.min(N*HW,camX));camY=Math.max(0,Math.min(2*N*HH,camY));}
function s2w(px,py){return [(px-W/2)/zoom+camX,(py-H/2)/zoom+camY];}
function w2t(wx,wy){return [Math.round((wy/HH+wx/HW)/2),Math.round((wy/HH-wx/HW)/2)];}
let speed=1,t=0,last=performance.now();
