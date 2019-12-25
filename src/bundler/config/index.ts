import getDevConfig from './dev';
import getProdConfig from './prod';

function getDefaultConfig(scripts: any): any {
  return BalmJS.config.env.isProd || BalmJS.config.scripts.ie8
    ? getProdConfig(scripts)
    : getDevConfig(scripts);
}

export default getDefaultConfig;
