# [BalmJS](https://balmjs.com/) CHANGELOG

> **Tags:** (@since `balm@0.23`)
>
> - :tada: [Releases]
> - :rocket: [New Features]
> - :bug: [Bug Fixes]
> - :eyeglasses: [Spec Compliancy]
> - :nail_care: [Polish]
> - :boom: [Breaking Change]
> - :memo: [Documentation]
> - :house: [Code Refactoring]
> - :package: [Update Dependencies]

## 1.5.5 (2019.06.14)

### :rocket: [New Features]

- New Config
  - `styles.sassOptions`
  - `styles.lessOptions`

### :package: [Update Dependencies]

- `css-loader`: 2.x -> 3.x

---

## 1.5.4 (2019.06.11)

### :bug: [Bug Fixes]

- update `gulp-rev-all` and fix replacement on Windows

---

## 1.5.3 (2019.06.10)

### :boom: [Breaking Change]

- `deps`: minimum required nodejs version is `8.9.0`

### :package: [Update Dependencies]

- `file-loader`: 3.x -> 4.x
- `url-loader`: 1.x -> 2.x

---

## 1.5.2 (2019.06.05)

### :nail_care: [Polish]

- update clean task for building dynamic project

---

## 1.5.1 (2019.06.04)

### :bug: [Bug Fixes]

- fix PostCSS autoprefixer bug

### :eyeglasses: [Spec Compliancy]

- clean code for deprecated config tips

### :boom: [Breaking Change]

- Config
  - `config.styles.autoprefixer` was removed in balm@1.5.1, use a `.browserslistrc` config file in current or parent directories instead.

### :package: [Update Dependencies]

- `autoprefixer`: 9.5.x -> 9.6.x

---

## :tada: 1.5.0 (2019.05.31)

> `balm@1.5.0` for three years old and keep pioneering

### :rocket: [New Features]

- optimize code for dynamic language project (e.g. PHP)
- update config
  - `assets.buildDir`: new config for building dynamic language project
  - `assets.options.fileNameManifest`: restore defaults to `'rev-manifest.json'`

### :house: [Code Refactoring]

- refactor partial code for dynamic language project
- add test demo for dynamic language project

### :package: [Update Dependencies]

- `gulp-rev-all`: 1.x -> 2.x
- `gulp-zip`: 4.x -> 5.x
- `mini-css-extract-plugin`: 0.6.x -> 0.7.x
- `gulp-imagemin`: 5.x -> 6.x

---

## 1.4.2 (2019.05.27)

### :package: [Update Dependencies]

- `async`: 2.6.2 -> 3.0.1
- `merge-stream`: 1.0.1 -> 2.0.0

---

## 1.4.1 (2019.05.14)

### :rocket: New Features

- Update config
  - `pwa.enabled`: new config for automatic build PWA

### :nail_care: [Polish]

- clean code & some performance optimization
- update PWA task

---

## 1.4.0 (2019.05.13)

### :rocket: New Features

- PWA supported
  - `mix.generateSW`
  - `mix.injectManifest`
- Update config
  - `assets.options.fileNameManifest`: update defaults to `asset-manifest.json`

### :nail_care: [Polish]

- some performance optimization

### :boom: [Breaking Change]

- Update config
  - `ftp.username`: `ftp.user` rename to `ftp.username`
  - `ftp.password`: `ftp.pass` rename to `ftp.password`

---

## 1.3.2 (2019.04.12)

### :bug: [Bug Fixes]

- `mix.remove` bugfix

---

## 1.3.1 (2019.04.11)

### :bug: [Bug Fixes]

- `assets.publicUrl`: bugfix for dev mode

---

## 1.3.0 (2019.04.10)

### :nail_care: [Polish]

- `webpack.DefinePlugin`: clear code for webpack@4 defaults

### :package: Update Dependencies

- `mini-css-extract-plugin`: 0.5.0 -> 0.6.0

---

## 1.2.0 (2019.04.08)

### :bug: [Bug Fixes]

- fix extra task bug

### :nail_care: [Polish]

- adjust lint task

---

## 1.1.5 (2019.04.02)

### :bug: [Bug Fixes]

- bugfix for babel rules

---

## 1.1.4 (2019.04.01)

### :nail_care: [Polish]

- update hot reload
- update babel rules for default
- update multiple proxies

---

## 1.1.3 (2019.03.04)

### :nail_care: [Polish]

- clean code for style tasks

### :package: Update Dependencies

- `del`: 3.0.0 -> 4.0.0

---

## 1.1.2 (2019.03.02)

### :bug: [Bug Fixes]

- fix inject template scripts bug in SSR production

### :boom: [Breaking Change]

- Config
  - remove `scripts.filename`
  - add `scripts.inject` for SSR

---

## 1.1.1 (2019.02.27)

### :bug: [Bug Fixes]

- fix server task's watch bug in windows

---

## 1.1.0 (2019.02.21)

### :rocket: New Features

- change `uglifyjs-webpack-plugin` to `terser-webpack-plugin`
- run the build command with an extra argument (`--report`) to view the bundle analyzer
- Vue SSR Support

---

## 1.0.2 (2019.02.04)

> :tada: Happy Lunar New Year

### :eyeglasses: [Spec Compliancy]

- add compatibility hint

---

## 1.0.1 (2019.02.03)

### :bug: [Bug Fixes]

- API `mix.ftp`: fix `filename` param

---

## 1.0.0 (2019.02.03)

### :rocket: New Features

- New balm tasks for `gulp@4`
- Optimize partial APIs
- Update all demos for new version

### :bug: [Bug Fixes]

- Fix hot reload bug

### :boom: [Breaking Change]

- Config
  - update `production` to `isProd`
  - add `isTest` and `isDev`
  - remove `zip`
  - update `assets.publicPath` to `assets.mainDir`
  - add `ftp.logging`
  - update default value for `server.devOptions` and `server.hotOptions`
  - remove `sprites.mode` and `sprites.svg`
- Remove SVG sprites task

### :house: [Code Refactoring]

- Refactor balm tasks
- Refactor unit testing

---

## [0.6.x - 0.24.x](CHANGELOG-0.24.x.md)

## [0.1.x - 0.5.x](CHANGELOG-0.5.x.md)
