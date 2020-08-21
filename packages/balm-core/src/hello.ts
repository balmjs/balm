import Module from 'module';
import loading from './utilities/loading';

global.BalmJS = {} as any;
BalmJS.loading = true;

const _require = Module.prototype.require;

(Module as any).prototype.require = function cachePathsRequire(name: string) {
  const pathToLoad = (Module as any)._resolveFilename(name, this);
  if (BalmJS.loading) {
    loading.render();
  }

  return _require.call(this, pathToLoad);
};
