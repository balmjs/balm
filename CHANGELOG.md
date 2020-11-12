# [BalmJS](https://balm.js.org) CHANGELOG

> Born to build, better enterprise workflow with Node.js

- `balm-core`: globally for workflow compiler
- `balm`: locally for workflow runtime

## v3.9.0 / 2020-11-12

### Features

- add config `scripts.bundler`
- add rollup bundler
- add api `mix.webpack`, `mix.rollup`, `mix.esbuild`
- update dependencies
  - `webpack-bundle-analyzer`: 3.x -> 4.x

### BREAKING CHANGES

- remove config `esbuild`
- rename config `options` to `minifyOptions`
- remove api `mix.js`

## v3.8.0 / 2020-10-31

### Features

- support for `npm@7`
- update dependencies
  - `esbuild`: 0.7.x -> 0.8.x
  - `gulp-useref`: 4.x -> 5.x
  - `postcss-import`: 12.x -> 13.x

## v3.7.0 / 2020-10-16

### Features

- add config `scripts.excludeUrlResource`
- update dependencies
  - `css-loader`: 4.x -> 5.x

## v3.6.0 / 2020-10-10

- update dependencies
  - `mini-css-extract-plugin`: 0.x -> 1.x
  - `style-loader`: 1.x -> 2.x

## v3.5.0 / 2020-09-29

- update dependencies
  - `autoprefixer`: 9.x -> 10.x
  - `del`: 5.x -> 6.x
  - `esbuild`: 0.6.x -> 0.7.x
  - `gulp-postcss`: 8.x -> 9.x
  - `postcss`: 7.x -> 8.x
  - `postcss-safe-parser`: 4.x -> 5.x
  - `yargs`: 15.x -> 16.x

## v3.4.1 / 2020-09-08

### Bug Fixes

- add `postcss` dependencies
- bugfix for `postcss-loader`
- fix docs url for check config function

## v3.4.0 / 2020-09-08

- update dependencies
  - `postcss-loader`: 3.x -> 4.x

## v3.3.3 / 2020-09-07

### Bug Fixes

- bugfix for detect local `balm-core`

## v3.3.2 / 2020-09-04

### Features

- optimize project running

1. using `balm go` command by [`balm-cli`](https://github.com/balmjs/balm-cli)
2. update `package.json`:

   ```json
   {
     "scripts": {
       "dev": "balm",
       "prod": "balm -p"
     }
   }
   ```

## v3.2.2 / 2020-09-04

### Bug Fixes

- check version for compatibility

## v3.2.0 / 2020-09-03

### Features

- optimize `balm` command

## v3.1.0 / 2020-09-02

### Features

- optimize electron support for desktop apps
- add config `env.inDesktopApp`

### BREAKING CHANGES

- remove config `server.localOnly`

## v3.0.1 / 2020-09-01

- export `Balm` for multiprocess instances

## v3.0.0 / 2020-08-31

### [Upgrading To 3.0 From 2.x](https://balm.js.org/docs/guide/upgrade/upgrade-3.0.html)

#### 1. Installing balm

```sh
yarn global add balm-core
yarn add -D balm
```

OR

```sh
npm install -g balm-core
npm install -D balm
```

#### 2. Upgrade entry config file

- <del>gulpfile.js</del> => **`balm.config.js`**

```js
module.exports = {
  // Your project config
};
```

OR

```js
const getConfig = require('./config/balmrc.js'); // Your project config

const api = (mix) => {
  // Custom tasks by API
};

module.exports = (balm) => {
  return {
    config: getConfig(balm),
    api
  };
};
```

- update `package.json`:

```json
{
  "scripts": {
    "dev": "balm",
    "prod": "balm -p"
  }
}
```

#### 3. `balm.config` Changes

- config.paths.source.**`html`**
- config.styles.<del>minified</del> => config.styles.`minify`
- config.scripts.<del>hot</del>
- config.scripts.**`esbuild`**
- config.scripts.**`buildOptions`**
- config.scripts.**`useTransform`**
- config.scripts.**`transformOptions`**
- config.assets.<del>publicUrlPlaceholder</del>
- config.assets.<del>publicUrl</del>
