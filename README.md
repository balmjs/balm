# BalmJS [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
>

## Demo

- [x] [HTML](https://github.com/balmjs/balm-html)
- [x] [Laravel](https://github.com/balmjs/balm-laravel)
- [ ] [Vue](https://github.com/balmjs/balm-vue)

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

```
// for IE8(ES3)
$ npm install --save-dev babel-preset-es2015-loose
$ npm install --save-dev babel-plugin-transform-es3-member-expression-literals
$ npm install --save-dev babel-plugin-transform-es3-property-literals

// .babelrc
{
  "presets": ["es2015-loose"],
  "plugins": [
    "transform-es3-member-expression-literals",
    "transform-es3-property-literals"
  ]
}
```

### Server

```
{
  ...
  server: {
    proxy: undefined, // e.g. project.local
    port: 9000,
    notify: false
  },
  ...
}
```

### Root

```
{
  ...
  roots: {
    source: 'app',  // input folder
    target: 'dist' // output folder
  },
  ...
}
```

### Path

```
{
  ...
  paths: {
    source: {
      base: '',
      html: '',
      css: 'styles', // css dir
      js: 'scripts', // javascript dir
      img: 'images', // image dir
      font: 'fonts'  // font dir
    },
    target: {
      base: '',
      html: '',
      css: 'css',
      js: 'js',
      img: 'img',
      font: 'fonts'
      // build: 'assets' // custom cache dir
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
    autoprefixer: ['last 2 versions'],
    ext: 'scss'
  },
  ...
}
```

> __Support extension:__ less, sass, scss

### Script

```
{
  ...
  scripts: {
    entry: {
      'main': './app/scripts/main.js'
    },
    loaders: [{
      test: /\.vue$/,
      loader: 'vue'
    }],
    extensions: ['.vue']
  },
  ...
}
```

> for your extension: `npm install --save-dev vue-loader`

### Sprite

```
{
  ...
  sprites: {
    basePath: '..',     // relative to css file
    cssPath: 'sprites', // css folder
    imgList: ['icon']   // image folder
  },
  ...
}
```

### Cache

```
{
  ...
  cache: false,
  ...
}
```

## License

 © [Elf-mousE](http://elf-mouse.me/)


[npm-image]: https://badge.fury.io/js/balm.svg
[npm-url]: https://npmjs.org/package/node
[travis-image]: https://travis-ci.org/balmjs/balm.svg?branch=master
[travis-url]: https://travis-ci.org/balmjs/balm
[daviddm-image]: https://david-dm.org/balmjs/balm.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/balmjs/balm

__thx node&gulp__
