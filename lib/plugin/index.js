let basePlugins = require('./base');

let plugins = config.production ?
  basePlugins.concat(require('./production')) :
  basePlugins.concat(require('./development'));

let webpackPlugins = plugins.concat(config.scripts.plugins);

module.exports = webpackPlugins;
