import getDevConfig from './dev';
import getProdConfig from './prod';
import { Configuration, BalmScripts } from '@balm-core/index';

function getDefaultConfig(scripts: BalmScripts): Configuration {
  return BalmJS.config.env.isProd || scripts.minify || scripts.ie8
    ? getProdConfig(scripts)
    : getDevConfig(scripts);
}

export default getDefaultConfig;
