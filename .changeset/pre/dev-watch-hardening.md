---
"balm-core": patch
---

Isolate CleanTask per build mode and harden the dev server, live reload, and FileWatcher pipeline
- Scope `CleanTask` to `config.dest.base` with a workspace-root safety guard so `balm -p` no longer deletes a running dev server's `.tmp/` directory
- Disable HTTP caching (`Cache-Control: no-store`, `etag: false`, `lastModified: false`) on dev server responses and self-heal if `.tmp/` is missing mid-session
- Add `serverId`/`buildVersion` WebSocket handshake, `visibilitychange` sync & exponential backoff reconnect, and flicker-free same-origin CSS hot swapping
- Expand `FileWatcher` to `public/`, custom HTML templates, and non-`node_modules` local aliases with `StaticTask` sync, event coalescing, temp-file filtering, and persistent `esbuild.context()` rebuilds
