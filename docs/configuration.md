# BalmJS Configuration Docs

:memo: __HTML template__ (`/path/to/project/index.html`)

- [template](example/_index.html)
- [old template](example/_index-old.html)(`balm` version < 0.8.1)

:key: __`.babelrc`__ (`/path/to/project/.babelrc`)

> enable [ES2015 features](https://babeljs.io/learn-es2015/) using [Babel](https://babeljs.io/)

In your project directory, create a file named `.babelrc` in your project root with these contents:

- For `balm` version >= 0.7.0

```json
{
  "presets": ["env"],
  "plugins": ["transform-runtime"]
}
```

- For `balm` version < 0.7.0

First, run this command in your project directory:

```sh
# for ES6 compilation ability
$ npm install --save-dev babel-preset-es2015

# for ES7 compilation ability
$ npm install --save-dev babel-preset-stage-0
```

Then, edit `.babelrc`:

```json
{
  "presets": ["es2015", "stage-0"]
}
```

:rocket: __`gulpfile.js`__ (`/path/to/project/gulpfile.js`)

- see [example](example/_gulpfile.js)

```js
var balm = require('balm');

balm.config = {
  // Your project config (see Full Options)
};

balm.go();
```

:coffee: __Full Options__

1. [__Project Type__](#project-type)
    - [static](#static)
2. [__Root & Path__](#root-path)
    - Source Input
        - [roots.source](#rootssource)
        - [paths.source.base](#pathssourcebase)
        - [paths.source.css](#pathssourcecss)
        - [paths.source.js](#pathssourcejs)
        - [paths.source.img](#pathssourceimg)
        - [paths.source.font](#pathssourcefont)
        - [paths.source.media](#pathssourcemedia)
    - Target Output
        - [roots.target](#rootstarget)
        - [paths.target.base](#pathstargetbase)
        - [paths.target.css](#pathstargetcss)
        - [paths.target.js](#pathstargetjs)
        - [paths.target.img](#pathstargetimg)
        - [paths.target.font](#pathstargetfont)
        - [paths.target.media](#pathstargetmedia)
3. [__HyperText Markup Language__](#html)
    - [html.options](#htmloptions)
4. [__Cascading Style Sheets__](#style)
    - [styles.ext](#stylesext)
    - [styles.autoprefixer](#stylesautoprefixer)
    - [styles.options](#stylesoptions)
    - [styles.includePaths](#stylesincludepaths)
    - [styles.postcssPlugins](#stylespostcssplugins)
    - [styles.postcssOptions](#stylespostcssoptions)
    - [styles.postcssLoaderOptions](#stylespostcssloaderoptions)
5. [__JavaScript__](#script)
    - Entry
        - [scripts.entry](#scriptsentry)
    - Output
        - [scripts.filename](#scriptsfilename)
        - [scripts.library](#scriptslibrary)
        - [scripts.libraryTarget](#scriptslibrarytarget)
        - [scripts.umdNamedDefine](#scriptsumdnameddefine)
        - [scripts.chunkFilename](#scriptschunkfilename)
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
    - Other Advanced Options
        - [scripts.webpack](#scriptswebpack)
        - [scripts.eslint](#scriptseslint)
        - [scripts.options](#scriptsoptions)
        - [scripts.include](#scriptsinclude)
    - Optimization
        - [scripts.vendorName](#scriptsvendorname)
        - [scripts.extractAllVendors](#scriptsextractallvendors)
        - [scripts.vendors](#scriptsvendors)
        - [scripts.cdn](#scriptscdn)
        - [scripts.cssLoader](#scriptscssloader)
        - [scripts.extractCss](#scriptsextractcss)
6. [__CSS Sprites__](#sprite)
    - [sprites.basePath](#spritesbasepath)
    - [sprites.padding](#spritespadding)
    - [sprites.image](#spritesimage)
    - [sprites.mode](#spritesmode)
    - [sprites.svg](#spritessvg)
7. [__Extra Files__](#extra)
    - [excludes](#extrasexcludes)
    - [includes](#extrasincludes)
8. [__Server__](#server)
    - [server.open](#serveropen)
    - [server.https](#serverhttps)
    - [server.host](#serverhost)
    - [server.port](#serverport)
    - [server.proxy](#serverproxy)
    - [server.serveStatic](#serverservestatic)
    - [server.proxyTable](#serverproxytable)
    - [server.localOnly](#serverlocalonly)
    - [server.historyApiFallback](#serverhistoryapifallback)
    - [server.options](#serveroptions)
9. [__Publish__](#publish)
    - Zip
        - [zip](#zip)
    - FTP
        - [ftp.host](#ftphost)
        - [ftp.port](#ftpport)
        - [ftp.user](#ftpuser)
        - [ftp.pass](#ftppass)
        - [ftp.remotePath](#ftpremotepath)
    - Assets
        - [assets.publicUrlPlaceholder](#assetspublicurlplaceholder)
        - [assets.publicUrl](#assetspublicurl)
        - [assets.root](#assetsroot)
        - [assets.publicPath](#assetspublicpath)
        - [assets.subDir](#assetssubdir)
        - [assets.options](#assetsoptions)
        - [assets.excludes](#assetsexcludes)
        - [assets.includes](#assetsincludes)
    - Cache
        - [cache](#cache)
10. [__Others__](#others)
    - [useDefault](#usedefault)
    - [beforeTask](#beforetask)
    - [afterTask](#aftertask)
11. [__Custom Task API__](api.md)

---

## Project Type

### `static`

`boolean`

Set project type, defaults to `true`.

- `static: true` - for a static HTML project
- `static: false` - for a dynamic language project (e.g. PHP framework)

🌰 For example:

```js
static: true
```

## Root & Path

### `roots.source`

`string`

Source Code (Input directory), defaults to `'src'`.

### `roots.target`

`string`

Production (Output directory), defaults to `'dist'`.

🌰 For example:

```js
roots: {
  source: 'app',
  target: 'dist'
}
```

__Source Input__

### `paths.source.base`

`string`

(Input) Application directory, defaults to `''`.

### `paths.source.css`

`string`

(Input) Stylesheet directory, defaults to `'styles'`.

### `paths.source.js`

`string`

(Input) JavaScript directory, defaults to `'scripts'`.

### `paths.source.img`

`string`

(Input) Image directory, defaults to `'images'`.

### `paths.source.font`

`string`

(Input) Font directory, defaults to `'fonts'`.

### `paths.source.media`

`string`

> New in 0.9.1

(Input) Media directory, defaults to `'media'`.

🌰 For example:

```js
paths: {
  source: {
    css: 'styles',
    js: 'scripts',
    img: 'images',
    font: 'fonts'
  }
}
```

__Target Output__

### `paths.target.base`

`string`

(Output) Application directory, defaults to `''`.

### `paths.target.css`

`string`

(Output) Stylesheet directory, defaults to `'css'`.

### `paths.target.js`

`string`

(Output) JavaScript directory, defaults to `'js'`.

### `paths.target.img`

`string`

(Output) Image directory, defaults to `'img'`.

### `paths.target.font`

`string`

(Output) Font directory, defaults to `'font'`.

### `paths.target.media`

`string`

> New in 0.9.1

(Output) Media directory, defaults to `'media'`.

🌰 For example:

```js
paths: {
  target: {
    css: 'css',
    js: 'js',
    img: 'img',
    font: 'font'
  }
}
```

## HTML

### <del>`html.regex`</del> (Deprecated in 0.8.1)

`object`

Defaults to `{ css: 'styles', js: 'scripts', img: 'images' }`.

### <del>`html.replacement`</del> (Deprecated in 0.8.0)

`object`

Defaults to `{ prefix: '"', begin: '/', end: '/' }`.

### `html.options`

`object`

[HTMLMinifier options](https://github.com/kangax/html-minifier#options-quick-reference), Defaults to:

```js
{
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: {
    compress: {
      drop_console: true
    }
  },
  processConditionalComments: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true
}
```

🌰 For example:

```js
html: {
  options: {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: {
      compress: {
        drop_console: false
      }
    }
  }
}
```

## Style

### `styles.ext`

`string`

Supported CSS extensions: [css](http://postcss.org/), [scss](http://sass-lang.com/), [less](http://lesscss.org/); defaults to `'css'`.

🌰 For example:

```js
styles: {
  ext: 'scss'
}
```

### `styles.autoprefixer`

`array`

Parse CSS and add vendor prefixes to rules by [Can I Use](http://caniuse.com/), defaults to `['last 1 version']`.

> Autoprefixer uses [Browserslist](https://github.com/ai/browserslist#queries)

🌰 For example:

```js
styles: {
  autoprefixer: ['> 1%', 'last 2 versions', 'Firefox ESR']
}
```

### `styles.options`

`object`

CSS optimisations, defaults to:

```js
{
  safe: true,
  autoprefixer: false,
  sourcemap: false,
  discardComments: {
    removeAll: true
  }
}
```

🌰 For example:

```js
styles: {
  options: {
    safe: true,
    autoprefixer: false
  }
}
```

### `styles.includePaths`

`array`

> New in 0.6.0

Ensure file's parent directory in the include path, defaults to `[]`.

### <del>`styles.postcss`</del> (Deprecated in 0.13.0)

`object`

> New in 0.6.2

PostCSS options, defaults to:

```js
{
  plugins: [],
  options: {},
  loaderOptions: {
    exec: undefined,
    parser: undefined,
    syntax: undefined,
    stringifier: undefined,
    config: undefined,
    sourceMap: false
  }
}
```

### `styles.postcssPlugins`

`array`

> New in 0.13.0

[PostCSS plugins](https://www.postcss.parts/), defaults to `[]`.

__BalmJS__ default postcss plugins:

- [autoprefixer](https://github.com/postcss/autoprefixer)
- [postcss-cssnext](http://cssnext.io/)
- [postcss-import](https://github.com/postcss/postcss-import)

### `styles.postcssOptions`

`object`

> New in 0.13.0

[PostCSS options](https://github.com/postcss/postcss#options), defaults to `{}`.

### `styles.postcssOptions`

`object`

> New in 0.13.0

[PostCSS loader options](https://github.com/postcss/postcss-loader#options), defaults to:

```js
{
  exec: undefined,
  parser: undefined,
  syntax: undefined,
  stringifier: undefined,
  config: undefined,
  // plugins: [], // NOTE Use `styles.postcssPlugins` to set.
  sourceMap: false
}
```

## Script

__Entry__

### `scripts.entry`

`object`

The entry point for the bundle. Defaults to `null`.

1. `key(string): value(string)`: Creates a separate file (known as a chunk), consisting of common modules shared between multiple entry points.
2. `key(string): value(array)`: Bundle one entry point per HTML page.

🌰 For example:

```js
scripts: {
  entry: {
    'lib': ['vue', 'vue-router', 'vuex'],
    'ui': ['balm-ui-lite'],
    'home-page': './app/scripts/main.js',
    'sub-page': './app/scripts/subpage.js'
  }
}
```

Then, your templates:

```html
<!-- Page One -->
<script src="%PUBLIC_URL%/scripts/vendor/lib.js"></script>
<script src="%PUBLIC_URL%/scripts/vendor/ui.js"></script>
<script src="%PUBLIC_URL%/scripts/home-page.js"></script>
```

```html
<!-- Page Two -->
<script src="%PUBLIC_URL%/scripts/vendor/lib.js"></script>
<script src="%PUBLIC_URL%/scripts/vendor/ui.js"></script>
<script src="%PUBLIC_URL%/scripts/sub-page.js"></script>
```

__Output__

### `scripts.filename`

`string`

Specifies the name of each output file on disk. You must __not__ specify an absolute path here! Defaults to `'[name]'`.

### <del>`scripts.publicPath`</del> (Deprecated in 0.8.0, see [`assets.publicUrl`](#assetspublicurl))

`string`

The `publicPath` specifies the public URL address of the output files when referenced in a browser. Defaults to `''`.

### `scripts.library`

`string`

> New in 0.8.4

The name of the exported library. Defaults to `''`.

### `scripts.libraryTarget`

`string`

> New in 0.8.4

The type of the exported library. Defaults to `'var'`.

Supported options: `var`, `this`, `window`, `global`, `commonjs`, `commonjs2`, `amd`, `umd`.

### `scripts.umdNamedDefine`

`string`

> New in 0.9.0

When using `libraryTarget: 'umd'`, setting:

```js
umdNamedDefine: true
```

### `scripts.chunkFilename`

The filename of non-entry chunks as relative path inside the `output.path` directory.

- `[id]` is replaced by the id of the chunk.
- `[name]` is replaced by the name of the chunk (or with the id when the chunk has no name).
- `[hash]` is replaced by the hash of the compilation.
- `[chunkhash]` is replaced by the hash of the chunk.

> Default: `''`

🌰 For example:

```js

```

__Module__

### `scripts.loaders`

`array`

An array of automatically applied loaders. Defaults to `[]`.

Each item can have these properties:

- `test`: A condition that must be met
- `exclude`: A condition that must not be met
- `include`: A condition that must be met
- `loader`: A string of “!” separated loaders
- `loaders`: An array of loaders as string

__BalmJS__ default loaders:

- [`html`](https://github.com/webpack/html-loader)
- [`style`](https://github.com/webpack/style-loader)
- [`css`](https://github.com/webpack/css-loader)
- [`postcss`](https://github.com/postcss/postcss-loader)
- [`babel`](https://github.com/babel/babel-loader)
- [`url`](https://github.com/webpack/url-loader)
- [`file`](https://github.com/webpack/file-loader)

__[List of loaders](https://webpack.js.org/loaders/)__

🌰 For example:

First, install some loader:

```sh
$ yarn add -D vue-loader

# OR
$ npm i -D vue-loader
```

Then, use it:

```js
scripts: {
  loaders: [{
    test: /\.vue$/,
    loader: 'vue'
  }]
}
```

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

> [List of plugins](https://webpack.js.org/plugins/)

__DevServer__

### `scripts.hot`

Hot reload

> Default: `true`

__Devtool__

### `scripts.sourceMap`

Source mapping

> Default: `false`

### `scripts.target`

> Default: `'web'`

> [Target config](https://webpack.js.org/configuration/target/)

### `scripts.stats`

Capture timing information for each module.

> Default: `{
  colors: true,
  modules: false,
  children: false,
  chunks: false,
  chunkModules: false
}`

> [Stats config](https://webpack.js.org/configuration/stats/)

__Other Advanced Options__

### `scripts.webpack`

Overwrite webpack config
> New in 0.8.4

> Default: `{}`

> [All configuration options](https://webpack.js.org/configuration/)

### `scripts.eslint`

The pluggable linting utility for JavaScript and JSX

> Default: `false`

### `scripts.options`

> New in 0.6.0

> Default: `{
  compress: {
    warnings: false,
    comparisons: false,
    drop_console: true
  },
  output: {
    comments: false,
    ascii_only: true
  }
}`

### `scripts.include`

[Rule.include](https://webpack.js.org/configuration/module/#rule-include) in `babel-loader`

> New in 0.9.1

> Default: `[]`

__Optimization__

### `scripts.vendorName`

AllInOne vendor filename or Custom Vendor folder name

> Default: `'vendor'`

### `scripts.extractAllVendors`

> Named 'scripts.vendor' in version < 0.12.0

All vendors in one (for SPA)

> Default: `false`

### `scripts.vendors`

Custom Vendor Modules

> Default: `[]` (automatic setting by `scripts.entry`)

### `scripts.cdn`

The same to webpack.[externals](https://webpack.js.org/configuration/externals/#externals)
> New in 0.9.0

> Default: `null`

### `scripts.cssLoader`

Use BalmJS default rules or custom rules for css-loader
> New in 0.12.0

> Default: `true`

### `scripts.extractCss`

Extract css from some bundle
> New in 0.12.0

> Default: `{
  enabled: false,
  use: 'css-loader',
  fallback: 'style-loader',
  publicPath: '',
  pluginOptions: {
    filename: 'css/vendor/[name].css'
  }
}`

---

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

> Default: `1`

### `sprites.image`

Image folder name

> Default: `[]`

### `sprites.mode`

Output modes: `css`, `view`, `defs`, `symbol`, `stack`

> Default: `'css'`

### `sprites.svg`

SVG folder name

> Default: `[]`

---

## Extra

### `extras.excludes`

> Default: `[]`

### `extras.includes`

> Default: `[]`

---

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

### `server.https`

Enable https for localhost development. Note - this is not needed for proxy option as it will be inferred from your target url.
> New in 0.10.3

> Default: `undefined`

### `server.host`

> Default: `null`

### `server.port`

> Default: `3000`

### `server.proxy`

Proxy an EXISTING vhost. Browsersync will wrap your vhost with a proxy URL to view your site.

> Default: `undefined`

### `server.serveStatic`

Add additional directories from which static files should be served. Should only be used in `proxy` or `snippet` mode.
> New in 0.10.4

> Default: `[]`

### `server.proxyTable`

Define HTTP proxies to your custom API backend

> Default: `{}`

- full list of `http-proxy-middleware` [configuration options](https://github.com/chimurai/http-proxy-middleware#options)

### `server.localOnly`

Support environments where dynamic hostnames are not required (ie: electron)

> Default: `false`

### `server.historyApiFallback`

Using the HTML5 History API
> New in 0.6.0

> Default: `false`

### `server.options`

[Browsersync options](https://browsersync.io/docs/options)
> New in 0.10.4

> Default: `{}`

---

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

__Assets__

```js
cache: true, // required
assets: {
  publicUrl: '',
  root: '/path/to/your_project',
  publicPath: 'public',
  subDir: 'mobile'
},
...
```

### `assets.publicUrlPlaceholder`

> New in 0.8.0

> Default: `'%PUBLIC_URL%'`

### `assets.publicUrl`

> New in 0.8.0

> Default: `''`

### `assets.root`

Remote project root simulation

> Default: `'assets'`

### `assets.publicPath`

The `public` directory contains the front controller and your assets (images, JavaScript, CSS, etc.)

> Default: `'public'`

### `assets.subDir`

Public subdirectory

> Default: `''`

### `assets.options`

> New in 0.6.0

> Default: `{
  fileNameManifest: 'rev-manifest.json',
  dontRenameFile: ['.html', '.php'],
  dontUpdateReference: ['.html', '.php']
}`;

### `assets.excludes`

> New in 0.6.0

> Default: `[]`

### `assets.includes`

> New in 0.6.1

> Default: `[]`

__Cache__

### `cache`

Versioning/Cache Busting switch

> Default: `false`

---

## Others

### `useDefault`

Use balm default task

> Default: `true`

### `beforeTask`

> New in 0.10.0

> Default: `() => {}`

### `afterTask`

> New in 0.10.0

> Default: `() => {}`

---

### [Custom Task API](api.md)
