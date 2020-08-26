import { DOMAIN } from '../config/constants';
import { LooseObject } from '@balm-core/index';

const docsBaseURL = `${DOMAIN}/docs/config`;

function upgradeGuide(key: string, value: string, message: string) {
  return `${message} See ${docsBaseURL}/${key}.html#${key}-${value}`;
}

function upgradeRenamed(
  version: string,
  configCategory: string,
  from: string,
  to: string
) {
  if ((BalmJS.config as LooseObject)[configCategory][from]) {
    BalmJS.logger.warn(
      `balm@${version}+ config`,
      upgradeGuide(
        configCategory,
        to,
        `'${configCategory}.${from}' was renamed to '${configCategory}.${to}'.`
      )
    );
  }
}

function upgradeMigrated(
  version: string,
  configCategory: string,
  from: string,
  to: string
) {
  if ((BalmJS.config as LooseObject)[configCategory][from]) {
    BalmJS.logger.warn(
      `balm@${version}+ config`,
      upgradeGuide(
        configCategory,
        to,
        `'${configCategory}.${from}' was migrated to '${configCategory}.${to}'.`
      )
    );
  }
}

// Compatibility for upgrade balm
function checkConfig(): void {
  // For v2
  upgradeRenamed('2.5.0', 'scripts', 'disableDefaultLoaders', 'defaultLoaders');
  upgradeMigrated(
    '2.11.0',
    'styles',
    'postcssLoaderOptions',
    'postcssLoaderOptions'
  );
  upgradeRenamed('2.22.0', 'images', 'defaultPlugins', 'plugins');

  // For v3
  upgradeRenamed('3.0.0', 'styles', 'minified', 'minify');
}

export default checkConfig;
