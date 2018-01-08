# BalmJS Configuration Docs

## :ghost: The tiny webapp structure

```
project
├─┬ app
│ ├─┬ styles
│ │ └── main.css
│ ├─┬ scripts
│ │ └── main.js
│ └── index.html
├── .dotfile (.babelrc, .gitignore, etc...)
├── gulpfile.js
└── package.json
```

## :memo: HTML template (`/path/to/project/app/index.html`)

- [template](example/_index.html)
- [old template](example/_index-old.html)(`balm` version < 0.8.1)

## :key: `.babelrc` (`/path/to/project/.babelrc`)

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

## :rocket: `gulpfile.js` (`/path/to/project/gulpfile.js`)

- see [example](example/_gulpfile.js)

```js
var balm = require('balm');

balm.config = {
  // Your project config (see Full Options)
};

balm.go();
```

## :coffee: Full Options

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
    - [extras.excludes](#extrasexcludes)
    - [extras.includes](#extrasincludes)
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

Set project type. Defaults to `true`.

- `static: true` - for a static HTML project
- `static: false` - for a dynamic language project (e.g. PHP framework)

🌰 For example:

```js
static: true
```

## Root & Path

### `roots.source`

`string`

Source Code (Input directory). Defaults to `'src'`.

### `roots.target`

`string`

Production (Output directory). Defaults to `'dist'`.

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

(Input) Application directory. Defaults to `''`.

### `paths.source.css`

`string`

(Input) Stylesheet directory. Defaults to `'styles'`.

### `paths.source.js`

`string`

(Input) JavaScript directory. Defaults to `'scripts'`.

### `paths.source.img`

`string`

(Input) Image directory. Defaults to `'images'`.

### `paths.source.font`

`string`

(Input) Font directory. Defaults to `'fonts'`.

### `paths.source.media`

`string`

> New in 0.9.1

(Input) Media directory. Defaults to `'media'`.

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

(Output) Application directory. Defaults to `''`.

### `paths.target.css`

`string`

(Output) Stylesheet directory. Defaults to `'css'`.

### `paths.target.js`

`string`

(Output) JavaScript directory. Defaults to `'js'`.

### `paths.target.img`

`string`

(Output) Image directory. Defaults to `'img'`.

### `paths.target.font`

`string`

(Output) Font directory. Defaults to `'font'`.

### `paths.target.media`

`string`

> New in 0.9.1

(Output) Media directory. Defaults to `'media'`.

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

[HTMLMinifier options](https://github.com/kangax/html-minifier#options-quick-reference). Defaults to:

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

Supported CSS extensions: [css](http://postcss.org/), [scss](http://sass-lang.com/), [less](http://lesscss.org/). Defaults to `'css'`.

🌰 For example:

```js
styles: {
  ext: 'scss'
}
```

### `styles.autoprefixer`

`array`

Parse CSS and add vendor prefixes to rules by [Can I Use](http://caniuse.com/). Defaults to `['last 1 version']`.

> Autoprefixer uses [Browserslist](https://github.com/ai/browserslist#queries)

🌰 For example:

```js
styles: {
  autoprefixer: ['> 1%', 'last 2 versions', 'Firefox ESR']
}
```

### `styles.options`

`object`

CSS optimisations. Defaults to:

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

Ensure file's parent directory in the include path. Defaults to `[]`.

### <del>`styles.postcss`</del> (Deprecated in 0.13.0)

`object`

> New in 0.6.2

PostCSS options. Defaults to:

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

[PostCSS plugins](https://www.postcss.parts/). Defaults to `[]`.

__BalmJS__ default postcss plugins:

- [autoprefixer](https://github.com/postcss/autoprefixer)
- [postcss-cssnext](http://cssnext.io/)
- [postcss-import](https://github.com/postcss/postcss-import)

### `styles.postcssOptions`

`object`

> New in 0.13.0

[PostCSS options](https://github.com/postcss/postcss#options). Defaults to `{}`.

### `styles.postcssOptions`

`object`

> New in 0.13.0

[PostCSS loader options](https://github.com/postcss/postcss-loader#options). Defaults to:

```js
{
  exec: undefined,
  parser: undefined,
  syntax: undefined,
  stringifier: undefined,
  config: undefined,
  // plugins: [], // NOTE: Use `styles.postcssPlugins` to set.
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

Then, your HTML templates:

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

- Using the unique hash generated for every build:

```js
filename: '[name].[hash]'
```

- Using hashes based on each chunks' content:

```js
filename: '[chunkhash]'
```

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

The filename of non-entry chunks as relative path inside the `output.path` directory. Defaults to `'(auto)'`.

- `[id]` is replaced by the id of the chunk. (automatic setting for development)
- `[name]` is replaced by the name of the chunk (or with the id when the chunk has no name).
- `[hash]` is replaced by the hash of the compilation.
- `[chunkhash]` is replaced by the hash of the chunk. (automatic setting for production)

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

> [List of loaders](https://webpack.js.org/loaders/)

🌰 For example:

First, install some loader:

```sh
$ npm i -D vue-loader

# OR install with yarn
$ yarn add -D vue-loader
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

`array`

An array of extensions that should be used to resolve modules. Defaults to `[]`.

__BalmJS__ default extensions:

- `.js`
- [`.json`](http://www.json.org/)
- [`.jsx`](https://facebook.github.io/react/)
- [`.vue`](https://vuejs.org/)

🌰 For example:

```js
scripts: {
  extensions: ['.ts']
}
```

Before, usage:

```js
// main.js
import foo from 'foo.ts';
```

Now, you can:

```js
// main.js
import foo from 'foo';
```

### `scripts.alias`

`object`

Replace modules by other modules or paths. Defaults to `{}`.

🌰 For example:

```js
scripts: {
  alias: {
    'vue$': balm.config.production ? 'vue/dist/vue.min.js' : 'vue/dist/vue.esm.js'
  }
}
```

__Plugin__

### `scripts.plugins`

`array`

Add additional plugins to the compiler. Defaults to `[]`.

> [List of plugins](https://webpack.js.org/plugins/)

__DevServer__

### `scripts.hot`

`boolean`

Hot reload. Defaults to `true`.

__Devtool__

### `scripts.sourceMap`

`boolean`

Source mapping. Defaults to `false`.

### `scripts.target`

`string`

To target a specific environment. Defaults to `'web'`.

> [Target config](https://webpack.js.org/configuration/target/#string)

### `scripts.stats`

`object`

Capture timing information for each module. Defaults to:

```js
{
  colors: true,
  modules: false,
  children: false,
  chunks: false,
  chunkModules: false
}
```

> [Stats config](https://webpack.js.org/configuration/stats/)

__Other Advanced Options__

### `scripts.webpack`

`object`

> New in 0.8.4

Overwrite webpack config. Defaults to `{}`.

> [All configuration options](https://webpack.js.org/configuration/)

### `scripts.eslint`

`boolean`

The pluggable linting utility for JavaScript and JSX. Defaults to `false`.

### `scripts.options`

`object`

> New in 0.6.0

[UglifyJS options](http://lisperator.net/uglifyjs/). Defaults to:

```js
{
  compress: {
    warnings: false,
    comparisons: false,
    drop_console: true
  },
  output: {
    comments: false,
    ascii_only: true
  }
}
```

### `scripts.include`

`array`

> New in 0.9.1

Supply a [Rule.include](https://webpack.js.org/configuration/module/#rule-include) option in `babel-loader` for some vendor scripts from `node_modules`. Defaults to `[]`.

__Optimization__

### `scripts.vendorName`

`string`

AllInOne vendor filename or Custom Vendor folder name. Defaults to `'vendor'`.

### `scripts.extractAllVendors`

`boolean`

> Named `scripts.vendor` in version < 0.12.0

All vendors in one (for SPA). Defaults to `false`.

### `scripts.vendors`

`array`

Custom Vendor Modules. Defaults to `[]`. (automatic setting by `scripts.entry`)

### `scripts.cdn`

`string` `array` `object` `function` `regex`

> New in 0.9.0

The same to webpack [externals](https://webpack.js.org/configuration/externals/#externals). Defaults to `null`.

### `scripts.cssLoader`

`boolean`

> New in 0.12.0

Use BalmJS default rules or custom rules for `css-loader`. Defaults to `true`.

### `scripts.extractCss`

`object`

> New in 0.12.0

Extract css from some bundle. Defaults to:

```js
{
  enabled: false,
  use: 'css-loader',
  fallback: 'style-loader',
  publicPath: '',
  pluginOptions: {
    filename: 'css/vendor/[name].css'
  }
}
```

## Sprite

### `sprites.basePath`

`string`

Path to use in CSS referring to image location. Defaults to `'../'`.

### `sprites.padding`

`number`

Amount of pixels to include between images or svgs. Defaults to `1`.

### `sprites.image`

`array`

Image folder name. Defaults to `[]`.

### `sprites.mode`

Output modes: `css`, `view`, `defs`, `symbol`, `stack`. Defaults to `'css'`.

### `sprites.svg`

`array`

SVG folder name. Defaults to `[]`.

🌰 For example:

```js
sprites: {
  image: ['img-icon-folder', 'img-button-folder']
  svg: ['svg-logo-folder']
}
```

## Extra

### `extras.excludes`

`array`

Defaults to `[]`.

### `extras.includes`

`array`

Defaults to `[]`.

## Server

### `server.open`

`boolean`

Decide which URL to open automatically when server starts. Defaults to `true`.

### `server.https`

`boolean`

> New in 0.10.3

Enable https for localhost development. Note - this is not needed for proxy option as it will be inferred from your target url. Defaults to `undefined`.

### `server.host`

`string`

Override host detection if you know the correct IP to use. Defaults to `null`.

### `server.port`

`number`

Use a specific port. Defaults to `3000`.

### `server.proxy`

`string` `object` `boolean`

Proxy an EXISTING vhost. Browsersync will wrap your vhost with a proxy URL to view your site. Defaults to `undefined`.

### `server.serveStatic`

`array`

> New in 0.10.4

Add additional directories from which static files should be served. Should only be used in `proxy` or `snippet` mode. Defaults to `[]`.

🌰 For example:

```js
server: {
  proxy: 'your.project.com',
  serveStatic: [{
    route: '/public',
    dir: '/path/to/your_local_public'
  }]
}
```

### `server.proxyTable`

`object`

Define HTTP proxies to your custom API backend. Defaults to `{}`.

> Full list of `http-proxy-middleware` [configuration options](https://github.com/chimurai/http-proxy-middleware#options)

🌰 For example:

```js
server: {
  host: '192.168.1.1',
  port: 8080,
  proxyTable: { // proxy partial
    '/api': { // context
       target: 'http://your.project.dev', // target host
       changeOrigin: true // needed for virtual hosted sites
    }
  }
}
```

### `server.localOnly`

`boolean`

Support environments where dynamic hostnames are not required (ie: electron). Defaults to `false`.

### `server.historyApiFallback`

`boolean`

> New in 0.6.0

Using the HTML5 History API. Defaults to `false`.

### `server.options`

`object`

> New in 0.10.4

[Browsersync options](https://browsersync.io/docs/options). Defaults to `{}`.

## Publish

__Zip__

### `zip`

`string`

Production to zip. Defaults to `'archive.zip'`.

🌰 For example:

```js
zip: 'archive.zip'
```

__Ftp__

### `ftp.host`

`string`

Required. Defaults to `undefined`.

### `ftp.port`

`number`

Defaults to `22`.

### `ftp.user`

`string`

Defaults to `'anonymous'`.

### `ftp.pass`

`string`

Defaults to `null`.

### `ftp.remotePath`

`string`

Defaults to `'/'`.

🌰 For example:

```js
ftp: {
  host: '192.168.1.1',
  port: 22,
  user: 'root',
  pass: '123456',
  remotePath: '/path/to/webroot'
}
```

__Assets__

### `assets.publicUrlPlaceholder`

`string`

> New in 0.8.0

Just for HTML template. Defaults to `'%PUBLIC_URL%'`.

### `assets.publicUrl`

`string`

> New in 0.8.0

Defaults to `''`.

### `assets.root`

`string`

Remote project root simulation. Defaults to `'assets'`.

### `assets.publicPath`

`string`

The `public` directory contains the front controller and your assets (images, JavaScript, CSS, etc.). Defaults to `'public'`.

### `assets.subDir`

`string`

Public subdirectory. Defaults to `''`.

### `assets.options`

`object`

> New in 0.6.0

Defaults to:

```js
{
  fileNameManifest: 'rev-manifest.json',
  dontRenameFile: ['.html', '.php'],
  dontUpdateReference: ['.html', '.php']
}
```

### `assets.excludes`

`array`

> New in 0.6.0

Defaults to `[]`.

### `assets.includes`

`array`

> New in 0.6.1

Defaults to `[]`.

🌰 For example:

```js
cache: true, // required
assets: {
  publicUrl: '',
  root: '/path/to/your_remote_project',
  publicPath: 'public',
  subDir: 'mobile'
}
```

__Cache__

### `cache`

`boolean`

Versioning/Cache Busting switch. Defaults to `false`.

## Others

### `useDefault`

`boolean`

Use balm default task. Defaults to `true`.

### `beforeTask`

`function`

> New in 0.10.0

Do something before all tasks. Defaults to `() => {}`.

### `afterTask`

`function`

> New in 0.10.0

Do something after all tasks. Defaults to `() => {}`.

---

### [Custom Task API](api.md)
