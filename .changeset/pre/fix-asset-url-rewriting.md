---
"balm-core": patch
---

Rewrite CSS and PWA manifest asset paths to target directories and ignore `.DS_Store` in pipelines
- Rewrite relative (`../<source>/`) and root-relative (`url(/<source>/)`) asset URLs to `paths.target` in `StyleTask` for production and backend builds
- Apply shared source-to-target asset path rewriting (`rewriteHtmlAssetPaths`) across HTML and PWA manifest files (`manifest.json`, `*.webmanifest`) in `StaticTask` and `HtmlTask`
- Ignore `**/.DS_Store` in `Pipeline.src` so macOS Finder metadata files are excluded from build output
