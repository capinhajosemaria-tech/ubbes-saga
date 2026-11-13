// Ubbe's Saga service worker: keeps the game playable offline.
const CACHE='ubbe-beta0.22.0',MUSIC_CACHE='ubbe-music-1';/* music files are big and rarely change: kept across versions, fetched when first played */
const FILES=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!==MUSIC_CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;
  if(u.origin===location.origin){
    // Game page: network first so updates arrive, cache as fallback offline.
    if(e.request.mode==='navigate'){e.respondWith(fetch(e.request.url,{cache:'no-cache',credentials:'same-origin'}).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put('./index.html',c));return r;}).catch(()=>caches.match('./index.html')));return;}
    if(/\/music\/[^/]+\.mp3$/.test(u.pathname)){e.respondWith(caches.open(MUSIC_CACHE).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{if(n.ok&&n.status===200)c.put(e.request,n.clone());return n;}))));return;}
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));return;}
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{c.put(e.request,n.clone());return n;}))));}
});
