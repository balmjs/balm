---
"balm-core": patch
---

Fix HTML5 history mode support in production builds and the dev server
- Emit auxiliary HTML files (such as `404.html`) from `templateDir` in `HtmlTask` even when `scripts.htmlPluginOptions.template` is set, excluding stale `index.html` and skipping entry script, analytics, and live-reload injection on `404.html` and auxiliary HTML templates
- Reorder `ServerTask` middlewares (`proxy` -> `historyOptions` -> static mounts) and evaluate the dot rule strictly against URL pathnames so SPA routes matching directory names (e.g. `/styles`) fall back to `index.html` cleanly
- Preserve `entry.context` as `pathFilter` for proxy configs and add object `historyOptions` support (`index`, `disableDotRule`, `htmlAcceptHeaders`, `rewrites`)
