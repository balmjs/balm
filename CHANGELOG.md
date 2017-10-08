## 0.10.0 (2017.10.8)

__New feature: We can run `npm run prod` when `npm run dev` is running__

### New

- refactor file system
- optimize api
- update dependencies
- update docs

### Config

- `beforeTask`
- `afterTask`

### Task

- update `clean` folder for media
- update `server` deps for media and fix watch html bug
- fix `cache` bug
- fix `media` task for development
- remove `mix.end` task
- optimize `default` task

### Unit Test

- config
- default
- copy
- css
- sass
- less
- cssmin
- js
- jsmin
- version
- zip
- publish
- remove

---

## 0.9.1 (2017.09.21)

### New

#### Config

- `scripts.include`
- `paths.source.media`
- `paths.target.media`

#### Task

- add `media` task

### Optimization

- update eslint config
- update project architecture
- update webpack plugins

### Bugfix

- fix build `manifest.json` for PWA
- fix `html` task

### Test

- add media test

---

## 0.9.0 (2017.09.05)

- clean code
- optimized `cache`
- update test

🎉 __New feature - Library Code Splitting__

__balmrc.js__

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

__desktop.html__

```html
<body>
  ...

  <!-- build:js js/cdn/lib-desktop.js -->
  <script src="/node_modules/jquery/dist/jquery.min.js"></script>
  <!-- endbuild -->

  <script src="%PUBLIC_URL%/scripts/desktop.js"></script>
</body>
```

__mobile.html__

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

- update `scripts.options.compress` default value
- optimize build

---

## 0.8.5 (2017.08.12)

### Bugfix

- restore `scripts.stats` default value

### Update dependencies

---

## 0.8.4 (2017.08.02)

### Deprecated config

- `scripts.extends`

### New config

- `scripts.library`
- `scripts.libraryTarget`
- `scripts.webpack`

---

## 0.8.3 (2017.07.23)

- remove `gulp-autoprefixer` dependencies
- use `gulp-postcss` & `autoprefixer` for all styles

---

## 0.8.2 (2017.07.21)

- `html` task bugfix for `manifest.json`

---

## 0.8.1 (2017.07.20)

### Deprecated config

- `html.regex`

### Update html template

- change `css` to `styles` pathname for default config
- change `js` to `scripts` pathname for default config

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

- `html.replacement`
- `scripts.publicPath`

### New config

- `assets.publicUrlPlaceholder`
- `assets.publicUrl`

🎉 __New Feature: html templates can use `%PUBLIC_URL%` for CDN__

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

- fix external url in `styles` task
- deprecated `.sass` (recommended `.scss`)

---

## 0.7.5 (2017.07.09)

- update dependencies

---

## 0.7.4 (2017.06.27)

- `manifest.json` dest bugfix

---

## 0.7.3 (2017.06.24)

- remove `publicUrl` config for html
- update `html` task for RegExp
- update docs

---

## 0.7.2 (2017.06.23)

- `extras` bugfix
- <del>add `publicUrl` config for html</del>
- add `jsmin` error handling
- <del>add `%PUBLIC_URL%` variable for sites</del>
- add rename option for `cssmin` & `jsmin`

---

## 0.7.1 (2017.06.21)

- update dependencies
- update `webpack@3`

---

## 0.7.0 (2017.06.19)

- update `babel-preset` & `babel-plugin`

🎉 __New Feature: `.babelrc` for all [balm-templates](https://github.com/balmjs/balm-cli)__

```
{
  "presets": ["env"],
  "plugins": ["transform-runtime"]
}
```

---

## 0.6.3 (2017.06.15)

- update dependencies
- update `eslint@4`

---

## 0.6.2 (2017.06.10)

- update postcss config
- update test for `@import` css/sass/scss/less
- remove `postcss-scss` & `precss` dependencies
- add `postcss-cssnext` & `postcss-import` dependencies

---

## 0.6.1 (2017.06.03)

- add `includes` config for assets cache

---

## 0.6.0 (2017.06.03)

- use node >= 6 (Recommended)
- update dependencies
- use `webpack@2`
- remove `json-loader`
- clean code
- update test
- update uglifyjs for production
- update docs
- add `end` task
- add `includePaths` config for styles(sass/less)
- add `historyApiFallback` config for server
- automatic setting scripts' `vendors` by `entry`
- add test for `OS X/Windows/Linux`

---

## 0.5.7

- fix browser reload
- fix `version` for vendor all in one
- update dependencies
- fix test

---

## 0.5.6

- from `npm` to `yarn`
- update dependencies

---

## 0.5.5

- update dependencies

---

## 0.5.4

- update logger
- update dependencies

---

## 0.5.3

- fix browser sync reload bug

---

## 0.5.2

- add `sprites` & `svg` padding
- update dependencies

---

## 0.5.1

- update sourcemap config for scripts
- update documents

---

## 0.5.0

- refactoring
- update dependencies

---

## 0.4.37

- update `webpack` task for vendors
- update dependencies

---

## 0.4.36

- fix `html` task for replace references

---

## 0.4.35

- fix `html` task for replace references

---

## 0.4.34

- fix `html` task for build

---

## 0.4.33

- update `less` error handling
- update styles config
- update `lint` task
- update dependencies

---

## 0.4.32

- fix `style` task
- update `clean` task
- update watch
- update html config
- update dependencies

---

## 0.4.31

- fix assets path

---

## 0.4.30

- fix `svg` bug

---

## 0.4.29

- refactor assets system
- add `remove` task
- update `publish` task
- update dependencies

---

## 0.4.28

- update `publish` task

---

## 0.4.27

- add `publish` task
- update `copy` task

---

## 0.4.26

- update watch for style

---

## 0.4.25

- fix less bug

---

## 0.4.24

- fix watch task
- fix style for `css`/`less`

---

## 0.4.23

- update custom task

---

## 0.4.22

- add rename for `copy`
- code optimization

---

## 0.4.21

- update documents
- update dependencies

---

## 0.4.20

- update proxy for server

---

## 0.4.19

- add HMR switch for script

---

## 0.4.18

- fix some bug

---

## 0.4.17

- optimize style & sprite

---

## 0.4.16

- fix `svg` bug for css
- update remote build

---

## 0.4.15

- fix `sprites` & `svg` task

---

## 0.4.14

- fix `clean` task

---

## 0.4.13

- add custom workspace
- update `cache` config & log
- update `styles` task
- update `extras` task

---

## 0.4.12

- fix `html` task bug

---

## 0.4.11

- refactor task
- update `build` task
- fix `webpack` vendors
- add `ftp` task

---

## 0.4.10

- add `svg` task

---

## 0.4.9

- fix `clean` task bug

---

## 0.4.8

- fix windows path bug

---

## 0.4.7

- update `build` task
- fix some bug

---

## 0.4.6

- add `webpack` vendors

---

## 0.4.5

- fix config tmp path bug

---

## 0.4.4

- add `js` task

---

## 0.4.3

- fix config tmp path
- fix `webpack` build for production

---

## 0.4.2

- add `css` task
- add `webpack` alias
- fix `webpack` entry bug

---

## 0.4.1

- fix `version` bug

---

## 0.4.0

- add `copy` task
- add `zip` task
- add `custom` task
- fix `build` task
- fix `webpack` callback

---

## 0.3.0

- refactoring

---

## 0.2.0

- add `less` task
- add `sprites` task

---

## 0.1.0

- Demo
