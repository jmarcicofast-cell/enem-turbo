// ENEM Turbo — funciona offline depois da primeira visita
const CACHE = 'enem-turbo-v9';
const CORE = ['./', './index.html', './app.js', './content.js', './redacao.js', './bank.js', './pro.js', './firebase-config.js', './manifest.json', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())) });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())) });
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  if (url.hostname.endsWith('googleapis.com') && !url.hostname.startsWith('fonts')) return; // Firebase: sempre rede
  if (url.origin === location.origin) {
    // arquivos do app: rede primeiro (pega atualizações), cache se estiver offline
    e.respondWith(fetch(req).then(r => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)) } return r })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(h => h || caches.match('./index.html'))));
    return;
  }
  // fontes e SDK do Firebase: cache primeiro
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok || r.type === 'opaque') { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)) } return r })));
});
