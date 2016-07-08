# BalmJS [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
>

## Demo

- [x] [HTML](https://github.com/balmjs/balm-html)
- [x] [Laravel](https://github.com/balmjs/balm-laravel)
- [x] [Vue](https://github.com/balmjs/balm-vue)
- [x] [TypeScript](https://github.com/balmjs/balm-ts)

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
// just for npm2
$ npm install webpack-hot-middleware
```

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

### Project Type

```
{
  ...
  static: false, // set `true` for the static HTML project
  ...
}
```

### Server

```
{
  ...
  proxy: undefined, // your.project.local
  server: {
    host: null,
    port: 3000
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
      // cache: 'assets' // custom cache dir
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

> __Support extension:__ css, less, sass, scss

### Script

```
{
  ...
  scripts: {
    entry: {
      'main': './app/scripts/main.js'
    },
    vendors: [], // e.g. 'jquery'
    publicPath: '/js/',
    filename: '[name].js',
    chunkFilename: '[id].js',
    loaders: [], // e.g. { test: /\.vue$/, loader: 'vue' }
    extensions: [], // e.g. '.vue'
    alias: {},
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    },
    plugins: [],
    extends: {} // for webpack config
  },
  ...
}
```

> __BalmJS__ default loaders: `html`, `style`, `css`, `postcss`, `babel`, `url`, `file`, `json`.

> __BalmJS__ default extensions: `.js`, `.jsx`, `.json`.

### Sprite

```
{
  ...
  sprites: {
    basePath: '..',     // relative to css file
    cssPath: 'sprites', // css folder
    imgList: []         // image folder, e.g. 'icon'
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

### Zip

```
{
  ...
  zip: 'archive', // zip filename
  ...
}
```

## License

 © [Elf-mousE](http://elf-mouse.me/)


[npm-image]: https://badge.fury.io/js/balm.svg
[npm-url]: https://npmjs.org/package/balm
[travis-image]: https://travis-ci.org/balmjs/balm.svg?branch=master
[travis-url]: https://travis-ci.org/balmjs/balm
[daviddm-image]: https://david-dm.org/balmjs/balm.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/balmjs/balm

__thx node&gulp__
