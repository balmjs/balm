importScripts('workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

var PROJECT_NAME = 'balm-test';

// Configure Cache Names
workbox.core.setCacheNameDetails({
  prefix: PROJECT_NAME,
  suffix: 'v1',
  precache: 'app-cache',
  runtime: 'app-runtime'
});

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// Caching Images
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: PROJECT_NAME + '-images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      })
    ]
  })
);

// Cache CSS and JavaScript Files
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: PROJECT_NAME + '-static-resources'
  })
);

// Cache Resources from a Specific Subdirectory
workbox.routing.registerRoute(
  new RegExp('/docs/'),
  new workbox.strategies.StaleWhileRevalidate()
);

// Cache Others
workbox.routing.registerRoute(
  /\.(?:ico|woff)|manifest\.json$/,
  new workbox.strategies.StaleWhileRevalidate()
);

// Enable Offline Google Analytics
// workbox.googleAnalytics.initialize();

// Test ws
self.addEventListener('message', function(event) {
  console.log(event.data);
});
