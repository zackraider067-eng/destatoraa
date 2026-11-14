const CACHE_NAME = "mikrotik-security-tester-v1.1";
const FILES = ["./", "./index.html", "./manifest.json", "./app-icon.svg"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("mikrotik-security-tester-") && key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.open(CACHE_NAME).then(cache => cache.match(event.request).then(cached => cached || fetch(event.request).then(response => { if (response && response.ok) cache.put(event.request, response.clone()); return response; }).catch(() => cache.match("./index.html")))));
});