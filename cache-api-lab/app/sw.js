
const filesToCache = [
    '/',
    'style/main.css',
    'images/still_life_medium.jpg',
    'index.html',
    'pages/404.html',
    'pages/offline.html'
];

const staticCacheName = 'cachedFiles-v2';

self.addEventListener('install', event => {
    console.log('installing service worker and caching static assets');
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    );
});

self.addEventListener('activate', event => {
    console.log('activating new service worker...');

    const cacheWaitList = [staticCacheName];
    event.waitUntil(
        caches.keys().then(cachesNames => {
            return Promise.all(
                cachesNames.map(cachesName => {
                    if (cacheWaitList.indexOf(cachesName) === -1) {
                        return caches.delete(cachesName);
                    }
                })
            );
        })
    );
});


self.addEventListener('fetch', event => {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('Found ', event.request.url, ' in cache');
                    return response;
                }
                console.log('Network request for ', event.request.url);
                return fetch(event.request)
                    .then(response => {
                        // Respond with custom 404 page
                        if (response.status === 404) {
                            return caches.match('./pages/404.html');
                        }

                        return caches.open(staticCacheName)
                            .then(cache => {
                                cache.put(event.request.url, response.clone());
                                return response;
                            });
                    });

            }).catch(error => {
                console.log('You have a ', error);
                //  Respond with custom offline page
                return caches.match('./pages/offline.html');
            })
    );
});