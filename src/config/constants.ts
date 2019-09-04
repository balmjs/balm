const ASSETS_KEYS = ['css', 'js', 'img', 'font', 'media'];

const ASYNC_SCRIPTS = 'async';

const STATIC_ASSETS = 'assets';

const MANIFEST = 'manifest.json';

const INJECT_HASHNAME = '[contenthash:8]';

enum LogLevel {
  Trace = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5
}

export {
  ASSETS_KEYS,
  ASYNC_SCRIPTS,
  STATIC_ASSETS,
  MANIFEST,
  INJECT_HASHNAME,
  LogLevel
};
