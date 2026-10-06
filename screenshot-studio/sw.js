const CACHE_NAME = 'screenshot-studio-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.registration.scope)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const cloned = response.clone();

        // Cache valid responses
        if (response && response.status === 200) {
          event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned)));
        }

        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request, { ignoreSearch: true }).then((r) => r || caches.match('./index.html'));
      })
  );
});
