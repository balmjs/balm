# BalmJS ChangeLog

## 0.21.0 (2018.05.16)

:tada: **Update bundler for SPA and MPA in webpack@4**

### Example 1

```html
<!-- All vendors in one -->
<script src="%PUBLIC_URL%/scripts/vendor.js"></script>
<!-- Entry -->
<script src="%PUBLIC_URL%/scripts/main.js"></script>
```

```js
balm.config = {
  scripts: {
    entry: {
      main: './src/scripts/main.js'
    },
    extractAllVendors: true
  }
};
```

### Example 2

```html
<!-- Custom vendors -->
<script src="%PUBLIC_URL%/scripts/vendor/lib.js"></script>
<script src="%PUBLIC_URL%/scripts/vendor/plugin.js"></script>
<!-- Entry -->
<script src="%PUBLIC_URL%/scripts/page-a.js"></script>
```

```js
balm.config = {
  scripts: {
    entry: {
      lib: ['library-1', 'library-2'],
      plugin: ['plugin-1', 'plugin-2'],
      'page-a': './src/scripts/page-a.js',
      'page-b': './src/scripts/page-b.js',
      'page-c': './src/scripts/page-c.js'
    }
  }
};
```

---

## 0.20.6 (2018.05.11)

### :beetle: Bug fixes and improvements

* fix cacheGroups's `chunks` bug

---

## 0.20.4 (2018.05.07)

### :beetle: Bug fixes and improvements

* fix js entry bug for `mix.js` api

---

## 0.20.3 (2018.05.06)

* update dependencies for new colors

---

## 0.20.0 (2018.04.21)

### :rocket: Refactoring

* plugins
* loaders
* logger
* `Balm` pattern
* test

### :beetle: Bug fixes and improvements

* fix `scripts.entry` bug
* fix `svg` bug
* clean code for `clean` & `cache`

**balmrc.js**

Before:

```js
const balmConfig = {
  ...
  scripts: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue' // Since `balm@0.20`, deprecated usage for default
      }
    ],
    ...
  },
  ...
};
```

Now:

```js
const balmConfig = {
  ...
  scripts: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader' // We strongly recommend using the full name
      }
    ],
    ...
  },
  ...
};
```

---

## 0.19.1 (2018.04.18)

### :beetle: Bug fixes and improvements

* fix `scripts.plugins` bug since `0.17`
* SSR supported for build
* optimize webpack default config

---

## 0.19.0 (2018.04.07)

### :rocket: Big changes

* update `gulp-sass@4`

---

## 0.18.0 (2018.04.01)

:tada: **Refactoring middleware for server**

### :gear: New config

* add `server.devOptions` for `webpack-dev-middleware`
* add `server.hotOptions` for `webpack-hot-middleware`
* add `server.proxyContext`, `server.proxyOptions` for `http-proxy-middleware`
* add `server.historyOptions` for `connect-history-api-fallback`
* add `server.middlewares` for Browsersync

### :ghost: Breaking change

* `server.proxyTable` was removed -> `server.proxyContext`, `server.proxyOptions`
* `server.historyApiFallback` was renamed -> `server.historyOptions`

### :page_with_curl: Update Docs for `server` new configs

---

## 0.17.1 (2018.03.23)

### :gear: config

* restore `scripts.vendorName` default value `vendor`

---

## 0.17.0 (2018.03.21)

:tada: **New feature: Upgrade to webpack@4**

### :rocket: Big changes

* bundler refactoring
* update dependencies

### :gear: New config

* `scripts.optimization`
* `scripts.extractCss.filename`

---

## 0.16.2 (2018.02.16)

:tada: Happy Lunar New Year

---

## 0.16.1 (2018.01.24)

