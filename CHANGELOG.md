# [BalmJS](https://balmjs.com/) CHANGELOG

## v2.17.1 / 2020-06-10

> Black Lives Matter: <del>`blacklist`</del> -> `blocklist`

## v2.17.0 / 2020-06-09

### Bug Fixes

- `pwa minify task`: bugfix

### Features

- update `balm.config.server.middlewares: Function[] | object[]`
- clean code and update config
- TS rebuild

## v2.16.0 / 2020-05-31

### Chores

- dependencies: up to date
  - `istextorbinary`: 4.x -> 5.x

## v2.15.1 / 2020-05-29

### Chores

- update test for styles
- optimize `publicUrl` initial value for history mode in development

## v2.15.0 / 2020-05-25

### Chores

- optimize PWA

### Features

- update `balm.config`
  - add `pwa.version: string = ''`

```js
// `service-worker.js`
importScripts('workbox-sw.js');

var PROJECT_NAME = ''; // Your project name
var PROJECT_VERSION = '{{ version }}'; // Version placeholder
var CACHE_NAMES = [
  PROJECT_NAME + '-' + 'precache' + '-' + PROJECT_VERSION,
  PROJECT_NAME + '-' + 'runtime' + '-' + PROJECT_VERSION,
  PROJECT_NAME + '-' + 'ga' + '-' + PROJECT_VERSION,
  'google-fonts',
  'images'
];

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

// Offline Google Analytics
workbox.googleAnalytics.initialize();

// Cleanup Outdated Caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (cacheList) {
        return Promise.all(
          cacheList.map(function (cacheName) {
            if (CACHE_NAMES.indexOf(cacheName) === -1) {
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
```

## v2.14.0 / 2020-05-24

### Chores

- optimize `BalmJS.logger.error`
- update types: `BalmError`, `ReplaceOptions`
- update `stream.Transform` types for plugins
- update test

### Features

- optimize detect port
- update plugins: `rename`, `replace`

## v2.13.2 / 2020-05-20

### Chores

- `middlewares`: optimize error handler

## v2.13.1 / 2020-05-09

### Chores

- devDependencies: up to date
  - `eslint`: 6.x -> 7.x

### Bug Fixes

- bugfix for cache: ⚠️ `v2.13.0` deprecated

## <del>v2.13.0</del> / 2020-05-06

### Chores

- dependencies: up to date
  - `terser-webpack-plugin`: 2.x -> 3.x

### Bug Fixes

- `script` task: fix default entry bug for the emtry source path
- `html` task: update assets path bugfix

## v2.12.1 / 2020-04-26

### Features

- update styles tasks for miniprogram
- update miniprogram test

## v2.12.0 / 2020-04-26

### Chores

- dependencies: up to date
  - `fibers`: 4.x -> 5.x

### Bug Fixes

- Bugfix that the server automatically detects the port in development

## v2.11.2 / 2020-04-10

### Bug Fixes

- fix the problem of `styles.postcssPlugins` failure for `sass`/`less`

## v2.11.1 / 2020-04-03

### Chores

- optimize `start` & `end` tasks for the async completion
- upgrade compatibility check for `balm.config`

## v2.11.0 / 2020-03-21

### Chores

- dependencies: up to date
  - `html-loader`: 0.x -> 1.x

### Features

- update `balm.config`
  - add `scripts.htmlLoaderOptions: object = {}`
  - migrate <del>`styles.postcssLoaderOptions`</del> to `scripts.postcssLoaderOptions`

## v2.10.0 / 2020-03-18

### Chores

- dependencies: up to date
  - `file-loader`: 5.x -> 6.x
  - `url-loader`: 3.x -> 4.x
- update test
  - dart sass
  - build miniprogram
  - `mix.replace` api

### Features

- update api
  - `mix.replace(input: string | string[], output: string, options: ReplaceOptions | ReplaceOptions[])`

## v2.9.1 / 2020-03-14

### Chores

- optimize logs for `script` and `modernizr` tasks

## v2.9.0 / 2020-03-11

### Features

> WeChat MiniProgram support

- new config: `balm.config.env.isMP: boolean` for miniprogram
- new api: `mix.replace(input: string | string[], output: string, options: ReplaceOptions)`

