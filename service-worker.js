const CACHE_NAME = 'my-dynamic-cache-v1.1.123';

self.addEventListener('fetch', event => {
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(event.request)
            .then(networkResponse => {
              const networkResponseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, networkResponseClone);
                });
              return networkResponse;
            })
            .catch(() => {
              return caches.match('/offline.html');
            });
        })
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});