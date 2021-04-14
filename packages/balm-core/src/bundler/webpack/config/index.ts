import getDevConfig from './dev';
import getProdConfig from './prod';
import { Configuration, BalmScripts } from '@balm-core/index';

function getDefaultConfig(webpack: any, scripts: BalmScripts): Configuration {
  return BalmJS.config.env.isProd || scripts.minify || scripts.ie8
    ? getProdConfig(webpack, scripts)
    : getDevConfig(webpack, scripts);
}

export default getDefaultConfig;
