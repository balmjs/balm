---
"balm": minor
"balm-core": minor
---

Add LAN host exposure, real network IP logging, and `--host` / `--port` CLI options for the dev server
- Support `server.host: true` (binds `0.0.0.0`), string hosts (`0.0.0.0` / `::` / custom IP), `false`, and `HOST` env fallback in `ServerTask`
- Print resolved `Local` and non-internal IPv4 `Network` URLs via `os.networkInterfaces()` instead of hardcoded `127.0.0.1`
- Add `--host [host]` (including `--no-host`) and `--port <port>` options to the `balm` CLI
