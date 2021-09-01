import getDevConfig from './dev.js';
import getProdConfig from './prod.js';
import { LooseObject, Configuration, BalmScripts } from '@balm-core/index';

function getDefaultConfig(
  webpack: LooseObject,
  scripts: BalmScripts
): Configuration {
  return BalmJS.config.env.isProd || scripts.minify || scripts.ie8
    ? getProdConfig(webpack, scripts)
    : getDevConfig(webpack, scripts);
}

export default getDefaultConfig;
