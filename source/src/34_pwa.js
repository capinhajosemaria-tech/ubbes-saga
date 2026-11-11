// Installable game: register the service worker when served over https (GitHub Pages).
if('serviceWorker' in navigator&&location.protocol==='https:'){window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).catch(()=>{});});}
