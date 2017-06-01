# BalmJS [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> A flexible Front-End workflow for webapps

⚠️ __SASS__ compiler has error in `node@8` (We will fix it as soon as possible)

## Quick Start

👻 [The webapps' scaffolding tool](https://github.com/balmjs/balm-cli)

## Demo

- [x] [HTML](https://github.com/balmjs/demo-html)
- [x] [Laravel](https://github.com/balmjs/demo-laravel)
- [x] [Vue](https://github.com/balmjs/demo-vue)
- [x] [TypeScript](https://github.com/balmjs/demo-ts)
- [x] AnyAwesome...

## [Structure](https://github.com/balmjs/demo-boilerplate)

```
project
├── dist
├─┬ src
│ ├─┬ css
│ │ └── main.css
│ ├── img
│ ├─┬ js
│ │ └── main.js
│ └── index.html
├── dotfile
├── gulpfile.js
├── package.json
└── ...
```

## [Installation & Setup](https://github.com/balmjs/balm/blob/master/docs/installation.md)

```sh
yarn add -D gulp balm
# OR
npm install -D gulp balm
```

## [Configuration](https://github.com/balmjs/balm/blob/master/docs/configuration.md)

File: `gulpfile.js`

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

- [example](https://github.com/balmjs/balm/blob/master/docs/_gulpfile.js)
- [template](https://github.com/balmjs/balm/blob/master/docs/_index.html)

## [Custom Task](https://github.com/balmjs/balm/blob/master/docs/custom-task.md)

## Usage

```sh
# for development
$ gulp

# for production
$ gulp --production
```

## [Common Issues](https://github.com/balmjs/balm/blob/master/docs/issues.md)

## License

MIT © [Elf-mousE](http://elf-mouse.me/)


[npm-image]: https://badge.fury.io/js/balm.svg
[npm-url]: https://npmjs.org/package/balm
[travis-image]: https://travis-ci.org/balmjs/balm.svg?branch=master
[travis-url]: https://travis-ci.org/balmjs/balm
[daviddm-image]: https://david-dm.org/balmjs/balm.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/balmjs/balm
[coveralls-image]: https://coveralls.io/repos/balmjs/balm/badge.svg
[coveralls-url]: https://coveralls.io/r/balmjs/balm


> __thx [node](https://nodejs.org/) & [gulp](http://gulpjs.com/) & [webpack](http://webpack.github.io/)__
