# BalmJS [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
>

## Installation

```sh
$ npm install --save-dev balm gulp
```

## Usage

```js
// gulpfile.js
var balm = require('balm');

balm.config = {
  // your project config
};

balm.go();
```

```sh
# for development
$ gulp

# for production
$ gulp --production
```

## Config

```
// for ES6
$ npm install --save-dev babel-preset-es2015

// .babelrc
{
  "presets": ["es2015"]
}
```

### Root

```
{
  ...
  roots: {
    app: 'app',  // input folder
    dist: 'dist' // output folder
  },
  ...
}
```

### Path

```
{
  ...
  paths: {
    app: {
      html: '/',
      css: '/styles',
      js: '/scripts',
      img: '/images',
      font: '/fonts'
    },
    dist: {
      html: '/',
      css: '/css',
      js: '/js',
      img: '/img',
      font: '/fonts'
    }
  },
  ...
}
```

### Style

```
{
  ...
  styles: {
    AUTOPREFIXER: ['last 2 versions'],
    ext: 'scss'
  },
  ...
}
```

> __Support extension:__ sass, scss, less

### Script

```
{
  ...
  scripts: {
    entry: {
      'main': './app/scripts/main.js'
    }
  },
  ...
}
```

### Sprite

```
{
  ...
  sprites: {
    basePath: '..',      // relative to css file
    cssPath: '/sprites', // css folder
    imgList: ['icon']    // image folder
  },
  ...
}
```

## License

 © [elf-mouse](http://elf-mouse.me/)


[npm-image]: https://badge.fury.io/js/balm.svg
[npm-url]: https://npmjs.org/package/balm
[travis-image]: https://travis-ci.org/balm.svg?branch=master
[travis-url]: https://travis-ci.org/balm
[daviddm-image]: https://david-dm.org/balm.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/balm

__thx node&gulp__
