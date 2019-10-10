# [BalmJS](https://balmjs.com/) CHANGELOG

## v2.0.0-beta / 2019-09-29

Coming Up...

### `balm.config` Breaking Change in `balm@next`

- config.<del>isProd</del>
- config.<del>isTest</del>
- config.<del>isDev</del>
- config.<del>inSSR</del>
- config.**env**

```js
balm.go(mix => {
  console.log(balm.config.env); // Output: { isProd, isTest, isDev, inSSR }
  console.log(mix.env); // Be equal to `balm.config.env`
});
```

---

- config.<del>debug</del> => config.**logs.level**
- config.**logs.formatOptions**

```js
balm.config = {
  logs: {
    level: 3, // [0, 4] the smaller, the detailed
    formatOptions: {}
  }
};
```

---

- config.<del>static</del> => config.**inFrontend**
- config.<del>cache</del> => config.**assets.cache**
- config.ftp.<del>watchFiles</del> => config.ftp.**files**
- config.<del>useDefault</del> => config.**useDefaults**

---

- config.styles.<del>ext</del> => config.styles.**extname**
- config.styles.**minified**
- config.styles.<del>includePaths</del> => config.styles.atImportPaths
- config.styles.<del>postcssOptions</del>
- config.<del>sprites</del>
  - .<del>basePath</del> => config.**styles.imageBasePath**
  - .<del>image</del> => config.**styles.sprites**
  - .<del>padding</del> => config.**styles.spritePadding**

---

- config.scripts.<del>include</del> => config.scripts.**includeJsResource**
- config.scripts.**disableDefaultLoaders**
- config.scripts.<del>webpack</del> => config.scripts.**webpackOptions**
- config.scripts.<del>extractAllVendors</del> => config.scripts.**splitAllVendors**
- config.scripts.<del>vendorName</del> => config.scripts.**vendorsName**
- config.scripts.<del>vendors</del>
- config.scripts.<del>cssLoader</del>

---

- config.server.<del>browser</del>
- config.server.<del>logLevel</del>
- config.server.<del>reloadDelay</del>
- config.server.<del>proxyContext</del>
- config.server.<del>proxyOptions</del>
- config.server.**watchFiles**

---

```js
balm.go(mix => {
  // `balm` APIs:
});
```

- `mix.env`
- `mix.sass(input, output, options)`
- `mix.less(input, output, options)`
- `mix.css(input, output)`
- `mix.js(input, output, webpackOptions)`
- `mix.jsmin(input, output, options)`
- `mix.copy(input, output, options)`
- `mix.remove(paths)`
- `mix.version(input, output, options)`
- `mix.serve(handler)`
- `mix.html()`
- `mix.sprite()`
- `mix.url(input, output)`
- `mix.generateSW(pwaOptions)`
- `mix.injectManifest(pwaOptions)`
- `mix.zip(input, output, filename)`
- `mix.ftp(localFiles, options)`
- `mix.publish(input, output, renameOptions)`
- `mix.modernizr()`

```ts
// For param `options`
interface HookOptions {
  sassOptions?: object; // sass
  lessOptions?: object; // less
  terserOptions?: object; // jsmin
  renameOptions?: string | Function | RenameOptions; // jsmin|copy
  assetsOptions?: object; // version
  ftpOptions?: object; // ftp
  gulpSrcOptions?: object; // all
}
```
