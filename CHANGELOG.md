# [BalmJS](https://balmjs.com/) CHANGELOG

## v2.2.2 / 2020-01-01

:tada: Hello, 2020!

## v2.2.1 / 2019-12-29

### Bug Fixes

- fix scripts entries for custom vendors

## v2.2.0 / 2019-12-25

### Chores

- devDependencies: up to date
  - `babel-plugin-istanbul`: 5.x -> 6.x
  - `nyc`: 14.x -> 15.x

### Features

- Update `balm.config`
  - `scripts.ie8: boolean = false`

## v2.1.1 / 2019-12-22

### Chores

- dependencies: up to date

### Features

- Update `balm.config`
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

- Improved `url-loader` default rule
- Update `balm.config`
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

- Deprecated `balm.config`
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

- Update `balm.config`
  - restore `scripts.extractAllVendors: boolean = false` from balm v1
  - restore `scripts.vendorName: string = 'vendor'` from balm v1

### BREAKING CHANGES

- Deprecated `balm.config`
  - scripts.<del>`splitAllVendors`</del>
  - scripts.<del>`vendorsName`</del>: string = <del>`'vendors'`</del>

## v2.0.1

### Features

- Update `balm.config`
  - restore `extras.includes` from balm v1

## v2.0.0 / 2019-11-20

> It is a new starting point

- `balm@2.0.0` released :tada:
- Code Refactoring by TypeScript :ghost:
- `balm.config` Full Upgrade :rocket:
- [Upgrading To 2.0.0 From 1.x](https://balmjs.com/docs/v2/guide/upgrade/upgrade-2.0.html)
