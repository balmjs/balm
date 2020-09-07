# [BalmJS](https://balm.js.org) CHANGELOG

> Born to build, better enterprise workflow with Node.js

- `balm-core` globally for workflow compiler
- `balm` locally for workflow runtime

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
