# Configuration

```js
// File: gulpfile.js

var balm = require('balm');

balm.config = {
  // your project config
};

balm.go();
```

---

## Project Type

```js
static: true,
...
```

### `static`

- set `true` for a static HTML project
- set `false` for a dynamic language project (e.g. PHP framework)

> Default: `true`

## Server

```js
server: {
  host: '192.168.1.1',
  port: 8080,
  proxy: 'your.project.local'
  proxyTable: {
    '/api': {
       target: 'http://your.project.local', // target host
       changeOrigin: true // needed for virtual hosted sites
    }
  }
},
...
```

#### `server.host`

> Default: `null`

#### `server.port`

> Default: `3000`

#### `server.proxy`

Proxy an EXISTING vhost. Browsersync will wrap your vhost with a proxy URL to view your site.

> Default: `undefined`

#### `server.proxyTable`

Define HTTP proxies to your custom API backend

> Default: `{}`

## Root

```js
roots: {
  source: 'app',
  target: 'dist'
},
...
```

#### `roots.source`

Input folder (Source Code)

> Default: `'src'`

#### `roots.target`

Output folder (Production)

> Default: `'dist'`

## Path

```js
paths: {
  source: {
    base: '',
    html: '',
    css: 'styles',
    js: 'scripts',
    img: 'images',
    font: 'fonts'
  },
  target: {
    base: '',
    html: '',
    css: 'css',
    js: 'js',
    img: 'img',
    font: 'font'
  }
},
...
```

#### Source Input

##### `paths.source.base`

Application directory

> Default: `''`

##### `paths.source.html`

Template directory

> Default: `''`

##### `paths.source.css`

Stylesheet directory

> Default: `'styles'`

##### `paths.source.js`

JavaScript directory

> Default: `'scripts'`

##### `paths.source.img`

Image directory

> Default: `'images'`

##### `paths.source.font`

Font directory

> Default: `'fonts'`

#### Target Output

##### `paths.target.base`

> Default: `''`

##### `paths.target.html`

> Default: `''`

##### `paths.target.css`

> Default: `'css'`

##### `paths.target.js`

> Default: `'js'`

##### `paths.target.img`

> Default: `'img'`

##### `paths.target.font`

> Default: `'font'`

## Style

```js
styles: {
  ext: 'css',
  autoprefixer: ['last 1 version']
},
...
```

#### `styles.ext`

Supported CSS extensions are [css](http://postcss.org/), [sass](http://sass-lang.com/), [scss](http://sass-lang.com/), [less](http://lesscss.org/)

> Default: `'css'`

#### `styles.autoprefixer`

Parse CSS and add vendor prefixes to rules by [Can I Use](http://caniuse.com/)

> Default: `['last 1 version']`

## Script

```js
scripts: {
  entry: {
    // 'common': ['jquery'],
    'main': './app/scripts/main.js'
  },
  vendors: [], // e.g. 'common' = scripts.entry.common
  publicPath: '/js/',
  filename: '[name]',
  chunkFilename: '[id]',
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
  extends: {}
},
...
```

#### `scripts.entry`

The entry point for the bundle.

> Default: `{ 'main': './app/scripts/main.js' }`

#### `scripts.vendors`

Vendor Modules

> Default: `[]`

### Output

#### `scripts.publicPath`

The `publicPath` specifies the public URL address of the output files when referenced in a browser.

> Default: `'/js/'`

#### `scripts.filename`

Specifies the name of each output file on disk. You must __not__ specify an absolute path here!

> Default: `'[name]'`

#### `scripts.chunkFilename`

The filename of non-entry chunks as relative path inside the `output.path` directory.

- `[id]` is replaced by the id of the chunk.
- `[name]` is replaced by the name of the chunk (or with the id when the chunk has no name).
- `[hash]` is replaced by the hash of the compilation.
- `[chunkhash]` is replaced by the hash of the chunk.

> Default: `'[id]'`

### Module

#### `scripts.loaders`

An array of automatically applied loaders.

Each item can have these properties:

- `test`: A condition that must be met
- `exclude`: A condition that must not be met
- `include`: A condition that must be met
- `loader`: A string of “!” separated loaders
- `loaders`: An array of loaders as string

> Default: `[]`

__BalmJS__ default loaders:

- [`html`](https://github.com/webpack/html-loader)
- [`style`](https://github.com/webpack/style-loader)
- [`css`](https://github.com/webpack/css-loader)
- [`postcss`](https://github.com/postcss/postcss-loader)
- [`babel`](https://github.com/babel/babel-loader)
- [`url`](https://github.com/webpack/url-loader)
- [`file`](https://github.com/webpack/file-loader)
- [`json`](https://github.com/webpack/json-loader)

> [List of loaders](http://webpack.github.io/docs/list-of-loaders.html)

### Resolve

#### `scripts.extensions`

An array of extensions that should be used to resolve modules.

> Default: `[]`

__BalmJS__ default extensions:

- `.js`
- [`.json`](http://www.json.org/)
- [`.jsx`](https://facebook.github.io/react/)
- [`.vue`](http://vuejs.org/)

#### `scripts.alias`

Replace modules by other modules or paths.

> Default: `{}`

### Profile

#### `scripts.stats`

Capture timing information for each module.

> Default: `{
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }`

### Plugin

#### `scripts.plugins`

Add additional plugins to the compiler.

> Default: `[]`

#### `scripts.extends`

Extend config for webpack

> Default: `{}`

### Hot Reload

#### `scripts.HMR`

> Default: `true`

## Sprite

```js
sprites: {
  basePath: '../',
  image: [], // e.g. 'icon'
  mode: 'css',
  svg: [] // e.g. 'icon'
},
...
```

#### `sprites.basePath`

Path to use in CSS referring to image location

> Default: `'../'`

#### `sprites.image`

Image folder name

> Default: `[]`

#### `sprites.mode`

Output modes: `css`, `view`, `defs`, `symbol`, `stack`

> Default: `'css'`

#### `sprites.svg`

SVG folder name

> Default: `[]`

## Zip

```js
zip: 'archive.zip'
...
```

### `zip`

Zip filename

> Default: `'archive.zip'`

## Ftp

```js
ftp: {
  host: undefined,
  port: 22,
  user: 'anonymous',
  pass: null,
  remotePath: '/'
},
...
```

#### `ftp.host`

Required

> Default: `undefined`

#### `ftp.port`

> Default: `22`

#### `ftp.user`

> Default: `'anonymous'`

#### `ftp.pass`

> Default: `null`

#### `ftp.remotePath`

> Default: `'/'`

## Cache

```js
cache: true,
scripts: {
  chunkFilename: '[chunkhash]' // for asynchronous javascript
},
...
```

### `cache`

Versioning/Cache Busting switch

> Default: `false`

## Assets

```js
cache: true, // required
scripts: {
  publicPath: '/mobile/js/' // according to `assets.subDir`
},
assets: {
  manifest: 'manifest.json',
  root: 'assets',
  publicPath: 'public',
  subDir: 'mobile'
},
...
```

#### `assets.manifest`

Set the filename of the file created

> Default: `'manifest.json'`

#### `assets.root`

Remote project root simulation

> Default: `'assets'`

#### `assets.publicPath`

The `public` directory contains the front controller and your assets (images, JavaScript, CSS, etc.)

> Default: `'public'`

#### `assets.subDir`

Public subdirectory

> Default: `''`

---

### [Custom Task](custom-task.md)
