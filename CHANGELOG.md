# [BalmJS](https://balm.js.org) CHANGELOG

> Born to build, better enterprise workflow with Node.js

- `balm-core`: globally for workflow compiler
- `balm`: locally for workflow runtime

## v4.5.2 / 2022-04-02

### Bug Fixes

- fix some bug for `Ajv`

## v4.5.0 / 2022-04-02

### Features

- remove `file-loader` and `url-loader`, update to asset modules for webpack 5

### Chore

- remove `mini-css-extract-plugin` for `HTMLLinkElement` compiler bug

### BREAKING CHANGES

- remove config: `scripts.excludeUrlResource`, `scripts.urlLoaderOptions` and `scripts.extractCss`
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
