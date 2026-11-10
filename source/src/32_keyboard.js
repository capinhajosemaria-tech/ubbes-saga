/* =================== keyboard =================== */
const keysHeld=new Set();
const typing=e=>{const t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable);};
document.addEventListener('keydown',e=>{if(typing(e)||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key;
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D'].includes(k)){if(!titleOn){keysHeld.add(k.toLowerCase());e.preventDefault();}return;}
  if(titleOn)return;
  if(k==='Escape'){if(modalOpen)return;if(mode==='road'&&roadA){roadReset();return;}if(mode!=='view'){endMode();return;}closeSheet();return;}
  if(modalOpen)return;
  if(k===' '){e.preventDefault();if(speed>0){speedBefore=speed;setSpeed(0);}else setSpeed(speedBefore||1);return;}
  if(k==='1'){setSpeed(1);return;}if(k==='2'){setSpeed(2);return;}if(k==='3'){setSpeed(4);return;}if(k==='0'){setSpeed(0.5);return;}
  if((k==='r'||k==='R')&&mode==='place'&&place){place.rot=((place.rot|0)+1)%4;lastPlaceKey='';return;}
  if(k==='Enter'&&mode==='place'){confirmPlace();return;}
  if(k==='Enter'&&mode==='road'){confirmRoad();return;}
  if(k==='+'||k==='='){zoom=Math.min(ZMAX,zoom*1.15);return;}if(k==='-'||k==='_'){zoom=Math.max(ZMIN,zoom/1.15);return;}
  if(k==='b'||k==='B'){if(mode!=='view')endMode();openPanel('build');return;}
  if(k==='e'||k==='E'){closeSheet();if(mode==='road')endMode();else startRoad();return;}
  if(k==='h'||k==='H'){const p=iso(HOME_X,HOME_Y);camX=p[0];camY=p[1];return;}
  const P={v:'village',p:'people',g:'war',m:'world',j:'saga'}[k.toLowerCase()];if(P){if(mode!=='view')endMode();openPanel(P);}});
document.addEventListener('keyup',e=>keysHeld.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>keysHeld.clear());
function keyPan(dt){if(!keysHeld.size)return;const v=520*dt/zoom;let dx=0,dy=0;if(keysHeld.has('arrowleft')||keysHeld.has('a'))dx-=v;if(keysHeld.has('arrowright')||keysHeld.has('d'))dx+=v;if(keysHeld.has('arrowup')||keysHeld.has('w'))dy-=v;if(keysHeld.has('arrowdown')||keysHeld.has('s'))dy+=v;camX+=dx;camY+=dy;clampCam();}
