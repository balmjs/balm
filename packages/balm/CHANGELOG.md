# balm

## 6.0.0-alpha.5

### Patch Changes

- Updated dependencies [308266b]
  - balm-core@6.0.0-alpha.5

## 6.0.0-alpha.4

### Patch Changes

- Updated dependencies [c35e767]
  - balm-core@6.0.0-alpha.4

## 6.0.0-alpha.3

### Patch Changes

- 1f31e81: Read CLI `--version` dynamically from `package.json` and configure npm package `"files"` and metadata for publishing
- 1f31e81: Improve Webpack 4.x compatibility, loader toolchain defaults, file watcher extensions, and CLI instance resolution
  - Add `scripts.defaultLoaders` controls and built-in Babel 7 / Webpack 5 loader dependencies (`@babel/core`, `babel-loader`, `css-loader`, `html-loader`, `mini-css-extract-plugin`, `postcss-loader`, `style-loader`)
  - Add 4.x compatibility script/html config defaults (`includeJsResource`, `excludeUrlResource`, `useEsModule`, `urlLoaderOptions`, `babelLoaderOptions`, `htmlLoaderOptions`, `postcssLoaderOptions`, `extractAllVendors`, `vendorName`, `extractCss`)
  - Restrict `deepMerge` recursion to plain objects via `isPlainObject`
  - Support watched directory deduplication and script rebuilds across extended file extensions in `FileWatcher`
  - Unwrap nested default exports via `unwrapBalmInstance` in `balm` core resolver
- Updated dependencies [1f31e81]
- Updated dependencies [1f31e81]
- Updated dependencies [1f31e81]
  - balm-core@6.0.0-alpha.3

## 6.0.0-alpha.2

### Patch Changes

- - **balm**:
    - Support `-c, --config <file>` CLI option for custom configuration file path
    - Support async configuration functions returning config objects
    - Support `beforeTask`, `afterTask`, and `api`/`recipes` hooks in config object
  - **balm-core**:
    - Export `resolveDefaultEntry` utility supporting `main/index` with `.js/.ts/.jsx/.tsx`
    - Add `html.analytics` option supporting Google Analytics and custom analytics script injection
    - Add `server.serveStatic` option for custom static routes and directory serving
    - Support fast-glob pattern matching in `ZipTask`
    - Refine `CacheTask` asset globs and protect `.webmanifest`, `sw.js`, `service-worker.js`, and `workbox-sw.js`
    - Support `basename` option in `RenameTask`
- Updated dependencies
  - balm-core@6.0.0-alpha.2

## 6.0.0-alpha.1

### Patch Changes

- - **balm**: Allow custom CLI options like `--docs`
  - **balm-core**:
    - Add built-in `StaticTask` for copying static assets, icons, fonts, media, and `public/` directory
    - Fix production path mappings in `HtmlTask` from source to target directories (`/styles/` -> `/css/`)
    - Fix hashed entry script resolution and injection in `HtmlTask`
    - Fix `AssetRevisioner` regex matching to avoid `.woff` vs `.woff2` extension replacement collision
    - Prevent double hashing of Webpack bundle chunks
    - Fix PWA task to extract and copy `workbox-sw.js`, replace version placeholders, and output `service-worker.js`
    - Optimize task execution order so mix recipes run before `cache` and `pwa`
    - Fix multi-glob base directory calculation in `Pipeline.src`
- Updated dependencies
  - balm-core@6.0.0-alpha.1
