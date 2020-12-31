import Module from 'module';
import path from 'path';
import { homedir } from 'os';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import loading from './loading';
import { LooseObject } from '@balm-core/index';

const _require = Module.prototype.require;
const SAVE_FILE = path.join(
  homedir(),
  process.env.BALM_CORE_CACHE || '.balm-core-cache.json'
);

function cacheBalmCore(): void {
  let nameCache: LooseObject;

  try {
    nameCache = existsSync(SAVE_FILE)
      ? JSON.parse(readFileSync(SAVE_FILE, 'utf-8'))
      : {};
  } catch (err) {
    nameCache = {};
  }

  let currentModuleCache;
  let pathToLoad;

  (Module as any).prototype.require = function cachePathsRequire(name: string) {
    currentModuleCache = nameCache[this.filename];

    if (!currentModuleCache) {
      currentModuleCache = {};
      nameCache[this.filename] = currentModuleCache;
    }

    if (
      currentModuleCache[name] &&
      // Some people hack Object.prototype to insert their own properties on
      // every dictionary (for example, the 'should' testing framework). Check
      // that the key represents a path.
      typeof currentModuleCache[name] === 'string' &&
      existsSync(currentModuleCache[name]) // the file must exist for a cache hit
    ) {
      pathToLoad = currentModuleCache[name];
    } else {
      pathToLoad = (Module as any)._resolveFilename(name, this);
      currentModuleCache[name] = pathToLoad;
    }

    if (BalmJS.loading) {
      loading.render();
    }

    return _require.call(this, pathToLoad);
  };

  // function printCache() {
  //   Object.keys(nameCache).forEach(function (fromFilename) {
  //     console.log(fromFilename);
  //     const moduleCache = nameCache[fromFilename];
  //     Object.keys(moduleCache).forEach(function (name) {
  //       console.log(' ', name, '->', moduleCache[name]);
  //     });
  //   });
  // }

  process.once('exit', function () {
    try {
      writeFileSync(SAVE_FILE, JSON.stringify(nameCache, null, 2), 'utf-8');
    } catch (err) {
      console.error(`BalmJS: Failed saving cache: ${err.toString()}`);
    }
  });
}

export default cacheBalmCore;
