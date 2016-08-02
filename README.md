# BalmJS [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> A flexible Front-End workflow

## Demo

- [x] [HTML](https://github.com/balmjs/balm-html)
- [x] [Laravel](https://github.com/balmjs/balm-laravel)
- [x] [Vue](https://github.com/balmjs/balm-vue)
- [x] [TypeScript](https://github.com/balmjs/balm-ts)

## [Structure](https://github.com/balmjs/balm-boilerplate)

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

## [Installation & Setup](docs/installation.md)

```sh
npm install --save-dev balm gulp
```

## [Configuration](docs/configuration.md)

- [example](docs/_gulpfile.js)
- [template](docs/_index.html)

```js
// File: gulpfile.js

var balm = require('balm');

balm.config = {
  // your project config
};

balm.go();
```

## Usage

```sh
# for development
$ gulp

# for production
$ gulp --production
```


## [Changelog](docs/changelog.md)


## License

 © [Elf-mousE](http://elf-mouse.me/)


[npm-image]: https://badge.fury.io/js/balm.svg
[npm-url]: https://npmjs.org/package/balm
[travis-image]: https://travis-ci.org/balmjs/balm.svg?branch=master
[travis-url]: https://travis-ci.org/balmjs/balm
[daviddm-image]: https://david-dm.org/balmjs/balm.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/balmjs/balm

> __thx [node](https://nodejs.org/en/)&[gulp](http://gulpjs.com/)&[webpack](http://webpack.github.io/)__
