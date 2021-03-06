const {assets} = global.serviceWorkerOption;
const CACHE_NAME = 'trello-cache-v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll([
                    ...assets,
                ]);
            }),
    );
});


self.addEventListener('fetch', (event) => {
    event.respondWith((() => {
        if (navigator.onLine === true) {
            return fetch(event.request)
                .then((response) => {
                    if (event.request.method !== 'GET') {
                        return response;
                    }

                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseClone);
                        });

                    return response;
                });
        }


        return caches.match(event.request)
            .then((response) => {
                // TODO(Alexandr): change to another status
                return response || new Response(null, {status: 500});
            });
    })());
});


self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys.map((key) => {
                if (key !== CACHE_NAME) {
                    caches.delete(key)
                        .then(() => console.log(`Deleted cache: ${key}`));
                }
            }),
        )),
    );
});
