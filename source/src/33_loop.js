/* =================== loop =================== */
let hudT=0;
function frame(now){const dt=Math.min(0.05,(now-last)/1000);last=now;t+=dt;update(dt);syncWalkersMaybe();render();keyPan(dt);if(titleOn){camX+=dt*7;if(camX>iso(76,40)[0])camX=iso(30,60)[0];}hudT-=dt;if(hudT<=0){hudT=0.25;hud();updatePlaceBar();modalTick();}requestAnimationFrame(frame);}
let wsT=0;function syncWalkersMaybe(){wsT++;if(wsT%120===0)syncWalkers();}
requestAnimationFrame(frame);
