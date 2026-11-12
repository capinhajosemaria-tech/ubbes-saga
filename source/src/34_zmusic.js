/* =================== music ===================
   Pieces composed for the game with recorded instruments (VSCO-2 Community Edition, public domain) and rendered to music/*.mp3
   (source rules in tools/music/). A season playlist plays on and on: summer pieces in summer, winter pieces in winter, a short
   breath between pieces. Special moments play their own piece and then the playlist goes on: the fleet sails, the ships come home,
   a feast, a new Town Hall level, the death of a jarl. Files are fetched whole (the service worker keeps them for offline play).
   Settings live in the browser (ubbesaga.music): on/off and volume, from the note button or the Saga panel. */
const MUSIC={summer:['s1','s2','s3','s4'],winter:['w1','w2','w3','w4'],
  names:{s1:'Morning on the Bay',s2:'Harvest Dance',s3:'A Long Summer Day',s4:'Fair Winds',w1:'The Long Night',w2:'Frost on the Fjord',w3:'Snow over Kaldstrand',w4:'Wolves at the Gate',
    raid_depart:'The Fleet Sails',raid_return:'The Ships Come Home',festival:'Feast in the Hall',townhall:'A Greater Hall',funeral:'Ashes to the Sea'}};
const MU={on:true,vol:0.6,started:false,el:null,name:null,season:null,special:false,bag:{summer:[],winter:[]},last:null,urls:{},gap:0,hidden:false};
try{const o=JSON.parse(localStorage.getItem('ubbesaga.music')||'{}');if(typeof o.on==='boolean')MU.on=o.on;if(typeof o.vol==='number')MU.vol=Math.max(0,Math.min(1,o.vol));}catch(e){}
function muSave(){try{localStorage.setItem('ubbesaga.music',JSON.stringify({on:MU.on,vol:MU.vol}));}catch(e){}}
function muUrl(n){if(MU.urls[n])return Promise.resolve(MU.urls[n]);return fetch('music/'+n+'.mp3').then(r=>{if(!r.ok)throw new Error('music '+r.status);return r.blob();}).then(b=>(MU.urls[n]=URL.createObjectURL(b)));}
function muSeason(){return S&&!titleOn&&isWinter()?'winter':'summer';}
function muFade(el,to,ms,done){clearInterval(el._f);const from=el._g||0,t0=performance.now();el._f=setInterval(()=>{const k=Math.min(1,(performance.now()-t0)/ms);el._g=from+(to-from)*k;el.volume=Math.max(0,Math.min(1,el._g*MU.vol));if(k>=1){clearInterval(el._f);if(done)done();}},50);}
function muStop(ms){const el=MU.el;MU.el=null;MU.name=null;if(!el)return;muFade(el,0,ms||1500,()=>{try{el.pause();}catch(e){}el.src='';});}
/* the next piece of the season: each piece once before any repeats, never the same twice in a row */
function muNext(){const s=muSeason();MU.season=s;let bag=MU.bag[s];if(!bag.length){bag=MU.bag[s]=MUSIC[s].slice().sort(()=>Math.random()-0.5);if(bag[0]===MU.last&&bag.length>1)bag.push(bag.shift());}return bag.shift();}
function muPlay(n,special){if(!MU.on||!MU.started)return;muStop(special?1200:2500);MU.special=!!special;MU.name=n;MU.last=special?MU.last:n;clearTimeout(MU.gap);
  muUrl(n).then(u=>{if(MU.name!==n||!MU.on)return;const el=new Audio(u);el._g=0;el.volume=0;MU.el=el;
    el.addEventListener('ended',()=>{if(MU.el!==el)return;MU.el=null;MU.name=null;const was=MU.special;MU.special=false;MU.gap=setTimeout(()=>{if(!MU.el&&!MU.special)muPlay(muNext());},was?1500:4000+Math.random()*4000);});
    const p=el.play();if(p&&p.catch)p.catch(()=>{});muFade(el,1,special?400:2500);if(typeof updMusicBtn==='function')updMusicBtn();}).catch(()=>{if(MU.name===n){MU.name=null;MU.special=false;}});}
function muSpecial(n){if(!MU.on||!MU.started||MU.hidden)return;muPlay(n,true);}
function muStart(){if(MU.started)return;MU.started=true;if(MU.on)muPlay(muNext());}
function muSetOn(v){MU.on=!!v;muSave();if(!MU.on){clearTimeout(MU.gap);muStop(800);MU.special=false;}else if(MU.started&&!MU.el)muPlay(muNext());updMusicBtn();}
function muSetVol(v){MU.vol=Math.max(0,Math.min(1,v));muSave();if(MU.el)MU.el.volume=Math.max(0,Math.min(1,(MU.el._g||0)*MU.vol));}
function updMusicBtn(){const b=document.getElementById('music');if(!b)return;b.setAttribute('aria-pressed',String(MU.on));b.classList.toggle('off',!MU.on);
  b.title=MU.on?('Music on'+(MU.name&&MUSIC.names[MU.name]?': “'+MUSIC.names[MU.name]+'”':'')+' · click to turn off'):'Music off · click to turn on';}
/* browsers only let sound start after the player touches the page */
['pointerdown','keydown'].forEach(ev=>window.addEventListener(ev,()=>muStart(),{once:false,passive:true}));
document.addEventListener('visibilitychange',()=>{MU.hidden=document.hidden;if(!MU.el)return;if(document.hidden){try{MU.el.pause();}catch(e){}}else if(MU.on){const p=MU.el.play();if(p&&p.catch)p.catch(()=>{});}});
/* the season turns: let the piece fade and start one of the new season (not during a special piece) */
let muFeast=false;
setInterval(()=>{if(!MU.started||!MU.on)return;const s=muSeason();
  if(!MU.special&&MU.season&&s!==MU.season&&MU.el){MU.bag[s]=[];muStop(6000);MU.gap=setTimeout(()=>{if(!MU.el)muPlay(muNext());},6500);MU.season=s;}
  const f=typeof feastOn==='function'&&!titleOn&&feastOn();if(f&&!muFeast)muSpecial('festival');muFeast=f;},1000);
/* special moments */
{const _lr=launchRaid;launchRaid=function(plan){const w=_lr.apply(this,arguments);if(!w)muSpecial('raid_depart');return w;};}
{const _hc=homecoming;homecoming=function(r){const x=_hc.apply(this,arguments);muSpecial('raid_return');return x;};}
{const _ft=finishTH;finishTH=function(lv){const x=_ft.apply(this,arguments);muSpecial('townhall');return x;};}
{const _su=succession;succession=function(cause){const x=_su.apply(this,arguments);if(cause!=='deposed'&&cause!=='left')muSpecial('funeral');return x;};}
{const b=document.getElementById('music');if(b)b.onclick=e=>{e.stopPropagation();MU.started=true;muSetOn(!MU.on);};updMusicBtn();}
