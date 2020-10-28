let urlsToCache = [
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.4/clipboard.min.js',
    'https://fonts.googleapis.com/css?family=K2D',
    'https://fonts.gstatic.com/s/k2d/v3/J7aTnpF2V0EjZKUsrLc.woff2',
    'https://fonts.gstatic.com/s/k2d/v3/J7aTnpF2V0EjcKUs.woff2',
    '/me/',
    '/me/upload/',
    '/me/files/',
    '/me/files/info/',
    '/img/circle.png',
    '/img/me_irl.webp',
    '/img/empty.gif',
    '/brew-coffee/'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    caches.delete('cache');
    caches.delete('sharedimages');
    event.waitUntil(
        caches.open('cache').then(function (cache) {
            return cache.addAll(urlsToCache.map(url => {
                console.log(`Adding ${url} to cache`);
                return new Request(url);
            }));
        })
    );
});

self.addEventListener('fetch', function (event) {
    if (event.request.method === 'POST' && event.request.url.includes('/me/upload/')) {
        event.respondWith((async () => {
            let cache = await caches.open('sharedimages');
            let data = await event.request.formData();
            const file = data.get('file');
            let now = Date.now();

            await cache.put(`/tmp/${now}`, new Response(file, {
                headers: {
                    'Content-Type': file.type,
                    'Content-Length': file.size,
                    'X-Filename': file.name
                }
            }));
            console.log(`Received share event!`);
            return Response.redirect(`/me/upload/?file=${now}`, 303);
        })());
    } else if (event.request.method !== 'POST') {
        event.respondWith(
            caches.match(event.request)
                .then(function (response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }

                    return fetch(event.request).then(
                        function (response) {
                            // Check if we received a valid response
                            if (!response || response.status !== 200 || response.type === 'opaque' || response.url.includes('/api/') || response.headers.get('Cache-Control').includes('no') || response.url.includes('manifest.json') || response.url.includes('service-worker.js')) {
                                return response;
                            }

                            // IMPORTANT: Clone the response. A response is a stream
                            // and because we want the browser to consume the response
                            // as well as the cache consuming the response, we need
                            // to clone it so we have two streams.
                            var responseToCache = response.clone();

                            caches.open('cache')
                                .then(function (cache) {
                                    console.log(`Adding ${new URL(event.request.url).pathname} to cache.`)
                                    cache.put(event.request, responseToCache);
                                });

                            return response;
                        }
                    );
                })
        );
        caches.open('cache').then(cache => {
            cache.match(event.request.url).then(cached => {
                if (navigator.onLine && cached) {
                    fetch(event.request).then(res => {
                        if (res.headers.get('Last-Modified')) {
                            if (cached.headers.get('Last-Modified') !== res.headers.get('Last-Modified')) {
                                console.log(`${new URL(event.request.url).pathname} from cache is outdated, updating cache!`)
                                cache.delete(event.request.url);
                                cache.put(event.request, res);
                            }
                        }
                    })
                }
            })
        }
    } else {
        event.respondWith(fetch(event.request).then(res => { return res; }));
    }
});
