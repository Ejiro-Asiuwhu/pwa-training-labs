const cacheName = 'cache-v1';

const cachedFiles = [
    '/',
    'index.html',
    'styles/main.css',
    'images/space1.jpg',
    'images/space2.jpg',
    'images/space3.jpg',
    'manifest.json'
];

self.addEventListener('install', event => {
    console.log('installing service worker...');
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(cachedFiles);
            })
    );
});

self.addEventListener('activate', event => {
    console.log('activating service worker');
    event.skipWaiting();
});

self.addEventListener('fetch', event => {
    console.log('Fetch intercepted for', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request);
            })
    );
});

