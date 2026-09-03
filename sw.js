/* NoEdgeBall — service worker
   Guarda a página para abrir sem rede. O reconhecimento de fala do navegador ainda
   precisa de internet; o que fica offline é o app, o placar e o histórico. */
var CACHE = "noedgeball-v10";
var ARQUIVOS = ["./", "./index.html", "./calibrar.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ARQUIVOS); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
/* Rede primeiro (para pegar atualizações), cache se a rede falhar. */
self.addEventListener("fetch", function(e){
  if(e.request.method!=="GET") return;
  e.respondWith(
    fetch(e.request).then(function(r){
      var copia=r.clone(); caches.open(CACHE).then(function(c){ c.put(e.request, copia); }); return r;
    }).catch(function(){ return caches.match(e.request); })
  );
});
