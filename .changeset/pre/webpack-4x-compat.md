---
"balm": patch
"balm-core": patch
---

Improve Webpack 4.x compatibility, loader toolchain defaults, file watcher extensions, and CLI instance resolution
- Add `scripts.defaultLoaders` controls and built-in Babel 7 / Webpack 5 loader dependencies (`@babel/core`, `babel-loader`, `css-loader`, `html-loader`, `mini-css-extract-plugin`, `postcss-loader`, `style-loader`)
- Add 4.x compatibility script/html config defaults (`includeJsResource`, `excludeUrlResource`, `useEsModule`, `urlLoaderOptions`, `babelLoaderOptions`, `htmlLoaderOptions`, `postcssLoaderOptions`, `extractAllVendors`, `vendorName`, `extractCss`)
- Restrict `deepMerge` recursion to plain objects via `isPlainObject`
- Support watched directory deduplication and script rebuilds across extended file extensions in `FileWatcher`
- Unwrap nested default exports via `unwrapBalmInstance` in `balm` core resolver
