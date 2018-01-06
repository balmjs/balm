<div align="center">
  <a href="http://balmjs.com/">
    <img width="128" heigth="128" src="http://balmjs.com/logo.png" alt="BalmJS">
  </a>
  <br>
  <br>

  [![NPM version][npm-image]][npm-url]
  [![Build Status][travis-image]][travis-url]
  [![Build Status][appveyor-image]][appveyor-url]
  [![Dependency Status][daviddm-image]][daviddm-url]
  [![Coverage percentage][coveralls-image]][coveralls-url]
  <br>

  <h1>BalmJS</h1>
  <p>A flexible Front-End workflow for webapps</p>
</div>

## What's BalmJS?

BalmJS prescribes best practices and tools to help you stay productive.

## Structure

> Returning to webapp's original nature.

```
project
├── .tmp // Scaffolds out a temporary directory for development
├── dist // Scaffolds out the production build
├─┬ src  // Source code in here
│ ├─┬ styles
│ │ └── main.css
│ ├─┬ scripts
│ │ └── main.js
│ ├── images
│ ├── fonts
│ ├── media
│ └── index.html
├─┬ config
│ ├── balmrc.js
│ └── publish.js
├── .dotfile (.babelrc, .gitignore, etc...)
├── gulpfile.js
├── package.json
└── ...
```

## Ecosystem

Project | Status | Description
------- | ------ | -----------
[balm-cli](https://github.com/balmjs/balm-cli) | [![NPM version][balm-cli-image]][balm-cli-url] | :spades: BalmJS scaffolding tool :ghost:
[balm-gui](https://github.com/balmjs/balm-gui) | N/A |
:clubs: GUI for BalmJS
[balm-ui-lite](https://github.com/balmjs/ui-vue-lite) | [![NPM version][balm-ui-lite-image]][balm-ui-lite-url] | :hearts: Material Design Lite + Vue
[balm-ui](https://github.com/balmjs/ui-vue)    | [![NPM version][balm-ui-image]][balm-ui-url] | :diamonds: Material Components + Vue

## Demo

- [x] [Simple HTML](https://github.com/balmjs/demo-html)
- [x] [Laravel](https://github.com/balmjs/demo-laravel)
- [x] [Vue](https://github.com/balmjs/demo-vue)
- [x] [TypeScript](https://github.com/balmjs/demo-ts)
- [x] Yours awesome projects...

## Installation

### 0. Requirements

You need to set up your development environment before you can do anything.

Install [Node.js® and npm](https://nodejs.org/en/download/) if they are not already on your machine.

> __Verify that you are running at least node `6.x.x` and npm `3.x.x`__ by running `node -v` and `npm -v` in a terminal/console window. Older versions produce errors, but newer versions are fine.

BalmJS workflow using [gulp](https://gulpjs.com/) for the build process, so you need install `gulp`.

```sh
npm install --global gulp-cli

# Verify
gulp -v
```

### 1. Installing __`balm`__

```sh
yarn add -D gulp balm

# OR
npm i -D gulp balm
```

### 2. Configuration

Edit `gulpfile.js`

```js
// 1. import balm
var balm = require('balm');

// 2. config balm
balm.config = {
  // your project config
};

// 3. run balm
balm.go();
```

:page_with_curl: Refer to [our documentation](https://github.com/balmjs/balm/blob/master/docs/configuration.md) to learn more about config __`balm`__.

### 3. Usage

```sh
# for development
$ gulp

# for production
$ gulp --production
```

## Documentation

- Getting Started
- [Configuration](https://github.com/balmjs/balm/blob/master/docs/configuration.md)
- Recipes
- FAQ

## License

[MIT](https://opensource.org/licenses/MIT)

© 2016-present, [Elf-mousE](http://elf-mouse.me/)

## Thanks to

In chronological order

- [Node.js](https://nodejs.org/)
- [gulp.js](https://gulpjs.com/)
- [webpack](https://webpack.js.org/)


[npm-image]: https://badge.fury.io/js/balm.svg
[npm-url]: https://npmjs.org/package/balm
[travis-image]: https://travis-ci.org/balmjs/balm.svg?branch=master
[travis-url]: https://travis-ci.org/balmjs/balm
[appveyor-image]: https://ci.appveyor.com/api/projects/status/github/balmjs/balm?svg=true
[appveyor-url]: https://ci.appveyor.com/project/balmjs/balm
[daviddm-image]: https://david-dm.org/balmjs/balm.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/balmjs/balm
[coveralls-image]: https://coveralls.io/repos/balmjs/balm/badge.svg
[coveralls-url]: https://coveralls.io/r/balmjs/balm

[balm-cli-image]: https://badge.fury.io/js/balm-cli.svg
[balm-cli-url]: https://npmjs.org/package/balm-cli
[balm-ui-lite-image]: https://badge.fury.io/js/balm-ui-lite.svg
[balm-ui-lite-url]: https://npmjs.org/package/balm-ui-lite
[balm-ui-image]: https://badge.fury.io/js/balm-ui.svg
[balm-ui-url]: https://npmjs.org/package/balm-ui
