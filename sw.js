const CACHE_NAME = 'memo-app-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './sw.js'
];

// インストール
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // キャッシュ失敗時はスキップ（ファイルが存在しなくても続行）
        console.log('Some assets could not be cached');
      });
    })
  );
  self.skipWaiting();
});

// アクティベート
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// フェッチ
self.addEventListener('fetch', (event) => {
  // POST リクエストはキャッシュしない
  if (event.request.method === 'POST') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // キャッシュ可能なレスポンスをキャッシュ
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // ネットワーク失敗時、キャッシュから返す
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || new Response('オフラインです', { status: 503 });
        });
      });
    })
  );
});
