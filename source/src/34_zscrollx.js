// Horizontal strips (top resource bar) scroll with the mouse wheel and by dragging on PC.
(function(){const hook=el=>{if(!el||el.__sx)return;el.__sx=1;
  el.addEventListener('wheel',e=>{if(el.scrollWidth<=el.clientWidth)return;const d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;el.scrollLeft+=d;e.preventDefault();},{passive:false});
  let x0=null,s0=0,moved=false;
  el.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;x0=e.clientX;s0=el.scrollLeft;moved=false;});
  window.addEventListener('pointermove',e=>{if(x0===null)return;const dx=e.clientX-x0;if(Math.abs(dx)>4){moved=true;el.classList.add('drag');}if(moved)el.scrollLeft=s0-dx;});
  window.addEventListener('pointerup',()=>{x0=null;setTimeout(()=>el.classList.remove('drag'),0);});
  el.addEventListener('click',e=>{if(moved){e.stopPropagation();e.preventDefault();moved=false;}},true);};
  document.querySelectorAll('.res').forEach(hook);})();
