importScripts('workbox-sw.js');

var PROJECT_NAME = 'balm-test';
var PROJECT_VERSION = '{{ version }}';
var CACHE_NAMES = [
  PROJECT_NAME + '-' + 'precache' + '-' + PROJECT_VERSION,
  PROJECT_NAME + '-' + 'runtime' + '-' + PROJECT_VERSION,
  PROJECT_NAME + '-' + 'ga' + '-' + PROJECT_VERSION,
  'google-fonts',
  'images'
];

// console.log('CACHE_NAMES', CACHE_NAMES);

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.core.setCacheNameDetails({
  prefix: PROJECT_NAME,
  suffix: PROJECT_VERSION,
  precache: 'precache',
  runtime: 'runtime',
  googleAnalytics: 'ga'
});

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// Cache Google Fonts
workbox.routing.registerRoute(
  function (context) {
    return (
      context.url.origin === 'https://fonts.googleapis.com' ||
      context.url.origin === 'https://fonts.gstatic.com'
    );
  },
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts',
    plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 20 })]
  })
);

// Cache JavaScript and CSS
workbox.routing.registerRoute(function (context) {
  return (
    context.request.destination === 'script' ||
    context.request.destination === 'style'
  );
}, new workbox.strategies.StaleWhileRevalidate());

// Cache Images
workbox.routing.registerRoute(
  function (context) {
    return context.request.destination === 'image';
  },
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      })
    ]
  })
);

// Cache Resources from a Specific Subdirectory
workbox.routing.registerRoute(function (context) {
  return (
    context.url.origin === self.location.origin &&
    context.url.pathname.startsWith('/static/')
  );
}, new workbox.strategies.StaleWhileRevalidate());

// Cache Others
workbox.routing.registerRoute(
  /\.(?:ico|woff2?)$/,
  new workbox.strategies.StaleWhileRevalidate()
);

// Offline Google Analytics
// workbox.googleAnalytics.initialize();

// Cleanup Outdated Caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (cacheList) {
        return Promise.all(
          cacheList.map(function (cacheName) {
            if (CACHE_NAMES.indexOf(cacheName) === -1) {
              // console.log('[ServiceWorker] Removing old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(function () {
        self.clients.claim();
      })
  );
});

// Test ws
self.addEventListener('message', function (event) {
  console.log(event.data, 'gg');
});
