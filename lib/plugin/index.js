import basePlugins from './base';

let plugins = config.production ?
  basePlugins.concat(require('./production').default) :
  basePlugins.concat(require('./development').default);

let webpackPlugins = plugins.concat(config.scripts.plugins);

export default webpackPlugins;
