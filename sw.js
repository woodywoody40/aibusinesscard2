const CACHE_NAME = 'ai-card-collector-v7'; // Bump version for path changes
const URLS_TO_CACHE = [
  '/aibusinesscard2/',
  '/aibusinesscard2/index.html',
  '/aibusinesscard2/index.css',
  '/aibusinesscard2/logo.svg',
  '/aibusinesscard2/manifest.json'
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use {cache: 'reload'} to bypass browser cache for these initial assets.
        const requests = URLS_TO_CACHE.map(url => new Request(url, {cache: 'reload'}));
        return cache.addAll(requests);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  // We only want to handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a stream and can only be consumed once.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response before caching.
            // Do not cache responses that are not 200 OK.
            if (!response || response.status !== 200) {
              return response;
            }

            // We don't cache cross-origin requests from CDNs like unpkg or esm.sh
            if (response.type !== 'basic') {
              return response;
            }

            // If the response is valid, clone it and cache it.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});