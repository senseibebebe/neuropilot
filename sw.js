// NeuroPilot: страница работает без интернета (в поле). При новой версии поменяй VER.
const VER = 'np-v9.3';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './eeg_demo.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VER).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k)))));
  self.clients.claim();
});
// сначала сеть (чтобы подхватывать обновления), без сети — из сохранённой копии
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(VER).then(ca => ca.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
