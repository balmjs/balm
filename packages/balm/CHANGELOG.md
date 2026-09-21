# balm

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
