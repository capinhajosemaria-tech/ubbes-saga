/* =================== construction: every building takes time and builders =================== */
/* b.cons = {k:'build'|'up'|'th', days, w (builders wanted), done (days of full crew), lv (target level), builders}
   'build': a new building does nothing until finished. 'up' and 'th': the building keeps working at its old level. */
function consSpec(t){const D=DEF[t],a=D.w*D.h;
  if(t==='th')return {days:3,w:3};
  if(D.cat==='Decor'||a<=1)return {days:0.5,w:1};
  if(a<=4)return {days:1,w:1};
  if(a<=9)return {days:2,w:2};
  return {days:3,w:3};}
const NO_CONS=new Set(['tomb']);   /* Ragnar's Ship-Tomb is raised by its own builders */
const underCons=b=>!!(b.cons&&b.cons.k==='build');
const isBuilt=b=>!underCons(b);
function startCons(b,k,lv){if(NO_CONS.has(b.t)&&k==='build')return;const c=consSpec(b.t);b.cons={k:k,days:c.days,w:c.w,done:0,lv:lv||b.lvl,builders:0};}
/* builders are the Town Hall's builder posts (see 12_workers.js) */
function consTick(gdt){if(!B.some(b=>b.cons))return;
  for(const b of B){const c=b.cons;if(!c)continue;if(c.builders>0)c.done+=gdt/DAY*c.builders/c.w;if(c.done>=c.days)finishCons(b);}}
function finishCons(b){const c=b.cons,D=DEF[b.t];b.cons=null;
  if(c.k==='build'){toast(D.name+' is finished.');}
  else if(c.k==='up'){b.lvl=c.lv;toast(D.name+' reached level '+b.lvl+'.');}
  else if(c.k==='th')finishTH(c.lv);
  assignWorkers();if(typeof checkMilestones==='function')checkMilestones();if(typeof save==='function')save();}
function consStatus(b){const c=b.cons;if(!c)return '';const pc=Math.min(99,Math.floor(100*c.done/c.days));
  const what=c.k==='build'?'Being built':c.k==='th'?'Raising the hall to level '+c.lv:'Upgrading to level '+c.lv;
  return what+': '+pc+'%'+(c.builders?' · '+c.builders+' of '+c.w+' builders':' · waiting for builders');}
function consHtml(b){const c=b.cons;if(!c)return '';const pc=Math.min(99,Math.floor(100*c.done/c.days));
  const left=c.builders?Math.max(0.1,(c.days-c.done)*c.w/c.builders):0;
  return '<div class="outpct"><span class="meta">'+esc(c.k==='build'?'Construction':c.k==='th'?'Raising the hall':'Upgrade')+'</span><span class="bar"><i style="width:'+pc+'%"></i></span><strong>'+pc+'%</strong><span class="meta">'+
    (c.builders?c.builders+' of '+c.w+' builders · about '+(left<1?'less than a day':Math.ceil(left)+' day'+(Math.ceil(left)>1?'s':''))+' left':(builderPrio()<=0?'Builders are stopped: set their priority at the Town Hall':'All builders are busy or needed elsewhere: raise the builders\' priority at the Town Hall'))+'</span></div>';}
