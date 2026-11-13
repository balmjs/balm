---
"balm-core": patch
---

Support `extras` includes/excludes in `StaticTask`, replace all occurrences in `transformReplace`, and pass config to lifecycle hooks
- Add `extras.includes` and `extras.excludes` handling in `StaticTask` alongside `assets` patterns
- Replace all string pattern occurrences via `replaceAll` in `transformReplace`
- Pass resolved `BalmConfig` to `beforeTask` and `afterTask` callbacks
