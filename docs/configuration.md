# Configuration

File: `gulpfile.js`

```js
var balm = require('balm');

balm.config = {
  // Your project config
};

balm.go();
```

1. [__Project Type__](#project-type)
    - [static](#static)
2. [__Server__](#server)
    - [server.open](#serveropen)
    - [server.host](#serverhost)
    - [server.port](#serverport)
    - [server.proxy](#serverproxy)
    - [server.proxyTable](#serverproxytable)
3. [__Root & Path__](#root-path)
    - Source Input
        - [roots.source](#rootssource)
        - [paths.source.base](#pathssourcebase)
        - [paths.source.css](#pathssourcecss)
        - [paths.source.js](#pathssourcejs)
        - [paths.source.img](#pathssourceimg)
        - [paths.source.font](#pathssourcefont)
    - Target Output
        - [roots.target](#rootstarget)
        - [paths.target.base](#pathstargetbase)
        - [paths.target.css](#pathstargetcss)
        - [paths.target.js](#pathstargetjs)
        - [paths.target.img](#pathstargetimg)
        - [paths.target.font](#pathstargetfont)
4. [__HyperText Markup Language__](#html)
    - [html.regex](#htmlregex)
    - [html.replacement](#htmlreplacement)
    - [html.options](#htmloptions)
5. [__Cascading Style Sheets__](#style)
    - [styles.ext](#stylesext)
    - [styles.autoprefixer](#stylesautoprefixer)
    - [styles.postcss](#stylespostcss)
    - [styles.options](#stylesoptions)
6. [__JavaScript__](#script)
    - Entry
        - [scripts.entry](#scriptsentry)
    - Output
        - [scripts.filename](#scriptsfilename)
        - [scripts.publicPath](#scriptspublicpath)
        - [scripts.chunkFilename](#scriptschunkfilename)
        - [scripts.vendor](#scriptsvendor)
        - [scripts.vendors](#scriptsvendors)
    - Module
        - [scripts.loaders](#scriptsloaders)
    - Resolve
        - [scripts.extensions](#scriptsextensions)
        - [scripts.alias](#scriptsalias)
    - Plugins
        - [scripts.plugins](#scriptsplugins)
    - DevServer
        - [scripts.hot](#scriptshot)
    - Devtool
        - [scripts.sourceMap](#scriptssourcemap)
    - Target
        - [scripts.target](#scriptstarget)
    - Stats
        - [scripts.stats](#scriptsstats)
    - Other Options
        - [scripts.extends](#scriptsextends)
        - [scripts.eslint](#scriptseslint)
7. [__CSS Sprites__](#sprite)
    - [sprites.basePath](#spritesbasepath)
    - [sprites.padding](#spritespadding)
    - [sprites.image](#spritesimage)
    - [sprites.mode](#spritesmode)
    - [sprites.svg](#spritessvg)
8. [__Extra Files__](#extra)
    - [excludes](#extrasexcludes)
    - [includes](#extrasincludes)
9. [__Publish__](#publish)
    - Zip
        - [zip](#zip)
    - FTP
        - [ftp.host](#ftphost)
        - [ftp.port](#ftpport)
        - [ftp.user](#ftpuser)
        - [ftp.pass](#ftppass)
        - [ftp.remotePath](#ftpremotepath)
    - Cache
        - [cache](#cache)
    - Assets
        - [assets.manifest](#assetsmanifest)
        - [assets.root](#assetsroot)
        - [assets.publicPath](#assetspublicpath)
        - [assets.subDir](#assetssubdir)
10. [__Custom Task__](custom-task.md)

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
  // proxy: 'your.project.local' // proxy all
  proxyTable: { // proxy partial
    '/api': { // context
       target: 'http://your.project.dev', // target host
       changeOrigin: true // needed for virtual hosted sites
    }
  }
},
...
```

### `server.open`

Decide which URL to open automatically when server starts.

> Default: `true`

### `server.host`

> Default: `null`

### `server.port`

> Default: `3000`

### `server.proxy`

Proxy an EXISTING vhost. Browsersync will wrap your vhost with a proxy URL to view your site.

> Default: `undefined`

### `server.proxyTable`

Define HTTP proxies to your custom API backend

> Default: `{}`

- full list of `http-proxy-middleware` [configuration options](https://github.com/chimurai/http-proxy-middleware#options)

## Root & Path

```js
roots: {
  source: 'app',
  target: 'dist'
},
paths: {
  source: {
    css: 'styles',
    js: 'scripts',
    img: 'images',
    font: 'fonts'
  },
  target: {
    css: 'css',
    js: 'js',
    img: 'img',
    font: 'font'
  }
},
...
```

### `roots.source`

Input folder (Source Code)

> Default: `'src'`

### `roots.target`

Output folder (Production)

> Default: `'dist'`

__Source Input__

### `paths.source.base`

Application directory

> Default: `''`

### `paths.source.css`

Stylesheet directory

> Default: `'styles'`

### `paths.source.js`

JavaScript directory

> Default: `'scripts'`

### `paths.source.img`

Image directory

> Default: `'images'`

### `paths.source.font`

Font directory

> Default: `'fonts'`

__Target Output__

### `paths.target.base`

> Default: `''`

### `paths.target.css`

> Default: `'css'`

### `paths.target.js`

> Default: `'js'`

### `paths.target.img`

> Default: `'img'`

### `paths.target.font`

> Default: `'font'`

## HTML

```
Before:
<link rel="stylesheet" href="css/main.css">
...
<script src="http(s)://cdn.com/path/to/js/lib.js"></script>
<script src="js/main.js"></script>

After:
<link rel="stylesheet" href="/css/main.css">
...
<script src="http(s)://cdn.com/path/to/js/lib.js"></script>
<script src="/js/main.js"></script>
```

### `html.regex`

> Default: `{
  css: 'css',
  js: 'js',
  img: 'images'
}`

### `html.replacement`

> Default: `{
  prefix: '"',
  begin: '/',
  end: '/'
}`

### `html.options`

> Default: `{
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true
}`

## Style

```js
styles: {
  ext: 'css',
  autoprefixer: ['> 1%', 'last 2 versions', 'Firefox ESR']
},
...
```

### `styles.ext`

Supported CSS extensions are [css](http://postcss.org/), [sass|scss](http://sass-lang.com/), [less](http://lesscss.org/)

> Default: `'css'`

### `styles.autoprefixer`

Parse CSS and add vendor prefixes to rules by [Can I Use](http://caniuse.com/)

> Default: `['last 1 version']`

- Autoprefixer uses [Browserslist](https://github.com/ai/browserslist#queries)

### `styles.postcss`

PostCSS [plugins](http://postcss.parts/)

> Default: `[]`

### `styles.options`

> Default: `{
  safe: true,
  autoprefixer: false,
  discardComments: {
    removeAll: true
  }
}`

## Script

```js
scripts: {
  entry: {
    // 'common': ['jquery'],
    'main': './app/scripts/main'
  },
  vendors: [], // e.g. 'common' = scripts.entry.common
  publicPath: '/js/',
  loaders: [], // e.g. { test: /\.vue$/, loader: 'vue' }
  extensions: [] // e.g. '.vue'
},
...
```

__Entry__

### `scripts.entry`

The entry point for the bundle.

> Default: `{
  'main': './app/scripts/main'
}`

__Output__

### `scripts.filename`

Specifies the name of each output file on disk. You must __not__ specify an absolute path here!

> Default: `'[name]'`

### `scripts.publicPath`

The `publicPath` specifies the public URL address of the output files when referenced in a browser.

> Default: `''`

### `scripts.chunkFilename`

The filename of non-entry chunks as relative path inside the `output.path` directory.

- `[id]` is replaced by the id of the chunk.
- `[name]` is replaced by the name of the chunk (or with the id when the chunk has no name).
- `[hash]` is replaced by the hash of the compilation.
- `[chunkhash]` is replaced by the hash of the chunk.

> Default: `''`

### `scripts.vendor`

All vendors in one (for SPA)

> Default: `false`

### `scripts.vendors`

Custom Vendor Modules

> Default: `[]`

__Module__

### `scripts.loaders`

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

> [List of loaders](https://webpack.js.org/loaders/)

__Resolve__

### `scripts.extensions`

An array of extensions that should be used to resolve modules.

> Default: `[]`

__BalmJS__ default extensions:

- `.js`
- [`.json`](http://www.json.org/)
- [`.jsx`](https://facebook.github.io/react/)
- [`.vue`](http://vuejs.org/)

### `scripts.alias`

Replace modules by other modules or paths.

> Default: `{}`

__Plugin__

### `scripts.plugins`

Add additional plugins to the compiler.

> Default: `[]`

__DevServer__

### `scripts.hot`

> Default: `true`

__Devtool__

### `scripts.sourceMap`

Source mapping

> Default: `false`

__Target__

### `scripts.target`

> Default: `'web'`

__Stats__

### `scripts.stats`

Capture timing information for each module.

> Default: `{
  colors: true,
  modules: false,
  children: false,
  chunks: false,
  chunkModules: false
}`

__Other Options__

### `scripts.extends`

Extend config for webpack

> Default: `{}`

### `scripts.eslint`

The pluggable linting utility for JavaScript and JSX

> Default: `false`

## Sprite

```js
sprites: {
  image: [], // e.g. ['img-icon-folder', 'img-button-folder']
  svg: [] // e.g. ['svg-logo-folder']
},
...
```

### `sprites.basePath`

Path to use in CSS referring to image location

> Default: `'../'`

### `sprites.padding`

Amount of pixels to include between images or svgs

> Default: `0`

### `sprites.image`

Image folder name

> Default: `[]`

### `sprites.mode`

Output modes: `css`, `view`, `defs`, `symbol`, `stack`

> Default: `'css'`

### `sprites.svg`

SVG folder name

> Default: `[]`

## Extra

### `extras.excludes`

> Default: `['css', 'js', 'json', 'md', 'lock']`

### `extras.includes`

> Default: `[]`

## Publish

__Zip__

```js
zip: 'archive.zip'
...
```

### `zip`

Zip filename

> Default: `'archive.zip'`

__Ftp__

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

### `ftp.host`

Required

> Default: `undefined`

### `ftp.port`

> Default: `22`

### `ftp.user`

> Default: `'anonymous'`

### `ftp.pass`

> Default: `null`

### `ftp.remotePath`

> Default: `'/'`

__Cache__

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

__Assets__

```js
cache: true, // required
scripts: {
  publicPath: '/mobile/js/' // according to `assets.subDir`
},
assets: {
  manifest: 'manifest.json',
  root: '/path/to/your_project',
  publicPath: 'public',
  subDir: 'mobile'
},
...
```

### `assets.manifest`

Set the filename of the file created

> Default: `'manifest.json'`

### `assets.root`

Remote project root simulation

> Default: `'assets'`

### `assets.publicPath`

The `public` directory contains the front controller and your assets (images, JavaScript, CSS, etc.)

> Default: `'public'`

### `assets.subDir`

Public subdirectory

> Default: `''`

### [Custom Task](custom-task.md)
