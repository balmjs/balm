import getDevConfig from './dev';
import getProdConfig from './prod';

function getDefaultConfig(scripts: any): any {
  return BalmJS.config.env.isProd
    ? getProdConfig(scripts)
    : getDevConfig(scripts);
}

export default getDefaultConfig;
