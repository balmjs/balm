---
"balm-core": patch
---

Prevent `AssetRevisioner` and `CacheTask` from corrupting Webpack bundles and numbered assets
- Skip renaming and reference rewriting for Webpack-owned JS bundles and extracted async CSS (`js/**/*`, `css/async/**/*`) in `CacheTask`
- Exclude `alreadyHashed` bundler assets and ambiguous basenames from basename replacement in `AssetRevisioner`
- Replace Phase 2 sequential string/suffix replacement with bounded single-pass regex replacement so numbered assets (e.g. `1.jpg` vs `13.<hash ending in 1>.jpg`) do not cascade double-hash
