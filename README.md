# BalmJS [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
>

## Demo

- [x] [HTML](https://github.com/balmjs/balm-html)
- [x] [Laravel](https://github.com/balmjs/balm-laravel)
- [x] [Vue](https://github.com/balmjs/balm-vue)
- [x] [TypeScript](https://github.com/balmjs/balm-ts)

## [Structure](https://github.com/balmjs/balm-boilerplate)

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
$ npm install babel-runtime
$ npm install webpack-hot-middleware
```

```
// for ES6 compilation ability
$ npm install --save-dev babel-preset-es2015

// for ES7 compilation ability
$ npm install --save-dev babel-preset-stage-0

// .babelrc
{
  "presets": ["es2015", "stage-0"]
}
```

```
// just for IE8(ES3)
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

```js
{
  ...
  static: false, // set `true` for the static HTML project
  ...
}
```

### Server

```js
{
  ...
  server: {
    host: null,
    port: 3000,
    proxy: undefined, // your.project.local
    proxyTable: {
      // '/api': {
      //   target: 'http://your.project.local', // target host
      //   changeOrigin: true // needed for virtual hosted sites
      // }
    }
  },
  ...
}
```

### Root

```js
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

```js
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
    }
  },
  ...
}
```

### Style

```js
{
  ...
  styles: {
    autoprefixer: ['last 1 version'],
    ext: 'css'
  },
  ...
}
```

> __Support extension:__ [css](http://postcss.org/), [less](http://lesscss.org/), [sass](http://sass-lang.com/), [scss](http://sass-lang.com/)

### Script

```js
{
  ...
  scripts: {
    entry: {
      // 'common': ['jquery'],
      'main': './app/scripts/main.js'
    },
    vendors: [], // e.g. 'common' = scripts.entry.common
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

> __BalmJS__ default loaders:

- [`html`](https://github.com/webpack/html-loader)
- [`style`](https://github.com/webpack/style-loader)
- [`css`](https://github.com/webpack/css-loader)
- [`postcss`](https://github.com/postcss/postcss-loader)
- [`babel`](https://github.com/babel/babel-loader)
- [`url`](https://github.com/webpack/url-loader)
- [`file`](https://github.com/webpack/file-loader)
- [`json`](https://github.com/webpack/json-loader)

> __BalmJS__ default extensions: `.js`, [`.jsx`](https://facebook.github.io/react/), [`.json`](http://www.json.org/).

### Sprite

```js
{
  ...
  sprites: {
    basePath: '..', // relative to css file
    image: [],      // image folder, e.g. 'icon'
    mode: 'css',    // svg mode
    svg: []         // svg folder
  },
  ...
}
```

> __SVG mode:__ `css`, `view`, `defs`, `symbol`, `stack`

### Cache

```js
{
  ...
  cache: {
    enabled: false,
    manifest: 'manifest.json',
    revDel: true
  },
  paths: {
    target: {
      cache: 'assets' // custom cache dir for the dynamic project
    }
  },
  scripts: {
    chunkFilename: '[chunkhash].js' // for asynchronous javascript
  },
  ...
}
```

### Zip

```js
{
  ...
  zip: 'archive.zip', // zip filename
  ...
}
```

### Ftp

```js
{
  ...
  ftp: {
    host: '', // required
    port: 22,
    user: 'anonymous',
    pass: null,
    remotePath: '/'
  },
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

> __thx [node](https://nodejs.org/en/)&[gulp](http://gulpjs.com/)&[webpack](http://webpack.github.io/)__
