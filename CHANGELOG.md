# [BalmJS](https://balm.js.org) CHANGELOG

> Born to build, better enterprise workflow with Node.js

- `balm-core`: globally for workflow compiler
- `balm`: locally for workflow runtime

> [`balm-core@3`](https://github.com/balmjs/balm/tree/master)(v3) supports for `node@10.13.0+`, `postcss@7`, `webpack@4`

## v4.31.0 / 2024-11-11

- update dependencies
  - `css-minimizer-webpack-plugin`: 6.x -> 7.x
  - `del`: 7.x -> 8.x
  - `esbuild`: 0.20 -> 0.24
  - `postcss-load-config`: 5.x -> 6.x
  - `postcss-preset-env`: 9.x -> 10.x
  - `sass-loader`: 14.x -> 16.x
  - `webpack-merge`: 5.x -> 6.x

## v4.30.0 / 2024-05-07

### Features

- update dependencies
  - `cssnano`: 6.x -> 7.x
  - `style-loader`: 3.x -> 4.x
  - `imagemin`: 8.x -> 9.x

## v4.29.0 / 2024-04-07

### Features

- update dependencies
  - `css-loader`: 6.x -> 7.x
  - `http-proxy-middleware`: 2.x -> 3.x

### BREAKING CHANGES

- update config: `server.proxyConfig` is deprecated, use `server.proxyOptions` instead

## v4.28.0 / 2024-03-01

### Features

- update dependencies
  - `dotenv-expand`: 10.x -> 11.x
  - `postcss-preset-env`: 7.x -> 9.x

## v4.27.2 / 2024-02-23

### Bug Fixes

- fix zip module bug

## v4.27.0 / 2024-02-08

### Features

- update sass compatibility for legacy
- update dependencies
  - `esbuild`: 0.19 -> 0.20

## v4.26.0 / 2024-01-23

- update dependencies
  - `css-minimizer-webpack-plugin`: 5.x -> 6.x
  - `html-loader`: 4.x -> 5.x
  - `postcss-import`: 15.x -> 16.x
  - `postcss-loader`: 7.x -> 8.x
  - `sass-loader`: 13.x -> 14.x

## v4.25.0 / 2023-12-28

### Features

- rename `global-dirs` to `global-directory`
- update dependencies
  - `browser-sync`: 2.x -> 3.x
  - `webpack-dev-middleware`: 6.x -> 7.x

### BREAKING CHANGES

- minimum supported Node.js version is `18.12.0`

## v4.24.0 / 2023-12-22

### Features

- revert `postcss-preset-env` to 7.x
- update dependencies
  - `global-dirs`: 3.x -> 4.x
  - `gulp-size`: 4.x -> 5.x
  - `gulp-zip`: 5.x -> 6.x
  - `istextorbinary`: 6.x -> 9.x
  - `rollup`: 3.x -> 4.x

### BREAKING CHANGES

- minimum supported Node.js version is `18`

## v4.23.4 / 2023-09-27

### Bug Fixes

- fix sass alias bug

## v4.23.0 / 2023-09-26

### Features

- update alias for sass
- update dependencies
  - `esbuild`: 0.18 -> 0.19

## v4.22.0 / 2023-08-15

### Features

- update dart sass 2.0

## v4.21.0 / 2023-06-08

### Chore

- update dependencies
  - `workbox-sw`: 6.x -> 7.x
  - `sass`: 1.62.1

## v4.20.0 / 2023-05-24

### Features

- support tailwindcss

## v4.19.0 / 2023-04-23

### Chore

- update dependencies
  - `css-minimizer-webpack-plugin`: 4.x -> 5.x
  - `cssnano`: 5.x -> 6.x

## v4.18.0 / 2023-03-31

### Features

- balm runtime compatible with Windows

## v4.17.2 / 2023-03-22

### Chore

- update sass loader default options

### Bug Fixes

- fix: local sass module loading bug

## v4.17.0 / 2023-03-20

### Chore

- update dependencies

## v4.16.0 / 2023-02-02

### Chore

- update sass compatibility for legacy

  `npm install --save-dev sass@1.39.2`

## v4.15.0 / 2023-02-01

- For balm v4

```sh
yarn global add balm-core
yarn add -D balm
```

OR

```sh
npm install -g balm-core
npm install -D balm
```

## v4.13.0 / 2023-01-30

### Chore

- update dependencies
  - `dotenv-expand`: 9.x -> 10.x
  - `esbuild`: 0.15 -> 0.17
  - `gulp-rev-all`: 3.x -> 4.x
  - `postcss-preset-env`: 7.x -> 8.x

### BREAKING CHANGES

- minimum supported Node.js version is `16`

## v4.12.0 / 2022-11-24

### Chore

- update dependencies
  - `babel-loader`: 8.x -> 9.x
  - `rollup`: 2.x -> 3.x
  - `webpack-dev-middleware`: 5.x -> 6.x

### BREAKING CHANGES

- minimum supported Node.js version is `14.18.0`

## v4.11.0 / 2022-09-20

### Chore

- update dependencies
  - `dotenv-expand`: 8.x -> 9.x
  - `esbuild`: 0.14 -> 0.15
  - `postcss-import`: 14.x -> 15.x

## v4.10.0 / 2022-07-20

### Chore

- update dependencies
  - `del`: 6.x -> 7.x

### Bug Fixes

- fix `extractAllVendors` chunks bug

## v4.9.0 / 2022-07-06

### Chore

- update dependencies
  - `connect-history-api-fallback`: 1.x -> 2.x
  - `mini-css-extract-plugin`: 2.5.2 -> 2.6.x
  - `plugin-error`: 1.x -> 2.x
  - `readable-stream`: 3.x -> 4.x

## v4.8.0 / 2022-05-28

### Chore

- update dependencies
  - `postcss-load-config`: 3.x -> 4.x

### Bug Fixes

- remove custom file loader for webpack

## v4.7.0 / 2022-05-22

### Features

- add dotenv files support
- add custom file loader for webpack
- update config
  - `styles.entry`: string | string[];
  - `scripts.imageAssetType`: string;
  - `scripts.imageInlineSizeLimit`: number;
  - `scripts.nodeEnv`: object;

### Chore

- update dependencies
  - `css-minimizer-webpack-plugin`: 3.x -> 4.x
  - `postcss-loader`: 6.x -> 7.x
  - `sass-loader`: 12.x -> 13.x

### BREAKING CHANGES

- minimum supported Node.js version is `14.15.0`

## v4.6.0 / 2022-04-29

### Chore

- update all dependencies for `node@12+`, `postcss@8`, `webpack@5`

## v4.5.5 / 2022-04-08

### Bug Fixes

- fix npm bug for `Ajv`

## v4.5.0 / 2022-04-07

### Features

- remove `file-loader` and `url-loader`, update to asset modules for webpack 5

### Chore

- remove `mini-css-extract-plugin` for `HTMLLinkElement` compiler bug

### BREAKING CHANGES

- remove config: `scripts.excludeUrlResource`, `scripts.urlLoaderOptions`
- update config: `script.defaultLoaders: BalmLoaders`

  ```ts
  interface BalmLoaders {
    js?: boolean;
    css?: boolean;
    html?: boolean;
    asset?: boolean; // old name is `url`
  }
  ```

## v4.4.0 / 2022-03-11

> support webpack 5 in ts-loader - thanks @einatbar

### Chore

- update dependencies
  - `pretty-bytes`: 5.x -> 6.x

## v4.3.0 / 2022-02-11

### Chore

- optimize sass and webpack info

## v4.2.0 / 2022-01-18

### Chore

- update dependencies
  - `esbuild`: 0.13 -> 0.14
  - `fancy-log`: 1.x -> 2.x
  - `postcss-preset-env`: 6.x -> 7.x
  - `sass`: 1.39.x -> 1.40+
  - `ssh`: 0.x -> 1.x

## v4.1.0 / 2021-10-28

### Chore

- update css plugins
- update dependencies
  - `html-loader`: 2.x -> 3.x

## v4.0.2 / 2021-10-11

### Bug Fixes

- `balm`: fix version detection bug

## v4.0.0 / 2021-10-09

### Features

- BalmJS 4.0 is released 🎉
- update `webpack@5` and dependencies
