# balm-core

## 6.0.0-alpha.4

### Patch Changes

- c35e767: Rewrite CSS and PWA manifest asset paths to target directories and ignore `.DS_Store` in pipelines
  - Rewrite relative (`../<source>/`) and root-relative (`url(/<source>/)`) asset URLs to `paths.target` in `StyleTask` for production and backend builds
  - Apply shared source-to-target asset path rewriting (`rewriteHtmlAssetPaths`) across HTML and PWA manifest files (`manifest.json`, `*.webmanifest`) in `StaticTask` and `HtmlTask`
  - Ignore `**/.DS_Store` in `Pipeline.src` so macOS Finder metadata files are excluded from build output

## 6.0.0-alpha.3

### Patch Changes

- 1f31e81: Read CLI `--version` dynamically from `package.json` and configure npm package `"files"` and metadata for publishing
- 1f31e81: Support `extras` includes/excludes in `StaticTask`, replace all occurrences in `transformReplace`, and pass config to lifecycle hooks
  - Add `extras.includes` and `extras.excludes` handling in `StaticTask` alongside `assets` patterns
  - Replace all string pattern occurrences via `replaceAll` in `transformReplace`
  - Pass resolved `BalmConfig` to `beforeTask` and `afterTask` callbacks
- 1f31e81: Improve Webpack 4.x compatibility, loader toolchain defaults, file watcher extensions, and CLI instance resolution
  - Add `scripts.defaultLoaders` controls and built-in Babel 7 / Webpack 5 loader dependencies (`@babel/core`, `babel-loader`, `css-loader`, `html-loader`, `mini-css-extract-plugin`, `postcss-loader`, `style-loader`)
  - Add 4.x compatibility script/html config defaults (`includeJsResource`, `excludeUrlResource`, `useEsModule`, `urlLoaderOptions`, `babelLoaderOptions`, `htmlLoaderOptions`, `postcssLoaderOptions`, `extractAllVendors`, `vendorName`, `extractCss`)
  - Restrict `deepMerge` recursion to plain objects via `isPlainObject`
  - Support watched directory deduplication and script rebuilds across extended file extensions in `FileWatcher`
  - Unwrap nested default exports via `unwrapBalmInstance` in `balm` core resolver

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
