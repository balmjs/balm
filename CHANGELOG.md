# [BalmJS](https://balm.js.org) CHANGELOG

> Born to build, better enterprise workflow with Node.js

- `balm-core`: globally for workflow compiler
- `balm`: locally for workflow runtime

> [`balm-core@3`](https://github.com/balmjs/balm/tree/master)(v3) supports for `node@10.13.0+`, `postcss@7`, `webpack@4`

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
