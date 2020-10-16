self.addEventListener('install', event => {
    self.skipWaiting();
    caches.delete('cache');
});