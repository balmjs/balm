# balm-core

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