```ts
interface ReplaceOptions {
  substr?: string | RegExp;
  replacement?: string | Function;
}
```

## v2.8.0 / 2020-02-22

### Features

- optimized `@use`/`@import`: omitting `node_modules` support

## v2.7.0 / 2020-02-20

### Chores

- dependencies: up to date
  - `http-proxy-middleware`: 0.x -> 1.x

## v2.6.0 / 2020-02-14

### Features

> Dart Sass support

- update `balm.config`
  - `styles.dartSass: boolean = false`

## v2.5.0 / 2020-02-12

### Features

- update `balm.config`
  - `images.defaultPlugins: object = {}`

### BREAKING CHANGES

- update `balm.config`
  - rename <del>`scripts.disableDefaultLoaders`</del> to `scripts.defaultLoaders`

## v2.4.0 / 2020-01-31

### Chores

- dependencies: up to date
  - `workbox-build`: 4.x -> 5.x
- devDependencies: up to date
  - `@types/mocha`: 5.x -> 7.x
  - `cross-env`: 6.x -> 7.x
- update PWA `generateSW` mode

### BREAKING CHANGES

- use native `fs.mkdir(path, { recursive: true })` instead of `mkdirp`

## v2.3.0 / 2020-01-23

:tada: Happy Lunar New Year

### Chores

- dependencies: up to date
  - `gulp-imagemin`: 6.x -> 7.x
- devDependencies: up to date
  - `husky`: 3.x -> 4.x
  - `mocha`: 6.x -> 7.x
- update test for `mocha@7`

## v2.2.2 / 2020-01-02

:tada: Hello, 2020!

### Chores

- update types
- clean code

## v2.2.1 / 2019-12-29

### Bug Fixes

- fix scripts entries for custom vendors

## v2.2.0 / 2019-12-25

### Chores

- devDependencies: up to date
  - `babel-plugin-istanbul`: 5.x -> 6.x
  - `nyc`: 14.x -> 15.x

### Features

- update `balm.config`
  - `scripts.ie8: boolean = false`

## v2.1.1 / 2019-12-22

### Chores

- dependencies: up to date

### Features

- update `balm.config`
  - restore `scripts.includeJsResource: string[]` (absolute paths) from balm v1

## v2.1.0 / 2019-11-28

### Chores

- dependencies: up to date
  - `url-loader`: 2.x -> 3.x

> `url-loader` switch to ES modules by default (the option `esModule` is `true` by default)

```html
<template>
  <img :src="require('@/assets/logo.png').default" />
</template>
```

### Features

- improved `url-loader` default rule
- update `balm.config`
  - `scripts.urlLoaderOptions: object = {}`

```js
balm.config = {
  scripts: {
    urlLoaderOptions: {
      esModule: false
    }
  }
};
```

```html
<template>
  <img :src="require('@/assets/logo.png')" />
</template>
```

### BREAKING CHANGES

- deprecated `balm.config`
  - scripts.<del>`base64Limit`</del>

## v2.0.5 / 2019-11-26

### Chores

- dependencies: up to date
  - `file-loader`: 4.x -> 5.x

> `file-loader` switch to ES modules by default (the option `esModule` is `true` by default)

## v2.0.4

### Bug Fixes

- `balm:sprite`: fix CSS variable bug for Sass and Less

## v2.0.3 / 2019-11-22

### Bug Fixes

- `balm:clean`: fix clean _buildDir_ bug in development for the Back-end mode

## v2.0.2 / 2019-11-21

### Features

- update `balm.config`
  - restore `scripts.extractAllVendors: boolean = false` from balm v1
  - restore `scripts.vendorName: string = 'vendor'` from balm v1

### BREAKING CHANGES

- deprecated `balm.config`
  - scripts.<del>`splitAllVendors`</del>
  - scripts.<del>`vendorsName`</del>: string = <del>`'vendors'`</del>

## v2.0.1

### Features

- update `balm.config`
  - restore `extras.includes` from balm v1

## v2.0.0 / 2019-11-20

> It is a new starting point

- `balm@2.0.0` released :tada:
- Code Refactoring by TypeScript :ghost:
- `balm.config` Full Upgrade :rocket:
- [Upgrading To 2.0.0 From 1.x](https://balmjs.com/docs/v2/guide/upgrade/upgrade-2.0.html)