:tada: **New feature: [中文文档](http://balmjs.com/docs/zh-cn/)**

### :beetle: Bug fixes and improvements

* fix api: `mix.serve()`
* rename api `mix.buildStyle()` to `mix.csspath()`
* add api: `mix.html()`

---

## 0.16.0 (2018.01.21)

:tada: **New feature: [New Full Documentation](http://balmjs.com/docs/)**

### :ghost: Breaking change

* I think `node >= 8` has WebAssembly

### :beetle: Bug fixes and improvements

* fix `remove` bug for sass api
* update `logger`

---

## 0.15.3 (2018.01.11)

### :beetle: Bug fixes and improvements

* update `logger` format and color
* update `scripts.loaders` merge for `webpack`

### :gear: Update dependencies

* add `webpack-merge`

---

## 0.15.2 (2018.01.10)

### :beetle: Bug fixes and improvements

* fix `server` watch bug
* update styles watch event
* fix `production` flag bug (you can run `gulp --production` or `gulp -p` for build)

---

## 0.15.0 (2018.01.09)

### :tada: Improvements

* update `logger`
* add `namespace` for `balm` tasks
* `beforeTask` & `afterTask` support `string` (gulp task name)

### :gear: Update dependencies

* remove `gulp-util`, add `ansi-colors` & `fancy-log`
* remove `gulp-cssnano`, add `cssnano`

---

## 0.14.0 (2018.01.08)

### :gear: Custom task API changes

* `balm.config.beforeTask` change to `balm.beforeTask`
* `balm.config.afterTask` change to `balm.afterTask`

### :page_with_curl: Update Docs

* [BalmJS Configuration Docs](https://github.com/balmjs/balm/blob/master/docs/configuration.md)
* [Custom Task API](https://github.com/balmjs/balm/blob/master/docs/api.md)

---

## 0.13.0 (2018.01.07)

:tada: **New feature: [Full Documentation](https://github.com/balmjs/balm#documentation)**

### :gear: New config

* <del>`styles.postcss`</del> is deprecated
* `styles.postcssPlugins`
* `styles.postcssOptions`
* `styles.postcssLoaderOptions`

---

## 0.12.1 (2017.12.31)

### Update dependencies

* gulp-htmlmin
* gulp-size
* webpack-dev-middleware

---

## 0.12.0 (2017.12.07)

:tada: **New feature: Extract css from bundle**

### New config

* `scripts.vendor` rename to `scripts.extractAllVendors`
* `scripts.cssLoader`
* `scripts.extractCss`

---

## 0.11.1 (2017.11.30)

### API

* update `mix.js(entry: string|array|object, output: string)` for naming

### Bugfix

* fix cache filename conflict (thx [@hccde](https://github.com/hccde))

### Clean Code

---

## 0.11.0 (2017.11.23)

> `v0.10.x` is deprecated

* fix style tasks bug in `v0.10.x`

---

## 0.10.5 (2017.11.18)

### Bugfix

* fix css sourcemap

---

## 0.10.4 (2017.11.06)

### Config

* add `server.serveStatic`
* add `server.options`

---

## 0.10.3 (2017.10.23)

### Config

* add `server.https` support
* update `server.browser`

### Bugfix

* fix `server` options buy in proxy mode
* fix `mix.remove(string|array)` input bug

### Unit Test

* remove: add test for array

### Update dependencies & remove `gulp-cache`

---

## 0.10.2 (2017.10.10)

### New API

* add `mix.server`
* add `mix.buildStyle`

### Config

* change `scripts.entry` default value to `null`

---

## 0.10.1 (2017.10.9)

### Bugfix

* fix `--production`
* fix empty sprite tasks bug
* add errorHandler for `wiredep`

---

## 0.10.0 (2017.10.8)

:tada: **New feature: We can run `npm run prod` when `npm run dev` is running**

### New

* refactor file system
* optimize api
* update dependencies
* update docs

### Config

* `beforeTask`
* `afterTask`

### Task

* update `clean` folder for media
* update `server` deps for media and fix watch html bug
* fix `cache` bug
* fix `media` task for development
* remove `mix.end` task
* optimize `default` task

### Unit Test

* config
* default
* copy
* css
* sass
* less
* cssmin
* js
* jsmin
* version
* zip
* publish
* remove

---

## 0.9.1 (2017.09.21)

### New

#### Config

* `scripts.include`
* `paths.source.media`
* `paths.target.media`

#### Task

* add `media` task

### Optimization

* update eslint config
* update project architecture
* update webpack plugins

### Bugfix

* fix build `manifest.json` for PWA
* fix `html` task

### Test

* add media test

---

## 0.9.0 (2017.09.05)

* clean code
* optimized `cache`
* update test

:tada: **New feature - Library Code Splitting**

**balmrc.js**

```js
const balmConfig = {
  ...
  scripts: {
    cdn: {
      'jquery': '$',
      'zepto': '$'
    },
    entry: {
      'desktop': './app/scripts/desktop.js',
      'mobile': './app/scripts/mobile.js'
    },
    ...
  },
  ...
};
```

**desktop.html**

```html
<body>
  ...

  <!-- build:js js/cdn/lib-desktop.js -->
  <script src="/node_modules/jquery/dist/jquery.min.js"></script>
  <!-- endbuild -->

  <script src="%PUBLIC_URL%/scripts/desktop.js"></script>
</body>
```

**mobile.html**

```html
<body>
  ...

  <!-- build:js js/cdn/lib-mobile.js -->
  <script src="/node_modules/zepto/zepto.min.js"></script>
  <!-- endbuild -->

  <script src="%PUBLIC_URL%/scripts/mobile.js"></script>
</body>
```

---

## 0.8.6 (2017.08.12)

### New feature - Scope Hoisting

* update `scripts.options.compress` default value
* optimize build

---

## 0.8.5 (2017.08.12)

### Bugfix

* restore `scripts.stats` default value

### Update dependencies

---

## 0.8.4 (2017.08.02)

### Deprecated config

* `scripts.extends`

### New config

* `scripts.library`
* `scripts.libraryTarget`
* `scripts.webpack`

---

## 0.8.3 (2017.07.23)

* remove `gulp-autoprefixer` dependencies
* use `gulp-postcss` & `autoprefixer` for all styles

---

## 0.8.2 (2017.07.21)

* `html` task bugfix for `manifest.json`

---

## 0.8.1 (2017.07.20)

### Deprecated config

* `html.regex`

### Update html template

* change `css` to `styles` pathname for default config
* change `js` to `scripts` pathname for default config

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your Webapp</title>
  <link rel="stylesheet" href="%PUBLIC_URL%/styles/main.css">
</head>

<body>
  <div id="app">Your Template</div>
  <script src="%PUBLIC_URL%/scripts/main.js"></script>
</body>

</html>
```

---

## 0.8.0 (2017.07.19)

### Deprecated config

* `html.replacement`
* `scripts.publicPath`

### New config

* `assets.publicUrlPlaceholder`
* `assets.publicUrl`

:tada: **New Feature: html templates can use `%PUBLIC_URL%` for CDN**

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your Webapp</title>
  <link rel="stylesheet" href="%PUBLIC_URL%/css/main.css">
</head>

<body>
  <div id="app">Your Template</div>
  <script src="%PUBLIC_URL%/js/main.js"></script>
</body>

</html>
```

---

## 0.7.6 (2017.07.16)

* fix external url in `styles` task
* deprecated `.sass` (recommended `.scss`)

---

## 0.7.5 (2017.07.09)

* update dependencies

---

## 0.7.4 (2017.06.27)

* `manifest.json` dest bugfix

---

## 0.7.3 (2017.06.24)

* remove `publicUrl` config for html
* update `html` task for RegExp
* update docs

---

## 0.7.2 (2017.06.23)

* `extras` bugfix
* <del>add `publicUrl` config for html</del>
* add `jsmin` error handling
* <del>add `%PUBLIC_URL%` variable for sites</del>
* add rename option for `cssmin` & `jsmin`

---

## 0.7.1 (2017.06.21)

* update dependencies
* update `webpack@3`

---

## 0.7.0 (2017.06.19)

* update `babel-preset` & `babel-plugin`

:tada: **New Feature: `.babelrc` for all [balm-templates](https://github.com/balmjs/balm-cli)**

```
{
  "presets": ["env"],
  "plugins": ["transform-runtime"]
}
```

---

## 0.6.3 (2017.06.15)

* update dependencies
* update `eslint@4`

---

## 0.6.2 (2017.06.10)

* update postcss config
* update test for `@import` css/sass/scss/less
* remove `postcss-scss` & `precss` dependencies
* add `postcss-cssnext` & `postcss-import` dependencies

---

## 0.6.1 (2017.06.03)

* add `includes` config for assets cache

---

## 0.6.0 (2017.06.03)

* use node >= 6 (Recommended)
* update dependencies
* use `webpack@2`
* remove `json-loader`
* clean code
* update test
* update uglifyjs for production
* update docs
* add `end` task
* add `includePaths` config for styles(sass/less)
* add `historyApiFallback` config for server
* automatic setting scripts' `vendors` by `entry`
* add test for `OS X/Windows/Linux`

---

## 0.5.8 (2018.01.11)

* Fix `require-dir` on Node 8, which tweaks `require.extensions`.

---

## 0.5.7

* fix browser reload
* fix `version` for vendor all in one
* update dependencies
* fix test

---

## 0.5.6

* from `npm` to `yarn`
* update dependencies

---

## 0.5.5

* update dependencies

---

## 0.5.4

* update logger
* update dependencies

---

## 0.5.3

* fix browser sync reload bug

---

## 0.5.2

* add `sprites` & `svg` padding
* update dependencies

---

## 0.5.1

* update sourcemap config for scripts
* update documents

---

## 0.5.0

* refactoring
* update dependencies

---

## 0.4.37

* update `webpack` task for vendors
* update dependencies

---

## 0.4.36

* fix `html` task for replace references

---

## 0.4.35

* fix `html` task for replace references

---

## 0.4.34

* fix `html` task for build

---

## 0.4.33

* update `less` error handling
* update styles config
* update `lint` task
* update dependencies

---

## 0.4.32

* fix `style` task
* update `clean` task
* update watch
* update html config
* update dependencies

---

## 0.4.31

* fix assets path

---

## 0.4.30

* fix `svg` bug

---

## 0.4.29

* refactor assets system
* add `remove` task
* update `publish` task
* update dependencies

---

## 0.4.28

* update `publish` task

---

## 0.4.27

* add `publish` task
* update `copy` task

---

## 0.4.26

* update watch for style

---

## 0.4.25

* fix less bug

---

## 0.4.24

* fix watch task
* fix style for `css`/`less`

---

## 0.4.23

* update custom task

---

## 0.4.22

* add rename for `copy`
* code optimization

---

## 0.4.21

* update documents
* update dependencies

---

## 0.4.20

* update proxy for server

---

## 0.4.19

* add HMR switch for script

---

## 0.4.18

* fix some bug

---

## 0.4.17

* optimize style & sprite

---

## 0.4.16

* fix `svg` bug for css
* update remote build

---

## 0.4.15

* fix `sprites` & `svg` task

---

## 0.4.14

* fix `clean` task

---

## 0.4.13

* add custom workspace
* update `cache` config & log
* update `styles` task
* update `extras` task

---

## 0.4.12

* fix `html` task bug

---

## 0.4.11

* refactor task
* update `build` task
* fix `webpack` vendors
* add `ftp` task

---

## 0.4.10

* add `svg` task

---

## 0.4.9

* fix `clean` task bug

---

## 0.4.8

* fix windows path bug

---

## 0.4.7

* update `build` task
* fix some bug

---

## 0.4.6

* add `webpack` vendors

---

## 0.4.5

* fix config tmp path bug

---

## 0.4.4

* add `js` task

---

## 0.4.3

* fix config tmp path
* fix `webpack` build for production

---

## 0.4.2

* add `css` task
* add `webpack` alias
* fix `webpack` entry bug

---

## 0.4.1

* fix `version` bug

---

## 0.4.0

* add `copy` task
* add `zip` task
* add `custom` task
* fix `build` task
* fix `webpack` callback

---

## 0.3.0

* refactoring

---

## 0.2.0

* add `less` task
* add `sprites` task

---

## 0.1.0

* Demo
