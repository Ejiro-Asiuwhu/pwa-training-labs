// installing service worker 
self.addEventListener('install', event => {
    console.log('service worker installing...');
    self.skipWaiting();

});

// activating service worker
// activating service worker

self.addEventListener('activate', event => {
    console.log('service worker activating...');

});

self.addEventListener('fetch', event => {
    console.log('Fetching assets...', event.request.url);

})