const CACHE_NAME = 'kabadiwala-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1. Only intercept same-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // 2. Navigation / HTML requests -> MUST BE NETWORK-FIRST
  // Prevents mobile browsers from caching stale index.html pointing to old JS chunk hashes
  const isNavigate = req.mode === 'navigate' ||
                     (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) ||
                     url.pathname === '/' ||
                     url.pathname === '/index.html';

  if (isNavigate) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match('/index.html').then((cached) => {
            return cached || caches.match('/');
          });
        })
    );
    return;
  }

  // 3. API Requests -> Network first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return response;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // 4. Static Assets (JS, CSS, images, fonts)
  // Prevent Vercel HTML fallback from being served or cached as JS/CSS
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(req).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const contentType = networkResponse.headers.get('content-type') || '';
        const isScriptOrStyle = url.pathname.endsWith('.js') || url.pathname.endsWith('.css');

        if (isScriptOrStyle && contentType.includes('text/html')) {
          return new Response('Asset not found (MIME mismatch)', {
            status: 404,
            statusText: 'Not Found',
            headers: { 'Content-Type': 'text/plain' }
          });
        }

        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        return networkResponse;
      });
    })
  );
});
