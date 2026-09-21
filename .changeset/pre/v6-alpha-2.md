---
"balm": patch
"balm-core": patch
---

- **balm**:
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
