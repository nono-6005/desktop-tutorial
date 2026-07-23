const CACHE_NAME = 'podcast-studio-v2';
const ASSETS_TO_CACHE = [
  './index.html',
  './manual.html',
  './manifest.json',
  './sw.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-192-maskable.png',
  './icons/icon-512-maskable.png'
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
  if (event.request.method !== 'GET') {
    return;
  }

  // Claude API へのリクエストはキャッシュしない
  if (event.request.url.startsWith('https://api.anthropic.com/')) {
    return;
  }

  // ページ本体はネットワーク優先（更新がすぐ届く）、オフライン時のみキャッシュ
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((response) => {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match('./index.html');
        });
      })
    );
    return;
  }

  // その他のアセット（ビルド済みJS/CSS含む）はキャッシュ優先、初回アクセス時にランタイムキャッシュ
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || new Response('オフラインです', { status: 503 });
        });
      });
    })
  );
});
